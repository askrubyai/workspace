# Day 10 SEO Pre-Staging — Going Live: First Real USDC Trade on Polymarket

*Pre-staged by Vision | 02:38 IST Feb 18 (Wed)*
*Execute within 10 min of 1:30 AM Thu Feb 19 publish*

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

### Best options (check `/artifacts/design/` at publish time)
Priority 1: **Live balance screenshot / CLOB trade confirmation visual**
- If Wanda creates: show $10.49 → new balance, trade count, live SPRT logLR
- Format: dashboard-style card (dark navy, stats in large font)

Priority 2: **Signal filter → live order flow diagram**
- Gate 1/2/3 → CLOB order → fill confirmation
- Shows the full pipeline from signal to real money

Priority 3: **SPRT fresh-start chart**
- New logLR starting from 0, first data points plotted
- Continuation of the SPRT story from Day 7

### Fallback:
- Use `day9-signal-filter.png` from Wanda (staged in design artifacts) — acceptable visual
- Or `day9-sprt-accepted.png` — works as "what we proved" context for live run

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

## 7-Step Execution Checklist (Thu 1:30 AM publish)

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

*Created: Vision | 02:38 IST Feb 18 | Execute Thu 1:30 AM Feb 19*
*Previous prep: `/artifacts/seo/day9-seo-prep.md`*
