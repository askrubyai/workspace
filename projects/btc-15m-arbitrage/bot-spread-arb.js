#!/usr/bin/env node

/**
 * SPREAD ARBITRAGE BOT v1
 * 
 * Strategy: Buy BOTH UP and DOWN when total < $0.97
 * - Zero directional risk (one MUST win)
 * - Uses LIMIT orders (maker = 0 fees + rebates)
 * - Profit = $1.00 - total_cost
 * 
 * Based on Account88888 strategy ($645K in 2 months)
 */

require('dotenv').config();
const { ethers } = require('ethers');
const fetch = require('node-fetch');
const fs = require('fs');

const CONFIG = {
  mode: 'paper', // 'live' when funded
  arb: {
    maxSpread: 0.97,     // Only enter if UP + DOWN < this
    minProfit: 0.02,     // Minimum 2% profit target
    positionSize: 25,    // $ per side (total = 2x)
  },
  api: {
    gamma: 'https://gamma-api.polymarket.com',
    clob: 'https://clob.polymarket.com',
  },
  pollMs: 2000,          // Check every 2 sec
  runTimeMs: 24 * 60 * 60 * 1000,
};

const state = {
  currentMarket: null,
  upTokenId: null,
  downTokenId: null,
  upPrice: null,
  downPrice: null,
  upBestBid: null,
  upBestAsk: null,
  downBestBid: null,
  downBestAsk: null,
  inPosition: false,
  stats: {
    startTime: Date.now(),
    opportunities: 0,
    trades: 0,
    profit: 0,
  },
};

const LOG_FILE = '/Users/ruby/.openclaw/workspace/projects/btc-15m-arbitrage/bot-spread.log';

function log(msg, type = 'info') {
  const time = new Date().toLocaleTimeString('en-US', { hour12: false });
  const prefix = { 
    info: '📊', success: '✅', warning: '⚠️', error: '❌', 
    arb: '💰', entry: '📈', exit: '📉', market: '🏪', scan: '🔍'
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
      state.currentMarket = null;
      return;
    }
    
    const eventResp = await fetch(`${CONFIG.api.gamma}/events/${active.id}`);
    const eventData = await eventResp.json();
    const market = eventData.markets?.[0];
    
    if (!market) return;
    
    // Get token IDs for order book queries (it's a JSON string!)
    const tokens = JSON.parse(market.clobTokenIds || '[]');
    if (tokens && tokens.length >= 2) {
      state.upTokenId = tokens[0];
      state.downTokenId = tokens[1];
    }
    
    const prices = JSON.parse(market.outcomePrices || '[0.5,0.5]');
    state.upPrice = parseFloat(prices[0]);
    state.downPrice = parseFloat(prices[1]);
    
    const isNew = !state.currentMarket || state.currentMarket.id !== active.id;
    state.currentMarket = { 
      id: active.id, 
      title: active.title, 
      endDate: new Date(active.endDate),
      conditionId: market.conditionId,
    };
    
    if (isNew) {
      log(`MARKET: ${active.title}`, 'market');
      state.inPosition = false; // Reset on new market
    }
  } catch (e) {
    log(`API error: ${e.message}`, 'error');
  }
}

async function fetchOrderBook(tokenId) {
  try {
    const resp = await fetch(`${CONFIG.api.clob}/book?token_id=${tokenId}`);
    const book = await resp.json();
    
    const bestBid = book.bids?.[0]?.price ? parseFloat(book.bids[0].price) : null;
    const bestAsk = book.asks?.[0]?.price ? parseFloat(book.asks[0].price) : null;
    
    return { bestBid, bestAsk };
  } catch (e) {
    return { bestBid: null, bestAsk: null };
  }
}

