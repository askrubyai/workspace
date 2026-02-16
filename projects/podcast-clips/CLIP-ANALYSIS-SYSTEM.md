# 🎬 PODCAST CLIP ANALYSIS SYSTEM

*Standard operating procedure for analyzing OnlyDevs episodes*

---

## 📋 STEP 1: Get Transcript

```bash
# Get video ID from URL
VIDEO_ID="yemt4ciysvM"

# Download transcript
yt-dlp --write-auto-sub --sub-lang en --skip-download \
  "https://www.youtube.com/watch?v=$VIDEO_ID" \
  -o "transcripts/episode-XX-COMPANY-GUEST"

# OR use youtube_transcript_api
python3 -c "
from youtube_transcript_api import YouTubeTranscriptApi
transcript = YouTubeTranscriptApi.get_transcript('$VIDEO_ID')
# Save with timestamps
"
```

**Naming convention:** `episode-XX-[company]-[guest]-clean.txt`
- Use company name (not project name)
- e.g., `episode-01-blueshift-claire-clean.txt`

---

## 📋 STEP 2: Identify Clip Candidates

Scan transcript for these HIGH-SIGNAL patterns:

### Story Triggers (Origin/Journey)
- "When I first..."
- "I didn't know..."
- "That's when I realized..."
- "Back when..."
- "The craziest thing..."

### Hot Takes / Opinions
- "I think..." / "I believe..."
- "The truth is..."
- "Most people don't understand..."
- "Everyone thinks X but actually..."
- "The mistake I see is..."

### Aha Moments
- "Boom" / "Suddenly"
- "That's when it clicked"
- "I was shocked"
- Numbers/stats that surprise

### Framework / Mental Models
- "There are X things..."
- "The way I think about it..."
- "The two pillars..."
- "My framework is..."

### Pain Points (Solana-specific)
- cargo.lock issues
- Platform tools frustration
- Rust version mismatches
- Compilation errors
- DevX problems

---

## 📋 STEP 3: Build Self-Contained Clips

Each clip MUST answer these questions:

| Element | Question | Required? |
|---------|----------|-----------|
| **WHO** | Who is speaking? What's their credibility? | ✅ Yes |
| **SETUP** | What problem/situation are they describing? | ✅ Yes |
| **STAKES** | Why should a Solana dev care? | ✅ Yes |
| **PAYOFF** | What's the insight/conclusion/surprise? | ✅ Yes |
| **CTA** | What should viewer do next? | Optional |

### Story Arc Template
```
1. HOOK (0-3s) - Attention grabber
2. CONTEXT (3-15s) - Who is this, what's the situation
3. TENSION (15-30s) - The problem, the skepticism, the challenge
4. CLIMAX (30-45s) - The discovery, the insight, the payoff
5. RESOLUTION (45-60s) - What it means, why it matters
```

---

## 📋 STEP 4: Write Titles (Solana Dev Focus)

### Core Title Principles

1. **Third person ("she/he") often beats first person** - Creates narrative distance, feels like a story
2. **Never frame Solana negatively** - Curiosity over criticism, solutions over problems
3. **Contrast creates intrigue** - "family trip → viral tool" or "late starter → compiler engineer"
4. **Generalize specifics for universal appeal** - "very late" > "at 20" (not everyone knows dev context)
5. **Solution-focused > command-focused** - "She solved X" > "Stop doing X"
6. **Curiosity questions work** - "HOW many lines?!" invites clicks without negativity

### Title Patterns That Work

**Third-person hero framing:**
- "She [humble start]. Now she [impressive outcome]."
- "She [solved/built/discovered] [Solana thing]"
- Example: "She started coding very late. Now she builds Solana's compiler."
- Example: "She solved Solana's Rust version nightmares"

**Serendipity/contrast:**
- "She [unexpected context] and ended up [surprising outcome]"
- "From [mundane thing] to [impressive Solana thing]"
- Example: "She went on a family trip to Taiwan and ended up building Solana's most viral dev tool"

**Curiosity hooks (not negative):**
- "[Solana thing] does WHAT/HOW MANY [surprising fact]?!"
- "What happens when you [test/try X] on Solana?"
- Example: "Solana's Hello World generates HOW many lines of code?!"

**Solution announcements:**
- "[Problem] is finally solved"
- "The tool that fixed [Solana pain point]"
- Example: "Solana's cargo.lock problem is finally solved"

**Practical/actionable:**
- "How to [do useful thing] on Solana"
- Example: "How to contribute to Solana's open source compiler tools"

### Bad Titles (Avoid)
- ❌ **Negative framing:** "Solana's compiler is broken" → Reframe as curiosity or solution
- ❌ **Generic clickbait:** "You won't believe..."
- ❌ **Insider-only specifics:** "at 20" (say "very late" instead)
- ❌ **Commands that feel preachy:** "Stop sharing cargo.lock files"
- ❌ **Vague:** "This changes everything"
- ❌ **No Solana context:** "The compiler expert who got proven wrong"

### Format Note
**Put best title in clip header:**
```
## 🎬 CLIP 1: "Solana's Hello World generates HOW many lines of code?!" ⭐⭐⭐⭐⭐
```
Then list 2-3 alternatives under "Alternative Titles" section.

---

## 📋 STEP 5: Output Format

Create analysis file: `analysis/episode-XX-[company]-[guest]-clips.md`

### Required Sections

```markdown
# 🎬 CLIP ANALYSIS: Episode XX - [Guest] ([Company])

**Podcast:** OnlyDevs (Superteam India)
**Guest:** [Name] from [Company]
**Topic:** [Episode title]
**Duration:** [X] minutes
**Video ID:** [YouTube ID]

---

## CLIP 1: [Working Title] ⭐⭐⭐⭐⭐

### The Story (1-2 sentences)
[What's the complete narrative arc?]

### Timestamps
**Full Arc:** [MM:SS] → [MM:SS] ([duration])
**Suggested Edit:** [X-Y seconds]

### Key Moments
- [MM:SS] "[Quote]"
- [MM:SS] "[Quote]"

### Suggested Titles (Solana Dev Focus)
1. [Primary title]
2. [Alternative]
3. [Alternative]

### Why This Works
- ✅ [Element 1]
- ✅ [Element 2]

---

[Repeat for each clip]

---

## PRIORITY ORDER

| Priority | Clip | Duration | Viral Potential |
|----------|------|----------|-----------------|
| 1 | [Title] | Xs | ⭐⭐⭐⭐⭐ |
| ... | ... | ... | ... |
```

---

## 📋 QUALITY CHECKLIST

Before finalizing, verify each clip:

- [ ] **Self-contained** - Makes sense without watching full podcast
- [ ] **Has context card** - WHO (name, company, role)
- [ ] **Setup included** - Viewer knows what's being discussed
- [ ] **Stakes clear** - Why a Solana dev would care
- [ ] **Payoff delivered** - Clear insight/conclusion
- [ ] **Title is dev-focused** - Would a Solana dev click this?
- [ ] **Timestamp accurate** - Start/end verified
- [ ] **Duration appropriate** - 30-90s for shorts, can be longer for YouTube

---

## 🔄 WORKFLOW SUMMARY

```
1. Get transcript → Clean & timestamp
2. Scan for high-signal patterns
3. Identify 4-6 clip candidates
4. Build complete story arcs for each
5. Write Solana-dev-focused titles
6. Create analysis document
7. Send to Reuben for review
8. Revise based on feedback
9. Send to editors with specs
```

---

*System created: Feb 4, 2026*
*Based on Episode 01 learnings with Reuben's feedback*
