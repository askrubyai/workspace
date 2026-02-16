# BTC 15m Polymarket Research Compilation
> Compiled: 2026-02-03 from Twitter threads and GitHub repos

---

## Executive Summary

This research compiles insights from 7 Twitter threads and 1 GitHub repository about trading Polymarket's BTC 15-minute markets. Key findings:

1. **Pure arbitrage** (UP + DOWN < $1) is the safest strategy - guaranteed profit
2. **TA-based prediction** can work but requires sophisticated scoring systems
3. **$40M+ extracted** in one year by quantitative traders using mathematical arbitrage
4. **Speed matters** - fast execution within same block prevents slippage
5. **OpenClaw + Simmer SDK** enables no-code trading bot setup

---

## Source 1: @0xMovez - OpenClaw + Simmer Setup Guide

**URL**: https://x.com/0xMovez/status/2018221915765141989

### Key Points

1. **Spartan Labs Skills for Polymarket Trading**:
   - Weather trading (gopfan2-style via NOAA data)
   - Copytrading (follow whale wallets)
   - Signal Sniper (trade on RSS feeds)
   - Trade Journal (auto-log trades)
   - Arbitrage Scanner (mutually exclusive outcomes < $1)
   - X Sentiment (coming soon)

2. **Weather Trading Strategy** (gopfan2's $2M+ approach):
   - Fetches NOAA forecast data
   - Matches predictions to market buckets (e.g., "34-35°F")
   - Calculates confidence based on forecast certainty
   - Executes trades when confidence exceeds threshold

3. **Setup Steps**:
   ```bash
   # Install OpenClaw
   curl -fsSL https://molt.bot/install.sh | bash
   
   # Run onboarding
   openclaw onboard
   ```
   
4. **Simmer SDK Integration**:
   - Connect wallet at simmer.markets
   - Deposit USDCe (Polygon) + POL
   - Install skills via commands sent to OpenClaw

---

## Source 2: @TheSpartanLabs - Skills Announcement

**URL**: https://x.com/TheSpartanLabs/status/2016713865149763796

### Skills Announced
- Weather Trader
- Copytrading  
- Signal Sniper

> "The cool thing? With the Simmer SDK, you can build your own strategies in chat."

---

## Source 3: @quantscience_ - Algorithmic Trading Strategy (472% Return)

**URL**: https://x.com/quantscience_/status/2018005538387173787

### Flow Effects Strategy
Uses temporal/calendar effects to time entries/exits based on monthly boundaries.

**Key Signals**:
- Short entry: 1st and 5th day of each month
- Long signals: 7 days and 1 day before month end

This isn't BTC 15m specific but demonstrates general algo trading principles.

---

## Source 4: @RohOnChain - The Math Needed for Polymarket Trading ⭐ ESSENTIAL

**URL**: https://x.com/RohOnChain/status/2017314080395296995

### Key Statistics
- **$40 million** extracted in arbitrage profits (April 2024 - April 2025)
- **Top trader**: $2,009,631.76 from 4,049 trades (~$496/trade avg)
- **7,051 conditions** (41% of 17,218) showed single-market arbitrage
- **Median mispricing**: $0.60 per dollar (40% wrong!)

### Mathematical Concepts

#### 1. Marginal Polytope Problem
For n conditions, there are 2^n possible price combinations but only n valid outcomes.
- Arbitrage-free prices must lie in the marginal polytope M
- Anything outside M is exploitable

#### 2. Bregman Projection
Projects current market state onto arbitrage-free manifold while preserving information structure.
- Uses Kullback-Leibler divergence for distance
- Maximum profit = divergence between current prices and projected prices

#### 3. Frank-Wolfe Algorithm
Makes Bregman projection computationally tractable:
- Iteratively builds the polytope
- Uses integer programming oracle (Gurobi)
- 50-150 iterations typically sufficient

### Execution Reality

**Retail execution**: ~2,650ms total latency
**Sophisticated systems**: ~2,040ms (30ms decision + same-block execution)

**Why copytrading fails**:
- Fast wallets submit all positions in 30ms
- By time you see their tx confirmed, arbitrage is gone
- You become exit liquidity, not arbitrageur

### Single Condition Arbitrage Results
```
Buy both < $1:    $5,899,287
Sell both > $1:   $4,682,075
Total:           $10,581,362
```

### Key Insight
> "Arbitrage detection isn't about checking if numbers add up. It's about solving constraint satisfaction problems over exponentially large outcome spaces."

---

## Source 5: @noisyb0y1 - Moltbook Arbitrage Bots

**URL**: https://x.com/noisyb0y1/status/2017556355893129257

### Findings
- AI agents on Moltbook platform built arbitrage bots autonomously
- 147k agents across 12k communities in 72 hours
- Agents sharing API keys and building trading systems

### Referenced Trader
- $580K in one month
- Only 89 trades
- Profile: less than month old
- Master in sports betting

---

## Source 6: @noisyb0y1 - $580K Trader Profile

**URL**: https://x.com/noisyb0y1/status/2017665770319134721

> "take small positions, lock in profit, repeat nonstop"

---

## Source 7: @Shelpid_WI3M - $50 → $248K Setup Guide

**URL**: https://x.com/Shelpid_WI3M/status/2017938351576215802

### Security Setup for VPS
1. SSH keys only (no passwords)
2. Default-deny firewall
3. Brute-force protection (fail2ban)
4. Tailscale VPN mesh
5. SSH only via Tailscale
6. Web ports private
7. Node.js 22+
8. OpenClaw with owner-only access
9. Sandbox mode enabled
10. Command whitelist
11. Scoped API tokens
12. Security audit

### Prompt Injection Warning
> "ClawdBot executed [malicious] instructions and wiped every email. Including the contents of the trash. This wasn't hypothetical. It actually occurred."

**Recommendation**: Use Claude Opus 4.5 (~99% prompt injection resistance)

---

## Source 8: GitHub - PolymarketBTC15mAssistant

**URL**: https://github.com/FrondEnt/PolymarketBTC15mAssistant

### Features
- Real-time BTC price from Chainlink (via Polymarket WS)
- Binance spot price for reference
- Technical Analysis: Heiken Ashi, RSI, MACD, VWAP
- Live prediction (LONG/SHORT %) from TA scoring

### Configuration
```javascript
const CONFIG = {
  symbol: "BTCUSDT",
  candleWindowMinutes: 15,
  vwapSlopeLookbackMinutes: 5,
  rsiPeriod: 14,
  macdFast: 12, macdSlow: 26, macdSignal: 9,
  polymarket: {
    seriesId: "10192",
    seriesSlug: "btc-up-or-down-15m"
  }
};
```

### Scoring System (probability.js)

**Inputs weighted**:
| Factor | Weight | Long Signal | Short Signal |
|--------|--------|-------------|--------------|
| Price vs VWAP | 2 | Price > VWAP | Price < VWAP |
| VWAP Slope | 2 | Positive | Negative |
| RSI + Slope | 2 | RSI > 55 & rising | RSI < 45 & falling |
| MACD Histogram | 2 | Expanding green | Expanding red |
| MACD Line | 1 | Positive | Negative |
| Heiken Ashi | 1 | 2+ green candles | 2+ red candles |
| Failed VWAP Reclaim | 3 | - | Yes (bearish) |

### Edge Calculation (edge.js)

```javascript
function computeEdge({ modelUp, modelDown, marketYes, marketNo }) {
  const marketUp = marketYes / (marketYes + marketNo);
  const edgeUp = modelUp - marketUp;
  const edgeDown = modelDown - marketDown;
  return { edgeUp, edgeDown };
}

function decide({ remainingMinutes, edgeUp, edgeDown, modelUp }) {
  // Phase-based thresholds
  const threshold = remainingMinutes > 10 ? 0.05 : 
                    remainingMinutes > 5  ? 0.10 : 0.20;
  
  const minProb = remainingMinutes > 10 ? 0.55 : 
                  remainingMinutes > 5  ? 0.60 : 0.65;
  
  // Only trade if edge > threshold AND model prob > minProb
}
```

### Time-Aware Probability Adjustment

```javascript
function applyTimeAwareness(rawUp, remainingMinutes, windowMinutes) {
  const timeDecay = clamp(remainingMinutes / windowMinutes, 0, 1);
  const adjustedUp = 0.5 + (rawUp - 0.5) * timeDecay;
  return { adjustedUp, adjustedDown: 1 - adjustedUp };
}
```

---

## Strategy Comparison

| Strategy | Risk | Complexity | Expected Return |
|----------|------|------------|-----------------|
| **Pure Arbitrage** (UP+DOWN<$0.97) | Zero | Low | 3%+ guaranteed |
| **TA-Based Prediction** | Medium | High | Variable |
| **Copytrading Whales** | High | Low | Often negative |
| **Weather Markets (NOAA)** | Medium | Medium | High if forecasts accurate |

---

## Recommended Approach for Our Bot

### Phase 1: Pure Arbitrage (Zero Risk)
- Monitor when UP + DOWN ≤ $0.97
- Buy equal dollar amounts of both
- Guaranteed $1 payout = 3%+ profit
- No prediction needed

### Phase 2: Edge-Based Trading (Optional)
- Implement TA scoring from PolymarketBTC15mAssistant
- Only trade when:
  - Edge > threshold (5-20% depending on time remaining)
  - Model probability > minimum (55-65%)
  - Sufficient liquidity on both sides

### Phase 3: Speed Optimization
- WebSocket for real-time prices
- Pre-calculate orders
- Submit all legs within 30ms
- Target same-block execution

---

## Key Takeaways

1. **Mathematical arbitrage works** - $40M extracted proves it
2. **Pure arbitrage is safest** - zero directional risk
3. **Speed is crucial** - same-block execution prevents slippage
4. **TA can add edge** - but requires sophisticated implementation
5. **Security matters** - prompt injection can wipe accounts
6. **Minimum viable position**: ~$15 (order minimums)
7. **Execution risk is real** - non-atomic fills can lose money

---

## Next Steps

1. Implement pure arbitrage scanner (UP + DOWN ≤ $0.97)
2. Add real-time WebSocket price feeds
3. Integrate Chainlink BTC price for TA
4. Build scoring system based on PolymarketBTC15mAssistant
5. Test in paper mode extensively
6. Go live with small positions first

