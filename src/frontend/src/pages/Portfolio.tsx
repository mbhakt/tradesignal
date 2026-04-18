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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  BriefcaseBusiness,
  ChevronDown,
  ChevronUp,
  Minus,
  PlusCircle,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { formatChange, formatPrice } from "../components/PriceDisplay";
import { SignalBadge } from "../components/SignalBadge";
import {
  useAddPosition,
  usePortfolio,
  usePortfolioSummary,
  useRemovePosition,
  useStockSignal,
} from "../hooks/useBackend";
import { applyExchangeSuffix, deriveCurrency } from "../types";
import type { Exchange, Position } from "../types";

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
      data-ocid="portfolio.exchange_selector"
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
          data-ocid={`portfolio.exchange.${ex.toLowerCase()}`}
          aria-pressed={value === ex}
        >
          {ex}
        </button>
      ))}
    </fieldset>
  );
}

// ── P&L cell ──────────────────────────────────────────────────────────────────
function PnlCell({
  value,
  percent,
  currency,
}: {
  value: number;
  percent: number;
  currency: string;
}) {
  const isPos = value > 0;
  const isZero = value === 0;
  const color = isZero
    ? "text-muted-foreground"
    : isPos
      ? "text-primary"
      : "text-destructive";
  const sym = currency === "USD" ? "$" : "₹";
  const locale = currency === "USD" ? "en-US" : "en-IN";

  return (
    <div className={cn("font-mono tabular-nums text-right", color)}>
      <div className="text-sm font-semibold">
        {isPos ? "+" : "-"}
        {sym}
        {Math.abs(value).toLocaleString(locale, { maximumFractionDigits: 2 })}
      </div>
      <div className="text-xs opacity-80">{formatChange(percent)}%</div>
    </div>
  );
}

