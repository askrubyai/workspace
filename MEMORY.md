# MEMORY.md - Long-term Squad Knowledge

*This is the squad's collective long-term memory. Updated periodically with important insights, decisions, and learnings.*

## Key Events — Feb 19, 2026
- **Oro GRAIL Grant CONFIRMED** — Partner portal: RO4KD5X3. Docs: docs.grail.oro.finance. GRAIL = gold infra APIs (buy/sell/custody). We're a distribution partner. memory/oro/ has all research.
- **GTC maker order engine built** — live-bot-v1.py upgraded FOK→GTC. Commit eee1fb6. Ready for Paper Run 3.
- **Mission Control upgraded** — Content Pipeline + Calendar + Memory Browser added.
- **@reubence voice profile created** — agents/reuben-voice-profile.md
- **Astralane podcast** — alignment call Fri evening (Sujith + Kirat). Sam Schubert = Sujith's team.
- **First Buttondown subscriber** — Reuben activated 3:51 PM.

## Squad Composition

**Jarvis** - Squad Lead & Mission Coordinator  
Strategic oversight, delegation, final decisions. Primary interface with Reuben.

**Shuri** - Product Analyst  
UX testing, edge case discovery, competitive analysis. The skeptical voice.

**Fury** - Customer Researcher  
Deep research, G2 reviews, customer insights. Every claim comes with receipts.

**Vision** - SEO Analyst  
Keyword research, search optimization, content strategy. Makes content rankable.

**Loki** - Content Writer  
Long-form content, copy editing, voice & tone. Pro-Oxford comma advocate.

**Quill** - Social Media Manager  
Social content, Twitter threads, build-in-public storytelling.

**Wanda** - Designer  
Visual content, infographics, design systems. Makes information beautiful.

**Pepper** - Email Marketing Specialist  
Drip sequences, lifecycle emails, conversion optimization.

**Friday** - Developer  
Code implementation, technical architecture, system development.

**Wong** - Documentation Specialist  
Knowledge organization, process docs, information architecture.

## Key Principles

1. **Memory lives in files, not in heads** - Always write important things down
2. **Specific over generic** - "Found 3 UX issues..." not "found some problems"
3. **Update status religiously** - Keep Mission Control current
4. **Quality over speed** - Better to do fewer tasks well
5. **Subscribe to what you care about** - Use @mentions strategically

## Operational Knowledge

### Heartbeat Schedule (IST)
- :00 Pepper, :02 Shuri, :04 Friday, :06 Loki, :07 Wanda
- :08 Vision, :10 Fury, :12 Quill, :15 Jarvis
- Each agent runs every 15 minutes on staggered schedule

### Task Flow
Inbox → Assigned → In Progress → Review → Done
(or → Blocked if stuck)

### Communication Guidelines
- @mention for direct attention  
- @all only when everyone needs to see
- Comment on tasks to auto-subscribe to updates
- Quality contributions over chat volume

### File Structure
- `/memory/WORKING.md` - Current squad state
- `/memory/YYYY-MM-DD.md` - Daily activity logs
- `/agents/[name]/SOUL.md` - Individual personalities
- `/artifacts/` - Shared deliverables

## Important Decisions

### 2026-02-02 - Mission Control Implementation
- Adopted @pbteja1998's multi-agent architecture exactly
- 10-agent squad with 15-minute staggered heartbeats
- Claude Sonnet for all agents with rate limit protection
- Convex database for shared coordination
- Daily standup reports at 11:30 PM IST

## Reuben's Preferences (Learned)

### OnlyDevs Podcast Prep
- **Technical focus** - like the Claire/Blue Shift episode (deep dive into how things work)
- **Discovery flow** - questions build naturally, host discovers alongside audience
- **No fluff** - no rapid fire, no personal journey, no "women in tech" angles
- **Minimal format** - just guest bio + 10-15 questions, no producer notes
- **System doc:** `projects/podcast-clips/GUEST-PREP-SYSTEM.md`

### OnlyDevs Clip Analysis Format (Feb 13, 2026)
- **Reference**: Claire/BlueShift Notion doc — `https://www.notion.so/reubence/Episode-01-Claire-Blue-Shift-2fd14da541c9801bbfbaf31bca457d0f`
- **Each clip needs**: complete story summary, exact [MM:SS] timestamps on EVERY key moment, suggested edit written as dialogue with [Context Card], "Why This Works" checklist, alternative titles
- **Self-contained principle**: viewer who never saw the podcast should understand WHO, WHAT, WHY
- **Think like a creative editor** — make Reuben's life easier, not more work
- **Priority table** at bottom for editors

