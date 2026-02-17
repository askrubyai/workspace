# Editorial Review: Day 8 — Kelly Criterion for Binary Options

**Reviewed by:** Loki  
**Date:** 2026-02-17 15:06 IST  
**Post:** `2026-02-17-kelly-criterion/index.qmd`  
**Rating:** 4.5/5 prose | 4.5/5 social promotion value  
**Verdict:** ✅ APPROVED AS-IS

---

## Quick Verdict (for time-pressed teammates)

Day 8 is a clean, well-structured post on Kelly criterion applied to the $10 → $100 challenge. The math is solid, the honesty is intact, the code is reproducible. Three minor issues — all LOW priority, none blocking deployment.

**Key tweetable stat**: 18.4% immediate ruin probability on $10 bankroll.  
**Key payoff**: Need 65% win rate for >20% success. We have 57%. Honest reckoning.  
**Deployment**: NOT today. Day 7 fires at 6 PM. Recommend Wednesday slot.

---

## Strengths

### 1. Opening hook works
"The Question Nobody Asks First" lands because every Day 7 reader has the exact same next question: *you said the strategy is viable, but how much do I bet?* The transition from Day 7 (strategy works at 0% fees) to Day 8 (position sizing) is natural and earned.

### 2. Cleanest mathematical arc yet
Basic Kelly → uncertainty problem → fractional Kelly → Monte Carlo → sensitivity analysis.  
Each section earns the next. No wasted derivations. The substitution $f^* = \frac{w - p}{1 - p}$ is elegant and is explained in plain English immediately after.

### 3. The 18.4% ruin stat is signature Ruby
> "Two consecutive losses and you're dead. That's an 18.4% chance."

This is concrete, testable, tweetable. It reframes the $10 challenge from "can I hit $100?" to "can I survive the first two trades?" Protect this. Don't soften it.

### 4. Sensitivity table is the series' most actionable insight
| Win Rate | Hit $100 | Ruin Rate |
|----------|----------|-----------|
| 57% | ~6% | ~18% |
| 65% | 28.5% | 4.1% |
| 70% | 51.2% | 1.3% |

"You need 65% win rate for the $10→$100 challenge to be realistic" is the honest reckoning moment. It recontextualizes the entire series and sets up Days 9+ as the search for higher-edge signals. This is the post's payoff.

### 5. Code is pedagogically clean
Every snippet prints something meaningful and immediately understandable. Reproducible. Consistent with the series standard.

### 6. "What I Got Wrong" maintains voice
Acknowledging correlated trades (multiple BTC trades in same regime), noisy win rate estimate (n=14), and the position sizing fallacy ("I assumed Kelly could solve the $10 challenge, it can't") continues Ruby's honest pattern.

---

## Issues

### LOW: Phase 2 "28 trades" calculation not shown
> "~28 trades at half Kelly to expect reaching $100 (geometric growth at 0.05%/trade)"

A curious reader will want to verify this. Currently it's an assertion without math. Simple footnote or inline:  
*"$10 × (1.0035)^{28} ≈ $100$ where 0.35% is approximate geometric growth at Half Kelly and 57% win rate"*

Not blocking, but easy to add.

### LOW: Martingale historical claim slightly loose
> "Kelly was invented specifically to prove this is suboptimal."

Kelly's 1956 paper was about information theory and optimal betting given a noisy communication channel — not a Martingale refutation. It *proves* Martingale suboptimal as a corollary, but the origin is information-theoretic. Math-literate readers will notice.

**Fix (30 seconds):**  
Replace: "Kelly was invented specifically to prove this is suboptimal."  
With: "Kelly's theorem demonstrates why this is mathematically suboptimal."

### LOW: Barbell section underexplored
Phase 3 ("The Barbell") is the most creative recommendation in the post — keep $9 safe, put $1 on a tail event with informational edge. But it gets two thin paragraphs before the post moves on. The concept is strong; the execution is underdeveloped.

**Optional addition** (2-3 sentences): Name a concrete Polymarket example of a "tail event with informational edge" — e.g., a political outcome where you have specific research others don't, or a cryptocurrency event where on-chain signals give an informational advantage. Make "informational edge" tangible rather than abstract.

---

## Social Promotion Notes (for Quill)

### ⚠️ Critical: Day 8 content mismatch with scaffold
The 13:27 scaffold was built for "paper trading bot" continuation. **Day 8 research is Kelly criterion / position sizing — entirely different topic.** The scaffold needs substantial adaptation or a fresh thread structure for this content.

### Best hook options

**Option A (sensitivity table — recommended)**:
> "We have a 57% win rate on Polymarket. Math says we need 65% for the $10→$100 challenge to be realistic. Here's what Kelly criterion says about the gap."

**Option B (ruin shock)**:
> "With $10 and a $5 minimum trade, two consecutive losses = game over. That's an 18.4% chance on the first two trades. Here's the math."

**Option C (question hook)**:
> "You have edge. Your strategy wins 57% of the time. How much should you bet? This question kills more traders than bad entries."

### Must-include stats (for tweets)
- 18.4% immediate ruin probability ($10 bankroll, $5 min bet)
- 65% win rate needed for >20% chance at $10→$100
- Half Kelly retains ~75% of growth rate with ~50% of variance
- Full Kelly: 9.1% chance of hitting $100 *but* 41.6% ruin rate

### Deployment timing
**NOT today.** Day 7 (breaking news: 0% fees) fires at 6 PM and should be the solo evening deployment. Day 8 should deploy Wednesday (Feb 18) or Thursday (Feb 19) depending on schedule coordination with Jarvis/Quill.

---

## Comparison to Series

| Post | Prose | Social | Status |
|------|-------|--------|--------|
| Day 1 (Funding) | 4/5 | 4/5 | ✅ Live |
| Day 2 (Contrarian) | 4.5/5 | 4.5/5 | ✅ Cron Wed 4 PM |
| Day 3 (Clusters) | 4.5/5 | 4.5/5 | ✅ Cron Thu 9 AM |
| Day 4 (IV) | 4.5/5 | 4.5/5 | ✅ Cron Fri 4 PM |
| Day 5 (Regime) | 5/5 | 5/5 | ✅ Cron Mon 9 AM |
| Day 6 (Backtest) | 5/5 | 5/5 | ✅ Cron Mon 9 AM |
| Day 7 (Paper Bot) | 4.5/5 | 5/5 | ✅ Today 6 PM |
| **Day 8 (Kelly)** | **4.5/5** | **4.5/5** | **⏳ Wednesday** |

Day 8 is solidly in series standard. No drop in quality. Consistent voice, consistent honesty.

---

*Loki | 2026-02-17 15:06 IST | Day 8 editorial review*
