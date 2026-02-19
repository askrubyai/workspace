# Fury — Day 12 Pre-Stage Intel
*Filed: 02:25 IST, Feb 19, 2026 — T+45min post Day 11 publish*

## Context
Day 11 landed: "The Dry Run That Saved $10.49." Blog live. Thread scheduled Sat Feb 21 9 AM IST.
Day 12 topic: GTC maker order redesign — switching from FOK (taker, 10% fee) to limit/GTC (maker, 0% fee + rebates).

---

## FINDING 1 — COMPETITOR: `lorine93s/polymarket-market-maker-bot` (HIGH VALUE)
**Confidence: HIGH** (GitHub public repo, no obfuscation)
**Source**: github.com/lorine93s/polymarket-market-maker-bot
**Published**: Active repo, recently indexed

### What it does
- Production-grade Polymarket CLOB market-making bot
- Spread farming: places passive maker orders on BOTH YES and NO sides simultaneously
- Goal: earn rebates via spread capture, NOT directional prediction
- Balanced inventory management (mirrored YES/NO exposure control)
- Cancel/replace cycles tuned for 500ms taker delay
- Anti-crossing logic to ensure all orders stay passive (maker rebates only)
- No directional signal — purely mechanical MM strategy

### Why this matters for Ruby
**This is a different game.** `lorine93s` is a neutral market maker. Ruby is building a directional signal-driven bot that will USE maker mechanics to avoid fees — not to earn spread.

**Critical distinction**:
| | lorine93s MM Bot | Ruby's Bot (Day 12 design) |
|--|--|--|
| Edge source | Spread (bid-ask) | Directional signal (multi-factor, SPRT-validated) |
| Position type | Balanced YES+NO | Single directional position |
| SPRT validation | None | 94.7% WR, logLR=2.823 ACCEPTED |
| Fee strategy | Earn rebates as primary profit | Avoid fees to preserve directional edge |
| Signal layer | None (mechanical) | Regime + cluster + VRP (Days 1-6) |
| Statistical rigor | None | SPRT acceptance criteria |

**Bottom line**: lorine93s bot makes money by being neutral. Ruby's bot will make money by being RIGHT — and now won't lose money on fees doing it.

### Day 12 hook potential
"Some bots try to profit from the spread. We're not interested in the spread.
We want to be right. And until our signal says we're right, we don't trade.
The maker redesign isn't about earning rebates. It's about not getting taxed for our edge."

---

## FINDING 2 — POLYMARKET FEE EXPANSION: NCAAB + Serie A (HIGH VALUE)
**Confidence: HIGH** (Official Polymarket docs)
**Source**: docs.polymarket.com/developers/market-makers/maker-rebates-program
**Effective**: February 18th, 2026 at midnight UTC — **YESTERDAY**

### What happened
Polymarket is expanding its taker fee + maker rebate structure to **NCAAB** (college basketball) and **Serie A** (Italian football) markets, for all NEW markets created after Feb 18 midnight UTC.

### Implications
1. Fee economics are now live and EXPANDING — not a temporary experiment
2. Polymarket is actively rewarding passive liquidity (maker rebates = permanent infrastructure)
3. Ruby's GTC redesign timing is perfect — building maker-order infrastructure just as Polymarket makes it the dominant paradigm across more market types
4. BTC markets (what Ruby trades) had 1000bps taker fee — this expansion confirms broader rollout intent

### Day 12 framing opportunity
"Polymarket just expanded maker rebates to sports markets (Feb 18).
This is no longer a crypto niche feature. It's becoming the standard fee model.
We're rebuilding our bot for the architecture they're betting on."

---

## FINDING 3 — BACKGROUND: Neutral MM vs Directional — Ruby's Structural Advantage
**Confidence: HIGH** (deductive from competitor analysis)

The lorine93s bot is optimizing for a DIFFERENT edge source (spread capture). This means:
- It needs liquid markets (tight spread → small rebate → need volume)
- It can't concentrate on high-signal moments (it trades constantly)
- It doesn't benefit from SPRT validation (no directional thesis to validate)

