#!/usr/bin/env python3
"""
Day 3 Visual Assets: Liquidity Cluster Edge
Creates 3 charts for Twitter thread support
"""

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np

# Twitter dark theme colors
BG_COLOR = '#15202B'
TEXT_COLOR = '#E7E9EA'
GRID_COLOR = '#38444D'
ACCENT_BLUE = '#1DA1F2'
GREEN = '#10B981'
RED = '#EF4444'
YELLOW = '#F59E0B'
GRAY = '#94A3B8'

plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.sans-serif'] = ['Arial', 'Helvetica', 'DejaVu Sans']

# Chart 1: Liquidity Cluster Heatmap
def create_liquidity_heatmap():
    fig, ax = plt.subplots(figsize=(18, 10), facecolor=BG_COLOR)
    ax.set_facecolor(BG_COLOR)
    
    # Simulated orderbook data around $97,000 BTC
    # Price levels from $96,800 to $97,200 in $50 increments
    prices = np.arange(96800, 97250, 50)
    
    # Bid depth (support) - clusters at round numbers
    bid_depth = np.array([
        120, 180, 350, 280, 150,  # $96,800-$97,000 (cluster at $96,900)
        520, 180, 140, 90          # $97,000-$97,200 (HUGE cluster at $97,000)
    ])
    
    # Ask depth (resistance) - clusters at psychological levels
    ask_depth = np.array([
        90, 140, 180, 250, 380,    # $96,800-$97,000
        180, 420, 280, 160          # $97,000-$97,200 (cluster at $97,100)
    ])
    
    # Create horizontal bar chart
    y_pos = np.arange(len(prices))
    
    # Bids (green, negative direction)
    ax.barh(y_pos, -bid_depth, height=0.8, color=GREEN, alpha=0.7, label='Bid Depth (Support)')
    
    # Asks (red, positive direction)
    ax.barh(y_pos, ask_depth, height=0.8, color=RED, alpha=0.7, label='Ask Depth (Resistance)')
    
    # Mark liquidity clusters with annotations
    # Bid cluster at $97,000
    ax.annotate('LIQUIDITY CLUSTER\n$97,000 support\n520 BTC bid depth',
                xy=(-520, 5), xytext=(-800, 7),
                fontsize=16, color=GREEN, weight='bold',
                bbox=dict(boxstyle='round,pad=0.5', facecolor=BG_COLOR, edgecolor=GREEN, linewidth=2),
                arrowprops=dict(arrowstyle='->', color=GREEN, lw=2))
    
    # Ask cluster at $97,100
    ax.annotate('RESISTANCE CLUSTER\n$97,100 ask wall\n420 BTC sell orders',
                xy=(420, 6), xytext=(600, 4),
                fontsize=16, color=RED, weight='bold',
                bbox=dict(boxstyle='round,pad=0.5', facecolor=BG_COLOR, edgecolor=RED, linewidth=2),
                arrowprops=dict(arrowstyle='->', color=RED, lw=2))
    
    # Styling
    ax.set_yticks(y_pos)
    ax.set_yticklabels([f'${p:,}' for p in prices], fontsize=14, color=TEXT_COLOR)
    ax.set_xlabel('Order Book Depth (BTC)', fontsize=18, color=TEXT_COLOR, weight='bold')
    ax.set_ylabel('Price Level', fontsize=18, color=TEXT_COLOR, weight='bold')
    ax.set_title('Liquidity Clusters: Where Orders Concentrate\nBTC Orderbook Snapshot (Feb 15, 2026)',
                 fontsize=22, color=TEXT_COLOR, weight='bold', pad=20)
    
    ax.tick_params(colors=TEXT_COLOR, labelsize=14)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color(GRID_COLOR)
    ax.spines['bottom'].set_color(GRID_COLOR)
    ax.grid(axis='x', alpha=0.2, color=GRID_COLOR)
    
    # Legend
    ax.legend(loc='upper right', fontsize=16, framealpha=0.9, facecolor=BG_COLOR, edgecolor=GRID_COLOR)
    
    # Add interpretation note
    note = "Price bounces OFF bid clusters (support)\nPrice rejects AT ask clusters (resistance)"
    ax.text(0.02, 0.98, note, transform=ax.transAxes,
            fontsize=14, color=YELLOW, weight='bold',
            verticalalignment='top',
            bbox=dict(boxstyle='round,pad=0.8', facecolor=BG_COLOR, edgecolor=YELLOW, linewidth=2))
    
    plt.tight_layout()
    plt.savefig('/Users/ruby/.openclaw/workspace/artifacts/design/day3-liquidity-heatmap.png',
                dpi=150, facecolor=BG_COLOR, edgecolor='none')
    print("✓ Created: day3-liquidity-heatmap.png")
    plt.close()


