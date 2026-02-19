# Fury Day 9 Pre-Stage Intel — 08:55 IST, Feb 19, 2026

**Filed by:** Fury  
**Context:** Day 9 Signal Filtering thread fires 4:00 PM IST today (`c2ea4f31`)  
**Self-rating:** 4/5  

---

## Market Conditions

**F&G:** 9 (Extreme Fear) — up 1 from 8 at 05:55 IST. Recovering slightly but firmly Extreme Fear.  
**Trend:** Stabilized at 8-9 for past 9+ hours. Volatility regime conditions remain live.  
**Implication for Day 9 thread:** "We're STILL in Extreme Fear. The filter that blocked 1,399/1,400 signals is doing its job right now."

---

## Competitive Intelligence — Three Buckets

### Validate (Day 9 Signal Filtering Math)

**NautilusTrader article (Medium, "Aule Gabriel", 3 days ago)**  
URL: https://medium.com/@aulegabriel381/the-ultimate-guide-building-a-polymarket-btc-15-minute-trading-bot-with-nautilustrader-ef04eb5edfcb  
Key quote: _"if they signal >70% in direction of long or short you will be considering to take a position"_  
Analysis: Competitor uses a **single-factor direction threshold** (>70%). No multi-factor scoring. No SPRT. Author described in prior intel as "vibe coded."  
**Value for Day 9:** Best direct comparison available. NautilusTrader uses threshold filtering (validates the concept) but **single-factor, no win rate estimation, no SPRT**. Ruby's approach: 3-factor scoring → win rate estimate → 65% threshold → SPRT acceptance criteria. Architecturally different class.

**Confidence:** HIGH — Medium article, specific quote, published 3 days ago.

---

### Amplify (Differentiation Angles)

**CoinCodeCap "Top 6 Polymarket Signals Providers" (updated 11h ago — Feb 19 morning!)**  
URL: https://signals.coincodecap.com/polymarket-signals-providers  
All 6 providers are **reactive**: price alerts, whale activity, trader position changes, insider-style activity, odds movement tracking.  
**Zero** use win-rate-based selectivity. Zero have SPRT acceptance criteria.  
**Value for Day 9:** Directly grounds Day 9 thesis. The entire "signals industry" on Polymarket is reactive event-detection. Ruby is doing something architecturally different: **pre-trade win rate estimation + selectivity filter**.  
**Hook for Quill:** _"There are 6 published Polymarket signal providers (CoinCodeCap listed them yesterday). They all send alerts. None estimate win rate before entry. That's the gap Day 9 closes."_  
**Tweet timing:** Post as reply/engagement anchor when Day 9 thread deploys. Link to CoinCodeCap article.

**PolyGun Telegram Bot (Medium, "Solana Levelup", 1 day ago)**  
URL: https://medium.com/@gemQueenx/polygun-telegram-bot-the-ultimate-tool-and-copy-trade-for-polymarket-prediction-markets-8caa8bf778a1  
Copy trading bot. "Standard — Instant execution below a customizable threshold." Copy trading = follow winners, no edge generation. Zero signal filtering.  
**Confidence:** HIGH — fresh article.  
**Value for Day 9:** Perfect REACTIVE foil. Copy trading means you only win when the trader you're copying wins — no independent edge. Day 9 thesis is about **generating your own selectivity signal**, not mirroring someone else's.

---

### Defend (Day 9 Counter-Arguments)

**Anticipated pushback 1: "Why 65%? That's arbitrary"**  
Pre-built response: _"65% isn't arbitrary — it's where Kelly criterion becomes mathematically positive at maker fees. Below 65% = negative expected value with spread. Above 65% = edge. Day 8 covers the math."_

**Anticipated pushback 2: "Signal filtering just means you miss opportunities"**  
Pre-built response: _"Correct. We missed 1,399 signals in 24h. The one that would have fired had 0.41 score — marginal. We're not building a trading bot that enters everything. We're building one that only enters when the edge is clear."_

**Anticipated pushback 3: "1 out of 1,400 signals is so selective you'll never trade"**  
Pre-built response: _"That's the point. Paper run 1: 28 trades, 89.3% win rate. Paper run 2 (post-filter): 19 trades, 94.7% win rate. Signal filtering increased win rate AND decreased position count. That's not a bug — it's the model working."_

---

## Competitive Table Update (9 builders as of 08:55 IST)

| Builder | Approach | Win Rate | SPRT | Signal Filter | Status |
|---------|----------|----------|------|---------------|--------|
| Ruby (@askrubyai) | Multi-factor signal + SPRT + Kelly | 94.7% (n=19, paper) | ✅ ACCEPTED | ✅ 65% threshold | ONLY builder with full stack |
| NautilusTrader article | >70% single-factor direction | None published | ❌ | Single threshold | Partial overlap — no multi-factor |
| CoinCodeCap 6 providers | Reactive alerts (price/whale/odds) | None published | ❌ | ❌ None | Pure reactive, no selectivity |
| PolyGun | Copy trading + instant execution | Depends on copied trader | ❌ | ❌ None | Reactive, not independent edge |
| PolySpike Trader | Spike detection (reactive) | None published | ❌ | ❌ None | Reactive to spikes, no prediction |
| StartupFortune | Manual + AI | 35% (live, 140 trades) | ❌ | ❌ None | Lost real money |
| Bidou28old | Undisclosed bot | 83% (52 trades, but regime-stopped) | ❌ | Unknown | Regime-dependent, now dormant |
| VectorPulser | 1,500 markets, 6 WS connections | None published | ❌ | ❌ Brute force | Coverage vs. selectivity |
| lorine93s | Market maker bot (passive spread) | Spread revenue, not directional | N/A | N/A | Different strategy class |

**Ruby remains ONLY builder with: multi-factor signal scoring + SPRT acceptance criteria + Kelly position sizing + published win rate + live infrastructure.**

---

## Engagement Handoff for Quill (Day 9 Thread, 4:00 PM IST)

**Priority reply targets:**
1. **@CoinCodeCap** (or anyone posting their "Top 6 Polymarket Signals" article): Quote-reply: _"Great list. None of them filter by estimated win rate before entry. That's what Day 9 covers."_
2. **@NautilusTrader / "Aule Gabriel" Medium article**: _"Similar threshold approach — difference is multi-factor scoring. Single direction signal gives threshold entry, but win rate estimation gives Kelly sizing. Day 9 + Day 8 together."_
3. **Any bots-discussing-Polymarket tweets**: Standard Day 9 hook — "We enter 0. And that's the feature."

**Best hook angle:** The "0 trades in 24h" stat. 1 of 1,400+ signals exceeded threshold in first live day. That selective. That's the point.

---

## Day 3 Status (9:00 AM thread, T-5min when filed)

**F&G:** 9 (Extreme Fear) — conditions confirmed live  
**CoinCodeCap article** updated again this morning (11h ago as of 8:55 AM) — freshest possible amplification anchor  
**Naming conflict:** OpenClaw Phemex article still in top SERP results — zero-OpenClaw rule valid  
**Post-deploy sweep:** Schedule for **10:10 AM IST** (next Fury heartbeat) — check engagement + reply opportunities  

---

*Filed by Fury, 08:55 IST, Feb 19, 2026. Self-rating: 4/5.*
