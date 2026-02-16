# Astralane Research Brief — OnlyDevs Podcast Prep

**Status:** BACKGROUND RESEARCH COMPLETE — Awaiting Slot Confirmation  
**Created:** Feb 16, 2026 6:25 AM IST  
**Agent:** Fury (Customer Researcher)  
**Sources:** 8 web searches, company docs, partnership announcements

---

## Company Overview

**Astralane** — Institutional-grade Solana infrastructure provider  
**Parent Company:** Audace Labs  
**Co-founders:** Sujith Sizon & Jaskanwar Singh  
**Website:** https://astralane.io  
**Docs:** https://astralane.gitbook.io/docs

### Positioning
"We handle the heavy lifting of Solana infrastructure—so you can focus on innovation."

---

## What They Build

### 1. **High-Performance RPC & Transaction Infrastructure**
- **Target Users:** High-frequency traders, market makers, AI/ML developers
- **Key Metrics:**
  - **0-slot latency** (transaction execution)
  - **~25 million stake weight** (validator network)
  - **2M+ staked connections** (seamless access)
  - **100+ TB indexed data**

### 2. **Iris Transaction Sender** (Flagship Product)
- **Problem Solved:** Custom TPU ports (Paladin, [Redacted]) turn routing into "solver's nightmare"
- **Solution:** Guaranteed 0-1 slot P90 execution
- **Technical Edge:** Optimized full-node network proactively listens for transactions
- **Use Case:** Institutional traders need microsecond-precision execution
- **Source:** [Reddit announcement](https://www.reddit.com/r/solana/comments/1jjexni/iris_the_solana_transaction_sender_built_to/) (Jan 25, 2025)

### 3. **High-Speed Indexing for Data Moat**
- **Performance:** Up to 200ms boost when streaming on-chain data
- **Features:**
  - Stream real-time state updates (no RPC nodes needed)
  - Eliminate IDL management complexity
  - Built-in re-org handling
  - Efficient data batching
  - Historical + real-time ETL pipelines
- **Value Prop:** "Eliminate the need to maintain full ledger copies for efficient backtesting"

### 4. **Staking Infrastructure**
- Recent partnership with **Spirit Blockchain Capital** (Mar 7, 2025)
- Launched staked SOL index/ETP with **up to 11% APY**
- Jaskanwar Singh joined Spirit's advisory board
- Focus: Passive Solana investment with maximized staking rewards

---

## Customer Intelligence

### Target Segments (HIGH CONFIDENCE)
Based on company positioning + partnership announcements:

1. **High-Frequency Trading Firms**
   - Need: Microsecond-level transaction execution
   - Pain Point: Custom TPU routing complexity, slot race chaos
   - Astralane Solution: Iris 0-1 slot guarantee

2. **Market Makers**
   - Need: Real-time on-chain data + low-latency execution
   - Pain Point: Managing multiple IDLs, parsing custom transactions
   - Astralane Solution: High-speed indexing + simplified data pipelines

3. **AI/ML Developers** (mentioned in Spirit partnership announcement)
   - Need: Historical + real-time blockchain data for model training
   - Pain Point: Maintaining full ledger copies, slow backtest infrastructure
   - Astralane Solution: 100+ TB indexed data + efficient ETL

4. **Institutional Investors**
   - Need: Passive Solana exposure with yield
   - Pain Point: Direct staking complexity
   - Astralane Solution: Staked SOL index (11% APY, managed infrastructure)

### Competitive Positioning (MEDIUM CONFIDENCE)
- **Versus RPC Providers** (Helius, Triton, QuickNode):
  - Differentiation: Focus on HFT-grade performance (0-slot latency vs. general-purpose RPC)
  - Target: Institutional traders vs. dApp developers
  
- **Versus General Indexers** (The Graph, Covalent):
  - Differentiation: Solana-specific optimization (200ms boost claim)
  - Edge: Built-in re-org handling, real-time state streams

- **Versus Validator Services**:
  - Differentiation: ~25M stake weight as infrastructure backbone (not just delegation service)

---

## Technical Deep-Dive Questions (For Podcast)

Following **Claire/Blue Shift episode format** (technical focus, discovery flow):

### 1. **Architecture & Design Decisions**
- **TPU Routing Crisis:** "You mentioned custom TPU ports turning routing into a 'solver's nightmare.' Can you walk through what's actually happening at the protocol level when a transaction enters Solana's execution layer?"
- **0-Slot Latency Claim:** "How do you achieve 0-slot latency? What's the architecture difference between Astralane's approach and a standard RPC provider?"
- **State Streaming:** "You're streaming state updates without RPC nodes. How does that work under the hood?"

### 2. **Indexing Infrastructure**
- **200ms Performance Boost:** "You claim up to 200ms boost for streaming on-chain data. Where does that time savings come from? Is it network proximity, custom parsing, or something else?"
- **100+ TB Indexed Data:** "What does 'indexed' actually mean here? Are you parsing every transaction, or is it selective indexing?"
- **Re-org Handling:** "Built-in re-org handling is mentioned—how do you detect and resolve reorgs at scale?"

### 3. **Validator Network Strategy**
- **25 Million Stake Weight:** "You're running ~25M SOL stake. How does that feed into your infrastructure offering? Are clients essentially renting your validator connections?"
- **Validator Recruitment:** "Your site says 'If you are a validator on Solana, unlock your full potential. Join our network.' What's the incentive structure for validators to join?"

### 4. **Customer Use Cases**
- **HFT Firms:** "What does a typical HFT firm's workflow look like with Iris? Are they running their own solvers, or is Iris handling the routing intelligence?"
- **AI/ML Developers:** "Spirit partnership mentions AI/ML developers. What are they doing with 100TB of Solana data? Model training for what?"

### 5. **Business Model**
- **SaaS Pricing:** "Colosseum docs mention 'usage and performance tiers.' How do you price infrastructure for firms that need microsecond precision?"
- **Staking Revenue:** "With the Spirit partnership, are you sharing staking rewards with clients, or is this a separate product line?"

### 6. **Solana-Specific Challenges**
- **Slot Race Dynamics:** "You mentioned the 'slot race' in your Iris announcement. What makes Solana's execution model uniquely challenging compared to EVM chains?"
- **Custom Ports (Paladin, [Redacted]):** "Why are custom TPU ports a problem? Is this a protocol design issue or competitive moat by validators?"

### 7. **Future Roadmap**
- **Beyond Solana:** "You're clearly Solana-native. Any plans to expand to other chains, or is Solana's architecture where your edge lives?"
- **Prediction Markets Angle:** "Your Medium article talked about prediction markets entering 'the fast lane' on Solana. Are you seeing traders use Iris for Polymarket arbitrage?"

---

## Open Questions / Research Gaps

1. **Customer Count:** No public data on # of clients or revenue (MEDIUM priority — ask if comfortable sharing)
2. **Technical Benchmarks:** 0-slot claim needs unpacking (is this 100% of transactions or P90/P99?)
3. **Competitive Moats:** What prevents Helius/Triton from building Iris-equivalent? Is it stake weight, network topology, or algo IP?
4. **Audace Labs Relationship:** Is Astralane a product under Audace, or is Audace just the legal entity?
5. **Jaskanwar's Advisory Board Role:** What does his Spirit Blockchain advisory position mean for Astralane's strategic direction?

---

## Confidence Levels

**HIGH CONFIDENCE:**
- Company focus (Solana infrastructure for HFT/market makers)
- Product existence (Iris, indexing, RPC, staking)
- Co-founders (Sujith Sizon, Jaskanwar Singh)
- Spirit partnership (staked SOL index, 11% APY)

**MEDIUM CONFIDENCE:**
- Competitive differentiation claims (0-slot, 200ms boost)
- Customer segment breakdown (HFT vs. AI/ML vs. institutional)
- Pricing model details (usage-based, but no public pricing)

**LOW CONFIDENCE:**
- Customer count, revenue, traction metrics (no public data)
- Technical benchmarks (no independent verification of performance claims)
- Moat sustainability (unclear if replicable by larger RPC providers)

---

## Podcast Prep Next Steps

**When slot confirmed:**
1. Review this brief with Reuben
2. Prioritize 8-10 questions from "Technical Deep-Dive" section
3. Research any customer testimonials or case studies (G2, Twitter)
4. Check if Sujith/Jaskanwar have prior podcast/interview content (prep follow-up angles)
5. Follow Claire/Blue Shift format: technical focus, no fluff, discovery flow

**Recommended Format:**
- **Guest Bio:** 1-2 paragraphs (Sujith + Jaskanwar backgrounds)
- **Core Questions:** 10-12 technical deep-dives
- **No Producer Notes:** Minimal format per Reuben's preference

---

**Sources:**
- Astralane website (astralane.io)
- Astralane docs (astralane.gitbook.io)
- Spirit Blockchain partnership announcement (GlobeNewswire, Mar 7 2025)
- Reddit Iris announcement (r/solana, Jan 25 2025)
- Colosseum Arena project page
- Medium: "The Solana Shift: Prediction Markets Enter the Fast Lane" (Oct 31 2025)

**Self-Rating:** 4/5 (solid foundation, need slot confirmation to finalize questions)

---

*Next: Awaiting Reuben's confirmation of podcast slot with Sujith/Kirat/Paarug. When confirmed, finalize question list and create guest bio.*
