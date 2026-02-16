# Oroboros: Gold Downside Protection on Oro Finance

**GRAIL Grant Application — Reuben Rapose**
**February 2026**

---

## The Problem

Oro has a growing base of $GOLD holders. They love the 3-4% yield, the Solana speed, and the Brinks-vaulted trust.

But they have **one fear Oro can't solve today**: what if gold drops 10% next month?

Right now, $GOLD holders have two options:
1. **Hold and hope.** Stomach the drawdown. No protection.
2. **Sell to USDC.** Lose the yield. Lose exposure. Pay swap fees. Then time the re-entry.

Neither is good. In TradFi, gold investors buy put options or inverse ETFs. On-chain $GOLD holders have **nothing.**

---

## The Solution: Oroboros

**One-sentence:** Buy downside protection on your $GOLD — like insurance for your gold position.

### How It Works (User's Perspective)

1. You hold $500 worth of $GOLD on Solana
2. You go to Oroboros and buy a "Gold Shield" — 30-day protection against a >5% drop
3. You pay a small premium (e.g., $8 — roughly 1.6%)
4. If gold drops 12% in those 30 days, Oroboros pays you the difference below your protected price
5. If gold goes up or stays flat, you keep your full upside minus the premium

**That's it.** You keep holding $GOLD. You keep earning Oro's yield. You just sleep better.

### Why This Is Better Than What Exists

| Today | With Oroboros |
|-------|--------------|
| Sell $GOLD to "hedge" → lose yield + exposure | Keep $GOLD + yield, buy protection |
| No on-chain gold options anywhere | First on-chain gold protection product |
| TradFi options require $50K+ minimums, brokers, KYC | $10 minimum, one click, permissionless |
| Binance/Deribit gold futures = centralized, 100x leverage degen tools | Simple insurance, not speculation |

---

## Why Oro Should Care

**1. It keeps $GOLD sticky.** The #1 reason holders sell $GOLD is fear of drawdowns. Remove the fear → they hold longer → Oro's TVL grows.

**2. It's a new revenue layer.** Protection premiums are a fee market Oro can participate in (revenue share, referral fees, protocol fees).

**3. It makes $GOLD a complete product.** Savings ($GOLD) + Yield (staking) + Protection (Oroboros) = the full stack. No other tokenized gold has this.

**4. It validates GRAIL's composability story.** A third-party dev (me) building a real financial product on GRAIL's infrastructure is the exact proof-of-concept Oro needs to attract more builders.

---

## How It Works (Under the Hood)

**Architecture: Peer-to-Pool Protection Vault**

Two sides of the market:

- **Protection Buyers**: $GOLD holders who pay premiums to hedge downside
- **Protection Sellers (Vault LPs)**: Deposit USDC into a vault, earn premiums as yield

The vault is the counterparty. When gold drops below the strike price, the vault pays out. When it doesn't, vault LPs keep the premiums.

**Oracle:** Pyth Network gold price feed (already integrated with Oro/Solana ecosystem)

**Smart Contracts (Solana/Anchor):**
- Protection Vault program (holds USDC collateral)
- Protection NFT (represents an active policy — tradeable)
- Settlement program (auto-settles on expiry using Pyth oracle)

**This is NOT an options protocol.** It's much simpler:
- Fixed terms (7/14/30 days)
- Fixed protection levels (5%, 10%, 15% below current price)
- No greeks, no margin calls, no liquidations
- Binary outcome: either pays out or it doesn't

---

## MVP Scope (What I'll Build in 8 Weeks)

### Week 1-2: Smart Contracts
- Protection Vault (USDC deposits, withdrawal queue)
- Policy minting (buy protection → get NFT receipt)
- Settlement logic (Pyth oracle integration)

### Week 3-4: Frontend
- Clean UI: "Protect my $GOLD" flow (connect wallet → pick term → pick level → pay)
- Vault dashboard for LPs ("Earn yield by underwriting gold protection")
- Portfolio view (your active protections + P&L)

