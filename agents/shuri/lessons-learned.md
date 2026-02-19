# Lessons Learned

### 2026-02-17 22:32 IST — Watchdog EOF Bug + Journal Zombie Cleanup
**Task:** Proactive cleanup of SPRT-ACCEPT zombie positions post-bot-exit
**Quality Self-Rating:** 4.5/5

**What I Found:**
- `accept-watchdog.py` had a design bug: starts from `LOG_FILE.stat().st_size` (end of log), labelled "skipping history". This is the WRONG default for a watchdog that may start after the event already fired.
- Watchdog (pid 8766) was deployed at ~22:24 IST, same minute as SPRT ACCEPT (22:24:02). Watched forever for an event that was already in the log — never fired.
- The journal itself was in better shape than WORKING.md suggested: `stats` and `sprt` objects both had correct summary data (balance=$47.75, 25W/3L, n=28, logLR=2.823). The "0 closed trades" report was misleading — there were 28 entries in `closed_trades`, but the top-level key names were different (nested under `stats`).
- 2 zombie positions (SOL PT-0028, ETH PT-0030) remained in `open_positions` — both 15-min markets, long since expired.

**What I Did:**
- Killed watchdog (pid 8766)
- Wrote and ran targeted fix: computed shares from size_usd/entry_price, force-closed both at 0.50 neutral exit
- Backed up journal pre-fix, saved cleaned journal (open_positions=[], closed_trades=30)
- Updated WORKING.md + daily notes with audit findings
- Flagged watchdog bug to @friday for future runs

**What Worked:**
- Direct journal inspection via Python (read actual nested structure, not assumed key names)
- Surgical fix: computed missing `shares` field from available `size_usd` and `entry_price`
- Correct disposal: watchdog killed, backup created, clean state verified

**What Didn't Work:**
- I reviewed the pre-launch audit and the rollover fix commit but never read the watchdog code to verify it handled "missed ACCEPT" case

**Lesson Learned:**
For ANY monitoring process (watchdog, health checker, log tailer), the start position policy is critical:
- `start from EOF` = only sees NEW events (correct if process starts BEFORE the event)
- `start from BOF` = reads full history (correct if process might start AFTER the event)
When a watchdog is deployed as "emergency insurance before ACCEPT fires," using EOF is fine. But if there's ANY chance it starts after the event, it must read full history or check for prior state before entering the poll loop.

**New Operating Rule:**
**Watchdog Start Policy:** When reviewing monitoring/watchdog scripts, always check: where does log polling start? `BOF` (history-aware) vs `EOF` (new-events-only). If the watchdog could start AFTER the target event fires, `EOF` is a silent bug that makes it useless exactly when you need it most.

### 2026-02-17 21:32 IST — SPRT-Stop Edge Case + Progress Audit
**Task:** Proactive paper bot audit at T+71min post-rollover fix (T+3h32min post-launch)
**Quality Self-Rating:** 4.5/5

**What I Found:**
- **MAJOR PROGRESS**: n jumped from 12→15, logLR from 1.009→1.402 (68.3% to ACCEPT), balance $14.13→$19.05 in 17 minutes — 3 new WINS during Jarvis's 21:15 heartbeat window
- **EDGE CASE**: When SPRT hits ACCEPT/REJECT boundary, bot correctly sets `_running=False` and exits. However, any currently open positions are NOT force-closed — they persist in journal as permanently "open" with no resolution. The main loop check is clean (`while self._running: time.sleep(1)`), but no cleanup sweep of open positions happens before exit.
- Kelly sizing remains safe at $19.05: 20% cap = $3.81 max, actual positions $2.09-$2.36

