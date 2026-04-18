import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  RefreshCw,
  Star,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { PriceInline, formatPrice } from "../components/PriceDisplay";
import { SignalBadge } from "../components/SignalBadge";
import {
  useAddToWatchlist,
  useRefreshPrice,
  useRemoveFromWatchlist,
  useStockSignal,
  useWatchlist,
} from "../hooks/useBackend";
import { Signal, applyExchangeSuffix, deriveCurrency } from "../types";
import type { Exchange, IndicatorSummary, WatchlistItem } from "../types";

// ── Exchange selector ──────────────────────────────────────────────────────────
const EXCHANGES: Exchange[] = ["NSE", "BSE", "US"];

function ExchangeSelector({
  value,
  onChange,
}: {
  value: Exchange;
  onChange: (v: Exchange) => void;
}) {
  return (
    <fieldset
      className="flex items-center rounded-sm border border-border overflow-hidden bg-input"
      aria-label="Select exchange"
      data-ocid="watchlist.exchange_selector"
    >
      {EXCHANGES.map((ex) => (
        <button
          key={ex}
          type="button"
          onClick={() => onChange(ex)}
          className={cn(
            "px-3 py-1.5 text-xs font-mono font-semibold transition-colors-fast select-none",
            value === ex
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary",
          )}
          data-ocid={`watchlist.exchange.${ex.toLowerCase()}`}
          aria-pressed={value === ex}
        >
          {ex}
        </button>
      ))}
    </fieldset>
  );
}

// ── Indicator grid ─────────────────────────────────────────────────────────────

function IndicatorCell({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: "up" | "down" | "neutral";
}) {
  const colorCls =
    highlight === "up"
      ? "text-primary"
      : highlight === "down"
        ? "text-destructive"
        : "text-foreground";
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="data-label text-[10px]">{label}</span>
      <span
        className={cn("font-mono text-sm tabular-nums font-medium", colorCls)}
      >
        {value}
      </span>
      {sub && (
        <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
          {sub}
        </span>
      )}
    </div>
  );
}

