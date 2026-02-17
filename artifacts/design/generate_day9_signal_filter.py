#!/usr/bin/env python3
"""
Day 9 Signal Filter — v3
Clean two-section layout:
  TOP: 3 signal cards (horizontal)
  BOTTOM: ENTER vs SKIP comparison cards with large clear text
  BOTTOM BAR: live results stats

No confusing arrows. Decision logic is visual: green card vs red card.
"""
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch
import numpy as np

fig = plt.figure(figsize=(12, 6.75), facecolor='#111827')
fig.subplots_adjust(left=0, right=1, top=1, bottom=0)
ax = fig.add_axes([0, 0, 1, 1])
ax.set_xlim(0, 1200)
ax.set_ylim(0, 675)
ax.axis('off')
ax.set_facecolor('#111827')

grad = np.linspace(0, 1, 512).reshape(512, 1)
from matplotlib.colors import LinearSegmentedColormap
bg_cmap = LinearSegmentedColormap.from_list('bg', ['#0d1117', '#1a2235'])
ax.imshow(grad, extent=[0, 1200, 0, 675], aspect='auto', cmap=bg_cmap, zorder=0, alpha=1.0)
for x in range(0, 1200, 80):
    ax.axvline(x, color='white', alpha=0.018, linewidth=0.5, zorder=1)
for y in range(0, 675, 55):
    ax.axhline(y, color='white', alpha=0.018, linewidth=0.5, zorder=1)

C_GREEN = '#51cf66'
C_RED   = '#ff6b6b'
C_BLUE  = '#63b3ed'
C_GOLD  = '#fbbf24'
C_PURP  = '#c084fc'
C_GRAY  = '#8b949e'
C_WHITE = '#ffffff'
C_MONO  = 'DejaVu Sans Mono'

def card(x, y, w, h, fc='white', fa=0.05, ec=(1,1,1,0.10), r=12, z=2):
    p = FancyBboxPatch((x, y), w, h,
                       boxstyle=f"round,pad=0,rounding_size={r}",
                       facecolor=fc, alpha=fa, edgecolor=ec, linewidth=0.8, zorder=z)
    p.set_edgecolor(ec)
    ax.add_patch(p)

# ── HEADER ────────────────────────────────────────────────────────────────────
pill = FancyBboxPatch((60, 633), 228, 24,
                      boxstyle="round,pad=0,rounding_size=12",
                      facecolor=C_BLUE, alpha=0.18, linewidth=1.0, zorder=3)
pill.set_edgecolor((99/255, 179/255, 237/255, 0.50))
ax.add_patch(pill)
ax.text(174, 645, 'SIGNAL FILTERING — EDGE PRESERVATION',
        color=C_BLUE, fontsize=8.5, fontweight='bold', ha='center', va='center', zorder=4)

ax.text(60, 607, 'Three Signals. One Gate. Enter or Skip.',
        color=C_WHITE, fontsize=34, fontweight='black', ha='left', va='center', zorder=4)
ax.text(60, 581, 'All three must fire. Estimated win rate must clear 65%. Otherwise: wait.',
        color=C_GRAY, fontsize=12.5, ha='left', va='center', zorder=4)

# ── THREE SIGNAL CARDS ────────────────────────────────────────────────────────
signals = [
    ('S1', 'Regime Timing',     'Post-spike VRP window',     '+0.06%/trade', C_BLUE, (99/255,179/255,237/255)),
    ('S2', 'Cluster Proximity', 'Price near orderbook level', '+0.04%/trade', C_GOLD, (251/255,191/255,36/255)),
    ('S3', 'VRP Premium',       'Implied vol > realized vol', '+0.02%/trade', C_PURP, (192/255,132/255,252/255)),
]

SC_W, SC_H = 340, 100
SC_GAP = 20
SC_X = 60
SC_Y = 455

