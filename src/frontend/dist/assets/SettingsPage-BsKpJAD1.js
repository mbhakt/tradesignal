import { b as createLucideIcon, j as jsxRuntimeExports, T as TrendingUp, d as Separator, a as Badge } from "./index-k3Dj9kgV.js";
import { T as TrendingDown, a as SignalBadge, S as Signal } from "./SignalBadge-wa7EAhHq.js";
import { A as Activity } from "./activity-Cijxz3CJ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M12 7v14", key: "1akyts" }],
  [
    "path",
    {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
      key: "ruj8y"
    }
  ]
];
const BookOpen = createLucideIcon("book-open", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["line", { x1: "18", x2: "18", y1: "20", y2: "10", key: "1xfpm4" }],
  ["line", { x1: "12", x2: "12", y1: "20", y2: "4", key: "be30l9" }],
  ["line", { x1: "6", x2: "6", y1: "20", y2: "14", key: "1r4le6" }]
];
const ChartNoAxesColumn = createLucideIcon("chart-no-axes-column", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
];
const Info = createLucideIcon("info", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const TriangleAlert = createLucideIcon("triangle-alert", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
      key: "1xq2db"
    }
  ]
];
const Zap = createLucideIcon("zap", __iconNode);
const INDICATORS = [
  {
    name: "RSI",
    full: "Relative Strength Index",
    measures: "Momentum — overbought / oversold pressure (0–100 scale)",
    bullish: "< 30 (oversold zone) — mean-reversion rally likely",
    bearish: "> 70 (overbought zone) — pullback / reversal likely",
    weight: "25%"
  },
  {
    name: "MACD",
    full: "Moving Avg Convergence Divergence",
    measures: "Trend momentum via two EMAs and a signal line",
    bullish: "MACD line crosses above signal line (golden cross)",
    bearish: "MACD line crosses below signal line (death cross)",
    weight: "30%"
  },
  {
    name: "EMA",
    full: "Exponential Moving Average",
    measures: "Trend direction — weights recent prices more heavily than SMA",
    bullish: "Price > EMA-20 and EMA-20 > EMA-50 (stacked bullish)",
    bearish: "Price < EMA-20 and EMA-20 < EMA-50 (stacked bearish)",
    weight: "25%"
  },
  {
    name: "BB",
    full: "Bollinger Bands",
    measures: "Volatility envelope — 2σ bands around a 20-period SMA",
    bullish: "Price bounces off lower band with contracting bandwidth",
    bearish: "Price touches/breaks upper band with expanding bandwidth",
    weight: "20%"
  }
];
const CONFIDENCE_LEVELS = [
  {
    level: "HIGH",
    cls: "bg-primary/10 text-primary border border-primary/30",
    description: "≥ 3 of 4 indicators agree on direction. Strong conviction signal. Position sizing can be increased to full allocation."
  },
  {
    level: "MEDIUM",
    cls: "bg-accent/10 text-accent border border-accent/30",
    description: "2 of 4 indicators agree. Moderate conviction. Standard position sizing recommended. Set tighter stop-losses."
  },
  {
    level: "LOW",
    cls: "bg-muted text-muted-foreground border border-border",
    description: "Indicators are mixed or marginally aligned. Reduce position size or wait for a higher-confidence signal to form."
  }
];
function SectionHeader({ icon, title, subtitle }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 mb-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-sm bg-secondary border border-border mt-0.5 flex-shrink-0", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold text-foreground tracking-tight", children: title }),
      subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: subtitle })
    ] })
  ] });
}
function InfoCard({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "trading-card p-5", children });
}
function SettingsPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-4xl mx-auto px-4 py-6 space-y-8",
      "data-ocid": "settings.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold text-foreground tracking-tight", children: "Settings & Reference" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Signal methodology, indicator reference, and signal legend for Quantum Trade." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "settings.about.section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SectionHeader,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-4 h-4 text-muted-foreground" }),
              title: "About the Signal Engine",
              subtitle: "How BUY / HOLD / SELL signals are generated from live market data"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(InfoCard, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed mb-5", children: "Quantum Trade evaluates every ticker in your watchlist using a composite score derived from four industry-standard technical indicators. Each indicator is computed from the latest available price data, weighted by reliability, and aggregated into a single directional signal with a confidence level." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
              {
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-3.5 h-3.5 text-primary" }),
                name: "RSI",
                body: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  "The",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Relative Strength Index" }),
                  " ",
                  "measures price momentum on a 0–100 scale. Readings below",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-mono", children: "30" }),
                  " signal oversold conditions with potential for a recovery rally. Readings above",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive font-mono", children: "70" }),
                  " ",
                  "indicate overbought conditions where a pullback is likely."
                ] })
              },
              {
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-3.5 h-3.5 text-primary" }),
                name: "MACD",
                body: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Moving Average Convergence Divergence" }),
                  " ",
                  "tracks the gap between a 12-period and 26-period EMA. When the MACD line crosses its signal line upward (golden cross) it fires a bullish signal; a downward cross (death cross) signals bearish momentum."
                ] })
              },
              {
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartNoAxesColumn, { className: "w-3.5 h-3.5 text-accent" }),
                name: "EMA",
                body: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Exponential Moving Averages" }),
                  " ",
                  "(EMA-20 and EMA-50) define the underlying trend by weighting recent price action more heavily than older data. Stacked alignment — price above EMA-20 above EMA-50 — confirms an uptrend; the reverse confirms a downtrend."
                ] })
              },
              {
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3.5 h-3.5 text-accent" }),
                name: "Bollinger Bands",
                body: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Bollinger Bands" }),
                  " ",
                  "place 2-standard-deviation envelopes around a 20-period SMA. A price bounce off the lower band with contracting width signals mean-reversion potential. Touching the upper band during expanding width signals an extended, potentially exhausted move."
                ] })
              }
            ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "bg-secondary/50 border border-border rounded-sm p-4",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                    item.icon,
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground uppercase tracking-widest", children: item.name })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: item.body })
                ]
              },
              item.name
            )) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "settings.indicators.section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SectionHeader,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartNoAxesColumn, { className: "w-4 h-4 text-muted-foreground" }),
              title: "Indicator Reference",
              subtitle: "What each indicator measures and the conditions that trigger a signal"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InfoCard, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto scrollbar-thin -mx-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs min-w-[680px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left data-label pb-3 pr-4 pl-1 w-28", children: "Indicator" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left data-label pb-3 pr-4", children: "What It Measures" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left data-label pb-3 pr-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-3 h-3 text-primary" }),
                "Bullish Condition"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left data-label pb-3 pr-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "w-3 h-3 text-destructive" }),
                "Bearish Condition"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right data-label pb-3 pr-1 w-16", children: "Weight" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: INDICATORS.map((ind, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "hover:bg-secondary/40 transition-colors-fast",
                "data-ocid": `settings.indicator.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-3 pr-4 pl-1 align-top", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono font-semibold text-foreground", children: ind.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground text-[10px] mt-0.5 leading-tight break-words", children: ind.full })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 pr-4 align-top text-muted-foreground leading-relaxed", children: ind.measures }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 pr-4 align-top text-primary/80", children: ind.bullish }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 pr-4 align-top text-destructive/80", children: ind.bearish }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 pr-1 align-top text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "outline",
                      className: "font-mono text-[10px] border-border text-muted-foreground",
                      children: ind.weight
                    }
                  ) })
                ]
              },
              ind.name
            )) })
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "settings.signal_legend.section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SectionHeader,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 text-muted-foreground" }),
              title: "Signal Legend",
              subtitle: "What each signal means and how to act on confidence levels"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "trading-card p-4 glow-buy",
                "data-ocid": "settings.signal.buy.card",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SignalBadge, { signal: Signal.Buy, size: "lg" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-4 h-4 text-primary" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Composite score exceeds the bullish threshold. Indicators agree on upward momentum — a potentially favorable entry point. Consider initiating or adding to a long position." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-3 border-t border-border flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "data-label", children: "Composite Score" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-primary text-sm font-semibold", children: "≥ +0.50" })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "trading-card p-4",
                "data-ocid": "settings.signal.hold.card",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SignalBadge, { signal: Signal.Hold, size: "lg" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-4 h-4 text-accent" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Indicators are mixed or directionally neutral. No strong conviction to add or reduce exposure. Existing positions can be maintained while waiting for a clearer signal." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-3 border-t border-border flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "data-label", children: "Composite Score" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-accent text-sm font-semibold", children: "−0.49 to +0.49" })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "trading-card p-4 glow-sell",
                "data-ocid": "settings.signal.sell.card",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SignalBadge, { signal: Signal.Sell, size: "lg" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "w-4 h-4 text-destructive" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Composite score falls below the bearish threshold. Indicators signal downward momentum and elevated risk. Consider reducing exposure or closing existing long positions." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-3 border-t border-border flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "data-label", children: "Composite Score" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-destructive text-sm font-semibold", children: "≤ −0.50" })
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(InfoCard, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-foreground uppercase tracking-widest mb-4", children: "Confidence Levels" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-0 divide-y divide-border", children: CONFIDENCE_LEVELS.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-start gap-4 py-3",
                "data-ocid": `settings.confidence.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `inline-flex items-center rounded-sm font-mono text-xs font-semibold px-2.5 py-1.5 tracking-wider flex-shrink-0 w-20 justify-center ${c.cls}`,
                      children: c.level
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed pt-0.5", children: c.description })
                ]
              },
              c.level
            )) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "settings.app_info.section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SectionHeader,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-4 h-4 text-muted-foreground" }),
              title: "App Information",
              subtitle: "Version details and legal disclaimer"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(InfoCard, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-foreground uppercase tracking-widest mb-4", children: "Version" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [
                { label: "App", value: "Quantum Trade" },
                { label: "Version", value: "1.0.0" },
                { label: "Platform", value: "Internet Computer" },
                { label: "Build", value: "2026.04" },
                { label: "Signal Engine", value: "v2 — RSI · MACD · EMA · BB" }
              ].map(({ label, value }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center justify-between text-xs",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "data-label", children: label }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "data-value", children: value })
                  ]
                },
                label
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "trading-card p-5 border-destructive/25 bg-destructive/5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 text-destructive flex-shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-destructive uppercase tracking-widest", children: "Important Disclaimer" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed mb-3", children: [
                "Quantum Trade is a",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "technical analysis tool" }),
                " ",
                "for informational purposes only. All signals, indicators, and analysis are algorithmically generated and",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "do not constitute financial advice" }),
                "."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed mb-3", children: "Past performance of any signal or strategy does not guarantee future results. Markets are inherently unpredictable and all trading carries a risk of loss, including total loss of capital." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed", children: [
                "Always conduct your own due diligence and consult a",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "licensed financial advisor" }),
                " ",
                "before making any investment decisions."
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground py-4", children: [
          "© ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          ". Built with love using",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.hostname : ""
              )}`,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "text-primary hover:underline",
              children: "caffeine.ai"
            }
          )
        ] })
      ]
    }
  );
}
export {
  SettingsPage as default
};
