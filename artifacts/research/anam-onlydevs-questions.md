# OnlyDevs: Anam Ansari (Trepa)

**Guest:** Anam Ansari - Lead Blockchain Engineer @ Trepa  
**Twitter:** [@anamansari062](https://twitter.com/anamansari062)  
**Trepa:** [trepa.app](https://trepa.app)

---

## Questions

### Understanding Trepa

1. **So you're building Trepa. For someone who hasn't used it - what is it? What problem are you solving?**

2. **So it's a prediction market, but you mentioned "precision" - how is that different from something like Polymarket where you just bet yes or no?**

3. **Interesting. So if I predict SOL will be $150 and it ends up at $148, I still get paid - just less than someone who predicted $147? How does that scoring actually work?**

### The On-Chain Math

4. **Now here's where it gets technical. You're calculating payouts based on how close everyone was to the actual number. But Solana programs can't do floating point math. How do you handle that?**

5. **Fixed-point makes sense. But now you have calculations happening on the frontend and on-chain. How do you make sure they match? What happens if there's a rounding mismatch?**

6. **Where exactly does the rounding happen - client side before sending the transaction, or in the program itself?**

### Architecture Decisions

7. **You rebuilt the entire protocol from scratch - V1 to V2 - in just 3 months. That's a big decision. What was wrong with V1 that made you say "we need to start over" instead of just fixing it?**

8. **Trepa sponsors transaction fees for users - they don't pay gas. That means you're paying rent for every account. How do you design your account layout to keep that sustainable?**

9. **How do you think about what state to keep on-chain vs off-chain? What's your mental model there?**

### Oracles & Resolution

10. **For the prediction to resolve, you need the actual price at a specific moment. What oracle are you using and why?**

11. **What happens if the oracle is slow or returns stale data during high volatility? How do you handle that edge case?**

### Security

12. **You've been through a security audit. What was that process like? What did auditors focus on for a prediction market specifically?**

13. **Without going into too much detail - was there anything scary that came up? Something that would've been bad if it shipped?**

14. **You also do something called "internal mainnet testing" - running with real money before public launch. What have you caught that way that you wouldn't have found in devnet?**
