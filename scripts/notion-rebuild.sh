#!/bin/bash
# Delete all blocks from the Notion page and rebuild with clean perps pitch
NOTION_KEY=$(cat ~/.config/notion/api_key)
PAGE_ID="30745223e6ef819ebf45d7293f586cec"
HEADERS=(-H "Authorization: Bearer $NOTION_KEY" -H "Notion-Version: 2025-09-03" -H "Content-Type: application/json")

# Step 1: Collect ALL block IDs
echo "Collecting block IDs..."
ALL_IDS=()
cursor=""
while true; do
  URL="https://api.notion.com/v1/blocks/$PAGE_ID/children?page_size=100"
  [ -n "$cursor" ] && URL="$URL&start_cursor=$cursor"
  RESP=$(curl -s "$URL" "${HEADERS[@]}")
  IDS=$(echo "$RESP" | python3 -c "import json,sys; [print(b['id']) for b in json.load(sys.stdin).get('results',[])]")
  while IFS= read -r id; do
    [ -n "$id" ] && ALL_IDS+=("$id")
  done <<< "$IDS"
  HAS_MORE=$(echo "$RESP" | python3 -c "import json,sys; print(json.load(sys.stdin).get('has_more',False))")
  if [ "$HAS_MORE" = "True" ]; then
    cursor=$(echo "$RESP" | python3 -c "import json,sys; print(json.load(sys.stdin).get('next_cursor',''))")
  else
    break
  fi
done
echo "Found ${#ALL_IDS[@]} blocks to delete"

# Step 2: Delete all blocks
for id in "${ALL_IDS[@]}"; do
  curl -s -X DELETE "https://api.notion.com/v1/blocks/$id" "${HEADERS[@]}" > /dev/null
  sleep 0.35
done
echo "All blocks deleted"

# Step 3: Update page title
curl -s -X PATCH "https://api.notion.com/v1/pages/$PAGE_ID" "${HEADERS[@]}" \
  -d '{"properties":{"title":{"title":[{"text":{"content":"Fool'\''s Gold — Downside Protection for $GOLD Holders"}}]}}}' > /dev/null
echo "Title updated"

# Step 4: Add new content
curl -s -X PATCH "https://api.notion.com/v1/blocks/$PAGE_ID/children" "${HEADERS[@]}" \
  -d @- > /dev/null << 'BLOCKS1'
{"children":[
  {"object":"block","type":"callout","callout":{"icon":{"emoji":"⚡"},"rich_text":[{"text":{"content":"One slider. Pick your protection. We handle the rest."}}],"color":"yellow_background"}},
  {"object":"block","type":"divider","divider":{}},

  {"object":"block","type":"heading_2","heading_2":{"rich_text":[{"text":{"content":"The Problem"}}]}},
  {"object":"block","type":"paragraph","paragraph":{"rich_text":[{"text":{"content":"$GOLD holders earn 3-4% APY. But gold can drop 10-20% in weeks — wiping out years of yield. There's no on-chain way to hedge this. Users hold and pray, or sell and miss the upside."}}]}},
  {"object":"block","type":"divider","divider":{}},

  {"object":"block","type":"heading_2","heading_2":{"rich_text":[{"text":{"content":"The Solution"}}]}},
  {"object":"block","type":"paragraph","paragraph":{"rich_text":[{"text":{"content":"Fool's Gold puts a floor under your gold. Connect wallet → slide to set protection level → one button → done. We open a short XAU perpetual position sized to your hedge level. If gold drops, your perp profits offset the loss."}}]}},
  {"object":"block","type":"divider","divider":{}},

  {"object":"block","type":"heading_2","heading_2":{"rich_text":[{"text":{"content":"How It Works"}}]}},
  {"object":"block","type":"numbered_list_item","numbered_list_item":{"rich_text":[{"text":{"content":"User connects wallet, we read their $GOLD balance"}}]}},
  {"object":"block","type":"numbered_list_item","numbered_list_item":{"rich_text":[{"text":{"content":"Slider: \"Protect X% of my gold\" (25%, 50%, 75%, 100%)"}}]}},
  {"object":"block","type":"numbered_list_item","numbered_list_item":{"rich_text":[{"text":{"content":"We show estimated monthly cost (funded by Oro yield)"}}]}},
  {"object":"block","type":"numbered_list_item","numbered_list_item":{"rich_text":[{"text":{"content":"Backend: short XAU perpetual on Flash Trade (Solana) or Lighter.xyz"}}]}},
  {"object":"block","type":"numbered_list_item","numbered_list_item":{"rich_text":[{"text":{"content":"Gold drops → perp profits → automatic offset. Gold rises → small funding cost, covered by yield."}}]}},
  {"object":"block","type":"divider","divider":{}},

  {"object":"block","type":"heading_2","heading_2":{"rich_text":[{"text":{"content":"Why Perps (Not Options or Prediction Markets)"}}]}},
  {"object":"block","type":"paragraph","paragraph":{"rich_text":[{"text":{"content":"We explored every on-chain hedging path. Prediction markets (Polymarket/Kalshi) have buckets too wide, thin liquidity, and 3% taker fees. Options don't exist for on-chain gold. Perps are the only viable backend:"}}]}},
  {"object":"block","type":"bulleted_list_item","bulleted_list_item":{"rich_text":[{"text":{"content":"Precise — hedge any exact percentage, no bucket rounding"}}]}},
  {"object":"block","type":"bulleted_list_item","bulleted_list_item":{"rich_text":[{"text":{"content":"Continuous — no expiry dates, no rolling, no gaps"}}]}},
  {"object":"block","type":"bulleted_list_item","bulleted_list_item":{"rich_text":[{"text":{"content":"Liquid — deep pool-backed liquidity, instant execution"}}]}},
  {"object":"block","type":"bulleted_list_item","bulleted_list_item":{"rich_text":[{"text":{"content":"Cheap — funding rate ~2-3% APY vs Oro yield 3-4% APY"}}]}}
]}
BLOCKS1

