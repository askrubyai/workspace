#!/usr/bin/env python3
"""
Day 13 — Asset 1: GTC Fill Mechanics Flow
Pre-staged by Wanda at 18:22 IST, Thu Feb 19, 2026

Question: "Does a GTC limit order actually fill in a 15-minute market?"
Story: Signal fires → Limit order placed → 15-min window → Fill or Cancel fork
Green = filled path (rebate + P&L), Amber = cancelled path ($0 cost)

Parametric: FILL_RATE_LABEL, CANCEL_RATE_LABEL if Day 13 data gives specifics
Otherwise ships cleanly with structural/architectural framing.
"""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch

# ── Parametric (update after Day 13 publishes if specific data available) ─────
# These appear in the annotation cards. Leave as estimates until real data known.
FILL_RATE_LABEL   = "~70% est."      # Paper Run 3 fill rate
CANCEL_RATE_LABEL = "~30% est."      # Paper Run 3 cancel rate (no fill before T-2min)
FILL_LATENCY      = "2–15s avg"      # Typical fill latency observed

# ── Palette ────────────────────────────────────────────────────────────────────
BG_DARK      = "#15202B"
CARD_BG      = "#1E2D3D"
CARD_BORDER  = "#253545"
TEXT_WHITE   = "#FFFFFF"
TEXT_DIM     = "#8899AA"
RUBY_RED     = "#E0314B"
MAKER_GREEN  = "#27AE60"
AMBER        = "#F39C12"
BLUE_ACCENT  = "#3498DB"

fig = plt.figure(figsize=(12, 6.75), facecolor=BG_DARK)
ax = fig.add_axes([0, 0, 1, 1])
ax.set_xlim(0, 1)
ax.set_ylim(0, 1)
ax.axis('off')
fig.patch.set_facecolor(BG_DARK)

# ── Helpers ────────────────────────────────────────────────────────────────────
def box(ax, cx, cy, w, h, text, color, bg, border, fsize=10, fw='bold', multiline=False):
    rect = FancyBboxPatch((cx - w/2, cy - h/2), w, h,
                          boxstyle="round,pad=0.009", linewidth=1.8,
                          edgecolor=border, facecolor=bg)
    ax.add_patch(rect)
    ax.text(cx, cy, text, ha='center', va='center',
            color=color, fontsize=fsize, fontweight=fw,
            multialignment='center' if multiline else 'left')

def arrow(ax, cx, y_top, y_bot, color="#8899AA", lw=2.0):
    ax.annotate("", xy=(cx, y_bot + 0.008), xytext=(cx, y_top - 0.008),
                arrowprops=dict(arrowstyle="-|>", color=color, lw=lw,
                                mutation_scale=12))

# ── Title ──────────────────────────────────────────────────────────────────────
ax.text(0.50, 0.940, "Day 13: GTC Fill Mechanics in 15-Min Markets",
        ha='center', va='center', color=TEXT_WHITE,
        fontsize=19, fontweight='bold', fontfamily='monospace')
ax.text(0.50, 0.890, "Does a limit order fill before the market resolves?  (vs. FOK Fill-or-Kill taker at -10% fee)",
        ha='center', va='center', color="#AABBCC", fontsize=10.0)

# ── 15-MIN WINDOW BANNER ───────────────────────────────────────────────────────
banner = FancyBboxPatch((0.08, 0.843), 0.84, 0.030,
                        boxstyle="round,pad=0.005", linewidth=1.2,
                        edgecolor=BLUE_ACCENT, facecolor="#0E1E2E", alpha=0.95)
ax.add_patch(banner)
ax.text(0.50, 0.859,
        "15-minute resolution window  ·  Poll every 2s  ·  Cancel with 60s safety buffer before expiry",
        ha='center', va='center', color="#5DB9E0", fontsize=9.0)

# ── COLUMN LAYOUT ─────────────────────────────────────────────────────────────
# Spine: single entry → fork → two outcomes
SPINE_X  = 0.50
BOX_W    = 0.36
BOX_H    = 0.072

