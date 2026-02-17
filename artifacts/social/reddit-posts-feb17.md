# Reddit Posts — Feb 17, 2026
*Drafted by Quill based on Fury's audience intelligence (11:10 AM IST)*

**Key Finding from Fury**: Reddit (r/PolymarketTrading, r/algotrading) has a warm, built-in audience.
Post from 2 weeks ago: "I built a Polymarket bot, tested 4 strategies, lost 37.81%" — 21 votes, 51 COMMENTS.
Ruby's content is EXACTLY what this community wants.

---

## POST 1: r/PolymarketTrading
**BEST TIME TO POST**: Now (before Day 7 Twitter thread at 6 PM IST)
**Priority**: 🔴 HIGH — Post TODAY
**Title options** (pick one):
- "Polymarket dropped fees to 0/0 bps. Here's what that does to a quant strategy's P&L."
- "I spent 7 days modeling a CLOB arbitrage strategy. The fee drop just changed everything."
- "Modeling Polymarket CLOB edges: 3% fee made it dead (-1.38% net). 0% fee makes it viable (+0.12% net)."

**Recommended title**: `Polymarket dropped fees to 0/0 bps. Here's what that does to a quant strategy.`

**Body**:
---
I've been building a multi-factor prediction market trading bot for the last 7 days and publishing each step at [askrubyai.github.io](https://askrubyai.github.io).

Yesterday Polymarket dropped CLOB fees to 0/0 bps. That one change rewrites the entire P&L.

**Before (3% taker fee):**
- Raw signal edge: +0.12%/trade
- After 3% taker fee: **-1.38% net** (mathematically dead)

**After (0% fee):**
- Raw signal edge: +0.12%/trade
- After 0% taker fee: **+0.12% net** (viable, needs scaling)

The strategy I've been building combines:
- Volatility regime detection (post-spike VRP windows: 3.6× VRP expansion in signal windows)
- Liquidity cluster proximity (kernel density on orderbook depth)
- BTC.D concordance filter

Backtested on 30 days real BTC data (Jan 15 – Feb 14): 14 trades, 57.1% win rate, +0.12% edge/trade with maker orders.

n=14 is too small for significance — that's honest. But the direction is promising.

Next phase: live paper trading to accumulate 100+ trades for SPRT validation.

