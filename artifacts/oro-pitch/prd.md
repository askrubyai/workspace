# Product Requirements Document: GRAIL Prediction Markets
**Gold-Denominated Prediction Markets on Oro Finance**

**Version:** 1.0  
**Date:** February 15, 2026  
**Status:** Draft  
**Author:** Product Strategy Team

---

## Executive Summary

GRAIL Markets transforms prediction markets from gambling platforms into genuine hedging instruments by denominating them in tokenized gold (GRAIL). Built on Oro Finance's gold tokenization infrastructure, this product enables gold holders to hedge their exposure while offering non-gold-holders a novel path to gold accumulation through informed predictions.

**Core Thesis:** "You buy gold to hedge against everything — but who hedges against gold?"

---

## 1. Problem Statement

### 1.1 Current Prediction Markets Are Broken

Vitalik Buterin's February 14, 2026 critique identified fundamental flaws in existing prediction markets:

**"Corposlop" Design Philosophy**
- Markets optimized for engagement metrics, not utility
- UI/UX designed to maximize time-on-site and trading volume
- Feature sets mirror sports betting platforms (parlays, same-game combinations, live betting)
- Marketing focuses on "winning big" rather than risk management

**Over-Indexing on Gambling**
- 80%+ of volume on Polymarket/Kalshi is on sports, politics, and entertainment
- User acquisition mirrors DraftKings/FanDuel playbooks
- Regulatory scrutiny treats them as gambling platforms (because they effectively are)
- No integration with real-world financial planning or portfolio management

**Denominated in Volatile or Undesirable Assets**
- USDC/USDT: Exposure to stablecoin depeg risk, regulatory seizure, centralization
- ETH/SOL: Directional crypto exposure users may not want
- Fiat on-ramps: KYC friction, withdrawal limits, banking risk
- **Core issue:** Users don't want to *hold* the settlement asset long-term

### 1.2 Gold Holders Need Hedging Tools

Gold isn't a one-way bet. Historical drawdown periods reveal significant risk:

**2013-2018: The Lost Half-Decade**
- Peak: $1,920/oz (September 2011)
- Trough: $1,050/oz (December 2015)
- **-45% drawdown over 4+ years**
- Real purchasing power loss accounting for inflation: ~50%

**2020-2024: Post-COVID Stagnation**
- Despite money printing, gold ranged $1,700-$2,100
- Underperformed equities, real estate, and crypto significantly
- Opportunity cost for holders was massive

**Current Reality (2026)**
- Gold at all-time highs (~$2,900+)
- Geopolitical premium embedded in price
- Mean reversion risk if tensions ease
- Inflation moderates, real rates turn positive

**Existing Solutions Are Inadequate:**
- **Gold futures/options:** Require brokerage accounts, margin, counterparty risk
- **Gold mining stocks:** Equity risk, management risk, not pure gold exposure
- **Selling physical gold:** Tax events, liquidity costs, loss of hedge position
- **Gold ETF puts:** Expensive, time decay, cash settlement creates tax complexity

**What gold holders actually need:**
- On-chain, self-custodied hedging
- Maintain gold exposure while hedging specific risks (rate hikes, peace breaking out, Bitcoin decoupling)
- Granular, event-specific hedges vs. broad directional bets
- Tax-efficient structure (crypto-to-crypto = no realization event in many jurisdictions)

### 1.3 Why GRAIL/Oro Is the Perfect Base Layer

**Technical Infrastructure:**
- **1:1 gold backing:** Every GRAIL token = 1/100,000 troy oz gold held in audited vaults
- **Solana-native:** Sub-second settlement, <$0.01 transaction costs
- **Composable:** SPL token standard enables DeFi integration
- **Audited:** Real-time proof-of-reserves via Chainlink oracles

**Economic Advantages:**
- **Users want to hold it:** Unlike USDC (counterparty risk) or ETH (volatility), gold is a desired long-term hold
- **No directional exposure:** Denominating in GRAIL means users aren't forced to take crypto exposure to participate
- **Tax efficiency:** Crypto-to-crypto swaps in many jurisdictions don't trigger capital gains
- **Regulatory clarity:** Physical commodity backing = clearer regulatory treatment than algorithmic stablecoins

**Strategic Alignment:**
- Oro Finance needs DeFi use cases to drive GRAIL adoption beyond "buy and hold"
- Prediction markets create organic buy-side pressure (users need GRAIL to participate)
- Liquidity flywheel: More markets → more GRAIL demand → deeper liquidity → tighter spreads → more markets

**Vitalik's Thesis Embodied:**
- "Denominate in assets people want to hold" ✓
- "Create personalized expense baskets" ✓ (see Section 3.4)
- "Hedging tools, not gambling" ✓

---

## 2. Solution Overview

### 2.1 Product Definition

**GRAIL Markets** is a Solana-based prediction market protocol where:
- All positions are collateralized in GRAIL tokens (tokenized gold)
- Markets settle in GRAIL tokens
- Users can hedge gold price exposure, macro events, and commodity correlations
- Personalized "expense basket" markets let users hedge real-world purchasing power

### 2.2 Core Value Propositions

**For Gold Holders:**
- Hedge specific risks without selling gold position
- Earn yield on gold holdings via market-making
- Access event-driven alpha while maintaining gold exposure
- Tax-efficient hedging (no fiat realization events)

**For Non-Gold Holders:**
- Acquire gold exposure through prediction market winnings
- Diversify into hard assets via informed forecasting
- Avoid KYC/brokerage friction of traditional gold purchases
- Accumulate gold incrementally (prediction markets = DCA via edge)

**For Degens/Traders:**
- Alpha generation in GRAIL-denominated markets
- Liquidity provision earnings in gold (stable yield in volatile times)
- Arbitrage opportunities between GRAIL markets and TradFi gold derivatives
- Leverage prediction accuracy into hard asset accumulation

**For Oro Finance:**
- Drive GRAIL utility and adoption
- Create organic demand for GRAIL tokens
- Differentiate from "gold token" competitors via DeFi integration
- Generate protocol fees in GRAIL (accrue value to ecosystem)

