# Polymarket Arbitrage Bot Trading Strategies: Deep Research Analysis

*Research Date: February 6, 2026*
*Focus: Maker-Only Strategies for 3% Taker Fee Environment*

## Executive Summary

This research analyzes proven Polymarket arbitrage strategies, focusing on approaches that work in the current 3% taker fee environment. The key finding: **successful traders have pivoted to maker-only strategies, cross-platform arbitrage, and structural inefficiency exploitation** rather than pure speed-based arbitrage.

**Key Success Factors:**
- Maker-only positioning to earn rebates instead of paying 3% fees
- Cross-platform arbitrage between Polymarket, Kalshi, and traditional markets
- Structural arbitrage (sum-to-one, spread farming, systematic biases)
- Low-latency infrastructure for competitive advantage
- Disciplined risk management and capital allocation

---

## 1. Quant Research Methods for Prediction Market Arbitrage

### 1.1 Statistical Arbitrage Foundations

**Core Methodology:**
- **Cointegration testing** between related markets (crypto spot vs futures principles applied to prediction markets)
- **Mean reversion analysis** for price convergence opportunities
- **Quantile regression** for probability distribution modeling
- **Granger causality tests** for lead-lag relationships between platforms

**Prediction Market Specific Approaches:**
- **Systematic bias exploitation** - Research shows ~70% of prediction markets resolve "NO"
- **Longshot bias** - Traders consistently overpay for low-probability events
- **Inter-market arbitrage** - Price differences between platforms for identical events
- **Intra-market arbitrage** - Sum-to-one violations within single markets

### 1.2 Professional Quant Framework

**Data Mining Techniques:**
- Real-time orderbook analysis via WebSocket feeds
- Historical resolution patterns and seasonal biases
- Volatility clustering in crypto prediction markets
- Liquidity provision optimization models

**Execution Strategy:**
- **Market-neutral positioning** - Delta hedged across multiple outcomes
- **Inventory management** - Automated rebalancing to maintain exposure limits
- **Queue optimization** - Intelligent order placement for maker fill probability

---

## 2. GitHub Repository Analysis

### 2.1 Market Maker Bots (Production-Grade)

**lorine93s/polymarket-market-maker-bot**
- **Strategy:** Pure market making with spread farming
- **Technical Stack:** Python, FastAPI, WebSocket feeds
- **Key Features:**
  - Inventory balance management (YES/NO mirrored positions)
  - 500ms taker delay optimization
  - Prometheus metrics and risk controls
  - Auto-redeem for settled markets
- **Capital Requirements:** $10k+ for effective spread capture
- **Edge:** Earns maker rebates while providing liquidity

### 2.2 Cross-Platform Arbitrage

**CarlosIbCu/polymarket-kalshi-btc-arbitrage-bot**
- **Strategy:** Risk-free arbitrage between Polymarket and Kalshi
- **Mechanism:** Buy opposing positions when combined cost < $1.00
- **Technology:** Python backend + Next.js dashboard
- **Typical Returns:** 1-3% per trade with guaranteed profit
- **Minimum Capital:** $100-500 per trade

### 2.3 Specialized Strategies

**Multiple repos focusing on:**
- **15-minute BTC markets** (gabagool222/15min-btc-polymarket-trading-bot)
- **Mempool monitoring** (dexorynlabs/polymarket-arbitrage-tradingbot)
- **Copy trading successful bots** (dappboris-dev/polymarket-trading-bot)

---

## 3. X/Twitter Strategy Breakdowns

### 3.1 Account88888 Analysis (The Jane Street Bot)

**Strategy Revealed:**
- **97% delta-neutral positioning** - Holds both UP and DOWN simultaneously
- **Targets 15-minute crypto markets** during high volatility
- **Entry criteria:** Wait for one side to drop below 35¢
- **Position sizing:** Adds more as price gets cheaper (dollar-cost averaging)
- **Exit:** Ensures average cost < 99¢ for guaranteed profit

**Performance:**
- 8,610 trades with 97% win rate
- $387K profit betting both sides of BTC
- Never cares about direction - owns both outcomes

**Key Insight:** *"When BTC goes sideways, both outcomes drift toward 50/50. Spreads widen. He loads up. Sits for a few minutes. Market closes. Collects."*

### 3.2 Lorden's Bot Analysis

**Strategy Components:**
- **Pure arbitrage play** on BTC Up/Down 15-minute markets
- **Mechanical execution:** Same strategy every time
- **Entry trigger:** Wait for YES or NO below 35¢
- **Risk management:** Average cost must stay under 99¢

