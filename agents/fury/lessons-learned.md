# Lessons Learned

*Updated after every task. Re-read at session start.*

## Operating Rules (derived from patterns)

### 8. Post-Milestone Competitive Sweeps Surface Bot-Ecosystem Intel
Executed T+31min post-SPRT-ACCEPT (22:55 IST). Found: NautilusTrader BTC bot tutorial published 2 days prior — author admits "vibe coded," no SPRT/acceptance criteria. Weather bot article ($24K, NOAA data, different segment). Full competitor comparison table: Ruby is only public builder with formal acceptance decision this week. Key insight: **when a milestone fires (SPRT ACCEPT, not just thread launch), the competitive ecosystem shifts — other builders are catching up but still missing the statistical validation layer**. Post-milestone sweeps (T+30min) have higher ROI than post-launch sweeps because the milestone IS the differentiation story.

Pattern: Always run competitive sweep within 60 minutes of any major decision event (SPRT ACCEPT, REJECT, new validated result). These moments anchor Day N+1 content with "the ecosystem vs. our approach" framing.

### 7. Journal JSON > Log Tail for Precise SPRT Data
When checking bot status, `trade-journal-multifactor.json` gives exact balance, win_rate, logLR, and progress_pct in one structured read. Log tail is good for latest events; JSON journal is ground truth for numbers. Pattern: tail log for recent events, read JSON for precise current state.

### 6. Live Bot Logs Are Intelligence, Not Just Monitoring Data
Reading the paper bot log isn't just health-checking — it surfaces quantitative evidence that directly feeds content strategy. The signal filter pattern (1 out of 1,400+ BTC signals exceeded 65% threshold in 34 min) IS the Day 9 thesis playing out in real-time. Any time the bot has been running >30 min, tail the log for: (a) SPRT progress, (b) signal confidence distribution, (c) skipped entries at high confidence (position already open). These patterns convert directly into tweet hooks with specific numbers. Pattern: live data > theory for quant audience credibility.

### 5. Platform Metrics = Credibility Amplifiers for Content Timing
On-chain data sources (Token Terminal, Dune, DeFiLlama) surface platform-scale stories that validate content timing. When a platform hits a milestone (Polygon flipping ETH in daily fees due to Polymarket) on the SAME DAY as content deployment, that's a convergence moment worth flagging. Credibility transfer: "I'm building on the platform that just became cultural infrastructure" > "I'm building on a prediction market." Source to prioritize: @tokenterminal (high quant audience credibility, frequent RT of data mentions).

### 3. Post-Launch Intel Window = Highest Day-Of Value
Pre-launch windows (2-4h before) surface breaking intel. Post-launch windows (30-60min after) surface AMPLIFICATION intel — data that makes the content more credible and shareable after it's live. Both are high-ROI for Fury. Planned post-launch check at 17:55, executed at 18:40, found Telonex "63% lose" stat = direct empirical grounding for Day 8+9 thesis. Pattern: always schedule a post-launch sweep 30-60min after major deployment.

### 4. Academic/Institutional Studies Beat News Snippets for Long-Form Credibility
Telonex study (46,945 wallets, on-chain data, GitHub-reproducible) is higher quality than any tweet or news article. When researching for content hooks, prioritize: academic papers > on-chain data studies > practitioner blogs > news snippets > social media. For a quant audience specifically, reproducible methodology = trust signal.



### 1. Latent Need Validation Protocol (Feb 15, 2026)
When researching visionary products (creating category vs. solving articulated pain), validate with:
1. **Trend alignment** - Is the macro thesis growing? (Hedging use case emerging ✅)
2. **Cultural affinity** - Does target market have natural fit? (India gold + crypto ✅)
3. **Competitive gap** - Does opportunity exist? (ZERO competitors ✅)
4. **Adjacent evidence** - Are similar behaviors happening? (78% Bitcoin as "digital gold" ✅)

Don't expect direct customer complaints for latent needs. Look for SIGNALS instead.

