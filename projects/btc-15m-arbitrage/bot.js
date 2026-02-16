#!/usr/bin/env node

/**
 * BTC 15-Minute Arbitrage Bot
 * 
 * Strategy: When UP + DOWN < $0.97, buy BOTH for guaranteed profit
 * Risk: ZERO (one side MUST win, payout = $1)
 * 
 * @wallet 0x0804284070BD28d4DE326909b648f00AC4C3F6F7 (@polarbbot)
 */

const { ClobClient } = require('@polymarket/clob-client');
const { ethers } = require('ethers');
const fetch = require('node-fetch');

// Configuration
const CONFIG = {
  // Wallet - Reuben's Polymarket account
  wallet: {
    address: '0x0804284070BD28d4DE326909b648f00AC4C3F6F7',
    // Private key loaded from env or file
  },
  
  // BTC 15m Series
  market: {
    seriesId: '10192',
    seriesSlug: 'btc-up-or-down-15m',
  },
  
  // Arbitrage Parameters
  arbitrage: {
    maxSpread: 0.97,        // Only trade when UP + DOWN <= this
    minProfit: 0.03,        // Minimum 3% profit required
    maxPositionUsd: 50,     // Max $ per arbitrage trade
    minLiquidity: 100,      // Min liquidity on each side
  },
  
  // API Endpoints
  api: {
    gamma: 'https://gamma-api.polymarket.com',
    clob: 'https://clob.polymarket.com',
  },
  
  // Timing
  timing: {
    pollIntervalMs: 5000,   // Check every 5 seconds
    minTimeToResolution: 5 * 60 * 1000, // Don't trade within 5 min of resolution
  },
  
  // Mode
  paperTrading: true,  // Start in paper mode for safety
};

class BTC15mArbitrageBot {
  constructor() {
    this.wallet = null;
    this.clobClient = null;
    this.isRunning = false;
    this.stats = {
      scans: 0,
      opportunities: 0,
      trades: 0,
      profit: 0,
      startTime: null,
    };
  }
  
  async initialize() {
    console.log('🚀 BTC 15m Arbitrage Bot');
    console.log(`📊 Mode: ${CONFIG.paperTrading ? 'PAPER TRADING' : '⚠️  LIVE'}`);
    console.log(`💼 Wallet: ${CONFIG.wallet.address}`);
    console.log(`📈 Max Spread: ${CONFIG.arbitrage.maxSpread} (${((1 - CONFIG.arbitrage.maxSpread) * 100).toFixed(1)}% min profit)`);
    console.log('');
    
    // For live trading, would initialize wallet and CLOB client here
    if (!CONFIG.paperTrading) {
      // TODO: Load private key and initialize CLOB client
      console.log('⚠️  Live trading requires wallet setup');
    }
    
    this.stats.startTime = new Date();
    return true;
  }
  
  async getCurrentMarket() {
    try {
      // Get the series with all events
      const response = await fetch(`${CONFIG.api.gamma}/series/${CONFIG.market.seriesId}`);
      const series = await response.json();
      
      // Find active (unclosed) markets with future end dates
      const now = new Date();
      const activeMarkets = series.events.filter(e => 
        !e.closed && new Date(e.endDate) > now
      );
      
      if (activeMarkets.length === 0) {
        return null;
      }
      
      // Get the soonest to resolve (current 15m window)
      activeMarkets.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
      const currentEvent = activeMarkets[0];
      
      // Get market data by slug for accurate prices
      const marketsResponse = await fetch(`${CONFIG.api.gamma}/markets?slug=${currentEvent.slug}`);
      const markets = await marketsResponse.json();
      
      if (markets.length === 0) {
        return null;
      }
      
      const market = markets[0];
      
      // Parse prices and tokens
      const prices = JSON.parse(market.outcomePrices || '["0.5", "0.5"]');
      const tokens = JSON.parse(market.clobTokenIds || '[]');
      
      return {
        id: currentEvent.id,
        title: currentEvent.title,
        slug: currentEvent.slug,
        endDate: new Date(currentEvent.endDate),
        startTime: new Date(currentEvent.startTime || currentEvent.startDate),
        upPrice: parseFloat(prices[0]),
        downPrice: parseFloat(prices[1]),
        upTokenId: tokens[0],
        downTokenId: tokens[1],
        liquidity: parseFloat(market.liquidity || 0),
      };
    } catch (error) {
      console.error('Error fetching market:', error.message);
      return null;
    }
  }
  
  analyzeArbitrage(market) {
    if (!market) return null;
    
    const totalCost = market.upPrice + market.downPrice;
    const profit = 1 - totalCost;
    const profitPercent = (profit / totalCost) * 100;
    
    const timeToResolution = market.endDate - new Date();
    const minutesToResolution = timeToResolution / 60000;
    
    return {
      market,
      totalCost,
      profit,
      profitPercent,
      minutesToResolution,
      isArbitrage: totalCost <= CONFIG.arbitrage.maxSpread,
      hasEnoughTime: timeToResolution > CONFIG.timing.minTimeToResolution,
      hasLiquidity: market.liquidity >= CONFIG.arbitrage.minLiquidity,
    };
  }
  
