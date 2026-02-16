# TREPPA DESIGN DOCUMENTS FOR REVIEW
*Consolidated for Reuben - Feb 4, 2026*

---

# Treppa Design Research Doc
## 60-Second Live Bitcoin Pools - Platform Redesign Sprint

*Prepared for: Reuben's 4-5 hour morning sprint*
*Date: Feb 4, 2026*

---

## Executive Summary

Treppa is building 60-second live Bitcoin prediction pools on Solana. This is essentially **binary options for crypto** - users predict if BTC will go up or down within the next 60 seconds and either win or lose their stake.

The key challenge: Making a high-frequency, high-stakes product feel **simple, trustworthy, and addictive** while avoiding the "gambling" stigma.

---

## 1. Market Context

### What 60-Second Trading Is
- Ultra-short-term binary prediction: UP or DOWN
- Fixed payout ratios (typically 80-95% for winners)
- Pool-based liquidity (winners paid from losers' stakes minus house cut)
- Fast dopamine loops → high engagement but high churn risk

### Competitive Landscape

| Platform | Timeframe | Asset | Differentiator |
|----------|-----------|-------|----------------|
| Polymarket | Days-weeks | Events | News-driven, community |
| Azuro | Hours-days | Sports | DeFi rails, B2B focus |
| Stake.com | Minutes | Crypto | Centralized, gambling UX |
| Up vs Down | 15 min | Crypto | Polymarket 15-min pools |
| **Treppa** | 60 sec | BTC | Solana speed, DeFi native |

### Why 60 Seconds?
- **Solana's speed** enables true 60-sec settlement (Ethereum can't)
- **Higher engagement** than 15-min (more rounds = more revenue)
- **Skill element** still exists (technical analysis possible)
- **Risk**: Feels more like gambling → regulatory scrutiny

---

## 2. User Psychology (CRITICAL)

### The Target User
1. **Crypto degens** - Already comfortable with volatility, looking for action
2. **Trading addicts** - Want the dopamine without complex setups
3. **Whale gamers** - High net worth looking for high stakes
4. **Casual thrill-seekers** - Just want to feel something

### Psychological Hooks

**Positive (use these):**
- **Near-misses** - Show how close they were to winning
- **Streaks** - Celebrate winning streaks, downplay losses
- **Leaderboards** - Social proof and competition
- **Time pressure** - Countdown creates urgency
- **Simple choice** - Binary decision reduces cognitive load

**Negative (avoid these):**
- Loss-chasing mechanics
- Infinite scroll of opportunities
- Hidden fees or confusing payouts
- Gambling-style sound effects

### Key Insight
> "Make it feel like **trading**, not gambling. The UI should feel like a Bloomberg terminal for degens, not a slot machine."

---

## 3. UX Design Principles

### 3.1 Information Hierarchy

**Primary (Hero Area):**
- Current BTC price (LARGE, live-updating)
- Time countdown (60 sec, prominent)
- UP/DOWN buttons with current pool sizes

**Secondary:**
- Your active positions
- Recent results (your wins/losses)
- Current odds/payouts

**Tertiary:**
- Leaderboard
- Historical charts
- Settings/wallet

### 3.2 The Core Loop

```
[Price Display] → [Countdown: 60s] → [UP/DOWN Choice] → [Watch & Wait] → [Result] → [Repeat]
                                           ↓
                                    [Enter Amount]
```

### 3.3 Mobile-First Design

60-second trading is **perfect for mobile**:
- Quick sessions (can play while waiting for coffee)
- Simple interaction (one tap to predict)
- Push notifications for results

**Key Mobile UX:**
- Large touch targets for UP/DOWN
- Swipe gestures for quick entries
- Haptic feedback on wins
- One-handed operation possible

### 3.4 Trust Signals

