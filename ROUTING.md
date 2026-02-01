# Model Routing System

**Purpose:** Intelligent model selection based on task complexity and cost optimization.

---

## Default Model

**Primary:** `anthropic/claude-sonnet-4-5` (Sonnet 4.5)
- General purpose default
- Best balance of capability and cost
- Use for most standard interactions

---

## Routing Decision Engine

**Decision Model:** `minimax-portal/MiniMax-M2.1` (alias: `mini`)

MiniMax M2.1 acts as the initial classifier and router:

### Classification Logic

1. **Incoming Request → MiniMax Assessment**
   - MiniMax analyzes the request complexity
   - Routes based on categorization below

2. **Heavy Coding/Research** → `moonshot/kimi-k2.5` (alias: `kimi`)
   - Large codebases (>1000 lines)
   - Deep research tasks requiring extensive context
   - Multi-file refactoring
   - Complex debugging sessions
   - API integration with extensive documentation
   - **Requires:** Kimi API credentials in `.openclaw/credentials/`
   - **Status:** ⚠️ Not configured (credentials missing as of Feb 2, 2026)

3. **Day-to-Day Chat/Simple Tasks** → Stay on `minimax-portal/MiniMax-M2.1`
   - Quick questions
   - File operations (read/write/edit single files)
   - Simple web searches
   - Scheduling/reminders
   - Message routing
   - Status checks

4. **Complex Architecture/Decisions** → `anthropic/claude-sonnet-4-5`
   - System design discussions
   - Multi-agent coordination
   - Strategic planning
   - Sensitive operations (destructive commands, external messages)
   - Tasks requiring deep reasoning
   - Escalations from other agents

5. **Maximum Capability** → `anthropic/claude-opus-4-5` (alias: `opus`)
   - Explicitly requested by user
   - After Sonnet determines it needs escalation
   - Rate-limited (personal auth token)
   - Check Claude toggle before using (see CLAUDE_TOGGLE.md)

---

## Fallback Chain

```
Request → MiniMax M2.1 (classify)
  ├─ Simple → Stay on MiniMax
  ├─ Heavy → Kimi K2.5 (if available, else Sonnet)
  ├─ Complex → Sonnet 4.5
  └─ Critical → Opus 4.5 (if toggle enabled)
```

**On Rate Limits:**
- Claude (Opus/Sonnet) → Check `claude-toggle.json`, fallback to Kimi or MiniMax
- Kimi K2.5 → Fallback to Sonnet

---

## Implementation Status

- ✅ Sonnet 4.5 set as default
- ⚠️ Kimi K2.5 credentials missing (not configured)
- ✅ Claude toggle system (see next deliverable)
- ✅ MiniMax M2.1 available as routing engine

---

## To Enable Kimi K2.5

1. Obtain Moonshot API key
2. Create credentials file:
   ```bash
   echo '{"apiKey": "YOUR_KEY"}' > ~/.openclaw/credentials/moonshot.json
   ```
3. Test with: `/model kimi` in OpenClaw chat

---

*Created: Feb 2, 2026 02:01 IST*
*Last Updated: Feb 2, 2026 02:01 IST*
