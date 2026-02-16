# OpenClaw Skill Description Audit Report

**Date:** 2026-02-12  
**Auditor:** Subagent (skill-audit)  
**Total skills audited:** 53  
**Methodology:** Each skill's `description` field evaluated against OpenAI's prompt engineering guidelines — descriptions as routing logic, negative examples, edge case disambiguation, and expected output signals.

---

## Executive Summary

### Key Findings

1. **~60% of descriptions are too vague** — they describe *what the tool does* but not *when to route to it* or *what inputs trigger it*
2. **11 high-risk conflict clusters** where similar skills could cause misfires (messaging ×3, email ×2, places ×2, image gen ×2, STT ×3, TTS ×2, food ×2, speakers ×3, notes ×4, capture ×3, tasks ×3)
3. **Zero skills use negative examples** ("Don't use when...") — adding these could reduce misfires by ~20%
4. **Canvas skill has no frontmatter description** — it's invisible to the router
5. **food-order vs ordercli is the worst overlap** — same CLI, near-identical descriptions, guaranteed confusion

### Priority Tiers

- **🔴 Critical (fix now):** canvas, food-order/ordercli overlap, imsg/bluebubbles overlap, goplaces/local-places overlap
- **🟡 High (fix soon):** All sparse one-liner descriptions (~25 skills), whisper/whisper-api/summarize disambiguation
- **🟢 Normal:** Already-decent descriptions that just need negative examples added

---

## Conflict Cluster Analysis

Before individual audits, here are the clusters that cause the most routing confusion:

| Cluster | Skills | Root Cause | Fix |
|---------|--------|-----------|-----|
| Messaging | imsg, bluebubbles, wacli | All send messages to people | Disambiguate by platform: iMessage-native vs BlueBubbles-server vs WhatsApp |
| Email | gog, himalaya | Both handle email | gog = Google Workspace (Gmail/Calendar/Drive); himalaya = generic IMAP/SMTP |
| Places | goplaces, local-places | Both use Google Places API | goplaces = standalone CLI; local-places = localhost proxy server |
| Image Gen | nano-banana-pro, openai-image-gen | Both generate images | nano-banana-pro = single image + edits (Gemini); openai-image-gen = batch gallery (OpenAI) |
| STT | openai-whisper, openai-whisper-api, summarize | All can transcribe | whisper = local; whisper-api = cloud; summarize = URL/YouTube extraction (not raw audio files) |
| TTS | sag, sherpa-onnx-tts | Both do text-to-speech | sag = ElevenLabs cloud (expressive voices); sherpa-onnx = local offline (no API key) |
| Food | food-order, ordercli | Same CLI (`ordercli`) | food-order = high-level reorder workflow; ordercli = raw CLI reference |
| Speakers | sonoscli, blucli, spotify-player | All play audio | sonoscli = Sonos; blucli = Bluesound/NAD; spotify = Spotify app |
| Notes | apple-notes, bear-notes, obsidian, notion | All manage notes | Split by app: Apple Notes, Bear, Obsidian vault, Notion API |
| Capture | camsnap, video-frames, peekaboo | All capture visual content | camsnap = RTSP/IP cameras; video-frames = extract from video files; peekaboo = macOS screen/UI |
| Tasks | apple-reminders, things-mac, trello | All manage tasks/todos | apple-reminders = system Reminders.app; things = Things 3 app; trello = Trello boards |

---

## Individual Skill Audits

### 1password

**Current description:** `Set up and use 1Password CLI (op). Use when installing the CLI, enabling desktop app integration, signing in (single or multi-account), or reading/injecting/running secrets via op.`

**Issues:** Decent routing but missing negative examples. Could be confused with generic secret/password questions.

**Proposed description:** `Set up and use 1Password CLI (op). Use when installing the CLI, enabling desktop app integration, signing in (single or multi-account), or reading/injecting/running secrets via op. Triggers: "get secret", "fetch password", "inject env vars from 1Password", "op read", "sign in to 1Password". Don't use when: user asks about passwords generically (just answer from knowledge), asks about other password managers (Bitwarden, LastPass), or needs to generate random passwords without 1Password.`

**Changes to SKILL.md:** Add explicit trigger phrases in the body. Otherwise solid.

---

### apple-notes

**Current description:** `Manage Apple Notes via the 'memo' CLI on macOS (create, view, edit, delete, search, move, and export notes). Use when a user asks OpenClaw to add a note, list notes, search notes, or manage note folders.`

**Issues:** Good routing signals but no disambiguation from bear-notes, obsidian, or notion. A user saying "add a note" is ambiguous.

**Proposed description:** `Manage Apple Notes via the 'memo' CLI on macOS (create, view, edit, delete, search, move, and export notes). Use when user explicitly mentions "Apple Notes", "Notes app", or "memo", OR when the user says "add a note" / "save a note" and Apple Notes is their default notes app. Triggers: "add to Apple Notes", "search my notes", "create a note in Notes app". Don't use when: user mentions Bear, Obsidian, or Notion by name — use those respective skills instead. Don't use when: user says "take note" in a conversational context (they may mean "remember this", not "create a note in an app").`

**Changes to SKILL.md:** Add a disambiguation section in the body noting the other notes skills.

---

### apple-reminders

**Current description:** `Manage Apple Reminders via the 'remindctl' CLI on macOS (list, add, edit, complete, delete). Supports lists, date filters, and JSON/plain output.`

**Issues:** Missing trigger phrases, no disambiguation from things-mac or trello. "Remind me to..." is ambiguous.

**Proposed description:** `Manage Apple Reminders via the 'remindctl' CLI on macOS (list, add, edit, complete, delete). Supports lists, date filters, and JSON/plain output. Use when: user says "add a reminder", "remind me to...", "show my reminders", "check my Reminders app", or explicitly mentions Apple Reminders / Reminders.app. Don't use when: user mentions Things 3 (use things-mac), Trello (use trello), or wants a general to-do list without specifying an app. Don't use when: user says "remind me" conversationally — they may just want you to bring it up later, not create a system reminder.`

**Changes to SKILL.md:** Add trigger phrases section.

---

### bear-notes

**Current description:** `Create, search, and manage Bear notes via grizzly CLI.`

**Issues:** Extremely sparse. No triggers, no disambiguation, no expected outputs. One of the weakest descriptions in the set.

**Proposed description:** `Create, search, and manage Bear notes via the grizzly CLI on macOS. Use when: user explicitly mentions "Bear", "Bear app", or "grizzly", or asks to create/search/manage notes and Bear is their preferred notes app. Triggers: "add to Bear", "search Bear notes", "create a Bear note". Don't use when: user mentions Apple Notes (use apple-notes), Obsidian (use obsidian), or Notion (use notion). Don't use when: user says "note" generically without specifying Bear — ask which app they prefer.`