### 3.3 Speed vs Strategy Insights

**From Mr. Buzzoni (@polydao):**
- "Execution is brutal" - speed wars dominate
- "Often manages to buy YES, but NO leg fails"
- Edge exists in theory, practice requires nano-second precision
- Many bots fail on execution despite finding opportunities

---

## 4. Forums & Blogs: Detailed Strategy Analysis

### 4.1 Seven Core Arbitrage Strategies (Dexoryn Analysis)

**1. Liquidity Absorption Flip**
- Target: Bot-dominated markets
- Method: Accumulate at low prices, let bots lift average
- Timing: Price push seconds before resolution
- Edge: Structure and capital over speed

**2. Spread Farming**
- Method: Buy bid, sell ask thousands of times daily
- Requirements: High-frequency execution
- Often hedged across platforms (direction-agnostic)

**3. Structural Spread Lock**
- Method: Buy both sides when pricing breaks
- Requirement: Disciplined timing
- Profit: Guaranteed at settlement (one side pays $1)

**4. Systematic NO Farming**
- Statistical edge: ~70% of markets resolve NO
- Method: Consistently bet against hype
- Advantage: Exploit crowd overreaction

**5. Long-Shot Floor Buying**
- Method: Tiny bets ($0.01) on extremely low probability events
- Risk: Minimal downside
- Upside: Asymmetric returns on rare wins

**6. High-Probability Auto-Compounding**
- Target: $0.90-$0.99 probability contracts
- Method: Thousands of micro-trades
- Best markets: Short-duration crypto markets

**7. Orderbook Parity Arbitrage**
- Method: Buy both sides when YES + NO < $1.00
- Post-fees adaptation: Filter for explosive price movements

### 4.2 Jeremy Whittaker's Arbitrage Results

**Proven Strategies with Live Results:**

**Strategy 1: Harris/GOP Electoral Arbitrage**
- Method: Buy Harris + all GOP electoral margins
- Average cost: 98.3¢ (1.7% guaranteed return)
- Duration: 41 days (41% annualized)

**Strategy 2: Trump/Dem Popular Vote Hedge**
- Method: Trump win + Dem popular vote/presidency
- Arbitrage: 2.55% guaranteed profit
- Risk: Minimal (Dem presidency without popular vote unlikely)

**Strategy 3: Popular Vote NO Farming**
- Method: Buy "NO" on all popular vote outcomes
- Arbitrage: 6.65% opportunity
- Logic: Only one outcome wins, all others lose

---

## 5. Key Insights for 3% Taker Fee Environment

### 5.1 Fee Structure Analysis

**Current Polymarket Fees:**
- **Taker fees:** Up to 3.15% (highest at 50% probability)
- **Maker rebates:** Funded by taker fees, distributed daily in USDC
- **Fee curve:** Decreases toward 0% and 100% probabilities
- **Target:** Short-duration crypto markets (15-minute windows)

**Strategic Implications:**
- Pure taker strategies are no longer profitable
- Maker-only approaches now dominate
- 2.5-3% minimum spread required for profitability
- Latency arbitrage severely curtailed

### 5.2 Winning Adaptations

**1. Maker-Only Positioning**
- Place limit orders that provide liquidity
- Earn rebates instead of paying fees
- Requires sophisticated queue management

**2. Cross-Platform Arbitrage**
- Polymarket ↔ Kalshi price differences
- Escape fee environment through external hedging
- Maintain spread requirements of 2.5-3%

**3. Structural Arbitrage Focus**
- Sum-to-one violations
- Multi-outcome market inefficiencies
- Time decay arbitrage near expiration

---

## 6. Technical Implementation Details

### 6.1 Infrastructure Requirements

**Low-Latency Setup:**
- Co-location near Polygon/Polymarket servers
- WebSocket feeds for real-time data
- Sub-millisecond order execution
- Private RPC endpoints for faster transactions

**Technology Stack:**
- **Backend:** Python/Rust for speed
- **APIs:** Polymarket CLOB client, Kalshi API
- **Monitoring:** Prometheus metrics, structured logging
- **Execution:** Batch operations for gas optimization

### 6.2 Risk Management Framework

**Position Limits:**
- Maximum exposure per market
- Total portfolio exposure caps
- Inventory skew monitoring
- Stop-loss mechanisms

**Operational Controls:**
- Pre-trade validation
- Circuit breakers for anomalous conditions
- Automatic position redemption
- Gas cost monitoring and optimization

---

## 7. What Separates Winners from Losers

