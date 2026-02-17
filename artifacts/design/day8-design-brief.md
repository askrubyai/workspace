# Day 8 Visual Design Brief
*Pre-staged by Wanda — 11:22 AM IST, Feb 17, 2026*
*Purpose: Execute in < 15 min when Day 8 research publishes at 3 PM*

---

## Context
Day 8 topic: **Live Paper Trading Bot — Forward Validation Phase**
Key narrative: Theory → Practice. Bot is running real signals on Polymarket CLOB. SPRT decides if strategy has edge.
Tone: Engineering precision + honest uncertainty (consistent with Days 5-7)

---

## Chart 1 — SPRT Validation Progress
**Purpose**: Show statistical decision framework (most distinctive visual from Day 8)
**Title**: "SPRT Progress: Trade by Trade"
**X-axis**: Trade number (1–N, max ~50 on session 1)
**Y-axis**: Log-likelihood ratio (Λ_n)
**Elements**:
- Running log-LR line (blue, thick)
- H1 accept boundary (green dashed, A = 2.773)
- H0 reject boundary (red dashed, B = −1.558)
- H1: "Edge Confirmed" label (top right, green)
- H0: "No Edge" label (bottom right, red)
- "Continue" zone (white/dark gray between lines)
- If no decision yet: show line meandering in middle zone (that's honest)
**Format**: 1200×675, dark mode (#0d1117 bg), Twitter-optimized
**Key design decision**: If SPRT hasn't reached a boundary yet, title should say "Still In Progress" — don't oversell partial data
**Placement in thread**: Tweet 4-5 (the "moment of truth" visual)

---

## Chart 2 — Multi-Asset Signal Comparison Grid
**Purpose**: Show BTC/ETH/SOL/XRP signal generation across assets
**Title**: "Signal Fire Rate by Asset (Paper Session 1)"
**Format**: 2×2 grid, one cell per asset
**Each cell**:
- Asset name + logo color (BTC=orange, ETH=purple, SOL=green, XRP=blue)
- Signal count / total periods (e.g., "7 / 120 periods")
- Fire rate % (e.g., "5.8%")
- Avg confidence bar (0–100%)
**Bottom row**: Composite row showing total signals + best-performing asset
**Format**: 1200×675, dark mode, clean grid lines (#1e2430)
**Placement in thread**: Tweet 7-8 (multi-asset section)

---

## Chart 3 — Paper Trading Equity Curve
**Purpose**: Running P&L over session (honest — may show near-flat if n is small)
**Title**: "Paper Trading P&L — Session 1"
**X-axis**: Trade number OR time (whichever makes better visual)
**Y-axis**: Cumulative return % (starting at 0%)
**Elements**:
- Equity curve (blue line)
- 0% baseline (gray dashed)
- Individual trade markers (green dot = win, red dot = loss)
- Current P&L annotation (top right, large text)
**If n < 10**: Show curve but label "PRELIMINARY — n=[X], needs 100+ for significance"
**Format**: 1200×675, dark mode
**Placement in thread**: Tweet 9-10 (results section)

---

## Design System (consistent with Days 1-7)
- **Background**: #0d1117 (GitHub dark)
- **Primary text**: #e6edf3
- **Accent blue**: #58a6ff
- **Green (wins)**: #3fb950
- **Red (losses)**: #f85149
- **Chart lines**: #388bfd (bright), #30363d (grid/borders)
- **Font**: System sans-serif, bold titles
- **Size**: 1200×675 (16:9) for all Twitter/blog assets

---

## Execution Checklist (3 PM)
1. [ ] Read Day 8 research post (5 min)
2. [ ] Extract actual SPRT numbers from post (Λ_n values, trade count)
3. [ ] Extract multi-asset signal counts from post
4. [ ] Extract P&L curve data from post
5. [ ] Build Chart 1 (SPRT) — ~4 min
6. [ ] Build Chart 2 (Multi-asset grid) — ~3 min
7. [ ] Build Chart 3 (Equity curve) — ~3 min
8. [ ] Export all 3 as PNG, name correctly:
   - `day8-sprt-progress.png`
   - `day8-multiasset-signals.png`
   - `day8-equity-curve.png`
9. [ ] Create documentation: `/artifacts/design/twitter-visual-assets-day8.md`
10. [ ] Post to daily notes
**Target total time**: ≤ 15 minutes from research publish

---

## Fallback Visuals (if Day 8 has different focus)
If bot architecture > live results:
- **Alt Chart 1**: System architecture flowchart (WebSocket → Signal Engine → Execution → SPRT)
- **Alt Chart 2**: Fill simulation model (bid-ask spread, latency, partial fill diagram)
- **Alt Chart 3**: SPRT math diagram (H0/H1 hypothesis illustration, power/size tradeoffs)

---

## Reddit Note (for Post #1 today)
- `day7-fee-impact-table.png` already works for Reddit (1200×675, dark mode, clear comparison)
- Reddit r/PolymarketTrading can reuse this asset — no new chart needed for Post #1
- If Reuben wants a Reddit-specific wide banner (higher CTR), can create a 1200×628 variant quickly

---

*Ready to execute. 3 PM Day 8 research publishes — Wanda fires immediately.*
