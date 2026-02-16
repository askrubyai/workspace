/**
 * safe-redeem.js — Redeem resolved Polymarket positions through Gnosis Safe
 * 
 * The problem: Polymarket uses Gnosis Safe as the proxy wallet (funder).
 * Tokens are held by the Safe, not the signer EOA.
 * To redeem, we must call CTF.redeemPositions *through* Safe.execTransaction.
 * 
 * Usage:
 *   const { redeemViaSafe, findRedeemablePositions } = require('./safe-redeem');
 *   const redeemable = await findRedeemablePositions(provider, funderAddress);
 *   for (const pos of redeemable) {
 *     await redeemViaSafe(wallet, provider, funderAddress, pos.conditionId);
 *   }
 */

const { ethers } = require('ethers');

// Polymarket contracts (Polygon)
const CTF_ADDRESS = '0x4D97DCd97eC945f40cF65F87097ACe5EA0476045';
const USDC_E = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'; // USDC.e (bridged) — CTF collateral

const SAFE_ABI = [
  'function nonce() view returns (uint256)',
  'function execTransaction(address to, uint256 value, bytes data, uint8 operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, bytes signatures) payable returns (bool)',
  'function getTransactionHash(address to, uint256 value, bytes data, uint8 operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, uint256 _nonce) view returns (bytes32)',
];

const CTF_ABI = [
  'function redeemPositions(address collateralToken, bytes32 parentCollectionId, bytes32 conditionId, uint256[] indexSets)',
  'function balanceOf(address owner, uint256 id) external view returns (uint256)',
  'function payoutDenominator(bytes32 conditionId) view returns (uint256)',
  'function payoutNumerators(bytes32 conditionId, uint256 index) view returns (uint256)',
  'function getConditionId(address oracle, bytes32 questionId, uint256 outcomeSlotCount) pure returns (bytes32)',
];

/**
 * Execute a transaction through a Gnosis Safe with a single owner.
 * @param {ethers.Wallet} signer - The sole Safe owner (connected to provider)
 * @param {string} safeAddress - The Safe (funder) address
 * @param {string} to - Target contract address
 * @param {string} data - Encoded calldata
 * @returns {object} Transaction receipt
 */
async function execViaSafe(signer, safeAddress, to, data) {
  const safe = new ethers.Contract(safeAddress, SAFE_ABI, signer);
  const nonce = await safe.nonce();

  // For a single-owner Safe with threshold=1, we use a pre-validated signature:
  // r = owner address (padded to 32 bytes), s = 0, v = 1
  const ownerPadded = ethers.utils.hexZeroPad(signer.address, 32);
  const signature = ethers.utils.hexConcat([
    ownerPadded,                           // r = owner address
    ethers.constants.HashZero,             // s = 0
    '0x01',                                // v = 1 (pre-validated)
  ]);

  // Execute: operation=0 (CALL), no gas refund params
  const tx = await safe.execTransaction(
    to,                          // to
    0,                           // value
    data,                        // data
    0,                           // operation (CALL)
    0,                           // safeTxGas
    0,                           // baseGas
    0,                           // gasPrice
    ethers.constants.AddressZero, // gasToken
    ethers.constants.AddressZero, // refundReceiver
    signature,                   // signatures
    { 
      gasLimit: 100000,
      // Polygon requires higher tip cap; fetch dynamically
      ...(await (async () => {
        const feeData = await signer.provider.getFeeData();
        const minTip = ethers.utils.parseUnits('30', 'gwei');
        const tip = feeData.maxPriorityFeePerGas?.gt(minTip) ? feeData.maxPriorityFeePerGas : minTip;
        const baseFee = feeData.maxFeePerGas || ethers.utils.parseUnits('600', 'gwei');
        return { maxPriorityFeePerGas: tip, maxFeePerGas: baseFee.add(tip) };
      })()),
    }
  );

  const receipt = await tx.wait();
  return receipt;
}

/**
 * Redeem resolved positions on the CTF contract through the Safe.
 * @param {ethers.Wallet} signer - Safe owner wallet (connected to provider)
 * @param {string} safeAddress - The Safe (funder) address
 * @param {string} conditionId - The condition ID of the resolved market
 * @returns {object|null} Transaction receipt or null if nothing to redeem
 */
async function redeemViaSafe(signer, safeAddress, conditionId) {
  const ctfIface = new ethers.utils.Interface(CTF_ABI);

  // Build redeemPositions calldata
  // indexSets [1, 2] = both outcomes (binary market)
  const calldata = ctfIface.encodeFunctionData('redeemPositions', [
    USDC_E,                        // collateralToken
    ethers.constants.HashZero,     // parentCollectionId (null for Polymarket)
    conditionId,                   // conditionId
    [1, 2],                        // indexSets (both outcomes for binary market)
  ]);

  console.log(`[REDEEM] Executing redeemPositions via Safe for condition ${conditionId.substring(0, 18)}...`);
  
  try {
    const receipt = await execViaSafe(signer, safeAddress, CTF_ADDRESS, calldata);
    console.log(`[REDEEM] ✅ Success! Tx: ${receipt.transactionHash} | Gas: ${receipt.gasUsed.toString()}`);
    return receipt;
  } catch (err) {
    // Common: "GS013" = Safe transaction failed (e.g., nothing to redeem)
    const msg = err.message || '';
    if (msg.includes('GS013') || msg.includes('execution reverted')) {
      console.log(`[REDEEM] ⚠️ Safe exec reverted — likely nothing to redeem or already claimed`);
    } else {
      console.error(`[REDEEM] ❌ Error: ${msg.substring(0, 200)}`);
    }
    return null;
  }
}

/**
 * Scan for redeemable positions by checking recent trades against Gamma API.
 * Returns an array of { conditionId, tokenId, balance, marketTitle } objects.
 * 
 * @param {ethers.providers.Provider} provider
 * @param {string} safeAddress - The funder/Safe address holding tokens
 * @param {Array} trades - Array of trade objects from CLOB API (optional)
 * @returns {Array} Redeemable positions
 */
async function findRedeemableFromGamma(provider, safeAddress, recentConditionIds = []) {
  const ctf = new ethers.Contract(CTF_ADDRESS, CTF_ABI, provider);
  const redeemable = [];

  for (const cid of recentConditionIds) {
    try {
      // Check if payouts have been reported
      const denominator = await ctf.payoutDenominator(cid);
      if (denominator.eq(0)) continue; // Not resolved yet

      // Check if we have tokens for either outcome
      // For binary markets, index sets are 1 and 2
      // Token IDs are computed from conditionId + indexSet, but we'd need the full calculation
      // Instead, we'll just try to redeem — if nothing to redeem, it'll revert gracefully
      redeemable.push({ conditionId: cid, resolved: true });
    } catch (e) {
      // Skip on error
    }
  }

  return redeemable;
}

/**
 * Claim all redeemable positions for known condition IDs.
 * Call this after market resolution.
 */
async function claimAll(signer, safeAddress, conditionIds) {
  let claimed = 0;
  for (const cid of conditionIds) {
    const result = await redeemViaSafe(signer, safeAddress, cid);
    if (result) claimed++;
    await new Promise(r => setTimeout(r, 1000)); // Rate limit
  }
  return claimed;
}

module.exports = {
  redeemViaSafe,
  execViaSafe,
  findRedeemableFromGamma,
  claimAll,
  CTF_ADDRESS,
  USDC_E,
  SAFE_ABI,
  CTF_ABI,
};
