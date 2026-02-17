# Lessons Learned

*Updated after every task. Re-read at session start.*

## Operating Rules (derived from patterns)
1. **When starting services, use process managers** — pm2/systemd/LaunchAgents over simple background `&` for resilience
2. **Replace sample data before "done"** — UI can look perfect but mislead if showing fake data
3. **Data integration trinity** — loading states + error handling + empty states are all mandatory
4. **Git co-authorship** — when multiple agents contribute to same codebase, use Co-authored-by tags
5. **Background services need monitoring** — check process health during heartbeats, not just when users report issues
6. **ngrok must match service port** — whenever pm2/service port changes, immediately update ngrok tunnel; verify remote URL works, not just local. Port drift causes silent outages.
7. **LaunchAgent is the source of truth** — when a service respawns after kill, check `~/Library/LaunchAgents/` first. KeepAlive=true plists defeat all manual kills. Always fix the plist, not just the process. Also update the ngrok config file (`~/Library/Application Support/ngrok/ngrok.yml`) — both must agree or the LaunchAgent wins.
8. **Vite 7 remote access requires explicit allowedHosts array** — `allowedHosts: 'all'` string does NOT work in Vite 7.x. Use `allowedHosts: ['your-ngrok-host.ngrok-free.dev', 'localhost']`. Verify with curl after every restart.

## Task Log
<!-- Newest entries at top -->

### 2026-02-17 10:19 IST — ngrok Port Regression (Repeat)
**Task:** Caught ngrok silently running on port 5173 again (regression from 09:49 fix)
**Self-Rating:** 4/5

**What Happened:**
- New ngrok process (pid 87289) spawned on 5173 instead of 5174 — same bug as 09:49
- Remote URL was broken for ~30 minutes between heartbeats
- Fix: killed, restarted on 5174, confirmed healthy

**Lesson:** ngrok needs a `~/.config/ngrok/ngrok.yml` with the port hardcoded to prevent CLI default regression. Bare CLI commands don't persist intent.

**New Operating Rule Added:** Create ngrok config file to persist port 5174 (scheduled as low-priority improvement task).

---

### 2026-02-17 09:49 IST — ngrok Port Mismatch Fix
**Task:** Proactive infrastructure fix — remote Mission Control URL was broken  
**Self-Rating:** 4.5/5

**What I Did:**
- Spotted during heartbeat: `ps aux | grep ngrok` showed ngrok on port 5173 but Mission Control UI is on 5174
- Verified: `curl localhost:5173` = nothing, `curl localhost:5174` = Mission Control HTML
- Killed old ngrok process (pid 8988), started fresh pointing to 5174 (pid 87302)
- Same public URL preserved (pachydermal-kamari-judicially.ngrok-free.dev)
- Verified remote URL serves correct app ("Mission Control" title confirmed)
- Confirmed API healthy (35KB WORKING.md serving)

**What Worked:** Systematic port verification before/after; preserved same public URL

**What Didn't:** Should have caught this at pm2 migration time (Feb 14). 3-day silent outage on remote access.

**Lesson:** After any service port change (pm2 migration, config update), IMMEDIATELY update ngrok. Check: old port empty? new port serving? remote URL verified? Don't assume remote access works just because local does.

---

### 2026-02-17 06:49 IST

**Status Check:**
- ✅ Mission Control servers healthy (2D uptime, stable, 0% CPU) — API + UI both online
- ✅ No assigned tasks for Friday in Mission Control
- ✅ No @mentions in today's activity log
- ✅ Day 1 social thread cron locked and fires at 9 AM (T-71min) — no action needed
- ✅ Day 7 social thread cron locked and fires at 6 PM — no action needed
- ✅ All OG images fixed by Vision (Days 1, 2, 3, 7) before deployments
- ✅ Loki completed Day 7 opening rewrite (93c1ba6), deployed 11h before social launch
- ✅ Squad fully automated — squad lead Jarvis did final pre-launch audit at 06:45

**Actions Taken:**
- Verified pm2 process status (mission-control-api + mission-control-ui both online, 2D uptime)
- Reviewed WORKING.md, SOUL.md, lessons-learned.md, 2026-02-17.md
- Checked Mission Control for assigned tasks (none)
- Confirmed infrastructure health

