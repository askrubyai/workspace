#!/usr/bin/env node

/**
 * BTC 15-Minute Arbitrage Bot - WebSocket Version
 * 
 * Real-time monitoring via WebSocket for faster arbitrage detection.
 * Paper trading mode to track potential profits.
 */

require('dotenv').config();
const WebSocket = require('ws');
const fetch = require('node-fetch');
const fs = require('fs');

// =============================================================================
// CONFIGURATION
// =============================================================================

const CONFIG = {
  // Arbitrage settings
  arbitrage: {
    maxSpread: 0.97,        // Buy BOTH when UP + DOWN <= this
    minProfitPct: 0.03,     // 3% minimum profit
    positionSize: 50,       // $ per trade
  },
  
  // WebSocket endpoints
  ws: {
    polymarket: 'wss://ws-subscriptions-clob.polymarket.com/ws/market',
    binance: 'wss://stream.binance.com:9443/ws/btcusdt@trade',
  },
  
  // API endpoints
  api: {
    gamma: 'https://gamma-api.polymarket.com',
    clob: 'https://clob.polymarket.com',
  },
  
  // Timing
  marketRefreshMs: 30000,  // Refresh market list every 30s
};

// =============================================================================
// STATE
// =============================================================================

const state = {
  currentMarket: null,
  upTokenId: null,
  downTokenId: null,
  upPrice: null,
  downPrice: null,
  btcPrice: null,
  
  // WebSocket connections
  polymarketWs: null,
  binanceWs: null,
  
  // Paper trading stats
  paper: {
    trades: [],
    totalProfit: 0,
    opportunitiesFound: 0,
    marketsWatched: 0,
    startTime: null,
  },
  
  // Current market tracking
  marketEndTime: null,
  isWatching: false,
};

// =============================================================================
// LOGGING
// =============================================================================

function log(msg, type = 'info') {
  const now = new Date().toLocaleTimeString('en-US', { hour12: false });
  const prefix = {
    info: '📊',
    success: '✅',
    warning: '⚠️',
    error: '❌',
    money: '💰',
    ws: '🔌',
    arb: '🎯',
  }[type] || 'ℹ️';
  
  console.log(`[${now}] ${prefix} ${msg}`);
}

function logStatus() {
  console.log('\n' + '═'.repeat(60));
  console.log('📈 BTC 15m Arbitrage Bot - WebSocket Edition');
  console.log('═'.repeat(60));
  
  if (state.currentMarket) {
    const timeLeft = state.marketEndTime ? 
      Math.max(0, (state.marketEndTime - Date.now()) / 60000).toFixed(1) : '?';
    
    console.log(`\n📊 Current Market: ${state.currentMarket.title}`);
    console.log(`⏰ Time remaining: ${timeLeft} min`);
    console.log('─'.repeat(60));
    console.log(`   UP:   $${(state.upPrice || 0).toFixed(4)}`);
    console.log(`   DOWN: $${(state.downPrice || 0).toFixed(4)}`);
    
    const spread = (state.upPrice || 0) + (state.downPrice || 0);
    const spreadColor = spread <= CONFIG.arbitrage.maxSpread ? '\x1b[32m' : '\x1b[0m';
    console.log(`   SUM:  ${spreadColor}$${spread.toFixed(4)}\x1b[0m`);
    
    if (spread <= CONFIG.arbitrage.maxSpread && spread > 0) {
      const profit = ((1 - spread) * 100).toFixed(2);
      console.log(`\n🎯 ARBITRAGE AVAILABLE: ${profit}% profit!`);
    }
  } else {
    console.log('\n⏳ Waiting for active market...');
  }
  
  console.log('\n─'.repeat(60));
  console.log('📋 Paper Trading Stats:');
  console.log(`   Markets watched: ${state.paper.marketsWatched}`);
  console.log(`   Opportunities: ${state.paper.opportunitiesFound}`);
  console.log(`   Paper trades: ${state.paper.trades.length}`);
  console.log(`   Paper profit: $${state.paper.totalProfit.toFixed(2)}`);
  console.log('═'.repeat(60) + '\n');
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
    
    if (!eventData.markets || !eventData.markets[0]) return null;
    
    const market = eventData.markets[0];
    const tokenIds = JSON.parse(market.clobTokenIds || '[]');
    const prices = JSON.parse(market.outcomePrices || '[0.5,0.5]');
    
    return {
      id: event.id,
      title: event.title,
      endDate: new Date(event.endDate),
      conditionId: market.conditionId,
      upTokenId: tokenIds[0],
      downTokenId: tokenIds[1],
      upPrice: parseFloat(prices[0]),
      downPrice: parseFloat(prices[1]),
    };
  } catch (e) {
    log(`Error fetching market: ${e.message}`, 'error');
    return null;
  }
}

