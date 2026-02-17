#!/usr/bin/env python3
"""
Day 8 Chart Templates — Pre-built scaffolding for < 5 min execution at 3 PM
Pre-staged by Wanda at 13:22 IST, Feb 17, 2026

Usage: Update the DATA section with actual Day 8 research numbers, then run.
Output: day8-sprt-progress.png, day8-multiasset-signals.png, day8-equity-curve.png
"""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np
import os

# ─── DESIGN SYSTEM (consistent with Days 1-7) ────────────────────────────────
BG       = "#0d1117"
TEXT     = "#e6edf3"
MUTED    = "#8b949e"
BLUE     = "#58a6ff"
BLUE_BR  = "#388bfd"
GREEN    = "#3fb950"
RED      = "#f85149"
ORANGE   = "#f0883e"
PURPLE   = "#bc8cff"
GRID     = "#30363d"
PANEL    = "#161b22"
SIZE     = (12, 6.75)  # 1200×675 @ 100dpi

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))

def style_ax(ax):
    ax.set_facecolor(PANEL)
    ax.tick_params(colors=MUTED, labelsize=10)
    ax.xaxis.label.set_color(MUTED)
    ax.yaxis.label.set_color(MUTED)
    for spine in ax.spines.values():
        spine.set_color(GRID)
    ax.grid(True, color=GRID, linewidth=0.5, alpha=0.7)

def make_fig():
    fig = plt.figure(figsize=SIZE, facecolor=BG)
    return fig

# ═══════════════════════════════════════════════════════════════════════════════
# ── DATA (UPDATE WITH ACTUAL Day 8 RESEARCH NUMBERS AT 3 PM) ─────────────────
# ═══════════════════════════════════════════════════════════════════════════════

# --- Chart 1: SPRT Progress ---
# Fill from research: actual log-LR values per trade
# If no live data yet, use [0.0] as placeholder (shows flat line)
SPRT_LR_VALUES  = [0.0]           # e.g. [0.12, 0.25, 0.08, -0.05, 0.31, ...]
SPRT_A          = 2.773           # H1 accept boundary (fixed)
SPRT_B          = -1.558          # H0 reject boundary (fixed)
SPRT_DECISION   = None            # None | "edge_confirmed" | "no_edge"
SPRT_N_TRADES   = len(SPRT_LR_VALUES)

# --- Chart 2: Multi-Asset Signal Grid ---
# Fill from research: signal counts per asset
ASSETS = {
    "BTC":  {"signals": 0, "periods": 120, "confidence": 0.0,  "color": ORANGE},
    "ETH":  {"signals": 0, "periods": 120, "confidence": 0.0,  "color": PURPLE},
    "SOL":  {"signals": 0, "periods": 120, "confidence": 0.0,  "color": GREEN},
    "XRP":  {"signals": 0, "periods": 120, "confidence": 0.0,  "color": BLUE},
}
SESSION_LABEL = "Paper Session 1"

# --- Chart 3: Equity Curve ---
# Fill from research: cumulative return per trade (as %)
EQUITY_CURVE    = [0.0]           # e.g. [0, 0.12, 0.08, 0.21, 0.15, 0.33, ...]
TRADE_RESULTS   = []              # list of "win"/"loss" per trade (same length as curve minus 1)
SESSION_PNL_PCT = 0.0             # final P&L %
IS_PRELIMINARY  = True            # set False when n >= 50

# ═══════════════════════════════════════════════════════════════════════════════
# ── CHART 1: SPRT PROGRESS ────────────────────────────────────────────────────
# ═══════════════════════════════════════════════════════════════════════════════