# ── ENTRY BOXES (shared for both outcomes) ─────────────────────────────────────
# Box 1: Signal fires
box(ax, SPINE_X, 0.775, BOX_W, BOX_H,
    "1.  Multi-factor signal fires  (score > 0.40)",
    TEXT_WHITE, CARD_BG, CARD_BORDER, fsize=10)

arrow(ax, SPINE_X, 0.775 - BOX_H/2, 0.680 + BOX_H/2, MAKER_GREEN)

# Box 2: Calculate limit price
box(ax, SPINE_X, 0.680, BOX_W, BOX_H,
    "2.  Calculate limit price  (best_bid + 1 tick)",
    TEXT_WHITE, CARD_BG, CARD_BORDER, fsize=10)

arrow(ax, SPINE_X, 0.680 - BOX_H/2, 0.585 + BOX_H/2, MAKER_GREEN)

# Box 3: Place GTC order
box(ax, SPINE_X, 0.585, BOX_W, BOX_H,
    "3.  Post GTC limit order  →  enter monitoring loop",
    TEXT_WHITE, CARD_BG, CARD_BORDER, fsize=10)

# ── FORK ──────────────────────────────────────────────────────────────────────
FORK_Y   = 0.490
FORK_Y0  = 0.585 - BOX_H/2

# Vertical spine to fork
ax.plot([SPINE_X, SPINE_X], [FORK_Y0 - 0.005, FORK_Y + 0.008],
        color=CARD_BORDER, lw=2.0, solid_capstyle='round')

# Horizontal fork bar
ax.plot([0.185, 0.815], [FORK_Y, FORK_Y],
        color=CARD_BORDER, lw=2.0)

# Fork label — explicit decision condition
ax.text(0.50, FORK_Y + 0.032, "Order filled before T-2min cutoff?",
        ha='center', va='center', color=TEXT_WHITE, fontsize=9.5, fontweight='bold')

# ── LEFT OUTCOME: TIMEOUT / CANCELLED ─────────────────────────────────────────
TOUT_X = 0.195
BOX_W_OUT = 0.340

# Down arrow to outcome header
ax.plot([TOUT_X, TOUT_X], [FORK_Y - 0.005, FORK_Y - 0.048],
        color=AMBER, lw=2.0, solid_capstyle='round')
ax.annotate("", xy=(TOUT_X, FORK_Y - 0.045),
            xytext=(TOUT_X, FORK_Y - 0.040),
            arrowprops=dict(arrowstyle="-|>", color=AMBER, lw=2.0, mutation_scale=12))

# Outcome header: CANCELLED
cancel_hdr = FancyBboxPatch((TOUT_X - BOX_W_OUT/2, 0.394), BOX_W_OUT, 0.036,
                            boxstyle="round,pad=0.005", linewidth=1.5,
                            edgecolor=AMBER, facecolor="#2A2010")
ax.add_patch(cancel_hdr)
ax.text(TOUT_X, 0.413, "CANCELLED (no fill)",
        ha='center', va='center', color=AMBER, fontsize=9.5, fontweight='bold')

# Cancelled details
box(ax, TOUT_X, 0.328, BOX_W_OUT, 0.072,
    "Order cancelled before expiry.\nNo fill. No position taken.",
    AMBER, "#201E14", AMBER, fsize=9, multiline=True)

# Cancelled result badge
result_c = FancyBboxPatch((TOUT_X - BOX_W_OUT/2, 0.238), BOX_W_OUT, 0.046,
                          boxstyle="round,pad=0.007", linewidth=1.5,
                          edgecolor=AMBER, facecolor="#2A2010")
ax.add_patch(result_c)
ax.text(TOUT_X, 0.261 + 0.010, "Cost:  $0.00",
        ha='center', va='center', color=TEXT_WHITE, fontsize=10, fontweight='bold')
ax.text(TOUT_X, 0.261 - 0.006, f"Fill rate:  {CANCEL_RATE_LABEL}",
        ha='center', va='center', color=AMBER, fontsize=9.5)

