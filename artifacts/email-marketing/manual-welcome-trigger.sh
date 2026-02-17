#!/bin/bash
# Manual Welcome Email Trigger for Buttondown Free Tier
# Sends the pre-staged welcome draft (a321671d) to first subscribers
# Idempotent — checks draft status before sending to prevent double-sends
#
# Usage: bash manual-welcome-trigger.sh
# Called by noon + evening subscriber check crons

API_KEY=$(grep BUTTONDOWN_API_KEY ~/.credentials/buttondown | cut -d= -f2)
WELCOME_DRAFT_ID="a321671d-0359-4578-8064-060001bbe816"
LOG_DATE=$(date '+%Y-%m-%d %H:%M IST')

echo "[$LOG_DATE] Checking subscriber count..."

# Check subscriber count
RESPONSE=$(curl -s -H "Authorization: Token $API_KEY" "https://api.buttondown.email/v1/subscribers")
COUNT=$(echo "$RESPONSE" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('count', 0))" 2>/dev/null)

echo "[$LOG_DATE] Subscriber count: $COUNT"

if [ "$COUNT" -eq "0" ]; then
  echo "[$LOG_DATE] No subscribers yet. Standing by."
  exit 0
fi

echo "[$LOG_DATE] Subscribers found: $COUNT — checking welcome draft status..."

# Check if welcome draft has already been sent (double-send protection)
DRAFT_RESPONSE=$(curl -s -H "Authorization: Token $API_KEY" "https://api.buttondown.email/v1/emails/$WELCOME_DRAFT_ID")
DRAFT_STATUS=$(echo "$DRAFT_RESPONSE" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('status', 'unknown'))" 2>/dev/null)

echo "[$LOG_DATE] Draft status: $DRAFT_STATUS"

if [ "$DRAFT_STATUS" != "draft" ]; then
  echo "[$LOG_DATE] Welcome email already sent (status: $DRAFT_STATUS). Skipping to prevent double-send."
  exit 0
fi

echo "[$LOG_DATE] Sending pre-staged welcome draft to $COUNT subscriber(s)..."

# Activate the pre-staged welcome draft
SEND_RESPONSE=$(curl -s -X PATCH \
  -H "Authorization: Token $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"status": "about_to_send"}' \
  "https://api.buttondown.email/v1/emails/$WELCOME_DRAFT_ID")

SEND_STATUS=$(echo "$SEND_RESPONSE" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('status', 'error'))" 2>/dev/null)

if [ "$SEND_STATUS" = "about_to_send" ] || [ "$SEND_STATUS" = "sent" ]; then
  echo "[$LOG_DATE] ✅ Welcome email activated — status: $SEND_STATUS — sent to $COUNT subscriber(s)."
else
  echo "[$LOG_DATE] ⚠️ Unexpected response from Buttondown: $SEND_RESPONSE"
  exit 1
fi