  async executeArbitrage(analysis) {
    const { market, totalCost, profitPercent } = analysis;
    
    console.log('\n🎯 ARBITRAGE OPPORTUNITY DETECTED!');
    console.log(`   Market: ${market.title}`);
    console.log(`   UP: $${market.upPrice.toFixed(4)} | DOWN: $${market.downPrice.toFixed(4)}`);
    console.log(`   Total: $${totalCost.toFixed(4)} | Profit: ${profitPercent.toFixed(2)}%`);
    console.log(`   Time left: ${analysis.minutesToResolution.toFixed(1)} minutes`);
    
    if (CONFIG.paperTrading) {
      // Simulate trade
      const positionSize = Math.min(CONFIG.arbitrage.maxPositionUsd, 20); // Start small
      const shares = positionSize / totalCost;
      const expectedPayout = shares; // $1 per share pair
      const expectedProfit = expectedPayout - positionSize;
      
      console.log(`\n   📝 PAPER TRADE:`);
      console.log(`   Buy ${shares.toFixed(2)} UP @ $${market.upPrice.toFixed(4)} = $${(shares * market.upPrice).toFixed(2)}`);
      console.log(`   Buy ${shares.toFixed(2)} DOWN @ $${market.downPrice.toFixed(4)} = $${(shares * market.downPrice).toFixed(2)}`);
      console.log(`   Total cost: $${positionSize.toFixed(2)}`);
      console.log(`   Expected payout: $${expectedPayout.toFixed(2)}`);
      console.log(`   Expected profit: $${expectedProfit.toFixed(2)} (${profitPercent.toFixed(2)}%)`);
      
      this.stats.trades++;
      this.stats.profit += expectedProfit;
      
      return { success: true, profit: expectedProfit };
    } else {
      // LIVE TRADING - TODO
      console.log('   ⚠️  Live trading not yet implemented');
      return { success: false, reason: 'Live trading disabled' };
    }
  }
  
  printStatus() {
    const runtime = (new Date() - this.stats.startTime) / 1000 / 60; // minutes
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 BOT STATUS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Runtime:       ${runtime.toFixed(1)} minutes`);
    console.log(`Scans:         ${this.stats.scans}`);
    console.log(`Opportunities: ${this.stats.opportunities}`);
    console.log(`Trades:        ${this.stats.trades}`);
    console.log(`Total Profit:  $${this.stats.profit.toFixed(2)}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }
  
  async scan() {
    this.stats.scans++;
    
    // Get current market
    const market = await this.getCurrentMarket();
    
    if (!market) {
      console.log(`[${new Date().toLocaleTimeString()}] No active BTC 15m market found`);
      return;
    }
    
    // Analyze for arbitrage
    const analysis = this.analyzeArbitrage(market);
    
    const totalCost = analysis.totalCost.toFixed(4);
    const spread = ((1 - analysis.totalCost) * 100).toFixed(2);
    const timeLeft = analysis.minutesToResolution.toFixed(1);
    
    // Log current state
    console.log(`[${new Date().toLocaleTimeString()}] UP: $${market.upPrice.toFixed(3)} + DOWN: $${market.downPrice.toFixed(3)} = $${totalCost} (${spread}% spread) | ${timeLeft}m left`);
    
    // Check if arbitrage opportunity
    if (analysis.isArbitrage) {
      this.stats.opportunities++;
      
      if (!analysis.hasEnoughTime) {
        console.log(`   ⏰ Skipping: Only ${timeLeft} minutes left (need ${CONFIG.timing.minTimeToResolution / 60000}+)`);
        return;
      }
      
      if (!analysis.hasLiquidity) {
        console.log(`   💧 Skipping: Low liquidity ($${market.liquidity})`);
        return;
      }
      
      // Execute!
      await this.executeArbitrage(analysis);
    }
  }
  
  async run(maxScans = 100) {
    await this.initialize();
    
    console.log(`\n🔍 Starting scan loop (max ${maxScans} scans)...\n`);
    this.isRunning = true;
    
    for (let i = 0; i < maxScans && this.isRunning; i++) {
      await this.scan();
      
      // Print status every 10 scans
      if ((i + 1) % 10 === 0) {
        this.printStatus();
      }
      
      // Wait before next scan
      await new Promise(r => setTimeout(r, CONFIG.timing.pollIntervalMs));
    }
    
    this.printStatus();
    console.log('✅ Bot stopped');
  }
  
  stop() {
    this.isRunning = false;
  }
}

// Run if called directly
if (require.main === module) {
  const bot = new BTC15mArbitrageBot();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n\n⏹️  Stopping bot...');
    bot.stop();
  });
  
  bot.run(50).catch(console.error);
}

module.exports = BTC15mArbitrageBot;
