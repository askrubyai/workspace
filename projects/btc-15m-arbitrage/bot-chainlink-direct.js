#!/usr/bin/env node

/**
 * BTC 15m CHAINLINK ORACLE Bot - Direct On-Chain Read
 * 
 * Reads BTC/USD directly from Chainlink aggregator on Polygon
 * Same data source Polymarket uses for resolution
 */

require('dotenv').config();
const { ethers } = require('ethers');
const fetch = require('node-fetch');
const fs = require('fs');

const CONFIG = {
  mode: 'paper',
  chainlink: {
    // BTC/USD on Polygon Mainnet
    address: '0xc907E116054Ad103354f2D350FD2514433D57F6f',
    rpc: 'https://polygon-rpc.com',
    pollMs: 5000, // Poll every 5 sec
  },
  api: {
    gamma: 'https://gamma-api.polymarket.com',
  },
  position: { size: 25 },
  marketRefreshMs: 15000,
  runTimeMs: 24 * 60 * 60 * 1000,
};

// Chainlink AggregatorV3 ABI (minimal)
const AGGREGATOR_ABI = [
  'function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
  'function decimals() external view returns (uint8)',
];

const state = {
  provider: null,
  aggregator: null,
  decimals: 8,
  currentMarket: null,
  marketStartPrice: null,
  chainlinkPrice: null,
  upPrice: null,
  downPrice: null,
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

async function initChainlink() {
  state.provider = new ethers.providers.JsonRpcProvider(CONFIG.chainlink.rpc);
  state.aggregator = new ethers.Contract(
    CONFIG.chainlink.address,
    AGGREGATOR_ABI,
    state.provider
  );
  
  state.decimals = await state.aggregator.decimals();
  log(`Chainlink aggregator initialized (${state.decimals} decimals)`, 'success');
}

async function fetchChainlinkPrice() {
  try {
    const [, answer, , updatedAt] = await state.aggregator.latestRoundData();
    const price = Number(answer) / Math.pow(10, state.decimals);
    
    // Check staleness (>5 min old is stale)
    const age = Date.now() / 1000 - Number(updatedAt);
    if (age > 300) {
      log(`Chainlink data stale: ${age.toFixed(0)}s old`, 'warning');
    }
    
    if (state.chainlinkPrice !== price) {
      const prev = state.chainlinkPrice;
      state.chainlinkPrice = price;
      
      if (prev) {
        const change = ((price - prev) / prev) * 100;
        if (Math.abs(change) > 0.01) {
          log(`Chainlink: $${price.toFixed(2)} (${change > 0 ? '+' : ''}${change.toFixed(3)}%)`, 'oracle');
        }
      } else {
        log(`Chainlink: $${price.toFixed(2)}`, 'oracle');
      }
      
      // Set baseline if needed
      if (state.currentMarket && !state.marketStartPrice) {
        state.marketStartPrice = price;
        log(`Baseline set: $${price.toFixed(2)}`, 'oracle');
      }
      
      checkSignal();
    }
  } catch (e) {
    log(`Chainlink read error: ${e.message}`, 'error');
  }
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
      state.currentMarket = { 
        id: active.id, 
        title: active.title, 
        startDate: new Date(active.startDate),
        endDate: new Date(active.endDate),
      };
      
      // Reset on new market
      state.marketStartPrice = state.chainlinkPrice || null;
      if (state.inPosition) {
        log(`Market changed - forcing exit`, 'warning');
        state.inPosition = false;
      }
      
      log(`NEW MARKET: ${active.title}`, 'market');
      if (state.marketStartPrice) {
        log(`Baseline: $${state.marketStartPrice.toFixed(2)}`, 'oracle');
      }
      log(`Odds: UP=$${state.upPrice.toFixed(3)} DOWN=$${state.downPrice.toFixed(3)}`, 'info');
    }
  } catch (e) {
    log(`API error: ${e.message}`, 'error');
  }
}

