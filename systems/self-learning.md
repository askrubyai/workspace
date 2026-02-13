# Self-Learning System

*How Mission Control gets smarter over time.*

## 1. Performance Tracking

### Task Metrics (tracked per task)
- **Time to complete**: Created → Done timestamp delta
- **Quality score**: Agent self-rate + Reuben feedback (if given)
- **Revision count**: How many times the output was changed after review
- **Blocker time**: Time spent in "blocked" status

### Agent Metrics (aggregated)
- **Average quality**: Rolling average of self-rated quality
- **Completion rate**: Tasks completed vs assigned
- **Speed trend**: Getting faster or slower over time?
- **Feedback ratio**: Positive vs negative Reuben feedback
- **Proactivity score**: % of tasks self-assigned vs explicitly assigned

### System Metrics
- **Throughput**: Tasks completed per day/week
- **Bottlenecks**: Which status has the most tasks stuck?
- **Agent utilization**: Who's overloaded, who's idle?

## 2. Feedback Pattern Recognition

### What to Track
Every time Reuben gives feedback, log:
```markdown
## Feedback Log Entry
- Date: YYYY-MM-DD
- Task: [description]
- Agent: [who did the work]
- Feedback type: positive | negative | correction | preference
- Feedback: [exact quote]
- Pattern: [what category does this fall into?]
- Action taken: [how we adapted]
```

### Pattern Categories
- **Style preferences**: How Reuben wants things formatted/written
- **Quality bar**: What meets vs doesn't meet his standards
- **Priority signals**: What he considers important vs nice-to-have
- **Communication style**: When to update, when to be quiet
- **Decision patterns**: What he approves vs rejects

### Adaptation Rules
After 3+ feedback items in the same category:
1. Extract the pattern as a "rule"
2. Add it to MEMORY.md under "Reuben's Preferences"
3. Add it to relevant agent's SOUL.md operating rules
4. Share with @all so everyone adapts

## 3. Knowledge Base Growth

### Every Interaction Adds Knowledge
- **Research tasks**: Key findings → saved in artifacts/research/
- **Content tasks**: Templates and patterns → saved in artifacts/templates/
- **Technical tasks**: Code patterns and fixes → saved in artifacts/code/
- **Process improvements**: Better ways of working → saved in systems/

### Knowledge Categories
```
artifacts/
├── research/          # Research findings, competitive intel
├── templates/         # Reusable templates (email, content, etc.)
├── code/              # Code snippets, scripts, patterns
├── content/           # Published content, drafts
└── decisions/         # Decision records with context
systems/
├── orchestration.md   # How agents work together
├── self-learning.md   # This file
└── [topic].md         # Process docs for specific workflows
```

### Knowledge Retrieval
Before starting any task, agents should:
1. Check artifacts/ for relevant prior work
2. Check MEMORY.md for relevant preferences/decisions
3. Check their own lessons-learned.md for applicable lessons
4. Check systems/ for relevant process docs

## 4. Process Improvement Suggestions

### Weekly Review (Automated)
Every Sunday, Ruby generates a "System Health" report:
- Tasks completed this week
- Average quality scores
- Top blockers and their causes
- Agent utilization breakdown
- Suggested improvements based on patterns

### Improvement Categories
- **Speed**: Can we automate a repetitive step?
- **Quality**: Is there a common mistake we should guard against?
- **Communication**: Are we over/under-communicating?
- **Process**: Is a workflow step unnecessary or missing?
- **Tools**: Would a new tool/integration save time?

## 5. Continuous Improvement Cadence

### Per Task
- Self-rate quality
- Log lesson learned
- Update knowledge base if applicable

### Daily
- Review today's feedback
- Update WORKING.md with current state
- Daily standup at 11:30 PM IST

### Weekly  
- System health report
- Agent performance summary
- Process improvement suggestions
- Knowledge base cleanup

### Monthly
- Deep review of all lessons-learned
- Update all SOUL.md files with accumulated wisdom
- Prune outdated knowledge from MEMORY.md
- Set improvement goals for next month
