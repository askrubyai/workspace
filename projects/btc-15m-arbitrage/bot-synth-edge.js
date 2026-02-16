#!/usr/bin/env node

/**
 * SYNTH EDGE BOT — Probability-Based Polymarket Trading
 * 
 * Strategy: Use SynthData volatility forecasts to compute probability edges
 * on Polymarket hourly UP/DOWN crypto contracts.
 * 
 * Flow:
 * 1. SynthData → forecast volatility for BTC, ETH, SOL
 * 2. Binance → real-time price for current move from hour start
 * 3. Compute probability of UP/DOWN using log-normal model
 * 4. Compare probability to Polymarket contract prices
 * 5. If edge > threshold, enter with Kelly-sized position
 * 6. Positions auto-resolve at hour end
 * 
 * Based on: https://x.com/synthdataco/status/2021658564109234501
 * Upgraded from: bot-multi-asset.js (Chainlink oracle approach)
 */

require('dotenv').config();
const { ethers } = require('ethers');
const fetch = require('node-fetch');
const fs = require('fs');

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const CONFIG = {
  mode: process.env.BOT_MODE || 'paper', // 'paper' or 'live'
  runtime: 12 * 60 * 60 * 1000, // 12 hours
  
  // Volatility source — Binance (free, no API key needed)
  volatility: {
    source: 'binance', // 'binance' (free) or 'synthdata' (paid)
    synthApiKey: process.env.SYNTHDATA_API_KEY || '',
    synthBaseUrl: 'https://api.synthdata.co',
    refreshIntervalMs: 5 * 60 * 1000, // Refresh volatility every 5 min
    lookbackCandles: 24, // 24 hourly candles for realized vol
  },
  
  // Assets we trade
  assets: {
    BTC: {
      seriesId: '10192',
      synthTicker: 'BTC',
      binanceSymbol: 'btcusdt',
    },
    ETH: {
      seriesId: '10191',
      synthTicker: 'ETH',
      binanceSymbol: 'ethusdt',
    },
    SOL: {
      seriesId: '10423',
      synthTicker: 'SOL',
      binanceSymbol: 'solusdt',
    },
  },
  
  // Trading parameters
  trading: {
    minEdge: 0.05,           // 5% minimum edge to enter
    minTimeLeftMin: 15,      // Don't trade with < 15 min left
    maxTimeLeftMin: 45,      // Don't trade with > 45 min left (too uncertain)
    sweetSpotPrice: {        // Only enter at these Polymarket prices
      min: 0.30,             // Don't buy below $0.30 (too risky)
      max: 0.85,             // Don't buy above $0.85 (not enough upside)
    },
    kellyFraction: 0.25,     // Use 25% Kelly (conservative)
    maxPositionSize: 10,     // Max $10 per trade (start small)
    minPositionSize: 5,      // Min $5 (Polymarket min 5 shares)
    maxDailyLoss: 0.10,      // 10% max daily drawdown
    cooldownMs: 60000,       // 60s between trades per asset
    maxConcurrentPositions: 3, // Max 3 positions at once
  },
  
  // Bankroll management
  bankroll: {
    starting: parseFloat(process.env.STARTING_BALANCE || '50'),
    current: parseFloat(process.env.STARTING_BALANCE || '50'),
  },
  
  // Polling intervals
  polling: {
    binanceMs: 5000,         // Price check every 5s
    marketMs: 30000,         // Polymarket check every 30s
    signalMs: 10000,         // Signal evaluation every 10s
    statusMs: 300000,        // Status report every 5 min
  },
  
  // Polymarket
  gammaApi: 'https://gamma-api.polymarket.com',
  polymarketApi: 'https://clob.polymarket.com',
  
  // Wallet (from existing bot)
  wallet: {
    address: process.env.WALLET_ADDRESS || '0x81123E35C441C1B463503AE1B25D4b870c945751',
    privateKey: process.env.PRIVATE_KEY || '',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════════════════

const state = {
  startTime: Date.now(),
  tradeLock: false,
  
  // SynthData cache
  synthCache: {}, // { BTC: { forecastVol, realizedVol, lastFetch, price } }
  
  // Binance real-time prices
  prices: {}, // { BTC: { current, hourStart, lastUpdate } }
  
  // Per-asset Polymarket state
  markets: {}, // { BTC: { id, title, endDate, upPrice, downPrice, upTokenId, downTokenId } }
  
  // Active positions
  positions: [], // [{ asset, side, entryPrice, size, entryTime, edge, probability }]
  
  // Stats
  stats: {
    totalSignals: 0,
    totalTrades: 0,
    totalWins: 0,
    totalLosses: 0,
    totalPnL: 0,
    edgesFound: [],
    dailyPnL: 0,
    byAsset: {},
  },
  
  trades: [],
};

// Initialize per-asset stats
Object.keys(CONFIG.assets).forEach(symbol => {
  state.stats.byAsset[symbol] = {
    signals: 0, trades: 0, wins: 0, losses: 0, pnl: 0,
  };
});

// ═══════════════════════════════════════════════════════════════════════════════
// LOGGING
// ═══════════════════════════════════════════════════════════════════════════════

const LOG_DIR = '/Users/ruby/.openclaw/workspace/projects/btc-15m-arbitrage';
const LOG_FILE = `${LOG_DIR}/bot-synth.log`;
const TRADE_JOURNAL = `${LOG_DIR}/synth-trade-journal.json`;

function log(msg, type = 'info', asset = null) {
  const time = new Date().toISOString().substr(11, 12);
  const prefix = {
    info: '📊', success: '✅', warning: '⚠️', error: '❌',
    signal: '🎯', entry: '📈', exit: '📉', profit: '💰',
    market: '🏪', synth: '🔮', edge: '📐', kelly: '🎰',
    status: '📋', price: '💹',
  }[type] || 'ℹ️';
  
  const assetTag = asset ? `[${asset}]` : '';
  const line = `[${time}] ${prefix} ${assetTag} ${msg}`;
  console.log(line);
  try { fs.appendFileSync(LOG_FILE, line + '\n'); } catch(e) {}
}

function saveTrades() {
  try {
    fs.writeFileSync(TRADE_JOURNAL, JSON.stringify({
      startTime: new Date(state.startTime).toISOString(),
      runtime: Math.floor((Date.now() - state.startTime) / 60000),
      bankroll: CONFIG.bankroll,
      stats: state.stats,
      positions: state.positions,
      trades: state.trades,
    }, null, 2));
  } catch(e) {}
}

// ═══════════════════════════════════════════════════════════════════════════════
// MATH UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Standard normal CDF (Φ function)
 * Uses Abramowitz & Stegun approximation
 */
function normalCDF(x) {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);
  
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  
  return 0.5 * (1.0 + sign * y);
}

/**
 * Compute probability of price being above start price at hour end
 * Uses log-normal model with SynthData forecast volatility
 * 
 * @param {number} currentMove - Current % move from hour start (e.g., 0.003 = 0.3%)
 * @param {number} forecastVolAnnual - Annualized forecast volatility % (e.g., 52.0)
 * @param {number} remainingMinutes - Minutes remaining in the hour
 * @returns {number} Probability of price ending above hour start (0-1)
 */
function computeUpProbability(currentMove, forecastVolAnnual, remainingMinutes) {
  if (remainingMinutes <= 0) return currentMove > 0 ? 1.0 : 0.0;
  if (forecastVolAnnual <= 0) return 0.5;
  
  // Convert annual vol to hourly vol
  const hourlyVol = (forecastVolAnnual / 100) / Math.sqrt(365.25 * 24);
  
  // Remaining time as fraction of an hour
  const remainingFraction = remainingMinutes / 60;
  
  // Standard deviation of remaining price movement
  const remainingStdDev = hourlyVol * Math.sqrt(remainingFraction);
  
  if (remainingStdDev <= 0) return currentMove > 0 ? 1.0 : 0.0;
  
  // Z-score: how many std devs the current move is from zero
  // Probability that current_move + remaining_move > 0
  // = P(remaining_move > -current_move)
  // = Φ(current_move / remaining_std_dev)
  const z = currentMove / remainingStdDev;
  
  return normalCDF(z);
}

/**
 * Kelly Criterion for binary outcome betting
 * 
 * @param {number} probability - Our estimated probability of winning (0-1)
 * @param {number} marketPrice - Current market price of the contract ($0-$1)
 * @returns {number} Fraction of bankroll to bet (0 if no edge)
 */
function kellyFraction(probability, marketPrice) {
  if (probability <= marketPrice) return 0; // No edge
  
  // For binary contracts:
  // Win payout = (1 - marketPrice) per dollar risked at marketPrice
  // Lose = lose marketPrice per contract
  // Kelly = (p * b - q) / b
  // where b = (1 - marketPrice) / marketPrice (odds), q = 1 - p
  
  const b = (1 - marketPrice) / marketPrice;
  const q = 1 - probability;
  const kelly = (probability * b - q) / b;
  
  return Math.max(0, kelly);
}

/**
 * Calculate position size using Kelly criterion
 */
function calculatePositionSize(probability, marketPrice, bankroll) {
  const fullKelly = kellyFraction(probability, marketPrice);
  const fractionalKelly = fullKelly * CONFIG.trading.kellyFraction;
  
  let size = bankroll * fractionalKelly;
  
  // Apply min/max bounds
  size = Math.max(size, CONFIG.trading.minPositionSize);
  size = Math.min(size, CONFIG.trading.maxPositionSize);
  size = Math.min(size, bankroll * 0.2); // Never risk more than 20% of bankroll
  
  return Math.round(size * 100) / 100; // Round to cents
}

// ═══════════════════════════════════════════════════════════════════════════════
// VOLATILITY ENGINE — Binance (free) or SynthData (paid)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Compute realized volatility from hourly candle returns
 * Uses close-to-close log returns, annualized
 */
function computeRealizedVol(candles) {
  if (!candles || candles.length < 2) return null;
  
  const logReturns = [];
  for (let i = 1; i < candles.length; i++) {
    const prev = parseFloat(candles[i - 1][4]); // close price
    const curr = parseFloat(candles[i][4]);
    if (prev > 0 && curr > 0) {
      logReturns.push(Math.log(curr / prev));
    }
  }
  
  if (logReturns.length < 2) return null;
  
  // Standard deviation of log returns
  const mean = logReturns.reduce((a, b) => a + b, 0) / logReturns.length;
  const variance = logReturns.reduce((a, r) => a + (r - mean) ** 2, 0) / (logReturns.length - 1);
  const hourlyVol = Math.sqrt(variance);
  
  // Annualize: hourly vol * sqrt(hours per year)
  const annualizedVol = hourlyVol * Math.sqrt(365.25 * 24) * 100; // as percentage
  
  return annualizedVol;
}

/**
 * Fetch hourly candles from Binance and compute volatility
 * Completely free, no API key needed
 */
async function fetchBinanceVolatility(symbol) {
  const config = CONFIG.assets[symbol];
  if (!config) return;
  
  // Check cache freshness
  const cached = state.synthCache[symbol];
  if (cached && (Date.now() - cached.lastFetch) < CONFIG.volatility.refreshIntervalMs) {
    return;
  }
  
  try {
    // Fetch hourly candles (last 24-48 hours for good vol estimate)
    const resp = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${config.binanceSymbol.toUpperCase()}&interval=1h&limit=${CONFIG.volatility.lookbackCandles + 1}`
    );
    const candles = await resp.json();
    
    if (!Array.isArray(candles) || candles.length < 3) {
      log(`Binance klines insufficient data`, 'error', symbol);
      return;
    }
    
    const realizedVol = computeRealizedVol(candles);
    const currentPrice = parseFloat(candles[candles.length - 1][4]);
    
    // Also compute short-term vol (last 6 hours) for forecast proxy
    const recentCandles = candles.slice(-7);
    const shortTermVol = computeRealizedVol(recentCandles);
    
    // Simple forecast: weight recent vol higher (mean-reverting model)
    // forecastVol = 0.6 * shortTermVol + 0.4 * longerTermVol
    const forecastVol = shortTermVol && realizedVol
      ? 0.6 * shortTermVol + 0.4 * realizedVol
      : realizedVol || shortTermVol;
    
    // Recent trend (last 3 candles)
    let recentTrend = 0;
    if (candles.length >= 4) {
      const oldPrice = parseFloat(candles[candles.length - 4][4]);
      const newPrice = currentPrice;
      if (oldPrice > 0) {
        recentTrend = (newPrice - oldPrice) / oldPrice;
      }
    }
    
    state.synthCache[symbol] = {
      forecastVol,
      realizedVol,
      currentVol: shortTermVol,
      price: currentPrice,
      recentTrend,
      lastFetch: Date.now(),
      source: 'binance',
    };
    
    log(`Vol forecast=${forecastVol?.toFixed(1)}% realized=${realizedVol?.toFixed(1)}% short=${shortTermVol?.toFixed(1)}% price=$${currentPrice?.toFixed(2)}`, 'synth', symbol);
    
  } catch (e) {
    log(`Binance vol fetch error: ${e.message}`, 'error', symbol);
  }
}

/**
 * Fetch from SynthData API (paid, better forecasts)
 */
async function fetchSynthDataVolatility(symbol) {
  const config = CONFIG.assets[symbol];
  if (!config || !CONFIG.volatility.synthApiKey) return;
  
  const cached = state.synthCache[symbol];
  if (cached && (Date.now() - cached.lastFetch) < CONFIG.volatility.refreshIntervalMs) {
    return;
  }
  
  try {
    const resp = await fetch(
      `${CONFIG.volatility.synthBaseUrl}/insights/volatility?asset=${config.synthTicker}`,
      {
        headers: {
          'Authorization': `Apikey ${CONFIG.volatility.synthApiKey}`,
          'User-Agent': 'SynthEdgeBot/1.0',
        },
        timeout: 10000,
      }
    );
    
    if (!resp.ok) {
      log(`SynthData API error: ${resp.status}`, 'error', symbol);
      return;
    }
    
    const data = await resp.json();
    if (data.error) return;
    
    state.synthCache[symbol] = {
      forecastVol: data.forecast_future?.average_volatility,
      realizedVol: data.realized?.average_volatility,
      currentVol: data.realized?.volatility?.slice(-1)[0],
      price: data.current_price,
      recentTrend: 0,
      lastFetch: Date.now(),
      source: 'synthdata',
    };
    
    log(`SynthData vol forecast=${data.forecast_future?.average_volatility?.toFixed(1)}%`, 'synth', symbol);
  } catch (e) {
    log(`SynthData error: ${e.message}`, 'error', symbol);
  }
}

async function refreshAllVolatility() {
  const fetcher = CONFIG.volatility.source === 'synthdata' && CONFIG.volatility.synthApiKey
    ? fetchSynthDataVolatility
    : fetchBinanceVolatility;
  
  for (const symbol of Object.keys(CONFIG.assets)) {
    await fetcher(symbol);
    await new Promise(r => setTimeout(r, 500));
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// BINANCE PRICE FEED
// ═══════════════════════════════════════════════════════════════════════════════

async function fetchBinancePrice(symbol) {
  const config = CONFIG.assets[symbol];
  if (!config) return;
  
  try {
    const resp = await fetch(
      `https://api.binance.com/api/v3/ticker/price?symbol=${config.binanceSymbol.toUpperCase()}`
    );
    const data = await resp.json();
    const price = parseFloat(data.price);
    
    if (!state.prices[symbol]) {
      state.prices[symbol] = { current: price, hourStart: null, lastUpdate: Date.now() };
    }
    
    state.prices[symbol].current = price;
    state.prices[symbol].lastUpdate = Date.now();
    
    // Set hour-start price if we don't have one or if we crossed an hour boundary
    const now = new Date();
    const currentHourStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0);
    
    if (!state.prices[symbol].hourStartTime || state.prices[symbol].hourStartTime < currentHourStart.getTime()) {
      state.prices[symbol].hourStart = price;
      state.prices[symbol].hourStartTime = currentHourStart.getTime();
    }
    
  } catch (e) {
    // Silently fail - Binance is reliable, transient errors are fine
  }
}

