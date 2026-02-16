#!/usr/bin/env node

/**
 * Polymarket Setup Diagnostic Tool
 * 
 * Tests your wallet configuration and identifies issues.
 * Run: node diagnose.js
 */

require('dotenv').config();
const { ethers } = require('ethers');

// Contract addresses (Polygon Mainnet)
const CONTRACTS = {
  exchange: "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E",
  negRiskExchange: "0xC5d563A36AE78145C45a50134d48A1215220f80a",
  negRiskAdapter: "0xd91E80cF2E7be2e162c6513ceD06f1dD0dA35296",
  usdc: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
  conditionalTokens: "0x4D97DCd97eC945f40cF65F87097ACe5EA0476045",
};

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

const ERC1155_ABI = [
  "function isApprovedForAll(address account, address operator) view returns (bool)",
];

const RPC_URL = "https://polygon-rpc.com";

async function diagnose() {
  console.log("🔍 POLYMARKET SETUP DIAGNOSTIC");
  console.log("=".repeat(50));
  console.log();

  // Step 1: Check environment variables
  console.log("📋 STEP 1: Environment Variables");
  console.log("-".repeat(40));
  
  const pk = process.env.POLYMARKET_PK || process.env.PK;
  const funder = process.env.POLYMARKET_FUNDER || process.env.FUNDER;
  const sigType = process.env.POLYMARKET_SIGNATURE_TYPE || '1';
  
  if (!pk) {
    console.log("❌ POLYMARKET_PK not set");
    console.log("   Set your private key in .env file");
    console.log("   Export from: https://reveal.magic.link/polymarket (email) or MetaMask");
    return;
  }
  console.log("✅ Private key found");
  
  if (!funder) {
    console.log("⚠️  POLYMARKET_FUNDER not set (will use signing address)");
  } else {
    console.log(`✅ Funder address: ${funder}`);
  }
  
  console.log(`ℹ️  Signature type: ${sigType} (${sigType === '1' ? 'Magic/Email' : 'EOA/MetaMask'})`);
  console.log();

  // Step 2: Derive wallet from private key
  console.log("🔑 STEP 2: Wallet Derivation");
  console.log("-".repeat(40));
  
  let wallet;
  try {
    // Handle with or without 0x prefix
    const cleanPk = pk.startsWith('0x') ? pk : `0x${pk}`;
    wallet = new ethers.Wallet(cleanPk);
    console.log(`✅ Wallet address (EOA): ${wallet.address}`);
  } catch (e) {
    console.log(`❌ Invalid private key: ${e.message}`);
    return;
  }

  const signingAddress = wallet.address;
  const funderAddress = funder || signingAddress;
  
  if (signingAddress.toLowerCase() !== funderAddress.toLowerCase()) {
    console.log(`ℹ️  Different signing/funder addresses (proxy wallet setup)`);
    console.log(`   Signing: ${signingAddress}`);
    console.log(`   Funder:  ${funderAddress}`);
  } else {
    console.log(`ℹ️  Same signing/funder address (direct wallet)`);
  }
  console.log();

  // Step 3: Connect to Polygon
  console.log("🌐 STEP 3: Polygon Connection");
  console.log("-".repeat(40));
  
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  wallet = wallet.connect(provider);
  
  try {
    const network = await provider.getNetwork();
    console.log(`✅ Connected to ${network.name} (chainId: ${network.chainId})`);
  } catch (e) {
    console.log(`❌ Failed to connect to Polygon: ${e.message}`);
    return;
  }
  console.log();

  // Step 4: Check balances
  console.log("💰 STEP 4: Balances");
  console.log("-".repeat(40));
  
  const usdc = new ethers.Contract(CONTRACTS.usdc, ERC20_ABI, provider);
  
  // Check signing address
  const signerMaticBalance = await provider.getBalance(signingAddress);
  const signerUsdcBalance = await usdc.balanceOf(signingAddress);
  
  console.log(`Signing Address (${signingAddress.slice(0,10)}...):`);
  console.log(`   MATIC: ${ethers.utils.formatEther(signerMaticBalance)}`);
  console.log(`   USDC:  ${ethers.utils.formatUnits(signerUsdcBalance, 6)}`);
  
  if (signingAddress.toLowerCase() !== funderAddress.toLowerCase()) {
    const funderMaticBalance = await provider.getBalance(funderAddress);
    const funderUsdcBalance = await usdc.balanceOf(funderAddress);
    
    console.log(`Funder Address (${funderAddress.slice(0,10)}...):`);
    console.log(`   MATIC: ${ethers.utils.formatEther(funderMaticBalance)}`);
    console.log(`   USDC:  ${ethers.utils.formatUnits(funderUsdcBalance, 6)}`);
  }
  
  // Check if enough MATIC for gas
  if (signerMaticBalance.lt(ethers.utils.parseEther("0.01"))) {
    console.log(`⚠️  Low MATIC balance on signing address (need ~0.01 for gas)`);
  }
  console.log();

  // Step 5: Check allowances
  console.log("🔓 STEP 5: Token Allowances");
  console.log("-".repeat(40));
  
  const ctf = new ethers.Contract(CONTRACTS.conditionalTokens, ERC1155_ABI, provider);
  
  // Check for the address that holds funds (funder)
  const checkAddress = funderAddress;
  
  console.log(`Checking allowances for: ${checkAddress.slice(0,10)}...`);
  console.log();
  
  // USDC allowances
  const usdcExchangeAllowance = await usdc.allowance(checkAddress, CONTRACTS.exchange);
  const usdcCtfAllowance = await usdc.allowance(checkAddress, CONTRACTS.conditionalTokens);
  const usdcNegRiskExAllowance = await usdc.allowance(checkAddress, CONTRACTS.negRiskExchange);
  const usdcNegRiskAdapterAllowance = await usdc.allowance(checkAddress, CONTRACTS.negRiskAdapter);
  
  console.log("USDC Allowances:");
  console.log(`   → Exchange:        ${usdcExchangeAllowance.gt(0) ? '✅' : '❌'} ${formatAllowance(usdcExchangeAllowance)}`);
  console.log(`   → CTF:             ${usdcCtfAllowance.gt(0) ? '✅' : '❌'} ${formatAllowance(usdcCtfAllowance)}`);
  console.log(`   → NegRisk Ex:      ${usdcNegRiskExAllowance.gt(0) ? '✅' : '❌'} ${formatAllowance(usdcNegRiskExAllowance)}`);
  console.log(`   → NegRisk Adapter: ${usdcNegRiskAdapterAllowance.gt(0) ? '✅' : '❌'} ${formatAllowance(usdcNegRiskAdapterAllowance)}`);
  console.log();
  
  // CTF (ERC1155) approvals
  const ctfExchangeApproval = await ctf.isApprovedForAll(checkAddress, CONTRACTS.exchange);
  const ctfNegRiskExApproval = await ctf.isApprovedForAll(checkAddress, CONTRACTS.negRiskExchange);
  const ctfNegRiskAdapterApproval = await ctf.isApprovedForAll(checkAddress, CONTRACTS.negRiskAdapter);
  
  console.log("Conditional Tokens (CTF) Approvals:");
  console.log(`   → Exchange:        ${ctfExchangeApproval ? '✅' : '❌'}`);
  console.log(`   → NegRisk Ex:      ${ctfNegRiskExApproval ? '✅' : '❌'}`);
  console.log(`   → NegRisk Adapter: ${ctfNegRiskAdapterApproval ? '✅' : '❌'}`);
  console.log();

  // Step 6: Test CLOB API connection
  console.log("🔌 STEP 6: CLOB API Connection");
  console.log("-".repeat(40));
  
  try {
    const fetch = (await import('node-fetch')).default;
    const resp = await fetch("https://clob.polymarket.com/");
    const data = await resp.json();
    console.log(`✅ CLOB API is reachable`);
    console.log(`   Response: ${JSON.stringify(data)}`);
  } catch (e) {
    console.log(`❌ Cannot reach CLOB API: ${e.message}`);
  }
  console.log();

  // Summary
  console.log("📊 SUMMARY");
  console.log("=".repeat(50));
  
  const issues = [];
  
  // Check critical requirements for BTC 15m trading (non-negRisk)
  if (!usdcExchangeAllowance.gt(0)) {
    issues.push("USDC not approved for Exchange contract");
  }
  if (!ctfExchangeApproval) {
    issues.push("CTF not approved for Exchange contract");
  }
  if (signerMaticBalance.lt(ethers.utils.parseEther("0.001"))) {
    issues.push("Need MATIC for gas fees");
  }
  
  const totalUsdc = signingAddress.toLowerCase() === funderAddress.toLowerCase() 
    ? signerUsdcBalance 
    : await usdc.balanceOf(funderAddress);
  
  if (totalUsdc.lt(ethers.utils.parseUnits("5", 6))) {
    issues.push("Low USDC balance (need at least $5-10 to trade)");
  }
  
  if (issues.length === 0) {
    console.log("✅ All checks passed! Ready to trade.");
  } else {
    console.log("❌ Issues found:");
    issues.forEach((issue, i) => console.log(`   ${i+1}. ${issue}`));
    console.log();
    console.log("💡 To fix allowances, run: node setup-allowances.js");
  }
}

function formatAllowance(bn) {
  if (bn.eq(0)) return "0";
  if (bn.gt(ethers.utils.parseUnits("1000000000", 6))) return "UNLIMITED";
  return ethers.utils.formatUnits(bn, 6) + " USDC";
}

diagnose().catch(console.error);
