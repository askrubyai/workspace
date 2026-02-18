"""
Day 10 Visual Assets — Pre-staged by Wanda — 2026-02-18 14:07 IST
Option C PRIMARY: Paper Run 2 (Independent Validation)

USAGE (after Day 10 publishes at ~3:05 PM IST):
  1. Update the PLACEHOLDER section below with real numbers
  2. Run: python3 artifacts/design/day10-generate-visuals.py
  3. Outputs: artifacts/design/day10-paper-run2-hook.png
              artifacts/design/day10-run-comparison.png

UPDATE GUIDE — only change these ~6 numbers:
  N_TRADES    = number of trades executed in Paper Run 2
  WIN_RATE    = win rate % (e.g., 75.0)
  BALANCE_END = ending balance (e.g., 18.32)
  SPRT_LR     = SPRT logLR after Paper Run 2 (e.g., 1.24)
  SKIP_RATE   = % of signals skipped (e.g., 82)
  SPRT_STATUS = "ACCEPT" | "INCONCLUSIVE" | "REJECT"
"""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch
import numpy as np

# ─── PLACEHOLDERS — UPDATE THESE AFTER DAY 10 PUBLISHES ──────────────────────
N_TRADES     = "19"        # number of Paper Run 2 trades
WIN_RATE     = "94.7"        # Paper Run 2 win rate (e.g. "74.1")
BALANCE_END  = "35.39"        # ending balance (e.g. "15.84")
SPRT_LR      = "4.37"        # SPRT logLR (e.g. "1.47")
SKIP_RATE    = "32"        # % signals skipped (e.g. "82")
SPRT_STATUS  = "ACCEPT"   # "ACCEPT" | "INCONCLUSIVE" | "REJECT"
BALANCE_START = "10.00"    # always $10 (fresh SPRT run)
# ─────────────────────────────────────────────────────────────────────────────

# ── Paper Run 1 fixed anchor stats (Day 9, verified) ──────────────────────────
R1_TRADES    = "28"
R1_WIN_RATE  = "89.3"
R1_BALANCE   = "$47.75"
R1_SPRT_LR   = "2.823"
R1_STATUS    = "ACCEPT"
R1_SKIP_RATE = "~84"
# ─────────────────────────────────────────────────────────────────────────────

# ── Color palette (Ruby brand: Twitter dark mode) ─────────────────────────────
BG_DARK      = "#15202B"
BG_CARD      = "#1E2D3D"
BG_CARD2     = "#1A2840"
RUBY_RED     = "#E0314B"
GREEN_OK     = "#22C55E"
YELLOW_WARN  = "#F59E0B"
GRAY_DIM     = "#64748B"
WHITE        = "#F8FAFC"
SLATE        = "#CBD5E1"

def status_color(status):
    return {
        "ACCEPT": GREEN_OK,
        "INCONCLUSIVE": YELLOW_WARN,
        "REJECT": RUBY_RED,
        "PENDING": GRAY_DIM,
    }.get(status, GRAY_DIM)

# ─────────────────────────────────────────────────────────────────────────────
# VISUAL 1: day10-paper-run2-hook.png — Tweet 1 hook (1200×675)
# ─────────────────────────────────────────────────────────────────────────────
def make_hook():
    fig, ax = plt.subplots(figsize=(12, 6.75), facecolor=BG_DARK)
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 6.75)
    ax.axis('off')

    # Background card — tighter vertical padding (more Twitter-crop safe)
    bg = FancyBboxPatch((0.4, 0.55), 11.2, 5.65,
                        boxstyle="round,pad=0.05", linewidth=0,
                        facecolor=BG_CARD, zorder=1)
    ax.add_patch(bg)

    # Top header bar
    header = FancyBboxPatch((0.4, 5.65), 11.2, 0.55,
                             boxstyle="round,pad=0.0", linewidth=0,
                             facecolor=RUBY_RED, zorder=2)
    ax.add_patch(header)

    ax.text(6.0, 5.95, "PAPER RUN 2 — INDEPENDENT VALIDATION",
            ha='center', va='center', fontsize=14, fontweight='bold',
            color=WHITE, zorder=3, fontfamily='monospace')

    # Main stat row
    ax.text(6.0, 4.70, f"$10.00  \u2192  ${BALANCE_END}",
            ha='center', va='center', fontsize=32, fontweight='bold',
            color=WHITE, zorder=3)

    # Sub-stats: 3 cards in a row (tighter vertical position)
    card_data = [
        (f"{N_TRADES}", "TRADES", 2.5),
        (f"{WIN_RATE}%", "WIN RATE", 6.0),
        (f"logLR {SPRT_LR}", "SPRT", 9.5),
    ]
    for val, label, x in card_data:
        cb = FancyBboxPatch((x-1.5, 2.55), 3.0, 1.65,
                            boxstyle="round,pad=0.08", linewidth=1.5,
                            edgecolor=RUBY_RED, facecolor=BG_CARD2, zorder=2)
        ax.add_patch(cb)
        ax.text(x, 3.65, val, ha='center', va='center',
                fontsize=22, fontweight='bold', color=WHITE, zorder=3)
        ax.text(x, 2.85, label, ha='center', va='center',
                fontsize=10.5, color=SLATE, zorder=3, fontfamily='monospace')

    # SPRT status badge — red-family tint even for PENDING
    sc = status_color(SPRT_STATUS)
    if SPRT_STATUS == "PENDING":
        sc = "#7B3045"  # muted dark red — stays in red family, clearly "not yet"
    badge = FancyBboxPatch((4.1, 1.40), 3.8, 0.78,
                           boxstyle="round,pad=0.08", linewidth=0,
                           facecolor=sc, zorder=2)
    ax.add_patch(badge)
    ax.text(6.0, 1.81, f"SPRT: {SPRT_STATUS}",
            ha='center', va='center', fontsize=13, fontweight='bold',
            color=WHITE, zorder=3, fontfamily='monospace')

    # Day 9 anchor line — higher contrast, readable at phone size
    ax.text(6.0, 0.95,
            "Day 9 anchor: 28 trades | 89.3% WR | $47.75 | logLR 2.823  ACCEPT",
            ha='center', va='center', fontsize=9.5, color=SLATE, zorder=3)

    # Footer branding
    ax.text(11.75, 0.65, "@askrubyai", ha='right', va='bottom',
            fontsize=8.5, color=GRAY_DIM, zorder=3, fontstyle='italic')

    plt.tight_layout(pad=0)
    plt.savefig('/Users/ruby/.openclaw/workspace/artifacts/design/day10-paper-run2-hook.png',
                dpi=150, bbox_inches='tight', facecolor=BG_DARK)
    plt.close()
    print("✅ day10-paper-run2-hook.png saved")

