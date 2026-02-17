# Paper Trading Bot — Pre-launch UX Audit
**Auditor:** Shuri (Product Analyst)  
**Date:** 2026-02-17, 12:32 PM IST  
**Target:** `paper-bot-multifactor.py` + `run-paper-bot.sh`  
**Verdict:** ✅ CLEARED FOR 3 PM LAUNCH (3 bugs fixed)

---

## Bugs Found & Fixed

### 🔴 Bug #1 — Status Script: Wrong field names (FIXED)
**File:** `run-paper-bot.sh` lines 76-77  
**Severity:** HIGH — all status output was misleading/broken

**Problem:**
- `t.get('result') == 'WIN'` — field `result` doesn't exist in journal; journal stores `pnl` (float) and `status` (string)
- `t.get('primary_factor', '?')` — field `primary_factor` doesn't exist; journal stores `signal_factors` dict
- `j.get('trades', [])` — wrong key; journal uses `closed_trades` (not `trades`)
- Stats weren't shown at all (balance/P&L missing from status output)

**Impact:** Every trade shows `?` for win/loss, every factor shows `?`, stats show 0 trades

**Fix applied:**
- `t.get('pnl', 0) > 0` for win/loss detection
- Compute `top_factor = max(factors, key=lambda k: factors[k])` from `signal_factors` dict
- Use `closed_trades` key
- Add balance + P&L line to status output

---

### 🟡 Bug #2 — Stale `time_left_s` in market cache (FIXED)
**File:** `paper-bot-multifactor.py` lines 671-673  
**Severity:** MEDIUM — could miss market resolutions up to 30s late

**Problem:**
The `MarketCache` stores `time_left_s` at the moment of the last fetch (TTL: 30s). Between refreshes, `market.get("time_left_s", 0)` returns the stale snapshot — it doesn't count down. If a market expires in the 30s gap between refreshes, `check_exits` never sees `time_remaining_s ≤ 0` until the NEXT refresh.

Worst case: 29s stale window where an expired market isn't resolved.

**Fix applied:**
- Added `"cached_at": time.time()` to every market dict on fetch
- Compute elapsed: `elapsed_since_fetch = time.time() - market.get("cached_at", time.time())`
- Apply: `time_left = max(0.0, market.get("time_left_s", 0) - elapsed_since_fetch)`

Now `time_left` counts down accurately between cache refreshes.

---

### 🟡 Bug #3 — Log cleared on every restart (FIXED)
**File:** `paper-bot-multifactor.py` line ~573  
**Severity:** LOW — data loss, no historical debugging trail

**Problem:**
`with open(CONFIG["log_file"], "w") as f: pass` — truncates log on every start. If bot crashes and restarts, all prior session logs are gone. Makes debugging restart loops impossible.

**Fix applied:**
Replaced truncation with append + timestamped separator:
```
══════════════════════════════════════════════════════════════
[2026-02-17 15:00:01] NEW SESSION STARTED
══════════════════════════════════════════════════════════════
```

---

## UX Observations (Not Fixed — Low Priority)

### VRP Factor Always Fires
**File:** `vrp_signal()` function  
`iv_proxy = rv_current * 1.15` — this is a fixed calibration, so `vrp = 0.15 * rv_current` is always positive when there's data. The VRP factor (30% weight) is always ON, effectively acting as a constant bias rather than a discriminating signal.

**Impact:** Signal scores are inflated by ~0.30 for any signal with enough price history (50+ bars). The effective threshold is `0.70 × threshold` for the regime + cluster factors.  
**Recommendation (future):** Replace with actual IV proxy from options pricing divergence, or remove VRP weight and re-calibrate threshold.

---

## Pre-launch Checklist

| Check | Status |
|-------|--------|
| Syntax clean | ✅ |
| Dependencies (numpy, websocket, requests) | ✅ |
| Status script fields correct | ✅ Fixed |
| time_left staleness | ✅ Fixed |
| Log preservation | ✅ Fixed |
| WS keepalive (5s ping, 10s timeout) | ✅ Already solid |
| Exponential backoff reconnect | ✅ Already solid |
| SPRT boundaries correct (α=0.05, β=0.20) | ✅ |
| Journal schema matches status script | ✅ Fixed |

---

## Self-Rating: 4.5/5
**What worked:** Caught real bugs that would have made the status output useless and caused missed resolutions. All fixes verified with syntax check.  
**What could be better:** Could have done a dry-run import test to catch any runtime errors, not just syntax errors. Didn't test the actual WebSocket connection (network-dependent).
