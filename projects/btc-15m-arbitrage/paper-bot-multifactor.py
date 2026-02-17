#!/usr/bin/env python3
"""
PAPER TRADING BOT — MULTI-FACTOR (V3)
Day 7/8/9 forward validation bot: regime + VRP + cluster proximity signals

Architecture:
  Polymarket RTDS WebSocket → Signal Engine (multi-factor) → Kelly Sizing → Paper Execution → SPRT Validation

Key improvements over paper-bot-v2.js:
  - Full multi-factor signal pipeline (regime + VRP + cluster)
  - SPRT for principled early stopping (~120 trades vs 304)
  - Realistic fill modeling (spread + latency)
  - Multi-asset: BTC, ETH, SOL, XRP (4× signal rate)
  - Factor attribution tracking per trade
  - TRUE Kelly Criterion position sizing (Day 8) — not confidence-weighted heuristic

Kelly Sizing Logic (Day 8):
  f* = (w - p) / (1 - p)   where w = estimated win prob, p = entry price
  w_estimate = 0.50 + BACKTEST_EDGE * (confidence / signal_threshold)
  practical = kelly_multiplier * f*   (default: half Kelly)
  Skip trade if f* × balance < min_bet_usd (edge too thin to justify minimum bet)

Updated: 2026-02-17 (Friday — Kelly integration)
Fee structure: Polymarket 0/0 bps (dropped Feb 2026)
"""

import asyncio
import json
import math
import time
import os
import sys
from collections import deque
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Optional
import threading
import numpy as np
import websocket  # websocket-client
import requests

# ═══════════════════════════════════════════════════════════════════════════════
# CONFIG
# ═══════════════════════════════════════════════════════════════════════════════

CONFIG = {
    "gamma_api": "https://gamma-api.polymarket.com",
    "rtds_url": "wss://ws-live-data.polymarket.com/",
    "starting_balance": 10.0,          # Weekly $10 challenge
    "max_position_pct": 0.20,          # Max 20% of balance per trade
    "max_positions": 3,                # Max concurrent open positions
    "spread_bps": 50,                  # 0.50% spread assumption
    "latency_ms": 200,                 # Simulated execution latency
    "signal_threshold": 0.30,          # Min composite score to enter
    "max_entry_price": 0.65,           # Don't enter above 65 cents
    "min_entry_price": 0.15,           # Don't enter below 15 cents (low vol)
    "min_time_left_s": 60,             # Min 60s before market resolves
    "exit_reversal_pct": 0.10,         # Exit if price moves 10% against us
    "log_file": "paper-trading-results/paper-multifactor.log",
    "journal_file": "paper-trading-results/trade-journal-multifactor.json",
    "runtime_h": 8,                    # Run for up to 8 hours
    "assets": {
        "BTC": {"series_id": "10192", "symbol": "btc/usd"},
        "ETH": {"series_id": "10191", "symbol": "eth/usd"},
        "SOL": {"series_id": "10423", "symbol": "sol/usd"},
        "XRP": {"series_id": "10422", "symbol": "xrp/usd"},
    },
    # Factor weights (must sum to 1.0)
    "factor_weights": {
        "regime_transition": 0.40,
        "cluster_proximity": 0.30,
        "vrp": 0.30,
    },
    # ── Kelly Criterion parameters (Day 8/9 integration) ────────────────
    # Day 9 paper run: 25W/3L (89.3%) — conservative estimate for next run
    # Conservative regression to ~70% (avoid Kelly overbetting on hot streak)
    "backtest_win_rate": 0.70,         # Post-Day-9: conservative win rate estimate
    "kelly_multiplier": 0.50,          # Fractional Kelly: 0.5 = half Kelly
    "min_bet_usd": 1.00,               # Paper trading minimum ($1) — Polymarket live min is $5
    # NOTE: Lowered from $5→$1 on Feb 17 19:32 IST (Shuri) — $5 was mathematically unreachable
    # at p≈0.50 markets: max f*≈30% → full_kelly≈$3.00 < $5.00 → 100% SKIP rate, zero data
    # At $1 threshold: BTC signals (f*≈26%) generate full_kelly≈$2.60 → trades execute ✅
    # Kelly skip rule: don't trade if full-Kelly size < min_bet_usd
    # This enforces selectivity — only trade when edge justifies the minimum bet
    "kelly_skip_enabled": True,        # Log skips for Day 9 signal-selection research
}

