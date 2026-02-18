# OnlyDevs Podcast — MEV & Infrastructure Topic Coverage

## Episodes That Cover MEV/Infra Topics

### 🔥 Tier 1: Deep MEV/Infra Focus

---

#### 1. "The Business of Blockchain Speed: How Uri Built Infra Used by Major Validator"
- **URL:** https://www.youtube.com/watch?v=blKiHBHhUyo
- **Guest:** Uri (Paladin / bloXroute)
- **MEV Relevance:** ⭐⭐⭐⭐⭐ — This is essentially an MEV masterclass
- **Key Topics Covered:**
  - MEV (Maximal Extractable Value) explained from first principles
  - Sandwich attacks — detailed explanation of frontrunning and backrunning
  - Jito bundles — why they're "toxic" and "really only good for sandwiching"
  - Block building on Ethereum and Solana
  - Validator incentive alignment (short-term vs long-term)
  - Priority fees vs tips
  - Paladin — a fork of Agave/Firedancer that aligns validator incentives against MEV extraction
  - Tragedy of the commons in MEV extraction
  - Backrunning as a "terrible solution"
  - Drop-on-revert mechanics
- **Key Quotes:**
  - "MEV is maximal extractable value... if somebody's about to buy a million dollar worth of SOL then if I see this before it executes I could frontrun"
  - "Bundles are toxic. They suck really bad. They're really only good for sandwiching"
  - "I told Jito, I like the Jito team. I hate their product."
  - "Could we make more money for validators who don't play these games, who don't include sandwiches?"
- **Astralane Relevance:** Directly covers the MEV landscape Astralane operates in. Uri's Paladin approach to validator incentive alignment is complementary/competitive to Astralane's Iris transaction sender approach.

---

#### 2. "Behind the scenes of one of the biggest company on Solana" (Helius)
- **URL:** https://www.youtube.com/watch?v=9ssHosLI5nY
- **Guest:** Nick from Helius
- **MEV Relevance:** ⭐⭐⭐⭐ — Deep RPC/validator infrastructure
- **Key Topics Covered:**
  - Running one of the biggest validators on Solana
  - RPC infrastructure at scale — how to bring up and scale validators
  - Validator plugins (Geyser) for low-latency data streaming
  - Latency considerations in RPC architecture
  - Multi-RPC redundancy and failover
  - Indexing infrastructure
  - Webhook infrastructure for real-time data
- **Key Quotes:**
  - "Helius is one of the biggest validators on Solana today and also one of the biggest RPC infra companies"
  - "We also have to have an RPC... then we started offering RPCs"
  - Discussion of validator plugins: "you adhere to the validator and say hey here's my plugin... and that is very low latency"
- **Astralane Relevance:** Helius is core Solana infra — their validator/RPC architecture discussion maps directly to the infrastructure layer Astralane's Iris operates on. Understanding RPC routing and validator proximity is key to 0-slot latency.

---

### 🟡 Tier 2: Significant Infra/MEV Mentions

---

#### 3. "From YC to Crypto: The Startup Journey of Jupiter's Co Founder"
- **URL:** https://www.youtube.com/watch?v=Zk6YBljdyOw
- **Guest:** Jupiter co-founder
- **MEV Relevance:** ⭐⭐⭐ — Trading execution, sandwich protection, priority fees
- **Key Topics Covered:**
  - Sandwich attack protection in DEX aggregation
  - Priority fee optimization (dynamic based on chain congestion)
  - Slippage optimization to avoid MEV
  - RPC infrastructure evolution (client-side → JS backend → Rust → AWS)
  - "Best possible executing price" vs just "best price"
- **Key Quotes:**
  - "You might get sandwiched by the MEV right so we have to optimize the slippage as well then at the same time we have to optimize priority fees"
  - "We make sure that you don't have to worry about slippage, you don't have to worry about too high fees, you don't have to worry about MEV"
- **Astralane Relevance:** Jupiter is the biggest consumer of transaction infrastructure on Solana. Their need for sandwich protection and priority fee optimization is exactly the problem Astralane's Iris solves.

---

#### 4. "How Solana Scales: The SVM Explained ft. Joe" (Anza)
- **URL:** https://www.youtube.com/watch?v=5T4s1NWr_wU
- **Guest:** Joe from Anza
- **MEV Relevance:** ⭐⭐⭐ — Validator architecture, SVM internals
- **Key Topics Covered:**
  - Anza's validator codebase (the foundation Solana runs on)
  - Decoupled validator components
  - Multiple validator clients (Agave, Firedancer)
  - Staking mechanics
  - Test validator for development
