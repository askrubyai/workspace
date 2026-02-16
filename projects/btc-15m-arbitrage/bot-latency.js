#!/usr/bin/env node

/**
 * BTC 15-Minute LATENCY ARBITRAGE Bot
 * 
 * Strategy: Exploit the ~30 second delay between Binance price moves
 * and Polymarket odds updates.
 * 
 * When BTC moves on Binance but Polymarket odds are stale:
 * - BTC pumps → Buy YES (UP)
 * - BTC dumps → Buy NO (DOWN)
 * - Exit when Polymarket catches up
 */

require('dotenv').config();
const WebSocket = require('ws');
const fetch = require('node-fetch');
const fs = require('fs');

// =============================================================================
// CONFIGURATION
// =============================================================================

const CONFIG = {
  // Latency arbitrage thresholds
  latency: {
    btcMoveThreshold: 0.0015,    // 0.15% BTC move triggers signal
    priceWindowSec: 30,          // Look at BTC moves in last 30 sec
    staleOddsThreshold: 0.02,    // Odds "stale" if they should've moved 2%+
    exitProfitTarget: 0.01,      // Exit at 1% profit
    exitTimeoutSec: 120,         // Max hold time 2 min
    minOddsMove: 0.005,          // Min odds move to consider "caught up"
  },
  
  // Position sizing
  position: {
    size: 50,  // $ per trade
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
  
  // Polling interval for Polymarket prices
  pollIntervalMs: 500,  // Poll every 500ms for fast detection
};

// =============================================================================
// STATE
// =============================================================================

const state = {
  // Market data
  currentMarket: null,
  upTokenId: null,
  downTokenId: null,
  marketEndTime: null,
  
  // Polymarket prices
  upPrice: null,
  downPrice: null,
  lastPriceUpdate: null,
  
  // BTC price tracking
  btcPrice: null,
  btcPrices: [],        // [{price, time}] - last N seconds of prices
  btcPriceAtSignal: null,
  
  // Position tracking
  inPosition: false,
  positionSide: null,   // 'UP' or 'DOWN'
  entryPrice: null,
  entryTime: null,
  entryBtcPrice: null,
  entryOdds: null,
  
  // Stats
  stats: {
    signals: 0,
    trades: 0,
    wins: 0,
    losses: 0,
    totalProfit: 0,
    totalLoss: 0,
    startTime: null,
    btcUpdates: 0,
    pricePolls: 0,
  },
  
  // Trade log
  trades: [],
};

// =============================================================================
// LOGGING
// =============================================================================

function log(msg, type = 'info') {
  const now = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const prefix = {
    info: '📊',
    success: '✅',
    warning: '⚠️',
    error: '❌',
    money: '💰',
    signal: '🎯',
    entry: '📈',
    exit: '📉',
    btc: '₿',
  }[type] || 'ℹ️';
  
  console.log(`[${now}] ${prefix} ${msg}`);
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

async function fetchLivePrices() {
  if (!state.upTokenId || !state.downTokenId) return;
  
  state.stats.pricePolls++;
  
  try {
    // Fetch order books for both tokens
    const [upResp, downResp] = await Promise.all([
      fetch(`${CONFIG.api.clob}/book?token_id=${state.upTokenId}`),
      fetch(`${CONFIG.api.clob}/book?token_id=${state.downTokenId}`),
    ]);
    
    const [upBook, downBook] = await Promise.all([upResp.json(), downResp.json()]);
    
    // Get mid prices
    const upMid = getMidPrice(upBook);
    const downMid = getMidPrice(downBook);
    
    if (upMid !== null) state.upPrice = upMid;
    if (downMid !== null) state.downPrice = downMid;
    state.lastPriceUpdate = Date.now();
    
  } catch (e) {
    // Ignore errors, will retry
  }
}

function getMidPrice(book) {
  const bestBid = book.bids?.[0] ? parseFloat(book.bids[0].price) : null;
  const bestAsk = book.asks?.[0] ? parseFloat(book.asks[0].price) : null;
  
  if (bestBid && bestAsk) return (bestBid + bestAsk) / 2;
  if (bestBid) return bestBid;
  if (bestAsk) return bestAsk;
  return null;
}

// =============================================================================
// BINANCE WEBSOCKET
// =============================================================================

function connectBinance() {
  log('Connecting to Binance WebSocket...', 'info');
  
  const ws = new WebSocket(CONFIG.ws.binance);
  
  ws.on('open', () => {
    log('Binance WebSocket connected', 'success');
  });
  
  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.p) {
        const price = parseFloat(msg.p);
        const now = Date.now();
        
        state.btcPrice = price;
        state.btcPrices.push({ price, time: now });
        state.stats.btcUpdates++;
        
        // Keep only last 60 seconds of prices
        const cutoff = now - 60000;
        state.btcPrices = state.btcPrices.filter(p => p.time > cutoff);
        
        // Check for latency opportunity
        checkLatencyOpportunity();
      }
    } catch (e) {
      // Ignore
    }
  });
  
  ws.on('error', (err) => {
    log(`Binance error: ${err.message}`, 'error');
  });
  
  ws.on('close', () => {
    log('Binance WebSocket closed, reconnecting...', 'warning');
    setTimeout(connectBinance, 2000);
  });
  
  return ws;
}

