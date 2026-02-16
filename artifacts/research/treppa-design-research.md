# Treppa Design Research Doc
## 60-Second Live Bitcoin Pools - Platform Redesign Sprint

*Prepared for: Reuben's 4-5 hour morning sprint*
*Date: Feb 4, 2026*

---

## Executive Summary

Treppa is building 60-second live Bitcoin prediction pools on Solana. This is essentially **binary options for crypto** - users predict if BTC will go up or down within the next 60 seconds and either win or lose their stake.

The key challenge: Making a high-frequency, high-stakes product feel **simple, trustworthy, and addictive** while avoiding the "gambling" stigma.

---

## 1. Market Context

### What 60-Second Trading Is
- Ultra-short-term binary prediction: UP or DOWN
- Fixed payout ratios (typically 80-95% for winners)
- Pool-based liquidity (winners paid from losers' stakes minus house cut)
- Fast dopamine loops → high engagement but high churn risk

### Competitive Landscape

| Platform | Timeframe | Asset | Differentiator |
|----------|-----------|-------|----------------|
| Polymarket | Days-weeks | Events | News-driven, community |
| Azuro | Hours-days | Sports | DeFi rails, B2B focus |
| Stake.com | Minutes | Crypto | Centralized, gambling UX |
| Up vs Down | 15 min | Crypto | Polymarket 15-min pools |
| **Treppa** | 60 sec | BTC | Solana speed, DeFi native |

### Why 60 Seconds?
- **Solana's speed** enables true 60-sec settlement (Ethereum can't)
- **Higher engagement** than 15-min (more rounds = more revenue)
- **Skill element** still exists (technical analysis possible)
- **Risk**: Feels more like gambling → regulatory scrutiny

---

## 2. User Psychology (CRITICAL)

### The Target User
1. **Crypto degens** - Already comfortable with volatility, looking for action
2. **Trading addicts** - Want the dopamine without complex setups
3. **Whale gamers** - High net worth looking for high stakes
4. **Casual thrill-seekers** - Just want to feel something

### Psychological Hooks

**Positive (use these):**
- **Near-misses** - Show how close they were to winning
- **Streaks** - Celebrate winning streaks, downplay losses
- **Leaderboards** - Social proof and competition
- **Time pressure** - Countdown creates urgency
- **Simple choice** - Binary decision reduces cognitive load

**Negative (avoid these):**
- Loss-chasing mechanics
- Infinite scroll of opportunities
- Hidden fees or confusing payouts
- Gambling-style sound effects

### Key Insight
> "Make it feel like **trading**, not gambling. The UI should feel like a Bloomberg terminal for degens, not a slot machine."

---

## 3. UX Design Principles

### 3.1 Information Hierarchy

**Primary (Hero Area):**
- Current BTC price (LARGE, live-updating)
- Time countdown (60 sec, prominent)
- UP/DOWN buttons with current pool sizes

**Secondary:**
- Your active positions
- Recent results (your wins/losses)
- Current odds/payouts

**Tertiary:**
- Leaderboard
- Historical charts
- Settings/wallet

### 3.2 The Core Loop

```
[Price Display] → [Countdown: 60s] → [UP/DOWN Choice] → [Watch & Wait] → [Result] → [Repeat]
                                           ↓
                                    [Enter Amount]
```

### 3.3 Mobile-First Design

60-second trading is **perfect for mobile**:
- Quick sessions (can play while waiting for coffee)
- Simple interaction (one tap to predict)
- Push notifications for results

**Key Mobile UX:**
- Large touch targets for UP/DOWN
- Swipe gestures for quick entries
- Haptic feedback on wins
- One-handed operation possible

### 3.4 Trust Signals

