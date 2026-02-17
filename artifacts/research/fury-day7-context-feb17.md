# Fury Research: Day 7 Context + Day 8 Pre-Brief
*Compiled: Feb 17, 2026 — 12:25 PM IST*
*Self-rating: 3.5/5 (rate-limited mid-research; findings actionable)*

---

## 🎯 CRITICAL: Day 7 Accuracy Audit

### Claim: "Polymarket dropped fees to 0/0 bps"
**Verdict: ACCURATE for the specific markets Ruby trades. Confidence: HIGH.**

**Evidence:**
- Polymarket docs confirm: `fee-rate` API returns `{"fee_rate_bps": 0}` for fee-free markets
- Ruby's BTC/ETH/SOL/XRP Chainlink series (IDs: 10192, 10191, 10423, 10422) are existing token IDs on the standard CLOB
- The 3% taker fee Ruby was hitting before = the dynamic fee CURVE on 5M/15M markets (confirmed Jan 2026 introduction)
- The `crypto_prices_chainlink` RTDS topic confirms these are the binary crypto markets — which were fee-enabled under the curve, then dropped back to 0 bps (this is the discovery)

**Nuance for engagement (if asked):**
- The fee CURVE (up to 3.84% at p=0.50) applies to NEW markets as they're created
- Existing BTC Chainlink series markets are fee-free currently
- "The 0% window is TEMPORARY — Polymarket is actively expanding fees to new markets"

---

## 🔥 NEW BREAKING NEWS: Polymarket Expanding Fees Tomorrow (Feb 18)

**This is separate from, but related to, Day 7's story.**

Starting **00:00 UTC Wednesday Feb 18, 2026 (TOMORROW)**:
- NCAAB (college basketball) markets → fee-enabled for all NEW markets
- Serie A (soccer) markets → fee-enabled for all NEW markets
- **Existing events: NOT affected**

**Source:** Bitget News (4 days ago), Polymarket docs changelog, confirmed by Polymarket official docs.

**What this means for Day 7 narrative:**
- The fee-free window is **NOT permanent** — it's narrowing as Polymarket monetizes
- The 0% finding is time-sensitive: "Strike while the iron is hot"
- This adds urgency to the entire trading strategy thesis
- Good reply point if anyone asks "why not just wait for fees to settle?"

**Day 7 thread opportunity (post-6PM engagement):**
If anyone mentions "Polymarket is adding fees," can clarify: "Yes — to NEW sports markets. The BTC/ETH/SOL/XRP chainlink CLOB markets (what my bot trades) still run at 0/0 bps. But you're right that the landscape is shifting — which is why forward-testing matters NOW."

---

## 🏆 Competitor Intelligence: QuantJourney Substack (1 week ago)

**Piece title:** "Understanding the Polymarket Fee Curve & Building a Dual-Loop Trading Architecture"
**Source:** quantjourney.substack.com

**Key difference from Ruby's approach:**
- QuantJourney covers the fee CURVE mechanics (good engineering piece)
- QuantJourney doesn't appear to address the 0/0 bps opportunity (they write about navigating fees, not exploiting fee-free windows)
- Ruby's "honest backtest" approach (n=14, too small!) is NOT present in competitor content
- QuantJourney focuses on traditional perps/futures, not binary prediction markets

**Positioning insight (HIGH confidence):**
Ruby's blue ocean remains intact. QuantJourney = technical execution piece. Ruby = rigorous quantitative research with honest P&L analysis and reproducible methodology. Different audiences, different value.

**Use in Day 7 engagement:** No direct conflict. Can acknowledge QuantJourney if mentioned as "covering different aspects — their fee curve engineering vs my edge quantification."

---

## 🧪 SPRT Community Validation (for Day 8 at 3 PM)

**SPRT is well-established and trusted by the tech industry. Confidence: HIGH.**

**Evidence:**
- Used by **Statsig, Netflix, LinkedIn** for A/B testing infrastructure
- Standard Wikipedia treatment exists
- "No penalty for peeking" = key advantage vs fixed-sample tests
- ~40-60% fewer samples needed vs traditional hypothesis testing (under H0)

**Credibility signal for Day 8:**
"SPRT is the same methodology Netflix uses to stop A/B tests early when results are clear. Adapting it for prediction market edge validation is a natural fit."

**Critical honest challenge to include (increases credibility):**
- SPRT assumes **IID (independent, identically distributed)** observations
- Market trades may NOT be IID: sequential trades on correlated assets, same signal environment
- This is an honest limitation worth flagging in Day 8 content
- Suggested framing: "SPRT gives us the minimum sample (120 trades) — but IID violations from market autocorrelation may require more. Call it 150-200 for safety."

**Day 8 narrative hook:**
"Netflix stops A/B tests early with SPRT. I'm doing the same for trading edge validation. Here's what happened when the bot actually ran."

---

## 🎯 Engagement Targets for Post-Day 7 Twitter (6 PM → 8 PM window)

### Priority 1: @GreekGamblerPM (HIGHEST)
- Mirror account: runs #150to50k challenge (Ruby runs $10→$100 weekly)
- Posted about Polymarket fees yesterday (Feb 16, 30+ likes)
- **Engagement angle:** "Seen your #150to50k — I'm running a $10→$100 weekly challenge (same DNA, different scale). Just found the fee drop makes it viable. Would love to compare notes."
- **Risk:** Low. Genuine shared interest. Not spam.

### Priority 2: @IamAdamSchulz (HIGH) — Quill already has draft
- "Illegal fees" tweet Feb 16 (30 likes, 5 RTs) — about fee curve on new markets
- Quill's reply distinguishes CLOB vs dynamic curve — factually sound
- **Now more precise with Feb 18 context:** "Actually that's NCAAB/Serie A starting tomorrow. BTC/ETH CLOB chainlink markets are still at 0/0 bps — which is exactly what my strategy needs."

### Priority 3: r/PolymarketTrading (Reddit — most impactful)
- Bot community is ACTIVE there (51-comment thread in past 2 weeks)
- Day 7 Reddit post (Quill + Loki prepared) — HIGH priority, post before 6 PM
- The fee drop finding will hit this audience directly (they track this exact issue)

---

## 📊 Summary for Jarvis/Quill

1. **Day 7 is accurate** — no corrections needed. The 0/0 bps finding is real for existing BTC Chainlink CLOB markets.

2. **New angle available:** Polymarket is EXPANDING fees to sports tomorrow (Feb 18). Adds urgency to Day 7 narrative. "The window is open NOW."

3. **SPRT credibility for Day 8 is solid** — Netflix/LinkedIn connection is a strong framing hook.

4. **IID limitation is an honest critique** — include in Day 8 for credibility, suggest 150-200 trade buffer.

5. **QuantJourney competitor exists** but different positioning — not a threat, actually validates the space.

---

*Lesson: When doing fee research, always check both the current token-ID level AND the platform's expansion roadmap. Fee landscapes change quarterly.*
