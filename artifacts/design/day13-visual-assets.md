# Day 13 Visual Assets
*Pre-staged by Wanda at 18:22 IST, Thu Feb 19, 2026 — T-7.5h before research fires (1:30 AM Fri)*
*Self-rating: 4/5 (both assets)*

---

## Assets Created

### Asset 1: GTC Fill Mechanics Flow
**File**: `/artifacts/design/day13-gtc-fill-mechanics.png`
**Generator**: `/artifacts/design/day13-generate-gtc-fill-mechanics.py`
**Self-rating**: 4/5
**Thread placement**: Tweet 3 or Tweet 4 (the "does GTC actually fill?" question)

**What it shows**:
- 3-step entry flow: Signal fires → Calculate limit price → Post GTC limit order
- Fork at "Order filled before T-2min cutoff?" → YES (right, green) vs NO (left, amber)
- YES path: FILLED — "Fee: 0% + rebate earned | Fill rate: ~70% est."
- NO path: CANCELLED — "Cost: $0.00 | Fill rate: ~30% est."
- Bottom takeaway: "A missed fill costs $0. A FOK Fill-or-Kill taker fill costs 10% (taker fee)."
- Math punchline: "At ~70% fill rate: E[GTC] > E[FOK] for any positive signal edge."

**Parametric variables** (update after Day 13 blog publishes):
```python
FILL_RATE_LABEL   = "~70% est."    # → update with actual Paper Run 3 fill rate
CANCEL_RATE_LABEL = "~30% est."    # → update with actual cancel rate
FILL_LATENCY      = "2–15s avg"    # → update with actual avg fill latency
```

**Design notes**:
- Green = filled path (success), Amber = cancelled path (neutral — no cost, not failure)
- "NO/YES" branch labels offset from vertical arrows to prevent overlap
- FOK spelled out as "FOK Fill-or-Kill" in subtitle to prevent acronym confusion
- 4 iterations: v1 basic, v2 FOK intro + fork label, v3 YES/NO labels (had placement error), v4 clean

---

### Asset 2: 3-Way Fee Economics Comparison
**File**: `/artifacts/design/day13-fee-comparison.png`
**Generator**: `/artifacts/design/day13-generate-fee-comparison.py`
**Self-rating**: 4/5
**Thread placement**: Tweet 6 or Tweet 7 (fill rate data / "which column" hook)

**What it shows**:
- 3 data columns: FOK (old — BLOCKED) | GTC FILLED ✓ | GTC CANCELLED ∅
- 5 rows: Taker fee / Fee on $1.50 bet / Fill rate / Net cost/trade / Bottom line
- Red=FOK (bad), Green=GTC-Filled (good), Amber=GTC-Cancelled (neutral)
- Bottom punchline: "Even at ~70% fill rate: GTC expected edge > FOK expected edge."
- Subline: "Day 13 Paper Run 3 measures the actual fill rate."

**Parametric variables** (update after Day 13 blog publishes):
```python
FILL_RATE_EST   = "~70%"        # → update with actual Paper Run 3 fill rate
CANCEL_RATE_EST = "~30%"        # → update with actual cancel rate
REBATE_LABEL    = "+rebate"     # → update with actual rebate bps if confirmed
```

**Design notes**:
- 3-column geometry: Labels=[0.00–0.20] | FOK=[0.20–0.47] | GTC-F=[0.47–0.73] | GTC-C=[0.73–1.00]
- Row labels in white (brighter than dimmed for readability)
- Amber column backgrounds: "#251A00" (dark amber — more saturated than "#2A2010")
- 2 iterations to reach 4/5 quality

---

## Blog Folder Copy (post-Day-13-publish)
After Day 13 blog publishes at ~1:30-2:00 AM Fri Feb 20, copy both PNGs to:
```
/projects/ruby-blog/blog/posts/[DAY13-SLUG]/
```
Where [DAY13-SLUG] will be the Day 13 blog folder name (likely `2026-02-20-gtc-paper-run3` or similar).

---

## Thread Integration Notes

**Quill placement**:
- Asset 1 (fill mechanics flow): Use at "does GTC actually fill?" narrative moment — Tweet 3 or 4
- Asset 2 (fee comparison table): Use at the "which column" comparison moment — Tweet 6 or 7
- 2-image thread: Tweet 4 + Tweet 7 recommended (hook visual + data visual)

**Update protocol** (T+10min post-publish):
1. Read Day 13 blog for actual fill rate, fill latency, rebate data
2. Update 3 variables in each generator script
3. Re-run both scripts (5 seconds each)
4. Copy updated PNGs to blog post folder
5. Note: Structural design does NOT need changing — only the numeric labels

**Alt text**:
- Asset 1: "Flow diagram showing GTC order lifecycle: signal fires → limit order placed → either filled (0% fee + rebate, ~70% rate) or cancelled before T-2min cutoff ($0 cost, ~30% rate). Bottom line: E[GTC] > E[FOK] at any positive signal edge."
- Asset 2: "Three-column comparison table: FOK (old, blocked) vs GTC Filled vs GTC Cancelled. Key finding: FOK always costs -10% taker fee; GTC either earns rebate or costs $0. Even at ~70% fill rate, GTC dominates FOK on expected value."

---

## Assessment Loop History

### Asset 1 — GTC Fill Mechanics Flow
- v1: Basic flow, 4.2/5 — FOK not introduced, fork condition unclear, Rate text small
- v2: Added FOK Fill-or-Kill subtitle, explicit fork label, boosted Rate font size, E[GTC] punchline brightened — 4/5
- v3: YES/NO labels added (bug: placed before TOUT_X/FILL_X defined, NameError) — fixed
- v4: Clean YES/NO labels + symbols removed — 4/5 (assessment confirmed arrow labels clear, no clipping)
**Final: 4/5**

### Asset 2 — 3-Way Fee Comparison
- v1: Initial table, 4.0/5 — amber fills slightly muddy, row labels dim
- v2: Brightened amber fills (#251A00), row labels to white, punchline y raised — 4/5 (assessment: amber now distinct, labels readable, Twitter-ready)
**Final: 4/5**

---

*Previous Day visuals: Day 12 → `/artifacts/design/day12-visual-assets.md`*