async function fetchAllPrices() {
  const symbols = Object.keys(CONFIG.assets);
  await Promise.all(symbols.map(s => fetchBinancePrice(s)));
}

// ═══════════════════════════════════════════════════════════════════════════════
// POLYMARKET DATA
// ═══════════════════════════════════════════════════════════════════════════════

async function fetchMarketData(symbol) {
  const config = CONFIG.assets[symbol];
  
  try {
    const resp = await fetch(`${CONFIG.gammaApi}/series/${config.seriesId}`);
    const series = await resp.json();
    
    const now = new Date();
    const active = series.events
      ?.filter(e => !e.closed && new Date(e.endDate) > now)
      .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))[0];
    
    if (!active) {
      state.markets[symbol] = null;
      return;
    }
    
    const eventResp = await fetch(`${CONFIG.gammaApi}/events/${active.id}`);
    const eventData = await eventResp.json();
    const market = eventData.markets?.[0];
    
    if (!market) return;
    
    const prices = JSON.parse(market.outcomePrices || '[0.5,0.5]');
    const tokens = JSON.parse(market.clobTokenIds || '[]');
    
    const isNew = !state.markets[symbol] || state.markets[symbol]?.id !== active.id;
    
    state.markets[symbol] = {
      id: active.id,
      title: active.title,
      endDate: new Date(active.endDate),
      upPrice: parseFloat(prices[0]),
      downPrice: parseFloat(prices[1]),
      upTokenId: tokens[0],
      downTokenId: tokens[1],
    };
    
    if (isNew) {
      log(`NEW MARKET: ${active.title?.split(' - ')[1] || active.title}`, 'market', symbol);
      // Reset hour-start price for new market
      if (state.prices[symbol]) {
        state.prices[symbol].hourStart = state.prices[symbol].current;
        state.prices[symbol].hourStartTime = Date.now();
      }
    }
    
  } catch (e) {
    log(`Market fetch error: ${e.message}`, 'error', symbol);
  }
}

