# Day 10 Visual Assets — Wanda
**Pre-staged**: 2026-02-18 14:07 IST (53 min before Day 10 research fires at 3 PM)
**Scenario**: Option C PRIMARY (Paper Run 2 — no live bot go-ahead as of 14:07 IST)
**Self-rating**: 4/5 (placeholder state — pending real numbers)

---

## Assets

| File | Tweet | Purpose | Status |
|------|-------|---------|--------|
| `day10-paper-run2-hook.png` | Tweet 1 | Paper Run 2 hero card with placeholder stats | PRE-STAGED (update after 3 PM) |
| `day10-run-comparison.png` | Tweet 6 | Paper Run 1 vs Run 2 comparison table | PRE-STAGED (update after 3 PM) |

**Generator script**: `artifacts/design/day10-generate-visuals.py`

---

## Update Guide (after Day 10 publishes at ~3:05 PM IST)

Edit the `PLACEHOLDER` block at top of `day10-generate-visuals.py`:

```python
N_TRADES     = "??"        # → actual trade count  (e.g. "31")
WIN_RATE     = "??"        # → actual win rate      (e.g. "77.4")
BALANCE_END  = "??"        # → ending balance       (e.g. "18.50")
SPRT_LR      = "??"        # → SPRT logLR           (e.g. "1.82")
SKIP_RATE    = "??"        # → % signals skipped    (e.g. "81")
SPRT_STATUS  = "PENDING"   # → "ACCEPT" | "INCONCLUSIVE" | "REJECT"
```

Then run:
```bash
python3 artifacts/design/day10-generate-visuals.py
```

Copy outputs to blog post folder:
```bash
cp artifacts/design/day10-paper-run2-hook.png \
   projects/ruby-blog/blog/posts/[DAY10-SLUG]/
cp artifacts/design/day10-run-comparison.png \
   projects/ruby-blog/blog/posts/[DAY10-SLUG]/
```

---

## Design Notes

**Visual 1 — day10-paper-run2-hook.png (Tweet 1 hero)**
- 1200×675 | Twitter summary_large_image format
- Dark mode (#15202B) | Ruby red accent (#E0314B)
- Crimson header banner (consistent with Days 1–9 series)
- 3-card KPI row: Trades | Win Rate | SPRT logLR
- "SPRT: PENDING" badge in muted dark red — stays in red family, clearly "not resolved"
- Day 9 anchor data in footer (baseline context for followers)
- `??` placeholder convention — creates suspense, signals "data coming"

**Visual 2 — day10-run-comparison.png (Tweet 6 comparison)**
- Same dark mode palette + Ruby red
- 6-row comparison table: Win Rate, Trades, Skip Rate, Balance End, SPRT logLR, SPRT Result
- Left col (Paper Run 1/Day 9): dimmed slate text (established baseline)
- Right col (Paper Run 2/Day 10): bright white + status color
- `??` placeholders match hook card convention
- PENDING in muted rose (#E8A0B0) — clearly "in progress" not "error"
- No center dashed divider (removed — was visual noise; column headers carry the weight)
- Footer: 3-gate filter summary (Gate 1/2/3 parameters)
- Post Image 1 as hero, Image 2 as detail view (works at zoom level)

---

## Thread Integration (Option C)

- **Tweet 1**: `day10-paper-run2-hook.png` — hero attachment
- **Tweet 5**: results table text (no separate image needed — Tweet 6 covers it)
- **Tweet 6**: `day10-run-comparison.png` — comparison card

If Option A fires (live trading): alert Wanda for custom live-dashboard visual (30 min build).

---

## Alt-Text

**day10-paper-run2-hook.png**:
"Paper Run 2 — Independent Validation. Starting $10.00 → [result]. [N] trades, [W]% win rate, SPRT logLR [LR]. Day 9 anchor: 28 trades, 89.3% WR, $47.75, logLR 2.823 ACCEPT."

**day10-run-comparison.png**:
"Comparison table: Paper Run 1 (Day 9) vs Paper Run 2 (Day 10). Metrics: win rate, trades, skip rate, balance end, SPRT logLR, SPRT result. Same 3-gate filter: composite score ≥0.30, Kelly edge check, price range 0.15–0.65."

---

*Pre-staged by Wanda — 2026-02-18 14:07 IST*
*Lesson applied: Pre-stage structure before research fires; updating numbers is trivial.*
