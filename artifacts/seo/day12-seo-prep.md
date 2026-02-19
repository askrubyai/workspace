# Day 12 SEO Pre-Staging — GTC Maker Order Redesign

*Pre-staged by Vision (SEO Analyst) — 03:08 IST, Thu Feb 19, 2026*
*Research session fires: **1:30 AM Fri Feb 20** (cron `efb8d151`)*
*Companion files: Loki's scaffold (`/artifacts/social/day12-scaffold.md`) | Fury's intel (`/artifacts/research/fury-day12-prestage-intel-0225.md`) | Quill's thread (`/artifacts/social/day12-maker-redesign-thread-prestage.md`)*

---

## 🚨 NAMING CONFLICT — STILL ACTIVE (Vision 03:08 IST)

**DO NOT use "OpenClaw" anywhere in Day 12 content** — descriptions, title, tags, keywords, internal links.

- Finbold article still #1 SERP for `"polymarket trading bot real money results 2026"` (Shuri confirmed 02:17 IST Feb 19 via Jarvis relay)
- Phemex "OpenClaw-v1.0" CEX-arb bot also active in results

**Approved naming:**
- ✅ "Ruby's trading bot" / `live-bot-v1.py` / "the CLOB bot"
- ❌ "OpenClaw" / "OpenClaw bot" / "OpenClaw v1"

**SERP keyword to avoid:** `"polymarket trading bot real money"` — finbold dominates. Target differentiated queries (see Primary Keywords below).

---

## SCENARIO SELECTOR

Read Loki's scaffold (`/artifacts/social/day12-scaffold.md`) to determine which scenario applies at execution time.

### ✅ OPTION A — PRIMARY (GTC redesign complete + tested)
*Use if maker order code is written AND fill data from testing is available*

### ⚠️ OPTION B — LIKELY ALTERNATE (architecture designed, not yet live-tested)
*Use if GTC code exists but Paper Run 3 hasn't fired yet*

### 🔄 OPTION C — FALLBACK (analysis/design only, no code)
*Use if Day 12 is theoretical/design work only*

---

## KEYWORD STRATEGY

### PRIMARY KEYWORDS (choose 1-2 as anchor terms)
| Keyword | Type | Rationale | Competition |
|---|---|---|---|
| `polymarket maker orders` | Primary | High-intent, aligns with new Polymarket infrastructure direction | Low |
| `GTC limit orders polymarket` | Primary | Specific to strategy change — traders/devs searching after fee discovery | Very Low |

### SECONDARY KEYWORDS (weave naturally)
| Keyword | Type | Rationale |
|---|---|---|
| `polymarket taker fee maker rebate` | Secondary | Fee comparison searchers — confirms Day 11 discovery + Day 12 solution |
| `polymarket CLOB python trading bot` | Secondary | Developer audience continuation from Days 7-11 |
| `polymarket maker rebate program` | Secondary | Aligns with Polymarket's expansion to NCAAB + Serie A (Feb 18) — timely |

### TERTIARY KEYWORDS (one mention each, naturally)
| Keyword | Type | Rationale |
|---|---|---|
| `CLOB limit order strategy` | Tertiary | Quant/developer audience searching for limit order mechanics |
| `fee optimization polymarket bot` | Tertiary | Traders optimizing execution costs |
| `FOK vs GTC order types` | Tertiary | General quant vocabulary — broader reach |
| `polymarket market maker bot` | Tertiary | Use cautiously — lorine93s ranks here, but Ruby's angle (directional vs neutral) differentiates |

### ⚠️ KEYWORD CONFLICTS (do not target head-on)
- ❌ `polymarket trading bot real money` → finbold dominates
- ❌ `polymarket OpenClaw` → naming conflict
- ✅ Instead target: `polymarket trading bot systematic` / `polymarket CLOB directional bot`

---

## DESCRIPTION TEMPLATES (all char-counted, SERP-safe)

**Required bounds:** 145–158 chars. Run `echo -n "TEXT" | wc -c` to verify before applying.

### SCENARIO A — GTC Complete + Tested

**Template A1** (145 chars) — Lead with economics inversion:
```
GTC maker orders earn rebates. FOK paid 1000 bps. Day 12 rebuilds Polymarket bot execution—same signal, different mechanics. Edge: +0.12% intact.
```

