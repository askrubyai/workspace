# 📺 Episode 02 - Anam Ansari (Trepa)

**Podcast:** OnlyDevs (Superteam India)  
**Guest:** Anam Ansari, Blockchain Engineer at Trepa  
**Topic:** Precision Prediction Markets on Solana — Architecture, Audits & Cost Optimization  
**Duration:** ~27 minutes  

---

### ⚠️ KEY PRINCIPLE: SELF-CONTAINED CLIPS

Each clip must tell a complete story that makes sense on its own. A viewer who has never seen the podcast should understand:
• WHO is speaking (context card)
• WHAT they're talking about (setup)
• WHY it matters (payoff)

---

### 🎬 CLIP 1: "She found a bug that could silently lose user data" ⭐⭐⭐⭐⭐

#### The Complete Story
Trepa sponsors gas fees for users, which means every byte stored on-chain costs them money. So Anam made a deliberate architectural choice: only store the stake amount in a PDA, and emit the actual prediction number as a program log. An indexer scoops it up. Sounds risky, but the data still lives in the transaction — you can look it up on SolScan right now. Then during their audit, she discovered RPC providers can silently truncate logs at ~12KB. The fix? A simple emit CPI macro that writes data as instruction data instead of logs. Problem solved.

#### Timestamps
**Full Arc:** [15:17] → [16:27] (1 min 10 sec)  
**With Architecture Context:** [12:44] → [16:27] (3 min 43 sec — needs editing)

Key moments to include:
- [12:44] "Data is getting stored on chain. So we need to be mindful of what we store"
- [15:22] "I was actually relying on them to get the prediction a user made because to me, it didn't make sense to put it on chain"
- [15:25] "We only put stake amount on chain in a PDA and we were emitting the data, the prediction that a user was making via program logs"
- [15:35] "And we had an indexer which will scoop up everything and store it in our database"
- [15:44] "One thing I didn't realize that RPC providers, they can actually truncate your program logs"
- [15:50] "I guess somewhere around 12 KB they allow"
- [15:54] "We could end up missing some predictions that users made"
- [15:59] "So the alternative to that is just using an emit CPI macro instead of an emit macro"
- [16:10] "What it does, it calls the same instruction again with the instruction data as the log that you wanted to pass"

#### Suggested Edit (60-90 sec)
> [Context Card: Anam Ansari | Blockchain Engineer @ Trepa]
> 
> Anam: "We only put stake amount on chain in a PDA and we were emitting the prediction that a user was making via program logs. We had an indexer which scoops up everything and stores it in our database."
> 
> "One thing I didn't realize — RPC providers can actually truncate your program logs. Somewhere around 12KB they allow. And that could be an issue. We could end up missing some predictions that users made."
> 
> "So the alternative to that is just using an emit CPI macro instead of an emit macro. What it does, it calls the same instruction again with the instruction data as the log that you wanted to pass. So it's there. You can always fetch the transaction and get all the data you want."

#### Why This Works
- ✅ Has a real architectural decision (store less on-chain, use logs)
- ✅ Has a "oh shit" moment (RPCs truncate at 12KB — you could lose user data)
- ✅ Has a clean solution (emit CPI macro)
- ✅ Actionable — any dev relying on program logs should check this
- ✅ Complete problem → discovery → fix arc

#### Alternative Titles
- "Her database was silently dropping user data (here's how she caught it)"
- "The 12KB limit that almost broke their entire product"
- "She found a silent data loss bug right before launch"
- "This one infrastructure quirk was eating their user data"

---

### 🎬 CLIP 2: "She rewrote the entire codebase because of one missing line" ⭐⭐⭐⭐⭐

#### The Complete Story
Anam joined Trepa with V1 already live on DevNet. She looked at the code and realized the account layout structure had no reserved bytes — meaning they could never add new fields without deploying a completely new contract. That single issue meant starting over. And it paid off: a month after launch, they added a "step" feature by simply expanding the account structure. No redeployment needed.

#### Timestamps
**Full Arc:** [10:37] → [12:24] (1 min 47 sec)

Key moments to include:
- [10:51] "What do you think went wrong with version one that you had to start over?"
- [11:00] "When I joined Treppa, we already had version one, which was live on DevNet"
- [11:28] "Once I actually looked over the code, I realized there were a few things that could be improved"
- [11:44] "The account layout structure that we have... it was very restrictive"
- [11:57] "It didn't have any reserved bytes so that you can't expand the account structure in future"
- [12:06] "I know you can just create a new contract. But for small feature updates..."
- [12:12] "We added a step feature, I guess, a month back, even after we launched"
- [12:14] "We were able to incorporate without creating a new contract"
- [12:21] "We could add new variables in the account structure"

