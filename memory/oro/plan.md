# Oro Gold Protection Protocol — Project Plan
**Project**: GoldFloor — Downside Protection for $GOLD Holders  
**Builder**: Reuben Rapose  
**Grant**: Oro GRAIL  
**Duration**: 6 weeks (3 weeks core build + 3 weeks testing/polish)  
**Start Date**: TBD (pending grant kickoff confirmation)

---

## Week 1: Design + Setup

### Goals
- Finalize architecture and smart contract design
- Set up development environment
- Establish communication cadence with Oro team

### Milestones
- [ ] **Architecture Document** — Complete system design with data flow diagrams
- [ ] **Smart Contract Spec** — Define all instructions, accounts, PDAs, and state
- [ ] **Dev Environment** — Anchor project scaffolded, Pyth devnet integration tested
- [ ] **Flash Trade Research** — Evaluate perp integration approach (CPI vs off-chain)
- [ ] **GRAIL API Access** — Request sandbox/API keys from Oro team
- [ ] **Repo Setup** — GitHub repo, CI/CD, testing framework

### Deliverables to Oro Team
1. Architecture document (PDF/Notion)
2. Smart contract specification
3. Weekly progress report #1

---

## Week 2: Core Smart Contract Build

### Goals
- Build and test core vault + hedge management contracts
- Integrate Pyth oracle for gold pricing
- Prototype perp position management

### Milestones
- [ ] **Vault Program** — User deposit/withdraw, PDA accounts, balance tracking
- [ ] **Oracle Integration** — Pyth XAU/USD feed consumption in Anchor
- [ ] **Hedge Engine v1** — Position sizing logic based on hedge percentage
- [ ] **Perp Integration** — Flash Trade CPI or off-chain keeper for position management
- [ ] **Unit Tests** — Core contract logic coverage ≥80%
- [ ] **Devnet Deployment** — Working contracts on Solana devnet

### Deliverables to Oro Team
1. Devnet contract addresses
2. Test results / coverage report
3. Weekly progress report #2

---

## Week 3: Frontend + Integration

### Goals
- Build user-facing frontend
- Connect wallet, display balances, hedge slider
- End-to-end flow working on devnet

### Milestones
- [ ] **Frontend Shell** — Next.js app with wallet adapter
- [ ] **Portfolio View** — Show $GOLD balance, current hedge level, cost/yield breakdown
- [ ] **Hedge Slider** — Interactive protection % selector with real-time cost preview
- [ ] **Transaction Flow** — One-click hedge activation/modification
- [ ] **Dashboard** — Position monitoring, PnL tracking, funding cost history

### Deliverables to Oro Team
1. Devnet demo link
2. Screen recording / walkthrough
3. Weekly progress report #3

---

## Week 4: Testing + Edge Cases

### Goals
- Stress test under various gold price scenarios
- Handle edge cases (liquidation, oracle failures, funding spikes)
- Security review

### Milestones
- [ ] **Scenario Testing** — Gold crash (-10%), rally (+10%), sideways, volatile
- [ ] **Edge Cases** — Oracle staleness, insufficient funding, position limits
- [ ] **Yield Router** — Automated yield-to-funding cost netting
- [ ] **Error Handling** — Graceful degradation, user-facing error messages
- [ ] **Security Audit Prep** — Self-audit checklist, common vulnerability scan

### Deliverables to Oro Team
1. Test scenario results
2. Security self-audit report
3. Weekly progress report #4

---

## Week 5: Polish + Documentation

### Goals
- UI/UX polish
- Comprehensive documentation
- Prepare for mainnet considerations

### Milestones
- [ ] **UI Polish** — Mobile responsive, loading states, animations
- [ ] **Documentation** — Integration guide, API docs, user guide
- [ ] **SDK/Package** — If applicable, npm package for GRAIL integration
- [ ] **Mainnet Plan** — Deployment checklist, key management, monitoring

### Deliverables to Oro Team
1. Polished devnet demo
2. Documentation package
3. Weekly progress report #5

---

## Week 6: Final Delivery

### Goals
- Final testing pass
- Presentation prep
- Handoff

### Milestones
- [ ] **Final QA** — Full regression testing
- [ ] **Demo Video** — 5-min walkthrough of the complete product
- [ ] **Presentation** — Deck for Oro team showcasing what was built
- [ ] **Code Handoff** — Clean repo, README, deployment instructions
- [ ] **Post-Launch Plan** — Mainnet roadmap, ongoing maintenance plan

### Deliverables to Oro Team
1. Final demo + video
2. Complete source code
3. Documentation
4. Post-grant roadmap
5. Final report

---

## Weekly Progress Report Template

```markdown
# GoldFloor — Week [N] Progress Report
**Date**: [Date]
**Builder**: Reuben Rapose

## Summary
[2-3 sentence overview of the week]

## Completed
- [x] Item 1
- [x] Item 2

## In Progress
- [ ] Item 1 (expected completion: [date])
- [ ] Item 2

## Blockers
- [Blocker description + what's needed to unblock]

## Next Week
- Priority 1
- Priority 2

## Metrics
- Smart contract test coverage: X%
- Devnet transactions: X
- Open issues: X

## Demo
[Link to devnet demo / screenshot / video]
```

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Flash Trade perp integration complexity | Medium | High | Start integration early; have Lighter.xyz as backup |
| XAU/USD not a Pyth push feed | Low | Medium | Run Price Pusher or use pull integration pattern |
| Funding cost exceeds yield in volatile periods | Medium | Medium | Dynamic hedge caps; clear user messaging |
| GRAIL API access delays | Medium | Medium | Build standalone first; integrate GRAIL later |
| Solana congestion affects execution | Low | Medium | Priority fees; retry logic; keeper redundancy |
