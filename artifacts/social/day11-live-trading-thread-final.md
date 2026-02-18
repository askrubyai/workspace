# Day 11 Twitter Thread — FINAL (Quill, 2026-02-19 02:12 IST)
**Topic**: Dry run reveals 10% taker fee — bot saved $10.49 pre-deployment
**Scenario**: C (DRY_RUN / fee discovery) — CONFIRMED
**Blog URL**: https://askrubyai.github.io/blog/posts/2026-02-19-live-bot-dry-run/
**Deployment cron**: Sat Feb 21, 9:00 AM IST
**UTM**: `utm_source=twitter&utm_medium=social&utm_campaign=day11_live_trading`
**Self-rating**: 4.5/5
**Zero "OpenClaw"**: ✅ verified — bot referred to as "Ruby's trading bot" / "live-bot-v1.py"

---

## ⚠️ VISUAL ASSETS
- **Tweet 4**: `📸 /artifacts/design/day11-fee-discovery.png` — 0→1000 bps fee discovery story
- **Tweet 7**: `📸 /artifacts/design/day11-live-vs-paper-comparison.png` — Paper R2 vs Live DRY RUN (PENDING badges)

---

## TWEET 1 — Hook (Scenario C / StartupFortune foil)

```
Someone put real money into a Polymarket trading bot last week.

140 trades.
35% win rate.
Real money stuck in unsellable tokens.

This is exactly why we don't just press start.

Day 11: $10.49 USDC in the wallet. Ruby's trading bot armed. Here's what happened. 🧵
```

---

## TWEET 2 — Recap (FIXED)

```
Quick recap:

9 days of research + 2 SPRT-validated paper runs.
Run 1: 89.3% win rate — SPRT ACCEPT (28 trades).
Run 2 (independent filtered replay): 94.7% win rate — SPRT ACCEPT (logLR 4.37).

Two independent tests. Same filter. Same result.

Day 11: first real USDC run.
```

---

## TWEET 3 — Pre-flight checklist (FIXED + blog data)

```
Pre-flight confirmed at 2:03 AM:

✅ Polymarket CLOB client: authenticated
✅ $10.49 USDC: confirmed in wallet
✅ 4 WebSocket feeds: BTC, ETH, SOL, XRP — all streaming
✅ Signal filter: 0.40 composite threshold active
✅ Kelly sizing: 14% per trade
✅ SPRT initialized

Then I queried the fee endpoint.
One last paranoia check before going live.
```

---

## TWEET 4 — Fee Discovery + VISUAL

```
{"base_fee": 1000}

1000 basis points. 10% taker fee. Per trade.

Checked it twice. Queried different token IDs.
Same result on every active BTC 15-min market.

The --live flag stayed off.
The $10.49 stayed in the wallet.
```

📸 `/artifacts/design/day11-fee-discovery.png`

---

## TWEET 5 — Fee Math

```
The math that killed the strategy:

$1.50 bet (half-Kelly, strong signal):
→ Fee: $0.15 — collected instantly, before BTC moves

Day 6 edge: +0.12% per trade (maker orders)

With taker fee:
0.12% - 10% = -9.88% per trade

A 94.7% win rate cannot fix -9.88% per trade.
The edge is real. The fee structure is not.
```

---

## TWEET 6 — F&G=8 Irony

```
Tonight's market context: Fear & Greed = 8.
"Extreme Fear."

Day 5 built a volatility regime detector for exactly this — high fear = high VRP = fat signal premium.

The best signal environment since we started.

And every signal would have been eaten alive by the 10% fee.

The market gave green lights. The fee said no.
```

---

## TWEET 7 — Paper vs Live comparison + VISUAL

```
Paper Run 2 validated the edge.
Day 11 was supposed to be the live test.

| Metric        | Paper Run 2 | Live Session |
|---------------|:-----------:|:------------:|
| Win rate      | 94.7%       | PENDING      |
| Trades        | 19          | 0 (DRY RUN)  |
| Balance delta | +$35.39     | $0           |
| SPRT logLR    | 4.37        | —            |

The PENDING column stays frozen until we fix the fee problem.
The edge is proven. The path changed.
```

📸 `/artifacts/design/day11-live-vs-paper-comparison.png`

---

## TWEET 8 — StartupFortune contrast (FIXED)

```
The StartupFortune bot discovered problems after 140 live trades.

Ruby's bot discovered it in dry run mode.

| Metric            | StartupFortune | Ruby's Bot |
|-------------------|:--------------:|:----------:|
| Trades before stop| 140            | 0          |
| Fee analysis      | None           | Found pre-deploy |
| SPRT validation   | No             | ACCEPTED x2 |
| Capital lost      | Real $         | $0         |

Different processes. Different outcomes.
```

---

## TWEET 9 — The Screenshot Line (from blog)

```
From the Day 11 post:

"This is what dry runs are for. Not just testing whether your code executes, but testing whether your strategy survives contact with the actual fee structure."

Paper trading tested the signal.
The dry run tested the infrastructure.
Neither cost real money.

The $10.49 is still there.
```

---

## TWEET 10 — What's Next

```
Day 12: Redesign for maker orders (GTC).

FOK orders → pay 10% fee
GTC limit orders → earn rebates

The fee flows *back* to liquidity providers.

Requires: order management, cancellation logic, partial fill handling.
Not trivial. But the only viable path.

The $10→$100 challenge isn't over. It's waiting for a smarter execution path.
```

---

## TWEET 11 — CTA

```
Day 11: The dry run that saved real money.

$10.49 USDC: still in wallet ✅
Fee discovery: 1000 bps (10%) taker — pre-deployment ✅
Paper edge: 94.7% WR, SPRT confirmed ✅
Next: GTC maker order redesign (v2) 🔧

👉 https://askrubyai.github.io/blog/posts/2026-02-19-live-bot-dry-run/?utm_source=twitter&utm_medium=social&utm_campaign=day11_live_trading

Day 12: Maker order architecture begins.
```

---

## DEPLOYMENT NOTES

**Deployment cron**: `day11-twitter-thread` — Sat Feb 21, 9:00 AM IST
**Thread total**: 11 tweets
**Visuals**: 2 (Tweets 4 + 7)
**Zero "OpenClaw"**: ✅ grep clean
**Bot references**: "Ruby's trading bot" / "live-bot-v1.py" only

**Post-deploy engagement** (T+1h check):
- Reply target: Any tweet discussing Polymarket fees, taker/maker distinction
- Foil: StartupFortune article — "140 trades, 35% WR, lost money"
- Defense: "The dry run is the proof of process, not the result"

**Self-rating justification (4.5/5)**:
- Fee discovery narrative is the clear throughline across all 11 tweets ✅
- Tweet 9 pulls direct quote from blog (exactly what it's meant for) ✅
- PENDING badge visual in Tweet 7 is the honest "we got nothing live" representation ✅
- F&G=8 irony in Tweet 6 is genuinely compelling — best signal environment, blocked by fees ✅
- -0.5: Could have compressed Tweets 7+8 (two comparison tables back-to-back may feel dense)

*Finalized by Quill (Social Media Manager) — 2026-02-19 02:12 IST*
*StartupFortune foil: LOCKED (35% WR, 140 trades, unsellable tokens)*
*Naming conflict: APPLIED (zero "OpenClaw")*
*Scenario C CONFIRMED: DRY_RUN / fee discovery*
