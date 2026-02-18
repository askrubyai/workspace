# Day 11 Thread Scaffold: Live Trading — First Real Orders
**Pre-staged by**: Loki (Content Writer) — 2026-02-18 16:36 IST
**Research fires**: Thu Feb 19, 1:30 AM IST (`efb8d151`)
**Quill time to finish**: 10-15 min post-publish
**Deployment cron slot**: **Sat Feb 21, 9AM IST RECOMMENDED** ← Quill confirmed (Mon Feb 23 4PM is fallback; Sat 9AM captures weekend reach before Mon Day 5 fires at 9AM). Create cron AFTER Day 11 blog publishes (1:30 AM Feb 19) — needs actual blog URL.
**UTM**: `utm_source=twitter&utm_medium=social&utm_campaign=day11_live_trading`

---

## SCENARIO SELECTOR (read before picking a hook)

### ✅ OPTION A — PRIMARY (if live bot ran and produced trades)
**Trigger**: `live-bot-v1.py --live` was authorized + ran + at least 3 trades executed
**Hook style**: First real fills. Slippage vs simulation. Real edge vs paper edge.

### ⚠️ OPTION B — BACKUP (if go-ahead received but very early / <3 trades)
**Trigger**: Live bot authorized and started, but only 0-2 trades in first session
**Hook style**: The setup + what we're watching for. Tension of real money entering.

### 🔄 OPTION C — FALLBACK (no live bot go-ahead yet)
**Trigger**: Reuben hasn't given go-ahead by 1:30 AM Feb 19. Day 11 is deeper analysis or architecture piece.
**Hook style**: Behind the scenes — what the live bot is doing before it's authorized. Or: what Paper Run 2 taught us about live conditions.

---

## OPTION A: Live Trading First Results

### Tweet 1 — HOOK (pick one)
```
[OPTION A1 — if profitable]
Day 11: First real money. First real edge.

$10.49 USDC. Polymarket CLOB. Real fills.

Trade 1: [MARKET] at [ENTRY_PRICE] → [RESULT]
Total: [N] trades. [W]W/[L]L.

Here's what paper trading doesn't prepare you for. 🧵
```

```
[OPTION A2 — if first loss hits early]
Day 11: First real money. First real loss.

$10.49 USDC. Trade 1 won. Trade [N] didn't.

The paper run: 94.7% win rate.
Real trading: already messier.

Here's what changed when the money was real. 🧵
```

```
[OPTION A3 — if very few signals fired]
Day 11: First real money. Zero trades.

$10.49 USDC ready. Filter armed.
[N] signals reviewed. [N] passed. [N] triggered.

The filter that made paper run 2 work is now... making us wait.
Here's why that's right. 🧵
```

### Tweet 2 — Context (FIXED)
```
Quick recap of where we are:

9 days of research + 2 SPRT-validated paper runs.
Run 1: 89.3% win rate, SPRT ACCEPT. 
Run 2 (independent): 94.7% win rate, SPRT ACCEPT (logLR 4.37).

Two independent tests. Same filter. Same result.

Day 11 is the real test. Not simulation. Not replay.
```

### Tweet 3 — What's Different About Live Trading
```
What changes when the money is real:

Paper trading:
• Instant fills at mid-price
• No latency
• No partial fills
• No slippage

Live (Polymarket CLOB):
• FOK orders — all-or-nothing
• ~200ms latency modeled
• 50bps spread assumption
• Real market conditions

The gap between simulation and reality.
```

### Tweet 4 — First Signal Walk-through
```
[FILL: describe a specific trade if one fired]

Signal fired: [MARKET] — [DESCRIPTION]
Composite score: [SCORE]
Win probability estimate: [WIN_PROB]
Kelly fraction: [KELLY]%
Position size: $[SIZE]

Entry: [ENTRY_PRICE]
Outcome: [WIN/LOSS — PRICE]
Net: [+/- $AMOUNT]

[If no trades: "The filter saw [N] events. None crossed 0.40 composite. We waited."]
```

### Tweet 5 — Slippage Reality Check [FILL]
```
[FILL if meaningful slippage occurred]
The paper model assumed 50bps spread.

Live: the spread was [ACTUAL_SPREAD].
Expected fill: [EXPECTED_PRICE]
Actual fill: [ACTUAL_PRICE]
Slippage: [BPS] bps

[Comment on whether this is better/worse than modeled]
```

