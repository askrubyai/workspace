# Astralane Podcast — OPEN-ENDED Question Prep (v2)

**Theme:** Accessible → Deep Dive → Let Sujith teach us  
**Format:** Open-ended questions, follow where the conversation goes  
**Audience:** Developers new to Solana infra

---

## 1. The Foundation (Accessible)

1. **For someone who's heard about Solana but never touched infra — what problem does Astralane solve? If I wanted to build a trading bot, why would I need you?**

2. **You've mentioned "relay gateways" — I've seen terms like Jito, Bloxroute, now Astralane. Can you paint a picture of what a transaction goes through from my bot to getting included in a block?**

---

## 2. The Deep Dive (Go Deeper)

3. **You've got three products: sendTransaction, sendBundle, sendIdeal. Without getting too technical — when would I reach for one over the other?**

4. **The Cherry Servers case study mentioned p90 sub-slot reliability — for a dev who's never thought about latency, why does that number matter? What does "missing the slot" actually cost me?**

5. **Infrastructure-wise, you chose bare metal over cloud. Walk me through what that decision looked like. What did you lose? What did you gain?**

---

## 3. The Technical (For the Builders)

6. **I want to understand the relay landscape better. You're competing with Jito, Bloxroute, others — what's the technical differentiator? Is it speed? Reliability? Something else?**

7. **Jito has the 200ms bundle delay for MEV — does that play into your architecture at all? Are you building for MEV capture or just raw speed?**

8. **What happens when things go wrong? Network partitions, validator drops, market volatility — what's your retry story?**

---

## 4. The View From Above

9. **Where do you see transaction infrastructure heading in the next 2-3 years? Are we just optimizing latency, or is there a bigger shift coming?**

10. **For a dev getting started in this space — what's the one thing you wish more people understood about how Solana actually works under the hood?**

---

## Notes for Harkirat (Host)

- **Start accessible** (Q1-2) → let Sujeth set the scene for newbies
- **Go deeper** (Q3-5) → the meat for intermediate devs
- **Technical deep dive** (Q6-8) → for the builders in the audience
- **Open-ended is key** — let Sujith elaborate, don't rush to Q2 if Q1 sparks something interesting
- **Relay gateway term** — this is what Reuben remembered from the call. Astralane's Iris IS a relay gateway (transaction relay network)
