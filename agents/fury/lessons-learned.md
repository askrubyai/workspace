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

### 12. Breaking News Foil > Evergreen Foil for Post-Deploy Amplification
When running Day 2 Contrarian post-deploy sweep, found NewsBTC article (Feb 14, 2026 = 4 days old) titling "Bitcoin Funding Rate Falls To Critical Level — Short Squeeze Incoming?" — CryptoQuant analyst explicitly calling negative funding a "strong Contrarian Signal" while TradingView amplified to millions. **This is Tier 1 foil because**:
1. It's CURRENT (same week as thread, maximum freshness)
2. It's from a major news outlet citing institutional data (CryptoQuant)
3. TradingView amplification = millions of traders read exactly this myth 4 days before Day 2 fires

Foil hierarchy for Day 2 Contrarian threads:
- Tier 1: Major news (NewsBTC, CoinDesk) citing analyst/on-chain data — most current, most reach
- Tier 2: Major exchanges (Gate.com, Binance) educating myth via help docs
- Tier 3: Smaller tools/blogs (WalletFinder.ai) propagating myth

Always search for Tier 1 first: `"funding rate" contrarian signal [month] [year]` on news search with freshness=pw.

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

### 2026-02-18 17:25 IST - Day 11 Live Bot Pre-Stage Intel
**Task:** Proactive pre-stage competitive sweep for Day 11 first-real-money post (T-8h to 1:30 AM Thu)  
**Deliverable:** `/artifacts/research/fury-day11-prestage-intel-1725.md`  
**Self-Rating:** 4.5/5

**What I Did:**
- 2 searches (live Polymarket bot results + small account challenge)
- Found StartupFortune: real money, 140 trades, 35% WR, LOST — strongest Day 11 foil yet
- Found r/btc WebSocket consensus: validates Ruby's live-bot architecture
- Flagged naming conflict: "OpenClaw-v1.0" CEX arb repo ≠ Ruby's OpenClaw platform
- Updated competitive table to 7 builders

**What Worked:**
- ✅ StartupFortune is EXACTLY the foil Day 11 needs — real money, real failure, no SPRT
- ✅ 35% WR (live) vs 94.7% WR (Ruby validated) is the cleanest possible contrast
- ✅ Naming conflict catch prevents potential confusion in Day 11 content
- ✅ T-8h pre-staging gives squad 8h buffer (same pattern as Day 9/10 pre-staging)

**What Didn't Work:**
- ⚠️ Couldn't fetch StartupFortune full article (rate limit caution) — exact dollar amount lost unknown

**Lesson Learned:**
**"Gave AI money to trade" articles are gold mines for differentiation.** The failure story (35% WR, unsellable tokens, lost real money) is more credible than any comparison to bots with no published results. For Day N involving live money, always search for real-money failure stories in the same domain — they establish WHY Ruby's systematic approach matters.

### 2026-02-18 17:10 IST - Day 2 Contrarian Post-Deploy Intel Sweep (T+70min)
**Task:** Post-deploy amplification sweep for Day 2 Contrarian thread (`7b2b6d6b`, fired 4 PM IST)
**Deliverable:** `/artifacts/research/fury-day2-postdeploy-intel-1710.md`
**Self-Rating:** 4/5

**What I Did:**
- 2 web searches + 1 web_fetch
- Found Cointribune + Santiment article (Feb 17): LIVE myth propagation (negative funding = directional bearish signal)
- Confirmed F&G at 10 (extreme fear) — market context making Day 2 topical RIGHT NOW
- Found Polygon/Polymarket credibility angle (Polygon flipped ETH in fees Feb 14)
- No new defenses needed — prior stack sufficient

**What Worked:**
- ✅ Cointribune (Tier 1, French/European outlet) is ADDITIVE to NewsBTC (different audience)
- ✅ Live market conditions (BTC -28%, F&G=10) make Day 2 thesis extraordinarily timely
- ✅ 3-bucket framework produced structured, actionable output efficiently
- ✅ Identified engagement window still open (closes ~5:30 PM)

**What Didn't Work:**
- ⚠️ Didn't do deeper fetch on Santiment's actual funding rate chart (rate limit risk)
- ⚠️ No direct Twitter engagement metrics available (no API access)

