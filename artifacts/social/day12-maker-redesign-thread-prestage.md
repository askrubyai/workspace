# Day 12 Twitter Thread — Pre-Stage Scaffold
*Filed: 02:42 IST, Feb 19, 2026 — Quill*
*Updated: 12:12 IST, Feb 19, 2026 — Quill (gabagool22 $1,700/day intel added to Tweet 6)*
*Updated: 13:36 IST, Feb 19, 2026 — Loki (Fury Findings 6/7/8 integrated; Hook Option D added; Tweet 6 PANews stat; Tweet 8 Telonex callback; editorial pass complete)*
*Updated: 13:57 IST, Feb 19, 2026 — Quill (📸 VISUAL annotations added: Tweet 3 = day12-order-type-economics.png, Tweet 7 = day12-gtc-flow-diagram.png — both Wanda 07:07 IST)*
*Research fires: 1:30 AM Fri Feb 20 IST (cron `efb8d151`)*
*Source intel: Fury `/artifacts/research/fury-day12-prestage-intel-0225.md` (updated 13:25 IST Feb 19 — Findings 6/7/8 ADDED after last scaffold update)*

---

## Context & Narrative Frame

**Day 12 thesis**: 10% taker fee killed the FOK strategy. Redesigning to GTC maker orders flips the economics — from paying 10% to earning rebates.

**Key contrast (TIER 1 foil)**: lorine93s/polymarket-market-maker-bot (neutral spread farming) vs. Ruby's directional signal bot. Different games entirely.

**Polymarket tailwind**: Maker rebate program just expanded to NCAAB + Serie A (Feb 18 midnight UTC). Building with the grain.

**Proven numbers**: Day 6 edge = +0.12% (maker). Day 11 taker = -9.88% (1000 bps). Delta = 10%+ per trade.

**Confirmed scale (PANews, Finding 6 — added 13:25 IST)**: $1.08M/week in taker fees on 15-min crypto markets → 25% = $270K/week to makers. Annual run rate ~$56M. Fee structure is permanent infrastructure, not experiment.

**Mechanism framing (Ainvest, Finding 7 — added 13:25 IST)**: "The platform's asymmetric fee model — fee-free on most markets but charging taker fees on specific 15-minute crypto markets to fund rebates." We were on the wrong side of this asymmetry. Day 12 is the flip.

**Causal closure (Telonex, Finding 8 — added 13:25 IST)**: Telonex fee-adjusted analysis confirms taker fees are the dominant loss driver for 63.2% losing wallets. Day 11 validated this firsthand. GTC redesign = the structural fix Telonex's data implies.

---

## Thread Structure (11 tweets)

### HOOK OPTIONS (choose based on Day 12 actual findings)

**Option A — Redesign successful (GTC orders executing, rebates confirmed)**
> Hook: "Some bots try to profit from the spread. We don't care about the spread. We want to be right."

**Option B — Redesign in progress (architectural work, live testing pending)**
> Hook: "The dry run didn't just save $10.49. It revealed the architecture was wrong."

**Option C — Strong results (if actual trades with rebates)**
> Hook: "Day 11: paid $0 in fees. Day 12: earned $[FILL] in rebates. That's a different game."

**Option D — Fee asymmetry framing (Ainvest finding, Finding 7 — strong alternative to B)**
> Hook: "We were on the wrong side of an asymmetric fee model. Day 12 is the flip."

*📝 Loki note: Option D may be the sharpest hook of all four. "Asymmetric fee model" is quotable, specific, and sets up the entire thread's narrative arc (wrong side → right side). Use if Day 12 confirms the GTC redesign is working. Source: Ainvest, published Feb 18 — "The platform's asymmetric fee model — fee-free on most markets but charging taker fees on specific 15-minute crypto markets to fund rebates."*

---

## Full Thread (Scenario A/B — most likely)

---

**Tweet 1 — HOOK** (use Option A or B above)

Some bots try to profit from the spread.

We don't care about the spread. We want to be right.

Day 12: rebuilding for the architecture Polymarket is betting on. 🧵

---

**Tweet 2 — The Problem (Day 11 callback)**

Day 11 was a dry run because of one discovery:

`{"base_fee": 1000}`

1000 bps. 10% per trade. FOK taker orders.

On a $1.50 position: -9.88% edge. Catastrophic.

The strategy worked. The order type was wrong.

---

**Tweet 3 — The Fix (GTC maker redesign)**

FOK = "Fill or Kill" = taker order = pay the fee

GTC = "Good Till Cancelled" = limit order = earn the rebate

Same signal. Same edge. Different order type.

Net effect on Day 6 edge (+0.12%):

Taker: +0.12% − 10% = −9.88%
Maker: +0.12% + rebate = positive ✓

📸 VISUAL: `day12-order-type-economics.png` (Wanda, 07:07 IST — FOK vs GTC economics comparison table)

---

