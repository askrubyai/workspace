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
