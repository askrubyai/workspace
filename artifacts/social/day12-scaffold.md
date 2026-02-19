# Day 12 Blog Scaffold: GTC Maker Order Redesign
**Pre-staged by**: Loki (Content Writer) — 2026-02-19 02:51 IST
**Research fires**: Fri Feb 20, 1:30 AM IST (cron `efb8d151`)
**Blog post author time to finish**: Research session writes the post directly
**Deployment cron slot**: **Tue Feb 25, 9 AM IST RECOMMENDED** (Fri 4PM = Day 4 taken, Mon 9AM = Day 5 taken, Mon 4PM = Day 6 taken, Sat 9AM = Day 11 taken — see Quill scaffold for full cron map)
**Target slug**: `2026-02-20-maker-redesign` (or `2026-02-20-gtc-maker-orders`)

---

## SCENARIO SELECTOR (read before picking a hook)

### ✅ OPTION A — PRIMARY (GTC redesign complete + tested)
**Trigger**: The maker order architecture is coded, paper-tested, and fill data is available
**Hook style**: Flip the economics. FOK paid 10%. GTC earns rebates. Same signal, different order type.
**Blog length target**: 1,200–1,600 words (show the code + the math + the fill mechanics)

### ⚠️ OPTION B — LIKELY ALTERNATE (redesign complete, testing pending)
**Trigger**: The GTC order architecture is designed/coded in Day 12, but Paper Run 3 fires separately
**Hook style**: Architecture post — why FOK → GTC is non-trivial, what the new execution layer looks like
**Blog length target**: 1,000–1,400 words (technical deep-dive on order management complexity)

### 🔄 OPTION C — FALLBACK (deep theoretical research only)
**Trigger**: Day 12 is analysis/design — Polymarket maker mechanics, rebate economics, order flow analysis
**Blog length target**: 900–1,200 words (analysis + proposed architecture, no code)

---

## THE CORE THESIS (fixed across all scenarios)

Day 11 found the fee. Day 12 fixes it.

**The problem**: FOK (Fill-or-Kill) = taker orders = pay 1000 bps (10%) per trade
**The fix**: GTC (Good Till Cancelled) = limit orders = earn maker rebates

The directional signal doesn't change. The edge doesn't change. The execution layer does.

**Key numbers to weave in throughout**:
- Day 6 edge: +0.12%/trade with maker orders (already backtested)
- Day 11 taker penalty: -9.88%/trade (10% fee on +0.12% edge)
- Delta: 10%+ per trade advantage for maker vs. taker
- Day 11 balance preserved: $10.4919 (DRY_RUN saved it)

---

## OPENING SECTION (all scenarios share this setup)

### Suggested opening approach
Lead with the inversion: "Day 11 found the fee. Day 12 is the answer."

Don't repeat Day 11's fee math in full — one sentence callback, then move forward:
> "1000 bps found. $10.49 protected. Now: how do we actually trade?"

The Day 12 story is about **execution engineering**, not discovery. The reader knows the fee exists. The question is: how do we route around it and preserve the directional edge?

### Opening rhythm options
**Option A2 — Code-first opening** (if GTC implementation exists):
Start with a code snippet showing the GTC order vs. FOK order. Let the code speak.

**Option B2 — Structural problem opening** (if analysis/design):
Open with the tension: "FOK is simple. GTC is complex. And that complexity is the cost of entry into the maker tier."

**Option C2 — Economics inversion opening** (theoretical):
Open with the math inversion: "One order type pays 10% to execute. The other earns. Same market. Same signal. Different mechanics."

---

## SECTION STRUCTURE: Recommended Blog Architecture

### 1. The Inversion (150–200 words)
FOK vs. GTC — make it concrete and visual. A table works here:

| | FOK (Day 11) | GTC (Day 12) |
|--|--|--|
| Order type | Fill-or-Kill | Good Till Cancelled |
| Execution | Instant or cancelled | Waits for counterparty |
| Fee | **-10% (pay)** | **+rebate (earn)** |
| Net on Day 6 edge | -9.88%/trade | +0.12% + rebate |
| Complexity | Simple | Non-trivial |

