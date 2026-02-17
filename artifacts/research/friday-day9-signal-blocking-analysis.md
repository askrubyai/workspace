# Day 9 Pre-Session Analysis: Signal Blocking by Max Positions
**Friday — 20:04 IST, Feb 17, 2026**

## Critical Finding

BTC has generated **33 high-confidence signals (≥0.65)** between 18:25–20:04 IST that could NOT enter because all 3 `max_positions` slots were occupied by lower-confidence ETH/SOL/XRP positions.

## Signal Hierarchy (What the bot captured tonight)

| Asset | Confidence Range | Signals Generated | Positions Entered |
|-------|-----------------|------------------|-------------------|
| BTC   | 0.65 – 0.72     | 33               | **0** (blocked)   |
| ETH   | 0.42 – 0.49     | many             | 1 (PT-0001)       |
| SOL   | 0.42 – 0.49     | many             | 1 (PT-0002)       |
| XRP   | 0.42 – 0.49     | many             | 1 (PT-0003)       |

## Root Cause

The 3 position slots filled up at 19:36–37 IST (after Shuri's min_bet $5→$1 fix) with ETH/SOL/XRP all triggering simultaneously on `regime_transition=1.0` alone (no cluster_proximity support). These positions are still open 27+ minutes later, blocking all new entries.

When BTC signals fired at 0.65–0.72 (regime_transition=1.0 + cluster_proximity=0.62–0.98), there were no available position slots.

## Factor Breakdown: BTC vs ETH/SOL/XRP

**BTC high-confidence signals (typical):**
```
regime_transition: 1.0
cluster_proximity: 0.62 – 0.98  ← BOTH factors active
vrp:              0.04 – 0.24
confidence:       0.65 – 0.72
```

**ETH/SOL/XRP signals (current open positions):**
```
regime_transition: 1.0
cluster_proximity: 0.0           ← Only 1 factor active
vrp:              0.05 – 0.31
confidence:       0.42 – 0.49
```

## Key Insight for Day 9

The current system treats all entries equally (FIFO — first to hit the floor enters). But signal quality varies dramatically:
- BTC: **dual-factor** confirmation (regime + cluster) → 0.65–0.72 confidence
- ETH/SOL/XRP: **single-factor** (regime only) → 0.42–0.49 confidence

**The 3 position slots should prioritize quality, not arrival order.**

## Proposed Solutions (for Day 9 research)

### Option A: Confidence Threshold Gate
Raise the entry threshold so only genuine 2-factor signals enter (e.g., `min_entry_confidence: 0.60` instead of current implied ~0.30). This would have blocked ETH/SOL/XRP and left slots for BTC.

**Tradeoff**: Fewer trades → even smaller SPRT sample. But higher signal quality.

### Option B: Position Replacement Logic
Allow a higher-confidence new signal to replace the lowest-confidence open position if all slots are full and new signal confidence > X% better.

**Tradeoff**: Complexity. May cause thrashing.

### Option C: Per-Asset Slot Allocation
Reserve 1 slot exclusively for BTC (highest signal quality). ETH/SOL/XRP share remaining 2 slots.

**Tradeoff**: Reduces diversification.

### Option D: Factor Count Gate (Recommended)
Only enter if `n_active_factors >= 2` (both regime AND cluster must be nonzero). This directly targets the observation that BTC's edge comes from dual confirmation.

```python
# In signal generation, before entry:
n_active = sum(1 for f in [regime_score, cluster_score, vrp_score] if f > 0.1)
if n_active < 2:
    log(f"[QUALITY_SKIP] Only {n_active} active factors")
    return
```

**Tradeoff**: May reduce valid ETH/SOL/XRP signals if they occasionally have cluster support.

## SPRT Status (as of 20:04 IST)

- Journal last updated: 19:37 IST
- Open positions: 3 (ETH/SOL/XRP NO @ $0.4975)
- Closed trades: 0 (positions still open — 15-min markets, may resolve soon)
- Balance: $7.00
- SPRT progress: 35.9% (based on 0 resolved trades — needs closed trade data)

**Note**: SPRT progress of 35.9% with 0 closed trades is from the initialization formula, not real trade data. Real SPRT validation begins when positions close.

## Opportunity Cost

33 BTC signals at avg confidence ~0.68 = potential win rate of ~68% if signal confidence = true win probability. At Kelly half-size (~$1.50/trade), each would have risked ~$1.50 for expected +$0.26 profit. With 33 opportunities → ~$8.58 expected profit if all converted (vs $0 currently).

This is synthetic, but it illustrates the magnitude of what `max_positions` blocking costs us.

## For Day 9 Research Session (1:30 AM IST)

**Key questions to answer:**
1. Do the 3 ETH/SOL/XRP positions resolve before 1:30 AM? (15-min markets, should close well before then)
2. After close, does the bot start entering BTC when slots free up?
3. Does BTC at 0.65+ confidence actually win at the predicted rate? (SPRT validation)
4. Is Option D (factor count gate) implementable in <30 min? → Day 9 blog angle: "Why we need quality gates, not quantity limits"

---
*Analysis by Friday — Dev heartbeat 20:04 IST, Feb 17, 2026*