Users need to trust the system is fair:
- **Live on-chain verification** - Show tx hashes
- **Provably fair randomness** - Chainlink VRF for resolution
- **Transparent pool mechanics** - Show all stakes in real-time
- **Audit badges** - Security audit completion (Anam's work!)

---

## 4. Feature Priorities

### Must Have (MVP)
- [ ] Live BTC price feed (Chainlink/Pyth)
- [ ] 60-second countdown timer
- [ ] UP/DOWN prediction UI
- [ ] Wallet integration (Phantom, Solflare)
- [ ] Position tracking
- [ ] Win/loss settlement
- [ ] Transaction history

### Should Have (V1.1)
- [ ] Leaderboard (daily/weekly/all-time)
- [ ] Streak tracking and badges
- [ ] Multiple stake amounts (presets)
- [ ] Sound on/off toggle
- [ ] Share wins to Twitter

### Nice to Have (V2)
- [ ] ETH/SOL pools (multi-asset)
- [ ] Longer timeframes (5 min, 15 min options)
- [ ] Social features (follow traders)
- [ ] Copy trading
- [ ] Mobile app (native)

---

## 5. Visual Design Direction

### Color Psychology
- **Green** = UP (bullish, money, go)
- **Red** = DOWN (bearish, stop)
- **Dark mode default** - Crypto natives expect it
- **Accent color** - Gold/yellow for wins, rewards

### Typography
- **Price**: Large, bold, monospace (feels financial)
- **Countdown**: Digital clock style
- **Body**: Clean sans-serif (Inter, Satoshi)

### Animation
- **Price updates**: Subtle flash on change
- **Countdown**: Smooth tick, urgent < 10 sec
- **Win/Loss**: Celebration vs. subtle fade
- **Pool changes**: Live-updating numbers

### Reference Designs
1. Polymarket's clean, confident layout
2. TradingView's chart professionalism
3. Robinhood's gamified simplicity
4. Stake.com's dark, high-energy aesthetic

---

## 6. Technical Considerations

### Oracle Integration
- **Primary**: Chainlink BTC/USD on Solana
- **Backup**: Pyth Network
- **Resolution**: Use price at T+60s vs T+0

### Smart Contract Flow
```
1. User submits prediction (UP/DOWN) + stake
2. Contract locks stake, records entry price
3. After 60s, oracle reports new price
4. Contract compares, settles winners
5. Losers' stakes distributed to winners (minus fee)
```

### Fee Structure
- **Typical**: 2-5% of losing pool
- **Revenue split**: Platform / LPs / Insurance fund
- **Gas abstraction**: Hide Solana fees in spread

---

## 7. Regulatory Considerations

### The Reality
60-second binary predictions are **legally ambiguous**:
- Could be classified as **gambling** (bad)
- Could be **derivatives** (regulated)
- Could be **prediction markets** (emerging framework)

### Risk Mitigation
- No US users (geofencing)
- Skill-based marketing ("trading" not "betting")
- Clear risk disclosures
- KYC for large withdrawals
- Responsible gambling features (deposit limits)

---

## 8. Sprint Priorities

### For the 4-5 hour sprint, focus on:

**Hour 1: Core Layout**
- [ ] Desktop wireframe: main trading screen
- [ ] Mobile wireframe: portrait layout
- [ ] Component library start

**Hour 2: Interaction Design**
- [ ] UP/DOWN button states
- [ ] Countdown timer behavior
- [ ] Entry flow (amount → confirm → submit)

**Hour 3: Visual Design**
- [ ] Color palette finalization
- [ ] Typography scale
- [ ] Key component styling (buttons, cards, inputs)

**Hour 4: Polish & Edge Cases**
- [ ] Win/loss states
- [ ] Loading states
- [ ] Error states
- [ ] Empty states

**Hour 5: Prototype**
- [ ] Clickable prototype in Figma
- [ ] Key flows connected
- [ ] Ready for team review

---

## 9. Questions to Answer in Sprint

1. **Entry UX**: Preset amounts vs. custom input vs. slider?
2. **Multiple positions**: Can users bet on same round multiple times?
3. **Pool visibility**: Show all bettors or just totals?
4. **Resolution animation**: How to display win/loss moment?
5. **Sound design**: Yes/no? Volume control?

---

## 10. Success Metrics

### User Metrics
- **Round participation rate**: % of users who play each round
- **Session length**: Time spent per visit
- **Retention**: Day 1, Day 7, Day 30
- **Win rate perception**: Do users feel it's fair?

### Business Metrics
- **GMV**: Total volume traded
- **Take rate**: Revenue as % of volume
- **LTV:CAC**: Customer value vs. acquisition cost

---

## Appendix: Competitive Screenshots to Study

1. **Polymarket** - Clean market cards, simple YES/NO
2. **Stake.com Crypto Games** - High-energy, dopamine-focused
3. **Binance Futures** - Professional, dense information
4. **Robinhood** - Simplified, accessible trading

---

*Document prepared by Ruby | Ready for Reuben's morning sprint*


---


# 🎰 TREPPA 60-SECOND POOLS: DESIGN BIBLE

*A comprehensive design research document for building high-dopamine, gamified prediction pools*

---

## 🎯 THE VISION

> **"Every 60 seconds there's a new race."**

Treppa's 60-second pools are designed to be the most addictive, high-tension betting experience in crypto. Think horse racing meets crash gambling meets Polymarket - where the race never stops.

**Core Emotions to Evoke:**
- 🔥 **Tension** - The countdown creates anticipation
- ⚡ **Adrenaline** - Fast resolution = instant dopamine hits
- 🎪 **Spectacle** - Watching others win/lose in real-time
- 🏆 **Status** - Leaderboards, streaks, badges

---

## 📐 DESIGN PRINCIPLES

### 1. Dark Mode Is Non-Negotiable
Every major betting/gambling platform uses dark themes:
- **Polymarket**: #1A1B23 background
- **Kalshi**: #111111 background  
- **Stake**: Pure black #000
- **Roobet**: #191D24 background
- **BC.Game**: #1C2127 background

**Why?** Dark mode:
- Reduces eye strain during extended sessions
- Makes accent colors pop (green gains, red losses)
- Creates a "casino floor" atmosphere
- Hides interface, focuses on content

### 2. One Loud Accent Color
Pick ONE primary accent and commit:
| Platform | Primary Accent | Usage |
|----------|---------------|-------|
| Polymarket | Cyan `#00D1FF` | Buttons, highlights |
| Kalshi | Green `#00C853` | CTAs, positive |
| Roobet | Yellow `#FFD700` | Buttons, prizes |
| Robinhood | Lime `#9EFF00` | CTAs, gains |
| BC.Game | Green `#00FF7F` | Buttons, branding |

**Recommendation for Treppa**: Electric Green `#00FF88` or Neon Purple `#A855F7`

### 3. Big Numbers, Small Labels
```
┌────────────────────────────────┐
│     $12,847.32                 │  ← Giant, bold
│     Your Balance               │  ← Small, muted
└────────────────────────────────┘
```
The number is what matters. Labels are supporting cast.

### 4. Motion Creates Emotion
- Countdowns with smooth animations
- Price/odds changes with micro-transitions
- Win animations with particles/confetti
- Loss animations (more subtle, quick fade)

---

## 🎨 VISUAL REFERENCES BY CATEGORY

### A. PREDICTION MARKETS (Clean, Data-Rich)

#### Polymarket
**Screenshot**: `polymarket-home.png`
**What to steal:**
- Card-based market layout
- Binary YES/NO buttons with odds
- Color-coded probability (green/red)
- "Live" indicator with pulsing dot
- Volume badges showing activity
- Quick-filter pills at top

**Key Pattern**: Each market is a self-contained betting card:
```
┌─────────────────────────────────────┐
│ 🇺🇸 US strikes Iran by...?          │
│ February 13    14%   [Yes] [No]    │
│ February 20    19%   [Yes] [No]    │
│ $164m Vol. 📊                       │
└─────────────────────────────────────┘
```

#### Kalshi  
**Screenshot**: `kalshi-home.png`
**What to steal:**
- Live sports integration with real-time scores
- Price charts showing odds movement over time
- Two-column odds display (team A vs team B)
- Potential payout calculation shown inline
- "Alpha design preview" toggle for new features

**Key Pattern**: Live event + betting in one view:
```
┌─────────────────────────────────────────────┐
│  🏈 REG TIME • EFL Cup                       │
│  Arsenal vs Chelsea                          │
│  ┌────────┐ ┌────────┐ ┌────────┐          │
│  │ARS 44¢ │ │  TIE   │ │CFC 24¢ │          │
│  └────────┘ └────────┘ └────────┘          │
│  $100 → $219        $100 → $—              │
│                                             │
│  📈 [Live chart showing Arsenal at 44%]     │
└─────────────────────────────────────────────┘
```

#### Manifold Markets
**Screenshot**: `manifold.png`
**What to steal:**
- Colorful probability distribution bars
- Simple "Bet" button on every row
- Trader count for social proof
- Price change indicators (+8, -15)
- "Best/Hot/New" sorting tabs
- Starting bonus callout ("Get Ⓜ1,000 to start trading!")

---

### B. CRYPTO CASINOS (High-Energy, Gamified)

#### Roobet
**Screenshot**: `roobet-home.png`
**What to steal:**
- Purple/violet theme with yellow CTAs
- "$100,000 Weekly Raffle" promotion banner
- Countdown timer with urgency
- "Total Bets Placed: 12,554,258,438" social proof
- VIP Club section for retention
- "Roobet Originals" in-house games carousel
- Soccer player imagery for sports integration

**Key Patterns:**
1. **Gamified promotions**: Raffles, bonuses, time-limited rewards
2. **Social proof**: Massive numbers showing platform activity
3. **Category organization**: Left sidebar with game types
4. **Original games**: Branded, exclusive experiences

#### BC.Game
**Screenshot**: `bc-game.png`
**What to steal:**
- "Stay Untamed" rebellious branding
- SITENAME Token price ticker in sidebar
- "Recent Big Wins" showing live wins with amounts
- Multiple sign-in options (Google, MetaMask, passkey)
- "UPDOWN" game (directly relevant to Treppa!)
- Crash game prominently featured

**Key Pattern - Recent Wins:**
```
● Recent Big Wins   All   SITENAME
┌─────────────────────────────────┐
│ 🎰 SEAMEN    doBab...  ₿7.23K  │
│ 🃏 SQUEEZE   Suerte... $105.93K │
│ 🎲 PRINCESS  doBab...  $102.28K │
└─────────────────────────────────┘
```
Shows game icon, game name, username, win amount - creates FOMO.

#### Primedice
**Screenshot**: `primedice.png` (may need manual visit)
**What to steal:**
- Minimalist crash/dice interface
- Provably fair verification visible
- Bet history feed
- Multiplier displays

#### CSGOEmpire (HIGHLY RELEVANT!)
**Screenshot**: `csgo-crash.png`
**What to steal:**
- **Three-column betting layout** showing UP/DOWN/DRAW (or just UP/DOWN for Treppa)
- **Live bettor list** in each column showing:
  - User avatar
  - User level badge
  - Username  
  - Bet amount
- **Previous rounds history** at top ("LAST 100: 53 ⚫ 9 🟡 38 🔴")
- **Quick amount buttons**: +0.01, +0.1, +1, +10, +100, 1/2, X2, MAX
- **Sound toggle** prominently displayed
- **Rolling animation** with multiplier display

**Key Pattern - Live Bettor Columns:**
```
┌──────────────────┐ ┌──────────────────┐
│  🟢 UP           │ │  🔴 DOWN         │
│  PLACE BET  2x   │ │  PLACE BET  2x   │
├──────────────────┤ ├──────────────────┤
│  8 Bets  $30.57  │ │  26 Bets $813.80 │
├──────────────────┤ ├──────────────────┤
│ 👤 Lv99 whale $12│ │ 👤 Lv73 degen$400│
│ 👤 Lv44 user $11 │ │ 👤 Lv101 big $200│
│ 👤 Lv18 noob $8  │ │ 👤 Lv89 mid $110 │
└──────────────────┘ └──────────────────┘
```
This creates massive social proof and FOMO - you see real people betting in real-time!

---

### C. GAMIFICATION PATTERNS (Retention Mechanics)

#### From Dribbble Research
**Screenshots**: `dribbble-gamification.png`, `dribbble-gambling-ui.png`

**Patterns to Implement:**

1. **Achievement System**
```
┌─────────────────────────────────┐
│ 🏆 ACHIEVEMENTS                  │
│ ┌──────┐ ┌──────┐ ┌──────┐     │
│ │ 🔥   │ │ 💎   │ │ 🚀   │     │
│ │3 Day │ │$1000 │ │First │     │
│ │Streak│ │Win   │ │Pool  │     │
│ └──────┘ └──────┘ └──────┘     │
└─────────────────────────────────┘
```

2. **Streak Counter**
```
🔥 3 DAY STREAK
Keep it going! Win one more to unlock 2x bonus.
[████████░░] 80% to next reward
```

3. **Level System**
```
Level 7 • 2,450 XP
━━━━━━━━━━━━━━━━━━━━━░░░░░ 78%
550 XP to Level 8 → Unlock Purple Username
```

4. **Mystery Box / Rewards**
- Daily free spins
- Random bonus multipliers
- Surprise airdrops for active users

5. **Leaderboard**
```
🏆 TODAY'S TOP WINNERS
1. 🥇 whale_123     +$45,230
2. 🥈 degen_mike    +$23,450
3. 🥉 cryptoboi     +$18,990
   ...
47. you            +$234
```

---

### D. TRADING DASHBOARDS (Data Visualization)

#### From Dribbble Research
**Screenshots**: `dribbble-crypto-dashboard.png`, `dribbble-trading-ui.png`

**Patterns for Pool Statistics:**

1. **Portfolio-Style Display**
```
┌─────────────────────────────────────────┐
│ YOUR POOL POSITIONS                      │
│ ┌─────────────────────────────────────┐ │
│ │ BTC 60s Pool #4521                  │ │
│ │ UP @ $0.52  →  Current: $0.68 🟢    │ │
│ │ +30.7% │ 23s remaining              │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

2. **Live Price Charts**
- Gradient fill under the line
- Current price highlighted
- Entry point marker
- Time remaining overlay

3. **Statistics Grid**
```
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│$12,847 │ │  67%   │ │  234   │ │ 12.4x  │
│Balance │ │Win Rate│ │ Pools  │ │Best Win│
└────────┘ └────────┘ └────────┘ └────────┘
```

---

## 🕹️ THE 60-SECOND POOL INTERFACE

Based on all research, here's the ideal layout:

### Mobile-First Design (Primary)
```
┌─────────────────────────────────────┐
│  ≡  TREPPA           💰 $1,234.56  │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │     ₿ BTC/USDT              │   │
│  │     $97,234.56              │   │
│  │     [Live Price Chart]       │   │
│  │                              │   │
│  │  ○ $97,180 start            │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │         ⏱️ 0:47              │   │
│  │    ━━━━━━━━━━━━━░░░░░░      │   │
│  │                              │   │
│  │   🟢 UP          🔴 DOWN    │   │
│  │   $0.52          $0.48      │   │
│  │   1.92x          2.08x      │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ Amount: [$50      ] [MAX]    │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌────────────┐ ┌────────────┐     │
│  │  🟢 UP     │ │  🔴 DOWN   │     │
│  │  BET $50   │ │  BET $50   │     │
│  │  Win $96   │ │  Win $104  │     │
│  └────────────┘ └────────────┘     │
│                                     │
│  ─────────────────────────────────  │
│  📊 Pool Stats                      │
│  Total Pool: $45,230 │ 234 bettors │
│  UP: 52% ($23,520) DOWN: 48% ($21,710)│
│                                     │
│  ─────────────────────────────────  │
│  🏆 Live Winners                    │
│  @whale • UP +$2,340 • 3s ago      │
│  @degen • DOWN +$890 • 12s ago     │
│                                     │
├─────────────────────────────────────┤
│ 🏠 Home  │ 🎰 Pools │ 🏆 Board │ 👤 │
└─────────────────────────────────────┘
```

### Desktop Layout
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  🎰 TREPPA    [BTC] [ETH] [SOL] [XRP]           💰 $1,234.56   👤 Profile   │
├────────────────────────────────────────────────────────────────────────────────
│                                                                              │
│  ┌───────────────────────────────────┐  ┌──────────────────────────────────┐│
│  │  ₿ BTC 60-SECOND POOL #4521       │  │  🏆 LEADERBOARD (Today)          ││
│  │  Pool closes in: ⏱️ 0:47          │  │  1. whale_123    +$45,230        ││
│  │                                    │  │  2. degen_mike   +$23,450        ││
│  │  [==== Live Price Chart ====]      │  │  3. cryptoboi    +$18,990        ││
│  │                                    │  │  ...                             ││
│  │  Start: $97,180   Current: $97,234 │  │  47. you         +$234           ││
│  │                                    │  └──────────────────────────────────┘│
│  │  ┌────────────────────────────┐   │                                       │
│  │  │ [━━━━━━━━━━━━░░░░░░░░░░░] │   │  ┌──────────────────────────────────┐│
│  │  │           47 SEC           │   │  │  📊 YOUR STATS                   ││
│  │  └────────────────────────────┘   │  │  Win Rate: 67%                   ││
│  │                                    │  │  Total Pools: 234                ││
│  │  ┌─────────────┐ ┌─────────────┐  │  │  Profit: +$3,456                 ││
│  │  │  🟢 UP      │ │  🔴 DOWN    │  │  │  🔥 5 Day Streak                 ││
│  │  │   52%       │ │    48%      │  │  └──────────────────────────────────┘│
│  │  │  $0.52      │ │   $0.48     │  │                                       │
│  │  │  1.92x      │ │   2.08x     │  │  ┌──────────────────────────────────┐│
│  │  └─────────────┘ └─────────────┘  │  │  🎰 LIVE ACTIVITY                ││
│  │                                    │  │  @whale bet $500 UP • now        ││
│  │  Amount: [$100    ] [25%][50%][MAX]│  │  @degen bet $250 DOWN • 2s       ││
│  │                                    │  │  @moon won +$1,230 • 5s          ││
│  │  ┌─────────────┐ ┌─────────────┐  │  │  @rekt lost -$500 • 8s           ││
│  │  │ BET UP $100 │ │BET DOWN $100│  │  │  @whale bet $1000 UP • 12s       ││
│  │  │ Win: $192   │ │ Win: $208   │  │  └──────────────────────────────────┘│
│  │  └─────────────┘ └─────────────┘  │                                       │
│  └───────────────────────────────────┘                                       │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  NEXT POOLS:  BTC #4522 in 13s │ ETH #2103 in 8s │ SOL #1567 in 23s   │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎬 MICRO-INTERACTIONS & ANIMATIONS

### 1. Countdown Timer
- Smooth second-by-second animation
- Color shift: Green (60-30s) → Yellow (30-10s) → Red (10-0s)
- Pulsing effect in final 10 seconds
- Subtle screen shake at 3, 2, 1

### 2. Betting Confirmation
```
User clicks "BET UP $100"
→ Button compresses slightly
→ Ripple effect from click point
→ Checkmark appears
→ Toast: "Bet placed! Good luck 🍀"
→ Amount animates into position count
```

### 3. Win Animation
```
Pool resolves UP (you bet UP)
→ Screen flashes green briefly
→ Confetti particles from edges
→ Your win amount counts up: $0 → $192
→ Sound: Ka-ching!
→ Achievement popup if applicable
```

### 4. Loss Animation
Keep it subtle (don't punish):
```
Pool resolves DOWN (you bet UP)
→ Brief red flash on your bet card only
→ Amount fades to grey
→ "Better luck next time" message
→ Quick transition to next pool
```

### 5. Live Activity Feed
```
New bet comes in
→ Slide in from right
→ Highlight briefly
→ Join list, push others down
```

---

## 🎨 COLOR SYSTEM

### Primary Palette (Dark Theme)
```css
--bg-primary: #0A0A0B;      /* Main background */
--bg-secondary: #111113;    /* Cards, panels */
--bg-tertiary: #1A1A1D;     /* Hover states, inputs */

--text-primary: #FFFFFF;    /* Headings, important */
--text-secondary: #A1A1AA;  /* Body text */
--text-muted: #52525B;      /* Labels, hints */

--accent: #00FF88;          /* Primary action color */
--accent-hover: #00CC6A;    /* Hover state */

--up: #22C55E;              /* Up/Win/Positive */
--up-bg: rgba(34, 197, 94, 0.1);
--down: #EF4444;            /* Down/Loss/Negative */
--down-bg: rgba(239, 68, 68, 0.1);

--warning: #FBBF24;         /* Warnings, countdown */
--info: #3B82F6;            /* Information */
```

### Gradient Options
```css
/* Hero/Feature sections */
--gradient-hero: linear-gradient(135deg, #0A0A0B 0%, #1A1A2E 100%);

/* Accent glow */
--glow-accent: 0 0 20px rgba(0, 255, 136, 0.3);

/* Win celebration */
--gradient-win: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);
```

---

## 📝 TYPOGRAPHY

### Font Stack
```css
/* Headings - Bold, impactful */
font-family: 'Inter', 'SF Pro Display', -apple-system, sans-serif;

/* Numbers - Tabular for alignment */
font-family: 'JetBrains Mono', 'SF Mono', monospace;
font-variant-numeric: tabular-nums;

/* Body - Clean, readable */
font-family: 'Inter', -apple-system, sans-serif;
```

### Scale
```css
--text-xs: 0.75rem;    /* 12px - Labels */
--text-sm: 0.875rem;   /* 14px - Secondary text */
--text-base: 1rem;     /* 16px - Body */
--text-lg: 1.125rem;   /* 18px - Emphasis */
--text-xl: 1.25rem;    /* 20px - Card titles */
--text-2xl: 1.5rem;    /* 24px - Section headers */
--text-3xl: 1.875rem;  /* 30px - Page titles */
--text-4xl: 2.25rem;   /* 36px - Hero numbers */
--text-5xl: 3rem;      /* 48px - Big stats */
```

---

## 🔊 SOUND DESIGN (Optional but Powerful)

**Ambient:**
- Subtle background hum during countdown
- Heartbeat pulse in final 10 seconds

**Actions:**
- Bet placed: Soft "click"
- Timer tick (final 5s): Subtle tick
- Pool resolve: Whoosh
- Win: Satisfying "ka-ching"
- Big win (>$1000): Extended celebration sound

**Notifications:**
- New pool available: Subtle chime
- Friend activity: Quick blip

*Note: All sounds should be optional with easy mute toggle*

---

## 📱 COMPONENT LIBRARY

### 1. Pool Card
```jsx
<PoolCard
  asset="BTC"
  poolNumber={4521}
  timeRemaining={47}
  upOdds={0.52}
  downOdds={0.48}
  totalPool={45230}
  bettorCount={234}
  status="live" // live | pending | resolved
/>
```

### 2. Bet Button
```jsx
<BetButton
  direction="up" // up | down
  amount={100}
  potentialWin={192}
  odds={1.92}
  disabled={false}
/>
```

### 3. Countdown Timer
```jsx
<Countdown
  seconds={47}
  total={60}
  warningAt={10}
  criticalAt={3}
/>
```

### 4. Activity Feed
```jsx
<ActivityFeed
  items={[
    { user: "@whale", action: "bet", direction: "up", amount: 500, time: "now" },
    { user: "@degen", action: "won", amount: 1230, time: "5s ago" },
  ]}
  maxItems={10}
/>
```

### 5. Leaderboard
```jsx
<Leaderboard
  period="today" // today | week | all-time
  entries={[
    { rank: 1, user: "whale_123", profit: 45230 },
    // ...
  ]}
  highlightUser="current_user_id"
/>
```

---

## 🚀 PRIORITY FEATURES FOR MVP

### Must Have (Day 1)
1. ✅ Pool card with countdown
2. ✅ UP/DOWN betting buttons
3. ✅ Live price chart
4. ✅ Balance display
5. ✅ Basic win/loss feedback

### Should Have (Week 1)
1. 📊 Pool statistics (total pool, bettors)
2. 📜 Transaction history
3. 🎯 Multiple asset pools (BTC, ETH, SOL, XRP)
4. 📱 Mobile-responsive design

### Nice to Have (Week 2+)
1. 🏆 Leaderboard
2. 🔥 Streak counter
3. 📣 Live activity feed
4. 🎖️ Achievements
5. 🔊 Sound effects
6. 🎁 Daily rewards

---

## 📚 REFERENCE LINKS

### Live Sites to Study
- **Polymarket**: https://polymarket.com (prediction market)
- **Kalshi**: https://kalshi.com (regulated, clean UI)
- **Manifold**: https://manifold.markets (play money, fun)
- **Roobet**: https://roobet.com (gamification king)
- **BC.Game**: https://bc.game (crypto casino)

### Design Inspiration
- **Dribbble Betting**: https://dribbble.com/tags/betting-app
- **Dribbble Gambling UI**: https://dribbble.com/tags/gambling-ui
- **Dribbble Gamification**: https://dribbble.com/search/gamification-ui
- **Dribbble Crypto Dashboard**: https://dribbble.com/search/crypto-dashboard

### Screenshots Captured
All screenshots saved to:
`/artifacts/research/design-screenshots/`

Key files:
- `polymarket-home.png` - Card layout, odds display
- `kalshi-home.png` - Live sports, price charts
- `roobet-home.png` - Gamification, promotions
- `bc-game.png` - Recent wins, sidebar nav
- `manifold.png` - Probability bars, simple CTA
- `dribbble-betting-app.png` - UI concepts gallery
- `dribbble-gambling-ui.png` - Casino interfaces
- `dribbble-gamification.png` - Achievement systems

---

## 💡 FINAL THOUGHTS

**The 60-second pool is essentially a "crash game meets binary options meets prediction market."**

The key differentiator is:
1. **Speed** - Every 60 seconds is a new opportunity
2. **Simplicity** - UP or DOWN, nothing complex
3. **Social** - See others betting/winning in real-time
4. **Gamification** - Streaks, achievements, leaderboards

**Design Philosophy:**
> Make it feel like a game, not a trading terminal.
> Every interaction should provide dopamine feedback.
> Speed creates urgency; urgency creates action.

---

*Document created: Feb 4, 2026 | Ruby*
*Screenshots: 32 captured across prediction markets, casinos, and design galleries*



---


# 🚀 DESIGN SPRINT CHEATSHEET
*Quick reference for Treppa 60s Pools*

---

## 🎨 COLOR PALETTE (Copy-Paste Ready)

```css
/* Backgrounds */
--bg-dark: #0A0A0B;
--bg-card: #111113;
--bg-hover: #1A1A1D;

/* Text */
--text-white: #FFFFFF;
--text-gray: #A1A1AA;
--text-muted: #52525B;

/* Actions */
--accent: #00FF88;
--up: #22C55E;
--down: #EF4444;
--warning: #FBBF24;
```

---

## 📐 COMPONENT SIZES

| Component | Mobile | Desktop |
|-----------|--------|---------|
| Button Height | 48px | 44px |
| Card Padding | 16px | 24px |
| Border Radius | 12px | 16px |
| Font Body | 14px | 16px |
| Font Heading | 20px | 24px |
| Timer Font | 36px | 48px |

---

## 🔥 MUST-HAVE ELEMENTS

### Pool Card Anatomy
```
┌────────────────────────────────────┐
│ 1. Asset Icon + Name (₿ BTC/USDT) │
│ 2. Live Price + Change indicator  │
│ 3. Mini Price Chart               │
│ 4. Countdown Timer (BIG)          │
│ 5. Progress Bar (time remaining)  │
│ 6. UP/DOWN Odds Display           │
│ 7. Amount Input + Quick Buttons   │
│ 8. BET UP / BET DOWN Buttons      │
│ 9. Potential Win Amount           │
└────────────────────────────────────┘
```

### Quick Amount Buttons
`[+1] [+5] [+10] [+50] [1/2] [2X] [MAX]`

---

## ⏱️ TIMER STATES

| Seconds | Color | Effect |
|---------|-------|--------|
| 60-30 | Green | Normal |
| 30-10 | Yellow | Subtle pulse |
| 10-3 | Red | Faster pulse |
| 3-0 | Red | Shake + intense pulse |

---

## 🎬 KEY ANIMATIONS

1. **Countdown tick** - Smooth number transition
2. **Bet placed** - Button compress + ripple
3. **Price change** - Flash green/red briefly
4. **Win** - Confetti + count-up animation
5. **New pool** - Slide transition

---

## 📱 MOBILE BOTTOM NAV

```
┌────────────────────────────────────┐
│ 🏠 Home │ 🎰 Pools │ 🏆 Board │ 👤 │
└────────────────────────────────────┘
```

---

## 🏆 SOCIAL PROOF ELEMENTS

1. **Total Pool Amount**: "$45,230 in pool"
2. **Bettor Count**: "234 bettors"
3. **Live Wins Feed**: "@whale won +$1,230"
4. **Leaderboard**: Top 10 daily winners
5. **Your Stats**: Win rate, streak, profit

---

## 📸 SCREENSHOT QUICK REFERENCE

| Need | File | Key Element |
|------|------|-------------|
| Prediction cards | `polymarket-home.png` | Card layout, odds |
| Live sports | `kalshi-home.png` | Price charts, live |
| Gamification | `roobet-home.png` | Raffles, VIP, sidebar |
| Recent wins | `bc-game.png` | Social proof feed |
| Bet columns | `csgo-crash.png` | Live bettors list |
| Probability | `manifold.png` | Color bars, simple CTA |
| Dashboards | `dribbble-crypto-dashboard.png` | Charts, stats grid |

---

## ✅ MVP CHECKLIST

### Day 1 Must Ship
- [ ] Pool card with asset + price
- [ ] 60-second countdown timer
- [ ] UP/DOWN buttons with odds
- [ ] Amount input
- [ ] Balance display
- [ ] Win/loss feedback

### Day 2 Enhancement
- [ ] Mini price chart
- [ ] Pool stats (total, bettors)
- [ ] Transaction history
- [ ] Multiple assets

### Week 1 Polish
- [ ] Animations (timer, bets, wins)
- [ ] Sound effects (optional)
- [ ] Leaderboard
- [ ] Activity feed

---

## 🎯 THE GOLDEN RULES

1. **Dark mode always**
2. **Big numbers, small labels**
3. **One loud accent color (green)**
4. **Show other bettors = social proof**
5. **Countdown creates urgency**
6. **Win animations = dopamine**
7. **Mobile-first, always**

---

*Get in the zone. Ship fast. Iterate based on feedback.*
