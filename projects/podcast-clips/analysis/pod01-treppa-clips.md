# 🎬 CLIP ANALYSIS: OnlyDevs Episode - Treppa Founder

**Podcast:** OnlyDevs (Superteam India)
**Guest:** [Guest name from Treppa]
**Topic:** Building Solana Prediction Markets - Architecture, Audits & Cost Optimization
**Duration:** 27 minutes
**Source File:** pod01.mp4

---

## 🎬 CLIP 1: "He discovered RPC providers were silently truncating his data" ⭐⭐⭐⭐⭐

### The Story
Founder shares a critical lesson learned during OtterSec audit: RPC providers can truncate program logs at 12kb, potentially causing data loss. The solution? Emit CPI - a technique that stores logs as instruction data instead of program logs, making them permanently retrievable from transactions.

### Timestamps
**Full Arc:** 13:56 → 16:27 (2m31s)
**Suggested Edit:** 60-75 seconds (cut intro, focus on discovery + solution)

### Key Moments
- 13:56 "We went through an audit with OtterSec... it was a very amazing experience"
- 15:13 "One thing I didn't realize: RPC providers can actually truncate your program logs... around 12kb"
- 15:53 "We could end up missing some predictions that users made"
- 15:59 "The alternative: emit CPI macro instead of emit macro"
- 16:06 "It calls the same instruction again with instruction data as the log... you can always fetch the transaction"

### Suggested Titles (Solana Dev Focus)
1. **"RPC providers were silently truncating his logs at 12kb. Here's how he fixed it."** (Primary)
2. "The audit finding that saved Treppa from data loss"
3. "Emit vs Emit CPI: What Solana devs need to know"

### Why This Works
- ✅ **Practical pain point** - Every Solana dev relies on program logs
- ✅ **Clear stakes** - Data loss is catastrophic for any app
- ✅ **Actionable solution** - Emit CPI macro is immediately implementable
- ✅ **Credibility** - Learned during professional audit with OtterSec
- ✅ **Universal relevance** - Applies to any protocol emitting data

---

## 🎬 CLIP 2: "Why he deliberately chose NOT to store predictions on-chain" ⭐⭐⭐⭐⭐

### The Story
Counter-intuitive architecture decision: store minimal data on-chain (just stake amounts), emit prediction values via CPI. Reasoning: when sponsoring user fees, every byte counts. Philosophy shift from "blockchain stores everything" to "optimize for scale + cost."

### Timestamps
**Full Arc:** 17:35 → 20:50 (3m15s)
**Suggested Edit:** 75-90 seconds (focus on decision rationale + cost philosophy)

### Key Moments
- 17:42 "I needed to be very deliberate with account structure... only store what matters"
- 18:21 "I would have stored stake amount off-chain too, but we have update stake feature"
- 18:54 "Empty PDA with just a bump value for prediction accounts"
- 19:06 "It's not completely off-chain, it's still in the instruction data"
- 19:53 "This architecture is very good for consumer applications"
- 20:07 "Cost becomes a very big measure thing once you scale"

### Suggested Titles (Solana Dev Focus)
1. **"When NOT to store data on-chain: A Treppa case study"** (Primary)
2. "He sponsors all user fees. Here's how he keeps costs sustainable."
3. "Solana architecture for scale: What to store vs what to emit"

### Why This Works
- ✅ **Challenges assumptions** - "Blockchain = store everything" mindset
- ✅ **Real constraints** - Sponsoring fees creates different incentives
- ✅ **Scalability lesson** - Cost optimization becomes critical at scale
- ✅ **Transferable insight** - Applies to any consumer-facing Solana app
- ✅ **Technical depth** - PDA structure, emit CPI, indexer strategy

---

## 🎬 CLIP 3: "The 2 Solana contracts every dev should read" ⭐⭐⭐⭐

### The Story
When asked for top contracts to learn from, founder immediately names Kamino and Squads. Simple, actionable recommendation for devs wanting to level up by reading production code.

### Timestamps
**Full Arc:** 21:32 → 22:12 (40s)
**Perfect length as-is**

