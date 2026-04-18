// Re-export backend types for convenient use throughout the app
export type {
  PortfolioSummary,
  SignalResult,
  IndicatorSummary,
} from "../backend";

export { Signal, Confidence } from "../backend";

// Extended frontend types with optional exchange + currency fields
export interface WatchlistItem {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: bigint;
  exchange?: string;
  currency?: string;
}

export interface Position {
  id: string;
  symbol: string;
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  pnl: number;
  pnlPercent: number;
  entryDate: bigint;
  exchange?: string;
  currency?: string;
}

// UI-only helpers
export type SignalType = "Buy" | "Hold" | "Sell";
export type ConfidenceType = "Low" | "Medium" | "High";
export type Exchange = "NSE" | "BSE" | "US";

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}

/** Append exchange suffix to a raw symbol if needed */
export function applyExchangeSuffix(
  symbol: string,
  exchange: Exchange,
): string {
  if (exchange === "NSE") {
    return symbol.endsWith(".NS") ? symbol : `${symbol}.NS`;
  }
  if (exchange === "BSE") {
    return symbol.endsWith(".BO") ? symbol : `${symbol}.BO`;
  }
  return symbol;
}

/** Derive currency string from a WatchlistItem or Position */
export function deriveCurrency(item: {
  currency?: string;
  exchange?: string;
}): string {
  if (item.currency) return item.currency;
  if (item.exchange === "US") return "USD";
  return "INR";
}