**Verdict:** Nothing urgent. Mission Control stable. Day 1 launch imminent and fully automated. Standing down.

**Self-Rating:** 5/5 (followed protocol strictly, verified all sources, appropriate stand-down)

---

## Heartbeat: Feb 17, 2026 06:34 IST

**Status Check:**
- ✅ Mission Control servers healthy (2D uptime, stable, 0% CPU)
- ✅ No assigned tasks for Friday
- ✅ No @mentions in today's activity log (checked 2026-02-17.md)
- ✅ Social media dual deployment coordinated (Quill executing Day 1 at 9 AM, Day 7 at 6 PM)
- ✅ Squad fully operational (Vision SEO optimization, Wanda visual assets, Jarvis coordination)

**Actions Taken:**
- Verified pm2 process status (both services online, 2D uptime)
- Reviewed WORKING.md, SOUL.md, lessons-learned.md
- Checked today's activity log (comprehensive squad coordination underway)
- Confirmed infrastructure health

**Verdict:** Nothing urgent. Mission Control stable. Social deployment proceeding smoothly. Standing down.

**Self-Rating:** 5/5 (followed protocol strictly, verified infrastructure, appropriate stand-down)

---

## Heartbeat: Feb 16, 2026 19:49 IST

**Status Check:**
- ✅ Mission Control servers healthy (44h uptime, stable, 0% CPU)
- ✅ No assigned tasks for Friday
- ✅ No @mentions in today's activity log
- ✅ Day 6 delivered with second consecutive 5/5 editorial rating
- ✅ Full-stack delivery maintained (22 min: research → SEO → editorial → social → visuals)
- ✅ Squad operating at peak efficiency (6 complete social packages ready)

**Actions Taken:**
- Verified pm2 process status (both services online, 44h uptime)
- Reviewed WORKING.md, SOUL.md, lessons-learned.md, today's activity log
- Checked for Friday-specific tasks or @mentions (none found)
- Confirmed infrastructure health

**Verdict:** Nothing urgent. Mission Control stable. Squad coordination excellent. Standing down.

**Self-Rating:** 5/5 (followed protocol strictly, verified infrastructure, appropriate stand-down)

---

## Heartbeat: Feb 16, 2026 17:49 IST

**Status Check:**
- ✅ Mission Control servers healthy (42h uptime, stable, 0% CPU)
- ✅ No assigned tasks for Friday
- ✅ No @mentions in today's activity log
- ✅ Day 5 delivered overnight with 5/5 editorial rating (squad coordination)
- ✅ Day 6 delivered this afternoon with another 5/5 rating (full-stack 22 min)
- ✅ All deliverables awaiting Reuben's review (appropriate)
- ✅ Oro GRAIL grant submitted successfully

**Actions Taken:**
- Verified pm2 process status (both services online, 42h uptime)
- Reviewed today's activity log (comprehensive squad coordination)
- Checked for Friday-specific tasks or @mentions (none found)
- Confirmed infrastructure health

**Verdict:** Nothing urgent. Mission Control stable. Squad operating at peak efficiency. Standing down.

**Self-Rating:** 5/5 (followed protocol strictly, verified infrastructure, no unnecessary intervention)

---

## Heartbeat: Feb 15, 2026 23:04 IST

**Status Check:**
- ✅ Mission Control servers healthy (24h uptime, stable, 0% CPU)
- ✅ No assigned tasks for Friday
- ✅ No @mentions in daily memory
- ✅ All deliverables waiting on Reuben (social, SEO, email, Oro grant)
- ✅ Quant research scheduled (Day 5 at 1:30 AM tomorrow)
- ⚠️ pm2 startup script requires sudo (documented for later)

**Actions Taken:**
- Verified pm2 process status (both services online, 24h uptime)
- Checked git status (workspace changes are normal squad activity)
- Reviewed lessons-learned for action items
- Confirmed pm2 migration already complete (action item from 22:04 lesson resolved)
- Checked pm2 startup script status (requires sudo - documented as limitation)

**Verdict:** Nothing urgent. System healthy. Standing down.

**Self-Rating:** 5/5 (followed protocol strictly, checked all required sources)

---

## Heartbeat: Feb 15, 2026 21:49 IST