sleep 1

curl -s -X PATCH "https://api.notion.com/v1/blocks/$PAGE_ID/children" "${HEADERS[@]}" \
  -d @- > /dev/null << 'BLOCKS2'
{"children":[
  {"object":"block","type":"divider","divider":{}},

  {"object":"block","type":"heading_2","heading_2":{"rich_text":[{"text":{"content":"The Math"}}]}},
  {"object":"block","type":"paragraph","paragraph":{"rich_text":[{"text":{"content":"Oro staking yield: ~3-4% APY. Perp funding cost: ~2-3% APY. The yield covers the hedge."}}]}},
  {"object":"block","type":"paragraph","paragraph":{"rich_text":[{"text":{"content":"Cost breakdown by hedge level:"}}]}},

  {"object":"block","type":"table","table":{"table_width":4,"has_column_header":true,"has_row_header":false,"children":[
    {"type":"table_row","table_row":{"cells":[
      [{"text":{"content":"Hedge Level"}}],
      [{"text":{"content":"Annual Cost"}}],
      [{"text":{"content":"Oro Yield"}}],
      [{"text":{"content":"Net to User"}}]
    ]}},
    {"type":"table_row","table_row":{"cells":[
      [{"text":{"content":"25%"}}],
      [{"text":{"content":"~0.6% APY"}}],
      [{"text":{"content":"3.5% APY"}}],
      [{"text":{"content":"+2.9% APY ✅"}}]
    ]}},
    {"type":"table_row","table_row":{"cells":[
      [{"text":{"content":"50%"}}],
      [{"text":{"content":"~1.25% APY"}}],
      [{"text":{"content":"3.5% APY"}}],
      [{"text":{"content":"+2.25% APY ✅"}}]
    ]}},
    {"type":"table_row","table_row":{"cells":[
      [{"text":{"content":"75%"}}],
      [{"text":{"content":"~1.9% APY"}}],
      [{"text":{"content":"3.5% APY"}}],
      [{"text":{"content":"+1.6% APY ✅"}}]
    ]}},
    {"type":"table_row","table_row":{"cells":[
      [{"text":{"content":"100%"}}],
      [{"text":{"content":"~2.5% APY"}}],
      [{"text":{"content":"3.5% APY"}}],
      [{"text":{"content":"+1.0% APY ✅"}}]
    ]}}
  ]}},

  {"object":"block","type":"callout","callout":{"icon":{"emoji":"💡"},"rich_text":[{"text":{"content":"Even at 100% protection, the user still nets ~1% APY. Full downside hedge + positive yield. No other gold product does this."}}],"color":"green_background"}},
  {"object":"block","type":"divider","divider":{}},

  {"object":"block","type":"heading_2","heading_2":{"rich_text":[{"text":{"content":"Where We Hedge"}}]}},

  {"object":"block","type":"table","table":{"table_width":4,"has_column_header":true,"has_row_header":false,"children":[
    {"type":"table_row","table_row":{"cells":[
      [{"text":{"content":"Platform"}}],
      [{"text":{"content":"Chain"}}],
      [{"text":{"content":"Fees"}}],
      [{"text":{"content":"Notes"}}]
    ]}},
    {"type":"table_row","table_row":{"cells":[
      [{"text":{"content":"Flash Trade ⭐"}}],
      [{"text":{"content":"Solana"}}],
      [{"text":{"content":"4 bps"}}],
      [{"text":{"content":"Native Solana, Pyth oracle (same as Oro), up to 500x, pool-to-peer"}}]
    ]}},
    {"type":"table_row","table_row":{"cells":[
      [{"text":{"content":"Lighter.xyz"}}],
      [{"text":{"content":"ZK rollup (ETH)"}}],
      [{"text":{"content":"0 fees"}}],
      [{"text":{"content":"Zero maker/taker fees, 20x leverage, a16z backed"}}]
    ]}},
    {"type":"table_row","table_row":{"cells":[
      [{"text":{"content":"Ostium"}}],
      [{"text":{"content":"Arbitrum"}}],
      [{"text":{"content":"3 bps"}}],
      [{"text":{"content":"200x leverage, $53M TVL, Pantera backed"}}]
    ]}}
  ]}},

  {"object":"block","type":"paragraph","paragraph":{"rich_text":[{"text":{"content":"Flash Trade is the primary backend — same chain as Oro (Solana), same oracle (Pyth), lowest friction for users. Cross-chain venues (Lighter, Ostium) provide redundancy and best-execution routing."}}]}}
]}
BLOCKS2

