#!/usr/bin/env node

/**
 * LIVE TRADING BOT V3 - ROBUST MARKET ORDERS + TP
 * 
 * Improvements over V2:
 * 1. Wait for settlement after market order (5s delay)
 * 2. Query actual position size from API before placing TP
 * 3. Retry logic for TP order placement
 * 4. Better error handling and validation
 * 5. Position verification before TP
 */

require('dotenv').config();
const WebSocket = require('ws');
const fetch = require('node-fetch');
const fs = require('fs');
const { ClobClient, Side, OrderType } = require('@polymarket/clob-client');
const { ethers } = require('ethers');

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const CONFIG = {
  mode: 'live',
  runtime: 8 * 60 * 60 * 1000,
  
  assets: {
    BTC: { seriesId: '10192', chainlinkSymbol: 'btc/usd' },
    ETH: { seriesId: '10191', chainlinkSymbol: 'eth/usd' },
    SOL: { seriesId: '10423', chainlinkSymbol: 'sol/usd' },
    XRP: { seriesId: '10422', chainlinkSymbol: 'xrp/usd' },
  },
  
  trading: {
    moveThreshold: 0.0003,    // 0.03% price move to trigger
    maxOddsEntry: 0.55,       // Don't enter if odds > 55%
    minTimeLeft: 45,          // Min 45s before market ends (increased for safety)
    cooldownMs: 20000,        // 20s between trades per asset
    
    positionSize: 5.00,       // $5 per trade (MUST be $5+ to get 5+ shares for min sell order)
    maxPositions: 1,          // Max 1 concurrent position
    
    takerFeePct: 0.03,        // 3% taker fee
    grossTPPct: 0.0815,       // 8.15% gross = 5% net after fee
    stopLossPct: 0.15,        // 15% stop loss (widened)
    
    // Settlement & retry
    settlementDelayMs: 5000,  // Wait 5s after market order for settlement
    tpRetryAttempts: 3,       // Retry TP placement 3 times
    tpRetryDelayMs: 2000,     // 2s between retries
  },
  
  polling: {
    marketMs: 10000,
    positionCheckMs: 5000,    // Check positions every 5s
    statusMs: 300000,
  },
  
  gammaApi: 'https://gamma-api.polymarket.com',
  dataApi: 'https://data-api.polymarket.com',
  clobHost: 'https://clob.polymarket.com',
  funder: process.env.POLYMARKET_FUNDER,
};

// ═══════════════════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════════════════

const state = {
  startTime: Date.now(),
  connected: false,
  clobClient: null,
  
  assets: {},
  positions: [],
  
  stats: {
    totalSignals: 0,
    totalTrades: 0,
    totalWins: 0,
    totalLosses: 0,
    totalPnL: 0,
    marketOrdersAttempted: 0,
    marketOrdersFilled: 0,
    tpOrdersAttempted: 0,
    tpOrdersPlaced: 0,
    tpOrdersFilled: 0,
    errors: 0,
  },
  
  trades: [],
};

Object.keys(CONFIG.assets).forEach(symbol => {
  state.assets[symbol] = {
    currentMarket: null,
    baselinePrice: null,
    currentPrice: null,
    upPrice: null,
    downPrice: null,
    upTokenId: null,
    downTokenId: null,
    lastTradeTime: 0,
    pendingTrade: false, // Lock to prevent duplicate trades
  };
});

const LOG_FILE = '/Users/ruby/.openclaw/workspace/projects/btc-15m-arbitrage/bot-live-v3.log';
const JOURNAL_FILE = '/Users/ruby/.openclaw/workspace/projects/btc-15m-arbitrage/trade-journal-v3.json';

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

