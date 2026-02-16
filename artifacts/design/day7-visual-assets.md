# Day 7 Visual Assets — Fee Impact Table

**Created:** 2026-02-17 03:53 IST  
**Designer:** Wanda  
**Post:** "Day 7: From Backtest to Forward Test — Building a Polymarket Paper Trading Bot"  
**Status:** ✅ COMPLETE (12h ahead of deadline)

---

## Deliverables

### 1. Fee Impact Comparison Table ✅
**File:** `/artifacts/design/day7-fee-impact-table.png`  
**Dimensions:** 1200×675 (16:9 Twitter-optimized)  
**Format:** PNG, 465KB  
**Style:** Dark mode, high contrast

**Purpose:** Show before/after impact of Polymarket's fee change from 3% → 0%

**Key Elements:**
- **Two-column comparison** (Old 3% fee vs New 0% fee)
- **Four metrics per column:**
  - Fee Structure (3.0% vs 0.0%)
  - Gross Edge/Trade (+1.62% vs +0.12%)
  - Fee Cost (−3.00% vs −0.00%)
  - Net Edge/Trade (−1.38% vs +0.12%)
- **Status indicator:**
  - Old: ❌ Strategy Not Viable
  - New: ✅ Strategy Viable
- **Color coding:**
  - Negative values: Red (#ff6b6b)
  - Positive values: Green (#51cf66)
  - Old column header: Red
  - New column header: Green

**Design Rationale:**
This is the "money shot" visual for Day 7 — it shows in one glance why the Polymarket fee drop transforms the strategy from dead (-1.38% net) to profitable (+0.12% net). Loki's editorial review rated this as the most tweetable content from all 7 days because it's:
- **Immediate clarity:** Anyone can understand "was losing, now winning"
- **Time-sensitive:** Breaking news angle creates urgency
- **Concrete proof:** Numerical evidence of viability change
- **Accessible:** No quant background needed to grasp the impact

**Typography:**
- Title: 42px, bold, white
- Column headers: 28px, bold, color-coded
- Metric labels: 16px, uppercase, gray
- Metric values: 36px, extra bold, tabular nums
- Status: 48px, extra bold with emoji

**Background:**
- Gradient: #1a1f2e → #0f1419 (dark mode)
- Cards: Subtle translucent white (3% opacity)
- Borders: 1px white (8% opacity)

---

## Thread Integration

**Recommended placement:** Tweet 2 or 3 (after hook, before architecture dive)

**Hook context (from Quill's thread):**
> "Everything changed overnight. When I started this quant research 6 days ago, Polymarket charged 3% taker fees. My strategy was dead on arrival. As of Feb 2026, they dropped fees to 0%. Here's what that means: [IMAGE]"

**Alt text suggestion:**
> "Comparison table showing Polymarket strategy profitability: With 3% fee = -1.38% net edge (unprofitable), With 0% fee = +0.12% net edge (profitable)"

---

## Technical Specs

**Creation Process:**
1. Built HTML with CSS (dark mode design system)
2. Rendered via Chrome headless (1200×900 window)
3. Cropped to 1200×675 (16:9) using sips
4. Final output: 465KB PNG

**Design System Consistency:**
- Matches Days 1-6 visual style (dark mode, gradient backgrounds, consistent typography)
- Uses same color palette (#ff6b6b red, #51cf66 green, #8b949e gray)
- Maintains Ruby's Quant Journal branding (footer with "Day 7" highlight)

**Accessibility:**
- High contrast ratios (WCAG AA compliant)
- Color not sole differentiator (emoji + text labels reinforce status)
- Large, readable typography (minimum 16px body text)

---

## Performance Notes

**Time to Completion:** 21 minutes (03:32 AM start → 03:53 AM delivery)
- 8 min: Design + HTML/CSS
- 5 min: Screenshot capture + crop
- 3 min: Documentation + review
- 5 min: Buffer

**Deadline:** 4:00 PM IST (12h 7min away)  
**Actual delivery:** 3:53 AM IST (12h 7min early)

**Self-Rating:** 5/5
- On-spec (1200×675, dark mode, Twitter-optimized) ✅
- Clear visual hierarchy (eye flows: title → comparison → status) ✅
- Accessible (high contrast, emoji + text) ✅
- Matches design system (consistent with Days 1-6) ✅
- Tweetable (immediate "aha" moment for viewers) ✅

**What Worked:**
- Leading with the comparison format (Loki's suggestion) made the impact obvious
- ❌/✅ emoji status indicators are instantly scannable
- Color-coding negative/positive values guides interpretation
- Footer branding maintains series identity

**What I'd Change:**
- None — this is exactly what was needed for the breaking news hook

---

## Lessons Learned

**Lesson:** Breaking news visuals need maximum clarity over aesthetic sophistication. The fee impact table is deliberately simple (two columns, four rows, clear status) because the story is "this changed overnight" — complexity would dilute urgency.

**Applied from past lessons:**
- Twitter 16:9 spec (1200×675) is non-negotiable
- Dark mode is default (matches Ruby's brand + better mobile readability)
- Emoji reinforce meaning without relying solely on color (accessibility)
- Footer branding keeps series cohesive across 7 days

**For future breaking news visuals:**
- Lead with the delta (before/after, old/new)
- Use status indicators (✅/❌) for instant judgment
- Keep metric count low (4-5 max) for mobile scanning
- Breaking news = simplicity > sophistication

---

**Status:** Ready for Quill's 6:00 PM deployment. Visual delivered 12h early to unblock team.

*Wanda — Designer*  
*Completed: 2026-02-17 03:53 IST*
