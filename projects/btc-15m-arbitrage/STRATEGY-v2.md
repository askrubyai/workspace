# BTC 15m Polymarket Strategy v2

*Updated Feb 3, 2026 - Post-fee research*

## Critical Change: Fees (Jan 7, 2026)

Polymarket introduced taker fees on 15-min markets:
- **Taker fee**: Up to 3%
- **Maker fee**: 0% + REBATES

This killed our original latency arbitrage strategy (edge was <1%, fees are 3%).

---

## Winning Strategies (Research-Backed)

### Strategy 1: Pure Spread Arbitrage ⭐ RECOMMENDED

**How it works:**
- Monitor when UP + DOWN prices < $0.97
- Buy BOTH sides with LIMIT orders (maker = 0 fees)
- One MUST resolve to $1.00
- Profit = $1.00 - total cost

**Example:**
- UP @ $0.48 + DOWN @ $0.46 = $0.94 total
- Resolution pays $1.00
- Profit: $0.06 (6.4%) + maker rebates

**Results:** Account88888 made $645K in 2 months

**Requirements:**
- Must use LIMIT orders (not market orders)
- Need to monitor for spread opportunities
- Execute quickly when spread appears

### Strategy 2: Last-Second Sniping

**How it works:**
- Wait until 30-60 seconds before resolution
- Check Chainlink oracle for clear direction
- Buy winning side at discount before market prices it in

**Example:**
- 45 sec before resolution, Chainlink shows BTC +0.3%
- UP odds still at $0.65 (should be $0.95+)
- Buy UP @ $0.65, resolves to $1.00
- Profit: $0.35 (54%) minus ~3% taker fee = ~50%

**Results:** 98% win rate bot, $313 → $438K in 1 month

**Requirements:**
- Real-time Chainlink data
- Fast execution
- Timing precision

### Strategy 3: Volatility Scalping

**How it works:**
- During high BTC volatility, prices swing wildly
- Buy low-priced shares
- Sell/flip quickly when price moves
- Don't hold to resolution

**Example:**
- BTC dumps, UP drops to $0.30
- BTC recovers slightly, UP rises to $0.45
- Sell for 50% gain without waiting for resolution

**Results:** $40 → $293 in 3 days

---

## Implementation Priority

1. **First**: Pure spread arbitrage (zero risk when executed correctly)
2. **Second**: Last-second sniping (high win rate but needs precision)
3. **Third**: Volatility scalping (requires active monitoring)

---

## Technical Requirements

### For Spread Arbitrage:
```javascript
// Monitor for opportunities
const upPrice = getUpPrice();
const downPrice = getDownPrice();
const spread = upPrice + downPrice;

if (spread < 0.97) {
  // OPPORTUNITY! Buy both with limit orders
  placeLimitOrder('UP', upPrice, size);
  placeLimitOrder('DOWN', downPrice, size);
}
```

### For Last-Second Sniping:
```javascript
// 45 seconds before resolution
const timeLeft = marketEndTime - Date.now();
if (timeLeft < 45000 && timeLeft > 15000) {
  const chainlinkDirection = getChainlinkDirection();
  const winnerPrice = chainlinkDirection === 'UP' ? upPrice : downPrice;
  
  if (winnerPrice < 0.85) {
    // Edge exists, buy winner
    placeOrder(chainlinkDirection, winnerPrice, size);
  }
}
```

### Maker vs Taker:
- **Limit order below best ask** = Maker (0 fees + rebate)
- **Limit order at/above best ask** = Taker (3% fee)
- **Market order** = Always Taker

---

## Risk Management

- Max 10% of capital per trade
- Only trade when edge > 3% (to cover potential slippage)
- For spread arb: Only enter if spread < $0.97
- For sniping: Only enter if clear direction + price < $0.85

---

## References

- @Retardeeo: Account88888 analysis ($645K profit)
- @krajekis: BTC 15m assistant (users: $40→$293, $100→$424)
- @OleksijSinkaruk: 98% win rate bot analysis ($313→$438K)
- Polymarket docs: Trading Fees

*Research compiled by Ruby, Feb 3, 2026*