async function checkArbitrage() {
  if (!state.currentMarket || !state.upTokenId || !state.downTokenId) return;
  if (state.inPosition) return;
  
  // Get order books for both sides
  const [upBook, downBook] = await Promise.all([
    fetchOrderBook(state.upTokenId),
    fetchOrderBook(state.downTokenId),
  ]);
  
  state.upBestAsk = upBook.bestAsk;
  state.downBestAsk = downBook.bestAsk;
  state.upBestBid = upBook.bestBid;
  state.downBestBid = downBook.bestBid;
  
  // Use Gamma API prices (mid-market) as reference
  // Order book asks are often at extreme prices ($0.99)
  const upMid = state.upPrice;
  const downMid = state.downPrice;
  const midSum = upMid + downMid;
  
  // Calculate REAL spread using competitive limit prices
  // We could place limits at mid+1¢ to get filled
  const upLimitPrice = Math.min(upMid + 0.01, 0.99);
  const downLimitPrice = Math.min(downMid + 0.01, 0.99);
  const totalCost = upLimitPrice + downLimitPrice;
  const profit = 1.0 - totalCost;
  const profitPct = (profit / totalCost) * 100;
  
  // Time remaining
  const timeLeft = (state.currentMarket.endDate - Date.now()) / 1000;
  
  // Log scan results periodically
  log(`Mid: UP=$${upMid?.toFixed(3)} DOWN=$${downMid?.toFixed(3)} (${midSum.toFixed(3)}) | Limit: $${totalCost.toFixed(3)} | Profit: ${profitPct.toFixed(1)}% | ${timeLeft.toFixed(0)}s`, 'scan');
  
  // Check if arbitrage opportunity exists
  if (totalCost < CONFIG.arb.maxSpread && profit >= CONFIG.arb.minProfit) {
    state.stats.opportunities++;
    log(`🚨 ARBITRAGE FOUND! Total: $${totalCost.toFixed(4)} | Profit: $${profit.toFixed(4)} (${profitPct.toFixed(2)}%)`, 'arb');
    
    if (CONFIG.mode === 'paper') {
      // Paper trade
      state.stats.trades++;
      const paperProfit = profit * CONFIG.arb.positionSize;
      state.stats.profit += paperProfit;
      log(`[PAPER] BUY UP@$${state.upBestAsk.toFixed(3)} + DOWN@$${state.downBestAsk.toFixed(3)} | Size: $${CONFIG.arb.positionSize}x2 | Est profit: $${paperProfit.toFixed(2)}`, 'entry');
      state.inPosition = true;
    } else {
      // Live trade - would place limit orders here
      log(`[LIVE] Would place limit orders...`, 'entry');
    }
  }
  
  // Also check reverse (if we hold position, check if we should exit early)
  if (state.inPosition && timeLeft < 30) {
    log(`Position will resolve in ${timeLeft.toFixed(0)}s`, 'info');
  }
}

function printStatus() {
  const runtime = Math.floor((Date.now() - state.stats.startTime) / 60000);
  log('═══════════════════════════════════════', 'info');
  log(`SPREAD ARB BOT (${runtime} min)`, 'info');
  log(`Market: ${state.currentMarket?.title || 'None'}`, 'market');
  log(`Best asks: UP=$${state.upBestAsk?.toFixed(3) || '?'} DOWN=$${state.downBestAsk?.toFixed(3) || '?'}`, 'info');
  log(`Opportunities: ${state.stats.opportunities}`, 'info');
  log(`Trades: ${state.stats.trades}`, 'info');
  log(`Total Profit: $${state.stats.profit.toFixed(2)}`, state.stats.profit >= 0 ? 'arb' : 'error');
  log(`Mode: ${CONFIG.mode.toUpperCase()}`, 'info');
  log('═══════════════════════════════════════', 'info');
}

async function main() {
  log('╔═══════════════════════════════════════╗', 'info');
  log('║  SPREAD ARBITRAGE BOT v1              ║', 'info');
  log('║  Buy both sides when spread < $0.97   ║', 'info');
  log('╚═══════════════════════════════════════╝', 'info');
  log(`Mode: ${CONFIG.mode.toUpperCase()}`, 'info');
  log(`Max spread: $${CONFIG.arb.maxSpread}`, 'info');
  log(`Position size: $${CONFIG.arb.positionSize} per side`, 'info');
  
  await fetchMarketData();
  
  // Main loop
  setInterval(async () => {
    await fetchMarketData();
    await checkArbitrage();
  }, CONFIG.pollMs);
  
  // Status every 5 min
  setInterval(printStatus, 300000);
  
  // Initial check
  await checkArbitrage();
  
  setTimeout(() => {
    printStatus();
    process.exit(0);
  }, CONFIG.runTimeMs);
}

main().catch(e => {
  log(`Fatal: ${e.message}`, 'error');
  process.exit(1);
});
