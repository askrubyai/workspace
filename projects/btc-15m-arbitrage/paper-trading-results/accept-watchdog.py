#!/usr/bin/env python3
"""
SPRT ACCEPT Watchdog — Friday, 2026-02-17 22:19 IST

The running bot (pid 5114) was started BEFORE commit 0915d52 which added
_force_close_remaining(). When SPRT hits ACCEPT, it will:
  1. Save the journal (with open positions still open)
  2. Print final report
  3. Set _running = False (stop)

This watchdog:
  1. Monitors paper-multifactor.log for the ACCEPT event
  2. When detected, waits 1s for journal to flush
  3. Loads the journal, force-closes any zombie positions at 0.50 (neutral)
  4. Saves corrected journal + logs correction

Run BEFORE ACCEPT fires:
  python3 paper-trading-results/accept-watchdog.py &
"""

import json, time, math, sys, os
from pathlib import Path

LOG_FILE = Path("paper-trading-results/paper-multifactor.log")
JOURNAL_FILE = Path("paper-trading-results/trade-journal-multifactor.json")
ACCEPT_MARKER = "SPRT DECISION: ACCEPT"
REJECT_MARKER = "SPRT DECISION: REJECT"

def tail_log(log_path: Path, last_pos: int = 0):
    """Read new lines since last_pos, return (new_lines, new_pos)."""
    try:
        with open(log_path, "r") as f:
            f.seek(last_pos)
            lines = f.readlines()
            return lines, f.tell()
    except Exception:
        return [], last_pos

def force_close_zombies(journal_path: Path) -> dict:
    """Load journal, close zombie open positions at 0.50, return corrected journal."""
    with open(journal_path) as f:
        data = json.load(f)
    
    open_positions = data.get("open_positions", [])
    if not open_positions:
        print("[WATCHDOG] No zombie positions to close.")
        return data
    
    closed_trades = data.get("closed_trades", [])
    # Compute balance from what's in engine (fallback to known balance)
    # The journal might have 'balance' field; if not, we'll compute from positions
    
    print(f"[WATCHDOG] Found {len(open_positions)} zombie position(s) to force-close:")
    
    balance_correction = 0.0
    now_ts = time.time()
    
    for pos in open_positions:
        entry_price = pos.get("entry_price", 0.50)
        shares = pos.get("shares", 0)
        size_usd = pos.get("size_usd", 0)
        asset = pos.get("asset", "?")
        direction = pos.get("direction", "?")
        
        # Close at 0.50 (neutral, fair value post-ACCEPT)
        exit_price = 0.50
        pnl = (exit_price - entry_price) * shares
        
        pos["exit_price"] = exit_price
        pos["exit_timestamp"] = now_ts
        pos["pnl"] = pnl
        pos["status"] = "CLOSED"
        pos["close_reason"] = "force_closed_accept_watchdog"
        pos["sprt_decision"] = "force_closed_accept"
        
        # When closing: balance recovers entry_price * shares + pnl
        recovered = entry_price * shares + pnl
        balance_correction += recovered
        
        pnl_str = f"{pnl:+.3f}"
        print(f"  [{asset}] FORCE-CLOSED {direction} @ 0.50 | entry={entry_price:.3f} "
              f"shares={shares:.1f} PnL={pnl_str} recovered=${recovered:.2f}")
        
        closed_trades.append(pos)
    
    # Update journal
    data["open_positions"] = []
    data["closed_trades"] = closed_trades
    
    # Correct balance
    old_balance = data.get("engine", {}).get("balance") or data.get("balance")
    if old_balance is None:
        print("[WATCHDOG] WARNING: Could not read balance from journal, skipping balance correction")
    else:
        new_balance = old_balance + balance_correction
        if "engine" in data and "balance" in data["engine"]:
            data["engine"]["balance"] = new_balance
        elif "balance" in data:
            data["balance"] = new_balance
        print(f"[WATCHDOG] Balance corrected: ${old_balance:.2f} + ${balance_correction:.2f} = ${new_balance:.2f}")
    
    # Add watchdog correction note
    data["_watchdog_correction"] = {
        "timestamp": now_ts,
        "note": "Zombie positions force-closed by accept-watchdog.py (bot started before 0915d52 fix)",
        "n_positions_corrected": len(open_positions),
        "balance_correction": balance_correction
    }
    
    return data

def main():
    print(f"[WATCHDOG] Started at {time.strftime('%H:%M:%S')} IST")
    print(f"[WATCHDOG] Watching: {LOG_FILE}")
    print(f"[WATCHDOG] Will correct journal on ACCEPT/REJECT event")
    
    # Start from end of current log
    try:
        last_pos = LOG_FILE.stat().st_size
    except Exception:
        last_pos = 0
    
    print(f"[WATCHDOG] Starting from log position {last_pos} (skipping history)")
    
    while True:
        time.sleep(2)  # Poll every 2 seconds
        
        new_lines, last_pos = tail_log(LOG_FILE, last_pos)
        
        for line in new_lines:
            if ACCEPT_MARKER in line or REJECT_MARKER in line:
                decision = "ACCEPT" if ACCEPT_MARKER in line else "REJECT"
                print(f"\n[WATCHDOG] 🎯 DETECTED: SPRT {decision}!")
                print(f"[WATCHDOG] Line: {line.strip()}")
                print(f"[WATCHDOG] Waiting 2s for journal to flush...")
                time.sleep(2)
                
                try:
                    corrected = force_close_zombies(JOURNAL_FILE)
                    
                    # Save corrected journal
                    backup_path = str(JOURNAL_FILE).replace(".json", f"-pre-watchdog-{int(time.time())}.json")
                    with open(JOURNAL_FILE) as f:
                        original = f.read()
                    with open(backup_path, "w") as f:
                        f.write(original)
                    print(f"[WATCHDOG] Backup saved: {backup_path}")
                    
                    with open(JOURNAL_FILE, "w") as f:
                        json.dump(corrected, f, indent=2, default=str)
                    print(f"[WATCHDOG] ✅ Journal corrected: {JOURNAL_FILE}")
                    
                except Exception as e:
                    print(f"[WATCHDOG] ❌ Error correcting journal: {e}")
                    import traceback
                    traceback.print_exc()
                
                print(f"[WATCHDOG] Done. Exiting.")
                return
    
if __name__ == "__main__":
    os.chdir(Path(__file__).parent.parent)  # cd to btc-15m-arbitrage/
    main()
