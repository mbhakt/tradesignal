import type { backendInterface, WatchlistItem, Position, PortfolioSummary, SignalResult, TransformationOutput } from "../backend";
import { Signal, Confidence } from "../backend";

export const mockBackend: backendInterface = {
  addPosition: async (_symbol: string, _entryPrice: number, _quantity: number, _entryDate: bigint): Promise<void> => {
    return undefined;
  },
  addToWatchlist: async (_symbol: string): Promise<void> => {
    return undefined;
  },
  getPortfolio: async (): Promise<Position[]> => {
    return [
      {
        id: "pos-1",
        symbol: "AAPL",
        entryPrice: 172.50,
        currentPrice: 189.30,
        quantity: 10,
        pnl: 168.00,
        pnlPercent: 9.74,
        entryDate: BigInt(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
      {
        id: "pos-2",
        symbol: "TSLA",
        entryPrice: 248.00,
        currentPrice: 234.50,
        quantity: 5,
        pnl: -67.50,
        pnlPercent: -5.44,
        entryDate: BigInt(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
      {
        id: "pos-3",
        symbol: "NVDA",
        entryPrice: 435.00,
        currentPrice: 512.80,
        quantity: 3,
        pnl: 233.40,
        pnlPercent: 17.89,
        entryDate: BigInt(Date.now() - 45 * 24 * 60 * 60 * 1000),
      },
    ];
  },
  getPortfolioSummary: async (): Promise<PortfolioSummary> => {
    return {
      totalValue: 4243.40,
      totalCost: 3908.50,
      totalPnl: 334.90,
      totalPnlPercent: 8.57,
    };
  },
  getStockSignal: async (symbol: string): Promise<SignalResult> => {
    const signals: Record<string, SignalResult> = {
      AAPL: {
        symbol: "AAPL",
        signal: Signal.Buy,
        confidence: Confidence.High,
        computedAt: BigInt(Date.now()),
        indicators: {
          rsi: 58.2,
          emaShort: 187.5,
          emaLong: 182.3,
          macdLine: 2.14,
          macdSignal: 1.78,
          macdHistogram: 0.36,
          bollingerUpper: 195.20,
          bollingerMiddle: 185.40,
          bollingerLower: 175.60,
        },
      },
    };
    return signals[symbol] ?? {
      symbol,
      signal: Signal.Hold,
      confidence: Confidence.Medium,
      computedAt: BigInt(Date.now()),
      indicators: {
        rsi: 50.0,
        emaShort: 100.0,
        emaLong: 98.0,
        macdLine: 0.5,
        macdSignal: 0.4,
        macdHistogram: 0.1,
        bollingerUpper: 105.0,
        bollingerMiddle: 100.0,
        bollingerLower: 95.0,
      },
    };
  },
  getWatchlist: async (): Promise<WatchlistItem[]> => {
    return [
      {
        symbol: "AAPL",
        price: 189.30,
        change: 2.45,
        changePercent: 1.31,
        lastUpdated: BigInt(Date.now()),
      },
      {
        symbol: "TSLA",
        price: 234.50,
        change: -8.70,
        changePercent: -3.58,
        lastUpdated: BigInt(Date.now()),
      },
      {
        symbol: "NVDA",
        price: 512.80,
        change: 14.20,
        changePercent: 2.85,
        lastUpdated: BigInt(Date.now()),
      },
      {
        symbol: "MSFT",
        price: 378.60,
        change: 3.10,
        changePercent: 0.83,
        lastUpdated: BigInt(Date.now()),
      },
      {
        symbol: "GOOGL",
        price: 142.85,
        change: -1.25,
        changePercent: -0.87,
        lastUpdated: BigInt(Date.now()),
      },
    ];
  },
  refreshPrice: async (symbol: string): Promise<WatchlistItem> => {
    return {
      symbol,
      price: 189.30,
      change: 2.45,
      changePercent: 1.31,
      lastUpdated: BigInt(Date.now()),
    };
  },
  removeFromWatchlist: async (_symbol: string): Promise<void> => {
    return undefined;
  },
  removePosition: async (_id: string): Promise<void> => {
    return undefined;
  },
  transform: async (_input: any): Promise<TransformationOutput> => {
    return {
      status: BigInt(200),
      body: new Uint8Array(),
      headers: [],
    };
  },
};