#### Suggested Edit (60-75 sec)
> [Context Card: Anam Ansari | Blockchain Engineer @ Trepa]
> 
> Host: "You launched V1 and moved to V2 in three months. What went wrong with version one?"
> 
> Anam: "When I joined, we already had version one live on DevNet. Once I looked over the code, I realized the account layout structure was very restrictive. It didn't have any reserved bytes — so you can't expand the account structure in future."
> 
> "I know you can just create a new contract. But for small feature updates... we added a step feature a month after launch, and we were able to incorporate it without creating a new contract. We could add new variables in the account structure."
> 
> [Text overlay: Always add reserved bytes to your Anchor PDAs]

#### Why This Works
- ✅ Concrete Anchor/Solana lesson (reserved bytes in PDAs)
- ✅ Shows real consequence (had to rebuild V1 → V2)
- ✅ Shows real payoff (step feature added post-launch with zero friction)
- ✅ Speaks to every Solana dev using Anchor
- ✅ Complete "mistake → rebuild → vindication" arc

#### Alternative Titles
- "One missing line of code forced her to rebuild everything from scratch"
- "She rewrote the whole app. One month later, it saved them."
- "The architectural mistake that costs engineers months of rework"
- "Why she threw away V1 after reading one file"

---

### 🎬 CLIP 3: "She built a betting app where being more accurate = bigger payout" ⭐⭐⭐⭐

#### The Complete Story
Host asks what "precision prediction markets" means. Anam breaks it down cleanly: instead of yes/no like Polymarket, you predict an exact number. Payout is a function of three things — accuracy, stake, and time. It's a convex payout curve, so if you're extremely accurate, it feels like a jackpot. Then the host stress-tests it: "What if I'm the only person in the pool?" Answer: you just get your money back. You're not betting against Trepa.

#### Timestamps
**Full Arc:** [04:23] → [06:56] (2 min 33 sec — needs editing)

Key moments to include:
- [04:23] "Very interesting, you mentioned a term, precision predictive markets"
- [04:37] "By precision, we simply mean that you predict a real world number"
- [04:42] "Instead of saying yes or no, up or down, you actually put in an exact number"
- [05:03] "If I go to Polymarket or Kalshi, I can only select if SOL above 150 or below 150"
- [05:09] "But on Trepa, I can predict a number, let's say 149 and my payout will be based on how close I am"
- [06:05] "The amount that you get rewarded is based on three things"
- [06:09] "One is how accurate you are"
- [06:23] "How much stake you put in"
- [06:32] "You also have a time edge. So if you predicted quite early, you also have that edge"
- [06:41] "It's a function of accuracy, your stake and time"
- [06:47] "It's a very convex payout curve"
- [06:50] "If you're very accurate, it feels like a jackpot"
- [07:21] "What if I am the first one in the market? I put in a thousand dollars"
- [07:38] "You're not betting against us. If you were the only one in the pool, obviously you'll get the money back"

#### Suggested Edit (75-90 sec)
> [Context Card: Anam Ansari | Blockchain Engineer @ Trepa]
> 
> Host: "Precision predictive markets — is this a new term?"
> 
> Anam: "By precision, we simply mean that you predict a real world number. Instead of saying yes or no, up or down, you actually put in an exact number."
> 
> Host: "So on Polymarket I can only say SOL above or below 150. But on Trepa, I can say 149 and my payout is based on how close I am?"
> 
> Anam: "Your payout is based on three things. How accurate you are. How much stake you put in. And time — if you predicted early, you have an edge. It's a very convex payout curve. If you're very accurate, it feels like a jackpot."
> 
> Host: "What if I'm the first one in the market? I put in a thousand dollars and no one else joins?"
> 
> Anam: "You're not betting against us. If you were the only one in the pool, you'll get your money back."

#### Why This Works
- ✅ Explains a genuinely new concept clearly
- ✅ Polymarket comparison gives instant context
- ✅ Three-factor framework is memorable (accuracy + stake + time)
- ✅ Edge case question makes it feel thorough
- ✅ Good for crypto Twitter / DeFi audience

#### Alternative Titles
- "What if betting apps rewarded you for being precise?"
- "She built an app where guessing the exact number = jackpot"
- "Most betting apps give you two options. Hers gives you infinite."
- "The math behind a payout curve that rewards accuracy"

---

### 🎬 CLIP 4: "Making it free for users made everything 10x harder to build" ⭐⭐⭐⭐

#### The Complete Story
Trepa sponsors gas fees so users only need USDC. Sounds simple, but it completely changes how you architect a smart contract. Every byte stored on-chain costs the protocol, not the user. Anam sat down, calculated costs when SOL was $200, and designed the account structure to store only what's absolutely necessary. They even added instructions to close prediction accounts after pools end, reclaiming rent. This is a real consumer-app pattern that most Solana devs never think about.

#### Timestamps
**Full Arc:** [17:17] → [20:19] (3 min 2 sec — needs heavy editing)

