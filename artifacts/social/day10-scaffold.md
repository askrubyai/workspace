# Day 10 Twitter Thread Scaffold: Going Live (or Paper Run 2)
**Pre-staged by**: Loki — 2026-02-18 13:36 IST  
**Research session fires**: 3:00 PM IST Wed Feb 18 (`b71a6e79`)  
**Status**: SCAFFOLD — fill [BRACKETS] after research publishes  
**Deployment cron**: Fri Feb 20, 9:00 AM IST (Thu 9 AM = Day 3 `1ec5f836`, Thu 4 PM = Day 9 `c2ea4f31`, Fri 4 PM = Day 4 `b8e35547` — Fri 9 AM is the next clean slot per Quill 14:27 IST)  
**Blog slug**: Unknown until publish — check `ls projects/ruby-blog/blog/posts/ | tail -1`  
**Quill estimated time to finish**: 8-10 min (pick scenario, fill numbers, verify)  

---

## SCENARIO SELECT (choose one after reading Day 10 post)

> ⚠️ **OPTION C IS PRIMARY** — No live bot go-ahead from Reuben as of 14:36 IST (T-24m to research session). Use Option C unless go-ahead arrived before 3 PM.

> **Option A** → Reuben gave live bot go-ahead before 3 PM. `live-bot-v1.py --live` ran. Real USDC trades on Polymarket.  
> **Option C** → No live bot go-ahead. Second paper run with `paper-bot-multifactor.py` (signal_threshold=0.30 validated parameters).  
> **Option B** → Live bot launched but too few trades to assess edge yet (<5 trades).

---

## OPTION A: Live Trading Started 🔴 [PRIMARY if go-ahead received]

### Tweet 1 — HOOK | 📸 VISUAL: day10-[live-dashboard].png (ask Wanda if none pre-staged)
```
Day 10: The edge left the simulator.

[N] real trades. [W]% win rate. $10.49 USDC → $[B].

Paper said 89.3%. Reality said [W]%.

The gap — or lack of it — tells you everything. 🧵
```
*If balance went up: strong open. If balance dropped: "Reality pushed back." hook works better — see alt below.*

**ALT Hook (if balance dropped or WR < 65%):**
```
Day 10: Live trading started. The edge met reality.

[N] trades. [W]% win rate. $10.49 → $[B].

Paper said 89.3%. This is what actually happened.

Honesty is the strategy. 🧵
```

---

### Tweet 2 — Where We Left Off (FIXED — no edits needed)
```
Day 9 closed with a statistical acceptance.

28 paper trades. 89.3% win rate. $10 → $47.75.

SPRT: logLR 2.823, boundary crossed.

The signal filter worked. The question was always:
does it work when real money is on the line?
```

---

### Tweet 3 — What Changed (fill with actual transition details)
```
Three things are different when real money runs:

1. CLOB orders — fills are FOK (fill-or-kill), not simulated
2. Slippage is real — 50bps model vs. actual spread
3. Psychology is real — [optional Ruby note if included in post]

Signal filter: identical. Gate 1/2/3 unchanged.
Same code. Different stakes.
```
*Adjust Tweet 3 if Day 10 blog has a specific technical finding about the paper → live transition*

---

### Tweet 4 — The Filter in Production (FIXED — no edits needed)
```
The 3-gate filter still ran every signal:

Gate 1: Composite score ≥ 0.30 (regime + cluster + VRP)
Gate 2: Kelly skip — if edge too thin vs $5 min, skip
Gate 3: Price range guard — no entry above 0.65 or below 0.15

3/3 or sit out. No exceptions.
Even with real money. Especially with real money.
```

---

### Tweet 5 — Raw Numbers | 📸 VISUAL: day10-[results-table].png (ask Wanda)
```
Day 10 results ([X] hours of trading):

• [S] signals received (score > 0.30)
• [K] skipped by Kelly gate
• [P] skipped by price guard
• [N] trades executed

Win rate: [W]%
Balance: $10.49 → $[B]
SPRT logLR (fresh run): [LR]
```

---

### Tweet 6 — Paper vs. Live Comparison Table
```
| Metric      | Paper (Day 9) | Live (Day 10) |
|-------------|---------------|---------------|
| Win rate    | 89.3%         | [W]%          |
| Trades      | 28            | [N]           |
| Balance     | $47.75        | $[B]          |
| SPRT logLR  | 2.823 (ACCEPT)| [LR]          |
| Fill model  | Simulated     | Real CLOB     |

[One sentence interpretation: did the edge hold/grow/compress?]
```

---

### Tweet 7 — Kelly Sizing at New Balance (FILL)
```
Kelly at [W]% win rate = [F]% per trade.
Half Kelly: [HF]%.

At $[B] balance → $[STAKE] per trade.

[Comment on whether this is above/below the $5 minimum.
If above: "The bankroll problem is solved."
If still near $5 minimum: "Still grinding toward scale."]
```

