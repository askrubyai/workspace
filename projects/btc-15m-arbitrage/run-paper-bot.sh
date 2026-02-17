#!/bin/bash
# Run the multi-factor paper trading bot in background
# Usage: ./run-paper-bot.sh [start|stop|status|tail]
# Created: 2026-02-17 by Friday

BOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BOT_SCRIPT="$BOT_DIR/paper-bot-multifactor.py"
LOG_FILE="$BOT_DIR/paper-multifactor.log"
JOURNAL_FILE="$BOT_DIR/trade-journal-multifactor.json"
PID_FILE="$BOT_DIR/.paper-bot.pid"

start() {
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
        echo "⚠️  Paper bot already running (pid $(cat $PID_FILE))"
        return 1
    fi
    echo "🚀 Starting multi-factor paper trading bot..."
    echo "   Log: $LOG_FILE"
    echo "   Journal: $JOURNAL_FILE"
    nohup python3 "$BOT_SCRIPT" > "$LOG_FILE" 2>&1 &
    echo $! > "$PID_FILE"
    sleep 1
    if kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
        echo "✅ Bot started (pid $(cat $PID_FILE))"
        echo "   Watch: tail -f $LOG_FILE"
        echo "   Stop:  ./run-paper-bot.sh stop"
    else
        echo "❌ Bot failed to start — check $LOG_FILE"
        rm -f "$PID_FILE"
        return 1
    fi
}

stop() {
    if [ ! -f "$PID_FILE" ]; then
        echo "Bot not running (no pid file)"
        return 0
    fi
    PID=$(cat "$PID_FILE")
    if kill -0 "$PID" 2>/dev/null; then
        echo "Stopping paper bot (pid $PID)..."
        kill "$PID"
        sleep 2
        rm -f "$PID_FILE"
        echo "✅ Bot stopped"
    else
        echo "Bot not running (stale pid file)"
        rm -f "$PID_FILE"
    fi
}

status() {
    echo "=== Paper Trading Bot Status ==="
    if [ -f "$PID_FILE" ] && kill -0 "$(cat $PID_FILE)" 2>/dev/null; then
        echo "🟢 RUNNING (pid $(cat $PID_FILE))"
    else
        echo "🔴 NOT RUNNING"
    fi

    echo ""
    echo "=== Recent Trades ==="
    if [ -f "$JOURNAL_FILE" ]; then
        python3 -c "
import json, sys
try:
    with open('$JOURNAL_FILE') as f:
        j = json.load(f)
    trades = j.get('trades', [])
    sprt = j.get('sprt', {})
    print(f'Total trades: {len(trades)}')
    print(f'SPRT: n={sprt.get(\"n_trades\",0)}, win_rate={sprt.get(\"win_rate\",0):.1%}, progress={sprt.get(\"progress_pct\",0):.0f}%')
    if trades:
        print('')
        print('Last 5 trades:')
        for t in trades[-5:]:
            outcome = '✅' if t.get('result') == 'WIN' else '❌'
            print(f'  {outcome} {t.get(\"asset\",\"?\")} @ {t.get(\"entry_price\",0):.2f} → PnL: {t.get(\"pnl\",0):+.4f} | {t.get(\"primary_factor\",\"?\")}')
except Exception as e:
    print(f'No journal yet: {e}')
" 2>/dev/null
    else
        echo "No journal yet (bot not started or no trades yet)"
    fi

    echo ""
    echo "=== Last 10 log lines ==="
    if [ -f "$LOG_FILE" ]; then
        tail -10 "$LOG_FILE"
    else
        echo "No log file yet"
    fi
}

tail_log() {
    echo "📊 Following paper bot log (Ctrl+C to stop)..."
    tail -f "$LOG_FILE"
}

case "${1:-status}" in
    start)   start ;;
    stop)    stop ;;
    status)  status ;;
    tail)    tail_log ;;
    restart) stop; sleep 1; start ;;
    *)       echo "Usage: $0 [start|stop|status|tail|restart]" ;;
esac