// ── Summary cards ─────────────────────────────────────────────────────────────
function SummaryCards({ positionCount }: { positionCount: number }) {
  const { data: summary, isLoading } = usePortfolioSummary();

  if (isLoading) {
    return (
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        data-ocid="portfolio.summary.loading_state"
      >
        {["sk1", "sk2", "sk3", "sk4"].map((k) => (
          <Skeleton key={k} className="h-24 rounded-sm" />
        ))}
      </div>
    );
  }

  const totalValue = summary?.totalValue ?? 0;
  const totalCost = summary?.totalCost ?? 0;
  const totalPnl = summary?.totalPnl ?? 0;
  const totalPnlPct = summary?.totalPnlPercent ?? 0;
  const isPos = totalPnl > 0;
  const isNeg = totalPnl < 0;
  const pnlColor = isPos
    ? "text-primary"
    : isNeg
      ? "text-destructive"
      : "text-muted-foreground";
  const PnlIcon = isPos ? TrendingUp : isNeg ? TrendingDown : Minus;

  // INR formatting for summary (most positions will be INR)
  const fmtInr = (v: number) =>
    `₹${Math.abs(v).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  const cards = [
    {
      label: "Total Value",
      value: fmtInr(totalValue),
      sub: `${positionCount} positions`,
      color: "text-foreground",
      Icon: BriefcaseBusiness,
    },
    {
      label: "Total Cost",
      value: fmtInr(totalCost),
      sub: "invested capital",
      color: "text-foreground",
      Icon: BriefcaseBusiness,
    },
    {
      label: "Total P&L",
      value: `${isPos ? "+" : isNeg ? "-" : ""}${fmtInr(totalPnl)}`,
      sub: isPos ? "Profit" : isNeg ? "Loss" : "Breakeven",
      color: pnlColor,
      Icon: PnlIcon,
    },
    {
      label: "Return",
      value: `${formatChange(totalPnlPct)}%`,
      sub: isPos ? "Profitable" : isNeg ? "In Loss" : "No change",
      color: pnlColor,
      Icon: PnlIcon,
    },
  ];

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      data-ocid="portfolio.summary.card"
    >
      {cards.map(({ label, value, sub, color, Icon }) => (
        <div key={label} className="trading-card px-4 py-3 space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Icon className={cn("w-3.5 h-3.5 flex-shrink-0", color)} />
            <span className="data-label">{label}</span>
          </div>
          <p className={cn("price-display text-xl tabular-nums", color)}>
            {value}
          </p>
          <p className={cn("text-xs font-mono", color)}>{sub}</p>
        </div>
      ))}
    </div>
  );
}

// ── Add position form ─────────────────────────────────────────────────────────
function AddPositionForm({ onAdded }: { onAdded: () => void }) {
  const add = useAddPosition();
  const [symbol, setSymbol] = useState("");
  const [exchange, setExchange] = useState<Exchange>("NSE");
  const [entryPrice, setEntryPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [entryDate, setEntryDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const raw = symbol.trim().toUpperCase();
    const sym = applyExchangeSuffix(raw, exchange);
    const ep = Number.parseFloat(entryPrice);
    const qty = Number.parseFloat(quantity);
    if (!sym || Number.isNaN(ep) || Number.isNaN(qty) || ep <= 0 || qty <= 0) {
      toast.error("Fill all fields with valid values.");
      return;
    }
    const ts = BigInt(new Date(entryDate).getTime()) * 1_000_000n;
    try {
      await add.mutateAsync({
        symbol: sym,
        entryPrice: ep,
        quantity: qty,
        entryDate: ts,
        exchange,
        currency: exchange === "US" ? "USD" : "INR",
      });
      toast.success(`Added ${sym} position`);
      setSymbol("");
      setEntryPrice("");
      setQuantity("");
      setEntryDate(new Date().toISOString().split("T")[0]);
      onAdded();
    } catch {
      toast.error("Failed to add position. Please try again.");
    }
  }

  const currencyLabel =
    exchange === "US" ? "Entry Price ($)" : "Entry Price (₹)";

  return (
    <form
      onSubmit={handleSubmit}
      className="trading-card p-5 border-primary/20"
      data-ocid="portfolio.add_position.card"
    >
      <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2 tracking-wide">
        <PlusCircle className="w-4 h-4 text-primary" />
        Add Position
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
        {/* Exchange */}
        <div className="space-y-1.5">
          <Label className="data-label">Exchange</Label>
          <ExchangeSelector value={exchange} onChange={setExchange} />
        </div>
        {/* Symbol */}
        <div className="space-y-1.5">
          <Label htmlFor="p-sym" className="data-label">
            Symbol
          </Label>
          <Input
            id="p-sym"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder={
              exchange === "NSE"
                ? "e.g. INFY"
                : exchange === "BSE"
                  ? "e.g. INFY"
                  : "e.g. AAPL"
            }
            maxLength={12}
            className="font-mono uppercase bg-input border-border"
            data-ocid="portfolio.symbol.input"
          />
        </div>
        {/* Entry Price */}
        <div className="space-y-1.5">
          <Label htmlFor="p-price" className="data-label">
            {currencyLabel}
          </Label>
          <Input
            id="p-price"
            type="number"
            step="0.01"
            min="0.01"
            value={entryPrice}
            onChange={(e) => setEntryPrice(e.target.value)}
            placeholder="0.00"
            className="font-mono bg-input border-border"
            data-ocid="portfolio.entry_price.input"
          />
        </div>
        {/* Quantity */}
        <div className="space-y-1.5">
          <Label htmlFor="p-qty" className="data-label">
            Quantity
          </Label>
          <Input
            id="p-qty"
            type="number"
            step="0.001"
            min="0.001"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0"
            className="font-mono bg-input border-border"
            data-ocid="portfolio.quantity.input"
          />
        </div>
        {/* Entry Date */}
        <div className="space-y-1.5">
          <Label htmlFor="p-date" className="data-label">
            Entry Date
          </Label>
          <Input
            id="p-date"
            type="date"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            className="font-mono bg-input border-border"
            data-ocid="portfolio.entry_date.input"
          />
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Button
          type="submit"
          disabled={add.isPending}
          className="font-mono font-semibold"
          data-ocid="portfolio.add_position.submit_button"
        >
          {add.isPending ? (
            <span className="animate-pulse">Adding…</span>
          ) : (
            <>
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Add Position
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

// ── Position row ──────────────────────────────────────────────────────────────
function PositionRow({ pos, index }: { pos: Position; index: number }) {
  const remove = useRemovePosition();
  const { data: signalResult } = useStockSignal(pos.symbol, true);
  const signal = signalResult?.signal ?? null;
  const currentValue = pos.currentPrice * pos.quantity;
  const isUp = pos.pnl > 0;
  const isDown = pos.pnl < 0;
  const currency = deriveCurrency(pos);
  const sym = currency === "USD" ? "$" : "₹";
  const locale = currency === "USD" ? "en-US" : "en-IN";
  const fmtVal = (v: number) =>
    v.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  async function handleRemove() {
    try {
      await remove.mutateAsync(pos.id);
      toast.success(`Removed ${pos.symbol}`);
    } catch {
      toast.error("Failed to remove position.");
    }
  }

  return (
    <tr
      className="border-b border-border hover:bg-secondary/50 transition-colors-fast group"
      data-ocid={`portfolio.position.item.${index}`}
    >
      {/* Symbol + exchange */}
      <td className="px-4 py-3 min-w-[100px]">
        <p className="font-mono font-bold text-sm text-foreground tracking-wide">
          {pos.symbol}
        </p>
        <p className="text-[10px] text-muted-foreground font-mono tabular-nums">
          {pos.quantity.toLocaleString()} sh · {pos.exchange ?? "NSE"}
        </p>
      </td>

      {/* Entry Price */}
      <td className="px-4 py-3 text-right">
        <span className="font-mono tabular-nums text-sm text-foreground">
          {sym}
          {fmtVal(pos.entryPrice)}
        </span>
      </td>

      {/* Current Price */}
      <td className="px-4 py-3 text-right">
        <div className="flex flex-col items-end gap-0.5">
          <span className="font-mono tabular-nums text-sm font-semibold text-foreground">
            {sym}
            {fmtVal(pos.currentPrice)}
          </span>
          <span
            className={cn(
              "text-[10px] font-mono flex items-center gap-0.5",
              isUp
                ? "text-primary"
                : isDown
                  ? "text-destructive"
                  : "text-muted-foreground",
            )}
          >
            {isUp ? (
              <ChevronUp className="w-2.5 h-2.5" />
            ) : isDown ? (
              <ChevronDown className="w-2.5 h-2.5" />
            ) : (
              <Minus className="w-2.5 h-2.5" />
            )}
            vs entry
          </span>
        </div>
      </td>

      {/* Value */}
      <td className="px-4 py-3 text-right">
        <span className="font-mono tabular-nums text-sm text-foreground">
          {sym}
          {currentValue.toLocaleString(locale, { maximumFractionDigits: 0 })}
        </span>
      </td>

      {/* P&L */}
      <td className="px-4 py-3">
        <PnlCell value={pos.pnl} percent={pos.pnlPercent} currency={currency} />
      </td>

      {/* Signal */}
      <td className="px-4 py-3 text-center">
        {signal !== null ? (
          <SignalBadge signal={signal} size="sm" />
        ) : (
          <Skeleton className="h-5 w-12 mx-auto" />
        )}
      </td>

      {/* Remove */}
      <td className="px-4 py-3 text-center">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-smooth text-muted-foreground hover:text-destructive"
              aria-label={`Remove ${pos.symbol}`}
              data-ocid={`portfolio.position.delete_button.${index}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent
            className="bg-popover border-border"
            data-ocid="portfolio.remove_position.dialog"
          >
            <AlertDialogHeader>
              <AlertDialogTitle className="text-foreground">
                Remove Position
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                Remove{" "}
                <span className="font-mono font-semibold text-foreground">
                  {pos.symbol}
                </span>{" "}
                ({pos.quantity.toLocaleString()} shares) from your portfolio?
                This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                className="bg-secondary border-border text-foreground hover:bg-muted"
                data-ocid="portfolio.remove_position.cancel_button"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRemove}
                disabled={remove.isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/80"
                data-ocid="portfolio.remove_position.confirm_button"
              >
                {remove.isPending ? "Removing…" : "Remove"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </td>
    </tr>
  );
}