# ═══════════════════════════════════════════════════════════════════════════════
# SIGNAL ENGINE — lifted from Day 7 blog, with minor production hardening
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class SignalState:
    """Rolling price + volatility state for signal computation."""
    rv_window: deque = field(default_factory=lambda: deque(maxlen=288))
    price_history: deque = field(default_factory=lambda: deque(maxlen=288))
    last_regime: str = "NORMAL"
    current_regime: str = "NORMAL"

    def update_price(self, price: float, timestamp: float):
        self.price_history.append((timestamp, price))
        if len(self.price_history) >= 2:
            _, p1 = self.price_history[-2]
            _, p2 = self.price_history[-1]
            if p1 > 0 and p2 > 0:
                log_ret = math.log(p2 / p1)
                self.rv_window.append(log_ret ** 2)

    def get_regime(self) -> str:
        if len(self.rv_window) < 100:
            return "INSUFFICIENT_DATA"
        rv_array = np.array(list(self.rv_window))
        rv = math.sqrt(float(rv_array[-12:].mean())) * math.sqrt(288 * 365) * 100
        mu = math.sqrt(float(rv_array.mean())) * math.sqrt(288 * 365) * 100
        windows = [rv_array[i:i+12] for i in range(0, len(rv_array) - 12, 12)]
        sigma = np.std([math.sqrt(float(w.mean())) * math.sqrt(288*365)*100 for w in windows]) if len(windows) > 1 else 1.0
        self.last_regime = self.current_regime
        if rv > mu + 0.5 * sigma:
            self.current_regime = "HIGH"
        elif rv < mu - 0.5 * sigma:
            self.current_regime = "LOW"
        else:
            self.current_regime = "NORMAL"
        return self.current_regime

    def regime_transition(self) -> bool:
        """Post-spike: HIGH → NORMAL is the entry signal (Day 5 finding)."""
        return self.last_regime == "HIGH" and self.current_regime == "NORMAL"


def cluster_proximity(price: float, threshold_pct: float = 0.3) -> float:
    """Distance to nearest round-number liquidity cluster as a 0-1 score."""
    if price <= 0:
        return 0.0
    nearest_1000 = round(price / 1000) * 1000
    nearest_500 = round(price / 500) * 500
    dist_pct = min(abs(price - nearest_1000), abs(price - nearest_500)) / price * 100
    if dist_pct >= threshold_pct:
        return 0.0
    return 1.0 - (dist_pct / threshold_pct)


def vrp_signal(state: SignalState) -> Optional[float]:
    """VRP proxy: implied - realized. Positive VRP = premium-selling opportunity."""
    if len(state.rv_window) < 50:
        return None
    rv_array = np.array(list(state.rv_window))
    rv_current = math.sqrt(float(rv_array[-12:].mean())) * math.sqrt(288*365) * 100
    iv_proxy = rv_current * 1.15  # Calibrated from Day 4
    vrp = iv_proxy - rv_current
    return vrp


@dataclass
class Signal:
    direction: str          # "YES", "NO", or "NONE"
    confidence: float       # 0.0–1.0 composite score
    factors: dict           # per-factor scores
    asset: str
    btc_price: float
    binary_price: float
    timestamp: float = field(default_factory=time.time)


def generate_signal(state: SignalState, asset: str, btc_price: float,
                    binary_price: float) -> Signal:
    """Multi-factor signal: regime × cluster × VRP."""
    weights = CONFIG["factor_weights"]
    factors = {}
    score = 0.0

    # Factor 1: Regime transition (40% weight)
    regime = state.get_regime()
    if state.regime_transition():
        factors["regime_transition"] = 1.0
        score += weights["regime_transition"]
    else:
        factors["regime_transition"] = 0.0

    # Factor 2: Cluster proximity (30% weight)
    cluster_score = cluster_proximity(btc_price)
    factors["cluster_proximity"] = cluster_score
    score += weights["cluster_proximity"] * cluster_score

    # Factor 3: VRP (30% weight)
    vrp = vrp_signal(state)
    if vrp is not None and vrp > 0:
        vrp_score = min(vrp / 5.0, 1.0)  # 5 vol pts = max
        factors["vrp"] = vrp_score
        score += weights["vrp"] * vrp_score
    else:
        factors["vrp"] = 0.0

    # Direction: mean reversion in post-spike windows
    # Low binary price → expect YES; High binary price → expect NO
    threshold = CONFIG["signal_threshold"]
    if score > threshold:
        direction = "YES" if binary_price < 0.50 else "NO"
    else:
        direction = "NONE"

    # Guard: don't enter if price is extreme (high uncertainty)
    if direction != "NONE":
        if binary_price > CONFIG["max_entry_price"] or binary_price < CONFIG["min_entry_price"]:
            direction = "NONE"

    return Signal(
        direction=direction,
        confidence=min(score, 1.0),
        factors=factors,
        asset=asset,
        btc_price=btc_price,
        binary_price=binary_price,
    )


# ═══════════════════════════════════════════════════════════════════════════════
# SPRT — Sequential Probability Ratio Test
# ═══════════════════════════════════════════════════════════════════════════════

