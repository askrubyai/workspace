# Oro Gold Protection Protocol — Knowledge Base
*The "I read everything so you don't have to" document*  
*Last updated: 2026-02-19*

---

## TL;DR

We're building **GoldFloor** — a downside protection product for Oro Finance's $GOLD token holders. Users slide to their desired protection level (25-100%), and we hedge their gold exposure using perpetual short positions on Flash Trade or Lighter.xyz. The magic: Oro's 3-4% staking yield covers the entire hedging cost, so users get protection AND positive net yield.

---

## The Players

### Oro Finance (oro.finance)
Tokenized gold protocol on Solana. Each $GOLD = 1 troy oz physical gold (LBMA/UAE certified). Users can mint with USDC, trade on Jupiter/Meteora, stake for 3-4% APY, and redeem for physical gold. $1.5M pre-seed from 468 Capital. **GRAIL** is their developer infrastructure arm — APIs for building gold-powered financial products. We got the GRAIL grant.

### Pyth Network
Oracle providing XAU/USD price feed on Solana. Feed ID: `765d2ba906dbc32ca17cc11f5310a89e9ee1f6420508c63861f2f8ba4ee34bb2`. Not a push feed — we need pull integration or self-hosted Price Pusher. Rust SDK: `pyth-solana-receiver-sdk`, compatible with Anchor ≥0.28.

### Flash Trade
Open-source Solana perpetuals exchange (Anchor-based). Supports XAU perps with Pyth oracle. Pool-to-peer model, up to 100x leverage. GitHub: `flash-trade/flash-perpetuals`. This is our primary hedging backend.

### Lighter.xyz
Alternative perp venue with zero trading fees and XAU support. Backup/complement to Flash Trade.

---

## How GoldFloor Works

```
User has $GOLD staked on Oro (earning 3-4% APY)
       ↓
Opens GoldFloor → slides to 50% protection
       ↓
Backend opens XAU short perp = 50% of their gold exposure
       ↓
If gold drops: perp profits offset gold loss ✅
If gold rises: small funding cost, covered by staking yield ✅
       ↓
Net result: protected gold + positive yield
```

### The Math
| Protection | Annual Cost | Oro Yield | Net APY |
|-----------|------------|-----------|---------|
| 25% | ~0.5% | 3-4% | ~2.5-3.5% |
| 50% | ~1.0% | 3-4% | ~2.0-3.0% |
| 100% | ~2.0% | 3-4% | ~1.0-2.0% |

---

## Smart Contract Architecture

### Programs Needed
1. **Vault Program** — User deposit tracking, PDA accounts per user
2. **Hedge Manager** — Position sizing, perp interaction (CPI to Flash Trade)
3. **Oracle Reader** — Pyth XAU/USD consumption
4. **Yield Router** — Net staking yield against funding costs
5. **Position Tracker** — Per-user hedge state, PnL, liquidation monitoring

### Key Accounts (PDAs)
- `[user_pubkey, "goldfloor", "position"]` → User's hedge position state
- `[program_id, "goldfloor", "vault"]` → Protocol vault authority
- `[program_id, "goldfloor", "config"]` → Protocol configuration

### Instructions
- `initialize_position` — Create user position account
- `set_hedge_level` — Adjust protection percentage (triggers perp resize)
- `close_position` — Exit hedge, close perp
- `settle` — Periodic yield/cost netting
- `crank` — Keeper instruction for position maintenance

---

## Key Technical Decisions

1. **Perps over options**: Options don't exist on-chain for gold. Perps are precise (exact %), continuous (no expiry), liquid, and cheap.
2. **Pull oracle over push**: XAU/USD isn't a Pyth push feed on Solana. We'll use pull integration with Price Pusher for reliability.
3. **Flash Trade first**: Same Pyth oracle, open-source Anchor code, Solana-native. Lighter.xyz as fallback.
4. **CPI vs Keeper**: Need to evaluate — CPI to Flash Trade within our program vs off-chain keeper managing positions. CPI preferred for atomicity.

---

## GRAIL Grant Context

GRAIL is Oro's B2B infrastructure play — APIs for fintechs to embed gold. Our project extends this by adding a protection layer. The grant likely expects:
- Working smart contracts on devnet
- User-facing frontend
- Documentation
- 6-week timeline per our pitch

**Unknowns** (need from Oro team):
- Grant amount & payment schedule
- Specific milestone format
- GRAIL sandbox access
- Reporting expectations
- Whether to use GRAIL APIs or build standalone

---

## Important Distinction

**oro.finance** ($GOLD, tokenized physical gold, GRAIL infrastructure) ≠ **oroprotocol.com** ($ORO, gold arbitrage/trading protocol, Ostium Labs). We're building on **oro.finance**.

---

## Links
| Resource | URL |
|----------|-----|
| Oro Finance | https://www.oro.finance |
| Oro App | https://app.oro.finance |
| GRAIL | https://www.oro.finance/grail |
| Flash Trade Perps (OSS) | https://github.com/flash-trade/flash-perpetuals |
| Pyth XAU/USD | https://www.pyth.network/price-feeds/metal-xau-usd |
| Pyth Solana Docs | https://docs.pyth.network/price-feeds/core/use-real-time-data/pull-integration/solana |
| Pyth Hermes API | https://hermes.pyth.network/docs |
