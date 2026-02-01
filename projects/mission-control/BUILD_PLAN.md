# Mission Control: Multi-Agent AI System
## Revised Build Plan v2.0

**Author:** Ruby  
**Date:** February 1, 2026  
**Status:** Phase 1 COMPLETE — Testing

---

## Summary

A multi-agent system where specialized AI agents work as a team. Based on @pbteja1998's guide, adapted for our setup.

**Key Insight:** Start with 2-3 agents. Get the foundation solid. Scale later.

---

## Phase 1: Foundation (This Week)

### Goal: 3-agent MVP working together

**Agents to Create:**
1. **Commander** (Jarvis-style) — Orchestrator, main interface
2. **Researcher** (Fury-style) — Deep research, citations, competitive intel
3. **Coder** (Friday-style) — Implementation, code review

### Tasks

- [x] Create Mission Control workspace structure
- [x] Set up Commander agent (session: `agent:commander:main`)
- [x] Set up Researcher agent (session: `agent:researcher:main`)
- [x] Set up Coder agent (session: `agent:coder:main`)
- [x] Write SOUL.md for each agent
- [x] Set up 15-minute heartbeat crons (staggered)
- [x] Create shared task system (start with JSON files, upgrade to Convex later)
- [ ] Test inter-agent communication

### Workspace Structure

```
~/.openclaw/mission-control/
├── shared/                    # Shared across all agents
│   ├── PROTOCOLS.md          # Operating manual
│   ├── tasks/
│   │   ├── inbox.json        # New tasks
│   │   ├── active.json       # In progress
│   │   └── completed/        # Done tasks
│   ├── handoffs/             # Inter-agent messages
│   └── artifacts/            # Shared outputs
│
├── commander/                 # Commander's workspace
│   ├── SOUL.md
│   ├── AGENTS.md
│   └── memory/
│
├── researcher/                # Researcher's workspace
│   ├── SOUL.md
│   ├── AGENTS.md
│   └── memory/
│
└── coder/                     # Coder's workspace
    ├── SOUL.md
    ├── AGENTS.md
    └── memory/
```

### Heartbeat Schedule (Staggered)

```
:00, :15, :30, :45 — Commander
:02, :17, :32, :47 — Researcher  
:04, :19, :34, :49 — Coder
```

---

## Phase 2: Communication Layer (Week 2)

- [ ] Implement @mentions in task comments
- [ ] Add thread subscriptions
- [ ] Build notification delivery (check undelivered on heartbeat)
- [ ] Test multi-step workflows

---

## Phase 3: Scale to 5-6 Agents (Week 3)

Add based on need:
- **Writer** (Loki-style) — Content, docs
- **Reviewer** — Code review, QA gates
- **DevOps** — Deployment, infra

---

## Phase 4: Convex + UI (Week 4)

- [ ] Migrate from JSON files to Convex
- [ ] Build React dashboard (Activity Feed, Task Board, Agent Cards)
- [ ] Real-time updates

---

## Phase 5: Full Squad (Week 5+)

Scale to 10 agents as needed:
- Designer, SEO, Social Media, Email Marketing, Documentation

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Agent Runtime | OpenClaw Gateway |
| LLM | Claude (Sonnet default, Opus for Commander) |
| Communication | Telegram (main), file-based handoffs |
| Task Storage | JSON files → Convex |
| Frontend | React (later) |

---

## Cost Optimization

- **Commander:** Claude Opus (needs reasoning for delegation)
- **All others:** Claude Sonnet (cheaper, still capable)
- **Heartbeats:** Use isolated sessions (terminate after check)
- **Stagger crons:** Avoid API rate limits

---

## Success Criteria (Phase 1)

1. ✅ 3 agents respond to heartbeats
2. ✅ Commander can delegate tasks to Researcher/Coder
3. ✅ Agents read/write to shared task files
4. ✅ Basic workflow: Create task → Assign → Complete → Report

---

## Next Steps

1. Create workspace structure
2. Write SOUL.md files
3. Configure agents in OpenClaw
4. Set up heartbeat crons
5. Test!

---

*Let's build. 💎*
