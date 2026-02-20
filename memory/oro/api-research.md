# Oro Gold Protection Protocol — Raw Research Notes
*Compiled: 2026-02-19*

---

## 1. ORO Finance (oro.finance) — The Gold Protocol

### Overview
- **What**: Yield-generating tokenized gold protocol on Solana
- **Token**: $GOLD — each token = 1 troy ounce of LBMA/UAE GD-certified physical gold
- **Chain**: Solana
- **Raised**: $1.5M pre-seed led by 468 Capital
- **CEO**: Usman
- **App**: app.oro.finance
- **Twitter**: @orofinance (or similar)
- **Partners**: Monetary Metals (gold leasing), Meteora (DEX liquidity), Jupiter (swap)

### $GOLD Token
- 1 $GOLD = 1 troy ounce physical gold
- Backed by LBMA and UAE GD-certified gold in insured, audited vaults
- Minted with USDC (KYC required for direct mint)
- Can swap via Jupiter/Meteora without KYC
- Redeemable for physical gold or USDC
- Minting fee: 0.50% (trading hours), 1.00% (off-hours)
- Redemption fee: 0.50% (trading hours), 1.00% (off-hours)

### Staking & Yield
- Gold leased to licensed brokers → refiners, jewelers, bullion traders
- Yield: 3-4% APY paid monthly in $GOLD
- Mandatory 12-month lockup
- Lessees cannot sell, rehypothecate, or pledge leased gold
- All leased gold is insured

### GRAIL — Developer Infrastructure
- **Full name**: Gold Rails for the Internet
- **What**: Programmable infrastructure layer for developers and institutions
- **APIs for**: Gold accounts, yield, credit, physical redemption
- **Two integration models**:
  - **Custodial**: Partners manage user balances (neobanks, fintechs)
  - **Self-custody**: Users hold gold in own wallets (exchanges, DeFi)
- **Both models are KYC-gated and whitelist-only**
- **Use cases**: Savings/deposits, credit/BNPL, yield accounts, round-ups, group savings, rewards/loyalty
- **Features**: Sandbox environments, documentation, SLAs, audited smart contracts
- **Status**: Core gold functionality is live; expanding into additional metals, yield-bearing gold, gold-backed credit, rewards, physical delivery, multi-chain

### Wallets Supported
- Phantom, Backpack, Solflare, Ledger
- Social login (email, Google, GitHub)

### Oracle
- Uses Pyth for gold pricing (same Pyth oracle referenced in our pitch)

---

## 2. OROProtocol (oroprotocol.com) — DIFFERENT PROJECT

**Note**: This is a SEPARATE project from oro.finance. oroprotocol.com is a "Gold Arbitrage Protocol" that:
- Converts gold market volatility into programmatic $ORO buybacks
- Token: $ORO (not $GOLD)
- 1B total supply, fair launch via pump.fun
- Uses "Ostium Labs" execution engine for algorithmic gold trading
- Profits fund open-market $ORO buybacks (buy & burn)
- Also plans gold trading (ORO Markets) and physical redemption

**Our project builds on oro.finance ($GOLD), NOT oroprotocol.com ($ORO).**

---

## 3. Pyth Oracle — Gold Price Feed

### XAU/USD Feed ID
- **Feed ID (hex)**: `765d2ba906dbc32ca17cc11f5310a89e9ee1f6420508c63861f2f8ba4ee34bb2`
- **Symbol**: Metal.XAU/USD
- **Description**: GOLD / US DOLLAR
- **Asset Type**: Metal
- **Tenor**: Spot
- **Schedule**: America/New_York; active ~23h/day weekdays, closed Saturday, reduced Friday

### XAU/USD on Solana
- **NOT a push feed** on Solana (not in the sponsored push feed list)
- Must use **pull integration** (price update accounts) or run your own Price Pusher
- Alternatively, use price feed accounts with a self-run Price Pusher for continuous updates

### Pyth Solana Integration (Anchor)

**Rust SDK**: `pyth-solana-receiver-sdk` crate
- Compatible with Anchor ≥0.28.0, ≥0.29.0, ≥0.30.1, ≥0.31.1
- Add to Cargo.toml: `pyth-solana-receiver-sdk = "x.y.z"`

**On-chain usage**:
```rust
use pyth_solana_receiver_sdk::price_update::PriceUpdateV2;

#[derive(Accounts)]
pub struct Sample<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    pub price_update: Account<'info, PriceUpdateV2>,
}

pub fn sample(ctx: Context<Sample>) -> Result<()> {
    let price_update = &mut ctx.accounts.price_update;
    let maximum_age: u64 = 30;
    let feed_id: [u8; 32] = get_feed_id_from_hex("765d2ba906dbc32ca17cc11f5310a89e9ee1f6420508c63861f2f8ba4ee34bb2")?;
    let price = price_update.get_price_no_older_than(&Clock::get()?, maximum_age, &feed_id)?;
    msg!("Price: ({} ± {}) * 10^{}", price.price, price.conf, price.exponent);
    Ok(())
}
```

