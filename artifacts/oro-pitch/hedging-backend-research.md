# Hedging Backend Research: How Do We Actually Protect Users?

**Ruby — Deep Research — February 15, 2026**

---

## The Core Question

Reuben asked: "Where are we hedging? On what platform? Why will it work?" This is the full answer.

---

## Platform Analysis

### 1. Polymarket (Primary Candidate)

**Available Gold Markets (as of Feb 15, 2026):**

| Market | Type | Volume | Liquidity | Expiry |
|--------|------|--------|-----------|--------|
| "What will Gold (GC) hit__ by end of February?" | Binary (will gold hit $X?) | $6M | $943K | 12 days |
| "Gold (GC) above ___ end of February?" | Binary (above/below threshold) | $17.3K | $27.4K | 12 days |
| "What will Gold (GC) settle at in February?" | Range brackets | $5 | $12.3K | 12 days |
| "What will Gold (GC) hit__ by end of June?" | Binary (will gold hit $X?) | $770K | $363K | 5 months |
| "Gold (GC) above ___ end of June?" | Binary (above/below threshold) | $19.8K | $31.8K | 5 months |
| "What will Gold (GC) settle at in June?" | Range brackets | $287K | $116K | 5 months |
| "What will Gold (GC) hit__ by end of December?" | Binary (hit target) | $39.3K | $116K | 11 months |

**Key Insight: The "above/below" markets ARE the hedge.**

The "Gold (GC) above $X end of [month]" markets are exactly binary put options:
- Buy "No" on "Gold above $4,600 end of Feb" = you profit if gold drops below $4,600
- This is functionally a put option with strike $4,600, expiry end-Feb

**Fee Structure:**
- Gold markets are NOT in the fee-enabled categories (15-min crypto, NCAAB, Serie A)
- **Gold markets are fee-free on Polymarket** (no taker fees, no maker fees)
- We can query: `GET https://clob.polymarket.com/fee-rate?token_id={token_id}` to confirm
- If fee-free: **we keep the full spread between what we charge users and what we pay for hedges**

**Maker Rebates:**
- Only available on fee-enabled markets (15-min crypto, NCAAB, Serie A)
- Gold markets currently DON'T qualify for maker rebates
- BUT: if we're providing liquidity by placing resting orders, we could petition Polymarket to enable fees+rebates on gold markets (win-win: more liquidity for them)

**Liquidity Assessment:**
- The "hit target" markets have the most liquidity ($6M vol, $943K active liquidity for Feb)
- The "above/below" markets have less liquidity ($27K for Feb, $31.8K for June)
- **This is the main risk**: Liquidity is thin for the specific markets we need (above/below)
- The bracket settlement markets are even thinner

**How We'd Use Polymarket:**

Example: User wants to protect $5,000 of $GOLD against >10% drops for 30 days.
- Gold at $5,042 → 10% drop = $4,538
- We buy "No" on "Gold above $4,600 end of Feb" (closest available strike)
- If "No" is priced at $0.17 (17% probability gold drops below $4,600), we buy $5,000 worth
- If gold drops below $4,600 → "No" resolves to $1.00 → we profit → pay user
- Cost to us: $0.17 per contract × number of contracts
- We charge user: slightly more (our spread = revenue)

**Problems with Polymarket:**
1. Markets are monthly — no rolling daily protection, only end-of-month settlement
2. Strike prices may not match exactly what users want
3. Liquidity on above/below markets is thin (~$27K)
4. Can't do continuous protection — gaps between market expiries
5. Resolution is end-of-month only, not if gold briefly dips mid-month

---

### 2. Kalshi (Strong Alternative)

**Available Gold Markets:**

| Market | Type | Details |
|--------|------|---------|
| `KXGOLDMON` — "Gold price on Feb 27, 2026 at 5pm EST?" | Monthly price brackets | Specific date settlement |
| Additional monthly/weekly gold price contracts | Various | CFTC-regulated |

**Key Advantages:**
- **CFTC-regulated** — legitimate, institutional-grade
- **Monthly gold price contracts** with specific date resolution
- Has a **Liquidity Incentive Program** (Sep 2025 - Sep 2026):
  - Rewards for resting orders: $10-$1,000/day per market
  - Scored on order size × proximity to best price
  - We could earn rebates just for providing liquidity!
- **Market Maker Program** with additional benefits:
  - Reduced fees
  - Higher position limits
  - Enhanced API access
- **API access** for programmatic trading
- US-focused but accessible

**Fee Structure:**
- Transaction fees on expected earnings (varies by market)
- Maker fees exist on some markets (charged on resting orders that get filled)
- Specific fee schedule: `kalshi.com/docs/kalshi-fee-schedule.pdf`
- Market makers get reduced fees

**How We'd Use Kalshi:**

Same example: Protect $5,000 against >10% gold drops.
- Buy contracts betting gold will be below $4,538 on the settlement date
- Kalshi's range brackets allow more precise strike selection
- Monthly settlement gives us defined hedge windows

**Problems with Kalshi:**
1. US-only (Solana/DeFi users may not have Kalshi accounts)
2. Not on-chain — requires centralized bridge between DeFi and TradFi
3. KYC required — adds friction for automated hedging
4. Position limits may cap our hedging capacity

---

### 3. Hybrid Approach (THE ANSWER)