// =============================================================================
// LATENCY ARBITRAGE LOGIC
// =============================================================================

function checkLatencyOpportunity() {
  // Skip if already in position
  if (state.inPosition) {
    checkExit();
    return;
  }
  
  // Need enough price history
  if (state.btcPrices.length < 10) return;
  if (!state.upPrice || !state.downPrice) return;
  
  // Calculate BTC move in the window
  const now = Date.now();
  const windowStart = now - (CONFIG.latency.priceWindowSec * 1000);
  const recentPrices = state.btcPrices.filter(p => p.time > windowStart);
  
  if (recentPrices.length < 5) return;
  
  const oldPrice = recentPrices[0].price;
  const newPrice = state.btcPrice;
  const btcMove = (newPrice - oldPrice) / oldPrice;
  
  // Check if BTC moved enough
  if (Math.abs(btcMove) < CONFIG.latency.btcMoveThreshold) return;
  
  // Determine expected odds direction
  const expectedDirection = btcMove > 0 ? 'UP' : 'DOWN';
  
  // Check if Polymarket odds are stale
  // If BTC pumped 0.15%, UP odds should have increased
  // Expected odds move ≈ btcMove * sensitivity (roughly 1:1 for 15m markets near 0.5)
  const currentOdds = expectedDirection === 'UP' ? state.upPrice : state.downPrice;
  
  // We expect odds to have moved roughly proportional to BTC move
  // If they haven't, there's a latency opportunity
  const spread = state.upPrice + state.downPrice;
  
  // Signal: BTC moved significantly, but spread is still ~1.00 (odds haven't adjusted)
  if (spread > 0.995 && spread < 1.005) {
    // Odds appear stale - they haven't reacted to BTC move yet
    state.stats.signals++;
    
    log(`SIGNAL: BTC ${btcMove > 0 ? '↑' : '↓'} ${(Math.abs(btcMove) * 100).toFixed(3)}% | Odds stale (spread: $${spread.toFixed(4)})`, 'signal');
    
    // Enter position
    enterPosition(expectedDirection, btcMove);
  }
}

function enterPosition(side, btcMove) {
  state.inPosition = true;
  state.positionSide = side;
  state.entryTime = Date.now();
  state.entryBtcPrice = state.btcPrice;
  state.entryOdds = side === 'UP' ? state.upPrice : state.downPrice;
  state.entryPrice = state.entryOdds;
  
  log(`ENTRY: ${side} @ $${state.entryOdds.toFixed(4)} | BTC: $${state.btcPrice.toFixed(2)} | Move: ${(btcMove * 100).toFixed(3)}%`, 'entry');
}

function checkExit() {
  if (!state.inPosition) return;
  
  const now = Date.now();
  const holdTime = (now - state.entryTime) / 1000;
  const currentOdds = state.positionSide === 'UP' ? state.upPrice : state.downPrice;
  const oddsMove = currentOdds - state.entryOdds;
  const profitPct = oddsMove / state.entryOdds;
  
  let shouldExit = false;
  let exitReason = '';
  
  // Exit conditions
  if (profitPct >= CONFIG.latency.exitProfitTarget) {
    shouldExit = true;
    exitReason = 'profit_target';
  } else if (holdTime >= CONFIG.latency.exitTimeoutSec) {
    shouldExit = true;
    exitReason = 'timeout';
  } else if (profitPct < -0.03) {
    // Stop loss at -3%
    shouldExit = true;
    exitReason = 'stop_loss';
  }
  
  if (shouldExit) {
    exitPosition(currentOdds, exitReason, holdTime);
  }
}