**TypeScript SDK**:
```bash
npm install --save @pythnetwork/hermes-client @pythnetwork/pyth-solana-receiver
```

**Two account types**:
1. **Price feed accounts**: Fixed address, continuously updated (need Price Pusher for non-push feeds)
2. **Price update accounts**: Ephemeral, anyone can create/close. Good for specific timestamps.

**Hermes API**: `https://hermes.pyth.network/v2/price_feeds?query=XAU&asset_type=metal`

---

## 4. Flash Trade — Perp Platform for Hedging

### Overview
- Decentralized asset-backed perpetuals and spot exchange on Solana
- Up to 100x leverage, low fees, minimal price impact
- Pool-to-peer liquidity model
- **Open source**: github.com/flash-trade/flash-perpetuals (Anchor-based reference implementation)
- **Docs**: docs.flash.trade
- Supports XAU perpetuals (gold perps)
- Uses Pyth oracle for pricing

### Integration Potential
- Open-source Anchor program for perpetuals
- Can be referenced for perp integration in our hedging backend
- Same Pyth oracle as Oro (XAU/USD feed)

---

## 5. Lighter.xyz — Alternative Perp Backend

- Zero trading fees
- Supports XAU perpetuals with deep liquidity
- Alternative/complementary to Flash Trade

---

## 6. Technical Stack for GoldFloor

### Architecture (from original pitch)
- **Backend**: Perpetual short positions to hedge gold exposure
- **Hedging platforms**: Flash Trade (Solana-native, Pyth oracle) and/or Lighter.xyz (zero fees)
- **Oracle**: Pyth XAU/USD feed
- **User flow**: Connect wallet → see $GOLD balance → slider for hedge % → one-click protection
- **Economics**: Oro staking yield (3-4% APY) covers perp funding costs → net positive yield even at 100% protection

### Build Phases (from pitch)
- Phase 1 (4 weeks): Smart contracts — perp integration, automated position management, Pyth oracle pricing, yield-to-funding routing
- Phase 2 (2 weeks): Frontend — slider UI, wallet connect, real-time cost display, portfolio dashboard

### Solana Anchor Framework
- Standard framework for Solana smart contracts in Rust
- Flash Trade's perpetuals are already built in Anchor → can reference their codebase
- `pyth-solana-receiver-sdk` is Anchor-compatible

### Vault/Protection Pattern References
- **Ribbon Finance**: Structured products / DOVs (DeFi Options Vaults) on Ethereum
  - Users deposit assets → vault sells options → premium = yield
  - Our pattern is similar but uses perps instead of options
- **Friktion**: Was Solana's version of Ribbon (shut down)
  - Voltage vaults, covered calls, cash-secured puts
  - Relevant architecture: vault PDAs, epoch-based rounds, automated settlement
- **Binary options pattern**: Not needed — our pitch uses perps, which are more precise and liquid

### Key Smart Contract Components Needed
1. **Vault Program**: Holds user deposits (staked $GOLD positions)
2. **Hedge Manager**: Opens/manages perp positions sized to user's hedge level
3. **Oracle Integration**: Reads Pyth XAU/USD for pricing
4. **Yield Router**: Routes Oro staking yield to cover funding costs
5. **Position Tracker**: Per-user hedge positions, PnL tracking

---

## 7. GRAIL Grant Context

### What We Know
- We were selected for the Oro GRAIL grant
- GRAIL is Oro's developer infrastructure arm
- They want third-party builders creating gold-backed financial products
- Our project: "GoldFloor" — downside protection for $GOLD holders
- Grant likely expects: working smart contracts, frontend, documentation

### What We Don't Know (needs clarification from Oro team)
- Specific grant milestones / deliverable format
- Grant amount / funding schedule
- Access to GRAIL sandbox/API keys
- Whether we integrate with GRAIL APIs or build standalone on Solana
- Reporting cadence expectations
- Timeline expectations (our pitch said 6 weeks)

---

## 8. Key Links

- **Oro Finance**: https://www.oro.finance
- **Oro App**: https://app.oro.finance
- **GRAIL Page**: https://www.oro.finance/grail
- **Oro GitHub**: https://github.com/Oro-Gold/oro-webapp
- **Flash Trade Docs**: https://docs.flash.trade
- **Flash Trade Perps (OSS)**: https://github.com/flash-trade/flash-perpetuals
- **Pyth XAU/USD**: https://www.pyth.network/price-feeds/metal-xau-usd
- **Pyth Hermes API**: https://hermes.pyth.network/docs
- **Pyth Solana Docs**: https://docs.pyth.network/price-feeds/core/use-real-time-data/pull-integration/solana
- **Colosseum Blog (GRAIL announcement)**: https://blog.colosseum.com/mithril-alpha-blueshift-svm-grail/
