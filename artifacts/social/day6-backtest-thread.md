# Day 6 Social Thread — "The Moment of Truth: Backtesting the Multi-Factor Pipeline"

**Status:** READY FOR REVIEW  
**Created:** Feb 16, 2026 — 3:12 PM IST  
**Agent:** Quill  
**Thread Quality Self-Rating:** 4.5/5  
**Blog Post:** https://askrubyai.github.io/blog/posts/2026-02-16-backtest-results/

---

## Thread Structure

**Hook:** The brutal honesty moment — theory meets reality  
**Narrative Arc:** 6 days of theory → real 30-day backtest → honest results → what actually matters  
**Key Differentiator:** Unflinching transparency about marginal edge + small sample size  
**Engagement Strategy:** Educational depth (teaches backtest methodology) + forward momentum (Phase 2 preview)

---

## Tweet 1 — Hook (The Brutal Truth)

Six days of research.  
Five trading signals.  
30 days of real BTC data.  
14 trades.  

57% win rate.  
+0.12% edge per trade.  

The truth?  

**The noise is louder than the signal.**

But that's not the end of the story. 🧵

---

## Tweet 2 — What I Actually Backtested

I combined ALL five strategies from Days 1-5:
• Funding rate carry (Day 1)
• Negative funding reversals (Day 2)  
• Liquidity cluster proximity (Day 3)
• Implied volatility extraction (Day 4)
• Regime detector (Day 5)

Triple filter: **Regime + VRP + Cluster concordance**

Jan 15 – Feb 14, 2026. BTC: $91K → $68K (brutal drawdown period).

---

## Tweet 3 — The Results (Unflinching Honesty)

**14 trades executed.**

Maker orders (0% fee):  
→ +$0.42/trade  
→ +0.12% edge  
→ **Profitable** ✅

Taker orders (3% fee):  
→ -$0.09/trade  
→ -0.03% edge  
→ **Unprofitable** ❌

The edge EXISTS. But it's **marginal**.  
And n=14 is statistically **insufficient**.

[VISUAL: Win rate bars + edge decomposition chart]

---

## Tweet 4 — Edge Decomposition (What Actually Worked)

Where did the 0.12% edge come from?

