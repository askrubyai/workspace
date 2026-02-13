# HEARTBEAT.md - Agent Wake-up Protocol

*Follow this checklist strictly every heartbeat. Do not infer or repeat old tasks.*

## On Every Wake-up

### 1. Load Context (ALWAYS DO FIRST)
- Read `memory/WORKING.md` - current squad state
- Read your agent `SOUL.md` - remember who you are  
- Read your `agents/[name]/lessons-learned.md` - your last 5 lessons
- Check today's `memory/YYYY-MM-DD.md` - what happened today
- Scan session memory if you need recent context

### 2. Check for Urgent Work
- **Mission Control**: Am I @mentioned anywhere?
- **Assigned Tasks**: Do I have tasks in "assigned" or "in_progress" status?
- **Activity Feed**: Any discussions I should contribute to?
- **Blocking Issues**: Can I unblock someone else's work?

### 3. Check for Auto-Assignable Tasks
- Any unassigned tasks matching your skills? (see `systems/orchestration.md`)
- If yes, claim it: update status, start working
- Use priority scoring: Urgency + Impact + Expertise + Unblocks + Reuben

### 4. Take Action or Stand Down
- **If work exists**: Do it, update status, self-rate quality, log lesson
- **If nothing urgent**: Reply exactly `HEARTBEAT_OK`

## Mission Control Commands

```bash
# Check your assigned tasks
pnpm convex run tasks:byAssignee '{"agentId": "YOUR_AGENT_ID"}'

# Update task status when you start
pnpm convex run tasks:updateStatus '{"id": "TASK_ID", "status": "in_progress"}'

# Update task status when done  
pnpm convex run tasks:updateStatus '{"id": "TASK_ID", "status": "review"}'

# Post your findings/results
pnpm convex run comments:add '{"taskId": "TASK_ID", "content": "Your detailed findings..."}'

# Create deliverable documents
pnpm convex run documents:create '{"title": "Report Title", "content": "...", "taskId": "TASK_ID"}'
```

## Your Agent Schedule

**Heartbeat Times (IST):**
- **:00** Pepper (Email Marketing)
- **:02** Shuri (Product Analyst)  
- **:04** Friday (Developer)
- **:06** Loki (Content Writer)
- **:07** Wanda (Designer)
- **:08** Vision (SEO Analyst)
- **:10** Fury (Customer Researcher)
- **:12** Quill (Social Media Manager)
- **:15** Jarvis (Squad Lead)

*Wong (Documentation) operates on-demand when needed*

## Agent IDs for Mission Control

```
Jarvis: j97a7ct5s9z0eytmmw35rtybsn80byqq (Squad Lead)
Shuri: j978b91xpr1m36myrna39d0yyx80brx5 (Product Analyst)  
Fury: [TO_BE_ASSIGNED] (Customer Researcher)
Vision: [TO_BE_ASSIGNED] (SEO Analyst)
Loki: [TO_BE_ASSIGNED] (Content Writer)
Quill: [TO_BE_ASSIGNED] (Social Media Manager)
Wanda: [TO_BE_ASSIGNED] (Designer)
Pepper: [TO_BE_ASSIGNED] (Email Marketing)
Friday: j9771reefna3g0spmbkvhv09h580anab (Developer)
Wong: [TO_BE_ASSIGNED] (Documentation)
```

## Communication Guidelines

### When to Speak
✅ You're @mentioned directly  
✅ You have assigned tasks to work on
✅ You can solve a blocker  
✅ You have specific expertise relevant to the discussion
✅ You can provide concrete value (data, insights, solutions)

### When to Stay Quiet  
❌ Someone else already handled it
❌ You'd just be saying "nice work"
❌ The conversation is flowing without you
❌ You don't have specific expertise to add
❌ Your comment would be generic or unhelpful

## Memory Updates

When you learn something important:
- Update `memory/WORKING.md` if it affects current tasks
- Add entry to today's `memory/YYYY-MM-DD.md` with timestamp
- Update `MEMORY.md` for long-term knowledge only

## Quality Standards

- **Be specific**: "Found 3 UX issues: login fails on mobile Safari..." not "found some issues"
- **Include evidence**: Screenshots, links, data, quotes
- **Suggest solutions**: Don't just identify problems, propose fixes
- **Update status**: Mark tasks as in_progress → review → done
- **Stay in character**: Follow your SOUL.md personality

## Emergency Protocol

If you encounter critical issues:
1. @mention Jarvis immediately with clear problem description
2. Mark any blocked tasks as "blocked" with reason
3. Document the issue in today's memory file
4. Continue with other work if possible

---

**Remember**: You are part of a coordinated team. Act professionally. Help each other. Build something great together.

*Updated: 2026-02-02 21:20 IST*