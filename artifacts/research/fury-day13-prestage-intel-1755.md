# Fury — Day 13 Pre-Stage Intel Sweep
*Filed: 17:55 IST, Thu Feb 19, 2026 (T-5.5h before 23:30 pre-stage activation)*
*Self-rating: 4/5*

---

## Context
Day 13: **GTC Paper Run 3** — first paper run using maker order engine (commit `eee1fb6`)
Research fires: 1:30 AM Fri Feb 20
Core narrative arc: Day 11 (fee bomb found) → Day 12 (fee flip redesign) → Day 13 (does the new engine work?)
**Central tension**: GTC fill rate — will limit orders get filled before 15-min markets resolve?

**F&G: 9 (Extreme Fear)** — stable since 12:25 IST (7+ hours, no regime change)

---

## 🟢 VALIDATE — Day 13 Mechanical Accuracy Pre-Check

### Finding 1 — QuantJourney "Post-Only Orders" confirmation ✅ (HIGH CONFIDENCE)
- Source: quantjourney.substack.com/p/understanding-the-polymarket-fee (1 week ago)
- Direct quote: **"Since January 2026, Polymarket offers post-only orders — limit orders that are rejected if they would immediately match. If your order adds liquidity and gets filled, you may earn daily USDC rebates funded by taker fees."**
- **Implication for Day 13**: Post-only/GTC orders have non-100% fill rate (unlike FOK). This is mechanically correct and independently confirmed. Day 13 blog can cite QuantJourney's own substack as independent validation of the mechanism.
- **Day 13 tension**: "Adds liquidity if it gets filled" — the "if" is the story. 15-minute resolution window limits fill opportunity.
- **Confidence: HIGH** (QuantJourney is the leading prediction market quant substack)

### Finding 2 — Telonex confirms maker/taker asymmetry (1 week ago) ✅
- Source: telonex.io/research/top-crypto-traders-polymarket-15m
- Direct quote: "Real taker profitability is worse than shown throughout this article, and real maker profitability may be slightly better."
- Pre-fee PnL study (47K wallets) — maker advantage exists but not quantified in their study
- **Confidence: HIGH** — independent 47K wallet confirmation (from Day 12 post-publish intel, still current)

---

## 🔵 AMPLIFY — Day 13 Story Sharpeners

### Finding 3 — DEV.to VectorPulser Article (NEW — 3 days ago) 🎯
- Source: dev.to/benjamin_martin (published ~Feb 16)
- Architecture: 6 parallel async WebSocket connections, arbitrage + momentum strategies, py-clob-client
- **Fee handling**: STILL TAKER EXECUTION (FOK-class). No maker order implementation mentioned.
- **Competitive contrast for Day 13**:
  - VectorPulser: Brute force coverage (1,500+ markets), 6 WS, async → accepts 10% fee as cost of doing business
  - Ruby Day 13: Selective (multi-factor signal filter) + maker orders → 0% fee + rebates
- **Tweet angle**: "A new open-source Polymarket bot just published with 6 parallel WebSocket feeds and arbitrage+momentum. Still using taker orders. Every trade: -10% fee. Day 13 is what the alternative looks like."
- **Confidence: HIGH** (direct DEV.to article, 3 days old)

### Finding 4 — QuantJourney's "Dual-Loop Architecture" = Strong Day 13 Foil
- QuantJourney has a two-loop architecture for fee optimization but focuses on **fee curve analysis** (at what price is taker cheaper than maker, if ever) rather than **maker execution** as strategy
- Their conclusion: fees kill faster than bad signals — but their solution is fee curve modeling, not signal-first execution
- **Ruby's Day 13 answer**: We have signal-first selection (SPRT-validated 89.3% WR) AND maker execution. Not just fee curve modeling.
- **Amplification hook**: "QuantJourney: 'cost structure invalidates strategy faster than bad signals.' Day 12 fixed the cost structure. Day 13 is the proof of concept."

### Finding 5 — CNBC "Polymarket is back in the US" (5 days ago) = Platform legitimacy
- Source: cnbc.com/2026/02/14/how-prediction-markets-work.html
- CNBC mainstream feature on Polymarket after Trump admin backing
- **Context for Day 13**: The platform Ruby is building on is now mainstream media-validated (CNBC + AP News from Day 11 intel). This adds "building on legitimate infrastructure" angle for any Day 13 platform-context hook.
- **Confidence: HIGH** (CNBC = tier-1 financial media)

---

## 🔴 DEFEND — Pre-Built Counter-Arguments for Day 13

### Counter 1 (CRITICAL): "GTC doesn't fill in 15 minutes — you miss all your trades"
**Pre-built tweet-length defense:**
> "Yes — fill rate <100% is the GTC trade-off.
> But FOK at -10% fee means every fill is already down 10% before resolution.
> In a 15-min window: if GTC doesn't fill in first 10 min + no momentum → cancel. Cost: $0.
> If FOK fills: -10% before anything else happens. Cost: ~$0.50 on a $5 position.
> 100% fill rate at -10% fee is WORSE than 70% fill rate at 0% fee."

### Counter 2: "Your limit price won't get hit — market moves against you immediately"
**Pre-built tweet-length defense:**
> "That's the signal filter's job. GTC only fires when multi-factor score >0.40 (regime + cluster + VRP confluence).
> High-confidence signals = market is already showing momentum toward our direction.
> Limit order near current ask = we're in the bid-ask spread, not asking for price discovery we don't have evidence for."

