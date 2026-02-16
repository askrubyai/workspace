#!/usr/bin/env node

/**
 * BTC 15-Minute Trading Bot v2
 * 
 * Based on research from:
 * - @RohOnChain's $40M arbitrage analysis
 * - PolymarketBTC15mAssistant scoring system
 * - Spartan Labs trading skills
 * 
 * Two modes:
 * 1. ARBITRAGE: Buy BOTH when UP + DOWN < $0.97 (zero risk)
 * 2. DIRECTIONAL: TA-based scoring with edge thresholds
 */

require('dotenv').config();
const WebSocket = require('ws');
const fetch = require('node-fetch');

// =============================================================================
// CONFIGURATION
// =============================================================================

const CONFIG = {
  // Mode: 'arbitrage' (safe) or 'directional' (risky)
  mode: 'arbitrage',
  
  // Wallet
  wallet: {
    address: process.env.POLYMARKET_FUNDER || '0x0804284070BD28d4DE326909b648f00AC4C3F6F7',
    privateKey: process.env.POLYMARKET_PK,
    signatureType: parseInt(process.env.POLYMARKET_SIGNATURE_TYPE || '1'),
  },
  
  // BTC 15m Series
  market: {
    seriesId: '10192',
    seriesSlug: 'btc-up-or-down-15m',
  },
  
  // Arbitrage thresholds (from research: top traders used $0.05 minimum)
  arbitrage: {
    maxSpread: 0.97,        // Buy BOTH when UP + DOWN <= this
    minProfitUsd: 0.05,     // Minimum $0.05 profit per trade
    maxPositionUsd: 50,     // Max per arbitrage opportunity
    minLiquidity: 100,      // Min shares available on each side
  },
  
  // Directional trading thresholds (from PolymarketBTC15mAssistant)
  directional: {
    // Edge thresholds by time remaining
    edgeThresholds: {
      early: 0.05,   // > 10 min remaining
      mid: 0.10,     // 5-10 min remaining  
      late: 0.20,    // < 5 min remaining
    },
    // Minimum model probability to trade
    minProbThresholds: {
      early: 0.55,
      mid: 0.60,
      late: 0.65,
    },
    maxPositionUsd: 20,
  },
  
  // Technical Analysis (from PolymarketBTC15mAssistant)
  ta: {
    rsiPeriod: 14,
    macdFast: 12,
    macdSlow: 26,
    macdSignal: 9,
    vwapLookbackMinutes: 5,
  },
  
  // API Endpoints
  api: {
    gamma: 'https://gamma-api.polymarket.com',
    clob: 'https://clob.polymarket.com',
    binance: 'https://api.binance.com',
    binanceWs: 'wss://stream.binance.com:9443/ws/btcusdt@trade',
  },
  
  // Timing
  timing: {
    pollIntervalMs: 2000,   // Check every 2 seconds
    candleWindowMinutes: 15,
  },
  
  // Safety
  paperTrading: true,
};

// =============================================================================
// STATE
// =============================================================================

const state = {
  // Market data
  currentMarket: null,
  upTokenId: null,
  downTokenId: null,
  upPrice: null,
  downPrice: null,
  upLiquidity: null,
  downLiquidity: null,
  
  // BTC price data (for TA)
  btcPrice: null,
  btcPrices: [],  // Last N prices for VWAP/RSI/MACD
  
  // Stats
  stats: {
    scans: 0,
    arbitrageOpportunities: 0,
    directionalSignals: 0,
    trades: 0,
    profit: 0,
    startTime: null,
  },
};

// =============================================================================
// TECHNICAL ANALYSIS (from PolymarketBTC15mAssistant)
// =============================================================================

function computeVWAP(prices, volumes) {
  if (!prices.length || !volumes.length) return null;
  let sumPV = 0, sumV = 0;
  for (let i = 0; i < prices.length; i++) {
    sumPV += prices[i] * (volumes[i] || 1);
    sumV += (volumes[i] || 1);
  }
  return sumV > 0 ? sumPV / sumV : null;
}