### Key Moments
- 21:32 "Three contracts you could learn from?"
- 21:45 "Kamino... I used to look at it a lot. Very clean architecture, big scale"
- 21:56 "Squads protocol is very clean, very good quality code"
- 22:07 "I don't think I'd recommend any other contracts apart from these two"

### Suggested Titles (Solana Dev Focus)
1. **"The 2 Solana contracts a founder recommends for learning"** (Primary)
2. "Read these codebases to level up as a Solana dev"
3. "Kamino + Squads: Why these contracts are worth studying"

### Why This Works
- ✅ **Instantly actionable** - Clear learning path for devs
- ✅ **Credibility filter** - Founder has read dozens, recommends just 2
- ✅ **Specific resources** - Not vague advice like "read more code"
- ✅ **Short & punchy** - Perfect 30-40s clip
- ✅ **Universal appeal** - Beginner to intermediate devs all benefit

---

## 🎬 CLIP 4: "Flash Pools: 2-minute prediction cycles coming to Solana" ⭐⭐⭐⭐

### The Story
Product announcement: Treppa launching "Flash Pools" - ultra-short prediction markets where you predict price movement in 2-minute cycles (1min to predict, 1min to resolve). Targeting users who want instant gratification vs waiting hours/days.

### Timestamps
**Full Arc:** 22:17 → 23:22 (1m05s)
**Suggested Edit:** 50-60 seconds (trim interviewer setup)

### Key Moments
- 22:25 "We're working on Flash Pools, coming by end of month"
- 22:37 "Price predictions in a very short window"
- 22:45 "People like to see price charts move up and down, predict really quick"
- 22:53 "Instead of waiting more time"
- 23:02 "Two-minute pool cycle: predict for one minute, wait for one minute"

### Suggested Titles (Solana Dev Focus)
1. **"Treppa's Flash Pools: 2-minute prediction markets on Solana"** (Primary)
2. "The instant gratification version of prediction markets"
3. "From 24-hour pools to 2-minute cycles: Treppa's next product"

### Why This Works
- ✅ **Product launch news** - Timely, shareable
- ✅ **Clear value prop** - Instant gratification vs waiting
- ✅ **Solana innovation** - Fast settlement enables this UX
- ✅ **Curiosity hook** - 2 minutes?! How does that work?
- ✅ **Broad appeal** - Interesting to traders, devs, and founders

---

## 🎬 CLIP 5: "Start with Anchor. Stop optimizing too early." ⭐⭐⭐⭐⭐

### The Story
Direct advice for beginners: don't jump straight to Pinocchio or native Rust. Start with Anchor, build something that works, THEN optimize when you have real constraints. Premature optimization kills momentum and learning.

### Timestamps
**Full Arc:** 26:14 → 27:10 (56s)
**Perfect length as-is**

### Key Moments
- 26:14 "If you're getting started writing Solana smart contracts: start with Anchor"
- 26:23 "You don't have to learn Rust by heart... just follow basic tutorials"
- 26:32 "A lot of good protocols use it, good for consumer applications"
- 26:39 "Unless you're at a scale where you need to optimize by compute units"
- 26:46 "If you start optimizing at the beginning... you'll end up confusing yourself"
- 26:55 "Make something work, when something clicks you get excited, THEN look into optimization"