class SPRT:
    """
    Sequential Probability Ratio Test for strategy validation.
    H0: win rate = p0 (random). H1: win rate = p1 (strategy works).
    ~120 trades to decision vs 304 for fixed-sample test.
    """

    def __init__(self, p0: float = 0.50, p1: float = 0.57,
                 alpha: float = 0.05, beta: float = 0.20):
        self.p0 = p0
        self.p1 = p1
        self.alpha = alpha
        self.beta = beta
        self.A = math.log((1 - beta) / alpha)     # Upper boundary → accept H1
        self.B = math.log(beta / (1 - alpha))      # Lower boundary → reject H1
        self.log_lr = 0.0
        self.n_trades = 0
        self.n_wins = 0

    def update(self, won: bool) -> str:
        """Returns 'continue', 'accept', or 'reject'."""
        self.n_trades += 1
        self.n_wins += int(won)
        if won:
            self.log_lr += math.log(self.p1 / self.p0)
        else:
            self.log_lr += math.log((1 - self.p1) / (1 - self.p0))

        if self.log_lr >= self.A:
            return "accept"
        elif self.log_lr <= self.B:
            return "reject"
        return "continue"

    @property
    def win_rate(self) -> float:
        return self.n_wins / self.n_trades if self.n_trades else 0.0

    @property
    def progress_pct(self) -> float:
        """How far are we to a decision? 0 = start, 100 = decided."""
        if self.log_lr >= self.A or self.log_lr <= self.B:
            return 100.0
        total_range = self.A - self.B
        current_pos = self.log_lr - self.B
        return min(100.0, (current_pos / total_range) * 100)

    def summary(self) -> str:
        direction = "→ ACCEPT" if self.log_lr > 0 else "→ REJECT"
        return (f"SPRT n={self.n_trades} win={self.win_rate:.1%} "
                f"logLR={self.log_lr:.3f} [{self.B:.2f}..{self.A:.2f}] "
                f"progress={self.progress_pct:.0f}% {direction}")


# ═══════════════════════════════════════════════════════════════════════════════
# PAPER EXECUTION ENGINE
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class PaperTrade:
    trade_id: str
    timestamp: float
    market_id: str
    asset: str
    direction: str
    entry_price: float
    size_usd: float
    shares: float
    signal: Signal
    exit_price: Optional[float] = None
    exit_timestamp: Optional[float] = None
    pnl: Optional[float] = None
    status: str = "OPEN"
    sprt_decision: Optional[str] = None
    # Kelly metrics (Day 8) — stored for Day 9 signal-selection analysis
    kelly_w_estimate: float = 0.0      # Estimated win probability used for sizing
    kelly_f_star: float = 0.0          # Full Kelly fraction
    kelly_f_practical: float = 0.0     # Fractional Kelly applied