- **Astralane Relevance:** Understanding the SVM and validator architecture is foundational to how Iris interacts with the validator network.

---

#### 5. "The Future of On-Chain Compute with Bonsol" (Overclock Validator)
- **URL:** https://www.youtube.com/watch?v=Y5mxY_KX-EE
- **Guest:** Rohan from Overclock
- **MEV Relevance:** ⭐⭐ — Validator operations, latency tooling
- **Key Topics Covered:**
  - Running a Solana validator from scratch
  - Validator setup and operations
  - Latency analysis tools for validators
  - Jito commits in validator automation
  - Validator monitoring (Watchtower)
  - Staking operations
- **Astralane Relevance:** Practical validator operations knowledge — the infrastructure layer that Astralane's validator network connects to.

---

#### 6. "From AI Researcher to Solana Builder: Gabriele's Crypto Journey"
- **URL:** https://www.youtube.com/watch?v=a_fdC-FCvYc
- **Guest:** Gabriele (FML/MagicBlock)
- **MEV Relevance:** ⭐⭐ — Low-latency infrastructure, validator co-location
- **Key Topics Covered:**
  - End-to-end latency for real-time applications
  - Collocating with validators for low latency
  - RPC infrastructure challenges
  - Ephemeral rollups for scalability + latency
- **Key Quotes:**
  - "Collocating with the validator it's so..."
  - "Apps that require latency... end to end latency from the time you send the transaction"
- **Astralane Relevance:** The latency discussion directly parallels Astralane's 0-slot latency goals — different use case (gaming vs trading) but same infrastructure challenges.

---

### ⚪ Tier 3: Minor/Tangential Mentions

| Episode | URL | Notes |
|---------|-----|-------|
| How Exo Powers Solana Startups | https://www.youtube.com/watch?v=KNI5xMizljo | Some infra discussion |
| Goldman to Crypto Bank | https://www.youtube.com/watch?v=RiwWXcApOe8 | Minor financial infra |
| New Internet (Austin Federa) | https://www.youtube.com/watch?v=oo0AbS8vntE | General Solana infrastructure |
| $100M Social Trading | https://www.youtube.com/watch?v=J8ww0siiqwM | Minor trading infra |

### Episodes with NO MEV/Infra Coverage
- How a Side Project Became Solana's Most Talked-About Dev Tool (yemt4ciysvM)
- 20 Year Old Guy Raises $150 Million — UmbraPrivacy (s9F6u62q0ZE)
- Oracles Explained — Switchboard (IMEnpmGqeS0)
- Encrypted Computing Explained (b-Uf85mq5U0)
- Solana, Privacy, and the Future of Trading (_m4iH3pVpnU)
- Inside Solana Mobile's Master Plan (RbTkR5iTaC8)
- FROM MEMECOIN TO MOBILE APP: MOONWALK (SrcLDMOQtDo)
- Engineering for mass adoption — DRiP CTO (C52CVNYz2UE)

---

## Summary

The OnlyDevs podcast has covered MEV and Solana infrastructure topics substantially across multiple episodes. The standout episode is the Uri/Paladin interview which is essentially a 60-minute deep dive into MEV mechanics, Jito bundles, sandwich attacks, and validator incentive alignment. The Helius episode covers core RPC/validator infrastructure, while the Jupiter co-founder episode discusses sandwich protection and priority fee optimization from the DEX perspective. Additionally, episodes with Anza (SVM architecture), Overclock (validator operations), and MagicBlock (low-latency infrastructure) round out strong infrastructure coverage.

---

## Suggested Reply to Sujith

> Hey Sujith! Yeah we've actually covered MEV and infra topics quite a bit on OnlyDevs. Our episode with Uri from Paladin/bloXroute was basically an hour-long MEV deep dive — we got into sandwich attacks, Jito bundles, validator incentive alignment, the whole thing. We also had Nick from Helius on talking about running one of the biggest validators and RPC infra on Solana, and our Jupiter co-founder episode covered sandwich protection and priority fee optimization from the aggregator side. Plus we've had Anza (SVM/validator architecture) and Overclock (validator operations & latency tooling) on as well. So yeah, MEV and infra is definitely in our wheelhouse — would love to dive into what you guys are building with Iris and the validator network. 🔥