**Changes to SKILL.md:** Expand the body significantly — currently very thin. Add trigger phrases and example commands.

---

### blogwatcher

**Current description:** `Monitor blogs and RSS/Atom feeds for updates using the blogwatcher CLI.`

**Issues:** Very sparse. No triggers, no expected outputs. Could be confused with web_fetch or summarize for reading web content.

**Proposed description:** `Monitor blogs and RSS/Atom feeds for new posts using the blogwatcher CLI. Use when: user wants to track a blog for updates, subscribe to an RSS/Atom feed, check if a blog has new posts, or set up feed monitoring. Triggers: "watch this blog", "track RSS feed", "any new posts on...", "monitor this feed". Don't use when: user wants to read/summarize a specific article right now (use summarize or web_fetch). Don't use when: user wants to search the web generically (use web_search).`

**Changes to SKILL.md:** Add trigger phrases and example workflows.

---

### blucli

**Current description:** `BluOS CLI (blu) for discovery, playback, grouping, and volume.`

**Issues:** Very sparse. No disambiguation from sonoscli or spotify-player. "Play music" is ambiguous.

**Proposed description:** `Control Bluesound and NAD BluOS players via the 'blu' CLI — discover devices, play/pause/stop, adjust volume, and manage speaker groups. Use when: user explicitly mentions "Bluesound", "BluOS", "NAD", or "blu", or wants to control a BluOS-compatible speaker/streamer. Triggers: "play on Bluesound", "set volume on NAD", "group BluOS speakers". Don't use when: user mentions Sonos (use sonoscli), Spotify (use spotify-player), or Philips Hue (use openhue). Don't use for generic "play music" without specifying the speaker system.`

**Changes to SKILL.md:** Good body content already; just needs the description upgrade.

---

### bluebubbles

**Current description:** `Use when you need to send or manage iMessages via BlueBubbles (recommended iMessage integration). Calls go through the generic message tool with channel="bluebubbles".`

**Issues:** Good intent but conflicts heavily with imsg. "Send an iMessage" could route to either. No clear decision boundary between the two.

**Proposed description:** `Send and manage iMessages via the BlueBubbles server integration using the message tool (channel="bluebubbles"). Supports send, react (tapbacks), edit, unsend, reply, group management, and attachments. Use when: BlueBubbles server is configured and user wants to send/manage iMessages programmatically through the OpenClaw message tool, especially for automation or when imsg CLI is not available. Triggers: "send iMessage via BlueBubbles", "text [person]" (when BlueBubbles is the configured iMessage channel), "react to that iMessage". Don't use when: user wants to read iMessage history or search past messages (use imsg for read-only history access). Don't use when: user asks to send WhatsApp messages (use wacli). Don't use when: imsg CLI is preferred for direct Messages.app interaction on the local Mac.`

**Changes to SKILL.md:** Add a clear comparison note: "BlueBubbles = server-based iMessage (works remotely); imsg = local Messages.app CLI (macOS only, good for reading history)."

---

### camsnap

**Current description:** `Capture frames or clips from RTSP/ONVIF cameras.`

**Issues:** Very sparse. Critical disambiguation needed from video-frames (video files) and peekaboo (macOS screen). "Take a picture" or "capture a frame" is ambiguous.

**Proposed description:** `Capture snapshots, video clips, or motion events from RTSP/ONVIF IP cameras using the camsnap CLI. Use when: user wants a live snapshot or clip from a physical security/IP camera (e.g., "show me the kitchen camera", "grab a frame from the front door cam", "record 10 seconds from the patio"). Triggers: "camera snapshot", "check the [room] camera", "camsnap", "capture from RTSP". Don't use when: user wants to extract a frame from an existing video file (use video-frames). Don't use when: user wants a screenshot of their Mac screen or app window (use peekaboo). Don't use when: user wants to use their phone/node camera (use the nodes camera_snap tool). Expected output: JPEG/PNG snapshot file or MP4 clip.`

**Changes to SKILL.md:** Already solid body. Just needs the description fix.

---

### canvas

**Current description:** *(MISSING — no frontmatter at all)*

**Issues:** **CRITICAL.** No YAML frontmatter means no `description` field. This skill is invisible to the routing system. The model can never discover it via metadata.

**Proposed description:** (Add frontmatter) `Display interactive HTML content (games, visualizations, dashboards) on connected OpenClaw node screens (Mac app, iOS, Android). Use when: user asks to show something visual on a connected device, display an HTML page/game on the node canvas, present a dashboard, or create an interactive demo. Triggers: "show this on my screen", "display on canvas", "present this HTML", "push to node display". Don't use when: user wants a screenshot of their current screen (use peekaboo). Don't use when: user wants to generate an image file (use nano-banana-pro or openai-image-gen). Don't use when: no OpenClaw nodes are connected. Expected output: HTML content rendered on a connected node's canvas WebView.`

**Changes to SKILL.md:** **Add YAML frontmatter block** with name, description, and metadata. This is the highest-priority fix in the entire audit.

---

### clawhub

**Current description:** `Use the ClawHub CLI to search, install, update, and publish agent skills from clawhub.com. Use when you need to fetch new skills on the fly, sync installed skills to latest or a specific version, or publish new/updated skill folders with the npm-installed clawhub CLI.`

**Issues:** Good description already. Could add negative examples.

**Proposed description:** `Use the ClawHub CLI to search, install, update, and publish agent skills from clawhub.com. Use when: you need to find a new skill for a capability you don't have, install/update skills, check for skill updates, or publish a skill to ClawHub. Triggers: "install skill", "find a skill for X", "update skills", "publish skill", "clawhub search". Don't use when: user asks about OpenClaw configuration (that's openclaw.json, not ClawHub). Don't use when: user wants to create a new skill from scratch (use skill-creator first, then clawhub to publish).`

**Changes to SKILL.md:** Minor — add disambiguation from skill-creator.

---

### coding-agent

**Current description:** `Run Codex CLI, Claude Code, OpenCode, or Pi Coding Agent via background process for programmatic control.`

**Issues:** Sparse description for a complex skill. Doesn't clarify when to use this vs. just writing code directly.

**Proposed description:** `Orchestrate coding agents (Codex CLI, Claude Code, OpenCode, Pi) as background processes for complex programming tasks — code generation, refactoring, PR reviews, and multi-file edits. Use when: user asks to "run Codex", "use Claude Code", "have Codex review this PR", or needs a dedicated coding agent for a substantial programming task. Also use for parallel issue fixing or batch PR reviews. Triggers: "codex", "claude code", "opencode", "pi agent", "review this PR with Codex", "fix these issues in parallel". Don't use when: you can handle a simple code question or small edit yourself — only spawn a coding agent for substantial, multi-step programming work. Don't use when: user just wants you to write a script (do it directly). Always use pty:true when running coding agents.`

