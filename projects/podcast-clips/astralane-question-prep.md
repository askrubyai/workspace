# Astralane Podcast — Question Prep

**Guest:** Sujith Sizon (co-founder, technical lead)  
**Format:** Claire/Blue Shift style — technical deep dive, discovery flow  
**Focus:** How Iris works, infrastructure decisions, latency optimization

---

## 1. The Core Product (Iris)

1. **What exactly is Iris? You've described it as a "transaction-sending engine" — walk me through what happens when a client submits a transaction through Iris.**

2. **What's the "p90 sub-slot reliability" metric you target? Why that threshold? What happens in the other 10% of cases?**

3. **How is Iris different from just running a Jito validator or using a standard RPC? What's the value add?**

---

## 2. Infrastructure & Latency

4. **You went with bare metal over cloud — why? What specific problems were you trying to solve that virtualization introduced?**

5. **Cherry Servers case study mentions "strategically located data centers that aligned with your network path requirements" — how do you decide where to deploy? What's the decision framework?**

6. **What's your actual end-to-end latency from client submission to block inclusion? Where are the biggest bottlenecks?**

7. **You've got RPC, Iris, and Shreds Broadcaster as separate workloads — how do they interact? Is there a single pipeline or separate clients?**

---

## 3. The Solana Specifics

8. ** Solana's block time is ~400ms with 32 slots — how do you achieve sub-slot reliability? What's the trick?**

9. **How does Jito bundling fit into your architecture? Are you using Jito tips, MEV, or is it purely about ordering?**

10. **What's your take on the recent Solana fee market changes? Does that affect how you build transaction infrastructure?**

---

## 4. Competition & Differentiation

11. **Who are your direct competitors? How do you differentiate?**

12. **You've got HFTs, trading bots, and DEXs as customers — do they want different things from your infrastructure?**

---

## 5. The Founder Journey

13. **You're building in Bangalore — what's the web3 infrastructure scene like there? Talent pool, customer base?**

14. **What's the hardest technical problem you haven't solved yet?**

---

## 6. The Future

15. **Where do you see transaction infrastructure heading in 2-3 years? What new problems are you prepping for?**

---

## Notes for Reuben

- **Discovery flow**: Start broad (what does Astralane do?) → dive into Iris details → infrastructure → competition
- **Avoid**: Personal founder story, "how did you get started" — save for end if there's time
- **Tech depth**: Audience is devs/builders. Don't shy away from specifics (p90, bare metal, Jito)
- **Contrarian angle**: Everyone says "build on Solana" — what's actually hard about it that most people miss?