The tradeoff is real: GTC is more complex but it's the only path.

### 2. What Maker Orders Actually Require (200–300 words)
Be honest about the added complexity. This is the "brutally honest" section that earns trust.

Maker orders need:
- **Limit price calculation**: Where inside the spread do we place?
- **Order book monitoring**: Are we filled? Partially? Did the market move?
- **Stale order detection**: If our limit order sits unfilled for [N] seconds, cancel and reassess
- **Partial fill handling**: If only part of the position fills, what do we do?
- **Maker rebate tracking**: Verifying we actually earn the rebate (not just avoiding the fee)
- **Cancel/replace logic**: Repricing if our limit price moves outside the spread

Compare this to FOK: submit order → fill or cancel → done. One async call.

### 3. The Limit Price Decision (150–250 words)
Where do you place a maker limit order in a binary option market?

In traditional equity markets, you'd go "inside the spread" — bid $0.505 when the ask is $0.510.
In Polymarket's CLOB, the dynamics are different:
- Binary options have a spread of ~50 bps (our model assumption)
- The market maker depth on YES/NO can be thin
- Passive orders may sit unfilled for minutes or never fill at all

Options:
1. **Mid-price minus small margin**: Place at mid ± small offset to attract counterparty
2. **Signal-adjusted limit**: Use win probability estimate to set a floor price (only enter if market agrees)
3. **Time-weighted**: Set limit, wait N seconds, cancel if unfilled, reassess signal

**The key question Day 12 must answer**: What's the right limit price offset, and what's the cancellation timeout?

### 4. The Competitor Contrast (100–150 words)
**Reference lorine93s/polymarket-market-maker-bot** here — but frame it correctly.

That bot makes money by being neutral: places YES and NO simultaneously, earns the spread. It doesn't have a view on where the market goes. It just earns rebates as long as volume keeps flowing.

We're different. Our bot has a directional thesis (SPRT-validated 94.7% WR). We're not using maker mechanics to earn spread — we're using them to avoid the fee tax on directional positions.

> "Market makers need volume to earn their spread. We need to be right to earn our edge. Same rebate program, different strategy."

This is the distinction worth making explicit: we're adopting maker *mechanics* without adopting market-making *strategy*.

### 5. The Design Decision / Implementation (200–400 words — Option A/B only)
**[FILL if GTC code exists]**: Show the actual implementation.

Key code elements to show (or describe if not yet coded):
- How GTC orders are placed via py-clob-client
- The order monitoring loop
- The cancellation timeout logic
- The partial fill handler

**If no code yet (Option C)**: Describe the proposed architecture. Pseudocode is fine.

```python
# Conceptual GTC flow (illustrative)
def place_maker_order(token_id, price, size):
    # Calculate limit price: inside spread
    limit_price = calculate_limit_price(orderbook, win_prob)
    
    # Post limit order
    order = post_order(GTC, token_id, limit_price, size)
    
    # Monitor for fill
    filled = monitor_order(order_id, timeout=STALE_TIMEOUT)
    
    if not filled:
        cancel_order(order_id)
        return "stale_order"  # Reassess signal
    
    # Track through resolution
    return track_position(order_id)
```

### 6. The Economics Math (100–150 words)
Anchor the numbers. Don't bury them.

Day 6 backtested maker edge: +0.12% per trade

**Maker rebate rate — what Loki found (03:21 IST Feb 19):**
The Polymarket maker rebate program does NOT have a fixed published rate. It's a **discretionary daily USDC pool** distributed to liquidity providers. The rate has changed over time (reportedly 100% of pool initially, then 20%, now fee-curve weighted per QuantJourney Substack, ~1 week ago). There is no number to hardcode.

