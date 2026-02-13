# Lessons Learned

*Updated after every task. Re-read at session start.*

## Operating Rules (derived from patterns)
<!-- Add rules here as you identify recurring mistakes -->

## Task Log
<!-- Newest entries at top -->

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
