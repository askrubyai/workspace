#!/usr/bin/env python3
"""
LIVE TRADING BOT — V1
Real USDC trading on Polymarket 15-min crypto binary markets

Architecture:
  CLOB Auth → Market Discovery → Signal Engine (multi-factor) → Kelly Sizing → Live Execution → SPRT

Key differences from paper-bot-multifactor.py:
  - Real CLOB order placement (py_clob_client)
  - Actual USDC balance from Polygon wallet
  - Token ID lookup per market (YES/NO conditional tokens)
  - FOK (Fill or Kill) limit orders — skip if not filled
  - No reversal stop in v1 (let binary markets resolve naturally)
  - min_bet_usd = $5.00 (Polymarket live minimum)
  - DRY_RUN mode: default True — set to False to enable real USDC trading

✅  PARAMETERS UPDATED — Day 9 Signal Filtering (published 2026-02-18 01:46 IST)
  - signal_threshold: 0.30 (Gate 1 composite score threshold; 60% of signals below this)
  - SPRT p1:          0.65 (Gate 2 win rate gate — testing for ≥65% win rate)
  - backtest_win_rate: 0.70 (conservative; paper run achieved 89.3%, expect regression)
  Updated: 2026-02-18 02:30 IST (Jarvis — commits 5cbd269 + b5589bd)

Built: 2026-02-18 01:00 IST (Friday — live trading infrastructure)
Wallet: 0x2FC6896bDFB507002D1A534313C67686111cDfdA (Polygon)
Fee structure: Polymarket 0/0 bps (maker/taker, dropped Feb 2026)
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
import websocket
import requests

from py_clob_client.client import ClobClient
from py_clob_client.constants import POLYGON
from py_clob_client.clob_types import (
    ApiCreds, OrderArgs, OrderType, BalanceAllowanceParams, AssetType
)
from py_clob_client.order_builder.constants import BUY, SELL

# ═══════════════════════════════════════════════════════════════════════════════
# CONFIG — ⚠️ Update signal_threshold + SPRT p1 from Day 9 research before run
# ═══════════════════════════════════════════════════════════════════════════════

CONFIG = {
    # ── Network ────────────────────────────────────────────────────────────────
    "gamma_api": "https://gamma-api.polymarket.com",
    "clob_host": "https://clob.polymarket.com",
    "rtds_url": "wss://ws-live-data.polymarket.com/",

    # ── Safety ─────────────────────────────────────────────────────────────────
    "dry_run": True,                   # ⚠️ SET TO False TO ENABLE REAL TRADING
    "max_loss_usd": 8.00,              # Hard stop: halt if balance drops below $2
    "starting_balance": 10.49,         # Initial USDC balance (from Polygon, updated live)

    # ── Position Management ────────────────────────────────────────────────────
    "max_position_pct": 0.20,          # Max 20% of balance per trade
    "max_positions": 3,                # Max concurrent open positions
    "spread_bps": 50,                  # 0.50% spread assumption for limit pricing

    # ── Signal Filtering — ⚠️ UPDATE FROM DAY 9 RESEARCH ─────────────────────
    "signal_threshold": 0.30,          # Day 9: Gate 1 composite score threshold (60% of signals below this)
    "max_entry_price": 0.65,           # Don't enter above 65 cents (low reward)
    "min_entry_price": 0.20,           # Don't enter below 20 cents (high risk)
    "min_time_left_s": 90,             # Min 90s before market resolves (live orders need time)

    # ── Kelly Criterion — ⚠️ CALIBRATE BACKTEST_WIN_RATE FROM DAY 9 ──────────
    "backtest_win_rate": 0.70,         # Day 9: conservative estimate for Kelly sizing (paper run 89.3%, expect regression to ~70%)
    "kelly_multiplier": 0.50,          # Fractional Kelly: 0.5 = half Kelly (conservative)
    "min_bet_usd": 5.00,               # Polymarket live minimum bet (not $1 like paper)

    # ── Order Settings ─────────────────────────────────────────────────────────
    "order_type": "FOK",               # Fill or Kill: fill immediately or cancel
    "order_timeout_s": 10,             # How long to wait before checking if FOK filled
    "kelly_skip_enabled": True,        # Skip trade if full Kelly < min_bet

    # ── SPRT — ⚠️ UPDATE p1 FROM DAY 9 ───────────────────────────────────────
    "sprt_p0": 0.50,                   # Null hypothesis: random (50% win rate)
    "sprt_p1": 0.65,                   # Day 9 confirmed: Gate 2 win rate gate = w ≥ 0.65 (testing for this threshold)
    "sprt_alpha": 0.05,                # Type I error (false positive)
    "sprt_beta": 0.20,                 # Type II error (false negative)

    # ── Assets (series IDs for 15-min BTC/ETH/SOL/XRP) ───────────────────────
    "assets": {
        "BTC": {"series_id": "10192", "symbol": "btc/usd"},
        "ETH": {"series_id": "10191", "symbol": "eth/usd"},
        "SOL": {"series_id": "10423", "symbol": "sol/usd"},
        "XRP": {"series_id": "10422", "symbol": "xrp/usd"},
    },

    # ── Factor Weights (must sum to 1.0) ──────────────────────────────────────
    "factor_weights": {
        "regime_transition": 0.40,
        "cluster_proximity": 0.30,
        "vrp": 0.30,
    },

    # ── Runtime ───────────────────────────────────────────────────────────────
    "runtime_h": 8,                    # Max run duration
    "log_file": "paper-trading-results/live-v1.log",
    "journal_file": "paper-trading-results/live-v1-journal.json",
}

# ═══════════════════════════════════════════════════════════════════════════════
# SIGNAL ENGINE — identical to paper bot (signalState, SPRT, Signal)
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class SignalState:
    rv_window: deque = field(default_factory=lambda: deque(maxlen=288))
    price_history: deque = field(default_factory=lambda: deque(maxlen=288))
    last_regime: str = "NORMAL"
    current_regime: str = "NORMAL"

    def update_price(self, price: float, timestamp: float):
        self.price_history.append((timestamp, price))
        if len(self.price_history) >= 2:
            prev_ts, prev_price = self.price_history[-2]
            if prev_ts > 0:
                dt = timestamp - prev_ts
                if dt > 0:
                    ret = math.log(price / prev_price)
                    self.rv_window.append(ret ** 2)

    @property
    def realized_vol(self) -> float:
        if len(self.rv_window) < 5:
            return 0.01
        return float(np.sqrt(np.mean(list(self.rv_window))))

    @property
    def regime(self) -> str:
        return self.current_regime


@dataclass
class Signal:
    asset: str
    direction: str           # "YES" (price goes up), "NO" (price goes down), "NONE"
    binary_price: float      # Current binary market price for the direction
    confidence: float        # Composite score (0-1)
    factors: dict            # Factor contributions


class SPRT:
    def __init__(self, p0: float, p1: float, alpha: float, beta: float):
        self.p0, self.p1 = p0, p1
        self.alpha, self.beta = alpha, beta
        self.A = math.log((1 - beta) / alpha)
        self.B = math.log(beta / (1 - alpha))
        self.log_lr = 0.0
        self.n_trades = 0
        self.n_wins = 0

    def update(self, win: bool) -> Optional[str]:
        self.n_trades += 1
        if win:
            self.n_wins += 1
        llr_increment = (
            math.log(self.p1 / self.p0) if win
            else math.log((1 - self.p1) / (1 - self.p0))
        )
        self.log_lr += llr_increment
        if self.log_lr >= self.A:
            return "accept"
        if self.log_lr <= self.B:
            return "reject"
        return None

    @property
    def win_rate(self) -> float:
        return self.n_wins / self.n_trades if self.n_trades > 0 else 0.0

    @property
    def progress_pct(self) -> float:
        total = self.A - self.B
        current = self.log_lr - self.B
        return max(0.0, min(100.0, (current / total) * 100)) if total > 0 else 0.0

    def summary(self) -> str:
        progress_to_accept = (self.log_lr / self.A * 100) if self.A > 0 else 0
        direction = "→ ACCEPT" if self.log_lr > 0 else "→ REJECT"
        return (f"SPRT n={self.n_trades} win={self.win_rate:.1%} "
                f"logLR={self.log_lr:.3f}/{self.A:.3f} "
                f"({progress_to_accept:.1f}% to ACCEPT) {direction}")


# ═══════════════════════════════════════════════════════════════════════════════
# LIVE TRADE DATACLASS
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class LiveTrade:
    trade_id: str
    timestamp: float
    market_id: str           # Gamma market id
    condition_id: str        # CLOB condition_id (for market lookup)
    token_id: str            # YES or NO conditional token id
    asset: str
    direction: str           # "YES" or "NO"
    entry_price: float       # Price at which order was placed
    size_usd: float          # USDC spent
    shares: float            # Shares purchased (size_usd / entry_price)
    signal: Signal
    # Kelly tracking
    kelly_w_estimate: float = 0.0
    kelly_f_star: float = 0.0
    kelly_f_practical: float = 0.0
    # Lifecycle
    clob_order_id: Optional[str] = None
    order_status: str = "PENDING"    # PENDING → FILLED → CLOSED
    exit_price: Optional[float] = None
    exit_timestamp: Optional[float] = None
    pnl: Optional[float] = None
    status: str = "OPEN"
    sprt_decision: Optional[str] = None
    resolution: Optional[str] = None   # "win" or "loss" when market resolves


# ═══════════════════════════════════════════════════════════════════════════════
# LIVE ENGINE — replaces PaperEngine
# ═══════════════════════════════════════════════════════════════════════════════

class LiveEngine:
    def __init__(self, clob_client: ClobClient, starting_balance: float):
        self.client = clob_client
        self.balance = starting_balance
        self.positions: list[LiveTrade] = []
        self.closed_trades: list[LiveTrade] = []
        self.trade_counter = 0
        self.dry_run = CONFIG["dry_run"]

    def fetch_live_balance(self) -> float:
        """Read actual USDC balance from Polygon via CLOB API."""
        try:
            bal = self.client.get_balance_allowance(
                BalanceAllowanceParams(asset_type=AssetType.COLLATERAL)
            )
            # Balance is in USDC with 6 decimal places
            raw_balance = int(bal.get("balance", 0))
            usdc_balance = raw_balance / 1_000_000
            return usdc_balance
        except Exception as e:
            log(f"Balance fetch error: {e}", "error")
            return self.balance  # Return cached balance on error

    def get_token_ids(self, condition_id: str) -> Optional[tuple[str, str]]:
        """Get YES (Up) and NO (Down) token IDs for a market condition_id.
        
        Polymarket 15-min crypto markets use 'Up'/'Down' outcomes (not 'Yes'/'No').
        This method handles both naming conventions.
        """
        try:
            market = self.client.get_market(condition_id)
            tokens = market.get("tokens", [])
            # 15-min BTC/ETH/SOL/XRP markets use "Up"/"Down"
            # Other markets use "Yes"/"No"
            token_yes = next((t["token_id"] for t in tokens
                              if t.get("outcome") in ("Yes", "Up")), None)
            token_no = next((t["token_id"] for t in tokens
                             if t.get("outcome") in ("No", "Down")), None)
            return token_yes, token_no
        except Exception as e:
            log(f"Token ID lookup error for {condition_id}: {e}", "error")
            return None, None

    def _compute_kelly(self, signal: Signal) -> tuple[float, float, float, float]:
        """Compute Kelly fraction and bet size. Returns (w_estimate, f_star, f_practical, size_usd)."""
        p_entry = signal.binary_price
        base_win_rate = CONFIG["backtest_win_rate"]
        edge = base_win_rate - 0.50
        confidence_scale = signal.confidence / CONFIG["signal_threshold"]
        w_estimate = 0.50 + edge * confidence_scale
        w_estimate = min(w_estimate, 0.85)

        f_star = (w_estimate - p_entry) / (1.0 - p_entry)
        if f_star <= 0:
            return w_estimate, f_star, 0.0, 0.0

        f_practical = CONFIG["kelly_multiplier"] * f_star
        size_usd = self.balance * f_practical
        return w_estimate, f_star, f_practical, size_usd

    def execute_signal(self, signal: Signal, market_id: str,
                       condition_id: str) -> Optional[LiveTrade]:
        """Place a real (or dry-run) limit order on Polymarket."""
        if signal.direction == "NONE":
            return None
        if len(self.positions) >= CONFIG["max_positions"]:
            return None
        for pos in self.positions:
            if pos.asset == signal.asset:
                return None  # One position per asset

        # ── Balance check ────────────────────────────────────────────────────
        min_bet = CONFIG["min_bet_usd"]
        if self.balance < min_bet:
            log(f"Insufficient balance ${self.balance:.2f} < ${min_bet:.2f} min bet", "warn")
            return None

        # ── Hard stop ────────────────────────────────────────────────────────
        if self.balance < (CONFIG["starting_balance"] - CONFIG["max_loss_usd"]):
            log(f"⛔ HARD STOP: Balance ${self.balance:.2f} — max loss hit", "error")
            return None

        # ── Kelly sizing ─────────────────────────────────────────────────────
        w_estimate, f_star, f_practical, size_usd = self._compute_kelly(signal)

        if f_star <= 0:
            return None

        # Kelly skip: edge doesn't justify minimum bet
        full_kelly_size = self.balance * f_star
        if CONFIG.get("kelly_skip_enabled") and full_kelly_size < min_bet:
            log(f"[KELLY_SKIP] {signal.asset} | conf={signal.confidence:.2f} | "
                f"w={w_estimate:.3f} | f*={f_star:.3%} | full_kelly=${full_kelly_size:.2f} < ${min_bet:.2f}", "info")
            return None

        size_usd = max(min_bet, size_usd)
        size_usd = min(size_usd, self.balance * 0.50)
        if size_usd > self.balance:
            return None

        # ── Token lookup ─────────────────────────────────────────────────────
        token_id_yes, token_id_no = self.get_token_ids(condition_id)
        if not token_id_yes or not token_id_no:
            log(f"Could not resolve token IDs for {condition_id}", "error")
            return None

        token_id = token_id_yes if signal.direction == "YES" else token_id_no

        # ── Limit price: entry at market price (maker) ────────────────────────
        spread_adj = CONFIG["spread_bps"] / 10000.0
        if signal.direction == "YES":
            limit_price = round(signal.binary_price + spread_adj / 2, 4)
        else:
            limit_price = round(signal.binary_price - spread_adj / 2, 4)
        limit_price = max(0.01, min(0.99, limit_price))

        # Shares = size_usd / price (limit price ≈ cost per share)
        shares = round(size_usd / limit_price, 2)

        self.trade_counter += 1
        trade_id = f"LT-{self.trade_counter:04d}"

        log(f"[{signal.asset}] SIGNAL → {signal.direction} | "
            f"price={signal.binary_price:.3f} | conf={signal.confidence:.2f} | "
            f"size=${size_usd:.2f} ({shares:.1f} shares @ {limit_price:.3f}) | "
            f"{'DRY_RUN' if self.dry_run else 'LIVE'}", "trade")

        clob_order_id = None
        order_filled = False

        if self.dry_run:
            # Simulate immediate fill in dry run
            clob_order_id = f"DRY-{trade_id}"
            order_filled = True
            log(f"[DRY_RUN] Order simulated: {trade_id}", "trade")
        else:
            # ── Place real FOK limit order ────────────────────────────────────
            try:
                order_args = OrderArgs(
                    token_id=token_id,
                    price=limit_price,
                    size=shares,
                    side=BUY,                    # Always BUY the direction token
                    fee_rate_bps=0,              # 0 bps (Polymarket fee structure)
                )
                resp = self.client.create_and_post_order(
                    order_args,
                    options={"orderType": OrderType.FOK}
                )
                clob_order_id = resp.get("orderID") if isinstance(resp, dict) else None
                status = resp.get("status", "") if isinstance(resp, dict) else ""

                if status in ("matched", "filled", "MATCHED", "FILLED"):
                    order_filled = True
                    log(f"[{signal.asset}] ORDER FILLED: {clob_order_id}", "trade")
                else:
                    log(f"[{signal.asset}] ORDER NOT FILLED (status={status}) — FOK killed", "warn")
                    return None  # FOK killed, no position opened

            except Exception as e:
                log(f"Order placement error: {e}", "error")
                return None

        # ── Record position ───────────────────────────────────────────────────
        trade = LiveTrade(
            trade_id=trade_id,
            timestamp=time.time(),
            market_id=market_id,
            condition_id=condition_id,
            token_id=token_id,
            asset=signal.asset,
            direction=signal.direction,
            entry_price=limit_price,
            size_usd=size_usd,
            shares=shares,
            signal=signal,
            kelly_w_estimate=w_estimate,
            kelly_f_star=f_star,
            kelly_f_practical=f_practical,
            clob_order_id=clob_order_id,
            order_status="FILLED" if order_filled else "PENDING",
        )

        self.positions.append(trade)
        self.balance -= size_usd
        return trade

    def check_exits(self, market_id: str, binary_price: float,
                    time_remaining_s: float) -> list[tuple]:
        """
        Check for resolved positions.
        
        V1 design: NO reversal stop — let binary markets resolve naturally.
        This avoids complexity of sell-order management on CLOB.
        Only close positions when market resolves (time_remaining_s <= 0).
        
        At resolution: binary outcome (price → 1.0 if winner, 0.0 if loser).
        """
        exits = []
        for pos in self.positions[:]:
            if pos.market_id != market_id:
                continue
            if pos.order_status not in ("FILLED",):
                continue  # Don't close unfilled orders

            if time_remaining_s <= 0:
                # Market resolved: binary outcome
                resolved_yes = binary_price > 0.50
                if pos.direction == "YES":
                    exit_price = 1.0 if resolved_yes else 0.0
                    pos.resolution = "win" if resolved_yes else "loss"
                else:
                    exit_price = 1.0 if not resolved_yes else 0.0
                    pos.resolution = "win" if not resolved_yes else "loss"

                pos.exit_price = exit_price
                pos.exit_timestamp = time.time()
                pos.pnl = (exit_price - pos.entry_price) * pos.shares
                pos.status = "CLOSED"

                # Return capital: stake + P&L
                returned = pos.entry_price * pos.shares + pos.pnl
                self.balance += returned

                self.positions.remove(pos)
                self.closed_trades.append(pos)
                exits.append((pos, "resolution"))

                level = "win" if pos.pnl > 0 else "loss"
                log(f"[{pos.asset}] RESOLVED {pos.resolution.upper()}: "
                    f"pnl=${pos.pnl:.3f} | balance=${self.balance:.2f}", level)

        return exits

    def force_close_remaining(self, reason: str = "SPRT terminal"):
        """Force-close all open positions on SPRT ACCEPT/REJECT.
        
        Uses neutral exit price (0.50) — no edge assumed post-decision.
        In dry_run: simulates close. In live: ideally cancel orders (v2 feature).
        """
        remaining = [p for p in self.positions if p.order_status == "FILLED"]
        if not remaining:
            return
        log(f"Force-closing {len(remaining)} position(s) on {reason}", "warn")
        for pos in remaining:
            pos.exit_price = 0.50
            pos.exit_timestamp = time.time()
            pos.pnl = (0.50 - pos.entry_price) * pos.shares
            pos.status = "CLOSED"
            pos.resolution = "win" if pos.pnl > 0 else "loss"

            returned = pos.entry_price * pos.shares + pos.pnl
            self.balance += returned

            self.positions.remove(pos)
            self.closed_trades.append(pos)

    def stats(self) -> dict:
        wins = sum(1 for t in self.closed_trades if t.pnl and t.pnl > 0)
        losses = len(self.closed_trades) - wins
        total_pnl = sum(t.pnl or 0 for t in self.closed_trades)
        return {
            "balance": round(self.balance, 4),
            "total_trades": len(self.closed_trades),
            "open_positions": len(self.positions),
            "wins": wins,
            "losses": losses,
            "win_rate": wins / len(self.closed_trades) if self.closed_trades else 0.0,
            "total_pnl": round(total_pnl, 4),
            "return_pct": round(
                (self.balance - CONFIG["starting_balance"]) / CONFIG["starting_balance"] * 100, 2
            ),
            "dry_run": self.dry_run,
        }


# ═══════════════════════════════════════════════════════════════════════════════
# MARKET DATA
# ═══════════════════════════════════════════════════════════════════════════════

class MarketCache:
    def __init__(self):
        self._markets: dict[str, dict] = {}
        self._last_refresh: dict[str, float] = {}
        self._lock = threading.Lock()

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
    """Fetch active 15-min binary market. Returns market dict including condition_id."""
    try:
        series_id = CONFIG["assets"][asset]["series_id"]
        series_url = f"{CONFIG['gamma_api']}/series/{series_id}"
        series_resp = requests.get(series_url, timeout=5)
        if series_resp.status_code != 200:
            return None
        series_data = series_resp.json()
        events_meta = series_data.get("events", [])
        if not events_meta:
            return None

        # Try last 5 events (newest first) to find active one
        recent_event_ids = [ev.get("id") for ev in events_meta[-5:] if ev.get("id")]
        recent_event_ids.reverse()

        market = None
        condition_id = None
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
                condition_id = candidate.get("conditionId")
                break

        if not market:
            return None

        # Parse binary prices
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
                end_dt = datetime.fromisoformat(end_date.replace("Z", "+00:00"))
                now_dt = datetime.now(timezone.utc)
                time_left_s = max(0, (end_dt - now_dt).total_seconds())
            except Exception:
                pass

        return {
            "market_id": market.get("id") or condition_id,
            "condition_id": condition_id,
            "question": market.get("question", f"{asset} 15m binary"),
            "up_price": up_price,
            "down_price": down_price,
            "time_left_s": time_left_s,
            "cached_at": time.time(),
        }
    except Exception as e:
        return None


# ═══════════════════════════════════════════════════════════════════════════════
# SIGNAL COMPUTATION — identical logic to paper bot
# ═══════════════════════════════════════════════════════════════════════════════

def compute_signal(state: SignalState, binary_price: float, asset: str) -> Signal:
    """Compute multi-factor signal. Identical to paper bot signal engine."""
    factors = {}
    weights = CONFIG["factor_weights"]

    # ── Factor 1: Regime Transition ───────────────────────────────────────────
    rv = state.realized_vol
    rv_ema_fast = rv  # Simplified for v1; production would use proper EMA
    regime_score = 0.0
    if rv > 0.015:
        state.current_regime = "HIGH_VOL"
        regime_score = min(rv / 0.03, 1.0)
    else:
        state.current_regime = "NORMAL"
    factors["regime_transition"] = round(regime_score * weights["regime_transition"], 4)

    # ── Factor 2: Cluster Proximity ───────────────────────────────────────────
    # Proxy via binary price distance from 50¢ (market has strong directional view)
    cluster_score = abs(binary_price - 0.50) * 2
    cluster_score = min(cluster_score, 1.0)
    factors["cluster_proximity"] = round(cluster_score * weights["cluster_proximity"], 4)

    # ── Factor 3: VRP (Volatility Risk Premium) ───────────────────────────────
    iv_estimate = abs(binary_price - 0.50) * 2
    vrp = max(0, iv_estimate - rv)
    vrp_score = min(vrp / 0.02, 1.0) if rv > 0 else 0.0
    factors["vrp"] = round(vrp_score * weights["vrp"], 4)

    # ── Composite Score ───────────────────────────────────────────────────────
    confidence = sum(factors.values())

    # ── Direction: bet on market continuing current momentum ──────────────────
    direction = "NONE"
    if confidence >= CONFIG["signal_threshold"]:
        if binary_price < 0.50:
            direction = "NO"    # "Down" is more likely
            trade_price = binary_price  # Entry price for NO = up_price
        else:
            direction = "YES"   # "Up" is more likely
            trade_price = 1.0 - binary_price  # Entry price for YES token (down side)
        # Adjust: use the actual binary_price as our entry reference
        trade_price = binary_price
    else:
        trade_price = binary_price

    return Signal(
        asset=asset,
        direction=direction,
        binary_price=trade_price,
        confidence=round(confidence, 4),
        factors=factors,
    )


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
            os.makedirs(os.path.dirname(CONFIG["log_file"]), exist_ok=True)
            with open(CONFIG["log_file"], "a") as f:
                f.write(line + "\n")
        except Exception:
            pass


def save_journal(engine: LiveEngine, sprt: SPRT):
    try:
        journal = {
            "updated_at": datetime.now().isoformat(),
            "dry_run": engine.dry_run,
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
                    "condition_id": p.condition_id,
                    "clob_order_id": p.clob_order_id,
                    "order_status": p.order_status,
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
                    "resolution": t.resolution,
                    "signal_confidence": t.signal.confidence,
                    "signal_factors": t.signal.factors,
                    "status": t.status,
                    "clob_order_id": t.clob_order_id,
                    "opened_at": datetime.fromtimestamp(t.timestamp).isoformat(),
                    "closed_at": datetime.fromtimestamp(t.exit_timestamp).isoformat() if t.exit_timestamp else None,
                    "kelly": {
                        "w_estimate": round(t.kelly_w_estimate, 4),
                        "f_star": round(t.kelly_f_star, 4),
                        "f_practical": round(t.kelly_f_practical, 4),
                    },
                }
                for t in engine.closed_trades
            ],
        }
        os.makedirs(os.path.dirname(CONFIG["journal_file"]), exist_ok=True)
        with open(CONFIG["journal_file"], "w") as f:
            json.dump(journal, f, indent=2)
    except Exception as e:
        log(f"Journal save error: {e}", "error")


# ═══════════════════════════════════════════════════════════════════════════════
# MAIN BOT
# ═══════════════════════════════════════════════════════════════════════════════

class LiveTradingBot:
    def __init__(self):
        # ── CLOB client setup ─────────────────────────────────────────────────
        wallet_path = os.path.expanduser("~/.credentials/ruby-polygon-wallet.json")
        with open(wallet_path) as f:
            wallet = json.load(f)

        # Build Level 1 client first to derive API creds
        l1_client = ClobClient(
            host=CONFIG["clob_host"],
            chain_id=POLYGON,
            key=wallet["private_key"],
            signature_type=0,
        )
        creds = l1_client.derive_api_key()
        log(f"CLOB authenticated | key={creds.api_key[:8]}...", "info")

        self.clob_client = ClobClient(
            host=CONFIG["clob_host"],
            chain_id=POLYGON,
            key=wallet["private_key"],
            creds=creds,
            signature_type=0,
        )

        # ── Engine setup ──────────────────────────────────────────────────────
        starting_bal = self.clob_client.get_balance_allowance(
            BalanceAllowanceParams(asset_type=AssetType.COLLATERAL)
        )
        usdc_balance = int(starting_bal.get("balance", 0)) / 1_000_000
        log(f"Live USDC balance: ${usdc_balance:.4f}", "info")

        if not CONFIG["dry_run"] and usdc_balance < CONFIG["min_bet_usd"]:
            log(f"⛔ Insufficient balance for live trading. ${usdc_balance:.2f} < ${CONFIG['min_bet_usd']:.2f}", "error")
            sys.exit(1)

        self.engine = LiveEngine(self.clob_client, usdc_balance)
        self.sprt = SPRT(
            p0=CONFIG["sprt_p0"],
            p1=CONFIG["sprt_p1"],
            alpha=CONFIG["sprt_alpha"],
            beta=CONFIG["sprt_beta"],
        )
        self.signal_states: dict[str, SignalState] = {
            asset: SignalState() for asset in CONFIG["assets"]
        }
        self.market_cache = MarketCache()
        self.start_time = time.time()
        self._stop = threading.Event()

        mode = "🟡 DRY RUN (no real USDC)" if CONFIG["dry_run"] else "🔴 LIVE TRADING (real USDC)"
        log(f"LiveTradingBot initialized | {mode}", "info")
        log(f"signal_threshold={CONFIG['signal_threshold']} | SPRT p1={CONFIG['sprt_p1']} | "
            f"min_bet=${CONFIG['min_bet_usd']:.2f}", "info")

    # ── Market refresh thread ────────────────────────────────────────────────

    def _refresh_market(self, asset: str):
        while not self._stop.is_set():
            try:
                market = fetch_current_market(asset)
                if market:
                    self.market_cache.set(asset, market)
            except Exception as e:
                log(f"Market refresh error [{asset}]: {e}", "warn")
            time.sleep(15)

    # ── WebSocket handler ────────────────────────────────────────────────────

    def _on_message(self, ws, raw: str, asset: str):
        """Handle RTDS WebSocket message for an asset."""
        try:
            data = json.loads(raw)
        except Exception:
            return

        # Get current market data
        market = self.market_cache.get(asset)
        if not market:
            return

        binary_price = market.get("up_price", 0.5)
        time_left = market.get("time_left_s", 0)

        # Staleness correction
        cached_at = market.get("cached_at", time.time())
        elapsed = time.time() - cached_at
        time_left = max(0, time_left - elapsed)

        # Update signal state
        state = self.signal_states[asset]
        state.update_price(binary_price, time.time())

        # Check exits (resolution only in v1)
        exits = self.engine.check_exits(market["market_id"], binary_price, time_left)
        for pos, reason in exits:
            win = pos.pnl and pos.pnl > 0
            decision = self.sprt.update(win)
            pos.sprt_decision = decision
            save_journal(self.engine, self.sprt)
            log(f"[{asset}] {self.sprt.summary()}", "sprt")

            if decision:
                self._handle_sprt_decision(decision)

        # Compute signal and potentially enter
        if time_left >= CONFIG["min_time_left_s"]:
            signal = compute_signal(state, binary_price, asset)

            if signal.direction != "NONE":
                log(f"[{asset}] SIGNAL conf={signal.confidence:.3f} | "
                    f"factors={signal.factors} | dir={signal.direction}", "signal")

                condition_id = market.get("condition_id")
                if condition_id:
                    trade = self.engine.execute_signal(
                        signal, market["market_id"], condition_id
                    )
                    if trade:
                        log(f"[{asset}] {'DRY_RUN ' if CONFIG['dry_run'] else ''}ENTERED: "
                            f"{trade.trade_id} | {signal.direction} | ${trade.size_usd:.2f} | "
                            f"conf={signal.confidence:.3f}", "trade")
                        save_journal(self.engine, self.sprt)

        # Market rollover detection
        self._check_market_rollover(asset, market)

    def _check_market_rollover(self, asset: str, old_market: dict):
        """Detect market_id change and close stale positions."""
        if self.market_cache.needs_refresh(asset, ttl_s=30.0):
            new_market = fetch_current_market(asset)
            if new_market:
                old_market_id = old_market.get("market_id")
                new_market_id = new_market.get("market_id")
                if old_market_id and new_market_id != old_market_id:
                    stale = [p for p in self.engine.positions if p.market_id == old_market_id]
                    if stale:
                        log(f"[{asset}] MARKET ROLLOVER: {old_market_id} → {new_market_id}. "
                            f"Force-closing {len(stale)} stale position(s).", "warn")
                        for pos in stale:
                            pos.exit_price = old_market.get("up_price", 0.5)
                            pos.exit_timestamp = time.time()
                            pos.pnl = (pos.exit_price - pos.entry_price) * pos.shares
                            pos.status = "CLOSED"
                            pos.resolution = "win" if pos.pnl > 0 else "loss"
                            returned = pos.entry_price * pos.shares + pos.pnl
                            self.engine.balance += returned
                            self.engine.positions.remove(pos)
                            self.engine.closed_trades.append(pos)
                        save_journal(self.engine, self.sprt)
                self.market_cache.set(asset, new_market)

    def _handle_sprt_decision(self, decision: str):
        """Handle SPRT ACCEPT/REJECT terminal decision."""
        log(f"🏁 SPRT {decision.upper()} — n={self.sprt.n_trades} | "
            f"win_rate={self.sprt.win_rate:.1%} | balance=${self.engine.balance:.2f}", "sprt")

        self.engine.force_close_remaining(reason=f"SPRT {decision.upper()}")
        save_journal(self.engine, self.sprt)
        self._stop.set()

    # ── WebSocket connection per asset ───────────────────────────────────────

    def _run_ws_for_asset(self, asset: str):
        """Run WebSocket connection for one asset with reconnect logic."""
        config = CONFIG["assets"][asset]
        _last_msg_time = [time.time()]

        def on_message(ws, msg):
            _last_msg_time[0] = time.time()
            self._on_message(ws, msg, asset)

        def on_error(ws, err):
            log(f"[{asset}] WS error: {err}", "warn")

        def on_close(ws, code, msg):
            log(f"[{asset}] WS closed (code={code})", "warn")

        def on_open(ws):
            sub = json.dumps({"assets_ids": [config["series_id"]], "type": "subscribe"})
            ws.send(sub)
            log(f"[{asset}] WS subscribed to series {config['series_id']}", "info")

        while not self._stop.is_set():
            try:
                ws = websocket.WebSocketApp(
                    CONFIG["rtds_url"],
                    on_message=on_message,
                    on_error=on_error,
                    on_close=on_close,
                    on_open=on_open,
                )
                ws.run_forever(ping_interval=30, ping_timeout=10)
            except Exception as e:
                log(f"[{asset}] WS exception: {e}", "error")

            if not self._stop.is_set():
                log(f"[{asset}] Reconnecting in 5s...", "warn")
                time.sleep(5)

    # ── Main run ─────────────────────────────────────────────────────────────

    def run(self):
        log("=" * 60, "info")
        log("LIVE BOT V1 STARTING", "info")
        log(f"Wallet: 0x2FC6896bDFB507002D1A534313C67686111cDfdA", "info")
        log(f"Balance: ${self.engine.balance:.4f} USDC", "info")
        log(f"Mode: {'DRY RUN 🟡' if CONFIG['dry_run'] else 'LIVE 🔴'}", "info")
        log(f"Signal threshold: {CONFIG['signal_threshold']} | SPRT p1: {CONFIG['sprt_p1']}", "info")
        log(f"Max runtime: {CONFIG['runtime_h']}h | Max positions: {CONFIG['max_positions']}", "info")
        log("=" * 60, "info")

        # Start market refresh threads
        for asset in CONFIG["assets"]:
            market = fetch_current_market(asset)
            if market:
                self.market_cache.set(asset, market)
                log(f"[{asset}] Market: {market['question'][:50]} | "
                    f"up={market['up_price']:.3f} | t_left={market['time_left_s']:.0f}s", "info")

            t = threading.Thread(target=self._refresh_market, args=(asset,), daemon=True)
            t.start()

        # Start WS threads for each asset
        ws_threads = []
        for asset in CONFIG["assets"]:
            t = threading.Thread(target=self._run_ws_for_asset, args=(asset,), daemon=True)
            t.start()
            ws_threads.append(t)

        # Main loop: check timeout + balance
        end_time = self.start_time + CONFIG["runtime_h"] * 3600
        try:
            while not self._stop.is_set():
                if time.time() > end_time:
                    log(f"Runtime limit ({CONFIG['runtime_h']}h) reached", "warn")
                    self._stop.set()

                # Periodic balance sync (every 5 min for live mode)
                if not CONFIG["dry_run"] and time.time() % 300 < 5:
                    live_bal = self.engine.fetch_live_balance()
                    if abs(live_bal - self.engine.balance) > 0.10:
                        log(f"Balance sync: ${self.engine.balance:.2f} → ${live_bal:.2f}", "info")
                        self.engine.balance = live_bal

                save_journal(self.engine, self.sprt)
                time.sleep(10)
        except KeyboardInterrupt:
            log("Interrupted by user", "warn")

        self._stop.set()
        self.engine.force_close_remaining(reason="shutdown")
        save_journal(self.engine, self.sprt)
        self._print_final_report()

    def _print_final_report(self):
        stats = self.engine.stats()
        log("", "info")
        log("═" * 60, "info")
        log("LIVE BOT V1 — FINAL REPORT", "info")
        log("═" * 60, "info")
        log(f"Mode: {'DRY RUN' if CONFIG['dry_run'] else 'LIVE TRADING'}", "info")
        log(f"Total Trades: {stats['total_trades']} | W: {stats['wins']} / L: {stats['losses']}", "info")
        log(f"Win Rate: {stats['win_rate']:.1%}", "info")
        log(f"Final Balance: ${stats['balance']:.4f} USDC", "info")
        log(f"Return: {stats['return_pct']:+.2f}%", "info")
        log(f"SPRT: {self.sprt.summary()}", "sprt")
        log("═" * 60, "info")
        log(f"Journal: {CONFIG['journal_file']}", "info")


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Polymarket Live Trading Bot V1")
    parser.add_argument("--live", action="store_true",
                        help="Enable real USDC trading (default: dry run)")
    args = parser.parse_args()

    if args.live:
        print("\n⚠️  LIVE TRADING MODE ENABLED ⚠️")
        print(f"Real USDC will be spent. Wallet: 0x2FC6896bDFB507002D1A534313C67686111cDfdA")
        confirm = input("Type 'YES I UNDERSTAND' to proceed: ")
        if confirm.strip() != "YES I UNDERSTAND":
            print("Aborted.")
            sys.exit(0)
        CONFIG["dry_run"] = False
        print("✅ Live trading enabled.\n")

    bot = LiveTradingBot()
    bot.run()
