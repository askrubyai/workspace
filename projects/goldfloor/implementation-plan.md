# GoldFloor Implementation Plan
## Oro GRAIL Distribution Partner Integration

**Project:** Gold-denominated prediction market hedging product  
**Timeline:** 4-6 weeks  
**Status:** Planning Phase

---

## Week 1-2: Foundation (Partner Setup + Core API)

### Tasks:
1. **Partner Onboarding**
   - [ ] Complete Oro partner application (if not done)
   - [ ] Generate API keys via Oro dashboard
   - [ ] Set up executive authority wallet (Solana)
   - [ ] Configure KYC flow for user verification

2. **API Integration - Basic**
   - [ ] Connect to Oro API (health check, authentication)
   - [ ] Implement price estimation (GET /estimate-buy, /estimate-sell)
   - [ ] Test gold purchase flow (testnet or sandbox)

3. **Wallet Setup**
   - [ ] Configure Solana wallet for partner operations
   - [ ] Set up PDA (Program Derived Address) for user funds
   - [ ] Implement transaction signing flow

**Agent:** Friday (Developer)

---

## Week 3: Hedging Engine (Polymarket)

### Tasks:
1. **Polymarket Integration**
   - [ ] Research current gold markets on Polymarket
   - [ ] Build market monitoring (gold price feeds via Pyth)
   - [ ] Implement position opening (buy "No" on above/below markets)

2. **Hedging Logic**
   - [ ] Calculate hedge ratio based on user position
   - [ ] Build automatic hedge execution when positions open
   - [ ] Handle position settlement and P&L calculation

3. **Risk Management**
   - [ ] Position sizing limits
   - [ ] Daily drawdown checks
   - [ ] Emergency liquidation triggers

**Agent:** Friday + Research Agent

---

## Week 4: User Dashboard

### Tasks:
1. **User Interface**
   - [ ] Portfolio view (gold holdings, hedge positions)
   - [ ] Position opening flow (select protection level, duration)
   - [ ] P&L display (realized/unrealized)

2. **User Management**
   - [ ] Create user via Oro API
   - [ ] KYC verification flow (or skip for MVP)
   - [ ] Transaction history

3. **Admin Dashboard**
   - [ ] Partner balance monitoring
   - [ ] User list and details
   - [ ] Hedge position management

**Agent:** Shuri (UX) + Friday (Backend)

---

## Week 5: Testing & Polish

### Tasks:
1. **Testing**
   - [ ] Paper trading (simulate without real money)
   - [ ] Edge case testing (API failures, extreme price moves)
   - [ ] Security audit (wallet permissions, API key protection)

2. **Documentation**
   - [ ] API documentation
   - [ ] User guides
   - [ ] Integration docs for future partners

3. **Launch Prep**
   - [ ] Marketing site
   - [ ] Social media presence
   - [ ] Community building

**Agent:** Vision (Marketing) + Loki (Content)

---

## Week 6: Launch + Iteration

### Tasks:
1. **Soft Launch**
   - [ ] Limited user onboarding (waitlist)
   - [ ] Monitor systems under load
   - [ ] Gather feedback

2. **Iteration**
   - [ ] Fix issues from soft launch
   - [ ] Add features based on feedback
   - [ ] Scale user base

---

## Key Dependencies

| Component | Dependency | Status |
|-----------|------------|--------|
| Oro API Keys | Partner portal | Pending |
| Polymarket Access | API registration | Research needed |
| Solana Wallet | Executive authority | Week 1 |
| Pyth Oracle | Gold price feed | Public |

---

## Risks

1. **Oro API Rate Limits** — Need to understand limits
2. **Polymarket Liquidity** — Thin markets for gold hedges
3. **KYC Complexity** — May slow user onboarding
4. **Smart Contract Risk** — Need audit before launch

---

## Success Metrics

- [ ] Successfully buy/sell gold via Oro API
- [ ] Open hedge positions on Polymarket automatically
- [ ] Track P&L accurately
- [ ] 100+ test users onboarded
- [ ] $0 loss in paper trading phase