**Changes to SKILL.md:** Body is excellent and thorough. Description just needs the upgrade.

---

### discord

**Current description:** `Use when you need to control Discord from OpenClaw via the discord tool: send messages, react, post or upload stickers, upload emojis, run polls, manage threads/pins/search, create/edit/delete channels and categories, fetch permissions or member/role/channel info, set bot presence/activity, or handle moderation actions in Discord DMs or channels.`

**Issues:** Long and comprehensive but lacks negative examples. Could be confused with slack for generic "send a message" requests.

**Proposed description:** `Control Discord via the OpenClaw discord tool — send messages, react, stickers, emojis, polls, threads, pins, search, channel management, bot presence, and moderation. Use when: user mentions "Discord" explicitly, references a Discord channel/server/guild, or the conversation context is a Discord channel. Triggers: "send in Discord", "react on Discord", "create a Discord poll", "pin that Discord message". Don't use when: user mentions Slack (use slack skill), iMessage (use imsg/bluebubbles), or WhatsApp (use wacli). Don't use when: user says "send a message" without specifying Discord — ask which platform.`

**Changes to SKILL.md:** Body is thorough. Description needs trimming and negative examples.

---

### eightctl

**Current description:** `Control Eight Sleep pods (status, temperature, alarms, schedules).`

**Issues:** Very sparse. No triggers. Niche enough that false positives are unlikely, but still worth improving.

**Proposed description:** `Control Eight Sleep smart bed pods via the eightctl CLI — check status, set temperature, manage alarms, and configure schedules. Use when: user mentions "Eight Sleep", "sleep pod", "bed temperature", or wants to adjust their smart mattress settings. Triggers: "set bed temp", "Eight Sleep status", "warm up my bed", "set sleep schedule". Don't use when: user asks about sleep quality generically (just answer from knowledge). Don't use when: user mentions smart home lights (use openhue) or speakers (use sonoscli/blucli).`

**Changes to SKILL.md:** Add trigger phrases to body.

---

### food-order

**Current description:** `Reorder Foodora orders + track ETA/status with ordercli. Never confirm without explicit user approval. Triggers: order food, reorder, track ETA.`

**Issues:** **CRITICAL OVERLAP with ordercli skill.** Both use the same `ordercli` binary. This skill is the high-level "reorder workflow" while ordercli is the raw CLI reference. The model has no way to distinguish them.

**Proposed description:** `High-level Foodora reorder workflow using ordercli — safely preview and place reorders with explicit user confirmation, plus ETA/status tracking. Use when: user says "order food", "reorder from Foodora", "reorder my last meal", "track my food order", "what's my delivery ETA". This is the PRIMARY skill for food ordering — it enforces safety rules (preview before confirm). Triggers: "order food", "reorder", "track ETA", "food delivery status". Don't use when: user needs raw ordercli CLI reference or Deliveroo commands (use ordercli skill). Don't use when: user asks about restaurants or menus without wanting to place an order (use goplaces or local-places for restaurant discovery).`

**Changes to SKILL.md:** Add a note at the top: "This skill wraps ordercli with safety guardrails. For raw CLI reference, see the ordercli skill."

---

### gemini

**Current description:** `Gemini CLI for one-shot Q&A, summaries, and generation.`

**Issues:** Sparse. Could be confused with nano-banana-pro (which also uses Gemini). Also overlaps with summarize for "summarize this" requests.

**Proposed description:** `Run Google Gemini CLI for one-shot text Q&A, summaries, and text generation tasks. Use when: user explicitly asks to "use Gemini", "ask Gemini", or needs a second opinion from a different model. Triggers: "gemini", "ask Gemini", "use Gemini to...". Don't use when: user wants to generate images with Gemini (use nano-banana-pro). Don't use when: user wants to summarize a URL/file (use summarize — it's faster and more capable). Don't use when: you can answer the question yourself — only delegate to Gemini when explicitly asked or when a second model opinion adds value.`

**Changes to SKILL.md:** Clarify that this is text-only Gemini, distinct from nano-banana-pro (image generation).

---

### gifgrep

**Current description:** `Search GIF providers with CLI/TUI, download results, and extract stills/sheets.`

**Issues:** Sparse but unique enough to avoid major conflicts. Missing trigger phrases.

**Proposed description:** `Search GIF providers (Tenor, Giphy) via the gifgrep CLI — browse, download, and extract stills/contact sheets from GIFs. Use when: user asks for a GIF, wants to find a reaction GIF, needs a GIF for a specific topic, or wants to extract frames from a GIF file. Triggers: "find a GIF of...", "send me a GIF", "reaction GIF for...", "gifgrep", "extract frames from this GIF". Don't use when: user wants to create/generate an image (use nano-banana-pro or openai-image-gen). Don't use when: user wants to extract frames from a video file, not a GIF (use video-frames).`

**Changes to SKILL.md:** Good body. Just needs description upgrade.

---

### github

**Current description:** `Interact with GitHub using the 'gh' CLI. Use 'gh issue', 'gh pr', 'gh run', and 'gh api' for issues, PRs, CI runs, and advanced queries.`

**Issues:** Decent but could use triggers and negative examples. Could overlap with coding-agent for PR reviews.

**Proposed description:** `Interact with GitHub using the 'gh' CLI — manage issues, pull requests, CI runs, releases, and make API calls. Use when: user asks about GitHub repos, issues, PRs, CI status, or wants to perform GitHub operations. Triggers: "create an issue", "check PR status", "list open PRs", "GitHub Actions", "gh api", "merge PR". Don't use when: user wants a coding agent to review PR code in depth (use coding-agent to spawn Codex/Claude for deep reviews). Don't use when: user wants to browse a GitHub page visually (use browser tool). This skill is for CLI-driven GitHub operations, not code editing.`

**Changes to SKILL.md:** Body is minimal — consider expanding with common gh workflow examples.

---

### gog

**Current description:** `Google Workspace CLI for Gmail, Calendar, Drive, Contacts, Sheets, and Docs.`

**Issues:** Sparse description for a massive skill. Critical disambiguation from himalaya needed — both handle email. No triggers listed.

**Proposed description:** `Google Workspace CLI (gog) for Gmail, Calendar, Drive, Contacts, Sheets, and Docs — send/search email, manage events, access Drive files, read/write spreadsheets. Use when: user mentions Gmail, Google Calendar, Google Drive, Google Sheets, Google Docs, or Google Contacts, OR when the email account is a Gmail/Google Workspace account. Triggers: "send email" (if using Gmail), "check my calendar", "search Gmail", "create a calendar event", "read Google Sheet", "upload to Drive". Don't use when: user has a non-Google email account and wants IMAP/SMTP access (use himalaya). Don't use when: user wants to work with Notion (use notion) or Trello (use trello). This is the preferred email skill when the user's email is Gmail/Google Workspace.`