### Suggested Titles (Solana Dev Focus)
1. **"Stop learning Rust. Start with Anchor." (A Solana founder's advice)** (Primary)
2. "The mistake beginner Solana devs make (and how to avoid it)"
3. "He built a funded prediction market. Here's his advice for Solana beginners."

### Why This Works
- ✅ **Solves real pain** - Beginners overwhelmed by Rust + Solana complexity
- ✅ **Permission to start simple** - Counteracts "I'm not ready" paralysis
- ✅ **Clear progression** - Anchor → works → excited → optimize
- ✅ **Credibility** - From someone running production code at scale
- ✅ **Actionable** - Viewer knows exactly what to do next

---

## 🎬 CLIP 6: "They sponsor ALL user fees. Here's why it works." ⭐⭐⭐

### The Story
UX philosophy: users shouldn't need two tokens (SOL + USDC) to interact with the app. Treppa sponsors all transaction fees, making onboarding seamless. This creates different engineering constraints (cost optimization becomes critical).

### Timestamps
**Full Arc:** 17:51 → 18:21 (30s)
**Perfect short clip**

### Key Moments
- 17:51 "From the start we had the idea: we would sponsor gas fees"
- 17:59 "We weren't want users to come in with two types of tokens - SOL and USDC"
- 18:04 "Very confusing for the user"
- 18:10 "Sponsoring fees is a different issue - you need to optimize cost for yourself"

### Suggested Titles (Solana Dev Focus)
1. **"Why Treppa sponsors ALL user transaction fees"** (Primary)
2. "Solana UX: One token vs two tokens (and why it matters)"
3. "The cost of seamless UX: Sponsoring fees at scale"

### Why This Works
- ✅ **UX insight** - Two-token onboarding is a real barrier
- ✅ **Solana-specific** - Other chains don't have this gas token issue
- ✅ **Tradeoff visibility** - Better UX = more engineering constraints
- ✅ **Founder mindset** - Product thinking over pure tech
- ✅ **Short & punchy** - Great 30s clip

---

## PRIORITY ORDER

| Priority | Clip | Duration | Viral Potential | Why |
|----------|------|----------|-----------------|-----|
| 1 | **Start with Anchor** | 56s | ⭐⭐⭐⭐⭐ | Beginner-friendly, actionable, high engagement |
| 2 | **NOT storing on-chain** | 75-90s | ⭐⭐⭐⭐⭐ | Counter-intuitive, technical depth, scalability lesson |
| 3 | **RPC log truncation** | 60-75s | ⭐⭐⭐⭐⭐ | Practical bug, clear solution, universal relevance |
| 4 | **Flash Pools** | 50-60s | ⭐⭐⭐⭐ | Product news, curiosity hook, timely |
| 5 | **Kamino + Squads** | 40s | ⭐⭐⭐⭐ | Instantly actionable, credibility filter |
| 6 | **Sponsor fees** | 30s | ⭐⭐⭐ | UX insight, quick hit |

---

## EDITING NOTES

### Context Cards Needed
- Guest intro: "[Name], Co-Founder @ Treppa"
- Treppa: "Solana prediction markets backed by Balaji & Colosseum"
- OtterSec: "Security auditing firm"
- Kamino/Squads: "Open-source Solana protocols"

### Visual Suggestions
- **Clip 1 (RPC truncation)**: Show code diff of `emit!` vs `emit_cpi!`
- **Clip 2 (architecture)**: Diagram of PDA structure + emit flow
- **Clip 3 (contracts)**: Screenshots of Kamino/Squads GitHub repos
- **Clip 5 (Anchor)**: Text overlay: "Anchor → Works → Excited → Optimize"

### Thumbnail Ideas
- Clip 1: "12kb truncation" with warning icon
- Clip 2: "NOT on-chain?!" with thinking emoji
- Clip 5: "Start with Anchor" in bold text

---

## QUALITY CHECKLIST

- [x] **Self-contained** - Each clip makes sense standalone
- [x] **Context cards planned** - WHO (guest, company, credibility)
- [x] **Setup included** - Technical context provided
- [x] **Stakes clear** - Why Solana devs care
- [x] **Payoff delivered** - Clear insights/conclusions
- [x] **Titles dev-focused** - Would a Solana builder click?
- [x] **Timestamps accurate** - Verified against transcript
- [x] **Duration appropriate** - 30s-90s clips, ready for shorts + YouTube

---

## NEXT STEPS

1. ✅ Transcript complete
2. ✅ Clip analysis complete
3. ⏳ **Send to Reuben for review**
4. ⏳ Revise based on feedback
5. ⏳ Create editing specs document
6. ⏳ Send to video editor with timestamp cuts

---

*Analysis completed: Feb 13, 2026 17:35 IST*
*Total clips identified: 6 (top 3 are 5-star viral potential)*
*Estimated editing time: 2-3 hours for all 6 clips*
