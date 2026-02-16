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

