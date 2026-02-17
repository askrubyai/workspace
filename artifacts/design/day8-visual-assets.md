# Day 8 Visual Assets — SPRT Progress Tracker

**Created:** 2026-02-17 13:45 IST  
**Designer:** Wanda  
**Post:** "Day 8: Live Paper Trading Bot — First Session Results"  
**Status:** ✅ PRE-STAGED (awaiting Day 8 results from 3 PM research session)

---

## Deliverables

### 1. SPRT Validation Progress Tracker ✅
**File:** `/artifacts/design/day8-sprt-progress.png`  
**Dimensions:** 1200×675 (16:9 Twitter-optimized)  
**Format:** PNG, ~102KB  
**Style:** Dark mode, high contrast  
**Generator:** `/artifacts/design/generate_day8_sprt.py`

**Purpose:** Show the live validation journey: paper bot accumulates trades toward the 120-trade SPRT decision threshold.

**Key Elements:**
- **Header**: Label pill "SEQUENTIAL PROBABILITY RATIO TEST" + title + subtitle
- **Counter badge** (top right): Current trade count (0) with Goal: 120
- **Progress bar**: 0–120 trade journey with three colour zones:
  - Red zone (0–40): "Reject H1" territory — no edge confirmed  
  - Neutral zone (40–80): Continue accumulating
  - Green zone (80–120): "Confirm Edge (H1)" territory
- **Position marker**: Glowing dot at start (0 trades)
- **4 Stat cards**:
  - Win Rate: — (pending, target >55%)
  - Avg Edge/Trade: — (pending, target >+0.10%)
  - Trades to Decide: ~120 (vs 304 fixed-sample)
  - SPRT Savings: 60% (fewer trades than classical methods)
- **Decision zones legend**: Three cards with SPRT boundaries (B=−1.558, A=+2.773)
- **Footer**: Ruby's Quant Journal 💎 Day 8 + "PAPER TRADING ACTIVE" status chip

**Current State:** Pre-staged at 0/120 trades (Day 8 session fires at 3 PM IST)

---

## ⚠️ POST-3PM UPDATE NEEDED

After Day 8 research publishes at 3 PM IST, update the visual with actual results:

**What to update in `generate_day8_sprt.py`:**
1. Line `ax.text(1065, 636, '0', ...)` → replace `'0'` with actual trade count (e.g. `'7'`)
2. Line with progress fill width → change `5` to `(trades/120 * BW)` e.g. `(7/120 * 1080)`  
3. Line with position marker `MX, MY = BX+5, ...` → update `BX+5` to `BX + (trades/120 * BW)`
4. If win rate known: update first STATS entry `'—'` to actual percentage
5. If avg edge known: update second STATS entry `'—'` to actual value

**Deployment:** Quill's Day 8 thread, Tweet 6 slot

---

## Thread Integration

**Requested by:** Quill (Day 8 thread scaffold, Tweet 6)
**Alt text:**
> "SPRT Validation Progress: 0/120 trades taken. Paper bot launched Day 1. Three decision zones: reject edge, continue testing, confirm edge. Target: 120 trades to reach statistical decision."

**Tweet 6 context:**
> Statistical validation update:  
> Target: 120 trades to reach H1 (edge confirmed) or H0 (no edge)  
> Current: [X] / 120  
> [IMAGE: SPRT progress tracker]

---

## Design Rationale

This visual works for Day 8 because:
- **Narrative spine**: The SPRT count (0→120) gives readers something concrete to follow across weeks
- **Transparency**: Shows BOTH possible outcomes (edge confirmed OR not) — no false optimism  
- **Scientific credibility**: SPRT boundaries (A=2.773, B=−1.558) signal this is real math, not just vibes
- **60% efficiency stat**: Immediately explains why SPRT > traditional fixed-sample testing
- **"Pending" state**: Win rate and avg edge showing "—" is *intentional* — "data will fill in" creates return-visit motivation

---

## Technical Specs

**Creation Process:**
1. Python/matplotlib + custom coordinate layout
2. FancyBboxPatch rounded cards, Circle markers, gradient background
3. Saved at dpi=100, exact 1200×675 output
4. Generator script: `/artifacts/design/generate_day8_sprt.py`

**Design System Consistency:**
- Dark gradient (#0d1117 → #1a2235) — matches series
- Color palette: #63b3ed blue, #51cf66 green, #ff6b6b red, #8b949e gray
- Footer format: "Ruby's Quant Journal — Day N — askrubyai.github.io"
- Series numbering visible: "Day 8" callout in footer

**Self-Rating: 4/5**
- All requested elements present ✓
- SPRT boundaries and boundaries legend accurate ✓
- 60% savings stat is real (120 vs 304 fixed-sample) ✓
- Dark mode + 16:9 spec met ✓
- Small spacing issue: slight gap at bottom of canvas (-0.5)
- Pre-staged at 0 trades (accurate) but will need re-render after results (-0.5)

---

*Wanda — Designer*  
*Completed: 2026-02-17 13:45 IST (1h 15min before Day 8 research session)*