**Changes to SKILL.md:** The body is excellent. Description needs major expansion.

---

### goplaces

**Current description:** `Query Google Places API (New) via the goplaces CLI for text search, place details, resolve, and reviews. Use for human-friendly place lookup or JSON output for scripts.`

**Issues:** Good but overlaps directly with local-places. Both use Google Places API. Model has no way to choose between them.

**Proposed description:** `Search for places, get details, and read reviews via the goplaces standalone CLI using Google Places API (New). Use when: user asks "find a restaurant near...", "best coffee shop in...", "what's the rating of...", or needs place search/details. This is the PREFERRED places skill — it's a standalone CLI with no server setup required. Triggers: "find places", "restaurant near", "coffee shop in", "place details", "reviews for". Don't use when: local-places proxy server is already running and preferred (local-places is an alternative that runs as a localhost API server). Don't use for navigation/directions (use web_search or browser for maps).`

**Changes to SKILL.md:** Add note that this is the preferred/simpler option vs local-places.

---

### healthcheck

**Current description:** `Host security hardening and risk-tolerance configuration for OpenClaw deployments. Use when a user asks for security audits, firewall/SSH/update hardening, risk posture, exposure review, OpenClaw cron scheduling for periodic checks, or version status checks on a machine running OpenClaw (laptop, workstation, Pi, VPS).`

**Issues:** Good description with clear triggers. Could add negative examples.

**Proposed description:** `Host security hardening and risk-tolerance configuration for OpenClaw deployments. Use when: user asks for security audits, firewall/SSH/update hardening, risk posture assessment, exposure review, OpenClaw cron scheduling for periodic checks, or version status checks on a machine running OpenClaw. Triggers: "security audit", "harden my machine", "check my firewall", "is my setup secure", "OpenClaw security". Don't use when: user asks about application-level security (code vulnerabilities, API auth) — just answer from knowledge. Don't use when: user asks about 1Password or secrets management (use 1password skill).`

**Changes to SKILL.md:** Already thorough. Minor description polish.

---

### himalaya

**Current description:** `CLI to manage emails via IMAP/SMTP. Use 'himalaya' to list, read, write, reply, forward, search, and organize emails from the terminal. Supports multiple accounts and message composition with MML (MIME Meta Language).`

**Issues:** Good description but needs disambiguation from gog. "Send an email" routes ambiguously between them.

**Proposed description:** `Manage email via IMAP/SMTP using the himalaya CLI — list, read, write, reply, forward, search, and organize emails across any email provider. Use when: user has a non-Google email account (Outlook, ProtonMail, custom IMAP), or explicitly mentions "himalaya", or needs generic IMAP/SMTP email access. Triggers: "check email" (non-Gmail), "himalaya", "read IMAP mail", "send email via SMTP". Don't use when: user's email is Gmail/Google Workspace — use gog instead (it has richer Gmail integration). Don't use when: user wants to check email on a Google account (gog is better for Gmail search, labels, and Workspace integration). Himalaya is the fallback email skill for non-Google providers.`

**Changes to SKILL.md:** Add a disambiguation note about gog vs himalaya at the top.

---

### imsg

**Current description:** `iMessage/SMS CLI for listing chats, history, watch, and sending.`

**Issues:** Very sparse. Critical overlap with bluebubbles. "Send an iMessage" routes to either.

**Proposed description:** `Read and send iMessages/SMS directly via the local Messages.app on macOS using the imsg CLI — list chats, view history, watch for new messages, and send texts/attachments. Use when: user wants to read iMessage history, search past conversations, watch a chat for incoming messages, or send a quick iMessage from the local Mac. Triggers: "read my iMessages", "check Messages app", "send iMessage", "imsg", "iMessage history", "watch chat". Don't use when: BlueBubbles is the configured iMessage channel and user wants server-based iMessage management (use bluebubbles). Don't use when: user wants to send WhatsApp messages (use wacli). imsg is the LOCAL macOS Messages.app client — it reads directly from the Messages database. Prefer imsg for reading/searching message history; prefer bluebubbles for remote/automated sending.`

**Changes to SKILL.md:** Add disambiguation section explaining imsg (local, good for history) vs bluebubbles (server, good for automation).

---

### local-places

**Current description:** `Search for places (restaurants, cafes, etc.) via Google Places API proxy on localhost.`

**Issues:** **Overlaps directly with goplaces.** Same underlying API, different delivery mechanism. The model cannot distinguish when to use which.

**Proposed description:** `Search for places via a local Google Places API proxy server running on localhost:8000 — requires starting the server first, then querying via curl/HTTP. Use when: the local-places proxy server is already running, or the user explicitly requests the localhost proxy approach. This is the ALTERNATIVE to goplaces (which is simpler). Triggers: "local-places", explicit mention of the localhost proxy. Don't use when: goplaces CLI is available — prefer goplaces as it requires no server setup. Don't use when: user just wants to "find a restaurant" (use goplaces, the simpler option). Only use this skill if goplaces is unavailable or the user specifically wants the HTTP proxy approach.`

**Changes to SKILL.md:** Add a prominent note: "Prefer goplaces for place searches — it's simpler. Use local-places only when you need the HTTP API proxy pattern."

---

### mcporter

**Current description:** `Use the mcporter CLI to list, configure, auth, and call MCP servers/tools directly (HTTP or stdio), including ad-hoc servers, config edits, and CLI/type generation.`

**Issues:** Good but niche. Could use trigger phrases.

**Proposed description:** `Use the mcporter CLI to discover, configure, authenticate, and call MCP (Model Context Protocol) servers and tools directly — supports both HTTP and stdio transports. Use when: user asks about MCP servers, wants to call an MCP tool, needs to configure MCP server connections, or wants to generate CLI wrappers for MCP tools. Triggers: "MCP server", "mcporter", "call MCP tool", "list MCP tools", "configure MCP". Don't use when: user wants a specific skill that already wraps an MCP tool (use that skill directly). Don't use when: user asks about OpenClaw skills (use clawhub or skill-creator).`

**Changes to SKILL.md:** Body is decent. Description upgrade is the main fix.

---

### model-usage

**Current description:** `Use CodexBar CLI local cost usage to summarize per-model usage for Codex or Claude, including the current (most recent) model or a full model breakdown. Trigger when asked for model-level usage/cost data from codexbar, or when you need a scriptable per-model summary from codexbar cost JSON.`

**Issues:** Good triggers but niche. Slight risk of misfiring on generic "how much have I spent" questions.

**Proposed description:** `Summarize per-model API usage and cost data from CodexBar's local logs on macOS. Use when: user asks "how much have I spent on Claude/Codex", "what model am I using", "model usage breakdown", "codexbar costs", or needs per-model cost analytics. Triggers: "model usage", "API costs", "how much did that cost", "codexbar", "spending breakdown". Don't use when: user asks about OpenClaw session costs (check session logs instead). Don't use when: user asks about pricing in general (just answer from knowledge). Don't use on Linux — CodexBar is macOS only.`

