#!/usr/bin/env node

/**
 * LIVE TRADING BOT V2 - MARKET ORDERS + IMMEDIATE TP
 * 
 * Strategy: Momentum (bet with early price move)
 * Entry: Market orders (FOK) for guaranteed fills
 * Exit: Immediate limit sell at TP after fill
 * Auto-claim: Runs at end of each 15-min cycle
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
  runtime: 8 * 60 * 60 * 1000, // 8 hours
  
  assets: {
    BTC: { seriesId: '10192', chainlinkSymbol: 'btc/usd' },
    ETH: { seriesId: '10191', chainlinkSymbol: 'eth/usd' },
    SOL: { seriesId: '10423', chainlinkSymbol: 'sol/usd' },
    XRP: { seriesId: '10422', chainlinkSymbol: 'xrp/usd' },
  },
  
  trading: {
    moveThreshold: 0.0003,    // 0.03% price move to trigger (same as paper)
    maxOddsEntry: 0.55,       // Don't enter if odds > 55%
    minTimeLeft: 30,          // Min 30s before market ends
    cooldownMs: 15000,        // 15s between trades per asset
    
    // Position sizing
    positionSize: 1.00,       // $1 per trade (conservative with $2.80)
    maxPositions: 2,          // Max 2 concurrent positions
    
    // Fees & TP calculation
    takerFeePct: 0.03,        // 3% taker fee for market orders
    netProfitTarget: 0.05,    // 5% net profit target
    // Gross TP = (1 + takerFee) * (1 + netProfit) - 1 = 1.03 * 1.05 - 1 = 0.0815
    grossTPPct: 0.0815,       // 8.15% gross to get 5% net after 3% fee
    
    stopLossPct: 0.10,        // 10% stop loss
  },
  
  polling: {
    marketMs: 10000,
    fillCheckMs: 2000,        // Check fill status every 2s
    statusMs: 300000,
  },
  
  gammaApi: 'https://gamma-api.polymarket.com',
  clobHost: 'https://clob.polymarket.com',
};

// ═══════════════════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════════════════

const state = {
  startTime: Date.now(),
  connected: false,
  clobClient: null,
  
  assets: {},
  positions: [], // Track active positions with pending TP orders
  
  stats: {
    totalSignals: 0,
    totalTrades: 0,
    totalWins: 0,
    totalLosses: 0,
    totalPnL: 0,
    marketOrdersFilled: 0,
    tpOrdersPlaced: 0,
    tpOrdersFilled: 0,
  },
  
  trades: [],
  currentMarketEndTime: null,
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
    lastTradeTime: 0,
  };
});

const LOG_FILE = '/Users/ruby/.openclaw/workspace/projects/btc-15m-arbitrage/bot-live-v2.log';
const JOURNAL_FILE = '/Users/ruby/.openclaw/workspace/projects/btc-15m-arbitrage/trade-journal-v2.json';

// ═══════════════════════════════════════════════════════════════════════════════
// LOGGING
// ═══════════════════════════════════════════════════════════════════════════════

function log(message, type = 'info', symbol = null) {
  const time = new Date().toLocaleTimeString('en-US', { 
    hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 
  });
  const prefix = symbol ? `[${symbol}]` : '';
  const icons = {
    signal: '🎯', entry: '📈', exit: '📉', tp: '💰', fill: '✅', 
    error: '❌', warning: '⚠️', info: 'ℹ️', live: '🔴', claim: '🏦'
  };
  const line = `[${time}] ${icons[type] || '•'} ${prefix} ${message}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

function saveJournal() {
  fs.writeFileSync(JOURNAL_FILE, JSON.stringify({
    stats: state.stats,
    trades: state.trades,
    positions: state.positions,
  }, null, 2));
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLOB CLIENT
// ═══════════════════════════════════════════════════════════════════════════════

async function initClobClient() {
  log('Initializing CLOB client...', 'live');
  
  const wallet = new ethers.Wallet(process.env.POLYMARKET_PK);
  log(`Signer: ${wallet.address}`, 'info');
  log(`Funder: ${process.env.POLYMARKET_FUNDER}`, 'info');
  
  const tempClient = new ClobClient(CONFIG.clobHost, 137, wallet);
  const apiCreds = await tempClient.createOrDeriveApiKey();
  
  state.clobClient = new ClobClient(
    CONFIG.clobHost,
    137,
    wallet,
    apiCreds,
    parseInt(process.env.POLYMARKET_SIGNATURE_TYPE),
    process.env.POLYMARKET_FUNDER
  );
  
  const orders = await state.clobClient.getOpenOrders();
  log(`CLOB connected! Open orders: ${orders.length}`, 'fill');
  
  return true;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ORDER EXECUTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Place MARKET order (FOK) for guaranteed fill
 */
