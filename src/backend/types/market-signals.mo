module {

  // --- Watchlist ---
  public type WatchlistItem = {
    symbol : Text;
    price : Float;
    change : Float;
    changePercent : Float;
    lastUpdated : Int;
    exchange : ?Text;   // "NSE" | "BSE" | "US" | null
    currency : ?Text;   // "INR" | "USD" | null (derived from exchange)
  };

  // --- Portfolio ---
  public type Position = {
    id : Text;
    symbol : Text;
    entryPrice : Float;
    quantity : Float;
    entryDate : Int;
    currentPrice : Float;
    pnl : Float;
    pnlPercent : Float;
    exchange : ?Text;   // "NSE" | "BSE" | "US" | null
  };

  public type PortfolioSummary = {
    totalValue : Float;
    totalCost : Float;
    totalPnl : Float;
    totalPnlPercent : Float;
  };

  // --- Price History (internal, used for indicator computation) ---
  public type PricePoint = {
    timestamp : Int;
    close : Float;
    high : Float;
    low : Float;
    volume : Float;
  };

  // --- Signals ---
  public type Signal = { #Buy; #Hold; #Sell };
  public type Confidence = { #Low; #Medium; #High };

  public type IndicatorSummary = {
    rsi : Float;
    emaShort : Float;          // EMA(9)
    emaLong : Float;           // EMA(21)
    macdLine : Float;
    macdSignal : Float;
    macdHistogram : Float;
    bollingerUpper : Float;
    bollingerMiddle : Float;
    bollingerLower : Float;
  };

  public type SignalResult = {
    symbol : Text;
    signal : Signal;
    confidence : Confidence;
    indicators : IndicatorSummary;
    computedAt : Int;
  };

  // --- Raw API response (JSON tunnelled to frontend for full parse; partial parse for canister use) ---
  public type RawPriceResponse = {
    symbol : Text;
    rawJson : Text;
  };

};
