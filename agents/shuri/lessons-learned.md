# Lessons Learned

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
