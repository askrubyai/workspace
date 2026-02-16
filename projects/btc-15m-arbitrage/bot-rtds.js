#!/usr/bin/env node

/**
 * MULTI-ASSET 15M BOT v3 - Polymarket RTDS Edition
 * 
 * Uses Polymarket's RTDS WebSocket for CHAINLINK prices!
 * This is the EXACT data source Polymarket uses to resolve markets.
 * 
 * NO AUTH NEEDED - just correct URL!
 */

require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');
const WebSocket = require('ws');

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const CONFIG = {
  mode: 'paper',
  runtime: 12 * 60 * 60 * 1000,
  
  assets: {
    BTC: { seriesId: '10192', chainlinkSymbol: 'btc/usd' },
    ETH: { seriesId: '10191', chainlinkSymbol: 'eth/usd' },
    SOL: { seriesId: '10423', chainlinkSymbol: 'sol/usd' },
    XRP: { seriesId: '10422', chainlinkSymbol: 'xrp/usd' },
  },
  
  trading: {
    moveThreshold: 0.0003,
    maxOddsEntry: 0.55,
    minTimeLeft: 30,
    profitTarget: 0.05,
    stopLoss: 0.10,
    cooldownMs: 15000,
    positionSize: 25,
  },
  
  ws: {
    rtds: 'wss://ws-live-data.polymarket.com', // Correct URL!
  },
  
  polling: {
    marketMs: 10000,
    statusMs: 600000,
  },
  
  gammaApi: 'https://gamma-api.polymarket.com',
};

// ═══════════════════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════════════════

const state = {
  startTime: Date.now(),
  wsConnected: false,
  assets: {},
  stats: {
    totalSignals: 0,
    totalTrades: 0,
    totalWins: 0,
    totalLosses: 0,
    totalPnL: 0,
    byAsset: {},
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
    inPosition: false,
    position: null,
    lastTradeTime: 0,
    lastLoggedMove: 0,
  };
  state.stats.byAsset[symbol] = { signals: 0, trades: 0, wins: 0, losses: 0, pnl: 0 };
});

// ═══════════════════════════════════════════════════════════════════════════════
// LOGGING
// ═══════════════════════════════════════════════════════════════════════════════

const LOG_FILE = '/Users/ruby/.openclaw/workspace/projects/btc-15m-arbitrage/bot-rtds.log';
const JOURNAL_FILE = '/Users/ruby/.openclaw/workspace/projects/btc-15m-arbitrage/trade-journal-rtds.json';