### 2.3 Market Categories (High-Level)

1. **Gold Price Markets**  
   Direct hedges for gold price movements vs. fiat, Bitcoin, real assets

2. **Macro Hedge Markets**  
   Event-driven hedges: Fed policy, geopolitical events, inflation data

3. **Correlation Markets**  
   Gold vs. other assets: Bitcoin correlation, gold/silver ratio, gold vs. equities

4. **Expense Basket Markets**  
   Personalized purchasing power hedges: energy costs, food, housing (Vitalik's vision)

### 2.4 Settlement Mechanism

- **Binary markets:** Winner takes pool (minus fees), settled in GRAIL
- **Scalar markets:** Payout proportional to outcome, settled in GRAIL
- **AMM-based:** Automated market maker for continuous liquidity
- **Oracle resolution:** Pyth/Switchboard price feeds + governance override for edge cases

---

## 3. Market Types (Detailed Specifications)

### 3.1 Gold Price Markets

**Purpose:** Direct hedging for gold price movements

**Market Structures:**

**A. Gold Price Ranges (Scalar)**
- **Example:** "GRAIL/USD price 30 days from now"
  - Continuous outcome from $2,500-$3,500
  - Users buy positions on price ranges
  - Payout proportional to how close prediction is to settlement price
  - Settled via Pyth GRAIL/USD oracle

**B. Binary Price Milestones**
- **Example:** "Will GRAIL/USD exceed $3,000 by March 31, 2026?"
  - Yes/No market
  - Settlement at oracle price on resolution date
  - Hedging tool: Gold holders can short "Yes" to hedge downside

**C. Gold vs. Bitcoin Peg**
- **Example:** "Will 1 BTC buy more than 20 oz gold by year-end?"
  - Denominated in GRAIL, but measures gold's purchasing power vs. BTC
  - Hedges relative performance, not absolute price
  - Useful for diversified holders managing gold/BTC allocation

**Use Case Example:**

> **Sarah's Hedge**  
> Sarah holds 100 oz gold ($290k) and worries about mean reversion. She doesn't want to sell (tax event + lose hedge position), but wants downside protection.
>
> **Solution:** Sarah deposits 20 GRAIL into "Gold below $2,700 by April 30" market, buying "Yes" at 35¢. If gold crashes, her 20 GRAIL becomes 57 GRAIL (+185%), offsetting portfolio loss. If gold rises, she loses 20 GRAIL but her 100 oz position gained more.

**MVP Markets (Q2 2026):**
1. "GRAIL/USD > $3,000 by June 30" (binary)
2. "GRAIL/USD < $2,500 by June 30" (binary)
3. "GRAIL/BTC price range 30-day forecast" (scalar)

### 3.2 Macro Hedge Markets

**Purpose:** Event-driven hedges for gold-affecting catalysts

**Market Structures:**

**A. Federal Reserve Policy**
- **Example:** "Will the Fed cut rates in the next FOMC meeting?"
  - Gold typically rises on cuts (lower real yields)
  - Gold holders can hedge "no cut" scenario by buying "No"
  - Settles via FOMC statement release

**B. Geopolitical Events**
- **Example:** "Will Russia-Ukraine war escalate in Q2 2026?"
  - Defined criteria: nuclear rhetoric, NATO involvement, territorial expansion
  - Gold's "war premium" hedged
  - Settles via predefined resolution criteria + governance

**C. Inflation Data**
- **Example:** "Will CPI exceed 3.5% in March 2026 print?"
  - Gold as inflation hedge thesis tested monthly
  - Users can hedge "inflation moderates" scenario
  - Settles via official BLS release

**D. Central Bank Gold Buying**
- **Example:** "Will central banks buy >100 tonnes net in Q1 2026?"
  - Measures demand-side strength
  - Data from World Gold Council
  - Hedges supply/demand imbalances

**Use Case Example:**

> **Marcus's Fed Hedge**  
> Marcus holds gold as inflation hedge but worries the Fed will pivot hawkish after strong jobs data, tanking gold. He buys "Fed hikes in next meeting" at 25¢ with 10 GRAIL.
>
> **Outcome A (Hike happens):** Gold drops -8%, his 10 GRAIL becomes 40 GRAIL (+300%), offsetting portfolio loss.  
> **Outcome B (No hike):** Gold rallies +5%, he loses 10 GRAIL but portfolio gained more.

**MVP Markets (Q2 2026):**
1. "Fed rate decision (March 2026 FOMC)" (binary)
2. "CPI > 3.5% in March" (binary)
3. "Geopolitical risk premium persists" (scalar, custom index)

### 3.3 Correlation Markets

**Purpose:** Hedge gold's relationship to other assets

**Market Structures:**

**A. Gold-Bitcoin Correlation**
- **Example:** "Will gold/BTC 30-day correlation be positive?"
  - Measures whether gold and BTC move together or diverge
  - Settles via Pyth price feeds + correlation calculation
  - Hedges "safe haven bifurcation" scenario

**B. Gold-Silver Ratio**
- **Example:** "Will gold/silver ratio exceed 80 by month-end?"
  - Classic precious metals trade
  - Silver more industrial, gold more monetary
  - Hedges relative precious metal performance

**C. Gold vs. S&P 500**
- **Example:** "Will gold outperform S&P 500 in Q2 2026?"
  - Risk-on vs. risk-off regime hedge
  - Settles via % return comparison
  - Useful for diversified portfolios

**D. Real Yields Impact**
- **Example:** "Will gold price correlate >0.5 with real yields this quarter?"
  - Gold's classic inverse relationship to real rates
  - If relationship breaks, signals regime change
  - Hedges structural shifts

**Use Case Example:**

> **Priya's Allocation Hedge**  
> Priya holds 60% gold, 40% Bitcoin. She worries they'll correlate negatively (Bitcoin tanks, taking gold with it). She buys "Negative gold/BTC correlation in 30 days" at 40¢ with 15 GRAIL.
>
> **If correlation goes negative:** Bitcoin dumps, gold follows, but her 15 GRAIL becomes 37.5 GRAIL, offsetting some loss.  
> **If they stay uncorrelated/positive:** She loses 15 GRAIL but portfolio intact.

**MVP Markets (Q2 2026):**
1. "Gold/BTC 30-day correlation > 0" (binary)
2. "Gold/Silver ratio range forecast" (scalar)

### 3.4 Expense Basket Markets (Vitalik's Vision)

**Purpose:** Personalized purchasing power hedges

**Market Structures:**

**A. Personal CPI Baskets**
- **Example:** "Will my food basket (10 items) cost more in GRAIL terms in 90 days?"
  - User defines basket: eggs, milk, bread, chicken, rice, etc.
  - Oracle tracks prices, converts to GRAIL cost
  - Hedges purchasing power in specific consumption category

**B. Regional Cost-of-Living**
- **Example:** "Will rent in San Francisco exceed X GRAIL/month by year-end?"
  - Hedges local real estate inflation
  - Data from Zillow/Redfin APIs
  - Useful for gold holders facing local cost surges

**C. Energy Costs**
- **Example:** "Will gasoline average >$5/gal (in GRAIL terms) this summer?"
  - Hedges energy inflation eating into gold's purchasing power
  - Data from EIA
  - Particularly relevant for commuters, logistics operators

**D. Education/Healthcare**
- **Example:** "Will college tuition rise faster than gold this year?"
  - Long-term purchasing power hedge
  - Data from institutional pricing
  - Useful for parents accumulating gold for future expenses

**The Vitalik Thesis:**

> "If you are a person who wants to buy a house, you don't want to be exposed to the price of Ethereum, but you *do* want to be exposed to the price of houses in your city. So what if there was a 'house price in my city' prediction market, and you could use that as a hedging tool?"

**GRAIL Markets Implementation:**

- Users hold gold (universal hedge)
- But gold doesn't perfectly track *their specific* expenses
- Personalized markets let them fine-tune: hold gold, hedge specific expense categories
- If food inflates faster than gold → "food basket appreciation" market pays out
- If housing inflates faster → "local rent increase" market pays out

**Use Case Example:**

> **Ahmed's Food Hedge**  
> Ahmed lives in Cairo, holds 50 oz gold. Food inflation is 15%/year but gold is only up 8%. His purchasing power is eroding. He creates "Cairo food basket appreciation vs. gold" market, buys "Yes" (food inflates faster) with 5 GRAIL.
>
> **Outcome A (Food inflates 15%, gold up 8%):** Market pays 2:1, his 5 GRAIL becomes 10 GRAIL, offsetting purchasing power loss.  
> **Outcome B (Gold keeps pace):** He loses 5 GRAIL but purchasing power maintained.

**MVP Markets (Q3 2026):**
1. "Generic US food basket (20 items) GRAIL cost in 90 days" (scalar)
2. "Average US rent in GRAIL terms" (scalar)
3. "Gasoline (national average) GRAIL cost this summer" (scalar)

**Technical Note:** Expense baskets require reliable, tamper-proof data feeds. MVP will use:
- Pyth Network for commodities (WTI crude → gasoline proxy)
- Switchboard for custom data (scraping grocery APIs, rent data)
- Governance resolution for disputes

---

## 4. User Personas

### Persona 1: **Sarah the Gold Bull**

**Demographics:**
- Age: 42
- Location: Austin, Texas
- Occupation: Tech executive
- Net worth: $2.5M (30% in physical gold, 40% real estate, 30% equities)

**Background:**
- Bought gold starting 2020 as inflation/debasement hedge
- Distrusts fiat currency and CBDCs
- Holds physical gold in vault, some GRAIL for liquidity
- Worried about opportunity cost of 30% allocation to zero-yield asset

**Goals:**
- Maintain gold position as long-term hedge
- Generate yield on gold holdings
- Hedge short-term volatility without selling
- Avoid tax events from trading in/out of gold

**Pain Points:**
- Gold futures require margin account, counterparty risk
- Can't actively manage risk without triggering capital gains
- No DeFi-native tools for gold hedging
- Misses out on alpha from macro forecasting skills

**How She Uses GRAIL Markets:**

1. **Hedging:** Buys "Gold < $2,700 by April" at 30¢ to hedge near-term downside while keeping position
2. **Yield Generation:** Provides liquidity to AMM pools, earns fees in GRAIL (yield on gold!)
3. **Tactical Trading:** Uses Fed policy markets to hedge event risk without selling gold
4. **Tax Efficiency:** All trades crypto-to-crypto, no fiat realization

**Success Metrics:**
- 5-10% annual yield on gold holdings via LP fees + market winnings
- Reduced portfolio volatility (gold position hedged)
- No tax events triggered
- Maintained full gold exposure long-term

---

### Persona 2: **Marcus the Macro Trader**

**Demographics:**
- Age: 31
- Location: London
- Occupation: Former hedge fund analyst, now independent trader
- Net worth: $800K (80% crypto, 20% cash)

**Background:**
- Deep macro analysis background (rates, FX, commodities)
- Exited TradFi for crypto in 2024
- Wants hard asset exposure but doesn't want to leave crypto ecosystem
- Skeptical of stablecoins (regulatory risk, depeg events)

**Goals:**
- Monetize macro analysis edge
- Accumulate gold through trading, not buying
- Stay fully on-chain (no bank accounts, brokerage accounts)
- Generate uncorrelated alpha to crypto directional bets

**Pain Points:**
- Polymarket/Kalshi denominated in USDC (centralization risk)
- TradFi gold derivatives require fiat on-ramps, KYC
- No on-chain venue to express macro views in hard asset terms
- Prediction market volume too low for serious size

**How He Uses GRAIL Markets:**

1. **Macro Trades:** Heavily trades Fed policy, CPI, geopolitical markets based on research
2. **Gold Accumulation:** Winnings accumulate in GRAIL (hard asset, not depreciating fiat)
3. **Arbitrage:** Arbs GRAIL markets vs. CME gold futures, Polymarket, Kalshi
4. **Market Making:** Provides liquidity in markets where he has edge

**Success Metrics:**
- 30%+ annual return on capital (in GRAIL terms)
- Accumulate 20+ oz gold (2,000+ GRAIL) via trading profits
- Zero fiat touchpoints
- Diversified portfolio: crypto + gold

---

### Persona 3: **Priya the Diversified Holder**

**Demographics:**
- Age: 28
- Location: Mumbai
- Occupation: Product manager at Web3 company
- Net worth: $150K (50% Bitcoin, 30% gold, 20% stablecoins/cash)

**Background:**
- Early crypto adopter (2019)
- Added gold in 2024 as diversifier after reading "The Bitcoin Standard"
- Believes in multi-asset hard money portfolio
- Actively manages allocation based on macro conditions

**Goals:**
- Optimize gold/Bitcoin allocation dynamically
- Hedge correlation risk (both assets dumping together)
- Avoid selling either asset (tax + conviction)
- Understand how assets interact in different regimes

**Pain Points:**
- No tools to hedge correlation risk on-chain
- Rebalancing = tax events
- Can't express relative value views without selling one asset
- TradFi correlation products (dispersion swaps) inaccessible to retail

**How She Uses GRAIL Markets:**

1. **Correlation Hedging:** Trades gold/BTC correlation markets to hedge joint downside
2. **Relative Value:** Uses gold vs. S&P, gold vs. silver to fine-tune macro exposure
3. **Dynamic Allocation:** Market prices inform rebalancing decisions (implied probabilities)
4. **Learning:** Treats small bets as "paid education" on macro relationships

**Success Metrics:**
- Reduced portfolio drawdowns (correlation hedges work)
- Better informed allocation decisions
- Maintained conviction in both BTC + gold
- Generated 10-15% returns on hedging overlay

---

### Persona 4: **Ahmed the Inflation Refugee**

**Demographics:**
- Age: 35
- Location: Cairo, Egypt
- Occupation: Freelance software developer (paid in USDC)
- Net worth: $40K (60% GRAIL, 30% USDC, 10% local currency)

**Background:**
- Lives in high-inflation environment (15-20% annual)
- Gets paid in USDC, converts to GRAIL immediately
- Uses GRAIL as savings vehicle (more stable than EGP, more trusted than USDC)
- Struggles with purchasing power erosion in specific categories (food, energy)

**Goals:**
- Protect purchasing power in local context
- Hedge specific expense categories inflating faster than gold
- Participate in global markets from restricted jurisdiction
- Build savings in hard asset

**Pain Points:**
- Gold doesn't perfectly track local inflation (often lags food/energy)
- No access to TradFi derivatives (capital controls)
- Local currency too volatile to save in
- USDC feels risky (Circle could freeze, depeg, etc.)

**How He Uses GRAIL Markets:**

1. **Expense Basket Hedging:** Trades "food basket in GRAIL terms" to hedge purchasing power
2. **Energy Hedging:** Buys "oil price appreciation" markets when crude surges
3. **Macro Learning:** Uses markets to understand global macro forces (Fed, geopolitics)
4. **Savings Growth:** Small profitable trades grow GRAIL stack over time

**Success Metrics:**
- Maintained purchasing power (hedges offset category inflation)
- Grown GRAIL savings 5-10%/year via informed predictions
- Financial sovereignty (fully on-chain, no local banks)
- Educated on global macro (markets as learning tool)

---

## 5. Technical Architecture

### 5.1 System Overview

**Technology Stack:**
- **Blockchain:** Solana (mainnet-beta)
- **Collateral Asset:** GRAIL token (SPL token, Oro Finance)
- **Smart Contracts:** Rust-based Anchor programs
- **Oracles:** Pyth Network (price feeds), Switchboard (custom data)
- **Frontend:** Next.js + React, RainbowKit wallet integration
- **Backend:** Off-chain indexer (PostgreSQL), API layer (GraphQL)

**Architecture Diagram (High-Level):**

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                          │
│  (Web App: React + Next.js + Wallet Connect)                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Layer (GraphQL)                        │
│  - Market discovery  - Position management  - Analytics         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Off-Chain Indexer                            │
│  - Event indexing  - Market state cache  - Historical data      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Solana Blockchain                          │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  GRAIL Markets Program (Anchor/Rust)                   │    │
│  │  - Market creation  - Order matching  - Settlement     │    │
│  └────────────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  GRAIL Token Program (SPL Token)                       │    │
│  │  - Oro Finance infrastructure                          │    │
│  └────────────────────────────────────────────────────────┘    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Oracle Networks                            │
│  - Pyth (GRAIL/USD, BTC/USD, etc.)                             │
│  - Switchboard (CPI, custom data feeds)                         │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Core Smart Contracts

**MarketFactory Contract**
- Creates new prediction markets
- Defines market parameters: question, outcomes, resolution source, expiry
- Enforces minimum liquidity, fee structure
- Maintains market registry

**AMM Contract (Automated Market Maker)**
- Constant function market maker (CFMM) based on Uniswap V2 model
- Liquidity pools for each outcome (binary: Yes/No pools, scalar: continuous)
- Dynamic pricing based on liquidity depth
- LP token issuance for liquidity providers

**Position Token Contract**
- Mints position tokens (e.g., "YES-GOLD-3000-JUN30" tokens)
- ERC-1155 style (fungible positions per market)
- Redeemable for GRAIL at settlement
- Transferable (enables secondary markets)

**Settlement Contract**
- Consumes oracle data (Pyth/Switchboard)
- Resolves markets at expiry
- Distributes GRAIL to winning positions
- Handles disputed resolutions (governance escalation)

**Governance Contract**
- DAO-controlled dispute resolution
- Parameter updates (fees, oracle sources)
- Market verification (prevent manipulation)
- Treasury management (fee accumulation)

### 5.3 Collateral & Settlement Flow

**Market Creation:**
1. Market creator deposits minimum liquidity (e.g., 100 GRAIL)
2. AMM mints initial position tokens (50 YES, 50 NO for binary)
3. Market goes live, users can trade

**Trading:**
1. User deposits GRAIL into market
2. AMM calculates price based on current pool ratios
3. User receives position tokens (e.g., 10 GRAIL → 25 YES tokens at 40¢)
4. GRAIL locked in contract until settlement

**Settlement:**
1. Market reaches expiry date
2. Settlement contract queries oracle (Pyth/Switchboard)
3. Winning outcome determined (e.g., gold closed at $3,050, "YES" wins)
4. Winning position tokens redeemable 1:1 for GRAIL
5. Losing tokens become worthless

**Example:**
- Market: "GRAIL/USD > $3,000 by June 30"
- Alice deposits 10 GRAIL, buys YES at 60¢ → receives 16.67 YES tokens
- Bob deposits 10 GRAIL, buys NO at 40¢ → receives 25 NO tokens
- June 30: Oracle reports $3,050 → YES wins
- Alice redeems 16.67 YES tokens for 20 GRAIL (10 GRAIL profit)
- Bob's 25 NO tokens expire worthless (10 GRAIL loss)

### 5.4 Oracle Integration

**Pyth Network (Primary)**
- **Use Cases:** GRAIL/USD price, BTC/USD, gold futures, equities
- **Latency:** <1 second
- **Update Frequency:** Real-time (on-chain updates every 400ms)
- **Reliability:** High (80+ publishers, cross-validated)
- **Cost:** ~$0.01/update (protocol subsidizes for critical markets)

**Switchboard (Secondary/Custom)**
- **Use Cases:** CPI data, custom baskets, geopolitical event criteria
- **Latency:** ~30 seconds
- **Update Frequency:** On-demand (triggered by contract)
- **Reliability:** Medium (fewer validators, manual verification)
- **Cost:** ~$0.05/update

**Governance Override:**
- 5-day dispute window after oracle settlement
- DAO can override if oracle clearly wrong (e.g., flash crash, bug)
- Requires 67% vote + 7-day timelock
- Last resort only (preserves market integrity)

### 5.5 AMM Mechanism

**Constant Function Market Maker:**

For binary markets, use **logarithmic market scoring rule (LMSR)** for efficiency:

```
Cost(q) = b * ln(e^(q_yes/b) + e^(q_no/b))
```

Where:
- `b` = liquidity parameter (higher = flatter prices)
- `q_yes`, `q_no` = quantities of YES/NO shares
- `Cost(q)` = total GRAIL locked in market

**Price Calculation:**
```
P(yes) = e^(q_yes/b) / (e^(q_yes/b) + e^(q_no/b))
```

**Advantages:**
- Bounded loss for liquidity providers (max loss = b * ln(2))
- Always provides liquidity (no "empty book" problem)
- Self-adjusting spreads (tight when balanced, wide when skewed)

**For Scalar Markets:**

Use a continuous CFMM across price range:

```
x * y = k  (Uniswap V2 style)
```

Where `x` = GRAIL liquidity, `y` = position tokens for price range.

### 5.6 Security Considerations

**Smart Contract Audits:**
- Pre-launch: 2 independent audits (Kudelski, Trail of Bits)
- Bug bounty: $500K max payout via Immunefi
- Formal verification for settlement logic

**Oracle Manipulation:**
- Multi-source validation (Pyth aggregates 80+ publishers)
- Dispute period (5 days) allows community challenge
- Governance override for extreme cases
- Market-specific circuit breakers (halt if price diverges >10% from Pyth)

**Front-Running Protection:**
- Solana's parallel execution reduces MEV
- Order batching (group trades in 400ms windows)
- Optional slippage limits set by user

**Wallet Security:**
- No custodial components (fully self-custodied)
- Transaction simulation preview before signing
- Spend limits (e.g., max 10 GRAIL per tx without additional confirmation)

### 5.7 Scalability

**Solana Advantages:**
- 65,000 TPS theoretical capacity
- 400ms block times
- <$0.01 transaction costs
- Parallel execution (markets don't block each other)

**Anticipated Load (Year 1):**
- 1,000 active markets
- 50,000 users
- 1M transactions/month
- **Well within Solana capacity**

**If scaling needed:**
- State compression (reduce storage costs)
- Off-chain order books (only settlements on-chain)
- L2 aggregation (batch small trades)

---

## 6. MVP Scope & Timeline

### 6.1 MVP Definition

**Core Features (Must-Have):**

1. **Market Types:**
   - Binary gold price markets (2 markets: "GRAIL > $3,000" and "GRAIL < $2,500" by June 30)
   - 1 Fed policy market ("Rate cut in March FOMC")
   - 1 correlation market ("Gold/BTC 30-day correlation positive")

2. **User Flows:**
   - Wallet connection (Phantom, Solflare)
   - Deposit GRAIL into market
   - Buy position tokens (YES/NO)
   - View positions (portfolio page)
   - Redeem winnings at settlement

3. **AMM Functionality:**
   - LMSR market maker for binary markets
   - Liquidity provision (deposit GRAIL, receive LP tokens)
   - Fee collection (2% per trade → 1.5% to LPs, 0.5% to protocol)

4. **Oracle Integration:**
   - Pyth GRAIL/USD feed for price markets
   - Manual resolution for Fed market (governance)

5. **Settlement:**
   - Automatic settlement at expiry
   - 5-day dispute window
   - One-click redemption

**Deferred to V2:**
- Scalar markets (price ranges)
- Expense basket markets (complex data feeds)
- Mobile app
- Advanced charting/analytics
- Limit orders (V1 is market orders only)
- Market creation by users (V1 is admin-created only)

### 6.2 Development Phases

**Phase 1: Foundation (Weeks 1-4)**
- Smart contract architecture (Rust/Anchor)
- GRAIL token integration (test with Oro team)
- Basic AMM implementation (LMSR)
- Unit tests (90%+ coverage)

**Phase 2: Oracle & Settlement (Weeks 5-7)**
- Pyth integration (price feeds)
- Settlement contract logic
- Dispute resolution mechanism
- Oracle reliability tests

**Phase 3: Frontend (Weeks 8-11)**
- React app scaffold
- Wallet integration (Phantom, Solflare)
- Market discovery UI
- Trading interface (buy/sell positions)
- Portfolio page

**Phase 4: Testing (Weeks 12-13)**
- Devnet deployment
- Internal alpha (team + friends/family)
- Bug fixes
- Load testing

**Phase 5: Audit & Launch Prep (Weeks 14-16)**
- Smart contract audit (Kudelski)
- Mainnet deployment
- Liquidity seeding (partner with Oro)
- Launch marketing

**Phase 6: Mainnet Launch (Week 17)**
- Public launch (mainnet-beta)
- 4 initial markets go live
- Community onboarding
- 24/7 monitoring

### 6.3 Timeline

**Q2 2026 (Apr-Jun):**
- **April 1-30:** Development (Phases 1-2)
- **May 1-31:** Development (Phases 3-4)
- **June 1-15:** Audit & launch prep (Phase 5)
- **June 16:** Mainnet launch (Phase 6)

**Q3 2026 (Jul-Sep):**
- **July:** Post-launch monitoring, bug fixes, user feedback
- **August:** V1.1 features (more markets, UI improvements)
- **September:** Scalar markets (price ranges), 10+ new markets

**Q4 2026 (Oct-Dec):**
- **October:** Expense basket markets (Vitalik vision)
- **November:** User-created markets (permissionless)
- **December:** Mobile app (iOS/Android)

### 6.4 Success Metrics (MVP)

**By End of Q2 2026 (June 30):**
- **TVL (Total Value Locked):** 10,000 GRAIL ($2.9M at $2,900/oz)
- **Active Users:** 500 (at least 1 trade)
- **Markets Created:** 4 (admin-created)
- **Trades:** 2,000 total
- **Liquidity Providers:** 50
- **Settlement Accuracy:** 100% (all oracle-based settlements correct)

**By End of 2026 (Dec 31):**
- **TVL:** 100,000 GRAIL ($29M)
- **Active Users:** 5,000
- **Markets Created:** 50+ (mix of admin + user-created)
- **Trades:** 50,000 total
- **Liquidity Providers:** 200
- **Revenue:** $50K in protocol fees (in GRAIL)

---

## 7. Business Model

### 7.1 Revenue Streams

**1. Trading Fees**
- **Rate:** 2% per trade (of trade size)
- **Split:** 
  - 75% to liquidity providers (1.5% of trade)
  - 25% to protocol treasury (0.5% of trade)
- **Example:** Alice buys 10 GRAIL of YES tokens. Fee = 0.2 GRAIL. LPs get 0.15 GRAIL, protocol gets 0.05 GRAIL.

**Projected Revenue (Year 1):**
- Average trade size: 5 GRAIL
- Trades/month: 5,000 (conservative)
- Monthly revenue: 5 GRAIL × 5,000 × 0.5% = 125 GRAIL/month
- **Annual revenue: 1,500 GRAIL ($435K at $2,900/oz)**

**2. Market Creation Fees (V2)**
- **User-Created Markets:** 10 GRAIL fee to create market
- **Prevents spam, generates revenue**
- Projected: 50 markets/month × 10 GRAIL = 500 GRAIL/month ($1.45M/year)

**3. Premium Data Feeds (V3)**
- **Subscription:** 1 GRAIL/month for advanced analytics
- **Features:** Historical data, market probabilities, LP yield stats
- Projected: 200 subscribers × 1 GRAIL/month = 200 GRAIL/month ($580K/year)

**4. Governance Token (Future)**
- **Airdrop to early users:** Retain protocol upside
- **Revenue share:** Token holders vote on fee splits, earn GRAIL rewards
- **Not in MVP scope**

### 7.2 Cost Structure

**Development:**
- **Team:** 4 engineers × $150K/year = $600K/year
- **Audits:** $200K (one-time)
- **Hosting/Infra:** $20K/year (Solana RPC, AWS, etc.)
- **Oracles:** $50K/year (Pyth/Switchboard feeds)
- **Total Year 1:** $870K

**Marketing:**
- **Community:** $50K (Twitter ads, KOL partnerships)
- **Liquidity Mining:** $200K GRAIL incentives to LPs (Oro-funded)
- **Events:** $30K (conferences, hackathons)
- **Total Year 1:** $280K

**Total Year 1 Costs:** $1.15M

**Break-Even Analysis:**
- Revenue at 1,500 GRAIL/year = $435K
- **Break-even at ~4,000 GRAIL/year (8,000 trades/month at 5 GRAIL avg)**
- Achievable by Q4 2026 if user growth trajectory holds

### 7.3 Value to Oro Finance

**1. GRAIL Utility**
- Prediction markets create *native utility* for GRAIL beyond "store of value"
- Users need to hold GRAIL to participate → buy-side demand
- LP yields create incentive to hold GRAIL long-term

**2. Liquidity Flywheel**
- More GRAIL locked in markets → deeper liquidity
- Deeper liquidity → tighter spreads → more traders
- More traders → more fee revenue → higher LP yields → more GRAIL locked

**3. Brand Differentiation**
- "Gold you can use" vs. "gold you just hold" (Paxos, Tether Gold)
- DeFi integration = moat vs. competitors
- Appeals to younger, crypto-native demographic

**4. Data Insights**
- Market prices = crowd-sourced predictions on gold, macro, geopolitics
- Oro can use this data for marketing ("90% of our users expect gold to hit $3,200")
- Research reports based on market activity

**5. Partnership Opportunities**
- Co-marketing: "Oro + GRAIL Markets" joint campaigns
- Liquidity incentives: Oro provides GRAIL for LP rewards
- Cross-promotion: GRAIL Markets users → Oro vault customers

**Revenue Share Agreement (Proposed):**
- **Option 1 (Fee Split):** 20% of protocol fees to Oro (0.1% of trades)
- **Option 2 (Equity):** Oro takes 10% equity in GRAIL Markets entity
- **Option 3 (Token):** Oro receives 15% of future governance token supply

### 7.4 Pricing Strategy

**Trading Fees (2%):**
- **Rationale:** Competitive with Polymarket (2%), Kalshi (4-7%), traditional sportsbooks (5-10%)
- **Lower than TradFi:** Gold options on CME = ~$50/contract + spread = 3-5% effective fee
- **Higher than DeFi:** Uniswap = 0.3%, but prediction markets have oracle costs, resolution overhead

**LP Incentives:**
- **Base yield:** 1.5% of trade volume
- **Bonus rewards (Year 1):** Oro-funded GRAIL incentives (5-10% APY)
- **Projected LP APY:** 15-20% (competitive with DeFi lending)

**Dynamic Fees (V2):**
- Lower fees (1%) for high-volume traders (>100 GRAIL/month)
- Higher fees (3%) for markets with low liquidity (cover oracle costs)

---

## 8. Risks & Mitigations

### 8.1 Technical Risks

**Risk 1: Oracle Failure**
- **Scenario:** Pyth feed goes down during market settlement
- **Impact:** Markets can't resolve, user funds locked
- **Mitigation:**
  - Fallback oracle (Switchboard as backup)
  - Manual governance resolution (DAO vote)
  - Insurance fund (5% of protocol fees) to cover losses if oracle error

**Risk 2: Smart Contract Exploit**
- **Scenario:** Bug in settlement logic allows attacker to drain funds
- **Impact:** Loss of user deposits, protocol collapse
- **Mitigation:**
  - 2 independent audits (Kudelski, Trail of Bits)
  - $500K bug bounty (Immunefi)
  - Gradual rollout (start with $100K TVL cap, increase slowly)
  - Emergency pause mechanism (24-hour DAO vote to freeze contracts)

**Risk 3: Solana Network Downtime**
- **Scenario:** Solana experiences outage during market expiry
- **Impact:** Settlement delayed, user frustration
- **Mitigation:**
  - Auto-extend settlement window if network down
  - Clear communication (status page, Twitter updates)
  - Historical precedent: Solana uptime >99.9% in 2025

### 8.2 Market Risks

**Risk 4: Low Liquidity**
- **Scenario:** Insufficient LPs → wide spreads → users leave
- **Impact:** Poor UX, low trading volume, revenue miss
- **Mitigation:**
  - Liquidity mining (Oro-funded GRAIL incentives)
  - Protocol-owned liquidity (seed 10,000 GRAIL in launch markets)
  - Partnerships with market makers (institutional LPs)

**Risk 5: Market Manipulation**
- **Scenario:** Whale buys large YES position, manipulates oracle to win
- **Impact:** Loss of trust, regulatory scrutiny
- **Mitigation:**
  - Pyth uses 80+ data publishers (hard to manipulate)
  - Position limits (max 10% of market TVL per wallet)
  - Governance oversight (suspicious activity flagged)
  - 5-day dispute window (community can challenge)

**Risk 6: Regulatory Crackdown**
- **Scenario:** SEC classifies prediction markets as illegal gambling
- **Impact:** US users banned, revenue collapses
- **Mitigation:**
  - Emphasize "hedging tool" positioning (not gambling)
  - Legal analysis (retain Cooley LLP for crypto regulatory guidance)
  - Geographic diversification (EU, Asia, LATAM markets)
  - DAO structure (decentralize control, no single entity to sue)

### 8.3 Business Risks

**Risk 7: User Acquisition Fails**
- **Scenario:** Can't reach 500 users by Q2 end
- **Impact:** Low revenue, investor disappointment, shutdown
- **Mitigation:**
  - Pre-launch waitlist (build hype)
  - Influencer partnerships (crypto Twitter, gold bugs)
  - Referral program (5 GRAIL bonus per referral)
  - Content marketing (blog posts on "hedging gold", "Vitalik's thesis")

**Risk 8: Oro Partnership Breaks**
- **Scenario:** Oro Finance disputes terms, pulls GRAIL support
- **Impact:** Loss of liquidity, need to pivot to different collateral
- **Mitigation:**
  - Formal partnership agreement (signed before launch)
  - Multi-collateral support (add USDC, SOL markets as backup)
  - Independent treasury (don't rely solely on Oro funding)

**Risk 9: Competitor Copies Model**
- **Scenario:** Polymarket launches GRAIL markets, eats our lunch
- **Impact:** User attrition, commoditization
- **Mitigation:**
  - Speed to market (launch before competitors)
  - Superior UX (focus on hedging tools, not gambling)
  - Oro exclusivity (negotiate first-mover advantage)
  - Community moat (build loyal user base)

### 8.4 Operational Risks

**Risk 10: Team Attrition**
- **Scenario:** Lead engineer quits mid-development
- **Impact:** Delayed launch, technical debt
- **Mitigation:**
  - Competitive comp (equity + GRAIL tokens)
  - Clear documentation (code handoff plan)
  - Cross-training (2 engineers per critical component)
  - Retention bonuses (vest after mainnet launch)

**Risk 11: Oracle Data Quality**
- **Scenario:** CPI data from Switchboard is delayed or inaccurate
- **Impact:** Wrong settlement, user losses, reputational damage
- **Mitigation:**
  - Manual verification for non-price feeds
  - 5-day dispute window
  - Conservative market design (avoid exotic data sources in MVP)
  - Governance override for disputed settlements

**Risk 12: Black Swan Event**
- **Scenario:** Gold price crashes -50% in a week (unprecedented)
- **Impact:** Mass liquidations, user panic, system stress
- **Mitigation:**
  - Circuit breakers (halt markets if GRAIL moves >20% in 1 hour)
  - Emergency governance (DAO can extend settlement windows)
  - Communication plan (transparency = trust)
  - Insurance fund (cover losses from extreme volatility)

### 8.5 Mitigation Summary Table

| Risk | Severity | Likelihood | Mitigation | Residual Risk |
|------|----------|------------|------------|---------------|
| Oracle Failure | High | Low | Fallback oracle, insurance fund | Low |
| Smart Contract Exploit | Critical | Low | Audits, bug bounty, gradual rollout | Medium |
| Solana Downtime | Medium | Medium | Auto-extend, communication | Low |
| Low Liquidity | High | Medium | Liquidity mining, POL | Low |
| Market Manipulation | High | Low | Pyth validation, position limits | Low |
| Regulatory Crackdown | Critical | Medium | Legal counsel, DAO structure | High |
| User Acquisition Fails | High | Medium | Pre-launch marketing, referrals | Medium |
| Oro Partnership Breaks | High | Low | Formal agreement, multi-collateral | Low |
| Competitor Copies | Medium | High | Speed, UX, exclusivity | Medium |
| Team Attrition | Medium | Low | Comp, documentation | Low |
| Oracle Data Quality | Medium | Medium | Manual verification, disputes | Low |
| Black Swan Event | High | Low | Circuit breakers, insurance | Medium |

---

## 9. Appendix

### 9.1 Glossary

- **GRAIL:** Tokenized gold on Solana (Oro Finance). 1 GRAIL = 1/100,000 troy oz gold.
- **AMM:** Automated Market Maker. Algorithm that provides continuous liquidity.
- **LMSR:** Logarithmic Market Scoring Rule. Specific AMM mechanism for prediction markets.
- **Oracle:** External data source (Pyth, Switchboard) that feeds real-world info to smart contracts.
- **Settlement:** Process of resolving market outcome and distributing winnings.
- **Position Token:** Token representing a prediction (e.g., YES or NO in binary market).
- **LP (Liquidity Provider):** User who deposits GRAIL to enable trading, earns fees.
- **TVL (Total Value Locked):** Total GRAIL deposited in protocol.
- **Scalar Market:** Market with continuous outcome (e.g., "gold price in 30 days").
- **Binary Market:** Market with two outcomes (YES/NO).

### 9.2 Competitive Analysis

| Platform | Collateral | Blockchain | Markets | Fee | Strengths | Weaknesses |
|----------|------------|------------|---------|-----|-----------|------------|
| **Polymarket** | USDC | Polygon | Politics, sports, crypto | 2% | High volume, brand recognition | Gambling focus, stablecoin risk |
| **Kalshi** | USD (fiat) | N/A (TradFi) | Macro, weather, elections | 4-7% | Regulatory clarity (CFTC approved) | Fiat on-ramps, high fees |
| **Augur** | ETH/DAI | Ethereum | Decentralized, any topic | 1-2% | Permissionless, decentralized | Low volume, UX issues |
| **Drift Markets** | USDC | Solana | Perpetual futures (not pred markets) | 0.05% | Solana speed, low fees | Not prediction markets |
| **GRAIL Markets** | **GRAIL (gold)** | **Solana** | **Gold, macro, hedging** | **2%** | **Hard asset collateral, hedging focus** | **Unproven, early-stage** |

**Key Differentiators:**
1. **Only gold-denominated prediction markets** (everyone else = USDC or fiat)
2. **Hedging-first design** (not gambling)
3. **Solana speed + low cost** (vs. Ethereum gas fees)
4. **Expense basket markets** (Vitalik's vision, no one else doing this)

### 9.3 Research Sources

- Vitalik Buterin, "Prediction Markets as Hedging Tools" (Feb 14, 2026)
- Oro Finance whitepaper & documentation
- Pyth Network documentation
- World Gold Council historical data (2010-2026)
- Polymarket volume data (Dune Analytics)
- Kalshi regulatory filings (CFTC)
- Augur V2 technical docs
- "The Bitcoin Standard" (Saifedean Ammous) - gold/BTC analysis

### 9.4 Open Questions

1. **Oro Partnership Terms:** What revenue share does Oro expect? Need formal agreement.
2. **Regulatory Classification:** Is this a commodity market (CFTC) or security (SEC)? Legal analysis needed.
3. **Oracle Costs:** Can we negotiate lower Pyth fees for high-volume markets?
4. **Market Maker Partnerships:** Should we partner with institutional LPs (Jump, Wintermute)?
5. **Governance Token:** Do we issue one? When? What's the distribution?
6. **Mobile Strategy:** Native app or PWA? iOS vs. Android priority?
7. **Fiat Off-Ramps:** Should we integrate Coinbase/Kraken to let users cash out GRAIL winnings?

---

## 10. Next Steps

### Immediate (This Week):
1. **Oro Finance Meeting:** Present PRD, negotiate partnership terms
2. **Legal Consultation:** Retain Cooley LLP for regulatory analysis
3. **Hiring:** Post job listings for 2 Rust engineers + 1 frontend engineer
4. **Design Kickoff:** Wire frames for trading interface, portfolio page

### Short-Term (Next 4 Weeks):
1. **Smart Contract Development:** Begin Phase 1 (foundation)
2. **Brand/Marketing:** Logo, website, Twitter account
3. **Community Building:** Launch Discord, start pre-launch waitlist
4. **Pyth Integration:** Test price feeds on devnet

### Medium-Term (Next 12 Weeks):
1. **MVP Development:** Complete Phases 1-5 (see Section 6.2)
2. **Audit Prep:** Code freeze, documentation for Kudelski
3. **Launch Marketing:** Blog posts, podcast interviews, Twitter campaign
4. **Partnerships:** Onboard 2-3 institutional LPs

### Long-Term (6+ Months):
1. **Mainnet Launch:** June 16, 2026
2. **V1.1 Features:** Scalar markets, more market types
3. **User-Created Markets:** Permissionless market creation
4. **Mobile App:** iOS/Android launch
5. **Governance Token:** Airdrop to early users

---

**End of PRD**

*For questions or feedback, contact: [product@grailmarkets.io]*
