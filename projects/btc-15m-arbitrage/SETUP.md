# Polymarket Trading Setup Guide
## Complete Developer Documentation Analysis

---

## Architecture Overview

Polymarket uses a **Central Limit Order Book (CLOB)** on Polygon. Key components:

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Your Wallet    │────▶│  CLOB API        │────▶│  Exchange       │
│  (EOA/Proxy)    │     │  (REST/WS)       │     │  Contracts      │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                        │
        │   L1 Auth (sign)       │   L2 Auth (API keys)
        ▼                        ▼
   Blockchain Txns          Order Management
```

---

## Authentication Levels

### Level 0: Read-Only (No Auth)
```javascript
const client = new ClobClient("https://clob.polymarket.com");
// Can read markets, prices, orderbooks
```

### Level 1: L1 Authentication
- Requires **private key** signing
- Used to: derive API keys, place orders
- Signs EIP-712 typed data

### Level 2: L2 Authentication  
- Uses **API keys** derived from L1
- Passed in HTTP headers
- More efficient for repeated requests

---

## Wallet Types & Signature Types

| Login Method | Signature Type | Private Key Source |
|--------------|----------------|-------------------|
| **MetaMask/Rabby** (browser extension) | `0` | Export from wallet |
| **Email/Google** (Magic Link) | `1` | https://reveal.magic.link/polymarket |

### How It Works

**Email/Magic Login (`signature_type=1`)**:
- Polymarket creates a **proxy wallet** for you
- Your EOA (signing key) is different from proxy (funds holder)
- Private key export: https://reveal.magic.link/polymarket
- `funder` = your proxy wallet address

**Browser Wallet (`signature_type=0`)**:
- You connect MetaMask/Rabby directly
- Your EOA holds funds directly OR through a proxy
- Private key: export from MetaMask
- `funder` = usually same as signing address

---

## Contract Addresses (Polygon Mainnet - 137)

```javascript
const CONTRACTS = {
  // Main exchange (standard markets)
  exchange: "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E",
  
  // NegRisk exchange (multi-outcome markets)  
  negRiskExchange: "0xC5d563A36AE78145C45a50134d48A1215220f80a",
  negRiskAdapter: "0xd91E80cF2E7be2e162c6513ceD06f1dD0dA35296",
  
  // Tokens
  usdc: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",  // USDC.e (bridged)
  conditionalTokens: "0x4D97DCd97eC945f40cF65F87097ACe5EA0476045",
};
```

**Important**: BTC 15m markets are **NOT negRisk** markets. They use the standard exchange.

---

## Token Allowances

Before trading, you need to approve contracts to spend your tokens:

### For Standard Markets (including BTC 15m):
```javascript
// 1. USDC → Exchange
await usdc.approve(CONTRACTS.exchange, MAX_UINT256);

// 2. USDC → Conditional Tokens (for minting)
await usdc.approve(CONTRACTS.conditionalTokens, MAX_UINT256);

// 3. Conditional Tokens → Exchange (for selling)
await ctf.setApprovalForAll(CONTRACTS.exchange, true);
```

### For NegRisk Markets (political, multi-outcome):
```javascript
// Additional approvals for negRisk
await usdc.approve(CONTRACTS.negRiskExchange, MAX_UINT256);
await usdc.approve(CONTRACTS.negRiskAdapter, MAX_UINT256);
await ctf.setApprovalForAll(CONTRACTS.negRiskExchange, true);
await ctf.setApprovalForAll(CONTRACTS.negRiskAdapter, true);
```

---

## API Client Setup (JavaScript)

```javascript
const { ClobClient } = require("@polymarket/clob-client");
const { Wallet } = require("ethers");

const HOST = "https://clob.polymarket.com";
const CHAIN_ID = 137;

// Your credentials
const PRIVATE_KEY = process.env.POLYMARKET_PK;
const FUNDER = process.env.POLYMARKET_FUNDER;  // Proxy wallet if using Magic
const SIGNATURE_TYPE = 1;  // 1 for Magic/email, 0 for MetaMask

