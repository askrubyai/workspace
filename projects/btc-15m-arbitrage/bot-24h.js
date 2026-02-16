#!/usr/bin/env node

/**
 * BTC 15-Minute LATENCY ARBITRAGE Bot - 24 Hour Version
 * 
 * Runs continuously for 24 hours, detecting latency opportunities
 * between Binance BTC price and Polymarket odds.
 * 
 * MODES:
 * - paper: Simulates trades, tracks P&L (default)
 * - live: Executes real trades on Polymarket
 */

require('dotenv').config();
const WebSocket = require('ws');
const fetch = require('node-fetch');
const fs = require('fs');

// =============================================================================
// CONFIGURATION
// =============================================================================

const CONFIG = {
  // Trading mode: 'paper' or 'live'
  mode: process.env.TRADING_MODE || 'paper',
  
  // Latency arbitrage thresholds - TUNED for more signals
  latency: {
    btcMoveThreshold: 0.001,     // 0.1% BTC move (lowered from 0.15%)
    priceWindowSec: 20,          // 20 sec window (tighter)
    exitProfitTarget: 0.008,     // 0.8% profit target
    exitTimeoutSec: 90,          // 90 sec max hold
    stopLossPct: 0.02,           // 2% stop loss
  },
  
  // Position sizing
  position: {
    size: 25,  // $ per trade (conservative)
    maxConcurrent: 1,
  },
  
  // Wallet (from .env)
  wallet: {
    address: process.env.POLYMARKET_FUNDER,
    privateKey: process.env.POLYMARKET_PK,
  },
  
  // WebSocket endpoints  
  ws: {
    binance: 'wss://stream.binance.com:9443/ws/btcusdt@trade',
  },
  
  // API endpoints
  api: {
    gamma: 'https://gamma-api.polymarket.com',
    clob: 'https://clob.polymarket.com',
  },
  
  // Timing
  pollIntervalMs: 300,          // Poll every 300ms
  statusIntervalMs: 60000,      // Log status every minute
  reportIntervalMs: 3600000,    // Save report every hour
  runTimeMs: 24 * 60 * 60 * 1000, // 24 hours
};

// =============================================================================
// STATE
// =============================================================================

const state = {
  // Market
  currentMarket: null,
  upTokenId: null,
  downTokenId: null,
  marketEndTime: null,
  
  // Prices
  upPrice: null,
  downPrice: null,
  upBid: null,
  upAsk: null,
  downBid: null,
  downAsk: null,
  
  // BTC tracking
  btcPrice: null,
  btcPrices: [],
  btcHigh: null,
  btcLow: null,
  
  // Position
  inPosition: false,
  positionSide: null,
  entryPrice: null,
  entryTime: null,
  entryBtcPrice: null,
  
  // Stats
  stats: {
    startTime: null,
    signals: 0,
    trades: 0,
    wins: 0,
    losses: 0,
    breakeven: 0,
    totalProfit: 0,
    totalLoss: 0,
    largestWin: 0,
    largestLoss: 0,
    btcUpdates: 0,
    pricePolls: 0,
    marketsWatched: 0,
  },
  
  trades: [],
  hourlyReports: [],
};

// =============================================================================
// LOGGING
// =============================================================================

const LOG_FILE = '/Users/ruby/.openclaw/workspace/projects/btc-15m-arbitrage/bot-24h.log';

function log(msg, type = 'info') {
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour12: false });
  const prefix = {
    info: '📊', success: '✅', warning: '⚠️', error: '❌',
    signal: '🎯', entry: '📈', exit: '📉', money: '💰', btc: '₿',
  }[type] || 'ℹ️';
  
  const line = `[${time}] ${prefix} ${msg}`;
  console.log(line);
  
  // Append to log file
  fs.appendFileSync(LOG_FILE, line + '\n');
}

// =============================================================================
// MARKET DATA
// =============================================================================

async function fetchCurrentMarket() {
  try {
    const resp = await fetch(`${CONFIG.api.gamma}/series/10192`);
    const series = await resp.json();
    
    const now = new Date();
    const activeEvents = series.events
      .filter(e => !e.closed && new Date(e.endDate) > now)
      .sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
    
    if (activeEvents.length === 0) return null;
    
    const event = activeEvents[0];
    const eventResp = await fetch(`${CONFIG.api.gamma}/events/${event.id}`);
    const eventData = await eventResp.json();
    
    if (!eventData.markets?.[0]) return null;
    
    const market = eventData.markets[0];
    const tokenIds = JSON.parse(market.clobTokenIds || '[]');
    const prices = JSON.parse(market.outcomePrices || '[0.5,0.5]');
    
    return {
      id: event.id,
      title: event.title,
      endDate: new Date(event.endDate),
      upTokenId: tokenIds[0],
      downTokenId: tokenIds[1],
      upPrice: parseFloat(prices[0]),
      downPrice: parseFloat(prices[1]),
    };
  } catch (e) {
    return null;
  }
}

