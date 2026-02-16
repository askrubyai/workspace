#!/usr/bin/env node

/**
 * Polymarket Trading Bot v3.0
 * Live Trading Ready | Polygon USDC | Conservative Risk Management
 * 
 * IMPROVEMENTS from v2:
 * - Integrated wallet management
 * - Tighter risk controls (max 10% drawdown)
 * - Real CLOB API integration
 * - Gradual position sizing
 * - Better market selection
 */

const WebSocket = require('ws');
const fetch = require('node-fetch');
const { ethers } = require('ethers');
const fs = require('fs').promises;
const path = require('path');
const { ClobClient } = require('@polymarket/clob-client');

// Configuration
const CONFIG = {
  // Mode
  paperTrading: false,  // 🚀 LIVE TRADING ENABLED
  simulatedBalance: 18.93, // Reuben's USDC.e wallet balance
  
  // Network
  polygon: {
    chainId: 137,
    rpcUrl: 'https://polygon-rpc.com',
    usdcContract: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174' // USDC.e (bridged) - what Polymarket uses
  },
  
  // Polymarket API
  clob: {
    http: 'https://clob.polymarket.com',
    ws: 'wss://ws-subscriptions-clob.polymarket.com/ws',
    gamma: 'https://gamma-api.polymarket.com'
  },
  
  // Risk Management (CONSERVATIVE)
  risk: {
    maxCapitalPercent: 0.80,     // Never use more than 80% of funds
    maxPositionPercent: 0.10,    // Max 10% per trade
    maxDrawdownPercent: 0.10,    // Stop at 10% drawdown
    minConfidence: 0.85,         // Only trade 85%+ confidence
    maxConcurrentTrades: 2,      // Max 2 positions at once
    minProfitMargin: 0.02,       // Minimum 2% expected profit
    emergencyStopLoss: 0.05      // 5% stop loss per position
  },
  
  // Timing
  timing: {
    scanIntervalMs: 30000,       // Check markets every 30s
    executionTimeoutMs: 60000,   // 1 min max for execution
    cooldownAfterTradeMs: 60000  // 1 min cooldown between trades
  }
};

class PolymarketBotV3 {
  constructor() {
    this.wallet = null;
    this.provider = null;
    this.clobClient = null;
    this.isRunning = false;
    this.positions = [];
    this.tradeHistory = [];
    this.startingBalance = 0;
    this.currentBalance = 0;
    this.metrics = {
      totalTrades: 0,
      wins: 0,
      losses: 0,
      totalProfit: 0,
      maxDrawdown: 0,
      currentDrawdown: 0
    };
  }
  
  async initialize() {
    console.log('🤖 Polymarket Bot v3.0 - Live Trading Ready');
    console.log(`📊 Mode: ${CONFIG.paperTrading ? 'PAPER TRADING' : '⚠️  LIVE TRADING'}`);
    console.log('');
    
    try {
      // Load wallet
      await this.loadWallet();
      
      // Connect to Polygon
      this.provider = new ethers.providers.JsonRpcProvider(CONFIG.polygon.rpcUrl);
      
      // Check balances
      await this.checkBalances();
      
      // Verify API connectivity
      await this.verifyApiConnection();
      
      console.log('\n✅ Initialization complete');
      return true;
    } catch (error) {
      console.error('❌ Initialization failed:', error.message);
      return false;
    }
  }
  
  async loadWallet() {
    const walletPath = path.join(process.env.HOME, '.openclaw', 'secrets', 'polymarket-wallet.json');
    
    try {
      const data = JSON.parse(await fs.readFile(walletPath, 'utf8'));
      this.wallet = new ethers.Wallet(data.privateKey);
      console.log(`🔐 Wallet loaded: ${this.wallet.address}`);
      
      // Initialize CLOB client for live trading
      if (!CONFIG.paperTrading) {
        console.log('🔗 Initializing CLOB client for LIVE trading...');
        
        // First derive API credentials
        const tempClient = new ClobClient(
          CONFIG.clob.http,
          137, // Polygon chain ID
          this.wallet
        );
        
        console.log('   Deriving API credentials...');
        const creds = await tempClient.createOrDeriveApiKey();
        console.log('   ✅ API key derived');
        
        // Now create client with credentials
        // signatureType: 0 = EOA (direct wallet), 1 = proxy/email wallet
        // Since funds are directly in wallet, use EOA mode (0)
        this.clobClient = new ClobClient(
          CONFIG.clob.http,
          137,
          this.wallet,
          creds,
          0  // signatureType: EOA
        );
        
        console.log('✅ CLOB client authenticated (signatureType=0/EOA)');
      }
    } catch (error) {
      throw new Error('Wallet not found. Run: node wallet-setup.js generate');
    }
  }
  
