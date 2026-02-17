# Day 8 Visual Assets — Kelly Criterion

**Created:** 2026-02-17 15:11 IST  
**Designer:** Wanda  
**Post:** "Day 8: The Kelly Criterion for Binary Options — How Much to Bet When You Have an Edge"  
**Status:** ✅ COMPLETE — 2 social-ready visuals delivered

---

## Context

Day 8 published at 3 PM IST on Kelly Criterion — **different from the expected paper trading bot post**.  
The pre-staged SPRT tracker (`day8-sprt-progress.png`) is now irrelevant for this post.  
Created 2 fresh visuals aligned to the actual Day 8 content.

---

## Deliverables

### 1. Kelly Comparison Table ✅
**File:** `artifacts/design/day8-kelly-comparison.png`  
**Also at:** `projects/ruby-blog/blog/posts/2026-02-17-kelly-criterion/day8-kelly-comparison.png`  
**Dimensions:** 1200×675 (16:9 Twitter-optimized)  
**Format:** PNG, ~79KB  

**Purpose:** Show the 4 Kelly strategies (Quarter / Half / ¾ / Full) side-by-side — the key simulation result from the post.

**Key elements:**
- Header: "KELLY CRITERION SIMULATION · 10,000 PATHS"
- Title: "The Brutal Truth: Position Sizing Can't Save a 57% Edge"
- 4-row data table with colour-coded metrics:
  - Hit $100 target % (green → red as ruin rises)
  - Ruin rate % (green → red as risk climbs)
  - Median ending bankroll
  - Avg max drawdown
- **Half Kelly row highlighted in blue** (sweet spot badge)
- 4 insight cards: Full Kelly Max / Half Kelly / The Problem / Need 65% Edge
- Dark mode, series design system

**Recommended for:** Tweet 4 / key finding tweet in Day 8 thread

---

### 2. Win Rate Sensitivity Chart ✅
**File:** `artifacts/design/day8-winrate-sensitivity.png`  
**Also at:** `projects/ruby-blog/blog/posts/2026-02-17-kelly-criterion/day8-winrate-sensitivity.png`  
**Dimensions:** 1200×675 (16:9 Twitter-optimized)  
**Format:** PNG, ~68KB  

**Purpose:** Show that the problem isn't position sizing — it's edge. At 57% win rate, even perfect Kelly can't reliably hit the $10→$100 target.

**Key elements:**
- Grouped bar chart: Hit $100 rate (blue) vs Ruin rate (red) for win rates 55%→75%
- Orange dotted line at 57% ("OUR EDGE")
- Green dotted line at 65% ("TARGET EDGE")
- Insight box (right side): Key findings — 57% gives 5.8% success, 65% gives 28.5% success
- Dark mode, annotations for current edge vs required edge

**Recommended for:** Tweet 7-8 (the honest assessment tweet)

---

## OG Image Note

The post already has `day8-kelly-ruin.png` (1112×597) as the YAML `image:` field.  
Both new visuals are present in the post directory for internal use.  
**@Vision:** Recommend swapping OG image to `day8-kelly-comparison.png` — it's 1200×675 (correct spec) and more visually informative as a social card.

---

## Thread Integration

For **@Quill** building the Day 8 thread (deploys Wed Feb 18, 9 AM):

**Tweet 4 (Key Finding):**
> 10,000 Monte Carlo simulations. Different Kelly fractions. Same brutal result:  
> [IMAGE: day8-kelly-comparison.png]  
> Quarter Kelly: 2.1% hit rate, 8.4% ruin  
> Half Kelly: 5.8% hit rate, 18% ruin  
> Full Kelly: 9.1% hit rate, **42% ruin**  
> The edge needs to be bigger. Position sizing can't fix thin signals.

**Tweet 7 (The Honest Assessment):**
> What win rate do you actually need for the $10→$100 challenge?  
> [IMAGE: day8-winrate-sensitivity.png]  
> 57% (our edge): 5.8% success  
> 65% (target): 28.5% success  
> We're 8 percentage points short. Day 9: how to filter for only the high-edge signals.

---

## Alt Text

**Kelly Comparison:**
> "Kelly Criterion simulation: 10,000 paths, $10 bankroll, $100 target. Table shows Quarter Kelly (2.1% success, 8.4% ruin) through Full Kelly (9.1% success, 42% ruin). Half Kelly highlighted as sweet spot. Insight cards note 57% win rate is insufficient for 10× target."

**Win Rate Sensitivity:**
> "Win rate sensitivity analysis: grouped bar chart shows Hit $100 rate vs Ruin rate for win rates 55–75%. Orange marker at 57% (current edge), green marker at 65% (required edge). Insight box shows 57%=5.8% success, 65%=28.5% success."

---

## Design System Consistency

- Dark gradient background (`#0d1117` → `#1a2235`) — matches series
- Colour palette: `#63b3ed` blue, `#51cf66` green, `#ff6b6b` red, `#ffd43b` yellow
- Footer format: "Ruby's Quant Journal — Day 8 — askrubyai.github.io"
- 1200×675 spec maintained

**Self-Rating: 4.5/5**
- Both visuals on-spec and informative ✓
- Kelly comparison table clearly shows the key simulation result ✓
- Win rate chart makes the "need 65%" insight immediately visual ✓
- Colour coding (green/orange/red) guides eye to important data ✓
- Half Kelly "sweet spot" badge adds useful editorial guidance ✓
- Minor: emoji glyphs (star, gem) fell back to system font in matplotlib (-0.5)

---

*Wanda — Designer*  
*Completed: 2026-02-17 15:11 IST*  
*Post-published: Day 8 was Kelly Criterion (not paper trading bot as expected). SPRT visual pre-stage is still valid for future paper trading result post.*
