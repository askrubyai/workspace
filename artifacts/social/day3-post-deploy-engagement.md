# Day 3 Post-Deploy Engagement Brief
**Created:** 2026-02-19 08:42 IST — Quill  
**Thread:** Day 3 — "The Liquidity Cluster Edge: When Humans Beat Bots"  
**Deploy time:** 9:00 AM IST Thu Feb 19  
**Blog:** https://askrubyai.github.io/blog/posts/2026-02-15-liquidity-clusters/  
**Status:** Pre-staged ✅ — T-18min at creation

---

## Engagement Window
- **T+30min (9:30 AM)**: Golden window for replies — start monitoring
- **T+2h (11:00 AM)**: First engagement check
- **T+6h (3:00 PM)**: Second engagement check (before Day 9 deploys at 4 PM)

---

## Expected Reply Types & Pre-Drafted Responses

### Type 1: "Can I get the bot code?"
**Likelihood: HIGH** — algo traders always ask

**Reply:**
> Building it now! Will open-source the cluster detector once I've paper-traded 50+ trades for validation. Don't want to release untested code.
> 
> Follow along on the blog — I document everything including when it breaks 🧵

---

### Type 2: "Why not just use RSI/MACD?"
**Likelihood: MEDIUM** — retail traders who think TA solves everything

**Reply:**
> Those are lagging indicators — they tell you where price WAS.
> 
> Liquidity clusters are leading — they show where orders ARE, sitting in the book right now.
> 
> On 5-minute Polymarket contracts, 10-15 seconds of edge is everything. Different tools.

---

### Type 3: "10 trades proves nothing" (skeptic)
**Likelihood: HIGH** — and it's a VALID point, lean into it

**Reply:**
> 100% correct. That's why I included the confidence interval.
> 
> 95% CI on 70% WR with n=10: [35%, 93%]
> 
> That's not a winning edge — that's a hypothesis. Paper trading 50+ trades is the only way to know.
> Most traders skip this step. We won't.

---

### Type 4: "What's BTC Dominance got to do with 5-min markets?"
**Likelihood: MEDIUM**

**Reply:**
> Dominance is a regime filter, not a price signal.
> 
> BTC falling while dominance rises = capital flowing INTO BTC from alts = flight to safety.
> At a cluster support, that's a mean reversion setup.
> 
> The filter eliminates trades where the signal is ambiguous — which is 70% of the time.

---

### Type 5: "Why not just use limit orders and collect spread?"
**Likelihood: LOW-MEDIUM** — DeFi-native traders

**Reply:**
> That's literally Day 12 of this series.
> 
> Turns out taker fees on Polymarket CLOB are 10% (1000 bps). Discovered this in the live bot dry run.
> Maker orders earn rebates. The whole strategy had to be redesigned around this.
> 
> TL;DR: you're right, and it took a dry run to confirm it.

---

## Thread Engagement Strategy

### Most Viral Angle
**Tweet 8 (honest CI discussion)** is the highest trust-building moment. If any tweet gets screenshot-shared, it's this one.

Encourage discussion with a reply to any engagement on Tweet 8:
> "The CI narrowing chart is the most important one in the thread. Most quant Twitter shows you the wins. The honest story is: you need the sample size first."

### Secondary Engagement Angle  
**Tweet 2 ("Human beats bot")** narrative — contrarian, relatable, generates human-interest replies.

### Avoid
- Promotional replies to unrelated crypto threads — context mismatch, feels spammy
- Quoting other quant accounts to start arguments — still building reputation, not flame-war territory yet

---

## Day 3 Competitive Context (from Fury prior intel)
- **StartupFortune foil**: 35% WR / 140 trades / lost money → still valid differentiation
- **VectorPulser bot**: Brute force (1,500 markets, price-only signals) — Ruby's selective approach (3-factor filter) = fundamental architecture difference
- **Day 3 positioning**: "Human beats bot" is curiosity bait. The math behind WHY is the value delivery.

---

## Browser Relay Note
⚠️ Replies require browser relay (Chrome tab attached). If relay is down:
- Log any engagement targets in daily notes
- Send Reuben a Telegram with the pre-drafted reply + tweet URL
- DO NOT wait for next heartbeat if T+30min window is active and relay is down

---

## Tracking
After deployment, update `/artifacts/social/engagement-tracking-week1.md`:
- Day 3 thread URL (log immediately after cron confirms)
- T+2h and T+6h metrics
