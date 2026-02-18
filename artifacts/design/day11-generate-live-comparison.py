#!/usr/bin/env python3
"""
Day 11 Tweet 6 Visual — Live Session vs Paper Run 2 Comparison Table
Pre-staged: 2026-02-19 00:37 IST (Wanda)

QUICK UPDATE (after Day 11 blog publishes ~1:30-2:00 AM IST):
  1. Edit the 6 RUNTIME VARIABLES below
  2. Run: python3 day11-generate-live-comparison.py
  3. Check output: /artifacts/design/day11-live-vs-paper-comparison.png
  4. Copy to blog post folder if needed

RUNTIME VARIABLES TO UPDATE:
  LIVE_N             — trades executed (e.g. "3")
  LIVE_WR            — win rate (e.g. "100.0%" or "66.7%")
  LIVE_SPREAD_BPS    — avg fill spread (e.g. "48 bps")
  LIVE_BALANCE_DELTA — balance change (e.g. "+14.2%")
  LIVE_logLR         — SPRT log-likelihood ratio (e.g. "0.41")
  DRY_RUN_MODE       — True if no live trades fired; False if live trades executed

Paper Run 2 reference data (fixed):
  N=19, WR=94.7%, spread=modeled, balance delta=+253.9%, logLR=4.37 (ACCEPT)
"""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch
import os

# ─────────────────────────────────────────────────────────────────────────────
#  RUNTIME UPDATE VARIABLES — Change these after Day 11 blog publishes
# ─────────────────────────────────────────────────────────────────────────────
LIVE_N              = "0"        # DRY_RUN: 0 trades executed
LIVE_WR             = "—"        # N/A: no trades to measure
LIVE_SPREAD_BPS     = "—"        # N/A: no fills
LIVE_BALANCE_DELTA  = "+0.0%"    # Balance unchanged (DRY_RUN)
LIVE_logLR          = "0.00"     # No data: SPRT not advanced
DRY_RUN_MODE        = True       # True = DRY_RUN / no go-ahead; False = live USDC
# ─────────────────────────────────────────────────────────────────────────────

SESSION_DATE = "Feb 19, 2026"

# ── Design tokens (consistent with Days 1-10 series) ──────────────────────
BG         = "#15202B"
CARD       = "#1E2E3D"
STRIPE     = "#1A2B38"
HEADER_BG  = "#0F1C28"
BLUE       = "#4A90D9"
GREEN      = "#27AE60"
RED        = "#C0392B"
YELLOW     = "#F1C40F"
TEXT_W     = "#FFFFFF"
TEXT_DIM   = "#8899AA"
BORDER     = "#2A4A6B"
PENDING_BG = "#2D2A18"   # amber-tinted dark — "waiting", not error
PENDING_BD = "#A08B30"   # amber border
PENDING_TX = "#F1C40F"   # yellow text — visually neutral/waiting

# ── Table data ─────────────────────────────────────────────────────────────
PAPER_R2_VALUES = ["19", "94.7%", "modeled", "+253.9%", "4.37 ACCEPT"]
LIVE_VALUES     = [LIVE_N, LIVE_WR, LIVE_SPREAD_BPS, LIVE_BALANCE_DELTA, LIVE_logLR]
METRIC_LABELS   = [
    "Trades fired",
    "Win rate",
    "Avg fill spread",
    "Balance delta",
    "SPRT logLR",
]

def is_pending(v):
    return v in ("??", "", "—")

def live_color(metric, val):
    """Return appropriate color for a live value."""
    if is_pending(val):
        return TEXT_DIM
    if "logLR" in metric and "ACCEPT" in val:
        return GREEN
    if "delta" in metric:
        return GREEN if val.startswith("+") else RED
    if "Win rate" in metric:
        try:
            pct = float(val.replace("%", ""))
            return GREEN if pct >= 65.0 else RED
        except ValueError:
            pass
    if "Trades" in metric:
        try:
            return GREEN if int(val) > 0 else TEXT_DIM
        except ValueError:
            pass
    return TEXT_W

# ── Figure ─────────────────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(12, 6.75))
fig.patch.set_facecolor(BG)
ax.set_facecolor(BG)
ax.set_xlim(0, 12)
ax.set_ylim(0, 6.75)
ax.axis('off')

# ── Title block ─────────────────────────────────────────────────────────────
ax.text(6, 6.40, "Paper Run 2  vs  Live Session",
        ha='center', va='center', fontsize=19, fontweight='bold',
        color=TEXT_W, fontfamily='monospace')

ax.text(6, 6.08,
        f"Day 11 · {SESSION_DATE} · live-bot-v1.py · Polymarket CLOB BTC 15-min",
        ha='center', va='center', fontsize=9.5,
        color=TEXT_DIM, fontfamily='monospace')

# ── Separator under title ───────────────────────────────────────────────────
ax.plot([0.4, 11.6], [5.82, 5.82], color=BORDER, linewidth=1.0, alpha=0.8)

# ── Column headers ──────────────────────────────────────────────────────────
# Metric column header
ax.text(1.0, 5.60, "Metric",
        ha='left', va='center', fontsize=9.5,
        color=TEXT_DIM, fontfamily='monospace')