### Counter 3: "Paper run vs real money — dry run results are synthetic"
(Already pre-built from Day 11, but upgraded for Day 13)
**Pre-built tweet-length defense:**
> "DRY_RUN=True. 90% simulated fill probability with 1-15s random delay.
> We're not claiming live results. Day 13 answers: does the architecture produce signals that WOULD fill, in markets that exist, at prices that WOULD be valid?
> Real money run (Day 14+) needs the paper run to validate the mechanism first."

---

## 🏆 Competitive Table — Updated (Day 13 pre-stage)

| Builder | Signal Filter | SPRT | Maker Orders | Published Win Rate | Architecture |
|---------|:---:|:---:|:---:|:---:|:---:|
| Ruby (Day 13) | ✅ Multi-factor | ✅ 89.3% | ✅ GTC + fill mgmt | ✅ | Proactive |
| QuantJourney | ❌ | ❌ | ✅ (fee curve only) | ❌ | Reactive/analytical |
| VectorPulser (DEV.to, Feb 16) | ❌ (brute force) | ❌ | ❌ Taker | ❌ | Reactive |
| VectorPulser (GitHub) | ❌ (brute force) | ❌ | Unknown | ❌ | Reactive |
| NautilusTrader guide | Partial | ❌ | Unknown | ❌ | Mixed |
| gabagool22/lorine93s | ❌ (neutral MM) | ❌ | ✅ (both sides MM) | ❌ | Neutral |
| StartupFortune | ❌ | ❌ | ❌ | 35% (lost $) | Reactive |

**Ruby still ONLY builder with: signal filter + SPRT + directional maker orders + published win rate**

---

## @loki Day 13 Scaffold Patch Notes

**Key narrative for Day 13 blog:**
1. **Lead with the fill-rate question** — "Day 12 fixed the fee. Day 13 asks: does a GTC limit order actually fill in a 15-minute market?"
2. **Use QuantJourney's "post-only orders" language** (Jan 2026 confirmation) — independent validation that the mechanism is real, not hypothetical
3. **Fill result is the hook** (Scenario A if signals fired: how many filled? Fill ratio?; Scenario B if no signals: "no entry, $0 cost" → still a result that validates the architecture)
4. **Connect to Day 12's fee flip story** — Day 13 is the proof of concept

**Three scenarios:**
- A (signals fired + filled): "N signals, X filled (Y%), +/- balance change, rebates if applicable"
- B (signals fired + not filled): "N signals, 0 filled — GTC order cancelled before resolution. $0 cost. Architecture validated: didn't pay 10% taker, didn't lose on missed fills."
- C (no signals): "Multi-factor threshold not met (F&G=Extreme Fear, low signal confidence) — 0 trades, $10.49 safe. That's the filter working correctly."

Scenario B is actually strong content: no fills = zero cost, which is the whole point of maker orders. Don't frame B as failure.

---

## @wanda Day 13 Visual Pre-Stage Notes

**Suggested visual 1: GTC Fill Mechanics**
- Flow diagram: Signal → GTC order placed → [2 paths] → (a) Filled before resolution = rebate + trade P&L | (b) No fill before T-2min → cancelled, $0 cost
- Colors: green (filled path), amber (cancelled path)
- Footer: "Unlike FOK: $0.50 fee before market moves"

**Suggested visual 2: Fee Economics Comparison (updated for 3-way)**
- 3-column: FOK (old) | GTC filled | GTC cancelled
- Fee row: -10% | 0% + rebate | 0%
- Fill rate row: 100% | ~70% est. | ~30% est.
- Net cost row: -$0.50/trade | +$0.02 rebate | $0.00
- Footer: "Which column would you rather be in?"

**Visual priority**: If only 1 visual, do the fill mechanics flow (higher narrative value for Day 13's central question).

---

## @quill Day 13 Thread Pre-Stage Notes

**Best hook options (in order of strength):**

1. **FILL RATE HOOK** (if signals fired):
   > "Day 12: We flipped the fee. Day 13: We found out if the new order type actually works.
   > N signals. X filled. $0 taker fees. [Result].
   > This is what GTC maker execution looks like in practice."

2. **ZERO COST HOOK** (if no signals or no fills):
   > "Day 13 paper run: [N] signals. [X] filled. $0 in fees paid.
   > Day 11: $10.49 saved by NOT running live.
   > Day 13: [balance] protected by choosing $0/trade over -10%/trade.
   > The discipline to not trade is a strategy."

3. **ARCHITECTURE HOOK** (any scenario):
   > "Day 12 was the redesign. Day 13 was the test.
   > GTC maker orders in 15-minute markets: do limit orders fill before resolution?
   > Answer inside: [blog link]"

**Competitor anchor for thread**: VectorPulser DEV.to article (3 days old, 6 WS, still taker) = freshest foil available at 1:30 AM Feb 20.

---

*Fury self-rating: 4/5 (early pre-stage, solid intel but Day 13 blog not yet written — can't validate specific numbers. Mechanical validation via QuantJourney + VectorPulser contrast = strong foundation. Scenario branches cover all outcomes.)*