Key moments to include:
- [17:41] "We had the idea that we would sponsor the gas fees. We didn't want a user to come in and put two types of tokens"
- [17:58] "Sponsoring fees is a very different issue where you need to make sure the cost is optimized for yourself"
- [18:13] "That's why I needed to be very deliberate with how the account structure is"
- [13:12] "I actually sat down and at that time SOL was $200. I did some calculations based on how much it will cost"
- [13:23] "We also ended up adding a new instruction to close prediction accounts"
- [13:27] "After the pool is over, we close the accounts — not needed — and then claim the fees back"
- [20:06] "Cost actually becomes a very big major thing once you scale"
- [20:14] "You can't keep on storing so much data on chain"

#### Suggested Edit (60-75 sec)
> [Context Card: Anam Ansari | Blockchain Engineer @ Trepa]
> 
> Anam: "From the start, we had the idea that we would sponsor gas fees. We didn't want a user to put two types of tokens — SOL and USDC. That's confusing."
> 
> "But sponsoring fees means you need to make sure cost is optimized for yourself. I sat down when SOL was $200 and calculated how much it costs to store each user prediction."
> 
> "We added an instruction to close prediction accounts after pools end and claim the rent back. If we're sponsoring, we claim it. If the user is sponsoring, they get it back automatically."
> 
> "Cost becomes a very big thing once you scale. You can't keep storing so much data on chain."
> 
> [Text overlay: Building consumer apps on Solana? Optimize rent from day one.]

#### Why This Works
- ✅ Consumer app pattern most Solana devs ignore
- ✅ Real numbers (SOL at $200, calculated costs)
- ✅ Practical solution (close accounts, reclaim rent)
- ✅ Relevant to anyone building user-facing dApps that sponsor fees
- ✅ Complete thought: problem → calculation → solution

#### Alternative Titles
- "The hidden cost of making your app free for users"
- "She calculated the cost of every byte her users generated"
- "Free for users ≠ free for you (the infrastructure math nobody talks about)"
- "When absorbing user costs forces you to redesign your entire backend"

---

### 🎬 CLIP 5: "Stop optimizing. Just make it work first." ⭐⭐⭐

#### The Complete Story
Closing advice for new Solana smart contract devs. Don't try to learn Rust by heart first. Don't start with Pinocchio or native Rust. Start with Anchor, make something work, get excited, then optimize.

#### Timestamps
**Full Arc:** [26:06] → [27:10] (1 min 4 sec)

Key moments to include:
- [26:12] "If you are someone who's getting started in writing Solana smart contracts, just start with Anchor"
- [26:16] "You don't have to go through the steep learning curve of learning Rust by heart"
- [26:27] "It's a very good framework and a lot of good protocols use it"
- [26:34] "Unless until you reach that level where you need to optimize everything by compute units, then go with Pinocchio or native Rust"
- [26:47] "If you start optimizing at just beginner level where you're still learning Rust and you're writing Pinocchio, you'll just end up confusing yourself"
- [26:52] "Start with Anchor. Make something work."
- [26:53] "When something clicks, you get more excited and you start looking into how to optimize"

#### Suggested Edit (40-50 sec)
> [Context Card: Anam Ansari | Blockchain Engineer @ Trepa]
> 
> Anam: "If you're getting started in writing Solana smart contracts — just start with Anchor. You don't have to go through the steep learning curve of learning Rust by heart."
> 
> "It's a very good framework. A lot of good protocols use it. Unless you reach that level where you need to optimize everything by compute units — then go with Pinocchio or native Rust."
> 
> "If you start optimizing at beginner level, you'll just end up confusing yourself. Start with Anchor. Make something work. When something clicks, you get more excited and you start looking into how to optimize."

#### Why This Works
- ✅ Clear, actionable advice
- ✅ Names the tools (Anchor, Pinocchio, native Rust)
- ✅ Addresses a real mistake beginners make
- ✅ Punchy closing — good for Reels/Shorts
- ✅ Complete thought

#### Alternative Titles
- "A blockchain engineer's advice for beginners"
- "The #1 mistake junior developers make (premature optimization)"
- "Make it work, then make it fast"
- "She learned the hard way: don't optimize what doesn't exist yet"

---

## 📋 PRIORITY ORDER FOR EDITORS

| Priority | Clip | Duration | Why |
|----------|------|----------|-----|
| 1 | "She found a bug that could silently lose user data" | 60-90s | Universal fear — silent data loss + clean fix |
| 2 | "She rewrote the entire codebase because of one missing line" | 60-75s | Relatable pain, real consequence + payoff |
| 3 | "She built a betting app where being more accurate = bigger payout" | 75-90s | Intuitive concept, anyone gets it |
| 4 | "Making it free for users made everything 10x harder to build" | 60-75s | Every startup founder relates to this |
| 5 | "Stop optimizing. Just make it work first." | 40-50s | Universal dev advice, good for Reels |
