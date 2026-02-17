#!/usr/bin/env python3
"""
Day 9 SPRT ACCEPTED Tracker — Ruby's Quant Journal  v2
Final state: n=28, 25W/3L, 89.3% WR, $47.75 balance (+377.5%)
logLR = 2.823 (ACCEPT boundary 2.773) — ACCEPTED 22:24 IST Feb 17

Fixes from v1:
- Removed redundant top-left pill (was colliding with headline)
- Pill now shows logLR score vs boundary (informative, not redundant)
- Fixed 120 vs 304: 304 is the true fixed-sample baseline from Day 7
- SPRT efficiency: 91% (28 vs 304) not 77%
- Increased mobile-legible font sizes
- Progress bar: single continuous fill with ACCEPT marker at 28/304 scale
"""
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch
import numpy as np

fig = plt.figure(figsize=(12, 6.75), facecolor='#111827')
fig.subplots_adjust(left=0, right=1, top=1, bottom=0)
ax = fig.add_axes([0, 0, 1, 1])
ax.set_xlim(0, 1200)
ax.set_ylim(0, 675)
ax.axis('off')
ax.set_facecolor('#111827')

# Background gradient
grad = np.linspace(0, 1, 512).reshape(512, 1)
from matplotlib.colors import LinearSegmentedColormap
bg_cmap = LinearSegmentedColormap.from_list('bg', ['#0d1117', '#1a2235'])
ax.imshow(grad, extent=[0, 1200, 0, 675], aspect='auto', cmap=bg_cmap, zorder=0, alpha=1.0)

# Subtle grid
for x in range(0, 1200, 80):
    ax.axvline(x, color='white', alpha=0.018, linewidth=0.5, zorder=1)
for y in range(0, 675, 55):
    ax.axhline(y, color='white', alpha=0.018, linewidth=0.5, zorder=1)

# Colours
C_GREEN = '#51cf66'
C_RED   = '#ff6b6b'
C_BLUE  = '#63b3ed'
C_GOLD  = '#fbbf24'
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
# Pill: shows the LLR score vs boundary — separate from headline with clear gap
pill = FancyBboxPatch((60, 630), 318, 24,
                      boxstyle="round,pad=0,rounding_size=12",
                      facecolor=C_GREEN, alpha=0.18, linewidth=1.0, zorder=3)
pill.set_edgecolor((81/255, 207/255, 102/255, 0.55))
ax.add_patch(pill)
ax.text(219, 642, 'logLR: 2.823  |  ACCEPT BOUNDARY: 2.773',
        color=C_GREEN, fontsize=9.5, fontweight='bold', ha='center', va='center', zorder=4,
        fontfamily=C_MONO)

# Headline has clear 16px gap below pill
ax.text(60, 598, 'SPRT Validation: ACCEPTED',
        color=C_WHITE, fontsize=37, fontweight='black', ha='left', va='center', zorder=4)
ax.text(60, 570, 'Edge confirmed in 28 trades — 91% fewer than 304 fixed-sample baseline',
        color=C_GRAY, fontsize=13, ha='left', va='center', zorder=4)

# ── COUNTER BADGE (green — ACCEPTED) ──────────────────────────────────────────
card(988, 548, 154, 118, fc=C_GREEN, fa=0.12,
     ec=(81/255,207/255,102/255,0.40), r=16, z=2)
ax.text(1065, 636, '28', color=C_GREEN, fontsize=54, fontweight='black',
        ha='center', va='center', zorder=4, fontfamily=C_MONO)
ax.text(1065, 601, 'TRADES TAKEN', color=C_GRAY, fontsize=9, fontweight='bold',
        ha='center', va='center', zorder=4)
ax.text(1065, 583, 'ACCEPTED at n=28', color=C_GREEN, fontsize=9.5, fontweight='bold',
        ha='center', va='center', zorder=4)