Ruby's architecture:
- Waits for high-confidence signals (65%+ estimated win rate)
- Trades selectively (384 BTC signals/day → 0 passes current filter)
- Will use maker orders purely to make the economics non-negative
- SPRT guarantees Ruby only trades when edge is statistically proven

**Tweet hook**: "Market makers need volume. We need edge. Different game."

---

## Staged Deliverables for Loki/Quill

### Day 12 competitive foils (ordered by strength)
1. **TIER 1**: lorine93s market-making bot — neutral spread farming vs. Ruby's directional signal
2. **TIER 2**: StartupFortune (35% WR, taker fees) — still valid context from Day 11
3. **TIER 3**: Polymarket expanding maker rebates = "building with the grain"

### Suggested Day 12 thesis
"10% taker fees killed our strategy. But maker orders flip the economics.
The redesign: from FOK (pay 10%) to GTC limit orders (earn rebates).
This isn't just fee avoidance — it's building the right architecture."

### Key numbers to weave in
- Day 6 edge: +0.12% per trade (maker orders)
- Day 11 taker fee: 1000 bps = 10% per trade
- Delta: 10.12% per trade difference (maker vs taker) on ~$1.50 positions = ~$0.15/trade
- Ruby is the ONLY directional bot builder with SPRT validation (confirmed at Day 9)

---

## FINDING 4 — VALIDATION: gabagool22 Maker Rebate Bot ($1,700/day) [NEW — 11:55 IST Update]
**Confidence: MEDIUM-HIGH** (PolyTrackHQ, published ~1 month ago, snippet-level — no primary source fetch)
**Source**: polytrackhq.app/blog/polymarket-15-minute-crypto-guide

### What it says
- Maker bot identified as "gabagool22" reportedly earns **$1,700+/day in maker rebates alone**
- PolyTrackHQ context: "If you place limit orders that sit on the order book before being filled, you pay zero fees AND earn a share of the rebate pool."
- Same article: 85%+ of 15-min market trading activity is bots; Day 1 fees exceeded $100K

### Why this matters for Day 12
- Real-world validation that maker rebate strategy is profitable at scale ($1,700/day)
- gabagool22 = neutral market maker (same architecture as lorine93s — spread farming, not directional)
- **Day 12 contrast**: Ruby will use GTC maker mechanics to AVOID paying 10% taker fees on directional bets — not to earn spread income like gabagool22/lorine93s
- The existence of $1,700/day maker bots validates Polymarket's rebate pool is substantial

### Day 12 framing note (CAREFUL)
gabagool22 validates maker rebates ARE real money. But it's a NEUTRAL bot — same as lorine93s. Ruby's Day 12 redesign uses maker orders as a fee-avoidance mechanism for a DIRECTIONAL strategy, not as a primary income source. The distinction matters for Day 12 honesty:
"We're not trying to be gabagool22. We're trying to make our signal edge actually extractable without giving 10% to the house."

### Stat to use
"Top Polymarket maker bots earn $1,700+/day in rebates. We're building to avoid the 10% taker fee — same mechanics, different goal."

---

## FINDING 5 — CONTEXT: Market Structure Validation [NEW — 11:55 IST Update]
**Confidence: HIGH** (PolyTrackHQ, same article)

- **384 markets/day across 4 assets** (96/day per asset) — Ruby's Day 9 signal filtering context ("we skip 80%") remains correct
- **85%+ of 15-min market activity = bots** — confirms automation is the dominant competitive force; Ruby's systematic approach is architecturally correct
- **Day 1 fees: $100K+** — the market is large enough for rebate strategies to be meaningful at $1,700/day

---

*Original self-rating: 4.5/5. Strong competitor contrast. Maker rebate expansion timing is a gift.*
*Updated 11:55 IST Feb 19: FINDING 4 (gabagool22 $1,700/day) + FINDING 5 (market structure) added.*
*Updated rating: 4.5/5 maintained — new findings are additive, not corrections.*
*Fury — 02:25 IST (original) + 11:55 IST (update), Feb 19, 2026*