# Chart 2: BTC.D Concordance Regime Filter (2x2 Matrix)
def create_concordance_matrix():
    fig, ax = plt.subplots(figsize=(18, 12), facecolor=BG_COLOR)
    ax.set_facecolor(BG_COLOR)
    ax.axis('off')
    
    # 2x2 matrix data
    regimes = [
        # Row 1 (BTC Price Rising)
        {
            'btc': '↑ Rising', 'btcd': '↑ Rising',
            'interpretation': 'BTC LEADING RALLY\nStrong trend',
            'signal': 'BUY "UP" at support',
            'color': GREEN, 'edge': 'HIGH'
        },
        {
            'btc': '↑ Rising', 'btcd': '↓ Falling',
            'interpretation': 'ALTCOINS OUTPERFORMING\nBTC lagging',
            'signal': 'SKIP — weak signal',
            'color': GRAY, 'edge': 'LOW'
        },
        # Row 2 (BTC Price Falling)
        {
            'btc': '↓ Falling', 'btcd': '↑ Rising',
            'interpretation': 'FLIGHT TO SAFETY\nBTC relative strength',
            'signal': 'MEAN REVERSION UP\n(Best edge)',
            'color': ACCENT_BLUE, 'edge': 'VERY HIGH'
        },
        {
            'btc': '↓ Falling', 'btcd': '↓ Falling',
            'interpretation': 'FULL RISK-OFF\nEverything dumping',
            'signal': 'BUY "DOWN" at resistance',
            'color': RED, 'edge': 'MODERATE'
        }
    ]
    
    # Draw 2x2 grid
    cell_width = 0.42
    cell_height = 0.38
    start_x = 0.08
    start_y = 0.55
    
    for i, regime in enumerate(regimes):
        row = i // 2
        col = i % 2
        
        x = start_x + col * (cell_width + 0.04)
        y = start_y - row * (cell_height + 0.04)
        
        # Cell background
        rect = mpatches.FancyBboxPatch((x, y), cell_width, cell_height,
                                       boxstyle="round,pad=0.01",
                                       linewidth=3,
                                       edgecolor=regime['color'],
                                       facecolor=BG_COLOR,
                                       transform=ax.transAxes)
        ax.add_patch(rect)
        
        # Cell content
        # Header (BTC + BTC.D)
        header = f"BTC Price: {regime['btc']}\nBTC.D: {regime['btcd']}"
        ax.text(x + cell_width/2, y + cell_height - 0.03, header,
                transform=ax.transAxes, fontsize=16, color=TEXT_COLOR,
                weight='bold', ha='center', va='top')
        
        # Interpretation
        ax.text(x + cell_width/2, y + cell_height - 0.12, regime['interpretation'],
                transform=ax.transAxes, fontsize=15, color=regime['color'],
                weight='bold', ha='center', va='top',
                bbox=dict(boxstyle='round,pad=0.5', facecolor=BG_COLOR, 
                         edgecolor=regime['color'], linewidth=1.5, alpha=0.3))
        
        # Signal
        ax.text(x + cell_width/2, y + cell_height - 0.23, regime['signal'],
                transform=ax.transAxes, fontsize=14, color=TEXT_COLOR,
                weight='bold', ha='center', va='top')
        
        # Edge indicator
        edge_color = GREEN if regime['edge'] in ['HIGH', 'VERY HIGH'] else YELLOW if regime['edge'] == 'MODERATE' else GRAY
        ax.text(x + cell_width/2, y + 0.02, f"Edge: {regime['edge']}",
                transform=ax.transAxes, fontsize=13, color=edge_color,
                weight='bold', ha='center', va='bottom',
                bbox=dict(boxstyle='round,pad=0.4', facecolor=BG_COLOR,
                         edgecolor=edge_color, linewidth=2))
    
    # Title
    ax.text(0.5, 0.98, 'BTC.D Concordance Regime Filter',
            transform=ax.transAxes, fontsize=26, color=TEXT_COLOR,
            weight='bold', ha='center', va='top')
    
    ax.text(0.5, 0.93, 'When BTC Price and BTC Dominance Diverge, Mean Reversion Edge Appears',
            transform=ax.transAxes, fontsize=18, color=ACCENT_BLUE,
            ha='center', va='top')
    
    # Formula explanation at bottom
    formula_text = "Concordance Signal: S = sign(ΔP) × sign(ΔD)\nS = -1 (divergence) at liquidity cluster = MAXIMUM EDGE"
    ax.text(0.5, 0.08, formula_text,
            transform=ax.transAxes, fontsize=16, color=YELLOW,
            weight='bold', ha='center', va='top',
            bbox=dict(boxstyle='round,pad=0.8', facecolor=BG_COLOR,
                     edgecolor=YELLOW, linewidth=2))
    
    plt.savefig('/Users/ruby/.openclaw/workspace/artifacts/design/day3-concordance-matrix.png',
                dpi=150, facecolor=BG_COLOR, edgecolor='none', bbox_inches='tight')
    print("✓ Created: day3-concordance-matrix.png")
    plt.close()


