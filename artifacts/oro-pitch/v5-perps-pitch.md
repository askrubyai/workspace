# Fool's Gold — Downside Protection for $GOLD Holders

**One slider. Pick your protection. We handle the rest.**

## The Problem

$GOLD holders earn 3-4% APY. But gold can drop 10-20% in weeks — wiping out years of yield. There's no on-chain way to hedge this.

## The Solution

Fool's Gold puts a floor under your gold. Connect wallet → slide to set protection → one click → done. We open a short XAU perpetual sized to your hedge. Gold drops → perp profits offset the loss. Gold rises → small funding cost, covered by yield.

## How It Works

1. Connect wallet → we read $GOLD balance
2. Slide: "Protect 25% / 50% / 75% / 100% of my gold"
3. See estimated cost (funded from Oro staking yield)
4. One click → we open short XAU perp on Flash Trade (Solana)
5. Gold drops → automatic offset. User never touches a derivative.

## The Math

Oro yield (~3.5% APY) covers the entire hedging cost. Users get protection AND positive yield.

| Hedge Level | Funding Cost | Oro Yield | Net APY |
|-------------|-------------|-----------|---------|
| 25% | ~0.6% | 3.5% | +2.9% ✅ |
| 50% | ~1.25% | 3.5% | +2.25% ✅ |
| 75% | ~1.9% | 3.5% | +1.6% ✅ |
| 100% | ~2.5% | 3.5% | +1.0% ✅ |

Even at 100% protection, the user nets ~1% APY. Full hedge + positive yield.

## Where We Hedge

| Platform | Chain | Fees | Notes |
|----------|-------|------|-------|
| Flash Trade ⭐ | Solana | 4 bps | Same chain + oracle (Pyth) as Oro. Up to 500x. Primary. |
| Lighter.xyz | ZK rollup | 0 fees | Zero fees, 20x, a16z backed. Fallback. |
| Ostium | Arbitrum | 3 bps | 200x, $53M TVL, Pantera backed. Fallback. |

Flash Trade is primary — same chain as Oro (Solana), same oracle (Pyth), zero cross-chain friction.

## Why This Matters for Oro

- "The only tokenized gold with built-in downside protection" — instant marketing hook
- Unlocks institutional capital — whales need hedging before deploying $50K+
- First mover — zero on-chain gold protection exists
- Revenue scales with TVL

## Build Plan

Phase 1 (4 weeks): Smart contracts — Flash Trade integration, position management, yield routing
Phase 2 (2 weeks): Frontend — slider UX, wallet connect, real-time cost display

## The Ask

GRAIL Grant to build Fool's Gold as a native Oro ecosystem protocol. 2 devs, 6 weeks to MVP. Open-source, composable, revenue-sharing with Oro treasury.

## Team

Reuben Rapose — Founding engineer at Trepa (funded by Balaji & Colosseum). Solana developer. Built prediction market infra, quant trading systems, and DeFi tooling.

---

*Fool's Gold — Your gold. Your floor. Sleep well.*