# Yes / No branch labels — offset to side to avoid overlap with vertical arrows
ax.text(TOUT_X - 0.070, FORK_Y - 0.025, "NO",
        ha='center', va='center', color=AMBER, fontsize=9.5, fontweight='bold')

# ── RIGHT OUTCOME: FILLED ──────────────────────────────────────────────────────
FILL_X = 0.805

ax.text(FILL_X + 0.070, FORK_Y - 0.025, "YES",
        ha='center', va='center', color=MAKER_GREEN, fontsize=9.5, fontweight='bold')

# Down arrow
ax.plot([FILL_X, FILL_X], [FORK_Y - 0.005, FORK_Y - 0.048],
        color=MAKER_GREEN, lw=2.0, solid_capstyle='round')
ax.annotate("", xy=(FILL_X, FORK_Y - 0.045),
            xytext=(FILL_X, FORK_Y - 0.040),
            arrowprops=dict(arrowstyle="-|>", color=MAKER_GREEN, lw=2.0, mutation_scale=12))

# Outcome header: FILLED
fill_hdr = FancyBboxPatch((FILL_X - BOX_W_OUT/2, 0.394), BOX_W_OUT, 0.036,
                          boxstyle="round,pad=0.005", linewidth=1.5,
                          edgecolor=MAKER_GREEN, facecolor="#152A1E")
ax.add_patch(fill_hdr)
ax.text(FILL_X, 0.413, "FILLED  (trade executed)",
        ha='center', va='center', color=MAKER_GREEN, fontsize=9.5, fontweight='bold')

# Filled details
box(ax, FILL_X, 0.328, BOX_W_OUT, 0.072,
    f"Order filled  ({FILL_LATENCY}).\nPosition open — signal active.",
    MAKER_GREEN, "#152A1E", MAKER_GREEN, fsize=9, multiline=True)

# Filled result badge
result_f = FancyBboxPatch((FILL_X - BOX_W_OUT/2, 0.238), BOX_W_OUT, 0.046,
                          boxstyle="round,pad=0.007", linewidth=1.5,
                          edgecolor=MAKER_GREEN, facecolor="#152A1E")
ax.add_patch(result_f)
ax.text(FILL_X, 0.261 + 0.010, "Fee:  0%  +  rebate earned",
        ha='center', va='center', color=TEXT_WHITE, fontsize=10, fontweight='bold')
ax.text(FILL_X, 0.261 - 0.006, f"Fill rate:  {FILL_RATE_LABEL}",
        ha='center', va='center', color=MAKER_GREEN, fontsize=9.5)

# ── BOTTOM TAKEAWAY ────────────────────────────────────────────────────────────
ta_y = 0.112
ta_box = FancyBboxPatch((0.07, ta_y - 0.038), 0.86, 0.078,
                        boxstyle="round,pad=0.010", linewidth=1.5,
                        edgecolor=CARD_BORDER, facecolor=CARD_BG, alpha=0.90)
ax.add_patch(ta_box)
ax.text(0.50, ta_y + 0.015,
        "A missed fill costs $0.   A FOK taker fill costs 10% (taker fee).",
        ha='center', va='center', color=TEXT_WHITE, fontsize=11, fontweight='bold')
ax.text(0.50, ta_y - 0.015,
        "At ~70% fill rate:   E[GTC]  >  E[FOK]   for any positive signal edge.",
        ha='center', va='center', color="#CCDDEE", fontsize=10.0, fontweight='bold')

# ── FOOTER ─────────────────────────────────────────────────────────────────────
ax.text(0.50, 0.028,
        "askrubyai.github.io  |  Ruby's Quant Journal  |  Day 13: GTC Paper Run 3",
        ha='center', va='center', color=TEXT_DIM, fontsize=8, alpha=0.7)

out_path = "/Users/ruby/.openclaw/workspace/artifacts/design/day13-gtc-fill-mechanics.png"
plt.savefig(out_path, dpi=150, bbox_inches='tight', facecolor=BG_DARK)
plt.close()
print(f"Saved: {out_path}")
