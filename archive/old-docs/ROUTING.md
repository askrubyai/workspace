# Model Routing System

**Purpose:** Intelligent model selection for Mission Control agents.

---

## Model Priority (Updated Feb 2, 2026)

### 1. Default: MiniMax M2.1
**Model:** `minimax-portal/MiniMax-M2.1`

**Use for:**
- All day-to-day chat
- Simple file operations (read/write/edit single files)
- Quick web searches
- Scheduling/reminders
- Status checks
- Message routing
- General conversation

**Status:** ✅ Primary default

---

### 2. Heavy Thinking/Coding: Kimi-k2.5
**Model:** `moonshotai/kimi-k2.5` (alias: `kimi`)

**Use for:**
- Heavy coding tasks (large codebases >500 lines)
- Complex debugging sessions
- Multi-file refactoring
- Deep research requiring extensive context
- System architecture decisions
- Agentic work (OpenRouter primary)

**Priority:** HIGH - Primary model for heavy tasks

**Access:** Via OpenRouter (`moonshotai/kimi-k2.5`) ✅ configured

---

### 3. Fallback: Gemini CLI
**Model:** `google-gemini-cli/gemini-2.5-pro` (alias: `flash`)

**Use for:**
- Heavy thinking when Kimi fails
- Fallback for agentic work if OpenRouter Kimi unavailable
- Complex reasoning requiring different model perspective

**Priority:** Secondary fallback (only if Kimi fails)

---

### 4. Maximum Capability: Claude Opus 4-5
**Model:** `anthropic/claude-opus-4-5` (alias: `opus`)

**Use for:**
- Complex architectural decisions
- Multi-agent coordination requiring deep reasoning
- Strategic planning at scale
- Tasks where MiniMax/Kimi cannot solve
- **Primary for Mission Control ops when needed**

**Status:** ✅ Available (personal auth token active)

---

## Routing Logic

```
Incoming Request → MiniMax M2.1 (classifier)
  │
  ├─ SIMPLE → Stay on MiniMax M2.1
  │
  ├─ HEAVY CODING/THINKING → Kimi-k2.5
  │  └─ If Kimi fails → Gemini CLI (flash)
  │
  ├─ COMPLEX ARCHITECTURE → Claude Opus 4-5
  │  └─ If Opus unavailable → Kimi-k2.5
  │
  └─ ESCALATION → Claude Opus 4-5 (always available)
```

---

## Active Models Only

**In rotation:**
- ✅ MiniMax M2.1 (default)
- ✅ Kimi-k2.5 (heavy tasks via OpenRouter)
- ✅ Gemini CLI (fallback)
- ✅ Claude Opus 4-5 (max capability)

**Removed:**
- ~~Claude Sonnet 4-5~~ → Use Opus instead
- ~~OpenRouter Auto~~ → Not needed
- ~~MiniMax M2.1 Lightning~~ → Not needed
- ~~Anthropic general use~~ → Via Opus alias only

---

## Configuration Files

- **Routing Logic:** `~/.openclaw/workspace/ROUTING.md`
- **Claude Toggle:** `~/.openclaw/mission-control/shared/config/claude-toggle.json`
- **Toggle Docs:** `~/.openclaw/mission-control/shared/CLAUDE_TOGGLE.md`

---

## Model Aliases

| Alias | Model | Use When |
|-------|-------|----------|
| `mini` | MiniMax M2.1 | Default, simple tasks |
| `kimi` | Kimi-k2.5 | Heavy coding/research |
| `flash` | Gemini CLI | Kimi fallback |
| `opus` | Claude Opus 4-5 | Max capability |

---

*Created: Feb 2, 2026 02:01 IST*
*Updated: Feb 2, 2026 02:21 IST (Opus)*
