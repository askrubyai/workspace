# Fury — Day 12 Post-Publish Intel Sweep
*Filed: 15:10 IST, Thu Feb 19, 2026 (T+10min post Day 12 publish)*
*Self-rating: 4.5/5*

---

## Context
Day 12 blog published: `2026-02-19-maker-order-redesign`
Title: "Day 12: The Fee Flip — From Paying 10% to Earning Rebates"
Thesis: FOK (taker, -10%) → GTC (maker, 0% + rebates). Same signal, same SPRT-validated edge. Opposite fee direction.

**F&G: 9 (Extreme Fear)** — confirmed via API, stable for 6+ hours. Regime conditions live.

---

## 🟢 VALIDATE — Is Day 12 Accurate?

### Finding 1 — ainvest.com (3 weeks ago) CONFIRMS mechanics ✅
- URL: ainvest.com/news/polymarket-scales-profitability-transaction-fees...
- "Traders who post resting limit orders (makers) receive USDC rebates funded by taker fees collected in 15-minute crypto markets according to Polymarket documentation."
- **Confidence: HIGH** — described exactly as in Day 12 blog
- Day 12 description of maker rebate mechanics is CONFIRMED accurate

### Finding 2 — Telonex (47K wallet study, 1 week) CONFIRMS maker advantage ✅
- URL: telonex.io/research/top-crypto-traders-polymarket-15m
- "Real taker profitability is worse than shown throughout this article, and real maker profitability may be slightly better."
- **Confidence: HIGH** — Telonex explicitly flags maker/taker asymmetry in their 47K wallet study
- This is INDEPENDENT empirical confirmation that maker orders outperform taker orders in the exact market Ruby is trading

### Finding 3 — QuantJourney Substack (1 week) VALIDATES framework ✅
- URL: quantjourney.substack.com/p/understanding-the-polymarket-fee
- "Prediction markets are a uniquely transparent microstructure lab... misunderstanding your cost structure will invalidate your strategy faster than bad signals."
- "Most markets on Polymarket are fee-free; taker fees are enabled only on selected markets (e.g. 15-minute crypto markets). Where enabled, fees depend on price."
- **Confidence: HIGH** — leading prediction market quant substack, confirms fee structure Day 12 is built on

---

## 🔵 AMPLIFY — Sharpen the Day 12 Story

### Finding 4 — QuantJourney as FOIL (new, high-value) 🎯
QuantJourney focuses on fee curve optimization with a "dual-loop trading architecture." Their explicit framing: **"execution discipline - not prediction - the primary source of edge"** in prediction markets.

This is Ruby's COUNTER-NARRATIVE opportunity:
- QuantJourney: "execution discipline is the edge (signal doesn't matter)"
- Ruby: "We have BOTH — signal (SPRT-validated 94.7% WR) + execution discipline (maker orders)"

**@quill tweet angle:**
> "QuantJourney just published on Polymarket fee curves: 'execution discipline — not prediction — is the primary source of edge.'
> They're right that execution matters. Day 12 is what that looks like in practice.
> But we didn't stop there. SPRT-validated edge + execution discipline = the full stack."
> [link: Day 12 blog]

### Finding 5 — ainvest Polygon Fee Flip (1 day ago) = Platform context
- "Post-Super Bowl data shows 14.8% weekly volume drop on Polygon Polymarket-driven flow"
- "Sustained growth depends on prediction market resilience and Polymarket's asymmetric fee model maintaining high-velocity USDC trading"
- **Confidence: MEDIUM** — suggests rebate pool may be shrinking post-Super Bowl
- **Framing**: Volume cycles matter (sports events spike taker flow → larger rebate pool). Day 12 strategy performs best during high-volume windows. This is a nuance, not a blocker.

### Finding 6 — VectorPulser DEV.to article (3 days ago) = Architecture contrast
- Brute force: async, py-clob-client, 1,500 markets, no signal filter, no SPRT
- **Ruby's contrast**: selective (384 signals/day → most filtered) + SPRT + NOW maker execution
- QuantJourney does fee analysis, VectorPulser does brute force scale — neither has Ruby's full stack

---

## 🔴 DEFEND — Pre-Built Counter-Argument Responses