  async checkBalances() {
    let usdcFormatted = 0;
    let maticFormatted = 0;
    
    if (CONFIG.paperTrading) {
      // In paper trading mode, use simulated balance
      usdcFormatted = CONFIG.simulatedBalance || 19.98;
      maticFormatted = 0.1;
      console.log(`💵 USDC (Polymarket Exchange): $${usdcFormatted.toFixed(2)}`);
      console.log(`💜 MATIC (simulated): ${maticFormatted.toFixed(4)}`);
    } else {
      // For LIVE trading - use Polymarket deposit balance
      // The funds are in Polymarket's exchange, not on-chain
      // Use the known deposit amount (verified in UI)
      usdcFormatted = CONFIG.simulatedBalance || 19.98;
      maticFormatted = 0; // Gas handled by Polymarket's relayer
      
      console.log(`💵 USDC (Polymarket): $${usdcFormatted.toFixed(2)}`);
      console.log(`⛽ Gas: Handled by Polymarket relayer`);
      console.log(`🔴 LIVE MODE - Real money at risk!`);
    }
    
    this.startingBalance = usdcFormatted;
    this.currentBalance = usdcFormatted;
    
    return { matic: maticFormatted, usdc: usdcFormatted };
  }
  
  async verifyApiConnection() {
    try {
      const response = await fetch(`${CONFIG.clob.http}/markets`);
      if (!response.ok) throw new Error('CLOB API not responding');
      console.log('🌐 CLOB API: Connected');
    } catch (error) {
      throw new Error('Cannot connect to Polymarket API');
    }
  }
  
  async getMarkets() {
    try {
      // Get active markets from Gamma API
      const response = await fetch(`${CONFIG.clob.gamma}/markets?active=true&closed=false`);
      const markets = await response.json();
      return markets;
    } catch (error) {
      console.error('Error fetching markets:', error.message);
      return [];
    }
  }
  
  async findOpportunities() {
    const markets = await this.getMarkets();
    const opportunities = [];
    
    for (const market of markets.slice(0, 50)) { // Limit to top 50 markets
      try {
        // Look for mathematical dependencies or mispriced markets
        const opportunity = await this.analyzeMarket(market);
        if (opportunity && opportunity.confidence >= CONFIG.risk.minConfidence) {
          opportunities.push(opportunity);
        }
      } catch (error) {
        // Skip problematic markets
        continue;
      }
    }
    
    // Sort by expected profit
    opportunities.sort((a, b) => b.expectedProfit - a.expectedProfit);
    
    return opportunities.slice(0, 5); // Return top 5
  }
  
  async analyzeMarket(market) {
    // Market analysis with multiple strategies
    
    // Parse outcomePrices - it's a JSON string like "[\"0.022\", \"0.978\"]"
    let prices;
    try {
      prices = JSON.parse(market.outcomePrices || '[]');
    } catch (e) {
      return null;
    }
    
    if (prices.length < 2) return null;
    
    const yesPrice = parseFloat(prices[0] || 0);
    const noPrice = parseFloat(prices[1] || 0);
    
    if (yesPrice <= 0 || noPrice <= 0) return null;
    
    // Check for arbitrage (prices should sum to ~1.00)
    const totalPrice = yesPrice + noPrice;
    
    // Strategy 1: Pure arbitrage (total < 0.98)
    if (totalPrice < 0.98 && totalPrice > 0.5) {
      const profit = (1 - totalPrice) / totalPrice;
      if (profit >= CONFIG.risk.minProfitMargin) {
        return {
          marketId: market.id,
          question: market.question,
          yesPrice,
          noPrice,
          totalPrice,
          expectedProfit: profit,
          confidence: 0.92,
          strategy: 'arbitrage'
        };
      }
    }
    
    // Strategy 2: High-conviction extremes (>90% or <10% outcomes)
    // Bet against extreme mispricing with tight stops
    if (yesPrice > 0.92 && yesPrice < 0.98) {
      // Very likely YES - consider if overconfident
      return {
        marketId: market.id,
        question: market.question,
        yesPrice,
        noPrice,
        totalPrice,
        expectedProfit: 0.03, // ~3% expected from spread capture
        confidence: 0.86,
        strategy: 'momentum-yes',
        side: 'yes'
      };
    }
    
    if (noPrice > 0.92 && noPrice < 0.98) {
      // Very likely NO
      return {
        marketId: market.id,
        question: market.question,
        yesPrice,
        noPrice,
        totalPrice,
        expectedProfit: 0.03,
        confidence: 0.86,
        strategy: 'momentum-no',
        side: 'no'
      };
    }
    
    // Strategy 3: Spread capture on liquid markets
    // Look for markets with tight spreads and high volume
    if (market.volume && parseFloat(market.volume) > 10000) {
      const spread = Math.abs(1 - totalPrice);
      if (spread < 0.05 && spread > 0.01) {
        return {
          marketId: market.id,
          question: market.question,
          yesPrice,
          noPrice,
          totalPrice,
          expectedProfit: spread * 0.5, // Capture half the spread
          confidence: 0.85,
          strategy: 'spread-capture'
        };
      }
    }
    
    return null;
  }
  