### Week 5-6: Testing + Audit Prep
- Devnet testing with simulated price feeds
- Edge case handling (oracle failures, vault insolvency scenarios)
- Security review (self-audit + external review if budget allows)

### Week 7-8: Mainnet Launch
- Mainnet deployment with capped vault ($50K initial)
- Co-marketing with Oro (tweet threads, docs integration)
- First protection policies live

### Post-MVP (Month 3-6)
- GRAIL API integration (protection-as-a-service for other $GOLD apps)
- Variable terms + custom strikes
- Secondary market for protection NFTs
- Institutional vaults (larger caps, custom terms)

---

## Complications (Real Talk)

### 1. Liquidity Bootstrapping (Hardest Problem)
The vault needs USDC depositors willing to be counterparty. Without LPs, no one can buy protection. **Chicken-and-egg.**

**Mitigation:** 
- Seed the vault with grant funds ($25-50K USDC)
- Offer early LP incentive boost (higher share of premiums)
- Start with very short terms (7 days) to attract conservative LPs

### 2. Pricing the Premium
If premiums are too high → no one buys protection. Too low → vault LPs lose money.

**Mitigation:**
- Start with conservative fixed pricing (1-3% for 30-day, 5% protection)
- Use implied volatility from CME gold futures as benchmark
- Iterate pricing based on actual demand/supply data

### 3. Oracle Risk
If Pyth gold feed goes stale or is manipulated, settlements could be wrong.

**Mitigation:**
- Use Pyth's confidence interval — reject settlements where confidence is too wide
- Add a settlement dispute window (12h after expiry)
- Fallback to Chainlink gold feed (cross-check)

### 4. Vault Insolvency
If gold crashes 20%+ and all policies pay out simultaneously, the vault might not have enough USDC.

**Mitigation:**
- Cap total protection sold to % of vault balance (e.g., max 3x leverage)
- Spread risk across protection levels and expiry dates
- Auto-pause new protection sales when utilization hits 80%

### 5. Smart Contract Risk
Brand new protocol = unaudited code. One exploit = game over.

**Mitigation:**
- Start with capped vault ($50K max)
- Open source everything
- Professional audit before raising caps (budget: $15-25K)
- Bug bounty program

### 6. Regulatory Uncertainty
Gold derivatives are regulated in most jurisdictions. Even on-chain, this could attract attention.

**Mitigation:**
- Structured as "protection" not "options" (insurance framing)
- Permissionless, non-custodial (no KYC required)
- UAE-based structure (align with Oro's regulatory posture)
- Legal review before institutional marketing

### 7. Market Size (Initially Small)
Oro's TVL is ~$450K. Even if 20% of holders buy protection, that's $90K in protected value → ~$1-3K in premiums/month.

**Mitigation:**
- This grows linearly with Oro's TVL (which is growing)
- Success here = proof that GRAIL ecosystem works
- Protection product itself attracts new $GOLD buyers who were previously afraid of volatility

---

## What I Need From Oro

| Item | Amount | Purpose |
|------|--------|---------|
| $GOLD or USDC grant | $50K | Seed the protection vault + 6-month runway |
| GRAIL API early access | — | Integration for protection-as-a-service |
| Co-marketing support | — | Joint launch announcement, docs listing |
| Technical guidance | — | Pyth integration best practices, $GOLD token specs |

---

## Why Me

I'm a founding engineer at Treppa (Solana infrastructure, backed by Colosseum + Balaji). I've built on Solana for 18 months, understand the ecosystem deeply, and have direct relationships across the Solana builder community (Superteam India, Colosseum alumni).

This isn't a side project — this is a product I'll use myself as a $GOLD holder, and one that I believe makes Oro's entire ecosystem more defensible.

---

## The Pitch in One Line

> **"Oro made gold productive. Oroboros makes it protected."**

---

*Contact: Reuben Rapose — [reuben.rapose@gmail.com](mailto:reuben.rapose@gmail.com)*
*Twitter: @reubence*