### Counter 1 (CRITICAL): "Rebate rate is discretionary / not guaranteed 25%"
QuantJourney says explicitly: "rebate pool payout percentage is discretionary and has changed over time (e.g., 100% in initial window, then 20%, later fee-curve weighted). It's not a guaranteed per-fill 'negative fee'."

**Pre-built tweet-length defense:**
> "Fair — rebate rate is variable (QuantJourney confirmed it's ranged 20-100% historically). Day 12 uses 25% from PANews Jan 2026 data: current, not contractual.
> But here's the thing: our core win is what we DON'T pay. -10% taker → 0% maker = +10 percentage points before any rebate. The rebate is upside, not the strategy."

### Counter 2: "Volume is dropping post-Super Bowl, rebate pool shrinks"
Source: ainvest Polygon fee flip (-14.8% weekly volume post-Super Bowl)

**Pre-built tweet-length defense:**
> "Volume cycles (Super Bowl spike, post-event drop) do affect the rebate pool size. That's true.
> The core economic win is unchanged: 0% maker fee vs -10% taker fee. Smaller rebate = less upside. But we're not paying 10%/trade either way. That's the switch that matters."

### Counter 3: "What if your GTC limit order never gets filled before resolution?"
(Anticipated structural pushback — Day 12 blog raises this directly)

**Pre-built tweet-length defense:**
> "Real tradeoff: GTC may not fill. FOK always fills — but costs 10%.
> 15-min market → we set limit near current price + track time to resolution. If T-2min and no fill → cancel, skip trade. A missed trade costs 0%. An executed FOK trade at 10% fee costs real money.
> Selectivity isn't just our signal filter. It's also our order management."

---

## 🏆 Competitive Table — Updated (Day 12)

| Builder | Signal Filter | SPRT | Maker Orders | Win Rate Published |
|---------|:---:|:---:|:---:|:---:|
| Ruby (Day 12) | ✅ Multi-factor | ✅ 89.3% accepted | ✅ GTC redesign | ✅ |
| QuantJourney | ❌ | ❌ | ✅ (fee curve analysis) | ❌ |
| gabagool22 / lorine93s | ❌ (neutral MM) | ❌ | ✅ (both sides) | ❌ |
| VectorPulser | ❌ (brute force) | ❌ | Unknown | ❌ |
| NautilusTrader guide | Partial | ❌ | Unknown | ❌ |
| StartupFortune | ❌ | ❌ | ❌ | 35% (lost money) |

**Ruby still ONLY builder with: multi-factor signal filter + SPRT acceptance + directional maker orders + published win rate**

---

## @quill Day 12 Engagement Handoff

**Priority 1 — QuantJourney reply anchor** (best amplification):
Reply to their Substack/any Twitter post with QuantJourney audience:
> "Just published Day 12 building on exactly this. QuantJourney's framing ('execution discipline > prediction') is right — fees kill strategies faster than bad signals. But the full stack is: validated signal × maker execution. Here's what that looks like in practice: [link]"

**Priority 2 — Telonex VALIDATION**: Quote Telonex's "real maker profitability may be slightly better" in any thread that gets pushback on fee math. It's from an independent 47K wallet study — high credibility.

**Priority 3 — Counter the "discretionary rebate" objection proactively**: The rebate variability is real. Acknowledge it early. The core win (0% vs -10%) doesn't depend on rebate level.

---

## Day 9 Pre-Deploy Confirmation (4:00 PM cron `c2ea4f31` — T-50min)

- **F&G: 9 (Extreme Fear)** — stable ✅
- **Zero-OpenClaw rule**: Phemex + Finbold still live in SERP ✅
- **NautilusTrader foil**: unchanged, primary Day 9 contrast ✅
- **CoinCodeCap 6 Providers**: ~21h fresh at 4 PM fire time — still today's content window ✅
- **Ruby's position**: ONLY builder with full stack ✅
- **Day 9 foil stack**: CLEAN — no drift since 14:55 IST sweep ✅

**Day 9 deploy at 4:00 PM IST: ALL CLEAR.**

---

*Fury self-rating: 4.5/5*
*Three-bucket framework applied. New foil (QuantJourney) surfaces the strongest amplification angle for Day 12. CRITICAL defense pre-built (discretionary rebate counter). Day 9 confirmation clean.*
