#!/usr/bin/env node

/**
 * Polymarket Token Allowance Setup
 * 
 * Approves USDC and Conditional Tokens for trading.
 * Run: node setup-allowances.js
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
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
];

const ERC1155_ABI = [
  "function setApprovalForAll(address operator, bool approved)",
  "function isApprovedForAll(address account, address operator) view returns (bool)",
];

const MAX_UINT256 = ethers.constants.MaxUint256;
const RPC_URL = process.env.POLYGON_RPC || "https://polygon-rpc.com";

async function setupAllowances() {
  console.log("🔧 POLYMARKET ALLOWANCE SETUP");
  console.log("=".repeat(50));
  console.log();

  // Get credentials
  const pk = process.env.POLYMARKET_PK || process.env.PK;
  if (!pk) {
    console.log("❌ POLYMARKET_PK not set in .env");
    process.exit(1);
  }

  // Setup wallet
  const cleanPk = pk.startsWith('0x') ? pk : `0x${pk}`;
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(cleanPk, provider);
  
  console.log(`📍 Wallet: ${wallet.address}`);
  
  // Check MATIC balance for gas
  const maticBalance = await provider.getBalance(wallet.address);
  console.log(`⛽ MATIC balance: ${ethers.utils.formatEther(maticBalance)}`);
  
  if (maticBalance.lt(ethers.utils.parseEther("0.05"))) {
    console.log("⚠️  Low MATIC! Need ~0.05 MATIC for all approvals.");
    console.log("   Get MATIC from a faucet or bridge from another chain.");
  }
  console.log();

  // Setup contracts
  const usdc = new ethers.Contract(CONTRACTS.usdc, ERC20_ABI, wallet);
  const ctf = new ethers.Contract(CONTRACTS.conditionalTokens, ERC1155_ABI, wallet);

  const GAS_PRICE = ethers.utils.parseUnits("50", "gwei"); // 50 gwei
  const GAS_LIMIT = 100000;

  const approvals = [
    // USDC approvals
    { name: "USDC → Exchange", contract: usdc, method: "approve", args: [CONTRACTS.exchange, MAX_UINT256] },
    { name: "USDC → CTF", contract: usdc, method: "approve", args: [CONTRACTS.conditionalTokens, MAX_UINT256] },
    { name: "USDC → NegRisk Exchange", contract: usdc, method: "approve", args: [CONTRACTS.negRiskExchange, MAX_UINT256] },
    { name: "USDC → NegRisk Adapter", contract: usdc, method: "approve", args: [CONTRACTS.negRiskAdapter, MAX_UINT256] },
    // CTF approvals
    { name: "CTF → Exchange", contract: ctf, method: "setApprovalForAll", args: [CONTRACTS.exchange, true] },
    { name: "CTF → NegRisk Exchange", contract: ctf, method: "setApprovalForAll", args: [CONTRACTS.negRiskExchange, true] },
    { name: "CTF → NegRisk Adapter", contract: ctf, method: "setApprovalForAll", args: [CONTRACTS.negRiskAdapter, true] },
  ];

  console.log("📋 Setting up approvals...");
  console.log();

  for (const approval of approvals) {
    process.stdout.write(`   ${approval.name}... `);
    
    try {
      // Check if already approved
      let isApproved = false;
      if (approval.method === "approve") {
        const allowance = await usdc.allowance(wallet.address, approval.args[0]);
        isApproved = allowance.gt(ethers.utils.parseUnits("1000000", 6));
      } else {
        isApproved = await ctf.isApprovedForAll(wallet.address, approval.args[0]);
      }
      
      if (isApproved) {
        console.log("✅ Already approved");
        continue;
      }

      // Send approval transaction
      const tx = await approval.contract[approval.method](...approval.args, {
        gasPrice: GAS_PRICE,
        gasLimit: GAS_LIMIT,
      });
      
      console.log(`⏳ tx: ${tx.hash.slice(0,20)}...`);
      await tx.wait();
      console.log(`   └─ ✅ Confirmed`);
      
    } catch (e) {
      console.log(`❌ Failed: ${e.message}`);
    }
  }

  console.log();
  console.log("✅ Allowance setup complete!");
  console.log();
  console.log("💡 Next: Run 'node diagnose.js' to verify everything is ready.");
}

// Confirm before running
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("⚠️  This will send blockchain transactions to approve token spending.");
console.log("   Cost: ~0.01-0.05 MATIC in gas fees");
console.log();

rl.question("Continue? (y/n) ", async (answer) => {
  rl.close();
  if (answer.toLowerCase() === 'y') {
    await setupAllowances();
  } else {
    console.log("Cancelled.");
  }
});
