# Polymarket Bot v2.0 - Mac Mini Optimized

## 🚨 CRITICAL: Paper Trading Only

**Shuri's Validation Requirements ENFORCED:**
- 97%+ win rate claims are OVERCONFIDENT and unrealistic
- Realistic expectation: 66-82% win rate
- **MANDATORY paper trading validation before any real money**
- All edge cases must pass testing

## Quick Start

```bash
# Install dependencies
npm install ws node-fetch

# Run paper trading validation (MANDATORY)
node paper-trading-validator.js

# Start bot in paper trading mode (after validation passes)  
node polymarket-bot-v2.js
```

## Architecture

### Core Components

1. **PolymarketBotV2** (`polymarket-bot-v2.js`)
   - Main trading engine optimized for Mac Mini Apple Silicon
   - Paper trading mode enforced until validation passes
   - Mathematical dependency analysis (Fury's research)
   - Real-time monitoring with Wanda's dashboard integration

2. **PaperTradingValidator** (`paper-trading-validator.js`) 
   - **MANDATORY** validation before real money deployment
   - Tests realistic 66-82% win rate expectations
   - Simulates all edge cases identified by Shuri
   - Mac Mini performance benchmarking

### Research Integration

- **Fury's Dependencies**: Mathematical relationship tiers (95%, 85%, 75% confidence)
- **Vision's Timing**: Optimal execution windows (US close, Asia open) 
- **Wanda's Dashboard**: Real-time win rate monitoring
- **Shuri's Validation**: Edge case analysis and realistic expectations

## Validation Process

### Phase 1: Basic Strategy Testing
- Test mathematical dependency strategies
- Validate win rate claims against reality
- **REJECT** any strategy claiming >95% win rate

### Phase 2: Edge Case Simulation  
Tests for 8 critical failure scenarios:
- API rate limiting
- Market suspension  
- Network interruptions
- Mac Mini hardware failure
- Mathematical correlation breakdown
- Liquidity evaporation
- Fee structure changes
- Account restrictions

### Phase 3: Performance Benchmarking
- Mac Mini Apple Silicon optimization validation
- <200ms average latency target
- <512MB memory usage limit
- Concurrent processing efficiency

### Phase 4: Statistical Analysis
- Minimum 100 test trades for significance
- Win rate: 66-82% realistic range  
- Profit factor: >1.2 required
- Maximum drawdown: <20%
- Consecutive losses: <5 tolerance

### Phase 5: Final Validation
**APPROVED**: All tests pass → Real money trading permitted  
**REJECTED**: Failed tests → Continue paper trading only  
**REJECTED_OVERCONFIDENT**: >97% win rate → Recalibrate completely

## Safety Features

### Paper Trading Mode
- **Default enabled** - real money disabled by default
- Zero financial risk during development and testing
- Full feature testing without capital exposure  

### Emergency Circuit Breakers
- Stop after 2 consecutive losses
- Stop at $15 daily loss limit
- Stop if win rate drops below 60%
- Stop after 3 API errors

### Capital Management  
- **Maximum budget**: $50 total
- **Maximum position**: $10 per trade
- **Cash buffer**: 50% minimum reserve
- **Conservative allocation**: Focus on Tier 1 certainty

## Configuration

### Strategy Tiers (from Fury's Research)
```javascript
tier1: { confidence: 0.95, allocation: 0.70 },  // Mathematical certainties
tier2: { confidence: 0.85, allocation: 0.30 },  // Strong correlations  
tier3: { confidence: 0.75, allocation: 0.00 }   // Disabled for reliability
```

### Execution Windows (from Vision's Analysis)
- **US Market Close**: 22:00-24:00 UTC (peak opportunities)
- **Asia Market Open**: 13:00-15:00 UTC (secondary window)
- **Off-peak periods**: Lower competition, better execution

### Mac Mini Optimization
- Apple Silicon specific performance tuning
- Memory efficient data structures  
- Concurrent processing limits
- WebSocket connection optimization

## Monitoring & Dashboard

Integration with Wanda's monitoring dashboard:
- Real-time win rate tracking
- Performance metrics visualization  
- Color-coded risk zones
- Emergency stop controls
- Export functionality for analysis

Dashboard data exported to: `artifacts/monitoring/bot-status.json`

## Risk Management

### Position Sizing
- Maximum $10 per individual trade
- Total exposure capped at $50
- Dynamic position sizing based on confidence tier
- Emergency stop-loss protection

### Performance Monitoring
- Continuous latency tracking
- Memory usage monitoring
- API error rate surveillance
- Win rate deterioration alerts

## Development Status

### ✅ Completed
- Core bot architecture (Mac Mini optimized)
- Paper trading validation system
- Edge case simulation framework
- Mathematical dependency integration  
- Safety features and circuit breakers
- Monitoring dashboard integration

### 🔄 In Progress  
- Running paper trading validation
- Performance benchmarking
- Integration testing

### ⏳ Pending Validation
- Real money deployment (blocked until validation passes)
- Live market testing
- Production monitoring

## Files Structure

```
artifacts/code/
├── polymarket-bot-v2.js          # Main bot engine
├── paper-trading-validator.js     # Mandatory validation system
├── README.md                      # This file
└── package.json                   # Dependencies

artifacts/validation/
├── paper-trading-report.json      # Detailed validation results  
└── validation-summary.md          # Human-readable summary

artifacts/monitoring/
└── bot-status.json               # Real-time dashboard data

artifacts/research/               # Squad research integration
├── polymarket-dependency-mapping.md    # Fury's analysis
├── polymarket-timing-analysis.md       # Vision's analysis  
└── edge-case-validation-shuri.md       # Shuri's validation
```

## Next Steps

1. **Run validation immediately**: `node paper-trading-validator.js`
2. **Review validation report** in `artifacts/validation/`
3. **Only proceed if APPROVED status** achieved
4. **Begin monitored paper trading** with position limits
5. **Daily performance reviews** for optimization

## ⚠️ Critical Warnings

- **NO REAL MONEY** until validation status = APPROVED
- **97%+ win rate claims are OVERCONFIDENT** per Shuri's analysis
- **Paper trading is mandatory**, not optional
- **All edge cases must pass** before considering real deployment
- **Mac Mini specific** - not tested on other systems

---

*Built by Friday (Developer) following strict validation requirements from Shuri (Product Analyst) and integrated research from the full squad.*