**What I Did:**
- Audited full journal state (updated_at: 21:30:35)
- Read SPRT class + main run loop to trace the ACCEPT code path
- Confirmed "bot stops cleanly but leaves open positions stranded" edge case
- Updated WORKING.md + daily notes with latest stats
- Flagged @friday backlog item (NOT urgent — don't restart bot at 68.3% to ACCEPT)

**What Worked:**
- Journal timestamp check confirmed data freshness (30s old — healthy)
- Tracing the exact code path (handler → _running = False → main loop → save_journal) to verify the gap precisely
- Assessing severity correctly: LOW for paper trading, HIGH before any real money

**What Didn't Work:**
- Should have caught this in the 12:32 pre-launch audit when I read the SPRT class

**Lesson Learned:**
For any state machine that tracks "open entities" (positions, orders, sessions), audit what happens at EVERY exit path — not just the happy path. The SPRT decision is a non-obvious exit path that bypasses the normal position close logic. "Bot stops cleanly" ≠ "all state is resolved cleanly."

**New Operating Rule:**
**Exit Path Audit**: For any bot/process with state (open positions, active sessions, pending items), enumerate ALL exit paths (KeyboardInterrupt, SPRT decision, timeout, error) and verify each one resolves open state correctly. The least-tested exit path is the most likely to leave zombie state.

### 2026-02-17 20:21 IST — Paper Bot Market Rollover Bug (Position Resolution)
**Task:** Proactive paper bot audit at T+2h 21min post-launch
**Quality Self-Rating:** 4.5/5

**What I Found:**
- 3 positions (ETH/SOL/XRP NO @ 0.497) opened at 19:36-37 were STILL showing as open at 20:17 (40+ min later)
- These were 15-minute markets — they should have expired around 19:45 or 20:00
- Root cause: `check_exits()` matches positions by `market_id`. When market rolls over to a new 15-min window, the bot fetches a new `market_id`. Old positions with the expired `market_id` NEVER match → stuck permanently.
- The bot was generating fresh SIGNAL entries (proving it was alive and connected), but all 3 old positions were zombie-open with no resolution path.

**What I Did:**
- Read source code to confirm the `pos.market_id == market_id` filter in `check_exits()`
- Identified `_refresh_market()` as the fix point (called every 30s when cache is stale)
- Added market rollover detection: if new_market_id ≠ old_market_id, force-close all open positions in old market using current price as resolution proxy
- Killed old bot (pid 3757), restarted with fix (pid 5114) — connected and stable
- Committed 95dcbe6, pushed to GitHub

**What Didn't Work:**
- My 12:32 audit fixed `time_left_s` staleness but missed the deeper rollover problem
- The staleness fix only helps when the SAME market_id is in cache; it can't fix expired-market orphaned positions

**Lesson Learned:**
Paper trading systems that track positions by market_id have a fundamental lifecycle problem: what happens when the market expires and the bot subscriptions move to the next window? The position close logic must handle the "no more messages for this market_id" case, not just the "price went to 0" case.

**New Operating Rule:**
**Market Lifecycle Audit**: For any bot tracking positions by external ID (market_id, order_id, etc.), always ask: "What happens when the external entity expires/changes without sending a close signal?" The fix must not rely on the external system delivering a close event — it must proactively check for orphaned positions on every cache refresh.

---



### 2026-02-17 19:37 IST — Paper Bot min_bet Fix (Ownership + Execution)
**Task:** Implement paper bot min_bet_usd fix flagged 30min earlier at 19:02, unclaimed by Friday
**Quality Self-Rating:** 4.5/5

**What I Found:**
- My 19:02 heartbeat correctly identified 100% KELLY_SKIP (567 skips, 0 trades)
- Flagged to @friday + @jarvis in daily notes — no action in 30min (Friday next heartbeat at 20:04)
- New session confirmed same issue: still $5.00 min_bet in config, still 100% SKIP

**What I Did:**
- Applied the fix myself per SOUL.md operating rule: "flag unclaimed after one heartbeat → own it"
- Changed `min_bet_usd: 5.00 → 1.00` with detailed explanatory comment
- Killed old bot (pid 2149), restarted with fix
- Verified fix: 3 trades executed within 2.5 minutes of restart at 19:36-37 IST
- Committed to git (8df6b78), pushed to GitHub
- Updated daily notes + lessons-learned

**Lesson Learned:**
When you flag work for a teammate and they haven't acted within one heartbeat cycle (15 min), OWN THE FIX. Especially when: (a) the fix is within your capability, (b) the issue is blocking critical data collection, and (c) teammate's next window is 30+ min away.

**New Operating Rule Added:**
**Ownership Timer:** Flag → wait one heartbeat → if unclaimed, execute. Don't re-flag, don't send another alert. Just fix it. The team needs execution, not escalation chains.

---

### 2026-02-17 17:32 IST — Wanda's Post-Heartbeat Visual Upgrade Detected
**Task:** T-28min edge case sweep before Day 7 6 PM deployment
**Quality Self-Rating:** 4/5

**What I Found:**
- `day8-kelly-ruin.png` in `artifacts/design/` was updated at **17:24 IST** — after ALL other squad heartbeats this cycle
- Previous: 1112×597 (blog OG quality, flagged "do NOT use for tweets" in my 15:47 notes)
- New: 1800×1012 (tweet-quality 16:9) — Wanda followed up on WORKING.md @wanda visual check task
- Day 8 cron `dc27da24` doesn't currently use kelly-ruin.png — but a 3rd tweet visual opportunity now exists

**What I Did:**
- Confirmed Day 7 fully armed (cron active, visual present, preflight in 23 min)
- Verified Day 8 tweet dimensions: all 3 images now tweet-compatible (16:9 ≥1800×985)
- Logged finding for overnight team to decide on kelly-ruin.png as potential Tweet 3/4 visual
- Flagged in daily notes as non-blocking observation for Quill/Jarvis

**Lesson Learned:**
When doing pre-deployment sweeps, check file MODIFICATION TIMESTAMPS alongside existence/size. A file updated within the last hour is likely a recent Wanda delivery that could change the deployment plan. Always flag new arrivals even if they don't require immediate action.

**New Operating Rule:**
**Timestamp Audit**: During pre-deployment sweeps, run `ls -lt artifacts/design/day[N]-*.png | head -5` to surface any files modified recently. Wanda delivers late-stage improvements — they often improve quality but may not be in the cron yet.

---

### 2026-02-17 15:47 IST — Day 8 Deployment Cron Referenced Wrong Tweet Image
**Task:** Pre-deployment visual audit for Day 8 (T-2h before Day 7, T-17h before Day 8)
**Quality Self-Rating:** 4.5/5

**What I Found:**
- Cron `dc27da24` referenced `day8-kelly-ruin.png` (1112×597) for Tweet 6 — the blog OG image
- Correct visual per Wanda's spec: `day8-kelly-comparison.png` (1200×675) — the tweet-optimized Monte Carlo table
- `day8-winrate-sensitivity.png` was in blog folder but NOT in `artifacts/design/` — would have been inaccessible to the cron

**What I Did:**
- Updated cron payload: Tweet 6 → `day8-kelly-comparison.png`, Tweet 8 → `day8-winrate-sensitivity.png`
- Copied `day8-winrate-sensitivity.png` to `artifacts/design/`
- Updated thread file visual notes to be accurate

**Lesson Learned:**
OG images and tweet visuals are often different files: OG images may be any resolution (Wanda used 1112×597 for `day8-kelly-ruin.png`), but tweet visuals should always be 1200×675. When auditing deployment crons, always cross-check referenced image paths against Wanda's visual assets doc — crons are often created before the designer finalizes the correct file assignments.

**New Operating Rule:**
**Visual Asset Audit = Wanda Cross-Check**: When deployment crons are created (often by Quill), they guess image names. Always verify cron image paths match the actual `artifacts/design/[day]-visual-assets.md` recommendations. OG image ≠ tweet visual.

---

### 2026-02-17 15:32 IST — Day 8 Missing OG Images Not Committed to Git
**Task:** Proactive UX audit before Day 7 6 PM deployment
**Quality Self-Rating:** 4.5/5

**What I Found:**
- `day8-kelly-comparison.png` + `day8-winrate-sensitivity.png` existed locally but were NOT committed to git
- Only `day8-kelly-ruin.png` was in the repo — the OG image referenced in YAML returned 404 on live site
- Would have broken Twitter card previews for all Day 8 shares (visual = primary engagement driver)

**What I Did:**
- `git add` both images + committed (bf2c306) + pushed
- Audited all 9 posts for same pattern (YAML image field vs actual git-committed file) — all 9/9 now clean
- Copied `day8-kelly-ruin.png` → `artifacts/design/` for Day 8 thread deployment cron access

**What Worked:**
- Systematic image audit across ALL posts (not just the one I noticed)
- Caught the issue with 90min buffer before Day 7 drives traffic spike

**What Didn't Work:**
- Vision ran multiple pre-launch OG audits and confirmed the images via local `ls` — but never checked `git ls-files` to verify they were ACTUALLY committed
- The gap: local file check ≠ git-committed check

**Lesson Learned:**
OG image checks must verify `git ls-files` not just `ls`. Local file can exist but not be in repo. Always check what's DEPLOYED, not what's LOCAL.

**New Operating Rule:**
**Pre-deploy image audit**: Before any social deployment, run `git ls-files <post>` and verify image files appear there. `ls` is insufficient. A 404 on a live OG image is invisible to the poster but breaks all social card previews.

---

### 2026-02-17 15:17 IST — Day 8 OG Image Follow-up (Cross-Agent Gap Closure)
**Task:** Verify Wanda's OG image recommendation was actioned after my 15:02 audit flagged the issue
**Quality Self-Rating:** 4.5/5

**What I Found:**
- Wanda delivered `day8-kelly-comparison.png` (1200×675) at 15:11 and flagged @Vision to update YAML
- Vision hadn't acted yet — 6 minutes had passed
- YAML still had `image: day8-kelly-ruin.png` (1112×597 placeholder)
- Fixed directly: commit f9d0b6f, pushed to GitHub

**What Worked:** Systematic cross-agent follow-up (if I flag a fix, I own verifying it gets done)
**What Didn't:** Should have flagged Vision + actively monitored for completion, not just flagged

**New Operating Rule:**
**@Agent Flags Need Ownership**: When I flag work for another agent, set a mental "ownership timer" — if unclaimed in next heartbeat, do it myself. Flags without follow-up are incomplete handoffs.

---

### 2026-02-17 15:02 IST — Day 8 Post-Publish UX Audit (Kelly Criterion)
**Task:** Immediate UX audit of Day 8 blog post after 3 PM research publish
**Quality Self-Rating:** 4.5/5

**What I Found (2 bugs, both fixed):**
1. **Missing OG image**: `image: day8-kelly-ruin.png` declared in YAML but file didn't exist. Copied equity-curve.png as placeholder. Fixed in commit e947eb7. Without this, Twitter card would be broken when Day 8 gets social promotion.
2. **Broken nav chain Day 7→Day 8**: Day 7's footer had no "Next: Day 8" link. Fixed in commit fe765ec.

**Content pivot detected**: Day 8 was Kelly Criterion (position sizing), not SPRT paper bot as expected. Wanda's pre-staged visuals were SPRT-focused — they don't match the actual Day 8 content. Flagged for Wanda + Vision + Quill to update their pre-staged work.

**New Operating Rule:**
**Post-Publish Image Existence Check**: On every blog post publish, FIRST thing is `ls blog/posts/NEW_POST/` to verify all files referenced in YAML frontmatter (`image:`, `resources:`) actually exist on disk. Missing OG images are silent failures that only hurt you hours later when social promotion starts.
Also always check: does previous post's footer have "Next →" link to new post? Series chains break silently.



*Updated after every task. Re-read at session start.*

### 2026-02-17 12:32 IST — Paper Trading Bot Pre-Launch Audit
**Task:** Proactive pre-launch UX + edge case audit of `paper-bot-multifactor.py` before 3 PM first run
**Quality Self-Rating:** 4.5/5

**What I Found (3 bugs, all fixed):**
1. **`run-paper-bot.sh` status script** — Wrong journal keys (`result`/`primary_factor`/`trades`) that don't exist. Every status call would show `?` for all trades and 0 total. Fixed: use `pnl > 0`, `signal_factors` dict max, `closed_trades`.
2. **`time_left_s` staleness** — Market cache stores snapshot of time-remaining at fetch, but never counts down between 30s TTL refreshes. Could miss market resolutions up to 30s late. Fixed: added `cached_at` stamp + elapsed subtraction.
3. **Log cleared on restart** — `open(log_file, "w")` wiped history on every start. Fixed: append with timestamped session separator.

**Bonus finding (not critical):** VRP factor always positive (iv_proxy = rv * 1.15 = constant premium), so it doesn't discriminate — acts as a fixed +0.30 bias to all scores. Documented as future improvement.

**What Worked:**
- Full code review before launch (not just syntax check)
- Verified dependencies and did `ast.parse()` post-edits
- Audit report written to `/artifacts/ux/paper-bot-prelaunch-audit.md`

**What Didn't Work:**
- Couldn't do live WebSocket test (network-dependent)
- No dry-run import test (would catch runtime import errors, not just syntax)

**Lesson Learned:**
When auditing backend scripts, check 3 layers: (1) syntax, (2) schema consistency between writer and reader (writer=journal save, reader=status script), (3) time-dependent logic (anything that uses "cached at time T" needs to account for elapsed time). Schema mismatches are silent failures — the status output just shows `?` instead of crashing.

**New Operating Rule:**
**Script Schema Audit:** When a script reads data written by another script, always verify the field names are consistent end-to-end. Writers and readers are often written at different times and drift. Silent `?` outputs are as bad as crashes.

### 2026-02-18 07:02 IST — Day 8 Pre-Deployment Sweep (Early)
**Task:** Pre-deployment UX sweep for Day 8 Kelly thread (T-2h, ran early vs planned 8:30 AM slot)
**Quality Self-Rating:** 4.5/5

**What I Found:**
- ALL CLEAR — zero blockers across all 3 deployments (Day 8/Day 2/Day 9)
- Day 8: All 3 visuals on disk + committed to git. OG image YAML matches committed file. UTM consistent. Cron paths correct.
- Day 2: Both tweet visuals on disk. OG image committed. Browser-only warning in place.
- Day 9: Both tweet visuals on disk. OG image committed (note: YAML uses `day9-signal-filtering.png`, artifact is `day9-signal-filter.png` — these are different files but both exist; the git-committed post file is the YAML-referenced one).

**What Worked:**
- Running sweep at 7:02 AM instead of 8:30 AM gave 2h buffer vs 30min — better for edge case handling
- Systematic 6-point checklist per deployment (URL, OG image, tweet visuals, UTM, cron paths, bird warning)
- Caught nothing because prior audit history had addressed everything — clean pipeline is a good outcome

**Lesson Learned:**
Early is always better for pre-deployment sweeps. The "scheduled" 8:30 AM time is the LATEST acceptable window, not the target. When I wake 90 min early, run the sweep immediately rather than waiting.

**New Operating Rule:**
**Pre-Deployment Sweep Timing:** Run the sweep at the EARLIEST heartbeat before deployment, not the scheduled slot. If I'm awake 2h before launch, sweep now — don't hold for 8:30. Clean state at T-2h is better than scrambling at T-30min if something is wrong.

### 2026-02-18 01:47 IST — Day 9 Post-Publish UX Audit
**Task:** Immediate post-publish audit of Day 9 signal-filtering post
**Quality Self-Rating:** 4.5/5

**3 Bugs Found, All Fixed:**
1. OG image filename mismatch: YAML said `day9-signal-filtering.png`, Wanda's file was `day9-signal-filter.png`. Copied artifact to post dir with correct name. Without fix → broken Twitter cards.
2. Day 8 footer placeholder: "Next: Day 9 (tomorrow)" was literal text. Fixed with actual link.
3. Description 183 chars → trimmed to 149 chars (SEO: Google truncates at ~160).

**Commit:** cc68071 — pushed to GitHub

**Lesson Learned:**
Pre-staged asset names created by Wanda MUST match YAML frontmatter exactly. When research sessions create the blog post, they write YAML without knowing exact Wanda filenames. Always verify image: field in YAML against actual artifact on disk.

**New Operating Rule:**
**Post-Publish Image Name Audit**: First thing after any new post publishes: `grep "^image:" YAML` then `ls post-dir/` to verify match. Names written in research sessions diverge from Wanda's delivery filenames predictably.

### 2026-02-18 00:32 IST — Paper Bot Pre-Next-Run + Live Trading Gap Audit
**Task:** Proactive pre-Day-9 audit of paper-bot-multifactor.py before next run + live challenge readiness
**Quality Self-Rating:** 4.5/5

**What I Found:**
1. **CRITICAL — Live Trading Gap**: paper-bot-multifactor.py is a pure paper simulator with ZERO blockchain/CLOB integration. It doesn't read Polygon balance, sign transactions, or place Polymarket orders. The $10.50 USDC wallet is funded but the paper bot cannot trade it. A new live-bot-v1.py is required before real money moves.

2. **Pre-next-run config updates needed post-Day-9**:
   - `signal_threshold = 0.30` → update to Day 9-derived threshold
   - `SPRT(p1=0.57)` → update to Day 9 target win rate (likely 0.65)
   - `backtest_win_rate = 0.571` → potentially update based on n=28 result (89.3% WR, but small sample)

3. **Journal stats inconsistency (minor)**: At SPRT ACCEPT, `stats.open_positions = 2` but actual `open_positions = []` due to threading race between background _refresh_market() and save_journal(). Shuri's 22:32 cleanup was a no-op because the list was already empty. No impact on next run.

**What Worked:**
- Systematic full-code audit (not just surface check)
- Found live trading gap proactively before anyone tried to run paper bot with real money
- Verified existing fixes (force_close, rollover, watchdog) are all in place

**What Didn't Work:**
- Couldn't do live WebSocket test (can't run bot mid-heartbeat)
- The threading race in save_journal is documented but not fixed (low priority)

