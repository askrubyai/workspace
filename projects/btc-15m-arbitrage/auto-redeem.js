#!/usr/bin/env node

/**
 * AUTO-REDEEM MODULE — Robust Polymarket position redemption
 * 
 * Handles:
 * 1. Fetching all redeemable positions from data API
 * 2. Redeeming through Gnosis Safe (proxy wallet) via execTransaction
 * 3. Builder Relayer as primary method (gasless, handles proxy routing)
 * 4. Direct Safe execution as fallback (requires MATIC for gas)
 * 5. Periodic sweep with retry logic
 * 
 * CRITICAL: Polymarket uses a Gnosis Safe as the proxy/funder wallet.
 * The EOA signer does NOT hold tokens. All redemption must route through the Safe.
 */

require('dotenv').config();
const { ethers } = require('ethers');
const fetch = require('node-fetch');
const fs = require('fs');

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const CTF_ADDRESS = '0x4D97DCd97eC945f40cF65F87097ACe5EA0476045';
const USDC_E = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'; // USDC.e — Polymarket CTF collateral
const NEG_RISK_ADAPTER = '0xd91E80cF2E7be2e162c6513ceD06f1dD0dA35296'; // NegRisk adapter (some markets)

const FUNDER = process.env.POLYMARKET_FUNDER;
const PRIVATE_KEY = process.env.POLYMARKET_PK;
const BUILDER_KEY = process.env.POLY_BUILDER_API_KEY;
const BUILDER_SECRET = process.env.POLY_BUILDER_SECRET;
const BUILDER_PASSPHRASE = process.env.POLY_BUILDER_PASSPHRASE;

const DATA_API = 'https://data-api.polymarket.com';
const RPC_URL = 'https://polygon-bor-rpc.publicnode.com';

const LOG_FILE = '/Users/ruby/.openclaw/workspace/projects/btc-15m-arbitrage/auto-redeem.log';

// ABIs
const CTF_ABI = [
  'function redeemPositions(address collateralToken, bytes32 parentCollectionId, bytes32 conditionId, uint256[] indexSets)',
  'function balanceOf(address owner, uint256 id) external view returns (uint256)',
  'function payoutDenominator(bytes32 conditionId) view returns (uint256)',
];

const SAFE_ABI = [
  'function nonce() view returns (uint256)',
  'function execTransaction(address to, uint256 value, bytes data, uint8 operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, bytes signatures) payable returns (bool)',
];

const NEG_RISK_ABI = [
  'function redeemPositions(bytes32 conditionId, uint256[] indexSets)',
];

// ═══════════════════════════════════════════════════════════════════════════════
// LOGGING
// ═══════════════════════════════════════════════════════════════════════════════

function log(msg, type = 'info') {
  const time = new Date().toISOString().substr(11, 12);
  const icons = {
    info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌', claim: '🏦', sweep: '🔍',
  };
  const line = `[${time}] ${icons[type] || '•'} [REDEEM] ${msg}`;
  console.log(line);
  try { fs.appendFileSync(LOG_FILE, line + '\n'); } catch (e) {}
}

// ═══════════════════════════════════════════════════════════════════════════════
// FETCH REDEEMABLE POSITIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get ALL positions that are redeemable (resolved markets).
 * Includes both winning (payout > 0) and losing (payout = 0) positions.
 */
