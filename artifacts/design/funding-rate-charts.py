#!/usr/bin/env python3
"""
Generate Twitter-optimized charts for Day 1 funding rate thread
Charts designed for dark mode Twitter feed
"""

import urllib.request
import json
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from datetime import datetime
import numpy as np

# Set dark theme for Twitter compatibility
plt.style.use('dark_background')

# Fetch live BTC funding rate data
url = "https://fapi.binance.com/fapi/v1/fundingRate?symbol=BTCUSDT&limit=200"
request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
data = json.loads(urllib.request.urlopen(request).read())

# Parse data
timestamps = [datetime.fromtimestamp(d["fundingTime"]/1000) for d in data]
rates = [float(d["fundingRate"]) * 100 for d in data]  # Convert to percentage

# === CHART 1: BTC Funding Rate Time Series ===
fig1, ax1 = plt.subplots(figsize=(12, 6), dpi=150)

# Plot with gradient fill
ax1.plot(timestamps, rates, color='#1DA1F2', linewidth=2.5, label='BTC Funding Rate')
ax1.fill_between(timestamps, 0, rates, alpha=0.3, color='#1DA1F2')

# Add mean line
mean_rate = np.mean(rates)
ax1.axhline(mean_rate, color='#FFD700', linestyle='--', linewidth=1.5, 
            label=f'Mean: {mean_rate:.4f}%', alpha=0.8)

# Add zero line for reference
ax1.axhline(0, color='#666666', linestyle='-', linewidth=0.8, alpha=0.5)

# Styling
ax1.set_title('BTC Funding Rate: Dec 2025 – Feb 2026', 
              fontsize=18, fontweight='bold', pad=20, color='white')
ax1.set_xlabel('Date', fontsize=14, color='white')
ax1.set_ylabel('Funding Rate (%)', fontsize=14, color='white')

# Format x-axis
ax1.xaxis.set_major_formatter(mdates.DateFormatter('%b %d'))
ax1.xaxis.set_major_locator(mdates.WeekdayLocator(interval=2))
plt.xticks(rotation=45, ha='right')

# Grid
ax1.grid(True, alpha=0.2, linestyle='--', linewidth=0.5)

# Legend
ax1.legend(loc='upper left', fontsize=11, framealpha=0.9)

# Add annotation
annualized = mean_rate * 3 * 365  # 3 times per day, 365 days
ax1.text(0.98, 0.95, f'Annualized: {annualized:.2f}%', 
         transform=ax1.transAxes, fontsize=12, 
         verticalalignment='top', horizontalalignment='right',
         bbox=dict(boxstyle='round', facecolor='#1a1a1a', alpha=0.8, edgecolor='#1DA1F2'),
         color='#FFD700')

plt.tight_layout()
plt.savefig('/Users/ruby/.openclaw/workspace/artifacts/design/btc-funding-timeseries.png', 
            dpi=150, bbox_inches='tight', facecolor='#15202B')
print("✅ Saved: btc-funding-timeseries.png")
plt.close()

# === CHART 2: Extreme Altcoin Funding Rates ===
fig2, ax2 = plt.subplots(figsize=(12, 8), dpi=150)

# Data from blog post (Feb 14, 2026)
tokens = ['COMP', 'LRC', 'RIVER', 'NOM', 'ESP', 'POWER']
rates_8h = [-1.44, -0.80, -0.62, -0.35, -0.34, 0.31]  # 8h rates
annualized = [-1577, -874, -675, -384, -368, 335]  # APY

# Color code: negative = green (you get paid), positive = red (you pay)
colors = ['#00D26A' if r < 0 else '#F45531' for r in rates_8h]

# Create bars
bars = ax2.barh(tokens, annualized, color=colors, edgecolor='white', linewidth=1.5, alpha=0.85)

# Add value labels
for i, (bar, val, rate) in enumerate(zip(bars, annualized, rates_8h)):
    label_x = val + (80 if val > 0 else -80)
    align = 'left' if val > 0 else 'right'
    ax2.text(label_x, i, f'{val:,}% APY', 
             va='center', ha=align, fontsize=11, fontweight='bold', color='white')
    
    # Add 8h rate annotation
    rate_x = val / 2
    ax2.text(rate_x, i, f'{rate:+.2f}% / 8h', 
             va='center', ha='center', fontsize=9, color='white', alpha=0.7)

# Styling
ax2.set_title('Extreme Funding Rates: Binance Altcoins (Feb 14, 2026)', 
              fontsize=18, fontweight='bold', pad=20, color='white')
ax2.set_xlabel('Annualized Rate (%)', fontsize=14, color='white')
ax2.set_ylabel('Token', fontsize=14, color='white')

# Add zero line
ax2.axvline(0, color='white', linestyle='-', linewidth=2, alpha=0.5)

# Grid
ax2.grid(True, axis='x', alpha=0.2, linestyle='--', linewidth=0.5)

# Add legend
from matplotlib.patches import Patch
legend_elements = [
    Patch(facecolor='#00D26A', label='Negative (shorts pay longs)', alpha=0.85),
    Patch(facecolor='#F45531', label='Positive (longs pay shorts)', alpha=0.85)
]
ax2.legend(handles=legend_elements, loc='lower right', fontsize=10, framealpha=0.9)

# Add context note
note = "Negative rates = short-heavy market\nThese rates mean-revert within 11-18h"
ax2.text(0.02, 0.98, note, transform=ax2.transAxes, 
         fontsize=9, verticalalignment='top', color='#AAA',
         bbox=dict(boxstyle='round', facecolor='#1a1a1a', alpha=0.6))

plt.tight_layout()
plt.savefig('/Users/ruby/.openclaw/workspace/artifacts/design/altcoin-funding-bars.png', 
            dpi=150, bbox_inches='tight', facecolor='#15202B')
print("✅ Saved: altcoin-funding-bars.png")
plt.close()

print("\n📊 Charts ready for Twitter:")
print("   1. BTC funding time series (shows 4% APY trend)")
print("   2. Altcoin funding extremes (shows -1,577% to +335% range)")
print("\n💡 Both optimized for dark mode Twitter feed")
print("   Resolution: 1800x900px (Twitter's optimal aspect ratio)")