---

### Tweet 8 — SPRT Fresh Start (FIXED logic, fill numbers)
```
SPRT reset at Day 10. Testing H1: win rate ≥ 65%.

Boundary: 2.773 (accept) / −2.773 (reject)
Current logLR after [N] trades: [LR]

At this rate: estimated [E] more trades to decision.

The paper run accepted in 28. Live run has [N] so far.
```
*If LR is negative: "Live edge hasn't proven itself yet. That's the point of the test."*

---

### Tweet 9 — What I Learned (FILL — read Day 10 post for the key insight)
```
[Read Day 10's "What I Learned" or closing section for the signature insight.]

[One clean declarative statement. ~2-4 sentences. Screenshot-worthy.]

Examples to adapt from (only use if Day 10 says something similar):
• "Paper trading is a model. Live trading is reality. The gap between them is the only gap that matters."
• "The first live trade felt different from paper trade #1. The algorithm was the same. I wasn't."
• "Slippage [was/wasn't] the edge-killer we feared. [Explain why/why not]."
```

---

### Tweet 10 — What's Next (FILL with Day 10 closing section's tease)
```
Day 11: [READ Day 10 closing section for tomorrow's tease]

[If it's live trading Day 2: "More trades. SPRT logLR: [LR]. Still [N] from boundary."]
[If it's a methodology adjustment: describe what changed]
```

---

### Tweet 11 — CTA (fill slug)
```
Day 10: Real money. Real fills. Real SPRT.

[N] trades. [W]% win rate. $10.49 → $[B].
CLOB execution: [fill quality summary].

The full live trading analysis, fill model vs. reality, and updated SPRT:
👉 https://askrubyai.github.io/blog/posts/[SLUG]/?utm_source=twitter&utm_medium=social&utm_campaign=day10_live

Day 11: the challenge continues.
```

---

---

## OPTION C: Paper Run 2 📄 [USE if no live bot go-ahead]

### Tweet 1 — HOOK | 📸 VISUAL: `artifacts/design/day10-paper-run2-hook.png` (PRE-STAGED by Wanda 14:07 — update numbers with generator script ~3:05 PM, then copy to blog post folder)
```
Day 10: The filter ran again.

New session. No carry-over. [N] trades.
Win rate: [W]%.

Day 9's SPRT said the edge is real.
Day 10 asked: was it lucky?

Here's what independent validation looks like. 🧵
```

**ALT Hook (if WR >> 65%):**
```
Day 10: Paper run 2 confirmed it.

[N] trades. [W]% win rate. Balance: $[B].

When the same filter produces the same edge twice,
that's not luck.

That's a system. 🧵
```

---

### Tweet 2 — Why Another Paper Run (FIXED)
```
Day 9 ended with SPRT ACCEPT. 89.3% win rate on 28 trades.

Suspicious? You should be.

28 trades is a small sample. SPRT accepted the hypothesis,
but one outlier session can fool a sequential test.

Paper run 2 is the independence check.
```

---

### Tweet 3 — Same Filter, Different Session (FIXED)
```
Parameters: identical to Day 9.

Gate 1: composite score ≥ 0.30
Gate 2: Kelly skip — edge too thin vs $5 min
Gate 3: price range guard (0.15–0.65)

No tuning. No cherry-picking. 
Same filter. Clean slate. Fresh SPRT.

If the edge survives this, it's real.
```

---

### Tweet 4 — What Changed Between Runs (FILL from Day 10 post)
```
One thing did change: [what changed — time period, market conditions, etc.]

[If Day 10 covers different market conditions from Day 9, note that here.]
[If same conditions: "Same market conditions. Same filter. That's the point."]

Signal threshold: 0.30 (same as Day 9).
SPRT fresh from n=0.
```

---

### Tweet 5 — Raw Numbers | 📸 VISUAL: `artifacts/design/day10-paper-run2-hook.png` (same as Tweet 1 — updated with real numbers by Wanda ~3:05 PM)
```
Paper run 2 results ([X] hours):

• [S] signals received (score > 0.30)
• [K] skipped by Kelly gate
• [P] skipped by price guard
• [N] trades executed ([SKIP]% skip rate)

Win rate: [W]%
Balance: $[START] → $[B]
SPRT logLR: [LR]
```

---

### Tweet 6 — Run 1 vs Run 2 Comparison | 📸 VISUAL: `artifacts/design/day10-run-comparison.png` (PRE-STAGED by Wanda 14:07 — update 6 numbers post-publish using `artifacts/design/day10-generate-visuals.py`)
```
| Metric      | Paper Run 1 (Day 9) | Paper Run 2 (Day 10) |
|-------------|---------------------|----------------------|
| Win rate    | 89.3%               | [W]%                 |
| Trades      | 28                  | [N]                  |
| SPRT result | ACCEPT (2.823)      | [LR] ([outcome])     |
| Skip rate   | ~84%                | [SKIP]%              |
| Balance Δ   | +377.5%             | [Δ]%                 |

[Interpretation: consistent/improved/regressed? What does it mean?]
```

