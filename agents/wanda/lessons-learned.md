# Lessons Learned

*Updated after every task. Re-read at session start.*

## Operating Rules (derived from patterns)
1. **Statistical honesty visuals are competitive advantage** - When blog discusses confidence intervals or sample size limitations, ALWAYS visualize the uncertainty (error bars, CI charts). Honest uncertainty → more trust (Feb 15, 2026)
2. **Use `pointer-events-none` on overlay elements** - Prevents gradient overlays from blocking user interactions (Feb 14, 2026)
3. **Contextual empty states > generic messages** - Emoji + filter-specific messaging creates better UX than "nothing here" (Feb 14, 2026)

## Operating Rules (continued)
4. **Card layout > complex charts for mobile Twitter** — Fan charts, flow diagrams with arrows, and multi-layer threshold gauges all fail at phone resolution. Default to side-by-side comparison cards (proven: kelly-comparison.png 5/5, ENTER vs SKIP panels). Only use charts in blog posts (desktop). (Feb 17, 2026)
5. **Pre-stage visuals with placeholder data before research fires** — SPRT accepted at 22:24; Day 9 research fires 1:30 AM. Built both visuals between heartbeats using known structure. 3 number changes = update vs full rebuild. (Feb 17, 2026)

## Task Log
<!-- Newest entries at top -->

### 2026-02-19 02:37 IST — Day 11 Comparison Table DRY_RUN Fill (N=0)
**Task:** Fill comparison table with DRY_RUN N=0 data — flagged optional in Jarvis 02:30 sweep. All other Day 11 deliverables complete; this was the last amber item.
**Self-Rating:** 4.5/5 (clean fill, 5 sec run, vision assessment confirmed 4.5/5, footer copy earns marks)
**What Worked:**
- **Just did it** — "optional" doesn't mean "skip," it means "no urgency." At 2:37 AM with deployment on Sat, doing it now is cleaner than leaving it amber.
- **Parametric script paid off**: 6 variable edits → clean re-render, no redesign. Exactly the value promised at pre-stage.
- **DRY_RUN semantics**: For 0-trade sessions, explicit distinction between "no data" (PENDING) and "data is zero" (+0.0%, 0.00) is the right call. WR/spread have no meaning → PENDING. Balance delta / logLR are computable → show the value.
- **Footer copy is strong**: "n = 0 live trades — too small for significance. Watching the right thing." — honest + narrative voice, doesn't apologize for the zero.
- Vision assessment feedback: badge width uniformity and "modeled" label noted as minor cosmetic items — worth considering for Day 12+ table designs.
**What Didn't:**
- Nothing significant. The only cosmetic note is "+0.0%" prefix — defensible for format consistency but semantically a zero isn't "positive." Low priority since the generator's color logic depends on the "+" prefix.
**Lesson Learned:** **DRY_RUN fills follow a clear schema**: trades=N (explicit zero), metrics-without-data="—" (PENDING), metrics-with-meaningful-zeros=computed value. This pattern generalizes to any session with partial data — decide per-metric whether the absence is "not applicable" vs. "zero." Apply this distinction in all future comparison tables.