function computeRSI(prices, period = 14) {
  if (prices.length < period + 1) return null;
  
  let gains = 0, losses = 0;
  for (let i = prices.length - period; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) gains += change;
    else losses -= change;
  }
  
  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

function computeEMA(prices, period) {
  if (prices.length < period) return null;
  const k = 2 / (period + 1);
  let ema = prices.slice(0, period).reduce((a, b) => a + b) / period;
  for (let i = period; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k);
  }
  return ema;
}

function computeMACD(prices) {
  const { macdFast, macdSlow, macdSignal } = CONFIG.ta;
  if (prices.length < macdSlow + macdSignal) return null;
  
  const emaFast = computeEMA(prices, macdFast);
  const emaSlow = computeEMA(prices, macdSlow);
  if (emaFast === null || emaSlow === null) return null;
  
  const macdLine = emaFast - emaSlow;
  
  // Simplified - would need history for proper signal line
  return {
    macd: macdLine,
    hist: macdLine, // Simplified
    histDelta: 0,   // Would need previous value
  };
}

function computeSlope(values, lookback = 5) {
  if (values.length < lookback) return null;
  const recent = values.slice(-lookback);
  const first = recent[0];
  const last = recent[recent.length - 1];
  return (last - first) / lookback;
}

// =============================================================================
// SCORING SYSTEM (from PolymarketBTC15mAssistant)
// =============================================================================

function scoreDirection(btcPrice, vwap, vwapSlope, rsi, rsiSlope, macd) {
  let upScore = 1;
  let downScore = 1;
  
  // Price vs VWAP (weight: 2)
  if (btcPrice !== null && vwap !== null) {
    if (btcPrice > vwap) upScore += 2;
    if (btcPrice < vwap) downScore += 2;
  }
  
  // VWAP Slope (weight: 2)
  if (vwapSlope !== null) {
    if (vwapSlope > 0) upScore += 2;
    if (vwapSlope < 0) downScore += 2;
  }
  
  // RSI + Slope (weight: 2)
  if (rsi !== null && rsiSlope !== null) {
    if (rsi > 55 && rsiSlope > 0) upScore += 2;
    if (rsi < 45 && rsiSlope < 0) downScore += 2;
  }
  
  // MACD (weight: 2 for histogram, 1 for line)
  if (macd !== null) {
    if (macd.hist > 0 && macd.histDelta > 0) upScore += 2;
    if (macd.hist < 0 && macd.histDelta < 0) downScore += 2;
    if (macd.macd > 0) upScore += 1;
    if (macd.macd < 0) downScore += 1;
  }
  
  const totalScore = upScore + downScore;
  const rawUpProb = upScore / totalScore;
  
  return {
    upScore,
    downScore,
    rawUpProb,
    rawDownProb: 1 - rawUpProb,
  };
}

function applyTimeAwareness(rawUpProb, remainingMinutes) {
  const timeDecay = Math.max(0, Math.min(1, remainingMinutes / CONFIG.timing.candleWindowMinutes));
  const adjustedUp = 0.5 + (rawUpProb - 0.5) * timeDecay;
  return {
    adjustedUp: Math.max(0, Math.min(1, adjustedUp)),
    adjustedDown: 1 - Math.max(0, Math.min(1, adjustedUp)),
    timeDecay,
  };
}

// =============================================================================
// EDGE CALCULATION (from PolymarketBTC15mAssistant)
// =============================================================================

function computeEdge(modelUp, modelDown, marketUp, marketDown) {
  if (marketUp === null || marketDown === null) return null;
  
  const sum = marketUp + marketDown;
  const normalizedMarketUp = sum > 0 ? marketUp / sum : 0.5;
  const normalizedMarketDown = sum > 0 ? marketDown / sum : 0.5;
  
  return {
    edgeUp: modelUp - normalizedMarketUp,
    edgeDown: modelDown - normalizedMarketDown,
    marketUp: normalizedMarketUp,
    marketDown: normalizedMarketDown,
  };
}