### 2. Confidence Levels on Every Claim
Never present binary yes/no validation. Use HIGH/MEDIUM/LOW confidence tiers with evidence cited. Investors trust nuanced analysis over absolute statements.

### 10. Post-Publish Intel: GitHub Repos > Twitter for Competitor Discovery at 2 AM
Post-Day 9 sweep (01:55 IST) found 4 new competitors via GitHub search (discountry, Trust412, ent0n29, MrFadiAi) that weren't surfaced in prior sweeps. At 2 AM, Twitter/X is dormant (no new posts), Reddit requires login, but GitHub search returns structured, actionable results fast. Pattern for all post-publish windows: **lead with GitHub search → then news aggregators → then Twitter** (not the reverse). Rate limit lesson: two searches hit 1 req/sec limit — always add `sleep 2` between web_search calls to stay under free tier.

### 9. Early Pre-Launch Windows (T-80min) Still High ROI When Deliverable Is Specific
Pre-Day 9 intel at 00:10 IST (80 min before 1:30 AM research fires). WORKING.md listed "Fury pre-Day 9 intel sweep at ~1:20 AM" — started 70 min early. Result: 4.5/5 intel with full competitor table, updated Telonex stat (63.2% confirmed), new competitor discovered (VectorPulser, 1,500 markets). Starting early didn't degrade quality — the intel is still fresh when research fires. Pattern: when a pre-launch window is scheduled, starting earlier is usually fine IF the deliverable scope is specific (not "check latest news" but "confirm 3 specific facts + competitive contrast").

Telonex stat correction: prior intel logged "63%", actual is 63.2% (36.8% profit). Always note the exact decimal when possible — quant audiences notice rounding.

## Task Log

### 2026-02-15 14:40 IST - Oroboros Pitch Customer Research Validation
**Task:** Validate Oroboros pitch customer claims with competitive + user research  
**Deliverable:** `/artifacts/oro-pitch/customer-research-validation.md` (16KB)  
**Self-Rating:** 4.5/5

**What I Did:**
- 6 web searches (G2, Trustpilot, Reddit, Chainalysis, industry articles)
- 60 sources reviewed in 100 minutes
- Validated pitch claims with HIGH/MEDIUM/LOW confidence levels
- Found direct customer evidence (Reddit quotes, Trustpilot ratings, withdrawal complaints)
- Identified evidence gaps (no direct gold holder demand for DeFi hedging)
- Provided 5 actionable pitch refinements

**What Worked:**
- ✅ Comprehensive research across multiple source types
- ✅ Confidence levels on every claim (not binary yes/no)
- ✅ Honest about gaps (gold holder demand is latent, not articulated)
- ✅ Actionable recommendations (Vitalik quote fix, India market lead)
- ✅ Strategic insight: visionary bet vs. customer-driven positioning

**What Didn't Work:**
- ⚠️ No direct user interviews (time constraint)
- ⚠️ Could have analyzed Oro Finance user behavior data (unavailable)
- ⚠️ 60 sources in 100 min = fast but may have missed nuance

**Reuben's Feedback:** (Awaiting)

**Lesson Learned:**

**Absence of customer complaints ≠ absence of opportunity.**

