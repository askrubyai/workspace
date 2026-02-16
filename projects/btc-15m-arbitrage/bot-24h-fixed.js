#!/usr/bin/env node

/**
 * BTC 15m LATENCY ARBITRAGE Bot - FIXED VERSION
 * 
 * Uses Gamma API prices (more reliable) instead of CLOB order books
 * Added sanity checks to prevent bad trades
 */

require('dotenv').config();
const WebSocket = require('ws');
const fetch = require('node-fetch');
const fs = require('fs');

const CONFIG = {
  mode: 'paper',
  latency: {
    btcMoveThreshold: 0.002,     // 0.2% BTC move required
    priceWindowSec: 30,
    exitProfitTarget: 0.01,      // 1% profit target
    exitTimeoutSec: 120,
    stopLossPct: 0.03,           // 3% stop loss
    minTimeBetweenTrades: 60000, // 1 min between trades
  },
  position: { size: 25 },
  api: {
    gamma: 'https://gamma-api.polymarket.com',
  },
  ws: {
    binance: 'wss://stream.binance.com:9443/ws/btcusdt@trade',
  },
  pollIntervalMs: 1000,
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
  entryTime: null,
  lastTradeTime: 0,
  stats: {
    startTime: null,
    signals: 0,
    trades: 0,
    wins: 0,
    losses: 0,
    breakeven: 0,
    totalProfit: 0,
    totalLoss: 0,
  },
  trades: [],
};

const LOG_FILE = '/Users/ruby/.openclaw/workspace/projects/btc-15m-arbitrage/bot-fixed.log';

function log(msg, type = 'info') {
  const time = new Date().toLocaleTimeString('en-US', { hour12: false });
  const prefix = { info: '📊', success: '✅', warning: '⚠️', error: '❌', signal: '🎯', entry: '📈', exit: '📉', money: '💰' }[type] || 'ℹ️';
  const line = `[${time}] ${prefix} ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

async function fetchMarketPrices() {
  try {
    const resp = await fetch(`${CONFIG.api.gamma}/series/10192`);
    const series = await resp.json();
    
    const now = new Date();
    const active = series.events
      .filter(e => !e.closed && new Date(e.endDate) > now)
      .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))[0];
    
    if (!active) return;
    
    const eventResp = await fetch(`${CONFIG.api.gamma}/events/${active.id}`);
    const eventData = await eventResp.json();
    const market = eventData.markets?.[0];
    
    if (!market) return;
    
    const prices = JSON.parse(market.outcomePrices || '[0.5,0.5]');
    const newUp = parseFloat(prices[0]);
    const newDown = parseFloat(prices[1]);
    
    // Sanity check - prices should be between 0.1 and 0.9 and sum to ~1
    const sum = newUp + newDown;
    if (sum < 0.95 || sum > 1.05) {
      log(`Bad prices: UP=$${newUp} DOWN=$${newDown} SUM=$${sum}`, 'warning');
      return;
    }
    if (newUp < 0.1 || newUp > 0.9 || newDown < 0.1 || newDown > 0.9) {
      return; // Skip extreme prices
    }
    
    state.upPrice = newUp;
    state.downPrice = newDown;
    
    if (!state.currentMarket || state.currentMarket.id !== active.id) {
      state.currentMarket = { id: active.id, title: active.title, endDate: new Date(active.endDate) };
      log(`Market: ${active.title}`, 'info');
    }
  } catch (e) {
    // Retry next poll
  }
}

function connectBinance() {
  const ws = new WebSocket(CONFIG.ws.binance);
  
  ws.on('open', () => log('Binance connected', 'success'));
  
  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.p) {
        const price = parseFloat(msg.p);
        const now = Date.now();
        
        state.btcPrice = price;
        state.btcPrices.push({ price, time: now });
        
        // Keep 60 sec
        state.btcPrices = state.btcPrices.filter(p => p.time > now - 60000);
        
        checkSignal();
      }
    } catch (e) {}
  });
  
  ws.on('close', () => {
    log('Binance disconnected, reconnecting...', 'warning');
    setTimeout(connectBinance, 5000);
  });
  
  ws.on('error', () => {});
  
  return ws;
}

function checkSignal() {
  if (state.inPosition) {
    checkExit();
    return;
  }
  
  // Cooldown between trades
  if (Date.now() - state.lastTradeTime < CONFIG.latency.minTimeBetweenTrades) return;
  
  if (state.btcPrices.length < 30) return;
  if (!state.upPrice || !state.downPrice) return;
  
  const windowStart = Date.now() - (CONFIG.latency.priceWindowSec * 1000);
  const recent = state.btcPrices.filter(p => p.time > windowStart);
  if (recent.length < 15) return;
  
  const oldPrice = recent[0].price;
  const btcMove = (state.btcPrice - oldPrice) / oldPrice;
  
  if (Math.abs(btcMove) < CONFIG.latency.btcMoveThreshold) return;
  
  // Check if spread is normal (~1.00)
  const spread = state.upPrice + state.downPrice;
  if (spread < 0.98 || spread > 1.02) return;
  
  const side = btcMove > 0 ? 'UP' : 'DOWN';
  const entryPrice = side === 'UP' ? state.upPrice : state.downPrice;
  
  // Don't enter if price already moved significantly
  if (side === 'UP' && state.upPrice > 0.55) return;
  if (side === 'DOWN' && state.downPrice > 0.55) return;
  
  state.stats.signals++;
  log(`SIGNAL #${state.stats.signals}: BTC ${btcMove > 0 ? '↑' : '↓'} ${(btcMove * 100).toFixed(3)}%`, 'signal');
  
  // Enter position
  state.inPosition = true;
  state.positionSide = side;
  state.entryPrice = entryPrice;
  state.entryTime = Date.now();
  state.lastTradeTime = Date.now();
  
  log(`ENTRY: ${side} @ $${entryPrice.toFixed(4)}`, 'entry');
}

