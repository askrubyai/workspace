# Mission Control Workflow Guide
**Date**: February 2, 2026  
**Status**: Production Ready  

## How Mission Control Works

Mission Control is now a systematic, robust task management system with specialized AI agents working as a coordinated team.

### 🎯 System Architecture

```
┌─────────────────────────────────────────────────────┐
│                Mission Control UI                    │
│            http://localhost:5173                     │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│              JSON Backend API                       │
│            http://localhost:3210                    │
└─────────────────────┬───────────────────────────────┘
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │Commander │ │Researcher│ │  Coder   │
    │ (Opus)   │ │(Sonnet)  │ │ (Opus)   │
    └──────────┘ └──────────┘ └──────────┘
         ▲            ▲            ▲
         │            │            │
    ┌────┴─────┬──────┴─────┬──────┴─────┐
    │ :00,:15, │ :02,:17,   │ :04,:19,   │
    │ :30,:45  │ :32,:47    │ :34,:49    │
    └──────────┴────────────┴────────────┘
```

### 👥 Agent Roles

| Agent | Model | Role | Responsibilities |
|-------|--------|------|-----------------|
| **Commander** | Claude Opus | Orchestrator | Task delegation, project coordination, team leadership |
| **Researcher** | Claude Sonnet | Intelligence | Web research, analysis, competitive intelligence |
| **Coder** | Claude Opus | Implementation | Code development, architecture, technical solutions |

### ⏰ Heartbeat Schedule

**Every 15 minutes, staggered to avoid conflicts:**
- **:00, :15, :30, :45** - Commander checks for unassigned tasks
- **:02, :17, :32, :47** - Researcher checks assigned tasks  
- **:04, :19, :34, :49** - Coder checks assigned tasks

## 🚀 How to Use Mission Control

### Option 1: Via Web UI (Recommended)
1. **Open Mission Control**: http://localhost:5173
2. **Create Task**: Click "Add Task" or drag to appropriate column
3. **Monitor Progress**: Watch real-time updates on the Kanban board
4. **Review Results**: Check activity feed for completion updates

### Option 2: Via API (Advanced)
```bash
# Create a new task
curl -X POST http://localhost:3210/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Your task title",
    "description": "Detailed description",
    "priority": "high|medium|low",
    "status": "new"
  }'

# List all tasks
curl http://localhost:3210/api/tasks

# Get specific task
curl http://localhost:3210/api/tasks/{task-id}
```

### Option 3: Via Direct File (System Integration)
```bash
# Add task to inbox (Commander will pick it up)
echo '{
  "title": "Direct task", 
  "description": "Task description",
  "priority": "medium",
  "status": "new"
}' >> ~/.openclaw/mission-control/data/tasks.json
```

## 📋 Task Workflow

### 1. Task Creation
**Who**: User, External System, or Agent  
**Where**: UI, API, or direct file modification  
**Result**: Task created with status "new"

### 2. Task Assignment (Commander)
**When**: Every 15 minutes (:00, :15, :30, :45)  
**Process**:
- Commander scans for unassigned tasks
- Analyzes task type and complexity
- Assigns to appropriate agent:
  - **Research tasks** → Researcher
  - **Coding tasks** → Coder  
  - **Complex coordination** → Commander handles directly

### 3. Task Execution (Agents)
**When**: Every 15 minutes (staggered schedule)  
**Process**:
- Agent checks for assigned tasks
- Updates status to "in-progress"  
- Performs the work
- Saves results to `~/.openclaw/mission-control/shared/artifacts/`
- Updates status to "done"

### 4. Completion & Notification
**Process**:
- Results saved to shared artifacts directory
- Activity feed updated
- Status tracked in Mission Control UI
- Notifications sent if configured

## 📂 File Structure

```
~/.openclaw/mission-control/
├── data/
│   ├── tasks.json          # All tasks
│   ├── agents.json         # Agent registry  
│   └── notifications.json  # Notification queue
├── shared/
│   └── artifacts/          # Completed work results
├── commander/              # Commander's workspace
├── researcher/             # Researcher's workspace  
└── coder/                  # Coder's workspace
```

## 🔧 Administrative Commands

### Monitor System Health
```bash
# Check agent status
openclaw agents list

# Check heartbeat schedule  
openclaw cron list

# View recent heartbeat runs
openclaw cron runs --limit 10

# Check backend health
curl http://localhost:3210/health
```

### Restart Components
```bash
# Restart backend API
pkill -f json-backend.cjs
cd /Users/ruby/projects/mission-control-ui && node json-backend.cjs &

# Restart frontend (if needed)
# Navigate to project directory and run: pnpm dev
```

### Task Management
```bash
# View all tasks
curl http://localhost:3210/api/tasks | jq '.'

# View agents
curl http://localhost:3210/api/agents | jq '.'

# Check notification queue
cat ~/.openclaw/mission-control/data/notifications.json
```

## 🎯 Best Practices

### Task Creation
- **Be Specific**: Clear titles and detailed descriptions
- **Set Priority**: Use high/medium/low appropriately  
- **Choose Type**: Make it clear if it's research, coding, or coordination
- **Provide Context**: Include relevant links, files, or background

### Monitoring
- **Check UI Daily**: Review Mission Control dashboard
- **Monitor Heartbeats**: Ensure agents are active
- **Review Results**: Check artifacts directory for completions
- **Track Progress**: Use activity feed for real-time updates

### Troubleshooting
- **Backend Issues**: Check http://localhost:3210/health
- **Frontend Issues**: Check http://localhost:5173
- **Agent Issues**: Run `openclaw agents list`
- **Cron Issues**: Run `openclaw cron list`

## 🚀 Future Enhancements

### Phase 2 Planned Features
- **Telegram Integration**: Direct task creation via chat
- **Dynamic Model Switching**: Complexity-based model assignment
- **Advanced Notifications**: Multi-channel delivery
- **Inter-Agent Handoffs**: Complex multi-step workflows
- **Performance Analytics**: Task completion metrics

### Scaling Considerations  
- **Additional Agents**: Writer, Designer, QA, DevOps
- **Workload Balancing**: Dynamic assignment algorithms
- **External Integrations**: GitHub, Slack, email systems
- **Advanced UI**: Real-time collaboration features

---

**Mission Control is now operational and ready to manage AI agent coordination systematically and robustly as requested.** 🎖️

For support or enhancements, refer to the audit documentation or contact system administrator.