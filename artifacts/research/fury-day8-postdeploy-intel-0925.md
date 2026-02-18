# Fury — Post-Deploy Intel: Day 8 Kelly Criterion
**Filed:** 09:25 IST, Wed Feb 18, 2026  
**Trigger:** Day 8 Kelly thread `dc27da24` fired at 9:00 AM IST (T+25min sweep)  
**Self-rating:** 4/5 (hit rate limit on 3rd search, pivoted to web_fetch successfully)

---

## FINDING 1 — NavnoorBawa Substack (Dec 24, 2025) — HIGH VALUE, HIGH CONFIDENCE

**Source:** navnoorbawa.substack.com — "The Math of Prediction Markets: Binary Options, Kelly Criterion, and CLOB Pricing Mechanics"  
**Published:** December 24, 2025  

**Key quotes:**
- "Alpha comes primarily from superior probability estimation combined with Kelly-optimal sizing."
- "Retail behavioral biases and platform fragmentation create persistent inefficiencies for quantitative exploitation."
- "YES + NO = $1.00 invariant" — foundational arbitrage mechanic
- Covers ERC-1155 tokens, Gnosis CTF, off-chain CLOB → on-chain settlement (Polygon USDC)

**Why it matters for Day 8:**
- DIRECTLY validates Ruby's Day 8 approach: superior probability estimation + Kelly sizing IS the edge
- "Retail behavioral biases create persistent inefficiencies" = the exact market structure Ruby exploits
- High institutional-quality framing (pitched as "hedge fund analysis") — credibility transfer

**Suggested @quill action (MEDIUM priority, reply to Day 8 thread):**
> "NavnoorBawa wrote the academic companion piece for this in December:
> 'Alpha comes from superior probability estimation combined with Kelly-optimal sizing.'
> That's exactly what Day 8 is building — probability estimation (multi-factor signal) × Kelly sizing.
> The math holds up: navnoorbawa.substack.com/p/the-math-of-prediction-markets-binary"

---

## FINDING 2 — Yahoo Finance (Jan 6, 2026) — HIGH VALUE, MEDIUM CONFIDENCE (can't fetch full article)

**Source:** finance.yahoo.com — "Arbitrage Bots Dominate Polymarket With Millions in Profits as Humans Fall Behind"  
**Published:** January 6, 2026

**Key details (from search snippet):**
- Bot exploits "tiny window where Polymarket prices lag confirmed spot momentum on exchanges like Binance and Coinbase"
- Entry point: actual probability already ~85% but Polymarket still shows 50/50 odds
- Thousands of micro-trades: consistent gains, dilute losses, flatten variance
- Strategy: latency arbitrage (exploit price lag), NOT signal-based

**Competitive differentiation for Ruby:**
- This bot = **latency arbitrage** (execution speed game, requires colocation/low-latency infra)
- Ruby's bot = **signal-based edge** (probability estimation game, accessible with standard API)
- Completely different competitive landscape — Ruby is NOT competing with these bots

**Suggested @quill reply angle (LOW priority, if engagement is low post-Day 8):**
> "In January, Yahoo Finance covered arbitrage bots dominating Polymarket with 'millions in profits.'
> Those bots exploit execution latency — Polymarket price lag vs Binance.
> We're doing something different: signal-based probability estimation with Kelly sizing.
> No colocation required. Edge is in the math, not the milliseconds."

---

## FINDING 3 — Reddit r/SideProject (~Feb 11, 2026) — MEDIUM VALUE, HIGH CONFIDENCE

**Source:** reddit.com/r/SideProject — Polymarket trading bot for Kalshi↔Polymarket arbitrage  
**Published:** ~1 week ago (Feb 11, 2026 estimated)

**Key details:**
- Cross-exchange arbitrage: exploit price discrepancies between Kalshi and Polymarket on same events
- Open source, shared code
- Strategy: inter-market arbitrage (regulatory/liquidity differences create price gaps)

**Competitive differentiation:**
- Cross-exchange arbitrage requires event markets that exist on BOTH platforms
- Ruby's 15-min crypto markets exist ONLY on Polymarket — zero arbitrage opportunity
- Again: completely different strategy, different market, different competitor class

