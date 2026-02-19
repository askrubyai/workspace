#!/usr/bin/env python3
"""
Day 13 — Asset 2: 3-Way Fee Economics Comparison
Pre-staged by Wanda at 18:22 IST, Thu Feb 19, 2026

3 columns: FOK (old) | GTC Filled | GTC Cancelled
Core question: "Which column would you rather be in?"
Parametric: fill rate estimates can be updated post-Day-13 with actual data.

3-column geometry rule (from lessons-learned):
  Labels: [0.00–0.20]
  FOK:    [0.20–0.47]
  GTC-F:  [0.47–0.73]
  GTC-C:  [0.73–1.00]
"""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch

# ── Parametric (update after Day 13 with actual fill data) ─────────────────────
FILL_RATE_EST   = "~70%"       # GTC fill rate estimate (Fury: ~70%)
CANCEL_RATE_EST = "~30%"       # GTC cancel rate estimate
REBATE_LABEL    = "+rebate"    # rebate earned per filled GTC trade

# ── Palette ────────────────────────────────────────────────────────────────────
BG_DARK      = "#15202B"
CARD_BG      = "#1E2D3D"
CARD_BORDER  = "#253545"
TEXT_WHITE   = "#FFFFFF"
TEXT_DIM     = "#8899AA"
RUBY_RED     = "#E0314B"
MAKER_GREEN  = "#27AE60"
AMBER        = "#F39C12"

fig = plt.figure(figsize=(12, 6.75), facecolor=BG_DARK)
ax = fig.add_axes([0, 0, 1, 1])
ax.set_xlim(0, 1)
ax.set_ylim(0, 1)
ax.axis('off')
fig.patch.set_facecolor(BG_DARK)

# ── Column centers ─────────────────────────────────────────────────────────────
LABEL_CX = 0.105   # row label column center
FOK_CX   = 0.335   # FOK column center
GTCF_CX  = 0.600   # GTC-Filled column center
GTCC_CX  = 0.855   # GTC-Cancelled column center

COL_W    = 0.230   # each data column width (for headers/borders)
LABEL_W  = 0.175   # label column width

# ── Title ──────────────────────────────────────────────────────────────────────
ax.text(0.50, 0.942, "Fee Economics: FOK vs. GTC (Maker Orders)",
        ha='center', va='center', color=TEXT_WHITE,
        fontsize=19, fontweight='bold', fontfamily='monospace')
ax.text(0.50, 0.892, "Which column would you rather be in?",
        ha='center', va='center', color="#AABBCC", fontsize=11.5)

# ── Column headers ─────────────────────────────────────────────────────────────
def col_header(ax, cx, label, text_color, bg_color, border_color, top_y=0.845, h=0.048):
    rect = FancyBboxPatch((cx - COL_W/2, top_y - h), COL_W, h,
                          boxstyle="round,pad=0.007", linewidth=2.0,
                          edgecolor=border_color, facecolor=bg_color)
    ax.add_patch(rect)
    ax.text(cx, top_y - h/2, label,
            ha='center', va='center', color=text_color,
            fontsize=10.5, fontweight='bold')

# Blank top-left corner (label column header)
rect_lbl = FancyBboxPatch((0.020, 0.845 - 0.048), LABEL_W, 0.048,
                          boxstyle="round,pad=0.007", linewidth=1.0,
                          edgecolor=CARD_BORDER, facecolor=CARD_BG)
ax.add_patch(rect_lbl)
ax.text(LABEL_CX, 0.845 - 0.024, "Metric",
        ha='center', va='center', color=TEXT_DIM, fontsize=9.5, fontweight='bold')

col_header(ax, FOK_CX,  "FOK  (old — BLOCKED)",         RUBY_RED,    "#3A0F18", RUBY_RED)
col_header(ax, GTCF_CX, "GTC  FILLED  ✓",               MAKER_GREEN, "#152A1E", MAKER_GREEN)
col_header(ax, GTCC_CX, "GTC  CANCELLED  ∅",             AMBER,       "#2A2010", AMBER)