async function fetchOrderBookPrices(tokenId) {
  try {
    const resp = await fetch(`${CONFIG.api.clob}/book?token_id=${tokenId}`);
    const book = await resp.json();
    
    const bestBid = book.bids?.[0] ? parseFloat(book.bids[0].price) : null;
    const bestAsk = book.asks?.[0] ? parseFloat(book.asks[0].price) : null;
    
    return { bestBid, bestAsk, midPrice: bestBid && bestAsk ? (bestBid + bestAsk) / 2 : null };
  } catch (e) {
    return { bestBid: null, bestAsk: null, midPrice: null };
  }
}

// =============================================================================
// WEBSOCKET CONNECTIONS
// =============================================================================

function connectPolymarketWs() {
  if (!state.upTokenId || !state.downTokenId) {
    log('No token IDs to subscribe to', 'warning');
    return;
  }
  
  // Close existing connection
  if (state.polymarketWs) {
    state.polymarketWs.close();
  }
  
  log('Connecting to Polymarket WebSocket...', 'ws');
  
  const ws = new WebSocket(CONFIG.ws.polymarket);
  
  ws.on('open', () => {
    log('Polymarket WebSocket connected', 'success');
    
    // Subscribe to both token price updates
    const subscribeMsg = {
      type: 'subscribe',
      channel: 'market',
      markets: [state.upTokenId, state.downTokenId],
    };
    
    ws.send(JSON.stringify(subscribeMsg));
    log(`Subscribed to UP and DOWN tokens`, 'ws');
  });
  
  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      handlePolymarketMessage(msg);
    } catch (e) {
      // Ignore parse errors
    }
  });
  
  ws.on('error', (err) => {
    log(`Polymarket WS error: ${err.message}`, 'error');
  });
  
  ws.on('close', () => {
    log('Polymarket WebSocket closed', 'warning');
    // Reconnect after delay
    setTimeout(() => {
      if (state.isWatching) connectPolymarketWs();
    }, 5000);
  });
  
  state.polymarketWs = ws;
}

function handlePolymarketMessage(msg) {
  // Handle different message types
  if (msg.event_type === 'price_change' || msg.type === 'price') {
    const tokenId = msg.asset_id || msg.market;
    const price = parseFloat(msg.price || msg.last_price);
    
    if (tokenId === state.upTokenId) {
      state.upPrice = price;
    } else if (tokenId === state.downTokenId) {
      state.downPrice = price;
    }
    
    checkArbitrage();
  }
  
  // Handle book updates
  if (msg.event_type === 'book' || msg.type === 'book') {
    // Extract best prices from book update
    if (msg.bids?.[0] && msg.asks?.[0]) {
      const mid = (parseFloat(msg.bids[0].price) + parseFloat(msg.asks[0].price)) / 2;
      const tokenId = msg.asset_id || msg.market;
      
      if (tokenId === state.upTokenId) {
        state.upPrice = mid;
      } else if (tokenId === state.downTokenId) {
        state.downPrice = mid;
      }
      
      checkArbitrage();
    }
  }
}

function connectBinanceWs() {
  log('Connecting to Binance WebSocket...', 'ws');
  
  const ws = new WebSocket(CONFIG.ws.binance);
  
  ws.on('open', () => {
    log('Binance WebSocket connected', 'success');
  });
  
  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.p) {
        state.btcPrice = parseFloat(msg.p);
      }
    } catch (e) {
      // Ignore
    }
  });
  
  ws.on('error', (err) => {
    log(`Binance WS error: ${err.message}`, 'error');
  });
  
  ws.on('close', () => {
    log('Binance WebSocket closed', 'warning');
    setTimeout(connectBinanceWs, 5000);
  });
  
  state.binanceWs = ws;
}

// =============================================================================
// ARBITRAGE DETECTION
// =============================================================================

let lastArbitrageCheck = 0;

function checkArbitrage() {
  if (!state.upPrice || !state.downPrice) return;
  
  const spread = state.upPrice + state.downPrice;
  
  // Rate limit logging
  const now = Date.now();
  if (now - lastArbitrageCheck < 1000) return;
  lastArbitrageCheck = now;
  
  // Check for arbitrage
  if (spread <= CONFIG.arbitrage.maxSpread && spread > 0) {
    const profitPct = (1 - spread) * 100;
    const profitUsd = CONFIG.arbitrage.positionSize * (1 - spread);
    
    state.paper.opportunitiesFound++;
    
    log(`ARBITRAGE! Spread: $${spread.toFixed(4)} | Profit: ${profitPct.toFixed(2)}% ($${profitUsd.toFixed(2)})`, 'arb');
    
    // Record paper trade
    const trade = {
      time: new Date().toISOString(),
      market: state.currentMarket?.title,
      upPrice: state.upPrice,
      downPrice: state.downPrice,
      spread,
      profitPct,
      profitUsd,
      positionSize: CONFIG.arbitrage.positionSize,
    };
    
    state.paper.trades.push(trade);
    state.paper.totalProfit += profitUsd;
    
    log(`Paper trade recorded: +$${profitUsd.toFixed(2)} profit`, 'money');
    
    // Save to file
    savePaperTrades();
  }
}

function savePaperTrades() {
  const filename = `/Users/ruby/.openclaw/workspace/projects/btc-15m-arbitrage/paper-trades.json`;
  fs.writeFileSync(filename, JSON.stringify(state.paper, null, 2));
}

