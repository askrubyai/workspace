#!/usr/bin/env node

/**
 * PAPER TRADING BOT V2 - REALISTIC SIMULATION
 * 
 * Key improvements:
 * 1. Simulates limit order fill probability
 * 2. Tracks RESOLUTION outcomes, not price swings
 * 3. Tests multiple strategies
 * 4. Realistic fee modeling
 */

require('dotenv').config();
const WebSocket = require('ws');
const fetch = require('node-fetch');
const fs = require('fs');

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const CONFIG = {
  runtime: 4 * 60 * 60 * 1000, // 4 hours
  startingBalance: 50, // Simulated starting balance
  
  assets: {
    BTC: { seriesId: '10192', chainlinkSymbol: 'btc/usd' },
    ETH: { seriesId: '10191', chainlinkSymbol: 'eth/usd' },
    SOL: { seriesId: '10423', chainlinkSymbol: 'sol/usd' },
    XRP: { seriesId: '10422', chainlinkSymbol: 'xrp/usd' },
  },
  
  // Multiple strategies to test
  strategies: {
    momentum: {
      name: 'Momentum',
      description: 'Bet in direction of early move',
      threshold: 0.0003, // 0.03%
    },
    contrarian: {
      name: 'Contrarian', 
      description: 'Bet AGAINST early move (mean reversion)',
      threshold: 0.0005, // 0.05%
    },
    late_momentum: {
      name: 'Late Momentum',
      description: 'Wait longer, bet with trend',
      threshold: 0.001, // 0.1%
      minTimeElapsed: 300000, // Wait 5 min into market
    },
  },
  
  // Active strategy
  activeStrategy: 'contrarian', // TEST CONTRARIAN
  
  trading: {
    maxOddsEntry: 0.60,       // Enter up to 60 cents
    minTimeLeft: 60,          // Min 60s before resolution
    positionSizePct: 0.10,    // 10% of balance per trade
    maxPositions: 4,          // Max concurrent positions
  },
  
  // Realistic simulation parameters
  simulation: {
    fillProbability: 0.7,     // 70% chance limit order fills
    makerRebate: 0.01,        // 1% maker rebate
    takerFee: 0.03,           // 3% taker fee (if we use market orders)
    slippageBps: 50,          // 0.5% average slippage
  },
  
  gammaApi: 'https://gamma-api.polymarket.com',
};

// ═══════════════════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════════════════

const state = {
  startTime: Date.now(),
  balance: CONFIG.startingBalance,
  
  assets: {},
  positions: [], // Active positions
  completedTrades: [], // Resolved trades
  
  stats: {
    totalBets: 0,
    wins: 0,
    losses: 0,
    totalPnL: 0,
    fillAttempts: 0,
    fillSuccesses: 0,
    byStrategy: {},
  },
  
  // Track market resolutions
  marketHistory: {},
};

// Initialize per-asset state
Object.keys(CONFIG.assets).forEach(symbol => {
  state.assets[symbol] = {
    currentMarket: null,
    baselinePrice: null,
    currentPrice: null,
    priceHistory: [], // Track price over time
    marketStartTime: null,
  };
});

const LOG_FILE = '/Users/ruby/.openclaw/workspace/projects/btc-15m-arbitrage/paper-v2.log';
const JOURNAL_FILE = '/Users/ruby/.openclaw/workspace/projects/btc-15m-arbitrage/paper-v2-journal.json';

// ═══════════════════════════════════════════════════════════════════════════════
// LOGGING
// ═══════════════════════════════════════════════════════════════════════════════

