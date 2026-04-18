import { u as useNavigate, j as jsxRuntimeExports, B as Button, S as Skeleton, T as TrendingUp, a as Badge, c as cn } from "./index-k3Dj9kgV.js";
import { u as useWatchlist, a as usePortfolioSummary, b as usePortfolio, f as formatChange, c as useRefreshPrice, d as deriveCurrency, P as PriceDisplay, g as getCurrencySymbol } from "./useBackend-CAnAfp9Y.js";
import { C as Confidence, S as Signal, a as SignalBadge, T as TrendingDown } from "./SignalBadge-wa7EAhHq.js";
import { A as Activity } from "./activity-Cijxz3CJ.js";
import { P as Plus, R as RefreshCw } from "./refresh-cw-oOsi79T4.js";
const DEMO_WATCHLIST = [
  {
    symbol: "INFY.NS",
    price: 1847.35,
    change: 23.15,
    changePercent: 1.27,
    lastUpdated: BigInt(0),
    exchange: "NSE",
    currency: "INR"
  },
  {
    symbol: "TCS.NS",
    price: 3512.6,
    change: -41.8,
    changePercent: -1.18,
    lastUpdated: BigInt(0),
    exchange: "NSE",
    currency: "INR"
  },
  {
    symbol: "RELIANCE.NS",
    price: 2934.15,
    change: 58.25,
    changePercent: 2.03,
    lastUpdated: BigInt(0),
    exchange: "NSE",
    currency: "INR"
  },
  {
    symbol: "ICICIBANK.NS",
    price: 1089.45,
    change: -12.3,
    changePercent: -1.12,
    lastUpdated: BigInt(0),
    exchange: "NSE",
    currency: "INR"
  },
  {
    symbol: "WIPRO.NS",
    price: 467.2,
    change: 5.85,
    changePercent: 1.27,
    lastUpdated: BigInt(0),
    exchange: "NSE",
    currency: "INR"
  }
];
const DEMO_SIGNALS = {
  "INFY.NS": { signal: Signal.Buy, confidence: Confidence.High },
  "TCS.NS": { signal: Signal.Hold, confidence: Confidence.Medium },
  "RELIANCE.NS": { signal: Signal.Buy, confidence: Confidence.High },
  "ICICIBANK.NS": { signal: Signal.Sell, confidence: Confidence.Medium },
  "WIPRO.NS": { signal: Signal.Hold, confidence: Confidence.Low }
};
const DEMO_POSITIONS = [
  {
    id: "1",
    symbol: "INFY.NS",
    entryPrice: 1750,
    currentPrice: 1847.35,
    quantity: 50,
    pnl: 4867.5,
    pnlPercent: 5.56,
    entryDate: BigInt(0),
    exchange: "NSE",
    currency: "INR"
  },
  {
    id: "2",
    symbol: "TCS.NS",
    entryPrice: 3200,
    currentPrice: 3512.6,
    quantity: 25,
    pnl: 7815,
    pnlPercent: 9.77,
    entryDate: BigInt(0),
    exchange: "NSE",
    currency: "INR"
  },
  {
    id: "3",
    symbol: "WIPRO.NS",
    entryPrice: 440,
    currentPrice: 467.2,
    quantity: 100,
    pnl: 2720,
    pnlPercent: 6.18,
    entryDate: BigInt(0),
    exchange: "NSE",
    currency: "INR"
  }
];
const DEMO_TOTAL_VALUE_INR = 226902.5;
const DEMO_TOTAL_PNL_INR = 15402.5;
const DEMO_TOTAL_PNL_PCT = DEMO_TOTAL_PNL_INR / 211500 * 100;
function StatCard({ label, value, change, changePercent }) {
  const isPositive = (change ?? 0) >= 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "trading-card px-4 py-3 space-y-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "data-label", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono font-semibold text-xl text-foreground tabular-nums", children: value }),
    change !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "p",
      {
        className: cn(
          "font-mono text-xs tabular-nums",
          isPositive ? "price-up" : "price-down"
        ),
        children: [
          formatChange(change),
          " (",
          formatChange(changePercent ?? 0),
          "%)"
        ]
      }
    )
  ] });
}
function WatchlistCard({ item }) {
  const refresh = useRefreshPrice();
  const sig = DEMO_SIGNALS[item.symbol];
  const isUp = item.change >= 0;
  const currency = deriveCurrency(item);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "trading-card trading-card-hover p-3 space-y-2",
      "data-ocid": `watchlist.item.${item.symbol.toLowerCase().replace(/\./g, "_")}_card`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground text-sm", children: item.symbol }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              PriceDisplay,
              {
                price: item.price,
                change: item.change,
                changePercent: item.changePercent,
                size: "sm",
                currency
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1.5 flex-shrink-0", children: [
            sig && /* @__PURE__ */ jsxRuntimeExports.jsx(
              SignalBadge,
              {
                signal: sig.signal,
                confidence: sig.confidence,
                size: "sm"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => refresh.mutate(item.symbol),
                disabled: refresh.isPending,
                className: "text-muted-foreground hover:text-foreground transition-colors-fast",
                "aria-label": `Refresh ${item.symbol}`,
                "data-ocid": `watchlist.refresh_button.${item.symbol.toLowerCase().replace(/\./g, "_")}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  RefreshCw,
                  {
                    className: cn("w-3 h-3", refresh.isPending && "animate-spin")
                  }
                )
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "svg",
          {
            viewBox: "0 0 100 24",
            className: "w-full h-full",
            preserveAspectRatio: "none",
            role: "img",
            "aria-label": `${item.symbol} sparkline trend ${isUp ? "up" : "down"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "polyline",
              {
                points: isUp ? "0,20 15,18 30,16 45,19 60,14 75,10 90,8 100,6" : "0,6 15,8 30,10 45,8 60,12 75,16 90,18 100,20",
                fill: "none",
                stroke: isUp ? "oklch(var(--primary))" : "oklch(var(--destructive))",
                strokeWidth: "1.5",
                strokeLinecap: "round",
                strokeLinejoin: "round"
              }
            )
          }
        ) })
      ]
    }
  );
}
function PositionRow({ pos, index }) {
  const sig = DEMO_SIGNALS[pos.symbol];
  const isUp = pos.pnl >= 0;
  const currency = deriveCurrency(pos);
  const sym = getCurrencySymbol(currency);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 px-3 py-2.5 border-b border-border last:border-b-0 hover:bg-secondary/50 transition-colors-fast",
      "data-ocid": `portfolio.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-sm text-foreground", children: pos.symbol }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-mono", children: [
            pos.quantity,
            " @ ",
            sym,
            pos.entryPrice.toLocaleString("en-IN", { maximumFractionDigits: 2 })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-sm text-foreground", children: [
            sym,
            (pos.currentPrice * pos.quantity).toLocaleString("en-IN", {
              maximumFractionDigits: 0
            })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: cn("font-mono text-xs", isUp ? "price-up" : "price-down"),
              children: [
                isUp ? "+" : "",
                sym,
                Math.abs(pos.pnl).toLocaleString("en-IN", {
                  maximumFractionDigits: 0
                })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "p",
          {
            className: cn(
              "font-mono text-sm font-semibold",
              isUp ? "price-up" : "price-down"
            ),
            children: [
              isUp ? "+" : "",
              pos.pnlPercent.toFixed(2),
              "%"
            ]
          }
        ) }),
        sig && /* @__PURE__ */ jsxRuntimeExports.jsx(SignalBadge, { signal: sig.signal, size: "sm" })
      ]
    }
  );
}
function Dashboard() {
  const navigate = useNavigate();
  const { data: watchlist, isLoading: wLoading } = useWatchlist();
  const { data: summary } = usePortfolioSummary();
  const { data: portfolio } = usePortfolio();
  const items = (watchlist == null ? void 0 : watchlist.length) ? watchlist : DEMO_WATCHLIST;
  const positions = (portfolio == null ? void 0 : portfolio.length) ? portfolio : DEMO_POSITIONS;
  const totalValue = (summary == null ? void 0 : summary.totalValue) ?? DEMO_TOTAL_VALUE_INR;
  const totalPnl = (summary == null ? void 0 : summary.totalPnl) ?? DEMO_TOTAL_PNL_INR;
  const totalPnlPct = (summary == null ? void 0 : summary.totalPnlPercent) ?? DEMO_TOTAL_PNL_PCT;
  const inrTotalValue = `₹${totalValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  const inrDayGain = "+₹3,412.50";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col lg:flex-row h-full min-h-0",
      "data-ocid": "dashboard.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 overflow-y-auto scrollbar-thin p-4 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "grid grid-cols-2 sm:grid-cols-4 gap-2",
              "data-ocid": "dashboard.stats_section",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  StatCard,
                  {
                    label: "Portfolio Value",
                    value: inrTotalValue,
                    change: totalPnl,
                    changePercent: totalPnlPct
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  StatCard,
                  {
                    label: "Day's Gain",
                    value: inrDayGain,
                    change: 3412.5,
                    changePercent: 1.53
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Positions", value: `${positions.length}` }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Win Rate", value: "72.1%" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-4 h-4 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-foreground", children: "Watchlist Overview" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                className: "h-7 text-xs gap-1.5",
                onClick: () => navigate({ to: "/watchlist" }),
                "data-ocid": "dashboard.add_watchlist_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }),
                  " Add Symbol"
                ]
              }
            )
          ] }),
          wLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "grid-trading",
              "data-ocid": "dashboard.watchlist.loading_state",
              children: ["s1", "s2", "s3", "s4", "s5"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-sm" }, k))
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid-trading", "data-ocid": "dashboard.watchlist_grid", children: items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(WatchlistCard, { item }, item.symbol)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "trading-card p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "data-label mb-2", children: "Signal Summary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: items.map((item) => {
              const sig = DEMO_SIGNALS[item.symbol];
              if (!sig) return null;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-1.5 text-xs",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-muted-foreground", children: item.symbol }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SignalBadge,
                      {
                        signal: sig.signal,
                        confidence: sig.confidence,
                        size: "sm"
                      }
                    )
                  ]
                },
                item.symbol
              );
            }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "w-full lg:w-72 xl:w-80 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-border overflow-y-auto scrollbar-thin",
            "data-ocid": "dashboard.portfolio_panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-4 h-4 text-primary" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-sm text-foreground", children: "Portfolio" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs font-mono", children: [
                  positions.length,
                  " positions"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-px bg-border m-3 rounded-sm overflow-hidden", children: [
                {
                  label: "Total Value",
                  value: `₹${totalValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`
                },
                {
                  label: "Total P&L",
                  value: `${totalPnl >= 0 ? "+" : ""}₹${Math.abs(totalPnl).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
                  up: totalPnl >= 0
                },
                {
                  label: "P&L %",
                  value: `${totalPnlPct >= 0 ? "+" : ""}${totalPnlPct.toFixed(2)}%`,
                  up: totalPnlPct >= 0
                },
                { label: "Open", value: `${positions.length}` }
              ].map(({ label, value, up }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card px-3 py-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "data-label text-[10px]", children: label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: cn(
                      "font-mono text-sm font-semibold tabular-nums",
                      up ? "price-up" : "text-foreground"
                    ),
                    children: value
                  }
                )
              ] }, label)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "trading-card mx-3 mb-3 overflow-hidden",
                  "data-ocid": "dashboard.positions_list",
                  children: positions.map((pos, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(PositionRow, { pos, index: i + 1 }, pos.id))
                }
              ),
              positions.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex flex-col items-center justify-center py-12 text-center px-4",
                  "data-ocid": "dashboard.positions.empty_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "w-8 h-8 text-muted-foreground mb-2" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No open positions" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Add positions from the Portfolio page" })
                  ]
                }
              )
            ]
          }
        )
      ]
    }
  );
}
export {
  Dashboard as default
};
