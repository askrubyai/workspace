#!/usr/bin/env python3
"""
Day 8 SPRT Progress Tracker — Ruby's Quant Journal
1200×675 dark mode, Twitter/X optimized
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
C_BG, C_BLUE, C_BLUE2, C_GREEN, C_RED = '#111827', '#63b3ed', '#4299e1', '#51cf66', '#ff6b6b'
C_GRAY, C_WHITE, C_MONO = '#8b949e', '#ffffff', 'DejaVu Sans Mono'

def card(x, y, w, h, fc='white', fa=0.05, ec=(1,1,1,0.10), r=12, z=2):
    p = FancyBboxPatch((x, y), w, h,
                       boxstyle=f"round,pad=0,rounding_size={r}",
                       facecolor=fc, alpha=fa, edgecolor=ec, linewidth=0.8, zorder=z)
    p.set_edgecolor(ec)
    ax.add_patch(p)

# ─── LAYOUT (evenly spaced, bottom-up) ────────────────────────────────────────
# Footer centre:       y = 52
# Zones:               y = 130 → 218  (h=88)   gap from footer top: 64px
# Stats:               y = 282 → 382  (h=100)  gap: 64px
# Bar:                 y = 446 → 476  (h=30)   gap: 64px
# Labels above bar:    y ≈ 490
# Subtitle:            y ≈ 556
# Title:               y ≈ 582
# Pill:                y ≈ 618 → 640  (h=22)

# ── HEADER ────────────────────────────────────────────────────────────────────
pill = FancyBboxPatch((60, 619), 282, 22, boxstyle="round,pad=0,rounding_size=11",
                      facecolor=C_BLUE, alpha=0.15, linewidth=0.8, zorder=3)
pill.set_edgecolor((99/255, 179/255, 237/255, 0.35))
ax.add_patch(pill)
ax.text(201, 630, 'SEQUENTIAL PROBABILITY RATIO TEST',
        color=C_BLUE, fontsize=8, fontweight='bold', ha='center', va='center', zorder=4)

ax.text(60, 603, 'SPRT Validation Progress',
        color=C_WHITE, fontsize=37, fontweight='black', ha='left', va='center', zorder=4)
ax.text(60, 577, 'Paper trading bot launched — accumulating trades toward statistical decision',
        color=C_GRAY, fontsize=13, ha='left', va='center', zorder=4)

# ── COUNTER BADGE ─────────────────────────────────────────────────────────────
card(988, 548, 154, 118, fc=C_BLUE, fa=0.08, ec=(99/255,179/255,237/255,0.28), r=16, z=2)
ax.text(1065, 636, '0', color=C_BLUE, fontsize=54, fontweight='black',
        ha='center', va='center', zorder=4, fontfamily=C_MONO)
ax.text(1065, 598, 'TRADES TAKEN', color=C_GRAY, fontsize=9, fontweight='bold',
        ha='center', va='center', zorder=4)
ax.text(1065, 582, 'Goal: 120', color=C_GRAY, fontsize=10,
        ha='center', va='center', zorder=4)

# ── PROGRESS BAR ──────────────────────────────────────────────────────────────
BX, BY, BW, BH, BR = 60, 446, 1080, 30, 15

# Zone shading
ax.add_patch(FancyBboxPatch((BX, BY), BW*0.333, BH, boxstyle="round,pad=0,rounding_size=0",
                            facecolor=C_RED, alpha=0.10, edgecolor='none', zorder=2))
ax.add_patch(FancyBboxPatch((BX + BW*0.667, BY), BW*0.333, BH,
                            boxstyle="round,pad=0,rounding_size=0",
                            facecolor=C_GREEN, alpha=0.10, edgecolor='none', zorder=2))
# Track
tr = FancyBboxPatch((BX, BY), BW, BH, boxstyle=f"round,pad=0,rounding_size={BR}",
                    facecolor='white', alpha=0.06, linewidth=0.8, zorder=3)
tr.set_edgecolor((1,1,1,0.09))
ax.add_patch(tr)
# Fill (0/120 = tiny nub)
ax.add_patch(FancyBboxPatch((BX, BY), 5, BH, boxstyle=f"round,pad=0,rounding_size={BR}",
                            facecolor=C_BLUE, alpha=1.0, edgecolor='none', zorder=4))
# Tick marks
for pct in [0.333, 0.667]:
    ax.plot([BX+BW*pct]*2, [BY, BY+BH], color='white', alpha=0.18, linewidth=1.0, zorder=5)
# Glowing start marker
MX, MY = BX+5, BY+BH/2
for radius, alpha in [(14, 0.07), (10, 0.14), (7, 0.23)]:
    ax.add_patch(plt.Circle((MX, MY), radius, color=C_BLUE, alpha=alpha, zorder=5))
ax.add_patch(plt.Circle((MX, MY), 6.5, facecolor='white', edgecolor=C_BLUE,
                        linewidth=2.5, zorder=6))

# Labels above bar
ax.text(BX, BY+BH+14, '▶  BOT LIVE — DAY 1 OF FORWARD VALIDATION',
        color=C_GRAY, fontsize=10, fontweight='bold', ha='left', va='bottom', zorder=4, alpha=0.9)
ax.text(BX+BW, BY+BH+14, 'TARGET: 120 TRADES → H1 CONFIRMED ✓',
        color=C_GREEN, fontsize=10, fontweight='bold', ha='right', va='bottom', zorder=4)
# Labels below bar
ax.text(BX, BY-6, '0 trades / Start', color=C_GRAY, fontsize=9, ha='left', va='top', zorder=4)
ax.text(BX+BW*0.333, BY-6, '40 trades', color=C_GRAY, fontsize=9, ha='center', va='top', zorder=4)
ax.text(BX+BW*0.667, BY-6, '80 trades', color=C_GRAY, fontsize=9, ha='center', va='top', zorder=4)
ax.text(BX+BW, BY-6, '120 trades / Decision Point',
        color=C_GREEN, fontsize=9, fontweight='bold', ha='right', va='top', zorder=4)

# ── STAT CARDS ────────────────────────────────────────────────────────────────
SY, SW, SH = 282, 244, 100
STATS = [
    ('—',    'WIN RATE',          'Target: >55%',          C_GRAY),
    ('—',    'AVG EDGE/TRADE',    'Target: >+0.10%',       C_GRAY),
    ('~120', 'TRADES TO DECIDE',  'vs 304 fixed-sample',   C_BLUE),
    ('60%',  'SPRT SAVINGS',      'Fewer trades needed',   C_GREEN),
]
for i, (val, lbl, sub, col) in enumerate(STATS):
    sx = 60 + i*(SW+16)
    card(sx, SY, SW, SH, fa=0.045, ec=(1,1,1,0.09), r=12)
    ax.text(sx+SW/2, SY+SH*0.65, val, color=col, fontsize=30, fontweight='black',
            ha='center', va='center', zorder=4, fontfamily=C_MONO)
    ax.text(sx+SW/2, SY+SH*0.30, lbl, color=C_GRAY, fontsize=9, fontweight='bold',
            ha='center', va='center', zorder=4)
    ax.text(sx+SW/2, SY+SH*0.13, sub, color=C_GRAY, fontsize=8.5,
            ha='center', va='center', zorder=4, alpha=0.75)

# ── DECISION ZONES ────────────────────────────────────────────────────────────
ZY, ZW, ZH, ZG = 130, 332, 88, 17
ZONES = [
    ('Reject H1 (No Edge)',   'LLR < lower boundary\n→ strategy has no edge',  'B = −1.558', C_RED,  (1,.42,.42,.25)),
    ('Continue Testing',      'LLR between boundaries\n→ accumulate more trades', 'In progress', C_BLUE, (.39,.70,.93,.20)),
    ('Confirm Edge (H1) ✓',  'LLR > upper boundary\n→ deploy live with $10',   'A = +2.773',  C_GREEN,(0.32,.81,.40,.25)),
]
for i, (title, desc, rng, dot_c, bord) in enumerate(ZONES):
    zx = 60 + i*(ZW+ZG)
    card(zx, ZY, ZW, ZH, fa=0.03, ec=bord, r=12)
    ax.add_patch(plt.Circle((zx+18, ZY+ZH/2), 5.5, facecolor=dot_c, zorder=4))
    ax.text(zx+34, ZY+ZH*0.72, title, color=C_WHITE, fontsize=11.5, fontweight='bold',
            ha='left', va='center', zorder=4, alpha=0.92)
    ax.text(zx+34, ZY+ZH*0.38, desc, color=C_GRAY, fontsize=9,
            ha='left', va='center', zorder=4, alpha=0.80, linespacing=1.4)
    ax.text(zx+ZW-12, ZY+ZH*0.55, rng, color=C_GRAY, fontsize=10, fontweight='bold',
            ha='right', va='center', zorder=4, fontfamily=C_MONO)

# ── FOOTER ────────────────────────────────────────────────────────────────────
FY = 52
ax.axhline(FY+16, color='white', alpha=0.08, linewidth=0.8, zorder=2, xmin=60/1200, xmax=1140/1200)
ax.text(60, FY, "Ruby's Quant Journal  ", color=C_GRAY, fontsize=11, ha='left', va='center', zorder=4, alpha=0.70)
ax.text(288, FY, "Day 8", color=C_BLUE, fontsize=11, fontweight='bold', ha='left', va='center', zorder=4)
ax.text(343, FY, " — askrubyai.github.io", color=C_GRAY, fontsize=11, ha='left', va='center', zorder=4, alpha=0.70)

chip_x, chip_y, chip_w, chip_h = 930, FY-13, 210, 26
chip = FancyBboxPatch((chip_x, chip_y), chip_w, chip_h, boxstyle="round,pad=0,rounding_size=13",
                      facecolor=C_BLUE, alpha=0.12, linewidth=0.8, zorder=3)
chip.set_edgecolor((99/255, 179/255, 237/255, 0.30))
ax.add_patch(chip)
ax.add_patch(plt.Circle((chip_x+16, FY), 4, facecolor=C_BLUE, zorder=4))
ax.text(chip_x+28, FY, 'PAPER TRADING ACTIVE', color=C_BLUE, fontsize=9, fontweight='bold',
        ha='left', va='center', zorder=4)

# ── SAVE ─────────────────────────────────────────────────────────────────────
out = '/Users/ruby/.openclaw/workspace/artifacts/design/day8-sprt-progress.png'
plt.savefig(out, dpi=100, bbox_inches=None, facecolor='#111827', edgecolor='none')
plt.close()
import os; sz = os.path.getsize(out)
print(f"✅ Saved {out} ({sz//1024}KB)")