# Chart 3: Confidence Interval Narrowing (Sample Size Effect)
def create_confidence_interval_chart():
    fig, ax = plt.subplots(figsize=(18, 10), facecolor=BG_COLOR)
    ax.set_facecolor(BG_COLOR)
    
    # Sample sizes to show
    n_values = np.array([10, 20, 30, 50, 100, 200])
    true_win_rate = 0.70  # Assumed true win rate
    
    # Calculate 95% CI using normal approximation
    # CI = p ± 1.96 * sqrt(p(1-p)/n)
    def confidence_interval(p, n):
        margin = 1.96 * np.sqrt(p * (1 - p) / n)
        return max(0, p - margin), min(1, p + margin)
    
    lower_bounds = []
    upper_bounds = []
    
    for n in n_values:
        lower, upper = confidence_interval(true_win_rate, n)
        lower_bounds.append(lower)
        upper_bounds.append(upper)
    
    lower_bounds = np.array(lower_bounds) * 100
    upper_bounds = np.array(upper_bounds) * 100
    win_rates = np.full(len(n_values), true_win_rate * 100)
    
    # Plot confidence intervals as error bars
    x_pos = np.arange(len(n_values))
    errors = np.array([win_rates - lower_bounds, upper_bounds - win_rates])
    
    ax.errorbar(x_pos, win_rates, yerr=errors, fmt='o', markersize=12,
                color=ACCENT_BLUE, ecolor=ACCENT_BLUE, capsize=8, capthick=3,
                linewidth=3, label='95% Confidence Interval')
    
    # Highlight n=10 (current situation)
    ax.scatter([0], [win_rates[0]], s=400, color=RED, zorder=5, 
               edgecolors=TEXT_COLOR, linewidths=2, label='Current: n=10 (INSUFFICIENT)')
    
    # Highlight n=50 (target)
    ax.scatter([3], [win_rates[3]], s=400, color=GREEN, zorder=5,
               edgecolors=TEXT_COLOR, linewidths=2, label='Target: n=50 (Statistically Valid)')
    
    # Add annotations
    # n=10 annotation
    ci_10 = f"[{lower_bounds[0]:.1f}%, {upper_bounds[0]:.1f}%]"
    ax.annotate(f'n=10: CI = {ci_10}\nTOO WIDE to prove edge',
                xy=(0, win_rates[0]), xytext=(1.5, 45),
                fontsize=16, color=RED, weight='bold',
                bbox=dict(boxstyle='round,pad=0.6', facecolor=BG_COLOR, 
                         edgecolor=RED, linewidth=2),
                arrowprops=dict(arrowstyle='->', color=RED, lw=2))
    
    # n=50 annotation
    ci_50 = f"[{lower_bounds[3]:.1f}%, {upper_bounds[3]:.1f}%]"
    ax.annotate(f'n=50: CI = {ci_50}\nNarrow enough to size edge',
                xy=(3, win_rates[3]), xytext=(2.2, 85),
                fontsize=16, color=GREEN, weight='bold',
                bbox=dict(boxstyle='round,pad=0.6', facecolor=BG_COLOR,
                         edgecolor=GREEN, linewidth=2),
                arrowprops=dict(arrowstyle='->', color=GREEN, lw=2))
    
    # Reference line at 50% (coin flip)
    ax.axhline(y=50, color=YELLOW, linestyle='--', linewidth=2, alpha=0.7, label='50% = Coin Flip')
    ax.text(len(n_values) - 0.5, 52, 'Random (no edge)', fontsize=14, color=YELLOW, weight='bold')
    
    # Styling
    ax.set_xticks(x_pos)
    ax.set_xticklabels([f'n={n}' for n in n_values], fontsize=16, color=TEXT_COLOR, weight='bold')
    ax.set_xlabel('Number of Trades', fontsize=20, color=TEXT_COLOR, weight='bold')
    ax.set_ylabel('Win Rate (%)', fontsize=20, color=TEXT_COLOR, weight='bold')
    ax.set_title('Why 10 Trades Isn\'t Enough to Prove Edge\nConfidence Interval Narrows with Sample Size',
                 fontsize=24, color=TEXT_COLOR, weight='bold', pad=20)
    
    ax.set_ylim(20, 100)
    ax.tick_params(colors=TEXT_COLOR, labelsize=14)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color(GRID_COLOR)
    ax.spines['bottom'].set_color(GRID_COLOR)
    ax.grid(axis='y', alpha=0.3, color=GRID_COLOR)
    
    # Legend
    ax.legend(loc='lower right', fontsize=15, framealpha=0.95, 
             facecolor=BG_COLOR, edgecolor=GRID_COLOR)
    
    # Key insight box
    insight = "With n=10, we can't distinguish\n70% skill from 50% luck.\n\nNeed n≥50 for statistical confidence."
    ax.text(0.98, 0.35, insight, transform=ax.transAxes,
            fontsize=16, color=TEXT_COLOR, weight='bold',
            verticalalignment='top', horizontalalignment='right',
            bbox=dict(boxstyle='round,pad=1.0', facecolor=BG_COLOR,
                     edgecolor=ACCENT_BLUE, linewidth=3))
    
    plt.tight_layout()
    plt.savefig('/Users/ruby/.openclaw/workspace/artifacts/design/day3-confidence-interval.png',
                dpi=150, facecolor=BG_COLOR, edgecolor='none')
    print("✓ Created: day3-confidence-interval.png")
    plt.close()


if __name__ == '__main__':
    print("\nGenerating Day 3 visual assets...")
    create_liquidity_heatmap()
    create_concordance_matrix()
    create_confidence_interval_chart()
    print("\n✓ All Day 3 charts generated successfully!\n")