function exitPosition(exitOdds, reason, holdTime) {
  const profitPct = (exitOdds - state.entryOdds) / state.entryOdds;
  const profitUsd = CONFIG.position.size * profitPct;
  
  const trade = {
    time: new Date().toISOString(),
    side: state.positionSide,
    entryOdds: state.entryOdds,
    exitOdds: exitOdds,
    entryBtcPrice: state.entryBtcPrice,
    exitBtcPrice: state.btcPrice,
    holdTimeSec: holdTime,
    profitPct: profitPct,
    profitUsd: profitUsd,
    reason: reason,
  };
  
  state.trades.push(trade);
  state.stats.trades++;
  
  if (profitUsd >= 0) {
    state.stats.wins++;
    state.stats.totalProfit += profitUsd;
  } else {
    state.stats.losses++;
    state.stats.totalLoss += Math.abs(profitUsd);
  }
  
  const emoji = profitUsd >= 0 ? '💰' : '📉';
  log(`EXIT: ${state.positionSide} @ $${exitOdds.toFixed(4)} | ${emoji} ${profitUsd >= 0 ? '+' : ''}$${profitUsd.toFixed(2)} (${(profitPct * 100).toFixed(2)}%) | ${reason} | Hold: ${holdTime.toFixed(1)}s`, 'exit');
  
  // Reset position
  state.inPosition = false;
  state.positionSide = null;
  state.entryOdds = null;
  state.entryTime = null;
  state.entryBtcPrice = null;
  
  // Save trades
  saveTrades();
}

function saveTrades() {
  const data = {
    stats: state.stats,
    trades: state.trades,
  };
  fs.writeFileSync('/Users/ruby/.openclaw/workspace/projects/btc-15m-arbitrage/latency-trades.json', JSON.stringify(data, null, 2));
}

// =============================================================================
// STATUS DISPLAY
// =============================================================================

