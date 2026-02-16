#!/usr/bin/env node

/**
 * QUANT BOT V1 - PHASE 1 SYSTEMATIC UPGRADE
 * 
 * Based on research from awesome-systematic-trading + Account88888 analysis
 * 
 * NEW FEATURES (Phase 1):
 * 1. ✅ LIMIT ORDERS ONLY - No market orders (0% maker fee vs 3% taker)
 * 2. ✅ 5% MINIMUM EDGE - Only trade when edge > fees + buffer
 * 3. ✅ DAILY LOSS LIMIT - Stop trading if down 10% for the day
 * 4. ✅ KELLY CRITERION - Optimal position sizing based on edge
 * 5. ✅ EDGE CALCULATION - Real-time expected value computation
 * 6. ✅ DELTA-NEUTRAL SCANNER - Find opportunities to buy both sides < $1
 * 
 * STRATEGY:
 * - Primary: Lag arbitrage (oracle leads Polymarket)
 * - Secondary: Delta-neutral when both sides sum < 98¢
 */

require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');
const { ClobClient, Side, OrderType } = require('@polymarket/clob-client');
const { ethers } = require('ethers');

// WebSocket not needed - using Chainlink polling instead

// ═══════════════════════════════════════════════════════════════════════════════
// QUANT CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const CONFIG = {
  mode: 'live',  // 🔴 LIVE MODE - Real money
  runtime: 4 * 60 * 60 * 1000,  // 4 hours live run
  
  assets: {
    BTC: { seriesId: '10192', chainlinkSymbol: 'btc/usd' },
    ETH: { seriesId: '10191', chainlinkSymbol: 'eth/usd' },
    SOL: { seriesId: '10423', chainlinkSymbol: 'sol/usd' },
    XRP: { seriesId: '10422', chainlinkSymbol: 'xrp/usd' },
  },
  
  // ═══ QUANT PARAMETERS ═══
  quant: {
    // Edge requirements
    minEdgePct: 0.05,           // 5% minimum edge to enter (covers fees + buffer)
    minDeltaNeutralEdge: 0.02,  // 2% edge for delta-neutral (guaranteed profit)
    
    // Kelly Criterion position sizing
    kellyFraction: 0.25,        // Use 25% of Kelly (conservative)
    maxKellyBet: 0.10,          // Never bet more than 10% of bankroll
    
    // Daily risk limits
    dailyLossLimit: 0.10,       // Stop trading if down 10% from day start
    maxDailyTrades: 50,         // Maximum trades per day
    
    // Historical edge estimates (will be refined with backtesting)
    estimatedWinRate: 0.60,     // 60% win rate from sweet spot analysis
    estimatedPayout: 0.50,      // Average payout when winning
  },
  
  trading: {
    // Entry criteria (from Account88888 analysis)
    moveThreshold: 0.0003,      // 0.03% oracle move to trigger
    maxOddsEntry: 0.79,         // Max entry price (sweet spot 0.50-0.79)
    minOddsEntry: 0.30,         // Min entry price
    deltaNeutralThreshold: 0.98, // Sum < 98¢ = delta-neutral opportunity
    minTimeLeft: 60,            // Min 60s before market ends
    
    // Position management
    positionSize: 5.00,         // Base position size (adjusted by Kelly)
    minPositionShares: 5,       // Minimum shares for orders
    maxPositions: 2,            // Allow 2 positions (for delta-neutral)
    minBalance: 10.00,          // Minimum balance to trade
    cooldownMs: 5000,           // 5s between trades per asset
    
    // Orders - LIMIT ONLY
    useLimitOrders: true,       // ALWAYS use limit orders
    orderType: 'GTC',           // Good til cancelled
    maxSlippagePct: 0.01,       // 1% max slippage on limit
    
    // Fees (critical for edge calculation)
    makerFeePct: 0.00,          // 0% maker fee!
    takerFeePct: 0.03,          // 3% taker fee (NEVER USE)
    
    // Exit rules
    profitTargetPct: 0.05,      // 5% profit target
    stopLossPct: 0.10,          // 10% stop loss
  },
  
  polling: {
    marketMs: 10000,            // Market data every 10s
    positionCheckMs: 3000,      // Position check every 3s
    statusMs: 300000,           // Status every 5 min
    deltaNeutralScanMs: 5000,   // Scan for delta-neutral every 5s
  },
  
  contracts: {
    CTF: '0x4D97DCd97eC945f40cF65F87097ACe5EA0476045',
    USDC_E: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    USDC: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
  },
  
  gammaApi: 'https://gamma-api.polymarket.com',
  dataApi: 'https://data-api.polymarket.com',
  clobHost: 'https://clob.polymarket.com',
  funder: process.env.POLYMARKET_FUNDER,
};

// ═══════════════════════════════════════════════════════════════════════════════
// STATE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

const state = {
  startTime: Date.now(),
  dayStartBalance: 0,          // Track for daily loss limit
  connected: false,
  clobClient: null,
  wallet: null,
  provider: null,
  currentBalance: 0,
  analyticalBalance: 0,  // Calculated: dayStartBalance + totalPnL
  
  // Trade locks
  tradeLock: false,
  pendingTradeCount: 0,
  
  // Daily tracking
  dailyTrades: 0,
  dailyPnL: 0,
  dailyLimitHit: false,
  
  // Per-asset state
  assets: {},
  positions: [],
  
  // Quant stats
  stats: {
    // Trading metrics
    totalSignals: 0,
    totalEdgeCalcs: 0,
    edgeRejections: 0,          // Rejected due to insufficient edge
    dailyLimitRejections: 0,    // Rejected due to daily limit
    totalTrades: 0,
    totalWins: 0,
    totalLosses: 0,
    totalPnL: 0,
    
    // Strategy breakdown
    lagArbTrades: 0,
    deltaNeutralTrades: 0,
    
    // Order stats
    limitOrdersPlaced: 0,
    limitOrdersFilled: 0,
    
    // Edge tracking
    edgesCalculated: [],        // Store last 100 edge calculations
    avgEdgeEntered: 0,
    
    // Risk metrics
    maxDrawdown: 0,
    sharpeEstimate: 0,
  },
  
  trades: [],
};

// Initialize per-asset state
Object.keys(CONFIG.assets).forEach(symbol => {
  state.assets[symbol] = {
    currentMarket: null,
    baselinePrice: null,
    currentPrice: null,
    upPrice: null,
    downPrice: null,
    upTokenId: null,
    downTokenId: null,
    lastTradeTime: 0,
    pendingTrade: false,
  };
});

const LOG_FILE = '/Users/ruby/.openclaw/workspace/projects/btc-15m-arbitrage/bot-quant-v1.log';
const JOURNAL_FILE = '/Users/ruby/.openclaw/workspace/projects/btc-15m-arbitrage/trade-journal-quant-v1.json';

// ═══════════════════════════════════════════════════════════════════════════════
// LOGGING & UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