# ── PROGRESS BAR (scale: 0 → 304 fixed-sample; ACCEPT fires at 28) ────────────
BX, BY, BW, BH, BR = 60, 446, 1080, 30, 15
FIXED_N = 304
ACCEPT_N = 28
FILL_PCT = ACCEPT_N / FIXED_N          # 9.2%
ACCEPT_X = BX + BW * FILL_PCT          # x position of accept marker

# Zone shading — reject / neutral / accept thirds of the 304-trade bar
ax.add_patch(FancyBboxPatch((BX, BY), BW * 0.333, BH,
                            boxstyle="round,pad=0,rounding_size=0",
                            facecolor=C_RED, alpha=0.10, edgecolor='none', zorder=2))
ax.add_patch(FancyBboxPatch((BX + BW * 0.667, BY), BW * 0.333, BH,
                            boxstyle="round,pad=0,rounding_size=0",
                            facecolor=C_GREEN, alpha=0.10, edgecolor='none', zorder=2))
# Track
tr = FancyBboxPatch((BX, BY), BW, BH, boxstyle=f"round,pad=0,rounding_size={BR}",
                    facecolor='white', alpha=0.06, linewidth=0.8, zorder=3)
tr.set_edgecolor((1,1,1,0.09))
ax.add_patch(tr)

# Filled portion (green)
fill_w = max(BW * FILL_PCT, BR)
ax.add_patch(FancyBboxPatch((BX, BY), fill_w, BH,
                            boxstyle=f"round,pad=0,rounding_size={BR}",
                            facecolor=C_GREEN, alpha=0.92, edgecolor='none', zorder=4))

# Tick marks at 101 and 203 trades (thirds of 304)
for pct in [0.333, 0.667]:
    ax.plot([BX + BW * pct] * 2, [BY, BY + BH], color='white', alpha=0.18,
            linewidth=1.0, zorder=5)

# ACCEPT marker vertical line
ax.plot([ACCEPT_X, ACCEPT_X], [BY - 10, BY + BH + 10], color=C_GREEN, alpha=0.9,
        linewidth=2.5, zorder=6)

# Glowing accept circle
for radius, alpha in [(14, 0.12), (10, 0.22), (7, 0.40)]:
    ax.add_patch(plt.Circle((ACCEPT_X, BY + BH / 2), radius,
                            color=C_GREEN, alpha=alpha, zorder=6))
ax.add_patch(plt.Circle((ACCEPT_X, BY + BH / 2), 6.5,
                        facecolor=C_WHITE, edgecolor=C_GREEN, linewidth=2.5, zorder=7))
ax.add_patch(plt.Circle((ACCEPT_X, BY + BH / 2), 2.5,
                        facecolor=C_GREEN, zorder=8))

# Labels above bar
ax.text(BX, BY + BH + 14, 'ACCEPTED at n=28  (logLR crossed upper boundary)',
        color=C_GREEN, fontsize=10.5, fontweight='bold', ha='left', va='bottom', zorder=4)
ax.text(BX + BW, BY + BH + 14, 'FIXED-SAMPLE BASELINE: 304 TRADES',
        color=C_GRAY, fontsize=10, ha='right', va='bottom', zorder=4, alpha=0.65)

# Labels below bar
ax.text(BX, BY - 6, 'n=0', color=C_GRAY, fontsize=10, ha='left', va='top', zorder=4)
ax.text(ACCEPT_X + 6, BY - 6, 'n=28 [ACCEPT]', color=C_GREEN, fontsize=10,
        fontweight='bold', ha='left', va='top', zorder=4)
ax.text(BX + BW, BY - 6, 'n=304 (projected)',
        color=C_GRAY, fontsize=10, ha='right', va='top', zorder=4, alpha=0.50)