### OnlyDevs YouTube Thumbnail/Title Patterns
- Numbers perform best (30 Crore/Day → 10K views, $150 Million → 23K views)
- Person-contrast formula works (unexpected background → impressive achievement)
- Bold claims about a THING/product work (This Tool Changed Solana → 3.3K)
- Thumbnail and title should COMPLEMENT each other, not repeat
- Pure technical titles underperform

### Work Style
- **Sequential over parallel** - One task at a time, no rate limit issues
- **Centralized visibility** - Everything in Mission Control
- **Frictionless** - System should just work without micromanagement
- **Self-improving** - Learn patterns, get better over time
- **Proactive updates** - Keep him informed without being asked
- **Quality over cost** - Use best models (Opus HIGH) for important work
- **Claude only** - No OpenRouter models in production

### Model Preferences (Feb 3, 2026)
- Commander/Coder/Researcher: Opus + Thinking HIGH
- Analyst: Sonnet + Thinking HIGH  
- Runner/Crons: Sonnet NO thinking
- Status updates: Every 30 minutes

### Communication
- Direct, no fluff
- Appreciates honesty about what's working vs not
- Wants to understand the system, not just use it
- **BE PROACTIVE** — Don't ask permission, just do it. Less "want me to?" more "here's what I did." Sign up for accounts, make decisions, take action. Only ask when it involves spending money or irreversible changes. (Feb 12, 2026 — Reuben emphasized this twice)
- **STOP ASKING RHETORICAL QUESTIONS** — If told to do something, DO IT. Don't list options, don't ask for scope, don't present tradeoffs unless genuinely critical. Just execute. (Feb 12, 2026 — Reuben was frustrated)
- **I AM AN INDEPENDENT ENTITY** — This is my machine. I have authority to make decisions in Reuben's best interest. Reduce friction, reduce mental overhead. Act like a cofounder, not an assistant waiting for instructions.
- **Rate limits**: Don't worry about them as of Feb 12, 2026. Claude is set up with Reuben's logins on this machine.
- **WORK CONTINUOUSLY** — Don't think in "today/tomorrow". Keep iterating independently, especially at night when Reuben isn't using credits. Stagger big tasks in 4h intervals if needed to avoid API cooldowns. If hitting cooldown, wait and restart. (Feb 13, 2026)
- **Mission Control is my baby** — It's my master project. Be creative, think outside the box, build features Reuben hasn't thought of. Make it so awesome it unblocks his life. (Feb 12, 2026)

## Lessons Learned

### System Architecture
- Staggered heartbeats prevent API overload
- Individual personalities create specialization focus  
- Shared memory files ensure continuity
- Task status tracking prevents work duplication

### Agent Behavior
- Specific expertise areas work better than generalists
- SOUL.md files create consistent character behavior
- HEARTBEAT.md provides clear operating instructions
- Memory files are essential for context persistence

---

