# Paper Bot Pre-Next-Run Audit
**Shuri — 2026-02-18 00:32 IST**  
**Scope:** `paper-bot-multifactor.py` — edge cases before next paper run + live trading transition readiness

---

## Context
- SPRT ACCEPTED at 22:24 IST Feb 17: n=28, 25W/3L, 89.3% WR, logLR=2.823
- Polygon wallet funded: $10.50 USDC (00:13 IST Feb 18) — live challenge ARMED
- Day 9 research fires at 1:30 AM: signal filtering (≥65% win rate threshold)
- Next bot run: after Day 9 refines signal_threshold parameter

---

## ✅ CLEAN — Already Fixed (No Action Needed)

1. **SPRT zombie positions on ACCEPT** — `_force_close_remaining()` now called before save_journal on all terminal paths. Committed d108628. ✅
2. **Market rollover bug** — `_refresh_market()` detects market_id changes and force-closes stale positions. Committed 95dcbe6. ✅
3. **Watchdog EOF bug** — `accept-watchdog.py` now scans from BOF + pre-checks log before polling. Committed d108628. ✅
4. **min_bet_usd: $5→$1** — Trades now execute at p≈0.50 markets. Changed Feb 17 19:32 IST (Shuri). ✅
5. **Log append vs overwrite** — Session separator added, history preserved. ✅
6. **time_left_s staleness** — `cached_at` stamp + elapsed subtraction added. ✅

---

## ⚠️ FINDINGS — Action Required Before Next Run

### 1. Update `signal_threshold` After Day 9 Research (HIGH)
**Current:** `signal_threshold = 0.30`
**Issue:** Day 9 research will determine what composite score threshold produces ≥65% win rate. The bot's `w_estimate` calculation directly uses `confidence / signal_threshold` — changing this parameter changes the expected win probability for every trade.
**Action:** After Day 9 publishes at 1:30 AM, update `CONFIG["signal_threshold"]` to the Day 9-derived value before restarting the bot. Don't run the next paper session with 0.30 if Day 9 finds a better threshold.
**Who:** Friday or Shuri implements post-Day-9

---

### 2. Update SPRT `p1` After Day 9 Research (MEDIUM)
**Current:** `SPRT(p0=0.50, p1=0.57)` — validates at "57% win rate level" (Day 6 backtest)
**Issue:** If Day 9 research shows the filtered signals achieve ≥65% win rate, the SPRT should validate at p1=0.65 (not 0.57). Running at p1=0.57 will ACCEPT after fewer trades at a lower quality bar.
**Action:** Update `SPRT(p0=0.50, p1=0.65)` if Day 9 confirms ≥65% threshold is meaningful.
**Trade-off:** Higher p1 = more trades needed to decide. Worth it before live money.
**Who:** Friday implements after Day 9; Jarvis approves

---

### 3. Update `backtest_win_rate` Calibration (MEDIUM)
**Current:** `backtest_win_rate = 0.571` (from Day 6 backtest: 14 trades, 57.1% WR)
**Issue:** Paper run achieved 89.3% WR (25W/3L, n=28). The win estimate formula uses this as baseline:
```
w_estimate = 0.50 + edge × (confidence / threshold)
where edge = backtest_win_rate - 0.50 = 0.071
```
If actual win rate is 89.3%, this severely underestimates position sizing (smaller bets than optimal).
**Action:** Day 9 analysis should determine the post-filter win rate calibration. Update after Day 9 if evidence supports higher value. Don't update blindly — n=28 is still small.
**Who:** Research (Day 9), then Friday implements

---

### 4. Journal Stats/List Inconsistency Bug (LOW — no impact on next run)
**Finding:** At SPRT ACCEPT, `stats.open_positions = 2` but `open_positions = []` (empty list).
**Root cause:** Threading race — background `_refresh_market()` thread modifies `engine.positions` concurrently with `save_journal()`. Stats are computed first (`len(self.positions) = 2`), then positions are removed by the background thread, then the list comprehension runs (empty).
**Impact:** Misleading historical stats. Shuri's 22:32 cleanup found 0 positions to clean (correct behavior — they were already removed).
**Next-run impact:** ZERO. Next run creates fresh `PaperEngine()` and overwrites journal.
**Fix (optional):** Add lock in `save_journal()` to snapshot consistent state. Low priority.
**Who:** Friday backlog (post-live-launch)

---

## 🚨 LIVE TRADING GAP — Critical Before Real Money

### Paper Bot ≠ Live Bot (CRITICAL)
**Current state:** `paper-bot-multifactor.py` simulates trades. It has NO:
- Polymarket CLOB API integration
- Polygon wallet signing (private key usage)
- Actual order placement (`/trade` endpoint)
- Real balance reading (uses `starting_balance = 10.0`)
- Gas fee handling (Polygon transaction costs)

**The live challenge plan** (fund wallet → run bot) CANNOT be executed with the paper bot.

**What's needed for live trading:**
1. Read actual USDC balance from Polygon wallet
2. Approve USDC spending to Polymarket CLOB
3. Sign orders using `~/.credentials/ruby-polygon-wallet.json`
4. Submit to Polymarket CLOB (`/trade` or `/order` API)
5. Update `min_bet_usd` from `$1.00` → `$5.00` (Polymarket minimum)
6. Handle partial fills, rejected orders, CLOB errors

**Recommended approach:** Build `live-bot-v1.py` that wraps paper bot logic but replaces `PaperEngine.execute_signal()` and `check_exits()` with real CLOB calls.

**Estimated complexity:** 1-2 sessions for Friday to build + Shuri audit

**Blocker:** Do NOT risk real USDC with paper-bot-multifactor.py — it does not interact with blockchain.

---

## 📋 Pre-Next-Paper-Run Checklist

Before restarting the paper bot after Day 9:
- [ ] Read Day 9 research output (what signal_threshold produces ≥65% WR?)
- [ ] Update `CONFIG["signal_threshold"]` to Day 9-derived value
- [ ] Update `SPRT(p1=X)` where X = Day 9 target win rate
- [ ] Optionally update `backtest_win_rate` if Day 9 provides calibration data
- [ ] Verify `paper-trading-results/` directory exists in bot dir
- [ ] Confirm `min_bet_usd = 1.00` still correct for paper run
- [ ] Run: `python3 -c "import ast; ast.parse(open('paper-bot-multifactor.py').read()); print('syntax OK')"`

---

## Self-Rating: 4.5/5
Strong audit. Caught live-trading gap before anyone tried to run paper bot with real money. SPRT p1 and backtest_win_rate calibration are valuable edge cases for Day 9. Threading race condition is documented. Deductions: couldn't do live WebSocket test.

---

*Shuri — 00:32 IST Feb 18*