### 7.1 Winner Characteristics

**Technical Excellence:**
- Sub-second execution infrastructure
- Sophisticated inventory management
- Real-time risk monitoring
- Automated rebalancing

**Strategic Discipline:**
- Focus on structural edges over prediction
- Strict adherence to maker-only execution
- Diversified strategy portfolio
- Continuous strategy adaptation

**Operational Efficiency:**
- 24/7 monitoring and execution
- Robust error handling and recovery
- Comprehensive logging and analysis
- Gas-optimized transaction batching

### 7.2 Common Failure Modes

**Technical Failures:**
- Insufficient latency optimization
- Poor error handling leading to stuck positions
- Inadequate risk controls
- High gas costs eroding profits

**Strategic Errors:**
- Relying on outdated taker strategies
- Insufficient capital for effective market making
- Over-leveraging single strategies
- Ignoring fee structure changes

**Operational Issues:**
- Intermittent monitoring leading to missed opportunities
- Poor position tracking and reconciliation
- Inadequate backup systems
- Manual intervention errors

---

## 8. Specific Tactics for $6-100 Starting Capital

### 8.1 Micro-Capital Strategies

**Long-Shot Floor Buying ($6-20)**
- Minimum bet sizes on extreme long-shots
- Target: Events with <1% probability trading at >$0.05
- Method: $0.01-0.10 bets across hundreds of markets
- Edge: Asymmetric upside on rare correct predictions

**Cross-Platform Micro-Arbitrage ($20-50)**
- Small arbitrage opportunities between platforms
- Target: 1-2% spreads on $10-25 positions
- Compound profits into larger opportunities
- Focus on high-volume, liquid markets

**Copy Trading Successful Bots ($50-100)**
- Mirror positions of proven profitable traders
- Use automated copying tools
- Start with small position sizes
- Scale up based on performance

### 8.2 Capital Growth Strategies

**Systematic Compounding:**
- Reinvest all profits into larger positions
- Maintain strict risk limits (max 20% per trade)
- Focus on high-probability, low-edge opportunities
- Target 5-10% monthly returns

**Market Maker Progression:**
- Start with small maker orders in liquid markets
- Build up rebate income gradually
- Increase position sizes as capital grows
- Transition to sophisticated inventory management

### 8.3 Risk Management for Small Capital

**Position Sizing:**
- Never risk more than 5% on single trade
- Diversify across multiple strategies
- Maintain emergency reserve (20% of capital)

**Strategy Selection:**
- Focus on highest probability opportunities
- Avoid high-fee taker strategies
- Prioritize structural arbitrage over speculation

---

## 9. Risk Management Approaches

### 9.1 Portfolio-Level Risk Controls

**Exposure Limits:**
- Maximum net exposure per market: 10% of capital
- Total prediction market exposure: 80% of capital
- Cash reserve requirement: 20% minimum

**Correlation Management:**
- Avoid correlated positions across similar events
- Diversify across event types and time horizons
- Monitor macro risk factors (crypto volatility, political events)

### 9.2 Operational Risk Management

**Technical Risks:**
- Redundant internet connections
- Backup execution systems
- Real-time monitoring and alerting
- Automated circuit breakers

**Liquidity Risk:**
- Minimum market size requirements
- Liquidity monitoring before position entry
- Graduated exit strategies for large positions

**Counterparty Risk:**
- Platform diversification (multiple exchanges)
- Regular fund withdrawals
- Monitor platform health and solvency

---

## 10. Current Market Opportunities (February 2026)

### 10.1 Immediate Opportunities

**15-Minute Crypto Markets:**
- High volatility creates regular arbitrage opportunities
- 3% fee environment has reduced competition
- Focus on maker-only strategies

**Cross-Platform Political Markets:**
- 2026 midterm elections creating new arbitrage opportunities
- Price differences between Polymarket, Kalshi, and traditional betting
- Long-duration trades with lower fee impact

**Systematic Bias Exploitation:**
- NO farming on overhyped events
- Long-shot buying on extreme probabilities
- Seasonal patterns in specific market types

### 10.2 Emerging Trends

**AI Integration:**
- Machine learning for optimal quote placement
- Sentiment analysis for bias detection
- Automated strategy selection based on market conditions

**DeFi Integration:**
- Yield farming with prediction market positions
- Leveraged arbitrage through lending protocols
- Automated compound strategies

---

## Conclusion

The Polymarket arbitrage landscape has fundamentally shifted with the introduction of 3% taker fees. **Successful strategies now focus on maker-only positioning, cross-platform arbitrage, and structural market inefficiencies** rather than pure speed-based approaches.

