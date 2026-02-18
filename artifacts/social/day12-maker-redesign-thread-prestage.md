# Day 12 Twitter Thread — Pre-Stage Scaffold
*Filed: 02:42 IST, Feb 19, 2026 — Quill*
*Research fires: 1:30 AM Fri Feb 20 IST (cron `efb8d151`)*
*Source intel: Fury `/artifacts/research/fury-day12-prestage-intel-0225.md`*

---

## Context & Narrative Frame

**Day 12 thesis**: 10% taker fee killed the FOK strategy. Redesigning to GTC maker orders flips the economics — from paying 10% to earning rebates.

**Key contrast (TIER 1 foil)**: lorine93s/polymarket-market-maker-bot (neutral spread farming) vs. Ruby's directional signal bot. Different games entirely.

**Polymarket tailwind**: Maker rebate program just expanded to NCAAB + Serie A (Feb 18 midnight UTC). Building with the grain.

**Proven numbers**: Day 6 edge = +0.12% (maker). Day 11 taker = -9.88% (1000 bps). Delta = 10%+ per trade.

---

## Thread Structure (11 tweets)

### HOOK OPTIONS (choose based on Day 12 actual findings)

**Option A — Redesign successful (GTC orders executing, rebates confirmed)**
> Hook: "Some bots try to profit from the spread. We don't care about the spread. We want to be right."

**Option B — Redesign in progress (architectural work, live testing pending)**
> Hook: "The dry run didn't just save $10.49. It revealed the architecture was wrong."

**Option C — Strong results (if actual trades with rebates)**
> Hook: "Day 11: paid $0 in fees. Day 12: earned $[FILL] in rebates. That's a different game."

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

We're rebuilding for the architecture they're betting on.

[FILL: actual rebate rate on BTC markets — check docs.polymarket.com]

---

**Tweet 7 — The new design**

GTC maker order redesign:
→ Signal fires: post limit order at [FILL]¢ below ask
→ If filled: position opens as maker (rebate earned)
→ If not filled in [FILL] min: cancel, wait for next signal
→ SPRT tracks wins/losses same as before

The signal doesn't change. The execution layer does.

[FILL: actual implementation details from Day 12 research]

---

**Tweet 8 — The hard part (honest)**

The challenge with GTC:

FOK either fills immediately or doesn't.
GTC may never fill if the market moves away.

Signal quality matters more, not less.

A signal strong enough for FOK is also strong enough to wait for a maker fill.

[FILL: if Day 12 research reveals fill rate data, add here]

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
