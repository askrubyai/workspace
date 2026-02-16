#!/usr/bin/env node

/**
 * MULTI-ASSET 15M ARBITRAGE BOT - WebSocket Version
 * 
 * Uses Polymarket RTDS WebSocket for Chainlink prices (NO POLLING!)
 * 
 * Assets: BTC, ETH, SOL, XRP
 * Strategy: Detect price direction via Chainlink before Polymarket odds catch up
 */

require('dotenv').config();
const WebSocket = require('ws');
const fetch = require('node-fetch');
const fs = require('fs');

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const CONFIG = {
  mode: 'paper', // 'live' for real trading
  runtime: 12 * 60 * 60 * 1000, // 12 hours
  
  // Chainlink symbol mapping for RTDS
  assets: {
    BTC: {
      seriesId: '10192',
      chainlinkSymbol: 'btc/usd',  // RTDS format
    },
    ETH: {
      seriesId: '10191',
      chainlinkSymbol: 'eth/usd',
    },
    SOL: {
      seriesId: '10423',
      chainlinkSymbol: 'sol/usd',
    },
    XRP: {
      seriesId: '10422',
      chainlinkSymbol: 'xrp/usd',
    },
  },
  
  trading: {
    moveThreshold: 0.0003,    // 0.03% price move to trigger signal
    maxOddsEntry: 0.55,       // Don't enter if odds already > 55%
    minTimeLeft: 30,          // Don't trade with < 30s left
    profitTarget: 0.05,       // 5% profit target
    stopLoss: 0.10,           // 10% stop loss
    cooldownMs: 15000,        // 15s between trades per asset
    positionSize: 25,         // $ per trade
  },
  
  polling: {
    marketMs: 15000,          // Poll Polymarket markets every 15s (still needed for odds)
    statusMs: 600000,         // Status report every 10 min
  },
  
  gammaApi: 'https://gamma-api.polymarket.com',
};

// ═══════════════════════════════════════════════════════════════════════════════
// STATE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

const state = {
  startTime: Date.now(),
  rtdsClient: null,
  connected: false,
  
  // Per-asset state
  assets: {},
  
  // Global stats
  stats: {
    totalSignals: 0,
    totalTrades: 0,
    totalWins: 0,
    totalLosses: 0,
    totalBreakeven: 0,
    totalPnL: 0,
    priceUpdates: 0,
    byAsset: {},
  },
  
  // Trade journal
  trades: [],
};

// Initialize per-asset state
Object.keys(CONFIG.assets).forEach(symbol => {
  state.assets[symbol] = {
    currentMarket: null,
    baselinePrice: null,
    currentPrice: null,
    lastPriceUpdate: null,
    upPrice: null,
    downPrice: null,
    upTokenId: null,
    downTokenId: null,
    inPosition: false,
    position: null,
    lastTradeTime: 0,
  };
  state.stats.byAsset[symbol] = {
    signals: 0,
    trades: 0,
    wins: 0,
    losses: 0,
    pnl: 0,
    priceUpdates: 0,
  };
});

// ═══════════════════════════════════════════════════════════════════════════════
// LOGGING
// ═══════════════════════════════════════════════════════════════════════════════

const LOG_FILE = '/Users/ruby/.openclaw/workspace/projects/btc-15m-arbitrage/bot-ws.log';
const TRADE_JOURNAL = '/Users/ruby/.openclaw/workspace/projects/btc-15m-arbitrage/trade-journal-ws.json';