# ── STAT CARDS ────────────────────────────────────────────────────────────────
SY, SW, SH = 282, 244, 100
STATS = [
    ('89.3%',  'WIN RATE',          '25W / 3L',        C_GREEN),
    ('+$1.34', 'AVG GAIN/TRADE',    '+377% total',     C_GOLD),
    ('28',     'TRADES TO ACCEPT',  'vs 304 baseline', C_GREEN),
    ('91%',    'SAMPLE SAVINGS',    'vs fixed-sample', C_BLUE),
]
for i, (val, lbl, sub, col) in enumerate(STATS):
    sx = 60 + i * (SW + 16)
    card(sx, SY, SW, SH, fa=0.045, ec=(1,1,1,0.09), r=12)
    ax.text(sx + SW/2, SY + SH * 0.65, val, color=col, fontsize=26, fontweight='black',
            ha='center', va='center', zorder=4, fontfamily=C_MONO)
    ax.text(sx + SW/2, SY + SH * 0.32, lbl, color=C_GRAY, fontsize=10, fontweight='bold',
            ha='center', va='center', zorder=4)
    ax.text(sx + SW/2, SY + SH * 0.13, sub, color=C_GRAY, fontsize=10,
            ha='center', va='center', zorder=4, alpha=0.75)

# ── DECISION ZONES ────────────────────────────────────────────────────────────
ZY, ZW, ZH, ZG = 130, 332, 88, 17
ZONES = [
    ('Reject H1 (No Edge)',   'LLR below lower boundary\nStrategy has no edge',  'B = -1.558', C_RED,   (1,.42,.42,.20)),
    ('Continue Testing',      'LLR between both bounds\nMore trades needed',      'Not reached',C_GRAY,  (.39,.70,.93,.12)),
    ('EDGE CONFIRMED',        'LLR 2.823 > bound 2.773\nSignal filtering works!','A = +2.773', C_GREEN, (0.32,.81,.40,.40)),
]
for i, (title, desc, rng, dot_c, bord) in enumerate(ZONES):
    zx = 60 + i * (ZW + ZG)
    is_accepted = i == 2
    fa = 0.08 if is_accepted else 0.03
    card(zx, ZY, ZW, ZH, fa=fa, ec=bord, r=12)
    ax.add_patch(plt.Circle((zx + 18, ZY + ZH/2), 5.5, facecolor=dot_c, zorder=4))
    fw = 'bold' if is_accepted else 'normal'
    tcol = C_WHITE if is_accepted else (1,1,1,0.70)
    ax.text(zx + 34, ZY + ZH * 0.72, title, color=tcol, fontsize=11.5, fontweight=fw,
            ha='left', va='center', zorder=4)
    ax.text(zx + 34, ZY + ZH * 0.38, desc, color=C_GRAY, fontsize=9.5,
            ha='left', va='center', zorder=4, alpha=0.80, linespacing=1.4)
    ax.text(zx + ZW - 10, ZY + ZH * 0.55, rng, color=dot_c, fontsize=10.5, fontweight='bold',
            ha='right', va='center', zorder=4, fontfamily=C_MONO)

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

# Footer chip — green ACCEPTED badge
chip_x, chip_y, chip_w, chip_h = 895, FY - 13, 245, 26
chip = FancyBboxPatch((chip_x, chip_y), chip_w, chip_h,
                      boxstyle="round,pad=0,rounding_size=13",
                      facecolor=C_GREEN, alpha=0.15, linewidth=0.8, zorder=3)
chip.set_edgecolor((81/255, 207/255, 102/255, 0.40))
ax.add_patch(chip)
ax.add_patch(plt.Circle((chip_x + 16, FY), 4.5, facecolor=C_GREEN, zorder=4))
ax.text(chip_x + 30, FY, 'SPRT ACCEPTED — EDGE CONFIRMED',
        color=C_GREEN, fontsize=9, fontweight='bold', ha='left', va='center', zorder=4)

# ── SAVE ─────────────────────────────────────────────────────────────────────
out = '/Users/ruby/.openclaw/workspace/artifacts/design/day9-sprt-accepted.png'
plt.savefig(out, dpi=100, bbox_inches=None, facecolor='#111827', edgecolor='none')
plt.close()
import os
sz = os.path.getsize(out)
print(f"Saved {out} ({sz//1024}KB)")
