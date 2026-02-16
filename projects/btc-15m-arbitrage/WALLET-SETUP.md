# Polymarket Wallet Setup Guide

## Overview

To trade programmatically on Polymarket, you need:
1. **Private Key** - For signing transactions
2. **Funder Address** - The address holding your funds
3. **Signature Type** - How Polymarket verifies your signatures

## Your Account

- **Account**: `0x0804284070BD28d4DE326909b648f00AC4C3F6F7` (@polarbbot)
- **Type**: This is your **proxy wallet** (where funds are held)

---

## Step 1: Export Your Private Key

### From Polymarket.com:

1. Go to [polymarket.com](https://polymarket.com)
2. Click on your profile / portfolio
3. Click on **Cash** or your balance
4. Click the **⋯ (three dots menu)**
5. Select **"Export Private Key"**
6. Complete any verification (2FA if enabled)
7. **Copy and save the private key securely**

⚠️ **IMPORTANT**: Never share this key. Anyone with it can drain your wallet.

---

## Step 2: Determine Your Signature Type

The signature type depends on how you signed up:

| How You Login | Signature Type | Funder |
|---------------|----------------|--------|
| **MetaMask/Rabby** connected | `0` (EOA) | Same as signing address |
| **Email/Google (Magic Link)** | `1` (Magic) | Your proxy wallet address |
| **Browser Extension via Polymarket.com** | `2` (Gnosis Safe) | Your proxy wallet address |

### For your account (@polarbbot):

**If you login with email/Google**:
```javascript
signature_type = 1   // Magic wallet
funder = "0x0804284070BD28d4DE326909b648f00AC4C3F6F7"  // Your proxy wallet
```

**If you login with MetaMask/Rabby**:
```javascript
signature_type = 2   // Gnosis Safe proxy
funder = "0x0804284070BD28d4DE326909b648f00AC4C3F6F7"  // Your proxy wallet
```

---

## Step 3: Configure the Bot

Once you have your private key, create a `.env` file:

```bash
# /Users/ruby/.openclaw/workspace/projects/btc-15m-arbitrage/.env

# Your exported private key (without 0x prefix)
POLYMARKET_PRIVATE_KEY=your_private_key_here

# Your proxy wallet (funder) - where funds are
POLYMARKET_FUNDER=0x0804284070BD28d4DE326909b648f00AC4C3F6F7

# Signature type (1 for Magic/email, 2 for browser extension wallet)
POLYMARKET_SIGNATURE_TYPE=1

# Chain ID (Polygon Mainnet)
CHAIN_ID=137
```

---

## Step 4: Test the Setup

Run the bot in paper trading mode first:

```bash
cd /Users/ruby/.openclaw/workspace/projects/btc-15m-arbitrage
node bot.js --paper
```

Then enable live trading:

```bash
node bot.js
```

---

## API Credential Generation

The bot will automatically derive API credentials from your private key using:

```javascript
const client = new ClobClient(
  "https://clob.polymarket.com",
  137,  // Polygon
  privateKey,
  signature_type,  // 0, 1, or 2
  funder  // Your proxy wallet address
);

// This derives L2 API credentials
const apiCreds = await client.deriveApiKey();
```

---

## Security Best Practices

1. **Never commit .env to git** - Add to `.gitignore`
2. **Use minimal funds** - Only keep what you need for trading
3. **Monitor transactions** - Watch your wallet on PolygonScan
4. **Revoke if compromised** - Generate new API keys immediately

---

## Quick Reference

| Field | Value |
|-------|-------|
| **CLOB API** | `https://clob.polymarket.com` |
| **Chain** | Polygon (137) |
| **Proxy Wallet** | `0x0804284070BD28d4DE326909b648f00AC4C3F6F7` |
| **USDC Contract** | `0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359` |

---

## Need Help?

- [Polymarket Docs](https://docs.polymarket.com/quickstart/first-order)
- [py-clob-client GitHub](https://github.com/Polymarket/py-clob-client)
- [CLOB TypeScript Client](https://github.com/Polymarket/clob-client)