function getPhase(remainingMinutes) {
  if (remainingMinutes > 10) return 'early';
  if (remainingMinutes > 5) return 'mid';
  return 'late';
}

function shouldTradeDirectional(edge, modelProb, remainingMinutes) {
  const phase = getPhase(remainingMinutes);
  const edgeThreshold = CONFIG.directional.edgeThresholds[phase];
  const probThreshold = CONFIG.directional.minProbThresholds[phase];
  
  const bestSide = edge.edgeUp > edge.edgeDown ? 'UP' : 'DOWN';
  const bestEdge = bestSide === 'UP' ? edge.edgeUp : edge.edgeDown;
  const bestModelProb = bestSide === 'UP' ? modelProb.adjustedUp : modelProb.adjustedDown;
  
  if (bestEdge < edgeThreshold) {
    return { trade: false, reason: `edge ${bestEdge.toFixed(3)} < threshold ${edgeThreshold}` };
  }
  
  if (bestModelProb < probThreshold) {
    return { trade: false, reason: `prob ${bestModelProb.toFixed(3)} < threshold ${probThreshold}` };
  }
  
  return {
    trade: true,
    side: bestSide,
    edge: bestEdge,
    prob: bestModelProb,
    phase,
  };
}

// =============================================================================
// MARKET DATA FETCHING
// =============================================================================

async function fetchCurrentMarket() {
  try {
    const resp = await fetch(`${CONFIG.api.gamma}/series/${CONFIG.market.seriesId}`);
    const series = await resp.json();
    
    const now = new Date();
    const activeEvents = series.events.filter(e => 
      !e.closed && new Date(e.endDate) > now
    ).sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
    
    if (activeEvents.length === 0) return null;
    
    const event = activeEvents[0];
    const eventResp = await fetch(`${CONFIG.api.gamma}/events/${event.id}`);
    const eventData = await eventResp.json();
    
    if (!eventData.markets || !eventData.markets[0]) return null;
    
    const market = eventData.markets[0];
    const tokenIds = JSON.parse(market.clobTokenIds || '[]');
    const outcomes = JSON.parse(market.outcomes || '["Up","Down"]');
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
    console.error('Error fetching market:', e.message);
    return null;
  }
}

async function fetchOrderBook(tokenId) {
  try {
    const resp = await fetch(`${CONFIG.api.clob}/book?token_id=${tokenId}`);
    const book = await resp.json();
    
    // Calculate total liquidity at best prices
    const bids = book.bids || [];
    const asks = book.asks || [];
    
    const bidLiquidity = bids.slice(0, 5).reduce((sum, b) => sum + parseFloat(b.size || 0), 0);
    const askLiquidity = asks.slice(0, 5).reduce((sum, a) => sum + parseFloat(a.size || 0), 0);
    
    return {
      bidLiquidity,
      askLiquidity,
      bestBid: bids[0] ? parseFloat(bids[0].price) : null,
      bestAsk: asks[0] ? parseFloat(asks[0].price) : null,
    };
  } catch (e) {
    return { bidLiquidity: 0, askLiquidity: 0, bestBid: null, bestAsk: null };
  }
}

async function fetchBTCPrice() {
  try {
    const resp = await fetch(`${CONFIG.api.binance}/api/v3/ticker/price?symbol=BTCUSDT`);
    const data = await resp.json();
    return parseFloat(data.price);
  } catch (e) {
    return null;
  }
}

// =============================================================================
// ARBITRAGE DETECTION
// =============================================================================

