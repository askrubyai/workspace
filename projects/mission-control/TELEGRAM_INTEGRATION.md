# Telegram → Mission Control Integration

**Status**: ✅ IMPLEMENTED  
**Created**: February 13, 2026

## Overview

Automatically creates Mission Control tasks from Telegram messages with issue number tracking (MC-1, MC-2, etc.).

## Features

- ✅ Auto-creates tasks from TG messages
- ✅ Smart priority detection (urgent/important/asap → critical/high)
- ✅ Auto-assigns labels based on keywords (research, development, content, infrastructure)
- ✅ Returns MC issue number reference
- ✅ Includes ngrok link for remote access

## Usage

### Command Line
```bash
node telegram-integration.js "Your task message here"
```

### From OpenClaw Agent
```javascript
const { processMessage } = require('./telegram-integration.js');

const response = await processMessage(userMessage);
// Returns: "✅ Created **MC-X**: Task title\n\nTrack progress at..."
```

### Example Output
```
📨 Processing Telegram message...
✅ Task created: MC-5 - Research SiteGPT competitors
   Priority: medium
   Labels: telegram, reuben-request, research

✅ Created **MC-5**: Research SiteGPT competitors and pricing models

Track progress at http://localhost:5174 (or via ngrok when remote)
```

## Priority Detection

| Keywords | Priority |
|----------|----------|
| urgent, asap, critical | critical |
| important, high priority | high |
| (default) | medium |
| when you can, no rush | low |

## Auto-Labeling

| Keywords | Labels |
|----------|--------|
| research, investigate, analyze | research |
| code, build, implement | development |
| write, blog, article | content |
| deploy, server, infrastructure | infrastructure |

All tasks get: `telegram`, `reuben-request`

## Integration with OpenClaw

To integrate with the main agent, add to SOUL.md or agent code:

```javascript
// When user sends actionable message via Telegram:
const { processMessage } = require('/Users/ruby/.openclaw/workspace/projects/mission-control/telegram-integration.js');

const mcResponse = await processMessage(userMessage);
// Reply with mcResponse (includes MC-X reference)
```

## Testing

```bash
# Test task creation
node telegram-integration.js "Urgent: Fix production bug in API"

# Expected: Creates MC-X task with critical priority
```

## Files

- `telegram-integration.js` - Main integration script
- `STATUS.md` - Mission Control status/access info
- `README.md` - General MC documentation

---

**Next Steps**:
- [ ] Add to main Ruby agent workflow
- [ ] Create cron job for periodic TG message scanning
- [ ] Add support for task updates via TG replies
- [ ] Implement @agent mentions for assignment

*Updated: 2026-02-13 12:55 AM IST*