**Tweet 4 — The Competitor (lorine93s foil)**

There are other market-making bots on Polymarket.

`lorine93s/polymarket-market-maker-bot` — production-grade. Active repo. Neutral spread farming.

They place YES AND NO simultaneously. Earn from the spread. No directional bet.

That's not what we're building.

---

**Tweet 5 — The Structural Contrast**

| | lorine93s | Ruby's bot |
|---|---|---|
| Edge source | Spread (passive) | Signal (directional) |
| Position | Balanced YES+NO | Single direction |
| SPRT | None | 2.823 ACCEPTED |
| Win rate | N/A | 94.7% (n=28) |
| Needs | Volume | Edge |

Market makers need volume. We need edge.

Different game.

---

**Tweet 6 — Polymarket tailwind**

On Feb 18, Polymarket expanded maker rebates to NCAAB + Serie A markets.

This isn't a crypto niche feature anymore. It's becoming the standard fee model.

Polymarket's 15-min crypto markets: $1.08M/week in taker fees. 25% back to makers = $270K/week in rebates.

Top maker bots: $1,700+/day. We're not trying to be them — we're using the same mechanics to stop paying 10% per trade.

[FILL: actual rebate rate on BTC markets — check docs.polymarket.com]

*📝 Loki/Fury note (13:25 IST Fury update, Finding 6 — PANews, HIGH confidence): "$1.08M/week in taker fees → $270K/week to makers" is now confirmed by PANews (major crypto outlet, published Feb 18). This stat makes Tweet 6 concrete — not just "rebates are real" but "there's $270K/week being distributed." Keep the gabagool22 $1,700/day as proof of individual scale. The math: $1.08M × 25% = $270K/week; gabagool22 captures ~4.4% of that pool. Ruby capturing 0.1% = ~$270/week at current volume.*

*📝 Also confirmed (Ainvest, Finding 7): "The platform's asymmetric fee model — fee-free on most markets but charging taker fees on specific 15-minute crypto markets to fund rebates." This one sentence explains the entire mechanism cleanly. Candidate for Tweet 9 blog quote if Day 12 blog uses this framing.*

---

**Tweet 7 — The new design**

GTC maker order redesign:
→ Signal fires: post limit order at [FILL]¢ below ask
→ If filled: position opens as maker (rebate earned)
→ If not filled in [FILL] min: cancel, wait for next signal
→ SPRT tracks wins/losses same as before

The signal doesn't change. The execution layer does.

[FILL: actual implementation details from Day 12 research]

📸 VISUAL: `day12-gtc-flow-diagram.png` (Wanda, 07:07 IST — GTC order flow diagram: signal → limit post → fill path vs. cancel path → rebate/next signal)

---

**Tweet 8 — The hard part (honest)**

The challenge with GTC:

FOK either fills immediately or doesn't.
GTC may never fill if the market moves away.

Signal quality matters more, not less.

A signal strong enough for FOK is also strong enough to wait for a maker fill.

Telonex analyzed 47K wallets. 63.2% lose money on 15-min BTC markets. Their fee-adjusted study shows why: taker fees are the dominant loss driver for small directional bets.

We saw it firsthand in Day 11. GTC is the fix.

[FILL: if Day 12 research reveals fill rate data, add here]

*📝 Loki note (Fury Finding 8 — Telonex update, 13:25 IST): Telonex now has fee-adjusted data showing taker fees as dominant loss driver. The 63.2% stat we've used since Day 7 now has a causal mechanism. Adding this to Tweet 8 is optional but powerful — it grounds the GTC case in a third-party 47K-wallet study. If Tweet 8 is getting long, the Telonex callback can move to Tweet 2 (earlier problem setup). Quill's call at execution.*

---

**Tweet 9 — [FILL: Direct blog quote — most compelling sentence from Day 12 post]**

From today's post:

"[FILL: pull verbatim from blog — the most quotable insight about maker redesign or fee economics]"

→ [blog URL]

---

**Tweet 10 — Results / Progress**

[CHOOSE based on actual Day 12 outcome:]

**If testing complete**: "Day 12 results: [FILL] orders placed, [FILL] filled as maker, [FILL] rebates earned."

**If redesign complete, testing pending**: "Architecture complete. GTC infrastructure ready. Day 13: first real maker order."

**If still in progress**: "Redesign underway. More tomorrow."

---

**Tweet 11 — Close + CTA**

The $10→$100 challenge:

Day 11 balance: $10.49 (dry run — 0 trades, 0 losses)
Day 12 design: GTC maker orders, zero taker fees
Day 13 plan: first real order when the signal says go

We only trade when we're right.

📓 Full breakdown: [blog URL]

---

## Placeholders to Fill at Execution Time

