#!/usr/bin/env python3
"""
Day 12 — Asset 2: GTC vs FOK Flow Diagram (v3 — cleaner GTC right side)
Uses two-outcome card layout instead of cramped diamond+branches

Pre-staged by Wanda at 07:07 IST, Feb 19, 2026
"""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch

# ── Palette ────────────────────────────────────────────────────────────────────
BG_DARK     = "#15202B"
CARD_BG     = "#1E2D3D"
CARD_BORDER = "#253545"
TEXT_WHITE  = "#FFFFFF"
TEXT_DIM    = "#8899AA"
RUBY_RED    = "#E0314B"
MAKER_GREEN = "#27AE60"
AMBER       = "#F39C12"

fig = plt.figure(figsize=(12, 6.75), facecolor=BG_DARK)
ax = fig.add_axes([0, 0, 1, 1])
ax.set_xlim(0, 1)
ax.set_ylim(0, 1)
ax.axis('off')
fig.patch.set_facecolor(BG_DARK)

# ── Title ─────────────────────────────────────────────────────────────────────
ax.text(0.50, 0.942, "GTC vs FOK: Execution Architecture",
        ha='center', va='center',
        color=TEXT_WHITE, fontsize=20, fontweight='bold', fontfamily='monospace')
ax.text(0.50, 0.893, "Maker orders earn. But they're not simple.",
        ha='center', va='center', color="#AABBCC", fontsize=11)

# ── Helpers ────────────────────────────────────────────────────────────────────
def flow_box(ax, cx, cy, w, h, text, color, bg, border):
    rect = FancyBboxPatch((cx - w/2, cy - h/2), w, h,
                          boxstyle="round,pad=0.009", linewidth=1.8,
                          edgecolor=border, facecolor=bg)
    ax.add_patch(rect)
    ax.text(cx, cy, text, ha='center', va='center',
            color=color, fontsize=10, fontweight='bold')

def arrow_down(ax, cx, y_top, y_bot, color, lw=2.0):
    ax.annotate("", xy=(cx, y_bot + 0.008), xytext=(cx, y_top - 0.008),
                arrowprops=dict(arrowstyle="-|>", color=color, lw=lw,
                                mutation_scale=12))

# ═══════════════════════════════════════════════════════════
# LEFT PANEL — FOK
# ═══════════════════════════════════════════════════════════
FOK_CX = 0.215
BOX_W  = 0.340
BOX_H  = 0.072

# Header
fok_hdr = FancyBboxPatch((0.030, 0.843), 0.370, 0.038,
                         boxstyle="round,pad=0.005", linewidth=1.5,
                         edgecolor=RUBY_RED, facecolor="#2A1520")
ax.add_patch(fok_hdr)
ax.text(FOK_CX, 0.863, "FOK  |  Old Way  |  BLOCKED",
        ha='center', va='center', color=RUBY_RED, fontsize=9.5, fontweight='bold')

fok_steps = [
    (0.775, "1. Signal fires",           TEXT_WHITE, CARD_BG, CARD_BORDER),
    (0.675, "2. Submit FOK order",        TEXT_WHITE, CARD_BG, CARD_BORDER),
    (0.575, "3. Fill or cancel (instant)",TEXT_WHITE, CARD_BG, CARD_BORDER),
    (0.418, "Pay 1000 bps = -10%/trade",  RUBY_RED,  "#3A0F18", RUBY_RED),
]
for (y, txt, col, bg, brd) in fok_steps:
    flow_box(ax, FOK_CX, y, BOX_W, BOX_H, txt, col, bg, brd)

arrow_down(ax, FOK_CX, 0.775 - BOX_H/2, 0.675 + BOX_H/2, RUBY_RED)
arrow_down(ax, FOK_CX, 0.675 - BOX_H/2, 0.575 + BOX_H/2, RUBY_RED)
arrow_down(ax, FOK_CX, 0.575 - BOX_H/2, 0.418 + BOX_H/2, RUBY_RED)

# (No X overlay — FOK flow is self-explanatory via red fee box)

# ═══════════════════════════════════════════════════════════
# VS DIVIDER
# ═══════════════════════════════════════════════════════════
ax.plot([0.495]*2, [0.340, 0.880], color=CARD_BORDER, lw=1.0,
        linestyle='--', alpha=0.7)
ax.text(0.495, 0.610, "VS", ha='center', va='center',
        color=TEXT_DIM, fontsize=10, fontweight='bold',
        bbox=dict(boxstyle='round,pad=0.25', facecolor=BG_DARK, edgecolor='none'))