function log(message, type = 'info') {
  const time = new Date().toLocaleTimeString('en-US', { 
    hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' 
  });
  const icons = {
    signal: '🎯', bet: '💰', win: '✅', loss: '❌', resolution: '🏁',
    info: 'ℹ️', warning: '⚠️', oracle: '🔮', balance: '💵'
  };
  const line = `[${time}] ${icons[type] || '•'} ${message}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

function saveJournal() {
  const data = {
    config: {
      strategy: CONFIG.activeStrategy,
      ...CONFIG.strategies[CONFIG.activeStrategy],
      startingBalance: CONFIG.startingBalance,
    },
    stats: state.stats,
    finalBalance: state.balance,
    completedTrades: state.completedTrades,
    runtime: Math.floor((Date.now() - state.startTime) / 60000) + ' minutes',
  };
  fs.writeFileSync(JOURNAL_FILE, JSON.stringify(data, null, 2));
}

// ═══════════════════════════════════════════════════════════════════════════════
// STRATEGY LOGIC
// ═══════════════════════════════════════════════════════════════════════════════

function getStrategy() {
  return CONFIG.strategies[CONFIG.activeStrategy];
}

function evaluateSignal(symbol) {
  const asset = state.assets[symbol];
  const strategy = getStrategy();
  
  if (!asset.currentMarket || !asset.baselinePrice || !asset.currentPrice) return null;
  
  const timeLeft = (asset.currentMarket.endDate - Date.now()) / 1000;
  const timeElapsed = Date.now() - asset.marketStartTime;
  
  // Check time constraints
  if (timeLeft < CONFIG.trading.minTimeLeft) return null;
  if (strategy.minTimeElapsed && timeElapsed < strategy.minTimeElapsed) return null;
  
  // Calculate price move
  const move = (asset.currentPrice - asset.baselinePrice) / asset.baselinePrice;
  
  // Check if move exceeds threshold
  if (Math.abs(move) < strategy.threshold) return null;
  
  // Determine bet direction based on strategy
  let betDirection;
  if (CONFIG.activeStrategy === 'contrarian') {
    // Bet AGAINST the move (mean reversion)
    betDirection = move > 0 ? 'DOWN' : 'UP';
  } else {
    // Momentum - bet WITH the move
    betDirection = move > 0 ? 'UP' : 'DOWN';
  }
  
  // Get current odds
  const odds = betDirection === 'UP' ? asset.upPrice : asset.downPrice;
  if (odds > CONFIG.trading.maxOddsEntry) return null;
  
  return {
    symbol,
    direction: betDirection,
    odds,
    move: Math.abs(move),
    strategy: CONFIG.activeStrategy,
    timeLeft,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// BETTING SIMULATION
// ═══════════════════════════════════════════════════════════════════════════════

function simulateBet(signal) {
  const asset = state.assets[signal.symbol];
  
  // Check if already have position in this market
  const existingPos = state.positions.find(p => 
    p.symbol === signal.symbol && p.marketId === asset.currentMarket.id
  );
  if (existingPos) return null;
  
  // Check position limits
  if (state.positions.length >= CONFIG.trading.maxPositions) return null;
  
  // Simulate fill probability
  state.stats.fillAttempts++;
  const fills = Math.random() < CONFIG.simulation.fillProbability;
  
  if (!fills) {
    log(`[${signal.symbol}] Order not filled (simulated)`, 'warning');
    return null;
  }
  
  state.stats.fillSuccesses++;
  
  // Calculate bet size
  const betSize = Math.min(
    state.balance * CONFIG.trading.positionSizePct,
    state.balance * 0.25 // Never more than 25% on one bet
  );
  
  if (betSize < 1) {
    log(`Insufficient balance: $${state.balance.toFixed(2)}`, 'warning');
    return null;
  }
  
  // Deduct from balance
  state.balance -= betSize;
  
  // Calculate shares (with slight slippage)
  const effectiveOdds = signal.odds * (1 + CONFIG.simulation.slippageBps / 10000);
  const shares = betSize / effectiveOdds;
  
  const position = {
    id: Date.now().toString(),
    symbol: signal.symbol,
    marketId: asset.currentMarket.id,
    marketTitle: asset.currentMarket.title,
    direction: signal.direction,
    entryOdds: effectiveOdds,
    shares,
    betSize,
    potentialWin: shares * 1.0, // If win, shares worth $1 each
    entryTime: Date.now(),
    endDate: asset.currentMarket.endDate,
    baselinePrice: asset.baselinePrice,
    oracleAtEntry: asset.currentPrice,
    strategy: signal.strategy,
    move: signal.move,
  };
  
  state.positions.push(position);
  state.stats.totalBets++;
  
  log(`[${signal.symbol}] BET: ${signal.direction} @ ${effectiveOdds.toFixed(3)} | $${betSize.toFixed(2)} for ${shares.toFixed(1)} shares | Balance: $${state.balance.toFixed(2)}`, 'bet');
  
  return position;
}

// ═══════════════════════════════════════════════════════════════════════════════
// RESOLUTION TRACKING
// ═══════════════════════════════════════════════════════════════════════════════

async function checkResolutions() {
  const now = Date.now();
  const toResolve = state.positions.filter(p => new Date(p.endDate).getTime() < now);
  
  for (const pos of toResolve) {
    await resolvePosition(pos);
  }
}

async function resolvePosition(position) {
  const asset = state.assets[position.symbol];
  
  // Determine actual outcome by comparing final price to baseline
  // In real Polymarket, this is determined by the oracle at market close
  // We'll simulate by checking if price ended higher or lower than baseline
  
  let actualOutcome;
  
  // Fetch actual market resolution if available
  try {
    const resp = await fetch(`${CONFIG.gammaApi}/events/${position.marketId.split('-')[0]}`);
    const data = await resp.json();
    const market = data.markets?.[0];
    
    if (market?.outcome) {
      actualOutcome = market.outcome;
    }
  } catch (e) {
    // Fallback: use last known price vs baseline
    const finalPrice = asset.currentPrice || position.oracleAtEntry;
    actualOutcome = finalPrice > position.baselinePrice ? 'Up' : 'Down';
  }
  
  // Normalize outcome
  const normalizedOutcome = actualOutcome?.toLowerCase().includes('up') ? 'UP' : 'DOWN';
  
  // Determine if we won
  const won = position.direction === normalizedOutcome;
  
  // Calculate P&L
  let pnl;
  if (won) {
    // Win: shares become worth $1 each, minus our cost
    pnl = position.shares - position.betSize;
    // Add maker rebate
    pnl += position.betSize * CONFIG.simulation.makerRebate;
    state.balance += position.shares; // Get back $1 per share
    state.stats.wins++;
  } else {
    // Loss: shares become worth $0
    pnl = -position.betSize;
    state.stats.losses++;
  }
  
  state.stats.totalPnL += pnl;
  
  // Log result
  const emoji = won ? '✅' : '❌';
  log(`[${position.symbol}] ${emoji} ${won ? 'WIN' : 'LOSS'}: Bet ${position.direction}, Resolved ${normalizedOutcome} | P&L: $${pnl.toFixed(2)} | Balance: $${state.balance.toFixed(2)}`, won ? 'win' : 'loss');
  
  // Record completed trade
  state.completedTrades.push({
    ...position,
    resolvedOutcome: normalizedOutcome,
    won,
    pnl,
    resolveTime: Date.now(),
  });
  
  // Remove from active positions
  state.positions = state.positions.filter(p => p.id !== position.id);
  
  saveJournal();
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
      asset.priceHistory = [];
      asset.marketStartTime = Date.now();
      log(`[${symbol}] New market: ${market.question}`, 'info');
    }
    
    asset.currentMarket = {
      id: market.id,
      title: market.question,
      endDate: new Date(active.endDate),
    };
    
    // Parse prices
    try {
      const outcomePrices = typeof market.outcomePrices === 'string' 
        ? JSON.parse(market.outcomePrices) 
        : market.outcomePrices || [];
      
      asset.upPrice = parseFloat(outcomePrices[0]) || 0.5;
      asset.downPrice = parseFloat(outcomePrices[1]) || 0.5;
    } catch (e) {}
    
  } catch (err) {
    // Silent fail
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// WEBSOCKET FOR CHAINLINK PRICES
// ═══════════════════════════════════════════════════════════════════════════════

function symbolToAsset(symbol) {
  const map = { 'btc/usd': 'BTC', 'eth/usd': 'ETH', 'sol/usd': 'SOL', 'xrp/usd': 'XRP' };
  return map[symbol?.toLowerCase()];
}

function initWebSocket() {
  log('Connecting to Polymarket RTDS...', 'info');
  
  const ws = new WebSocket('wss://ws-live-data.polymarket.com/');
  
  ws.on('open', () => {
    log('WebSocket connected!', 'info');
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
        handlePriceUpdate(msg);
      }
    } catch (e) {}
  });
  
  ws.on('error', (e) => log(`WebSocket error: ${e.message}`, 'warning'));
  
  ws.on('close', () => {
    log('WebSocket disconnected. Reconnecting...', 'warning');
    setTimeout(initWebSocket, 5000);
  });
}

function handlePriceUpdate(message) {
  const payload = message.payload;
  const assetSymbol = symbolToAsset(payload.symbol);
  if (!assetSymbol) return;
  
  const asset = state.assets[assetSymbol];
  const price = parseFloat(payload.value);
  if (isNaN(price) || price <= 0) return;
  
  asset.currentPrice = price;
  
  // Track price history
  asset.priceHistory.push({ time: Date.now(), price });
  if (asset.priceHistory.length > 100) asset.priceHistory.shift();
  
  // Set baseline
  if (asset.currentMarket && !asset.baselinePrice) {
    asset.baselinePrice = price;
    log(`[${assetSymbol}] Baseline: $${price.toFixed(price > 100 ? 2 : 4)}`, 'oracle');
  }
  
  // Check for signal
  const signal = evaluateSignal(assetSymbol);
  if (signal) {
    simulateBet(signal);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATUS REPORTING
// ═══════════════════════════════════════════════════════════════════════════════

function printStatus() {
  const runtime = Math.floor((Date.now() - state.startTime) / 60000);
  const winRate = state.stats.wins + state.stats.losses > 0
    ? ((state.stats.wins / (state.stats.wins + state.stats.losses)) * 100).toFixed(1)
    : '0.0';
  const fillRate = state.stats.fillAttempts > 0
    ? ((state.stats.fillSuccesses / state.stats.fillAttempts) * 100).toFixed(1)
    : '0.0';
  
  console.log('\n' + '═'.repeat(60));
  console.log(`📊 PAPER V2 STATUS | Runtime: ${runtime}m | Strategy: ${CONFIG.activeStrategy.toUpperCase()}`);
  console.log('═'.repeat(60));
  console.log(`Balance: $${state.balance.toFixed(2)} (started: $${CONFIG.startingBalance})`);
  console.log(`P&L: $${state.stats.totalPnL.toFixed(2)} (${((state.stats.totalPnL / CONFIG.startingBalance) * 100).toFixed(1)}%)`);
  console.log(`Bets: ${state.stats.totalBets} | Wins: ${state.stats.wins} | Losses: ${state.stats.losses} | Win Rate: ${winRate}%`);
  console.log(`Fill Rate: ${fillRate}% (${state.stats.fillSuccesses}/${state.stats.fillAttempts})`);
  console.log(`Active Positions: ${state.positions.length}`);
  console.log('═'.repeat(60) + '\n');
  
  saveJournal();
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
  console.log('\n' + '═'.repeat(60));
  console.log('📊 PAPER TRADING BOT V2 - REALISTIC SIMULATION');
  console.log(`Strategy: ${CONFIG.activeStrategy.toUpperCase()} - ${getStrategy().description}`);
  console.log(`Starting Balance: $${CONFIG.startingBalance}`);
  console.log('═'.repeat(60) + '\n');
  
  // Clear log
  fs.writeFileSync(LOG_FILE, '');
  
  // Initialize WebSocket
  initWebSocket();
  
  // Fetch initial market data
  for (const symbol of Object.keys(CONFIG.assets)) {
    await fetchMarketData(symbol);
  }
  
  // Periodic market data refresh
  setInterval(async () => {
    for (const symbol of Object.keys(CONFIG.assets)) {
      await fetchMarketData(symbol);
    }
  }, 15000);
  
  // Check resolutions
  setInterval(checkResolutions, 30000);
  
  // Status reports
  setInterval(printStatus, 300000); // Every 5 min
  
  // Shutdown handler
  setTimeout(() => {
    printStatus();
    log('Runtime complete. Final results saved.', 'info');
    process.exit(0);
  }, CONFIG.runtime);
  
  log(`Paper trading started. Strategy: ${CONFIG.activeStrategy}`, 'info');
}

main().catch(console.error);