async function fetchOrderBooks() {
  if (!state.upTokenId || !state.downTokenId) return;
  
  state.stats.pricePolls++;
  
  try {
    const [upResp, downResp] = await Promise.all([
      fetch(`${CONFIG.api.clob}/book?token_id=${state.upTokenId}`),
      fetch(`${CONFIG.api.clob}/book?token_id=${state.downTokenId}`),
    ]);
    
    const [upBook, downBook] = await Promise.all([upResp.json(), downResp.json()]);
    
    // Extract best bid/ask
    state.upBid = upBook.bids?.[0] ? parseFloat(upBook.bids[0].price) : null;
    state.upAsk = upBook.asks?.[0] ? parseFloat(upBook.asks[0].price) : null;
    state.downBid = downBook.bids?.[0] ? parseFloat(downBook.bids[0].price) : null;
    state.downAsk = downBook.asks?.[0] ? parseFloat(downBook.asks[0].price) : null;
    
    // Mid prices
    if (state.upBid && state.upAsk) state.upPrice = (state.upBid + state.upAsk) / 2;
    if (state.downBid && state.downAsk) state.downPrice = (state.downBid + state.downAsk) / 2;
    
  } catch (e) {
    // Retry on next poll
  }
}

// =============================================================================
// BINANCE WEBSOCKET
// =============================================================================

function connectBinance() {
  const ws = new WebSocket(CONFIG.ws.binance);
  
  ws.on('open', () => log('Binance WebSocket connected', 'success'));
  
  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.p) {
        const price = parseFloat(msg.p);
        const now = Date.now();
        
        state.btcPrice = price;
        state.btcPrices.push({ price, time: now });
        state.stats.btcUpdates++;
        
        // Track high/low for session
        if (!state.btcHigh || price > state.btcHigh) state.btcHigh = price;
        if (!state.btcLow || price < state.btcLow) state.btcLow = price;
        
        // Keep 60 sec of prices
        const cutoff = now - 60000;
        state.btcPrices = state.btcPrices.filter(p => p.time > cutoff);
        
        checkLatencySignal();
      }
    } catch (e) {}
  });
  
  ws.on('error', (err) => log(`Binance error: ${err.message}`, 'error'));
  
  ws.on('close', () => {
    log('Binance disconnected, reconnecting...', 'warning');
    setTimeout(connectBinance, 3000);
  });
  
  return ws;
}

// =============================================================================
// LATENCY DETECTION
// =============================================================================

function checkLatencySignal() {
  if (state.inPosition) {
    checkExit();
    return;
  }
  
  if (state.btcPrices.length < 20) return;
  if (!state.upPrice || !state.downPrice) return;
  
  const now = Date.now();
  const windowStart = now - (CONFIG.latency.priceWindowSec * 1000);
  const recentPrices = state.btcPrices.filter(p => p.time > windowStart);
  
  if (recentPrices.length < 10) return;
  
  // Calculate BTC move
  const oldPrice = recentPrices[0].price;
  const newPrice = state.btcPrice;
  const btcMove = (newPrice - oldPrice) / oldPrice;
  
  if (Math.abs(btcMove) < CONFIG.latency.btcMoveThreshold) return;
  
  // Check spread - if still at ~1.00, odds are stale
  const spread = state.upPrice + state.downPrice;
  
  if (spread > 0.99 && spread < 1.01) {
    // Potential signal
    const side = btcMove > 0 ? 'UP' : 'DOWN';
    
    state.stats.signals++;
    log(`SIGNAL #${state.stats.signals}: BTC ${btcMove > 0 ? '↑' : '↓'} ${(Math.abs(btcMove) * 100).toFixed(3)}% | Spread: $${spread.toFixed(4)}`, 'signal');
    
    enterPosition(side, btcMove);
  }
}

