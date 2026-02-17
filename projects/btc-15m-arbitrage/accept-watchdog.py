#!/usr/bin/env python3
"""
accept-watchdog.py — Emergency SPRT ACCEPT correction watchdog
Deploy ONLY when a critical fix was committed while the bot is running
and you cannot restart (SPRT state would be lost).

BUG FIX (Shuri 22:32 IST Feb 17):
  Old version started from EOF — if ACCEPT already fired before watchdog launch,
  it would poll forever and never detect the event.

Fix: Start from last_pos=0 (beginning of log).
     If ACCEPT is already in the log, handle it immediately before entering poll loop.

Usage:
  python3 accept-watchdog.py [JOURNAL_PATH] [LOG_PATH]

Defaults:
  JOURNAL_PATH = paper-trading-results/trade-journal-multifactor.json
  LOG_PATH     = paper-trading-results/paper-multifactor.log
"""

import json
import os
import sys
import time
from pathlib import Path

JOURNAL_PATH = Path(sys.argv[1] if len(sys.argv) > 1 else "paper-trading-results/trade-journal-multifactor.json")
LOG_PATH = Path(sys.argv[2] if len(sys.argv) > 2 else "paper-trading-results/paper-multifactor.log")

POLL_INTERVAL = 2  # seconds


def load_journal() -> dict:
    with open(JOURNAL_PATH) as f:
        return json.load(f)


def save_journal(data: dict):
    with open(JOURNAL_PATH, "w") as f:
        json.dump(data, f, indent=2)
    print(f"[watchdog] Journal saved: {JOURNAL_PATH}")


def force_close_zombies(journal: dict) -> dict:
    """Force-close any open positions at neutral 0.50 exit price."""
    open_positions = journal.get("open_positions", [])
    if not open_positions:
        print("[watchdog] No zombie positions to close.")
        return journal

    print(f"[watchdog] Found {len(open_positions)} zombie position(s). Force-closing...")
    closed = journal.setdefault("closed_trades", [])
    stats = journal.get("stats", {})

    for pos in open_positions:
        exit_price = 0.50
        shares = pos.get("shares", 0)
        entry_price = pos.get("entry_price", 0.50)
        pnl = (exit_price - entry_price) * shares

        closed_trade = {
            **pos,
            "exit_price": exit_price,
            "pnl": pnl,
            "exit_reason": "watchdog_force_close",
        }
        closed.append(closed_trade)

        # Update stats
        stats["balance"] = stats.get("balance", 0) + pnl
        stats["total_trades"] = stats.get("total_trades", 0) + 1
        if pnl >= 0:
            stats["wins"] = stats.get("wins", 0) + 1
        else:
            stats["losses"] = stats.get("losses", 0) + 1

        print(f"[watchdog] Closed {pos.get('symbol', '?')} @ {exit_price:.3f} | PnL: {pnl:+.4f}")

    journal["open_positions"] = []
    journal["stats"] = stats
    wins = stats.get("wins", 0)
    total = stats.get("total_trades", 1)
    stats["win_rate"] = wins / total if total > 0 else 0.0
    return journal


def handle_accept():
    """Load journal, force-close zombies, save."""
    print("[watchdog] ACCEPT detected. Correcting journal...")
    journal = load_journal()
    journal = force_close_zombies(journal)
    save_journal(journal)
    print("[watchdog] Journal corrected. Exiting.")


def main():
    print(f"[watchdog] Starting. Watching: {LOG_PATH}")
    print("[watchdog] Scanning from BEGINNING of log (start_pos=0). Handles ACCEPT before or after watchdog launch.")

    last_pos = 0  # FIX: start from beginning, not EOF

    # --- FIX: pre-check existing log before entering poll loop ---
    if LOG_PATH.exists():
        with open(LOG_PATH, "r") as f:
            existing = f.read()
        if "SPRT ACCEPT" in existing or "SPRT: ACCEPT" in existing:
            print("[watchdog] ACCEPT already in log (fired before watchdog launch). Handling immediately.")
            handle_accept()
            return
        last_pos = LOG_PATH.stat().st_size  # skip history we already scanned
        print(f"[watchdog] No prior ACCEPT found. Entering poll loop from pos={last_pos}.")

    # --- Poll for new log lines ---
    while True:
        try:
            if LOG_PATH.exists():
                size = LOG_PATH.stat().st_size
                if size > last_pos:
                    with open(LOG_PATH, "r") as f:
                        f.seek(last_pos)
                        new_lines = f.read()
                    last_pos = size

                    if "SPRT ACCEPT" in new_lines or "SPRT: ACCEPT" in new_lines:
                        handle_accept()
                        return

        except Exception as e:
            print(f"[watchdog] Error: {e}")

        time.sleep(POLL_INTERVAL)


if __name__ == "__main__":
    main()