# ── Table rows ─────────────────────────────────────────────────────────────────
rows = [
    # (row label, FOK value, GTC-filled value, GTC-cancelled value)
    # Format: (label, (text, fg, bg, border), (text, fg, bg, border), ...)
    (
        "Taker fee",
        ("−10% per trade",     RUBY_RED,    "#3A0F18", RUBY_RED),
        ("0%  maker",          MAKER_GREEN, "#152A1E", MAKER_GREEN),
        ("0%",                 AMBER,       "#251A00", AMBER),
    ),
    (
        "Fee on $1.50 bet",
        ("−$0.15  before\nmarket moves",     RUBY_RED,    "#3A0F18", RUBY_RED),
        ("+$0.01  rebate\nearned",            MAKER_GREEN, "#152A1E", MAKER_GREEN),
        ("$0.00",              TEXT_WHITE,  CARD_BG,    CARD_BORDER),
    ),
    (
        "Fill rate",
        ("100%  always fills", "#CC8888",   CARD_BG,    CARD_BORDER),
        (f"{FILL_RATE_EST} est.", MAKER_GREEN, "#152A1E", MAKER_GREEN),
        (f"{CANCEL_RATE_EST} est.", AMBER,  "#251A00", AMBER),
    ),
    (
        "Net cost/trade",
        ("Always −10%",        RUBY_RED,    "#3A0F18", RUBY_RED),
        (f"{REBATE_LABEL}\nwhen filled",    MAKER_GREEN, "#152A1E", MAKER_GREEN),
        ("$0.00  always",      MAKER_GREEN, "#152A1E", MAKER_GREEN),
    ),
    (
        "Bottom line",
        ("Pays to trade\nregardless",        RUBY_RED,    "#3A0F18", RUBY_RED),
        ("Edge + rebate\nwhen signal works", MAKER_GREEN, "#152A1E", MAKER_GREEN),
        ("No loss when\nno fill",            AMBER,       "#251A00", AMBER),
    ),
]

ROW_H     = 0.090
ROW_START = 0.785   # y-center of first row
ROW_GAP   = 0.010   # gap between rows

# Draw rows
for i, (lbl, fok_cell, gtcf_cell, gtcc_cell) in enumerate(rows):
    cy = ROW_START - i * (ROW_H + ROW_GAP)

    # Row label
    lbl_rect = FancyBboxPatch((0.020, cy - ROW_H/2), LABEL_W, ROW_H,
                              boxstyle="round,pad=0.007", linewidth=1.0,
                              edgecolor=CARD_BORDER, facecolor=CARD_BG)
    ax.add_patch(lbl_rect)
    ax.text(LABEL_CX, cy, lbl,
            ha='center', va='center', color=TEXT_WHITE, fontsize=9.0, fontweight='bold')

    # Data cells
    for (cx, (txt, fg, bg, border)) in [
        (FOK_CX,  fok_cell),
        (GTCF_CX, gtcf_cell),
        (GTCC_CX, gtcc_cell),
    ]:
        cell_rect = FancyBboxPatch((cx - COL_W/2, cy - ROW_H/2), COL_W, ROW_H,
                                   boxstyle="round,pad=0.007", linewidth=1.5,
                                   edgecolor=border, facecolor=bg)
        ax.add_patch(cell_rect)
        ax.text(cx, cy, txt,
                ha='center', va='center', color=fg,
                fontsize=9.5, fontweight='bold', multialignment='center')

# ── Bottom punchline ────────────────────────────────────────────────────────────
punch_y = 0.110
punch_box = FancyBboxPatch((0.07, punch_y - 0.032), 0.86, 0.065,
                           boxstyle="round,pad=0.010", linewidth=1.5,
                           edgecolor=MAKER_GREEN, facecolor="#0E1E14", alpha=0.92)
ax.add_patch(punch_box)
ax.text(0.50, punch_y + 0.010,
        "Even at ~70% fill rate:  GTC expected edge  >  FOK expected edge.",
        ha='center', va='center', color=TEXT_WHITE, fontsize=11, fontweight='bold')
ax.text(0.50, punch_y - 0.012,
        "Day 13 Paper Run 3 measures the actual fill rate.",
        ha='center', va='center', color=MAKER_GREEN, fontsize=9.5)

# ── Footer ─────────────────────────────────────────────────────────────────────
ax.text(0.50, 0.025,
        "askrubyai.github.io  |  Ruby's Quant Journal  |  Day 13: GTC Paper Run 3",
        ha='center', va='center', color=TEXT_DIM, fontsize=8, alpha=0.7)

out_path = "/Users/ruby/.openclaw/workspace/artifacts/design/day13-fee-comparison.png"
plt.savefig(out_path, dpi=150, bbox_inches='tight', facecolor=BG_DARK)
plt.close()
print(f"Saved: {out_path}")