**For Day 8 content**: Low priority — doesn't directly threaten or validate Day 8 framing. Skip for now.

---

## FINDING 4 — arxiv Paper (Dec 18, 2024) — MEDIUM VALUE, MEDIUM CONFIDENCE

**Source:** arxiv.org — "Application of the Kelly Criterion to Prediction Markets"  
**Published:** December 18, 2024

**Key detail from snippet:**
- "The inability to have naked short positions leads in binary outcome markets to the trading of two linked contracts"
- Analyzes mirror markets (YES/NO contract structure)
- Does NOT model fees or market mechanics

**Why it matters:**
- Academic validation: Kelly IS applicable to prediction markets (arxiv-level institutional backing)
- The "inability to short" constraint = addressed in Polymarket by trading NO contracts (equivalent to shorting YES) — Ruby handles this correctly in live-bot-v1.py
- No 2026 critiques found in academic space for Kelly applied to PM — the academic consensus appears supportive

---

## FINDING 5 — Kelly Criterion Criticism Landscape (Reddit r/options, 2021)

**Key criticism source:** r/options Reddit — "Why Retail Traders Should Avoid The Kelly Criterion Method"  
**Core argument:** "Poor understanding of win probability" is the main failure mode for KC in practice

**Why this matters for Ruby's Day 8 defense:**
- The #1 Kelly critique is EXACTLY what Ruby's multi-factor signal is solving: **better win probability estimation**
- Traditional KC users estimate win probability poorly (gut feel, historical averages)
- Ruby's system: multi-factor Gate 1 score (≥0.30 threshold) + SPRT validation = quantified probability estimation
- Day 8's honest conclusion ("need 65%+ win rate") directly addresses this: Ruby KNOWS what win rate is needed AND has a system to achieve it

**Pre-built defense tweet (if criticized):**
> "You're right — Kelly fails when you don't know your win probability.
> That's why Day 6 built a multi-factor signal filter (Gate 1 score ≥0.30)
> and Day 8 sets a MINIMUM 65% win rate threshold before sizing up.
> We don't apply Kelly blindly. We build the edge first."

---

## COMPETITIVE LANDSCAPE UPDATE (as of Feb 18, 9:25 AM IST)

| Builder/Bot | Strategy | Differentiation from Ruby |
|---|---|---|
| Yahoo Finance bot (Jan 2026) | Latency arbitrage (price lag Polymarket vs Binance) | Speed game, not signal game. Different execution layer. |
| Kalshi↔Polymarket bot (Feb 2026) | Cross-exchange arbitrage | Different markets. Irrelevant to 15-min crypto on PM. |
| VectorPulser (Feb 16) | Brute force 1,500 markets, price-only signals | No signal filtering, no SPRT, no Kelly sizing |
| NautilusTrader bot (Feb 2026) | BTC bot, "vibe coded", no acceptance criteria | No statistical validation layer |
| Bidou28old (Feb 12-13) | Manual + momentum, $116K in 52 trades | Regime-dependent, not systematic |

**Ruby's unique position (still holds as of Feb 18 AM):**
- ONLY public builder with: multi-factor signal filter + SPRT acceptance testing + Kelly position sizing
- ONLY builder with formal statistical acceptance decision (SPRT ACCEPTED, n=28, 89.3% WR)
- Differentiation table remains accurate and defensible

---

## SUMMARY FOR @QUILL

**Priority actions (in order):**
1. **(MEDIUM)** Reply to Day 8 thread with NavnoorBawa Substack citation — validates academic framing, ~20 min after Day 8 goes live is good timing. If browser relay is attached, post now.
2. **(LOW)** Yahoo Finance "arbitrage bots" angle — good fallback if engagement is low at 4 PM check. Frames "latency vs. signal" as Ruby's differentiator.
3. **(SKIP)** Reddit r/SideProject cross-exchange bot — not relevant to Day 8 thread or audience.

**No urgency flag for Jarvis** — nothing found that threatens Day 8 content accuracy or requires thread corrections.

---

*Filed by Fury — Post-deploy intel sweep, Day 8 Kelly Criterion*
