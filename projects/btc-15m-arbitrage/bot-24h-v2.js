#!/usr/bin/env node

/**
 * BTC 15m LATENCY ARBITRAGE Bot - V2 (FIXED)
 * 
 * Fixes:
 * 1. Rate limits signal checking (max 1/second)
 * 2. Validates prices before EVERY trade decision
 * 3. Skips resolved markets (any price > 0.85)
 * 4. Auto-refreshes to next market when current expires
 */

require('dotenv').config();
const WebSocket = require('ws');
const fetch = require('node-fetch');
const fs = require('fs');

const CONFIG = {
  mode: 'paper', // 'live' when funded
  latency: {
    btcMoveThreshold: 0.001,     // 0.1% BTC move required
    priceWindowSec: 30,
    exitProfitTarget: 0.008,     // 0.8% profit target
    exitTimeoutSec: 120,
    stopLossPct: 0.05,           // 5% stop loss
    minTimeBetweenTrades: 30000, // 30 sec between trades
    minTimeBetweenSignals: 1000, // Rate limit: 1 signal check/sec
  },
  position: { size: 25 },
  api: {
    gamma: 'https://gamma-api.polymarket.com',
  },
  ws: {
    binance: 'wss://stream.binance.com:9443/ws/btcusdt@trade',
  },
  marketRefreshMs: 30000, // Refresh market every 30 sec
  statusIntervalMs: 300000,  // 5 min status
  runTimeMs: 24 * 60 * 60 * 1000,
};

const state = {
  currentMarket: null,
  upPrice: null,
  downPrice: null,
  btcPrice: null,
  btcPrices: [],
  inPosition: false,
  positionSide: null,
  entryPrice: null,
  entryBtcPrice: null,
  entryTime: null,
  lastTradeTime: 0,
  lastSignalCheck: 0,
  stats: {
    startTime: Date.now(),
    signals: 0,
    trades: 0,
    wins: 0,
    losses: 0,
    breakeven: 0,
    totalPnl: 0,
  },
  trades: [],
};

const LOG_FILE = '/Users/ruby/.openclaw/workspace/projects/btc-15m-arbitrage/bot-v2.log';

