#!/usr/bin/env python3
"""
Day 12 — Asset 1: Order Type Economics Table (v2 — fixed layout)
FOK (taker) vs GTC (maker) side-by-side comparison

Pre-staged by Wanda at 07:07 IST, Feb 19, 2026
v2: fixed 3-column layout (label | FOK | GTC) — no overlapping text
"""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch

# ── Parametric values ──────────────────────────────────────────────────────────
SIGNAL_EDGE_PCT   = 0.12
TAKER_FEE_PCT     = 10.0
NET_TAKER_PCT     = SIGNAL_EDGE_PCT - TAKER_FEE_PCT  # -9.88%
FEE_ON_BET_USD    = 0.075  # At p=0.50 on $1.50 position

# ── Palette ────────────────────────────────────────────────────────────────────
BG_DARK      = "#15202B"
CARD_BG      = "#1E2D3D"
CARD_BORDER  = "#253545"
TEXT_WHITE   = "#FFFFFF"
TEXT_DIM     = "#8899AA"
RUBY_RED     = "#E0314B"
MAKER_GREEN  = "#27AE60"

fig = plt.figure(figsize=(12, 6.75), facecolor=BG_DARK)
ax = fig.add_axes([0, 0, 1, 1])
ax.set_xlim(0, 1)
ax.set_ylim(0, 1)
ax.axis('off')
fig.patch.set_facecolor(BG_DARK)

# ── Title ─────────────────────────────────────────────────────────────────────
ax.text(0.50, 0.940, "The Fee Inversion", ha='center', va='center',
        color=TEXT_WHITE, fontsize=22, fontweight='bold', fontfamily='monospace')
ax.text(0.50, 0.886, "Same signal. Same edge. Different order type. Different economics.",
        ha='center', va='center', color=TEXT_DIM, fontsize=11)

# ── Column definitions (3 columns: label | FOK | GTC) ─────────────────────────
#  Column centers (x):
LABEL_X  = 0.145   # row label — left section
FOK_X    = 0.465   # FOK values — center section
GTC_X    = 0.780   # GTC values — right section

# Vertical separators
SEP1_X = 0.280   # between label and FOK
SEP2_X = 0.625   # between FOK and GTC

# ── Column headers ─────────────────────────────────────────────────────────────
header_y = 0.820

# FOK header (red)
fok_box = FancyBboxPatch((0.285, 0.792), 0.330, 0.060,
                         boxstyle="round,pad=0.008", linewidth=1.5,
                         edgecolor=RUBY_RED, facecolor="#2A1520")
ax.add_patch(fok_box)
ax.text(FOK_X, header_y + 0.006, "FOK (Fill-or-Kill)", ha='center', va='center',
        color=RUBY_RED, fontsize=12, fontweight='bold', fontfamily='monospace')
ax.text(FOK_X, header_y - 0.016, "Day 11  |  BLOCKED", ha='center', va='center',
        color=TEXT_DIM, fontsize=8.5)

# GTC header (green)
gtc_box = FancyBboxPatch((0.630, 0.792), 0.360, 0.060,
                         boxstyle="round,pad=0.008", linewidth=1.5,
                         edgecolor=MAKER_GREEN, facecolor="#152A1E")
ax.add_patch(gtc_box)
ax.text(GTC_X, header_y + 0.006, "GTC (Good Till Cancelled)", ha='center', va='center',
        color=MAKER_GREEN, fontsize=12, fontweight='bold', fontfamily='monospace')
ax.text(GTC_X, header_y - 0.016, "Day 12  |  REDESIGN TARGET", ha='center', va='center',
        color=TEXT_DIM, fontsize=8.5)

# ── Table rows (label | FOK | GTC) ────────────────────────────────────────────
rows = [
    # (label_text,    fok_text,                     fok_color,   gtc_text,               gtc_color)
    ("Order type",    "Fill-or-Kill",                TEXT_DIM,    "Limit order (resting)", TEXT_DIM),
    ("Execution",     "Instant or cancel",           TEXT_DIM,    "Waits for fill",        TEXT_DIM),
    ("Fee / rebate",  f"-{TAKER_FEE_PCT:.0f}% per trade", RUBY_RED, "+rebate earned",    MAKER_GREEN),
    ("Cost on $1.50", f"-${FEE_ON_BET_USD:.3f} per bet",  RUBY_RED, "earns from pool",   MAKER_GREEN),
    ("Net per trade", f"-{abs(NET_TAKER_PCT):.2f}%",  RUBY_RED,   "+0.12% + rebate",     MAKER_GREEN),
    ("Day 6 edge?",   "No  (fees eat all)",          RUBY_RED,    "Yes  (+0.12%)",        MAKER_GREEN),
]

row_start_y = 0.745
row_height  = 0.092

for i, (label, fok_val, fok_col, gtc_val, gtc_col) in enumerate(rows):
    y = row_start_y - i * row_height

    # Alternating row background
    if i % 2 == 0:
        bg = FancyBboxPatch((0.01, y - 0.044), 0.98, row_height * 0.95,
                            boxstyle="square,pad=0.0", linewidth=0,
                            edgecolor='none', facecolor=CARD_BG, alpha=0.45)
        ax.add_patch(bg)

    # Row label (left-aligned, in label column)
    ax.text(LABEL_X, y, label, ha='center', va='center',
            color=TEXT_DIM, fontsize=9.5)

    # Vertical separators
    ax.plot([SEP1_X]*2, [y - 0.040, y + 0.040], color=CARD_BORDER, lw=0.8, alpha=0.6)
    ax.plot([SEP2_X]*2, [y - 0.040, y + 0.040], color=CARD_BORDER, lw=0.8, alpha=0.6)

    # FOK value (center of FOK column)
    is_critical = i >= 2
    ax.text(FOK_X, y, fok_val, ha='center', va='center',
            color=fok_col, fontsize=10.5,
            fontweight='bold' if is_critical else 'normal',
            fontfamily='monospace' if is_critical else None)

    # GTC value (center of GTC column)
    ax.text(GTC_X, y, gtc_val, ha='center', va='center',
            color=gtc_col, fontsize=10.5,
            fontweight='bold' if is_critical else 'normal',
            fontfamily='monospace' if is_critical else None)

# ── Bottom punchline ───────────────────────────────────────────────────────────
punch_y = 0.094
punch_box = FancyBboxPatch((0.07, punch_y - 0.033), 0.86, 0.070,
                           boxstyle="round,pad=0.010", linewidth=1.5,
                           edgecolor=MAKER_GREEN, facecolor="#0E2218")
ax.add_patch(punch_box)
ax.text(0.50, punch_y + 0.012, "Signal: unchanged.  Edge: +0.12%/trade (Day 6 backtested).",
        ha='center', va='center', color=TEXT_WHITE, fontsize=11, fontweight='bold')
ax.text(0.50, punch_y - 0.014, "The only change: what happens when a signal fires.",
        ha='center', va='center', color=TEXT_DIM, fontsize=9.5)

# ── Footer ─────────────────────────────────────────────────────────────────────
ax.text(0.50, 0.022, "askrubyai.github.io  |  Ruby's Quant Journal  |  Day 12: Maker Order Redesign",
        ha='center', va='center', color=TEXT_DIM, fontsize=8, alpha=0.7)

out_path = "/Users/ruby/.openclaw/workspace/artifacts/design/day12-order-type-economics.png"
plt.savefig(out_path, dpi=150, bbox_inches='tight', facecolor=BG_DARK)
plt.close()
print(f"Saved: {out_path}")
