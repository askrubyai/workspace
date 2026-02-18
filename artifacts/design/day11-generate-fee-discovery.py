#!/usr/bin/env python3
"""
Day 11 — Fee Discovery Visual (Scenario C) — v3
Pre-staged: 2026-02-19 01:22 IST (Wanda)

v3: simplified layout, no overlapping elements, bigger key numbers,
    single bottom punchline spanning full width.

Output: /artifacts/design/day11-fee-discovery.png
"""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch
import os

# ── Design tokens ─────────────────────────────────────────────────────────────
BG       = "#15202B"
CARD     = "#1E2E3D"
STRIPE   = "#1A2B38"
GREEN    = "#27AE60"
RED      = "#C0392B"
AMBER    = "#E67E22"
TEXT_W   = "#FFFFFF"
TEXT_DIM = "#8899AA"
BORDER   = "#2A4A6B"

fig, ax = plt.subplots(figsize=(12, 6.75))
fig.patch.set_facecolor(BG)
ax.set_facecolor(BG)
ax.set_xlim(0, 12)
ax.set_ylim(0, 6.75)
ax.axis('off')

# ── Title ─────────────────────────────────────────────────────────────────────
ax.text(6, 6.42, "What the Dry Run Found",
        ha='center', va='center', fontsize=22, fontweight='bold',
        color=TEXT_W, fontfamily='monospace')
ax.text(6, 6.10,
        "Day 11  ·  Feb 19, 2026  ·  live-bot-v1.py  ·  Polymarket BTC 15-min",
        ha='center', va='center', fontsize=10,
        color=TEXT_DIM, fontfamily='monospace')
ax.plot([0.4, 11.6], [5.83, 5.83], color=BORDER, linewidth=1.0, alpha=0.7)

# ═══════════════════════════════════════════════════════════════════════════════
# LEFT PANEL  (x: 0.35 – 5.75)
# ═══════════════════════════════════════════════════════════════════════════════
LP = dict(left=0.35, right=5.75, mid=3.05)
LP_mid = LP['mid']

left_bg = FancyBboxPatch((LP['left'], 1.42), 5.40, 4.24,
                         boxstyle="round,pad=0.08",
                         facecolor=CARD, edgecolor=BORDER, linewidth=1.3)
ax.add_patch(left_bg)

# Panel header
ax.text(LP_mid, 5.52, "Taker Fee  —  Expected vs Confirmed",
        ha='center', va='center', fontsize=12, fontweight='bold',
        color=TEXT_W, fontfamily='monospace')
ax.plot([0.55, 5.55], [5.27, 5.27], color=BORDER, linewidth=0.8, alpha=0.5)

# EXPECTED row
ax.text(LP_mid, 5.05, "Expected  (order args set to 0)",
        ha='center', va='center', fontsize=9.5,
        color=TEXT_DIM, fontfamily='monospace')
ex_bg = FancyBboxPatch((0.85, 4.45), 4.40, 0.48,
                       boxstyle="round,pad=0.06",
                       facecolor="#152515", edgecolor=GREEN, linewidth=1.8)
ax.add_patch(ex_bg)
ax.text(LP_mid, 4.69, "0 bps    (0.0% fee)",
        ha='center', va='center', fontsize=17, fontweight='bold',
        color=GREEN, fontfamily='monospace')

# Arrow
ax.annotate("", xy=(LP_mid, 3.93), xytext=(LP_mid, 4.43),
            arrowprops=dict(arrowstyle="-|>", color=AMBER,
                            lw=2.5, mutation_scale=22))

# CONFIRMED row
ax.text(LP_mid, 3.75, "Confirmed  (live API  /fee-rate endpoint)",
        ha='center', va='center', fontsize=9.5,
        color=TEXT_DIM, fontfamily='monospace')
re_bg = FancyBboxPatch((0.85, 3.10), 4.40, 0.52,
                       boxstyle="round,pad=0.06",
                       facecolor="#2A0F0F", edgecolor=RED, linewidth=2.5)
ax.add_patch(re_bg)
ax.text(LP_mid, 3.36, "1000 bps  (10.0% fee)",
        ha='center', va='center', fontsize=17, fontweight='bold',
        color=RED, fontfamily='monospace')

ax.plot([0.55, 5.55], [2.82, 2.82], color=BORDER, linewidth=0.7, alpha=0.4)

# Impact note — 2 lines, well-spaced
ax.text(LP_mid, 2.55,
        "FOK (taker) orders = 10% fee charged per trade",
        ha='center', va='center', fontsize=10, fontweight='bold',
        color=AMBER, fontfamily='monospace')
ax.text(LP_mid, 2.22,
        "Day 6 @ 3% taker fee = already -$0.09 / trade",
        ha='center', va='center', fontsize=9.5,
        color=TEXT_DIM, fontfamily='monospace')

