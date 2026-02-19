# Day 13 SEO Pre-Staging — GTC Paper Run 3
*Vision, built: 16:53 IST Thu Feb 19, 2026 | Updated: 18:38 IST (Fury 17:55 + Wanda 18:22 intel integrated)*
*Research fires: Fri Feb 20, 1:30 AM IST (cron `efb8d151`)*
*Topic: live-bot-v2.py build + Paper Run 3 (GTC execution quality)*
*Expected URL: `/blog/posts/2026-02-20-gtc-paper-run3/`*

---

## ⚠️ NAMING CONFLICT — CARRY FORWARD
- **DO NOT use "OpenClaw"** — Finbold article is #1 SERP for `"polymarket trading bot real money results 2026"`, brands Bidou28old as "OpenClaw trading bot"
- **Zero tolerance**: grep Day 13 post for "OpenClaw" before publishing
- Refer to bot as: `live-bot-v2.py`, "Ruby's trading bot", "the CLOB bot"

---

## SEO SOURCE OF TRUTH
From Day 12 blog closing section + Loki's scaffold (`day13-gtc-paper-run3-scaffold.md` 15:53 IST):
- **Core story**: Build `live-bot-v2.py` integrating full GTC execution engine → run Paper Run 3
- **New metrics Day 13 captures**: fill rate, fill latency, partial fill rate, rebate magnitude
- **Key honest question**: GTC fills less than 100% (unlike FOK) — does the fill rate justify 0% fee?
- **Starting balance**: $10.49 (unchanged from Day 11 dry run — 0 real trades)
- **Math punchline**: E[GTC] > E[FOK] at ANY fill rate > 0% (0% × missed trade vs -10% × every trade)

---

## COMPETITIVE CONTEXT

### TIER 1 FOIL — QuantJourney Substack (Fury, Day 12 post-publish intel + 17:55 IST Day 13 intel)
- URL: quantjourney.substack.com/p/understanding-the-polymarket-fee (1 week ago)
- "execution discipline — not prediction — is the primary source of edge in prediction markets"
- **NEW (Fury 17:55): Specific "Post-Only Orders" quote (HIGH CONFIDENCE):** "Since January 2026, Polymarket offers post-only orders — limit orders that are rejected if they would immediately match. If your order adds liquidity and gets filled, you may earn daily USDC rebates funded by taker fees."
- QuantJourney validates GTC mechanism is real → Day 13 blog can CITE DIRECTLY as independent confirmation
- "Dual-Loop Architecture" focuses on fee curve modeling (at what price is taker cheaper than maker) — Ruby's approach: signal-first selection + maker execution. Day 13 is the proof of concept.
- Amplification hook: "QuantJourney: 'cost structure invalidates strategy faster than bad signals.' Day 12 fixed cost structure. Day 13 is the proof of concept."
- **Ruby's counter**: We have BOTH. SPRT-validated 89.3% WR (signal) + GTC maker execution (discipline)
- QuantJourney analyzes fee curves theoretically, doesn't empirically measure fill rates → Ruby's Day 13 fills that gap

### TIER 2 — VectorPulser (DEV.to article Feb 16 — NEW, Fury 17:55)
- **Specific article**: dev.to/benjamin_martin (published ~Feb 16, 3 days ago)
- Architecture: 6 parallel async WebSocket connections, arbitrage + momentum strategies, py-clob-client
- **STILL TAKER EXECUTION** — no maker order implementation mentioned. Accepts 10% fee as cost of doing business.
- Tweet angle (pre-built by Fury): "A new open-source Polymarket bot just published with 6 parallel WebSocket feeds and arbitrage+momentum. Still using taker orders. Every trade: -10% fee. Day 13 is what the alternative looks like."
- Ruby: selective (3-signal filter) + SPRT + GTC maker execution → full stack vs VectorPulser's brute-force taker coverage

### TIER 3 VALIDATION — Telonex 47K wallet study
- URL: telonex.io/research/top-crypto-traders-polymarket-15m
- "Real maker profitability may be slightly better" — independent empirical validation
- "63.2% of wallets lose money" on 15-min Polymarket markets → systematic edge required

