# Agentic Orchestration System

*How agents self-organize, auto-assign, and learn.*

## Auto-Assignment Protocol

When an agent wakes up on heartbeat and finds unassigned tasks:

### Step 1: Expertise Matching
Each agent has a skill profile (derived from SOUL.md):

| Agent | Primary Skills | Secondary Skills |
|-------|---------------|-----------------|
| Ruby | Coordination, research, proactive planning | Everything (generalist) |
| Shuri | UX testing, edge cases, competitive analysis | Mobile testing, accessibility |
| Fury | Customer research, G2 mining, data analysis | Market trends, interviews |
| Vision | SEO, keywords, search intent, SERP analysis | Content strategy, analytics |
| Loki | Long-form writing, editing, copy | Narrative, documentation |
| Quill | Social media, Twitter, threads, hooks | Community, engagement |
| Wanda | Visual design, infographics, UI/UX | Brand, presentations |
| Pepper | Email marketing, drip sequences, automation | Conversion, lifecycle |
| Friday | Code, architecture, frontend, backend | DevOps, APIs, performance |
| Wong | Documentation, knowledge org, process docs | Templates, onboarding |

### Step 2: Auto-Claim Rules
An agent auto-claims an unassigned task when ALL of:
1. ✅ Task matches their primary or secondary skills
2. ✅ No one else claimed it in the last 15 minutes
3. ✅ Agent has < 3 active tasks
4. ✅ Agent's confidence for this task ≥ 3/5

### Step 3: Priority Scoring
```
Score = Urgency(0-10) + Impact(0-10) + Expertise(0-10) + Unblocks(0-5) + Reuben(+10)
```

Pick highest-scoring available task.

## @Mention Routing

### Smart Routing Rules
- `@friday` on any code/technical task → Friday picks up
- `@shuri` on any UX/testing task → Shuri picks up
- `@all` → All agents evaluate on next heartbeat
- Untagged tasks with keywords get auto-routed:
  - "code", "build", "implement", "fix", "deploy" → Friday
  - "research", "G2", "competitor", "analyze" → Fury
  - "write", "content", "blog", "copy" → Loki
  - "design", "visual", "mockup", "UI" → Wanda
  - "SEO", "keyword", "ranking", "search" → Vision
  - "tweet", "thread", "social", "Twitter" → Quill
  - "email", "drip", "sequence", "newsletter" → Pepper
  - "document", "process", "knowledge", "organize" → Wong
  - "test", "UX", "edge case", "user" → Shuri

## Feedback Loops

### Self-Rating (after every task)
```markdown
Quality: [1-5]
Confidence was: [1-5]  
Actual difficulty: [1-5]
Time estimate vs actual: [estimate] vs [actual]
Would I do anything differently? [yes/no + what]
```

### Learning Log Entry (after every task)
Each agent appends to their `lessons-learned.md`:
```markdown
## [Date] — [Task Title]
- Quality: 4/5
- Key insight: [What I learned]
- Reusable pattern: [Something I can apply to future tasks]
- Mistake to avoid: [If applicable]
```

### Reuben Feedback Integration
When Reuben gives feedback (positive or negative):
1. Log it in the relevant agent's lessons-learned.md
2. If negative: create a "rule" to prevent recurrence
3. If positive: note the pattern to replicate
4. After 5 feedback items, do a meta-review to find patterns

## Priority System

### Priority Levels
- **Critical** (P0): Blocking Reuben or revenue. Drop everything.
- **High** (P1): Important, needs attention today.
- **Medium** (P2): Should be done this week.
- **Low** (P3): Nice to have, do when capacity allows.

### Auto-Priority Rules
- Reuben says "urgent" / "asap" / "now" → Critical
- Reuben says "when you get a chance" → Low
- Has a deadline within 24h → auto-bump to High
- Has a deadline within 2h → auto-bump to Critical
- Blocked for > 4 hours → auto-bump one level

## Cross-Agent Collaboration

### Handoff Protocol
When a task needs multiple agents:
1. Lead agent creates sub-tasks and @mentions specialists
2. Each specialist picks up their sub-task
3. Results posted as comments on the parent task
4. Lead agent synthesizes and marks parent complete

### Conflict Resolution
If two agents claim the same task:
1. Higher expertise match wins
2. If tied, lower current workload wins
3. If still tied, first to claim wins