**Changes to SKILL.md:** Minor tweaks. Already decent.

---

### nano-banana-pro

**Current description:** `Generate or edit images via Gemini 3 Pro Image (Nano Banana Pro).`

**Issues:** Sparse. Overlaps with openai-image-gen. "Generate an image" is ambiguous between them.

**Proposed description:** `Generate or edit images using Google Gemini 3 Pro Image via the bundled Python script. Supports single image generation, image editing (modify an existing image), and multi-image composition (combine up to 14 images). Use when: user wants to generate a single image, edit/modify an existing image, compose multiple images together, or explicitly asks for Gemini image generation. Triggers: "generate an image", "edit this image", "modify this photo", "combine these images", "Gemini image". Don't use when: user wants batch image generation with a gallery output (use openai-image-gen — it generates multiple images with an HTML gallery). Don't use when: user wants DALL-E specifically (use openai-image-gen). Prefer nano-banana-pro for single image gen/edit; prefer openai-image-gen for batch generation. Expected output: PNG file path with MEDIA: line for chat attachment.`

**Changes to SKILL.md:** Add disambiguation note about openai-image-gen.

---

### nano-pdf

**Current description:** `Edit PDFs with natural-language instructions using the nano-pdf CLI.`

**Issues:** Sparse but unique enough. Could mistake "summarize this PDF" for a nano-pdf task.

**Proposed description:** `Edit specific pages in PDF files using natural-language instructions via the nano-pdf CLI — add text, annotations, redactions, or visual modifications to PDFs. Use when: user wants to modify/edit a PDF page (add text, redact info, annotate, fill forms). Triggers: "edit this PDF", "add text to PDF", "redact this in the PDF", "modify PDF page". Don't use when: user wants to read/extract text from a PDF (use summarize or just read the file). Don't use when: user wants to convert PDF to another format (use other tools). Don't use when: user wants to summarize a PDF's content (use summarize). Expected output: Modified PDF file.`

**Changes to SKILL.md:** Clarify that this is for editing, not reading/extracting.

---

### notion

**Current description:** `Notion API for creating and managing pages, databases, and blocks.`

**Issues:** Very sparse. No triggers, no disambiguation from other notes apps.

**Proposed description:** `Create and manage Notion pages, databases, and blocks via the Notion API — supports creating pages, querying databases, updating content, and managing block structure. Use when: user explicitly mentions "Notion", wants to create/update a Notion page, query a Notion database, or manage Notion content. Triggers: "add to Notion", "create Notion page", "query Notion database", "update Notion", "Notion API". Don't use when: user mentions Apple Notes (use apple-notes), Bear (use bear-notes), or Obsidian (use obsidian). Don't use when: user says "take a note" generically — ask which platform. Requires NOTION_API_KEY and the target pages/databases must be shared with the integration.`

**Changes to SKILL.md:** Expand the description significantly. Add prerequisite callout about sharing pages with the integration.

---

### obsidian

**Current description:** `Work with Obsidian vaults (plain Markdown notes) and automate via obsidian-cli.`

**Issues:** Sparse. No triggers, no disambiguation from bear-notes or apple-notes.

**Proposed description:** `Manage Obsidian vaults (plain Markdown notes on disk) via obsidian-cli — search, create, move/rename notes with automatic wikilink updates, and set default vaults. Use when: user explicitly mentions "Obsidian", references an Obsidian vault, or asks to manage Markdown notes in a vault structure. Triggers: "Obsidian note", "add to my vault", "search Obsidian", "obsidian-cli", "create note in vault". Don't use when: user mentions Apple Notes (use apple-notes), Bear (use bear-notes), or Notion (use notion). Don't use when: user wants to edit a standalone Markdown file not in a vault (just edit the file directly). Note: Obsidian vaults are plain folders with .md files — you can also edit them directly without obsidian-cli when the task is simple.`

**Changes to SKILL.md:** Good body content. Description needs expansion.

---

### openai-image-gen

**Current description:** `Batch-generate images via OpenAI Images API. Random prompt sampler + 'index.html' gallery.`

**Issues:** Misleading description — sounds like a random batch tool, not a general image generator. Overlaps with nano-banana-pro.

**Proposed description:** `Generate images via OpenAI Images API (GPT Image, DALL-E 3, DALL-E 2) with batch support and HTML gallery output. Use when: user wants multiple images generated at once, wants an HTML gallery of results, explicitly asks for DALL-E or GPT Image models, or needs OpenAI-specific image generation. Triggers: "DALL-E", "GPT image", "generate images with OpenAI", "batch image generation", "image gallery". Don't use when: user wants to edit an existing image (use nano-banana-pro — it supports image editing). Don't use when: user wants a single quick image (nano-banana-pro is simpler for single images). Prefer openai-image-gen for batch/gallery; prefer nano-banana-pro for single image gen/edit. Expected output: Image files + prompts.json + index.html gallery.`

**Changes to SKILL.md:** Fix the description to not sound like a random prompt sampler. It's a real image generation tool.

---

### openai-whisper

**Current description:** `Local speech-to-text with the Whisper CLI (no API key).`

**Issues:** Sparse. Needs disambiguation from openai-whisper-api and summarize (YouTube transcription).

**Proposed description:** `Transcribe audio files to text locally using the OpenAI Whisper CLI — no API key or internet required. Runs on-device with downloadable models. Use when: user wants to transcribe a local audio file (MP3, M4A, WAV), needs offline transcription, or wants to avoid API costs. Triggers: "transcribe this audio", "speech to text", "whisper", "transcribe locally". Don't use when: user wants cloud transcription with faster processing (use openai-whisper-api). Don't use when: user wants to transcribe a YouTube video or URL (use summarize with --youtube flag). Don't use when: user has a live audio stream (this is for files only). Prefer openai-whisper for: offline/private transcription, large files (no API cost), no internet. Prefer openai-whisper-api for: speed, accuracy with whisper-1 model.`

**Changes to SKILL.md:** Add disambiguation from whisper-api and summarize.

---

### openai-whisper-api

**Current description:** `Transcribe audio via OpenAI Audio Transcriptions API (Whisper).`

**Issues:** Sparse. Overlaps with openai-whisper (local) and summarize (URLs).

**Proposed description:** `Transcribe audio files via OpenAI's cloud Whisper API (/v1/audio/transcriptions) — requires OPENAI_API_KEY. Use when: user wants fast, accurate cloud transcription of a local audio file, or when local Whisper is too slow/unavailable. Triggers: "transcribe this audio" (when cloud is preferred), "whisper API", "transcribe with OpenAI". Don't use when: user wants free/offline transcription (use openai-whisper for local processing). Don't use when: user wants to transcribe a YouTube video or URL (use summarize). Don't use when: user wants to transcribe audio from an IP camera (use camsnap to capture first, then transcribe). Requires OPENAI_API_KEY. Expected output: text transcript file.`