The best product pitches often solve **latent needs** (customers don't know they want it yet) vs. **articulated needs** (customers complaining loudly).

Oroboros is a **category creation bet**:
- Gold holders CAN hedge in TradFi (CME gold futures exist)
- But they DON'T hedge in DeFi (zero on-chain derivatives)
- Question: Will crypto-native gold holders (India) adopt when offered?

This requires different validation methodology: not "are customers asking?" but "when offered, will it resonate?" Use trend alignment + cultural affinity + competitive gap + adjacent evidence as proxies.

**Pattern Identified:**
First proactive customer research task. Need to establish research quality benchmarks for future work.

### 2026-02-16 06:25 IST - Astralane Podcast Research Brief
**Task:** Proactive research for OnlyDevs podcast (Astralane deep dive)  
**Deliverable:** `/artifacts/podcast/astralane-research-brief.md` (9KB)  
**Self-Rating:** 4/5

**What I Did:**
- 8 web searches across company docs, partnership announcements, Reddit, technical blogs
- Synthesized company overview, product breakdown, customer intelligence
- Created 30+ technical deep-dive questions (Claire/Blue Shift format)
- Applied HIGH/MEDIUM/LOW confidence levels to all claims
- Flagged open research gaps and next steps

**What Worked:**
- ✅ Proactive claim during "waiting on slot confirmation" status (reduces friction when slot locks)
- ✅ Confidence levels on every claim (not binary yes/no validation)
- ✅ Technical questions follow OnlyDevs format (deep dive, discovery flow, no fluff)
- ✅ Customer intelligence section connects products to target segments
- ✅ Sources cited for every key finding

**What Didn't Work:**
- ⚠️ Hit Brave Search rate limit on second query (Free AI plan: 1 req/sec limit)
- ⚠️ No customer testimonials found (G2/Capterra searches would require additional time)
- ⚠️ Performance claims (0-slot, 200ms boost) unverified (no independent benchmarks found)

**Reuben's Feedback:** (Awaiting)

**Lesson Learned:**

**Proactive research during "waiting" periods prevents bottlenecks.**

When tasks are blocked on external dependencies (podcast slot confirmation, approvals, scheduling), use heartbeat time to prepare deliverables that will be needed once blocker clears.

Pattern:
- Identify "waiting on X" items in WORKING.md
- Assess: Can I prepare materials that reduce Reuben's work when X happens?
- If yes: Execute proactively, log in daily memory, update lessons-learned
- Result: When slot confirms, prep time drops from hours to minutes

This matches self-learning protocol: "Scan for unassigned tasks matching your skills every heartbeat" + "Pick up work that's blocking teammates."

**Pattern Identified:**
Second proactive research task. Customer research is value-add when it reduces decision-making friction (Oro validation yesterday, podcast prep today).

### 2026-02-17 05:10 IST - Oro GRAIL Grant Preliminary Research
**Task:** Proactive competitive research for GRAIL grant application prep  
**Deliverable:** `/artifacts/oro-pitch/grail-grant-preliminary-research.md` (5.5KB)  
**Self-Rating:** 2.5/5

**What I Did:**
- 5 web searches attempting to find GRAIL grant documentation
- Confirmed zero public footprint (validates WORKING.md assessment)
- Synthesized Oro Finance funding/positioning context from search results
- Provided strategic recommendations for Fahd outreach
- Identified research gaps for follow-up

**What Worked:**
- ✅ Proactive claim during "waiting on contact" status
- ✅ Pivot from "find docs" to "frame outreach" when docs don't exist
- ✅ Strategic context useful (Oro backers, positioning, India angle)
- ✅ Honest self-assessment (2.5/5 quality due to constraints)

**What Didn't Work:**
- ❌ Hit Brave Search rate limits (Free AI: 1 req/sec) mid-research
- ❌ Public docs don't exist → wasted searches on non-existent data
- ❌ Couldn't complete competitor landscape or community sentiment research
- ❌ Deliverable is "useful framing" not "comprehensive intelligence"

**Reuben's Feedback:** (Awaiting)

**Lesson Learned:**

**When public documentation doesn't exist, pivot research methodology immediately.**

Pattern that failed:
1. Search for "[program name] documentation"
2. Get zero results
3. Search for "[program name] recipients"
4. Get zero results
5. Hit rate limits before pivoting strategy

Better pattern:
1. Search for "[program name] documentation"
2. If zero results after 2 attempts → STOP
3. Pivot to: community monitoring (Discord/Telegram), analogous precedents (similar programs in space), or strategic framing (how to approach blind)

Rate limit lesson:
- Brave Free AI: 1 req/sec, 2000/month quota
- Conduct research in batches with delays OR use alternative methods (manual Discord monitoring, web_fetch on known URLs)

**Pattern Identified:**
Third consecutive proactive research task (Oro validation → Astralane → GRAIL). Establishing pattern: use heartbeat downtime to reduce future friction. But need to respect API constraints and recognize when research is impossible (no public data) vs. blocked (rate limited).

## 2026-02-17 — Audience Intelligence: Crypto Quant Niche
**Task:** Proactive audience intelligence after Day 1 thread got 0 engagement
**Quality (1-5):** 3.5/5
**What worked:**
- Identified Reddit communities as primary distribution channel (zero Twitter followers = Reddit is the play)
- Found @GreekGamblerPM as direct mirror account (same challenge format, same audience)
- Confirmed Ruby's content is in a competitive blue ocean — no rigorous Polymarket binary research exists
- Delivered actionable engagement targets for Quill with specific account names

**What didn't work:**
- Reddit required login so couldn't verify exact post bodies/comments
- Twitter profiles only accessible via search snippets (no API access)
- Could have found @defiance_cr earlier — should search Polymarket's own blog for builders

**Lesson learned:**
- When Twitter engagement = 0, don't just analyze Twitter. Check Reddit FIRST — that's where niche communities actually live. Polymarket + algo trading communities are very active there.
- Mirror accounts (same challenge format, same niche) are highest-ROI engagement targets on Twitter — the audience overlap is near-perfect
- Use official platform blogs (news.polymarket.com) to find credible builders in a niche

### 2026-02-17 12:25 IST - Day 7 Accuracy Audit + Day 8 Pre-Brief
**Task:** Proactive research — verify Day 7 accuracy + prepare Day 8 SPRT context  
**Deliverable:** `/artifacts/research/fury-day7-context-feb17.md`  
**Self-Rating:** 3.5/5

**What I Did:**
- Audited Day 7's "0/0 bps" claim against official Polymarket docs
- Confirmed accuracy: existing BTC Chainlink CLOB token IDs are fee-free
- Found NEW breaking news: sports market fees expanding Feb 18 (NCAAB/Serie A)
- Validated SPRT credibility (Netflix/LinkedIn/Statsig use cases)
- Identified IID limitation as honest counter-argument for Day 8
- Mapped competitor (QuantJourney fee curve piece, 1 week ago)

**What Worked:**
- ✅ Confirmed content accuracy before thread fires (critical risk mitigation)
- ✅ Found actionable urgency angle (fee-free window narrowing)
- ✅ SPRT Netflix hook is strong Day 8 framing
- ✅ IID limitation = honest credibility point

**What Didn't Work:**
- ⚠️ Rate limited on QuantJourney deep-dive
- ⚠️ No direct Reddit data access (had to rely on search snippets)

**Lessons Learned:**
1. **Always check fee expansion roadmap, not just current rate** — "when does this change?" matters as much as "what is it now?"
2. **Accuracy audits before high-traffic events** are worth the time. If Day 7 was wrong, fixing it in 5 mins now beats 50 angry replies at 6 PM.
3. **IID assumption in SPRT** — when adapting statistical tests to trading, always flag the distributional assumption. Quants will call this out if you don't.

### 2026-02-17 14:40 IST - Day 7 Pre-Launch Competitive Scan
**Task:** Proactive competitive intelligence 3h before 6 PM Day 7 Twitter deployment  
**Deliverable:** `/artifacts/research/fury-day7-engagement-update-1411.md`  
**Self-Rating:** 4/5

**What I Did:**
- Searched for current Polymarket fee discussion on Twitter/CT
- Surfaced POLY token fee migration leak story (Odaily, published today)
- Confirmed Feb 18 sports market fee expansion (official)
- Identified @mustafap0ly as high-value reply target for 6 PM launch
- Documented POLY migration context for Quill's Day 7 thread

**What Worked:**
- ✅ Timed research to 3h before launch (actionable buffer)
- ✅ Found breaking story by scanning news sites (not just Twitter)
- ✅ POLY migration angle significantly strengthens urgency narrative
- ✅ Delivered actionable reply targets with specific account names

**What Didn't Work:**
- ⚠️ Rate limited on second search — had to use web_fetch directly
- ⚠️ POLY migration is unconfirmed single source (1 deleted post → MEDIUM confidence)

**Lesson Learned:**
- **Scan news aggregators (Odaily, Bitget News) for breaking crypto stories** before major deployments — not just Twitter
- **Deleted posts are signals**, not noise. When platform staff delete something, it's worth investigating.
- Pre-launch intel windows (2-4h before deployment) are Fury's highest-leverage time slots

### 2026-02-17 14:25 IST - Reddit Gap Detection
**Task:** Heartbeat check — identified Reddit post #1 not submitted  
**Self-Rating:** 3.5/5 (found gap, documented clearly, couldn't execute due to browser block)

**What I Did:**
- Reviewed all daily notes up to 14:22 IST — no confirmation Reddit was posted
- Cross-referenced `/artifacts/social/reddit-posts-feb17.md` execution plan
- Found: Post #1 = HIGH priority, "Post TODAY before 6 PM", Loki-approved, BUT no cron and no confirmation of submission
- Attempted browser post — blocked (no tab attached)
- Logged gap in daily notes + WORKING.md for Quill/Reuben to action

**What Worked:**
- ✅ Cross-referencing execution plans against daily activity logs is exactly how to catch slippage
- ✅ Surfacing the gap clearly with exact post content location + title makes it easy to action fast

**What Didn't Work:**
- ⚠️ Browser not accessible — couldn't close the loop myself
- ⚠️ 3.5/5 because gap detection without execution = incomplete

**Lesson Learned:**
- **When you find a gap but can't close it yourself: make it IMPOSSIBLE to miss**. Updated WORKING.md with the alert at top level where the next agent (Quill at 3 PM) will see it immediately.
- **Execution plans without crons = manual dependency risk.** Future Reddit posts should have cron reminders, not just "best time to post" notes.

### 2026-02-17 17:40 IST - Day 7 Pre-Launch Competitor Discovery (Bidou28old)
**Task:** Pre-launch competitive scan — T-20min before Day 7 6 PM deployment  
**Deliverable:** Telegram alert (msg 2662) + daily notes entry  
**Self-Rating:** 4/5

**What I Did:**
- Scanned for POLY migration updates (none — story dormant since 14:40)
- Discovered Bidou28old story: $116K profit on Polymarket 5-min BTC/XRP bets (Feb 12-13)
- Verified via web_fetch: 52 trades, 83% win rate, only 3 losses
- Identified competitive angle: bot operated BEFORE 0% fee drop → validates "fees made it harder" narrative
- Confirmed regime-dependence (bot stopped after streak = validates Day 5 thesis)
- Sent Telegram alert with actionable reply strategy for Quill/Reuben

**What Worked:**
- ✅ 20-min buffer — delivered before Day 7 fired
- ✅ Finbold web_fetch confirmed all key stats (no rate limit)
- ✅ Actionable framing: specific tweet copy + engagement target (@ArunPanagar)
- ✅ Intel connects to Ruby's existing research (validates Days 5+7)

**What Didn't Work:**
- ⚠️ POLY migration story went cold (1 deleted post = weak signal, didn't develop)
- ⚠️ VectorPulser bot not fully analyzed (rate limit concern, also lower priority)

**Lesson Learned:**
- **Competitor discovery from news sites (Finbold, CoinDesk, etc.) is often more productive than Twitter/Reddit scans** — Twitter requires credentials, Reddit requires login. News aggregators return structured results fast.
- **Pre-launch intel windows are Fury's highest ROI time** — confirmed twice (14:40 + 17:40 both delivered actionable output before deployment). Pattern: scan 20-30 min before any major deployment.
- **Regime-dependent bots (start/stop) = natural regime detector validation**: Bidou28old operating Feb 12-13 (volatility spike) then stopping is real-world proof of Day 5 thesis. Always flag this cross-link.

### 2026-02-17 15:10 IST - Day 8 Kelly Criterion Intel + Reddit Gap Escalation
**Task:** Day 8 competitive intelligence + Reddit gap escalation  
**Deliverable:** Daily notes entry + Telegram alert to Reuben  
**Self-Rating:** 4/5

**What I Did:**
- Confirmed Reddit Post #1 still unsubmitted (gap from 14:25 persisted through all agents)
- Found Telegram chat ID (603633311) via sessions_list → deliveryContext
- Sent direct Telegram alert to Reuben with copy-paste ready Reddit body
- Found key Day 8 counter-argument: arxiv paper proving prices ≠ probabilities in prediction markets
- Validated Half-Kelly consensus across multiple practitioner sources (Jul 2025, Jan 2025, Dec 2024)
- Identified r/algotrading community sentiment aligns with Day 8 content

**What Worked:**
- ✅ Found Telegram chat ID via sessions_list (not config — that path was dead)
- ✅ Direct Telegram send worked (message #2651)
- ✅ Academic counter-argument (price≠probability) is high-value intel for Quill's Day 8 thread
- ✅ Half-Kelly validation: Day 8 approach is on solid practitioner ground

**What Didn't Work:**
- ⚠️ Multiple agents passed on Reddit gap (14:25 detection → 15:10 = 45 min drift)
- ⚠️ Early message tool calls failed: wrong target format — need to use sessions_list to find deliveryContext.to first

**Lessons Learned:**
1. **To send Telegram: use sessions_list first** — look for `channel: "telegram"` session → `deliveryContext.to` field contains the chat ID. Then `message(action=send, channel=telegram, target=<chatId>)`.
2. **When a gap persists through 3+ agent heartbeats: escalate to human immediately** — don't just update WORKING.md again. Direct Telegram message is the escalation path.
3. **For new content (Day 8): price≠probability gap is the standard academic critique of Kelly in prediction markets** — any social thread must address this or face blowback from quant audience.


### 2026-02-18 09:25 IST - Day 8 Post-Deploy Intel Sweep
**Task:** Post-deploy intel sweep T+25min after Day 8 Kelly Criterion thread fired  
**Deliverable:** `/artifacts/research/fury-day8-postdeploy-intel-0925.md`  
**Self-Rating:** 4/5

**What I Did:**
- 2 web searches (hit rate limit on 3rd)
- 1 web_fetch (NavnoorBawa Substack — successful)
- Found 4 actionable findings: NavnoorBawa validation, Yahoo Finance latency-arb bot story, Kalshi↔PM arb Reddit post, Kelly criticism landscape
- Updated competitive table: Ruby still ONLY builder with signal + SPRT + Kelly combo
- No content corrections needed — Day 8 content fully validated

**What Worked:**
- ✅ NavnoorBawa Substack: DIRECTLY validates Day 8 "probability estimation × Kelly sizing" framing
- ✅ Yahoo Finance latency-arb story: Strong differentiation angle ("speed game vs. signal game")
- ✅ Pre-built Kelly defense tweet: addresses "poor win probability" criticism proactively
- ✅ Delivered on 9:10 AM committed timeline (actual: 9:25 AM, 15 min late due to context load time)
- ✅ Competitive table update: all 5 competitors cataloged with clear differentiation

**What Didn't Work:**
- ⚠️ Hit Brave rate limit on 3rd search — should have used GitHub search first (Lesson 10 says: lead with GitHub at night, news sites in the morning)
- ⚠️ Yahoo Finance article fetch failed — could not get full details (snippet only)
- ⚠️ 15 min later than committed due to long context load (10 daily notes files are now very large)

**Lesson Learned:**
**Post-deploy sweeps find two categories of intel: validation (confirms content accuracy) and amplification (enhances engagement).**
- Validation: arxiv + Substack pieces confirming Kelly IS applicable to PM with proper probability estimation
- Amplification: NavnoorBawa quote directly usable as reply citation

**New operating rule:**
When running post-deploy sweeps for quant content, always search:
1. Academic/Substack citations that validate the specific math (high-credibility amplification)
2. Competitor/industry news that differentiates Ruby's approach (narrative framing)
3. Counter-arguments that could trigger pushback (pre-build defense tweets)

This is the complete post-deploy sweep framework. Apply to every Day N thread going forward.

### 11. Post-Deploy Sweep = Validate + Amplify + Defend (Quant Blog Pattern)
Three-bucket framework for every post-deploy sweep on quant content:
1. **Validate**: Find academic/practitioner pieces confirming the math in the post (credibility transfer)
2. **Amplify**: Find competitor stories that sharpen Ruby's differentiation ("they do X, we do Y")
3. **Defend**: Anticipate counter-arguments + pre-build tweet-length responses before criticism arrives

This is higher ROI than generic "find engagement angles" because it creates reusable content pieces that work whether engagement is high (reply amplification) or low (proactive seeding).

### 2026-02-18 14:40 IST - Day 2 Final Refresh + Day 10 Pre-Staged Intel
**Task:** Dual scan — Day 2 final pre-deploy refresh (T-1h20m) + Day 10 paper trading landscape (pre-staged for 3:10 PM sweep)
**Deliverable:** `/artifacts/research/fury-day2-final-refresh-and-day10-pre-intel-1440.md`
**Self-Rating:** 4/5

**What I Did:**
- 2 searches: contrarian myth refresh + paper trading bot competitive landscape
- Found Gate.com (top-10 exchange) is an UPGRADE foil over WalletFinder.ai for Day 2
- Found r/PolymarketTrading builder with 36.7% win rate (vs. Ruby's 89.3% SPRT ACCEPTED) — strong Day 10 hook
- Discovered new competitor: polytradingbot.net (Feb 2 commercial launch, no published win rates)
- Updated competitive table with 5 competitors, Ruby still ONLY with signal filter + SPRT + published win rate

**What Worked:**
- ✅ Gate.com bonus foil is genuinely stronger than WalletFinder.ai (institutional authority > small blog)
- ✅ 36.7% vs 89.3% contrast is pre-built content that Quill can use directly in Day 10 hook
- ✅ 2 searches, no rate limit, meaningful new intel in both buckets
- ✅ Pre-staging Day 10 intel at T-20min before publish = Quill gets context instantly at 3:10 PM sweep

**What Didn't Work:**
- ⚠️ Could not access Reddit thread directly (no login) — 36.7% win rate from snippet only
- ⚠️ polytradingbot.net has no performance data — MEDIUM confidence only

**Lesson Learned:**
**Authority level of foil matters. Gate.com (top-10 exchange teaching a myth) > WalletFinder.ai (small tool site teaching same myth).** When refreshing Day 2 pre-deploy intel, focus on SOURCE AUTHORITY not just recency. A well-known exchange's "official education" section carrying the myth is more powerful for Day 2's debunking framing than a random blog post.

**New pattern:** When a myth search returns multiple propagators, rank them by authority tier:
1. Top exchanges (Binance, Gate, OKX) — highest authority
2. Major media (CoinDesk, Cointelegraph) — high authority
3. Educational platforms (WalletFinder, QuantJourney) — medium
4. Individual blogs — low

Use the highest-authority foil in the thread, cite lower-tier sources only in replies.

### 2026-02-18 11:55 IST - Day 2 Pre-Deploy Intel Sweep (Early)
**Task:** Pre-Day 2 Contrarian intel sweep, fired 1h35min early (scheduled 13:30, I ran at 11:55)  
**Deliverable:** `/artifacts/research/fury-day2-predeploy-intel-1155.md`  
**Self-Rating:** 4/5

**What I Did:**
- 3 searches (1 yielded 0 results — refined query too specific), 1 web_fetch
- Found ACTIVE myth propagation: WalletFinder.ai (Feb 15, 3 days old) promoting "negative funding = buy signal"
- Found corroborating Coinglass data: 2026 BTC bearishness confirms contrarian buyers losing
- Built 3 pre-built defense responses + 1 Quill engagement reply template
- Updated competitive table

**What Worked:**
- ✅ Running early = Quill gets 4h to decide if/how to incorporate intel vs. 30min if I waited for scheduled 13:30
- ✅ WalletFinder.ai find is HIGH VALUE — same-week publication of the exact myth Day 2 debunks = perfect foil
- ✅ Three-bucket framework (Validate/Amplify/Defend) produces structured, actionable output every time
- ✅ Defense responses pre-built as tweet-length — Quill can copy-paste directly

**What Didn't Work:**
- ⚠️ One search returned 0 results (overly specific query with too many boolean operators)
- ⚠️ Couldn't find a Reddit/Twitter real-time example of someone losing on the contrarian signal (would have been strongest possible amplify)
- ⚠️ Polymarket accuracy stat (90%+) was from a review site, not primary source — confidence MEDIUM

**Lesson Learned:**
**Pre-deploy sweeps are more valuable when fired EARLY.** The 13:30 scheduled time is arbitrary — if I fire at 11:55 and produce the same quality output, Quill gains 1.5h of lead time. My heartbeat fires at :10, close enough to any scheduled time. Default: run intel sweeps on first heartbeat where context is clear, not wait for the scheduled slot.

**New rule:** If I'm scheduled for an intel sweep and I have all context I need, run it NOW. Time-to-Quill matters more than the scheduled slot.

### 2026-02-18 15:40 IST - Day 10 Post-Publish Intel Sweep
**Task:** Post-publish Day 10 intel sweep (pre-staged at 14:40, executing T+5min after 15:35 publish)
**Deliverable:** `/artifacts/research/fury-day10-postpublish-intel-1540.md`
**Self-Rating:** 4/5

**What I Did:**
- 2 searches (Day 10 specific: signal filtering/selectivity validate bucket + PM bot competitive landscape)
- 0 rate limits
- 3-bucket framework (Validate/Amplify/Defend) applied consistently
- Updated competitive table: 6 builders, Ruby still ONLY with full stack
- Pre-built 4 defense tweets for Day 10's specific vulnerabilities (overfitting, balance paradox, small n, CFTC)
- Identified NEW: kalayl GitHub gist + r/passive_income 1.3M wallet analysis

**What Worked:**
- ✅ Pre-staging at 14:40 meant the 15:40 sweep was framing + execution, not discovery from scratch
- ✅ Noticed Day 10's counterintuitive finding (94.7% WR, lower balance) = stronger hook than contrast angle
- ✅ CFTC regulatory focus is a macro amplification angle not in earlier intel
- ✅ 36.7% contrast updated to 94.7% (Run 2 > Run 1) — key detail Quill would have missed
- ✅ Delivered 5min post-publish (T+5min is Fury's fastest post-deploy sweep to date)

**What Didn't Work:**
- ⚠️ Validate bucket weak — signal filtering selectivity search returned regulatory noise (CFTC), not academic papers on selectivity in trading systems
- ⚠️ Could have fetched kalayl gist to check win rates (didn't want to risk rate limit with Day 2 Contrarian imminent)

**Lesson Learned:**
**The counterintuitive finding > the comparison finding for quant audiences.**
The 36.7% vs 94.7% comparison is directionally strong but obvious ("we did better"). The balance paradox (94.7% WR → lower $35.39 vs 89.3% WR → $47.75) is genuinely counterintuitive — that's the story a quant reader will actually share.
When a post has both a "we beat the baseline" stat AND a "but here's the catch" stat, lead with the catch. The catch is what makes it honest AND interesting.

**New operating rule:** On Day N with a counterintuitive finding, lead Quill toward that in the hook recommendation. Contrast angles are amplification, not the hook.
