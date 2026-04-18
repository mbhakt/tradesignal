import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { PortfolioSummary, SignalResult, WatchlistItem } from "../backend";
import type { Exchange, Position } from "../types";

// ── Actor hook ────────────────────────────────────────────────────────────────

function useTypedActor() {
  return useActor(createActor);
}

// ── Watchlist ─────────────────────────────────────────────────────────────────

export function useWatchlist() {
  const { actor, isFetching } = useTypedActor();
  return useQuery<WatchlistItem[]>({
    queryKey: ["watchlist"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWatchlist();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });
}

export function useAddToWatchlist() {
  const { actor } = useTypedActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      symbol,
      exchange: _exchange,
    }: {
      symbol: string;
      exchange?: Exchange;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      // Backend accepts symbol already including exchange suffix (.NS/.BO)
      return actor.addToWatchlist(symbol, _exchange ?? null);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["watchlist"] }),
  });
}

export function useRemoveFromWatchlist() {
  const { actor } = useTypedActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (symbol: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.removeFromWatchlist(symbol);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["watchlist"] }),
  });
}

export function useRefreshPrice() {
  const { actor } = useTypedActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (symbol: string): Promise<WatchlistItem> => {
      if (!actor) throw new Error("Actor not ready");
      return actor.refreshPrice(symbol);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["watchlist"] }),
  });
}

// ── Signals ───────────────────────────────────────────────────────────────────

export function useStockSignal(symbol: string, enabled = true) {
  const { actor, isFetching } = useTypedActor();
  return useQuery<SignalResult>({
    queryKey: ["signal", symbol],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getStockSignal(symbol);
    },
    enabled: !!actor && !isFetching && enabled && !!symbol,
    staleTime: 60_000,
  });
}

// ── Portfolio ─────────────────────────────────────────────────────────────────

export function usePortfolio() {
  const { actor, isFetching } = useTypedActor();
  return useQuery<Position[]>({
    queryKey: ["portfolio"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPortfolio();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });
}

export function usePortfolioSummary() {
  const { actor, isFetching } = useTypedActor();
  return useQuery<PortfolioSummary>({
    queryKey: ["portfolio-summary"],
    queryFn: async () => {
      if (!actor) {
        return { totalValue: 0, totalCost: 0, totalPnl: 0, totalPnlPercent: 0 };
      }
      return actor.getPortfolioSummary();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });
}

export function useAddPosition() {
  const { actor } = useTypedActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      symbol,
      entryPrice,
      quantity,
      entryDate,
      exchange: _exchange,
      currency: _currency,
    }: {
      symbol: string;
      entryPrice: number;
      quantity: number;
      entryDate: bigint;
      exchange?: Exchange;
      currency?: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      // Symbol already includes exchange suffix from applyExchangeSuffix()
      return actor.addPosition(
        symbol,
        entryPrice,
        quantity,
        entryDate,
        _exchange ?? null,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["portfolio"] });
      qc.invalidateQueries({ queryKey: ["portfolio-summary"] });
    },
  });
}

export function useRemovePosition() {
  const { actor } = useTypedActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.removePosition(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["portfolio"] });
      qc.invalidateQueries({ queryKey: ["portfolio-summary"] });
    },
  });
}
