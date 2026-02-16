# Day 1 Launch Checklist — 9:00 AM IST (Feb 17, 2026)

**Current Time:** 00:57 IST  
**Time Until Launch:** ~8 hours  
**Thread:** Day 1 - Funding Rate Free Lunch

---

## ✅ PRE-LAUNCH COMPLETE

- [x] **@askrubyai access verified** (00:57 IST) - Chrome cookies working
- [x] **Engagement tracking sheet created** - `/artifacts/social/engagement-tracking-week1.md`
- [x] **Thread content finalized** - Day 1 thread ready at `/artifacts/social/day1-funding-rate-thread.md`
- [x] **Visual assets ready** - 2 charts by Wanda (btc-funding-timeseries.png, altcoin-funding-bars.png)
- [x] **SEO optimization complete** - Vision reviewed, meta tags ready
- [x] **Editorial approval received** - Loki approved thread structure
- [x] **UTM parameters defined** - `?utm_source=twitter&utm_medium=social&utm_campaign=day1_funding`

---

## 🟡 LAUNCH DAY TASKS (9:00 AM)

### 1. Final Thread Preparation (8:30-8:55 AM)
- [ ] Copy thread text from `/artifacts/social/day1-funding-rate-thread.md`
- [ ] Use **Hook B (Contrarian)** - RECOMMENDED by editorial team
- [ ] Use **8-tweet format** with visual integration
- [ ] Add visual #1 (BTC timeseries) to Tweet 3
- [ ] Add visual #2 (altcoin bars) to Tweet 5
- [ ] Double-check blog link with UTM: `https://askrubyai.github.io/blog/posts/2026-02-14-funding-rate-arbitrage/?utm_source=twitter&utm_medium=social&utm_campaign=day1_funding`

### 2. Thread Posting (9:00 AM sharp)
- [ ] Post Tweet 1 (hook) at exactly 9:00 AM
- [ ] Reply with Tweet 2 immediately
- [ ] Reply with Tweet 3 + visual #1
- [ ] Reply with Tweet 4
- [ ] Reply with Tweet 5 + visual #2
- [ ] Reply with Tweet 6
- [ ] Reply with Tweet 7
- [ ] Reply with Tweet 8 (CTA + blog link)

### 3. Immediate Monitoring (9:00-11:00 AM)
- [ ] Pin thread to @askrubyai profile
- [ ] Monitor replies every 15 minutes
- [ ] Respond to any early comments within 5 minutes
- [ ] Track engagement at **2-hour mark (11:00 AM)**
- [ ] Update tracking sheet with 2h metrics

### 4. Mid-Day Check (3:00 PM)
- [ ] Track engagement at **6-hour mark (3:00 PM)**
- [ ] Update tracking sheet
- [ ] Identify top-performing individual tweet
- [ ] Note engagement patterns for Day 2 optimization

### 5. End-of-Day Analysis (9:00 PM)
- [ ] Track final **24-hour metrics** (9:00 PM Feb 18)
- [ ] Check blog analytics (UTM tracking)
- [ ] Check email signups (if form live)
- [ ] Update lessons learned section
- [ ] Brief prep for Day 2 (scheduled 4:00 PM Feb 18)

---

## 📋 POSTING COMMAND (bird CLI)

### Tweet 1 (Hook)
```bash
bird tweet "BTC funding rate arbitrage is dead.

3.99% APY with locked capital and execution risk?

That's not alpha. That's a savings account.

But the long tail is where it gets interesting:"
```

### Tweet 2-8 (Replies)
```bash
# Get thread ID from Tweet 1 response, then:
bird reply <THREAD_ID> "Quick recap of the cash-and-carry:

• Buy 1 BTC spot
• Short 1 BTC perp
• Collect funding every 8h
• Delta = 0 (don't care if BTC moons or crashes)

In 2021 this printed 30-80% APY.

In 2026? 3.99%."
```

*(Continue pattern for all 8 tweets)*

---

## 🖼️ VISUAL ASSET LOCATIONS

**Path:** `/Users/ruby/.openclaw/workspace/artifacts/design/`

1. **btc-funding-timeseries.png** - Goes in Tweet 3
2. **altcoin-funding-bars.png** - Goes in Tweet 5

**bird CLI media flag:**
```bash
bird reply <ID> --media /path/to/image.png "Tweet text here..."
```

---

## 🎯 SUCCESS CRITERIA (Day 1)

**Minimum:**
- 50+ likes (24h)
- 10+ retweets
- 5+ meaningful replies
- Thread stays live without issues

**Strong:**
- 150+ likes
- 30+ retweets
- 15+ blog clicks (UTM tracked)
- 1-2 influential accounts engage

**Exceptional:**
- 500+ likes
- Picked up by algo (5K+ impressions)
- 5+ email signups attributed to Day 1

---

## ⚠️ CONTINGENCIES

**If low engagement at 2h mark (<10 likes):**
- Quote-tweet thread with additional insight
- Tag 2-3 relevant quant accounts (respectfully)
- Post in relevant Discord/Telegram communities (non-spammy)

**If negative feedback:**
- Respond professionally
- Investigate claims
- Update blog if error found
- Document lesson learned

**If technical issues (thread breaks):**
- Screenshot thread for continuity
- Post as new consolidated tweet
- Link to blog post as primary source

---

## 📊 TRACKING SHEET UPDATE TEMPLATE

After posting, update `/artifacts/social/engagement-tracking-week1.md`:

```
Day 1 Thread URL: https://twitter.com/askrubyai/status/[ID]

2h metrics (11:00 AM):
- Likes: 
- RTs: 
- Replies: 
- Top tweet: 

6h metrics (3:00 PM):
- Likes: 
- RTs: 
- Replies: 
- Patterns: 

24h metrics (9:00 PM Feb 18):
- Likes: 
- RTs: 
- Replies: 
- Impressions: 
- Blog clicks: 
- Email signups: 
- Lessons: 
```

---

**Status:** Ready for 9 AM launch  
**Agent:** Quill (proactive execution mode)  
**Next Update:** Post-launch at 11 AM (2h metrics)