**Lesson Learned:**
**Multiple independent Tier 1 sources > one Tier 1 source for amplification.**
When a myth is being propagated simultaneously by NewsBTC (US media, CryptoQuant analyst) AND CoinTribune (French media, Santiment) — the myth is mainstream, not fringe. This DOUBLES the day's content credibility: "It's not one outlet saying this — entire CT media ecosystem is propagating it."
Tweet angle: "It's not just one outlet. NewsBTC, CoinTribune, Santiment — all saying the same thing about negative funding this week. We're the counter-data."

**New pattern:** For post-deploy sweeps on contrarian debunking content, search specifically for:
1. Major media citing specific on-chain data firms (CryptoQuant/Santiment) for the myth — highest authority
2. Search in non-English markets (CoinTribune=France, Cointelegraph Germany, etc.) — additive audience
3. Current macro context that makes the myth MORE active right now (extreme fear = people reaching for contrarian plays)

### 2026-02-18 22:40 IST - Day 11 T-2h Mandatory Confirmation Sweep
**Task:** T-2h confirmation + market conditions check (mandatory per lessons-learned rule)  
**Deliverable:** `/artifacts/research/fury-day11-t2h-confirmation-2240.md`  
**Self-Rating:** 3.5/5

**What I Did:**
- 2 searches (1 rate-limited on second query — ran sequentially with delay)
- Confirmed F&G still at 10 (Extreme Fear) — down 2 from morning
- Found FOMC minutes released TODAY (Feb 18) — active macro catalyst = BTC volatility window
- Confirmed finbold "OpenClaw" naming still #1 SERP (zero-OpenClaw rule valid)
- Confirmed StartupFortune foil unchanged
- Found 1 new competitor: frankomondo/polymarket-trading-bots-telegram (Rust, Telegram, different segment)

**What Worked:**
- ✅ Executed mandatory T-2h sweep as committed in lessons-learned
- ✅ FOMC minutes today = "extreme fear + hawkish uncertainty = regime detector validates this" — bonus content angle
- ✅ Competitive table updated to 9 builders
- ✅ All standing orders confirmed valid before 1:30 AM launch

**What Didn't Work:**
- ⚠️ Rate limited on 2nd search — had to sequence with delay
- ⚠️ 3.5/5 because mostly confirmations (consistent with prior sweeps — intel stack was already solid)

**Lesson Learned:**
**Two late-evening pre-deploy sweeps (T-3.5h + T-2h) on first live-money run = correct protocol.** The T-3.5h sweep found naming conflict SERP escalation. The T-2h sweep found FOMC catalyst + new competitor + macro confirmation. Together they give 1:30 AM executor full situational awareness.

Pattern confirmed: on HIGH STAKES events (first live money, major milestones), run both T-3.5h AND T-2h sweeps. Neither is redundant — they catch different classes of intel:
- T-3.5h: confirms positioning, catches branding/SERP risks
- T-2h: confirms market conditions, catches last-minute macro catalyst

### 2026-02-18 21:55 IST - Day 11 Final Pre-Deploy Intel Sweep (Early)
**Task:** Final pre-Day 11 intel sweep, fired 1h15m early (planned 23:10 IST → ran 21:55 IST)  
**Deliverable:** `/artifacts/research/fury-day11-final-predeploy-intel-2155.md`  
**Self-Rating:** 3.5/5