for i, (num, name, cond, edge, col, hx) in enumerate(signals):
    sx = SC_X + i * (SC_W + SC_GAP)

    card(sx, SC_Y, SC_W, SC_H, fa=0.04, ec=(*hx, 0.28), r=12)

    # Left accent bar
    ax.add_patch(FancyBboxPatch((sx, SC_Y), 4, SC_H,
                                boxstyle="round,pad=0,rounding_size=2",
                                facecolor=col, alpha=0.85, edgecolor='none', zorder=3))

    # Signal num badge
    badge = FancyBboxPatch((sx + 12, SC_Y + SC_H - 38), 32, 26,
                           boxstyle="round,pad=0,rounding_size=6",
                           facecolor=col, alpha=0.22, edgecolor=(*hx, 0.50), linewidth=1.0, zorder=3)
    ax.add_patch(badge)
    ax.text(sx + 28, SC_Y + SC_H - 25, num,
            color=col, fontsize=10.5, fontweight='black', ha='center', va='center', zorder=4,
            fontfamily=C_MONO)

    # Signal name + condition
    ax.text(sx + 55, SC_Y + SC_H - 22, name,
            color=C_WHITE, fontsize=13.5, fontweight='bold', ha='left', va='center', zorder=4)
    ax.text(sx + 14, SC_Y + SC_H - 50, cond,
            color=C_GRAY, fontsize=11.5, ha='left', va='center', zorder=4)

    # Divider
    ax.axhline(SC_Y + 34, color='white', alpha=0.09, linewidth=0.7, zorder=2,
               xmin=(sx+12)/1200, xmax=(sx+SC_W-12)/1200)

    # Edge contribution (larger font)
    ax.text(sx + SC_W/2, SC_Y + 17, 'Adds ' + edge + ' edge',
            color=col, fontsize=12, fontweight='bold', ha='center', va='center', zorder=4,
            fontfamily=C_MONO)

# ── ENTER vs SKIP PANELS ──────────────────────────────────────────────────────
PY, PH = 275, 150
PW_L = 510    # left (SKIP)
PW_R = 530    # right (ENTER — slightly wider for emphasis)
GAP = 20

# SKIP card (left)
skip_x = 60
g_skip = (1, 0.42, 0.42)
card(skip_x, PY, PW_L, PH, fc=C_RED, fa=0.07, ec=(*g_skip, 0.35), r=14)

ax.text(skip_x + PW_L/2, PY + PH - 30, 'SKIP',
        color=C_RED, fontsize=32, fontweight='black', ha='center', va='center', zorder=4)
ax.text(skip_x + PW_L/2, PY + PH - 65, 'Any signal missing  |  Score < 6/6',
        color=(1,1,1,0.75), fontsize=12, ha='center', va='center', zorder=4)
ax.text(skip_x + PW_L/2, PY + PH - 88, 'Estimated win rate < 65%',
        color=C_RED, fontsize=13, fontweight='bold', ha='center', va='center', zorder=4,
        fontfamily=C_MONO)

ax.axhline(PY + 52, color='white', alpha=0.10, linewidth=0.8, zorder=2,
           xmin=(skip_x+20)/1200, xmax=(skip_x+PW_L-20)/1200)

ax.text(skip_x + PW_L/2, PY + 32, 'No bet placed. Wait for better alignment.',
        color=C_GRAY, fontsize=11.5, ha='center', va='center', zorder=4)

# ENTER card (right, more prominent)
enter_x = skip_x + PW_L + GAP
g_enter = (0.32, 0.81, 0.40)
card(enter_x, PY, PW_R, PH, fc=C_GREEN, fa=0.10, ec=(*g_enter, 0.50), r=14)

ax.text(enter_x + PW_R/2, PY + PH - 30, 'ENTER',
        color=C_GREEN, fontsize=32, fontweight='black', ha='center', va='center', zorder=4)
ax.text(enter_x + PW_R/2, PY + PH - 65, 'All 3 signals ON  |  Score: 6/6',
        color=(1,1,1,0.80), fontsize=12, ha='center', va='center', zorder=4)
ax.text(enter_x + PW_R/2, PY + PH - 88, 'Estimated win rate >= 65%',
        color=C_GREEN, fontsize=13, fontweight='bold', ha='center', va='center', zorder=4,
        fontfamily=C_MONO)

