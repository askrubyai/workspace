# BTC 15m Trading Strategy

Based on comprehensive research from @RohOnChain, PolymarketBTC15mAssistant, and other sources.

---

## The Opportunity

Polymarket's BTC 15-minute markets offer two trading approaches:

| Strategy | Risk Level | Complexity | Expected Return |
|----------|------------|------------|-----------------|
| **Pure Arbitrage** | Zero | Low | 3%+ guaranteed |
| **Directional (TA-based)** | Medium | High | Variable |

---

## Strategy 1: Pure Arbitrage (RECOMMENDED)

### How It Works

When UP + DOWN prices sum to less than $1, buying both guarantees profit.

```
Example:
  UP price:   $0.48
  DOWN price: $0.48
  Total cost: $0.96 per share of each

  Outcome: One MUST win → Payout = $1.00
  Profit:  $1.00 - $0.96 = $0.04 (4.2%)
```

### Entry Criteria

1. **Spread threshold**: UP + DOWN ≤ $0.97 (3%+ profit margin)
2. **Minimum liquidity**: 100+ shares on both sides
3. **Minimum profit**: $0.05 per trade (covers slippage)
4. **Time buffer**: >1 minute to market close

### Execution

```javascript
// Detect arbitrage
const spread = upPrice + downPrice;
if (spread <= 0.97) {
  // Calculate position
  const minLiquidity = Math.min(upLiquidity, downLiquidity);
  const positionSize = Math.min(maxPosition, minLiquidity * minPrice);
  
  // Buy equal dollar amounts of BOTH
  buyUp(positionSize / upPrice);
  buyDown(positionSize / downPrice);
}
```

### Why It Works

- **Mathematical certainty**: One side MUST win
- **No prediction needed**: Doesn't matter if BTC goes up or down
- **Risk-free**: Only cost is transaction fees

### Research Backing

From @RohOnChain's analysis:
- $10.5M extracted in single-condition arbitrage (April 2024 - April 2025)
- Top trader made $2M from 4,049 trades

---

## Strategy 2: Directional Trading (OPTIONAL)

### How It Works

Use technical analysis to predict BTC movement, then trade if our model's probability exceeds market price by a threshold (edge).

### Scoring System (from PolymarketBTC15mAssistant)

| Factor | Weight | Long Signal | Short Signal |
|--------|--------|-------------|--------------|
| Price vs VWAP | 2 | Price > VWAP | Price < VWAP |
| VWAP Slope | 2 | Rising | Falling |
| RSI + Slope | 2 | RSI > 55 & rising | RSI < 45 & falling |
| MACD Histogram | 2 | Expanding green | Expanding red |
| MACD Line | 1 | Positive | Negative |

### Score → Probability

```javascript
const rawUpProb = upScore / (upScore + downScore);

// Apply time decay (less confident as market closes)
const timeDecay = remainingMinutes / 15;
const adjustedUpProb = 0.5 + (rawUpProb - 0.5) * timeDecay;
```

### Edge Calculation

```javascript
const edge = modelProbability - marketPrice;

// Only trade if edge exceeds threshold
const threshold = remainingMinutes > 10 ? 0.05 :
                  remainingMinutes > 5  ? 0.10 : 0.20;

if (edge > threshold) {
  // Trade!
}
```

### Entry Criteria by Phase

| Phase | Time Left | Edge Threshold | Min Model Prob |
|-------|-----------|----------------|----------------|
| Early | >10 min | 5% | 55% |
| Mid | 5-10 min | 10% | 60% |
| Late | <5 min | 20% | 65% |

### Why Higher Thresholds Later?

- Less time for market to correct
- Higher uncertainty
- Need stronger conviction

---

## Execution Considerations

### Speed Matters

From @RohOnChain's research:

```
Retail execution:        ~2,650ms total latency
Sophisticated systems:   ~2,040ms (30ms decision)
```

**Key insight**: Submit all legs within 30ms for same-block execution.

### Non-Atomic Risk

CLOB execution is sequential, not atomic:
1. Submit UP buy → Fills
2. Price updates from your order
3. Submit DOWN buy → May fill at worse price

**Mitigation**: Use limit orders, account for slippage in calculations.

### Order Minimums

- Minimum order: ~15 shares
- At $0.50 price: ~$7.50 minimum
- Recommended: $20+ per trade for meaningful profit

---

## Risk Management

### Arbitrage Mode

- **Risk**: Near-zero (only execution risk)
- **Max position**: $50 per opportunity
- **Stop loss**: N/A (guaranteed profit)

### Directional Mode

- **Risk**: Can lose entire position
- **Max position**: $20 per trade
- **Stop loss**: None (binary outcome)
- **Max daily loss**: Set a cap and stop trading

---

## Expected Returns

### Arbitrage

Assuming:
- 3% average profit per opportunity
- 5 opportunities per day
- $50 position size

```
Daily: 5 × $50 × 3% = $7.50
Monthly: ~$225
Annualized: ~$2,700 on $50 capital
```

### Directional

Highly variable. Requires:
- Good TA model (>55% accuracy)
- Proper edge calculation
- Discipline to only trade high-conviction signals

---

## Implementation Priority

1. **Phase 1**: Pure arbitrage scanner (zero risk)
2. **Phase 2**: Real-time WebSocket feeds (speed)
3. **Phase 3**: TA scoring system (directional)
4. **Phase 4**: Live execution (after extensive paper testing)

---

## References

- [@RohOnChain's $40M arbitrage analysis](https://x.com/RohOnChain/status/2017314080395296995)
- [PolymarketBTC15mAssistant GitHub](https://github.com/FrondEnt/PolymarketBTC15mAssistant)
- [Research paper: Arbitrage in Prediction Markets (arXiv:2508.03474)](https://arxiv.org/abs/2508.03474)

