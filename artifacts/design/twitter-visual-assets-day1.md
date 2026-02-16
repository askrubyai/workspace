# Twitter Visual Assets - Day 1 Funding Rate Thread

**Created:** Feb 14, 2026 06:25 AM IST  
**Agent:** Wanda (Designer)  
**Purpose:** Visual support for Day 1 quant research Twitter thread

---

## Assets Created

### 1. BTC Funding Rate Time Series
**File:** `btc-funding-timeseries.png`  
**Size:** 1800x900px (Twitter optimized)  
**Data:** 200 live observations from Binance (Dec 2025 – Feb 2026)

**Visual Elements:**
- Blue gradient area chart showing 8-hour funding rates
- Yellow dashed line for mean rate (0.0036%)
- Annotation box with annualized rate (3.99% APY)
- Dark theme (#15202B background) for Twitter feed compatibility
- Clear date axis (weekly markers)

**Key Message:** "BTC funding is steady but boring — only 4% APY"

**Suggested Tweet Placement:** After Tweet 2 or 3 (when introducing the data)

---

### 2. Extreme Altcoin Funding Rates
**File:** `altcoin-funding-bars.png`  
**Size:** 1800x1200px (vertical for scrolling feed)  
**Data:** Live Binance rates from Feb 14, 2026

**Visual Elements:**
- Horizontal bar chart (easier to read token names)
- Color coded: Green = negative (you get paid), Red = positive (you pay)
- Dual labels: Annualized % + 8h rate
- Legend explaining funding direction
- Context note: "These rates mean-revert within 11-18h"
- Dark theme for Twitter

**Key Message:** "Long tail funding rates are WILD — from -1,577% to +335% APY"

**Suggested Tweet Placement:** After Tweet 4 (introducing extreme rates)

---

## Integration Suggestions

### Option A: Two-Image Thread (Recommended)
Add both images to create visual breaks:

```
Tweet 1: Hook (text only)
Tweet 2: Trade explained (text only)
Tweet 3: BTC data + [IMAGE 1: Time series chart]
Tweet 4: Long tail intro (text only)
Tweet 5: Extreme rates + [IMAGE 2: Bar chart]
Tweet 6: Mean reversion (text only)
Tweet 7: Cross-exchange (text only)
Tweet 8: CTA + link (text only)
```

**Why:** Breaks up text wall, increases engagement, makes data immediately scannable

### Option B: Single Hero Image
Use only the altcoin bar chart (it's the more visually striking one):

```
Tweet 4: "The long tail is nuts right now." + [IMAGE: Bar chart]
```

**Why:** Simpler, focuses on the most surprising data point

### Option C: Combined Image
Create a 2-panel composite (BTC time series on top, altcoin bars on bottom):

**Pros:** Single image upload, tells complete story  
**Cons:** Might be too dense for mobile

---

## Technical Specs

- **Resolution:** Optimized for Twitter's image display (1200-1800px width)
- **File format:** PNG with transparency support
- **Color palette:** Twitter dark theme (#15202B background, #1DA1F2 accent)
- **Text size:** Readable on mobile at 375px screen width
- **Accessibility:** High contrast ratios (WCAG AA compliant)

---

## Visual Design Principles Applied

1. **Hierarchy:** Most important info (annualized rates) in largest text
2. **Contrast:** Color-coded positive/negative for instant comprehension
3. **Context:** Added annotations to explain what numbers mean
4. **Consistency:** Twitter brand colors (#1DA1F2), dark theme
5. **Mobile-first:** Tested legibility at phone screen sizes

---

## Data Freshness

Both charts use **live Binance API data** pulled at generation time:
- BTC funding: Last 200 observations (rolling ~66 days)
- Altcoin rates: Current snapshot (Feb 14, 2026)

To regenerate with fresh data:
```bash
cd /Users/ruby/.openclaw/workspace/artifacts/design
source venv/bin/activate
python funding-rate-charts.py
```

---

## Files Location

```
/Users/ruby/.openclaw/workspace/artifacts/design/
├── btc-funding-timeseries.png    (Chart 1)
├── altcoin-funding-bars.png      (Chart 2)
├── funding-rate-charts.py        (Generator script)
└── twitter-visual-assets-day1.md (This doc)
```

---

## Next Steps

1. **Review:** Reuben reviews visual style + data accuracy
2. **Approve:** Confirm which integration option (A/B/C)
3. **Upload:** Add to Twitter thread when posting
4. **Iterate:** If style needs adjustment, update Python script and regenerate

---

## Design Rationale

**Why these charts specifically?**

- **Time series:** Shows BTC funding stability (builds credibility — "I actually pulled the data")
- **Bar chart:** Shows extremes (creates curiosity — "wait, -1,577%?!")
- **Dark theme:** Matches Twitter's default mode (90%+ of users)
- **Annotations:** Reduces need for alt text explanations in tweet

**What I avoided:**

- ❌ Line charts for altcoin data (too many tokens, messy)
- ❌ Pie charts (funding rates aren't parts of a whole)
- ❌ Light theme (jarring in dark mode feed)
- ❌ Overly technical axis labels (alienates non-quants)

---

*Visual design is about removing friction between the viewer and the insight. These charts do one job: make the data instantly obvious.*

— Wanda
