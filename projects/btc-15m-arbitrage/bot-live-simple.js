#!/usr/bin/env node

/**
 * SIMPLE LIVE BOT - Signal Test Only
 * 
 * Strategy: Detect Chainlink momentum → Buy → Hold to resolution → Claim
 * No TP, No SL, No early exits. Pure signal test.
 * 
 * Budget: $1 per trade, 4 assets (BTC, ETH, SOL, XRP)
 */

require('dotenv').config();
const WebSocket = require('ws');
const fetch = require('node-fetch');
const fs = require('fs');
const { ClobClient, Side, OrderType } = require('@polymarket/clob-client');
const { ethers } = require('ethers');

// For auto-claim via Builder Relay (proxy wallets)
let RelayClient, BuilderConfig, RelayerTxType;
try {
  const relayerModule = require('@polymarket/builder-relayer-client');
  const signingModule = require('@polymarket/builder-signing-sdk');
  RelayClient = relayerModule.RelayClient;
  RelayerTxType = relayerModule.RelayerTxType;
  BuilderConfig = signingModule.BuilderConfig;
  console.log('✓ RelayClient loaded successfully');
} catch (e) {
  console.log('Note: RelayClient not available:', e.message);
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const CONFIG = {
  assets: {
    BTC: { seriesId: '10192', chainlinkSymbol: 'btc/usd' },
    ETH: { seriesId: '10191', chainlinkSymbol: 'eth/usd' },
    SOL: { seriesId: '10423', chainlinkSymbol: 'sol/usd' },
    XRP: { seriesId: '10422', chainlinkSymbol: 'xrp/usd' },
  },
  
  trading: {
    // AGGRESSIVE: Use full balance divided by 4 assets
    // With $20, each asset gets ~$5 per cycle
    useFullBalance: true,     // Query and use actual balance
    numAssets: 4,             // Divide balance by this
    minPositionSize: 4.00,    // Minimum $4 per trade (ensures 5+ shares at $0.79 max price)
    moveThreshold: 0.0003,    // 0.03% to trigger signal
    minOddsEntry: 0.30,       // Don't enter below $0.30
    maxOddsEntry: 0.79,       // Don't enter above $0.79
    minTimeLeft: 60,          // Need at least 60s before market ends
    maxSlippagePct: 0.03,     // 3% slippage tolerance
    apiDelayMs: 1000,         // 1s between API calls
  },
  
  gammaApi: 'https://gamma-api.polymarket.com',
  dataApi: 'https://data-api.polymarket.com',
  clobHost: 'https://clob.polymarket.com',
  funder: process.env.POLYMARKET_FUNDER,
  
  // Contracts for auto-claim
  contracts: {
    CTF: '0x4D97DCd97eC945f40cF65F87097ACe5EA0476045',
    USDC_E: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  },
  
  claimDelayMs: 30000,  // Wait 30s after market ends before claiming
};

// ═══════════════════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════════════════

const state = {
  startTime: Date.now(),
  clobClient: null,
  connected: false,
  lastBalance: 0,
  
  assets: {},
  trades: [],
  
  stats: {
    signals: 0,
    trades: 0,
    wins: 0,
    losses: 0,
    pending: 0,
  },
};

// Initialize per-asset state
Object.keys(CONFIG.assets).forEach(symbol => {
  state.assets[symbol] = {
    currentMarket: null,
    baselinePrice: null,
    currentPrice: null,
    upPrice: null,
    downPrice: null,
    upTokenId: null,
    downTokenId: null,
    hasTradedThisMarket: false,  // Only 1 trade per market per asset
  };
});

const LOG_FILE = '/Users/ruby/.openclaw/workspace/projects/btc-15m-arbitrage/bot-simple.log';
const JOURNAL_FILE = '/Users/ruby/.openclaw/workspace/projects/btc-15m-arbitrage/trades-simple.json';

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

function log(message, type = 'info', symbol = null) {
  const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const prefix = symbol ? `[${symbol}]` : '';
  const icons = { signal: '🎯', entry: '📈', win: '💰', loss: '📉', error: '❌', info: 'ℹ️', market: '📊', claim: '🏦' };
  const line = `[${time}] ${icons[type] || '•'} ${prefix} ${message}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let lastApiCall = 0;
async function rateLimitedCall(fn) {
  const now = Date.now();
  if (now - lastApiCall < CONFIG.trading.apiDelayMs) {
    await sleep(CONFIG.trading.apiDelayMs - (now - lastApiCall));
  }
  lastApiCall = Date.now();
  return fn();
}

function saveJournal() {
  fs.writeFileSync(JOURNAL_FILE, JSON.stringify({ stats: state.stats, trades: state.trades, lastBalance: state.lastBalance }, null, 2));
}

// Balance cache to avoid RPC rate limits
let balanceCache = { value: 0, timestamp: 0 };
const BALANCE_CACHE_TTL = 30000;  // 30 second cache

// Get free USDC balance with caching
async function getFreeBalance(forceRefresh = false) {
  // Return cached value if fresh enough
  const now = Date.now();
  if (!forceRefresh && balanceCache.value > 0 && (now - balanceCache.timestamp) < BALANCE_CACHE_TTL) {
    return balanceCache.value;
  }
  
  try {
    // Try CLOB balance first (most accurate for trading)
    if (state.clobClient) {
      const balanceData = await state.clobClient.getBalanceAllowance({ asset_type: 'USDC' });
      const balance = parseFloat(balanceData?.balance || '0') / 1e6;
      if (balance > 0) {
        log(`CLOB Balance: $${balance.toFixed(2)}`, 'info');
        balanceCache = { value: balance, timestamp: now };
        state.lastBalance = balance;
        return balance;
      }
    }
    
    // Fallback: query on-chain USDC.e balance
    const provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com');
    const usdc = new ethers.Contract(
      CONFIG.contracts.USDC_E,
      ['function balanceOf(address) view returns (uint256)'],
      provider
    );
    const rawBalance = await usdc.balanceOf(CONFIG.funder);
    const balance = parseFloat(ethers.utils.formatUnits(rawBalance, 6));
    log(`On-chain USDC.e: $${balance.toFixed(2)}`, 'info');
    balanceCache = { value: balance, timestamp: now };
    state.lastBalance = balance;
    return balance;
  } catch (err) {
    // On error, use cached value if available
    if (balanceCache.value > 0) {
      return balanceCache.value;
    }
    log(`Balance check failed: ${err.message}`, 'error');
    return state.lastBalance || 0;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLOB CLIENT
// ═══════════════════════════════════════════════════════════════════════════════

async function initClobClient() {
  log('Initializing CLOB client...');
  
  wallet = new ethers.Wallet(process.env.POLYMARKET_PK);  // Store globally for relay client
  log(`Wallet: ${wallet.address}`);
  log(`Funder: ${CONFIG.funder}`);
  
  const tempClient = new ClobClient(CONFIG.clobHost, 137, wallet);
  let apiCreds;
  try {
    apiCreds = await tempClient.createOrDeriveApiKey();
  } catch (e) {
    apiCreds = await tempClient.deriveApiKey();
  }
  
  state.clobClient = new ClobClient(
    CONFIG.clobHost, 137, wallet, apiCreds,
    parseInt(process.env.POLYMARKET_SIGNATURE_TYPE),
    CONFIG.funder
  );
  
  log('CLOB client ready ✓');
}

// ═══════════════════════════════════════════════════════════════════════════════
// MARKET DATA
// ═══════════════════════════════════════════════════════════════════════════════

async function fetchMarkets() {
  for (const symbol of Object.keys(CONFIG.assets)) {
    try {
      const config = CONFIG.assets[symbol];
      const resp = await fetch(`${CONFIG.gammaApi}/series/${config.seriesId}`);
      const series = await resp.json();
      
      const now = new Date();
      const active = series.events
        ?.filter(e => !e.closed && new Date(e.endDate) > now)
        .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))[0];
      
      if (!active) continue;
      
      const eventResp = await fetch(`${CONFIG.gammaApi}/events/${active.id}`);
      const eventData = await eventResp.json();
      const market = eventData.markets?.[0];
      if (!market) continue;
      
      const prices = JSON.parse(market.outcomePrices || '[0.5,0.5]');
      const tokens = JSON.parse(market.clobTokenIds || '[]');
      
      const asset = state.assets[symbol];
      const isNewMarket = !asset.currentMarket || asset.currentMarket.id !== active.id;
      
      if (isNewMarket) {
        asset.currentMarket = {
          id: active.id,
          title: active.title,
          endDate: new Date(active.endDate),
        };
        asset.baselinePrice = null;  // Reset baseline for new market
        asset.hasTradedThisMarket = false;
        log(`New market: ${active.title}`, 'market', symbol);
      }
      
      asset.upPrice = parseFloat(prices[0]);
      asset.downPrice = parseFloat(prices[1]);
      asset.upTokenId = tokens[0];
      asset.downTokenId = tokens[1];
      
    } catch (e) {
      log(`Market fetch error: ${e.message}`, 'error', symbol);
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// WEBSOCKET FOR CHAINLINK PRICES
// ═══════════════════════════════════════════════════════════════════════════════

let ws = null;
let pingInterval = null;
let lastPong = 0;

function initWebSocket() {
  log('Connecting to Chainlink WebSocket...');
  
  if (pingInterval) clearInterval(pingInterval);
  if (ws) {
    try { ws.close(); } catch (e) {}
  }
  
  ws = new WebSocket('wss://ws-live-data.polymarket.com/');
  
  ws.on('open', () => {
    log('WebSocket connected ✓');
    state.connected = true;
    lastPong = Date.now();
    
    ws.send(JSON.stringify({
      action: 'subscribe',
      subscriptions: [{ topic: 'crypto_prices_chainlink', type: '*' }]
    }));
    
    pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send('ping');
        // Check for stale connection (30s timeout, not 15s)
        if (lastPong > 0 && Date.now() - lastPong > 30000) {
          log('Connection stale, reconnecting...', 'error');
          ws.close();
        }
      }
    }, 5000);
  });
  
  ws.on('message', (data) => {
    const str = data.toString();
    if (str === 'pong') {
      lastPong = Date.now();
      return;
    }
    
    try {
      const msg = JSON.parse(str);
      if (msg.topic === 'crypto_prices_chainlink' && msg.payload) {
        handlePriceUpdate(msg.payload);
      }
    } catch (e) {}
  });
  
  ws.on('error', (e) => log(`WebSocket error: ${e.message}`, 'error'));
  ws.on('close', () => {
    log('WebSocket closed, reconnecting in 5s...', 'error');
    state.connected = false;
    setTimeout(initWebSocket, 5000);
  });
}

function symbolToAsset(symbol) {
  const map = { 'btc/usd': 'BTC', 'eth/usd': 'ETH', 'sol/usd': 'SOL', 'xrp/usd': 'XRP' };
  return map[symbol?.toLowerCase()];
}

function handlePriceUpdate(payload) {
  const assetSymbol = symbolToAsset(payload.symbol);
  if (!assetSymbol) return;
  
  const asset = state.assets[assetSymbol];
  const price = parseFloat(payload.value);
  if (isNaN(price) || price <= 0) return;
  
  asset.currentPrice = price;
  
  // Set baseline when market starts
  if (asset.currentMarket && !asset.baselinePrice) {
    asset.baselinePrice = price;
    log(`Baseline: $${price.toFixed(price > 100 ? 2 : 4)}`, 'info', assetSymbol);
  }
  
  // Check for signal
  checkSignal(assetSymbol);
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRADING LOGIC - SIMPLE: Signal → Buy → Hold to Resolution
// ═══════════════════════════════════════════════════════════════════════════════

async function checkSignal(symbol) {
  const asset = state.assets[symbol];
  
  // Basic checks
  if (!asset.currentMarket || !asset.baselinePrice || !asset.currentPrice) return;
  if (!asset.upTokenId || !asset.downTokenId) return;
  if (asset.hasTradedThisMarket) return;  // Only 1 trade per market
  
  // Time check
  const timeLeft = (asset.currentMarket.endDate - Date.now()) / 1000;
  if (timeLeft < CONFIG.trading.minTimeLeft) return;
  
  // Calculate move from baseline
  const move = (asset.currentPrice - asset.baselinePrice) / asset.baselinePrice;
  if (Math.abs(move) < CONFIG.trading.moveThreshold) return;
  
  const direction = move > 0 ? 'UP' : 'DOWN';
  const entryPrice = direction === 'UP' ? asset.upPrice : asset.downPrice;
  
  // Entry price range check
  if (entryPrice < CONFIG.trading.minOddsEntry || entryPrice > CONFIG.trading.maxOddsEntry) return;
  
  // SIGNAL! Execute trade
  state.stats.signals++;
  log(`SIGNAL: ${direction} | Move: ${(move * 100).toFixed(3)}% | Entry: $${entryPrice.toFixed(3)} | ${timeLeft.toFixed(0)}s left`, 'signal', symbol);
  
  asset.hasTradedThisMarket = true;  // Prevent duplicate trades
  
  await executeTrade(symbol, direction, entryPrice);
}

async function executeTrade(symbol, direction, quotedPrice) {
  const asset = state.assets[symbol];
  const tokenId = direction === 'UP' ? asset.upTokenId : asset.downTokenId;
  
  // Get current balance and calculate position size
  const balance = await getFreeBalance();
  
  // Use balance / 4 (one slot per asset)
  // This way with $40, each asset can bet up to $10
  let positionSize = balance / CONFIG.trading.numAssets;
  
  // Apply minimum
  if (positionSize < CONFIG.trading.minPositionSize) {
    log(`Insufficient balance: $${balance.toFixed(2)} / ${CONFIG.trading.numAssets} = $${positionSize.toFixed(2)} < min $${CONFIG.trading.minPositionSize}`, 'error', symbol);
    asset.hasTradedThisMarket = false;  // Allow retry when balance available
    return;
  }
  
  log(`Balance: $${balance.toFixed(2)} → Position: $${positionSize.toFixed(2)}`, 'info', symbol);
  
  // Calculate limit price with slippage
  const limitPrice = Math.min(quotedPrice * (1 + CONFIG.trading.maxSlippagePct), CONFIG.trading.maxOddsEntry);
  const shares = positionSize / limitPrice;
  
  try {
    log(`Buying ${direction} @ limit $${limitPrice.toFixed(3)} (~${shares.toFixed(1)} shares, $${positionSize.toFixed(2)})`, 'entry', symbol);
    
    const order = await rateLimitedCall(() => state.clobClient.createOrder({
      tokenID: tokenId,
      price: Math.round(limitPrice * 1000) / 1000,
      size: Math.floor(shares * 100) / 100,
      side: Side.BUY,
    }));
    
    const result = await rateLimitedCall(() => state.clobClient.postOrder(order, OrderType.GTC));
    
    if (result && result.orderID) {
      log(`✅ Order placed: ${result.orderID}`, 'entry', symbol);
      
      state.stats.trades++;
      state.stats.pending++;
      
      state.trades.push({
        id: result.orderID,
        timestamp: new Date().toISOString(),
        symbol,
        direction,
        market: asset.currentMarket.title,
        marketEndDate: asset.currentMarket.endDate.toISOString(),
        limitPrice,
        positionSize,
        expectedShares: shares,
        status: 'pending',
      });
      
      saveJournal();
    } else if (result && result.error) {
      log(`Order rejected: ${result.error}`, 'error', symbol);
      // Don't retry on balance errors - wait for next market
      if (!result.error.includes('balance')) {
        asset.hasTradedThisMarket = false;
      }
    } else {
      log(`Order failed (no response)`, 'error', symbol);
    }
  } catch (e) {
    const errMsg = e.message || String(e);
    log(`Trade error: ${errMsg}`, 'error', symbol);
    // Don't retry on balance errors
    if (!errMsg.includes('balance')) {
      asset.hasTradedThisMarket = false;
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTO-CLAIM
// ═══════════════════════════════════════════════════════════════════════════════

let relayClientInstance = null;
let wallet = null;

async function getRelayClient() {
  if (relayClientInstance) return relayClientInstance;
  if (!RelayClient || !BuilderConfig) {
    log('RelayClient or BuilderConfig not loaded', 'error');
    return null;
  }
  
  try {
    // Wallet needs provider for relay client to work
    const provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com');
    const walletWithProvider = new ethers.Wallet(process.env.POLYMARKET_PK, provider);
    
    const builderConfig = new BuilderConfig({
      localBuilderCreds: {
        key: process.env.POLY_BUILDER_API_KEY,
        secret: process.env.POLY_BUILDER_SECRET,
        passphrase: process.env.POLY_BUILDER_PASSPHRASE,
      },
    });
    
    if (!builderConfig.isValid()) {
      log('Builder credentials invalid', 'error');
      return null;
    }
    
    // Use SAFE type since funder is a Gnosis Safe wallet (signature_type=2)
    relayClientInstance = new RelayClient(
      'https://relayer-v2.polymarket.com/',
      137,
      walletWithProvider,
      builderConfig,
      RelayerTxType.SAFE
    );
    log('RelayClient initialized (SAFE mode) ✓', 'info');
    return relayClientInstance;
  } catch (err) {
    log(`Builder client init error: ${err.message}`, 'error');
    return null;
  }
}

async function autoClaim() {
  try {
    log(`Checking for claimable positions...`, 'info');
    const resp = await fetch(`${CONFIG.dataApi}/positions?user=${CONFIG.funder}`);
    const positions = await resp.json();
    
    // Find winning positions that are redeemable
    const claimable = positions.filter(p => {
      const size = parseFloat(p.size) || 0;
      const curPrice = parseFloat(p.curPrice) || 0;
      const isWinner = curPrice >= 0.99;
      return p.redeemable === true && size > 0 && isWinner;
    });
    
    if (claimable.length === 0) {
      log(`No winning positions to claim`, 'info');
      return;
    }
    
    log(`🏦 Found ${claimable.length} claimable winning position(s)!`, 'claim');
    
    for (const pos of claimable) {
      const value = parseFloat(pos.size) || 0;
      log(`Claiming: ${pos.title?.substring(0, 40)}... | ~$${value.toFixed(2)}`, 'claim');
      await redeemPosition(pos);
      await sleep(2000); // Wait between claims
    }
  } catch (err) {
    log(`Auto-claim error: ${err.message}`, 'error');
  }
}

async function redeemPosition(position) {
  try {
    const conditionId = position.conditionId;
    if (!conditionId) return;
    
    const relayClient = await getRelayClient();
    if (!relayClient) {
      log(`Relay client not available - claim manually`, 'error');
      return;
    }
    
    const ctfInterface = new ethers.utils.Interface([
      "function redeemPositions(address collateralToken, bytes32 parentCollectionId, bytes32 conditionId, uint256[] indexSets)"
    ]);
    
    const data = ctfInterface.encodeFunctionData("redeemPositions", [
      CONFIG.contracts.USDC_E,
      ethers.constants.HashZero,
      conditionId,
      [1, 2]
    ]);
    
    const redeemTx = { to: CONFIG.contracts.CTF, data, value: "0" };
    
    log(`Redeeming via Builder Relay...`, 'claim');
    const response = await relayClient.execute([redeemTx], "Redeem winnings");
    const result = await response.wait();
    
    if (result?.transactionHash) {
      const value = parseFloat(position.size) || 0;
      state.stats.wins++;
      state.stats.pending = Math.max(0, state.stats.pending - 1);
      log(`✅ Claimed ~$${value.toFixed(2)} | Tx: ${result.transactionHash.substring(0, 20)}...`, 'claim');
      
      // Refresh balance after successful claim (with small delay for chain confirmation)
      setTimeout(async () => {
        await getFreeBalance(true);  // Force refresh
      }, 5000);
    }
  } catch (err) {
    const errMsg = err.message || String(err);
    if (!errMsg.includes('already redeemed')) {
      log(`Redeem error: ${errMsg}`, 'error');
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATUS
// ═══════════════════════════════════════════════════════════════════════════════

function printStatus() {
  const runtime = Math.floor((Date.now() - state.startTime) / 60000);
  console.log('\n' + '═'.repeat(50));
  console.log(`📊 SIMPLE BOT | Runtime: ${runtime}m | WS: ${state.connected ? '🟢' : '🔴'}`);
  console.log(`Signals: ${state.stats.signals} | Trades: ${state.stats.trades} | Pending: ${state.stats.pending}`);
  console.log(`Wins: ${state.stats.wins} | Losses: ${state.stats.losses}`);
  console.log('═'.repeat(50) + '\n');
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
  console.log('\n' + '═'.repeat(50));
  console.log('🧪 SIMPLE SIGNAL TEST BOT');
  console.log('Strategy: Signal → Buy → Hold to Resolution');
  console.log(`Budget: $${CONFIG.trading.positionSize}/trade | Entry: $${CONFIG.trading.minOddsEntry}-$${CONFIG.trading.maxOddsEntry}`);
  console.log('═'.repeat(50) + '\n');
  
  // Clear log
  fs.writeFileSync(LOG_FILE, '');
  
  await initClobClient();
  
  // Initialize relay client for auto-claims (using SAFE mode for Gnosis Safe wallet)
  const relayClient = await getRelayClient();
  if (relayClient) {
    log('Auto-claim ready (SAFE mode) ✓', 'info');
  } else {
    log('⚠️  Auto-claim unavailable - check builder credentials', 'error');
  }
  
  // Get initial balance
  const balance = await getFreeBalance();
  log(`Starting balance: $${balance.toFixed(2)}`, 'info');
  
  await fetchMarkets();
  initWebSocket();
  
  // Refresh markets every 15s
  setInterval(fetchMarkets, 15000);
  
  // Auto-claim check every 60s (using SAFE relay)
  setInterval(autoClaim, 60000);
  // Initial claim check after 10s
  setTimeout(autoClaim, 10000);
  
  // Status every 5 min
  setInterval(printStatus, 300000);
  setTimeout(printStatus, 30000);
  
  log('🟢 Bot running - waiting for signals...');
  log('📌 Auto-claim enabled (SAFE mode, checks every 60s)');
}

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
