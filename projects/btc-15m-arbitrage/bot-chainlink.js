#!/usr/bin/env node

/**
 * BTC 15m CHAINLINK ORACLE Bot - v3
 * 
 * Uses Polymarket's RTDS WebSocket for Chainlink prices
 * This is the SAME data source used for market resolution
 */

require('dotenv').config();
const WebSocket = require('ws');
const fetch = require('node-fetch');
const fs = require('fs');

const CONFIG = {
  mode: 'paper', // 'live' when funded
  ws: {
    rtds: 'wss://ws-live-data.polymarket.com/ws',
  },
  api: {
    gamma: 'https://gamma-api.polymarket.com',
  },
  position: { size: 25 },
  marketRefreshMs: 15000,
  runTimeMs: 24 * 60 * 60 * 1000,
};

const state = {
  currentMarket: null,
  marketStartPrice: null, // BTC price at market open (resolution baseline)
  chainlinkPrice: null,
  upPrice: null,
  downPrice: null,
  connected: false,
  inPosition: false,
  positionSide: null,
  entryPrice: null,
  entryTime: null,
  lastTradeTime: 0,
  stats: {
    startTime: Date.now(),
    signals: 0,
    trades: 0,
    wins: 0,
    losses: 0,
    totalPnl: 0,
  },
};

const LOG_FILE = '/Users/ruby/.openclaw/workspace/projects/btc-15m-arbitrage/bot-chainlink.log';