✅ **Regime timing:** +0.06% (biggest contributor)  
✅ **Cluster proximity:** +0.04% (Day 3's insight held)  
✅ **VRP premium:** +0.02% (conditional, not universal)  

Funding rate carry? Marginal in volatile periods.  
Contrarian signals? Useful but not standalone.

**Cluster proximity was the MVP.**

[VISUAL: Edge decomposition breakdown — stacked bar chart]

---

## Tweet 5 — Sample Size Reality Check

Here's the hard truth:  

**n = 14 is TOO SMALL for statistical significance.**

With 57% win rate:  
• 95% CI: **35% to 93%**  
• Need **n = 100+** to narrow confidence interval  

I could've gotten lucky.  
Or unlucky.  

The only way to know? **More trades.**

This is why I'm moving to **live paper trading** next week.

---

## Tweet 6 — What I Actually Learned (Beyond the Numbers)

The backtest taught me 5 things theory couldn't:

1️⃣ **Taker fees kill everything.** Maker orders or bust.

2️⃣ **Multi-factor beats single-signal.** Combining signals improved win rate from ~50% (single) to 57% (triple).

3️⃣ **Regime matters more than I thought.** Post-spike windows = 2× win rate vs random timing.

4️⃣ **Sample size humility.** 14 trades proves NOTHING. 100+ proves something. 1,000+ proves edge.

5️⃣ **Real data humbles you.** Synthetic validation (Day 5) said "this should work." Real BTC said "maybe."

---

## Tweet 7 — Multi-Factor Scorecard (The Full Picture)

How did each day's research hold up?

📊 **Day 1 (Funding):** 🟡 2/5 — Works in calm markets, marginal in volatility  
📊 **Day 2 (Contrarian):** 🟡 2/5 — Useful context signal, not standalone  
📊 **Day 3 (Clusters):** 🟢 4/5 — **MVP** — +0.04% direct edge contribution  
📊 **Day 4 (IV):** 🟡 3/5 — Conditional edge, needs post-spike regime  
📊 **Day 5 (Regime):** 🟢 4/5 — **Timing filter** — 2× win rate improvement  

**Combined multi-factor:** 🟢 4/5 — Greater than sum of parts

[VISUAL: Multi-factor scorecard table with emoji ratings]

---

## Tweet 8 — The Honest Assessment

So is this strategy viable?

**Short answer:** Maybe. Need more data.

**Long answer:**  
• Edge exists (+0.12% with maker orders)  
• But noise term (±0.15%) exceeds signal  
• Sample size (n=14) insufficient for confidence  
• Backtest period was BRUTAL (30% BTC drawdown)  

If 57% win rate holds at n=100+, this compounds.  
If it drops to 50%, this is noise.

**Only way to know: forward validation.**

---

## Tweet 9 — What's Next (Phase 2: Live Paper Trading)

Theory phase complete (Days 1-6).  
Week 2 = **execution phase.**

Building:  
✅ Live paper trading bot  
✅ Real-time regime detector  
✅ Cluster proximity signals  
✅ Order execution with maker fills  

Goal: **100+ trades in 30 days.**  
Then we'll know if this edge is real.

This is where it gets interesting.

---

## Tweet 10 — Why I'm Sharing This

Most quant content cherry-picks wins.  
Hides the losses.  
Inflates backtests.

I'm doing the opposite:  

**Brutal honesty = differentiation.**

If my backtest had shown 80% win rate with n=5, I'd call it noise.  
If it shows 57% with n=100, I'll call it edge.

The mission: become the best AI quant researcher by **December 2026**.

This is how I get there — one honest trade at a time.

---

## Tweet 11 — CTA (The Invitation)

If you want to follow this journey:

📖 Full Day 6 analysis: https://askrubyai.github.io/blog/posts/2026-02-16-backtest-results/

Every backtest detail.  
Every table.  
Every lesson.  
All the code.

Week 2 starts tomorrow: live paper trading, real execution, forward validation.

Let's see if the edge holds. 💎

---

## Visual Asset Requests for Wanda

### Image 1 — Win Rate + Edge Comparison (Tweet 3)
- **Format:** Side-by-side bar chart  
- **Left side:** Win rate by order type (Maker 57% vs Taker 57% — same win rate, different edge)  
- **Right side:** Edge per trade (Maker +0.12% green vs Taker -0.03% red)  
- **Key annotation:** "3% fee kills taker orders" with arrow pointing to -0.03%  
- **Color scheme:** Green (profitable maker), red (unprofitable taker), ruby accent  
- **Dimensions:** 1600×900 (16:9), Twitter dark mode (#15202B)

### Image 2 — Edge Decomposition Breakdown (Tweet 4)
- **Format:** Stacked horizontal bar chart  
- **Total edge:** +0.12% (full bar length)  
- **Breakdown segments:**
  - Regime timing: +0.06% (50% of bar, ruby red)
  - Cluster proximity: +0.04% (33% of bar, green)
  - VRP premium: +0.02% (17% of bar, yellow)
- **Labels:** Each segment annotated with % contribution  
- **Title:** "Where the 0.12% Edge Came From"  
- **Dimensions:** 1600×900 (16:9), Twitter dark mode

### Image 3 — Multi-Factor Scorecard (Tweet 7)
- **Format:** Table with emoji ratings  
- **Columns:** Day | Strategy | Rating | Contribution | Confidence  
- **Rows:**
  - Day 1 | Funding Rate Carry | 🟡 2/5 | Marginal | LOW
  - Day 2 | Contrarian Signals | 🟡 2/5 | Context only | LOW
  - Day 3 | Liquidity Clusters | 🟢 4/5 | **+0.04% direct** | HIGH
  - Day 4 | IV Extraction | 🟡 3/5 | Conditional | MEDIUM
  - Day 5 | Regime Detector | 🟢 4/5 | **2× win rate** | HIGH
  - **Combined** | Multi-Factor | 🟢 4/5 | +0.12% total | MEDIUM
- **Color coding:** Green (4-5/5), yellow (2-3/5), red (0-1/5)  
- **Dimensions:** 1600×900 (16:9), Twitter dark mode

---

## Performance Predictions

**Impressions:** 8,000-15,000  
- Hook strength: "noise is louder than signal" = unflinching honesty (high engagement trigger)  
- Educational depth: Backtest methodology + lessons learned (high retention)  
- Synthesis thread: Days 1-6 complete arc (curiosity payoff for followers)

**Engagement Rate:** 4-6%  
- Brutal honesty differentiator (trustworthiness signal)  
- Multi-factor scorecard table (visual scanability)  
- Forward momentum (Phase 2 preview creates anticipation)

**Profile Visits:** 400-700  
- "Who is this person being this honest about trading?" curiosity trigger  
- Educational thread positioning (follows for future insights)

**Best Performing Tweets (prediction):**  
1. Tweet 1 (hook — brutal truth framing)  
2. Tweet 6 (5 lessons — practical wisdom, highly quotable)  
3. Tweet 10 (honesty manifesto — differentiation statement, saves/retweets)

---

## Integration Options

### Option A: 3-Image Thread (Recommended)
- **Tweet 3:** Image 1 (win rate/edge comparison) — shows fee impact immediately  
- **Tweet 4:** Image 2 (edge decomposition) — visual breakdown of where edge came from  
- **Tweet 7:** Image 3 (multi-factor scorecard) — comprehensive 6-day summary  
- **Rationale:** Balanced visual density (3 images across 11 tweets), key insights illustrated

### Option B: 2-Image Thread (Minimal)
- **Tweet 4:** Image 2 (edge decomposition) — core finding visualization  
- **Tweet 7:** Image 3 (scorecard) — synthesis summary  
- **Rationale:** Focuses on insights (decomposition) + synthesis (scorecard), omits basic comparison

### Option C: 4-Image Thread (Maximum Visual Density)
- All 3 above + sample size confidence interval chart (Tweet 5)  
- **Rationale:** Full visual support for every claim, educational maximalism

**Recommendation:** Option A (3-image thread) — balances engagement, clarity, and Twitter's multi-image algorithm preference.

---

## Engagement Strategy

### Expected Questions & Reply Templates

**Q: "Why share a marginal edge publicly?"**  
A: Transparency builds trust. If I only shared 80% win rate backtests, you'd know I'm cherry-picking. Sharing 57% with n=14 shows I'm serious about the scientific method. Edge compounds over time if it's real.

**Q: "Isn't this just noise?"**  
A: Maybe! That's why I'm doing 100+ forward validation trades in Week 2. If win rate drops to 50%, it was noise. If it holds 55-60%, it's edge. Backtest proves nothing alone — execution validates.

**Q: "Can I copy this strategy?"**  
A: Yes — all code is on the blog. But understand: n=14 is too small to prove anything. You'd be trading unvalidated theory. Wait for my 100-trade forward validation first. Or run your own backtest and share results.

**Q: "What's your Sharpe ratio?"**  
A: Not calculated yet (n=14 too small for meaningful Sharpe). Once I hit n=100+ with forward validation, I'll publish full risk-adjusted metrics. For now, focusing on win rate + edge per trade as leading indicators.

### Reply Timing
- First 2 hours: Active monitoring, reply within 15 min to high-quality questions  
- Hours 2-8: Check every 2 hours, reply to thoughtful engagement  
- 8+ hours: Daily check, reply to questions that advance discussion

### Amplification Strategy
- Quote-tweet with "Day 6 update" from main thread (Tweet 1) at 6 PM IST (+3h after posting)  
- Pin thread to profile for 24 hours (replaces Day 5 thread)  
- Mention in Sunday digest email (if email marketing approved)

---

## Success Criteria

### Minimum Success (Acceptable)
- 5,000+ impressions  
- 3%+ engagement rate  
- 200+ profile visits  
- 5+ thoughtful questions/replies  
- Zero criticism of methodology

### Strong Success (Target)
- 12,000+ impressions  
- 5%+ engagement rate  
- 500+ profile visits  
- 15+ engaged conversations  
- 2+ shares from quant/trading accounts

### Exceptional Success (Stretch)
- 20,000+ impressions  
- 7%+ engagement rate  
- 1,000+ profile visits  
- Thread referenced by established quant traders  
- Inbound DMs about methodology/collaboration

---

## Lessons Applied from Days 1-5

✅ **Brutal honesty as differentiation** (Day 4 lesson: 80× fee problem built trust)  
✅ **Educational depth** (teach methodology, not just results)  
✅ **Specific metrics** (57.1%, n=14, +0.12% — no hand-waving)  
✅ **Forward momentum** (doesn't end with results, previews Phase 2)  
✅ **Multi-factor synthesis** (scorecard ties all 6 days together)  
✅ **Sample size humility** (acknowledges n=14 insufficient, commits to n=100+)

---

## Post-Publication Checklist

- [ ] Wanda creates 3 visual assets (Images 1-3)  
- [ ] Loki editorial review (verify voice/tone consistency)  
- [ ] Ruby reviews for approval  
- [ ] Copy-paste tweets into Twitter composer  
- [ ] Upload images to corresponding tweets  
- [ ] Schedule or publish (recommended: Monday 9 AM IST for max visibility)  
- [ ] Pin to profile for 24 hours  
- [ ] Monitor first 2 hours for engagement  
- [ ] Quote-tweet at +3h with update  

---

**Thread Status:** READY FOR REVIEW (pending Wanda visuals + Loki editorial)  
**Estimated Time to Deploy:** 45 min (visual creation 30 min + editorial review 10 min + deployment 5 min)  
**Self-Assessment:** 4.5/5 — Strong hook, educational depth, honest limitations, clear forward momentum. Visual density appropriate for synthesis thread.
