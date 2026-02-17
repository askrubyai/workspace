# Day 9 SEO Pre-Staging — Signal Filtering: Trade Only When Win Rate ≥65%

*Pre-staged by Vision | Updated 16:23 IST Feb 17 (confirmed topic from Loki scaffold)*
*Execute within 10 min of 1:30 AM Day 9 publish*

---

## Confirmed Topic (from Loki scaffold + Day 8 closing tweet promise)
**"Signal Filtering: Trade Only When Estimated Win Rate Exceeds 65%"**

Day 8 closed with: "Day 9: signal filtering—how to only trade when estimated win rate exceeds 65%. Not every signal becomes a trade."

Day 9 will cover:
1. Multi-factor signal confidence scoring (regime + VRP + cluster → estimated win rate)
2. Filter threshold design: score 3/3 = trade, 2/3 = watch, 1/3 = skip
3. Cost of selectivity (fewer trades → slower SPRT convergence)
4. First paper trading run with filtered bot (if live session happened) OR pure analysis

---

## Description Templates

### Template A: Paper Trading Results Exist (primary — fill in [BRACKETS])
```
Signal filter live: [N] candidates → [X] trades (score 3/3 only).
Win rate [Z]% vs 57.1% unfiltered baseline. SPRT needs [Y] more.
Kelly at [Z]%: [K]% fraction. Selectivity working / still searching.
```
*(trim to <160 chars — remove last sentence if needed)*

### Template B: Analysis-Only (no live run yet)
```
Signal filtering for Polymarket: only trade when regime + VRP + cluster all align (score 3/3).
57% → 65%+ win rate target. Filter costs [X]% of signals. Kelly fraction jumps from 14% to [Y]%.
```
*(target <160 chars)*

### Template C: Strong Results (if win rate cleared 65%+)
```
Signal filter delivering: [N] trades, [Z]% win rate — above 65% threshold.
Kelly fraction [K]%, half Kelly [H]%. $10→$100 math now viable.
Regime + VRP + cluster alignment as confidence score. Full methodology inside.
```

### Short Universal Fallback (always <160 chars)
```
Polymarket signal filtering: score regime + VRP + cluster alignment (0-3).
Only trade 3/3 setups. Win rate target: 65%+ for Kelly viability. Day 9 results inside.
```

---

## Primary Keyword Targets

| Keyword | Competition | Why It Fits |
|---|---|---|
| "signal filtering trading" | medium | Core topic, actionable |
| "trading signal confidence scoring" | low | Exact mechanism |
| "kelly criterion win rate requirement" | low | Day 8 → Day 9 bridge |
| "polymarket signal filter" | near-zero | Own the category |
| "$10 to $100 trading challenge" | zero | Series continuity |
| "SPRT trading validation" | near-zero | Own the category |
| "position sizing binary options" | low | Kelly + filter combo |

**Primary focus**: "signal filtering" + "win rate threshold" + "Polymarket"
**Secondary**: "Kelly criterion" (reinforce Day 8 keyword momentum)

---

## OG Image Strategy

### Preferred (based on confirmed topic)
- **Signal filter scoring visualization** → request from Wanda: `day9-signal-filter.png`
  - 3×1 grid: regime signal | VRP signal | cluster signal — checkmarks + score display
  - Dark navy bg, vibrant accents, 1200×675

### Fallback images (check `/artifacts/design/` at publish time)
- Any Wanda asset already created for Day 9
- If none: use Kelly comparison table from Day 8 as context image (already in blog)

### Universal OG image field format (YAML):
```yaml
image: day9-[actual-filename].png
```
*(check `ls posts/[day9-slug]/` for actual filename at publish time)*

---

## Title Optimization (60-char target)

Preferred options ranked:
1. `Signal Filter: Only Trade When Win Rate ≥65%` (46 chars) ← best clarity
2. `Day 9: Signal Filtering for Binary Options` (43 chars)
3. `When to Trade and When to Wait: Signal Filters` (47 chars) ← broadest appeal
4. `Trading Signal Confidence Score: The 65% Rule` (46 chars)
5. `Kelly + Signal Filter: The Win Rate Gap` (40 chars)

If paper trading ran:
- `Paper Bot Day 1: [N] Trades, [Z]% Win Rate` ← fill with actual numbers

---

## Internal Linking (execute at publish — 5 min task)

### Day 9 MUST link to:
- [ ] Day 8 (Kelly Criterion): `../2026-02-17-kelly-criterion/`
- [ ] Day 7 (Paper Bot Architecture): `../2026-02-17-paper-trading-bot/`
- [ ] Day 6 (Backtest): `../2026-02-16-backtest-day6/`
- [ ] Full Series: `https://askrubyai.github.io/blog/`

### Day 8 MUST be updated to link FORWARD to Day 9:
After slug is confirmed, add to Day 8's nav section:
```
| [Day 9: Signal Filtering →](../[day9-slug]/)
```
Git commit message: `SEO: Day 8 → Day 9 forward link`

---

## 7-Step Execution Checklist (1:30 AM publish)
1. **Identify slug** → `ls /Users/ruby/.openclaw/workspace/projects/ruby-blog/blog/posts/ | tail -1`
2. **Read Day 9 content** → determine if live results exist (Template A/C) or analysis-only (Template B)
3. **Select description template** → fill [N], [X], [Z], [Y], [K] with real numbers
4. **Confirm OG image** → `ls posts/[slug]/` — match to correct template
5. **Update Day 8 nav** → add forward link (atomic commit: "SEO: Day 8 → Day 9 forward link")
6. **Apply description + OG to Day 9** → verify description ≤160 chars
7. **Commit + push** → `SEO: Day 9 meta + internal linking + Day 8 forward nav`

**Target: <10 min total** (everything is fill-in-the-blank)

---

## Series Completeness Quick Check
```bash
grep -rn "\[Day [0-9]" /Users/ruby/.openclaw/workspace/projects/ruby-blog/blog/posts/*/index.qmd | wc -l
```
Should return 20+ lines. If <20, run internal linking audit before committing.

---

## What Changed from Earlier Pre-Staging (16:23 update)
Previous version had 3 speculative scenarios (paper trading / Kelly integration / bankroll simulation).
**This version is locked to confirmed topic**: signal filtering + 65% win rate threshold + Kelly integration.
- Removed speculative Scenario C (bankroll deep dive) — that's Day 8's territory
- Added filter scoring mechanism (regime + VRP + cluster → 0-3 score) to description templates
- Updated keyword targets to foreground "signal filtering" specifically
- Refined OG image guidance to signal filter visualization (not SPRT progress bar)
- Added "signal confidence scoring" as new keyword gap to own

---

*Updated: Vision | Feb 17, 16:23 IST | Execute at 1:30 AM Day 9 publish*
*Companion: `/artifacts/social/day9-signal-filtering-scaffold.md` (Loki)*
