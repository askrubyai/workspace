# Astralane Interview — Harkirat's Prep Guide
## Questions + Context

**Guest:** Sujith Sizon, Co-Founder/CTO, Astralane  
**What they build:** High-speed transaction infrastructure for Solana — relay gateways, RPC, block building. Think of them as the "AWS of Solana trading infra" — they make transactions land fast.

---

## Context: What is Astralane?

Astralane builds the infrastructure that makes fast Solana trading possible. They compete with Jito, Nozomi, Helius. Their products:
- **Iris** — transaction relay/gateway (gets txs to validators fast)
- **RPC** — high-speed blockchain data access
- **Landing services** — ensuring transactions get included in blocks

**Why it matters:** If you're building a trading bot or DEX, you need this infra to compete. Speed = money.

---

## Topic 1: MEV & Sandwich Attacks

**Context for Harkirat:** MEV = "Maximal Extractable Value" — when bots see your transaction before it confirms, they front-run you (sandwich attack), extracting value from your trade. It's like someone seeing your order at a stock exchange and jumping in front of you.

**Questions:**
1. What's the current ratio of tight vs wide sandwiches you're seeing?
2. Can you share data on total MEV extracted over time — is it growing, stable, or declining?
3. How does your MEV protection compare to something like Jito's jitodontfront? And with the shift from tight to wide sandwiches, do you think current protections are actually keeping up?

---

## Topic 2: Landing Services Competition

**Context for Harkirat:** "Landing services" = companies that ensure your transaction gets into a block. Jito dominates (~93% market share). Others: Nozomi, Astralane, Helius. They compete on speed, reliability, and MEV protection.

**Questions:**
4. What's your market share vs Nozomi, Jito bundles, Helius, etc? Do you have data on how market share has changed over time?
5. How do you differentiate from Nozomi/Jito specifically — on price, execution quality, or protection?
6. What tips do you charge vs competitors and what explains the differential? (Benedict's research showed Nozomi at ~$0.50/swap, Jito at ~$0.01, and Astralane at ~$0.09 per swap)

---

## Topic 3: Frontends & Order Flow

**Context for Harkirat:** "Frontends" = the UIs you use to trade (Jupiter, Axiom, Photon). Some route more MEV than others. Axiom has a reputation for "toxic order flow" because bot traders use it.

**Questions:**
7. Do you see execution quality differences across frontends (Axiom vs Jupiter UI vs Photon)? Is one more "MEV-able" than others?
8. Is Axiom's order flow uniquely more toxic or is it an industry-wide problem?

---

## Topic 4: Block Builders

**Context for Harkirat:** "Block builders" = entities that assemble Solana blocks. Jito has their own, Harmonic is another. There's concern about vertical integration — if builders favor their own flow, apps like Drift/PPhoenix could suffer.

**Questions:**
9. Do you see any difference in landing rates on Harmonic vs Jito blocks, and any signs of preferential treatment for Nozomi flow on Harmonic blocks? Or is it still too early to tell?
10. If the infrastructure layer ends up vertically integrated, where Harmonic favors flow, does that change how you compete? And more broadly, do you think that kind of vertical integration makes it harder for Solana to develop the neutral microstructure it needs for serious apps like perps and CLOBs?

---

## Topic 5: Where Things Are Headed

**Context for Harkirat:** MCP = "Maximum Chance of Production" or maybe a new Solana feature. Block builders are evolving. Apps like Drift/Phoenix are starting to care more about execution quality.

**Questions:**
11. Do you think the current solutions (BAM, Harmonic, Raiku) are adequate before MCP? How do you see these block builders evolving with MCP?
12. Are you working with any apps directly, or is most of your volume coming through frontend integrations? And from the app side, are teams like Drift or Phoenix actively reaching out to landing services, or are they just accepting the status quo?
13. Can you share any data on which protocols or apps your volume comes from?
14. As the validator client landscape gets more diverse, does that complicate things for you? Do you need to build and maintain separate integrations for each client, or is transaction landing mostly client-agnostic from your end?

---

## Quick Reference for Harkirat

- **Astralane**: High-speed Solana infra (relays, RPC, landing)
- **Jito**: Dominant player (~93% market), runs validator + bundles
- **MEV**: Value extracted by front-running trades
- **Sandwich attack**: Bot sees your trade, jumps in front, exits after you
- **Landing service**: Ensures your tx gets in the block
- **Block builder**: Assembles the block (Jito, Harmonic, etc.)
- **Frontend**: Trading UI (Jupiter, Axiom, Photon)
