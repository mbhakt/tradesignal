import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  Plus,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { PriceDisplay } from "../components/PriceDisplay";
import { formatChange, getCurrencySymbol } from "../components/PriceDisplay";
import { SignalBadge } from "../components/SignalBadge";
import {
  usePortfolio,
  usePortfolioSummary,
  useRefreshPrice,
  useWatchlist,
} from "../hooks/useBackend";
import { Confidence, Signal } from "../types";
import { deriveCurrency } from "../types";
import type { Position, WatchlistItem } from "../types";

// ── Static demo data (Indian stocks) ─────────────────────────────────────────
const DEMO_WATCHLIST: WatchlistItem[] = [
  {
    symbol: "INFY.NS",
    price: 1847.35,
    change: 23.15,
    changePercent: 1.27,
    lastUpdated: BigInt(0),
    exchange: "NSE",
    currency: "INR",
  },
  {
    symbol: "TCS.NS",
    price: 3512.6,
    change: -41.8,
    changePercent: -1.18,
    lastUpdated: BigInt(0),
    exchange: "NSE",
    currency: "INR",
  },
  {
    symbol: "RELIANCE.NS",
    price: 2934.15,
    change: 58.25,
    changePercent: 2.03,
    lastUpdated: BigInt(0),
    exchange: "NSE",
    currency: "INR",
  },
  {
    symbol: "ICICIBANK.NS",
    price: 1089.45,
    change: -12.3,
    changePercent: -1.12,
    lastUpdated: BigInt(0),
    exchange: "NSE",
    currency: "INR",
  },
  {
    symbol: "WIPRO.NS",
    price: 467.2,
    change: 5.85,
    changePercent: 1.27,
    lastUpdated: BigInt(0),
    exchange: "NSE",
    currency: "INR",
  },
];

const DEMO_SIGNALS: Record<string, { signal: Signal; confidence: Confidence }> =
  {
    "INFY.NS": { signal: Signal.Buy, confidence: Confidence.High },
    "TCS.NS": { signal: Signal.Hold, confidence: Confidence.Medium },
    "RELIANCE.NS": { signal: Signal.Buy, confidence: Confidence.High },
    "ICICIBANK.NS": { signal: Signal.Sell, confidence: Confidence.Medium },
    "WIPRO.NS": { signal: Signal.Hold, confidence: Confidence.Low },
  };

const DEMO_POSITIONS: Position[] = [
  {
    id: "1",
    symbol: "INFY.NS",
    entryPrice: 1750.0,
    currentPrice: 1847.35,
    quantity: 50,
    pnl: 4867.5,
    pnlPercent: 5.56,
    entryDate: BigInt(0),
    exchange: "NSE",
    currency: "INR",
  },
  {
    id: "2",
    symbol: "TCS.NS",
    entryPrice: 3200.0,
    currentPrice: 3512.6,
    quantity: 25,
    pnl: 7815.0,
    pnlPercent: 9.77,
    entryDate: BigInt(0),
    exchange: "NSE",
    currency: "INR",
  },
  {
    id: "3",
    symbol: "WIPRO.NS",
    entryPrice: 440.0,
    currentPrice: 467.2,
    quantity: 100,
    pnl: 2720.0,
    pnlPercent: 6.18,
    entryDate: BigInt(0),
    exchange: "NSE",
    currency: "INR",
  },
];

// Demo portfolio totals (INR)
// 1847.35*50 = 92367.5 | 3512.60*25 = 87815 | 467.20*100 = 46720
const DEMO_TOTAL_VALUE_INR = 226_902.5;
const DEMO_TOTAL_PNL_INR = 15_402.5; // 4867.5 + 7815 + 2720
// cost = 87500 + 80000 + 44000 = 211500 → pct ≈ 7.28
const DEMO_TOTAL_PNL_PCT = (DEMO_TOTAL_PNL_INR / 211_500) * 100;

// ── Stat card ─────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string;
  change?: number;
  changePercent?: number;
}

function StatCard({ label, value, change, changePercent }: StatCardProps) {
  const isPositive = (change ?? 0) >= 0;
  return (
    <div className="trading-card px-4 py-3 space-y-1">
      <p className="data-label">{label}</p>
      <p className="font-mono font-semibold text-xl text-foreground tabular-nums">
        {value}
      </p>
      {change !== undefined && (
        <p
          className={cn(
            "font-mono text-xs tabular-nums",
            isPositive ? "price-up" : "price-down",
          )}
        >
          {formatChange(change)} ({formatChange(changePercent ?? 0)}%)
        </p>
      )}
    </div>
  );
}