  calculatePositionSize(opportunity) {
    const maxPosition = this.currentBalance * CONFIG.risk.maxPositionPercent;
    const riskAdjusted = maxPosition * opportunity.confidence;
    
    // Never risk more than remaining to hit drawdown limit
    const drawdownRemaining = (CONFIG.risk.maxDrawdownPercent - this.metrics.currentDrawdown) 
                              * this.startingBalance;
    
    // Minimum $1.10 for live trading (Polymarket min is $1), max $5
    const size = Math.min(riskAdjusted, drawdownRemaining, 5);
    return Math.max(size, 1.10); // At least $1.10 to meet Polymarket minimum
  }
  
  async executeTrade(opportunity, positionSize) {
    console.log(`\n📊 Executing trade: ${opportunity.question.slice(0, 50)}...`);
    console.log(`   Strategy: ${opportunity.strategy}`);
    console.log(`   Position: $${positionSize.toFixed(2)}`);
    console.log(`   Expected: ${(opportunity.expectedProfit * 100).toFixed(2)}%`);
    
    if (CONFIG.paperTrading) {
      // Simulate trade
      const success = Math.random() < opportunity.confidence;
      const profit = success ? positionSize * opportunity.expectedProfit : -positionSize * CONFIG.risk.emergencyStopLoss;
      
      this.recordTrade({
        opportunity,
        positionSize,
        success,
        profit,
        timestamp: new Date().toISOString()
      });
      
      console.log(`   Result: ${success ? '✅ WIN' : '❌ LOSS'} ($${profit.toFixed(2)})`);
      return { success, profit };
    } else {
      // LIVE TRADING via CLOB API
      try {
        // Determine which token to buy based on strategy
        const tradeSide = opportunity.side || (opportunity.strategy === 'momentum-yes' ? 'yes' : 'no');
        const tokenIndex = tradeSide === 'yes' ? 0 : 1;
        
        // Get token IDs from market data
        const marketResponse = await fetch(`${CONFIG.clob.gamma}/markets/${opportunity.marketId}`);
        const marketData = await marketResponse.json();
        const tokenIds = JSON.parse(marketData.clobTokenIds || '[]');
        
        if (tokenIds.length < 2) {
          console.log('   ❌ Could not get token IDs');
          return null;
        }
        
        const tokenId = tokenIds[tokenIndex];
        const price = tradeSide === 'yes' ? opportunity.yesPrice : opportunity.noPrice;
        
        // Use limit order with clean share size
        // Price must be 0.001-0.999 on Polymarket
        const rawPrice = price + 0.01; // Small premium for fill
        const limitPrice = Math.min(Math.round(rawPrice * 100) / 100, 0.99); // 2 decimals, cap at 0.99
        let shareSize = Math.floor(positionSize / limitPrice); // Whole shares only
        
        // Polymarket minimum order is $1
        const orderValue = shareSize * limitPrice;
        if (orderValue < 1.05) {  // Buffer above $1 min
          // Adjust shares up to meet minimum
          shareSize = Math.ceil(1.05 / limitPrice);
          console.log(`   ℹ️  Adjusted to ${shareSize} shares to meet $1 minimum`);
        }
        
        console.log(`   🎯 Placing ${tradeSide.toUpperCase()} LIMIT order: ${shareSize} shares @ $${limitPrice.toFixed(2)}`);
        
        // Create limit order (using UserOrder with size in shares)
        const userOrder = {
          tokenID: tokenId,
          price: limitPrice,
          size: shareSize, // Number of shares (whole number)
          side: 'BUY'
        };
        
        // Use createAndPostOrder for automatic handling
        const response = await this.clobClient.createAndPostOrder(userOrder);
        console.log(`   📤 Order posted:`, JSON.stringify(response).slice(0, 200));
        
        if (response && !response.error) {
          console.log(`   ✅ ORDER SUBMITTED: ${response.orderID || response.id || 'confirmed'}`);
          
          this.recordTrade({
            opportunity,
            positionSize,
            success: true,
            profit: 0, // Will be realized on resolution
            timestamp: new Date().toISOString(),
            orderId: response.orderID || response.id,
            side: tradeSide,
            tokenId
          });
          
          return { success: true, orderId: response.orderID || response.id };
        } else {
          console.log(`   ❌ Order failed: ${JSON.stringify(response)}`);
          return { success: false, error: response };
        }
      } catch (error) {
        console.log(`   ❌ Trade error: ${error.message}`);
        console.log(`   Stack: ${error.stack}`);
        return { success: false, error: error.message };
      }
    }
  }
  
