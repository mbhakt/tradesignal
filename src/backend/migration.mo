import Types "types/market-signals";
import List "mo:core/List";
import Map "mo:core/Map";

module {

  // --- Old types (from previous deployment, before exchange/currency fields) ---
  type OldWatchlistItem = {
    symbol : Text;
    price : Float;
    change : Float;
    changePercent : Float;
    lastUpdated : Int;
  };

  type OldPosition = {
    id : Text;
    symbol : Text;
    entryPrice : Float;
    quantity : Float;
    entryDate : Int;
    currentPrice : Float;
    pnl : Float;
    pnlPercent : Float;
  };

  type OldActor = {
    watchlist : List.List<OldWatchlistItem>;
    positions : List.List<OldPosition>;
    priceCache : Map.Map<Text, Float>;
  };

  type NewActor = {
    watchlist : List.List<Types.WatchlistItem>;
    positions : List.List<Types.Position>;
    priceCache : Map.Map<Text, Float>;
  };

  public func run(old : OldActor) : NewActor {
    let watchlist = old.watchlist.map<OldWatchlistItem, Types.WatchlistItem>(
      func(item : OldWatchlistItem) : Types.WatchlistItem {
        {
          item with
          exchange = null : ?Text;
          currency = null : ?Text;
        }
      }
    );

    let positions = old.positions.map<OldPosition, Types.Position>(
      func(pos : OldPosition) : Types.Position {
        {
          pos with
          exchange = null : ?Text;
        }
      }
    );

    {
      watchlist;
      positions;
      priceCache = old.priceCache;
    };
  };
};