class PaperEngine:
    def __init__(self):
        self.balance = CONFIG["starting_balance"]
        self.positions: list[PaperTrade] = []
        self.closed_trades: list[PaperTrade] = []
        self.trade_counter = 0
        self.spread_bps = CONFIG["spread_bps"]
        self.max_position_pct = CONFIG["max_position_pct"]
        self.max_positions = CONFIG["max_positions"]

    def execute_signal(self, signal: Signal, market_id: str) -> Optional[PaperTrade]:
        """Enter a position with realistic fill simulation."""
        if signal.direction == "NONE":
            return None
        if len(self.positions) >= self.max_positions:
            return None
        # One position per asset at a time
        for pos in self.positions:
            if pos.asset == signal.asset:
                return None

        # ── True Kelly Criterion position sizing (Day 8) ──────────────────
        # From Day 8 research: f* = (w - p) / (1 - p)
        # w = estimated win probability (calibrated from backtest + signal confidence)
        # p = binary entry price
        p_entry = signal.binary_price
        base_win_rate = CONFIG["backtest_win_rate"]       # 0.70 post-Day-9 (conservative, paper run 89.3%)

        # Scale win estimate by signal confidence
        # confidence=signal_threshold (min) → w = base_win_rate (baseline)
        # confidence=1.0 (max)             → w = 0.50 + edge × (1.0 / threshold)
        edge = base_win_rate - 0.50
        confidence_scale = signal.confidence / CONFIG["signal_threshold"]
        w_estimate = 0.50 + edge * confidence_scale
        w_estimate = min(w_estimate, 0.85)  # cap at 85% (realistic upper bound)

        # Full Kelly fraction for a binary option: f* = (w - p) / (1 - p)
        f_star = (w_estimate - p_entry) / (1.0 - p_entry)
        if f_star <= 0:
            return None  # Negative or zero Kelly = no edge, skip trade

        # Apply fractional Kelly (half Kelly by default)
        kelly_multiplier = CONFIG["kelly_multiplier"]
        f_practical = kelly_multiplier * f_star

        # Compute position size from Kelly fraction
        size_usd = self.balance * f_practical

        # Kelly skip rule: if full Kelly size < min_bet, edge is too thin
        min_bet = CONFIG["min_bet_usd"]
        full_kelly_size = self.balance * f_star
        if CONFIG.get("kelly_skip_enabled") and full_kelly_size < min_bet:
            # Log skip for Day 9 signal-selection analysis
            log_entry = (f"[KELLY_SKIP] {signal.asset} | confidence={signal.confidence:.2f} | "
                         f"w={w_estimate:.3f} | p={p_entry:.3f} | f*={f_star:.3%} | "
                         f"full_kelly_size=${full_kelly_size:.2f} < min_bet=${min_bet:.2f}")
            try:
                with open(CONFIG["log_file"], "a") as lf:
                    lf.write(log_entry + "\n")
            except Exception:
                pass
            return None  # Skip — edge doesn't justify minimum bet

        # Floor at minimum bet (survival mode: can't bet less than $5)
        size_usd = max(min_bet, size_usd)
        # Hard cap: never risk more than 50% of balance in a single trade
        size_usd = min(size_usd, self.balance * 0.50)

        if size_usd > self.balance:
            return None

        # Spread: enter at worse-than-mid price
        spread_adj = self.spread_bps / 10000.0
        if signal.direction == "YES":
            fill_price = signal.binary_price + spread_adj / 2
        else:
            fill_price = signal.binary_price - spread_adj / 2
        fill_price = max(0.01, min(0.99, fill_price))
        shares = size_usd / fill_price

        self.trade_counter += 1
        trade = PaperTrade(
            trade_id=f"PT-{self.trade_counter:04d}",
            timestamp=time.time(),
            market_id=market_id,
            asset=signal.asset,
            direction=signal.direction,
            entry_price=fill_price,
            size_usd=size_usd,
            shares=shares,
            signal=signal,
            kelly_w_estimate=w_estimate,
            kelly_f_star=f_star,
            kelly_f_practical=f_practical,
        )
        self.positions.append(trade)
        self.balance -= size_usd
        return trade

    def check_exits(self, market_id: str, binary_price: float,
                    time_remaining_s: float) -> list[PaperTrade]:
        """Check and close positions: resolution or reversal stop."""
        exits = []
        spread_adj = self.spread_bps / 10000.0

        for pos in self.positions[:]:
            if pos.market_id != market_id:
                continue

            exit_price = None
            reason = None

            if time_remaining_s <= 0:
                # Market resolved: binary outcome
                resolved_yes = binary_price > 0.50
                if pos.direction == "YES":
                    exit_price = 1.0 if resolved_yes else 0.0
                else:
                    exit_price = 1.0 if not resolved_yes else 0.0
                reason = "resolution"

            elif self._is_reversal(pos, binary_price):
                # Early exit on reversal: worse-than-mid
                if pos.direction == "YES":
                    exit_price = binary_price - spread_adj / 2
                else:
                    exit_price = binary_price + spread_adj / 2
                exit_price = max(0.01, min(0.99, exit_price))
                reason = "reversal_stop"

            if exit_price is not None:
                pos.exit_price = exit_price
                pos.exit_timestamp = time.time()
                pos.pnl = (exit_price - pos.entry_price) * pos.shares
                pos.status = "CLOSED"
                self.balance += pos.entry_price * pos.shares + pos.pnl  # Recover stake + pnl
                self.positions.remove(pos)
                self.closed_trades.append(pos)
                exits.append((pos, reason))

        return exits

    def _is_reversal(self, pos: PaperTrade, current_price: float) -> bool:
        threshold = CONFIG["exit_reversal_pct"]
        if pos.direction == "YES":
            return current_price < pos.entry_price * (1 - threshold)
        else:
            return current_price > pos.entry_price * (1 + threshold)

    def stats(self) -> dict:
        wins = sum(1 for t in self.closed_trades if t.pnl and t.pnl > 0)
        losses = sum(1 for t in self.closed_trades if t.pnl and t.pnl <= 0)
        total_pnl = sum(t.pnl for t in self.closed_trades if t.pnl)
        return {
            "balance": self.balance,
            "total_trades": len(self.closed_trades),
            "open_positions": len(self.positions),
            "wins": wins,
            "losses": losses,
            "win_rate": wins / (wins + losses) if (wins + losses) else 0.0,
            "total_pnl": total_pnl,
            "pnl_pct": total_pnl / CONFIG["starting_balance"] * 100,
        }


# ═══════════════════════════════════════════════════════════════════════════════
# MARKET DATA FETCHER
# ═══════════════════════════════════════════════════════════════════════════════

class MarketCache:
    """Caches active Polymarket 15-min binary markets per asset."""

    def __init__(self):
        self._markets: dict[str, dict] = {}   # asset → market info
        self._lock = threading.Lock()
        self._last_refresh: dict[str, float] = {}

    def get(self, asset: str) -> Optional[dict]:
        with self._lock:
            return self._markets.get(asset)

    def set(self, asset: str, market: dict):
        with self._lock:
            self._markets[asset] = market
            self._last_refresh[asset] = time.time()

    def needs_refresh(self, asset: str, ttl_s: float = 30.0) -> bool:
        with self._lock:
            last = self._last_refresh.get(asset, 0)
            return (time.time() - last) > ttl_s