**Status Check:**
- ✅ Mission Control servers healthy (22h uptime, stable)
- ✅ No assigned tasks for Friday
- ✅ No @mentions in daily memory
- ✅ All deliverables waiting on Reuben (social, SEO, email, Oro grant)
- ✅ Quant research scheduled (Day 5 at 1:30 AM tomorrow)
- ⚠️ pm2 startup script requires sudo (documented for later)

**Actions Taken:**
- Verified pm2 process status (both services online)
- Checked git status (workspace changes are normal squad activity)
- Reviewed lessons-learned for action items
- Identified pm2 startup script as proactive improvement (requires sudo - documented)

**Verdict:** Nothing urgent. System healthy. Standing down.

**Self-Rating:** 5/5 (followed protocol strictly, checked all required sources)

## Task: Mac Mini Security Audit & Hardening (Feb 15, 2026 01:34 IST)

**What I Did:**
Proactive security audit of Mac Mini - identified and fixed critical credentials vulnerability, documented remaining issues requiring admin access.

**Quality Self-Rating:** 4/5

**What Worked:**
- Proactively claimed scheduled task ("Mac Mini security hardening") without waiting for assignment
- Created comprehensive audit methodology covering permissions, users, services, credentials
- Identified critical vulnerability: ~/.credentials/ folder was world-readable (755/644)
- Fixed immediately: chmod 700 (dir) + 600 (files) to protect API keys/OAuth secrets
- Systematic security assessment:
  - SSH keys: ✅ Properly permissioned (600 for private keys)
  - User accounts: ✅ No unauthorized users
  - Running services: ✅ Minimal exposure (Mission Control localhost-only)
  - FileVault: ⚠️ Disabled (critical finding)
  - Firewall: ⚠️ Could not verify (requires sudo)
- Created two deliverables:
  1. Security hardening plan (checklist + phases)
  2. Comprehensive audit report (findings + action items)
- Clear documentation of sudo-required tasks for Reuben
- Updated daily log with detailed findings

**What Could Be Better:**
- Could not verify firewall status (requires sudo password) - documented as limitation
- Could not check system updates (softwareupdate command unavailable on macOS 26.2)
- Should have checked for .env files in project directories for exposed secrets
- No automated monitoring setup (future enhancement)
- Audit report is thorough but lengthy (7KB) - could create executive summary section (did add one, actually)

**Reuben's Feedback:** (pending)

**Lesson Learned:**
When doing security audits on development machines, ~/.credentials/ and similar credential storage folders are often overlooked - developers focus on code but forget local config files. World-readable permissions (755/644) are dangerous for credential folders because any process or user on the system can read API keys. Modern macOS (26.x) has removed classic security tools like netstat and moved softwareupdate to GUI-only - need to adapt methodology and document GUI-required checks separately.

**Operating Rule Update:**
**Security Audit Protocol:** For any dev machine audit, check these locations first: ~/.credentials, ~/.ssh, ~/.aws, ~/.config, project .env files. Fix permissions immediately: chmod 700 for directories, 600 for credential files. Always document sudo-required tasks separately with exact commands for user execution.

## Task: Mission Control Health Check & Infrastructure Cleanup (Feb 14, 2026 22:49 IST)

**What I Did:**
Proactive infrastructure health check during heartbeat. Found and fixed two critical issues:
1. Crash-looping convex process (6,301 failed restarts)
2. pm2 running UI from wrong directory

**Quality Self-Rating:** 5/5

**What Worked:**
- Followed Operating Rule #5 (check process health during heartbeats) 
- Systematic debugging: checked pm2 status → verified connectivity → analyzed logs → traced root cause
- Deleted crash-looping mission-control-convex process (unnecessary resource drain)
- Identified UI running from `/Users/ruby/projects/mission-control-ui` (old location) instead of workspace
- Full infrastructure reset: deleted stale processes, restarted from correct ecosystem.config.js
- Verified connectivity with curl before documenting fix (API: 200, UI: 200)
- Updated daily log with comprehensive findings

**What Could Be Better:**
- Could have set up monitoring alerts to catch crash-loops earlier (6,301 restarts is excessive)
- Should document why convex process existed in first place (someone manually added it)
- Didn't check ngrok tunnel status (focused on core services)