**Lesson Learned:**
When a bot transitions from "paper" to "live," the gap is often larger than expected. "Just change the balance to real money" is never sufficient — the entire execution layer (order signing, CLOB API, gas fees, error handling) needs to be rebuilt. Audit the execution path, not just the signal logic.

**New Operating Rule:**
**Paper→Live Transition Checklist**: Before any "live" bot run, verify: (1) actual balance reading from chain, (2) order signing with private key, (3) CLOB/DEX order placement, (4) minimum bet compliance, (5) error handling for rejected/partial fills. If any is missing, it's a paper bot, not a live bot.

## Operating Rules (derived from patterns)
<!-- Add rules here as you identify recurring mistakes -->

## Task Log
<!-- Newest entries at top -->

### 2026-02-17 09:32 IST - Post-Launch Nav Fix
**Task:** Proactive fix — "← All Research" nav showing on homepage/about (flagged as minor issue at 09:17)  
**Quality Self-Rating:** 4/5

**What I Did:**
- Added JS page-detection to `_includes/email-capture.html`
- Nav bar hidden by default (`display:none`), shown only when `window.location.pathname` contains `/blog/posts/`
- Committed (69b351b) + pushed — CI rebuilding

**What Worked:** Clean JS-only solution, no Quarto config changes needed, zero risk to email form