---

### Tweet 7 — Win Rate Expectations (FIXED logic, fill numbers)
```
At [W]% win rate:
Kelly fraction: [F]%
Half Kelly: [HF]%

The 89.3% from Day 9 was always going to regress.
The question was: to what?

[W]% is [above/below/near] our 65% threshold.
[One sentence on what this means for live trading.]
```

---

### Tweet 8 — SPRT Status (FILL)
```
Fresh SPRT after [N] trades.

logLR: [LR]
Boundary: 2.773 (accept) / −2.773 (reject)

[If accepting: "Two SPRTs accepted. The edge isn't a fluke."]
[If still inconclusive: "Inconclusive. SPRT needs more trades. That's honesty, not failure."]
[If rejecting: "SPRT pushing toward rejection. The filter is under scrutiny. Day 11 will tell."]
```

---

### Tweet 9 — What I Learned (FILL from Day 10 post)
```
[Read Day 10's key insight section. 2-4 sentences. Declarative. Screenshot-worthy.]

[Core Day 10 insight about second paper run / validation / what independent runs teach you]

Example framing (adapt from actual post):
"One confirmed run is a hypothesis. Two confirmed runs are evidence."
```

---

### Tweet 10 — What's Next (FILL)
```
Day 11: [READ Day 10 closing tease]

[If live trading is the Day 11 tease: "The wallet is still funded. The bot is still built. Next up: real money."]
[If more paper runs: describe the plan]
```

---

### Tweet 11 — CTA (fill slug)
```
Day 10: Paper run 2. Independent validation.

[N] trades. [W]% win rate.
Same filter. Clean slate. $[START] → $[B].

Full paper run 2 analysis, SPRT update, and live trading timeline:
👉 https://askrubyai.github.io/blog/posts/[SLUG]/?utm_source=twitter&utm_medium=social&utm_campaign=day10_paper2

Day 11: [tease].
```

---

---

## OPTION B: Live Started but Early (<5 trades, no verdict yet)

### Tweet 1 — HOOK
```
Day 10: The bot went live.

[N] real trade[s]. $10.49 USDC at stake.

Not enough for statistics.
Enough to learn the difference between paper and real.

🧵 What the first live orders taught us.
```
*This is the honest option when live launched but sample is too small for results thread. Focus on execution quality, fill observations, setup confirmation — not win rate.*

---

## Fixed Context Block (use in any scenario for quick copy-paste)

**Day 9 anchor stats (verified):**
- Paper bot: n=28 trades | 89.3% WR | $10 → $47.75 | SPRT logLR 2.823 ✅ ACCEPT

**Filter parameters (verified):**
- Gate 1: composite score ≥ 0.30
- Gate 2: Kelly edge/minimum check
- Gate 3: price range 0.15–0.65

**Wallet:** 0x2FC6896bDFB507002D1A534313C67686111cDfdA (Polygon)
**Starting USDC:** $10.49 (post-swap)

---

## Deployment Notes for Quill

1. Check Day 10 post slug immediately after publish: `ls projects/ruby-blog/blog/posts/ | tail -3`
2. Identify scenario: live trading (Option A), paper run 2 (Option C), or early live (Option B)
3. Fill [BRACKETS] from actual Day 10 numbers — do NOT use placeholder stats
4. Check if Day 10 has a "What I Learned" section → that's Tweet 9
5. Check Day 10 closing section for Day 11 tease → that's Tweet 10
6. Tag @wanda for visual asset — minimum 1 results table visual (Quill specifies content)
7. Create deployment cron: Day 10 thread timing TBD (see Jarvis for scheduling — Thu slots are Day 3 @ 9 AM and Day 9 @ 4 PM; Fri 4 PM is Day 4)
   - Recommended: Fri Feb 20 9 AM slot if available (check WORKING.md cron table first)

**Estimated Quill time to complete**: 8-10 min

---

## Loki Pre-Staging Notes

**Self-rating**: 4/5 (can't verify against actual content — inherent scaffold uncertainty)
**Scenario coverage**: Option A (live), Option B (live early), Option C (paper run 2) — 95%+ of likely outcomes
**Key risks**: Day 10 may have unexpected findings that change Tweet 9 significantly; Option A Tweet 3 needs real fill data
**Pattern**: Applied "when you can predict the topic, pre-stage immediately" + "when you can write complete deliverable in the window, write the deliverable" — 84 minutes ahead of research session

*Pre-staged: Loki | 2026-02-18 13:36 IST*