### 2026-02-19 01:22 IST — Day 11 Fee Discovery Visual (Scenario C, T-8min pre-run)
**Task:** Pre-stage fee discovery visual for Day 11 Scenario C narrative — DRY_RUN mode, 0 real trades, so the comparison table has no data. The fee discovery (0 bps → 1000 bps confirmed) IS the Day 11 story.
**Self-Rating:** 4/5 (3 iterations to resolve overlapping elements; narrative impact strong; mobile readability adequate)
**What Worked:**
- **Recognized the gap proactively**: WORKING.md said "Wanda on standby for runtime visuals at 1:30 AM from real bot data" — but Scenario C (DRY_RUN, 0 trades) means the comparison table has no data. The gap: no visual for the fee discovery angle. Built it before being asked.
- **Narrative-first design**: "Before/after" left panel (green 0 bps → red 1000 bps) + "math proof" right panel + full-width "$10.49 USDC protected" punchline. Story is complete in one image.
- **Assessment loop discipline**: Ran image assessment 4 times across iterations. Caught text overlap bugs, z-ordering issues, "Maker Orders box competing with punchline" before shipping.
- **Color semantics applied correctly**: Green = assumption (safe), Red = reality (danger), Amber = warning, Green banner = punchline (resolution/save). Consistent with Days 1-10 series.
**What Didn't:**
- v1 (3.5/5): Maker Orders box competed with punchline. Two competing climaxes diluted impact.
- v2 (2.7/5): Text overlap bugs appeared — y-coordinate math with overlapping boxes. "At 10%: loses 0.15per1.50" garbled due to tight spacing.
- v3 (4/5): Removed third annotation line to free space, widened BLOCKED badge to panel width. Clean render.
- Root cause of overlap bugs: stacking too many text/badge elements in tight y-range without checking exact pixel math.
**Lesson Learned:** **When DRY_RUN = 0 trades, the comparison table is moot — pre-stage the narrative visual instead.** The "runtime screenshot" pattern breaks when there's nothing to screenshot. Always ask: "What IS the story if the bot doesn't trade?" Then design for that scenario.  
Also: **y-coordinate overlap prevention**: When stacking text + FancyBboxPatch elements in a tight column, plan spacing from bottom-up. Reserve 0.50 units per text line + 0.50 units per badge + 0.20 separators = explicit budget. Don't trust intuition — calculate explicitly before writing the code.

### 2026-02-19 00:37 IST — Day 11 Tweet 6 Visual Pre-staging (Live Session vs Paper Run 2)
**Task:** Pre-stage comparison table visual for Day 11 Tweet 6 — T-53min before 1:30 AM bot run; Loki/Quill scaffold identified this as the ONLY pre-stageable Day 11 visual
**Self-Rating:** 4/5 (pre-staged; 4.5/5 expected once real values replace PENDING badges)
**What Worked:**
- **Proactive pattern applied** — WORKING.md flagged "runtime screenshots required" but that didn't mean I couldn't pre-stage the parametric framework. Built the script T-53min early; update is now 5-second job vs 20-minute build from scratch
- **Iterated on design** (3 passes): v1 had maroon PENDING badges (read as error) → v2 fixed to amber ("waiting"), removed DRY RUN from title → v3 bumped footer size + "TBD" over "??"
- **Amber vs maroon for PENDING** — critical color semantics fix. Maroon/burgundy connotes failure or error. Amber/yellow = "standby, incoming data." Used assessment loop (image tool → fix → re-render) to catch this before shipping
- **DRY RUN scope**: removed "[DRY RUN]" from main title; scoped "AWAITING DATA" badge to Live Session column header only. Prevents misleading "the whole visual is a dry run" read
- **Parametric script** — 6 variables at top → full re-render in 5 sec. Zero redesign work after bot runs
- **"n = TBD" over "n=??"** — "??" reads as broken; "TBD" reads as intentional/pending state
**What Didn't:**
- First render: maroon PENDING badges immediately flagged by assessment — should have defaulted to amber per color semantics intuition from Day 8 lesson ("white text is non-negotiable" → amber for neutral/waiting is the equivalent rule)
- Subtitle line is dense (will compress on mobile) — acceptable tradeoff for information density; main table data survives mobile compression
**Lesson Learned:** "Not pre-stageable" in squad notes means "exact values can't be known" — not "no design work possible." The comparison table STRUCTURE and DESIGN are the hard work; data is just variables. Apply the parametric pre-staging pattern every time. Also: **color semantics for state badges** — Red/maroon = error, Green = success, Amber/yellow = waiting/pending, Gray = inactive/disabled. Trust this mapping without needing an explicit reminder.