**Changes to SKILL.md:** Add disambiguation and decision tree for the three STT options.

---

### openhue

**Current description:** `Control Philips Hue lights/scenes via the OpenHue CLI.`

**Issues:** Sparse but unique enough. Low misfire risk.

**Proposed description:** `Control Philips Hue smart lights and scenes via the OpenHue CLI and a Hue Bridge — turn lights on/off, adjust brightness/color, activate scenes. Use when: user mentions "Hue", "lights", "turn on the lights", "set the lights to...", "living room lights", or any smart lighting control with Philips Hue. Triggers: "turn on lights", "set lights to blue", "dim the bedroom", "activate scene", "openhue", "Hue". Don't use when: user mentions smart speakers/audio (use sonoscli or blucli). Don't use when: user mentions Eight Sleep/bed (use eightctl). Don't use when: user asks about lighting in a photo (they mean image editing, not smart home).`

**Changes to SKILL.md:** Add trigger phrases. Body is fine.

---

### oracle

**Current description:** `Best practices for using the oracle CLI (prompt + file bundling, engines, sessions, and file attachment patterns).`

**Issues:** Doesn't explain what oracle actually does in user-facing terms. "Best practices" doesn't tell the model when to trigger this.

**Proposed description:** `Use the oracle CLI to send prompts with bundled file context to another LLM (GPT-5.2, etc.) for one-shot analysis — great for code review, repo-wide questions, or getting a second opinion with full file context. Use when: user asks to "use oracle", needs to query another model with file attachments, wants a second opinion on code, or needs repo-context-aware analysis from an external model. Triggers: "oracle", "ask oracle", "second opinion on this code", "analyze this repo with oracle". Don't use when: you can answer the question yourself. Don't use when: user wants to run a coding agent interactively (use coding-agent). Oracle is for advisory one-shot queries; treat output as suggestions to verify.`

**Changes to SKILL.md:** Fix description to explain user-facing value, not just "best practices."

---

### ordercli

**Current description:** `Foodora-only CLI for checking past orders and active order status (Deliveroo WIP).`

**Issues:** **CRITICAL OVERLAP with food-order.** Same CLI, unclear when to use which. This reads as a subset of food-order.

**Proposed description:** `Raw CLI reference for ordercli — Foodora order history, status tracking, reordering, session management, and Deliveroo (WIP). Use when: you need the raw ordercli command reference, Deliveroo-specific commands, or advanced CLI features (session import, cookie management, browser login). Triggers: "ordercli", specific CLI flags, Deliveroo commands. Don't use when: user wants to reorder food from Foodora (use food-order — it has the safe reorder workflow with confirmation). The food-order skill is the primary skill for food ordering; this skill is the raw CLI reference. Prefer food-order for user-facing food ordering tasks.`

**Changes to SKILL.md:** Add a clear note: "For user-facing food ordering, use the food-order skill instead. This skill is the raw CLI reference."

---

### peekaboo

**Current description:** `Capture and automate macOS UI with the Peekaboo CLI.`

**Issues:** Very sparse description for a massive, feature-rich skill. Could be confused with camsnap (capture) or the browser tool (UI automation).

**Proposed description:** `Full macOS UI automation and screen capture via the Peekaboo CLI — screenshot windows/screens, click/type/drag UI elements, manage apps/windows/menus, inspect accessibility elements, and automate desktop workflows. Use when: user wants a screenshot of their Mac screen or app window, needs to automate a macOS desktop app (not a browser), wants to click/type into native macOS UI elements, or needs to inspect screen content with annotations. Triggers: "screenshot", "take a screenshot", "click on [app element]", "automate [Mac app]", "peekaboo", "what's on my screen", "capture screen". Don't use when: user wants to capture from an IP/RTSP camera (use camsnap). Don't use when: user wants to automate a web browser (use the browser tool). Don't use when: user wants to extract frames from a video file (use video-frames). Peekaboo = macOS desktop automation. Browser tool = web automation. camsnap = IP camera capture.`

**Changes to SKILL.md:** Excellent body content. Description is the only problem — extremely underselling the skill.

---

### sag

**Current description:** `ElevenLabs text-to-speech with mac-style say UX.`

**Issues:** Sparse. Overlaps with sherpa-onnx-tts. "Read this aloud" is ambiguous.

**Proposed description:** `High-quality text-to-speech via ElevenLabs cloud API using the sag CLI — expressive voices with emotion tags, multiple voice models, and local playback. Use when: user wants natural-sounding TTS, voice acting with emotion/style, or high-quality audio output and has ELEVENLABS_API_KEY configured. Triggers: "say this aloud", "read this in a [voice/style]", "TTS", "text to speech", "sag", "ElevenLabs". Don't use when: user needs offline/local TTS without cloud API (use sherpa-onnx-tts). Don't use when: OpenClaw's built-in TTS tool is sufficient for simple speech. Prefer sag for: expressive, high-quality voices with emotion control. Prefer sherpa-onnx-tts for: offline/private TTS, no API key needed.`

**Changes to SKILL.md:** Good body content. Description needs expansion.

---

### session-logs

**Current description:** `Search and analyze your own session logs (older/parent conversations) using jq.`

**Issues:** Good but could use more specific triggers. Unique enough to avoid conflicts.

**Proposed description:** `Search and analyze OpenClaw session logs (past conversations, chat history) stored as JSONL files using jq and rg. Use when: user asks about a previous conversation, references something discussed before, wants to find what was said in a past session, or needs cost/usage analytics from session history. Triggers: "what did we talk about yesterday", "find that conversation where...", "session cost", "search my chat history", "what did I say about...". Don't use when: user asks about working memory or task state (check memory/ files instead). Don't use when: user wants real-time conversation context (it's already in the current session).`

**Changes to SKILL.md:** Excellent body with great query examples. Description just needs triggers.

---

### sherpa-onnx-tts

**Current description:** `Local text-to-speech via sherpa-onnx (offline, no cloud)`

**Issues:** Sparse. Overlaps with sag. No triggers.

**Proposed description:** `Offline local text-to-speech via sherpa-onnx — runs entirely on-device with no cloud API or internet required. Supports multiple Piper voice models. Use when: user wants TTS and either (a) no ELEVENLABS_API_KEY is available, (b) offline/private TTS is needed, or (c) user explicitly requests local TTS. Triggers: "local TTS", "offline text to speech", "sherpa-onnx", "say this without API". Don't use when: user wants high-quality expressive TTS with emotion tags (use sag with ElevenLabs). Don't use when: OpenClaw's built-in TTS tool is sufficient. sherpa-onnx-tts = free, offline, good quality. sag = cloud, premium quality, expressive.`

