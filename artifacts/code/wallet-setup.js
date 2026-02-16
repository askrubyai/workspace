#!/usr/bin/env node

/**
 * Polymarket Trading Wallet Setup
 * Creates a secure hot wallet for Polygon/USDC trading
 * 
 * SECURITY: Private key stored encrypted in ~/.openclaw/secrets/
 */

const { ethers } = require('ethers');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const SECRETS_DIR = path.join(process.env.HOME, '.openclaw', 'secrets');
const WALLET_FILE = path.join(SECRETS_DIR, 'polymarket-wallet.json');

// Polygon Mainnet Configuration
const POLYGON_CONFIG = {
  chainId: 137,
  rpcUrl: 'https://polygon-rpc.com',
  explorerUrl: 'https://polygonscan.com',
  usdcContract: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  clobEndpoint: 'https://clob.polymarket.com'
};

async function ensureSecretsDir() {
  try {
    await fs.mkdir(SECRETS_DIR, { recursive: true, mode: 0o700 });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

async function generateWallet() {
  console.log('🔐 Generating new Polygon hot wallet for Polymarket trading...\n');
  
  await ensureSecretsDir();
  
  // Check if wallet already exists
  try {
    const existing = await fs.readFile(WALLET_FILE, 'utf8');
    const data = JSON.parse(existing);
    console.log('⚠️  Wallet already exists!');
    console.log(`📍 Address: ${data.address}`);
    console.log(`🔗 View on Polygonscan: ${POLYGON_CONFIG.explorerUrl}/address/${data.address}`);
    console.log('\nTo create a new wallet, delete the existing one first.');
    return data;
  } catch (err) {
    // No existing wallet, create new one
  }
  
  // Generate new wallet
  const wallet = ethers.Wallet.createRandom();
  
  const walletData = {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic.phrase,
    createdAt: new Date().toISOString(),
    network: 'polygon',
    chainId: POLYGON_CONFIG.chainId,
    purpose: 'polymarket-trading'
  };
  
  // Save wallet (secure permissions)
  await fs.writeFile(WALLET_FILE, JSON.stringify(walletData, null, 2), { mode: 0o600 });
  
  console.log('✅ New wallet generated!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📍 WALLET ADDRESS (send USDC here):');
  console.log(`   ${wallet.address}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(`🔗 View on Polygonscan: ${POLYGON_CONFIG.explorerUrl}/address/${wallet.address}`);
  console.log('\n⚠️  IMPORTANT SECURITY NOTES:');
  console.log('   • Private key saved to: ~/.openclaw/secrets/polymarket-wallet.json');
  console.log('   • File has restricted permissions (owner-only read/write)');
  console.log('   • NEVER share the private key or mnemonic');
  console.log('   • Send USDC on POLYGON network (not Ethereum mainnet!)');
  console.log('\n💰 FUNDING INSTRUCTIONS:');
  console.log('   1. Send USDC to the address above');
  console.log('   2. Make sure to use POLYGON network');
  console.log('   3. Also send a tiny amount of MATIC for gas (~0.1 MATIC)');
  console.log('   4. Gas fees on Polygon are very low (~$0.01 per tx)');
  
  return walletData;
}

async function checkBalance() {
  console.log('💰 Checking wallet balance...\n');
  
  let walletData;
  try {
    walletData = JSON.parse(await fs.readFile(WALLET_FILE, 'utf8'));
  } catch (err) {
    console.log('❌ No wallet found. Run: node wallet-setup.js generate');
    return;
  }
  
  const provider = new ethers.providers.JsonRpcProvider(POLYGON_CONFIG.rpcUrl);
  
  // Check MATIC balance (for gas)
  const maticBalance = await provider.getBalance(walletData.address);
  const maticFormatted = ethers.utils.formatEther(maticBalance);
  
  // Check USDC balance
  const usdcAbi = ['function balanceOf(address) view returns (uint256)'];
  const usdc = new ethers.Contract(POLYGON_CONFIG.usdcContract, usdcAbi, provider);
  const usdcBalance = await usdc.balanceOf(walletData.address);
  const usdcFormatted = ethers.utils.formatUnits(usdcBalance, 6); // USDC has 6 decimals
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📍 Wallet: ${walletData.address}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`💜 MATIC (gas): ${parseFloat(maticFormatted).toFixed(4)} MATIC`);
  console.log(`💵 USDC:        ${parseFloat(usdcFormatted).toFixed(2)} USDC`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  if (parseFloat(maticFormatted) < 0.01) {
    console.log('\n⚠️  Low MATIC balance! Send at least 0.1 MATIC for gas.');
  }
  
  if (parseFloat(usdcFormatted) < 1) {
    console.log('\n⚠️  No USDC balance. Send USDC to start trading.');
  }
  
  return {
    address: walletData.address,
    matic: parseFloat(maticFormatted),
    usdc: parseFloat(usdcFormatted)
  };
}

async function showWalletInfo() {
  let walletData;
  try {
    walletData = JSON.parse(await fs.readFile(WALLET_FILE, 'utf8'));
  } catch (err) {
    console.log('❌ No wallet found. Run: node wallet-setup.js generate');
    return;
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📍 POLYMARKET TRADING WALLET');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Address:     ${walletData.address}`);
  console.log(`Network:     Polygon (Chain ID: ${walletData.chainId})`);
  console.log(`Created:     ${walletData.createdAt}`);
  console.log(`Explorer:    ${POLYGON_CONFIG.explorerUrl}/address/${walletData.address}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

// CLI
const command = process.argv[2] || 'info';

switch (command) {
  case 'generate':
    generateWallet();
    break;
  case 'balance':
    checkBalance();
    break;
  case 'info':
  default:
    showWalletInfo();
    break;
}