sleep 1

curl -s -X PATCH "https://api.notion.com/v1/blocks/$PAGE_ID/children" "${HEADERS[@]}" \
  -d @- > /dev/null << 'BLOCKS3'
{"children":[
  {"object":"block","type":"divider","divider":{}},

  {"object":"block","type":"heading_2","heading_2":{"rich_text":[{"text":{"content":"Why This Matters for Oro"}}]}},
  {"object":"block","type":"bulleted_list_item","bulleted_list_item":{"rich_text":[{"text":{"content":"Marketing hook: \"The only tokenized gold with built-in downside protection\""}}]}},
  {"object":"block","type":"bulleted_list_item","bulleted_list_item":{"rich_text":[{"text":{"content":"Attracts larger holders — institutions and whales need hedging to deploy capital"}}]}},
  {"object":"block","type":"bulleted_list_item","bulleted_list_item":{"rich_text":[{"text":{"content":"First mover — zero on-chain gold protection protocols exist (we checked everything)"}}]}},
  {"object":"block","type":"bulleted_list_item","bulleted_list_item":{"rich_text":[{"text":{"content":"Grows with Oro TVL — more $GOLD = more hedging demand = more revenue"}}]}},
  {"object":"block","type":"divider","divider":{}},

  {"object":"block","type":"heading_2","heading_2":{"rich_text":[{"text":{"content":"Build Plan"}}]}},
  {"object":"block","type":"paragraph","paragraph":{"rich_text":[{"text":{"content":"Phase 1 (4 weeks): Smart contracts — Flash Trade integration, position management, Pyth oracle pricing, yield routing"}}]}},
  {"object":"block","type":"paragraph","paragraph":{"rich_text":[{"text":{"content":"Phase 2 (2 weeks): Frontend — slider UX, wallet connect, real-time cost display, portfolio dashboard"}}]}},
  {"object":"block","type":"divider","divider":{}},

  {"object":"block","type":"heading_2","heading_2":{"rich_text":[{"text":{"content":"The Ask"}}]}},
  {"object":"block","type":"paragraph","paragraph":{"rich_text":[{"text":{"content":"GRAIL Grant to build Fool's Gold as a native Oro ecosystem protocol. 2 developers, 6 weeks to MVP. Open-source, composable, revenue-sharing with Oro treasury."}}]}},
  {"object":"block","type":"divider","divider":{}},

  {"object":"block","type":"heading_2","heading_2":{"rich_text":[{"text":{"content":"Team"}}]}},
  {"object":"block","type":"paragraph","paragraph":{"rich_text":[{"text":{"content":"Reuben Rapose — Founding engineer at Trepa (funded by Balaji & Colosseum). Solana developer. Previously built prediction market infrastructure, quantitative trading systems, and DeFi tooling."}}]}},
  {"object":"block","type":"divider","divider":{}},
  {"object":"block","type":"paragraph","paragraph":{"rich_text":[{"text":{"content":"Fool's Gold: Your gold. Your floor. Sleep well.","link":null},"annotations":{"bold":false,"italic":true,"strikethrough":false,"underline":false,"code":false,"color":"default"}}]}}
]}
BLOCKS3

echo "Done! New content added."