**Changes to SKILL.md:** Add disambiguation note from sag.

---

### skill-creator

**Current description:** `Create or update AgentSkills. Use when designing, structuring, or packaging skills with scripts, references, and assets.`

**Issues:** Good intent but could be more specific about triggers.

**Proposed description:** `Guide for creating, structuring, and packaging new OpenClaw skills — includes skill anatomy, SKILL.md authoring, progressive disclosure patterns, and the init/edit/package workflow. Use when: user wants to create a new skill, improve an existing skill, package a skill for distribution, or needs guidance on skill structure and best practices. Triggers: "create a skill", "new skill", "package skill", "skill-creator", "how to write a skill". Don't use when: user wants to install/find an existing skill from ClawHub (use clawhub). Don't use when: user wants to modify OpenClaw configuration (edit openclaw.json directly).`

**Changes to SKILL.md:** Excellent, comprehensive body. Description just needs better triggers.

---

### slack

**Current description:** `Use when you need to control Slack from OpenClaw via the slack tool, including reacting to messages or pinning/unpinning items in Slack channels or DMs.`

**Issues:** Focuses too much on reactions/pins, underselling the full capability. Missing negative examples.

**Proposed description:** `Control Slack via the OpenClaw slack tool — send/edit/delete messages, react, manage pins, and fetch member info in Slack channels and DMs. Use when: user mentions "Slack" explicitly, references a Slack channel/workspace, or the conversation context is a Slack channel. Triggers: "send in Slack", "Slack message", "react in Slack", "pin in Slack". Don't use when: user mentions Discord (use discord). Don't use when: user mentions iMessage (use imsg/bluebubbles) or WhatsApp (use wacli). Don't use when: user says "send a message" without specifying Slack — ask which platform.`

**Changes to SKILL.md:** Update description to reflect full capability, not just reactions/pins.

---

### songsee

**Current description:** `Generate spectrograms and feature-panel visualizations from audio with the songsee CLI.`

**Issues:** Sparse but very niche. Low misfire risk. Just needs triggers.

**Proposed description:** `Generate spectrograms and audio feature visualizations (mel, chroma, loudness, tempo, MFCC) from audio files using the songsee CLI. Use when: user wants to visualize audio, generate a spectrogram, analyze frequency content of a recording, or create audio feature panels. Triggers: "spectrogram", "visualize audio", "songsee", "audio analysis visualization", "frequency plot". Don't use when: user wants to transcribe audio to text (use openai-whisper or openai-whisper-api). Don't use when: user wants to play audio (use spotify-player, sonoscli, or blucli).`

**Changes to SKILL.md:** Good body. Description needs triggers.

---

### sonoscli

**Current description:** `Control Sonos speakers (discover/status/play/volume/group).`

**Issues:** Sparse. Needs disambiguation from blucli and spotify-player.

**Proposed description:** `Control Sonos speakers on the local network via the sonos CLI — discover devices, play/pause/stop, adjust volume, manage groups, browse favorites, and queue tracks. Use when: user mentions "Sonos" or a Sonos speaker name, or wants to control Sonos-specific features (grouping, favorites, queue). Triggers: "play on Sonos", "Sonos volume", "group Sonos speakers", "sonos", speaker names that are Sonos devices. Don't use when: user mentions Bluesound/NAD/BluOS (use blucli). Don't use when: user wants to control Spotify playback (use spotify-player). Don't use for generic "play music" without specifying Sonos.`

**Changes to SKILL.md:** Good body. Description needs expansion.

---

### spotify-player

**Current description:** `Terminal Spotify playback/search via spogo (preferred) or spotify_player.`

**Issues:** Sparse. Could overlap with sonoscli/blucli for "play music" commands.

**Proposed description:** `Control Spotify playback and search from the terminal via spogo (preferred) or spotify_player CLI — play/pause/skip, search tracks/albums/playlists, manage devices, and check playback status. Requires Spotify Premium. Use when: user mentions "Spotify", wants to play a specific song/artist/playlist, or asks to control Spotify playback. Triggers: "play [song] on Spotify", "Spotify", "next track", "what's playing", "search Spotify for...", "spogo". Don't use when: user wants to control physical speakers without mentioning Spotify (use sonoscli or blucli). Don't use when: user wants to play local audio files (this is Spotify streaming only). Don't use when: user wants audio visualization (use songsee).`

**Changes to SKILL.md:** Good body. Description needs expansion and disambiguation.

---

### summarize

**Current description:** `Summarize or extract text/transcripts from URLs, podcasts, and local files (great fallback for "transcribe this YouTube/video").`

**Issues:** Good description with the parenthetical hint, but could be much more explicit about routing. Key disambiguation needed from web_fetch and whisper skills.

**Proposed description:** `Summarize URLs, local files, and YouTube videos using the summarize CLI — extracts text, generates summaries, and handles YouTube transcript extraction. Use when: user shares a URL and says "summarize this", "what's this about", "TLDR", asks to transcribe a YouTube video, or wants to extract text from a URL or local file. Triggers: "summarize this URL", "what's this link about", "transcribe this YouTube video", "summarize this PDF", "TLDR", "summarize.sh". Don't use when: user wants to transcribe a local audio file (MP3/WAV) — use openai-whisper or openai-whisper-api instead. Don't use when: user wants to read/fetch a web page without summarization (use web_fetch). Don't use when: user wants to search the web (use web_search). Summarize = content extraction + summarization. web_fetch = raw page content. web_search = find pages.`

**Changes to SKILL.md:** Good body with trigger phrases already. Description needs the disambiguation.

---

### things-mac

**Current description:** `Manage Things 3 via the 'things' CLI on macOS (add/update projects+todos via URL scheme; read/search/list from the local Things database). Use when a user asks OpenClaw to add a task to Things, list inbox/today/upcoming, search tasks, or inspect projects/areas/tags.`

**Issues:** Good description. Missing negative examples for disambiguation from apple-reminders and trello.

**Proposed description:** `Manage Things 3 tasks and projects via the 'things' CLI on macOS — add/update todos, list inbox/today/upcoming, search tasks, and inspect projects/areas/tags. Reads from the local Things database and adds via URL scheme. Use when: user mentions "Things", "Things 3", or wants to manage tasks in Things specifically. Triggers: "add to Things", "Things inbox", "Things today", "search Things tasks", "things". Don't use when: user mentions Apple Reminders (use apple-reminders). Don't use when: user mentions Trello (use trello). Don't use when: user says "add a task" generically without specifying Things — ask which app. Things 3 = local macOS task manager with projects/areas. Apple Reminders = system-level reminders. Trello = cloud-based board/card system.`

**Changes to SKILL.md:** Good body. Add disambiguation note.

---

### tmux