# ═══════════════════════════════════════════════════════════
# RIGHT PANEL — GTC
# ═══════════════════════════════════════════════════════════
GTC_CX  = 0.745
BOX_W_G = 0.420

# Header
gtc_hdr = FancyBboxPatch((0.528, 0.843), 0.450, 0.038,
                         boxstyle="round,pad=0.005", linewidth=1.5,
                         edgecolor=MAKER_GREEN, facecolor="#152A1E")
ax.add_patch(gtc_hdr)
ax.text(GTC_CX, 0.863, "GTC  |  New Way  |  Earns maker rebates",
        ha='center', va='center', color=MAKER_GREEN, fontsize=9.5, fontweight='bold')

# Steps 1-3
gtc_steps = [
    (0.775, "1. Signal fires"),
    (0.675, "2. Calculate limit price"),
    (0.575, "3. Post GTC limit order  →  monitor"),
]
for (y, txt) in gtc_steps:
    flow_box(ax, GTC_CX, y, BOX_W_G, BOX_H, txt, TEXT_WHITE, CARD_BG, CARD_BORDER)

arrow_down(ax, GTC_CX, 0.775 - BOX_H/2, 0.675 + BOX_H/2, MAKER_GREEN)
arrow_down(ax, GTC_CX, 0.675 - BOX_H/2, 0.575 + BOX_H/2, MAKER_GREEN)

# Diverging arrow to two outcome cards
FORK_Y  = 0.490
FORK_Y0 = 0.575 - BOX_H/2   # bottom of step 3

# Vertical line from step 3 to fork
ax.plot([GTC_CX, GTC_CX], [FORK_Y0 - 0.005, FORK_Y + 0.010],
        color=MAKER_GREEN, lw=2.0, solid_capstyle='round')
# Horizontal fork bar
ax.plot([0.560, 0.930], [FORK_Y, FORK_Y], color=MAKER_GREEN, lw=2.0)

# Left outcome: TIMEOUT (amber)
TOUT_X = 0.590
arrow_down(ax, TOUT_X, FORK_Y, 0.410 + BOX_H/2, AMBER)
ax.text(TOUT_X, FORK_Y + 0.028, "TIMEOUT", ha='center', va='center',
        color=AMBER, fontsize=8.5, fontweight='bold')
flow_box(ax, TOUT_X, 0.390, 0.180, 0.072,
         "Cancel &\nreassess", AMBER, "#2A2010", AMBER)

# Right outcome: FILLED (green)
FILL_X = 0.900
arrow_down(ax, FILL_X, FORK_Y, 0.410 + BOX_H/2, MAKER_GREEN)
ax.text(FILL_X, FORK_Y + 0.028, "FILLED", ha='center', va='center',
        color=MAKER_GREEN, fontsize=8.5, fontweight='bold')
flow_box(ax, FILL_X, 0.390, 0.175, 0.072,
         "Earn\nrebate", MAKER_GREEN, "#152A1E", MAKER_GREEN)

# ── Bottom takeaway ────────────────────────────────────────────────────────────
ta_y = 0.178
ta_box = FancyBboxPatch((0.07, ta_y - 0.038), 0.86, 0.082,
                        boxstyle="round,pad=0.010", linewidth=1.5,
                        edgecolor=CARD_BORDER, facecolor=CARD_BG, alpha=0.85)
ax.add_patch(ta_box)
ax.text(0.50, ta_y + 0.016,
        "GTC complexity is the cost of entry to the maker tier.",
        ha='center', va='center',
        color=TEXT_WHITE, fontsize=11, fontweight='bold')
ax.text(0.50, ta_y - 0.016,
        "Signal unchanged.  Edge unchanged.  Only the execution layer changes.",
        ha='center', va='center', color=TEXT_DIM, fontsize=9.5)

# ── Footer ─────────────────────────────────────────────────────────────────────
ax.text(0.50, 0.032,
        "askrubyai.github.io  |  Ruby's Quant Journal  |  Day 12: GTC Order Architecture",
        ha='center', va='center', color=TEXT_DIM, fontsize=8, alpha=0.7)

out_path = "/Users/ruby/.openclaw/workspace/artifacts/design/day12-gtc-flow-diagram.png"
plt.savefig(out_path, dpi=150, bbox_inches='tight', facecolor=BG_DARK)
plt.close()
print(f"Saved: {out_path}")