Users need to trust the system is fair:
- **Live on-chain verification** - Show tx hashes
- **Provably fair randomness** - Chainlink VRF for resolution
- **Transparent pool mechanics** - Show all stakes in real-time
- **Audit badges** - Security audit completion (Anam's work!)

---

## 4. Feature Priorities

### Must Have (MVP)
- [ ] Live BTC price feed (Chainlink/Pyth)
- [ ] 60-second countdown timer
- [ ] UP/DOWN prediction UI
- [ ] Wallet integration (Phantom, Solflare)
- [ ] Position tracking
- [ ] Win/loss settlement
- [ ] Transaction history

### Should Have (V1.1)
- [ ] Leaderboard (daily/weekly/all-time)
- [ ] Streak tracking and badges
- [ ] Multiple stake amounts (presets)
- [ ] Sound on/off toggle
- [ ] Share wins to Twitter

### Nice to Have (V2)
- [ ] ETH/SOL pools (multi-asset)
- [ ] Longer timeframes (5 min, 15 min options)
- [ ] Social features (follow traders)
- [ ] Copy trading
- [ ] Mobile app (native)

---

## 5. Visual Design Direction

### Color Psychology
- **Green** = UP (bullish, money, go)
- **Red** = DOWN (bearish, stop)
- **Dark mode default** - Crypto natives expect it
- **Accent color** - Gold/yellow for wins, rewards

### Typography
- **Price**: Large, bold, monospace (feels financial)
- **Countdown**: Digital clock style
- **Body**: Clean sans-serif (Inter, Satoshi)

### Animation
- **Price updates**: Subtle flash on change
- **Countdown**: Smooth tick, urgent < 10 sec
- **Win/Loss**: Celebration vs. subtle fade
- **Pool changes**: Live-updating numbers

### Reference Designs
1. Polymarket's clean, confident layout
2. TradingView's chart professionalism
3. Robinhood's gamified simplicity
4. Stake.com's dark, high-energy aesthetic

---

## 6. Technical Considerations

### Oracle Integration
- **Primary**: Chainlink BTC/USD on Solana
- **Backup**: Pyth Network
- **Resolution**: Use price at T+60s vs T+0

### Smart Contract Flow
```
1. User submits prediction (UP/DOWN) + stake
2. Contract locks stake, records entry price
3. After 60s, oracle reports new price
4. Contract compares, settles winners
5. Losers' stakes distributed to winners (minus fee)
```

### Fee Structure
- **Typical**: 2-5% of losing pool
- **Revenue split**: Platform / LPs / Insurance fund
- **Gas abstraction**: Hide Solana fees in spread

---

## 7. Regulatory Considerations

### The Reality
60-second binary predictions are **legally ambiguous**:
- Could be classified as **gambling** (bad)
- Could be **derivatives** (regulated)
- Could be **prediction markets** (emerging framework)

### Risk Mitigation
- No US users (geofencing)
- Skill-based marketing ("trading" not "betting")
- Clear risk disclosures
- KYC for large withdrawals
- Responsible gambling features (deposit limits)

---

## 8. Sprint Priorities

### For the 4-5 hour sprint, focus on:

**Hour 1: Core Layout**
- [ ] Desktop wireframe: main trading screen
- [ ] Mobile wireframe: portrait layout
- [ ] Component library start

**Hour 2: Interaction Design**
- [ ] UP/DOWN button states
- [ ] Countdown timer behavior
- [ ] Entry flow (amount → confirm → submit)

**Hour 3: Visual Design**
- [ ] Color palette finalization
- [ ] Typography scale
- [ ] Key component styling (buttons, cards, inputs)

**Hour 4: Polish & Edge Cases**
- [ ] Win/loss states
- [ ] Loading states
- [ ] Error states
- [ ] Empty states

**Hour 5: Prototype**
- [ ] Clickable prototype in Figma
- [ ] Key flows connected
- [ ] Ready for team review

---

## 9. Questions to Answer in Sprint

1. **Entry UX**: Preset amounts vs. custom input vs. slider?
2. **Multiple positions**: Can users bet on same round multiple times?
3. **Pool visibility**: Show all bettors or just totals?
4. **Resolution animation**: How to display win/loss moment?
5. **Sound design**: Yes/no? Volume control?

---

## 10. Success Metrics

### User Metrics
- **Round participation rate**: % of users who play each round
- **Session length**: Time spent per visit
- **Retention**: Day 1, Day 7, Day 30
- **Win rate perception**: Do users feel it's fair?

### Business Metrics
- **GMV**: Total volume traded
- **Take rate**: Revenue as % of volume
- **LTV:CAC**: Customer value vs. acquisition cost

---

## Appendix: Competitive Screenshots to Study

1. **Polymarket** - Clean market cards, simple YES/NO
2. **Stake.com Crypto Games** - High-energy, dopamine-focused
3. **Binance Futures** - Professional, dense information
4. **Robinhood** - Simplified, accessible trading

---

*Document prepared by Ruby | Ready for Reuben's morning sprint*
