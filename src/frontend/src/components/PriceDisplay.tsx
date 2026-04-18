import { cn } from "@/lib/utils";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";

interface PriceDisplayProps {
  price: number;
  change?: number;
  changePercent?: number;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showIcon?: boolean;
  currency?: string;
  className?: string;
}

const sizeConfig = {
  xs: { price: "text-sm", change: "text-xs" },
  sm: { price: "text-base", change: "text-xs" },
  md: { price: "text-xl", change: "text-sm" },
  lg: { price: "text-2xl", change: "text-sm" },
  xl: { price: "text-4xl", change: "text-base" },
};

/** Format a price value with locale-aware grouping.
 *  currency: 'INR' → en-IN locale, ₹ symbol
 *           'USD' → en-US locale, $ symbol
 *           default → INR
 */
export function formatPrice(
  value: number,
  currencyOrDecimals?: string | number,
  decimals = 2,
): string {
  // Support legacy call: formatPrice(value, decimals)
  if (typeof currencyOrDecimals === "number") {
    return value.toLocaleString("en-IN", {
      minimumFractionDigits: currencyOrDecimals,
      maximumFractionDigits: currencyOrDecimals,
    });
  }
  const currency = currencyOrDecimals ?? "INR";
  const locale = currency === "USD" ? "en-US" : "en-IN";
  return value.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function getCurrencySymbol(currency?: string): string {
  return currency === "USD" ? "$" : "₹";
}

export function formatChange(value: number, decimals = 2): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

export function PriceDisplay({
  price,
  change,
  changePercent,
  size = "md",
  showIcon = false,
  currency = "INR",
  className,
}: PriceDisplayProps) {
  const sz = sizeConfig[size];
  const isPositive = (change ?? 0) >= 0;
  const isZero = change === 0 || change === undefined;
  const colorCls = isZero
    ? "price-neutral"
    : isPositive
      ? "price-up"
      : "price-down";
  const sym = getCurrencySymbol(currency);

  return (
    <div className={cn("flex flex-col tabular-nums", className)}>
      <span
        className={cn("price-display font-semibold text-foreground", sz.price)}
      >
        {sym}
        {formatPrice(price, currency)}
      </span>
      {(change !== undefined || changePercent !== undefined) && (
        <span
          className={cn(
            "flex items-center gap-1 font-mono",
            sz.change,
            colorCls,
          )}
        >
          {showIcon &&
            !isZero &&
            (isPositive ? (
              <TrendingUp className="w-3 h-3 flex-shrink-0" />
            ) : (
              <TrendingDown className="w-3 h-3 flex-shrink-0" />
            ))}
          {showIcon && isZero && <Minus className="w-3 h-3 flex-shrink-0" />}
          {change !== undefined && (
            <span>
              {sym}
              {formatChange(Math.abs(change)).replace(/^[+-]/, (s) => s)}
              {/* show sign + currency symbol: e.g. +₹23.45 */}
            </span>
          )}
          {changePercent !== undefined && (
            <span className="opacity-80">({formatChange(changePercent)}%)</span>
          )}
        </span>
      )}
    </div>
  );
}

// Inline compact variant — single line
export function PriceInline({
  price,
  change,
  changePercent,
  currency = "INR",
  className,
}: Omit<PriceDisplayProps, "size" | "showIcon">) {
  const isPositive = (change ?? 0) >= 0;
  const isZero = change === 0 || change === undefined;
  const colorCls = isZero
    ? "price-neutral"
    : isPositive
      ? "price-up"
      : "price-down";
  const sym = getCurrencySymbol(currency);

  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-2 font-mono tabular-nums",
        className,
      )}
    >
      <span className="text-foreground font-semibold">
        {sym}
        {formatPrice(price, currency)}
      </span>
      {changePercent !== undefined && (
        <span className={cn("text-xs", colorCls)}>
          {formatChange(changePercent)}%
        </span>
      )}
    </span>
  );
}