async function setupClient() {
  const wallet = new Wallet(PRIVATE_KEY);
  
  // Step 1: Create client with L1 auth
  let client = new ClobClient(HOST, CHAIN_ID, wallet);
  
  // Step 2: Derive API credentials (L2 auth)
  const creds = await client.createOrDeriveApiKey();
  
  // Step 3: Reinitialize with full auth
  client = new ClobClient(
    HOST,
    CHAIN_ID,
    wallet,
    creds,          // API credentials
    SIGNATURE_TYPE, // 0 or 1
    FUNDER          // Proxy wallet address
  );
  
  return client;
}
```

---

## Order Parameters

### Market Structure
```javascript
{
  condition_id: "0x...",           // Market identifier
  question_id: "0x...",            // Question identifier
  tokens: [
    { token_id: "123...", outcome: "Up", price: 0.52 },
    { token_id: "456...", outcome: "Down", price: 0.48 }
  ],
  minimum_order_size: 15,          // Min shares (usually 15)
  minimum_tick_size: 0.01,         // Price increment
  neg_risk: false                  // BTC 15m = false
}
```

### Placing a Limit Order
```javascript
const order = {
  tokenID: "123...",    // Specific outcome token
  price: 0.50,          // Price per share (0.01 to 0.99)
  side: "BUY",          // or "SELL"
  size: 20,             // Number of shares
};

const signedOrder = await client.createOrder(order);
const response = await client.postOrder(signedOrder, "GTC");
```

### Order Types
- `GTC`: Good Till Cancelled
- `FOK`: Fill Or Kill (full fill or nothing)
- `GTD`: Good Till Date

---

## BTC 15m Market Specifics

### Finding Current Market
```javascript
// Gamma API (market metadata)
const series = await fetch("https://gamma-api.polymarket.com/series/10192");

// Find active event
const activeEvent = series.events.find(e => 
  !e.closed && new Date(e.endDate) > new Date()
);

// Get market details
const event = await fetch(`https://gamma-api.polymarket.com/events/${activeEvent.id}`);
const market = event.markets[0];

// Extract token IDs
const tokenIds = JSON.parse(market.clobTokenIds);
const upTokenId = tokenIds[0];
const downTokenId = tokenIds[1];
```

### Market Properties
- **negRisk**: `false` (standard binary market)
- **Outcomes**: "Up" / "Down"
- **Resolution**: Every 15 minutes
- **Minimum order**: 15 shares
- **Tick size**: 0.01

---

## Complete Setup Checklist

### 1. Export Private Key

**If using Email/Google login:**
1. Go to https://reveal.magic.link/polymarket
2. Complete verification
3. Copy your private key

**If using MetaMask:**
1. Open MetaMask → Account Details → Export Private Key
2. Copy your private key

### 2. Find Your Funder Address

Go to https://polymarket.com → Click Profile → Copy your wallet address
This is your proxy wallet / funder address.

### 3. Create Environment File

```bash
# .env
POLYMARKET_PK=your_private_key_without_0x_prefix
POLYMARKET_FUNDER=0x0804284070BD28d4DE326909b648f00AC4C3F6F7
POLYMARKET_SIGNATURE_TYPE=1
CHAIN_ID=137
```

### 4. Set Allowances (One-Time)

Run the allowance setup script (creates on-chain approvals).

### 5. Derive API Credentials

The client automatically derives/creates API keys on first use.

---

## Common Issues

### "Invalid signature"
- Wrong `signature_type` for your wallet type
- Private key doesn't match the funder/proxy relationship

### "Insufficient allowance"
- Need to approve contracts before trading
- Run allowance script

### "Market not found"
- BTC 15m markets rotate every 15 minutes
- Fetch fresh market data before trading

### "Order too small"
- Minimum order size is typically 15 shares
- Minimum order value ~$1-2 depending on price

---

## Resources

- **CLOB Client (JS)**: https://github.com/Polymarket/clob-client
- **CLOB Client (Python)**: https://github.com/Polymarket/py-clob-client
- **Gamma API (Markets)**: https://gamma-api.polymarket.com
- **CLOB API**: https://clob.polymarket.com
- **Magic Key Export**: https://reveal.magic.link/polymarket

