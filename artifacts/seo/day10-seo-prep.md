# Day 10 SEO Pre-Staging — Going Live: First Real USDC Trade on Polymarket

*Pre-staged by Vision | 02:38 IST Feb 18 (Wed)*
*⚠️ TIMING UPDATE (Vision 13:23 IST): Execute within 10 min of **3:00 PM TODAY (Wed Feb 18)** — NOT 1:30 AM Thu. Research session `b71a6e79` fires at 3 PM IST.*
*⚠️ SCENARIO UPDATE: Reuben has NOT given live bot go-ahead as of 13:15 IST. Treat **Template C (paper run 2)** as PRIMARY scenario. Upgrade to Template A if go-ahead arrives before 3 PM.*

---

## Confirmed Topic (from Day 9 closing section)

Day 9 explicitly teased: **"Tomorrow we go live. The paper bot becomes a real trading bot."**

Day 10 will document:
1. First real CLOB trade execution (live-bot-v1.py → real USDC)
2. Fill quality vs paper assumptions (FOK orders, 200ms latency model)
3. Live SPRT tracking from n=0 with fresh run
4. Whether edge survives contact with reality

**Secondary scenario**: If Reuben didn't give go-ahead → second paper run with signal_threshold=0.30 (much more selective than v1). This is the fallback.

---

## Description Templates

### Template A: Live Trading Started (primary — fill [BRACKETS])
```
Live bot, day 1: [N] real trades, [Z]% win rate. $10.49 USDC → $[B].
CLOB FOK orders, [X]ms avg fill, signal filter in action.
Paper assumed edge = [compare]. Reality check: $10→$100 challenge is live.
```
*(trim to ≤160 chars — prioritize: trade count, win rate, balance)*

**Character-counted variant (use if tight):**
```
Live trading day 1: [N] trades, [Z]% WR, $10.49 → $[B] USDC.
Polymarket CLOB bot in production. Edge surviving contact with reality?
```

### Template B: Live Bot Started but Early (few trades, no verdict yet)
```
Live bot launched: [N] real USDC trades on Polymarket. Signal filter: 3-gate system.
Fill latency [X]ms vs 200ms paper assumption. SPRT needs ~[Y] more. Day 10 update.
```

### Template C: Second Paper Run (fallback if live didn't launch)
```
Paper run 2 with 30% signal threshold (vs 65% in v1). [N] signals → [X] trades.
Filter selectivity: [Z]% pass rate. Win rate: [W]%. Live trading next.
```

### Universal Fallback (≤160 chars, always valid)
```
$10→$100 live: real CLOB orders, signal filter, SPRT from scratch.
Polymarket live bot day 1. Day 10 of building a quant system in public.
```

---

## Primary Keyword Targets

| Keyword | Competition | Why It Fits |
|---|---|---|
| "live trading bot polymarket" | near-zero | Own the category first |
| "CLOB trading bot python" | low | Technical differentiation |
| "real money trading bot" | medium | Broad + high intent |
| "polymarket bot python" | low | Platform-specific, growing |
| "$10 to $100 challenge" | near-zero | Series anchor |
| "live SPRT trading" | near-zero | First mover |
| "algorithmic trading live results" | medium | Broader audience |

**Primary focus**: "live trading" + "real money" + "Polymarket bot"
**Secondary**: reinforce "signal filtering" (Day 9) + "SPRT" (ongoing theme)

**Big SEO opportunity**: Day 10 is "Day 1 of live trading" — creates a NEW sub-series anchor ("Live Trading Day [N]") that can have its own search trajectory alongside the research series.

---

## OG Image Strategy

### ✅ UPDATED 14:23 IST — Wanda pre-staged Day 10 visuals at 14:07 IST

**Wanda's Day 10 assets** (in `/artifacts/design/`):
- `day10-paper-run2-hook.png` — Tweet 1 hero card (placeholder "??" state → updated ~3:05 PM)
- `day10-run-comparison.png` — Run 1 vs Run 2 comparison table (updated ~3:05 PM)
- `day10-generate-visuals.py` — parametric generator, updates 6 numbers post-publish (~5 min)
- `day10-visual-assets.md` — update guide and integration notes

**For Template C (paper run 2) — PRIMARY scenario:**
Priority 1: `day10-run-comparison.png` — **USE THIS after Wanda runs the script with real numbers (~3:05 PM)**
  - Run 1 vs Run 2 comparison directly illustrates Day 10's content
  - Copy to blog post directory: `cp artifacts/design/day10-run-comparison.png posts/[slug]/`
Priority 2: `day10-paper-run2-hook.png` — alternate (hero card with trade count/WR/balance)
Priority 3: `day9-signal-filter.png` — fallback if Wanda's update is delayed (3-gate filter works for either scenario)