function displayStatus() {
  console.clear();
  console.log('═'.repeat(65));
  console.log('🚀 BTC 15m LATENCY ARBITRAGE BOT - Paper Trading');
  console.log('═'.repeat(65));
  
  if (state.currentMarket) {
    const timeLeft = Math.max(0, (state.marketEndTime - Date.now()) / 60000);
    console.log(`\n📊 Market: ${state.currentMarket.title}`);
    console.log(`⏰ Time left: ${timeLeft.toFixed(1)} min`);
  }
  
  console.log('\n' + '─'.repeat(65));
  console.log('PRICES');
  console.log('─'.repeat(65));
  
  const btcColor = '\x1b[33m';  // Yellow for BTC
  const reset = '\x1b[0m';
  console.log(`   BTC:  ${btcColor}$${state.btcPrice?.toFixed(2) || 'N/A'}${reset}`);
  console.log(`   UP:   $${state.upPrice?.toFixed(4) || 'N/A'}`);
  console.log(`   DOWN: $${state.downPrice?.toFixed(4) || 'N/A'}`);
  
  const spread = (state.upPrice || 0) + (state.downPrice || 0);
  console.log(`   SUM:  $${spread.toFixed(4)}`);
  
  if (state.inPosition) {
    const currentOdds = state.positionSide === 'UP' ? state.upPrice : state.downPrice;
    const pnl = ((currentOdds - state.entryOdds) / state.entryOdds * 100);
    const pnlColor = pnl >= 0 ? '\x1b[32m' : '\x1b[31m';
    console.log(`\n🎯 POSITION: ${state.positionSide} @ $${state.entryOdds.toFixed(4)} → ${pnlColor}${pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}%${reset}`);
  }
  
  console.log('\n' + '─'.repeat(65));
  console.log('STATS');
  console.log('─'.repeat(65));
  console.log(`   Signals detected: ${state.stats.signals}`);
  console.log(`   Trades executed:  ${state.stats.trades}`);
  console.log(`   Win/Loss:         ${state.stats.wins}/${state.stats.losses}`);
  
  const netProfit = state.stats.totalProfit - state.stats.totalLoss;
  const profitColor = netProfit >= 0 ? '\x1b[32m' : '\x1b[31m';
  console.log(`   Net P&L:          ${profitColor}$${netProfit.toFixed(2)}${reset}`);
  
  console.log(`\n   BTC updates: ${state.stats.btcUpdates} | Price polls: ${state.stats.pricePolls}`);
  console.log('═'.repeat(65));
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  console.clear();
  log('🚀 BTC 15m LATENCY ARBITRAGE BOT', 'info');
  log('Strategy: Exploit Binance→Polymarket price lag', 'info');
  log('Mode: PAPER TRADING', 'info');
  console.log('');
  
  state.stats.startTime = new Date().toISOString();
  
  // Fetch initial market
  const market = await fetchCurrentMarket();
  if (!market) {
    log('No active market found, waiting...', 'warning');
  } else {
    state.currentMarket = market;
    state.upTokenId = market.upTokenId;
    state.downTokenId = market.downTokenId;
    state.upPrice = market.upPrice;
    state.downPrice = market.downPrice;
    state.marketEndTime = market.endDate.getTime();
    log(`Watching: ${market.title}`, 'info');
  }
  
  // Connect to Binance
  const binanceWs = connectBinance();
  
  // Start price polling
  const pollInterval = setInterval(fetchLivePrices, CONFIG.pollIntervalMs);
  
  // Status display
  const displayInterval = setInterval(displayStatus, 2000);
  
  // Market refresh (check for new markets)
  const marketRefresh = setInterval(async () => {
    const newMarket = await fetchCurrentMarket();
    if (newMarket && newMarket.id !== state.currentMarket?.id) {
      log(`New market: ${newMarket.title}`, 'info');
      state.currentMarket = newMarket;
      state.upTokenId = newMarket.upTokenId;
      state.downTokenId = newMarket.downTokenId;
      state.marketEndTime = newMarket.endDate.getTime();
    }
  }, 30000);
  
  // Run for multiple markets
  const runTimeMs = 45 * 60 * 1000;  // 45 minutes
  
  setTimeout(() => {
    clearInterval(pollInterval);
    clearInterval(displayInterval);
    clearInterval(marketRefresh);
    binanceWs.close();
    
    // Final report
    console.log('\n');
    console.log('═'.repeat(65));
    console.log('📊 FINAL REPORT - LATENCY ARBITRAGE');
    console.log('═'.repeat(65));
    console.log(`\nSession: ${state.stats.startTime}`);
    console.log(`Duration: 45 minutes`);
    console.log(`\nSignals detected: ${state.stats.signals}`);
    console.log(`Trades executed:  ${state.stats.trades}`);
    console.log(`Win rate:         ${state.stats.trades > 0 ? ((state.stats.wins / state.stats.trades) * 100).toFixed(1) : 0}%`);
    console.log(`\nGross profit: $${state.stats.totalProfit.toFixed(2)}`);
    console.log(`Gross loss:   $${state.stats.totalLoss.toFixed(2)}`);
    console.log(`NET P&L:      $${(state.stats.totalProfit - state.stats.totalLoss).toFixed(2)}`);
    
    if (state.trades.length > 0) {
      console.log('\nTrade History:');
      state.trades.forEach((t, i) => {
        console.log(`  ${i + 1}. ${t.side} | Entry: $${t.entryOdds.toFixed(4)} → Exit: $${t.exitOdds.toFixed(4)} | P&L: $${t.profitUsd.toFixed(2)} | ${t.reason}`);
      });
    }
    
    console.log('\n═'.repeat(65));
    saveTrades();
    log('Results saved to latency-trades.json', 'success');
    
    process.exit(0);
  }, runTimeMs);
  
  log(`Bot will run for 45 minutes...`, 'info');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  log('\nShutting down...', 'warning');
  saveTrades();
  process.exit(0);
});

main().catch(e => {
  log(`Fatal error: ${e.message}`, 'error');
  process.exit(1);
});