function log(msg, type = 'info') {
  const time = new Date().toLocaleTimeString('en-US', { hour12: false });
  const prefix = { 
    info: '📊', success: '✅', warning: '⚠️', error: '❌', 
    signal: '🎯', entry: '📈', exit: '📉', money: '💰',
    oracle: '🔮', market: '🏪'
  }[type] || 'ℹ️';
  const line = `[${time}] ${prefix} ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

async function fetchMarketData() {
  try {
    const resp = await fetch(`${CONFIG.api.gamma}/series/10192`);
    const series = await resp.json();
    
    const now = new Date();
    const active = series.events
      .filter(e => !e.closed && new Date(e.endDate) > now)
      .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))[0];
    
    if (!active) {
      log('No active market', 'warning');
      state.currentMarket = null;
      return;
    }
    
    const eventResp = await fetch(`${CONFIG.api.gamma}/events/${active.id}`);
    const eventData = await eventResp.json();
    const market = eventData.markets?.[0];
    
    if (!market) return;
    
    const prices = JSON.parse(market.outcomePrices || '[0.5,0.5]');
    state.upPrice = parseFloat(prices[0]);
    state.downPrice = parseFloat(prices[1]);
    
    const isNew = !state.currentMarket || state.currentMarket.id !== active.id;
    
    if (isNew) {
      // Parse market title to get start time and baseline price
      // "Bitcoin Up or Down - February 3, 12:00PM-12:15PM ET"
      state.currentMarket = { 
        id: active.id, 
        title: active.title, 
        startDate: new Date(active.startDate),
        endDate: new Date(active.endDate),
      };
      
      // Reset position on new market
      if (state.inPosition) {
        log(`Market changed while in position - forcing exit`, 'warning');
        state.inPosition = false;
      }
      
      // Capture baseline price at market start
      if (state.chainlinkPrice) {
        state.marketStartPrice = state.chainlinkPrice;
        log(`NEW MARKET: ${active.title}`, 'market');
        log(`Baseline BTC: $${state.marketStartPrice.toFixed(2)} (Chainlink)`, 'oracle');
        log(`Odds: UP=$${state.upPrice.toFixed(3)} DOWN=$${state.downPrice.toFixed(3)}`, 'info');
      } else {
        log(`NEW MARKET: ${active.title} (waiting for Chainlink price)`, 'market');
      }
    }
  } catch (e) {
    log(`API error: ${e.message}`, 'error');
  }
}

function connectRTDS() {
  const ws = new WebSocket(CONFIG.ws.rtds);
  
  ws.on('open', () => {
    log('RTDS WebSocket connected', 'success');
    state.connected = true;
    
    // Subscribe to Chainlink crypto prices
    ws.send(JSON.stringify({
      action: 'subscribe',
      subscriptions: [{
        topic: 'crypto_prices_chainlink',
        type: 'update',
        filters: 'btcusdt'
      }]
    }));
    
    log('Subscribed to Chainlink BTC/USDT', 'oracle');
  });
  
  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      
      // Handle price updates
      if (msg.topic === 'crypto_prices_chainlink' && msg.data) {
        const btcData = msg.data.find(d => d.symbol?.toLowerCase().includes('btc'));
        if (btcData && btcData.price) {
          const newPrice = parseFloat(btcData.price);
          
          if (state.chainlinkPrice !== newPrice) {
            state.chainlinkPrice = newPrice;
            
            // Set baseline if we have a market but no baseline yet
            if (state.currentMarket && !state.marketStartPrice) {
              state.marketStartPrice = newPrice;
              log(`Baseline set: $${newPrice.toFixed(2)}`, 'oracle');
            }
            
            checkSignal();
          }
        }
      }
      
      // Log subscription confirmations
      if (msg.type === 'subscribed') {
        log(`Subscription confirmed: ${msg.topic}`, 'success');
      }
      
    } catch (e) {
      // Non-JSON message, ignore
    }
  });
  
  ws.on('close', () => {
    log('RTDS disconnected, reconnecting in 5s...', 'warning');
    state.connected = false;
    setTimeout(connectRTDS, 5000);
  });
  
  ws.on('error', (e) => {
    log(`RTDS error: ${e.message}`, 'error');
  });
  
  return ws;
}

function checkSignal() {
  if (!state.currentMarket || !state.marketStartPrice || !state.chainlinkPrice) return;
  if (!state.upPrice || !state.downPrice) return;
  
  // Check if market is still tradeable (not resolved)
  if (state.upPrice > 0.9 || state.downPrice > 0.9) return;
  
  // Calculate where BTC is vs baseline
  const pctChange = ((state.chainlinkPrice - state.marketStartPrice) / state.marketStartPrice) * 100;
  const direction = pctChange > 0 ? 'UP' : 'DOWN';
  
  // Time remaining in market
  const timeLeft = (state.currentMarket.endDate - Date.now()) / 1000;
  if (timeLeft < 30) return; // Don't trade in last 30 sec
  
  if (state.inPosition) {
    checkExit(direction, pctChange, timeLeft);
    return;
  }
  
  // Cooldown
  if (Date.now() - state.lastTradeTime < 30000) return;
  
  // SIGNAL LOGIC: Trade when Chainlink shows clear direction but odds haven't caught up
  const absChange = Math.abs(pctChange);
  
  // Need meaningful move (>0.05%) and odds should still be near 50/50
  if (absChange < 0.05) return;
  
  const expectedWinnerPrice = direction === 'UP' ? state.upPrice : state.downPrice;
  
  // Edge: Oracle says direction but odds are still < 60%
  if (expectedWinnerPrice > 0.60) {
    log(`No edge: ${direction} already at $${expectedWinnerPrice.toFixed(3)}`, 'info');
    return;
  }
  
  // SIGNAL!
  state.stats.signals++;
  log(`SIGNAL #${state.stats.signals}: Chainlink ${direction} ${absChange.toFixed(3)}% | Odds: $${expectedWinnerPrice.toFixed(3)} | ${timeLeft.toFixed(0)}s left`, 'signal');
  
  // Enter
  state.inPosition = true;
  state.positionSide = direction;
  state.entryPrice = expectedWinnerPrice;
  state.entryTime = Date.now();
  state.lastTradeTime = Date.now();
  state.stats.trades++;
  
  log(`ENTRY: ${direction} @ $${state.entryPrice.toFixed(4)} | BTC: $${state.chainlinkPrice.toFixed(2)} vs baseline $${state.marketStartPrice.toFixed(2)}`, 'entry');
}