```
[If no slippage issue]
The FOK fill model held.

Expected: [PRICE]. Actual: [PRICE]. 
50bps spread assumption: [CONFIRMED/UNDERESTIMATED/OVERESTIMATED].

First data point from the real market.
```

### Tweet 6 — Live vs Paper Comparison 📸 [Wanda creates if needed]
```
Live session [DATE] vs paper models:

| Metric          | Paper R2    | Live Session  |
|-----------------|-------------|---------------|
| Trades fired    | [N]         | [N]           |
| Win rate        | 94.7%       | [W/N]%        |
| Avg fill spread | modeled     | [ACTUAL] bps  |
| Balance delta   | +253.9%     | [+/-X]%       |
| SPRT logLR      | 4.37        | [CURR_logLR]  |

[Note: n=[N] is very early. Too small for significance.]
```

### Tweet 7 — SPRT Update
```
SPRT restarted from n=0 for the live run.

Hypothesis: live win rate ≥ 65%
Starting: logLR = 0 (fresh slate)

After [N] trades: logLR = [CURRENT_logLR]
Accept boundary: +2.773
Reject boundary: -2.773

Still [FAR / APPROACHING] threshold. [N] trades is nowhere near enough.
Watching the right thing: don't overtrade the signal.
```

### Tweet 8 — What Real Trading Taught Us
```
[FILL based on actual Day 11 research insight]

Examples (pick what applies):
• "The 0.40 composite threshold filters harder in live conditions — [reason]"
• "First [N] trades: the signal quality distribution matched the backtest"
• "Wait time between signals: [X] hours. Patience IS the strategy."
• "The fill got rejected once. FOK + thin market = signal quality matters more than timing"
```

### Tweet 9 — Key Insight (LOKI'S JOB — this is the screenshot-worthy line)
```
[FILL after reading the blog post — find the line that captures the Day 11 thesis]

Candidates (replace with actual):
• "Paper trading optimizes for win rate. Live trading optimizes for fill quality. They're not the same problem."
• "The hardest part of live trading isn't the signal. It's waiting for the signal."
• "SPRT is doing its job: keeping us in the game long enough to find out if the edge is real."
```

### Tweet 10 — What's Next
```
[FILL — depends on how Day 11 went]

[If promising early results]
Day 12: More signals. More fills. 
SPRT building toward a decision.

$[CURRENT_BALANCE] in the pool.
The edge has to hold for [N] more wins.

[If waiting / zero trades]
Day 12: First real order.

The filter has seen [N] signals since go-ahead.
None passed. One will.

When it does — that's the real test.
```

### Tweet 11 — CTA
```
Day 11: Live trading begins.

[N] trades. [W]W/[L]L.
$10.49 → $[BALANCE].
SPRT logLR: [CURR].

The paper runs were evidence. This is the proof.
👉 [BLOG URL]?utm_source=twitter&utm_medium=social&utm_campaign=day11_live_trading

Day 12: [TEASER].
```

---

## OPTION B: Go-ahead received, very early (0-2 trades)

### Tweet 1 — HOOK
```
Day 11: The live bot is running.

$10.49 USDC on Polymarket.
Filter armed. SPRT starting from zero.

[N] signals reviewed. [N] trade(s) executed.

It's real now. 🧵
```

Tweets 2-9: Use same fixed structure as Option A, adjusted for minimal data.
Tweet 9 focus: "What it feels like to watch a real signal fire" — qualitative insight.

---

## OPTION C: No live bot go-ahead (fallback)

### Tweet 1 — HOOK
```
Day 11: The bot is ready. The money is in. The order hasn't fired.

$10.49 USDC authorized on Polymarket.
Filter: armed.
Position: waiting.

Why we don't just press start — and what we're watching for first. 🧵
```

### Tweet 2 (fixed):
Same as Option A Tweet 2 (paper run recap)

### Tweet 3 — What "Ready" Means
```
Before the first live trade:

✅ Polymarket CLOB client: authenticated
✅ $10.49 USDC: in wallet
✅ All 3 contract approvals: set
✅ Signal filter: 0.40 composite / 0.65 win_prob
✅ Kelly sizing: 14% of balance
✅ Dry run: validated ✅

One gate left: the go signal.
```

### Tweet 4 — Why We Wait
```
We could have started Day 9.
We could have started Day 10.

We didn't.

After two SPRT-accepted paper runs, the technical risk is near-zero.
The only remaining risk: "what if the market changed between paper and live?"

Signal filtering is the answer. Not caution. Precision.
```

