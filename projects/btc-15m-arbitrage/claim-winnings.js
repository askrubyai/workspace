#!/usr/bin/env node

/**
 * AUTO-CLAIM WINNINGS
 * Uses Builder Relayer API to claim resolved positions
 */

require('dotenv').config();
const { ethers } = require('ethers');
const fetch = require('node-fetch');

const CHAIN_ID = 137;
const USDC_E = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // Polymarket uses USDC.e
const CTF = "0x4D97DCd97eC945f40cF65F87097ACe5EA0476045"; // Conditional Tokens contract
const FUNDER = process.env.POLYMARKET_FUNDER;
const PRIVATE_KEY = process.env.POLYMARKET_PK;

// Builder API credentials
const BUILDER_KEY = process.env.POLY_BUILDER_API_KEY;
const BUILDER_SECRET = process.env.POLY_BUILDER_SECRET;
const BUILDER_PASSPHRASE = process.env.POLY_BUILDER_PASSPHRASE;

async function getRelayClient() {
  const { RelayClient, RelayerTxType } = await import('@polymarket/builder-relayer-client');
  const { BuilderConfig } = await import('@polymarket/builder-signing-sdk');
  
  const provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com');
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);
  
  const builderConfig = new BuilderConfig({
    localBuilderCreds: {
      key: BUILDER_KEY,
      secret: BUILDER_SECRET,
      passphrase: BUILDER_PASSPHRASE,
    },
  });
  
  // Try PROXY first (for proxy wallets)
  return new RelayClient(
    'https://relayer-v2.polymarket.com/',
    CHAIN_ID,
    signer,
    builderConfig,
    RelayerTxType.PROXY
  );
}

/**
 * Get user's positions that can be claimed
 */
async function getClaimablePositions() {
  try {
    const url = `https://data-api.polymarket.com/positions?user=${FUNDER}`;
    const resp = await fetch(url);
    const positions = await resp.json();
    
    // Filter for resolved markets with winning positions
    const claimable = positions.filter(p => {
      return p.size > 0 && p.curPrice >= 0.99; // Winner tokens trade at ~$1
    });
    
    return claimable;
  } catch (err) {
    console.error('Error fetching positions:', err.message);
    return [];
  }
}

/**
 * Claim winnings for a specific condition
 */
async function claimWinnings(conditionId) {
  const relayClient = await getRelayClient();
  
  // Encode redeemPositions call
  const ctfInterface = new ethers.utils.Interface([
    "function redeemPositions(address collateralToken, bytes32 parentCollectionId, bytes32 conditionId, uint256[] indexSets)"
  ]);
  
  const data = ctfInterface.encodeFunctionData("redeemPositions", [
    USDC_E,
    ethers.constants.HashZero,
    conditionId,
    [1, 2] // Both outcome slots
  ]);
  
  const redeemTx = {
    to: CTF,
    data: data,
    value: "0",
  };
  
  try {
    console.log(`Claiming winnings for condition: ${conditionId.substring(0, 10)}...`);
    const response = await relayClient.execute([redeemTx], "Redeem winnings");
    const result = await response.wait();
    
    if (result?.transactionHash) {
      console.log(`✅ Claimed! Tx: ${result.transactionHash}`);
      return true;
    }
  } catch (err) {
    console.error(`❌ Claim failed: ${err.message}`);
  }
  return false;
}

/**
 * Get condition ID for a market
 */
async function getMarketConditionId(marketSlug) {
  try {
    const url = `https://gamma-api.polymarket.com/markets?slug=${marketSlug}`;
    const resp = await fetch(url);
    const markets = await resp.json();
    return markets[0]?.conditionId;
  } catch (err) {
    return null;
  }
}

/**
 * Main: Check and claim all winnings
 */
async function main() {
  console.log('=== AUTO-CLAIM WINNINGS ===');
  console.log(`Funder: ${FUNDER}`);
  console.log('');
  
  // Get current positions
  const positions = await getClaimablePositions();
  console.log(`Found ${positions.length} claimable position(s)`);
  
  if (positions.length === 0) {
    console.log('No winnings to claim.');
    return;
  }
  
  for (const pos of positions) {
    console.log(`\nPosition: ${pos.market || pos.asset}`);
    console.log(`  Size: ${pos.size} shares`);
    console.log(`  Value: $${(pos.size * pos.curPrice).toFixed(2)}`);
    
    if (pos.conditionId) {
      await claimWinnings(pos.conditionId);
    }
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { claimWinnings, getClaimablePositions, getRelayClient };