def build_sprt_chart():
    fig = make_fig()
    ax = fig.add_axes([0.10, 0.14, 0.85, 0.72])
    style_ax(ax)

    n = max(len(SPRT_LR_VALUES), 2)
    xs = list(range(1, len(SPRT_LR_VALUES) + 1))
    cumulative_lr = np.cumsum(SPRT_LR_VALUES)

    # Boundaries (extend to trade count + buffer)
    x_max = max(n + 5, 20)
    ax.axhline(SPRT_A, color=GREEN, linewidth=1.5, linestyle="--", alpha=0.9)
    ax.axhline(SPRT_B, color=RED,   linewidth=1.5, linestyle="--", alpha=0.9)

    # Continue zone fill
    ax.axhspan(SPRT_B, SPRT_A, facecolor="#1e2430", alpha=0.4)

    # LR line
    if len(xs) > 1:
        ax.plot(xs, cumulative_lr, color=BLUE_BR, linewidth=2.5, zorder=5)
        ax.scatter(xs, cumulative_lr, color=BLUE, s=30, zorder=6)
    else:
        ax.axhline(0, color=MUTED, linewidth=1, linestyle=":")

    ax.set_xlim(0, x_max)
    y_range = max(abs(SPRT_A) * 1.4, abs(SPRT_B) * 1.4, 0.5)
    ax.set_ylim(-y_range, y_range)
    ax.set_xlabel("Trade Number", fontsize=11)
    ax.set_ylabel("Log-Likelihood Ratio (Λₙ)", fontsize=11)
    ax.axvline(x=0, color=GRID, linewidth=0.5)

    # Labels
    ax.text(x_max * 0.97, SPRT_A + 0.08, "Edge Confirmed ✓",
            ha="right", va="bottom", color=GREEN, fontsize=10, fontweight="bold")
    ax.text(x_max * 0.97, SPRT_B - 0.08, "No Edge ✗",
            ha="right", va="top",    color=RED,   fontsize=10, fontweight="bold")
    ax.text(x_max * 0.97, 0,
            "Continue Testing",
            ha="right", va="center", color=MUTED, fontsize=9, style="italic")

    # Decision annotation
    if SPRT_DECISION == "edge_confirmed":
        title_suffix = " — EDGE CONFIRMED ✓"
        title_color = GREEN
    elif SPRT_DECISION == "no_edge":
        title_suffix = " — NO EDGE ✗"
        title_color = RED
    else:
        title_suffix = " — Still In Progress"
        title_color = MUTED

    fig.text(0.10, 0.93,
             f"SPRT Progress: Trade by Trade (n={SPRT_N_TRADES})" + title_suffix,
             ha="left", va="top", color=TEXT, fontsize=13, fontweight="bold")
    fig.text(0.10, 0.08,
             f"A = {SPRT_A:.3f} (H₁ accept)  |  B = {SPRT_B:.3f} (H₀ reject)  |  α = 0.05, β = 0.20",
             ha="left", va="bottom", color=MUTED, fontsize=9)

    out = os.path.join(OUTPUT_DIR, "day8-sprt-progress.png")
    fig.savefig(out, dpi=100, bbox_inches="tight", facecolor=BG)
    plt.close(fig)
    print(f"✅ Chart 1 saved: {out}")
    return out


# ═══════════════════════════════════════════════════════════════════════════════
# ── CHART 2: MULTI-ASSET SIGNAL GRID ─────────────────────────────────────────
# ═══════════════════════════════════════════════════════════════════════════════

def build_multiasset_chart():
    fig = make_fig()
    fig.text(0.50, 0.95,
             f"Signal Fire Rate by Asset ({SESSION_LABEL})",
             ha="center", va="top", color=TEXT, fontsize=13, fontweight="bold")

    asset_list = list(ASSETS.items())
    total_signals = sum(v["signals"] for v in ASSETS.values())
    total_periods = sum(v["periods"] for v in ASSETS.values())
    best_asset = max(ASSETS.items(), key=lambda x: x[1]["signals"])[0]

    positions = [(0, 1), (1, 1), (0, 0), (1, 0)]  # (col, row) for BTC/ETH/SOL/XRP

    for idx, (name, data) in enumerate(asset_list):
        col, row = positions[idx]
        left   = 0.07 + col * 0.46
        bottom = 0.13 + row * 0.37
        ax = fig.add_axes([left, bottom, 0.40, 0.32])
        ax.set_facecolor(PANEL)
        for spine in ax.spines.values():
            spine.set_edgecolor(data["color"])
            spine.set_linewidth(1.5)
        ax.set_xticks([])
        ax.set_yticks([])

        fire_rate = (data["signals"] / data["periods"] * 100) if data["periods"] else 0
        conf_pct  = data["confidence"] * 100

        # Asset name
        ax.text(0.05, 0.88, name, transform=ax.transAxes,
                color=data["color"], fontsize=16, fontweight="bold", va="top")

        # Signal count
        ax.text(0.05, 0.62,
                f"{data['signals']} / {data['periods']} periods",
                transform=ax.transAxes, color=TEXT, fontsize=11, va="top")

        # Fire rate (big number)
        ax.text(0.05, 0.40,
                f"Fire rate: {fire_rate:.1f}%",
                transform=ax.transAxes, color=data["color"], fontsize=12, fontweight="bold", va="top")

        # Confidence bar
        bar_w = max(conf_pct / 100, 0.02)
        ax.add_patch(mpatches.FancyBboxPatch(
            (0.05, 0.12), 0.88 * bar_w, 0.10,
            boxstyle="round,pad=0.02",
            transform=ax.transAxes,
            facecolor=data["color"], alpha=0.7, zorder=3))
        ax.add_patch(mpatches.FancyBboxPatch(
            (0.05, 0.12), 0.88, 0.10,
            boxstyle="round,pad=0.02",
            transform=ax.transAxes,
            facecolor=GRID, zorder=2))
        ax.text(0.96, 0.17, f"Conf: {conf_pct:.0f}%",
                transform=ax.transAxes, color=MUTED, fontsize=9, ha="right", va="center")

    # Summary footer
    best_label = f" • Best: {best_asset}" if total_signals > 0 else ""
    fig.text(0.50, 0.07,
             f"Total: {total_signals} signals / {total_periods} periods ({total_signals/total_periods*100:.1f}% composite){best_label}",
             ha="center", va="bottom", color=MUTED, fontsize=10)

    out = os.path.join(OUTPUT_DIR, "day8-multiasset-signals.png")
    fig.savefig(out, dpi=100, bbox_inches="tight", facecolor=BG)
    plt.close(fig)
    print(f"✅ Chart 2 saved: {out}")
    return out