// ── Positions table ───────────────────────────────────────────────────────────
function PositionsTable({ positions }: { positions: Position[] }) {
  const netPnl = positions.reduce((s, p) => s + p.pnl, 0);
  const isNetPos = netPnl >= 0;

  return (
    <div
      className="trading-card overflow-hidden"
      data-ocid="portfolio.positions.table"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground tracking-wide">
          Positions
          <span className="ml-2 text-xs font-normal text-muted-foreground font-mono">
            ({positions.length})
          </span>
        </h2>
        <span
          className={cn(
            "text-xs font-mono font-semibold tabular-nums",
            isNetPos ? "text-primary" : "text-destructive",
          )}
        >
          Net P&L: {isNetPos && netPnl > 0 ? "+" : ""}₹
          {formatPrice(netPnl, "INR")}
        </span>
      </div>
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {[
                { label: "Symbol", align: "text-left" },
                { label: "Entry", align: "text-right" },
                { label: "Current", align: "text-right" },
                { label: "Value", align: "text-right" },
                { label: "P&L", align: "text-right" },
                { label: "Signal", align: "text-center" },
                { label: "", align: "text-center w-10" },
              ].map(({ label, align }) => (
                <th key={label} className={cn("px-4 py-2.5 data-label", align)}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {positions.map((pos, i) => (
              <PositionRow key={pos.id} pos={pos} index={i + 1} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Skeleton table ────────────────────────────────────────────────────────────
function PositionsTableSkeleton() {
  return (
    <div
      className="trading-card overflow-hidden"
      data-ocid="portfolio.positions.loading_state"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="p-4 space-y-3">
        {["sk-r1", "sk-r2", "sk-r3"].map((k) => (
          <div key={k} className="flex items-center gap-4">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-5 w-16 ml-auto" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-6 w-14" />
            <Skeleton className="h-7 w-7" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div
      className="trading-card flex flex-col items-center justify-center py-20 text-center"
      data-ocid="portfolio.positions.empty_state"
    >
      <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
        <BriefcaseBusiness className="w-7 h-7 text-primary" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">
        No positions yet
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-6">
        Add your NSE, BSE or US positions to track P&amp;L with live ₹/$ prices
        and AI-powered buy/hold/sell signals.
      </p>
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono mb-5">
        <span className="signal-buy px-2 py-0.5 rounded-sm">BUY</span>
        <span className="signal-hold px-2 py-0.5 rounded-sm">HOLD</span>
        <span className="signal-sell px-2 py-0.5 rounded-sm">SELL</span>
        <span className="ml-1">signals refresh every 60s</span>
      </div>
      <Button
        size="sm"
        onClick={onAdd}
        className="font-mono font-semibold gap-1.5"
        data-ocid="portfolio.empty_state.add_button"
      >
        <PlusCircle className="w-3.5 h-3.5" />
        Add Your First Position
      </Button>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const { data: positions, isLoading } = usePortfolio();
  const [showForm, setShowForm] = useState(true);

  const positionList = positions ?? [];

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-5" data-ocid="portfolio.page">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground tracking-wide">
            Portfolio
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            NSE · BSE · US · Live P&amp;L · AI signals
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="font-mono text-xs border-border gap-1.5"
          onClick={() => setShowForm((v) => !v)}
          data-ocid="portfolio.add_position.toggle"
        >
          {showForm ? (
            <>
              <Minus className="w-3.5 h-3.5" />
              Hide Form
            </>
          ) : (
            <>
              <PlusCircle className="w-3.5 h-3.5" />
              Add Position
            </>
          )}
        </Button>
      </div>

      {/* Summary */}
      <SummaryCards positionCount={positionList.length} />

      <Separator className="bg-border/50" />

      {/* Add form */}
      {showForm && <AddPositionForm onAdded={() => setShowForm(false)} />}

      {/* Table */}
      {isLoading ? (
        <PositionsTableSkeleton />
      ) : positionList.length === 0 ? (
        <EmptyState onAdd={() => setShowForm(true)} />
      ) : (
        <PositionsTable positions={positionList} />
      )}
    </div>
  );
}