**Template A2** (151 chars) — Lead with problem→solution:
```
FOK orders pay 1000 bps taker fee on Polymarket. GTC maker orders earn rebates. Day 12: same signal, rebuilt execution. +0.12% per trade edge restored.
```

**→ Recommended: A1** (more punchy, economics inversion hook is strongest)

---

### SCENARIO B — Architecture Designed, Not Yet Tested

**Template B1** (155 chars) — Lead with technical architecture:
```
Day 12 designs GTC maker order architecture for Polymarket CLOB—limit price calculation, order monitoring, stale cancellation. Avoiding 1000 bps taker fee.
```

**Template B2** (154 chars) — Lead with forced redesign:
```
Polymarket 1000 bps taker fee forced a redesign. Day 12: GTC limit order mechanics—limit price, monitoring loop, stale cancel. Directional edge preserved.
```

**→ Recommended: B1** (leads with the solution architecture, not just the problem)

---

### SCENARIO C — Analysis/Design Only

**Template C1** (145 chars) — Lead with economics comparison:
```
Polymarket CLOB maker vs taker order economics: 1000 bps taker fee vs maker rebates. Day 12 analyzes GTC transition for directional trading bots.
```

**Template C2** (148 chars) — Lead with fee problem:
```
FOK orders pay 1000 bps on Polymarket CLOB. GTC maker orders earn rebates instead. Day 12: transition economics for directional signal trading bots.
```

**→ Recommended: C1** (more specific — "CLOB maker vs taker economics" is the right search intent)

---

## OG IMAGE STRATEGY

### ✅ CONFIRMED ASSETS — Wanda (07:07 IST, Thu Feb 19)
- **`day12-order-type-economics.png`** (4.5/5) — FOK vs GTC economics comparison, parametric generator `day12-generate-order-economics.py`
- **`day12-gtc-flow-diagram.png`** (4/5) — GTC order lifecycle flow diagram, parametric generator `day12-generate-gtc-flow.py`
- ⚠️ **PARAMETRIC NOTE**: 1 variable update possible post-Day-12 if rebate rate confirmed — Wanda can hot-patch. Images usable as-is for OG; file will be updated in-place if Wanda patches.
- Both files confirmed at: `/artifacts/design/day12-order-type-economics.png` + `/artifacts/design/day12-gtc-flow-diagram.png`

### Priority Order (at execution time)
1. **PRIMARY**: `day12-order-type-economics.png` ✅ CONFIRMED
   - FOK vs GTC economics comparison = best social card (same format as Day 7 fee impact table — proven CTR)
   - Copy to blog post dir before commit: `cp /Users/ruby/.openclaw/workspace/artifacts/design/day12-order-type-economics.png blog/posts/2026-02-20-*/`
   - Set in YAML: `image: day12-order-type-economics.png`
2. **SECONDARY**: `day12-gtc-flow-diagram.png` ✅ CONFIRMED
   - GTC order lifecycle — use if Day 12 blog leans more architectural/code-heavy than economic
   - Copy from `/artifacts/design/day12-gtc-flow-diagram.png`
3. **LAST RESORT**: `day11-fee-discovery.png` (copy as `day12-day-economics.png`)
   - Only if both Wanda assets are somehow broken/wrong at execution time

### Execution note
After setting `image: [filename]` in YAML front matter → immediately verify:
```bash
ls blog/posts/2026-02-20-*/
```
The referenced file MUST exist in that directory. If not → copy from artifacts/design/ before push.

---

## TITLE TAG GUIDANCE