function enterPosition(side, btcMove) {
  const entryPrice = side === 'UP' ? (state.upAsk || state.upPrice) : (state.downAsk || state.downPrice);
  
  state.inPosition = true;
  state.positionSide = side;
  state.entryPrice = entryPrice;
  state.entryTime = Date.now();
  state.entryBtcPrice = state.btcPrice;
  
  log(`ENTRY: ${side} @ $${entryPrice.toFixed(4)} | BTC: $${state.btcPrice.toFixed(2)}`, 'entry');
  
  if (CONFIG.mode === 'live') {
    // TODO: Execute actual trade via CLOB API
    log('LIVE TRADE EXECUTION - NOT YET IMPLEMENTED', 'warning');
  }
}

function checkExit() {
  if (!state.inPosition) return;
  
  const now = Date.now();
  const holdTime = (now - state.entryTime) / 1000;
  const currentPrice = state.positionSide === 'UP' ? 
    (state.upBid || state.upPrice) : (state.downBid || state.downPrice);
  
  if (!currentPrice) return;
  
  const pnlPct = (currentPrice - state.entryPrice) / state.entryPrice;
  
  let shouldExit = false;
  let reason = '';
  
  if (pnlPct >= CONFIG.latency.exitProfitTarget) {
    shouldExit = true;
    reason = 'profit_target';
  } else if (holdTime >= CONFIG.latency.exitTimeoutSec) {
    shouldExit = true;
    reason = 'timeout';
  } else if (pnlPct <= -CONFIG.latency.stopLossPct) {
    shouldExit = true;
    reason = 'stop_loss';
  }
  
  if (shouldExit) {
    exitPosition(currentPrice, reason, holdTime, pnlPct);
  }
}

function exitPosition(exitPrice, reason, holdTime, pnlPct) {
  const pnlUsd = CONFIG.position.size * pnlPct;
  
  const trade = {
    time: new Date().toISOString(),
    side: state.positionSide,
    entry: state.entryPrice,
    exit: exitPrice,
    holdSec: holdTime,
    pnlPct: pnlPct,
    pnlUsd: pnlUsd,
    reason: reason,
    btcEntry: state.entryBtcPrice,
    btcExit: state.btcPrice,
  };
  
  state.trades.push(trade);
  state.stats.trades++;
  
  if (pnlUsd > 0) {
    state.stats.wins++;
    state.stats.totalProfit += pnlUsd;
    if (pnlUsd > state.stats.largestWin) state.stats.largestWin = pnlUsd;
  } else if (pnlUsd < 0) {
    state.stats.losses++;
    state.stats.totalLoss += Math.abs(pnlUsd);
    if (Math.abs(pnlUsd) > state.stats.largestLoss) state.stats.largestLoss = Math.abs(pnlUsd);
  } else {
    state.stats.breakeven++;
  }
  
  const emoji = pnlUsd > 0 ? '💰' : pnlUsd < 0 ? '📉' : '➖';
  log(`EXIT: ${state.positionSide} @ $${exitPrice.toFixed(4)} | ${emoji} ${pnlUsd >= 0 ? '+' : ''}$${pnlUsd.toFixed(2)} (${(pnlPct * 100).toFixed(2)}%) | ${reason}`, 'exit');
  
  // Reset
  state.inPosition = false;
  state.positionSide = null;
  state.entryPrice = null;
  state.entryTime = null;
  
  saveState();
}

// =============================================================================
// REPORTING
// =============================================================================

function saveState() {
  const data = {
    stats: state.stats,
    trades: state.trades,
    lastUpdate: new Date().toISOString(),
  };
  fs.writeFileSync('/Users/ruby/.openclaw/workspace/projects/btc-15m-arbitrage/bot-24h-trades.json', JSON.stringify(data, null, 2));
}

function logStatus() {
  const runtime = (Date.now() - new Date(state.stats.startTime).getTime()) / 3600000;
  const netPnl = state.stats.totalProfit - state.stats.totalLoss;
  const winRate = state.stats.trades > 0 ? (state.stats.wins / state.stats.trades * 100).toFixed(1) : 0;
  
  console.log('\n' + '─'.repeat(50));
  console.log(`⏱️  Runtime: ${runtime.toFixed(2)}h | Mode: ${CONFIG.mode.toUpperCase()}`);
  console.log(`📊 Signals: ${state.stats.signals} | Trades: ${state.stats.trades} | Win Rate: ${winRate}%`);
  console.log(`💰 Net P&L: $${netPnl.toFixed(2)} | Wins: $${state.stats.totalProfit.toFixed(2)} | Losses: $${state.stats.totalLoss.toFixed(2)}`);
  console.log(`₿  BTC: $${state.btcPrice?.toFixed(2) || 'N/A'} | Range: $${state.btcLow?.toFixed(0) || '?'}-$${state.btcHigh?.toFixed(0) || '?'}`);
  if (state.currentMarket) {
    const timeLeft = Math.max(0, (state.marketEndTime - Date.now()) / 60000);
    console.log(`📈 Market: ${state.currentMarket.title.split(' - ')[1]} | ${timeLeft.toFixed(1)}m left`);
  }
  console.log('─'.repeat(50) + '\n');
}