# ─────────────────────────────────────────────────────────────────────────────
# VISUAL 2: day10-run-comparison.png — Tweet 6 comparison card (1200×675)
# ─────────────────────────────────────────────────────────────────────────────
def make_comparison():
    fig, ax = plt.subplots(figsize=(12, 6.75), facecolor=BG_DARK)
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 6.75)
    ax.axis('off')

    # Header — tighter top padding (Twitter crop safe)
    ax.text(6.0, 6.40, "PAPER RUN 1  vs  PAPER RUN 2",
            ha='center', va='center', fontsize=16, fontweight='bold',
            color=WHITE)
    ax.text(6.0, 5.95, "Independent Validation — Same Filter, New Session",
            ha='center', va='center', fontsize=10, color=SLATE,
            fontfamily='monospace')

    # Header divider
    ax.plot([0.5, 11.5], [5.68, 5.68], color=RUBY_RED, linewidth=1.5)

    # Column headers
    ax.text(3.0, 5.35, "PAPER RUN 1  (Day 9)", ha='center', va='center',
            fontsize=11, fontweight='bold', color=GRAY_DIM)
    ax.text(9.0, 5.35, "PAPER RUN 2  (Day 10)", ha='center', va='center',
            fontsize=11, fontweight='bold', color=RUBY_RED)

    # Row data: (label, R1_val, R2_val)
    # Use "??" consistently as placeholder — matches hook card convention
    def r2(val, fmt="{}"):
        return fmt.format(val) if val != '??' else '??'

    rows = [
        ("WIN RATE",    f"{R1_WIN_RATE}%",   r2(WIN_RATE, "{}%")),
        ("TRADES",       R1_TRADES,           r2(N_TRADES)),
        ("SKIP RATE",   f"{R1_SKIP_RATE}%",  r2(SKIP_RATE, "{}%")),
        ("BALANCE END", R1_BALANCE,           r2(BALANCE_END, "${}") ),
        ("SPRT logLR",  f"{R1_SPRT_LR}",     r2(SPRT_LR)),
        ("SPRT RESULT", R1_STATUS,            SPRT_STATUS),
    ]

    y_start = 4.88
    row_h = 0.70

    for i, (label, v1, v2) in enumerate(rows):
        y = y_start - i * row_h
        # Alternating row bg — stronger contrast between bands
        row_color = "#1C2B3A" if i % 2 == 0 else BG_DARK
        rb = patches.Rectangle((0.5, y - 0.30), 11.0, row_h,
                                facecolor=row_color, linewidth=0, zorder=1)
        ax.add_patch(rb)

        # Center label — large + bold for mobile legibility
        ax.text(6.0, y + 0.06, label, ha='center', va='center',
                fontsize=13, fontweight='bold', color=SLATE, fontfamily='monospace')

        # Run 1 value (dim — established baseline)
        ax.text(3.0, y + 0.06, v1, ha='center', va='center',
                fontsize=14, fontweight='bold', color=SLATE)

        # Run 2 value — bright white or status color
        is_status = v2 in ("ACCEPT", "INCONCLUSIVE", "REJECT", "PENDING")
        c2 = status_color(v2) if is_status else WHITE
        if v2 == "PENDING":
            c2 = "#E8A0B0"  # light muted rose — "in progress" not "error"
        ax.text(9.0, y + 0.06, v2, ha='center', va='center',
                fontsize=14, fontweight='bold', color=c2)

    # NO center dashed divider — was visual noise; column headers + color do the job

    # Footer — stronger contrast for mobile legibility
    ax.text(6.0, 0.45,
            "Same 3-gate filter: score \u22650.30  |  Kelly edge check  |  price range 0.15\u20130.65",
            ha='center', va='center', fontsize=9.5, color=SLATE, fontfamily='monospace')
    ax.text(11.75, 0.22, "@askrubyai", ha='right', va='bottom',
            fontsize=9, color=GRAY_DIM, fontstyle='italic')

    plt.tight_layout(pad=0)
    plt.savefig('/Users/ruby/.openclaw/workspace/artifacts/design/day10-run-comparison.png',
                dpi=150, bbox_inches='tight', facecolor=BG_DARK)
    plt.close()
    print("✅ day10-run-comparison.png saved")

if __name__ == '__main__':
    make_hook()
    make_comparison()
    print("\n📋 UPDATE GUIDE: Edit the PLACEHOLDER block at top of this file after Day 10 publishes.")
    print("   Then re-run: python3 artifacts/design/day10-generate-visuals.py")
    print("   Copy outputs to blog post folder after filling Quill's thread slugs.")