function log(msg, type = 'info', asset = null) {
  const time = new Date().toISOString().substr(11, 12);
  const prefix = {
    info: '📊', success: '✅', warning: '⚠️', error: '❌',
    signal: '🎯', entry: '📈', exit: '📉', profit: '💰',
    market: '🏪', oracle: '🔮', ws: '🌐'
  }[type] || 'ℹ️';
  const tag = asset ? `[${asset}]` : '';
  const line = `[${time}] ${prefix} ${tag} ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

function saveJournal() {
  fs.writeFileSync(JOURNAL_FILE, JSON.stringify({
    startTime: new Date(state.startTime).toISOString(),
    runtime: Math.floor((Date.now() - state.startTime) / 60000),
    stats: state.stats,
    trades: state.trades,
  }, null, 2));
}

// ═══════════════════════════════════════════════════════════════════════════════
// POLYMARKET RTDS WEBSOCKET - CHAINLINK PRICES!
// ═══════════════════════════════════════════════════════════════════════════════

function connectRTDS() {
  const ws = new WebSocket(CONFIG.ws.rtds);
  
  ws.on('open', () => {
    log('RTDS WebSocket connected!', 'ws');
    state.wsConnected = true;
    
    // Subscribe to Chainlink prices
    ws.send(JSON.stringify({
      action: 'subscribe',
      subscriptions: [{
        topic: 'crypto_prices_chainlink',
        type: '*'
      }]
    }));
    
    log('Subscribed to crypto_prices_chainlink (BTC, ETH, SOL, XRP)', 'success');
  });
  
  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      
      if (msg.topic === 'crypto_prices_chainlink' && msg.payload) {
        handleChainlinkPrice(msg.payload);
      }
    } catch (e) {
      // Ignore
    }
  });
  
  ws.on('close', () => {
    log('RTDS disconnected, reconnecting in 3s...', 'warning');
    state.wsConnected = false;
    setTimeout(connectRTDS, 3000);
  });
  
  ws.on('error', (e) => {
    log(`RTDS error: ${e.message}`, 'error');
  });
  
  // Keepalive ping
  setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping();
    }
  }, 30000);
  
  return ws;
}

function handleChainlinkPrice(payload) {
  const { symbol, value } = payload;
  
  // Map Chainlink symbol to our asset key
  const assetKey = Object.keys(CONFIG.assets).find(
    k => CONFIG.assets[k].chainlinkSymbol === symbol
  );
  
  if (!assetKey) return;
  
  const asset = state.assets[assetKey];
  const price = parseFloat(value);
  
  if (isNaN(price)) return;
  
  asset.currentPrice = price;
  
  // Set baseline for new market
  if (asset.currentMarket && !asset.baselinePrice) {
    asset.baselinePrice = price;
    log(`Baseline: $${price.toFixed(price > 100 ? 2 : 4)}`, 'oracle', assetKey);
  }
  
  // Log significant moves
  if (asset.baselinePrice) {
    const move = (price - asset.baselinePrice) / asset.baselinePrice;
    if (Math.abs(move) > 0.0005 && Math.abs(move - asset.lastLoggedMove) > 0.0003) {
      const dir = move > 0 ? '↑' : '↓';
      log(`$${price.toFixed(price > 100 ? 2 : 4)} ${dir} ${(move * 100).toFixed(3)}%`, 'oracle', assetKey);
      asset.lastLoggedMove = move;
    }
  }
  
  checkSignal(assetKey);
}

// ═══════════════════════════════════════════════════════════════════════════════
// POLYMARKET MARKET DATA
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
    
    const prices = JSON.parse(market.outcomePrices || '[0.5,0.5]');
    asset.upPrice = parseFloat(prices[0]);
    asset.downPrice = parseFloat(prices[1]);
    
    const isNew = !asset.currentMarket || asset.currentMarket.id !== active.id;
    
    if (isNew) {
      asset.baselinePrice = asset.currentPrice || null;
      asset.lastLoggedMove = 0;
      if (asset.inPosition) forceExit(symbol, 'market_expired');
      
      asset.currentMarket = {
        id: active.id,
        title: active.title,
        endDate: new Date(active.endDate),
      };
      log(`NEW: ${active.title.split(' - ')[1] || active.title}`, 'market', symbol);
      if (asset.baselinePrice) {
        log(`Baseline: $${asset.baselinePrice.toFixed(asset.baselinePrice > 100 ? 2 : 4)} | UP=$${asset.upPrice.toFixed(3)} DOWN=$${asset.downPrice.toFixed(3)}`, 'info', symbol);
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
  const stats = state.stats.byAsset[symbol];
  
  if (!asset.currentMarket || !asset.baselinePrice || !asset.currentPrice) return;
  if (!asset.upPrice || !asset.downPrice) return;
  
  const timeLeft = (asset.currentMarket.endDate - Date.now()) / 1000;
  if (timeLeft < CONFIG.trading.minTimeLeft) return;
  if (asset.upPrice > 0.9 || asset.downPrice > 0.9) return;
  if (asset.upPrice < 0.1 || asset.downPrice < 0.1) return;
  
  const move = (asset.currentPrice - asset.baselinePrice) / asset.baselinePrice;
  const direction = move > 0 ? 'UP' : 'DOWN';
  
  if (asset.inPosition) {
    checkExit(symbol, direction, move, timeLeft);
    return;
  }
  
  if (Date.now() - asset.lastTradeTime < CONFIG.trading.cooldownMs) return;
  if (Math.abs(move) < CONFIG.trading.moveThreshold) return;
  
  const targetPrice = direction === 'UP' ? asset.upPrice : asset.downPrice;
  if (targetPrice > CONFIG.trading.maxOddsEntry) return;
  
  // SIGNAL!
  state.stats.totalSignals++;
  stats.signals++;
  
  log(`SIGNAL: ${direction} ${(Math.abs(move) * 100).toFixed(3)}% | Entry: $${targetPrice.toFixed(3)} | ${timeLeft.toFixed(0)}s`, 'signal', symbol);
  
  asset.inPosition = true;
  asset.lastTradeTime = Date.now();
  asset.position = {
    side: direction,
    entryPrice: targetPrice,
    entryTime: Date.now(),
    oracleAtEntry: asset.currentPrice,
  };
  
  state.stats.totalTrades++;
  stats.trades++;
  
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
  
  if (currentDirection !== pos.side && Math.abs(currentMove) > CONFIG.trading.moveThreshold) {
    exitReason = 'direction_flip';
  } else if (pnlPct >= CONFIG.trading.profitTarget) {
    exitReason = 'profit_target';
  } else if (pnlPct <= -CONFIG.trading.stopLoss) {
    exitReason = 'stop_loss';
  } else if (timeLeft < 15) {
    exitReason = 'pre_resolution';
  } else if (currentPrice > 0.9 || currentPrice < 0.1) {
    exitReason = 'resolved';
  }
  
  if (exitReason) executeExit(symbol, currentPrice, pnlPct, pnlDollars, exitReason);
}

function forceExit(symbol, reason) {
  const asset = state.assets[symbol];
  if (!asset.inPosition) return;
  const currentPrice = asset.position.side === 'UP' ? asset.upPrice : asset.downPrice;
  const pnlPct = (currentPrice - asset.position.entryPrice) / asset.position.entryPrice;
  executeExit(symbol, currentPrice, pnlPct, pnlPct * CONFIG.trading.positionSize, reason);
}

function executeExit(symbol, exitPrice, pnlPct, pnlDollars, reason) {
  const asset = state.assets[symbol];
  const stats = state.stats.byAsset[symbol];
  const pos = asset.position;
  
  state.stats.totalPnL += pnlDollars;
  stats.pnl += pnlDollars;
  
  if (pnlDollars > 0.5) { state.stats.totalWins++; stats.wins++; }
  else if (pnlDollars < -0.5) { state.stats.totalLosses++; stats.losses++; }
  
  const emoji = pnlDollars >= 0 ? '💰' : '📉';
  log(`EXIT: ${pos.side} @ $${exitPrice.toFixed(4)} | ${emoji} $${pnlDollars.toFixed(2)} (${(pnlPct * 100).toFixed(1)}%) | ${reason}`, 'exit', symbol);
  
  state.trades.push({
    timestamp: new Date().toISOString(),
    asset: symbol,
    market: asset.currentMarket?.title,
    side: pos.side,
    entryPrice: pos.entryPrice,
    exitPrice,
    pnlPct,
    pnlDollars,
    reason,
    holdTimeMs: Date.now() - pos.entryTime,
  });
  
  saveJournal();
  asset.inPosition = false;
  asset.position = null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATUS
// ═══════════════════════════════════════════════════════════════════════════════

function printStatus() {
  const runtime = Math.floor((Date.now() - state.startTime) / 60000);
  const winRate = state.stats.totalTrades > 0 ? ((state.stats.totalWins / state.stats.totalTrades) * 100).toFixed(1) : '0.0';
  
  log('═══════════════════════════════════════════════════════════════', 'info');
  log(`RTDS CHAINLINK BOT (${runtime} min runtime)`, 'info');
  log(`WebSocket: ${state.wsConnected ? '🟢 Connected' : '🔴 Disconnected'}`, 'info');
  
  for (const [sym, asset] of Object.entries(state.assets)) {
    const s = state.stats.byAsset[sym];
    const market = asset.currentMarket?.title?.split(' - ')[1] || 'No market';
    const pos = asset.inPosition ? `IN ${asset.position.side}` : 'WATCHING';
    const price = asset.currentPrice ? `$${asset.currentPrice.toFixed(asset.currentPrice > 100 ? 2 : 4)}` : '?';
    log(`${sym}: ${price} | ${market} | ${pos} | T:${s.trades} W:${s.wins} L:${s.losses} | $${s.pnl.toFixed(2)}`, 'info');
  }
  
  log(`TOTALS: Signals:${state.stats.totalSignals} Trades:${state.stats.totalTrades} W/L:${state.stats.totalWins}/${state.stats.totalLosses}`, 'info');
  log(`PnL: $${state.stats.totalPnL.toFixed(2)} | Win Rate: ${winRate}%`, state.stats.totalPnL >= 0 ? 'profit' : 'error');
  log('═══════════════════════════════════════════════════════════════', 'info');
  saveJournal();
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
  console.log(`
╔═══════════════════════════════════════════════════════════════════════════════╗
║              MULTI-ASSET BOT v3 - Polymarket RTDS Edition                     ║
║                                                                               ║
║  Using Polymarket's OWN Chainlink feed (crypto_prices_chainlink)              ║
║  This is the EXACT data used to resolve markets!                              ║
║  Assets: BTC, ETH, SOL, XRP | Runtime: 12 hours                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
  `);
  
  log(`Mode: ${CONFIG.mode.toUpperCase()}`, 'info');
  
  // Initial market fetch
  for (const symbol of Object.keys(CONFIG.assets)) {
    await fetchMarketData(symbol);
  }
  
  // Connect to Polymarket RTDS
  connectRTDS();
  
  // Periodic market refresh
  setInterval(async () => {
    for (const symbol of Object.keys(CONFIG.assets)) {
      await fetchMarketData(symbol);
    }
  }, CONFIG.polling.marketMs);
  
  // Status reports
  setInterval(printStatus, CONFIG.polling.statusMs);
  setTimeout(printStatus, 15000);
  
  // Runtime limit
  setTimeout(() => {
    printStatus();
    process.exit(0);
  }, CONFIG.runtime);
  
  process.on('SIGINT', () => {
    printStatus();
    process.exit(0);
  });
}

main().catch(e => {
  log(`Fatal: ${e.message}`, 'error');
  process.exit(1);
});