async function fetchAllMarkets() {
  for (const symbol of Object.keys(CONFIG.assets)) {
    await fetchMarketData(symbol);
    await new Promise(r => setTimeout(r, 500));
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SIGNAL GENERATION — THE CORE EDGE
// ═══════════════════════════════════════════════════════════════════════════════

function evaluateSignals() {
  if (state.tradeLock) return;
  
  for (const symbol of Object.keys(CONFIG.assets)) {
    evaluateSignal(symbol);
  }
}

function evaluateSignal(symbol) {
  const synth = state.synthCache[symbol];
  const price = state.prices[symbol];
  const market = state.markets[symbol];
  
  // Need all data sources
  if (!synth || !price || !market) return;
  if (!synth.forecastVol || !price.current || !price.hourStart) return;
  
  // Check time window
  const now = Date.now();
  const timeLeftMs = market.endDate.getTime() - now;
  const timeLeftMin = timeLeftMs / 60000;
  
  if (timeLeftMin < CONFIG.trading.minTimeLeftMin || timeLeftMin > CONFIG.trading.maxTimeLeftMin) return;
  
  // Already in position on this asset?
  const existingPos = state.positions.find(p => p.asset === symbol);
  if (existingPos) return;
  
  // Max concurrent positions check
  if (state.positions.length >= CONFIG.trading.maxConcurrentPositions) return;
  
  // Daily loss check
  if (state.stats.dailyPnL <= -(CONFIG.bankroll.starting * CONFIG.trading.maxDailyLoss)) {
    return;
  }
  
  // Calculate current move from hour start
  const currentMove = (price.current - price.hourStart) / price.hourStart;
  
  // Compute probabilities using SynthData volatility
  const probUp = computeUpProbability(currentMove, synth.forecastVol, timeLeftMin);
  const probDown = 1 - probUp;
  
  // Calculate edges for both sides
  const upEdge = probUp - market.upPrice;
  const downEdge = probDown - market.downPrice;
  
  // Find the best edge
  let bestSide = null;
  let bestEdge = 0;
  let bestProb = 0;
  let bestMarketPrice = 0;
  
  if (upEdge > downEdge && upEdge >= CONFIG.trading.minEdge) {
    bestSide = 'UP';
    bestEdge = upEdge;
    bestProb = probUp;
    bestMarketPrice = market.upPrice;
  } else if (downEdge > upEdge && downEdge >= CONFIG.trading.minEdge) {
    bestSide = 'DOWN';
    bestEdge = downEdge;
    bestProb = probDown;
    bestMarketPrice = market.downPrice;
  }
  
  if (!bestSide) return;
  
  // Check if market price is in our sweet spot
  if (bestMarketPrice < CONFIG.trading.sweetSpotPrice.min || bestMarketPrice > CONFIG.trading.sweetSpotPrice.max) {
    return;
  }
  
  // SIGNAL FOUND!
  state.stats.totalSignals++;
  state.stats.byAsset[symbol].signals++;
  
  const kelly = kellyFraction(bestProb, bestMarketPrice);
  const posSize = calculatePositionSize(bestProb, bestMarketPrice, CONFIG.bankroll.current);
  
  log(`EDGE FOUND: ${bestSide} | prob=${(bestProb * 100).toFixed(1)}% vs market=${(bestMarketPrice * 100).toFixed(1)}% | edge=${(bestEdge * 100).toFixed(1)}% | kelly=${(kelly * 100).toFixed(1)}% | size=$${posSize}`, 'edge', symbol);
  log(`  move=${(currentMove * 100).toFixed(3)}% | vol=${synth.forecastVol.toFixed(1)}% | ${timeLeftMin.toFixed(0)}min left`, 'info', symbol);
  
  state.stats.edgesFound.push({
    time: new Date().toISOString(),
    asset: symbol,
    side: bestSide,
    edge: bestEdge,
    probability: bestProb,
    marketPrice: bestMarketPrice,
    move: currentMove,
    vol: synth.forecastVol,
    timeLeft: timeLeftMin,
  });
  
  // Enter position
  enterPosition(symbol, bestSide, bestMarketPrice, bestProb, bestEdge, posSize, kelly);
}

// ═══════════════════════════════════════════════════════════════════════════════
// POSITION MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

async function enterPosition(symbol, side, marketPrice, probability, edge, size, kelly) {
  if (state.tradeLock) return;
  state.tradeLock = true;
  
  try {
    const market = state.markets[symbol];
    const tokenId = side === 'UP' ? market.upTokenId : market.downTokenId;
    
    log(`ENTERING: ${side} @ $${marketPrice.toFixed(3)} | size=$${size} | edge=${(edge * 100).toFixed(1)}%`, 'entry', symbol);
    
    if (CONFIG.mode === 'live') {
      // TODO: Implement actual Polymarket order execution
      // Using the existing CLOB infrastructure from bot-multi-asset.js
      log(`LIVE ORDER: Would buy ${(size / marketPrice).toFixed(0)} shares of ${side} @ $${marketPrice.toFixed(3)}`, 'entry', symbol);
    }
    
    // Record position
    const position = {
      asset: symbol,
      side,
      entryPrice: marketPrice,
      size,
      shares: Math.floor(size / marketPrice),
      probability,
      edge,
      kelly,
      entryTime: Date.now(),
      marketId: market.id,
      marketEndDate: market.endDate,
      tokenId,
    };
    
    state.positions.push(position);
    state.stats.totalTrades++;
    state.stats.byAsset[symbol].trades++;
    
    log(`POSITION OPENED: ${position.shares} shares of ${side} @ $${marketPrice.toFixed(3)} = $${size}`, 'entry', symbol);
    
    saveTrades();
    
  } catch (e) {
    log(`Entry error: ${e.message}`, 'error', symbol);
  } finally {
    state.tradeLock = false;
  }
}

function checkPositionResolutions() {
  const now = Date.now();
  const resolvedPositions = [];
  
  for (let i = state.positions.length - 1; i >= 0; i--) {
    const pos = state.positions[i];
    const market = state.markets[pos.asset];
    
    if (!market) continue;
    
    // Check if market has resolved
    const marketPrice = pos.side === 'UP' ? market.upPrice : market.downPrice;
    const timeLeft = (pos.marketEndDate.getTime() - now) / 60000;
    
    // Market resolved (price near 0 or 1)
    if (marketPrice > 0.95 || marketPrice < 0.05 || timeLeft < 0) {
      const won = marketPrice > 0.5;
      const pnl = won
        ? (1 - pos.entryPrice) * pos.shares  // Win: get $1 per share, paid entryPrice
        : -pos.entryPrice * pos.shares;        // Lose: lose what we paid
      
      const pnlPct = won ? ((1 - pos.entryPrice) / pos.entryPrice) : -1;
      
      // Update stats
      state.stats.totalPnL += pnl;
      state.stats.dailyPnL += pnl;
      state.stats.byAsset[pos.asset].pnl += pnl;
      CONFIG.bankroll.current += pnl;
      
      if (won) {
        state.stats.totalWins++;
        state.stats.byAsset[pos.asset].wins++;
        log(`WIN: ${pos.side} resolved @ $${marketPrice.toFixed(3)} | +$${pnl.toFixed(2)} (+${(pnlPct * 100).toFixed(1)}%) | edge was ${(pos.edge * 100).toFixed(1)}%`, 'profit', pos.asset);
      } else {
        state.stats.totalLosses++;
        state.stats.byAsset[pos.asset].losses++;
        log(`LOSS: ${pos.side} resolved @ $${marketPrice.toFixed(3)} | -$${Math.abs(pnl).toFixed(2)} | edge was ${(pos.edge * 100).toFixed(1)}%`, 'exit', pos.asset);
      }
      
      // Record trade
      state.trades.push({
        timestamp: new Date().toISOString(),
        asset: pos.asset,
        side: pos.side,
        entryPrice: pos.entryPrice,
        exitPrice: marketPrice,
        shares: pos.shares,
        size: pos.size,
        pnl,
        pnlPct,
        won,
        edge: pos.edge,
        probability: pos.probability,
        kelly: pos.kelly,
        holdTimeMin: (now - pos.entryTime) / 60000,
        market: market.title,
      });
      
      // Remove position
      state.positions.splice(i, 1);
      saveTrades();
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATUS REPORTING
// ═══════════════════════════════════════════════════════════════════════════════

function printStatus() {
  const runtime = Math.floor((Date.now() - state.startTime) / 60000);
  const winRate = state.stats.totalTrades > 0
    ? ((state.stats.totalWins / state.stats.totalTrades) * 100).toFixed(1)
    : 'N/A';
  
  log('═══════════════════════════════════════════════════════════════', 'status');
  log(`SYNTH EDGE BOT — ${runtime}min runtime | ${CONFIG.mode.toUpperCase()} MODE`, 'status');
  log('───────────────────────────────────────────────────────────────', 'status');
  
  // Per-asset status
  for (const [symbol, config] of Object.entries(CONFIG.assets)) {
    const synth = state.synthCache[symbol];
    const price = state.prices[symbol];
    const market = state.markets[symbol];
    const stats = state.stats.byAsset[symbol];
    const pos = state.positions.find(p => p.asset === symbol);
    
    const volStr = synth ? `vol=${synth.forecastVol?.toFixed(1)}%` : 'no synth data';
    const priceStr = price?.current ? `$${price.current.toFixed(2)}` : 'no price';
    const moveStr = (price?.current && price?.hourStart)
      ? `${((price.current - price.hourStart) / price.hourStart * 100).toFixed(3)}%`
      : 'N/A';
    const marketStr = market ? `UP=$${market.upPrice.toFixed(3)} DOWN=$${market.downPrice.toFixed(3)}` : 'no market';
    const posStr = pos ? `IN ${pos.side} @ $${pos.entryPrice.toFixed(3)}` : 'WATCHING';
    
    log(`${symbol}: ${priceStr} (${moveStr}) | ${volStr} | ${marketStr} | ${posStr} | PnL: $${stats.pnl.toFixed(2)}`, 'info');
  }
  
  log('───────────────────────────────────────────────────────────────', 'status');
  log(`Bankroll: $${CONFIG.bankroll.current.toFixed(2)} (started $${CONFIG.bankroll.starting})`, 'status');
  log(`Signals: ${state.stats.totalSignals} | Trades: ${state.stats.totalTrades} | Win Rate: ${winRate}%`, 'status');
  log(`W/L: ${state.stats.totalWins}/${state.stats.totalLosses} | PnL: $${state.stats.totalPnL.toFixed(2)} | Daily: $${state.stats.dailyPnL.toFixed(2)}`, 'status');
  log(`Positions: ${state.positions.length}/${CONFIG.trading.maxConcurrentPositions}`, 'status');
  log('═══════════════════════════════════════════════════════════════', 'status');
  
  saveTrades();
}

// ═══════════════════════════════════════════════════════════════════════════════
// DAILY RESET
// ═══════════════════════════════════════════════════════════════════════════════

let lastDayReset = new Date().getDate();

function checkDailyReset() {
  const today = new Date().getDate();
  if (today !== lastDayReset) {
    log(`Daily reset — yesterday PnL: $${state.stats.dailyPnL.toFixed(2)}`, 'info');
    state.stats.dailyPnL = 0;
    lastDayReset = today;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
  console.log(`
╔═══════════════════════════════════════════════════════════════════════════════╗
║                     SYNTH EDGE BOT v1.0                                       ║
║            Probability-Based Polymarket Trading                               ║
║                                                                               ║
║  Strategy: SynthData volatility → probability edge → Kelly-sized bets         ║
║  Assets: BTC, ETH, SOL                                                        ║
║  Edge threshold: ${(CONFIG.trading.minEdge * 100).toFixed(0)}% | Kelly fraction: ${(CONFIG.trading.kellyFraction * 100).toFixed(0)}%                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
  `);
  
  // Validate config
  if (CONFIG.volatility.source === 'synthdata' && !CONFIG.volatility.synthApiKey) {
    log('SYNTHDATA_API_KEY not set — falling back to Binance volatility (free)', 'warning');
    CONFIG.volatility.source = 'binance';
  }
  log(`Volatility source: ${CONFIG.volatility.source.toUpperCase()}`, 'info');
  
  log(`Mode: ${CONFIG.mode.toUpperCase()}`, 'info');
  log(`Bankroll: $${CONFIG.bankroll.starting}`, 'info');
  log(`Edge threshold: ${(CONFIG.trading.minEdge * 100).toFixed(0)}%`, 'info');
  log(`Kelly fraction: ${(CONFIG.trading.kellyFraction * 100).toFixed(0)}%`, 'info');
  log(`Position size: $${CONFIG.trading.minPositionSize}-$${CONFIG.trading.maxPositionSize}`, 'info');
  log(`Time window: ${CONFIG.trading.minTimeLeftMin}-${CONFIG.trading.maxTimeLeftMin} min before resolution`, 'info');
  log(`Price sweet spot: $${CONFIG.trading.sweetSpotPrice.min}-$${CONFIG.trading.sweetSpotPrice.max}`, 'info');
  
  // Initial data fetch
  log('Fetching initial volatility data...', 'synth');
  await refreshAllVolatility();
  
  log('Fetching initial prices...', 'price');
  await fetchAllPrices();
  
  log('Fetching initial markets...', 'market');
  await fetchAllMarkets();
  
  // ─── POLLING LOOPS ───
  
  // Binance prices (every 5s)
  setInterval(() => {
    fetchAllPrices().catch(e => log(`Price poll error: ${e.message}`, 'error'));
  }, CONFIG.polling.binanceMs);
  
  // Polymarket data (every 30s)
  setInterval(() => {
    fetchAllMarkets().catch(e => log(`Market poll error: ${e.message}`, 'error'));
  }, CONFIG.polling.marketMs);
  
  // Volatility refresh (every 5 min)
  setInterval(() => {
    refreshAllVolatility().catch(e => log(`Vol poll error: ${e.message}`, 'error'));
  }, CONFIG.volatility.refreshIntervalMs);
  
  // Signal evaluation (every 10s)
  setInterval(() => {
    try {
      checkDailyReset();
      checkPositionResolutions();
      evaluateSignals();
    } catch (e) {
      log(`Signal eval error: ${e.message}`, 'error');
    }
  }, CONFIG.polling.signalMs);
  
  // Status report (every 5 min)
  setInterval(printStatus, CONFIG.polling.statusMs);
  
  // Heartbeat (every 60s)
  setInterval(() => {
    const runtime = Math.floor((Date.now() - state.startTime) / 60000);
    log(`HEARTBEAT: ${runtime}min | ${state.positions.length} positions | PnL: $${state.stats.totalPnL.toFixed(2)} | Bankroll: $${CONFIG.bankroll.current.toFixed(2)}`, 'info');
  }, 60000);
  
  // Initial status
  setTimeout(printStatus, 8000);
  
  // Runtime limit
  setTimeout(() => {
    log('Runtime complete. Final status:', 'info');
    printStatus();
    process.exit(0);
  }, CONFIG.runtime);
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    log('Shutting down...', 'info');
    printStatus();
    process.exit(0);
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// CRASH PROTECTION
// ═══════════════════════════════════════════════════════════════════════════════

process.on('uncaughtException', (err) => {
  log(`UNCAUGHT: ${err.message}`, 'error');
  console.error(err.stack);
  saveTrades();
});

process.on('unhandledRejection', (reason) => {
  log(`REJECTION: ${reason}`, 'error');
});

process.on('SIGTERM', () => {
  log('SIGTERM received', 'info');
  printStatus();
  saveTrades();
  process.exit(0);
});

main().catch(e => {
  log(`Fatal: ${e.message}`, 'error');
  console.error(e);
  process.exit(1);
});