// ── Watchlist card ─────────────────────────────────────────────────────────────
function WatchlistCard({ item }: { item: WatchlistItem }) {
  const refresh = useRefreshPrice();
  const sig = DEMO_SIGNALS[item.symbol];
  const isUp = item.change >= 0;
  const currency = deriveCurrency(item);

  return (
    <div
      className="trading-card trading-card-hover p-3 space-y-2"
      data-ocid={`watchlist.item.${item.symbol.toLowerCase().replace(/\./g, "_")}_card`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-display font-bold text-foreground text-sm">
            {item.symbol}
          </p>
          <PriceDisplay
            price={item.price}
            change={item.change}
            changePercent={item.changePercent}
            size="sm"
            currency={currency}
          />
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          {sig && (
            <SignalBadge
              signal={sig.signal}
              confidence={sig.confidence}
              size="sm"
            />
          )}
          <button
            type="button"
            onClick={() => refresh.mutate(item.symbol)}
            disabled={refresh.isPending}
            className="text-muted-foreground hover:text-foreground transition-colors-fast"
            aria-label={`Refresh ${item.symbol}`}
            data-ocid={`watchlist.refresh_button.${item.symbol.toLowerCase().replace(/\./g, "_")}`}
          >
            <RefreshCw
              className={cn("w-3 h-3", refresh.isPending && "animate-spin")}
            />
          </button>
        </div>
      </div>
      {/* Mini sparkline placeholder */}
      <div className="h-8 overflow-hidden">
        <svg
          viewBox="0 0 100 24"
          className="w-full h-full"
          preserveAspectRatio="none"
          role="img"
          aria-label={`${item.symbol} sparkline trend ${isUp ? "up" : "down"}`}
        >
          <polyline
            points={
              isUp
                ? "0,20 15,18 30,16 45,19 60,14 75,10 90,8 100,6"
                : "0,6 15,8 30,10 45,8 60,12 75,16 90,18 100,20"
            }
            fill="none"
            stroke={
              isUp ? "oklch(var(--primary))" : "oklch(var(--destructive))"
            }
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

// ── Position row ──────────────────────────────────────────────────────────────
function PositionRow({ pos, index }: { pos: Position; index: number }) {
  const sig = DEMO_SIGNALS[pos.symbol];
  const isUp = pos.pnl >= 0;
  const currency = deriveCurrency(pos);
  const sym = getCurrencySymbol(currency);

  return (
    <div
      className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 px-3 py-2.5 border-b border-border last:border-b-0 hover:bg-secondary/50 transition-colors-fast"
      data-ocid={`portfolio.item.${index}`}
    >
      <div className="min-w-0">
        <p className="font-bold text-sm text-foreground">{pos.symbol}</p>
        <p className="text-xs text-muted-foreground font-mono">
          {pos.quantity} @ {sym}
          {pos.entryPrice.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
        </p>
      </div>
      <div className="text-right">
        <p className="font-mono text-sm text-foreground">
          {sym}
          {(pos.currentPrice * pos.quantity).toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}
        </p>
        <p
          className={cn("font-mono text-xs", isUp ? "price-up" : "price-down")}
        >
          {isUp ? "+" : ""}
          {sym}
          {Math.abs(pos.pnl).toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}
        </p>
      </div>
      <div className="text-right">
        <p
          className={cn(
            "font-mono text-sm font-semibold",
            isUp ? "price-up" : "price-down",
          )}
        >
          {isUp ? "+" : ""}
          {pos.pnlPercent.toFixed(2)}%
        </p>
      </div>
      {sig && <SignalBadge signal={sig.signal} size="sm" />}
    </div>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const { data: watchlist, isLoading: wLoading } = useWatchlist();
  const { data: summary } = usePortfolioSummary();
  const { data: portfolio } = usePortfolio();

  const items = watchlist?.length ? watchlist : DEMO_WATCHLIST;
  const positions = portfolio?.length ? portfolio : DEMO_POSITIONS;
  const totalValue = summary?.totalValue ?? DEMO_TOTAL_VALUE_INR;
  const totalPnl = summary?.totalPnl ?? DEMO_TOTAL_PNL_INR;
  const totalPnlPct = summary?.totalPnlPercent ?? DEMO_TOTAL_PNL_PCT;

  const inrTotalValue = `₹${totalValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  const inrDayGain = "+₹3,412.50";

  return (
    <div
      className="flex flex-col lg:flex-row h-full min-h-0"
      data-ocid="dashboard.page"
    >
      {/* ── Left: Watchlist + Stats ─────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 overflow-y-auto scrollbar-thin p-4 space-y-4">
        {/* Stat row */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-2"
          data-ocid="dashboard.stats_section"
        >
          <StatCard
            label="Portfolio Value"
            value={inrTotalValue}
            change={totalPnl}
            changePercent={totalPnlPct}
          />
          <StatCard
            label="Day's Gain"
            value={inrDayGain}
            change={3412.5}
            changePercent={1.53}
          />
          <StatCard label="Positions" value={`${positions.length}`} />
          <StatCard label="Win Rate" value="72.1%" />
        </div>

        {/* Watchlist header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <h2 className="font-display font-bold text-foreground">
              Watchlist Overview
            </h2>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs gap-1.5"
            onClick={() => navigate({ to: "/watchlist" })}
            data-ocid="dashboard.add_watchlist_button"
          >
            <Plus className="w-3 h-3" /> Add Symbol
          </Button>
        </div>

        {wLoading ? (
          <div
            className="grid-trading"
            data-ocid="dashboard.watchlist.loading_state"
          >
            {["s1", "s2", "s3", "s4", "s5"].map((k) => (
              <Skeleton key={k} className="h-24 rounded-sm" />
            ))}
          </div>
        ) : (
          <div className="grid-trading" data-ocid="dashboard.watchlist_grid">
            {items.map((item) => (
              <WatchlistCard key={item.symbol} item={item} />
            ))}
          </div>
        )}

        {/* Signal summary bar */}
        <div className="trading-card p-3">
          <p className="data-label mb-2">Signal Summary</p>
          <div className="flex flex-wrap gap-2">
            {items.map((item) => {
              const sig = DEMO_SIGNALS[item.symbol];
              if (!sig) return null;
              return (
                <div
                  key={item.symbol}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <span className="font-mono text-muted-foreground">
                    {item.symbol}
                  </span>
                  <SignalBadge
                    signal={sig.signal}
                    confidence={sig.confidence}
                    size="sm"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Right: Portfolio Positions ──────────────────────────────────────── */}
      <div
        className="w-full lg:w-72 xl:w-80 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-border overflow-y-auto scrollbar-thin"
        data-ocid="dashboard.portfolio_panel"
      >
        <div className="p-3 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h2 className="font-display font-bold text-sm text-foreground">
              Portfolio
            </h2>
          </div>
          <Badge variant="secondary" className="text-xs font-mono">
            {positions.length} positions
          </Badge>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-px bg-border m-3 rounded-sm overflow-hidden">
          {[
            {
              label: "Total Value",
              value: `₹${totalValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
            },
            {
              label: "Total P&L",
              value: `${totalPnl >= 0 ? "+" : ""}₹${Math.abs(totalPnl).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
              up: totalPnl >= 0,
            },
            {
              label: "P&L %",
              value: `${totalPnlPct >= 0 ? "+" : ""}${totalPnlPct.toFixed(2)}%`,
              up: totalPnlPct >= 0,
            },
            { label: "Open", value: `${positions.length}` },
          ].map(({ label, value, up }) => (
            <div key={label} className="bg-card px-3 py-2">
              <p className="data-label text-[10px]">{label}</p>
              <p
                className={cn(
                  "font-mono text-sm font-semibold tabular-nums",
                  up ? "price-up" : "text-foreground",
                )}
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Position list */}
        <div
          className="trading-card mx-3 mb-3 overflow-hidden"
          data-ocid="dashboard.positions_list"
        >
          {positions.map((pos, i) => (
            <PositionRow key={pos.id} pos={pos} index={i + 1} />
          ))}
        </div>

        {positions.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-12 text-center px-4"
            data-ocid="dashboard.positions.empty_state"
          >
            <TrendingDown className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No open positions</p>
            <p className="text-xs text-muted-foreground mt-1">
              Add positions from the Portfolio page
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