function log(msg, type = 'info', asset = null) {
  const time = new Date().toISOString().substr(11, 12);
  const prefix = {
    info: '📊', success: '✅', warning: '⚠️', error: '❌',
    signal: '🎯', entry: '📈', exit: '📉', profit: '💰',
    market: '🏪', oracle: '🔮', status: '📋', ws: '🔌'
  }[type] || 'ℹ️';
  
  const assetTag = asset ? `[${asset}]` : '';
  const line = `[${time}] ${prefix} ${assetTag} ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

function saveTrades() {
  fs.writeFileSync(TRADE_JOURNAL, JSON.stringify({
    startTime: new Date(state.startTime).toISOString(),
    runtime: Math.floor((Date.now() - state.startTime) / 60000),
    stats: state.stats,
    trades: state.trades,
  }, null, 2));
}

// ═══════════════════════════════════════════════════════════════════════════════
// RTDS WEBSOCKET (Chainlink Prices)
// ═══════════════════════════════════════════════════════════════════════════════

function symbolToAsset(chainlinkSymbol) {
  // Map chainlink symbol back to our asset key
  // e.g., "btc/usd" -> "BTC"
  const mapping = {
    'btc/usd': 'BTC',
    'eth/usd': 'ETH', 
    'sol/usd': 'SOL',
    'xrp/usd': 'XRP',
  };
  return mapping[chainlinkSymbol.toLowerCase()];
}

function initWebSocket() {
  log('Connecting to Polymarket RTDS WebSocket...', 'ws');
  
  const ws = new WebSocket('wss://ws-live-data.polymarket.com/');
  state.rtdsClient = ws;
  let pingInterval = null;
  let lastPong = Date.now();
  
  ws.on('open', () => {
    log('RTDS WebSocket connected!', 'success');
    state.connected = true;
    lastPong = Date.now();
    
    // Subscribe to all Chainlink prices
    log('Subscribing to crypto_prices_chainlink...', 'ws');
    ws.send(JSON.stringify({
      action: 'subscribe',
      subscriptions: [{
        topic: 'crypto_prices_chainlink',
        type: '*',
      }],
    }));
    
    // CRITICAL: Send PING every 5 seconds to keep connection alive (per Polymarket docs)
    pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping();
        // Check if we haven't received a pong in 30 seconds - connection is dead
        if (Date.now() - lastPong > 30000) {
          log('No pong received in 30s - connection dead, reconnecting...', 'warning');
          ws.terminate();
        }
      }
    }, 5000);
  });
  
  ws.on('pong', () => {
    lastPong = Date.now();
  });
  
  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.topic === 'crypto_prices_chainlink' && msg.payload) {
        handlePriceUpdate(msg);
      }
    } catch (e) {
      // Ignore parse errors (incomplete messages)
    }
  });
  
  ws.on('error', (e) => {
    log(`WebSocket error: ${e.message}`, 'error');
  });
  
  ws.on('close', () => {
    log('WebSocket disconnected. Reconnecting in 5s...', 'warning');
    state.connected = false;
    if (pingInterval) {
      clearInterval(pingInterval);
      pingInterval = null;
    }
    setTimeout(initWebSocket, 5000);
  });
}

function handlePriceUpdate(message) {
  // Message format from RTDS: { topic, type, payload: { symbol: "btc/usd", value: "97234.56", ... } }
  const payload = message.payload || message;
  const symbol = payload.symbol;
  const value = payload.value || payload.price;
  if (!symbol || !value) return;
  
  const assetSymbol = symbolToAsset(symbol);
  if (!assetSymbol) return;
  
  const asset = state.assets[assetSymbol];
  const price = parseFloat(value);
  
  if (isNaN(price) || price <= 0) return;
  
  state.stats.priceUpdates++;
  state.stats.byAsset[assetSymbol].priceUpdates++;
  
  const prev = asset.currentPrice;
  asset.currentPrice = price;
  asset.lastPriceUpdate = Date.now();
  
  // Set baseline for new market
  if (asset.currentMarket && !asset.baselinePrice) {
    asset.baselinePrice = price;
    log(`Baseline set: $${price.toFixed(price > 100 ? 2 : 4)}`, 'oracle', assetSymbol);
  }
  
  // Log significant moves from baseline
  if (prev && asset.baselinePrice) {
    const moveFromBaseline = (price - asset.baselinePrice) / asset.baselinePrice;
    if (Math.abs(moveFromBaseline) > 0.001) { // Log 0.1%+ moves
      const dir = moveFromBaseline > 0 ? '↑' : '↓';
      log(`$${price.toFixed(2)} ${dir} ${(moveFromBaseline * 100).toFixed(3)}% from baseline`, 'oracle', assetSymbol);
    }
  }
  
  // Check for trading signals
  checkSignal(assetSymbol);
}

// ═══════════════════════════════════════════════════════════════════════════════
// POLYMARKET DATA (still need to poll for odds)
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
      if (asset.currentMarket) {
        log(`No active market`, 'warning', symbol);
      }
      asset.currentMarket = null;
      return;
    }
    
    const eventResp = await fetch(`${CONFIG.gammaApi}/events/${active.id}`);
    const eventData = await eventResp.json();
    const market = eventData.markets?.[0];
    
    if (!market) return;
    
    const prices = JSON.parse(market.outcomePrices || '[0.5,0.5]');
    const tokens = JSON.parse(market.clobTokenIds || '[]');
    
    asset.upPrice = parseFloat(prices[0]);
    asset.downPrice = parseFloat(prices[1]);
    asset.upTokenId = tokens[0];
    asset.downTokenId = tokens[1];
    
    const isNew = !asset.currentMarket || asset.currentMarket.id !== active.id;
    
    if (isNew) {
      // Reset for new market
      asset.baselinePrice = asset.currentPrice || null;
      if (asset.inPosition) {
        log(`Market changed while in position - forcing exit`, 'warning', symbol);
        forceExit(symbol, 'market_expired');
      }
      
      asset.currentMarket = {
        id: active.id,
        title: active.title,
        endDate: new Date(active.endDate),
      };
      
      log(`NEW: ${active.title.split(' - ')[1] || active.title}`, 'market', symbol);
      if (asset.baselinePrice) {
        log(`Baseline: $${asset.baselinePrice.toFixed(2)} | UP=$${asset.upPrice.toFixed(3)} DOWN=$${asset.downPrice.toFixed(3)}`, 'info', symbol);
      }
    }
  } catch (e) {
    log(`Market fetch error: ${e.message}`, 'error', symbol);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRADING LOGIC
// ═══════════════════════════════════════════════════════════════════════════════

function checkSignal(symbol) {
  const asset = state.assets[symbol];
  const assetStats = state.stats.byAsset[symbol];
  
  if (!asset.currentMarket || !asset.baselinePrice || !asset.currentPrice) return;
  if (!asset.upPrice || !asset.downPrice) return;
  
  // Skip if market near resolution
  const timeLeft = (asset.currentMarket.endDate - Date.now()) / 1000;
  if (timeLeft < CONFIG.trading.minTimeLeft) return;
  
  // Skip resolved markets
  if (asset.upPrice > 0.9 || asset.downPrice > 0.9) return;
  if (asset.upPrice < 0.1 || asset.downPrice < 0.1) return;
  
  // Calculate move from baseline
  const move = (asset.currentPrice - asset.baselinePrice) / asset.baselinePrice;
  const direction = move > 0 ? 'UP' : 'DOWN';
  
  // Check exit if in position
  if (asset.inPosition) {
    checkExit(symbol, direction, move, timeLeft);
    return;
  }
  
  // Cooldown
  if (Date.now() - asset.lastTradeTime < CONFIG.trading.cooldownMs) return;
  
  // Need significant move
  if (Math.abs(move) < CONFIG.trading.moveThreshold) return;
  
  // Check if odds are still favorable
  const targetPrice = direction === 'UP' ? asset.upPrice : asset.downPrice;
  if (targetPrice > CONFIG.trading.maxOddsEntry) return;
  
  // SIGNAL!
  state.stats.totalSignals++;
  assetStats.signals++;
  
  log(`SIGNAL: ${direction} ${(Math.abs(move) * 100).toFixed(3)}% | Entry: $${targetPrice.toFixed(3)} | ${timeLeft.toFixed(0)}s left`, 'signal', symbol);
  
  // Enter position
  asset.inPosition = true;
  asset.lastTradeTime = Date.now();
  asset.position = {
    side: direction,
    entryPrice: targetPrice,
    entryTime: Date.now(),
    baselineAtEntry: asset.baselinePrice,
    oracleAtEntry: asset.currentPrice,
  };
  
  state.stats.totalTrades++;
  assetStats.trades++;
  
  log(`ENTRY: ${direction} @ $${targetPrice.toFixed(4)}`, 'entry', symbol);
}

function checkExit(symbol, currentDirection, currentMove, timeLeft) {
  const asset = state.assets[symbol];
  if (!asset.inPosition || !asset.position) return;
  
  const pos = asset.position;
  const currentPrice = pos.side === 'UP' ? asset.upPrice : asset.downPrice;
  const pnlPct = (currentPrice - pos.entryPrice) / pos.entryPrice;
  const pnlDollars = pnlPct * CONFIG.trading.positionSize;
  
  let exitReason = null;
  
  // Direction flipped significantly against us
  if (currentDirection !== pos.side && Math.abs(currentMove) > CONFIG.trading.moveThreshold) {
    exitReason = 'direction_flip';
  }
  // Profit target
  else if (pnlPct >= CONFIG.trading.profitTarget) {
    exitReason = 'profit_target';
  }
  // Stop loss
  else if (pnlPct <= -CONFIG.trading.stopLoss) {
    exitReason = 'stop_loss';
  }
  // Pre-resolution exit
  else if (timeLeft < 15) {
    exitReason = 'pre_resolution';
  }
  // Market resolved
  else if (currentPrice > 0.9 || currentPrice < 0.1) {
    exitReason = 'resolved';
  }
  
  if (!exitReason) return;
  
  executeExit(symbol, currentPrice, pnlPct, pnlDollars, exitReason);
}

function forceExit(symbol, reason) {
  const asset = state.assets[symbol];
  if (!asset.inPosition || !asset.position) return;
  
  const currentPrice = asset.position.side === 'UP' ? asset.upPrice : asset.downPrice;
  const pnlPct = currentPrice ? (currentPrice - asset.position.entryPrice) / asset.position.entryPrice : 0;
  const pnlDollars = pnlPct * CONFIG.trading.positionSize;
  
  executeExit(symbol, currentPrice || asset.position.entryPrice, pnlPct, pnlDollars, reason);
}

function executeExit(symbol, exitPrice, pnlPct, pnlDollars, reason) {
  const asset = state.assets[symbol];
  const assetStats = state.stats.byAsset[symbol];
  const pos = asset.position;
  
  // Update stats
  state.stats.totalPnL += pnlDollars;
  assetStats.pnl += pnlDollars;
  
  if (pnlDollars > 0.5) {
    state.stats.totalWins++;
    assetStats.wins++;
  } else if (pnlDollars < -0.5) {
    state.stats.totalLosses++;
    assetStats.losses++;
  } else {
    state.stats.totalBreakeven++;
  }
  
  const emoji = pnlDollars >= 0 ? '💰' : '📉';
  log(`EXIT: ${pos.side} @ $${exitPrice.toFixed(4)} | ${emoji} $${pnlDollars.toFixed(2)} (${(pnlPct * 100).toFixed(2)}%) | ${reason}`, 'exit', symbol);
  
  // Record trade
  state.trades.push({
    timestamp: new Date().toISOString(),
    asset: symbol,
    market: asset.currentMarket?.title,
    side: pos.side,
    entryPrice: pos.entryPrice,
    exitPrice: exitPrice,
    pnlPct: pnlPct,
    pnlDollars: pnlDollars,
    reason: reason,
    holdTimeMs: Date.now() - pos.entryTime,
    oracleEntry: pos.oracleAtEntry,
    oracleExit: asset.currentPrice,
  });
  
  // Save journal
  saveTrades();
  
  // Reset position
  asset.inPosition = false;
  asset.position = null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATUS REPORTING
// ═══════════════════════════════════════════════════════════════════════════════

function printStatus() {
  const runtime = Math.floor((Date.now() - state.startTime) / 60000);
  const winRate = state.stats.totalTrades > 0 
    ? ((state.stats.totalWins / state.stats.totalTrades) * 100).toFixed(1) 
    : '0.0';
  
  log('═══════════════════════════════════════════════════════════════', 'status');
  log(`WEBSOCKET BOT STATUS (${runtime} min runtime)`, 'status');
  log(`WebSocket: ${state.connected ? '🟢 CONNECTED' : '🔴 DISCONNECTED'} | Price updates: ${state.stats.priceUpdates}`, 'ws');
  log('───────────────────────────────────────────────────────────────', 'status');
  
  for (const [symbol, asset] of Object.entries(state.assets)) {
    const stats = state.stats.byAsset[symbol];
    const marketName = asset.currentMarket?.title?.split(' - ')[1] || 'No market';
    const posStatus = asset.inPosition ? `IN ${asset.position.side}` : 'WATCHING';
    const lastUpdate = asset.lastPriceUpdate ? `${Math.floor((Date.now() - asset.lastPriceUpdate) / 1000)}s ago` : 'never';
    log(`${symbol}: ${marketName} | ${posStatus} | Last: ${lastUpdate} | PnL: $${stats.pnl.toFixed(2)}`, 'info');
  }
  
  log('───────────────────────────────────────────────────────────────', 'status');
  log(`TOTALS: Signals: ${state.stats.totalSignals} | Trades: ${state.stats.totalTrades}`, 'status');
  log(`W/L/B: ${state.stats.totalWins}/${state.stats.totalLosses}/${state.stats.totalBreakeven} (${winRate}% win rate)`, 'status');
  log(`TOTAL PnL: $${state.stats.totalPnL.toFixed(2)}`, state.stats.totalPnL >= 0 ? 'profit' : 'error');
  log(`Mode: ${CONFIG.mode.toUpperCase()} | Runtime: ${runtime}/${CONFIG.runtime / 60000} min`, 'status');
  log('═══════════════════════════════════════════════════════════════', 'status');
  
  saveTrades();
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
  console.log(`
╔═══════════════════════════════════════════════════════════════════════════════╗
║              MULTI-ASSET 15M ARBITRAGE BOT - WebSocket Edition                ║
║                         Production Grade v2.0                                 ║
║                                                                               ║
║  Assets: BTC, ETH, SOL, XRP                                                   ║
║  Data: Polymarket RTDS WebSocket (Chainlink prices)                           ║
║  NO POLLING for prices - real-time streaming!                                 ║
║  Runtime: 12 hours                                                            ║
╚═══════════════════════════════════════════════════════════════════════════════╝
  `);
  
  log(`Mode: ${CONFIG.mode.toUpperCase()}`, 'info');
  log(`Assets: ${Object.keys(CONFIG.assets).join(', ')}`, 'info');
  log(`Move threshold: ${CONFIG.trading.moveThreshold * 100}%`, 'info');
  log(`Position size: $${CONFIG.trading.positionSize}`, 'info');
  
  // Initialize WebSocket connection for Chainlink prices
  initWebSocket();
  
  // Initial market fetch for all assets
  for (const symbol of Object.keys(CONFIG.assets)) {
    await fetchMarketData(symbol);
  }
  
  // Market data polling (still need this for odds, but not for prices!)
  setInterval(() => {
    try {
      const symbols = Object.keys(CONFIG.assets);
      for (let i = 0; i < symbols.length; i++) {
        setTimeout(() => {
          fetchMarketData(symbols[i]).catch(e => {
            log(`Market poll error: ${e.message}`, 'error', symbols[i]);
          });
        }, i * 500);
      }
    } catch (e) {
      log(`Market interval error: ${e.message}`, 'error');
    }
  }, CONFIG.polling.marketMs);
  
  // Status reports
  setInterval(printStatus, CONFIG.polling.statusMs);
  
  // Heartbeat every 60s
  setInterval(() => {
    const runtime = Math.floor((Date.now() - state.startTime) / 60000);
    const activePositions = Object.values(state.assets).filter(a => a.inPosition).length;
    log(`HEARTBEAT: ${runtime}min | WS: ${state.connected ? 'OK' : 'DOWN'} | Updates: ${state.stats.priceUpdates} | PnL: $${state.stats.totalPnL.toFixed(2)}`, 'info');
  }, 60000);
  
  // Initial status
  setTimeout(printStatus, 5000);
  
  // Runtime limit
  setTimeout(() => {
    log('12-hour runtime complete. Final status:', 'info');
    printStatus();
    if (state.rtdsClient) {
      state.rtdsClient.close();
    }
    process.exit(0);
  }, CONFIG.runtime);
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    log('Shutting down gracefully...', 'info');
    printStatus();
    if (state.rtdsClient) {
      state.rtdsClient.close();
    }
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    log('Received SIGTERM...', 'info');
    printStatus();
    if (state.rtdsClient) {
      state.rtdsClient.close();
    }
    process.exit(0);
  });
}

// Crash protection
process.on('uncaughtException', (err) => {
  log(`UNCAUGHT EXCEPTION: ${err.message}`, 'error');
  console.error(err.stack);
  saveTrades();
});

process.on('unhandledRejection', (reason, promise) => {
  log(`UNHANDLED REJECTION: ${reason}`, 'error');
});

main().catch(e => {
  log(`Fatal error: ${e.message}`, 'error');
  console.error(e);
  saveTrades();
  process.exit(1);
});