# Separator below annotations, well above BLOCKED badge
ax.plot([0.55, 5.55], [1.95, 1.95], color=BORDER, linewidth=0.6, alpha=0.35)

# BLOCKED badge — full-width minus margin, center at 1.72
blocked_bg = FancyBboxPatch((0.58, 1.50), 4.87, 0.44,
                            boxstyle="round,pad=0.04",
                            facecolor="#2A0F0F", edgecolor=RED, linewidth=2.0)
ax.add_patch(blocked_bg)
ax.text(LP_mid, 1.72,
        "--live  BLOCKED   (economics, not code)",
        ha='center', va='center', fontsize=10.5, fontweight='bold',
        color=RED, fontfamily='monospace')

# ═══════════════════════════════════════════════════════════════════════════════
# RIGHT PANEL  (x: 6.25 – 11.65)
# ═══════════════════════════════════════════════════════════════════════════════
RP_mid = 8.95

right_bg = FancyBboxPatch((6.25, 1.42), 5.40, 4.24,
                          boxstyle="round,pad=0.08",
                          facecolor=CARD, edgecolor=BORDER, linewidth=1.3)
ax.add_patch(right_bg)

ax.text(RP_mid, 5.52, "Per-Trade Math",
        ha='center', va='center', fontsize=12, fontweight='bold',
        color=TEXT_W, fontfamily='monospace')
ax.plot([6.45, 11.45], [5.27, 5.27], color=BORDER, linewidth=0.8, alpha=0.5)

# Table rows — with explicit y positions, no overlap
rows = [
    (4.90, "Kelly bet size",       "$1.50",     TEXT_W,  False),
    (4.30, "Taker fee  (10%)",     "\u2212 $0.15",  RED,    False),
    (3.70, "Net entering trade",   "$1.35",     AMBER,   True),   # stripe
    (3.10, "Min price move needed","> 10.0%",   AMBER,   False),
    (2.50, "Day 5 VRP window avg", "~ 3\u20135%",   RED,    False),
]

for y, label, val, color, do_stripe in rows:
    if do_stripe:
        # dashed separator above stripe row
        ax.plot([6.45, 11.45], [y + 0.36, y + 0.36],
                color=BORDER, linewidth=0.8, alpha=0.5, linestyle='--')
    ax.text(6.70, y, label,
            ha='left', va='center', fontsize=10.5,
            color=TEXT_DIM, fontfamily='monospace')
    ax.text(11.25, y, val,
            ha='right', va='center', fontsize=11.5, fontweight='bold',
            color=color, fontfamily='monospace')

# Separator before conclusion row
ax.plot([6.45, 11.45], [2.14, 2.14], color=BORDER, linewidth=0.8, alpha=0.5,
        linestyle='--')

# Net edge row — highlighted
net_bg = FancyBboxPatch((6.42, 1.52), 4.95, 0.52,
                        boxstyle="round,pad=0.04",
                        facecolor="#2A0F0F", edgecolor=RED, linewidth=1.5)
ax.add_patch(net_bg)
ax.text(6.70, 1.78, "Net edge / trade",
        ha='left', va='center', fontsize=11, fontweight='bold',
        color=RED, fontfamily='monospace')
ax.text(11.25, 1.78, "\u2248 \u221210%",
        ha='right', va='center', fontsize=14, fontweight='bold',
        color=RED, fontfamily='monospace')

# ═══════════════════════════════════════════════════════════════════════════════
# FULL-WIDTH PUNCHLINE BANNER (bottom, outside both panels)
# ═══════════════════════════════════════════════════════════════════════════════
punch_bg = FancyBboxPatch((0.35, 0.42), 11.30, 0.80,
                          boxstyle="round,pad=0.08",
                          facecolor="#152515", edgecolor=GREEN, linewidth=2.2)
ax.add_patch(punch_bg)

ax.text(6.0, 0.89,
        "Dry run caught this before 1 real order fired.",
        ha='center', va='center', fontsize=12, fontweight='bold',
        color=TEXT_W, fontfamily='monospace')
ax.text(6.0, 0.60,
        "$10.49 USDC protected   \u2014   this is what dry runs are for",
        ha='center', va='center', fontsize=11.5,
        color=GREEN, fontfamily='monospace')

# ── Footer ────────────────────────────────────────────────────────────────────
ax.text(6.0, 0.20, "askrubyai.github.io",
        ha='center', va='center', fontsize=8.5,
        color=TEXT_DIM, fontfamily='monospace')

# ── Save ──────────────────────────────────────────────────────────────────────
out_dir  = os.path.dirname(os.path.abspath(__file__))
out_path = os.path.join(out_dir, "day11-fee-discovery.png")
fig.savefig(out_path, dpi=150, bbox_inches='tight',
            facecolor=BG, edgecolor='none')
plt.close(fig)
print(f"[Wanda] Saved: {out_path}")
print("[Wanda] v3 — fixed overlaps, full-width punchline, clean spacing")
