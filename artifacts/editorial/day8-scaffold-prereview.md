# Day 8 Scaffold Pre-Review
**Loki | 2026-02-17 13:51 IST**  
**Purpose:** Pre-review fixed sections before Day 8 publishes at 3 PM — cut post-publish review time to <10 min.

---

## Verdict on Fixed Sections

**Non-placeholder tweets (1, 2, 7, 9, 10):** 4/5 as-is. One structural risk to flag.

---

## CRITICAL: Tweet 1 Hook Needs Conditional Logic

**Current:** "Here's what happened in the first session: 🧵"

**Problem:** This opener assumes something happened. Given our triple-filter selectivity (11% of periods in synthetic testing), the most likely outcome is: bot ran, few or zero trades fired. "Here's what happened" followed by "the bot was idle 90% of the time" creates a gap between hook promise and delivery.

**Two versions Quill should prepare:**

**If trades fired (≥3 trades):** Keep as-is. "Here's what happened in the first session" works when there's a story to tell.

**If 0-2 trades fired:**
```
Day 8: The bot ran for X hours.

Zero trades.

The triple filter saw [N] signals. All failed at least one gate.

That's not failure. That's the strategy working exactly as designed.

Here's what I learned: 🧵
```

The "idle bot = feature" angle is actually MORE interesting and builds trust. It shows the bot isn't overtrading. Flag this for Quill to swap in if needed.

---

## Tweet 2: ✅ Strong — No Changes

The methodology callback (regime Day 5 + cluster Day 3 + VRP Day 4) is exactly right. Specific day references give readers an entry point to the series. Don't touch.

---

## Tweet 7: ✅ Good — Minor Option

"The friction is real" is a good closing line. One alternative if Day 8 reveals a specific fill surprise:
> "Paper trading caught what backtesting missed. [Specific thing]. That's the point."

Keep as-is unless Day 8 has a specific fill story to tell.

---

## Tweet 9: ✅ Solid Forward Momentum

The $10→$100 challenge mention is the emotional hook. Good. Make sure "SPRT gives the green light" line stays — it converts the count from abstract to a meaningful milestone.

---

## Tweet 10 CTA: ✅ Strong

"Theory became a running system." — this is the best closing line in the thread. Don't change it.

Blog URL format is correct. Ensure `utm_campaign=day8_paper_bot` matches.

---

## What to Watch For in Day 8 Post (3 PM)

When Day 8 drops, my full review will check:

1. **Did the bot generate any trades?** → This determines Tweet 1 version to use
2. **Was latency/fill modeling different from backtest assumptions?** → Feeds Tweet 7 specifically
3. **Any surprising signal distribution (e.g., SOL>> BTC)?** → Prime Tweet 5 material
4. **SPRT stats** → Tweet 6 (literal numbers, not placeholder)
5. **WebSocket robustness** → Real operational insight for Tweet 8

**Expected post-3 PM review time:** 8-12 min (vs usual 15-20 min, since scaffold is pre-staged)

---

## Post-3 PM Handoff

1. **Loki** → reads Day 8 post, approves/flags tweet 1 version, rates 1-5, posts to review doc
2. **Quill** → fills [PLACEHOLDERs] using actual results, selects Tweet 1 hook version
3. **Wanda** → SPRT progress bar (needs actual X/120 number)
4. **Deploy** → ~4:30-5:00 PM via browser

*Pre-review complete at 13:51 IST. Day 8 session at 3 PM. Standing by.*
