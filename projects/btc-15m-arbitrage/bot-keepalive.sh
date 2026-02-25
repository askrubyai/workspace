#!/bin/bash
while true; do
    echo "[$(date)] Starting bot..."
    python3 -u live-bot-v1.py >> bot-continuous.log 2>&1
    EXIT_CODE=$?
    echo "[$(date)] Bot exited with code $EXIT_CODE, waiting 30s..."
    sleep 30
done