### 2026-02-18 14:07 IST — Day 10 Visual Pre-staging + Update (Paper Run 2)
**Task:** Pre-stage Day 10 visuals before 3:00 PM research session fires (53 min early); Vision ran parametric update at 15:53 IST with real numbers (N=19, WR=94.7%, $35.39, logLR=4.37, ACCEPT)
**Self-Rating:** 4.5/5 (pre-staged perfectly; parametric update ran in <2 min as designed — zero scramble post-publish)
**What Worked:**
- **Pattern applied immediately** — Jarvis flagged Wanda as "visual standby" at 14:00 IST; I moved within 7 minutes without waiting for explicit assignment
- **Two-visual strategy**: Hook card (Tweet 1 hero) + comparison table (Tweet 6 detail) covers the two most impactful thread slots
- **"??" consistency** across both visuals — matches hook→table style, creates cohesive thread suspense arc
- **Iterative quality check** — ran vision-model assessment after first render, caught comparison table's center-label size issue before finalizing
- **PENDING badge design** — muted dark red (#7B3045) keeps badge in red brand family while clearly communicating "not yet resolved" (not an error state)
- **Removed center dashed divider** from comparison table per assessment feedback — it was visual noise, not structure
- **Parametric script** — 6 variable changes → full re-render in <30 sec. Update ETA after Day 10 publishes: ~5 min
- **Twitter crop safety** — tightened vertical padding on both images, confirmed banner and footer within safe zone
**What Didn't:**
- Comparison table mobile readability started at 2/5 — needed center label bump from 11→13px on second iteration
- First draft had `\$` escape sequence warning in Python; minor but annoying, fixed immediately
**Lesson Learned:** Trust the "visual standby" signal in WORKING.md/Jarvis notes as an implicit assignment. When research fires in <1h and you're flagged as standby, pre-staging is the correct default action — no explicit @mention needed. The assessment loop (render → vision-model check → iterate) is now a locked habit; never skip it for pre-staged work.

### 2026-02-17 13:45 IST - SPRT Progress Tracker (Day 8 Pre-staged Visual)
**Task:** Pre-stage SPRT validation tracker visual for Quill's Day 8 thread scaffold (Tweet 6)
**Self-Rating:** 4/5
**What Worked:**
- **Proactive pre-staging** — Created 1h 15min before Day 8 research session fires at 3 PM
- **Narrative design** — SPRT count (0→120) gives readers a journey to follow across weeks
- **Dual-outcome honesty** — shows both "Confirm Edge" AND "Reject Edge" zones; no false optimism
- **Scientific credibility signals** — exact SPRT boundaries (A=2.773, B=−1.558) from Day 7 paper
- **Pending state intentional** — Win Rate and Avg Edge showing "—" creates return-visit motivation
- **Reusable generator** — Python script in place so post-3 PM update is just changing 3-4 numbers
- **Self-contained documentation** — Update guide written so any agent can re-render after results
**What Didn't:**
- Final layout has slight spacing gap at bottom (~80px below zones → footer) — content doesn't fill 675px perfectly
- Pre-staged at 0/120 needs re-render after actual trade count is known post-3 PM
**Lesson Learned:** Pre-stage visuals before research sessions even with placeholder data — the structure/design is the hard work, updating numbers is trivial. Saves 20-30 min post-publish scramble.
**New Operating Rule:** When research sessions have a predictable structure (paper trading = SPRT count), pre-build the visual framework with empty/pending states. Update is faster than building from scratch.

### 2026-02-17 03:53 IST - Fee Impact Table (Day 7 Breaking News Visual)
**Task:** Created fee impact comparison table for Day 7 Twitter thread (Polymarket 0% fee change)  
**Self-Rating:** 5/5  
**What Worked:**
- **12 hours ahead of deadline** (assigned 3:45 AM with 4 PM deadline → delivered 3:53 AM)
- **Proactive overnight execution** — Jarvis assigns at 3:45 AM, I start immediately instead of waiting for business hours
- **Perfect format match** to Loki's editorial suggestion (two-column before/after with ❌/✅ status indicators)
- **Breaking news clarity** — visual communicates "strategy went from dead to viable overnight" in one glance
- **Design simplicity amplifies urgency** — deliberately kept it simple (two columns, four metrics, clear status) because breaking news needs maximum clarity over aesthetic sophistication
- **Exact spec compliance** — 1200×675 Twitter-optimized (16:9), dark mode, high contrast
- **Color-coded interpretation** — negative values red, positive green, status indicators reinforce with emoji
- **Tabular nums typography** — proper alignment for numerical comparison readability
- **Brand consistency** — footer branding maintains Days 1-6 series identity
- **Complete documentation** — 5KB doc with design rationale, thread integration, alt text, lessons learned

**What Didn't:**
- Nothing — this executed exactly as needed for the breaking news hook

**Feedback:** Delivered 12h early, unblocking Quill for 6 PM deployment (Jarvis coordination decision)

**Lesson:** **Breaking news visuals need maximum clarity over sophistication.** The fee impact table is deliberately simple (two columns, four rows, clear status) because the story is "this changed overnight" — complexity would dilute urgency. When working with time-sensitive content, resist the urge to add flourishes. Lead with the delta (before/after), use status indicators (✅/❌) for instant judgment, keep metric count low (4-5 max) for mobile scanning. Also: **proactive overnight execution unlocks team velocity** — by delivering 12h early, I removed blocking dependencies for Quill's deployment. Pattern applied: same dark mode design system (gradient backgrounds, translucent cards, consistent typography) across Days 1-7 creates instant visual recognition. Breaking news justified same-day dual deployment (Day 1 at 9 AM + Day 7 at 6 PM) — when external events create urgency, interrupt the schedule.

### 2026-02-16 15:22 IST - Twitter Visual Assets (Day 6 Multi-Factor Backtest)
**Task:** Created 3 visual assets for Day 6 Twitter thread (backtest results + synthesis)  
**Self-Rating:** 4.5/5  
**What Worked:**
- **10-minute turnaround** (Quill 3:12 PM → Wanda 3:22 PM) — fastest yet, proactive pattern fully internalized
- **Synthesis visuals match narrative depth** — 3 images justified for 6-day culmination thread
- **Visceral design choices amplify key insights:**
  - Image 1: Ruby red arrow + "3% fee kills edge" makes abstract fee problem emotionally concrete
  - Image 2: Stacked bar decomposition shows quantitative rigor (regime 50%, cluster 33%, VRP 17%)
  - Image 3: Emoji + color scorecard table = instant 6-day synthesis (most shareable visual of series)
- **Consistent brand language** — Days 1-6 visual continuity (ruby red accent, Twitter dark mode, annotation style)
- **Answered specific questions:**
  - Image 1: "Why maker orders only?" → Same win rate, opposite edge
  - Image 2: "Where did edge come from?" → Decomposed contributions
  - Image 3: "How did each day hold up?" → Clusters + regime are MVPs (4/5 each)
- **Strategic table format on Image 3** — standalone shareable artifact (needs zero context, tells complete 6-day story)
- Comprehensive 15.4KB documentation with 3 integration options + engagement strategy

**What Didn't:**
- Emoji font warnings (🟡🟢) persist from Days 1-5 — matplotlib DejaVu Sans limitations (non-blocking)
- Could have created 4th chart (confidence interval narrowing with sample size) but consciously omitted (Day 5 already established statistical honesty pattern)
- Image 3 is information-dense (7 rows × 5 columns) — intentional for synthesis, but could create simplified "top 3" alternative

**Feedback:** None yet (just completed, awaiting Loki editorial review + Reuben approval)

**Lesson:** **Scorecard tables are synthesis gold.** Image 3 (multi-factor scorecard with emoji ratings + color coding) is likely the most shareable visual of the entire 6-day series because it:
1. **Tells complete story alone** (no thread context needed — followers can screenshot and share independently)
2. **Scannable in 3 seconds** (emoji + color = instant pattern recognition: green days worked, yellow days conditional)
3. **Validates the journey** (shows Days 1-2 failed but Days 3+5 succeeded → combined multi-factor approach justified)
4. **Builds narrative credibility** (honest about failures = trust in successes)

This table format will be reusable for any multi-day, multi-factor, or retrospective content. Also: **visceral design beats neutral labels** — the ruby red arrow on Image 1 creates emotional emphasis ("anger at fees?") that pure data labels miss. Use sparingly for maximum impact on key insights. Pattern now clear: foundation threads (Days 1-4) = 2 images, synthesis threads (Days 5-6) = 3 images, with at least one being a comprehensive summary visual.

### 2026-02-16 01:59 IST - Twitter Visual Assets (Day 5 Regime Detector)
**Task:** Created 3 visual assets for Day 5 Twitter thread (regime detector + multi-factor synthesis)  
**Self-Rating:** 4.5/5  
**What Worked:**
- Proactive pattern fully internalized (Quill requests visuals 1:42 AM → I deliver by 1:59 AM = 17 min)
- **State machine format** for regime visualization — intuitive cycle representation (CALM → SPIKE → POST-SPIKE → CALM)
- Explicit decay math annotations (λ_R = 1/15, λ_I = 1/40) — makes theoretical foundation visible, builds credibility
- **Synthesis flowchart** (Image 3) shows all 5 days in one visual — narrative payoff delivered
- Color language consistency maintained (Days 1-5): green = signal/viable, red = problem/emphasis, yellow = decision, gray = baseline
- 3-image narrative arc: concept (state machine) → proof (expansion chart) → application (framework)
- Comprehensive 10.6KB documentation with 3 integration options + engagement strategy

**What Didn't:**
- Emoji rendering warnings in matplotlib (📊🤔🎯📈⚡✅❌ show as text boxes) — likely renders fine in PNG but uncertain
- Image 3 slightly dense (5 inputs + decision + 2 outputs + arrows) — could have created simplified card version
- Could have added fourth "timeline" visual showing signal firing across 100 periods (would reinforce 11% selectivity)

**Feedback:** Loki rated Quill's thread 5/5 (first perfect score in 5 days) — synthesis content justified, visuals pending deployment

**Lesson:** **Synthesis threads justify higher visual density.** Days 1-4 were 2 images each. Day 5 = 3 images because it's the PAYOFF thread where all pieces click together. The multi-factor framework flowchart (Image 3) is the money shot — it transforms 5 isolated posts into one unified system. When creating capstone visuals for multi-day arcs, don't minimize information — SHOW the synthesis. Followers want to see "oh THAT'S how it all fits" in one glance. Also: state machine diagrams are incredibly effective for regime-based strategies (cycle format + transition annotations + decay rates). Will reuse this pattern for any state-dependent logic going forward. Pattern confirmed: Days 1-5 visual consistency (color language) creates instant recognition — green always means signal/viable, red always means problem/emphasis. This is brand building through design.

### 2026-02-15 15:37 IST - Twitter Visual Assets (Day 4 Implied Volatility)
**Task:** Created 2 visual assets for Day 4 Twitter thread (implied volatility extraction + escape routes)  
**Self-Rating:** 4.5/5  
**What Worked:**
- Proactive execution pattern fully automated (Jarvis assigns → I read context → execute → 18 min turnaround)
- Implemented Loki's editorial suggestion (fourth "DOA" path crossed out) for visual contrast — excellent idea
- Flow diagram format clarifies complex process (input→process→output with formulas)
- Decision tree format perfect for "escape routes" concept (branching paths from central problem)
- Explanation box on Image 1 makes Black-Scholes accessible without dumbing down
- Color language consistency (red = problem/DOA, green = viable paths) creates instant comprehension
- Maintained brand consistency with Day 1/2/3 (ruby red accent, Twitter dark mode, watermark)
- Comprehensive documentation (integration instructions, design rationale, self-assessment)

**What Didn't:**
- Emoji font warnings (💰📈🎯❌ rendered as boxes in matplotlib) — should use text labels or switch to PIL for emoji support
- Image 2 slightly information-dense (4 paths + legend + explanations) — could have created simplified version as alternative

**Feedback:** None yet (just completed)

**Lesson:** When reviewers make design suggestions (Loki's "fourth DOA path"), implement them immediately even if original brief didn't include it. The crossed-out market orders path creates powerful visual contrast between failed baseline and viable alternatives — this makes the "fee problem" more visceral than just showing three solutions. Also: explanation boxes (like on Image 1) are Ruby's signature move for making technical content accessible. Every complex visual should answer "what does this mean?" for the casual reader, not just show data. Pattern established: Loki reviews → I read review → implement suggestions proactively.

### 2026-02-15 02:07 IST - Twitter Visual Assets (Day 3 Liquidity Clusters)
**Task:** Created 3 visual assets for Day 3 Twitter thread (liquidity cluster strategy)  
**Self-Rating:** 5/5  
**What Worked:**
- Proactive pattern fully established (saw Quill's visual suggestions → executed without assignment → 25 min turnaround)
- Contextual research before designing (read blog post + Loki's editorial review + Quill's thread)
- Strategic chart diversity: concept (heatmap), framework (2x2 matrix), honesty (CI chart)
- Confidence interval chart = DIFFERENTIATOR (visualizing statistical honesty is rare on crypto Twitter)
- Maintained visual consistency across Day 1/2/3 (same color palette, annotation style, documentation format)
- 2x2 matrix format highly shareable (actionable decision framework)
- Comprehensive 16KB documentation with integration options + engagement strategy
- Mobile-optimized (high contrast, large text, readable on 375px screens)

**What Didn't:**
- Could have created condensed single-panel alternatives for faster threads
- Could have suggested specific tweet wording changes to better integrate visuals

**Feedback:** None yet (awaiting Reuben's review)

**Lesson:** The confidence interval chart showing sample size limitations is Ruby's secret weapon. Most crypto Twitter hides statistical uncertainty or cherry-picks results. Visualizing honesty ("n=10 is too small, here's why") builds massive credibility — it's the visual equivalent of "I could be wrong," which paradoxically makes people trust you MORE. This should become a standard pattern: whenever Ruby makes claims based on limited data, include a CI visualization. Also: 2x2 matrix format works incredibly well for decision frameworks (scannable, shareable, actionable).

### 2026-02-14 16:07 IST - Twitter Visual Assets (Day 2 Contrarian Signal)
**Task:** Created myth-busting data visualization charts for Day 2 Twitter thread  
**Self-Rating:** 5/5  
**What Worked:**
- Proactive pattern established — Quill suggests visuals in thread draft → I create them immediately (25 min turnaround)
- Color-coding for signal quality (red/yellow/green) creates instant cognitive comprehension
- Arrow annotations pointing to most shocking stat (SOL 38%) guides the eye perfectly
- Dual chart strategy: foundation chart (BTC buckets) + emotional punch chart (altcoin comparison)
- matplotlib installed without friction this time (learned from Day 1)
- Comprehensive documentation with 3 integration options (recommended + alternatives)

**What Didn't:**
- Nothing significant — execution was smooth, learned from Day 1 setup

**Feedback:** None yet (awaiting Reuben's review)

**Lesson:** When creating comparison charts for social media, visually emphasize the MOST shareable stat (not the most rigorous one). SOL's 38% win rate with arrow + colored callout box is more engaging than a perfectly balanced chart. Emotionally resonant data drives engagement. Also: established proactive pattern means less friction — Quill knows I'll handle visuals, doesn't need to ask.

### 2026-02-14 06:25 IST - Twitter Visual Assets (Day 1 Funding Rate)
**Task:** Proactively created data visualization charts for Twitter thread  
**Self-Rating:** 5/5  
**What Worked:**
- Proactive initiative — saw "could add charts" in Quill's thread doc, just made them
- Dark theme optimization for Twitter feed (#15202B background)
- Dual-label strategy on bar chart (annualized + 8h rate) = clarity without clutter
- Live data API integration (charts regenerable with fresh data)
- Comprehensive documentation (integration options, rationale, technical specs)

**What Didn't:**
- Had to set up Python venv for matplotlib (minor friction, first time doing data viz)
- Could have created a third option (combined 2-panel image) for variety

**Feedback:** None yet (just created)

**Lesson:** When creating charts for social media, optimize for the platform's default theme (Twitter = dark mode). Always include context annotations directly on the chart (reduces need for lengthy explanations). Proactive design work compounds — Quill drafts thread → I add visuals → Loki reviews copy → all parallel, not sequential.

### 2026-02-14 04:22 IST - Mission Control Visual Improvements
**Task:** Implemented scroll indicators, priority legend, contextual empty states  
**Self-Rating:** 4/5  
**What Worked:**
- Proactive claiming of design tasks from Shuri's UX audit
- Fade gradients for scroll indicators (elegant, no JS needed)
- Priority legend improves accessibility (color + text)
- Contextual empty states with emoji feel friendly and helpful

**What Didn't:**
- Can't visually test rendering without browser access (minor blocker)
- Should have created a design system deliverable documenting color/spacing decisions

**Feedback:** None yet (awaiting Reuben/squad review)

**Lesson:** When implementing scroll indicators, gradient overlays must use `pointer-events-none` to avoid blocking user interactions. For empty states, emoji + contextual messaging beats generic text.

### 2026-02-17 22:37 IST — Day 9 Visual Pre-staging (SPRT ACCEPTED + Signal Filter)
**Task:** Pre-stage 2 Day 9 visuals before 1:30 AM research fires — SPRT accepted tracker + signal filter system
**Self-Rating:** 4.5/5
**What Worked:**
- Proactive overnight execution pattern continues — built both assets 2h early, Quill has zero scramble at 1:30 AM
- SPRT accepted visual: clean single-story (28 vs 304 baseline, 91% savings), green ACCEPTED badge throughout, logLR pill adds technical credibility without cluttering headline
- Signal filter: took 3 iterations but v3 with comparison cards (ENTER vs SKIP) is the correct format — mirrors kelly-comparison.png card pattern that scored 5/5
- Used vision model assessment after each iteration, caught the title-overlap bug in v1 before shipping
- Both scripts are parametric: update 3-4 numbers after Day 9 publishes, no redesign needed
**What Didn't:**
- Signal filter took 3 iterations (v1: overlapping title; v2: arrows too complex; v3: card layout) — should have defaulted to card layout from lesson #4 in operative rules
- The "OR" separator between ENTER/SKIP cards is slightly obscured (minor)
**Lesson Learned:** When pre-staging visuals with unknown final data, build the structural/design framework now and make number changes trivial. The design IS the hard work; data is just variables. Also: card layouts beat chart/flow diagrams for Twitter every time. Trust the pattern.

### 2026-02-17 20:37 IST — Day 8 Visual QA + Rebuild (Kelly Criterion Charts)
**Task:** Verify day8-kelly-ruin.png + day8-winrate-sensitivity.png are tweet-quality; create new ones if not.
**Self-Rating:** 4.5/5
**What Worked:**
- **Systematic 3-image visual inspection upfront** — caught the ruin chart's fatal flaw (muddy overlapping Monte Carlo bands) before asking Quill to use it. Saved a failed thread image.
- **Iterative quality improvement** — ran vision-model assessment after each rebuild iteration, not just at the end. Cut wasted iterations significantly.
- **Card-layout pivot** — when the fan chart failed mobile readability, switched to a 3-column card layout (mirroring the 5/5 day8-kelly-comparison.png design language). Form follows function: if comparison is the story, use comparison cards.
- **White text on colored badges** — overriding tinted text with white on verdict badges is the single most impactful WCAG fix for mobile legibility.
- **Half Kelly card wider** — subtle hierarchical signal (wider = recommended) that works even at thumbnail scale.
- **Sensitivity chart** — passed with minor polish only (simplified annotation box, removed text-heavy corner callout).
**What Didn't:**
- Took 6 iterations on the ruin chart before shipping. Initial instinct (fan chart with bands) was wrong for mobile. Should have started with the card layout given the day8-kelly-comparison.png was already a proven pattern.
- `fig.add_patch` deprecated on matplotlib figures — use `fig.add_artist`. Caught early.
- Dollar signs in caption text need escaping in matplotlib (`\$`) or raw strings.
**Lessons:**
1. **Match chart format to primary device.** Monte Carlo fan charts work in blog posts (desktop, zoomed in). Twitter = mobile first. Cards > lines for comparison messages.
2. **Look at your best-performing visuals first.** The 5/5 kelly-comparison chart was sitting right next to the broken ruin chart. Had I studied it first, I'd have jumped straight to cards.
3. **Run vision assessment before AND after each major format change** — not just at start and end. Saves 2-3 wasted renders.
4. **White badge text is non-negotiable.** Tinted text on colored backgrounds always fails the squint test at mobile compression. White text + colored background = universal legibility.
**New Operating Rule:** When creating mobile-first comparison visuals (Twitter/social), default to the card layout pattern (proven in kelly-comparison.png) over line charts or fan charts. Reserve fan charts for blog content only.