function checkSignal() {
  if (!state.currentMarket || !state.marketStartPrice || !state.chainlinkPrice) return;
  if (!state.upPrice || !state.downPrice) return;
  
  // Skip resolved markets
  if (state.upPrice > 0.9 || state.downPrice > 0.9) return;
  if (state.upPrice < 0.1 || state.downPrice < 0.1) return;
  
  // Calculate direction from Chainlink
  const pctChange = ((state.chainlinkPrice - state.marketStartPrice) / state.marketStartPrice) * 100;
  const direction = pctChange > 0 ? 'UP' : 'DOWN';
  
  // Time remaining
  const timeLeft = (state.currentMarket.endDate - Date.now()) / 1000;
  if (timeLeft < 30) return;
  
  if (state.inPosition) {
    checkExit(direction, pctChange, timeLeft);
    return;
  }
  
  // Cooldown
  if (Date.now() - state.lastTradeTime < 30000) return;
  
  // Need meaningful move
  const absChange = Math.abs(pctChange);
  if (absChange < 0.03) return;
  
  const targetPrice = direction === 'UP' ? state.upPrice : state.downPrice;
  
  // Edge: Oracle shows direction but odds < 55%
  if (targetPrice > 0.55) return;
  
  // SIGNAL
  state.stats.signals++;
  log(`SIGNAL #${state.stats.signals}: Chainlink ${direction} ${absChange.toFixed(3)}% | Entry: $${targetPrice.toFixed(3)} | ${timeLeft.toFixed(0)}s left`, 'signal');
  
  state.inPosition = true;
  state.positionSide = direction;
  state.entryPrice = targetPrice;
  state.entryTime = Date.now();
  state.lastTradeTime = Date.now();
  state.stats.trades++;
  
  log(`ENTRY: ${direction} @ $${state.entryPrice.toFixed(4)}`, 'entry');
}

function checkExit(currentDirection, pctChange, timeLeft) {
  if (!state.inPosition) return;
  
  const currentPrice = state.positionSide === 'UP' ? state.upPrice : state.downPrice;
  const pnlPct = (currentPrice - state.entryPrice) / state.entryPrice;
  const pnlDollars = pnlPct * CONFIG.position.size;
  
  let exitReason = null;
  
  if (currentDirection !== state.positionSide && Math.abs(pctChange) > 0.05) {
    exitReason = 'direction_flip';
  } else if (pnlPct >= 0.05) {
    exitReason = 'profit_target';
  } else if (pnlPct <= -0.10) {
    exitReason = 'stop_loss';
  } else if (timeLeft < 15) {
    exitReason = 'pre_resolution';
  } else if (currentPrice > 0.9 || currentPrice < 0.1) {
    exitReason = 'resolved';
  }
  
  if (!exitReason) return;
  
  state.inPosition = false;
  state.stats.totalPnl += pnlDollars;
  
  if (pnlDollars > 0.5) state.stats.wins++;
  else if (pnlDollars < -0.5) state.stats.losses++;
  
  log(`EXIT: ${state.positionSide} @ $${currentPrice.toFixed(4)} | $${pnlDollars.toFixed(2)} (${(pnlPct * 100).toFixed(2)}%) | ${exitReason}`, 'exit');
  
  state.positionSide = null;
  state.entryPrice = null;
}

function printStatus() {
  const runtime = Math.floor((Date.now() - state.stats.startTime) / 60000);
  log('═══════════════════════════════════════', 'info');
  log(`CHAINLINK BOT (${runtime} min)`, 'info');
  log(`Market: ${state.currentMarket?.title || 'None'}`, 'market');
  log(`Chainlink: $${state.chainlinkPrice?.toFixed(2) || '?'} | Base: $${state.marketStartPrice?.toFixed(2) || '?'}`, 'oracle');
  log(`Odds: UP=$${state.upPrice?.toFixed(3) || '?'} DOWN=$${state.downPrice?.toFixed(3) || '?'}`, 'info');
  log(`Trades: ${state.stats.trades} | W/L: ${state.stats.wins}/${state.stats.losses}`, 'info');
  log(`PnL: $${state.stats.totalPnl.toFixed(2)}`, state.stats.totalPnl >= 0 ? 'money' : 'error');
  log('═══════════════════════════════════════', 'info');
}

async function main() {
  log('╔═══════════════════════════════════════╗', 'info');
  log('║  CHAINLINK DIRECT BOT v3              ║', 'info');
  log('╚═══════════════════════════════════════╝', 'info');
  log(`Mode: ${CONFIG.mode.toUpperCase()}`, 'info');
  
  await initChainlink();
  await fetchMarketData();
  await fetchChainlinkPrice();
  
  // Poll Chainlink
  setInterval(fetchChainlinkPrice, CONFIG.chainlink.pollMs);
  
  // Refresh market
  setInterval(fetchMarketData, CONFIG.marketRefreshMs);
  
  // Status
  setInterval(printStatus, 300000);
  
  setTimeout(() => {
    printStatus();
    process.exit(0);
  }, CONFIG.runTimeMs);
}

main().catch(e => {
  log(`Fatal: ${e.message}`, 'error');
  process.exit(1);
});