function checkExit() {
  if (!state.inPosition) return;
  
  const holdTime = (Date.now() - state.entryTime) / 1000;
  const currentPrice = state.positionSide === 'UP' ? state.upPrice : state.downPrice;
  
  if (!currentPrice) return;
  
  const pnlPct = (currentPrice - state.entryPrice) / state.entryPrice;
  
  let shouldExit = false;
  let reason = '';
  
  if (pnlPct >= CONFIG.latency.exitProfitTarget) {
    shouldExit = true;
    reason = 'profit';
  } else if (holdTime >= CONFIG.latency.exitTimeoutSec) {
    shouldExit = true;
    reason = 'timeout';
  } else if (pnlPct <= -CONFIG.latency.stopLossPct) {
    shouldExit = true;
    reason = 'stop_loss';
  }
  
  if (shouldExit) {
    const pnlUsd = CONFIG.position.size * pnlPct;
    
    state.trades.push({
      time: new Date().toISOString(),
      side: state.positionSide,
      entry: state.entryPrice,
      exit: currentPrice,
      holdSec: holdTime,
      pnlPct,
      pnlUsd,
      reason,
    });
    
    state.stats.trades++;
    if (pnlUsd > 0) { state.stats.wins++; state.stats.totalProfit += pnlUsd; }
    else if (pnlUsd < 0) { state.stats.losses++; state.stats.totalLoss += Math.abs(pnlUsd); }
    else state.stats.breakeven++;
    
    const emoji = pnlUsd > 0 ? '💰' : pnlUsd < 0 ? '📉' : '➖';
    log(`EXIT: ${state.positionSide} @ $${currentPrice.toFixed(4)} | ${emoji} ${pnlUsd >= 0 ? '+' : ''}$${pnlUsd.toFixed(2)} | ${reason}`, 'exit');
    
    state.inPosition = false;
    state.positionSide = null;
    saveState();
  }
}

function saveState() {
  fs.writeFileSync('/Users/ruby/.openclaw/workspace/projects/btc-15m-arbitrage/bot-fixed-trades.json', 
    JSON.stringify({ stats: state.stats, trades: state.trades }, null, 2));
}

function logStatus() {
  const runtime = (Date.now() - new Date(state.stats.startTime).getTime()) / 3600000;
  const net = state.stats.totalProfit - state.stats.totalLoss;
  const wr = state.stats.trades > 0 ? (state.stats.wins / state.stats.trades * 100).toFixed(0) : 0;
  
  log(`STATUS: ${runtime.toFixed(1)}h | Signals: ${state.stats.signals} | Trades: ${state.stats.trades} | WR: ${wr}% | Net: $${net.toFixed(2)}`, 'info');
}

async function main() {
  fs.writeFileSync(LOG_FILE, `=== Bot Started ${new Date().toISOString()} ===\n`);
  
  log('🚀 BTC 15m LATENCY BOT - FIXED VERSION', 'info');
  log('Mode: PAPER | 24 hour run', 'info');
  
  state.stats.startTime = new Date().toISOString();
  
  await fetchMarketPrices();
  connectBinance();
  
  setInterval(fetchMarketPrices, CONFIG.pollIntervalMs);
  setInterval(logStatus, CONFIG.statusIntervalMs);
  
  setTimeout(() => {
    log('24 HOUR RUN COMPLETE', 'success');
    const net = state.stats.totalProfit - state.stats.totalLoss;
    log(`Final: ${state.stats.trades} trades | Net: $${net.toFixed(2)}`, 'money');
    saveState();
    process.exit(0);
  }, CONFIG.runTimeMs);
}

process.on('SIGINT', () => { saveState(); process.exit(0); });

main().catch(e => { log(`Error: ${e.message}`, 'error'); process.exit(1); });