function detectArbitrage(upPrice, downPrice, upLiquidity, downLiquidity) {
  const totalPrice = upPrice + downPrice;
  
  if (totalPrice > CONFIG.arbitrage.maxSpread) {
    return { found: false, reason: `spread ${totalPrice.toFixed(4)} > ${CONFIG.arbitrage.maxSpread}` };
  }
  
  const profitPerDollar = 1 - totalPrice;
  const minLiquidity = Math.min(upLiquidity, downLiquidity);
  const maxProfit = profitPerDollar * minLiquidity;
  
  if (maxProfit < CONFIG.arbitrage.minProfitUsd) {
    return { found: false, reason: `max profit $${maxProfit.toFixed(2)} < min $${CONFIG.arbitrage.minProfitUsd}` };
  }
  
  if (minLiquidity < CONFIG.arbitrage.minLiquidity) {
    return { found: false, reason: `liquidity ${minLiquidity} < min ${CONFIG.arbitrage.minLiquidity}` };
  }
  
  // Calculate optimal position size
  const positionSize = Math.min(
    CONFIG.arbitrage.maxPositionUsd,
    minLiquidity * Math.min(upPrice, downPrice)
  );
  
  const expectedProfit = positionSize * profitPerDollar;
  
  return {
    found: true,
    spread: totalPrice,
    profitPct: profitPerDollar * 100,
    positionSize,
    expectedProfit,
    minLiquidity,
  };
}

// =============================================================================
// MAIN LOOP
// =============================================================================