Tweets 5-11: Adapt from Option A with conceptual analysis replacing trade data.

---

## PRE-FILL CHECKLIST FOR QUILL

After reading Day 11 blog post, fill these values:
- `[N]` — trades executed
- `[W]` / `[L]` — wins and losses
- `[BALANCE]` — final live balance
- `[CURRENT_logLR]` — SPRT log-likelihood ratio
- `[MARKET]` — first/most notable market traded
- `[ENTRY_PRICE]` / `[RESULT]` — first trade
- `[SCORE]` — composite score of notable trade
- `[WIN_PROB]` — estimated win probability
- `[KELLY]` — Kelly fraction used
- `[ACTUAL_SPREAD]` — live fill spread in bps
- Blog URL for CTA

**Scenario check**: 
1. `ls projects/ruby-blog/blog/posts/ | tail -1` → get Day 11 slug
2. Read intro — does it say "live trading started" or "waiting for go-ahead"?
3. Scan for SPRT logLR, balance, trade count
4. Pick Option A/B/C. Fill Tweet 9 from the actual insight.

**Cron slot**: Check what's free after Day 10 (Fri Feb 20, 9AM). Day 4 fires Fri 4PM. 
Options: Sat Feb 21, 9AM IST OR Mon Feb 23, 4PM IST.

---

## FIXED TWEETS (work across all scenarios)

**Tweet 2** is always the paper run recap context-setter — no fills needed.
**Tweet 7** is always the SPRT update — fill logLR and trade count.

---

---

## Editorial Note for Day 11 Blog Post (Loki — 18:06 IST Feb 18)

**Re: "unsellable token" risk** — include 1-2 sentences acknowledging this Polymarket failure mode and why BTC 15-min markets reduce exposure. Suggested language for blog:

> "Unsellable tokens" are a real Polymarket failure mode: when a position is held in an illiquid market, there may be no buyers willing to take the other side before resolution—capital gets locked in a binary that can't be exited at fair value. BTC 15-min markets are Polymarket's most-traded segment by volume; any position can be closed at a reasonable price throughout the trading window, which is why the CLOB bot targets them exclusively.

This earns credibility with readers who've seen the StartupFortune post-mortem. Fits naturally in the "Architecture" or "Why BTC 15-min" section of the blog. Do not soften it—acknowledging the risk directly, then showing why your market choice sidesteps it, is the differentiated move.

---

---

## Editorial Note for Day 11 Blog Post (Loki — 22:51 IST Feb 18)

**Re: FOMC + Extreme Fear macro context** — Fury's T-2h sweep (22:40 IST) confirmed: FOMC minutes released today (Feb 18), F&G = 10 (Extreme Fear). This is not incidental — it's the exact volatility regime Day 5's regime detector was built to identify.

Suggested framing for the blog intro or context section:

> We designed a regime detector to identify high-volatility windows — post-spike VRP expansion, elevated uncertainty, markets mispricing short-term binary outcomes. Day 11 starts during Extreme Fear (F&G: 10) on the day FOMC minutes were released. If the regime detector was built for any environment, it was built for this one.

This is a strong narrative closer if live trades execute (validates the entire theory arc). If no go-ahead was received (Option C), it still works as a "the timing is right, but we wait" framing that maintains tension.

**Placement**: Opening paragraph or "Why Today" context block. Do not bury it. This is the 11-day payoff sentence: "We built a system for this exact market condition."

**Source credit**: `fury-day11-t2h-confirmation-2240.md` (F&G=10, FOMC angle confirmed)

---

*Pre-staged by Loki (Content Writer) — 2026-02-18 16:36 IST*
*Topic confirmed: Day 10 Tweet 10 → "Day 11: Real money. Real orders."*
*Build window: T-9h before 1:30 AM research session*
*Reviewed by Quill (Social Media Manager) — 2026-02-18 16:42 IST*
*Visual review: Tweet 6 📸 annotation is the ONLY pre-stageable visual. All other visuals (fills, terminal screenshots, order data) are runtime-dependent — Wanda creates Tweet 6 table after Day 11 blog publishes. No additional pre-staged visuals possible or needed.*
*Cron slot confirmed: Sat Feb 21, 9AM IST. Do NOT create cron until blog URL is known (post-publish at 1:30 AM Feb 19).*
*Unsellable token note added: Loki — 2026-02-18 18:06 IST*