function IndicatorGrid({
  indicators,
  currency,
}: {
  indicators: IndicatorSummary;
  currency: string;
}) {
  const {
    rsi,
    emaShort,
    emaLong,
    macdLine,
    macdSignal,
    macdHistogram,
    bollingerUpper,
    bollingerMiddle,
    bollingerLower,
  } = indicators;

  const sym = currency === "USD" ? "$" : "₹";
  const locale = currency === "USD" ? "en-US" : "en-IN";

  const rsiH: "up" | "down" | "neutral" =
    rsi <= 30 ? "up" : rsi >= 70 ? "down" : "neutral";
  const emaH: "up" | "down" | "neutral" =
    emaShort > emaLong ? "up" : emaShort < emaLong ? "down" : "neutral";
  const macdH: "up" | "down" | "neutral" =
    macdHistogram > 0 ? "up" : macdHistogram < 0 ? "down" : "neutral";

  const fmtPrice = (v: number) =>
    v.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="mt-3 pt-3 border-t border-border">
      <p className="data-label mb-3">Technical Indicators</p>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-x-6 gap-y-3">
        <IndicatorCell
          label="RSI (14)"
          value={formatPrice(rsi, 1)}
          sub={rsi <= 30 ? "Oversold" : rsi >= 70 ? "Overbought" : "Neutral"}
          highlight={rsiH}
        />
        <IndicatorCell
          label="EMA 9"
          value={`${sym}${fmtPrice(emaShort)}`}
          highlight={emaH}
        />
        <IndicatorCell
          label="EMA 21"
          value={`${sym}${fmtPrice(emaLong)}`}
          highlight={emaH}
        />
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="data-label text-[10px]">MACD</span>
          <span
            className={cn(
              "font-mono text-sm tabular-nums font-medium",
              macdH === "up"
                ? "text-primary"
                : macdH === "down"
                  ? "text-destructive"
                  : "text-foreground",
            )}
          >
            {formatPrice(macdLine, 4)}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
            sig {formatPrice(macdSignal, 4)}
          </span>
          <span
            className={cn(
              "font-mono text-[10px] tabular-nums",
              macdH === "up"
                ? "text-primary"
                : macdH === "down"
                  ? "text-destructive"
                  : "text-muted-foreground",
            )}
          >
            hist {macdHistogram > 0 ? "+" : ""}
            {formatPrice(macdHistogram, 4)}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="data-label text-[10px]">Bollinger Bands</span>
          <span className="font-mono text-sm tabular-nums font-medium text-foreground">
            {sym}
            {fmtPrice(bollingerUpper)}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
            mid {sym}
            {fmtPrice(bollingerMiddle)}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
            low {sym}
            {fmtPrice(bollingerLower)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Expanded indicator row ─────────────────────────────────────────────────────

function ExpandedIndicators({
  symbol,
  currency,
}: {
  symbol: string;
  currency: string;
}) {
  const { data: signal, isLoading, isError } = useStockSignal(symbol, true);

  if (isLoading) {
    return (
      <div
        className="mt-3 pt-3 border-t border-border space-y-2"
        data-ocid="watchlist.indicators.loading_state"
      >
        <Skeleton className="h-3 w-28" />
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 pt-1">
          {["s1", "s2", "s3", "s4", "s5"].map((k) => (
            <Skeleton key={k} className="h-14 rounded-sm" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !signal) {
    return (
      <div
        className="mt-3 pt-3 border-t border-border text-muted-foreground text-xs font-mono"
        data-ocid="watchlist.indicators.error_state"
      >
        Signal data unavailable for {symbol}. Try refreshing the price.
      </div>
    );
  }

  return <IndicatorGrid indicators={signal.indicators} currency={currency} />;
}

// ── Individual stock row ───────────────────────────────────────────────────────

function StockRow({
  item,
  index,
  isExpanded,
  onToggle,
}: {
  item: WatchlistItem;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const refreshPrice = useRefreshPrice();
  const removeFromWatchlist = useRemoveFromWatchlist();
  const isUp = item.change >= 0;
  const currency = deriveCurrency(item);

  // Derive signal from changePercent — real signal comes from expanded view
  const derivedSignal =
    item.changePercent >= 2
      ? Signal.Buy
      : item.changePercent <= -2
        ? Signal.Sell
        : Signal.Hold;

  function handleRefresh(e: React.MouseEvent) {
    e.stopPropagation();
    refreshPrice.mutate(item.symbol, {
      onSuccess: () => toast.success(`${item.symbol} price refreshed`),
      onError: () => toast.error(`Failed to refresh ${item.symbol}`),
    });
  }

  function handleRemove() {
    removeFromWatchlist.mutate(item.symbol, {
      onSuccess: () => toast.success(`${item.symbol} removed from watchlist`),
      onError: () => toast.error(`Failed to remove ${item.symbol}`),
    });
  }

  const base = `watchlist.item.${index}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.18, delay: Math.min(index * 0.04, 0.32) }}
      className={cn(
        "trading-card overflow-hidden",
        isExpanded && (isUp ? "glow-buy" : "glow-sell"),
      )}
      data-ocid={base}
    >
      {/* Clickable header row */}
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-label={`${item.symbol}: click to ${isExpanded ? "collapse" : "expand"} technical indicators`}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 cursor-pointer select-none text-left",
          "transition-colors-fast hover:bg-secondary",
          isExpanded && "bg-secondary/60",
        )}
        onClick={onToggle}
        data-ocid={`${base}.toggle`}
      >
        {/* Symbol + exchange badge */}
        <div className="w-24 flex-shrink-0">
          <p className="font-display font-bold text-foreground text-sm tracking-wide leading-none">
            {item.symbol}
          </p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">
            {item.exchange ?? "Equity"}
          </p>
        </div>

        {/* Price */}
        <div className="flex-1 min-w-0">
          <PriceInline
            price={item.price}
            changePercent={item.changePercent}
            currency={currency}
            className="text-sm"
          />
        </div>

        {/* 24h % — hidden on mobile */}
        <div className="hidden sm:block w-20 text-right flex-shrink-0">
          <span
            className={cn(
              "text-xs font-mono tabular-nums font-semibold",
              isUp ? "price-up" : "price-down",
            )}
          >
            {item.changePercent >= 0 ? "+" : ""}
            {item.changePercent.toFixed(2)}%
          </span>
        </div>

        {/* Signal badge */}
        <div className="flex-shrink-0 w-[72px] flex justify-end">
          <SignalBadge signal={derivedSignal} size="sm" />
        </div>

        {/* Mini sparkline */}
        <div className="hidden sm:block flex-shrink-0">
          <svg
            viewBox="0 0 60 20"
            className="w-14 h-5"
            preserveAspectRatio="none"
            role="img"
            aria-label={`${item.symbol} trend ${isUp ? "up" : "down"}`}
          >
            <polyline
              points={
                isUp
                  ? "0,16 15,13 30,9 45,6 60,3"
                  : "0,3 15,6 30,11 45,14 60,17"
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

        {/* Action buttons — stop propagation so they don't toggle */}
        <div
          className="flex items-center gap-0.5 flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            aria-label={`Refresh ${item.symbol} price`}
            disabled={refreshPrice.isPending}
            onClick={handleRefresh}
            data-ocid={`${base}.refresh_button`}
          >
            <RefreshCw
              className={cn(
                "w-3.5 h-3.5",
                refreshPrice.isPending && "animate-spin",
              )}
            />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 hover:text-destructive hover:bg-destructive/10"
                aria-label={`Remove ${item.symbol} from watchlist`}
                data-ocid={`${base}.delete_button`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent
              className="bg-card border-border"
              data-ocid={`${base}.delete_dialog`}
            >
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Remove {item.symbol} from watchlist?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will stop tracking{" "}
                  <span className="font-mono font-semibold text-foreground">
                    {item.symbol}
                  </span>
                  . You can re-add it at any time.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel data-ocid={`${base}.delete_cancel_button`}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleRemove}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  data-ocid={`${base}.delete_confirm_button`}
                >
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Expand chevron */}
        <div className="flex-shrink-0 text-muted-foreground w-4">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </div>
      </button>

      {/* Collapsible indicator panel */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="indicators"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4" data-ocid={`${base}.indicators_panel`}>
              <ExpandedIndicators symbol={item.symbol} currency={currency} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Loading skeleton ───────────────────────────────────────────────────────────

function WatchlistSkeleton() {
  return (
    <div className="space-y-1.5" data-ocid="watchlist.loading_state">
      {["s1", "s2", "s3", "s4", "s5"].map((k) => (
        <div key={k} className="trading-card px-4 py-3 flex items-center gap-3">
          <div className="w-24 flex-shrink-0 space-y-1">
            <Skeleton className="h-3.5 w-16" />
            <Skeleton className="h-2 w-8" />
          </div>
          <Skeleton className="h-4 w-32 flex-1" />
          <Skeleton className="h-4 w-14 hidden sm:block" />
          <Skeleton className="h-5 w-14 rounded-sm" />
          <Skeleton className="h-5 w-14 hidden sm:block" />
          <Skeleton className="h-7 w-7 rounded-sm" />
          <Skeleton className="h-7 w-7 rounded-sm" />
          <Skeleton className="h-4 w-4" />
        </div>
      ))}
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────────

function EmptyState({ onFocusInput }: { onFocusInput: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-24 gap-5 text-center"
      data-ocid="watchlist.empty_state"
    >
      <div
        className="w-16 h-16 rounded-full bg-muted border border-border flex items-center justify-center"
        role="img"
        aria-label="Empty watchlist illustration"
      >
        <Star className="w-7 h-7 text-muted-foreground" />
      </div>
      <div className="space-y-1.5">
        <h2 className="font-display font-semibold text-foreground text-base">
          Your watchlist is empty
        </h2>
        <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
          Add NSE/BSE stocks (e.g. INFY, TCS) or US symbols to track live prices
          and BUY / HOLD / SELL signals with technical analysis.
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="border-primary/40 text-primary hover:bg-primary/10 transition-colors-fast"
        onClick={onFocusInput}
        data-ocid="watchlist.empty_add_button"
      >
        <Plus className="w-4 h-4 mr-1.5" />
        Add your first stock
      </Button>
    </motion.div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function Watchlist() {
  const { data: watchlist = [], isLoading } = useWatchlist();
  const addToWatchlist = useAddToWatchlist();

  const [ticker, setTicker] = useState("");
  const [exchange, setExchange] = useState<Exchange>("NSE");
  const [expandedSymbol, setExpandedSymbol] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const raw = ticker.trim().toUpperCase();
    if (!raw) return;
    const sym = applyExchangeSuffix(raw, exchange);
    if (watchlist.some((w) => w.symbol === sym)) {
      toast.warning(`${sym} is already on your watchlist`);
      return;
    }
    addToWatchlist.mutate(
      { symbol: sym, exchange },
      {
        onSuccess: () => {
          toast.success(`${sym} added to watchlist`);
          setTicker("");
        },
        onError: () =>
          toast.error(`Failed to add ${sym}. Check the symbol and try again.`),
      },
    );
  }

  function toggleExpand(symbol: string) {
    setExpandedSymbol((prev) => (prev === symbol ? null : symbol));
  }

  const buyCount = watchlist.filter((w) => w.changePercent >= 2).length;
  const sellCount = watchlist.filter((w) => w.changePercent <= -2).length;
  const holdCount = watchlist.length - buyCount - sellCount;

  return (
    <div
      className="flex flex-col gap-5 p-4 md:p-6 max-w-4xl"
      data-ocid="watchlist.page"
    >
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-xl text-foreground tracking-tight">
            Watchlist
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Track NSE, BSE &amp; US stocks — live prices and trade signals
          </p>
        </div>

        {watchlist.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 signal-buy text-[11px] font-mono font-semibold px-2 py-0.5 rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {buyCount} BUY
            </span>
            <span className="inline-flex items-center gap-1.5 signal-hold text-[11px] font-mono font-semibold px-2 py-0.5 rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              {holdCount} HOLD
            </span>
            <span className="inline-flex items-center gap-1.5 signal-sell text-[11px] font-mono font-semibold px-2 py-0.5 rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
              {sellCount} SELL
            </span>
          </div>
        )}
      </div>

      {/* Add ticker form */}
      <form
        onSubmit={handleAdd}
        className="flex items-center gap-2 flex-wrap"
        data-ocid="watchlist.add_form"
      >
        <ExchangeSelector value={exchange} onChange={setExchange} />
        <div className="relative flex-1 min-w-[140px] max-w-xs">
          <Input
            ref={inputRef}
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder={
              exchange === "NSE"
                ? "e.g. INFY (.NS auto-added)"
                : exchange === "BSE"
                  ? "e.g. INFY (.BO auto-added)"
                  : "e.g. AAPL"
            }
            maxLength={12}
            className="font-mono uppercase bg-input border-border placeholder:normal-case placeholder:font-sans placeholder:text-muted-foreground"
            aria-label="Stock ticker symbol"
            data-ocid="watchlist.ticker_input"
          />
        </div>
        <Button
          type="submit"
          disabled={!ticker.trim() || addToWatchlist.isPending}
          className="flex-shrink-0"
          data-ocid="watchlist.add_button"
        >
          {addToWatchlist.isPending ? (
            <RefreshCw className="w-4 h-4 mr-1.5 animate-spin" />
          ) : (
            <Plus className="w-4 h-4 mr-1.5" />
          )}
          Add
        </Button>
        {addToWatchlist.isError && (
          <span
            className="text-destructive text-xs font-mono"
            data-ocid="watchlist.add_error_state"
          >
            Failed
          </span>
        )}
      </form>

      {/* Column headers — shown when there are items */}
      {!isLoading && watchlist.length > 0 && (
        <div className="flex items-center gap-3 px-4 border-b border-border pb-2">
          <span className="w-24 flex-shrink-0 data-label text-[10px]">
            SYMBOL
          </span>
          <span className="flex-1 data-label text-[10px]">PRICE</span>
          <span className="hidden sm:block w-20 text-right data-label text-[10px]">
            24H CHG
          </span>
          <span className="w-[72px] text-right data-label text-[10px]">
            SIGNAL
          </span>
          <span className="hidden sm:block w-14 data-label text-[10px]">
            TREND
          </span>
          <span className="w-16 data-label text-[10px]">ACTIONS</span>
          <span className="w-4" />
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <WatchlistSkeleton />
      ) : watchlist.length === 0 ? (
        <EmptyState onFocusInput={() => inputRef.current?.focus()} />
      ) : (
        <div className="space-y-1.5" data-ocid="watchlist.list">
          <AnimatePresence mode="popLayout">
            {watchlist.map((item, i) => (
              <StockRow
                key={item.symbol}
                item={item}
                index={i + 1}
                isExpanded={expandedSymbol === item.symbol}
                onToggle={() => toggleExpand(item.symbol)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
