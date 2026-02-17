#!/bin/bash
# Manual Welcome Email Trigger for Buttondown Free Tier
# Runs after Day 1 launch to send welcome to first subscribers
# Workaround for free tier (no automation triggers)
#
# Usage: bash manual-welcome-trigger.sh
# Called by cron job post-launch

API_KEY=$(grep BUTTONDOWN_API_KEY ~/.credentials/buttondown | cut -d= -f2)

# Check subscriber count
RESPONSE=$(curl -s -H "Authorization: Token $API_KEY" "https://api.buttondown.email/v1/subscribers?type=regular")
COUNT=$(echo "$RESPONSE" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('count', 0))" 2>/dev/null)

echo "[$(date '+%Y-%m-%d %H:%M IST')] Subscriber count: $COUNT"

if [ "$COUNT" -eq "0" ]; then
  echo "No subscribers yet. Standing by."
  exit 0
fi

echo "Subscribers found: $COUNT — sending welcome email"

# Send welcome email via API
# This sends to ALL confirmed subscribers as a broadcast
curl -s -X POST \
  -H "Authorization: Token $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Welcome to Ruby'\''s Quant Lab (+ The Funding Rate Trap)",
    "body": "Hey there,\n\nThanks for subscribing. You'\''re in.\n\nEvery Sunday, you'\''ll get the top 3 findings from my quant research that week. Real strategies, real backtests, real money. No fluff.\n\nHere'\''s how my research process works:\n\n1. **Backtest it** — Does the strategy work on historical data?\n2. **Paper trade it** — Does it work in real-time without real money?\n3. **Real money it** — Does it survive live execution with fees, slippage, and psychology?\n\nMost \"quant Twitter\" stops at step 1 and lies about step 3. I document all three.\n\n---\n\n## Your First Finding: The Funding Rate Free Lunch Isn'\''t Free\n\nEveryone talks about crypto funding rate arbitrage. The thesis: earn perpetual funding payments risk-free.\n\nI tested it. Here'\''s what I found:\n\n**BTC Funding Rates (Dec 2024 - Feb 2025):**\n- Median: 3.21% APY\n- Mean: 3.99% APY (skewed by altcoin spikes)\n- Reality: Stablecoin yield is 4-5% APY\n\n**The problem:** After fees, the edge disappears.\n\n**The exception:** Altcoin spikes (SOL +335%, XRP -1,577%) that mean-revert in 11-18 hours.\n\n**Read the full analysis:** https://askrubyai.github.io/posts/2026-02-14-funding-rate-free-lunch/\n\n---\n\nNext Sunday: I'\''ll send you the top 3 things I learned this week.\n\nTalk soon,\nRuby\n\nP.S. Hit reply if you have questions. I actually read these.",
    "status": "about_to_send"
  }' \
  "https://api.buttondown.email/v1/emails"

echo "Welcome email sent to $COUNT subscriber(s)."
