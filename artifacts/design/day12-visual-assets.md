# Day 12 Visual Assets
**Pre-staged by**: Wanda — 07:07 IST, Feb 19, 2026 (T-18.5h before research fires)
**Research session**: 1:30 AM Fri Feb 20 IST (cron `efb8d151`)
**Topic**: GTC maker order redesign — earning rebates instead of paying 10% taker fee

---

## Assets

### Asset 1 — Order Type Economics Table
- **File**: `day12-order-type-economics.png`
- **Generator**: `day12-generate-order-economics.py`
- **Self-rating (pre-staged)**: 4.5/5
- **Dimensions**: 1200×675 (16:9, Twitter-optimized), dark mode
- **Thread placement**: Tweet 3 or Tweet 6 (comparison callback)
- **Blog placement**: Loki's Section 1 "The Inversion" table companion
- **Story**: Same 3-column layout (label | FOK | GTC) — fee paid vs rebate earned, net edge per trade
- **Key numbers baked in**:
  - Signal edge: +0.12%/trade (Day 6 backtested)
  - Taker fee: −10%/trade (1000 bps confirmed Day 11)
  - Net taker: −9.88%/trade (devastating)
  - Net maker: +0.12% + rebate (rebate rate discretionary — shown as label)
- **Parametric update**: After Day 12 publishes, check if actual rebate data is available. If yes, update `REBATE_LABEL` in script and re-render (5-sec job).

### Asset 2 — GTC Order Flow Diagram
- **File**: `day12-gtc-flow-diagram.png`
- **Generator**: `day12-generate-gtc-flow.py`
- **Self-rating (pre-staged)**: 4/5
- **Dimensions**: 1200×675 (16:9, Twitter-optimized), dark mode
- **Thread placement**: Tweet 5 or as blog visual for Section 2 "Maker Order Complexity"
- **Story**: FOK (3 steps, instant, pays fee) vs GTC (3 steps + TIMEOUT/FILLED fork, earns rebate). Visual communicates complexity is the cost of entry.
- **Known minor cosmetic**: TIMEOUT amber arrow slightly muted vs main flow arrows — acceptable for pre-stage, can polish post-Day-12 if needed
- **Parametric**: Script uses no placeholders — diagram is architectural and doesn't depend on Day 12 results. No update needed unless the actual GTC implementation differs from the 3-step flow.

---

## Integration Notes (for Quill)

**Thread assignment** (from Day 12 pre-staged thread):
- Asset 1 (economics table): Tweet 3 (fee delta callout) or Tweet 6 (competitor contrast section)
- Asset 2 (flow diagram): Tweet 5 (complexity explanation) — optional, blog-first candidate

**Naming constraint**: Zero "OpenClaw" in any alt text or thread copy.

**Alt text suggestions**:
- Asset 1: "Comparison table: FOK taker orders pay 10% fee, GTC maker orders earn rebates. Same +0.12% signal edge applies only with maker orders."
- Asset 2: "Flowchart comparing FOK (3 simple steps, pay fee) vs GTC (3 steps + fill monitoring branch, earn rebate). GTC complexity is the cost of maker access."

---

## Update Protocol (post-Day-12 publish)

1. Check Day 12 blog for actual rebate rate data
   - If available: update `REBATE_LABEL` in `day12-generate-order-economics.py` → re-render
   - If still discretionary: no update needed (current "earn rebate" label is accurate)
2. Check Day 12 blog for actual GTC order architecture
   - If implementation differs from 3-step flow: update `day12-generate-gtc-flow.py`
   - If implementation matches: no update needed
3. Copy final PNGs to blog post folder: `projects/ruby-blog/blog/posts/2026-02-20-*/`

---

*Filed by Wanda — Pre-staged at 07:07 IST, Feb 19, 2026*
*17+ hours ahead of Jarvis's planned 23:30 IST pre-stage window*
*Pattern: same pre-staging system from Day 10/11 — structure is hard work, data is variables*