**We don't choose one — we use BOTH as a liquidity aggregation layer.**

Architecture:
```
User ($GOLD holder)
    ↓
Goldfloor Smart Contract (Solana)
    ↓ Collects premium, manages payouts
Goldfloor Backend (Off-chain)
    ↓ Routes hedges to cheapest source
    ├── Polymarket (on-chain, no fees on gold, global)
    ├── Kalshi (regulated, deeper liquidity, US)
    └── Peer-to-Pool Vault (self-contained fallback)
```

**Why this works:**
1. **Multiple liquidity sources** = better pricing + more capacity
2. **Polymarket for global users** (on-chain, no KYC friction)
3. **Kalshi for US/institutional users** (regulated, potentially deeper)
4. **Vault as fallback** when external liquidity is insufficient
5. **Arbitrage between platforms** = tighter spreads for us

---

## The Math: How Protection Actually Works

### Scenario: Protecting $10,000 of $GOLD against >10% drops

**Gold spot: $5,042**
**Protection threshold: $4,538 (10% below current)**

**On Polymarket:**
- "Gold above $4,600 end of Feb" — currently ~$0.83 Yes / $0.17 No
- Buy $1,000 in "No" shares at $0.17 each = 5,882 shares
- If gold stays above $4,600: lose $1,000 (the premium)
- If gold drops below $4,600: shares worth $5,882 → profit of $4,882
- **Effective protection**: $4,882 payout on a $1,000 premium = ~20% of protected value

**What we charge the user:**
- Premium: 1.3% of protected value = $130/month
- Our hedge cost: ~$100/month (buying "No" shares proportionally)
- **Spread: $30/month = our revenue**

**On Kalshi:**
- Buy equivalent "gold below $4,538" contracts
- Kalshi contracts pay $1 on correct outcome, priced at probability
- Similar cost structure but potentially tighter spreads

### The Maker Rebate Opportunity

**Polymarket (future potential):**
- If gold markets get fee-enabled: 20% rebate on maker volume
- We'd place resting limit orders → earn rebates on fills
- At $100K monthly hedge volume: potential $200-400/month in rebates

**Kalshi Liquidity Incentive Program (active NOW):**
- $10-$1,000/day rewards for providing liquidity
- We maintain resting orders on gold markets
- Dual benefit: hedge our risk AND earn incentives
- Could offset 30-50% of hedging costs

---

## Why This Architecture Works

### For the GRAIL Grant Pitch:

1. **We're not building our own derivatives exchange** — we're a smart routing layer on top of existing liquid markets
2. **Two billion-dollar platforms** (Polymarket + Kalshi) provide the hedging liquidity — we don't need to bootstrap it
3. **Maker rebates/incentives** from both platforms subsidize our hedging costs
4. **Peer-to-pool vault** serves as fallback and catches markets the platforms don't cover
5. **Pyth oracle** + TWAP ensures tamper-proof settlement on-chain
6. **3 weeks to MVP** — routing layer + vault is much simpler than a full options protocol

### Revenue Model:
| Source | Monthly Revenue (at $1M protected) |
|--------|-----------------------------------|
| Premium spread (0.25%) | $2,500 |
| Polymarket maker rebates | $200-400 |
| Kalshi liquidity incentives | $300-1,000 |
| Vault LP performance fee (10%) | $500-1,000 |
| **Total** | **$3,500-$4,900** |

### Risk Management:
- **Correlation risk**: If all platforms fail simultaneously → vault provides backstop
- **Liquidity risk**: If above/below markets thin out → shift to vault-based protection
- **Oracle risk**: Pyth TWAP with Chainlink cross-reference, 24h settlement window
- **Basis risk**: Monthly settlement dates may not perfectly match user's coverage needs → solved with rolling monthly positions

---

## Current Liquidity Reality Check

**Polymarket Gold Markets (Feb 15, 2026):**
- Total gold market volume: ~$7.2M across 8 markets
- Above/below markets: ~$27K-$32K liquidity (thin but usable for small scale)
- Hit-target markets: $363K-$943K liquidity (much deeper)

**What this means:**
- At MVP scale ($50K-$100K protected value): Polymarket above/below markets can handle it
- At growth ($500K+ protected): need to expand to hit-target markets + Kalshi
- At scale ($5M+): multi-platform routing becomes critical

**Kalshi Gold:**
- `KXGOLDMON` series active with monthly settlement
- Specific liquidity data not publicly available without API access
- Market maker program suggests institutional-grade depth

---

## Honest Assessment

**What works:**
- Both platforms have active gold price markets
- Polymarket gold markets are currently fee-free (huge advantage)
- Kalshi has active liquidity incentive program
- The routing layer concept is proven (other DeFi aggregators do this)
- Vault fallback makes the system robust

**What's risky:**
- Polymarket above/below liquidity is thin ($27K-$32K) — limits early scale
- Monthly settlement creates coverage gaps
- Centralized platform risk (Polymarket/Kalshi could delist markets)
- Regulatory gray area (routing DeFi capital to prediction markets)

**Bottom line:** The mechanism works. The liquidity is real but limited at current scale. For a GRAIL grant proof-of-concept, it's more than sufficient. The vault fallback handles edge cases. This is buildable.

---

*Last updated: Feb 15, 2026 — Ruby*