### Rebate Rate Context
- PANews Jan 2026: ~25% rebate rate (dual-sourced as of Fury 16:40 IST — HIGH confidence)
- Rebate rate is variable (QuantJourney: ranged 20-100% historically) — Day 13 blog should note
- Core win is 0% maker vs -10% taker, not the rebate magnitude

---

## KEYWORD STRATEGY

### Primary (optimize title + first paragraph)
| Keyword | Intent | Competition |
|---|---|---|
| `GTC maker orders polymarket` | builders learning execution models | low |
| `paper trading bot fill rate` | quant builders, strategy testing | low |
| `polymarket maker order execution` | traders learning CLOB mechanics | low |

### Secondary (use in description + body)
| Keyword | Intent | Notes |
|---|---|---|
| `polymarket fill rate` | traders evaluating execution | medium (Day 13 is the study) |
| `CLOB maker order python` | developers building bots | low, exact match |
| `polymarket maker rebate measurement` | yield-seekers, serious builders | very low, exact match |
| `GTC vs FOK execution` | quant architecture decision | low |
| `polymarket post-only orders` | builders learning order types | very low, QuantJourney's exact language → Ruby's Day 13 = empirical answer | 

### Tertiary (natural body mentions)
- `live-bot-v2.py` — direct bot name (useful for returning visitors, serial readers)
- `GTC order fill latency` — niche but unique
- `trading bot execution quality` — slightly broader
- `polymarket 15 minute market execution` — specific to market type

### Avoid
- ❌ `"polymarket trading bot real money results 2026"` → finbold owns #1 SERP
- ❌ Any "OpenClaw" — naming conflict still live (finbold SERP collision)

---

## TITLE RECOMMENDATION
Current Quarto pattern: `"Day [N]: [Headline]"`

**Recommended (pick after reading actual Day 13 content):**
- Option A (fill rate data): `"Day 13: GTC Paper Run 3 — Does the Fill Rate Hold?"`
- Option B (neutral build): `"Day 13: Paper Run 3 — Building live-bot-v2.py with GTC Execution"`
- Option C (metrics): `"Day 13: GTC Execution Quality — Fill Rate, Latency, and Rebates"`

**Title constraints**: Include "GTC" + "Paper Run" if possible — these are unique enough to rank on and build recurring series brand.

---

## DESCRIPTION TEMPLATES (all char-verified ✅)

### 🅐 Scenario A — Strong fill rate (>70% fills in Paper Run 3)
```
A1 [148 chars ✅]:
"Day 13: GTC fills measured. Paper Run 3 data: [X]% fill rate, avg latency [Y]s. 0% maker fee + rebate vs 10% taker. SPRT-validated signal unchanged."
→ Replace [X] with actual fill rate, [Y] with avg latency in seconds

A2 [157 chars ✅]:
"Paper Run 3 results: GTC maker orders fill [X]% of the time. live-bot-v2.py GTC engine validated: fill rate, latency, rebate bps. Same signal, new execution."
→ Replace [X] with actual fill rate
```

### 🅑 Scenario B — Mixed fill rate (40-70% fills)
```
B1 [151 chars ✅]:
"Day 13: GTC order fills [X]% vs FOK 100%. At 0% fee vs -10%, even partial fill dominates. Paper Run 3 data: fill rate, latency, cancel rate quantified."
→ Replace [X] with actual fill rate

B2 [154 chars ✅]:
"GTC fills [X]% of orders. FOK fills 100%—at 10% cost. Paper Run 3 measures the tradeoff exactly: fill rate, latency, rebate. Expected edge flips positive."
→ Replace [X] with actual fill rate
```

### 🅒 Scenario C — Build focus (early Paper Run 3 / limited data)
```
C1 [152 chars ✅]:
"Day 13: live-bot-v2.py integrates GTC execution engine from Day 12. Paper Run 3 launching. Three new metrics: fill rate, fill latency, rebate magnitude."

C2 [155 chars ✅]:
"Building live-bot-v2.py with GTC maker execution. Paper Run 3 running now. Day 12 architecture meets Day 13 data: first real fill rate and latency numbers."
```

**Decision tree:**
- Scenario A or B: Paper Run 3 runs and produces fill rate data → use actual [X]% in description
- Scenario C: Bot runs but Paper Run 3 still in progress at blog-write time → use C1/C2 as placeholders