**Key Success Factors:**
1. **Technical infrastructure** - Low-latency, robust execution systems
2. **Strategic adaptation** - Pivoting from taker to maker strategies
3. **Risk management** - Sophisticated position and portfolio controls
4. **Operational excellence** - 24/7 monitoring and automated execution

For traders with $6-100 starting capital, the path to profitability requires:
- Starting with long-shot floor buying and micro-arbitrage
- Systematically compounding returns
- Gradually building toward market-making capabilities
- Maintaining strict risk controls throughout growth

The winners in this new environment combine quantitative sophistication with operational discipline, focusing on sustainable edges rather than speculative profits.

---

*This research is based on publicly available information and should not be considered investment advice. Prediction market trading involves significant risks and potential total loss of capital.*

---

## APPENDIX: Real Bot Case Studies (Added 05:00 IST)

### Case Study 1: $313 → $414,000 in One Month
**Source:** Dexter's Lab (X thread, Jan 2026)

**Strategy:** Lag Arbitrage
- Trades BTC, ETH, SOL 15-min markets ONLY
- Position size: $4,000-5,000 per trade
- Win rate: **98%**

**How it works:**
1. Monitor spot prices on Binance/Coinbase
2. When spot confirms direction (e.g., BTC pumps 0.5%)
3. Polymarket still shows 50/50 odds (lag)
4. Actual probability is now ~85%
5. Buy the mispriced certainty
6. Repeat thousands of times

**Key insight:** Not predicting direction, just exploiting the lag between confirmed spot moves and Polymarket price updates.

### Case Study 2: AI Bot - $2.2M in Two Months
**Source:** Igor Mikerin analysis

**Strategy:** Ensemble Probability Models
- Trained on news and social data
- Continuously retrains to stay current
- Targets undervalued contracts vs real-world probabilities

### Case Study 3: Front-Running Bot
**Source:** @0xEthan

**Strategy:** HFT Liquidity Front-Running
- Detects thin liquidity in order book
- Buys contracts just before market-buy orders
- Profits from price push

### Case Study 4: Account88888's $387K Delta-Neutral Strategy
**Source:** Sub-agent research

**Strategy:** Delta-Neutral Both Sides
- 97% of trades are delta-neutral (buys BOTH up AND down)
- Waits for one side to drop below 35¢
- Adds positions as it gets cheaper
- Ensures average cost < 99¢ for guaranteed profit
- **8,610 trades, 97% win rate!**

**Key insight:** Not betting on direction at all - just ensuring combined cost < $1.00

### Systematic NO Farming
- **70% of markets resolve NO**
- Systematically buy NO on overhyped events
- Long-term edge from market psychology

### Human Lessons from Bots:
> "90% of all Polymarket profits will be taken by Python scripts in 2026" - @browomo

✅ Enter ONLY when mispricing exists
✅ Avoid excessive exposure (3-5% max per market)
✅ Systematic approach > emotional trading
❌ Oversized bets will wipe out gains
❌ Late entries = bots already corrected price

---

---

## APPENDIX B: Cross-Platform Arb Technical Guide

### The Opportunity
**Consistent 2-5% spreads** exist between Polymarket and Kalshi on the same events.

**Example (Fed Rates):**
- Kalshi: YES @ 35¢
- Polymarket: NO @ 63¢
- Total cost: 98¢ → Payout: $1.00
- **Guaranteed 2% profit regardless of outcome**

### Key Tool: pmxt Library
Unified API wrapper for prediction markets:
```javascript
import pmxt from 'pmxtjs';

// Initialize
const polymarket = new pmxt.polymarket({ privateKey: config.privateKey });
const kalshi = new pmxt.kalshi({ apiKey: config.apiKey, apiSecret: config.secret });
```

**GitHub:** github.com/qoery-com/pmxt

### Rotation Strategy (Critical!)
❌ Don't hold to maturity (waiting 3 months for 2% = bad)
✅ Exit when spread closes or better opportunity appears

```javascript
// Exit conditions:
// 1. Arb is gone (take profit)
// 2. Better opportunity exists (rotate capital)
```

### Execution Risks
1. **Latency** - Prices move between API calls
2. **Partial fills** - May get stuck on one side
3. **Withdrawal delays** - Fiat takes days on Kalshi

### Resources
- Bot code: github.com/realfishsam/prediction-market-arbitrage-bot
- API wrapper: github.com/qoery-com/pmxt

*Research completed: 2026-02-06 05:15 IST*