async function placeMarketBuy(symbol, tokenId, amount) {
  try {
    log(`Placing MARKET BUY: $${amount.toFixed(2)}`, 'entry', symbol);
    
    const order = await state.clobClient.createMarketOrder({
      tokenID: tokenId,
      amount: amount, // Dollar amount
      side: Side.BUY,
    });
    
    const result = await state.clobClient.postOrder(order, OrderType.FOK);
    
    if (result && result.orderID) {
      log(`Market order placed: ${result.orderID}`, 'fill', symbol);
      state.stats.marketOrdersFilled++;
      return { success: true, orderId: result.orderID, ...result };
    } else {
      log(`Market order failed - no fill`, 'error', symbol);
      return { success: false, error: 'No fill' };
    }
  } catch (err) {
    log(`Market order error: ${err.message}`, 'error', symbol);
    return { success: false, error: err.message };
  }
}

/**
 * Place LIMIT SELL order at Take Profit price
 */
async function placeTPSell(symbol, tokenId, shares, tpPrice) {
  try {
    log(`Placing TP SELL: ${shares.toFixed(1)} shares @ $${tpPrice.toFixed(3)}`, 'tp', symbol);
    
    const order = await state.clobClient.createOrder({
      tokenID: tokenId,
      price: tpPrice,
      size: shares,
      side: Side.SELL,
    });
    
    const result = await state.clobClient.postOrder(order, OrderType.GTC);
    
    if (result && result.orderID) {
      log(`TP order placed: ${result.orderID}`, 'fill', symbol);
      state.stats.tpOrdersPlaced++;
      return { success: true, orderId: result.orderID };
    }
    return { success: false, error: 'Failed to place TP' };
  } catch (err) {
    log(`TP order error: ${err.message}`, 'error', symbol);
    return { success: false, error: err.message };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRADING LOGIC
// ═══════════════════════════════════════════════════════════════════════════════

async function checkSignal(symbol) {
  const asset = state.assets[symbol];
  
  if (!asset.currentMarket || !asset.baselinePrice || !asset.currentPrice) return;
  if (!asset.upTokenId || !asset.downTokenId) return;
  
  // Check position limits
  if (state.positions.length >= CONFIG.trading.maxPositions) return;
  
  // Check existing position in this asset
  if (state.positions.find(p => p.symbol === symbol)) return;
  
  // Check cooldown
  if (Date.now() - asset.lastTradeTime < CONFIG.trading.cooldownMs) return;
  
  const timeLeft = (asset.currentMarket.endDate - Date.now()) / 1000;
  if (timeLeft < CONFIG.trading.minTimeLeft) return;
  
  // Calculate price move
  const move = (asset.currentPrice - asset.baselinePrice) / asset.baselinePrice;
  if (Math.abs(move) < CONFIG.trading.moveThreshold) return;
  
  // Momentum: bet WITH the move
  const direction = move > 0 ? 'UP' : 'DOWN';
  
  const entryPrice = direction === 'UP' ? asset.upPrice : asset.downPrice;
  if (entryPrice > CONFIG.trading.maxOddsEntry) return;
  
  // SIGNAL!
  state.stats.totalSignals++;
  log(`SIGNAL: ${direction} | Move: ${(move * 100).toFixed(3)}% | Entry: $${entryPrice.toFixed(3)}`, 'signal', symbol);
  
  // Execute trade
  await executeTrade(symbol, direction);
}

async function executeTrade(symbol, direction) {
  const asset = state.assets[symbol];
  asset.lastTradeTime = Date.now();
  
  const tokenId = direction === 'UP' ? asset.upTokenId : asset.downTokenId;
  const entryPrice = direction === 'UP' ? asset.upPrice : asset.downPrice;
  
  // 1. Place MARKET BUY
  const buyResult = await placeMarketBuy(symbol, tokenId, CONFIG.trading.positionSize);
  
  if (!buyResult.success) {
    log(`Trade aborted - buy failed: ${buyResult.error}`, 'error', symbol);
    return;
  }
  
  // 2. Calculate shares received (approximate)
  const effectiveCost = CONFIG.trading.positionSize * (1 + CONFIG.trading.takerFeePct);
  const sharesReceived = CONFIG.trading.positionSize / entryPrice;
  
  // 3. Calculate TP price (8.15% above entry to get 5% net after 3% fee)
  const tpPrice = Math.min(entryPrice * (1 + CONFIG.trading.grossTPPct), 0.99);
  
  // 4. Place LIMIT SELL at TP
  const tpResult = await placeTPSell(symbol, tokenId, sharesReceived, tpPrice);
  
  // 5. Track position
  const position = {
    id: Date.now().toString(),
    symbol,
    direction,
    tokenId,
    entryPrice,
    shares: sharesReceived,
    cost: effectiveCost,
    tpPrice,
    tpOrderId: tpResult.success ? tpResult.orderId : null,
    entryTime: Date.now(),
    marketEndTime: asset.currentMarket.endDate,
    status: 'active',
  };
  
  state.positions.push(position);
  state.stats.totalTrades++;
  
  log(`ENTRY: ${direction} @ $${entryPrice.toFixed(3)} | TP @ $${tpPrice.toFixed(3)} | Shares: ${sharesReceived.toFixed(1)}`, 'entry', symbol);
  saveJournal();
}

// ═══════════════════════════════════════════════════════════════════════════════
// POSITION MONITORING
// ═══════════════════════════════════════════════════════════════════════════════

async function monitorPositions() {
  for (const pos of state.positions) {
    if (pos.status !== 'active') continue;
    
    // Check if TP order filled
    if (pos.tpOrderId) {
      try {
        const order = await state.clobClient.getOrder(pos.tpOrderId);
        if (order && order.status === 'MATCHED') {
          // TP filled!
          const pnl = (pos.tpPrice - pos.entryPrice) * pos.shares - (pos.cost - CONFIG.trading.positionSize);
          state.stats.totalPnL += pnl;
          state.stats.totalWins++;
          state.stats.tpOrdersFilled++;
          
          log(`TP FILLED! P&L: $${pnl.toFixed(2)} (+${(pnl/pos.cost*100).toFixed(1)}%)`, 'fill', pos.symbol);
          
          pos.status = 'closed';
          pos.exitPrice = pos.tpPrice;
          pos.pnl = pnl;
          pos.exitReason = 'tp_filled';
          
          state.trades.push(pos);
          saveJournal();
        }
      } catch (e) {
        // Order check failed, continue
      }
    }
    
    // Check if market ended (will resolve)
    if (new Date(pos.marketEndTime).getTime() < Date.now()) {
      log(`Market ended - position will resolve`, 'warning', pos.symbol);
      pos.status = 'pending_resolution';
    }
  }
  
  // Clean up closed positions
  state.positions = state.positions.filter(p => p.status === 'active');
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTO-CLAIM
// ═══════════════════════════════════════════════════════════════════════════════

async function autoClaim() {
  log('Running auto-claim sweep...', 'claim');
  
  try {
    const { sweepAll } = require('./auto-redeem.js');
    const result = await sweepAll();
    
    if (result.total === 0) {
      log('No positions to redeem', 'claim');
    } else {
      log(`Sweep: ${result.redeemed}/${result.total} redeemed, ${result.failed} failed`, 'claim');
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
      log(`New market: ${market.question}`, 'info', symbol);
      
      // Track market end for auto-claim
      state.currentMarketEndTime = new Date(active.endDate);
    }
    
    asset.currentMarket = {
      id: market.id,
      title: market.question,
      endDate: new Date(active.endDate),
    };
    
    // Parse prices and token IDs
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
    log('WebSocket disconnected. Reconnecting...', 'warning');
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
  
  checkSignal(assetSymbol);
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
  console.log(`🔴 LIVE V2 STATUS | Runtime: ${runtime}m | Strategy: MOMENTUM`);
  console.log('═'.repeat(60));
  console.log(`Trades: ${state.stats.totalTrades} | Wins: ${state.stats.totalWins} | Win Rate: ${winRate}%`);
  console.log(`P&L: $${state.stats.totalPnL.toFixed(2)}`);
  console.log(`Active Positions: ${state.positions.length}`);
  console.log(`TP Orders: ${state.stats.tpOrdersPlaced} placed, ${state.stats.tpOrdersFilled} filled`);
  console.log('═'.repeat(60) + '\n');
  
  saveJournal();
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
  console.log('\n' + '═'.repeat(60));
  console.log('🔴 LIVE TRADING BOT V2 - MARKET ORDERS + IMMEDIATE TP');
  console.log('Strategy: MOMENTUM | Position: $1 | TP: 5% net');
  console.log('═'.repeat(60) + '\n');
  
  // Clear log
  fs.writeFileSync(LOG_FILE, '');
  
  // Initialize CLOB
  await initClobClient();
  
  // Initialize WebSocket
  initWebSocket();
  
  // Fetch initial market data
  for (const symbol of Object.keys(CONFIG.assets)) {
    await fetchMarketData(symbol);
  }
  
  log('🔴 LIVE BOT V2 RUNNING!', 'live');
  
  // Market data refresh
  setInterval(async () => {
    for (const symbol of Object.keys(CONFIG.assets)) {
      await fetchMarketData(symbol);
    }
  }, CONFIG.polling.marketMs);
  
  // Position monitoring
  setInterval(monitorPositions, CONFIG.polling.fillCheckMs);
  
  // Auto-claim check every 5 minutes
  setInterval(autoClaim, 5 * 60 * 1000);
  
  // Also run auto-claim when market ends
  setInterval(() => {
    if (state.currentMarketEndTime && Date.now() > state.currentMarketEndTime.getTime() + 60000) {
      autoClaim();
    }
  }, 30000);
  
  // Status reports
  setInterval(printStatus, CONFIG.polling.statusMs);
  
  // Shutdown
  setTimeout(() => {
    printStatus();
    process.exit(0);
  }, CONFIG.runtime);
}

main().catch(console.error);
