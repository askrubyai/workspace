#!/bin/bash

# Download all OnlyDevs podcast transcripts
PLAYLIST_URL="https://www.youtube.com/playlist?list=PLwBgkDjcfBZTNpDv2gqwFuLj7vXeRP5gt"

# Get all video IDs
VIDEO_IDS=($(yt-dlp --flat-playlist --print id "$PLAYLIST_URL"))

echo "Found ${#VIDEO_IDS[@]} episodes"
echo "Downloading transcripts..."

cd transcripts

for i in "${!VIDEO_IDS[@]}"; do
    VIDEO_ID="${VIDEO_IDS[$i]}"
    EPISODE_NUM=$(printf "%02d" $((i + 1)))
    
    echo "[$EPISODE_NUM/${#VIDEO_IDS[@]}] Downloading transcript for $VIDEO_ID..."
    
    # Download VTT subtitle
    yt-dlp --write-auto-sub --sub-lang en --skip-download \
        --sub-format vtt \
        "https://www.youtube.com/watch?v=$VIDEO_ID" \
        -o "episode-${EPISODE_NUM}-raw" 2>&1 | grep -E "(Writing|ERROR|WARNING)"
    
    # Small delay to avoid rate limiting
    sleep 2
done

echo "✅ All transcripts downloaded!"