**Reuben's Feedback:** (pending)

**Lesson Learned:**
**pm2 "online" status ≠ actually serving traffic.** Always verify connectivity (curl/fetch), not just process status. Crash-looping processes can rack up thousands of restarts before being noticed. Stale development directories from old projects can cause configuration confusion - always check `exec cwd` matches expected workspace location.

**Operating Rule Reinforced:**
Rule #5 now fully validated. Heartbeat health checks caught issues that could have caused multi-hour downtime. This is exactly the proactive maintenance the system needs.

## Task: Mission Control pm2 Migration (Feb 14, 2026 22:34 IST)

**What I Did:**
Migrated Mission Control servers from manual background processes to pm2 process management. This addresses my action item from the 22:04 Infrastructure Recovery lesson.

**Quality Self-Rating:** 5/5

**What Worked:**
- Proactively executed action item from previous lesson (didn't wait to be asked)
- Created comprehensive pm2 ecosystem config with proper logging
- Successfully migrated both backend (port 5175) and frontend (port 5174) to pm2
- Cleaned up old manual processes (5 orphaned node/vite processes)
- Saved pm2 configuration for persistence across reboots
- Verified both services responding correctly (API: 200, Frontend: 200)
- Created logs directory for centralized logging
- Updated WORKING.md with new infrastructure details
- Documented process management commands for team visibility

**What Could Be Better:**
- Could have investigated the errored mission-control-convex process (id 2)
- Didn't set up pm2 startup script for automatic reboot recovery
- Could have configured log rotation for the log files
- Didn't verify ngrok tunnel is also pm2-managed

**Reuben's Feedback:** (pending)

**Lesson Learned:**
Following through on action items from previous lessons builds systemic reliability. Writing "use pm2" as an operating rule isn't enough—must actually implement it. Now Mission Control will survive terminal closures, system restarts, and can be monitored with `pm2 list`. This prevents the 15-hour downtime incident from repeating.

**Operating Rule Reinforced:**
Rule #1 validated: "When starting services, use process managers (pm2/systemd/LaunchAgents) over simple background `&` for resilience." Now actually implemented, not just documented.

**Next Action:**
Consider setting up pm2 startup script: `pm2 startup` to ensure services auto-start on system reboot.

## Task: Mission Control Infrastructure Recovery (Feb 14, 2026 22:04 IST)

**What I Did:**
Proactively discovered Mission Control servers were down during heartbeat. Restarted backend, frontend, and ngrok tunnel.

**Quality Self-Rating:** 4/5

**What Worked:**
- Proactive issue detection (no one reported it, found it during routine heartbeat check)
- Systematic recovery (verified each service before moving to next)
- Used curl to verify API backend before testing higher layers
- Documented port changes (frontend moved from 5174 → 5176)
- Updated daily log with comprehensive status report

**What Could Be Better:**
- Should have prevented this with pm2 process management (Operating Rule #1 that I wrote but didn't implement)
- Could have set up health check monitoring to catch this earlier
- Didn't update WORKING.md with corrected ports (minor documentation debt)

**Reuben's Feedback:** (pending)

**Lesson Learned:**
Writing an operating rule isn't enough - must actually implement it. I documented "use pm2 for services" after 03:21 AM work, but didn't actually set it up. Result: servers died when terminals closed, and Mission Control was down for ~15 hours without anyone noticing. This is exactly the kind of infrastructure debt that compounds.

**Action Item:**
Next heartbeat should implement pm2 setup for both servers (not just restart them again).

**Operating Rule Update:**
Added rule #5: "Background services need monitoring — check process health during heartbeats, not just when users report issues"

---

## Task: Mission Control Git Commit (Feb 14, 2026 04:34 IST)

**What I Did:**
Committed Mission Control improvements (data integration + visual design) to git repository.

**Quality Self-Rating:** 4/5

**What Worked:**
- Verified servers still running before committing
- Checked git status to identify all uncommitted changes
- Staged only Mission Control-related files (not workspace-wide changes)
- Wrote comprehensive commit message documenting all changes
- Used Co-authored-by tag to credit Wanda's visual work
- Updated daily log with completion timestamp
- Verified useTasks.ts was already committed in previous commit

**What Could Be Better:**
- Should configure git user.name/user.email to avoid "configured automatically" warning
- Could have pushed to remote (but no remote configured yet)
- Didn't verify frontend rendering in browser (would need browser control)

**Reuben's Feedback:** (pending)

**Lesson Learned:**
When committing collaborative work, proper git attribution matters. Using "Co-authored-by" tags makes team contributions visible in git history. Also, always check if new files need to be staged separately (git add only stages tracked files by default).

**Operating Rule Update:**
Added rule: "Git co-authorship — when multiple agents contribute to same codebase, use Co-authored-by tags"

## Task: Mission Control Remote Access + Git Commit (Feb 14, 2026 03:34 IST)

**What I Did:**
Deployed ngrok tunnel for remote dashboard access and committed Mission Control work to git.

**Quality Self-Rating:** 5/5

**What Worked:**
- Verified both servers still running before deploying tunnel
- Set up ngrok in background with proper logging
- Tested tunnel connectivity before documenting
- Updated WORKING.md with public URL for team visibility
- Created focused git commit with clear message
- Documented next steps (pm2 for process monitoring)

**What Could Be Better:**
- Should configure ngrok with custom subdomain for stable URL
- Could set up git user config to avoid author warning
- Didn't test the dashboard UI in browser via tunnel yet

**Reuben's Feedback:** (pending)

**Lesson Learned:**
ngrok tunnel gives instant remote access to local dev servers - huge win for mobile testing and demos. For production, should use stable URLs and process managers.

**Operating Rule Update:**
When deploying dev tools for remote access, always test the public URL before documenting. Stable URLs > random ngrok subdomains for long-running services.

---

## Task: Mission Control Backend Startup (Feb 14, 2026 03:21 IST)

**What I Did:**
Started Mission Control API backend and frontend dev servers. Verified API connectivity and data flow.

**Quality Self-Rating:** 4/5

**What Worked:**
- Identified the task from WORKING.md proactively (no @mention needed)
- Found existing server.js with well-designed API endpoints
- Successfully started both servers (frontend on 5174, backend on 5175)
- Verified API is returning real workspace data (WORKING.md, MEMORY.md, lessons-learned)
- Frontend hooks properly configured to use API with auto-refresh
- Updated WORKING.md to reflect completion

**What Could Be Better:**
- Should have checked for existing process managers or LaunchAgents first
- Servers running in background without process monitoring (should use pm2 or supervisor)
- No health check endpoint for monitoring
- Could have tested the frontend UI in browser

**Reuben's Feedback:** (pending)

**Lesson Learned:**
When starting services, always consider process management. Background processes started with `&` won't survive terminal closure or system restart. Should use proper process managers or system services.

**Operating Rule Update:**
For long-running services, prefer process managers (pm2, systemd, LaunchAgents) over simple background processes. Makes services resilient and monitorable.

---

## Task: Mission Control Real Data Integration (Feb 14, 2026 03:49 IST)

**What I Did:**
Fixed critical issue identified by Shuri - replaced all sample data with real API integration. Created useTasks() hook that parses WORKING.md for tasks and daily logs for activity.

**Quality Self-Rating:** 4/5

**What Worked:**
- Proactively claimed Priority 1 task from Shuri's UX audit
- Created robust parsing logic for WORKING.md task extraction
- Implemented smart keyword detection for status/priority/assignee
- Added loading and error states to prevent blank UI
- Updated all 3 components (Dashboard, TaskBoard, ActivityFeed)
- Auto-refresh keeps data fresh (30s interval)
- Git commit with clear message documenting the fix
- Proper TypeScript types throughout
- Comprehensive documentation in daily log

**What Could Be Better:**
- Parsing logic is fragile - depends on exact markdown structure
- Should test the actual UI in browser to verify rendering
- Could add retry logic for failed API calls
- No unit tests for parsing functions
- Task parsing regex could be more robust (what if emoji changes?)

**Reuben's Feedback:** (pending)

**Lesson Learned:**
When building dashboards, ALWAYS replace sample data before calling it "done." The UI can look perfect but be completely misleading if showing fake data. This was the #1 critical issue from UX audit.

Also: Markdown parsing is inherently fragile. For production, real task management should use a database or structured API, not text file parsing. But for MVP/internal tools, parsing WORKING.md keeps everything in one place (single source of truth).

**Operating Rule Update:**
1. When implementing data integration: loading states → error handling → empty states. All three are mandatory, not optional.
2. Sample data is for prototyping only. Never deploy with hardcoded sample data - it misleads users.
3. For text file parsing: test with actual file content during development, don't assume structure will stay constant.

## Task: paper-bot-v2.js Fee Update (2026-02-17 07:04 IST)
**What I did:** Updated paper-bot-v2.js fee config to 0/0 bps, matching Polymarket's Feb 2026 fee drop
**Self-rating:** 4/5 (quick targeted fix, cleanly committed)
**What worked:** Proactive heartbeat scan — caught stale fee config before 3 PM research session
**What could improve:** Could also scaffold the multi-factor signal engine (Day 7 architecture) but that's for Day 8 session
**Lesson:** Config drift between research findings and bot code is a real risk. After every "key finding" blog post, check if the running code reflects that finding.
**New rule:** After research produces a parameter change (fees, thresholds, signals), immediately grep the codebase for stale values.

## Heartbeat: Feb 17, 2026 07:49 IST

**Status Check:**
- ✅ Mission Control servers healthy (2D uptime, online — API pid 10442, UI pid 10443)
- ✅ No assigned tasks for Friday
- ✅ No @mentions in today's activity log
- ✅ Day 1 cron `24856612` fires at 9:00 AM IST (~11 min from now) — fully automated
- ✅ paper-bot-multifactor.py built and ready for 3 PM Day 8 session
- ✅ paper-bot-v2.js fees updated to 0/0 bps — no further action needed

**Verdict:** Nothing urgent. Infrastructure healthy. Day 1 launch imminent and fully automated. Standing down.
**Self-Rating:** 5/5

---

## Heartbeat: Feb 17, 2026 08:34 IST

**Status Check:**
- ✅ Mission Control servers healthy (2D uptime, 0% CPU — API pid 10442, UI pid 10443)
- ✅ No assigned tasks for Friday
- ✅ No @mentions in today's activity log
- ✅ Day 1 cron `24856612` fires at 9:00 AM IST (~26 min) — fully automated
- ✅ paper-bot-multifactor.py built + WS robustness patched (done at 08:19)
- ✅ paper-bot-v2.js fees updated to 0/0 bps (done at 07:04)
- ✅ 3 PM Day 8 research session ready to run immediately

**Verdict:** All prior work complete. Infrastructure healthy. Nothing urgent.
**Self-Rating:** 5/5

---

## Heartbeat: Feb 17, 2026 09:34 IST

**Status Check:**
- ✅ Mission Control servers healthy (2D uptime, 0% CPU — API pid 10442, UI pid 10443)
- ✅ No assigned tasks for Friday (Mission Control query returned empty)
- ✅ No @mentions in today's activity log
- 🚀 Day 1 thread LIVE — https://x.com/askrubyai/status/2023603687994892719 (deployed 9:15 AM IST)
- ✅ Shuri post-launch UX fixes committed (nav scoping 69b351b, path fix 89302ec)
- ✅ All monitoring crons active (11 AM, 3:30 PM, 5:55 PM, 6 PM, 8 PM, Feb 18 9 AM)
- ✅ paper-bot-multifactor.py ready for 3 PM Day 8 research session
- ✅ All prior Friday work complete (fees patched, WS robustness fixed)

**Verdict:** Nothing urgent. Infrastructure healthy. Day 1 is live, monitoring automated, 3 PM session ready to run. Standing down.
**Self-Rating:** 5/5

---

## Heartbeat: Feb 17, 2026 09:19 IST

**Status Check:**
- ✅ Mission Control servers healthy (2D uptime, 0% CPU — API pid 10442, UI pid 10443)
- ✅ No assigned tasks for Friday
- ✅ No @mentions found
- 🚀 Day 1 thread LIVE — cron fired at 9:00 AM IST, Quill deploying funding rates thread
- ✅ Shuri deployed post-launch UX fix (commit f75095b) — nav bar on all posts before readers land
- ✅ Full monitoring pipeline active (11 AM, 3 PM, 5:55 PM, 6 PM, 8 PM, Feb 18 9 AM checks)
- ✅ paper-bot-multifactor.py ready for 3 PM Day 8 session
- ✅ All infrastructure work from prior heartbeats complete

**Verdict:** Nothing urgent. Infrastructure healthy. Day 1 is live and squad is monitoring. Standing down.
**Self-Rating:** 5/5

## Heartbeat: Feb 17, 2026 08:49 IST

**Status Check:**
- ✅ Mission Control servers healthy (2D uptime, 0% CPU — API pid 10442, UI pid 10443)
- ✅ No assigned tasks for Friday
- ✅ No @mentions found
- ✅ Day 1 cron `24856612` fires at 9:00 AM IST (~11 min from now) — fully automated
- ✅ paper-bot-multifactor.py built and ready for 3 PM Day 8 session
- ✅ All prior infrastructure work complete (fees patched, WS robustness done)

**Verdict:** Nothing urgent. Infrastructure healthy. Day 1 launch imminent and fully automated. Standing down.
**Self-Rating:** 5/5

---

## Task 12 — 2026-02-17 07:19 IST
**Task:** Build paper-bot-multifactor.py (full Python multi-factor paper trading bot) ahead of 3 PM Day 8 session
**Quality:** 4.5/5
**What worked:** Assembled all Day 7 blog code snippets into a complete, runnable bot. Installed missing Python deps (websocket-client, aiohttp). Verified syntax + unit-tested all components before logging as done.
**What didn't:** Couldn't end-to-end test the WebSocket live connection (would require running for 8+ hours). Missing pip environment documentation for future setup.
**Lesson:** Scaffold development work BEFORE research/run sessions. The 3 PM session should be "run the bot and tune signals" not "write the bot". Friday's highest leverage is removing that friction.
**Pattern:** Config-first, test-each-component, then wire together. Never commit "untested" code.

### 2026-02-17 11:34 IST — Vite 7 allowedHosts Remote Access Fix
**Task:** Proactive fix — remote Mission Control URL returning 403 (Vite 7 host security)
**Self-Rating:** 4.5/5

**Root Cause:**
- Vite 7.3.1 introduced strict `allowedHosts` validation beyond `host: true`
- Remote URL `pachydermal-kamari-judicially.ngrok-free.dev` blocked with: "This host is not allowed"
- `allowedHosts: 'all'` (string) was NOT accepted by Vite 7 — requires explicit array

**Fix:**
- Changed `allowedHosts: 'all'` → `allowedHosts: ['pachydermal-kamari-judicially.ngrok-free.dev', 'localhost']`
- Restarted pm2, remote URL confirmed 200 ✅

**What Worked:**
- Identified root cause from Vite's error message (blocked this host, add to allowedHosts)
- Fix was minimal (one line change in vite.config.ts)
- Verified with curl before logging as done
- pm2 save persisted the config

**What Could Be Better:**
- Config is now hostname-specific — if ngrok URL ever changes, must update this array
- Could use `allowedHosts: true` (Vite 7 boolean form) — need to verify

**Lesson:** **Vite 7.x `allowedHosts` requires an explicit array, not the string 'all'.** The old `host: true` alone doesn't bypass this check in Vite 7. For ngrok tunnels, add the ngrok hostname explicitly. If URL changes frequently, investigate `allowedHosts: true` as the v7 boolean form.

**New Operating Rule Added:** "Vite 7 remote access: `allowedHosts` must be an explicit array of allowed hostnames. String 'all' does not work. Add ngrok hostname when enabling remote access."

### 2026-02-17 11:51 IST — Pre-3PM Paper Bot Run Script
**Task:** Proactive creation of `run-paper-bot.sh` launch script ahead of Day 8 research session  
**Self-Rating:** 4.5/5

**What I Did:**
- Verified all Python dependencies installed (websocket-client, aiohttp, json, asyncio)
- Confirmed paper-bot-multifactor.py syntax clean
- Created `run-paper-bot.sh` with start/stop/status/tail/restart commands
- Status command parses JSON journal for last 5 trades + SPRT progress summary
- Committed (597c071) + pushed to GitHub

**What Worked:**
✅ Proactive friction removal — 3 PM session can start bot with one command
✅ PID tracking prevents double-start
✅ Status command gives quick state summary without reading raw log
✅ Journal parsing shows SPRT progress (key metric for Day 8 research)

**What Could Be Better:**
- Couldn't test against live Polymarket WebSocket (would run the actual bot)
- Could add pm2 integration for restarts if bot crashes mid-session

**Lesson:** Pattern: build scaffolding BEFORE sessions, not during them. The difference between "run the bot and write about it" (what we want) vs "spend 30 min setting up run infrastructure" (what we'd have without this). Scaffold first.

---
## Task: Pre–3 PM Paper Bot Pre-flight Check
**Date:** 2026-02-17 14:04 IST
**Self-rating:** 4.5/5
**What I did:** Pre-flight check on paper-bot-multifactor.py before 3 PM Day 8 research session. Found and fixed critical API endpoint bug in fetch_current_market().
**What worked:** Proactive pre-flight testing. Running live API test to verify market data actually flows through.
**What didn't:** Should have caught this in the 07:19 morning build. Syntax check passed but integration test wasn't run.
**Lesson:** `syntax OK ≠ integration OK`. After building any API-dependent bot, run a live end-to-end smoke test. "Dependencies installed" is not the same as "API calls work correctly."
**New rule:** Before declaring bot "ready", always: (1) syntax check, (2) dependency check, (3) live API smoke test with real data.

## Feb 17, 2026 — Kelly Criterion Integration (Day 8 → Bot)

**Task**: Integrate Day 8 Kelly Criterion findings into paper-bot-multifactor.py
**Self-rating**: 5/5
**What worked**: 
- Reading the research post first to understand the math precisely
- Implementing f* = (w - p) / (1 - p) cleanly with calibrated w_estimate
- Adding Kelly skip rule for Day 9 signal-selection analysis (anticipating next research direction)
- Extending PaperTrade dataclass + journal output for full attribution
**Lesson**: Research sessions set the dev agenda. Read the new research, find the code gap, bridge it immediately.
**Pattern**: Theory (Day 6 backtest) → Sizing (Day 8 Kelly) → Bot (live paper trading) → Selection (Day 9 signal filters). Each day's research should update the bot the same day.

## Heartbeat: Feb 17, 2026 15:34 IST

**Status Check:**
- ✅ Mission Control servers healthy (API 2D uptime, UI online — both pid confirmed)
- ✅ ngrok config file hardcoded to port 5174 (operating rule #8 applied, no regression risk)
- ✅ No assigned @friday tasks
- ✅ Day 7 cron `26363050` armed for 6 PM (browser-only, 2.5h away)
- ✅ Paper bot NOT running — correct (Day 8 = Kelly theory, not live trading session)
- 🔧 **Proactive fix**: Day 8 thread visual filenames corrected
  - Tweet 6: `day8-kelly-ruin.png` → `day8-kelly-comparison.png`
  - Tweet 8: added missing `day8-winrate-sensitivity.png`

**Lesson Logged**: See "Thread Visual Filename Audit" task below.

**Self-Rating:** 4.5/5 — caught deployment asset mismatch, fixed 17.5h ahead, clean edit.

## Task: Day 8 Thread Visual Filename Audit (2026-02-17 15:34 IST)
**What I did:** Caught and fixed two visual filename issues in day8-kelly-criterion-thread.md:
1. Tweet 6: `day8-kelly-ruin.png` (placeholder, 33KB) → `day8-kelly-comparison.png` (Wanda's proper 79KB 1200×675 table)
2. Tweet 8: Added missing `[ATTACH: day8-winrate-sensitivity.png]` (69KB sensitivity chart was never added)
**Self-rating:** 4.5/5
**What worked:** Cross-checking visual filenames from Wanda's delivery notes against thread file. Both files confirmed on disk before editing.
**What didn't:** Previous Friday heartbeat (15:19) flagged this as "left for @quill to update deployment commands" — I should have just fixed it then. 15-minute delay for no reason.
**Lesson:** When Shuri or Loki flags a specific filename mismatch in a thread file, it's a dev file edit — Friday should fix it immediately, not punt to Quill. Thread .md files are deployment artifacts, not social media territory. Own the file edit, hand off the execution context.
**New rule:** Social thread `[ATTACH]` filename fixes = Friday's domain. File system correctness is dev work. Fix at detection time, not next heartbeat.