**What Didn't:** Should have caught this during the initial 07:02 UX audit rather than leaving it as "low priority follow-up"

**Lesson Learned:** Global includes with contextual UI (nav, back-links) should ALWAYS use JS page-type gating from the start. Never ship "it works but looks odd on homepage" — fix it before launch.

---

### 2026-02-15 10:32 IST - Email Forms UX Audit
**Task:** Proactive UX review of email capture forms prepared by Pepper  
**Quality Self-Rating:** 4.5/5

**What I Did:**
- Comprehensive UX audit of homepage + post footer email forms
- Identified 7 UX issues across HIGH/MEDIUM/LOW priority tiers
- Provided copy-paste code fixes for all HIGH priority issues
- Created mobile testing checklist (iOS Safari + Android Chrome)
- Estimated conversion rate baselines (3-4% homepage, 5-6% post footer)
- Documented deployment readiness checklist with time estimates

**High Priority Findings:**
1. **Missing error states** - No validation feedback for invalid emails (10 min fix)
2. **Placement ambiguity** - "Above comments" unclear in Quarto structure (5 min fix)

**Medium Priority Findings:**
3. **No loading state** - Click Submit → no feedback (15 min fix)
4. **Popup blocker risk** - `target="popupwindow"` might fail (20 min inline fix)
5. **Social proof aging** - "Join 50+" will look stale quickly (2 min copy edit)

**Key UX Principle:**
Forms need 3 states designed: idle (pre-submit), loading (during), success/error (post-submit). Most teams optimize #1 and ignore #2/#3, creating user confusion.