# Paper R2 header
ax.text(4.6, 5.60, "Paper Run 2",
        ha='center', va='center', fontsize=12, fontweight='bold',
        color=BLUE, fontfamily='monospace')
ax.text(4.6, 5.40, "(n=19, SPRT ✓)",
        ha='center', va='center', fontsize=8.5,
        color=TEXT_DIM, fontfamily='monospace')

# Live header
live_hdr_color = TEXT_DIM if DRY_RUN_MODE else GREEN
ax.text(9.0, 5.60, "Live Session",
        ha='center', va='center', fontsize=12, fontweight='bold',
        color=live_hdr_color, fontfamily='monospace')
if DRY_RUN_MODE:
    # Show amber "awaiting data" badge in header — sets expectation immediately
    hbadge = FancyBboxPatch((7.55, 5.28), 2.90, 0.30,
                            boxstyle="round,pad=0.04",
                            facecolor=PENDING_BG, edgecolor=PENDING_BD, linewidth=1.0)
    ax.add_patch(hbadge)
    ax.text(9.0, 5.43, "AWAITING DATA",
            ha='center', va='center', fontsize=8.0, fontweight='bold',
            color=PENDING_TX, fontfamily='monospace')
else:
    ax.text(9.0, 5.40, f"({LIVE_N} trade{'s' if LIVE_N != '1' else ''})",
            ha='center', va='center', fontsize=8.5,
            color=TEXT_DIM, fontfamily='monospace')

# ── Sub-header separator ─────────────────────────────────────────────────────
ax.plot([0.4, 11.6], [5.22, 5.22], color=BORDER, linewidth=1.0, alpha=0.6)

# ── Vertical column divider ──────────────────────────────────────────────────
ax.plot([6.5, 6.5], [0.55, 5.22], color=BORDER, linewidth=0.8, alpha=0.5)

# ── Rows ─────────────────────────────────────────────────────────────────────
ROW_Y  = [4.60, 3.75, 2.90, 2.05, 1.20]
ROW_H  = 0.60
PAD    = 0.04

for i, (label, paper_val, live_val, y) in enumerate(
        zip(METRIC_LABELS, PAPER_R2_VALUES, LIVE_VALUES, ROW_Y)):

    # Alternating stripe
    if i % 2 == 0:
        stripe = FancyBboxPatch(
            (0.4, y - ROW_H / 2 - PAD), 11.2, ROW_H + 2 * PAD,
            boxstyle="round,pad=0.02",
            facecolor=STRIPE, edgecolor='none', alpha=0.60,
        )
        ax.add_patch(stripe)

    # Metric label
    ax.text(1.0, y, label,
            ha='left', va='center', fontsize=11,
            color=TEXT_DIM, fontfamily='monospace')

    # Paper R2 value
    p_color = GREEN if "ACCEPT" in paper_val else TEXT_W
    ax.text(4.6, y, paper_val,
            ha='center', va='center', fontsize=12, fontweight='bold',
            color=p_color, fontfamily='monospace')

    # Live value
    if is_pending(live_val):
        # Pending badge
        pb = FancyBboxPatch(
            (7.15, y - 0.19), 3.70, 0.38,
            boxstyle="round,pad=0.05",
            facecolor=PENDING_BG, edgecolor=PENDING_BD, linewidth=1.0,
        )
        ax.add_patch(pb)
        ax.text(9.0, y, "PENDING",
                ha='center', va='center', fontsize=10, fontweight='bold',
                color=PENDING_TX, fontfamily='monospace')
    else:
        lc = live_color(label, live_val)
        ax.text(9.0, y, live_val,
                ha='center', va='center', fontsize=12, fontweight='bold',
                color=lc, fontfamily='monospace')

# ── Footer ───────────────────────────────────────────────────────────────────
ax.plot([0.4, 11.6], [0.58, 0.58], color=BORDER, linewidth=0.8, alpha=0.5)

n_str = LIVE_N if not is_pending(LIVE_N) else "TBD"
ax.text(1.0, 0.35,
        f"n = {n_str} live trades — too small for significance. Watching the right thing.",
        ha='left', va='center', fontsize=9.5, fontweight='bold',
        color=TEXT_DIM, fontfamily='monospace')
ax.text(11.0, 0.35, "askrubyai.github.io",
        ha='right', va='center', fontsize=8.5,
        color=TEXT_DIM, fontfamily='monospace')

# ── Save ─────────────────────────────────────────────────────────────────────
out_dir  = os.path.dirname(os.path.abspath(__file__))
out_path = os.path.join(out_dir, "day11-live-vs-paper-comparison.png")
fig.savefig(out_path, dpi=150, bbox_inches='tight',
            facecolor=BG, edgecolor='none')
plt.close(fig)
print(f"[Wanda] Saved: {out_path}")
print(f"[Wanda] Mode: {'DRY RUN (PENDING)' if DRY_RUN_MODE else 'LIVE USDC'}")
print(f"[Wanda] Live values: N={LIVE_N}, WR={LIVE_WR}, spread={LIVE_SPREAD_BPS}, "
      f"delta={LIVE_BALANCE_DELTA}, logLR={LIVE_logLR}")