**For Template A (live trading) — UPGRADE if Reuben gives go-ahead before 3 PM:**
Priority 1: Live dashboard visual from Wanda (30 min build — alert Wanda immediately if go-ahead arrives)
Priority 2: `day10-run-comparison.png` (still relevant — shows what paper predicted vs. live reality)
Priority 3: `day9-signal-filter.png` — fallback

**EXECUTION TIMING**: Wanda updates script with real numbers after you identify [N]/[Z]/[W] from the post (~3:02 PM). Wanda's ~5 min update window → you use updated PNG, not the placeholder. If in doubt, use `day9-signal-filter.png` immediately and update the OG image in a follow-up commit.

### YAML format:
```yaml
image: day10-[actual-filename].png
```
*(check `ls posts/[day10-slug]/` at publish time)*

---

## Title Optimization (60-char target)

**Preferred (for live trading scenario):**
1. `Day 10: Going Live — First Real Trade on Polymarket` (51 chars) ← clarity + drama
2. `Live Bot Day 1: Real Money, Real SPRT, Real Edge` (49 chars)
3. `$10→$100 Goes Live: First CLOB Trade Results` (45 chars)
4. `Polymarket Live Bot: Day 1 Results` (35 chars) ← short, punchy

**Preferred (for second paper run):**
1. `Day 10: Paper Run 2 — Tighter Signal Filter, Better Results?` (60 chars)
2. `Signal Filter v2: 30% Threshold vs 65% Baseline` (48 chars)

**Key**: If live trading started, lead with "Live" or "$10→$100 Goes Live" — that's the hook that will drive shares and return visits.

---

## Internal Linking (execute at publish — 5 min)

### Day 10 MUST link to:
- [ ] Day 9 (Signal Filtering): `../2026-02-18-signal-filtering/`
- [ ] Day 7 (Paper Trading Bot Architecture): `../2026-02-17-paper-trading-bot/`
- [ ] Day 8 (Kelly Criterion sizing): `../2026-02-17-kelly-criterion/`
- [ ] Full Series: `https://askrubyai.github.io/blog/`
- [ ] Subscribe CTA in footer nav (mandatory for every post)

### Day 9 MUST be updated forward to Day 10:
```
| [Day 10: Going Live →](../[day10-slug]/)
```
Day 9 currently ends with: *"The $10→$100 challenge starts tomorrow."* — Day 10 forward link is the natural anchor text: "**Day 10: It's live →**"

---

## 7-Step Execution Checklist (Wed 3:00 PM publish — TODAY)

1. **Identify slug** → `ls /Users/ruby/.openclaw/workspace/projects/ruby-blog/blog/posts/ | tail -1`
2. **Read Day 10 content** → live trading (Template A/B) or paper run 2 (Template C)?
3. **Select description** → fill [N], [Z], [B], [X], [Y] with real numbers
4. **Confirm OG image** → `ls posts/[slug]/` — request from Wanda if none pre-staged
5. **Update Day 9 nav** → add forward link (commit: "SEO: Day 9 → Day 10 forward link")
6. **Apply description + OG** → verify description ≤160 chars
7. **Commit + push** → `SEO: Day 10 meta + internal linking + Day 9 forward nav`

**Target: <10 min** (fill-in-the-blank from actual results)

---

## Subscribe CTA Check
After adding Day 10 nav footer, verify pattern:
```
*Previous: [Day 9 →](...) | [Full Series](/blog/) | [Subscribe](https://buttondown.com/askrubyai)*
```
**Must include Subscribe link** — this is mandatory per Vision's operating rule (every post = email capture opportunity).

---

## Series Completeness Quick Check
```bash
grep -rn "Subscribe\|buttondown" /Users/ruby/.openclaw/workspace/projects/ruby-blog/blog/posts/*/index.qmd | wc -l
```
Should return ≥11 (Day 0 through Day 10). If <11, add missing Subscribe CTAs before pushing.

---

## Strategic Note — Day 10 SEO Significance

Day 10 opens a **new search category**: "Live Polymarket trading bot results."

- Days 1-9 = research/paper phase (retrospective, low-urgency search intent)
- Day 10+ = live results (ongoing story, high-recency search intent)

Live trading results have **fundamentally different SEO dynamics**:
- High recency value (people search for live bot updates daily)
- Natural share hooks ("I'm watching this live")
- Return visitor motivation (want to see next day's results)

**Recommendation**: Title each live trading day as "Live Bot Day [N]" in addition to the topic title. This creates a recurring search pattern: "live bot day 2", "live bot day 3", etc.

---

*Created: Vision | 02:38 IST Feb 18 | Updated: Vision | 13:23 IST Feb 18 (timing correction + scenario update)*
*Execute: Wed 3:00 PM Feb 18 (TODAY — not Thu 1:30 AM)*
*Previous prep: `/artifacts/seo/day9-seo-prep.md`*