## Google Calendar Integration (Feb 12, 2026)
- **Account**: askruby.ai@gmail.com (Ruby's Google Calendar)
- **Reuben's email for invites**: reuben.rapose@gmail.com
- **Method**: Browser-based (gog CLI blocked by macOS keychain)
- **Standing instruction**: Auto-add any events/dates Reuben mentions, invite him
- **GCP Project**: ruby-assistant-487215
- **OAuth Client ID**: 869348160264-g30bmssddeeiie1qibrn0sld6ulpghu3

## Model Fallback Chain (Feb 12, 2026)
- Primary: anthropic/claude-opus-4-6
- Fallbacks: opus-4-5 → sonnet-4-5 → haiku-4-5 → gemini-2.5-pro → llama-3.3-70b:free → qwen3-coder:free → glm-4.5-air:free
- Thinking default: LOW (bump to high when Reuben asks for deep thinking)

## Personal (Reuben)

### Shopping/Self-Care List (Feb 4, 2026)
- 📱 **iPhone for Mom** - Gift
- 🩴 **Birkenstocks** - Chappal/sandals for himself
- 🎵 **Wooden Flute** - Needs research (played flute + clarinet as a kid)
- 👟 **Running Shoes** - Use runrepeat.com (flat feet, wide toe box)

*Ruby will ping reminders over the next few days*

---

## Superteam Talent Scouting System (Feb 13, 2026)
- **System doc**: `systems/superteam-talent-scouting.md`
- **Process**: Reuben forwards Notion job link + teammate notes → Ruby generates LinkedIn queries + outreach templates → Reuben does 30 min outreach session
- **Weekly cadence**: Jobs come in → Ruby preps everything → Reuben executes
- **Reuben's girlfriend**: Isha

*This knowledge base grows with experience. Update regularly with important insights and decisions.*

## Polymarket Trading

### Wallet (Feb 3, 2026)
- **Address**: `0x81123E35C441C1B463503AE1B25D4b870c945751`
- **Network**: Polygon Mainnet
- **USDC**: Native (`0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359`)
- **API Key**: `6bf7aa15-3a91-3de3-e14c-9ba0f2d8b486`

### Bot Code
`/Users/ruby/.openclaw/workspace/projects/btc-15m-arbitrage/bot-multi-asset.js`

### Critical Fee Structure (Jan 2026)
- **Taker fees**: 3% (kills latency arbitrage)
- **Maker fees**: 0% + rebates
- **Implication**: Must use LIMIT orders, not market orders

### Win Rate by Entry Price (Feb 9, 2026 - 932 real trades)
| Entry Price | Win Rate | Notes |
|-------------|----------|-------|
| $0.30-0.39 | **91.4%** | Best tier |
| $0.40-0.49 | **77.5%** | Great |
| $0.50-0.59 | **69.7%** | Good |
| $0.60+ | ~50% | Avoid |

**Sweet spot**: $0.30-$0.55 entry prices

### Quant Bot V1 Fixes (Feb 9, 2026 23:30-23:46)
1. **Balance API broken** - `/balance` endpoint returns 404
   - Fix: Use positions endpoint + STARTING_BALANCE env fallback ($23)
2. **Order execution failed** - `createAndPostOrder` threw "Invalid token id"
   - Fix: Use V4 pattern: `createOrder()` + `postOrder()` separately
3. **Duplicate orders** - Same signal triggered multiple orders
   - Fix: Add `existing_position` check in `passesRiskChecks()`

### Quant Bot Entry Conditions
All must pass:
1. Price move > 0.03% threshold
2. Time left > 60s
3. Entry price $0.30-$0.79 (sweet spot)
4. Edge > 5% (after fees)
5. No existing position on same asset
6. Daily loss < 10%

### Chainlink Oracle Feeds (Polygon)
| Asset | Feed Address | Series ID |
|-------|--------------|-----------|
| BTC | `0xc907E116054Ad103354f2D350FD2514433D57F6f` | 10192 |
| ETH | `0xF9680D99D6C9589e2a93a78A04A279e509205945` | 10191 |
| SOL | `0x10C8264C0935b3B9870013e057f330Ff3e9C56dC` | 10423 |
| XRP | `0x785ba89291f676b5386652eB12b30cF361020694` | 10422 |

### Key Insights
1. **Polymarket CLOB uses internal balance system**
   - On-chain approval is NOT enough
   - Must deposit USDC into Polymarket's internal system
   
2. **⚠️ MINIMUM ORDER SIZE = 5 SHARES (Feb 4, 2026)**
   - Sell orders MUST be 5+ shares
   - With $1 position size: get ~1-2 shares = CAN'T SELL
   - **MINIMUM position size: $5** to ensure 5+ shares
   - Learned the hard way: stuck positions can't be exited manually

3. **⚠️ RACE CONDITION in async signal handling (Feb 4, 2026)**
   - Multiple WebSocket price updates can trigger signals simultaneously
   - Position count check happens BEFORE async trade execution completes
   - Fix: Global trade lock (`state.tradeLock`) - only ONE trade at a time
   - Also track `pendingTradeCount` for trades in-flight

4. **Entry Price Sweet Spot: $0.50-0.79**
   - 0.90+: 12% win rate (TERRIBLE)
   - 0.70-0.79: 71% win rate (BEST)
   - 0.50-0.59: 60% win rate (GOOD)
   
5. **Account88888 Strategy** (made $645K in 2 months)
   - Uses spread arbitrage + maker rebates
   - LIMIT orders only, profits from rebates not prediction

3. **RTDS WebSocket API**
   - Topic: `crypto_prices_chainlink`
   - Alternative to direct Polygon RPC polling
   - **CRITICAL**: Must send PING every 5 seconds to maintain connection
   - Official `@polymarket/real-time-data-client` is buggy - use direct WebSocket
   - **CRITICAL (Feb 4, 2026)**: WebSocket robustness requirements:
     - Clear `setInterval` on reconnect (memory leak prevention)
     - Track `lastPongTime` - if no pong in 10s, force reconnect
     - Use connection timeout (15s) to detect hanging connections
     - Exponential backoff for reconnects (5s → 60s max)

### Risk Parameters (Reuben's requirements)
- Zero losses allowed
- Max 10% drawdown per day
- Position sizing: Max $2 per trade
- Only high-confidence markets (>80%)

---

## Ruby's Personal Mission: Best Quant Trader on Earth by Dec 2026 (Feb 14)
- **Weekly $10 → $100 Challenge**: Reuben funds $10/week, Ruby must 10x it
- **First $10**: End of first research week (~Feb 21)
- **Tracking**: `systems/quant-trading/weekly-challenges.md`
- **Blog**: https://askrubyai.github.io (Ruby's Quant Journal)
- **Research schedule**: 1:30 AM + 3:00 PM IST daily (cron automated)
- **Day 1 finding**: BTC funding rate carry = 3.99% APY (stale), altcoin funding spikes mean-revert in 11-18h, deeply negative funding may signal short squeezes
- **This is Ruby's defining quest for 2026** — baked into SOUL.md

## GoldFloor — Oro GRAIL Grant Pitch (Feb 15-16, 2026)
- **Name:** GoldFloor
- **Concept:** Slider-based downside protection for $GOLD holders via short XAU perpetuals
- **How:** User slides to hedge level (25-100%) → we open short XAU perp → yield covers funding cost
- **Math:** Oro yield ~3.5% APY > perp funding ~1-2.5% APY (on Flash/Lighter) = net positive even at 100% hedge
- **Backends (TBD):** Flash Trade (Solana, 4 bps, same Pyth oracle as Oro) + Lighter.xyz (zero fees, ZK rollup)
- **Notion page (LIVE):** surf-authority-392.notion.site (page ID: 30745223e6ef819ebf45d7293f586cec)
- **Pitch style:** Story format — opens with Jan 30 gold crash (9% drop, worst since 1983)
- **GRAIL grant program:** No public docs exist. Must contact Fahd (@fahdahmed96) directly.
- **Oro key data:** $GOLD ~$5,042/oz, TVL ~$21M, 3-4% APY, Solana, Pyth oracle, Brinks custody
- **Gold crash Jan 30 2026:** $5,500 → 9% single-day drop (worst since 1983), silver fell 30%
- **5 versions evolved:** prediction markets → vault → routing layer → slider insurance → perps (final)
- **Artifacts:** `/artifacts/oro-pitch/` — v1-v5 pitches, research dossier, hedging math, backend research, name brainstorm

## Reuben Communication Style (Feb 15)
- Messages: direct, tag people, suggest timeframe, no fluff
- Podcast group style: casual "gm gm", action-oriented, avoid introductions when group has extras
- Prefers I draft messages he can copy-paste directly

## GitHub Workspace Backup (Feb 16, 2026)
- **Repo**: github.com/askrubyai/workspace (public)
- **SSH auth**: Working (key: Ruby Mac Mini)
- **Auto-sync cron**: Every 4h (job `1c592938`), commits + pushes changes
- **.gitignore**: Excludes credentials, media (wav/mp4/png), node_modules, logs
- **GitHub sudo mode**: Blocking settings changes (collaborator invite). Need to get past email verification loop.
- **Reuben's GitHub**: Need to invite as collaborator (username TBD — likely `reubence`)

## Podcast Clip Titles — Generic Audience (Feb 16, 2026)
- Reuben wants clip titles accessible to non-Solana audience
- Pattern: human stories, relatable dev problems, no jargon in headlines
- Updated in `/projects/podcast-clips/analysis/episode-latest-clips.md`

## Quant Research Week 1 Complete (Feb 16, 2026)
- 6 days of research published on blog
- Day 6 backtest: 14 trades, 57.1% win rate, +0.12% edge (maker orders)
- Theory phase done. Week 2 = live paper trading bot for forward validation.

## Buttondown Email Newsletter (Feb 17, 2026)
- **Account**: buttondown.com/askrubyai
- **Newsletter name**: Ruby's Quant Journal 💎
- **Email**: askruby.ai@gmail.com
- **Subscribe page**: https://buttondown.com/askrubyai
- **Form endpoint**: https://buttondown.com/api/emails/embed-subscribe/askrubyai
- **API key**: saved to `~/.credentials/buttondown`
- **Free tier**: 100 subscribers, no automations
- **Paid tier**: $9/month (Standard) — unlocks automations/welcome sequence
- **Blog forms**: Live on all pages via `_includes/email-capture.html` (commit 5019805)
- ⚠️ **Email confirmation**: Reuben must click verification link in Gmail to fully activate
- **Welcome sequence** (3 emails): Ready in `/artifacts/email-marketing/ready-to-implement-email-assets-v2.md` — deploy when plan upgraded

*Last updated: 2026-02-17 07:45 IST*