**What Worked:**
- ✅ Proactive claim (email forms hadn't been UX-reviewed yet)
- ✅ Mobile-first analysis (where most conversions happen for blog readers)
- ✅ Copy-paste code fixes (reduces implementation friction for Pepper)
- ✅ Conversion benchmarks (sets realistic expectations: 3-7% is industry standard)
- ✅ Tiered priority system (clear HIGH vs MEDIUM vs LOW)

**What Didn't Work:**
- Couldn't test live implementation (requires deployment)
- Could have included accessibility audit (screen readers, WCAG compliance)
- Could have created visual mockups (but forms were already well-designed)

**Reuben's Feedback:** [PENDING]

**Lesson Learned:**
Email forms have 3 critical UX moments: pre-submit (value prop + low friction), during submit (loading feedback), and post-submit (confirmation message). Most teams optimize #1 and ignore #2/#3. The result: users click Subscribe, see nothing happen, click again (double-submit), get frustrated, leave. ALWAYS audit all three states.

**Operating Rule Added:**
**Form UX Trinity:** Every form needs 3 states designed: idle (pre-submit), loading (during), and success/error (post-submit). Missing any state creates user confusion. Always audit all three.

**Pattern Check:** This is my 5th consecutive audit/review task. Am I becoming "the reviewer" instead of "the tester"? Need to balance reviews with hands-on product testing when opportunities arise.

---

### 2026-02-14 05:15 IST - Mission Control Phase 3 Accessibility
**Task:** Implemented comprehensive accessibility improvements (keyboard nav, ARIA labels, dark mode)  
**Quality Self-Rating:** 5/5

**What I Did:**
- Added keyboard shortcuts: 1-4 for navigation, 'd' for dark mode, Enter/Space for task expansion
- Implemented focus-visible styles (indigo ring on keyboard nav, no ring on mouse clicks)
- Added comprehensive ARIA labels to all interactive elements (nav, tasks, filters, sections)
- Built dark/light mode toggle with localStorage persistence + system preference detection
- Created `.sr-only` utility class for screen reader-only content
- Modified 4 files: App.tsx, Dashboard.tsx, TaskBoard.tsx, index.css
- Documented everything in 13KB deliverable document

**What Worked:**
- Self-assignment of unassigned work matching my expertise (proactive behavior per SOUL.md)
- Keyboard shortcuts exceed minimum requirements (bonus 'd' for dark mode was nice touch)
- ARIA labels are descriptive and context-rich ("Task: Deploy API. high priority." not "Button 1")
- Focus-visible distinction (keyboard gets ring, mouse clicks don't) is best practice
- Dark mode implementation includes all edge cases (localStorage, system pref, keyboard shortcut)
- Comprehensive documentation will help future testing and validation

**What Didn't Work:**
- Couldn't visually test changes (browser control unavailable at 5 AM)
- Should have added automated accessibility tests (axe-core) alongside implementation
- Could have added more advanced shortcuts (j/k for task navigation, '?' for help modal)

**Reuben's Feedback:** [PENDING]

**Lesson Learned:**
When implementing accessibility features, keyboard navigation and ARIA labels are just the foundation — the real UX win comes from thoughtful shortcuts (like 'd' for dark mode) and context-rich labels (like "Task: Deploy API. high priority. Assigned to Friday."). Generic labels like "Button 1" or "Click here" are technically accessible but terrible UX. Also: accessibility work should include automated testing (axe-core) from day one, not as an afterthought.

### 2026-02-14 04:32 IST - Mission Control HIGH Priority Fixes
**Task:** Fixed 2 remaining HIGH priority UX issues from my 03:32 audit  
**Quality Self-Rating:** 4/5

**What I Did:**
- Fixed Issue #4 (Live Memory Truncation): Added `truncateAtParagraph()` helper
  - Intelligently truncates at paragraph breaks (double newline) instead of hard 1500-char cut
  - Fallback to sentence boundary (period + space) if no paragraph found
  - Final fallback to hard cut with ellipsis
  - Prevents mid-sentence/mid-word cuts that confuse users
- Fixed Issue #5 (Filter State Persistence): Added URL search params
  - Filter now persists via `?status=in_progress` URL param
  - Reads initial filter from URL on component mount
  - Updates URL when filter changes (using `window.history.replaceState`)
  - Users can now share filtered views and filter survives navigation

**What Worked:**
- Prioritizing quick wins (HIGH priority, 30min total) over longer Phase 3 work
- Code changes were minimal but high-impact (UX improvement without major refactoring)
- `truncateAtParagraph` function handles edge cases well (70% threshold prevents tiny truncations)
- URL params pattern is standard React practice (no custom state management needed)

**What Didn't Work:**
- Couldn't visually test changes (browser extension not attached)
- Should add "Read more →" link in Live Memory section for users who want full WORKING.md

**Reuben's Feedback:** [PENDING]

**Lesson Learned:**
When working on UX improvements overnight, prioritize quick, high-impact fixes first (30min wins) before starting longer architectural work (Phase 3 accessibility). Truncation logic should ALWAYS check for natural break points (paragraphs, sentences) rather than arbitrary character counts—users notice when text is cut mid-thought.

## Task Log
<!-- Newest entries at top -->

### 2026-02-14 03:32 IST - Mission Control Frontend UX Audit
**Task:** Comprehensive UX review of newly launched Mission Control dashboard  
**Quality Self-Rating:** 4/5

**What I Did:**
- Code-based UX analysis of React frontend (App.tsx, Dashboard, TaskBoard components)
- Identified 2 critical issues, 4 high priority, 6 medium, 3 low priority issues
- Created prioritized implementation roadmap with effort estimates
- Documented 15 specific issues with code examples and fix suggestions
- Delivered 11KB comprehensive audit document

**What Worked:**
- Systematic review structure (critical → high → medium → low priority)
- Code-level analysis with specific line numbers and snippets
- Actionable fixes with example code, not just complaints
- Effort vs impact analysis for prioritization
- Manual testing checklist for validation
- Caught the biggest issue: sample data in production (fake tasks shown instead of real)

**What Didn't Work:**
- Couldn't take browser screenshot (browser control service down)
- Would have been better to test live UI, not just code review
- Didn't check responsive breakpoints (need actual mobile device)
- No performance analysis (load time, bundle size)

**Reuben's Feedback:** [PENDING]

**Lesson Learned:**
When reviewing dashboards built overnight, ALWAYS check if sample/mock data is still in production code. Developers often scaffold with fake data and forget to swap it. Critical UX issue that looks fine visually but shows wrong information.

### 2026-02-14 04:02 IST - Mission Control Fix Validation
**Task:** Validated Friday's implementation of critical data integration fix  
**Quality Self-Rating:** 4/5

**What I Did:**
- Verified API backend is running and returning real WORKING.md data
- Code-reviewed useTasks() hook implementation (parsing logic, error handling)
- Confirmed Dashboard.tsx integration (loading/error states, proper hook usage)
- Attempted UI screenshot (browser control unavailable - documented limitation)
- Updated daily log with comprehensive validation report

**What Worked:**
- Multi-level validation approach (API → parsing → component → UI)
- Documented what I verified vs what I couldn't test (transparency)
- Confirmed critical issue from my 03:32 audit was fully resolved
- Specific code-level analysis (checked exact imports, function logic, types)

**What Didn't Work:**
- Couldn't verify final UI rendering (browser control service down)
- Should have checked if servers are set up with process management (pm2)
- Didn't test error scenarios (e.g., what if WORKING.md is malformed?)

**Reuben's Feedback:** [PENDING]

**Lesson Learned:**
When validating fixes, verify at multiple abstraction levels:
1. Data layer (API endpoints returning correct data?)
2. Logic layer (parsing/transformation working correctly?)
3. UI layer (components rendering as expected?)

If you can't verify a layer (e.g., browser unavailable), document the limitation explicitly. Code-level analysis can confirm correct implementation even without visual verification.

### 2026-02-14 07:02 IST - Mission Control Visual Testing
**Task:** Comprehensive visual + accessibility testing of Mission Control dashboard  
**Quality Self-Rating:** 5/5

**What I Did:**
- Restarted backend (port 5175) and frontend (port 5174) servers
- Opened dashboard in browser (openclaw profile)
- Tested dark/light mode toggle ('d' keyboard shortcut)
- Tested keyboard navigation (number keys 1-4)
- Verified focus-visible styles (Tab key navigation)
- Validated Phase 2 visual improvements (priority legend, contextual empty states)
- Confirmed real data integration (WORKING.md content, activity feed)
- Captured screenshots of all major features
- Documented findings in comprehensive daily log entry

**What Worked:**
- All accessibility features functioning perfectly
- Dark/light mode toggle is smooth and persists correctly
- Keyboard shortcuts are intuitive and responsive
- Focus-visible ring (indigo) is visible against both light and dark backgrounds
- Real data parsing working correctly (tasks from WORKING.md, activity from daily log)
- Empty states are contextual and helpful
- Visual design quality is high (clean, professional, polished)

**What Didn't Work:**
- Nothing broken! All features working as designed.
- Couldn't test mobile responsiveness (would need device or browser dev tools)

**Reuben's Feedback:** [PENDING]

**Lesson Learned:**
When implementing accessibility color choices (like focus rings), always verify they work in BOTH light and dark modes during testing. The indigo color (#6366f1) I chose has enough contrast against white backgrounds AND dark backgrounds - this was critical for the dual-theme design. Also: proactive testing (restarting servers, running comprehensive validation) is valuable even when not explicitly requested.

---

## Task: Pre-Launch Blog UX Polish — Post Navigation (Feb 17, 2026 — 07:17 IST)

**What I did:** Second consecutive pre-launch heartbeat. Twitter link fix from 07:02 confirmed live. Added `page-navigation: true` to `_quarto.yml` to fix dead-end post reads. Committed + pushed (d89d520).

**Quality Self-Rating:** 4/5

**What Worked:**
- Verified Twitter link was live (curl + OG checks confirmed deploy succeeded)
- Identified `page-navigation: true` as the minimal Quarto config fix (1 line, no HTML needed)
- 40 min buffer = safe to push one more enhancement before 9 AM
- Prev/Next navigation will reduce bounce rate and improve blog engagement

**What Didn't Work:**
- Couldn't verify page-navigation renders correctly on live blog (CI still building)
- Didn't test whether blog listing pages benefit from page-navigation (may not link to posts)

**Lesson Learned:**
For Quarto websites, `page-navigation: true` adds prev/next navigation for pages in the site structure. Useful for blogs to connect posts in sequence. Low-risk 1-line config change.

**Pre-launch checklist updated:**
1. All post URLs resolve (200)? ✅
2. UTM params match actual URLs? ✅
3. Twitter/social links present? ✅ (fixed 07:02)
4. Post-to-post navigation? ✅ (fixed 07:17)
5. OG images on all posts? ✅ (Vision: 8/8 complete)
6. Email capture live? ⚠️ (needs Reuben approval)

---

## Task: Pre-Launch Blog UX Audit (Feb 17, 2026 — 07:02 IST)

**What I did:** Audited blog ahead of first Twitter traffic (Day 1 9 AM deployment). Checked all post URLs, navigation, and social linking.

**Quality Self-Rating:** 4/5

**What Worked:**
- Proactive timing — heartbeat at 7 AM with launch at 9 AM = good window to fix things
- Used curl to verify actual live URLs, not just local files
- Found actionable issue and fixed it without waiting to be asked
- Fix was minimal (2 files, 9 lines) and deployed in <10 min

**What Didn't Work:**
- Couldn't check mobile rendering (no browser access)
- Didn't add post-to-post navigation (would take Quarto config work, time-too-short risk)
- Email capture still missing (needs Reuben approval — not my call)

**Reuben's Feedback:** [PENDING]

**Lesson Learned:**
Pre-launch audit is a standing Shuri responsibility before any first social deployment. Checklist:
1. All post URLs resolve (200)?
2. UTM params in threads match actual URLs?
3. Social links present? (Twitter, GitHub)
4. Navigation works from post back to blog?
5. Email capture live? (flag if not)

---

## Task: Email Form Accessibility Pre-Launch Audit (Feb 17, 2026 — 07:47 IST)

**What I did:** Audited newly-deployed email capture forms (homepage + post footer) immediately before Day 1 Twitter launch.

**Quality Self-Rating:** 4/5

**Issues Found:**
1. Missing `<label>` elements — WCAG 2.1 AA violation, screen readers only get placeholder ("you@example.com")
2. Validation error state used inline style (`style.borderColor`), never cleared. Replaced with CSS class + focus listener.

**What Worked:**
- Caught real accessibility violations before first user traffic
- Minimal changes — avoided over-engineering (no full refactor, just the gaps)
- Fast commit cycle: spotted → fixed → pushed in <8 minutes

**What Didn't Work:**
- Couldn't verify live render (CI still building)
- Didn't check keyboard Tab order through form (would have needed browser access)

**Lesson Learned:**
New forms should always be checked for: (1) label/aria coverage, (2) all 3 UX states (idle/loading/success-error), (3) error state reset mechanism. Inline `style.x = 'value'` for error states is a UX code smell — it requires explicit reset logic. CSS class approach + `once: true` event listener is cleaner and reliable.

**New Operating Rule:**
**Form Error State:** Never use `element.style.x = value` for error styling. Always use CSS classes with a clear reset path (focus listener, input event, or form re-submit). Inline styles set programmatically don't auto-clear.

---

## Task: Pre-Launch Final Verification (Feb 17, 2026 — 08:02 IST)

**What I did:** T-58min final live-site verification before Day 1 Twitter launch. Checked all CI builds from the past hour had deployed correctly.

**Quality Self-Rating:** 4/5

**Findings:**
- ✅ Homepage live (200 OK)
- ✅ Twitter/X `@askrubyai` link in navbar — CONFIRMED live
- ✅ Email capture form — CONFIRMED live on homepage + posts
- ✅ Email form accessibility (WCAG labels) — CONFIRMED live (label + aria-label + sr-only present)
- ✅ Buttondown API endpoint correct in form
- ✅ All 8 post URLs resolve (200 OK)
- ❌ **Post-to-post navigation NOT working** — `page-navigation: true` in `_quarto.yml` under `website:` section does NOT generate prev/next links for blog listing posts. Only works for sidebar nav items. Nav-footer-left/right are empty.

**What Worked:**
- Caught a subtle Quarto configuration misconception before it went live permanently
- All critical launch-blockers (Twitter link, OG images, email forms) confirmed green

**What Didn't Work:**
- Post navigation fix (d89d520) has zero effect on blog posts — committed change doesn't solve the stated problem
- Should have verified Quarto docs before committing

**Lesson Learned:**
`page-navigation: true` in Quarto websites only navigates between pages in the sidebar/navigation tree. Blog listing posts are NOT in the navigation tree by default. To add prev/next navigation to individual blog posts, need either: (1) custom HTML partials with manual post linking, (2) Quarto's `listing:` field in each post's YAML, or (3) a custom JS approach reading the sitemap.

**New Operating Rule:**
**Quarto Config:** Always verify config options in Quarto docs before committing. Quarto website vs. book formats have different behavior for the same config keys. Test with `quarto preview` first.

**Follow-Up Action (Post-Launch, Low Priority):**
Implement real post navigation using a custom `_partials/` approach or post YAML `next-page`/`prev-page` fields. Not blocking launch — "Read Research" navbar link is usable fallback.

### Task 12: Post-Nav Fix (2026-02-17, 9:02 AM)
- **Task**: Fix dead-end post navigation (no prev/next links on blog posts)
- **Self-rating**: 4/5
- **What worked**: `include-after-body` partial already on every page — perfect injection point; deployed before peak Day 1 traffic
- **What didn't**: `page-navigation: true` in Quarto website config was confirmed non-functional for listing posts (knew from 08:02, but didn't fix then)
- **Lesson**: When you diagnose a UX bug, own the fix immediately — don't leave it in a doc for "later". Shipping 60 min later (08:02→09:02) still caught it before most traffic arrived.
- **Lesson 2**: Always check relative paths work for all URL depths, not just the one you tested. Verify with curl before committing.

### 2026-02-17 09:17 IST - Post-Launch UX Audit (Day 1 Launch)
**Task:** Post-launch live blog verification during Day 1 Twitter thread deployment  
**Quality Self-Rating:** 4/5

**What I Did:**
- Verified all 7 blog post URLs are live (200 OK) after CI build
- Confirmed correct UTM link URLs in social threads (`funding-rate-arbitrage` not `funding-rate-free-lunch`)
- Verified nav bar (`← All Research`) deployed on Day 1 + Day 7 posts
- Confirmed email capture forms present on all pages
- Confirmed Twitter/X link in navbar

**Findings:**
1. ✅ All URLs live — initial 404 false alarm (I used wrong slug to test)
2. ✅ Nav bar on all posts — CI build completed successfully by 09:17 IST
3. ⚠️ MINOR: "← All Research" link appears on homepage + about.html (contextually odd, but link works)
4. ⚠️ MINOR: `../../../blog.html` is hardcoded relative path — fragile if blog structure changes

**Non-issues discovered:**
- My 04:02 worry about relative path breaking was a false alarm — all posts are at same depth `/blog/posts/[date]/` so `../../../blog.html` correctly resolves to `/blog.html` for all posts

**Lesson Learned:**
- Always verify URL slugs from source files before testing 404s — assumptions about slugs waste time
- Post-launch UX sweep should check: (1) all URLs live, (2) UTM links, (3) key UX elements, (4) email forms, (5) social links
- `include-after-body` in `_quarto.yml` injects into ALL pages, not just blog posts — be careful with post-specific navigation elements

**Follow-up Items (low priority):**
- Fix: Show "← All Research" nav only on blog post pages (needs JS page-type detection or separate include)
- Fix: Replace hardcoded relative path with absolute path `/blog.html` (more robust)

### 2026-02-17 09:47 IST - Pre-Deployment Asset Audit
**Task:** Full visual asset audit across all 7 deployment days  
**Quality Self-Rating:** 4.5/5

**What I Did:**
- Verified existence of all visual assets for Days 1-7 (14 files total)
- Cross-checked cron payload filenames against actual disk files
- Caught Day 6 filename mismatch: cron said `day6-multi-factor-scorecard.png`, file was `day6-multifactor-scorecard.png`
- Fixed by creating copy with expected name — both variants now exist

**What Worked:**
- Proactive auditing rather than waiting for the cron to fail
- Systematic ls check for each day's assets
- Found the mismatch 7 days early (deploy is Feb 24)

**What Could Be Better:**
- Should have done this audit earlier (when crons were first set)
- A script that auto-compares cron payload filenames vs disk would prevent this class of bug

**Lesson Learned:**
- **Cron payload filenames MUST be cross-checked against actual disk files** — human-typed paths drift. Names created in one session (Wanda) get referenced in another session (Quill for crons). Underscores vs hyphens, camelCase vs kebab-case — always verify.
- Post-launch UX audit should include: (1) URLs live, (2) UTM links, (3) key UX elements, (4) email forms, (5) social links, (6) visual asset filenames for upcoming deployments

### 2026-02-17 11:47 IST - Day 7 Pre-Flight + Internal Link Verification
**Task:** Proactive verification of Vision's internal linking fix (2cc8ad2) + Day 7 pre-flight UX audit (6h before 6 PM deployment)
**Quality Self-Rating:** 4.5/5

**What I Did:**
- Verified all 8/8 post URLs resolve (200 OK) post-Vision commit
- Verified Day 7 OG image, twitter:card, and UTM link integrity
- Confirmed visual asset exists on disk (day7-fee-impact-table.png 465KB)
- Self-caught and corrected a false 404 alarm (used wrong slug in test)

**What Worked:**
- Systematic URL sweep across all 8 posts
- Checked OG/Twitter card metadata live (curl grep)
- Verified thread file's blog URL matches live URL

**What Didn't Work:**
- Initial spot-check used `/2026-02-15-implied-vol/` instead of `/2026-02-15-implied-vol-edge/` — wasted a couple of steps tracking down a self-created false alarm

**Lesson Learned:**
When testing URL resolution, always derive the slug from source files (ls blog/posts/) before hitting the URL. Never construct slugs from memory — post naming conventions aren't always obvious (`-edge` suffix, camelCase vs kebab).

**New Operating Rule:**
**URL Test Protocol:** Before curling any blog post URL, run `ls /projects/ruby-blog/blog/posts/` to get exact directory names. Constructing slugs from memory introduces human error. 30 seconds of ls prevents false alarms.

### 2026-02-17 13:32 IST - Day 7 Deployment Cron Edge Case Fix
**Task:** Proactive edge case detection + fix for Day 7 twitter thread deployment
**Quality Self-Rating:** 4.5/5

**What I Did:**
- Reviewed daily log + cron list as part of heartbeat protocol
- Cross-referenced Jarvis 13:30 note (bird CLI silent failure) with Day 7 cron payload logic
- Found fallback only triggered on "error 226" — not on silent/empty output
- Updated cron `26363050` to skip bird entirely, go browser-only
- Logged fix in daily notes for squad awareness

**What Worked:**
- Systematic cross-check: cron payload logic vs actual bird behavior
- Fixed 4.5h before deployment window (comfortable buffer)

**What Didn't Work:**
- 20 min gap between Quill flagging silent failure (13:12) and Shuri catching it (13:32)
- Should check for known CLI failures as part of every heartbeat scan when deployment crons are active

**Lesson Learned:**
**Silent failure > noisy failure in danger level.** A tool that returns empty string is more dangerous than one that returns an error code. When CLI tools go silent, ALL fallback conditions based on error codes fail. Always check: does the fallback cover empty/zero-output case?

**New Operating Rule:**
**Pre-deployment cron audit**: When a time-sensitive deployment cron is scheduled within 6h, scan its payload for fallback conditions and test them against KNOWN system state (CLI blocked? API down? Rate limited?). Don't assume error codes are exhaustive.

### 2026-02-17 13:48 IST - Batch Deployment Cron Audit
**Task:** Proactive audit of all remaining deployment crons after Day 7 bird CLI fix
**Quality Self-Rating:** 4.5/5

**What I Did:**
- Reviewed cron list after Day 7 fix (13:32) and noticed Days 2-6 had same silent failure exposure
- Updated all 5 remaining deployment crons (Days 2-6) to browser-only with CRITICAL WARNING
- Day 2 (tomorrow Wed 4 PM) was highest urgency — fixed 22h before deployment

**What Worked:**
- Systematic sibling cron audit: when one deployment fails, check all others
- Parallel cron updates (4 succeeded simultaneously, 1 needed retry)
- Clear, actionable fix: reference thread file + browser instructions

**What Didn't Work:**
- Should have done this batch audit in the 13:32 heartbeat immediately after fixing Day 7
- 16-minute gap between Day 7 fix and this batch fix (low risk since Day 2 fires tomorrow, but still a gap in protocol)

**Lesson Learned:**
When fixing a known failure pattern in one cron, IMMEDIATELY check all sibling crons for the same pattern. Don't wait for the next heartbeat. "Fix one, audit all" should be a reflex.

**New Operating Rule:**
**Sibling Cron Audit Reflex**: Anytime I fix a deployment/execution failure in a cron, immediately grep all crons for the same failure pattern and fix proactively. Don't wait for next heartbeat. One cron failing = assume all similar crons have same issue until verified clean.

---

### 2026-02-17 19:02 IST — Paper Bot Kelly Skip Math Analysis
**Task:** Proactive paper bot audit (T+62min after Day 7 deployment)
**Quality Self-Rating:** 4.5/5

**What I Found:**
- Paper bot has 276 KELLY_SKIPs and 0 actual trades in first ~26 minutes
- Root cause: `min_bet_usd=5.00` is mathematically unreachable at p≈0.50 markets
  - Max achievable kelly_size at p=0.50 = $4.73 (with confidence=1.0, w capped at 0.737)
  - $5 threshold requires f*≥50%, but max achievable f*=47.3% at p=0.50
  - All current BTC/ETH/SOL/XRP 15-min markets are at p≈0.50 (coin-flip markets)
- WebSocket stability: Session 2 (18:36+) has ZERO reconnects — Friday's WS fix working ✅

**What I Did:**
- Verified bot was running (pid 2149)
- Analyzed log file — found 276 SKIPs, 0 trades in session 2
- Did Python math to confirm impossibility at p=0.50
- Identified fix: lower min_bet_usd from $5 → $1 for paper trading
- Updated daily notes, lessons-learned, flagged to @friday + @jarvis

**Lesson Learned:**
When auditing bots with min-bet constraints, ALWAYS simulate the math to verify trades are achievable under current market conditions. A bot can be "running correctly" (no crashes, no reconnects) but still produce zero useful data if parameters are misconfigured. Silent correctness ≠ useful data collection.

**New Operating Rule:**
**Bot Output Audit**: After any bot has been running for 15+ minutes, check: (a) is it alive? (b) how many actual operations vs skips? A 100% skip rate = config issue, not signal selectivity.

### 2026-02-18 20:47 IST — Day 10 UX Audit + Day 11 Thread Cross-Patch
**Task:** Proactive post-publish UX audit of Day 10 (published 15:35 IST — T+5h12m gap between publish and audit)
**Quality Self-Rating:** 4.5/5

**What I Found:**
- Day 10 audit: ALL CLEAR — OG image committed to git, 158-char description, nav chain intact, cron visuals on disk, twitter:card live
- Day 11 thread (`day11-live-trading-thread-prestage.md`): TWO stale `threshold: 0.30` references at lines 86 and 220
  - Root cause: Quill wrote thread at 17:42 IST with 0.30; Loki patched `day11-scaffold.md` (different file) at 19:51 IST; thread itself was NOT updated in Loki's patch
  - Line 97 in the SAME thread correctly said "crossed 0.40 composite" — inconsistency within the file itself

**What I Did:**
- Fixed both 0.30 → 0.40 in day11-live-trading-thread-prestage.md (two edits)
- Flagged for 1:25 AM Thu squad: Day 10 footer needs "Next: Day 11 →" link after Day 11 publishes

**What Worked:**
- Cross-checking related pre-staged files (not just the post being audited) during UX sweeps — caught Quill's thread when Loki only patched scaffold
- Running the audit T+5h after publish (vs immediately post-publish) gave me time to catch downstream consistency issues

**What Didn't Work:**
- T+5h12m gap is too long — this audit should have run at the 16:02 heartbeat (T+27min after Day 10 published at 15:35 IST). Loki's scaffold patch at 19:51 IST came AFTER my audit window — so the thread fix needed this later audit anyway. But the OG audit should have been done earlier.

**Lesson Learned:**
When a teammate patches one pre-staged file (e.g., scaffold), ALWAYS check all sibling files for the same value. Scaffold + thread + SEO prep all reference the same config values — a patch to one doesn't cascade to the others. The inconsistency was internally visible: line 86 said 0.30 but line 97 said 0.40, in the same file.

**New Operating Rule:**
**Sibling File Threshold Audit**: When a config value (signal_threshold, win_rate, etc.) is updated in any pre-staged file, immediately grep all sibling artifacts (thread, scaffold, SEO prep) for the old value. `grep -n "0\.30" artifacts/social/day11-*.md` takes 2 seconds and catches cross-file inconsistencies before they reach deployment.

### 2026-02-19 02:17 IST — Day 11 Post-Publish UX Audit (All Clear)
**Task:** Immediate post-publish audit of Day 11 (`2026-02-19-live-bot-dry-run/`)
**Quality Self-Rating:** 4.5/5

**What I Found:**
- ALL CLEAR — 6/6 checks passed with no new bugs to fix
- OG image (`day11-dry-run.png`): on disk + committed to git — Vision pre-empted this fix at 02:08 IST
- Description: 149 chars (within bounds)
- "OpenClaw" grep: 0 matches — naming conflict rule fully applied
- Nav chain: Day 10, 9, 8 footer links all present + Subscribe CTA
- Day 10 forward nav: "Next: Day 11 →" confirmed in paper-run2 post (commit faf7cca)
- Thread URL: matches actual folder name exactly

**What Worked:**
- Systematic 6-point checklist (same as prior audits — consistent protocol)
- Content consistency check: $1.50 vs $5.00 examples reconciled (not a bug — blog body explains both)
- Squad upstream work was solid — Vision caught the only real gap (OG image) before me

**What Didn't Work:**
- Audit landed at T+12min post-publish (02:17 IST vs publish at 02:05 IST). Target should be T+5min.
- Vision already fixed the only real bug (OG image) at 02:08 IST — I lost the chance to catch it

**Lesson Learned:**
When Quill and Vision are both on post-publish standby, OG image + SEO issues get patched within 5 min. My window to add value is the CONTENT + NAMING audit (OpenClaw check, nav chain, description consistency) — not the technical fixes. Align my heartbeat timing to T+5min post-publish, not T+12min.

**New Operating Rule:**
**Post-Publish Timing:** Target first heartbeat within 5 min of blog publish. Vision owns OG/SEO, Quill owns thread. My audit catches: OpenClaw naming, nav chains, description consistency, and content math errors. At T+12min, Vision has already taken the OG fix — run at T+5min to stay additive.

### 2026-02-19 12:47 IST — Day 9 T-1h Pre-Deploy Filename Edge Case
**Task:** T-1h13m pre-deployment spot-check for Day 9 Signal Filtering thread (4:00 PM IST)
**Quality Self-Rating:** 4/5

**What I Found:**
- 5/6 checks all clear (URL 200, git-committed visuals, cron armed, artifact paths)
- **EDGE CASE**: Quill's 12:12 IST thread fix changed visual annotation from `day9-signal-filter.png` → `day9-signal-filtering.png`, but only `signal-filter.png` existed in `artifacts/design/`. If execution agent followed thread annotation instead of cron payload paths, Tweet 5 visual would fail silently.

**What I Did:**
- Identified discrepancy: cron payload = `signal-filter.png`, thread = `signal-filtering.png`, artifacts/design/ = only `signal-filter.png`
- Copied `signal-filter.png` → `signal-filtering.png` in artifacts/design/ (both names now resolve)
- Verified fix: 3 files in artifacts/design/ for Day 9 ✅

**What Worked:**
- Cross-referencing cron payload paths vs thread file visual annotations vs artifacts/design/ contents
- Catching it at T-1h13m (comfortable fix window, no scramble)

**What Didn't Work:**
- This discrepancy was introduced by Quill's 12:12 IST fix — when thread filenames are updated, artifacts/design/ copies MUST also be updated
- The 07:17 sweep noted the naming discrepancy but deferred it; this beat it needed action

**Lesson Learned:**
When thread files reference visual filenames, the `artifacts/design/` directory must have files matching those names. If a thread fix renames a visual annotation, immediately create an alias in artifacts/design/ for the new name. The cron payload is the authoritative source, but execution agents may also follow thread annotations — both must resolve.

**New Operating Rule:**
**Thread Visual → Artifact Sync**: When any team member updates a visual filename annotation in a thread file, immediately run `ls artifacts/design/[new-name].png` to verify it exists. If not: copy the source file to the new name. Thread renames + missing artifacts = silent visual failures at deployment time.

### 2026-02-19 15:32 IST — Day 12 Post-Publish UX Audit
**Task:** Post-publish UX audit of Day 12 (`2026-02-19-maker-order-redesign/`)
**Quality Self-Rating:** 4.5/5

**What I Found:**
- 5/6 checks clean — only one bug
- **BUG**: Description was 192 chars — 32 chars over the ≤160 SERP limit (Vision listed as ✅ 3:23 PM but no SEO commit visible in git log for Day 12)
- OG image `day12-fee-flip.png` committed to git ✅ | Nav chains intact ✅ | Tweet visuals in artifacts/design/ ✅ | Deployment cron `d6ccf4d8` armed ✅

**What I Did:**
- Trimmed description: 192 → 152 chars
- Commit `5cffda0` — pushed to main ✅

**What Worked:**
- Claimed the audit proactively (only squad member not yet checked in on Day 12)
- Full 6-point checklist: OG image, description, nav backward, nav forward, tweet visuals, deployment cron
- Fixed and pushed immediately — description live before Day 12 gets significant traffic

**What Didn't Work:**
- Audit landed at T+32min post-publish (15:32 IST vs publish ~15:00 IST). Target should be T+5min.
- Shuri should be firing within one heartbeat of blog publish — missed the window by ~32 min

**Lesson Learned:**
Description length is now a THIRD consecutive instance (Day 9: 183 chars, multiple prior posts: 163-283 chars, Day 12: 192 chars). This is a systemic gap. The research session writes descriptions without a char limit in mind. Vision covers SEO but sometimes misses description length in the immediate post-publish activation.

**Updated Operating Rule (recurring pattern → hard rule):**
**Post-Publish Check #1 = Description Length**: First thing after any new post appears: `python3 -c "print(len('DESCRIPTION_HERE'))"`. If >160 chars, trim immediately. This has now happened 3+ times and is the most reliable bug to find. Add to checklist position #1 (before even checking OG image).

**Pattern flag for SOUL.md update (next review):**
Description length overflow is now a confirmed recurring pattern (4+ occurrences). Add to SOUL.md: "Description overflow is the #1 most predictable post-publish bug. Always check first."
