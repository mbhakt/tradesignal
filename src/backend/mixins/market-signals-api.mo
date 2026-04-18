import Types "../types/market-signals";
import Lib "../lib/market-signals";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";

mixin (
  watchlist : List.List<Types.WatchlistItem>,
  positions : List.List<Types.Position>,
  priceCache : Map.Map<Text, Float>,
) {

  // ──────────────────────────────────────────────
  // HTTP transform (required by IC for outcalls)
  // ──────────────────────────────────────────────

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // ──────────────────────────────────────────────
  // Watchlist API
  // ──────────────────────────────────────────────

  public func getWatchlist() : async [Types.WatchlistItem] {
    Lib.getWatchlist(watchlist);
  };

  public func addToWatchlist(symbol : Text, exchange : ?Text) : async () {
    Lib.addToWatchlist(watchlist, symbol, exchange);
  };

  public func removeFromWatchlist(symbol : Text) : async () {
    Lib.removeFromWatchlist(watchlist, symbol);
  };

  /// Fetches live price for a single symbol and updates the watchlist item.
  public func refreshPrice(symbol : Text) : async Types.WatchlistItem {
    let upper = symbol.toUpper();
    // Yahoo Finance chart endpoint — 5d daily data for indicator computation
    let url = "https://query1.finance.yahoo.com/v8/finance/chart/" # upper # "?interval=1d&range=3mo";
    let rawJson = await OutCall.httpGetRequest(url, [], transform);

    // Parse current price
    let currentPrice = switch (Lib.parseCurrentPrice(rawJson)) {
      case (?p) p;
      case null 0.0;
    };

    // Fetch previous close to compute change
    let prevClose = switch (Lib.getCachedPrice(priceCache, upper # "_prev")) {
      case (?p) p;
      case null currentPrice;
    };

    let change = currentPrice - prevClose;
    let changePercent = if (prevClose == 0.0) 0.0 else (change / prevClose) * 100.0;

    // Preserve exchange / currency from existing watchlist entry (if any)
    let existingExchange = switch (watchlist.find(func(w : Types.WatchlistItem) : Bool { w.symbol == upper })) {
      case (?w) w.exchange;
      case null null;
    };

    let item : Types.WatchlistItem = {
      symbol = upper;
      price = currentPrice;
      change;
      changePercent;
      lastUpdated = Time.now();
      exchange = existingExchange;
      currency = Lib.deriveCurrency(existingExchange);
    };

    Lib.upsertWatchlistItem(watchlist, item);
    Lib.updatePriceCache(priceCache, upper, currentPrice);

    item;
  };

  // ──────────────────────────────────────────────
  // Signal API
  // ──────────────────────────────────────────────

  public func getStockSignal(symbol : Text) : async Types.SignalResult {
    let upper = symbol.toUpper();
    // Fetch 6 months of daily data to have enough closes for all indicators
    let url = "https://query1.finance.yahoo.com/v8/finance/chart/" # upper # "?interval=1d&range=6mo";
    let rawJson = await OutCall.httpGetRequest(url, [], transform);

    let closes = Lib.parseClosingPrices(rawJson);
    let currentPrice = switch (Lib.parseCurrentPrice(rawJson)) {
      case (?p) p;
      case null {
        // Fallback: use last close
        if (closes.size() > 0) closes[closes.size() - 1] else 0.0;
      };
    };

    // Cache the current price
    Lib.updatePriceCache(priceCache, upper, currentPrice);

    Lib.buildSignalResult(upper, closes, currentPrice);
  };

  // ──────────────────────────────────────────────
  // Portfolio API
  // ──────────────────────────────────────────────

  public func getPortfolio() : async [Types.Position] {
    Lib.getPortfolio(positions, priceCache);
  };

  public func addPosition(
    symbol : Text,
    entryPrice : Float,
    quantity : Float,
    entryDate : Int,
    exchange : ?Text,
  ) : async () {
    Lib.addPosition(positions, symbol, entryPrice, quantity, entryDate, exchange);
  };

  public func removePosition(id : Text) : async () {
    Lib.removePosition(positions, id);
  };

  public func getPortfolioSummary() : async Types.PortfolioSummary {
    Lib.getPortfolioSummary(positions, priceCache);
  };

};