def fetch_current_market(asset: str) -> Optional[dict]:
    """Fetch the currently active 15-min binary market for an asset.
    
    Fix (2026-02-17 Friday): series_ticker filter doesn't work with numeric IDs.
    Use the series endpoint directly to get latest event IDs, then look up live markets.
    """
    try:
        series_id = CONFIG["assets"][asset]["series_id"]
        
        # Step 1: Get the series to find the last (most recent) event IDs
        series_url = f"{CONFIG['gamma_api']}/series/{series_id}"
        series_resp = requests.get(series_url, timeout=5)
        if series_resp.status_code != 200:
            return None
        series_data = series_resp.json()
        events_meta = series_data.get("events", [])
        if not events_meta:
            return None
        
        # Last entries in the list are most recent; try last 5 to find active one
        recent_event_ids = [ev.get("id") for ev in events_meta[-5:] if ev.get("id")]
        recent_event_ids.reverse()  # newest first
        
        market = None
        for event_id in recent_event_ids:
            ev_url = f"{CONFIG['gamma_api']}/events/{event_id}"
            ev_resp = requests.get(ev_url, timeout=5)
            if ev_resp.status_code != 200:
                continue
            event = ev_resp.json()
            markets = event.get("markets", [])
            if not markets:
                continue
            candidate = markets[0]
            if candidate.get("active") and not candidate.get("closed"):
                market = candidate
                break
        
        if not market:
            return None

        # Parse binary option prices
        outcome_prices = market.get("outcomePrices", "")
        if isinstance(outcome_prices, str):
            try:
                prices = json.loads(outcome_prices)
            except Exception:
                prices = []
        else:
            prices = outcome_prices or []

        up_price = float(prices[0]) if len(prices) > 0 else 0.5
        down_price = float(prices[1]) if len(prices) > 1 else 0.5

        # Time remaining
        end_date = market.get("endDate") or market.get("endDateIso")
        time_left_s = 0
        if end_date:
            try:
                from datetime import datetime
                end_dt = datetime.fromisoformat(end_date.replace("Z", "+00:00"))
                now_dt = datetime.now(timezone.utc)
                time_left_s = max(0, (end_dt - now_dt).total_seconds())
            except Exception:
                pass

        return {
            "market_id": market.get("id") or market.get("conditionId", ""),
            "question": market.get("question", f"{asset} 15m binary"),
            "up_price": up_price,
            "down_price": down_price,
            "time_left_s": time_left_s,
            "cached_at": time.time(),  # Stamp fetch time for staleness correction
        }
    except Exception:
        return None


# ═══════════════════════════════════════════════════════════════════════════════
# LOGGING
# ═══════════════════════════════════════════════════════════════════════════════

_log_lock = threading.Lock()

def log(msg: str, level: str = "info"):
    icons = {"info": "ℹ️ ", "signal": "📡", "trade": "💰", "exit": "📤",
             "win": "✅", "loss": "❌", "sprt": "📊", "warn": "⚠️ ", "error": "🔥"}
    icon = icons.get(level, "  ")
    ts = datetime.now().strftime("%H:%M:%S")
    line = f"[{ts}] {icon} {msg}"
    with _log_lock:
        print(line)
        try:
            with open(CONFIG["log_file"], "a") as f:
                f.write(line + "\n")
        except Exception:
            pass


def save_journal(engine: PaperEngine, sprt: SPRT):
    try:
        journal = {
            "updated_at": datetime.now().isoformat(),
            "stats": engine.stats(),
            "sprt": {
                "n_trades": sprt.n_trades,
                "n_wins": sprt.n_wins,
                "win_rate": sprt.win_rate,
                "log_lr": sprt.log_lr,
                "boundaries": {"A": sprt.A, "B": sprt.B},
                "progress_pct": sprt.progress_pct,
            },
            "open_positions": [
                {
                    "trade_id": p.trade_id,
                    "asset": p.asset,
                    "direction": p.direction,
                    "entry_price": p.entry_price,
                    "size_usd": p.size_usd,
                    "market_id": p.market_id,
                }
                for p in engine.positions
            ],
            "closed_trades": [
                {
                    "trade_id": t.trade_id,
                    "asset": t.asset,
                    "direction": t.direction,
                    "entry_price": t.entry_price,
                    "exit_price": t.exit_price,
                    "pnl": t.pnl,
                    "size_usd": t.size_usd,
                    "signal_confidence": t.signal.confidence,
                    "signal_factors": t.signal.factors,
                    "status": t.status,
                    "sprt_decision": t.sprt_decision,
                    "opened_at": datetime.fromtimestamp(t.timestamp).isoformat(),
                    "closed_at": datetime.fromtimestamp(t.exit_timestamp).isoformat() if t.exit_timestamp else None,
                    # Kelly metrics (Day 8) — for Day 9 signal-selection analysis
                    "kelly": {
                        "w_estimate": round(t.kelly_w_estimate, 4),
                        "f_star": round(t.kelly_f_star, 4),
                        "f_practical": round(t.kelly_f_practical, 4),
                        "kelly_pct": f"{t.kelly_f_star * 100:.2f}%",
                        "practical_pct": f"{t.kelly_f_practical * 100:.2f}%",
                    },
                }
                for t in engine.closed_trades
            ],
        }
        with open(CONFIG["journal_file"], "w") as f:
            json.dump(journal, f, indent=2)
    except Exception as e:
        log(f"Journal save error: {e}", "error")


# ═══════════════════════════════════════════════════════════════════════════════
# MAIN BOT
# ═══════════════════════════════════════════════════════════════════════════════