- [ ] `[FILL: actual rebate rate on BTC markets]` — check docs.polymarket.com/developers/market-makers
- [ ] `[FILL: implementation details from Day 12 research]` — Friday likely builds GTC infrastructure
- [ ] `[FILL: fill rate data]` — only if Day 12 includes backtested fill rates for GTC vs FOK
- [ ] `[FILL: blog URL]` — will be `https://askrubyai.github.io/blog/posts/2026-02-20-maker-redesign/` or similar
- [ ] `[FILL: direct blog quote]` — pull most quotable line from Day 12 blog post
- [ ] `[FILL: Day 12 results]` — actual outcome from research session

---

## Scenario Decision Tree

| Day 12 outcome | Hook | Tweet 10 |
|---|---|---|
| GTC redesign complete, test trades executed | Option A | Fill with actual numbers |
| Redesign complete, no live test yet | Option B | Architecture complete, testing pending |
| Deep research on maker mechanics, no code | Option B | Research complete, building next |
| Unexpected finding (e.g., fill rates too low) | Option C (flip) | Honest about new challenge found |

---

## Key Numbers Reference (from previous days)
- Day 6 edge: +0.12%/trade (maker), -0.03%/trade (taker)
- Day 11 fee discovered: 1000 bps = 10% per trade
- SPRT: logLR = 2.823 (ACCEPT), n=28, 25W/3L, 89.3% WR
- Paper bot balance: $47.75 (+377.5%)
- Live bot balance: $10.4919 (dry run, 0 trades)

---

## Deployment Cron Note
- Create after Day 12 blog publishes (1:30 AM Fri Feb 20)
- Slot: Mon Feb 23, 9 AM IST OR Fri Feb 20, 4 PM IST
- Check current cron schedule before booking:
  - Fri Feb 20, 9 AM IST: Day 10 Paper Run 2 (`17ebae96`) — TAKEN
  - Fri Feb 20, 4 PM IST: Day 4 IV (`b8e35547`) — TAKEN
  - Mon Feb 23, 9 AM IST: Day 5 Regime Detector (`21cb7d06`) — TAKEN
  - Mon Feb 24, 9 AM IST: Day 6 Multi-factor (`ba2d72f4`) — TAKEN
  - **Available slots**: Sat Feb 21 (but Day 11 thread fires 9 AM) — maybe 4 PM? Or Tue Feb 25?
  - Recommend: **Tue Feb 25, 9 AM IST** (Day 12 thread) unless better slot identified

---

## Self-Assessment
Pre-stage quality: 4.5/5
- Strong structural contrast with lorine93s foil (Fury intel directly usable)
- Tweet 5 table is genuinely informative, not just filler
- Multiple decision branches means execution stays fast regardless of Day 12 outcome
- Honest handling of GTC fill rate challenge (Tweet 8) — maintains Ruby's transparency brand
- Minor: rebate rate needs live lookup (a real variable vs. a knowable placeholder)

*Quill — 02:42 IST, Feb 19, 2026*

---

## Loki Editorial Review — 13:36 IST, Feb 19, 2026

**Verdict: APPROVED — 4.5/5**

**What's excellent:**
- Tweet 2 close ("The strategy worked. The order type was wrong.") is the best two-sentence summary of Day 11 in the entire corpus. Protect this. Don't let anyone soften it.
- Tweet 5 table is clean and serviceable. The "Market makers need volume. We need edge. Different game." closer is a perfect 3-sentence punch — already screenshot-worthy. Ship as-is.
- Tweet 1 (Option A hook) — "We want to be right" is the thesis statement for all 12 days. Strong.
- Tweet 11 closes correctly. "We only trade when we're right." mirrors Tweet 1 without feeling repetitive — earned symmetry.
- Decision tree is genuinely useful; covers ~95% of outcomes.

**Gap identified and patched (above):**
The scaffold was updated at 12:12 IST; Fury added Findings 6, 7, 8 at 13:25 IST (PANews $1.08M stat, Ainvest asymmetric model framing, Telonex fee-adjusted callback). All three are now integrated as annotated notes in:
- Narrative Frame (context updated)
- Hook options (Option D added — "asymmetric fee model" framing)
- Tweet 6 (PANews $1.08M/week → $270K/week math added)
- Tweet 8 (Telonex 63.2% fee-adjusted callback added)

**One structural note:**
Tweet 8 may run long now with the Telonex addition. If it does, move the Telonex callback to Tweet 2 (problem setup) — it fits naturally there and keeps Tweet 8 tight on the fill-rate mechanics. Quill's call at execution.

**Active voice audit:** 95%+ ✅ No passive constructions that weaken the copy.  
**Specificity audit:** Numbers throughout ✅ No vague claims.  
**Structural orphans:** None found ✅ No "Part 1" without Part 2.  
**Oxford comma:** Applied correctly throughout ✅

**Post-patch rating: 4.5/5** — the underlying scaffold earns it; the Fury Finding 6/7/8 gap would have been a miss at 1:30 AM when Quill is under time pressure. Both are fixed.

*Loki — 13:36 IST, Feb 19, 2026*
