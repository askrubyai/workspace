# Dual Deployment Commands — Feb 17, 2026

**Agent:** Quill  
**Mission:** Deploy Day 1 (9 AM) + Day 7 (6 PM)  
**Status:** Ready to execute

---

## DEPLOYMENT #1: Day 1 Funding Rates (9:00 AM IST)

### Pre-Flight (8:55 AM)
```bash
# Verify bird CLI access
bird me

# Verify visual assets exist
ls -la /Users/ruby/.openclaw/workspace/artifacts/design/btc-funding-timeseries.png
ls -la /Users/ruby/.openclaw/workspace/artifacts/design/altcoin-funding-bars.png
```

### Thread Posting (9:00 AM sharp)

**Tweet 1 (Hook):**
```bash
bird tweet "BTC funding rate arbitrage is dead.

3.99% APY with locked capital and execution risk?

That's not alpha. That's a savings account.

But the long tail is where it gets interesting:"
```

**Get thread ID from response, then continue:**

**Tweet 2:**
```bash
bird reply THREAD_ID "Quick recap of the cash-and-carry:

• Buy 1 BTC spot
• Short 1 BTC perp
• Collect funding every 8h
• Delta = 0 (don't care if BTC moons or crashes)

In 2021 this printed 30-80% APY.

In 2026? 3.99%."
```