# ═══════════════════════════════════════════════════════════════════════════════
# ── CHART 3: EQUITY CURVE ────────────────────────────────────────────────────
# ═══════════════════════════════════════════════════════════════════════════════

def build_equity_curve():
    fig = make_fig()
    ax = fig.add_axes([0.10, 0.14, 0.85, 0.72])
    style_ax(ax)

    xs = list(range(len(EQUITY_CURVE)))

    # Zero baseline
    ax.axhline(0, color=MUTED, linewidth=1, linestyle="--", alpha=0.6)

    # Equity curve
    if len(xs) > 1:
        ax.plot(xs, EQUITY_CURVE, color=BLUE_BR, linewidth=2.5, zorder=5)
        # Trade markers
        for i, result in enumerate(TRADE_RESULTS):
            color = GREEN if result == "win" else RED
            ax.scatter(i + 1, EQUITY_CURVE[i + 1], color=color, s=60, zorder=6)
    else:
        ax.scatter([0], [0.0], color=MUTED, s=50, zorder=5)
        ax.text(0.5, 0.5, "No trades yet", transform=ax.transAxes,
                ha="center", va="center", color=MUTED, fontsize=12, style="italic")

    ax.set_xlabel("Trade Number", fontsize=11)
    ax.set_ylabel("Cumulative Return (%)", fontsize=11)

    # P&L annotation
    pnl_color = GREEN if SESSION_PNL_PCT >= 0 else RED
    pnl_sign  = "+" if SESSION_PNL_PCT >= 0 else ""
    ax.text(0.97, 0.97, f"{pnl_sign}{SESSION_PNL_PCT:.2f}%",
            transform=ax.transAxes, ha="right", va="top",
            color=pnl_color, fontsize=22, fontweight="bold")

    # Preliminary warning
    n_trades = len(TRADE_RESULTS)
    prelim_text = f"PRELIMINARY — n={n_trades}, need 100+ for significance" if IS_PRELIMINARY else f"n={n_trades} trades"

    title = f"Paper Trading P&L — Session 1"
    fig.text(0.10, 0.93, title,
             ha="left", va="top", color=TEXT, fontsize=13, fontweight="bold")
    fig.text(0.10, 0.08, prelim_text,
             ha="left", va="bottom", color=RED if IS_PRELIMINARY else MUTED, fontsize=9, style="italic")

    # Legend
    win_patch  = mpatches.Patch(color=GREEN, label="Win")
    loss_patch = mpatches.Patch(color=RED,   label="Loss")
    ax.legend(handles=[win_patch, loss_patch], loc="lower right",
              facecolor=PANEL, edgecolor=GRID, labelcolor=TEXT, fontsize=9)

    out = os.path.join(OUTPUT_DIR, "day8-equity-curve.png")
    fig.savefig(out, dpi=100, bbox_inches="tight", facecolor=BG)
    plt.close(fig)
    print(f"✅ Chart 3 saved: {out}")
    return out


# ═══════════════════════════════════════════════════════════════════════════════
# ── MAIN ─────────────────────────────────────────────────────────────────────
# ═══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    import sys
    mode = sys.argv[1] if len(sys.argv) > 1 else "all"

    print(f"🎨 Wanda Day 8 chart generator — mode: {mode}")
    print(f"   Output dir: {OUTPUT_DIR}")
    print()

    if mode in ("all", "sprt"):
        build_sprt_chart()
    if mode in ("all", "multiasset"):
        build_multiasset_chart()
    if mode in ("all", "equity"):
        build_equity_curve()

    print("\n✅ All charts built. Update DATA section with real Day 8 numbers and re-run.")