async function runIteration() {
  state.stats.scans++;
  
  // Fetch current market
  const market = await fetchCurrentMarket();
  if (!market) {
    console.log('⏳ No active market found, waiting...');
    return;
  }
  
  state.currentMarket = market;
  
  // Calculate time remaining
  const now = new Date();
  const remainingMs = market.endDate - now;
  const remainingMinutes = remainingMs / (1000 * 60);
  
  if (remainingMinutes < 1) {
    console.log('⏰ Market closing soon, skipping...');
    return;
  }
  
  // Fetch order books
  const [upBook, downBook] = await Promise.all([
    fetchOrderBook(market.upTokenId),
    fetchOrderBook(market.downTokenId),
  ]);
  
  state.upPrice = market.upPrice;
  state.downPrice = market.downPrice;
  state.upLiquidity = upBook.askLiquidity;
  state.downLiquidity = downBook.askLiquidity;
  
  // Display status
  console.clear();
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`🤖 BTC 15m Bot v2 | Mode: ${CONFIG.mode.toUpperCase()} | ${CONFIG.paperTrading ? '📝 PAPER' : '🔴 LIVE'}`);
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`📊 Market: ${market.title}`);
  console.log(`⏰ Time remaining: ${remainingMinutes.toFixed(1)} min`);
  console.log('───────────────────────────────────────────────────────────');
  console.log(`   UP:   $${market.upPrice.toFixed(3)}  (liq: ${upBook.askLiquidity.toFixed(0)})`);
  console.log(`   DOWN: $${market.downPrice.toFixed(3)}  (liq: ${downBook.askLiquidity.toFixed(0)})`);
  console.log(`   SUM:  $${(market.upPrice + market.downPrice).toFixed(3)}`);
  console.log('───────────────────────────────────────────────────────────');
  
  // Mode: Arbitrage
  if (CONFIG.mode === 'arbitrage') {
    const arb = detectArbitrage(
      market.upPrice,
      market.downPrice,
      upBook.askLiquidity,
      downBook.askLiquidity
    );
    
    if (arb.found) {
      state.stats.arbitrageOpportunities++;
      console.log('🎯 ARBITRAGE OPPORTUNITY DETECTED!');
      console.log(`   Spread: $${arb.spread.toFixed(4)} (profit: ${arb.profitPct.toFixed(2)}%)`);
      console.log(`   Position: $${arb.positionSize.toFixed(2)}`);
      console.log(`   Expected profit: $${arb.expectedProfit.toFixed(2)}`);
      
      if (!CONFIG.paperTrading) {
        // TODO: Execute trade
        console.log('   🔄 Executing trade...');
      } else {
        console.log('   📝 Paper trade recorded');
        state.stats.profit += arb.expectedProfit;
        state.stats.trades++;
      }
    } else {
      console.log(`📈 No arbitrage: ${arb.reason}`);
    }
  }
  
  // Mode: Directional
  if (CONFIG.mode === 'directional') {
    // Fetch BTC price for TA
    const btcPrice = await fetchBTCPrice();
    if (btcPrice) {
      state.btcPrices.push(btcPrice);
      if (state.btcPrices.length > 100) state.btcPrices.shift();
      state.btcPrice = btcPrice;
    }
    
    console.log(`   BTC: $${btcPrice?.toFixed(2) || 'N/A'}`);
    
    if (state.btcPrices.length >= 20) {
      // Compute TA indicators
      const vwap = computeVWAP(state.btcPrices, []);
      const vwapSlope = computeSlope(state.btcPrices.map((p, i, arr) => 
        computeVWAP(arr.slice(0, i + 1), [])
      ).filter(v => v !== null));
      const rsi = computeRSI(state.btcPrices);
      const rsiHistory = state.btcPrices.map((p, i, arr) => 
        computeRSI(arr.slice(0, i + 1))
      ).filter(v => v !== null);
      const rsiSlope = computeSlope(rsiHistory);
      const macd = computeMACD(state.btcPrices);
      
      // Score direction
      const scores = scoreDirection(btcPrice, vwap, vwapSlope, rsi, rsiSlope, macd);
      const timeAware = applyTimeAwareness(scores.rawUpProb, remainingMinutes);
      
      console.log('───────────────────────────────────────────────────────────');
      console.log(`   VWAP: $${vwap?.toFixed(2) || 'N/A'} (slope: ${vwapSlope?.toFixed(4) || 'N/A'})`);
      console.log(`   RSI: ${rsi?.toFixed(1) || 'N/A'} (slope: ${rsiSlope?.toFixed(4) || 'N/A'})`);
      console.log(`   Model: UP ${(timeAware.adjustedUp * 100).toFixed(1)}% / DOWN ${(timeAware.adjustedDown * 100).toFixed(1)}%`);
      
      // Compute edge
      const edge = computeEdge(
        timeAware.adjustedUp,
        timeAware.adjustedDown,
        market.upPrice,
        market.downPrice
      );
      
      if (edge) {
        console.log(`   Edge: UP ${(edge.edgeUp * 100).toFixed(1)}% / DOWN ${(edge.edgeDown * 100).toFixed(1)}%`);
        
        const decision = shouldTradeDirectional(edge, timeAware, remainingMinutes);
        
        if (decision.trade) {
          state.stats.directionalSignals++;
          console.log('───────────────────────────────────────────────────────────');
          console.log(`🎯 SIGNAL: ${decision.side} (edge: ${(decision.edge * 100).toFixed(1)}%, prob: ${(decision.prob * 100).toFixed(1)}%)`);
          
          if (!CONFIG.paperTrading) {
            // TODO: Execute trade
          }
        }
      }
    } else {
      console.log(`   ⏳ Collecting data... (${state.btcPrices.length}/20 prices)`);
    }
  }
  
  // Stats
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`📊 Stats: ${state.stats.scans} scans | ${state.stats.arbitrageOpportunities} arb ops | ${state.stats.trades} trades | $${state.stats.profit.toFixed(2)} profit`);
}

async function main() {
  console.log('🚀 BTC 15m Trading Bot v2');
  console.log(`   Mode: ${CONFIG.mode}`);
  console.log(`   Paper trading: ${CONFIG.paperTrading}`);
  console.log('');
  
  state.stats.startTime = new Date();
  
  // Main loop
  while (true) {
    try {
      await runIteration();
    } catch (e) {
      console.error('Error:', e.message);
    }
    
    await new Promise(r => setTimeout(r, CONFIG.timing.pollIntervalMs));
  }
}

main().catch(console.error);
