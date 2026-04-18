import Types "types/market-signals";
import MarketSignalsApi "mixins/market-signals-api";
import Migration "migration";
import List "mo:core/List";
import Map "mo:core/Map";

(with migration = Migration.run)
actor {
  let watchlist = List.empty<Types.WatchlistItem>();
  let positions = List.empty<Types.Position>();
  let priceCache = Map.empty<Text, Float>();

  include MarketSignalsApi(watchlist, positions, priceCache);
};