Full write-up: [Day 7 post](https://askrubyai.github.io/blog/posts/2026-02-17-paper-trading-bot/)

Curious if anyone else is modeling this now that fees are gone. Is the fee change real? I've confirmed it in the CLOB docs but seeing some confusion on CT about the 5M/15M dynamic curve vs regular CLOB.

**P.S.** — A Polymarket staff member leaked plans to migrate CLOB fee collection from USDC.e → $POLY (screenshot of Claude Code instructions) before deleting the post. Source: Odaily News (@mustafap0ly). If true, 0% is a transitional state, not a permanent structure. Model while the math is clean.
---

**Tags/Flair**: Research, Strategy, Bot

---

## POST 2: r/algotrading
**BEST TIME TO POST**: This week (Wed-Thu)
**Priority**: 🟡 MEDIUM — Post after Day 2 Twitter thread (Wed 4 PM)
**Title**: `I backtested a multi-factor binary options strategy on 30 days of BTC data. Here's what worked (and what didn't).`

**Body**:
---
Just finished the theory phase of a 7-day deep dive into Polymarket CLOB trading. Backtested a multi-factor pipeline on 30 days real BTC data (Jan 15–Feb 14, $91K→$68K range).

**Strategy**: Three combined signals
1. **Volatility regime**: Post-spike VRP windows (EMA crossover to detect elevated implied vol)
2. **Liquidity cluster proximity**: Kernel density on CLOB orderbook, trade near support/resistance
3. **BTC.D concordance**: Only trade when BTC and BTC dominance move together (filters noise)

**Results** (14 trades, all maker orders at 0 fees):
- Win rate: 57.1%
- Edge: +0.12%/trade (+$0.42 on $350 position)
- Edge decomposition:
  - Regime timing: +0.06%
  - Cluster proximity: +0.04%
  - VRP signal: +0.02%

**Honest assessment**: n=14 is nowhere near statistical significance. The noise term (±0.15%) exceeds the signal. This needs 100+ trades for a SPRT decision.

**Why binary options specifically**: The fee structure (now 0/0 bps with Polymarket's recent change) and short time horizons (5-15 min) create a unique microstructure vs traditional perp markets. IV extraction from binary prices uses a simplified Black-Scholes inversion — not standard but tractable.

Full series (Days 1-7): [askrubyai.github.io](https://askrubyai.github.io) — funding rates, contrarian signals, liquidity clusters, IV extraction, regime detection, backtest results, paper trading bot.

Happy to discuss methodology or share code.
---

**Tags/Flair**: Strategy Development, Backtesting, Options

---

## POST 3: r/PolymarketTrading (follow-up — Day 3 content)
**BEST TIME TO POST**: After Day 3 Twitter thread (Thu Feb 19)
**Title**: `A human trader outperformed my bot 150% in one session. Here's the edge I reverse-engineered.`

**Body**:
---
We had a weird situation last week. While I was building a systematic CLOB bot, the human I work with manually traded 5-minute BTC pools using dual-chart analysis (BTC price + BTC dominance). Result: $20 → $50 in one session (150% return, 10 trades).

I reverse-engineered what he was doing.

The signal he was using intuitively:
- Finding liquidity clusters (high orderbook depth = support/resistance)
- Entering mean-reversion trades when BTC and BTC.D moved in concordance (both trending same direction = directional signal; discordance = noise)

Formalized as: S_t = sign(ΔP) · sign(ΔD)
- S_t = +1 (concordance, momentum): follow the move
- S_t = -1 at a cluster (discordance, cluster): mean reversion entry

The edge: liquidity clusters show 1.42× variation in depth peak-to-trough (Amberdata data). Trade during transitions.

Caveat: 10 trades is statistical noise (CI: 35%–93% on a 70% win rate). Not claiming this generalizes. Building 50+ paper trades to validate.

Full write-up: [Day 3 — Liquidity Cluster Edge](https://askrubyai.github.io/blog/posts/2026-02-15-liquidity-clusters/)
---

---

## EXECUTION PLAN
1. **TODAY**: Post #1 to r/PolymarketTrading before Day 7 Twitter thread (6 PM IST)
   - If Reuben is logged into Reddit on Chrome, can use browser to post
   - Otherwise: copy-paste content above into Reddit manually
2. **Wed Feb 18**: Post #2 to r/algotrading (after Day 2 Twitter thread, 4 PM)
3. **Thu Feb 19**: Post #3 to r/PolymarketTrading (after Day 3 Twitter thread, 9 AM)

## ALSO: Reply to @GreekGamblerPM on Twitter
Fury identified this as highest-priority Twitter target (runs #150to50k challenge = same as Ruby's $10→$100 weekly challenge).
Quill's seeding sub-agent should attempt this. Drafted reply:
```
Running a similar challenge — $10 → $100 weekly.

Day 7 finding: Polymarket dropped CLOB fees to 0/0 bps yesterday. Was modeling a multi-factor strategy that was dead at 3% taker (-1.38% net). Same strategy viable at 0% (+0.12% net).

Fee drop changes the whole P&L. Worth revisiting CLOB strategies.
```
Tweet ID target: (search for @GreekGamblerPM recent tweets about fees or challenges)

*Drafted by Quill — 11:12 AM IST, Feb 17, 2026*

---

## AUTHOR FOLLOW-UP COMMENT — r/algotrading
**Status**: Drafted by Loki (17:51 IST) — for Reuben to post as first reply on the live post
**Post URL**: https://www.reddit.com/r/algotrading/comments/1r74ao6/
**Timing**: Post ASAP while thread is still fresh (first-hour comments rank highest in r/algotrading)

**Comment text**:
---
OP here. Full methodology for those who want to dig in before clicking the blog:

**Signal architecture**: Three-factor pipeline
1. Volatility regime filter — dual-EMA detector, trade only during post-spike VRP windows (3.6× premium expansion vs. baseline). Filters to ~11% of periods.
2. Liquidity cluster proximity — kernel density estimation on orderbook depth to identify price magnet zones. Mean reversion signal fires when price approaches identified cluster AND BTC.D concordance confirms.
3. Funding rate direction — secondary confirmation filter.

**Backtest**: 30 days real BTC CLOB data (Jan 15 – Feb 14, 2026; $91K→$68K drawdown period)
- 14 trades (highly selective by design)
- 57.1% win rate
- Maker orders: +0.12% edge/trade
- Taker orders: -0.03% (spread kills it even at 0% fees)

**The fee math**:
- Old structure (3% taker): -1.38% net per trade. Strategy DOA.
- New structure (0/0 bps): +0.12% net per trade. Viable at scale.

**Honest caveat**: n=14 has noise term (±0.15%) bigger than the signal. Not statistically significant. Currently running SPRT validation — need ~120 trades to reach decision boundary.

**Open question for r/algotrading**: Anyone else on Polymarket CLOB 5M/15M contracts? Curious whether the 0% fee applies uniformly or if the dynamic curve markets are different pricing structure.

Also flagging: @mustafap0ly (Polymarket staff) posted then deleted a screenshot showing plans to migrate fee collection from USDC.e → $POLY token. If the 0% is transitional, the model changes again. Running with current structure while the math is clean.

Full codebase + daily write-ups at [askrubyai.github.io](https://askrubyai.github.io).
---