// =============================================================================
// POLLING FALLBACK (for when WS doesn't update)
// =============================================================================

async function pollPrices() {
  if (!state.upTokenId || !state.downTokenId) return;
  
  try {
    const [upBook, downBook] = await Promise.all([
      fetchOrderBookPrices(state.upTokenId),
      fetchOrderBookPrices(state.downTokenId),
    ]);
    
    if (upBook.midPrice) state.upPrice = upBook.midPrice;
    if (downBook.midPrice) state.downPrice = downBook.midPrice;
    
    checkArbitrage();
  } catch (e) {
    // Ignore
  }
}

// =============================================================================
// MARKET LIFECYCLE
// =============================================================================

async function watchMarket(market) {
  state.currentMarket = market;
  state.upTokenId = market.upTokenId;
  state.downTokenId = market.downTokenId;
  state.upPrice = market.upPrice;
  state.downPrice = market.downPrice;
  state.marketEndTime = market.endDate.getTime();
  state.isWatching = true;
  state.paper.marketsWatched++;
  
  log(`Watching market: ${market.title}`, 'info');
  log(`End time: ${market.endDate.toLocaleTimeString()}`, 'info');
  
  // Connect WebSocket
  connectPolymarketWs();
  
  // Poll as backup every 2 seconds
  const pollInterval = setInterval(pollPrices, 2000);
  
  // Status update every 10 seconds
  const statusInterval = setInterval(logStatus, 10000);
  
  // Wait for market to end
  const timeToEnd = market.endDate.getTime() - Date.now();
  
  await new Promise(resolve => setTimeout(resolve, Math.max(0, timeToEnd)));
  
  // Cleanup
  clearInterval(pollInterval);
  clearInterval(statusInterval);
  state.isWatching = false;
  
  if (state.polymarketWs) {
    state.polymarketWs.close();
    state.polymarketWs = null;
  }
  
  log(`Market ended: ${market.title}`, 'info');
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  console.clear();
  log('🚀 BTC 15m Arbitrage Bot - WebSocket Edition', 'info');
  log('Mode: PAPER TRADING', 'info');
  log(`Arbitrage threshold: $${CONFIG.arbitrage.maxSpread} (${((1 - CONFIG.arbitrage.maxSpread) * 100).toFixed(0)}% min profit)`, 'info');
  console.log('');
  
  state.paper.startTime = new Date().toISOString();
  
  // Connect to Binance for BTC price
  connectBinanceWs();
  
  // Main loop - watch markets continuously
  let marketsToWatch = 3; // Watch 3 consecutive markets
  
  while (marketsToWatch > 0) {
    // Find current active market
    const market = await fetchCurrentMarket();
    
    if (!market) {
      log('No active market, waiting 30s...', 'warning');
      await new Promise(r => setTimeout(r, 30000));
      continue;
    }
    
    // Check if we have enough time
    const timeLeft = (market.endDate.getTime() - Date.now()) / 60000;
    if (timeLeft < 1) {
      log('Market ending soon, waiting for next...', 'info');
      await new Promise(r => setTimeout(r, 60000));
      continue;
    }
    
    // Watch this market
    await watchMarket(market);
    marketsToWatch--;
    
    log(`\n📊 Progress: ${3 - marketsToWatch}/3 markets watched`, 'info');
    
    // Brief pause between markets
    await new Promise(r => setTimeout(r, 5000));
  }
  
  // Final report
  console.log('\n');
  console.log('═'.repeat(60));
  console.log('📊 FINAL PAPER TRADING REPORT');
  console.log('═'.repeat(60));
  console.log(`\nSession: ${state.paper.startTime} to ${new Date().toISOString()}`);
  console.log(`Markets watched: ${state.paper.marketsWatched}`);
  console.log(`Arbitrage opportunities: ${state.paper.opportunitiesFound}`);
  console.log(`Paper trades executed: ${state.paper.trades.length}`);
  console.log(`\n💰 TOTAL PAPER PROFIT: $${state.paper.totalProfit.toFixed(2)}`);
  
  if (state.paper.trades.length > 0) {
    console.log('\n📝 Trade Details:');
    state.paper.trades.forEach((t, i) => {
      console.log(`  ${i + 1}. ${t.time.split('T')[1].split('.')[0]} | Spread: $${t.spread.toFixed(4)} | Profit: $${t.profitUsd.toFixed(2)}`);
    });
  }
  
  console.log('\n═'.repeat(60));
  
  // Save final report
  savePaperTrades();
  log(`Report saved to paper-trades.json`, 'success');
  
  // Cleanup
  if (state.binanceWs) state.binanceWs.close();
  
  process.exit(0);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  log('\nShutting down...', 'warning');
  savePaperTrades();
  if (state.polymarketWs) state.polymarketWs.close();
  if (state.binanceWs) state.binanceWs.close();
  
  console.log('\n📊 Paper trading stats saved to paper-trades.json');
  process.exit(0);
});

main().catch(e => {
  log(`Fatal error: ${e.message}`, 'error');
  process.exit(1);
});