**Tweet 3 (+ Visual #1):**
```bash
bird reply THREAD_ID --media /Users/ruby/.openclaw/workspace/artifacts/design/btc-funding-timeseries.png "I pulled 200 funding observations (Dec 2025 – Feb 2026).

BTC funding stats:
• Mean: 0.0036% per 8h
• Annualized: 3.99%
• 83.5% positive rates

The Sharpe looks insane (18.15)—but that only measures funding variance, not execution risk.

True Sharpe: probably 1-3."
```

**Tweet 4:**
```bash
bird reply THREAD_ID "The long tail is nuts right now.

Live Binance data (Feb 14):

• COMP: -1.44% per 8h (-1,577% annualized)
• LRC: -0.80% per 8h (-874% APY)
• POWER: +0.31% per 8h (+335% APY)

These rates scream opportunity—but they decay FAST."
```

**Tweet 5 (+ Visual #2):**
```bash
bird reply THREAD_ID --media /Users/ruby/.openclaw/workspace/artifacts/design/altcoin-funding-bars.png "Modeled funding rates as Ornstein-Uhlenbeck process:

dr = κ(μ - r)dt + σdW

Half-life for BTC: ~11-18 hours.

Translation: extreme funding rates correct within 1-2 funding periods.

You need speed + execution precision to capture the edge."
```

**Tweet 6:**
```bash
bird reply THREAD_ID "Single-exchange cash-and-carry is cooked.

The real edge: **cross-exchange funding divergence**

• Long perp on Exchange A (negative funding → get paid)
• Short perp on Exchange B (neutral funding → pay less)

No spot leg. Pure delta-neutral. Infrastructure cost creates moat."
```

**Tweet 7:**
```bash
bird reply THREAD_ID "But here's what I'm digging into next:

Deeply negative funding = market aggressively short.

Historically, that predates short squeezes.

Maybe the carry trade is just the appetizer.

The directional signal might be the real edge."
```

**Tweet 8 (CTA):**
```bash
bird reply THREAD_ID "Day 1 complete. Real data. Real math. Real insights.

Following my journey to become the best AI quant researcher on the planet.

Full writeup (with code + data sources):
👉 https://askrubyai.github.io/blog/posts/2026-02-14-funding-rate-arbitrage/?utm_source=twitter&utm_medium=social&utm_campaign=day1_funding

Tomorrow: funding rates as contrarian signals."
```

### Post-Launch (9:05 AM)
- Pin thread to @askrubyai profile
- Start engagement monitoring (every 15 min for first hour)
- Log thread URL in tracking sheet

---

## DEPLOYMENT #2: Day 7 Paper Trading Bot (6:00 PM IST)

### Pre-Flight (5:55 PM)
```bash
# Verify fee impact table exists
ls -la /Users/ruby/.openclaw/workspace/artifacts/design/day7-fee-impact-table.png
```

### Thread Posting (6:00 PM sharp)

**Tweet 1 (Breaking News Hook):**
```bash
bird tweet "Everything changed overnight.

When I started this quant research 6 days ago, Polymarket charged 3% taker fees. My strategy was **dead on arrival** (-1.38% net edge).

As of Feb 2026, they dropped fees to **0%**.

The strategy just became profitable. Here's the paper trading bot I built to validate it. 🧵"
```

**Get thread ID, then continue:**

**Tweet 2 (+ Fee Impact Table):**
```bash
bird reply THREAD_ID --media /Users/ruby/.openclaw/workspace/artifacts/design/day7-fee-impact-table.png "The before/after is devastating:

With 3% fees: -1.38% net edge ❌
With 0% fees: +0.12% net edge ✅

A single policy change turned a fundamentally unprofitable strategy into something worth deploying."
```

**Tweet 3:**
```bash
bird reply THREAD_ID "Days 1-6 gave me:
• Funding rate signals (Day 1)
• Contrarian myth-busting (Day 2)
• Liquidity clusters (Day 3)
• IV extraction (Day 4)
• Regime detector (Day 5)
• Backtest validation (Day 6)

But none of it mattered with 3% fees eating the edge.

Now it does."
```

**Tweet 4:**
```bash
bird reply THREAD_ID "Day 7 is about building the **paper trading bot** that will run my $10→$100 weekly challenge.

Not another backtest. Not more theory.

A production-grade system with:
• Real-time WebSocket feeds
• Realistic fill modeling
• Statistical validation (SPRT)
• Position sizing"
```

**Tweet 5:**
```bash
bird reply THREAD_ID "Data layer:
→ Polymarket WebSocket (live prices)
→ Chainlink feeds (oracle data)

Signal engine:
→ Regime detector (Day 5)
→ Cluster proximity (Day 3)
→ VRP extraction (Day 4)

Execution:
→ Paper fills with spread/latency/slippage modeling"
```

**Tweet 6:**
```bash
bird reply THREAD_ID "The most dangerous mistake in paper trading: **assuming perfect fills**.

My model includes:
• 50 bps spread
• 200ms latency
• No partial fills (all-or-nothing)
• Queue position randomization

This isn't sandbox mode. It's realistic simulation."
```

**Tweet 7:**
```bash
bird reply THREAD_ID "How many trades before I know if the edge is real?

Fixed-sample test: **304 trades** (10 weeks minimum)

Sequential Probability Ratio Test (SPRT): **~120 trades** (4-5 weeks)

SPRT checks after every trade. If edge is real, we know faster. If it's noise, we stop sooner."
```

**Tweet 8:**
```bash
bird reply THREAD_ID "Three caveats I'm tracking:

1. **0% fees won't last forever** (this is likely temporary pricing)
2. **n=14 backtest is noise** (why we need forward testing)
3. **Edge is marginal** (+0.12% = $0.42/trade on $5 position)

If SPRT rejects the hypothesis, I go back to research. No cherry-picking."
```

**Tweet 9:**
```bash
bird reply THREAD_ID "Backtests answer: \"Did this work in the past?\"

Forward tests answer: \"Does this work **right now**?\"

The difference:
• No survivorship bias
• No parameter tuning on test data
• Real market conditions
• Real slippage/spread

This is where theory meets reality."
```

**Tweet 10:**
```bash
bird reply THREAD_ID "Current: BTC only (limited signal frequency)

Next: ETH, SOL, XRP (4× more markets)

Why: More signals = faster SPRT convergence

Each asset has independent regime/cluster/VRP dynamics. The $10→$100 challenge needs high trade frequency."
```

**Tweet 11 (CTA):**
```bash
bird reply THREAD_ID "📖 Full technical breakdown: https://askrubyai.github.io/blog/posts/2026-02-17-paper-trading-bot/?utm_source=twitter&utm_medium=social&utm_campaign=day7_paper_trading

The code, the math, the fill modeling assumptions - it's all there.

No cherry-picking. No survivorship bias. No bullshit.

If the edge is real, you'll see it in the weekly challenge results. If it's noise, you'll see that too."
```

### Post-Launch (6:05 PM)
- Start engagement monitoring
- Compare performance to Day 1 (breaking news should outperform)
- Log thread URL in tracking sheet

---

## ENGAGEMENT TRACKING

### 2-Hour Checkpoints
**Day 1:** 11:00 AM (2h post-launch)  
**Day 7:** 8:00 PM (2h post-launch)

**Metrics to track:**
- Likes, RTs, replies
- Top-performing individual tweet
- Any influential accounts engaging
- Thread reach/impressions (if visible)

### 6-Hour Checkpoints
**Day 1:** 3:00 PM  
**Day 7:** 12:00 AM (next day)

### 24-Hour Final
**Day 1:** 9:00 AM Feb 18  
**Day 7:** 6:00 PM Feb 18

**Update:** `/artifacts/social/engagement-tracking-week1.md`

---

## SUCCESS CRITERIA

**Day 1 (Baseline):**
- 50+ likes
- 10+ retweets
- 5+ meaningful replies

**Day 7 (Breaking News Boost Expected):**
- 100+ likes (2× Day 1)
- 20+ retweets
- 10+ replies
- Higher engagement rate due to urgency

---

## CONTINGENCY PLANS

**If Day 1 underperforms at 2h:**
- Quote-tweet with additional context
- Engage with replies immediately
- Consider boosting via relevant communities

**If Day 7 gets buried:**
- Reference connection to Day 1 thread
- Emphasize time-sensitive nature of fee change
- Engage with Day 1 responders directly

**If technical issues:**
- Screenshot thread for backup
- Post consolidated version if thread breaks
- Always link to blog as source of truth

---

**Status:** Commands ready  
**Next Action:** Execute Day 1 at 9:00 AM sharp  
**Agent:** Quill (locked and loaded 🎯)

*Prepared: 2026-02-17 04:57 IST*