class PaperTradingBot:
    def __init__(self):
        self.signal_states: dict[str, SignalState] = {
            asset: SignalState() for asset in CONFIG["assets"]
        }
        self.engine = PaperEngine()
        self.sprt = SPRT(p0=0.50, p1=0.65, alpha=0.05, beta=0.20)  # Day 9: testing for ≥65% win rate gate
        self.market_cache = MarketCache()
        self.start_time = time.time()
        self.ws = None
        self._running = False
        self._last_signal_time: dict[str, float] = {}
        self._last_status_print = 0
        # WS robustness state (see MEMORY.md critical requirements)
        self._last_pong_time: float = 0.0
        self._reconnect_attempts: int = 0
        self._keepalive_id: int = 0   # bumped on each reconnect to kill stale threads

        # Append separator to log (preserve previous run history)
        with open(CONFIG["log_file"], "a") as f:
            f.write(f"\n{'═'*60}\n[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] NEW SESSION STARTED\n{'═'*60}\n")

    # ─── WebSocket ─────────────────────────────────────────────────────────────

    def _ws_on_open(self, ws):
        log("Connected to Polymarket RTDS", "info")
        self._last_pong_time = time.time()    # reset liveness clock on connect
        self._reconnect_attempts = 0          # reset backoff on success
        ws.send(json.dumps({
            "action": "subscribe",
            "subscriptions": [{"topic": "crypto_prices_chainlink", "type": "*"}]
        }))
        # Start ping keepalive — capture current id so stale threads self-exit
        my_id = self._keepalive_id
        threading.Thread(target=self._keepalive, args=(my_id,), daemon=True).start()

    def _keepalive(self, my_id: int):
        """Check every 30s that price data is flowing; force reconnect if silent for 60s.
        
        Fix (2026-02-17): Polymarket RTDS does NOT respond to text 'ping' with text 'pong'.
        We now reset _last_pong_time on ANY incoming message (any data = connection alive).
        Pong timeout increased 10s→60s to accommodate irregular message intervals.
        """
        while self._running and self.ws and my_id == self._keepalive_id:
            time.sleep(30)
            if not (self._running and self.ws and my_id == self._keepalive_id):
                break
            # Check liveness: if no message received in 60s, force reconnect
            if time.time() - self._last_pong_time > 60:
                log("No data in 60s — forcing reconnect", "warn")
                try:
                    self.ws.close()
                except Exception:
                    pass
                break  # let on_close handle reconnect

    def _ws_on_message(self, ws, data: str):
        # Any incoming message proves the connection is alive — reset liveness clock
        self._last_pong_time = time.time()
        if data == "pong":
            return
        try:
            msg = json.loads(data)
            if msg.get("topic") == "crypto_prices_chainlink" and msg.get("payload"):
                self._handle_price_update(msg["payload"])
        except Exception:
            pass

    def _ws_on_error(self, ws, err):
        log(f"WebSocket error: {err}", "warn")

    def _ws_on_close(self, ws, code, reason):
        if not self._running:
            return
        # Exponential backoff: 5s → 10s → 20s → … → 60s max
        delay = min(5 * (2 ** self._reconnect_attempts), 60)
        self._reconnect_attempts += 1
        log(f"WebSocket closed — reconnecting in {delay}s (attempt {self._reconnect_attempts})", "warn")
        time.sleep(delay)
        if self._running:
            self._connect_ws()

    def _connect_ws(self):
        # Bump keepalive_id to signal stale threads to exit
        self._keepalive_id += 1
        self.ws = websocket.WebSocketApp(
            CONFIG["rtds_url"],
            on_open=self._ws_on_open,
            on_message=self._ws_on_message,
            on_error=self._ws_on_error,
            on_close=self._ws_on_close,
        )
        threading.Thread(target=self.ws.run_forever, daemon=True).start()

    # ─── Price handling ────────────────────────────────────────────────────────

    def _symbol_to_asset(self, symbol: str) -> Optional[str]:
        sym_map = {cfg["symbol"]: asset for asset, cfg in CONFIG["assets"].items()}
        return sym_map.get(symbol.lower())

    def _handle_price_update(self, payload: dict):
        asset = self._symbol_to_asset(payload.get("symbol", ""))
        if not asset:
            return
        price = float(payload.get("value", 0))
        if price <= 0:
            return

        state = self.signal_states[asset]
        state.update_price(price, time.time())

        # Refresh market data if needed
        if self.market_cache.needs_refresh(asset):
            threading.Thread(target=self._refresh_market, args=(asset,), daemon=True).start()

        market = self.market_cache.get(asset)
        if not market:
            return

        # Adjust time_left for elapsed since last cache fetch (prevents stale reads)
        elapsed_since_fetch = time.time() - market.get("cached_at", time.time())
        time_left = max(0.0, market.get("time_left_s", 0) - elapsed_since_fetch)

        # ── Check exits for all open positions in this market ──
        exits = self.engine.check_exits(market["market_id"], market["up_price"], time_left)
        for (trade, reason) in exits:
            won = trade.pnl and trade.pnl > 0
            decision = self.sprt.update(won)
            trade.sprt_decision = decision
            level = "win" if won else "loss"
            pnl_str = f"+${trade.pnl:.3f}" if won else f"-${abs(trade.pnl):.3f}"
            log(f"[{trade.asset}] CLOSED {trade.direction} ({reason}) {pnl_str} | "
                f"Balance: ${self.engine.balance:.2f} | {self.sprt.summary()}", level)

            if decision in ("accept", "reject"):
                log(f"SPRT DECISION: {decision.upper()} after {self.sprt.n_trades} trades "
                    f"(win rate: {self.sprt.win_rate:.1%})", "sprt")
                self._force_close_remaining(reason=decision)  # fix: no zombie open positions
                save_journal(self.engine, self.sprt)
                self.print_final_report()
                self._running = False
                return
            save_journal(self.engine, self.sprt)

        # ── Generate signal (rate-limit: 1 per asset per 5 min) ──
        now = time.time()
        last = self._last_signal_time.get(asset, 0)
        if now - last < 300:  # 5-minute signal cooldown
            return
        if time_left < CONFIG["min_time_left_s"]:
            return

        signal = generate_signal(state, asset, price, market["up_price"])
        if signal.direction != "NONE":
            log(f"[{asset}] SIGNAL {signal.direction} confidence={signal.confidence:.2f} "
                f"factors={signal.factors}", "signal")
            trade = self.engine.execute_signal(signal, market["market_id"])
            if trade:
                self._last_signal_time[asset] = now
                log(f"[{asset}] ENTERED {trade.direction} @ {trade.entry_price:.3f} "
                    f"${trade.size_usd:.2f} ({trade.shares:.1f} shares) | "
                    f"Balance: ${self.engine.balance:.2f}", "trade")
                save_journal(self.engine, self.sprt)

        # Print status every 5 min
        if now - self._last_status_print > 300:
            self.print_status()
            self._last_status_print = now

    def _force_close_remaining(self, reason: str = "sprt_terminal"):
        """Force-close all remaining open positions when SPRT reaches a terminal decision.
        
        Fixes the 'zombie open positions' edge case flagged by Shuri:
        When SPRT hits ACCEPT/REJECT mid-session, any open positions that haven't 
        resolved yet remain permanently open in the final journal. This method closes 
        them at 0.50 (fair value — no edge assumed post-decision) before saving final state.
        
        Called by both ACCEPT and REJECT handlers before print_final_report().
        Must be called BEFORE save_journal() in the terminal path.
        """
        remaining = list(self.engine.positions)
        if not remaining:
            return
        log(f"Force-closing {len(remaining)} open position(s) on SPRT terminal decision ({reason})", "warn")
        for pos in remaining:
            # Use 0.50 as neutral exit — market hasn't resolved, no edge assumed
            # (better than leaving open or assuming win/loss)
            exit_price = 0.5
            pos.exit_price = exit_price
            pos.exit_timestamp = time.time()
            pos.pnl = (exit_price - pos.entry_price) * pos.shares  # typically small loss (~0)
            pos.status = "CLOSED"
            pos.sprt_decision = f"force_closed_{reason}"
            self.engine.balance += pos.entry_price * pos.shares + pos.pnl
            self.engine.positions.remove(pos)
            self.engine.closed_trades.append(pos)
            pnl_str = f"{pos.pnl:+.3f}"
            log(f"  [{pos.asset}] FORCE-CLOSED {pos.direction} @ 0.50 (neutral) PnL={pnl_str}", "warn")
        log(f"All positions closed. Final balance: ${self.engine.balance:.2f}", "sprt")

    def _refresh_market(self, asset: str):
        old_market = self.market_cache.get(asset)
        old_market_id = old_market.get("market_id") if old_market else None

        market = fetch_current_market(asset)
        if market:
            self.market_cache.set(asset, market)

            # ── Market rollover detection: force-close positions in expired market ──
            # When a new 15-min window opens, market_id changes. Positions tracked by
            # the OLD market_id will NEVER match check_exits() → stuck open forever.
            # Fix: when market_id changes, resolve any open positions in the old market.
            new_market_id = market.get("market_id")
            if old_market_id and new_market_id != old_market_id:
                stale_positions = [p for p in self.engine.positions if p.market_id == old_market_id]
                if stale_positions:
                    log(f"[{asset}] MARKET ROLLOVER detected: {old_market_id} → {new_market_id}. "
                        f"Force-closing {len(stale_positions)} expired position(s).", "warn")
                    # Resolve based on price at time of rollover (use current market price as proxy)
                    current_price = market.get("up_price", 0.5)
                    for pos in stale_positions:
                        resolved_yes = current_price > 0.50
                        if pos.direction == "YES":
                            exit_price = 1.0 if resolved_yes else 0.0
                        else:
                            exit_price = 1.0 if not resolved_yes else 0.0
                        pos.exit_price = exit_price
                        pos.exit_timestamp = time.time()
                        pos.pnl = (exit_price - pos.entry_price) * pos.shares
                        pos.status = "CLOSED"
                        self.engine.balance += pos.entry_price * pos.shares + pos.pnl
                        self.engine.positions.remove(pos)
                        self.engine.closed_trades.append(pos)
                        won = pos.pnl > 0
                        decision = self.sprt.update(won)
                        pos.sprt_decision = decision
                        level = "win" if won else "loss"
                        pnl_str = f"+${pos.pnl:.3f}" if won else f"-${abs(pos.pnl):.3f}"
                        log(f"[{pos.asset}] CLOSED {pos.direction} (market_rollover) {pnl_str} | "
                            f"Balance: ${self.engine.balance:.2f} | {self.sprt.summary()}", level)
                        if decision in ("accept", "reject"):
                            log(f"SPRT DECISION: {decision.upper()} after {self.sprt.n_trades} trades "
                                f"(win rate: {self.sprt.win_rate:.1%})", "sprt")
                            self._force_close_remaining(reason=decision)  # fix: no zombie open positions
                            save_journal(self.engine, self.sprt)
                            self.print_final_report()
                            self._running = False
                            return
                    save_journal(self.engine, self.sprt)

    # ─── Reporting ─────────────────────────────────────────────────────────────

    def print_status(self):
        s = self.engine.stats()
        runtime_m = int((time.time() - self.start_time) / 60)
        print("\n" + "═" * 60)
        print(f"📊 MULTI-FACTOR PAPER BOT | Runtime: {runtime_m}m")
        print("═" * 60)
        print(f"Balance: ${s['balance']:.2f} (start: ${CONFIG['starting_balance']:.2f})")
        print(f"P&L: ${s['total_pnl']:+.3f} ({s['pnl_pct']:+.1f}%)")
        print(f"Trades: {s['total_trades']} | Wins: {s['wins']} | Losses: {s['losses']} | "
              f"Win Rate: {s['win_rate']:.1%}")
        print(f"Open positions: {s['open_positions']}")
        print(f"SPRT: {self.sprt.summary()}")
        print("═" * 60 + "\n")

    def print_final_report(self):
        s = self.engine.stats()
        print("\n" + "═" * 70)
        print("🏁 PAPER TRADING SESSION COMPLETE")
        print("═" * 70)
        print(f"Final Balance: ${s['balance']:.2f} (started: ${CONFIG['starting_balance']:.2f})")
        print(f"Total P&L: ${s['total_pnl']:+.3f} ({s['pnl_pct']:+.1f}%)")
        print(f"Trades: {s['total_trades']} | Win Rate: {s['win_rate']:.1%}")
        print()
        print("SPRT Result:")
        print(f"  n_trades: {self.sprt.n_trades}")
        print(f"  n_wins: {self.sprt.n_wins}")
        print(f"  win_rate: {self.sprt.win_rate:.1%}")
        print(f"  log_LR: {self.sprt.log_lr:.4f}")
        print(f"  boundaries: [{self.sprt.B:.3f}, {self.sprt.A:.3f}]")
        decision = "ACCEPT (strategy works)" if self.sprt.log_lr >= self.sprt.A else \
                   "REJECT (strategy doesn't work)" if self.sprt.log_lr <= self.sprt.B else \
                   "INCONCLUSIVE (need more trades)"
        print(f"  Decision: {decision}")
        print()
        print("Factor Attribution:")
        factor_wins: dict[str, list] = {"regime_transition": [], "cluster_proximity": [], "vrp": []}
        for t in self.engine.closed_trades:
            if t.pnl is not None:
                for f, v in t.signal.factors.items():
                    if f in factor_wins:
                        factor_wins[f].append((v, t.pnl))
        for fname, data in factor_wins.items():
            if data:
                avg_contrib = sum(v * p for v, p in data) / len(data)
                print(f"  {fname}: avg contribution ${avg_contrib:+.4f}")
        print("═" * 70)
        print(f"Full journal: {CONFIG['journal_file']}")

    # ─── Run ───────────────────────────────────────────────────────────────────

    def run(self):
        runtime_h = CONFIG["runtime_h"]
        print("═" * 60)
        print("📈 MULTI-FACTOR PAPER TRADING BOT")
        print(f"Assets: BTC, ETH, SOL, XRP | Balance: ${CONFIG['starting_balance']:.2f}")
        print(f"Signal: regime({CONFIG['factor_weights']['regime_transition']:.0%}) + "
              f"cluster({CONFIG['factor_weights']['cluster_proximity']:.0%}) + "
              f"VRP({CONFIG['factor_weights']['vrp']:.0%})")
        print(f"SPRT: p0={self.sprt.p0} p1={self.sprt.p1} α={self.sprt.alpha} β={self.sprt.beta}")
        print(f"Runtime: {runtime_h}h max")
        print("═" * 60 + "\n")

        self._running = True
        self._connect_ws()

        # Pre-fetch all markets
        for asset in CONFIG["assets"]:
            log(f"Fetching market data: {asset}", "info")
            self._refresh_market(asset)
            time.sleep(0.5)

        # Run until SPRT decision or timeout
        end_time = self.start_time + runtime_h * 3600
        try:
            while self._running and time.time() < end_time:
                time.sleep(1)
        except KeyboardInterrupt:
            log("Interrupted — saving journal...", "warn")

        self._running = False
        save_journal(self.engine, self.sprt)
        self.print_final_report()
        log(f"Session complete. Journal: {CONFIG['journal_file']}", "info")


# ═══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    # Change to bot directory for relative file paths
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    bot = PaperTradingBot()
    bot.run()
