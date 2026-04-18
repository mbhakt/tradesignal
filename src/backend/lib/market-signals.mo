import Types "../types/market-signals";
import List "mo:core/List";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Text "mo:core/Text";

module {

  // ──────────────────────────────────────────────
  // Watchlist helpers
  // ──────────────────────────────────────────────

  /// Returns all watchlist items as an immutable array.
  public func getWatchlist(watchlist : List.List<Types.WatchlistItem>) : [Types.WatchlistItem] {
    watchlist.toArray();
  };

  /// Derives the currency from the exchange: NSE/BSE → INR, otherwise USD.
  public func deriveCurrency(exchange : ?Text) : ?Text {
    switch (exchange) {
      case (?"NSE") ?"INR";
      case (?"BSE") ?"INR";
      case _ ?"USD";
    };
  };

  /// Appends the appropriate Yahoo Finance suffix for the given exchange if not already present.
  public func applyExchangeSuffix(symbol : Text, exchange : ?Text) : Text {
    switch (exchange) {
      case (?"NSE") {
        if (symbol.endsWith(#text ".NS")) symbol else symbol # ".NS";
      };
      case (?"BSE") {
        if (symbol.endsWith(#text ".BO")) symbol else symbol # ".BO";
      };
      case _ symbol;
    };
  };

  /// Adds a symbol stub to the watchlist (price fields zeroed until refreshed).
  /// Accepts an optional exchange ("NSE", "BSE", "US"). Appends .NS/.BO suffix when needed.
  /// Silently ignores if the symbol already exists.
  public func addToWatchlist(watchlist : List.List<Types.WatchlistItem>, symbol : Text, exchange : ?Text) : () {
    let upper = applyExchangeSuffix(symbol.toUpper(), exchange);
    let exists = watchlist.find(func(item : Types.WatchlistItem) : Bool {
      item.symbol == upper
    });
    switch (exists) {
      case (?_) {};
      case null {
        watchlist.add({
          symbol = upper;
          price = 0.0;
          change = 0.0;
          changePercent = 0.0;
          lastUpdated = 0;
          exchange;
          currency = deriveCurrency(exchange);
        });
      };
    };
  };

  /// Removes a symbol from the watchlist by symbol text.
  public func removeFromWatchlist(watchlist : List.List<Types.WatchlistItem>, symbol : Text) : () {
    let upper = symbol.toUpper();
    let kept = watchlist.filter(func(item : Types.WatchlistItem) : Bool {
      item.symbol != upper
    });
    watchlist.clear();
    watchlist.append(kept);
  };

  /// Updates (or inserts) a WatchlistItem in the list after a price refresh.
  public func upsertWatchlistItem(watchlist : List.List<Types.WatchlistItem>, item : Types.WatchlistItem) : () {
    let idx = watchlist.findIndex(func(w : Types.WatchlistItem) : Bool { w.symbol == item.symbol });
    switch (idx) {
      case (?i) { watchlist.put(i, item) };
      case null { watchlist.add(item) };
    };
  };
  // ──────────────────────────────────────────────
  // Portfolio helpers
  // ──────────────────────────────────────────────

  /// Returns all portfolio positions as an immutable array, with PnL calculated from current price.
  public func getPortfolio(
    positions : List.List<Types.Position>,
    priceCache : Map.Map<Text, Float>,
  ) : [Types.Position] {
    let updated = positions.map<Types.Position, Types.Position>(func(pos : Types.Position) : Types.Position {
      let currentPrice = switch (priceCache.get(pos.symbol)) {
        case (?p) p;
        case null pos.currentPrice;
      };
      let pnl = (currentPrice - pos.entryPrice) * pos.quantity;
      let cost = pos.entryPrice * pos.quantity;
      let pnlPercent = if (cost == 0.0) 0.0 else (pnl / cost) * 100.0;
      { pos with currentPrice; pnl; pnlPercent };
    });
    updated.toArray();
  };

  /// Adds a new position. Generates a unique id from symbol + timestamp.
  /// Accepts an optional exchange ("NSE", "BSE", "US") and appends suffix to symbol as needed.
  public func addPosition(
    positions : List.List<Types.Position>,
    symbol : Text,
    entryPrice : Float,
    quantity : Float,
    entryDate : Int,
    exchange : ?Text,
  ) : () {
    let upper = applyExchangeSuffix(symbol.toUpper(), exchange);
    let id = upper # "-" # Time.now().toText();
    positions.add({
      id;
      symbol = upper;
      entryPrice;
      quantity;
      entryDate;
      currentPrice = entryPrice;
      pnl = 0.0;
      pnlPercent = 0.0;
      exchange;
    });
  };

  /// Removes a position by id.
  public func removePosition(positions : List.List<Types.Position>, id : Text) : () {
    let kept = positions.filter(func(pos : Types.Position) : Bool { pos.id != id });
    positions.clear();
    positions.append(kept);
  };

  /// Computes aggregate portfolio summary.
  public func getPortfolioSummary(
    positions : List.List<Types.Position>,
    priceCache : Map.Map<Text, Float>,
  ) : Types.PortfolioSummary {
    let updated = getPortfolio(positions, priceCache);
    var totalValue = 0.0;
    var totalCost = 0.0;
    for (pos in updated.values()) {
      totalValue += pos.currentPrice * pos.quantity;
      totalCost += pos.entryPrice * pos.quantity;
    };
    let totalPnl = totalValue - totalCost;
    let totalPnlPercent = if (totalCost == 0.0) 0.0 else (totalPnl / totalCost) * 100.0;
    { totalValue; totalCost; totalPnl; totalPnlPercent };
  };

  // ──────────────────────────────────────────────
  // Price parsing (partial, from raw JSON text)
  // ──────────────────────────────────────────────

  /// Extracts current price from raw Yahoo Finance compatible JSON response.
  /// Looks for the pattern "regularMarketPrice":NUMBER or "price":NUMBER.
  /// Returns null if parsing fails.
  public func parseCurrentPrice(rawJson : Text) : ?Float {
    let markers = ["\"regularMarketPrice\":", "\"price\":", "\"c\":"];
    for (marker in markers.values()) {
      switch (extractFloatAfter(rawJson, marker)) {
        case (?v) { return ?v };
        case null {};
      };
    };
    null;
  };

  /// Extracts an ordered list of closing prices from a historical data JSON response.
  /// Parses the "close" array from Yahoo Finance chart API response.
  public func parseClosingPrices(rawJson : Text) : [Float] {
    let marker = "\"close\":[";
    switch (findSubstring(rawJson, marker)) {
      case null { [] };
      case (?startIdx) {
        let afterMarker = textSliceFrom(rawJson, startIdx + marker.size());
        parseFloatArray(afterMarker);
      };
    };
  };

  // ──────────────────────────────────────────────
  // Technical indicators
  // ──────────────────────────────────────────────

  /// Computes RSI(14) from a slice of closing prices. Returns 50.0 on insufficient data.
  public func computeRSI(closes : [Float], period : Nat) : Float {
    if (closes.size() <= period) return 50.0;

    var avgGain = 0.0;
    var avgLoss = 0.0;

    // Initial average gain/loss over first `period` differences
    var i = 1;
    while (i <= period) {
      let diff = closes[i] - closes[i - 1];
      if (diff > 0.0) { avgGain += diff } else { avgLoss += (-diff) };
      i += 1;
    };
    avgGain := avgGain / period.toFloat();
    avgLoss := avgLoss / period.toFloat();

    // Smoothed RSI for remaining data
    var j = period + 1;
    while (j < closes.size()) {
      let diff = closes[j] - closes[j - 1];
      let periodF = period.toFloat();
      let periodM1F = (period - 1).toFloat();
      if (diff > 0.0) {
        avgGain := (avgGain * periodM1F + diff) / periodF;
        avgLoss := (avgLoss * periodM1F) / periodF;
      } else {
        avgGain := (avgGain * periodM1F) / periodF;
        avgLoss := (avgLoss * periodM1F + (-diff)) / periodF;
      };
      j += 1;
    };

    if (avgLoss == 0.0) return 100.0;
    let rs = avgGain / avgLoss;
    100.0 - (100.0 / (1.0 + rs));
  };

  /// Computes EMA for a given period. Returns simple average on insufficient data.
  public func computeEMA(closes : [Float], period : Nat) : Float {
    if (closes.size() == 0) return 0.0;
    if (closes.size() < period) {
      // Simple average of available data
      var sum = 0.0;
      for (c in closes.values()) { sum += c };
      return sum / closes.size().toFloat();
    };

    // Seed with SMA of first `period` values
    var ema = 0.0;
    var i = 0;
    while (i < period) {
      ema += closes[i];
      i += 1;
    };
    ema := ema / period.toFloat();

    let multiplier = 2.0 / (period + 1).toFloat();
    var j = period;
    while (j < closes.size()) {
      ema := (closes[j] - ema) * multiplier + ema;
      j += 1;
    };
    ema;
  };

  /// Computes MACD (fast=12, slow=26, signal=9). Returns zeroed struct on insufficient data.
  public func computeMACD(closes : [Float]) : { macdLine : Float; signalLine : Float; histogram : Float } {
    if (closes.size() < 35) {
      return { macdLine = 0.0; signalLine = 0.0; histogram = 0.0 };
    };

    // Build MACD line history for signal line computation
    let macdHistory = buildMACDHistory(closes);
    let signalLine = computeEMA(macdHistory, 9);
    let macdLine = if (macdHistory.size() > 0) macdHistory[macdHistory.size() - 1] else 0.0;
    let histogram = macdLine - signalLine;
    { macdLine; signalLine; histogram };
  };

  /// Computes Bollinger Bands (period=20, stdDev multiplier=2).
  public func computeBollingerBands(closes : [Float]) : { upper : Float; middle : Float; lower : Float } {
    let period = 20;
    if (closes.size() < period) {
      let avg = if (closes.size() == 0) 0.0 else {
        var s = 0.0;
        for (c in closes.values()) { s += c };
        s / closes.size().toFloat();
      };
      return { upper = avg; middle = avg; lower = avg };
    };

    let recent = closes.sliceToArray((closes.size() - period).toInt(), closes.size().toInt());
    var sum = 0.0;
    for (c in recent.values()) { sum += c };
    let mean = sum / period.toFloat();

    var variance = 0.0;
    for (c in recent.values()) {
      let diff = c - mean;
      variance += diff * diff;
    };
    variance := variance / period.toFloat();
    let stdDev = Float.sqrt(variance);

    { upper = mean + 2.0 * stdDev; middle = mean; lower = mean - 2.0 * stdDev };
  };

  // ──────────────────────────────────────────────
  // Signal generation
  // ──────────────────────────────────────────────

  /// Derives a BUY/HOLD/SELL signal and confidence from indicator values.
  public func computeSignal(indicators : Types.IndicatorSummary, currentPrice : Float) : {
    signal : Types.Signal;
    confidence : Types.Confidence;
  } {
    var score : Int = 0; // positive = bullish, negative = bearish

    // RSI: oversold (<30) => +2 buy, overbought (>70) => -2 sell, 30-50 => +1, 50-70 => -1
    if (indicators.rsi < 30.0) { score += 2 }
    else if (indicators.rsi < 50.0) { score += 1 }
    else if (indicators.rsi > 70.0) { score -= 2 }
    else { score -= 1 };

    // EMA crossover: short > long => bullish
    if (indicators.emaShort > indicators.emaLong) { score += 1 } else { score -= 1 };

    // MACD: histogram positive => bullish
    if (indicators.macdHistogram > 0.0) { score += 1 } else { score -= 1 };

    // MACD line vs signal: line > signal => bullish
    if (indicators.macdLine > indicators.macdSignal) { score += 1 } else { score -= 1 };

    // Bollinger: price below lower band => oversold/buy; above upper => overbought/sell
    if (currentPrice < indicators.bollingerLower) { score += 2 }
    else if (currentPrice > indicators.bollingerUpper) { score -= 2 }
    else if (currentPrice < indicators.bollingerMiddle) { score += 1 }
    else { score -= 1 };

    let signal : Types.Signal = if (score >= 3) #Buy
      else if (score <= -3) #Sell
      else #Hold;

    let absScore = if (score < 0) -score else score;
    let confidence : Types.Confidence = if (absScore >= 6) #High
      else if (absScore >= 3) #Medium
      else #Low;

    { signal; confidence };
  };

  /// High-level: builds the full SignalResult from raw closing prices + current price.
  public func buildSignalResult(symbol : Text, closes : [Float], currentPrice : Float) : Types.SignalResult {
    let rsi = computeRSI(closes, 14);
    let emaShort = computeEMA(closes, 9);
    let emaLong = computeEMA(closes, 21);
    let macdResult = computeMACD(closes);
    let bb = computeBollingerBands(closes);

    let indicators : Types.IndicatorSummary = {
      rsi;
      emaShort;
      emaLong;
      macdLine = macdResult.macdLine;
      macdSignal = macdResult.signalLine;
      macdHistogram = macdResult.histogram;
      bollingerUpper = bb.upper;
      bollingerMiddle = bb.middle;
      bollingerLower = bb.lower;
    };

    let { signal; confidence } = computeSignal(indicators, currentPrice);

    {
      symbol;
      signal;
      confidence;
      indicators;
      computedAt = Time.now();
    };
  };

  // ──────────────────────────────────────────────
  // Price cache
  // ──────────────────────────────────────────────

  /// Stores the latest price for a symbol in the shared cache.
  public func updatePriceCache(cache : Map.Map<Text, Float>, symbol : Text, price : Float) : () {
    cache.add(symbol, price);
  };

  /// Retrieves the cached price for a symbol, or null if absent.
  public func getCachedPrice(cache : Map.Map<Text, Float>, symbol : Text) : ?Float {
    cache.get(symbol);
  };

  // ──────────────────────────────────────────────
  // Private helpers
  // ──────────────────────────────────────────────

  /// Checks if subChars matches textChars starting at position i.
  private func matchesAt(textChars : [Char], subChars : [Char], i : Nat) : Bool {
    if (i + subChars.size() > textChars.size()) return false;
    var j = 0;
    var ok = true;
    while (j < subChars.size()) {
      if (textChars[i + j] != subChars[j]) { ok := false };
      j += 1;
    };
    ok;
  };

  /// Finds the index of a substring within text. Returns null if not found.
  private func findSubstring(text : Text, sub : Text) : ?Nat {
    let textChars = text.toArray();
    let subChars = sub.toArray();
    let tLen = textChars.size();
    let sLen = subChars.size();
    if (sLen == 0 or sLen > tLen) return null;
    var i = 0;
    var result : ?Nat = null;
    while (i <= tLen - sLen and result == null) {
      if (matchesAt(textChars, subChars, i)) { result := ?i };
      i += 1;
    };
    result;
  };

  /// Returns text starting from character index `from`.
  private func textSliceFrom(text : Text, from : Nat) : Text {
    let chars = text.toArray();
    if (from >= chars.size()) return "";
    let sliced = chars.sliceToArray(from.toInt(), chars.size().toInt());
    Text.fromArray(sliced);
  };

  /// Extracts a Float immediately after a given marker string in text.
  private func extractFloatAfter(text : Text, marker : Text) : ?Float {
    switch (findSubstring(text, marker)) {
      case null null;
      case (?idx) {
        let after = textSliceFrom(text, idx + marker.size());
        parseFirstFloat(after);
      };
    };
  };

  /// Converts a digit character '0'-'9' to its Nat value.
  private func digitVal(c : Char) : Nat {
    switch (c) {
      case '0' 0; case '1' 1; case '2' 2; case '3' 3; case '4' 4;
      case '5' 5; case '6' 6; case '7' 7; case '8' 8; case '9' 9;
      case _ 0;
    };
  };

  /// Parses a float from chars stored as a string like "123.456" or "-12.3".
  private func parseFloatStr(chars : [Char]) : ?Float {
    if (chars.size() == 0) return null;
    var idx = 0;
    var negative = false;
    if (idx < chars.size() and chars[idx] == '-') { negative := true; idx += 1 };
    var intPart : Float = 0.0;
    var hasDigit = false;
    while (idx < chars.size() and chars[idx] >= '0' and chars[idx] <= '9') {
      intPart := intPart * 10.0 + digitVal(chars[idx]).toFloat();
      hasDigit := true;
      idx += 1;
    };
    if (not hasDigit) return null;
    var fracPart : Float = 0.0;
    var fracMul : Float = 0.1;
    if (idx < chars.size() and chars[idx] == '.') {
      idx += 1;
      while (idx < chars.size() and chars[idx] >= '0' and chars[idx] <= '9') {
        fracPart := fracPart + digitVal(chars[idx]).toFloat() * fracMul;
        fracMul := fracMul * 0.1;
        idx += 1;
      };
    };
    let result = intPart + fracPart;
    ?(if (negative) -result else result);
  };

  /// Parses the first float number from the beginning of a text.
  private func parseFirstFloat(text : Text) : ?Float {
    let chars = text.toArray();
    var i = 0;
    // Skip whitespace
    while (i < chars.size() and (chars[i] == ' ' or chars[i] == '\n' or chars[i] == '\r' or chars[i] == '\t')) {
      i += 1;
    };
    if (i >= chars.size()) return null;

    let numChars = List.empty<Char>();
    var seenDigit = false;
    if (chars[i] == '-') { numChars.add('-'); i += 1 };
    while (i < chars.size()) {
      let c = chars[i];
      if ((c >= '0' and c <= '9') or c == '.') {
        numChars.add(c);
        seenDigit := true;
        i += 1;
      } else {
        i := chars.size(); // break
      };
    };
    if (not seenDigit) return null;
    parseFloatStr(numChars.toArray());
  };

  /// Reads a float number from chars starting at index i, returns (value, newIndex).
  private func readFloat(chars : [Char], startIdx : Nat) : (?Float, Nat) {
    var i = startIdx;
    let numChars = List.empty<Char>();
    if (i < chars.size() and chars[i] == '-') {
      numChars.add('-');
      i += 1;
    };
    while (i < chars.size() and ((chars[i] >= '0' and chars[i] <= '9') or chars[i] == '.')) {
      numChars.add(chars[i]);
      i += 1;
    };
    if (numChars.size() == 0 or (numChars.size() == 1 and numChars.at(0) == '-')) return (null, i);
    (parseFloatStr(numChars.toArray()), i);
  };

  /// Parses a JSON float array like 1.0,2.5,3.1] stopping at ] or end of text.
  private func parseFloatArray(text : Text) : [Float] {
    let chars = text.toArray();
    let n = chars.size();
    let result = List.empty<Float>();
    var i = 0;
    while (i < n) {
      let c = chars[i];
      if (c == ']') {
        i := n; // end of array
      } else if ((c >= '0' and c <= '9') or c == '-') {
        let (maybeVal, newIdx) = readFloat(chars, i);
        switch (maybeVal) {
          case (?v) { result.add(v) };
          case null {};
        };
        // Always advance at least 1 to avoid infinite loop
        i := if (newIdx > i) newIdx else i + 1;
      } else {
        i += 1;
      };
    };
    result.toArray();
  };

  /// Builds MACD line history array needed to compute signal line.
  private func buildMACDHistory(closes : [Float]) : [Float] {
    if (closes.size() < 26) return [];
    let result = List.empty<Float>();
    var i = 26;
    while (i <= closes.size()) {
      let slice = closes.sliceToArray(0, i.toInt());
      let emaFast = computeEMA(slice, 12);
      let emaSlow = computeEMA(slice, 26);
      result.add(emaFast - emaSlow);
      i += 1;
    };
    result.toArray();
  };

};