function generateHourlyReport() {
  const runtime = (Date.now() - new Date(state.stats.startTime).getTime()) / 3600000;
  const netPnl = state.stats.totalProfit - state.stats.totalLoss;
  
  const report = {
    hour: Math.floor(runtime),
    timestamp: new Date().toISOString(),
    signals: state.stats.signals,
    trades: state.stats.trades,
    wins: state.stats.wins,
    losses: state.stats.losses,
    netPnl: netPnl,
    btcRange: `$${state.btcLow?.toFixed(0)}-$${state.btcHigh?.toFixed(0)}`,
  };
  
  state.hourlyReports.push(report);
  saveState();
  
  log(`HOURLY REPORT: Hour ${report.hour} | Trades: ${report.trades} | Net: $${netPnl.toFixed(2)}`, 'info');
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  // Clear log file
  fs.writeFileSync(LOG_FILE, `=== BTC 15m Latency Bot Started ${new Date().toISOString()} ===\n`);
  
  console.clear();
  log('🚀 BTC 15m LATENCY ARBITRAGE BOT - 24 HOUR RUN', 'info');
  log(`Mode: ${CONFIG.mode.toUpperCase()} | Position size: $${CONFIG.position.size}`, 'info');
  log(`Thresholds: BTC move ${CONFIG.latency.btcMoveThreshold * 100}% | Profit target ${CONFIG.latency.exitProfitTarget * 100}%`, 'info');
  
  state.stats.startTime = new Date().toISOString();
  
  // Initial market fetch
  const market = await fetchCurrentMarket();
  if (market) {
    state.currentMarket = market;
    state.upTokenId = market.upTokenId;
    state.downTokenId = market.downTokenId;
    state.upPrice = market.upPrice;
    state.downPrice = market.downPrice;
    state.marketEndTime = market.endDate.getTime();
    state.stats.marketsWatched++;
    log(`Watching: ${market.title}`, 'info');
  }
  
  // Connect Binance
  const binanceWs = connectBinance();
  
  // Start polling
  const pollInterval = setInterval(fetchOrderBooks, CONFIG.pollIntervalMs);
  
  // Status logging
  const statusInterval = setInterval(logStatus, CONFIG.statusIntervalMs);
  
  // Hourly reports
  const reportInterval = setInterval(generateHourlyReport, CONFIG.reportIntervalMs);
  
  // Market refresh
  const marketInterval = setInterval(async () => {
    const newMarket = await fetchCurrentMarket();
    if (newMarket && newMarket.id !== state.currentMarket?.id) {
      state.currentMarket = newMarket;
      state.upTokenId = newMarket.upTokenId;
      state.downTokenId = newMarket.downTokenId;
      state.marketEndTime = newMarket.endDate.getTime();
      state.stats.marketsWatched++;
      log(`New market: ${newMarket.title}`, 'info');
    }
  }, 30000);
  
  // 24 hour timeout
  setTimeout(() => {
    clearInterval(pollInterval);
    clearInterval(statusInterval);
    clearInterval(reportInterval);
    clearInterval(marketInterval);
    binanceWs.close();
    
    // Final report
    const netPnl = state.stats.totalProfit - state.stats.totalLoss;
    log('═'.repeat(50), 'info');
    log('24 HOUR RUN COMPLETE', 'success');
    log(`Total signals: ${state.stats.signals}`, 'info');
    log(`Total trades: ${state.stats.trades}`, 'info');
    log(`Win/Loss/BE: ${state.stats.wins}/${state.stats.losses}/${state.stats.breakeven}`, 'info');
    log(`Net P&L: $${netPnl.toFixed(2)}`, 'money');
    log('═'.repeat(50), 'info');
    
    saveState();
    process.exit(0);
  }, CONFIG.runTimeMs);
  
  log('Bot running for 24 hours. Check bot-24h.log for updates.', 'info');
}

process.on('SIGINT', () => {
  log('Shutting down...', 'warning');
  saveState();
  process.exit(0);
});

main().catch(e => {
  log(`Fatal: ${e.message}`, 'error');
  process.exit(1);
});