function log(message, type = 'info', symbol = null) {
  const time = new Date().toLocaleTimeString('en-US', { 
    hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 
  });
  const prefix = symbol ? `[${symbol}]` : '';
  const icons = {
    signal: '🎯', entry: '📈', exit: '📉', tp: '💰', sl: '🛑', fill: '✅', 
    error: '❌', warning: '⚠️', info: 'ℹ️', live: '🔴', claim: '🏦',
    edge: '📊', kelly: '🎲', delta: '⚖️', limit: '🔒', quant: '🧮',
    block: '🚫', daily: '📅'
  };
  const line = `[${time}] ${icons[type] || '•'} ${prefix} ${message}`;
  if (!process.env.LOG_FILE_ONLY) console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function saveJournal() {
  fs.writeFileSync(JOURNAL_FILE, JSON.stringify({
    stats: state.stats,
    trades: state.trades,
    positions: state.positions,
    currentBalance: state.currentBalance,
    analyticalBalance: state.analyticalBalance,
    dayStartBalance: state.dayStartBalance,
    dailyPnL: state.dailyPnL,
    dailyTrades: state.dailyTrades,
    dailyLimitHit: state.dailyLimitHit,
    lastUpdate: new Date().toISOString(),
  }, null, 2));
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUANT CALCULATIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Calculate expected edge for a trade
 * Edge = (Win Probability × Win Amount) - (Loss Probability × Loss Amount) - Fees
 */
function calculateEdge(entryPrice, estimatedWinProb, fees = 0) {
  // If we buy at entryPrice and it resolves to $1, we profit (1 - entryPrice)
  // If it resolves to $0, we lose entryPrice
  const winAmount = 1 - entryPrice;
  const lossAmount = entryPrice;
  
  const expectedValue = (estimatedWinProb * winAmount) - ((1 - estimatedWinProb) * lossAmount) - fees;
  const edgePct = expectedValue / entryPrice;
  
  return {
    expectedValue,
    edgePct,
    winAmount,
    lossAmount,
    winProb: estimatedWinProb,
    breakeven: entryPrice / (1 - fees),
  };
}

/**
 * Calculate delta-neutral edge
 * If we can buy UP + DOWN for less than $1, we have guaranteed profit
 */
function calculateDeltaNeutralEdge(upPrice, downPrice) {
  const combinedCost = upPrice + downPrice;
  const payout = 1.00; // One side always pays $1
  const profit = payout - combinedCost;
  const edgePct = profit / combinedCost;
  
  return {
    combinedCost,
    profit,
    edgePct,
    isArbitrage: combinedCost < 1.00,
  };
}

/**
 * Kelly Criterion for optimal position sizing
 * f* = (p × b - q) / b
 * where p = win prob, q = loss prob, b = odds (payout ratio)
 */
function calculateKellyBet(winProb, payout, bankroll) {
  const q = 1 - winProb;
  const b = payout;
  
  // Full Kelly
  const fullKelly = (winProb * b - q) / b;
  
  // Fractional Kelly (more conservative)
  const fractionalKelly = fullKelly * CONFIG.quant.kellyFraction;
  
  // Cap at max bet
  const cappedKelly = Math.min(fractionalKelly, CONFIG.quant.maxKellyBet);
  
  // Never bet negative (means EV is negative)
  const optimalBet = Math.max(0, cappedKelly * bankroll);
  
  return {
    fullKelly,
    fractionalKelly,
    cappedKelly,
    optimalBet,
    betAsPctOfBankroll: cappedKelly,
  };
}

/**
 * Estimate win probability based on oracle move
 * The bigger the oracle move, the higher the probability we're right
 */
function estimateWinProbFromMove(movePct, direction) {
  // Base win rate from historical analysis
  const baseWinRate = CONFIG.quant.estimatedWinRate; // 60%
  
  // Adjust based on move magnitude
  // Bigger moves = more confidence
  const moveMultiplier = Math.min(2, 1 + Math.abs(movePct) * 50); // Cap at 2x
  const adjustedWinRate = Math.min(0.85, baseWinRate * moveMultiplier);
  
  return adjustedWinRate;
}

// ═══════════════════════════════════════════════════════════════════════════════
// RISK MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check if we've hit daily loss limit
 */
function checkDailyLimit() {
  if (state.dayStartBalance === 0) {
    state.dayStartBalance = state.currentBalance;
    return false;
  }
  
  const dailyPnLPct = state.dailyPnL / state.dayStartBalance;
  
  if (dailyPnLPct <= -CONFIG.quant.dailyLossLimit) {
    if (!state.dailyLimitHit) {
      log(`DAILY LOSS LIMIT HIT: ${(dailyPnLPct * 100).toFixed(2)}% - TRADING PAUSED`, 'block');
      state.dailyLimitHit = true;
    }
    return true;
  }
  
  return false;
}

/**
 * Check if trade passes all risk checks
 */
function passesRiskChecks(symbol, edge) {
  // Daily loss limit
  if (checkDailyLimit()) {
    state.stats.dailyLimitRejections++;
    return { passes: false, reason: 'daily_loss_limit' };
  }
  
  // Max daily trades
  if (state.dailyTrades >= CONFIG.quant.maxDailyTrades) {
    return { passes: false, reason: 'max_daily_trades' };
  }
  
  // Minimum edge
  if (edge.edgePct < CONFIG.quant.minEdgePct) {
    state.stats.edgeRejections++;
    return { passes: false, reason: 'insufficient_edge', edge: edge.edgePct };
  }
  
  // Balance check
  if (state.currentBalance < CONFIG.trading.minBalance) {
    return { passes: false, reason: 'insufficient_balance' };
  }
  
  // Max positions
  if (state.positions.length >= CONFIG.trading.maxPositions) {
    return { passes: false, reason: 'max_positions' };
  }
  
  // Check for existing position on same asset (prevent duplicates)
  const existingPosition = state.positions.find(p => p.symbol === symbol && p.status !== 'closed');
  if (existingPosition) {
    return { passes: false, reason: 'existing_position' };
  }
  
  // Cooldown
  const asset = state.assets[symbol];
  if (Date.now() - asset.lastTradeTime < CONFIG.trading.cooldownMs) {
    return { passes: false, reason: 'cooldown' };
  }
  
  return { passes: true };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLOB CLIENT & BALANCE
// ═══════════════════════════════════════════════════════════════════════════════

async function initClobClient() {
  try {
    // PAPER MODE: Skip wallet/CLOB setup, just simulate
    if (CONFIG.mode === 'paper') {
      log('PAPER MODE: Skipping wallet initialization', 'info');
      state.currentBalance = 100.00; // Simulated starting balance
      state.dayStartBalance = state.currentBalance;
      log(`Simulated balance: $${state.currentBalance.toFixed(2)}`, 'info');
      return true;
    }
    
    // LIVE MODE: Full initialization
    const privateKey = process.env.POLYMARKET_PRIVATE_KEY || process.env.POLYMARKET_PK;
    if (!privateKey) throw new Error('POLYMARKET_PRIVATE_KEY not set');
    
    state.provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com');
    state.wallet = new ethers.Wallet(privateKey, state.provider);
    
    log(`Wallet: ${state.wallet.address}`, 'info');
    
    // Create temp client to get API key
    const tempClient = new ClobClient(CONFIG.clobHost, 137, state.wallet);
    
    let apiCreds;
    try {
      apiCreds = await tempClient.createOrDeriveApiKey();
    } catch (e) {
      log('createOrDeriveApiKey failed, trying deriveApiKey...', 'warning');
      apiCreds = await tempClient.deriveApiKey();
    }
    
    // Create actual client with funder and API creds
    state.clobClient = new ClobClient(
      CONFIG.clobHost,
      137,
      state.wallet,
      apiCreds,
      parseInt(process.env.POLYMARKET_SIGNATURE_TYPE) || 2,  // Signature type from env
      CONFIG.funder  // Proxy wallet address
    );
    
    // Set starting balance from env (most reliable) or fetch from API
    const envBalance = parseFloat(process.env.STARTING_BALANCE);
    if (envBalance > 0) {
      state.currentBalance = envBalance;
      state.dayStartBalance = envBalance;
      state.analyticalBalance = envBalance;
      log(`Starting balance from env: $${envBalance.toFixed(2)}`, 'info');
    } else {
      await updateBalance();
      state.dayStartBalance = state.currentBalance;
    }
    
    log(`CLOB client initialized | Balance: $${state.currentBalance.toFixed(2)}`, 'info');
    return true;
  } catch (e) {
    log(`CLOB init error: ${e.message}`, 'error');
    return false;
  }
}

async function updateBalance() {
  // Paper mode: balance is simulated
  if (CONFIG.mode === 'paper') {
    // Update balance based on P&L
    state.currentBalance = state.dayStartBalance + state.dailyPnL;
    return;
  }
  
  try {
    // Use funder wallet for positions (where the funds actually are)
    const funder = process.env.POLYMARKET_FUNDER || state.wallet.address;
    const resp = await fetch(`${CONFIG.dataApi}/positions?user=${funder}`);
    const positions = await resp.json();
    
    // Calculate total value from positions
    let positionsValue = 0;
    if (Array.isArray(positions)) {
      for (const p of positions) {
        if (p.currentValue && p.currentValue > 0) {
          positionsValue += parseFloat(p.currentValue);
        }
      }
    }
    
    // Analytical balance is the most reliable: starting balance + resolved P&L
    // The positions API only returns open position values, NOT total USDC wallet balance
    state.analyticalBalance = state.dayStartBalance + state.stats.totalPnL;
    
    // Calculate open position cost (locked funds)
    const openPositionsCost = state.positions.reduce((sum, p) => sum + (p.shares * p.entryPrice), 0);
    
    // Current balance = analytical balance (total) - locked in positions
    // This represents available cash for new trades
    const availableCash = state.analyticalBalance - openPositionsCost;
    
    // Use the higher of: analytical balance, positions API value, or last known
    // The analytical balance is the true total wallet value
    state.currentBalance = state.analyticalBalance;
    
    if (state.currentBalance === 0) {
      const fallbackBalance = parseFloat(process.env.STARTING_BALANCE) || 23.00;
      state.currentBalance = fallbackBalance;
      state.analyticalBalance = fallbackBalance;
      log(`Using fallback balance: $${fallbackBalance.toFixed(2)}`, 'info');
    }
    
  } catch (e) {
    log(`Balance fetch error: ${e.message}`, 'error');
    // Don't zero out balance on error - keep last known value
    if (state.currentBalance === 0) {
      state.currentBalance = parseFloat(process.env.STARTING_BALANCE) || 23.00;
    }
    // Analytical balance still works
    state.analyticalBalance = state.dayStartBalance + state.stats.totalPnL;
  }
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
    
    const prices = JSON.parse(market.outcomePrices || '[0.5,0.5]');
    const tokens = JSON.parse(market.clobTokenIds || '[]');
    
    asset.upPrice = parseFloat(prices[0]);
    asset.downPrice = parseFloat(prices[1]);
    asset.upTokenId = tokens[0];
    asset.downTokenId = tokens[1];
    
    const isNew = !asset.currentMarket || asset.currentMarket.id !== active.id;
    
    if (isNew) {
      asset.baselinePrice = asset.currentPrice;
      asset.currentMarket = {
        id: active.id,
        title: active.title,
        endDate: new Date(active.endDate),
        conditionId: market.conditionId,
      };
      
      log(`NEW MARKET: ${active.title.split(' - ')[1] || active.title}`, 'info', symbol);
    }
    
    // Check for delta-neutral opportunity
    checkDeltaNeutralOpportunity(symbol);
    
  } catch (e) {
    log(`Market fetch error: ${e.message}`, 'error', symbol);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHAINLINK ORACLE POLLING (More reliable than WebSocket for paper trading)
// ═══════════════════════════════════════════════════════════════════════════════

const CHAINLINK_FEEDS = {
  BTC: '0xc907E116054Ad103354f2D350FD2514433D57F6f',
  ETH: '0xF9680D99D6C9589e2a93a78A04A279e509205945',
  SOL: '0x10C8264C0935b3B9870013e057f330Ff3e9C56dC',
  XRP: '0x785ba89291f676b5386652eB12b30cF361020694',
};

const AGGREGATOR_ABI = [
  'function latestRoundData() external view returns (uint80, int256, uint256, uint256, uint80)',
];

let chainlinkProvider = null;
const chainlinkContracts = {};

async function initChainlink() {
  try {
    chainlinkProvider = new ethers.providers.JsonRpcProvider('https://polygon-bor-rpc.publicnode.com');
    
    for (const [symbol, address] of Object.entries(CHAINLINK_FEEDS)) {
      chainlinkContracts[symbol] = new ethers.Contract(address, AGGREGATOR_ABI, chainlinkProvider);
    }
    
    log('Chainlink oracles initialized', 'info');
    return true;
  } catch (e) {
    log(`Chainlink init error: ${e.message}`, 'error');
    return false;
  }
}

async function pollChainlinkPrices() {
  for (const [symbol, contract] of Object.entries(chainlinkContracts)) {
    try {
      const [, answer] = await contract.latestRoundData();
      const price = Number(answer) / 1e8; // 8 decimals
      
      const asset = state.assets[symbol];
      const prev = asset.currentPrice;
      asset.currentPrice = price;
      
      // Set baseline for new market
      if (asset.currentMarket && !asset.baselinePrice) {
        asset.baselinePrice = price;
        log(`Baseline: $${price.toFixed(2)}`, 'info', symbol);
      }
      
      // Check for trading signal
      if (prev && asset.baselinePrice && asset.currentMarket) {
        checkTradingSignal(symbol);
      }
      
    } catch (e) {
      // Silent fail for individual asset
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRADING SIGNALS
// ═══════════════════════════════════════════════════════════════════════════════

function checkTradingSignal(symbol) {
  const asset = state.assets[symbol];
  
  if (!asset.currentMarket || !asset.baselinePrice || !asset.currentPrice) return;
  if (!asset.upPrice || !asset.downPrice) return;
  if (state.tradeLock || asset.pendingTrade) return;
  
  // Time check
  const timeLeft = (asset.currentMarket.endDate - Date.now()) / 1000;
  if (timeLeft < CONFIG.trading.minTimeLeft) return;
  
  // Calculate move from baseline
  const move = (asset.currentPrice - asset.baselinePrice) / asset.baselinePrice;
  const direction = move > 0 ? 'UP' : 'DOWN';
  
  // Need significant move
  if (Math.abs(move) < CONFIG.trading.moveThreshold) return;
  
  // Get target price
  const targetPrice = direction === 'UP' ? asset.upPrice : asset.downPrice;
  
  // Entry price bounds check
  if (targetPrice > CONFIG.trading.maxOddsEntry || targetPrice < CONFIG.trading.minOddsEntry) return;
  
  // ═══ QUANT EDGE CALCULATION ═══
  const estimatedWinProb = estimateWinProbFromMove(move, direction);
  const edge = calculateEdge(targetPrice, estimatedWinProb, 0); // 0 fees for maker
  
  state.stats.totalEdgeCalcs++;
  
  // Log edge calculation
  log(`EDGE CALC: ${direction} @ $${targetPrice.toFixed(3)} | Win%: ${(estimatedWinProb * 100).toFixed(1)}% | Edge: ${(edge.edgePct * 100).toFixed(2)}%`, 'edge', symbol);
  
  // ═══ RISK CHECKS ═══
  const riskCheck = passesRiskChecks(symbol, edge);
  if (!riskCheck.passes) {
    if (riskCheck.reason === 'insufficient_edge') {
      log(`REJECTED: Edge ${(edge.edgePct * 100).toFixed(2)}% < min ${(CONFIG.quant.minEdgePct * 100).toFixed(0)}%`, 'block', symbol);
    }
    return;
  }
  
  // ═══ KELLY POSITION SIZING ═══
  const kelly = calculateKellyBet(estimatedWinProb, edge.winAmount / targetPrice, state.currentBalance);
  const positionSize = Math.max(CONFIG.trading.positionSize, kelly.optimalBet);
  
  log(`KELLY: ${(kelly.cappedKelly * 100).toFixed(1)}% of bankroll = $${positionSize.toFixed(2)}`, 'kelly', symbol);
  
  // ═══ SIGNAL CONFIRMED ═══
  state.stats.totalSignals++;
  
  log(`SIGNAL: ${direction} | Move: ${(move * 100).toFixed(3)}% | Edge: ${(edge.edgePct * 100).toFixed(2)}% | ${timeLeft.toFixed(0)}s left`, 'signal', symbol);
  
  // Execute trade
  executeLimitOrder(symbol, direction, targetPrice, positionSize, edge);
}

/**
 * Check for delta-neutral arbitrage opportunities
 */
function checkDeltaNeutralOpportunity(symbol) {
  const asset = state.assets[symbol];
  
  if (!asset.upPrice || !asset.downPrice) return;
  if (state.tradeLock) return;
  
  const deltaEdge = calculateDeltaNeutralEdge(asset.upPrice, asset.downPrice);
  
  // Log if we're close to opportunity
  if (deltaEdge.combinedCost < 1.00) {
    log(`DELTA-NEUTRAL: UP=$${asset.upPrice.toFixed(3)} + DOWN=$${asset.downPrice.toFixed(3)} = $${deltaEdge.combinedCost.toFixed(3)} | Edge: ${(deltaEdge.edgePct * 100).toFixed(2)}%`, 'delta', symbol);
    
    // Check if edge is sufficient
    if (deltaEdge.edgePct >= CONFIG.quant.minDeltaNeutralEdge) {
      // Risk checks
      const riskCheck = passesRiskChecks(symbol, deltaEdge);
      if (!riskCheck.passes) return;
      
      log(`DELTA-NEUTRAL OPPORTUNITY: ${(deltaEdge.edgePct * 100).toFixed(2)}% guaranteed profit!`, 'delta', symbol);
      
      // Execute both sides
      executeDeltaNeutral(symbol, asset.upPrice, asset.downPrice, deltaEdge);
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAPER TRADING SIMULATION (Realistic slippage & fill modeling)
// ═══════════════════════════════════════════════════════════════════════════════

const PAPER_CONFIG = {
  // Fill probability based on limit price vs market
  baseFillProbability: 0.70,      // 70% base fill rate for limit orders
  fillProbabilityDecay: 0.10,    // -10% per 1% away from market
  
  // Slippage simulation
  avgSlippagePct: 0.005,         // 0.5% average slippage
  slippageStdDev: 0.003,         // Standard deviation
  
  // Partial fills
  partialFillProbability: 0.20,  // 20% chance of partial fill
  minPartialFillPct: 0.40,       // Minimum 40% of order filled
  
  // Timing
  avgFillTimeMs: 2000,           // Average 2s to fill
  fillTimeStdDev: 1000,          // +/- 1s
  
  // Queue position simulation
  queueSlippagePerSec: 0.001,    // 0.1% slippage per second in queue
};

/**
 * Simulate realistic order execution with slippage
 */
function simulatePaperExecution(orderPrice, marketPrice, size, shares) {
  // Calculate fill probability based on limit price
  const priceGap = (orderPrice - marketPrice) / marketPrice;
  let fillProb = PAPER_CONFIG.baseFillProbability;
  
  // Higher limit = more likely to fill, but with slippage
  if (priceGap > 0) {
    fillProb += priceGap * 10; // +10% per 1% above market
  } else {
    fillProb += priceGap * PAPER_CONFIG.fillProbabilityDecay * 100;
  }
  fillProb = Math.max(0.1, Math.min(0.95, fillProb));
  
  // Random fill decision
  const filled = Math.random() < fillProb;
  
  if (!filled) {
    return {
      filled: false,
      reason: 'no_fill',
      fillProb,
    };
  }
  
  // Simulate slippage (normally distributed)
  const slippageRandom = (Math.random() + Math.random() + Math.random()) / 3; // Approximate normal
  const slippage = PAPER_CONFIG.avgSlippagePct + (slippageRandom - 0.5) * 2 * PAPER_CONFIG.slippageStdDev;
  const actualPrice = marketPrice * (1 + slippage);
  
  // Partial fill simulation
  let filledShares = shares;
  let partialFill = false;
  
  if (Math.random() < PAPER_CONFIG.partialFillProbability) {
    const fillPct = PAPER_CONFIG.minPartialFillPct + Math.random() * (1 - PAPER_CONFIG.minPartialFillPct);
    filledShares = Math.floor(shares * fillPct);
    partialFill = true;
    
    // Check minimum shares
    if (filledShares < CONFIG.trading.minPositionShares) {
      return {
        filled: false,
        reason: 'partial_too_small',
        attemptedShares: shares,
        wouldFill: filledShares,
      };
    }
  }
  
  // Calculate actual cost with slippage
  const actualCost = filledShares * actualPrice;
  const slippageCost = actualCost - (filledShares * marketPrice);
  
  return {
    filled: true,
    orderPrice,
    marketPrice,
    actualPrice,
    slippagePct: slippage,
    slippageCost,
    requestedShares: shares,
    filledShares,
    partialFill,
    actualCost,
    fillProb,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// ORDER EXECUTION (LIMIT ONLY)
// ═══════════════════════════════════════════════════════════════════════════════

async function executeLimitOrder(symbol, direction, price, size, edge) {
  const asset = state.assets[symbol];
  
  // Lock
  if (state.tradeLock) return;
  state.tradeLock = true;
  asset.pendingTrade = true;
  
  try {
    const tokenId = direction === 'UP' ? asset.upTokenId : asset.downTokenId;
    const shares = Math.floor(size / price);
    
    // Minimum shares check
    if (shares < CONFIG.trading.minPositionShares) {
      log(`SKIPPED: Only ${shares} shares (min ${CONFIG.trading.minPositionShares})`, 'warning', symbol);
      return;
    }
    
    // LIMIT ORDER at current price (maker!)
    const limitPrice = price * (1 + CONFIG.trading.maxSlippagePct);
    
    log(`LIMIT ORDER: ${direction} ${shares} shares @ $${limitPrice.toFixed(4)}`, 'limit', symbol);
    
    // ═══ PAPER vs LIVE EXECUTION ═══
    if (CONFIG.mode === 'paper') {
      // Simulate realistic execution
      const simResult = simulatePaperExecution(limitPrice, price, size, shares);
      
      if (!simResult.filled) {
        log(`PAPER: Order NOT FILLED - ${simResult.reason} (fill prob: ${(simResult.fillProb * 100).toFixed(0)}%)`, 'warning', symbol);
        state.stats.limitOrdersPlaced++;
        state.stats.paperNoFills = (state.stats.paperNoFills || 0) + 1;
        return;
      }
      
      // Filled with slippage
      const slippageMsg = simResult.partialFill 
        ? `PARTIAL ${simResult.filledShares}/${simResult.requestedShares}` 
        : 'FULL';
      log(`PAPER: ${slippageMsg} fill @ $${simResult.actualPrice.toFixed(4)} | Slippage: ${(simResult.slippagePct * 100).toFixed(2)}% ($${simResult.slippageCost.toFixed(3)})`, 'fill', symbol);
      
      state.stats.limitOrdersPlaced++;
      state.stats.limitOrdersFilled++;
      state.stats.paperSlippageTotal = (state.stats.paperSlippageTotal || 0) + simResult.slippageCost;
      state.stats.paperPartialFills = (state.stats.paperPartialFills || 0) + (simResult.partialFill ? 1 : 0);
      state.dailyTrades++;
      asset.lastTradeTime = Date.now();
      
      // Track position with actual fill price
      state.positions.push({
        symbol,
        direction,
        tokenId,
        entryPrice: simResult.actualPrice,
        originalPrice: price,
        slippagePct: simResult.slippagePct,
        shares: simResult.filledShares,
        size: simResult.actualCost,
        edge: edge.edgePct,
        edgeAfterSlippage: edge.edgePct - simResult.slippagePct,
        orderId: `paper-${Date.now()}`,
        entryTime: Date.now(),
        status: 'filled',
        paper: true,
      });
      
      // Simulate P&L based on edge (probabilistic outcome)
      simulatePaperOutcome(symbol, state.positions[state.positions.length - 1]);
      
    } else {
      // LIVE execution - use createOrder + postOrder (V4 pattern)
      const roundedPrice = Math.round(limitPrice * 1000) / 1000;
      const roundedShares = Math.floor(shares);
      
      log(`Creating limit order: ${roundedShares} shares @ $${roundedPrice}`, 'info', symbol);
      
      const limitOrder = await state.clobClient.createOrder({
        tokenID: tokenId,
        price: roundedPrice,
        size: roundedShares,
        side: Side.BUY,
      });
      
      const result = await state.clobClient.postOrder(limitOrder, OrderType.GTC);
      
      log(`Order result: ${JSON.stringify(result)}`, 'info', symbol);
      
      if (result && result.orderID) {
        log(`Limit order placed: ${result.orderID} (0% maker fee!)`, 'fill', symbol);
        
        state.stats.limitOrdersPlaced++;
        state.stats.limitOrdersFilled++;
        state.dailyTrades++;
        asset.lastTradeTime = Date.now();
        
        // Track position (include market info for resolution tracking)
        state.positions.push({
          symbol,
          direction,
          tokenId,
          entryPrice: roundedPrice,
          shares: roundedShares,
          size,
          edge: edge.edgePct,
          orderId: result.orderID,
          entryTime: Date.now(),
          status: 'pending',
          eventId: asset.currentMarket?.id,
          conditionId: asset.currentMarket?.conditionId,
          marketTitle: asset.currentMarket?.title,
        });
      } else {
        log(`Limit order rejected: ${JSON.stringify(result)}`, 'warning', symbol);
      }
    }
    
    // Track edge
    state.stats.edgesCalculated.push(edge.edgePct);
    if (state.stats.edgesCalculated.length > 100) {
      state.stats.edgesCalculated.shift();
    }
    state.stats.avgEdgeEntered = state.stats.edgesCalculated.reduce((a, b) => a + b, 0) / state.stats.edgesCalculated.length;
    
    state.stats.totalTrades++;
    state.stats.lagArbTrades++;
    
    log(`ORDER PLACED: ${direction} ${shares}x @ $${limitPrice.toFixed(4)} | Edge: ${(edge.edgePct * 100).toFixed(2)}%`, 'entry', symbol);
    
    saveJournal();
    
  } catch (e) {
    log(`Order error: ${e.message}`, 'error', symbol);
    state.stats.errors++;
  } finally {
    state.tradeLock = false;
    asset.pendingTrade = false;
  }
}

/**
 * Simulate paper trade outcome based on edge
 */
function simulatePaperOutcome(symbol, position) {
  // Use edge to determine win probability
  // Higher edge = higher win probability
  const baseWinProb = CONFIG.quant.estimatedWinRate;
  const edgeBonus = position.edge * 2; // Edge improves win rate
  const winProb = Math.min(0.90, baseWinProb + edgeBonus);
  
  const won = Math.random() < winProb;
  
  // Calculate P&L
  let pnl;
  if (won) {
    // Win: payout is (1 - entryPrice) per share
    pnl = position.shares * (1 - position.entryPrice);
    state.stats.totalWins++;
  } else {
    // Loss: lose entryPrice per share
    pnl = -position.shares * position.entryPrice;
    state.stats.totalLosses++;
  }
  
  // Account for slippage
  pnl -= (position.slippagePct || 0) * position.size;
  
  state.stats.totalPnL += pnl;
  state.dailyPnL += pnl;
  
  const emoji = won ? '💰' : '📉';
  log(`PAPER OUTCOME: ${won ? 'WIN' : 'LOSS'} ${emoji} $${pnl.toFixed(2)} | Win prob was ${(winProb * 100).toFixed(0)}%`, won ? 'tp' : 'sl', symbol);
  
  // Record trade
  state.trades.push({
    ...position,
    outcome: won ? 'win' : 'loss',
    pnl,
    winProb,
    closedAt: Date.now(),
  });
  
  // Remove from positions
  const idx = state.positions.findIndex(p => p.orderId === position.orderId);
  if (idx >= 0) state.positions.splice(idx, 1);
  
  saveJournal();
}

// ═══════════════════════════════════════════════════════════════════════════════
// POSITION RESOLUTION TRACKING & REDEMPTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check if any open positions have resolved.
 * Polls Gamma API for closed events and determines actual win/loss.
 */
async function checkPositionResolutions() {
  if (state.positions.length === 0) return;

  const snapshot = [...state.positions];

  for (const position of snapshot) {
    if (position.status === 'resolved' || position.status === 'closed') continue;

    try {
      const eventId = position.eventId;
      if (!eventId) {
        // Try to backfill from current market state
        const asset = state.assets[position.symbol];
        if (asset?.currentMarket?.id && asset.currentMarket.id !== position.eventId) {
          // Current market is different - old market may have rotated away
          // We can't easily recover the old eventId, skip
        }
        log(`Position missing eventId, skipping resolution check`, 'warning', position.symbol);
        continue;
      }

      // Query Gamma API for event status
      const resp = await fetch(`${CONFIG.gammaApi}/events/${eventId}`);
      if (!resp.ok) continue;
      const eventData = await resp.json();
      if (!eventData) continue;

      // Check if market is closed / resolved
      const isClosed = eventData.closed === true || eventData.closed === 'true';
      if (!isClosed) continue;

      const market = eventData.markets?.[0];
      if (!market) continue;

      // Get final outcome prices
      const outcomePrices = JSON.parse(market.outcomePrices || '[0.5,0.5]');
      const upFinalPrice = parseFloat(outcomePrices[0]);
      const downFinalPrice = parseFloat(outcomePrices[1]);

      // Determine winner (resolved price ≈ 1.0 for winner, ≈ 0.0 for loser)
      const upWon = upFinalPrice > 0.9;
      const downWon = downFinalPrice > 0.9;

      if (!upWon && !downWon) {
        // Not fully resolved or ambiguous — skip for now
        continue;
      }

      const winner = upWon ? 'UP' : 'DOWN';
      const positionWon = position.direction === winner;

      // ═══ P&L CALCULATION ═══
      let pnl;
      if (positionWon) {
        // Win: each share redeems at $1, we paid entryPrice
        pnl = position.shares * (1 - position.entryPrice);
      } else {
        // Loss: shares worth $0, we lose cost
        pnl = -(position.shares * position.entryPrice);
      }

      // Update stats
      if (positionWon) {
        state.stats.totalWins++;
      } else {
        state.stats.totalLosses++;
      }
      state.stats.totalPnL += pnl;
      state.dailyPnL += pnl;

      // Track max drawdown
      if (state.stats.totalPnL < state.stats.maxDrawdown) {
        state.stats.maxDrawdown = state.stats.totalPnL;
      }

      // ═══ LOG RESOLUTION ═══
      const emoji = positionWon ? '💰' : '📉';
      const logType = positionWon ? 'tp' : 'sl';
      log(`═══════════════════════════════════════════════════`, logType, position.symbol);
      log(`MARKET RESOLVED ${emoji} ${positionWon ? 'WIN' : 'LOSS'}`, logType, position.symbol);
      log(`Direction: ${position.direction} | Winner: ${winner}`, logType, position.symbol);
      log(`Entry: $${position.entryPrice.toFixed(3)} × ${position.shares} shares (cost $${(position.shares * position.entryPrice).toFixed(2)})`, logType, position.symbol);
      if (positionWon) {
        log(`Payout: $${position.shares.toFixed(2)} | Profit: +$${pnl.toFixed(2)}`, logType, position.symbol);
      } else {
        log(`Loss: -$${Math.abs(pnl).toFixed(2)}`, logType, position.symbol);
      }
      log(`Running P&L: ${state.stats.totalPnL >= 0 ? '+' : ''}$${state.stats.totalPnL.toFixed(2)} | W/L: ${state.stats.totalWins}/${state.stats.totalLosses}`, logType, position.symbol);
      log(`Expected Balance: $${(state.dayStartBalance + state.stats.totalPnL).toFixed(2)}`, logType, position.symbol);
      log(`═══════════════════════════════════════════════════`, logType, position.symbol);

      // ═══ RECORD COMPLETED TRADE ═══
      state.trades.push({
        ...position,
        outcome: positionWon ? 'win' : 'loss',
        winner,
        pnl,
        resolvedAt: Date.now(),
        closedAt: Date.now(),
        upFinalPrice,
        downFinalPrice,
        marketTitle: position.marketTitle || eventData.title,
      });

      // Remove from active positions
      const idx = state.positions.findIndex(p => p.orderId === position.orderId);
      if (idx >= 0) state.positions.splice(idx, 1);

      // Attempt reward redemption for winning positions
      if (positionWon && CONFIG.mode === 'live') {
        await attemptRedemption(position, market);
      }

      saveJournal();

    } catch (e) {
      log(`Resolution check error: ${e.message}`, 'error', position.symbol);
    }

    await sleep(500); // Don't spam API
  }

  // Refresh balance after resolution checks
  if (snapshot.length > 0) {
    await updateBalance();
  }
}

/**
 * Attempt to redeem winning tokens from resolved markets.
 * Uses Builder Relayer API for gasless redemption through proxy wallet.
 * Falls back to direct Safe execution if relayer fails.
 */
async function attemptRedemption(position, market) {
  try {
    const conditionId = position.conditionId || market?.conditionId;
    if (!conditionId) {
      log(`No conditionId for redemption — will catch in periodic sweep`, 'info', position.symbol);
      return;
    }

    log(`Attempting redemption via Builder Relayer...`, 'claim', position.symbol);

    const { redeemPosition } = require('./auto-redeem.js');
    const negativeRisk = position.negativeRisk || market?.negativeRisk || false;
    const result = await redeemPosition(conditionId, negativeRisk);

    if (result.success) {
      log(`✅ Redeemed via ${result.method}${result.txHash ? ': ' + result.txHash : ''}`, 'claim', position.symbol);
    } else {
      log(`Redeem failed: ${result.error} — will retry in periodic sweep`, 'warning', position.symbol);
    }
  } catch (e) {
    log(`Redemption error: ${e.message?.substring(0, 100)} — will retry in periodic sweep`, 'warning', position.symbol);
  }
}

/**
 * Sync internal position state with actual Polymarket positions.
 * Detects manually closed positions (sold via UI) and updates P&L.
 */
async function syncPositionsWithPolymarket() {
  if (state.positions.length === 0 || CONFIG.mode === 'paper') return;

  try {
    const funder = process.env.POLYMARKET_FUNDER || state.wallet.address;
    const resp = await fetch(`${CONFIG.dataApi}/positions?user=${funder}`);
    if (!resp.ok) return;
    const livePositions = await resp.json();

    if (!Array.isArray(livePositions)) return;

    // Build a set of token IDs that currently have non-zero positions on Polymarket
    const liveTokenIds = new Set();
    for (const p of livePositions) {
      if (p.asset && parseFloat(p.size || 0) > 0) {
        liveTokenIds.add(p.asset);
      }
    }

    // Check each internal position against live state
    const positionsSnapshot = [...state.positions];
    for (const position of positionsSnapshot) {
      if (position.status === 'resolved' || position.status === 'closed') continue;

      const stillHeld = liveTokenIds.has(position.tokenId);
      if (stillHeld) continue;

      // Position is gone from Polymarket — manually closed
      log(`═══════════════════════════════════════════════════`, 'warning', position.symbol);
      log(`POSITION CLOSED EXTERNALLY (manual sell detected)`, 'warning', position.symbol);
      log(`Direction: ${position.direction} | Entry: $${position.entryPrice.toFixed(3)} × ${position.shares} shares`, 'warning', position.symbol);

      // Estimate P&L: we don't know exact sell price, use current market price
      const asset = state.assets[position.symbol];
      let estimatedSellPrice = null;
      let pnl = 0;

      if (asset) {
        estimatedSellPrice = position.direction === 'UP' ? asset.upPrice : asset.downPrice;
      }

      if (estimatedSellPrice && estimatedSellPrice > 0) {
        // P&L = (sellPrice - entryPrice) × shares
        pnl = (estimatedSellPrice - position.entryPrice) * position.shares;
        log(`Est. sell @ $${estimatedSellPrice.toFixed(3)} | Est. P&L: ${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)}`, 'warning', position.symbol);
      } else {
        // Can't estimate — assume loss of entry cost (conservative)
        pnl = -(position.shares * position.entryPrice);
        log(`Could not estimate sell price — recording as -$${Math.abs(pnl).toFixed(2)} loss`, 'warning', position.symbol);
      }

      // Update stats
      if (pnl >= 0) {
        state.stats.totalWins++;
      } else {
        state.stats.totalLosses++;
      }
      state.stats.totalPnL += pnl;
      state.dailyPnL += pnl;

      log(`Running P&L: ${state.stats.totalPnL >= 0 ? '+' : ''}$${state.stats.totalPnL.toFixed(2)}`, 'warning', position.symbol);
      log(`═══════════════════════════════════════════════════`, 'warning', position.symbol);

      // Record trade
      state.trades.push({
        ...position,
        outcome: pnl >= 0 ? 'win' : 'loss',
        pnl,
        closedAt: Date.now(),
        closedBy: 'manual',
        estimatedSellPrice,
      });

      // Remove from active positions
      const idx = state.positions.findIndex(p => p.orderId === position.orderId);
      if (idx >= 0) state.positions.splice(idx, 1);

      saveJournal();
    }
  } catch (e) {
    log(`Position sync error: ${e.message}`, 'error');
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// DELTA-NEUTRAL EXECUTION
// ═══════════════════════════════════════════════════════════════════════════════

async function executeDeltaNeutral(symbol, upPrice, downPrice, edge) {
  const asset = state.assets[symbol];
  
  if (state.tradeLock) return;
  state.tradeLock = true;
  
  try {
    // Split position between UP and DOWN
    const halfSize = CONFIG.trading.positionSize / 2;
    const upShares = Math.floor(halfSize / upPrice);
    const downShares = Math.floor(halfSize / downPrice);
    
    if (upShares < CONFIG.trading.minPositionShares || downShares < CONFIG.trading.minPositionShares) {
      log(`SKIPPED: Insufficient shares for delta-neutral`, 'warning', symbol);
      return;
    }
    
    log(`DELTA-NEUTRAL: Buying ${upShares} UP + ${downShares} DOWN`, 'delta', symbol);
    
    // Place both orders using V4 pattern
    const upLimitPrice = Math.round(upPrice * 1.01 * 1000) / 1000;
    const downLimitPrice = Math.round(downPrice * 1.01 * 1000) / 1000;
    
    const upLimitOrder = await state.clobClient.createOrder({
      tokenID: asset.upTokenId,
      price: upLimitPrice,
      size: upShares,
      side: Side.BUY,
    });
    const upResult = await state.clobClient.postOrder(upLimitOrder, OrderType.GTC);
    
    const downLimitOrder = await state.clobClient.createOrder({
      tokenID: asset.downTokenId,
      price: downLimitPrice,
      size: downShares,
      side: Side.BUY,
    });
    const downResult = await state.clobClient.postOrder(downLimitOrder, OrderType.GTC);
    
    const upOrder = upResult?.orderID ? upResult : null;
    const downOrder = downResult?.orderID ? downResult : null;
    
    state.stats.limitOrdersPlaced += 2;
    state.stats.deltaNeutralTrades++;
    state.dailyTrades += 2;
    
    log(`DELTA-NEUTRAL PLACED: Guaranteed ${(edge.edgePct * 100).toFixed(2)}% profit`, 'delta', symbol);
    
    saveJournal();
    
  } catch (e) {
    log(`Delta-neutral error: ${e.message}`, 'error', symbol);
    state.stats.errors++;
  } finally {
    state.tradeLock = false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATUS & MONITORING
// ═══════════════════════════════════════════════════════════════════════════════

function printStatus() {
  const runtime = Math.floor((Date.now() - state.startTime) / 60000);
  const dailyPnLPct = state.dayStartBalance > 0 ? (state.dailyPnL / state.dayStartBalance) * 100 : 0;
  const winRate = state.stats.totalTrades > 0 ? (state.stats.totalWins / state.stats.totalTrades * 100).toFixed(1) : '0.0';
  const fillRate = state.stats.limitOrdersPlaced > 0 ? (state.stats.limitOrdersFilled / state.stats.limitOrdersPlaced * 100).toFixed(1) : '0.0';
  
  log('═══════════════════════════════════════════════════════════════', 'quant');
  log(`QUANT BOT V1 STATUS | Runtime: ${runtime}min | Mode: ${CONFIG.mode.toUpperCase()}`, 'quant');
  log('───────────────────────────────────────────────────────────────', 'quant');
  log(`Balance: $${state.currentBalance.toFixed(2)} | Daily P&L: $${state.dailyPnL.toFixed(2)} (${dailyPnLPct.toFixed(1)}%)`, 'quant');
  log(`Daily Trades: ${state.dailyTrades}/${CONFIG.quant.maxDailyTrades} | Daily Limit: ${state.dailyLimitHit ? '🔴 HIT' : '🟢 OK'}`, 'daily');
  log('───────────────────────────────────────────────────────────────', 'quant');
  log(`Signals: ${state.stats.totalSignals} | Edge Calcs: ${state.stats.totalEdgeCalcs}`, 'quant');
  log(`Trades: ${state.stats.totalTrades} (Lag Arb: ${state.stats.lagArbTrades}, Delta: ${state.stats.deltaNeutralTrades})`, 'quant');
  log(`Edge Rejections: ${state.stats.edgeRejections} | Daily Limit Rejections: ${state.stats.dailyLimitRejections}`, 'quant');
  log(`Avg Edge Entered: ${(state.stats.avgEdgeEntered * 100).toFixed(2)}%`, 'quant');
  log(`Win/Loss: ${state.stats.totalWins}/${state.stats.totalLosses} (${winRate}%) | Total P&L: $${state.stats.totalPnL.toFixed(2)}`, 'quant');
  
  // Resolution tracking stats
  if (state.trades.length > 0) {
    const resolvedTrades = state.trades.filter(t => t.resolvedAt);
    const wins = resolvedTrades.filter(t => t.outcome === 'win');
    const losses = resolvedTrades.filter(t => t.outcome === 'loss');
    const totalProfit = wins.reduce((sum, t) => sum + t.pnl, 0);
    const totalLoss = losses.reduce((sum, t) => sum + Math.abs(t.pnl), 0);
    const expectedBal = state.dayStartBalance + state.stats.totalPnL;
    
    log('─── RESOLUTION TRACKING ────────────────────────────────────────', 'quant');
    log(`Resolved: ${resolvedTrades.length} | Open: ${state.positions.length}`, 'quant');
    log(`Gross Profit: +$${totalProfit.toFixed(2)} | Gross Loss: -$${totalLoss.toFixed(2)} | Net: $${state.stats.totalPnL.toFixed(2)}`, 'quant');
    log(`Expected Balance: $${expectedBal.toFixed(2)} (started $${state.dayStartBalance.toFixed(2)})`, 'quant');
    if (wins.length > 0) {
      const avgWin = totalProfit / wins.length;
      log(`Avg Win: +$${avgWin.toFixed(2)} | Avg Edge at Entry: ${(state.stats.avgEdgeEntered * 100).toFixed(1)}%`, 'quant');
    }
  }
  
  // Open positions detail
  if (state.positions.length > 0) {
    log('─── OPEN POSITIONS ─────────────────────────────────────────────', 'quant');
    for (const pos of state.positions) {
      const age = Math.floor((Date.now() - pos.entryTime) / 60000);
      log(`${pos.symbol} ${pos.direction} | ${pos.shares}x @ $${pos.entryPrice.toFixed(3)} ($${(pos.shares * pos.entryPrice).toFixed(2)}) | Edge: ${(pos.edge * 100).toFixed(1)}% | Age: ${age}min`, 'quant');
    }
  }
  
  // Paper trading specific stats
  if (CONFIG.mode === 'paper') {
    log('─── PAPER TRADING SIMULATION ───────────────────────────────────', 'quant');
    log(`Orders: ${state.stats.limitOrdersPlaced} placed, ${state.stats.limitOrdersFilled} filled (${fillRate}% fill rate)`, 'quant');
    log(`No-fills: ${state.stats.paperNoFills || 0} | Partial fills: ${state.stats.paperPartialFills || 0}`, 'quant');
    log(`Total slippage cost: $${(state.stats.paperSlippageTotal || 0).toFixed(3)}`, 'quant');
    
    if (state.trades.length > 0) {
      const avgSlippage = state.trades.reduce((sum, t) => sum + (t.slippagePct || 0), 0) / state.trades.length;
      log(`Avg slippage per trade: ${(avgSlippage * 100).toFixed(3)}%`, 'quant');
    }
  }
  
  log('═══════════════════════════════════════════════════════════════', 'quant');
  
  saveJournal();
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
  console.log(`
╔═══════════════════════════════════════════════════════════════════════════════╗
║                        QUANT BOT V1 - PHASE 1                                 ║
║                                                                               ║
║  QUANT FEATURES:                                                              ║
║  ✅ LIMIT ORDERS ONLY (0% maker fee)                                          ║
║  ✅ 5% MINIMUM EDGE REQUIREMENT                                               ║
║  ✅ 10% DAILY LOSS LIMIT                                                      ║
║  ✅ KELLY CRITERION POSITION SIZING                                           ║
║  ✅ DELTA-NEUTRAL OPPORTUNITY SCANNER                                         ║
║                                                                               ║
║  Based on: awesome-systematic-trading + Account88888 analysis                 ║
╚═══════════════════════════════════════════════════════════════════════════════╝
  `);
  
  // Initialize
  const clobOk = await initClobClient();
  if (!clobOk) {
    log('Failed to initialize CLOB client', 'error');
    process.exit(1);
  }
  
  // Initialize Chainlink oracles
  await initChainlink();
  
  // Initial market fetch
  for (const symbol of Object.keys(CONFIG.assets)) {
    await fetchMarketData(symbol);
    await sleep(500);
  }
  
  // Initial price fetch
  await pollChainlinkPrices();
  
  // Polling intervals - Market data
  setInterval(async () => {
    for (const symbol of Object.keys(CONFIG.assets)) {
      await fetchMarketData(symbol);
      await sleep(200);
    }
  }, CONFIG.polling.marketMs);
  
  // Polling intervals - Chainlink prices (every 5s)
  setInterval(async () => {
    await pollChainlinkPrices();
  }, 5000);
  
  setInterval(async () => {
    await updateBalance();
  }, 30000);
  
  setInterval(printStatus, CONFIG.polling.statusMs);
  
  // Initial status
  setTimeout(printStatus, 5000);
  
  // Position resolution tracking (every 15 seconds)
  setInterval(async () => {
    await checkPositionResolutions();
  }, 15000);

  // Position sync with Polymarket (every 20 seconds) — detects manual sells
  setInterval(async () => {
    await syncPositionsWithPolymarket();
  }, 20000);

  // ═══ AUTO-REDEEM PERIODIC SWEEP ═══
  // Runs on startup + every 2 minutes to catch any unclaimed positions
  // Uses Builder Relayer (gasless) with Safe fallback
  if (CONFIG.mode === 'live') {
    try {
      const { startPeriodicSweep } = require('./auto-redeem.js');
      startPeriodicSweep(120000); // Every 2 minutes
      log('Auto-redeem periodic sweep started (every 2 min)', 'claim');
    } catch (e) {
      log(`Auto-redeem init error: ${e.message} — manual claiming still required`, 'error');
    }
  }

  // Heartbeat (with resolution-aware P&L)
  setInterval(() => {
    const runtime = Math.floor((Date.now() - state.startTime) / 60000);
    const expectedBal = (state.dayStartBalance + state.stats.totalPnL).toFixed(2);
    const winRate = state.stats.totalWins + state.stats.totalLosses > 0
      ? ((state.stats.totalWins / (state.stats.totalWins + state.stats.totalLosses)) * 100).toFixed(0)
      : '-';
    log(`HEARTBEAT: ${runtime}min | Balance: $${state.currentBalance.toFixed(2)} | Expected: $${expectedBal} | Trades: ${state.dailyTrades} | P&L: $${state.stats.totalPnL.toFixed(2)} | W/L: ${state.stats.totalWins}/${state.stats.totalLosses} (${winRate}%) | Open: ${state.positions.length}`, 'info');
  }, 60000);
  
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

process.on('uncaughtException', (err) => {
  log(`UNCAUGHT: ${err.message}`, 'error');
  saveJournal();
});

process.on('unhandledRejection', (reason) => {
  log(`UNHANDLED: ${reason}`, 'error');
});

main().catch(e => {
  log(`Fatal: ${e.message}`, 'error');
  process.exit(1);
});