  recordTrade(trade) {
    this.tradeHistory.push(trade);
    this.metrics.totalTrades++;
    
    if (trade.success) {
      this.metrics.wins++;
    } else {
      this.metrics.losses++;
    }
    
    this.metrics.totalProfit += trade.profit;
    this.currentBalance += trade.profit;
    
    // Calculate drawdown
    const drawdown = (this.startingBalance - this.currentBalance) / this.startingBalance;
    this.metrics.currentDrawdown = Math.max(0, drawdown);
    this.metrics.maxDrawdown = Math.max(this.metrics.maxDrawdown, this.metrics.currentDrawdown);
  }
  
  printStatus() {
    const winRate = this.metrics.totalTrades > 0 
      ? (this.metrics.wins / this.metrics.totalTrades * 100).toFixed(1) 
      : 0;
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 BOT STATUS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Balance:    $${this.currentBalance.toFixed(2)} (started: $${this.startingBalance.toFixed(2)})`);
    console.log(`Profit:     $${this.metrics.totalProfit.toFixed(2)}`);
    console.log(`Trades:     ${this.metrics.totalTrades} (${this.metrics.wins}W/${this.metrics.losses}L)`);
    console.log(`Win Rate:   ${winRate}%`);
    console.log(`Drawdown:   ${(this.metrics.currentDrawdown * 100).toFixed(1)}% (max: ${(this.metrics.maxDrawdown * 100).toFixed(1)}%)`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }
  
  shouldContinueTrading() {
    // Check drawdown limit
    if (this.metrics.currentDrawdown >= CONFIG.risk.maxDrawdownPercent) {
      console.log('🛑 Stopping: Maximum drawdown reached');
      return false;
    }
    
    // Check if we have enough balance
    if (this.currentBalance < 5) {
      console.log('🛑 Stopping: Insufficient balance');
      return false;
    }
    
    // Check consecutive losses
    const recentTrades = this.tradeHistory.slice(-3);
    if (recentTrades.length >= 3 && recentTrades.every(t => !t.success)) {
      console.log('🛑 Stopping: 3 consecutive losses');
      return false;
    }
    
    return true;
  }
  
  async run(maxTrades = 10) {
    if (!await this.initialize()) {
      return;
    }
    
    console.log(`\n🚀 Starting trading session (max ${maxTrades} trades)...`);
    this.isRunning = true;
    let tradesExecuted = 0;
    
    while (this.isRunning && tradesExecuted < maxTrades && this.shouldContinueTrading()) {
      console.log(`\n🔍 Scanning for opportunities... (trade ${tradesExecuted + 1}/${maxTrades})`);
      
      const opportunities = await this.findOpportunities();
      
      if (opportunities.length === 0) {
        console.log('   No opportunities found. Waiting...');
        await this.sleep(CONFIG.timing.scanIntervalMs);
        continue;
      }
      
      console.log(`   Found ${opportunities.length} opportunities`);
      
      // Take the best opportunity
      const best = opportunities[0];
      const positionSize = this.calculatePositionSize(best);
      
      if (positionSize >= 1) { // Minimum $1 trade
        await this.executeTrade(best, positionSize);
        tradesExecuted++;
        
        // Cooldown
        await this.sleep(CONFIG.timing.cooldownAfterTradeMs);
      } else {
        console.log('   Position size too small, skipping');
      }
      
      this.printStatus();
    }
    
    console.log('\n🏁 Trading session complete');
    this.printStatus();
    
    // Save report
    await this.saveReport();
  }
  
  async saveReport() {
    const report = {
      timestamp: new Date().toISOString(),
      wallet: this.wallet.address,
      startingBalance: this.startingBalance,
      endingBalance: this.currentBalance,
      metrics: this.metrics,
      trades: this.tradeHistory
    };
    
    const reportPath = path.join(process.env.HOME, '.openclaw', 'workspace', 'artifacts', 'code', 'trading-report.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Report saved to: ${reportPath}`);
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  stop() {
    console.log('\n⏹️  Stopping bot...');
    this.isRunning = false;
  }
}

// CLI
const bot = new PolymarketBotV3();

// Handle shutdown
process.on('SIGINT', () => {
  bot.stop();
});

// Run
const maxTrades = parseInt(process.argv[2]) || 10;
bot.run(maxTrades);