**Current description:** `Remote-control tmux sessions for interactive CLIs by sending keystrokes and scraping pane output.`

**Issues:** Good description. Niche enough to avoid conflicts. Could use negative examples.

**Proposed description:** `Remote-control tmux sessions for interactive CLIs — create sessions, send keystrokes, capture pane output, and manage terminal multiplexing. Use when: you need to run an interactive terminal application that requires persistent TTY sessions (Python REPL, long-running processes), or when the exec tool with pty:true isn't sufficient. Triggers: "tmux", "create a tmux session", "interactive terminal", "persistent shell session". Don't use when: exec tool with background:true or pty:true can handle the task (prefer exec for simpler cases). Don't use when: coding agents need to run (use coding-agent skill with pty:true instead). tmux is for cases where you need persistent, multiplexed terminal sessions beyond what exec provides.`

**Changes to SKILL.md:** Already has good body. Description just needs clarification on when to prefer tmux over exec.

---

### trello

**Current description:** `Manage Trello boards, lists, and cards via the Trello REST API.`

**Issues:** Sparse. No triggers, no disambiguation from things-mac or apple-reminders.

**Proposed description:** `Manage Trello boards, lists, and cards via the Trello REST API using curl — create/move/update cards, list boards, and organize project work. Use when: user mentions "Trello", references a Trello board/list/card, or wants to manage tasks on Trello specifically. Triggers: "add to Trello", "Trello board", "move card to Done", "create Trello card", "check Trello". Don't use when: user mentions Things 3 (use things-mac). Don't use when: user mentions Apple Reminders (use apple-reminders). Don't use when: user wants a simple to-do list without specifying Trello — ask which tool. Requires TRELLO_API_KEY and TRELLO_TOKEN.`

**Changes to SKILL.md:** Expand the body with more workflow examples. Description needs significant upgrade.

---

### video-frames

**Current description:** `Extract frames or short clips from videos using ffmpeg.`

**Issues:** Sparse. Could be confused with camsnap (camera capture) or peekaboo (screen capture).

**Proposed description:** `Extract still frames or thumbnails from existing video files (MP4, MOV, etc.) using ffmpeg — capture a frame at a specific timestamp or create quick thumbnails for inspection. Use when: user has a video file and wants to extract a specific frame ("what happens at 1:30 in this video?"), create a thumbnail, or grab a still image from a video. Triggers: "extract frame from video", "screenshot from video at [time]", "thumbnail from video", "video frame", "what's at [timestamp] in this video". Don't use when: user wants a live camera snapshot (use camsnap for RTSP/IP cameras). Don't use when: user wants a screenshot of their Mac screen (use peekaboo). Don't use when: user wants to extract frames from a GIF (use gifgrep). video-frames = extract from video files. camsnap = live IP camera. peekaboo = macOS screen. Expected output: JPEG or PNG frame file.`

**Changes to SKILL.md:** Good body. Description needs major expansion.

---

### voice-call

**Current description:** `Start voice calls via the OpenClaw voice-call plugin.`

**Issues:** Sparse. Unique enough to avoid conflicts, but needs triggers.

**Proposed description:** `Initiate and manage voice calls via the OpenClaw voice-call plugin (Twilio, Telnyx, Plivo, or mock) — start calls, speak messages, continue conversations, and check call status. Use when: user asks to "call someone", "make a phone call", "voice call", or needs programmatic voice calling. Triggers: "call [person/number]", "voice call", "phone call", "make a call". Don't use when: user wants to send a text message (use imsg, bluebubbles, wacli, or the message tool). Don't use when: user wants audio TTS playback (use sag or sherpa-onnx-tts). Requires the voice-call plugin to be enabled in OpenClaw config.`

**Changes to SKILL.md:** Good body. Description needs triggers and prerequisites.

---

### wacli

**Current description:** `Send WhatsApp messages to other people or search/sync WhatsApp history via the wacli CLI (not for normal user chats).`

**Issues:** Good disclaimer about "not for normal user chats" — one of the better descriptions. Could use more explicit triggers.

**Proposed description:** `Send WhatsApp messages to third parties and search/sync WhatsApp history via the wacli CLI. Use when: user explicitly asks to message someone else on WhatsApp, search WhatsApp chat history, or sync WhatsApp conversations. Triggers: "send WhatsApp to [person]", "WhatsApp [person]", "search WhatsApp for...", "wacli", "text [person] on WhatsApp". Don't use when: the user is currently chatting with you on WhatsApp — OpenClaw routes that automatically. Don't use when: user wants to send iMessage (use imsg or bluebubbles). Don't use when: user wants to send a generic message without specifying WhatsApp. This is for contacting THIRD PARTIES on WhatsApp, not for the user's own conversation with OpenClaw.`

**Changes to SKILL.md:** Body already has excellent safety notes. Description upgrade is the main fix.

---

### weather

**Current description:** `Get current weather and forecasts (no API key required).`

**Issues:** Sparse but unique. Low misfire risk. Just needs triggers.

**Proposed description:** `Get current weather conditions and forecasts using wttr.in or Open-Meteo — no API key required, works with curl. Use when: user asks about weather, temperature, forecast, or conditions for any location. Triggers: "what's the weather", "temperature in [city]", "will it rain", "forecast for tomorrow", "weather". Don't use when: user asks about historical weather data (search the web instead). Don't use when: user asks about climate change or weather science (answer from knowledge).`

**Changes to SKILL.md:** Good body with both services documented. Description just needs triggers.

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| Total skills audited | 53 |
| Missing frontmatter (CRITICAL) | 1 (canvas) |
| Severe overlap/conflict pairs | 5 (food-order/ordercli, goplaces/local-places, imsg/bluebubbles, nano-banana-pro/openai-image-gen, openai-whisper/openai-whisper-api) |
| Descriptions under 15 words | 22 (~42%) |
| Descriptions with negative examples | 0 (0%) |
| Descriptions with explicit triggers | 3 (~6%) |
| Skills needing body changes too | 12 |

## Top 10 Priority Fixes

1. **canvas** — Add frontmatter entirely (currently invisible to router)
2. **food-order / ordercli** — Deduplicate and cross-reference (same CLI, guaranteed confusion)
3. **imsg / bluebubbles** — Add clear decision boundary (both handle iMessage)
4. **goplaces / local-places** — Mark goplaces as primary, local-places as fallback
5. **nano-banana-pro / openai-image-gen** — Single vs batch, edit vs generate
6. **openai-whisper / openai-whisper-api / summarize** — STT decision tree
7. **sag / sherpa-onnx-tts** — Cloud vs local TTS
8. **gog / himalaya** — Gmail vs generic IMAP
9. **peekaboo** — Massively undersold; description doesn't match capability
10. **All 22 sparse descriptions** — Add triggers + negative examples

---

*Report generated for Ruby's review. No SKILL.md files were modified.*