async function getRedeemablePositions() {
  try {
    const resp = await fetch(`${DATA_API}/positions?user=${FUNDER}`);
    if (!resp.ok) {
      log(`Data API error: ${resp.status} ${resp.statusText}`, 'error');
      return [];
    }
    
    const positions = await resp.json();
    if (!Array.isArray(positions)) return [];
    
    // Filter for redeemable positions (resolved markets with tokens to claim)
    const redeemable = positions.filter(p => {
      return p.redeemable === true && parseFloat(p.size || 0) > 0;
    });
    
    return redeemable;
  } catch (e) {
    log(`Failed to fetch positions: ${e.message}`, 'error');
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// METHOD 1: BUILDER RELAYER (Gasless, handles proxy routing)
// ═══════════════════════════════════════════════════════════════════════════════

let _relayClient = null;

async function getRelayClient() {
  if (_relayClient) return _relayClient;
  
  try {
    const { RelayClient, RelayerTxType } = await import('@polymarket/builder-relayer-client');
    const { BuilderConfig } = await import('@polymarket/builder-signing-sdk');
    
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    
    const builderConfig = new BuilderConfig({
      localBuilderCreds: {
        key: BUILDER_KEY,
        secret: BUILDER_SECRET,
        passphrase: BUILDER_PASSPHRASE,
      },
    });
    
    _relayClient = new RelayClient(
      'https://relayer-v2.polymarket.com/',
      137,
      signer,
      builderConfig,
      RelayerTxType.PROXY,
    );
    
    return _relayClient;
  } catch (e) {
    log(`Builder relayer init error: ${e.message}`, 'error');
    return null;
  }
}

async function redeemViaRelayer(conditionId, negativeRisk = false) {
  const relayClient = await getRelayClient();
  if (!relayClient) return { success: false, error: 'Relayer not available' };
  
  try {
    let redeemTx;
    
    if (negativeRisk) {
      // NegRisk markets use a different adapter
      const iface = new ethers.utils.Interface(NEG_RISK_ABI);
      const data = iface.encodeFunctionData('redeemPositions', [
        conditionId,
        [1, 2],
      ]);
      redeemTx = { to: NEG_RISK_ADAPTER, data, value: '0' };
    } else {
      // Standard CTF redemption
      const iface = new ethers.utils.Interface(CTF_ABI);
      const data = iface.encodeFunctionData('redeemPositions', [
        USDC_E,                        // collateralToken (USDC.e, NOT native USDC)
        ethers.constants.HashZero,     // parentCollectionId
        conditionId,                   // conditionId
        [1, 2],                        // indexSets — both outcomes
      ]);
      redeemTx = { to: CTF_ADDRESS, data, value: '0' };
    }
    
    log(`Submitting redeem via Builder Relayer: ${conditionId.substring(0, 18)}...`, 'claim');
    
    const response = await relayClient.execute([redeemTx], 'Redeem positions');
    
    if (response && response.transactionHash) {
      log(`✅ Relayer tx submitted: ${response.transactionHash}`, 'success');
      return { success: true, txHash: response.transactionHash, method: 'relayer' };
    }
    
    // Some relayer versions return a promise that resolves to receipt
    if (response && typeof response.wait === 'function') {
      const receipt = await response.wait();
      if (receipt?.transactionHash) {
        log(`✅ Relayer tx confirmed: ${receipt.transactionHash}`, 'success');
        return { success: true, txHash: receipt.transactionHash, method: 'relayer' };
      }
    }
    
    log(`Relayer returned unexpected response: ${JSON.stringify(response).substring(0, 200)}`, 'warning');
    return { success: false, error: 'Unexpected relayer response' };
    
  } catch (e) {
    const msg = e.message || String(e);
    if (msg.includes('already redeemed') || msg.includes('nothing to redeem')) {
      log(`Already redeemed: ${conditionId.substring(0, 18)}`, 'info');
      return { success: true, method: 'already_redeemed' };
    }
    log(`Relayer error: ${msg.substring(0, 200)}`, 'error');
    return { success: false, error: msg.substring(0, 200) };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// METHOD 2: DIRECT SAFE EXECUTION (Fallback — requires MATIC for gas)
// ═══════════════════════════════════════════════════════════════════════════════

async function redeemViaSafe(conditionId, negativeRisk = false) {
  try {
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    
    // Check MATIC balance for gas
    const balance = await provider.getBalance(signer.address);
    const maticBalance = parseFloat(ethers.utils.formatEther(balance));
    
    if (maticBalance < 0.01) {
      log(`Insufficient MATIC for gas: ${maticBalance.toFixed(4)} MATIC`, 'warning');
      return { success: false, error: 'Insufficient MATIC' };
    }
    
    const safe = new ethers.Contract(FUNDER, SAFE_ABI, signer);
    const nonce = await safe.nonce();
    
    // Build calldata
    let to, data;
    if (negativeRisk) {
      const iface = new ethers.utils.Interface(NEG_RISK_ABI);
      data = iface.encodeFunctionData('redeemPositions', [conditionId, [1, 2]]);
      to = NEG_RISK_ADAPTER;
    } else {
      const iface = new ethers.utils.Interface(CTF_ABI);
      data = iface.encodeFunctionData('redeemPositions', [
        USDC_E,
        ethers.constants.HashZero,
        conditionId,
        [1, 2],
      ]);
      to = CTF_ADDRESS;
    }
    
    // Pre-validated signature for single-owner Safe
    const ownerPadded = ethers.utils.hexZeroPad(signer.address, 32);
    const signature = ethers.utils.hexConcat([
      ownerPadded,
      ethers.constants.HashZero,
      '0x01',
    ]);
    
    // Gas pricing
    const feeData = await provider.getFeeData();
    const minTip = ethers.utils.parseUnits('30', 'gwei');
    const tip = feeData.maxPriorityFeePerGas?.gt(minTip) ? feeData.maxPriorityFeePerGas : minTip;
    const baseFee = feeData.maxFeePerGas || ethers.utils.parseUnits('600', 'gwei');
    
    log(`Executing redeem via Safe: ${conditionId.substring(0, 18)}...`, 'claim');
    
    const tx = await safe.execTransaction(
      to, 0, data, 0, 0, 0, 0,
      ethers.constants.AddressZero,
      ethers.constants.AddressZero,
      signature,
      {
        gasLimit: 150000,
        maxPriorityFeePerGas: tip,
        maxFeePerGas: baseFee.add(tip),
      }
    );
    
    const receipt = await tx.wait();
    log(`✅ Safe tx confirmed: ${receipt.transactionHash} | Gas: ${receipt.gasUsed.toString()}`, 'success');
    return { success: true, txHash: receipt.transactionHash, method: 'safe', gasUsed: receipt.gasUsed.toString() };
    
  } catch (e) {
    const msg = e.message || String(e);
    if (msg.includes('GS013') || msg.includes('execution reverted')) {
      log(`Safe tx reverted (likely nothing to redeem): ${conditionId.substring(0, 18)}`, 'info');
      return { success: true, method: 'already_redeemed' };
    }
    log(`Safe exec error: ${msg.substring(0, 200)}`, 'error');
    return { success: false, error: msg.substring(0, 200) };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMBINED REDEEM WITH FALLBACK
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Try to redeem a position. Uses Builder Relayer first, falls back to direct Safe execution.
 * @param {string} conditionId - The condition ID to redeem
 * @param {boolean} negativeRisk - Whether this is a NegRisk market
 * @returns {{ success: boolean, method?: string, error?: string }}
 */
async function redeemPosition(conditionId, negativeRisk = false) {
  // Method 1: Builder Relayer (gasless)
  if (BUILDER_KEY && BUILDER_SECRET && BUILDER_PASSPHRASE) {
    const result = await redeemViaRelayer(conditionId, negativeRisk);
    if (result.success) return result;
    log(`Relayer failed, trying Safe execution...`, 'warning');
  }
  
  // Method 2: Direct Safe execution
  const result = await redeemViaSafe(conditionId, negativeRisk);
  return result;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SWEEP — Redeem all pending positions
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Sweep all redeemable positions. Returns summary stats.
 */
async function sweepAll() {
  log('Starting sweep of all redeemable positions...', 'sweep');
  
  const positions = await getRedeemablePositions();
  
  if (positions.length === 0) {
    log('No redeemable positions found', 'sweep');
    return { total: 0, redeemed: 0, failed: 0, skipped: 0 };
  }
  
  log(`Found ${positions.length} redeemable positions`, 'sweep');
  
  // Group by conditionId (multiple positions can share same condition)
  const conditionMap = new Map();
  for (const pos of positions) {
    if (!pos.conditionId) continue;
    if (!conditionMap.has(pos.conditionId)) {
      conditionMap.set(pos.conditionId, {
        conditionId: pos.conditionId,
        negativeRisk: pos.negativeRisk || false,
        positions: [],
        totalShares: 0,
      });
    }
    const entry = conditionMap.get(pos.conditionId);
    entry.positions.push(pos);
    entry.totalShares += parseFloat(pos.size || 0);
  }
  
  let redeemed = 0;
  let failed = 0;
  let skipped = 0;
  
  for (const [conditionId, info] of conditionMap) {
    const titles = info.positions.map(p => p.title || 'Unknown').join(', ');
    log(`Redeeming: ${conditionId.substring(0, 18)}... | ${info.totalShares.toFixed(1)} shares | ${titles.substring(0, 60)}`, 'claim');
    
    const result = await redeemPosition(conditionId, info.negativeRisk);
    
    if (result.success) {
      redeemed++;
      log(`✅ Redeemed via ${result.method}: ${conditionId.substring(0, 18)}`, 'success');
    } else {
      failed++;
      log(`❌ Failed: ${result.error}`, 'error');
    }
    
    // Rate limit between redemptions
    await new Promise(r => setTimeout(r, 2000));
  }
  
  const summary = { total: conditionMap.size, redeemed, failed, skipped };
  log(`Sweep complete: ${redeemed}/${conditionMap.size} redeemed, ${failed} failed`, 'sweep');
  
  return summary;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PERIODIC SWEEP RUNNER
// ═══════════════════════════════════════════════════════════════════════════════

let _sweepInterval = null;

/**
 * Start periodic sweep. Runs every `intervalMs` (default: 2 minutes).
 * Also runs immediately on start.
 */
function startPeriodicSweep(intervalMs = 120000) {
  // Run immediately
  sweepAll().catch(e => log(`Initial sweep error: ${e.message}`, 'error'));
  
  // Then periodically
  _sweepInterval = setInterval(async () => {
    try {
      await sweepAll();
    } catch (e) {
      log(`Periodic sweep error: ${e.message}`, 'error');
    }
  }, intervalMs);
  
  log(`Periodic sweep started (every ${intervalMs / 1000}s)`, 'info');
  return _sweepInterval;
}

function stopPeriodicSweep() {
  if (_sweepInterval) {
    clearInterval(_sweepInterval);
    _sweepInterval = null;
    log('Periodic sweep stopped', 'info');
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

module.exports = {
  getRedeemablePositions,
  redeemPosition,
  redeemViaRelayer,
  redeemViaSafe,
  sweepAll,
  startPeriodicSweep,
  stopPeriodicSweep,
};

// ═══════════════════════════════════════════════════════════════════════════════
// CLI — Run directly to sweep all positions
// ═══════════════════════════════════════════════════════════════════════════════

if (require.main === module) {
  console.log('═══════════════════════════════════════════════════');
  console.log('  AUTO-REDEEM — Polymarket Position Sweep');
  console.log(`  Funder: ${FUNDER}`);
  console.log('═══════════════════════════════════════════════════\n');
  
  sweepAll()
    .then(summary => {
      console.log('\n═══════════════════════════════════════════════════');
      console.log(`  SUMMARY: ${summary.redeemed}/${summary.total} redeemed, ${summary.failed} failed`);
      console.log('═══════════════════════════════════════════════════');
      process.exit(summary.failed > 0 ? 1 : 0);
    })
    .catch(e => {
      console.error('Fatal:', e);
      process.exit(1);
    });
}
