# BTC 15-Minute Arbitrage Bot

Zero-risk arbitrage trading on Polymarket's BTC 15-minute markets.

## Strategy

When **UP + DOWN ≤ $0.97**, buy both outcomes. One must win = guaranteed $1 payout = **3%+ profit**.

```
Example:
  UP:   $0.48  (buy 100 shares = $48)
  DOWN: $0.48  (buy 100 shares = $48)
  Total cost: $96

  One side wins → Payout: $100
  Profit: $4 (4.2%)
```

## Quick Start

### 1. Install Dependencies

```bash
cd /Users/ruby/.openclaw/workspace/projects/btc-15m-arbitrage
npm install @polymarket/clob-client ethers dotenv node-fetch
```

### 2. Get Your Private Key

**Email/Google login (Magic)?**
1. Go to https://reveal.magic.link/polymarket
2. Complete verification
3. Copy the private key

**MetaMask?**
1. MetaMask → Account Details → Export Private Key
2. Copy the private key

### 3. Find Your Funder Address

1. Go to https://polymarket.com
2. Click your profile
3. Copy your wallet address (starts with 0x)

### 4. Create .env File

```bash
cp .env.example .env
nano .env  # or your editor
```

Fill in:
```
POLYMARKET_PK=your_private_key_without_0x
POLYMARKET_FUNDER=0xYourWalletAddress
POLYMARKET_SIGNATURE_TYPE=1   # 1 for email, 0 for MetaMask
```

### 5. Run Diagnostics

```bash
node diagnose.js
```

This checks:
- ✅ Wallet connection
- ✅ Token balances
- ✅ Contract allowances
- ✅ API connectivity

### 6. Setup Allowances (If Needed)

If diagnostics show missing allowances:

```bash
node setup-allowances.js
```

This approves contracts to trade with your tokens (one-time, ~0.02 MATIC gas).

### 7. Run the Bot

**Paper trading (no real money):**
```bash
node bot.js --paper
```

**Live trading:**
```bash
node bot.js
```

## Files

| File | Description |
|------|-------------|
| `bot.js` | Main trading bot |
| `diagnose.js` | Setup diagnostic tool |
| `setup-allowances.js` | Token approval script |
| `SETUP.md` | Complete documentation |
| `.env.example` | Config template |

## Configuration

Edit `bot.js` CONFIG object:

```javascript
const CONFIG = {
  arbitrage: {
    maxSpread: 0.97,      // Trade when UP+DOWN ≤ this
    minProfit: 0.03,      // Minimum profit margin
    maxPositionUsd: 50,   // Max per trade
  },
  paperTrading: true,     // Set false for live
};
```

## Requirements

- Node.js 16+
- MATIC for gas (~0.1 MATIC recommended)
- USDC for trading (~$50+ recommended)
- Polymarket account with trading enabled

## How It Works

1. **Monitor** BTC 15-minute markets every 5 seconds
2. **Detect** when UP + DOWN prices sum to ≤ $0.97
3. **Buy** equal dollar amounts of both outcomes
4. **Wait** for market resolution (every 15 minutes)
5. **Collect** $1 per share from winning side
6. **Profit** = payout - cost (guaranteed 3%+)

## Safety

- **Paper trading by default** - won't trade real money unless explicitly enabled
- **Minimum profit threshold** - ignores marginal opportunities
- **Max position limits** - caps exposure per trade
- **BTC 15m only** - ignores all other markets

## Troubleshooting

### "Invalid signature"
- Check `POLYMARKET_SIGNATURE_TYPE` matches your login method
- Verify private key is correct and without 0x prefix

### "Insufficient allowance"
- Run `node setup-allowances.js`
- Need ~0.02 MATIC for gas

### "Market not found"
- BTC 15m markets rotate frequently
- Bot automatically fetches current market

### "Order rejected"
- Minimum order is 15 shares (~$1-2)
- Check USDC balance

## Resources

- [SETUP.md](./SETUP.md) - Complete technical documentation
- [Polymarket Docs](https://docs.polymarket.com)
- [CLOB Client GitHub](https://github.com/Polymarket/clob-client)