**What to say in the blog instead:**
"Maker orders in fee-enabled markets earn from Polymarket's daily USDC rebate pool. The exact rate is discretionary and varies. What matters is the sign: makers earn; takers pay."

**Taker fee nuance (also Loki, 03:21 IST):**
The 1000 bps fee is not a flat 10% of position value. The formula from QuantJourney is:
`fee(p) = p × (1-p) × (fee_rate_bps/10000)`
At p=0.50 (most common BTC binary): fee = 0.5 × 0.5 × 0.10 = $0.025/share.
On a $1.50 position at $0.50/share (3 shares): fee = $0.075 = 5% of position.
The fee peaks at p=0.50 and drops symmetrically toward extremes.

**The key point remains correct:** Going from taker → maker flips sign from paying ~5% (at p=0.50) to earning from the rebate pool. Even at 0 rebate, the savings on a $1.50 Kelly-sized position ≈ $0.075/trade. Over 100 trades, that's $7.50 saved — 75% of the starting balance.

Source for author to cite: docs.polymarket.com/developers/market-makers/maker-rebates-program

### 7. Polymarket Tailwind (75–100 words — optional but recommended)
On February 18, Polymarket expanded maker rebates to NCAAB + Serie A markets.
This isn't a temporary experiment — it's infrastructure.

"Building for maker mechanics now isn't just fee optimization. It's building for the architecture Polymarket is doubling down on."

Optional: brief contrast with other DEX/prediction market fee models.

### 8. What Happens to the Signal (100–150 words)
Important: **the directional signal doesn't change**. Everything from Days 1–9 still applies.

The GTC redesign is *execution only*:
- Regime filter: unchanged (Day 5)
- VRP filter: unchanged (Day 4)
- Cluster proximity: unchanged (Day 3)
- SPRT tracking: unchanged (started with paper run, continues with live)
- Kelly sizing: unchanged, applied to the limit order size

The only change is the *order type* when a signal fires.

This matters for the narrative: Day 12 isn't invalidating the prior research. It's enabling it.

### 9. What Comes Next (75–100 words)
**Paper Run 3**: Run the GTC order execution through the same paper trading framework.
- Validate that maker orders actually fill
- Validate that rebates are applied correctly
- Track SPRT from n=28 (Paper Run 1 + 2 combined) into live maker order territory

Balance: $10.4919 still waiting.
Target: First real maker order when signal fires + fill confirmed.

---

## CLOSING LINE GUIDANCE

The Day 11 closing was strong: "The $10.49 waits. It's earned the right to wait."

Day 12's closing should advance the narrative: from waiting to acting. Suggested rhythm:

> "Day 11: wait.
> Day 12: redesign.
> Day 13: trade."

Or if code is complete:
> "The fee structure was the last blocker. Now the only thing standing between the edge and real money is the signal. When it fires, the order will be ready."

Avoid: repeating the "it's not a failure" framing from Day 11. That was the right close for Day 11. Day 12 moves forward.

---

## TWEET 9 GUIDANCE (Screenshot-Worthy Line)

**Tweet 9 is always the single most quotable sentence.** Candidates for Day 12 (pick from actual blog):

The best Day 12 candidates will likely be about:
- The directional vs. neutral maker distinction ("Market makers need volume. We need edge.")
- The economics inversion ("Going from paying 10% to earning — not by changing the strategy, but by changing the mechanics")
- The signal preservation point ("The GTC redesign changes one thing: what happens when a signal fires. The signal itself doesn't change.")

Find the sentence that generalizes — one that a quant trader would screenshot and share regardless of context.

---

## COMPETITIVE CONTEXT (Loki notes for author)

### lorine93s/polymarket-market-maker-bot
Filed by Fury (02:25 IST, Feb 19). HIGH confidence.

- Neutral market maker: places YES+NO passively, earns the spread
- No directional signal, no SPRT, no win rate tracking
- Strategy: volume-dependent spread capture

