# Goldfloor — Downside Protection for $GOLD Holders

## The Problem

$GOLD holders earn 3-4% APY. But gold can drop 10-20% in weeks. One crash wipes out years of yield. There's no on-chain way to protect against this. Users either hold and pray, or sell and miss the upside.

## The Solution

**Goldfloor puts a floor under your gold.**

One slider. Pick how much of your $GOLD to protect. See the monthly cost. One button. Done.

We handle everything — vault management, pricing, settlement, payouts. The user never touches a derivative.

## How It Works

1. User connects wallet, we read their $GOLD balance
2. Slider: "Protect X% of my gold against drops of Y% or more"
3. We show monthly cost in real-time
4. User pays premium from $GOLD yield or USDC
5. If gold drops below their floor → automatic payout

**Backend:** Peer-to-pool protection vault. LPs deposit USDC, earn premiums. Payouts settled via Pyth gold oracle (24h TWAP). Black-Scholes pricing with dynamic vol adjustment.

## The Free Tier (The Hook)

Catastrophe protection (>20% crash) costs ~0.17%/month. Oro staking yield is ~0.29%/month.

**The yield covers the premium.** Every $GOLD holder gets free crash insurance. Net yield: ~1.4% APY + peace of mind.

| Tier | Protects Against | Monthly Cost | How It Feels |
|------|-----------------|-------------|--------------|
| 🟢 **Free** | >20% crash | $0 (yield-funded) | Sleep safe |
| 🟡 **Secure** | >15% drop | 0.45% | A coffee/month per $500 |
| 🔴 **Fortress** | >10% drop | 1.05% | Netflix for your gold |

## Why This Matters for Oro

- **Free protection = marketing hook:** "The only tokenized gold with built-in crash insurance"
- **Attracts larger holders:** Institutions need hedging. This unlocks $50K+ deposits
- **Creates new yield source:** LP vault = new DeFi primitive in Oro ecosystem
- **Grows with TVL:** Revenue scales linearly with protected value + gold price
- **First mover:** Zero on-chain gold protection protocols exist. We checked everything.

## The Math Works

At $10M protected value (10% of a $100M TVL Oro):
- Free tier: Funded by yield spread (~$12K/yr operating cost)
- Premium tiers: $30K-$150K/yr revenue (0.25% spread on protected value)
- LP vault: Additional performance fees

At current Oro TVL ($450K): proof of concept.  
At $10M+: real revenue.  
At $100M+: category-defining protocol.

## What We're Building

**Phase 1 (4 weeks):** Solana/Anchor smart contracts — protection vault, Pyth oracle integration, premium pricing engine, binary payout settlement

**Phase 2 (2 weeks):** Frontend — slider UX, wallet integration, real-time pricing, payout dashboard

**Phase 3 (ongoing):** LP vault launch, premium tier rollout, dynamic vol pricing, institutional features

## The Ask

**GRAIL Grant** to build Goldfloor as a native Oro ecosystem protocol.

- 2 developers, 6 weeks to MVP
- Open-source, composable, built on Oro's existing infrastructure
- Revenue-sharing model with Oro treasury on premium tiers

## Team

**Reuben Rapose** — Founding engineer at Treppa (funded by Balaji & Colosseum). Solana developer. Previously built prediction market infrastructure, quantitative trading systems, and DeFi tooling.

---

*Goldfloor: Your gold. Your floor. Sleep well.*