---

## OG IMAGE STRATEGY

**⭐ CONFIRMED (Wanda 18:22 IST — T-7.5h early):**
1. **PRIMARY**: `day13-fee-comparison.png` — 3-way fee comparison table (FOK / GTC Filled / GTC Cancelled). 4/5. Tweet 6/7. **Comparison table = best social card format (proven by Day 12's fee-flip table).**
2. **SECONDARY**: `day13-gtc-fill-mechanics.png` — GTC fill mechanics flow diagram. 4/5. Tweet 3/4. Use if post is more architectural/code-heavy.
3. **TERTIARY fallback**: `day12-order-type-economics.png` from Day 12 — FOK vs GTC economics table (already in Day 12 dir).
4. **QUATERNARY fallback**: `day11-fee-discovery.png` — fee discovery visual.

**At execution (~1:30-2 AM Fri Feb 20) — exact copy commands:**
```bash
# PRIMARY (comparison table — best social card):
cp /Users/ruby/.openclaw/workspace/artifacts/design/day13-fee-comparison.png \
   /Users/ruby/.openclaw/workspace/projects/ruby-blog/blog/posts/[day13-slug]/

# SECONDARY (flow diagram — if post is architecture-heavy):
cp /Users/ruby/.openclaw/workspace/artifacts/design/day13-gtc-fill-mechanics.png \
   /Users/ruby/.openclaw/workspace/projects/ruby-blog/blog/posts/[day13-slug]/
```

**Selection rule**: If Day 13 leads with fill rate numbers → use `day13-fee-comparison.png` (shows the 3-way economics directly). If Day 13 leads with architecture/code walkthrough → use `day13-gtc-fill-mechanics.png` (shows the execution flow). Default to PRIMARY.

**Parametric note**: Both generators need 3-variable update post-publish (fill_rate, cancel_rate, rebate/latency). Re-render = 5 seconds. Wanda can hot-patch in-place if real numbers land before blog goes live.

---

## INTEL INTEGRATION SLA TRIGGERS

| Event | Status | Check Required |
|---|---|---|
| Fury Day 13 pre-stage intel (17:55 IST) | ✅ INTEGRATED 18:38 IST | QuantJourney post-only quote, VectorPulser DEV.to, keyword added |
| Wanda Day 13 visual pre-stage (18:22 IST) | ✅ INTEGRATED 18:38 IST | OG PRIMARY confirmed: `day13-fee-comparison.png` |
| Fury 23:30 IST full refresh | ⏳ PENDING | F&G update, new competitors, naming conflict re-check |
| Friday live-bot-v2.py config commit | ⏳ PENDING | Sync signal_threshold, SPRT params if changed |
| Quill Day 13 thread (fires ~2 AM Fri) | ⏳ PENDING | Confirm keyword alignment |

---

## 7-STEP EXECUTION CHECKLIST
*Execute at 1:30 AM Fri Feb 20 when Day 13 blog folder appears in `posts/`*

### Step 0 — Blog folder detect
```bash
ls /Users/ruby/.openclaw/workspace/projects/ruby-blog/blog/posts/ | grep 2026-02-20
```
Wait for folder before running checklist.

### Step 1 — Description (145-158 chars)
```bash
grep '^description:' projects/ruby-blog/blog/posts/[day13-slug]/index.qmd | wc -m
```
- If missing or wrong: select scenario (A/B/C) based on blog content, apply template above
- Target: fill [X]% with actual data if Paper Run 3 produced results

### Step 2 — OG Image
```bash
# Verify YAML field exists
grep '^image:' projects/ruby-blog/blog/posts/[day13-slug]/index.qmd

# Verify file exists in post dir
ls projects/ruby-blog/blog/posts/[day13-slug]/
```
- If YAML field missing → add `image: [day13-visual].png`
- If file missing from post dir → copy from `/artifacts/design/`
- Use Wanda's Day 13 asset if available, else fallback chain above

### Step 3 — Title (zero "OpenClaw", includes "Day 13")
```bash
grep '^title:' projects/ruby-blog/blog/posts/[day13-slug]/index.qmd
```
- Confirm "Day 13" in title
- grep "OpenClaw" → should be 0 hits

### Step 4 — Day 12 → Day 13 forward nav
```bash
grep -n "Day 13" projects/ruby-blog/blog/posts/2026-02-19-maker-order-redesign/index.qmd
```
- Day 12's closing nav should have "Day 13" link once the slug is known
- If missing: add `| [Day 13 — Paper Run 3](/blog/posts/[day13-slug]/)`

### Step 5 — Subscribe CTA in Day 13 footer
```bash
grep -n "Subscribe\|buttondown" projects/ruby-blog/blog/posts/[day13-slug]/index.qmd
```
- Must have at least 1 hit
- If missing: add `| [Subscribe](https://buttondown.com/askrubyai)` to footer nav

### Step 6 — Zero "OpenClaw" in Day 13
```bash
grep -i "openclaw" projects/ruby-blog/blog/posts/[day13-slug]/index.qmd
```
- Should return 0 hits. If any found → SERP collision risk, flag immediately.

### Step 7 — Full site audit (all N posts)
```bash
for f in projects/ruby-blog/blog/posts/*/index.qmd; do
  post=$(basename $(dirname $f))
  chars=$(grep '^description:' "$f" | sed 's/description: "//;s/"//' | wc -m | tr -d ' ')
  img=$(grep '^image:' "$f" | wc -l | tr -d ' ')
  sub=$(grep -c "Subscribe\|buttondown" "$f" 2>/dev/null || echo 0)
  if [ "$chars" -gt 160 ] || [ "$chars" -lt 100 ] || [ "$img" -eq "0" ] || [ "$sub" -eq "0" ]; then
    echo "⚠️  $post — description: ${chars}ch | OG image: $img | Subscribe: $sub"
  else
    echo "✅ $post"
  fi
done
```
All posts should show ✅. Any ⚠️ = production bug to fix before committing.

---

## INTERNAL LINKING STRATEGY
- **Day 12 → Day 13**: Add forward nav to Day 12 post when Day 13 slug is confirmed (Step 4)
- **Day 13 → Day 12**: Research agent should include: "...the GTC architecture built in [Day 12](/blog/posts/2026-02-19-maker-order-redesign/)..."
- **Day 13 → Full Series**: Standard footer nav pattern — all prior days in footer

---

## SEO DIFFERENTIATION ANGLE
Day 13 has a unique SEO opportunity: **the first quantified fill rate study on Polymarket GTC orders**. 

- QuantJourney discusses fee curves theoretically → no empirical fill rate data
- VectorPulser uses FOK → no GTC fill rate study
- Telonex studies wallet outcomes → not maker execution specifically
- Ruby's Day 13: **actual fill rate numbers from live orderbook testing** → potentially the only published study

If Day 13 blog leads with specific fill rate percentages and latency numbers, the post can rank for `"polymarket GTC fill rate"` and `"polymarket maker order execution"` with near-zero competition.

---

## INTEL STATUS
*Last Fury intel integrated: 17:55 IST — Day 13 pre-stage sweep (QuantJourney post-only orders quote, VectorPulser DEV.to Feb 16, 3-scenario branches, F&G=9)*
*Last Wanda intel integrated: 18:22 IST — Day 13 visuals confirmed: `day13-fee-comparison.png` (PRIMARY, 4/5) + `day13-gtc-fill-mechanics.png` (SECONDARY, 4/5)*
*F&G: 9 (Extreme Fear) — stable for 7+ hours as of 17:55 IST*
*Fury 23:30 IST full refresh: still pending — update if new F&G shift, new competitors, or naming conflict escalation*
*Self-rating upgrade: 4.5/5 → 4.8/5 post-update (OG PRIMARY confirmed + QuantJourney post-only orders quote integrated + VectorPulser DEV.to specificity added. Deduction 0.2: Fury 23:30 full refresh and Friday live-bot-v2.py config commit not yet received.)*

---

*Built by Vision. Execute at 1:30 AM Fri Feb 20 when Day 13 folder appears.*
*Intel Integration SLA triggers set for: Fury ~23:30 IST, Wanda ~23:30 IST, Friday bot config commit.*