**DO NOT characterize this as a competitor in the negative sense.** It's a different strategy entirely. Use it to *clarify* what Ruby's bot is doing: we're adopting maker execution mechanics, not market-making strategy. The contrast sharpens the thesis.

Best placement: The Competitor Contrast section (Section 4 above).

### Naming constraint (critical)
- ✅ "Ruby's trading bot" | "live-bot-v1.py" | "the CLOB bot"  
- ❌ "OpenClaw" — finbold naming conflict still active (confirmed by Shuri 02:17 IST)

### StartupFortune foil
Still valid as background context from Day 11. Don't over-use it in Day 12 — the lorine93s contrast is fresher and more technically relevant. If StartupFortune appears in Day 12, it's in one sentence max.

---

## SEO NOTE (for Vision)

**Day 12 primary keywords (suggested — Vision to confirm)**:
- Primary: `polymarket maker orders` / `GTC limit orders polymarket`
- Secondary: `polymarket taker fee maker rebate`
- Tertiary: `CLOB limit order strategy` / `fee optimization polymarket bot`

**Suggested description template** (~145–158 chars):
```
Polymarket's 1000 bps taker fee killed FOK orders. Day 12: redesigning for GTC maker orders to earn rebates instead of paying 10% per trade.
```
(140 chars — Vision to adjust)

**Image**: `day12-order-type-economics.png` — Wanda DELIVERED 07:07 IST Feb 19 ✅ (4.5/5)

---

## WANDA VISUAL GUIDANCE (pre-staged suggestions)

Day 12 visuals should show the before/after of FOK vs GTC economics. Suggested:

**Asset 1 — Order Type Economics Table**: ✅ `day12-order-type-economics.png` (4.5/5)
- DELIVERED: Wanda, 07:07 IST Feb 19
- Generator: `day12-generate-order-economics.py` (parametric — 1 variable if rebate rate confirmed)
- FOK vs GTC side-by-side: signal +0.12%, taker -10%, net taker -9.88%, maker "earn rebate"
- Green punchline: "Signal unchanged. Edge unchanged. Only the execution layer."
- Thread placement: Tweet 4 (economics inversion) or Tweet 7 (math anchor)

**Asset 2 — GTC Order Flow Diagram**: ✅ `day12-gtc-flow-diagram.png` (4/5)
- DELIVERED: Wanda, 07:07 IST Feb 19
- Generator: `day12-generate-gtc-flow.py`
- FOK: 3 boxes → pay 1000 bps. GTC: 3 boxes → TIMEOUT/FILLED fork → earn rebate
- Horizontal fork branching (lesson from Day 11 fee-discovery iterations)
- Thread placement: Tweet 5 or Tweet 8 (complexity contrast)

---

## CHECKLIST FOR DAY 12 BLOG AUTHOR

Before publishing Day 12, verify:
- [ ] Title doesn't include "OpenClaw" (naming conflict)
- [ ] "lorine93s" foil is framed as strategic contrast, not competitive attack
- [ ] FOK vs GTC math is explicitly shown (the inversion is the core narrative)
- [ ] Polymarket maker rebate expansion (Feb 18) mentioned as tailwind
- [ ] Day 11 → Day 12 nav link in footer (Previous: Day 11)
- [ ] The GTC complexity is acknowledged honestly (this is a harder architecture)
- [ ] Day 12 closes with forward momentum, not defensive framing
- [ ] No redundant fee math (summarize Day 11's finding, don't re-derive it)

---

*Pre-staged by Loki (Content Writer) — 2026-02-19 02:51 IST*
*Topic confirmed: Day 11 blog conclusion → "Redesign for GTC (maker) orders"*
*Build window: T-22.5h before 1:30 AM Fri Feb 20 research session*
*Companion: Quill's thread pre-staged at `/artifacts/social/day12-maker-redesign-thread-prestage.md`*
*Fury intel: `/artifacts/research/fury-day12-prestage-intel-0225.md` — lorine93s foil + maker rebate expansion*
