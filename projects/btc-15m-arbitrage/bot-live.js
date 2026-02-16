#!/usr/bin/env node

/**
 * MULTI-ASSET 15M ARBITRAGE BOT - LIVE TRADING VERSION
 * 
 * Uses Polymarket RTDS WebSocket for Chainlink prices
 * Executes REAL trades via Polymarket CLOB API
 * 
 * CAUTION: This bot uses REAL money!
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
  mode: 'live', // LIVE TRADING!
  runtime: 6 * 60 * 60 * 1000, // 6 hours
  
  assets: {
    BTC: { seriesId: '10192', chainlinkSymbol: 'btc/usd' },
    ETH: { seriesId: '10191', chainlinkSymbol: 'eth/usd' },
    SOL: { seriesId: '10423', chainlinkSymbol: 'sol/usd' },
    XRP: { seriesId: '10422', chainlinkSymbol: 'xrp/usd' },
  },
  
  trading: {
    moveThreshold: 0.0003,    // 0.03% price move to trigger (SAME AS PAPER)
    maxOddsEntry: 0.55,       // Don't enter if odds > 55% (SAME AS PAPER)
    minTimeLeft: 30,          // Min 30s before market ends (SAME AS PAPER)
    profitTarget: 0.05,       // 5% profit target (SAME AS PAPER)
    stopLoss: 0.10,           // 10% stop loss (SAME AS PAPER)
    cooldownMs: 15000,        // 15s between trades per asset (SAME AS PAPER)
    positionSize: 5,          // $5 per trade (~10% of $53 balance)
  },
  
  polling: {
    marketMs: 10000,
    statusMs: 300000,         // Status every 5 min
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
  
  stats: {
    totalSignals: 0,
    totalTrades: 0,
    totalWins: 0,
    totalLosses: 0,
    totalBreakeven: 0,
    totalPnL: 0,
    priceUpdates: 0,
    byAsset: {},
    liveOrders: 0,
    failedOrders: 0,
  },
  
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
    pendingOrder: null,
  };
  state.stats.byAsset[symbol] = { signals: 0, trades: 0, wins: 0, losses: 0, pnl: 0, priceUpdates: 0 };
});

const TRADE_JOURNAL = '/Users/ruby/.openclaw/workspace/projects/btc-15m-arbitrage/trade-journal-live.json';
const LOG_FILE = '/Users/ruby/.openclaw/workspace/projects/btc-15m-arbitrage/bot-live.log';

// ═══════════════════════════════════════════════════════════════════════════════
// LOGGING
// ═══════════════════════════════════════════════════════════════════════════════

function log(message, type = 'info', asset = null) {
  const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 });
  const prefix = asset ? `[${asset}]` : '';
  const icons = {
    signal: '🎯', entry: '📈', exit: '📉', oracle: '🔮', warning: '⚠️', error: '❌',
    info: 'ℹ️', order: '💰', success: '✅', live: '🔴'
  };
  const line = `[${time}] ${icons[type] || '•'} ${prefix} ${message}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

function saveTrades() {
  fs.writeFileSync(TRADE_JOURNAL, JSON.stringify({ trades: state.trades }, null, 2));
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLOB CLIENT INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

async function initClobClient() {
  log('Initializing CLOB client for LIVE trading...', 'live');
  
  const wallet = new ethers.Wallet(process.env.POLYMARKET_PK);
  log(`Signer: ${wallet.address}`, 'info');
  log(`Funder: ${process.env.POLYMARKET_FUNDER}`, 'info');
  log(`Signature Type: ${process.env.POLYMARKET_SIGNATURE_TYPE}`, 'info');
  
  // Create temp client to derive API creds
  const tempClient = new ClobClient(CONFIG.clobHost, 137, wallet);
  const apiCreds = await tempClient.createOrDeriveApiKey();
  
  // Create full client with proxy wallet
  state.clobClient = new ClobClient(
    CONFIG.clobHost,
    137,
    wallet,
    apiCreds,
    parseInt(process.env.POLYMARKET_SIGNATURE_TYPE),
    process.env.POLYMARKET_FUNDER
  );
  
  // Test connection
  const orders = await state.clobClient.getOpenOrders();
  log(`✅ CLOB connected! Open orders: ${orders.length}`, 'success');
  
  return true;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LIVE ORDER EXECUTION
// ═══════════════════════════════════════════════════════════════════════════════

async function executeBuyOrder(symbol, side, tokenId, price, size) {
  const asset = state.assets[symbol];
  
  try {
    const shares = Math.floor(size / price);
    log(`Placing BUY order: ${side} ${shares} shares @ $${price.toFixed(3)}`, 'order', symbol);
    
    // Get market info for tick size
    let tickSize = "0.01";
    let negRisk = false;
    try {
      const market = await state.clobClient.getMarket(tokenId);
      tickSize = market?.tickSize || "0.01";
      negRisk = market?.negRisk || false;
    } catch (e) {
      // Use defaults if market lookup fails
    }
    
    const order = await state.clobClient.createAndPostOrder(
      {
        tokenID: tokenId,
        price: price,
        size: shares,
        side: Side.BUY,
      },
      { tickSize, negRisk },
      OrderType.GTC
    );
    
    log(`✅ BUY order placed! ID: ${order.orderID}`, 'success', symbol);
    state.stats.liveOrders++;
    
    return { success: true, orderId: order.orderID, shares };
  } catch (err) {
    log(`❌ BUY order failed: ${err.message}`, 'error', symbol);
    state.stats.failedOrders++;
    return { success: false, error: err.message };
  }
}

async function executeSellOrder(symbol, tokenId, price, shares) {
  try {
    log(`Placing SELL order: ${shares} shares @ $${price.toFixed(3)}`, 'order', symbol);
    
    // Get market info for tick size
    let tickSize = "0.01";
    let negRisk = false;
    try {
      const market = await state.clobClient.getMarket(tokenId);
      tickSize = market?.tickSize || "0.01";
      negRisk = market?.negRisk || false;
    } catch (e) {
      // Use defaults if market lookup fails
    }
    
    const order = await state.clobClient.createAndPostOrder(
      {
        tokenID: tokenId,
        price: price,
        size: shares,
        side: Side.SELL,
      },
      { tickSize, negRisk },
      OrderType.GTC
    );
    
    log(`✅ SELL order placed! ID: ${order.orderID}`, 'success', symbol);
    state.stats.liveOrders++;
    
    return { success: true, orderId: order.orderID };
  } catch (err) {
    log(`❌ SELL order failed: ${err.message}`, 'error', symbol);
    state.stats.failedOrders++;
    return { success: false, error: err.message };
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
  log('Connecting to Polymarket RTDS WebSocket...', 'info');
  
  const ws = new WebSocket('wss://ws-live-data.polymarket.com/');
  let pingInterval = null;
  
  ws.on('open', () => {
    log('✅ WebSocket connected!', 'success');
    state.connected = true;
    
    // Correct RTDS subscription format - needs subscriptions array!
    ws.send(JSON.stringify({ 
      action: 'subscribe', 
      subscriptions: [
        { topic: 'crypto_prices_chainlink', type: '*' }
      ]
    }));
    
    // CRITICAL: Must ping every 5 seconds to keep connection alive
    pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) ws.send('ping');
    }, 5000);
  });
  
  ws.on('message', (data) => {
    const str = data.toString();
    if (str === 'pong') return; // Skip pong responses
    
    try {
      const msg = JSON.parse(str);
      // Handle crypto price messages
      if (msg.topic === 'crypto_prices_chainlink' && msg.payload) {
        handlePriceUpdate(msg);
      }
    } catch (e) {}
  });
  
  ws.on('error', (e) => log(`WebSocket error: ${e.message}`, 'error'));
  
  ws.on('close', () => {
    log('WebSocket disconnected. Reconnecting...', 'warning');
    state.connected = false;
    if (pingInterval) clearInterval(pingInterval);
    setTimeout(initWebSocket, 5000);
  });
}

function handlePriceUpdate(message) {
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
  
  asset.currentPrice = price;
  asset.lastPriceUpdate = Date.now();
  
  if (asset.currentMarket && !asset.baselinePrice) {
    asset.baselinePrice = price;
    log(`Baseline: $${price.toFixed(price > 100 ? 2 : 4)}`, 'oracle', assetSymbol);
  }
  
  checkSignal(assetSymbol);
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
      if (asset.currentMarket) log(`No active market`, 'warning', symbol);
      asset.currentMarket = null;
      return;
    }
    
    const eventResp = await fetch(`${CONFIG.gammaApi}/events/${active.id}`);
    const eventData = await eventResp.json();
    const market = eventData.markets?.[0];
    if (!market) return;
    
    const isNewMarket = !asset.currentMarket || asset.currentMarket.id !== market.id;
    
    if (isNewMarket) {
      if (asset.inPosition) {
        log(`Market changed while in position - forcing exit`, 'warning', symbol);
        forceExit(symbol, 'market_expired');
      }
      asset.baselinePrice = null;
      log(`New market: ${market.question}`, 'info', symbol);
    }
    
    asset.currentMarket = {
      id: market.id,
      title: market.question,
      endDate: new Date(active.endDate),
    };
    
    // Parse prices from outcomes (they come as JSON strings from API)
    try {
      const outcomes = typeof market.outcomes === 'string' ? JSON.parse(market.outcomes) : market.outcomes || [];
      const outcomePrices = typeof market.outcomePrices === 'string' ? JSON.parse(market.outcomePrices) : market.outcomePrices || [];
      const clobTokenIds = typeof market.clobTokenIds === 'string' ? JSON.parse(market.clobTokenIds) : market.clobTokenIds || [];
      
      asset.upPrice = parseFloat(outcomePrices[0]) || 0.5;
      asset.downPrice = parseFloat(outcomePrices[1]) || 0.5;
      asset.upTokenId = clobTokenIds[0];
      asset.downTokenId = clobTokenIds[1];
    } catch (parseErr) {
      log(`Price parse error: ${parseErr.message}`, 'error', symbol);
    }
    
  } catch (err) {
    log(`Market fetch error: ${err.message}`, 'error', symbol);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRADING LOGIC
// ═══════════════════════════════════════════════════════════════════════════════

async function checkSignal(symbol) {
  const asset = state.assets[symbol];
  const assetStats = state.stats.byAsset[symbol];
  
  if (!asset.currentMarket || !asset.baselinePrice || !asset.currentPrice) return;
  if (!asset.upTokenId || !asset.downTokenId) return;
  
  const timeLeft = (asset.currentMarket.endDate - Date.now()) / 1000;
  if (timeLeft < CONFIG.trading.minTimeLeft) return;
  if (asset.upPrice > 0.9 || asset.downPrice > 0.9) return;
  
  const move = (asset.currentPrice - asset.baselinePrice) / asset.baselinePrice;
  const direction = move > 0 ? 'UP' : 'DOWN';
  
  if (asset.inPosition) {
    await checkExit(symbol, direction, move, timeLeft);
    return;
  }
  
  if (Date.now() - asset.lastTradeTime < CONFIG.trading.cooldownMs) return;
  if (Math.abs(move) < CONFIG.trading.moveThreshold) return;
  
  const targetPrice = direction === 'UP' ? asset.upPrice : asset.downPrice;
  if (targetPrice > CONFIG.trading.maxOddsEntry) return;
  
  // SIGNAL DETECTED!
  state.stats.totalSignals++;
  assetStats.signals++;
  
  log(`🎯 SIGNAL: ${direction} ${(Math.abs(move) * 100).toFixed(3)}% | Entry: $${targetPrice.toFixed(3)}`, 'signal', symbol);
  
  // IMMEDIATELY mark as in position to prevent duplicate orders
  asset.inPosition = true;
  asset.lastTradeTime = Date.now();
  
  // Execute LIVE BUY order
  const tokenId = direction === 'UP' ? asset.upTokenId : asset.downTokenId;
  const result = await executeBuyOrder(symbol, direction, tokenId, targetPrice, CONFIG.trading.positionSize);
  
  if (result.success) {
    asset.position = {
      side: direction,
      entryPrice: targetPrice,
      entryTime: Date.now(),
      tokenId: tokenId,
      shares: result.shares, // Track shares for selling
      orderId: result.orderId,
      baselineAtEntry: asset.baselinePrice,
      oracleAtEntry: asset.currentPrice,
    };
    state.stats.totalTrades++;
    assetStats.trades++;
    log(`📈 ENTRY: ${direction} @ $${targetPrice.toFixed(4)}`, 'entry', symbol);
  } else {
    // Order failed - reset position flag so we can try again
    asset.inPosition = false;
    log(`⚠️ Entry failed, position reset`, 'warning', symbol);
  }
}

async function checkExit(symbol, currentDirection, currentMove, timeLeft) {
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
    exitReason = 'market_resolved';
  }
  
  if (!exitReason) return;
  
  await executeExit(symbol, currentPrice, pnlPct, pnlDollars, exitReason);
}

async function forceExit(symbol, reason) {
  const asset = state.assets[symbol];
  if (!asset.inPosition || !asset.position) return;
  
  const currentPrice = asset.position.side === 'UP' ? asset.upPrice : asset.downPrice;
  const pnlPct = currentPrice ? (currentPrice - asset.position.entryPrice) / asset.position.entryPrice : 0;
  const pnlDollars = pnlPct * CONFIG.trading.positionSize;
  
  await executeExit(symbol, currentPrice || asset.position.entryPrice, pnlPct, pnlDollars, reason);
}

async function executeExit(symbol, exitPrice, pnlPct, pnlDollars, reason) {
  const asset = state.assets[symbol];
  const assetStats = state.stats.byAsset[symbol];
  const pos = asset.position;
  
  // LIVE SELL ORDER - Execute the actual sell!
  if (pos.tokenId && pos.shares > 0) {
    log(`Executing SELL: ${pos.shares} shares @ $${exitPrice.toFixed(3)} (${reason})`, 'order', symbol);
    const sellResult = await executeSellOrder(symbol, pos.tokenId, exitPrice, pos.shares);
    if (!sellResult.success) {
      log(`⚠️ SELL failed but marking position closed: ${sellResult.error}`, 'warning', symbol);
    }
  }
  
  state.stats.totalPnL += pnlDollars;
  assetStats.pnl += pnlDollars;
  
  if (pnlDollars > 0.1) {
    state.stats.totalWins++;
    assetStats.wins++;
  } else if (pnlDollars < -0.1) {
    state.stats.totalLosses++;
    assetStats.losses++;
  } else {
    state.stats.totalBreakeven++;
  }
  
  const emoji = pnlDollars >= 0 ? '💰' : '📉';
  log(`EXIT: ${pos.side} @ $${exitPrice.toFixed(4)} | ${emoji} $${pnlDollars.toFixed(2)} (${(pnlPct * 100).toFixed(1)}%) | ${reason}`, 'exit', symbol);
  
  state.trades.push({
    timestamp: new Date().toISOString(),
    asset: symbol,
    market: asset.currentMarket?.title,
    side: pos.side,
    entryPrice: pos.entryPrice,
    exitPrice: exitPrice,
    pnlPct, pnlDollars, reason,
    holdTimeMs: Date.now() - pos.entryTime,
    oracleEntry: pos.oracleAtEntry,
    oracleExit: asset.currentPrice,
    live: true,
    orderId: pos.orderId,
  });
  
  saveTrades();
  asset.inPosition = false;
  asset.position = null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATUS
// ═══════════════════════════════════════════════════════════════════════════════

function printStatus() {
  const runtime = Math.floor((Date.now() - state.startTime) / 60000);
  const winRate = state.stats.totalTrades > 0 
    ? ((state.stats.totalWins / (state.stats.totalWins + state.stats.totalLosses)) * 100).toFixed(1) 
    : '0.0';
  
  console.log('\n' + '═'.repeat(60));
  console.log(`🔴 LIVE BOT STATUS | Runtime: ${runtime}m | Mode: ${CONFIG.mode.toUpperCase()}`);
  console.log('═'.repeat(60));
  console.log(`Trades: ${state.stats.totalTrades} | Wins: ${state.stats.totalWins} | Losses: ${state.stats.totalLosses} | Win Rate: ${winRate}%`);
  console.log(`P&L: $${state.stats.totalPnL.toFixed(2)} | Orders: ${state.stats.liveOrders} | Failed: ${state.stats.failedOrders}`);
  console.log('─'.repeat(60));
  
  Object.keys(CONFIG.assets).forEach(symbol => {
    const asset = state.assets[symbol];
    const stats = state.stats.byAsset[symbol];
    const pos = asset.inPosition ? `IN: ${asset.position?.side}` : 'OUT';
    console.log(`${symbol}: ${pos} | P&L: $${stats.pnl.toFixed(2)} | Trades: ${stats.trades}`);
  });
  
  console.log('═'.repeat(60) + '\n');
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
  console.log('\n🔴🔴🔴 LIVE TRADING BOT STARTING 🔴🔴🔴\n');
  console.log(`Position Size: $${CONFIG.trading.positionSize}`);
  console.log(`Stop Loss: ${CONFIG.trading.stopLoss * 100}%`);
  console.log(`Profit Target: ${CONFIG.trading.profitTarget * 100}%\n`);
  
  // Initialize CLOB client
  try {
    await initClobClient();
  } catch (err) {
    log(`Failed to init CLOB: ${err.message}`, 'error');
    process.exit(1);
  }
  
  // Start WebSocket for prices
  initWebSocket();
  
  // Poll market data
  const pollMarkets = async () => {
    for (const symbol of Object.keys(CONFIG.assets)) {
      await fetchMarketData(symbol);
    }
  };
  
  await pollMarkets();
  setInterval(pollMarkets, CONFIG.polling.marketMs);
  setInterval(printStatus, CONFIG.polling.statusMs);
  
  // Runtime limit
  setTimeout(() => {
    log('Runtime limit reached. Shutting down...', 'warning');
    printStatus();
    process.exit(0);
  }, CONFIG.runtime);
  
  log(`🔴 LIVE BOT RUNNING! Position size: $${CONFIG.trading.positionSize}`, 'live');
}

main().catch(err => {
  log(`Fatal error: ${err.message}`, 'error');
  process.exit(1);
});