function log(msg, type = 'info') {
  const time = new Date().toLocaleTimeString('en-US', { hour12: false });
  const prefix = { 
    info: '📊', success: '✅', warning: '⚠️', error: '❌', 
    signal: '🎯', entry: '📈', exit: '📉', money: '💰',
    skip: '⏭️', market: '🏪'
  }[type] || 'ℹ️';
  const line = `[${time}] ${prefix} ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

function isMarketValid() {
  // Must have prices
  if (!state.upPrice || !state.downPrice) return false;
  
  // Prices must sum to ~1
  const spread = state.upPrice + state.downPrice;
  if (spread < 0.95 || spread > 1.05) {
    log(`Invalid spread: ${spread.toFixed(4)}`, 'skip');
    return false;
  }
  
  // Neither price should be extreme (market resolved)
  if (state.upPrice > 0.85 || state.upPrice < 0.15) {
    log(`Market resolved or near-resolved: UP=$${state.upPrice.toFixed(3)}`, 'skip');
    return false;
  }
  if (state.downPrice > 0.85 || state.downPrice < 0.15) {
    log(`Market resolved or near-resolved: DOWN=$${state.downPrice.toFixed(3)}`, 'skip');
    return false;
  }
  
  // Market must not be expired
  if (state.currentMarket?.endDate && new Date() > state.currentMarket.endDate) {
    log(`Market expired: ${state.currentMarket.title}`, 'skip');
    return false;
  }
  
  return true;
}

async function fetchMarketPrices() {
  try {
    const resp = await fetch(`${CONFIG.api.gamma}/series/10192`);
    const series = await resp.json();
    
    const now = new Date();
    const active = series.events
      .filter(e => !e.closed && new Date(e.endDate) > now)
      .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))[0];
    
    if (!active) {
      log('No active market found', 'warning');
      state.upPrice = null;
      state.downPrice = null;
      return;
    }
    
    const eventResp = await fetch(`${CONFIG.api.gamma}/events/${active.id}`);
    const eventData = await eventResp.json();
    const market = eventData.markets?.[0];
    
    if (!market) {
      log('No market data', 'warning');
      return;
    }
    
    const prices = JSON.parse(market.outcomePrices || '[0.5,0.5]');
    state.upPrice = parseFloat(prices[0]);
    state.downPrice = parseFloat(prices[1]);
    
    const isNew = !state.currentMarket || state.currentMarket.id !== active.id;
    state.currentMarket = { 
      id: active.id, 
      title: active.title, 
      endDate: new Date(active.endDate) 
    };
    
    if (isNew) {
      log(`NEW MARKET: ${active.title}`, 'market');
      log(`Prices: UP=$${state.upPrice.toFixed(3)} DOWN=$${state.downPrice.toFixed(3)}`, 'info');
    }
  } catch (e) {
    log(`API error: ${e.message}`, 'error');
  }
}

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
        
        // Keep 60 sec window
        state.btcPrices = state.btcPrices.filter(p => p.time > now - 60000);
        
        // Rate limit signal checking
        if (now - state.lastSignalCheck >= CONFIG.latency.minTimeBetweenSignals) {
          state.lastSignalCheck = now;
          checkSignal();
        }
      }
    } catch (e) {}
  });
  
  ws.on('close', () => {
    log('Binance disconnected, reconnecting in 5s...', 'warning');
    setTimeout(connectBinance, 5000);
  });
  
  ws.on('error', (e) => log(`Binance error: ${e.message}`, 'error'));
  
  return ws;
}

function checkSignal() {
  // If in position, check for exit
  if (state.inPosition) {
    checkExit();
    return;
  }
  
  // CRITICAL: Validate market before any trading logic
  if (!isMarketValid()) return;
  
  // Cooldown between trades
  const timeSinceLastTrade = Date.now() - state.lastTradeTime;
  if (timeSinceLastTrade < CONFIG.latency.minTimeBetweenTrades) return;
  
  // Need enough price history
  if (state.btcPrices.length < 30) return;
  
  // Calculate BTC movement over window
  const windowStart = Date.now() - (CONFIG.latency.priceWindowSec * 1000);
  const recent = state.btcPrices.filter(p => p.time > windowStart);
  if (recent.length < 15) return;
  
  const oldPrice = recent[0].price;
  const btcMove = (state.btcPrice - oldPrice) / oldPrice;
  
  // Only trade on significant moves
  if (Math.abs(btcMove) < CONFIG.latency.btcMoveThreshold) return;
  
  // Determine direction
  const side = btcMove > 0 ? 'UP' : 'DOWN';
  const entryPrice = side === 'UP' ? state.upPrice : state.downPrice;
  
  // Don't enter if price already moved significantly (we're too late)
  if (entryPrice > 0.55) {
    log(`Skipping ${side}: price already at $${entryPrice.toFixed(3)} (too late)`, 'skip');
    return;
  }
  
  // SIGNAL DETECTED
  state.stats.signals++;
  const spread = (state.upPrice + state.downPrice).toFixed(4);
  log(`SIGNAL #${state.stats.signals}: BTC ${btcMove > 0 ? '↑' : '↓'} ${(btcMove * 100).toFixed(3)}% | Spread: $${spread}`, 'signal');
  
  // Enter position (paper or live)
  state.inPosition = true;
  state.positionSide = side;
  state.entryPrice = entryPrice;
  state.entryBtcPrice = state.btcPrice;
  state.entryTime = Date.now();
  state.lastTradeTime = Date.now();
  state.stats.trades++;
  
  log(`ENTRY: ${side} @ $${entryPrice.toFixed(4)} | BTC: $${state.btcPrice.toFixed(2)}`, 'entry');
}