function checkExit(currentDirection, pctChange, timeLeft) {
  if (!state.inPosition) return;
  
  const currentPrice = state.positionSide === 'UP' ? state.upPrice : state.downPrice;
  const pnlPct = (currentPrice - state.entryPrice) / state.entryPrice;
  const pnlDollars = pnlPct * CONFIG.position.size;
  
  let exitReason = null;
  
  // Direction flipped against us
  if (currentDirection !== state.positionSide && Math.abs(pctChange) > 0.1) {
    exitReason = 'direction_flip';
  }
  // Take profit at 5%+
  else if (pnlPct >= 0.05) {
    exitReason = 'profit_target';
  }
  // Stop loss at -10%
  else if (pnlPct <= -0.10) {
    exitReason = 'stop_loss';
  }
  // Exit 15 sec before resolution
  else if (timeLeft < 15) {
    exitReason = 'pre_resolution';
  }
  // Market resolved
  else if (currentPrice > 0.9 || currentPrice < 0.1) {
    exitReason = 'market_resolved';
  }
  
  if (!exitReason) return;
  
  // Exit
  state.inPosition = false;
  state.stats.totalPnl += pnlDollars;
  
  if (pnlDollars > 0.5) state.stats.wins++;
  else if (pnlDollars < -0.5) state.stats.losses++;
  
  const emoji = pnlDollars >= 0 ? '📈' : '📉';
  log(`EXIT: ${state.positionSide} @ $${currentPrice.toFixed(4)} | ${emoji} $${pnlDollars.toFixed(2)} (${(pnlPct * 100).toFixed(2)}%) | ${exitReason}`, 'exit');
  
  state.positionSide = null;
  state.entryPrice = null;
  state.entryTime = null;
}

function printStatus() {
  const runtime = Math.floor((Date.now() - state.stats.startTime) / 60000);
  const winRate = state.stats.trades > 0 ? ((state.stats.wins / state.stats.trades) * 100).toFixed(1) : '0.0';
  
  log('═══════════════════════════════════════', 'info');
  log(`CHAINLINK BOT STATUS (${runtime} min)`, 'info');
  log(`Market: ${state.currentMarket?.title || 'None'}`, 'info');
  log(`Chainlink BTC: $${state.chainlinkPrice?.toFixed(2) || '?'}`, 'oracle');
  log(`Baseline: $${state.marketStartPrice?.toFixed(2) || '?'}`, 'oracle');
  log(`Odds: UP=$${state.upPrice?.toFixed(3) || '?'} DOWN=$${state.downPrice?.toFixed(3) || '?'}`, 'info');
  log(`Signals: ${state.stats.signals} | Trades: ${state.stats.trades}`, 'info');
  log(`W/L: ${state.stats.wins}/${state.stats.losses} (${winRate}%)`, 'info');
  log(`PnL: $${state.stats.totalPnl.toFixed(2)}`, state.stats.totalPnl >= 0 ? 'money' : 'error');
  log('═══════════════════════════════════════', 'info');
}

async function main() {
  log('╔═══════════════════════════════════════╗', 'info');
  log('║  BTC 15m CHAINLINK ORACLE BOT v3      ║', 'info');
  log('╚═══════════════════════════════════════╝', 'info');
  log(`Mode: ${CONFIG.mode.toUpperCase()}`, 'info');
  
  // Fetch initial market data
  await fetchMarketData();
  
  // Connect to Polymarket RTDS for Chainlink prices
  connectRTDS();
  
  // Periodic market refresh
  setInterval(fetchMarketData, CONFIG.marketRefreshMs);
  
  // Status every 5 min
  setInterval(printStatus, 300000);
  
  // Runtime limit
  setTimeout(() => {
    log('24h runtime reached. Exiting.', 'info');
    printStatus();
    process.exit(0);
  }, CONFIG.runTimeMs);
}

main().catch(e => {
  log(`Fatal: ${e.message}`, 'error');
  process.exit(1);
});
