import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SignalResult {
    computedAt: bigint;
    indicators: IndicatorSummary;
    signal: Signal;
    confidence: Confidence;
    symbol: string;
}
export interface IndicatorSummary {
    rsi: number;
    emaLong: number;
    macdSignal: number;
    emaShort: number;
    bollingerLower: number;
    macdLine: number;
    bollingerMiddle: number;
    macdHistogram: number;
    bollingerUpper: number;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Position {
    id: string;
    pnl: number;
    currentPrice: number;
    entryDate: bigint;
    pnlPercent: number;
    quantity: number;
    entryPrice: number;
    exchange?: string;
    symbol: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface PortfolioSummary {
    totalValue: number;
    totalCost: number;
    totalPnl: number;
    totalPnlPercent: number;
}
export interface WatchlistItem {
    lastUpdated: bigint;
    currency?: string;
    change: number;
    exchange?: string;
    price: number;
    changePercent: number;
    symbol: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export enum Confidence {
    Low = "Low",
    High = "High",
    Medium = "Medium"
}
export enum Signal {
    Buy = "Buy",
    Hold = "Hold",
    Sell = "Sell"
}
export interface backendInterface {
    addPosition(symbol: string, entryPrice: number, quantity: number, entryDate: bigint, exchange: string | null): Promise<void>;
    addToWatchlist(symbol: string, exchange: string | null): Promise<void>;
    getPortfolio(): Promise<Array<Position>>;
    getPortfolioSummary(): Promise<PortfolioSummary>;
    getStockSignal(symbol: string): Promise<SignalResult>;
    getWatchlist(): Promise<Array<WatchlistItem>>;
    refreshPrice(symbol: string): Promise<WatchlistItem>;
    removeFromWatchlist(symbol: string): Promise<void>;
    removePosition(id: string): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