function checkExit() {
  if (!state.inPosition) return;
  
  // Re-validate market
  if (!state.upPrice || !state.downPrice) return;
  
  const currentPrice = state.positionSide === 'UP' ? state.upPrice : state.downPrice;
  const pnlPct = (currentPrice - state.entryPrice) / state.entryPrice;
  const pnlDollars = pnlPct * CONFIG.position.size;
  const holdTime = (Date.now() - state.entryTime) / 1000;
  
  let exitReason = null;
  
  // Profit target
  if (pnlPct >= CONFIG.latency.exitProfitTarget) {
    exitReason = 'profit_target';
  }
  // Stop loss
  else if (pnlPct <= -CONFIG.latency.stopLossPct) {
    exitReason = 'stop_loss';
  }
  // Timeout
  else if (holdTime >= CONFIG.latency.exitTimeoutSec) {
    exitReason = 'timeout';
  }
  // Market resolved (extreme price)
  else if (currentPrice > 0.9 || currentPrice < 0.1) {
    exitReason = 'market_resolved';
  }
  
  if (!exitReason) return;
  
  // Exit
  state.inPosition = false;
  state.stats.totalPnl += pnlDollars;
  
  if (pnlDollars > 0.5) state.stats.wins++;
  else if (pnlDollars < -0.5) state.stats.losses++;
  else state.stats.breakeven++;
  
  const emoji = pnlDollars >= 0 ? '📈' : '📉';
  log(`EXIT: ${state.positionSide} @ $${currentPrice.toFixed(4)} | ${emoji} $${pnlDollars.toFixed(2)} (${(pnlPct * 100).toFixed(2)}%) | ${exitReason}`, 'exit');
  
  state.trades.push({
    time: new Date().toISOString(),
    side: state.positionSide,
    entry: state.entryPrice,
    exit: currentPrice,
    pnl: pnlDollars,
    reason: exitReason,
  });
  
  // Reset position state
  state.positionSide = null;
  state.entryPrice = null;
  state.entryBtcPrice = null;
  state.entryTime = null;
}

function printStatus() {
  const runtime = Math.floor((Date.now() - state.stats.startTime) / 60000);
  const winRate = state.stats.trades > 0 ? ((state.stats.wins / state.stats.trades) * 100).toFixed(1) : '0.0';
  
  log('═══════════════════════════════════════', 'info');
  log(`STATUS REPORT (${runtime} min runtime)`, 'info');
  log(`Market: ${state.currentMarket?.title || 'None'}`, 'info');
  log(`Prices: UP=$${state.upPrice?.toFixed(3) || '?'} DOWN=$${state.downPrice?.toFixed(3) || '?'}`, 'info');
  log(`BTC: $${state.btcPrice?.toFixed(2) || '?'}`, 'info');
  log(`Signals: ${state.stats.signals} | Trades: ${state.stats.trades}`, 'info');
  log(`W/L/B: ${state.stats.wins}/${state.stats.losses}/${state.stats.breakeven} (${winRate}% win)`, 'info');
  log(`Total PnL: $${state.stats.totalPnl.toFixed(2)}`, state.stats.totalPnl >= 0 ? 'money' : 'error');
  log(`Mode: ${CONFIG.mode.toUpperCase()}`, 'info');
  log('═══════════════════════════════════════', 'info');
}

async function main() {
  log('╔═══════════════════════════════════════╗', 'info');
  log('║  BTC 15m LATENCY ARB BOT v2 (FIXED)   ║', 'info');
  log('╚═══════════════════════════════════════╝', 'info');
  log(`Mode: ${CONFIG.mode.toUpperCase()}`, 'info');
  log(`BTC threshold: ${CONFIG.latency.btcMoveThreshold * 100}%`, 'info');
  log(`Position size: $${CONFIG.position.size}`, 'info');
  
  // Initial market fetch
  await fetchMarketPrices();
  
  // Connect to Binance
  connectBinance();
  
  // Periodic market refresh
  setInterval(fetchMarketPrices, CONFIG.marketRefreshMs);
  
  // Status reports
  setInterval(printStatus, CONFIG.statusIntervalMs);
  
  // Runtime limit
  setTimeout(() => {
    log('24h runtime reached. Exiting.', 'info');
    printStatus();
    process.exit(0);
  }, CONFIG.runTimeMs);
}

main().catch(e => {
  log(`Fatal error: ${e.message}`, 'error');
  process.exit(1);
});