function log(message, type = 'info', symbol = null) {
  const time = new Date().toLocaleTimeString('en-US', { 
    hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 
  });
  const prefix = symbol ? `[${symbol}]` : '';
  const icons = {
    signal: '🎯', entry: '📈', exit: '📉', tp: '💰', fill: '✅', 
    error: '❌', warning: '⚠️', info: 'ℹ️', live: '🔴', claim: '🏦',
    wait: '⏳', retry: '🔄', verify: '🔍'
  };
  const line = `[${time}] ${icons[type] || '•'} ${prefix} ${message}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function saveJournal() {
  fs.writeFileSync(JOURNAL_FILE, JSON.stringify({
    stats: state.stats,
    trades: state.trades,
    positions: state.positions,
    lastUpdate: new Date().toISOString(),
  }, null, 2));
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLOB CLIENT
// ═══════════════════════════════════════════════════════════════════════════════

async function initClobClient() {
  log('Initializing CLOB client...', 'live');
  
  const wallet = new ethers.Wallet(process.env.POLYMARKET_PK);
  log(`Signer: ${wallet.address}`, 'info');
  log(`Funder: ${CONFIG.funder}`, 'info');
  
  const tempClient = new ClobClient(CONFIG.clobHost, 137, wallet);
  
  let apiCreds;
  try {
    apiCreds = await tempClient.createOrDeriveApiKey();
  } catch (e) {
    // API key might already exist, try to derive
    apiCreds = await tempClient.deriveApiKey();
  }
  
  state.clobClient = new ClobClient(
    CONFIG.clobHost,
    137,
    wallet,
    apiCreds,
    parseInt(process.env.POLYMARKET_SIGNATURE_TYPE),
    CONFIG.funder
  );
  
  log('CLOB client initialized', 'fill');
  return true;
}

// ═══════════════════════════════════════════════════════════════════════════════
// POSITION VERIFICATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Query actual position from Polymarket data API
 */
async function getActualPosition(tokenId) {
  try {
    const resp = await fetch(`${CONFIG.dataApi}/positions?user=${CONFIG.funder}`);
    const positions = await resp.json();
    
    const position = positions.find(p => p.asset === tokenId);
    if (position && position.size > 0) {
      return {
        exists: true,
        size: position.size,
        avgPrice: position.avgPrice,
        currentValue: position.currentValue,
      };
    }
    return { exists: false };
  } catch (e) {
    log(`Position query error: ${e.message}`, 'error');
    return { exists: false, error: e.message };
  }
}

/**
 * Wait for position to appear in API after market order
 */
async function waitForPosition(tokenId, maxWaitMs = 10000) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitMs) {
    const position = await getActualPosition(tokenId);
    if (position.exists) {
      return position;
    }
    await sleep(1000);
  }
  
  return { exists: false, timeout: true };
}

// ═══════════════════════════════════════════════════════════════════════════════
// ORDER EXECUTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Place MARKET order with validation
 */
async function placeMarketBuy(symbol, tokenId, amount) {
  state.stats.marketOrdersAttempted++;
  
  try {
    log(`Placing MARKET BUY: $${amount.toFixed(2)}`, 'entry', symbol);
    
    // Create market order
    const marketOrder = await state.clobClient.createMarketOrder({
      tokenID: tokenId,
      amount: amount,
      side: Side.BUY,
    });
    
    // Post with FOK (Fill or Kill)
    const result = await state.clobClient.postOrder(marketOrder, OrderType.FOK);
    
    if (result && result.orderID) {
      log(`Market order submitted: ${result.orderID}`, 'fill', symbol);
      state.stats.marketOrdersFilled++;
      return { success: true, orderId: result.orderID };
    } else {
      log(`Market order rejected - no fill available`, 'warning', symbol);
      return { success: false, error: 'No fill' };
    }
  } catch (err) {
    log(`Market order error: ${err.message}`, 'error', symbol);
    state.stats.errors++;
    return { success: false, error: err.message };
  }
}

/**
 * Place TP SELL order with retry logic
 */
async function placeTPSell(symbol, tokenId, shares, tpPrice) {
  state.stats.tpOrdersAttempted++;
  
  for (let attempt = 1; attempt <= CONFIG.trading.tpRetryAttempts; attempt++) {
    try {
      log(`Placing TP SELL (attempt ${attempt}): ${shares.toFixed(2)} shares @ $${tpPrice.toFixed(3)}`, 'tp', symbol);
      
      // Round down shares to avoid "not enough balance"
      const safeShares = Math.floor(shares * 100) / 100;
      
      const sellOrder = await state.clobClient.createOrder({
        tokenID: tokenId,
        price: tpPrice,
        size: safeShares,
        side: Side.SELL,
      });
      
      const result = await state.clobClient.postOrder(sellOrder, OrderType.GTC);
      
      if (result && result.orderID) {
        log(`TP order placed: ${result.orderID}`, 'fill', symbol);
        state.stats.tpOrdersPlaced++;
        return { success: true, orderId: result.orderID };
      }
    } catch (err) {
      log(`TP attempt ${attempt} failed: ${err.message}`, 'warning', symbol);
      
      if (attempt < CONFIG.trading.tpRetryAttempts) {
        log(`Retrying in ${CONFIG.trading.tpRetryDelayMs}ms...`, 'retry', symbol);
        await sleep(CONFIG.trading.tpRetryDelayMs);
      }
    }
  }
  
  state.stats.errors++;
  return { success: false, error: 'All retry attempts failed' };
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRADING LOGIC
// ═══════════════════════════════════════════════════════════════════════════════

async function checkSignal(symbol) {
  const asset = state.assets[symbol];
  
  // Basic validation
  if (!asset.currentMarket || !asset.baselinePrice || !asset.currentPrice) return;
  if (!asset.upTokenId || !asset.downTokenId) return;
  
  // Prevent duplicate trades while one is pending
  if (asset.pendingTrade) return;
  
  // Position limits
  if (state.positions.length >= CONFIG.trading.maxPositions) return;
  
  // Check existing position in this asset
  if (state.positions.find(p => p.symbol === symbol && p.status === 'active')) return;
  
  // Cooldown check
  if (Date.now() - asset.lastTradeTime < CONFIG.trading.cooldownMs) return;
  
  // Time remaining check
  const timeLeft = (asset.currentMarket.endDate - Date.now()) / 1000;
  if (timeLeft < CONFIG.trading.minTimeLeft) return;
  
  // Price move calculation
  const move = (asset.currentPrice - asset.baselinePrice) / asset.baselinePrice;
  if (Math.abs(move) < CONFIG.trading.moveThreshold) return;
  
  // Direction (momentum)
  const direction = move > 0 ? 'UP' : 'DOWN';
  
  // Entry price check
  const entryPrice = direction === 'UP' ? asset.upPrice : asset.downPrice;
  if (entryPrice > CONFIG.trading.maxOddsEntry) return;
  if (entryPrice < 0.1) return; // Don't enter at extreme odds
  
  // SIGNAL DETECTED
  state.stats.totalSignals++;
  log(`SIGNAL: ${direction} | Move: ${(move * 100).toFixed(3)}% | Entry: $${entryPrice.toFixed(3)} | Time left: ${timeLeft.toFixed(0)}s`, 'signal', symbol);
  
  // Execute trade
  await executeTrade(symbol, direction);
}

async function executeTrade(symbol, direction) {
  const asset = state.assets[symbol];
  
  // Lock to prevent duplicate trades
  asset.pendingTrade = true;
  asset.lastTradeTime = Date.now();
  
  const tokenId = direction === 'UP' ? asset.upTokenId : asset.downTokenId;
  const entryPrice = direction === 'UP' ? asset.upPrice : asset.downPrice;
  
  try {
    // STEP 1: Place market buy
    const buyResult = await placeMarketBuy(symbol, tokenId, CONFIG.trading.positionSize);
    
    if (!buyResult.success) {
      log(`Trade aborted - buy failed: ${buyResult.error}`, 'error', symbol);
      asset.pendingTrade = false;
      return;
    }
    
    // STEP 2: Wait for settlement
    log(`Waiting ${CONFIG.trading.settlementDelayMs}ms for settlement...`, 'wait', symbol);
    await sleep(CONFIG.trading.settlementDelayMs);
    
    // STEP 3: Verify position exists and get actual size
    log(`Verifying position...`, 'verify', symbol);
    const position = await waitForPosition(tokenId, 10000);
    
    if (!position.exists) {
      log(`Position not found after market order - order may not have filled`, 'warning', symbol);
      asset.pendingTrade = false;
      return;
    }
    
    const actualShares = position.size;
    log(`Position verified: ${actualShares.toFixed(2)} shares @ avg $${position.avgPrice?.toFixed(3) || entryPrice.toFixed(3)}`, 'verify', symbol);
    
    // STEP 4: Calculate TP price
    const actualEntryPrice = position.avgPrice || entryPrice;
    const tpPrice = Math.min(actualEntryPrice * (1 + CONFIG.trading.grossTPPct), 0.99);
    
    // STEP 5: Place TP sell order with retry logic
    const tpResult = await placeTPSell(symbol, tokenId, actualShares, tpPrice);
    
    // STEP 6: Record position
    const positionRecord = {
      id: Date.now().toString(),
      symbol,
      direction,
      tokenId,
      entryPrice: actualEntryPrice,
      shares: actualShares,
      cost: actualShares * actualEntryPrice,
      tpPrice,
      tpOrderId: tpResult.success ? tpResult.orderId : null,
      buyOrderId: buyResult.orderId,
      entryTime: Date.now(),
      marketEndTime: asset.currentMarket.endDate,
      status: 'active',
    };
    
    state.positions.push(positionRecord);
    state.stats.totalTrades++;
    
    if (tpResult.success) {
      log(`ENTRY COMPLETE: ${direction} | ${actualShares.toFixed(2)} shares @ $${actualEntryPrice.toFixed(3)} | TP @ $${tpPrice.toFixed(3)}`, 'entry', symbol);
    } else {
      log(`ENTRY PARTIAL: Position open but TP failed - manual exit needed`, 'warning', symbol);
    }
    
    saveJournal();
    
  } catch (err) {
    log(`Trade execution error: ${err.message}`, 'error', symbol);
    state.stats.errors++;
  } finally {
    asset.pendingTrade = false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// POSITION MONITORING
// ═══════════════════════════════════════════════════════════════════════════════

async function monitorPositions() {
  for (const pos of state.positions) {
    if (pos.status !== 'active') continue;
    
    // Check if TP order exists and filled
    if (pos.tpOrderId) {
      try {
        const order = await state.clobClient.getOrder(pos.tpOrderId);
        if (order && (order.status === 'MATCHED' || order.size_matched >= pos.shares * 0.9)) {
          // TP filled!
          const pnl = (pos.tpPrice - pos.entryPrice) * pos.shares;
          const netPnl = pnl - (pos.cost * CONFIG.trading.takerFeePct);
          
          state.stats.totalPnL += netPnl;
          state.stats.totalWins++;
          state.stats.tpOrdersFilled++;
          
          log(`TP FILLED! Gross: $${pnl.toFixed(2)} | Net: $${netPnl.toFixed(2)}`, 'fill', pos.symbol);
          
          pos.status = 'closed';
          pos.exitPrice = pos.tpPrice;
          pos.pnl = netPnl;
          pos.exitReason = 'tp_filled';
          pos.exitTime = Date.now();
          
          state.trades.push({...pos});
          saveJournal();
        }
      } catch (e) {
        // Silent fail - order might not exist yet
      }
    }
    
    // Check if market ended
    if (new Date(pos.marketEndTime).getTime() < Date.now()) {
      log(`Market ended - awaiting resolution`, 'warning', pos.symbol);
      pos.status = 'pending_resolution';
    }
  }
  
  // Clean up closed positions from active list
  state.positions = state.positions.filter(p => p.status === 'active' || p.status === 'pending_resolution');
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTO-CLAIM
// ═══════════════════════════════════════════════════════════════════════════════

async function autoClaim() {
  log('Running auto-claim check...', 'claim');
  
  try {
    const resp = await fetch(`${CONFIG.dataApi}/positions?user=${CONFIG.funder}`);
    const positions = await resp.json();
    
    const claimable = positions.filter(p => p.redeemable && p.currentValue > 0);
    
    if (claimable.length === 0) {
      log('No winnings to claim', 'claim');
      return;
    }
    
    for (const pos of claimable) {
      log(`Claimable: ${pos.title?.substring(0, 40)} - $${pos.currentValue?.toFixed(2) || '?'}`, 'claim');
    }
  } catch (err) {
    log(`Auto-claim error: ${err.message}`, 'error');
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MARKET DATA
// ═══════════════════════════════════════════════════════════════════════════════

async function fetchMarketData(symbol) {
  const asset = state.assets[symbol];
  const config = CONFIG.assets[symbol];
  
  try {
    const resp = await fetch(`${CONFIG.gammaApi}/series/${config.seriesId}`);
    const series = await resp.json();
    
    const now = new Date();
    const active = series.events
      ?.filter(e => !e.closed && new Date(e.endDate) > now)
      .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))[0];
    
    if (!active) {
      asset.currentMarket = null;
      return;
    }
    
    const eventResp = await fetch(`${CONFIG.gammaApi}/events/${active.id}`);
    const eventData = await eventResp.json();
    const market = eventData.markets?.[0];
    if (!market) return;
    
    const isNewMarket = !asset.currentMarket || asset.currentMarket.id !== market.id;
    
    if (isNewMarket) {
      asset.baselinePrice = null;
      asset.pendingTrade = false;
      log(`New market: ${market.question}`, 'info', symbol);
    }
    
    asset.currentMarket = {
      id: market.id,
      title: market.question,
      endDate: new Date(active.endDate),
    };
    
    try {
      const outcomePrices = typeof market.outcomePrices === 'string' 
        ? JSON.parse(market.outcomePrices) : market.outcomePrices || [];
      const clobTokenIds = typeof market.clobTokenIds === 'string' 
        ? JSON.parse(market.clobTokenIds) : market.clobTokenIds || [];
      
      asset.upPrice = parseFloat(outcomePrices[0]) || 0.5;
      asset.downPrice = parseFloat(outcomePrices[1]) || 0.5;
      asset.upTokenId = clobTokenIds[0];
      asset.downTokenId = clobTokenIds[1];
    } catch (e) {}
    
  } catch (err) {}
}

// ═══════════════════════════════════════════════════════════════════════════════
// WEBSOCKET
// ═══════════════════════════════════════════════════════════════════════════════

function symbolToAsset(symbol) {
  const map = { 'btc/usd': 'BTC', 'eth/usd': 'ETH', 'sol/usd': 'SOL', 'xrp/usd': 'XRP' };
  return map[symbol?.toLowerCase()];
}

function initWebSocket() {
  log('Connecting to RTDS WebSocket...', 'info');
  
  const ws = new WebSocket('wss://ws-live-data.polymarket.com/');
  
  ws.on('open', () => {
    log('WebSocket connected!', 'fill');
    state.connected = true;
    
    ws.send(JSON.stringify({ 
      action: 'subscribe', 
      subscriptions: [{ topic: 'crypto_prices_chainlink', type: '*' }]
    }));
    
    setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) ws.send('ping');
    }, 5000);
  });
  
  ws.on('message', (data) => {
    const str = data.toString();
    if (str === 'pong') return;
    
    try {
      const msg = JSON.parse(str);
      if (msg.topic === 'crypto_prices_chainlink' && msg.payload) {
        handlePriceUpdate(msg.payload);
      }
    } catch (e) {}
  });
  
  ws.on('error', (e) => log(`WebSocket error: ${e.message}`, 'error'));
  
  ws.on('close', () => {
    log('WebSocket disconnected. Reconnecting in 5s...', 'warning');
    state.connected = false;
    setTimeout(initWebSocket, 5000);
  });
}

function handlePriceUpdate(payload) {
  const assetSymbol = symbolToAsset(payload.symbol);
  if (!assetSymbol) return;
  
  const asset = state.assets[assetSymbol];
  const price = parseFloat(payload.value);
  if (isNaN(price) || price <= 0) return;
  
  asset.currentPrice = price;
  
  if (asset.currentMarket && !asset.baselinePrice) {
    asset.baselinePrice = price;
    log(`Baseline: $${price.toFixed(price > 100 ? 2 : 4)}`, 'info', assetSymbol);
  }
  
  // Don't block - check signal asynchronously
  checkSignal(assetSymbol).catch(e => {
    log(`Signal check error: ${e.message}`, 'error', assetSymbol);
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATUS
// ═══════════════════════════════════════════════════════════════════════════════

function printStatus() {
  const runtime = Math.floor((Date.now() - state.startTime) / 60000);
  const winRate = state.stats.totalTrades > 0 
    ? ((state.stats.totalWins / state.stats.totalTrades) * 100).toFixed(1) 
    : '0.0';
  
  console.log('\n' + '═'.repeat(60));
  console.log(`🔴 LIVE V3 STATUS | Runtime: ${runtime}m`);
  console.log('═'.repeat(60));
  console.log(`Signals: ${state.stats.totalSignals} | Trades: ${state.stats.totalTrades}`);
  console.log(`Wins: ${state.stats.totalWins} | Win Rate: ${winRate}%`);
  console.log(`P&L: $${state.stats.totalPnL.toFixed(2)}`);
  console.log(`Market Orders: ${state.stats.marketOrdersFilled}/${state.stats.marketOrdersAttempted}`);
  console.log(`TP Orders: ${state.stats.tpOrdersPlaced}/${state.stats.tpOrdersAttempted}`);
  console.log(`Active Positions: ${state.positions.filter(p => p.status === 'active').length}`);
  console.log(`Errors: ${state.stats.errors}`);
  console.log('═'.repeat(60) + '\n');
  
  saveJournal();
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
  console.log('\n' + '═'.repeat(60));
  console.log('🔴 LIVE TRADING BOT V3 - ROBUST EXECUTION');
  console.log('Strategy: MOMENTUM | TP: 5% net | Settlement: 5s delay');
  console.log('═'.repeat(60) + '\n');
  
  fs.writeFileSync(LOG_FILE, '');
  
  await initClobClient();
  initWebSocket();
  
  for (const symbol of Object.keys(CONFIG.assets)) {
    await fetchMarketData(symbol);
  }
  
  log('🔴 LIVE BOT V3 RUNNING!', 'live');
  
  // Market data refresh
  setInterval(async () => {
    for (const symbol of Object.keys(CONFIG.assets)) {
      await fetchMarketData(symbol);
    }
  }, CONFIG.polling.marketMs);
  
  // Position monitoring
  setInterval(monitorPositions, CONFIG.polling.positionCheckMs);
  
  // Auto-claim every 5 min
  setInterval(autoClaim, 5 * 60 * 1000);
  
  // Status reports
  setInterval(printStatus, CONFIG.polling.statusMs);
  
  // Initial status
  setTimeout(printStatus, 30000);
  
  // Shutdown
  setTimeout(() => {
    printStatus();
    log('Runtime complete', 'info');
    process.exit(0);
  }, CONFIG.runtime);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