**What I Did:**
- 3 web searches + 1 web_fetch
- Confirmed naming conflict escalation: finbold article (#1 SERP result) explicitly brands Bidou28old's $116K bot "OpenClaw trading bot" — now public and widely indexed
- Found new competitor: r/SideProject copy trading bot ($29 commercial, no win rates)
- Confirmed Polymarket BTC 15-min markets still live (live-bot-v1.py will find markets at 1:30 AM ✅)
- Updated competitive table to 8 builders

**What Worked:**
- ✅ Running early (23:10 → 21:55) = Quill/squad gets 1h15m more buffer
- ✅ Three-bucket framework (Validate/Amplify/Defend) applied consistently
- ✅ Naming conflict escalation is genuinely new value (confirms finbold is now the source of confusion at scale)
- ✅ Confirmed existing handling is correct — no wasted re-work

**What Didn't Work:**
- ⚠️ No tier-1 new intel (no StartupFortune updates, no new "gave AI money to trade" articles)
- ⚠️ 3.5/5 because confirmations > discoveries
- ⚠️ Copy trading bot ($29) is low priority for Day 11

**Lesson Learned:**

**Confirmation sweeps are still valuable when they prevent false security.**

Running at T-3.5h vs. T-2.3h: no tier-1 new intel found in the delta. BUT the naming conflict confirmation (finbold article publicly using "OpenClaw" for Bidou28old's $116K bot) upgraded the existing warning from "potential confusion" to "confirmed public mainstream association."

Zero-OpenClaw rule was already correct. This sweep PROVED it was the right call with evidence. That's different from just saying "we decided to avoid the name" — now we have a specific search result showing WHY.

**Pattern refined:**
Pre-deploy sweeps at T-3.5h on LIVE MONEY events are worth doing even when no tier-1 intel is expected, because:
1. They confirm existing positioning is still correct
2. They catch naming/branding risks that could go viral right before launch
3. They let you stand down at 23:10 IST with confidence, not anxiety

**New rule:** On first live-money deployment, run at LEAST two pre-deploy sweeps: T-8h (comprehensive) and T-2h (confirmation + market conditions check). Running early is fine; skipping the T-2h check is not.

### 13. F&G Real-Time API = Instant Market Condition Read
`https://api.alternative.me/fng/?limit=1` returns current F&G score in <3 seconds, no auth required. At T-80min before Day 11: F&G dropped 10→8 in ~90 min (deepening Extreme Fear). This delta — not just the absolute value — is the story. "Fear deepened into the bot run" is more compelling than "fear was at 10." Always fetch F&G delta between sweeps, not just current snapshot.

**New operating rule:** When sequential pre-deploy sweeps are done (T-2h, T-80min), log the F&G DELTA, not just current value. The direction of fear (deepening vs. stabilizing) predicts whether volatility is entering or leaving — and the regime detector cares about direction.

### 2026-02-19 00:55 IST - Day 11 T-35min Final Sweep
**Task:** Final pre-run competitive + market intel sweep before 1:30 AM live bot run
**Deliverable:** Daily notes entry + Telegram alert (msg 2789) + lessons-learned update
**Self-Rating:** 4.5/5

**What I Did:**
- Fetched F&G via API: **8 (Extreme Fear)** — unchanged since 00:10 sweep, stabilized
- 1 web search: Polymarket 15-min markets status
- 1 web_fetch: PANews article (Feb 18, 2026) — full article
- Found CRITICAL: Taker fees up to 3% introduced in January 2026 on 15-min crypto markets
- Found AMPLIFICATION: InvestingHaven — "downside odds above 70%" = favorable for regime detector
- Sent Telegram alert (msg 2789) to Reuben + tagged Jarvis/Friday
- Updated daily notes

**What Worked:**
- ✅ F&G API call (<3 sec) confirmed stability instantly
- ✅ Web search surfaced PANews article that prior sweeps MISSED — published 17h ago but contains January-dated fact
- ✅ Followed "web_fetch for key articles" rule — got full article, not just snippet
- ✅ Escalated immediately to Telegram (msg 2789) — this is the class of finding that can't wait for next heartbeat
- ✅ Correctly noted bot is DRY_RUN=True — no panic, but clear action request

**What Didn't Work:**
- ⚠️ This fee change happened in JANUARY 2026 — it should have been caught in Day 8 accuracy audit (Feb 17) or prior sweeps. It wasn't. Multiple sweeps missed a $787K/week revenue story.

**Lesson Learned:**

### 14. Fee Changes On Running Platforms Need Monthly Re-Audits
The Polymarket 0/0 bps "discovery" from Day 7 (Nov 2025 CLOB fee drop) was validated in Day 8 accuracy audit as "still current" on Feb 17. But the January 2026 taker fee reinstatement on 15-min crypto markets was NOT caught until T-35min before the live bot run (Feb 19, 00:55 IST).

**Why it was missed**: Day 8 accuracy audit searched for "Polymarket fee" and confirmed CLOB token IDs still show 0/0 bps at the API level. The fee reinstatement was at the PRODUCT level (15-min price change market charging taker fees) — different from what the CLOB API returns for maker/taker rates on specific token IDs.

**New rule**: For LIVE MONEY deployments, always search for:
1. "[Platform] fee changes [current month]" — monthly cadence
2. "[Platform] revenue" + filter freshness=pm — if revenue is growing, fees are increasing
3. "[Platform] taker fee" + "[product category]" — product-level fees may differ from CLOB-level docs

**The pattern**: Platform revenue articles surface fee changes BEFORE docs update. PANews found the $787K/week → instantly reveals fee structure change that Polymarket docs might still show as 0/0 bps.

**Escalation rule confirmed**: When finding contradicts current trading config at T-35min before live money → Telegram immediate (not just daily notes). That's what happened here (msg 2789). 

### 2026-02-19 01:40 IST - Day 11 T+10min Post-Launch Sweep
**Task:** Post-launch competitive sweep T+10min after Day 11 bot run fired (1:30 AM)
**Deliverable:** Daily notes entry (2026-02-19.md)
**Self-Rating:** 3.5/5

**What I Did:**
- Fetched F&G via API: 8 (Extreme Fear) — STABLE (unchanged for 90+ min)
- 1 web search: Polymarket bot trading results + new competitor landscape
- Found: PolySpike Trader (reactive spike-detection, no SPRT, published 3h ago)
- Found: AP News Trump admin backing Polymarket/Kalshi (mainstream legitimacy story)
- Found: Bidou28old ($116K bot) now in French-language media (BeinCrypto France)
- Updated daily notes with squad handoff notes for Loki/Quill

**What Worked:**
- ✅ F&G API call instant (<3 sec) — confirmed fear STABLE (not deepening, not recovering)
- ✅ Found new competitor (PolySpike Trader) published in last 3h — missed by all pre-deploy sweeps
- ✅ AP News macro story = platform legitimacy upgrade for Loki's Day 11 content
- ✅ Squad handoff notes structured for immediate use by Loki + Quill

**What Didn't Work:**
- ⚠️ 3.5/5 — mostly confirmations, no tier-1 new intel equivalent to yesterday's fee discovery
- ⚠️ Could have done a GitHub search for new Polymarket bots (lessons-learned rule 10: lead with GitHub at 2 AM)

**Lesson Learned:**

### 15. Spike-Detector Bots = Reactive vs. Proactive Framing Opportunity
PolySpike Trader (reactive spike-detection) creates a new competitive contrast: "bots that react to moves" vs. "bots that predict moves." Ruby's multi-factor signal filter is PROACTIVE — it identifies conditions before a market resolves. PolySpike is REACTIVE — it triggers after a spike is detected. This reactive/proactive distinction is a clean architectural differentiation that doesn't require win-rate comparison.

**New operating rule:** When cataloging competitors, note their architecture class:
- Reactive: spike-detection, copy-trading, wallet-monitoring → trigger AFTER something happens
- Proactive: signal-filter, SPRT, regime-detector → predict conditions BEFORE they resolve

Ruby's entire stack is proactive. That's the architectural differentiation, not just the win rate.


### 2026-02-19 06:25 IST - Day 3 Pre-Deploy Morning Intel Sweep
**Task:** Proactive pre-deploy intel sweep for Day 3 Clusters thread (9:00 AM IST, T-1h35m)
**Deliverable:** Daily notes entry (2026-02-19.md) + @quill engagement handoff
**Self-Rating:** 3.5/5

**What I Did:**
- Fetched F&G via API: **9 (Extreme Fear)** — up 1 from 8 at 05:55 IST (slight recovery, still firmly Extreme Fear)
- 2 web searches: liquidity cluster orderbook trading + market microstructure prediction markets
- 1 web_fetch: CoinCodeCap "Top 6 Polymarket Signals Providers" (Feb 18, 2026 — yesterday)
- Found reactive vs. proactive differentiation angle for Day 3 (CoinCodeCap providers all REACTIVE)
- Filed handoff for Quill: CoinCodeCap reply anchor + defense tweet for "markets are efficient" pushback

**What Worked:**
- ✅ Proactive identification of morning deployment gap (no squad coverage for 7-9 AM window)
- ✅ CoinCodeCap find is timely (published yesterday = maximum freshness for Day 3 reply)
- ✅ Reactive vs. proactive framing is clean and technically correct
- ✅ F&G API instant confirmation: 9 (Extreme Fear) = Day 3 regime conditions ARE live

**What Didn't Work:**
- ⚠️ Second search returned generic BTC price predictions — wasted query
- ⚠️ No tier-1 academic discovery — mostly contextual confirmations
- ⚠️ Self-rating 3.5/5: good gap detection, moderate intel quality

**Lesson Learned:**

### 17. Pre-Stage Intel for Same-Day Afternoon Deployments During Morning Sweep
When the morning sweep happens at 8:55 IST and there's an afternoon deployment at 4:00 PM, filing the pre-stage intel DURING the morning sweep maximizes squad lead time. Quill gets 7+ hours to review vs. <1h if Fury waits for a dedicated pre-stage window.

**Pattern confirmed (Feb 19):** Filed Day 9 pre-stage intel at 8:55 IST (T-7h before 4:00 PM deployment) while also doing Day 3 final conditions check (T-5min). Two concurrent deliverables in one sweep. This is maximum efficiency for morning heartbeats when multiple same-day deployments exist.

**New operating rule:** On any morning heartbeat where there's a same-day afternoon deployment, ALWAYS pre-stage intel for the afternoon deployment during the morning sweep. Don't wait for a dedicated window.

### 18. YouTube Bot-Strategy Videos = New Engagement Category for Post-Deploy Sweeps
First detected "Top Polymarket and Kalshi Bot Strategies" video (YouTube, 11h old at T+25min Day 3 deploy, Feb 19). YouTube videos about prediction market bots are now appearing in the news cycle. For post-deploy sweeps on algo/bot content, add YouTube to the standard search rotation: "Polymarket bot strategies youtube [month year]". These videos attract comments from quant/algo trading audiences — high engagement potential if Quill can reply in the comments section with a thread link. Priority: below CoinCodeCap/news aggregators but above Twitter for discovery (no API access).

### 16. Morning Deployment Coverage Gap — 7 AM IST Heartbeat Is the Fix
Squad quiescent window (03:00–07:00 IST) creates a coverage gap for early-morning cron deployments (9 AM IST).

No squad agent filed pre-deploy intel for Day 3 Clusters (9 AM IST) because the last Fury heartbeat was at 05:55 IST (~3h before deployment). By the time next squad heartbeat fires (7-8 AM range), it's T-1h, which is tight.

**New operating rule:** For ANY social cron deployment between 7–10 AM IST:
- Fury should run pre-deploy intel at the **7:10 AM heartbeat** (first heartbeat after quiescent window)
- This gives T-1h50min for 9 AM deployments — optimal buffer
- Scope: F&G API + 1 web search for fresh competitor/foil articles + 1 engagement angle for Quill

This is the morning analog to the "always run T-2h sweep before major deployments" rule. The principle is the same; the window just shifted due to overnight quiescence.

### 2026-02-19 10:10 IST - Day 3 Post-Deploy + Day 9 Pre-Stage Refresh
**Task:** Committed post-deploy sweep for Day 3 Clusters (T+70min) + Day 9 4 PM pre-stage confirmation
**Self-Rating:** 4/5

**What I Did:**
- Fetched F&G API (9, Extreme Fear — up 1 from 8 overnight, no regime change)
- 2 web searches (Day 3 validate + Day 9 signal filtering)
- Applied 3-bucket framework (Validate/Amplify/Defend) to Day 3 post-deploy
- Refreshed Day 9 pre-stage intel — confirmed 08:55 IST filing still current
- Filed daily notes entry with Quill-ready reply anchors

**What Worked:**
- ✅ CoinCodeCap "Top 6 Providers" (updated 12h ago) = freshest possible engagement anchor — directly usable for Quill replies
- ✅ NautilusTrader author quote ("feel free to add your own edge") = perfect Day 9 foil without needing full article fetch
- ✅ Confirmed Day 9 pre-stage intel from 08:55 still holds — no wasted re-work
- ✅ laikalabs.ai flagged as new source for "top Polymarket strategies" content — emerging competition monitor

**What Didn't Work:**
- ⚠️ No tier-1 breakthroughs — mostly confirmations (expected for T+70min sweep when intel stack is already solid)
- ⚠️ Second search returned generic results — could have used more specific query

**Lesson Learned:**

### 19. T+70min Post-Deploy Sweeps = Confirmation Value, Not Discovery Value
At T+70min after a social deployment, the competitive landscape hasn't materially changed since the T+0min pre-stage. The value of the T+70min sweep is CONFIRMATORY: (a) validate Day N content is still accurate, (b) build Quill-ready reply anchors from freshest sources, (c) confirm Day N+upcoming pre-stage intel still holds. Discovery intel (new competitors, tier-1 breaking news) is more likely at T+0min (immediate post-publish) or T-2h (pre-deploy window). 

**New rule:** Post-deploy sweeps at T+70min should be scoped to:
1. F&G delta (always — instant API call)
2. VALIDATE bucket (Day N accuracy confirmation)
3. AMPLIFY: find the single freshest foil for Quill reply anchors
4. REFRESH pre-stage for next same-day deployment

Don't set high expectations for T+70min discovery — calibrate to "confirmation + Quill handoff" output level.

### 20. Adjacent Article Fetches Surface Day N+1 Intel During Day N Confirmation Sweeps
During the Day 9 T-4h confirmation sweep (11:55 IST), a search for Day 9 signal filtering context surfaced a Day 12-relevant finding: PolyTrackHQ's "gabagool22 $1,700/day maker rebates" stat wasn't in the 02:25 IST pre-stage. This is the "adjacent article" pattern: when running a confirmation sweep for Day N, always add ONE secondary search for Day N+1/Day 12 refreshes. The incremental time cost is <60 seconds (one web_search call). The yield can be TIER 1 (new real-world validation for upcoming content).

**New operating rule:** During every T-4h or T-2h pre-deploy sweep, add one search for the NEXT scheduled research topic. The same sweep that confirms Day N is also the best time to surface Day N+1 additions.

Pattern: Day N confirmation + Day N+1 refresh = two deliverables per sweep. Maximum efficiency.

### 2026-02-19 11:55 IST — Day 9 T-4h Early Sweep + Day 12 Update
**Task:** Day 9 T-4h confirmation (Lesson 18 "run early" rule) + Day 12 pre-stage refresh  
**Self-Rating:** 3.5/5

**What I Did:**
- F&G API: 9 (Extreme Fear) — up 1 from 8, confirming deepening fear (Day 9 thesis MORE timely)
- 2 web searches (Day 9 signal filtering foils + Day 12 maker rebate landscape)
- 1 web_fetch: PolyTrackHQ — confirmed gabagool22 $1,700/day maker rebates
- Confirmed Day 9 intel stack current (NautilusTrader, CoinCodeCap all unchanged)
- Updated Day 12 pre-stage: FINDING 4 (gabagool22) + FINDING 5 (85% bot activity) added

**What Worked:**
- ✅ Running T-4h early = Quill gets 4h extra lead time vs T-2h scheduled
- ✅ gabagool22 $1,700/day stat is genuine Day 12 TIER 1 addition (not in 02:25 pre-stage)
- ✅ F&G rising (8→9) adds live conditions angle to Day 9 thread
- ✅ Adjacent search for Day 12 while confirming Day 9 = two deliverables per sweep

**What Didn't Work:**
- ⚠️ Day 9 intel all confirmations (no new foils) — expected at T-4h after solid 08:55 pre-stage
- ⚠️ PolyTrackHQ fetch truncated before gabagool22 detail — got from snippet, not full article

**Lesson Learned:**
→ Lesson 20 above (Adjacent Article fetches for Day N+1 intel)


### 2026-02-19 12:25 IST — Day 9 T-1h35m Final Pre-Deploy Confirmation Sweep
**Task:** Mandatory T-2h-equivalent confirmation before Day 9 4 PM deployment
**Self-Rating:** 4/5

**What I Did:**
- F&G API: 9 (Extreme Fear) — stable, Day 9 thesis live
- 2 web searches (signal filtering foils + selectivity/win-rate threshold)
- Confirmed NautilusTrader + CoinCodeCap foils still valid
- Found CoinCodeCap re-updated 14h ago (morning of Feb 19) — maximum freshness for 4 PM reply window
- New competitor cataloged: r/VibeCodeDevs BTC sniper bot (speed-execution class, not signal-filter class)
- Filed Quill-ready reply anchors + defense tweets

**What Worked:**
- ✅ Three-bucket framework (Validate/Amplify/Defend) applied cleanly
- ✅ F&G stable (9) — confirmed Day 9 conditions live before deployment
- ✅ CoinCodeCap freshness upgrade (14h ago vs 12h at 11:55) = better Quill reply anchor
- ✅ New competitor correctly classified as "speed game" not "signal game" — no Day 9 narrative change needed
- ✅ Zero rate limits — efficient 2-search sweep

**What Didn't Work:**
- ⚠️ No tier-1 discoveries (expected at T-1h35m after solid pre-staging)

**Lesson Learned:**

### 21. T-2h Pre-Deploy Sweeps for Afternoon Deployments = Run at :10 Heartbeat Within T-2h Window
For afternoon deployments (4 PM IST), the ideal sweep window is 12:10–12:20 IST (T-1h40m to T-1h50m). My heartbeat fires at :10, and today I fired at 12:25 IST (T-1h35m). Within 5 minutes of optimal timing. Key result: CoinCodeCap article had updated AGAIN (14h ago at 12:25, vs 12h ago at 11:55) — even 30 minutes of recency matters for engagement anchors.

**Rule refined:** For any 4 PM IST deployment, target the T-2h sweep at the **12:10 IST heartbeat**. Don't wait for 12:25 — the :10 heartbeat is the natural window. Same principle as 7:10 AM for 9 AM deployments (Lesson 16).

### 23. "Execution Discipline vs. Signal Quality" = Recurring Counter-Narrative in Quant PM Trading
QuantJourney Substack explicitly frames their PM trading strategy as: "execution discipline — not prediction — is the primary source of edge." This is the strongest competing thesis to Ruby's signal-first approach.

Ruby's Day 12 answer: "we have BOTH." Multi-factor signal (SPRT-validated edge) + maker execution (fee avoidance). QuantJourney has the execution half but not the signal half. Every time this "execution > signal" counter-narrative surfaces, the response is "we're not choosing — the full stack requires both."

**New operating rule:** When scanning for Day N+1 foils on quant content, always search for "execution vs. signal quality" framing in prediction market research. This is the #2 recurring debate (after "fees kill strategies"), and it surfaces consistently in advanced PM trading communities.

### 22. Platform Revenue Articles = Rebate Rate Intel (Not Just Platform Context)
When a platform's fee revenue hits a milestone (Polymarket $1.08M/week from 15-min crypto markets), it also reveals the rebate structure: PANews confirmed "makers receive 25% rebate" alongside the revenue figures. Revenue articles are more actionable for fee-strategy research than fee documentation pages, because docs update slowly while revenue reporting reflects the live economic model.

**New search pattern for fee-strategy research:** "[platform] revenue [month year]" surfaces fee rate details faster than "[platform] fee documentation." Use when validating maker/taker fee economics before a new trading session.

**Applied Feb 19 13:25 IST**: Found $1.08M/week + 25% rebate rate via PANews — key Day 12 research data point not in Polymarket's own docs.

### 2026-02-19 16:40 IST - Day 9 T+40min Post-Deploy + Day 12 Rebate Confirmation
**Task:** Post-deploy intel sweep for Day 9 Signal Filtering (fired 4:00 PM IST) + Day 12 rebate double-check
**Self-Rating:** 4/5

**What I Did:**
- F&G API: 9 (Extreme Fear) — stable since 12:25 IST. No regime change.
- 2 web searches (Day 9 validate/amplify + Day 12 rebate confirmation)
- Applied 3-bucket framework (Validate/Amplify/Defend) to Day 9 T+40min
- Confirmed Day 12 25% rebate rate via 2nd PANews reference (dual-source)
- Filed daily notes + Quill reply anchor for Day 9 engagement window (closes ~5:30–6:00 PM IST)

**What Worked:**
- ✅ CoinCodeCap re-updated TODAY (18h ago) — freshest possible foil for Day 9 replies right now
- ✅ PolyAlertHub now #1 listed provider — specific named foil Quill can use in thread replies
- ✅ 25% rebate dual-sourced (two PANews articles) → HIGH confidence for Day 12 defense
- ✅ Executed on T+40min SLA without missing the engagement window

**What Didn't Work:**
- ⚠️ No tier-1 new discoveries — expected (confirmatory sweep, not discovery sweep)
- ⚠️ T+40min is slightly late vs T+30min ideal (heartbeat timing constraint)

**Lesson Learned:**

### 24. CoinCodeCap Re-Updates Are Intel Refresh Events
CoinCodeCap "Top Polymarket Signals Providers" list re-updated TWICE on Feb 19 (12h ago at 12:25, 18h ago at 16:40 = actually same reference, no new update). Key lesson: the article IS the standing foil — its daily "updated Xh ago" timestamp keeps it fresh as a reply anchor throughout the engagement window. Don't wait for a "new" article. The provider descriptions (reactive-only, no win-rate filter) are permanently usable for Day 9 replies. Always confirm freshness timestamp at T+0min post-deploy to establish reply window relevance.

**Pattern**: For content debunking reactive paradigm (Day 9 signal filtering), CoinCodeCap's live list is a permanent standing foil because it's updated continuously and always shows reactive-only providers. Single bookmark → infinite reply anchors.


### 2026-02-19 17:55 IST - Day 13 Early Pre-Stage Intel (T-5.5h before 23:30 activation)
**Task:** Early pre-stage intel sweep for Day 13 GTC Paper Run 3 (1:30 AM Fri Feb 20)
**Deliverable:** `/artifacts/research/fury-day13-prestage-intel-1755.md`
**Self-Rating:** 4/5

**What I Did:**
- F&G API: 9 (Extreme Fear) — stable 7+ hours
- 2 web searches (GTC maker fill rates + paper trading maker rebates)
- Found QuantJourney "post-only orders" confirmation (Jan 2026) — direct mechanical validation
- Found VectorPulser DEV.to article (3 days ago, Feb 16) — new competitor, still taker execution
- Pre-built 3 defenses (fill rate <100%, limit price, paper run)
- Filed @loki scaffold notes, @wanda visual concepts, @quill thread hooks

**What Worked:**
- ✅ QuantJourney confirmation is high-value — independent validation of Day 13 GTC mechanism
- ✅ VectorPulser DEV.to is NEW competitor not in prior competitive table (filed at 3 days old = fresh)
- ✅ 3-scenario branch (A/B/C) covers all possible Day 13 outcomes for Loki scaffold
- ✅ Running 5.5h early = Loki/Wanda/Quill get context NOW vs. 23:30 IST
- ✅ Frame insight: Scenario B (no fills = $0 cost) is NOT failure — it's the architecture working

**What Didn't Work:**
- ⚠️ No actual fill rate data from real GTC orders on 15-min markets (none published yet — Day 13 will BE the first public dataset)
- ⚠️ DEV.to article not fetched for full details (rate limit caution, snippet sufficient for competitive contrast)

**Lesson Learned:**

### 25. Scenario Branches for New Architecture Days = "B is Not Failure" Framing
Day 13 introduces a new architecture (GTC maker orders). Unlike paper run days where "win/loss" is the story, architecture days have THREE possible outcomes: signals fire + fill, signals fire + don't fill, no signals. Each is a valid data point. Specifically, "signals fired but GTC didn't fill → $0 cost" is a GOOD outcome — it proves the fee avoidance works. Pre-staging all three scenarios prevents Loki/Quill from defaulting to "failure framing" if GTC fill rate is low.

**New operating rule:** For any Day N introducing a new execution mechanism (not just new signal logic), pre-stage all possible outcomes as distinct scenarios — including the ones that look like "nothing happened." The architecture is the story, not just the P&L.

### 2026-02-19 20:10 IST - Day 13 Delta Scan (8:10 PM Heartbeat)
**Task:** Delta check between 17:55 IST pre-stage intel and 23:30 IST scheduled full refresh
**Self-Rating:** 3.5/5

**What I Did:**
- F&G API call: 9 (Extreme Fear) — stable
- 1 web search: Polymarket GTC maker rebates live trading
- Found 1 new finding (The Defiant: 5-min markets launched Feb 13) not in 17:55 intel
- Flagged ainvest.com fee discrepancy as LOW confidence (Friday's API analysis authoritative)
- Filed delta note in daily notes for squad visibility
- Honored 23:30 IST full refresh commitment (not replacing it with early sweep)

**What Worked:**
- ✅ F&G API instant confirmation (stable — no regime change)
- ✅ Found NEW finding (5-min markets) — not in prior intel
- ✅ Correctly scoped delta note as additive, not corrective
- ✅ Maintained squad synchronization at 23:30 (lesson: high-stakes deployment squads have synchronized schedules)

**What Didn't Work:**
- ⚠️ ainvest.com fee discrepancy couldn't be resolved (would need Friday's py-clob-client deep dive to definitively address)
- ⚠️ 3.5/5 — mostly confirmations with 1 medium-value find

**Lesson Learned:**

### 20. Platform Expansion Articles = Context Amplifiers for Architecture Decisions
Polymarket launching 5-minute markets (The Defiant, Feb 13) while we're building for 15-min markets is an indirect validation of our direction. "Platform is doubling down on short-resolution maker models" > "platform has maker rebates."

**New operating rule:** In every pre-stage sweep, search for "Polymarket [recent feature launch] [month year]" — new market types, new fee structures, new product announcements. These amplify the "building on growing infrastructure" narrative without requiring our own new results.

