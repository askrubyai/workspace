# OnlyDevs Guest Prep System

*How to prepare interview questions for OnlyDevs podcast guests*

---

## The Format

**Output:** A single markdown file with:
- Brief guest background (name, role, twitter, links)
- 10-15 questions organized in a discovery flow
- No rapid fire, no personal journey focus, no producer notes

---

## The Process

### 1. Research the Guest

- Find their previous podcasts/interviews (avoid repeating same ground)
- Check their Twitter, website, GitHub
- Understand their technical work specifically

### 2. Understand Their Technical Contribution

Ask yourself: **What is the technically interesting thing they've built?**

For Trepa (Anam): Precision prediction markets, fixed-point math, oracle integration
For Blue Shift (Claire): SBF linker, LLVM compilation, eBPF → SBF workflow

### 3. Write Questions as Discovery Flow

Questions should:
- **Start simple** → "What is [project]? What problem are you solving?"
- **Build naturally** → Each question follows logically from the expected answer
- **Go deeper technically** → Probe the "how" not just the "what"
- **Assume host doesn't know** → Frame questions so host discovers alongside audience

❌ Bad: "You use fixed-point arithmetic with explicit rounding policies. Where does rounding happen?"
✅ Good: "But Solana programs can't do floating point. How do you handle that?"

### 4. Technical Depth Like Claire Episode

Reference: The Claire/Blue Shift episode is the gold standard. It covers:
- What the project does (SBF linker)
- Why it matters (Solana's forked toolchain problem)
- How it works technically (LLVM bitcode → object file → SBF repackaging)
- Specific technical tradeoffs (eBPF vs SBF constraints, stack size, memory alignment)
- Where it's going next (tier 2 Rust target)

### 5. Question Categories to Cover

1. **Understanding the Project** (2-3 questions)
   - What is it? What problem does it solve?
   - How is it different from alternatives?

2. **Technical Deep-Dive** (5-7 questions)
   - How does it work under the hood?
   - What Solana-specific challenges did you face?
   - What tradeoffs did you make?

3. **Architecture Decisions** (2-3 questions)
   - Why did you build it this way?
   - What would you do differently?

4. **Security/Production** (2-3 questions)
   - How do you test/audit?
   - What's been hard about running in production?

---

## What NOT to Include

- ❌ Rapid fire rounds
- ❌ Personal journey questions ("how did you get into crypto?")
- ❌ Women in tech / representation questions
- ❌ Career advice questions
- ❌ Producer notes or interview tips
- ❌ Potential clip moments analysis

---

## Template

```markdown
# OnlyDevs: [Guest Name] ([Project])

**Guest:** [Name] - [Role] @ [Project]
**Twitter:** [@handle](https://twitter.com/handle)
**Project:** [project.com](https://project.com)

---

## Questions

### Understanding [Project]

1. **[Opening question - what is it?]**

2. **[Follow-up - how is it different?]**

3. **[Probe deeper into the core concept]**

### Technical Deep-Dive

4. **[How does X work technically?]**

5. **[Solana-specific challenge]**

6. **[Implementation detail]**

... etc

### Architecture & Decisions

X. **[Why did you build it this way?]**

### Security & Production

X. **[Audit/testing question]**

X. **[Production challenge]**
```

---

## Checklist Before Sending

- [ ] Questions build on each other (discovery flow)
- [ ] Host can ask without prior knowledge
- [ ] Technically deep but accessible
- [ ] No fluff, no journey, no rapid fire
- [ ] 10-15 questions total
- [ ] Send as .md file attachment

---

*Created: Feb 5, 2026*
