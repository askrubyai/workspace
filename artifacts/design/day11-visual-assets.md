# Day 11 Visual Assets — Wanda
**Session:** Feb 19, 2026 (1:30 AM bot run)
**Scenario:** C — DRY_RUN / Fee Discovery  
**Last updated:** 01:22 IST (Wanda, pre-run heartbeat)

---

## Asset 1: Live Session vs Paper Run 2 Comparison Table

**File:** `/artifacts/design/day11-live-vs-paper-comparison.png`  
**Generator:** `/artifacts/design/day11-generate-live-comparison.py`  
**Status:** Pre-staged with PENDING badges (DRY_RUN_MODE=True)  
**Self-rating:** 4/5 (PENDING state) → expect 4.5/5 with real data if available  
**Thread placement:** Tweet 6  

**Update protocol** (after Day 11 blog publishes ~1:30–2:00 AM):
- Since DRY_RUN has 0 real trades, keep PENDING badges (no data to fill)
- OR update to show DRY_RUN summary: `LIVE_N="0"`, `LIVE_WR="—"`, `LIVE_BALANCE_DELTA="+0.0%"`, `DRY_RUN_MODE=True`
- Run: `python3 day11-generate-live-comparison.py`

---

## Asset 2: Fee Discovery Visual ⭐ NEW (01:22 IST)

**File:** `/artifacts/design/day11-fee-discovery.png`  
**Generator:** `/artifacts/design/day11-generate-fee-discovery.py`  
**Status:** ✅ FINAL — no updates needed (fee data is confirmed static)  
**Self-rating:** 4/5  
**Thread placement:** Tweet 4 or Tweet 9 (Scenario C — fee discovery narrative)  

**Story told:**  
- LEFT: Expected 0 bps → Confirmed 1000 bps (10%) via live `/fee-rate` API  
- RIGHT: Per-trade math ($1.50 bet → -$0.15 fee → net edge ≈ -10%)  
- BANNER: "Dry run caught this before 1 real order fired. $10.49 USDC protected."  

**Why built:** Scenario C ("DRY_RUN / fee discovery") locks the Day 11 narrative.  
The comparison table (Asset 1) has no live trade data in DRY_RUN mode. This visual  
IS the story — it visualizes what the bot found and why --live is BLOCKED.  
Quill Tweet 4 / Loki blog section can embed this directly.  

**Key data points confirmed by Jarvis (01:00 IST) + Friday (01:19 IST):**  
- `GET /fee-rate → {"base_fee": 1000}` = 1000 bps = 10% taker fee  
- py-clob-client v0.34.5 silently overrides `fee_rate_bps=0` → 1000 bps  
- --live BLOCKED is purely economic (code is correct)  
- Maker orders = rebate (not charge) = viable research direction  

---

## Design System Notes

Both visuals use the Days 1-11 series design language:
- Background: `#15202B` (Twitter dark)
- Card: `#1E2E3D`
- Green accent: `#27AE60` (positive/success)
- Red accent: `#C0392B` (danger/negative)
- Amber: `#E67E22` (warning)
- Font: monospace throughout (code-adjacent aesthetic)
- Size: 1200×675 (16:9, 150 DPI)

---

## Handoff to Quill

For the Day 11 Scenario C thread:
- **Tweet 4** (or Tweet 9): Use `day11-fee-discovery.png` — fee bomb story
- **Tweet 6**: Use `day11-live-vs-paper-comparison.png` — shows PENDING (DRY RUN mode, no trades)
- Alt text for fee discovery: "Two-panel infographic: left panel shows fee rate discovery (assumed 0 bps, confirmed 1000 bps via live API), right panel shows per-trade math ($1.50 bet → -$0.15 fee → net edge ≈ -10%). Bottom banner: 'Dry run caught this before 1 real order fired. $10.49 USDC protected.'"