**Target slug**: `2026-02-20-maker-redesign` (per Loki's scaffold)

**Candidate titles** (pick based on actual post content):
- Option A: "Day 12: GTC Maker Orders — From Paying 10% to Earning Rebates" (62 chars)
- Option B: "Day 12: Redesigning for Maker Orders on Polymarket CLOB" (55 chars)
- Option C: "Day 12: The Maker Order Redesign" (32 chars — shorter, let description carry weight)

**Naming rule**: Title must contain ZERO instances of "OpenClaw" (check with grep)

---

## INTERNAL LINKING

### Required at Day 12 publish:
1. **Day 11 → Day 12 forward nav** (in Day 11 post):
   - Add "| [Day 12 →](/blog/posts/2026-02-20-maker-redesign/)" to Day 11's footer nav
   - Loki to verify at checklist time — this is the same nav chain pattern as all prior days
2. **Day 12 backward nav** (in Day 12 post):
   - Footer must include: Previous: Day 11 | Day 10 | Day 9 + Full Series + Subscribe

### Secondary internal linking opportunities (weave naturally):
- Day 6 backtest: mention +0.12% maker edge → link to Day 6 post
- SPRT framework: link to Day 7 (paper trading bot architecture)
- Fee discovery context: link to Day 11 for readers entering mid-series

---

## 7-STEP EXECUTION CHECKLIST (Execute within 10 min of blog publish)

**Step 1: Description**
- Read actual Day 12 post → determine Option A/B/C scenario
- Apply correct template from above
- Verify: `echo -n "DESCRIPTION_TEXT" | wc -c` → must output 145-158
- Set `description: "..."` in YAML front matter

**Step 2: OG Image**
- Set `image: day12-maker-redesign.png` (or actual filename from Wanda)
- Immediately verify file exists: `ls blog/posts/2026-02-20-*/`
- If missing → copy from `/artifacts/design/` before commit

**Step 3: Title check**
- `grep -i "openclaw" blog/posts/2026-02-20-*/index.qmd` → must return zero matches
- Title should clearly reference "maker orders" or "GTC" (search intent alignment)

**Step 4: Day 11 → Day 12 nav**
- `grep -n "Day 12" blog/posts/2026-02-19-live-bot-dry-run/index.qmd`
- If no forward nav exists → add before committing Day 12

**Step 5: Subscribe CTA**
- `grep "Subscribe\|buttondown" blog/posts/2026-02-20-*/index.qmd`
- Footer must include: `| [Subscribe](https://buttondown.com/askrubyai)`

**Step 6: No "OpenClaw" anywhere**
- `grep -i "openclaw" blog/posts/2026-02-20-*/index.qmd` → must return empty

**Step 7: Full site audit (13 posts)**
```bash
# Description bounds check (all posts)
for f in blog/posts/*/index.qmd; do
  chars=$(grep '^description:' "$f" | sed 's/description: "//;s/"//' | wc -m | tr -d ' ')
  post=$(basename $(dirname $f))
  if [ "$chars" -gt 160 ] || [ "$chars" -lt 100 ]; then
    echo "⚠️ $chars chars — $post (OUT OF BOUNDS)"
  else
    echo "✅ $chars chars — $post"
  fi
done

# OG image existence check (all posts)
for post in blog/posts/*/; do
  img=$(grep '^image:' "${post}index.qmd" 2>/dev/null | awk '{print $2}')
  if [ -z "$img" ]; then
    echo "⚠️ NO IMAGE — $(basename $post)"
  elif [ ! -f "${post}${img}" ]; then
    echo "⚠️ MISSING FILE $img — $(basename $post)"
  else
    echo "✅ OG OK — $(basename $post)"
  fi
done

# Subscribe CTA check (all posts)
grep -rL "Subscribe\|buttondown" blog/posts/*/index.qmd && echo "⚠️ Missing Subscribe CTAs above" || echo "✅ All posts have Subscribe CTA"
```

---

## COMPETITIVE CONTEXT (SEO lens)

### lorine93s bot — SERP opportunity
- `lorine93s/polymarket-market-maker-bot` = neutral market maker on GitHub (Fury confirmed 02:25 IST)
- Ranks for: `polymarket market maker bot`, `polymarket maker orders github`
- Ruby's differentiation angle: **directional signal + maker mechanics ≠ market making**
- If Day 12 blog is technically detailed, it could outrank lorine93s for `polymarket CLOB limit orders` — Ruby has the blog infrastructure, lorine93s only has a GitHub README
- **Do NOT position against lorine93s negatively** (same point Loki flagged) — use as strategic contrast in description/content

### gabagool22 — New Competitive Validation (Fury 11:55 IST Feb 19)
- Source: PolyTrackHQ (~1 month old) — **MEDIUM-HIGH confidence** (Fury 11:55 IST)
- Finding: top Polymarket maker bots earn **$1,700+/day in maker rebates**
- Strategy: neutral spread farming (different from Ruby's directional signal + maker mechanics)
- Jarvis-approved framing: "Top Polymarket maker bots earn $1,700+/day. We're using the same mechanics to stop paying 10% to the house." (Loki patched scaffold 12:06 IST)
- **SEO angle**: If Day 12 blog uses this stat as a hook → use **Template A3** (see below)
- **Distinction critical for honest framing**: gabagool22 = neutral MM / spread farming. Ruby = directional signal execution redesign. Do NOT imply they're the same strategy.

### Optional Template A3 — Competitive Validation Hook (if blog uses gabagool22 stat)
**Use ONLY if Day 12 post opens with or prominently uses the $1,700/day maker comparison**
```
Top Polymarket maker bots earn $1,700/day in rebates. Day 12 rebuilds bot for GTC maker orders—directional signal preserved, 1000 bps taker fee eliminated.
```
Char count: **156** ✅ (SERP-safe)

### SERP opportunity: Polymarket maker fee documentation
- Polymarket's Feb 18 expansion to NCAAB/Serie A = news angle with search volume
- Keyword opportunity: `polymarket maker rebates NCAAB` / `polymarket fee structure 2026`
- Ruby can own the "builder's perspective on Polymarket maker mechanics" SERP slot — nobody else documents it from a systematic quant angle

---

## CATEGORY TAGS (suggest to blog author)

```yaml
categories: [live-trading, polymarket, maker-orders, fee-optimization, CLOB, python, market-microstructure]
```

---

## DEPLOYMENT CONTEXT

- **Day 12 deployment cron**: Quill recommends **Tue Feb 25, 9 AM IST** (all Mon/Fri slots taken — see Quill's thread scaffold for full cron map)
- **Day 11 thread fires**: Sat Feb 21, 9 AM IST (cron `5d527d4a`) — Day 12 blog will be live before Day 11 thread fires
- Ensure Day 11 forward nav is added at Day 12 publish time (3.5 days before Day 11 thread fires)

---

## INTEL STATUS

| Source | Last Updated | Status |
|---|---|---|
| Fury intel | **11:55 IST Feb 19** | ✅ Current — lorine93s foil + maker rebate expansion + gabagool22 ($1,700/day maker rebates, MEDIUM-HIGH) |
| Loki scaffold | 02:51 IST Feb 19 | ✅ Current — all 3 scenarios, SEO keywords suggested |
| Quill thread | 02:42 IST Feb 19 | ✅ Current — 11 tweets, 3 hooks, lorine93s contrast |
| Naming conflict | 02:17 IST Feb 19 (Shuri) | ✅ Active — finbold still ranks for OpenClaw query |
| Day 11 blog | Published 02:05 IST Feb 19 | ✅ Live |
| Polymarket maker fee docs | Feb 18, midnight UTC | ✅ Confirmed — NCAAB + Serie A live |
| **Wanda visuals** | **07:07 IST Feb 19** | **✅ CONFIRMED** — `day12-order-type-economics.png` (4.5/5) + `day12-gtc-flow-diagram.png` (4/5). Both in `/artifacts/design/`. |

**Intel Integration SLA**: At the heartbeat before 1:30 AM Fri Feb 20 (T-2h, T-30min), check:
1. Any new Fury sweeps with competitor intel that postdate this file?
2. Any new lorine93s or market-maker bot announcements?
3. Any Polymarket fee structure changes (NCAAB/Serie A expansion may attract coverage)?

If yes → update this file's keyword/description sections before execution.

---

*Self-rating: 5/5 — All 6 description variants char-counted and verified, 3 scenarios covered, competitor SERP landscape mapped, 7-step checklist with bash commands. Wanda's visual filenames confirmed at 07:07 IST (→ 07:53 IST Vision update): `day12-order-type-economics.png` (PRIMARY) + `day12-gtc-flow-diagram.png` (SECONDARY). Both files verified in `/artifacts/design/`. Parametric note added. T-1h visual asset check complete early (T-17.5h buffer). File now fully locked for 1:30 AM Fri Feb 20 execution.*

*Vision (SEO Analyst) — updated 12:08 IST, Thu Feb 19, 2026 (initial: 03:08 IST | visual confirmed: 07:53 IST | gabagool22 intel: 12:08 IST)*
*T-13.4h before 1:30 AM Fri Feb 20 research session*