ax.axhline(PY + 52, color='white', alpha=0.10, linewidth=0.8, zorder=2,
           xmin=(enter_x+20)/1200, xmax=(enter_x+PW_R-20)/1200)

ax.text(enter_x + PW_R/2, PY + 32, 'Kelly-size the bet. Record result. Update SPRT.',
        color=C_GRAY, fontsize=11.5, ha='center', va='center', zorder=4)

# "OR" separator between cards
ax.text(skip_x + PW_L + GAP/2, PY + PH/2, 'OR',
        color=C_GRAY, fontsize=13, fontweight='black', ha='center', va='center', zorder=4,
        alpha=0.60)

# 65% threshold tag between the two panels
thresh_x = skip_x + PW_L - 20
ax.text(600, PY + PH + 14, '65% WIN RATE THRESHOLD',
        color=C_GOLD, fontsize=10.5, fontweight='bold', ha='center', va='center', zorder=4)

# ── STATS BAR ────────────────────────────────────────────────────────────────
SBY = 178
card(60, SBY, 1080, 72, fa=0.03, ec=(1,1,1,0.06), r=12)

stats = [
    ('89.3%', 'Paper bot win rate',     C_GREEN),
    ('28',    'Trades to SPRT ACCEPT',  C_GREEN),
    ('+377%', 'Return on $10',          C_GOLD),
    ('91%',   'Sample savings vs 304',  C_BLUE),
]
cw = 1080 / len(stats)
for i, (val, lbl, col) in enumerate(stats):
    cx = 60 + i * cw + cw/2
    ax.text(cx, SBY + 48, val, color=col, fontsize=22, fontweight='black',
            ha='center', va='center', zorder=4, fontfamily=C_MONO)
    ax.text(cx, SBY + 22, lbl, color=C_GRAY, fontsize=10.5,
            ha='center', va='center', zorder=4)
    if i > 0:
        ax.plot([60 + i*cw]*2, [SBY+10, SBY+62], color='white', alpha=0.08,
                linewidth=0.8, zorder=2)

ax.text(600, SBY + 8, '--- LIVE RESULTS: PAPER BOT (SPRT ACCEPTED 22:24 IST FEB 17) ---',
        color=C_GRAY, fontsize=8.5, ha='center', va='center', zorder=4, alpha=0.55)

# ── FOOTER ────────────────────────────────────────────────────────────────────
FY = 52
ax.axhline(FY + 16, color='white', alpha=0.08, linewidth=0.8, zorder=2,
           xmin=60/1200, xmax=1140/1200)
ax.text(60, FY, "Ruby's Quant Journal  ", color=C_GRAY, fontsize=11,
        ha='left', va='center', zorder=4, alpha=0.70)
ax.text(288, FY, "Day 9", color=C_BLUE, fontsize=11, fontweight='bold',
        ha='left', va='center', zorder=4)
ax.text(343, FY, " — askrubyai.github.io", color=C_GRAY, fontsize=11,
        ha='left', va='center', zorder=4, alpha=0.70)

chip_x, chip_y = 820, FY - 13
chip = FancyBboxPatch((chip_x, chip_y), 320, 26,
                      boxstyle="round,pad=0,rounding_size=13",
                      facecolor=C_GREEN, alpha=0.13, linewidth=0.8, zorder=3)
chip.set_edgecolor((81/255, 207/255, 102/255, 0.35))
ax.add_patch(chip)
ax.add_patch(plt.Circle((chip_x + 16, FY), 4.5, facecolor=C_GREEN, zorder=4))
ax.text(chip_x + 30, FY, 'SELECTIVITY IS THE EDGE  |  >=65% TO ENTER',
        color=C_GREEN, fontsize=9, fontweight='bold', ha='left', va='center', zorder=4)

# ── SAVE ─────────────────────────────────────────────────────────────────────
out = '/Users/ruby/.openclaw/workspace/artifacts/design/day9-signal-filter.png'
plt.savefig(out, dpi=100, bbox_inches=None, facecolor='#111827', edgecolor='none')
plt.close()
import os
sz = os.path.getsize(out)
print(f"Saved {out} ({sz//1024}KB)")
