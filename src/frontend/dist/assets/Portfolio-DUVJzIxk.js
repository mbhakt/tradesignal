import { b as createLucideIcon, r as reactExports, j as jsxRuntimeExports, P as Primitive, c as cn, B as Button, d as Separator, S as Skeleton, T as TrendingUp } from "./index-k3Dj9kgV.js";
import { I as Input, u as ue, C as ChevronDown, A as AlertDialog, a as AlertDialogTrigger, T as Trash2, b as AlertDialogContent, c as AlertDialogHeader, d as AlertDialogTitle, e as AlertDialogDescription, f as AlertDialogFooter, g as AlertDialogCancel, h as AlertDialogAction } from "./index-Du1oRWt-.js";
import { b as usePortfolio, M as Minus, a as usePortfolioSummary, f as formatChange, m as useAddPosition, l as formatPrice, h as applyExchangeSuffix, n as useRemovePosition, k as useStockSignal, d as deriveCurrency } from "./useBackend-CAnAfp9Y.js";
import { T as TrendingDown, a as SignalBadge } from "./SignalBadge-wa7EAhHq.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M12 12h.01", key: "1mp3jc" }],
  ["path", { d: "M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2", key: "1ksdt3" }],
  ["path", { d: "M22 13a18.15 18.15 0 0 1-20 0", key: "12hx5q" }],
  ["rect", { width: "20", height: "14", x: "2", y: "6", rx: "2", key: "i6l2r4" }]
];
const BriefcaseBusiness = createLucideIcon("briefcase-business", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]];
const ChevronUp = createLucideIcon("chevron-up", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M8 12h8", key: "1wcyev" }],
  ["path", { d: "M12 8v8", key: "napkw2" }]
];
const CirclePlus = createLucideIcon("circle-plus", __iconNode);
var NAME = "Label";
var Label$1 = reactExports.forwardRef((props, forwardedRef) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.label,
    {
      ...props,
      ref: forwardedRef,
      onMouseDown: (event) => {
        var _a;
        const target = event.target;
        if (target.closest("button, input, select, textarea")) return;
        (_a = props.onMouseDown) == null ? void 0 : _a.call(props, event);
        if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
      }
    }
  );
});
Label$1.displayName = NAME;
var Root = Label$1;
function Label({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}
const EXCHANGES = ["NSE", "BSE", "US"];
function ExchangeSelector({
  value,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "fieldset",
    {
      className: "flex items-center rounded-sm border border-border overflow-hidden bg-input",
      "aria-label": "Select exchange",
      "data-ocid": "portfolio.exchange_selector",
      children: EXCHANGES.map((ex) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => onChange(ex),
          className: cn(
            "px-3 py-1.5 text-xs font-mono font-semibold transition-colors-fast select-none",
            value === ex ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          ),
          "data-ocid": `portfolio.exchange.${ex.toLowerCase()}`,
          "aria-pressed": value === ex,
          children: ex
        },
        ex
      ))
    }
  );
}
function PnlCell({
  value,
  percent,
  currency
}) {
  const isPos = value > 0;
  const isZero = value === 0;
  const color = isZero ? "text-muted-foreground" : isPos ? "text-primary" : "text-destructive";
  const sym = currency === "USD" ? "$" : "₹";
  const locale = currency === "USD" ? "en-US" : "en-IN";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("font-mono tabular-nums text-right", color), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-semibold", children: [
      isPos ? "+" : "-",
      sym,
      Math.abs(value).toLocaleString(locale, { maximumFractionDigits: 2 })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs opacity-80", children: [
      formatChange(percent),
      "%"
    ] })
  ] });
}
function SummaryCards({ positionCount }) {
  const { data: summary, isLoading } = usePortfolioSummary();
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
        "data-ocid": "portfolio.summary.loading_state",
        children: ["sk1", "sk2", "sk3", "sk4"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-sm" }, k))
      }
    );
  }
  const totalValue = (summary == null ? void 0 : summary.totalValue) ?? 0;
  const totalCost = (summary == null ? void 0 : summary.totalCost) ?? 0;
  const totalPnl = (summary == null ? void 0 : summary.totalPnl) ?? 0;
  const totalPnlPct = (summary == null ? void 0 : summary.totalPnlPercent) ?? 0;
  const isPos = totalPnl > 0;
  const isNeg = totalPnl < 0;
  const pnlColor = isPos ? "text-primary" : isNeg ? "text-destructive" : "text-muted-foreground";
  const PnlIcon = isPos ? TrendingUp : isNeg ? TrendingDown : Minus;
  const fmtInr = (v) => `₹${Math.abs(v).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  const cards = [
    {
      label: "Total Value",
      value: fmtInr(totalValue),
      sub: `${positionCount} positions`,
      color: "text-foreground",
      Icon: BriefcaseBusiness
    },
    {
      label: "Total Cost",
      value: fmtInr(totalCost),
      sub: "invested capital",
      color: "text-foreground",
      Icon: BriefcaseBusiness
    },
    {
      label: "Total P&L",
      value: `${isPos ? "+" : isNeg ? "-" : ""}${fmtInr(totalPnl)}`,
      sub: isPos ? "Profit" : isNeg ? "Loss" : "Breakeven",
      color: pnlColor,
      Icon: PnlIcon
    },
    {
      label: "Return",
      value: `${formatChange(totalPnlPct)}%`,
      sub: isPos ? "Profitable" : isNeg ? "In Loss" : "No change",
      color: pnlColor,
      Icon: PnlIcon
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
      "data-ocid": "portfolio.summary.card",
      children: cards.map(({ label, value, sub, color, Icon }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "trading-card px-4 py-3 space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn("w-3.5 h-3.5 flex-shrink-0", color) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "data-label", children: label })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: cn("price-display text-xl tabular-nums", color), children: value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: cn("text-xs font-mono", color), children: sub })
      ] }, label))
    }
  );
}
function AddPositionForm({ onAdded }) {
  const add = useAddPosition();
  const [symbol, setSymbol] = reactExports.useState("");
  const [exchange, setExchange] = reactExports.useState("NSE");
  const [entryPrice, setEntryPrice] = reactExports.useState("");
  const [quantity, setQuantity] = reactExports.useState("");
  const [entryDate, setEntryDate] = reactExports.useState(
    (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  );
  async function handleSubmit(e) {
    e.preventDefault();
    const raw = symbol.trim().toUpperCase();
    const sym = applyExchangeSuffix(raw, exchange);
    const ep = Number.parseFloat(entryPrice);
    const qty = Number.parseFloat(quantity);
    if (!sym || Number.isNaN(ep) || Number.isNaN(qty) || ep <= 0 || qty <= 0) {
      ue.error("Fill all fields with valid values.");
      return;
    }
    const ts = BigInt(new Date(entryDate).getTime()) * 1000000n;
    try {
      await add.mutateAsync({
        symbol: sym,
        entryPrice: ep,
        quantity: qty,
        entryDate: ts,
        exchange,
        currency: exchange === "US" ? "USD" : "INR"
      });
      ue.success(`Added ${sym} position`);
      setSymbol("");
      setEntryPrice("");
      setQuantity("");
      setEntryDate((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
      onAdded();
    } catch {
      ue.error("Failed to add position. Please try again.");
    }
  }
  const currencyLabel = exchange === "US" ? "Entry Price ($)" : "Entry Price (₹)";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      onSubmit: handleSubmit,
      className: "trading-card p-5 border-primary/20",
      "data-ocid": "portfolio.add_position.card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold text-foreground mb-4 flex items-center gap-2 tracking-wide", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "w-4 h-4 text-primary" }),
          "Add Position"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "data-label", children: "Exchange" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExchangeSelector, { value: exchange, onChange: setExchange })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "p-sym", className: "data-label", children: "Symbol" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "p-sym",
                value: symbol,
                onChange: (e) => setSymbol(e.target.value.toUpperCase()),
                placeholder: exchange === "NSE" ? "e.g. INFY" : exchange === "BSE" ? "e.g. INFY" : "e.g. AAPL",
                maxLength: 12,
                className: "font-mono uppercase bg-input border-border",
                "data-ocid": "portfolio.symbol.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "p-price", className: "data-label", children: currencyLabel }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "p-price",
                type: "number",
                step: "0.01",
                min: "0.01",
                value: entryPrice,
                onChange: (e) => setEntryPrice(e.target.value),
                placeholder: "0.00",
                className: "font-mono bg-input border-border",
                "data-ocid": "portfolio.entry_price.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "p-qty", className: "data-label", children: "Quantity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "p-qty",
                type: "number",
                step: "0.001",
                min: "0.001",
                value: quantity,
                onChange: (e) => setQuantity(e.target.value),
                placeholder: "0",
                className: "font-mono bg-input border-border",
                "data-ocid": "portfolio.quantity.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "p-date", className: "data-label", children: "Entry Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "p-date",
                type: "date",
                value: entryDate,
                onChange: (e) => setEntryDate(e.target.value),
                className: "font-mono bg-input border-border",
                "data-ocid": "portfolio.entry_date.input"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            disabled: add.isPending,
            className: "font-mono font-semibold",
            "data-ocid": "portfolio.add_position.submit_button",
            children: add.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-pulse", children: "Adding…" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "w-4 h-4 mr-1.5" }),
              "Add Position"
            ] })
          }
        ) })
      ]
    }
  );
}
function PositionRow({ pos, index }) {
  const remove = useRemovePosition();
  const { data: signalResult } = useStockSignal(pos.symbol, true);
  const signal = (signalResult == null ? void 0 : signalResult.signal) ?? null;
  const currentValue = pos.currentPrice * pos.quantity;
  const isUp = pos.pnl > 0;
  const isDown = pos.pnl < 0;
  const currency = deriveCurrency(pos);
  const sym = currency === "USD" ? "$" : "₹";
  const locale = currency === "USD" ? "en-US" : "en-IN";
  const fmtVal = (v) => v.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  async function handleRemove() {
    try {
      await remove.mutateAsync(pos.id);
      ue.success(`Removed ${pos.symbol}`);
    } catch {
      ue.error("Failed to remove position.");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "tr",
    {
      className: "border-b border-border hover:bg-secondary/50 transition-colors-fast group",
      "data-ocid": `portfolio.position.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 min-w-[100px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono font-bold text-sm text-foreground tracking-wide", children: pos.symbol }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground font-mono tabular-nums", children: [
            pos.quantity.toLocaleString(),
            " sh · ",
            pos.exchange ?? "NSE"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono tabular-nums text-sm text-foreground", children: [
          sym,
          fmtVal(pos.entryPrice)
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono tabular-nums text-sm font-semibold text-foreground", children: [
            sym,
            fmtVal(pos.currentPrice)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: cn(
                "text-[10px] font-mono flex items-center gap-0.5",
                isUp ? "text-primary" : isDown ? "text-destructive" : "text-muted-foreground"
              ),
              children: [
                isUp ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-2.5 h-2.5" }) : isDown ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-2.5 h-2.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-2.5 h-2.5" }),
                "vs entry"
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono tabular-nums text-sm text-foreground", children: [
          sym,
          currentValue.toLocaleString(locale, { maximumFractionDigits: 0 })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PnlCell, { value: pos.pnl, percent: pos.pnlPercent, currency }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: signal !== null ? /* @__PURE__ */ jsxRuntimeExports.jsx(SignalBadge, { signal, size: "sm" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-12 mx-auto" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "h-7 w-7 opacity-0 group-hover:opacity-100 transition-smooth text-muted-foreground hover:text-destructive",
              "aria-label": `Remove ${pos.symbol}`,
              "data-ocid": `portfolio.position.delete_button.${index}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            AlertDialogContent,
            {
              className: "bg-popover border-border",
              "data-ocid": "portfolio.remove_position.dialog",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "text-foreground", children: "Remove Position" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { className: "text-muted-foreground", children: [
                    "Remove",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-semibold text-foreground", children: pos.symbol }),
                    " ",
                    "(",
                    pos.quantity.toLocaleString(),
                    " shares) from your portfolio? This cannot be undone."
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    AlertDialogCancel,
                    {
                      className: "bg-secondary border-border text-foreground hover:bg-muted",
                      "data-ocid": "portfolio.remove_position.cancel_button",
                      children: "Cancel"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    AlertDialogAction,
                    {
                      onClick: handleRemove,
                      disabled: remove.isPending,
                      className: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
                      "data-ocid": "portfolio.remove_position.confirm_button",
                      children: remove.isPending ? "Removing…" : "Remove"
                    }
                  )
                ] })
              ]
            }
          )
        ] }) })
      ]
    }
  );
}
function PositionsTable({ positions }) {
  const netPnl = positions.reduce((s, p) => s + p.pnl, 0);
  const isNetPos = netPnl >= 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "trading-card overflow-hidden",
      "data-ocid": "portfolio.positions.table",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold text-foreground tracking-wide", children: [
            "Positions",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-xs font-normal text-muted-foreground font-mono", children: [
              "(",
              positions.length,
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: cn(
                "text-xs font-mono font-semibold tabular-nums",
                isNetPos ? "text-primary" : "text-destructive"
              ),
              children: [
                "Net P&L: ",
                isNetPos && netPnl > 0 ? "+" : "",
                "₹",
                formatPrice(netPnl, "INR")
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto scrollbar-thin", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm min-w-[720px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-muted/30", children: [
            { label: "Symbol", align: "text-left" },
            { label: "Entry", align: "text-right" },
            { label: "Current", align: "text-right" },
            { label: "Value", align: "text-right" },
            { label: "P&L", align: "text-right" },
            { label: "Signal", align: "text-center" },
            { label: "", align: "text-center w-10" }
          ].map(({ label, align }) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: cn("px-4 py-2.5 data-label", align), children: label }, label)) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: positions.map((pos, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(PositionRow, { pos, index: i + 1 }, pos.id)) })
        ] }) })
      ]
    }
  );
}
function PositionsTableSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "trading-card overflow-hidden",
      "data-ocid": "portfolio.positions.loading_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-28" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-3", children: ["sk-r1", "sk-r2", "sk-r3"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-20" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-16 ml-auto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-16" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-20" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-20" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-14" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-7" })
        ] }, k)) })
      ]
    }
  );
}
function EmptyState({ onAdd }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "trading-card flex flex-col items-center justify-center py-20 text-center",
      "data-ocid": "portfolio.positions.empty_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BriefcaseBusiness, { className: "w-7 h-7 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-foreground mb-1", children: "No positions yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs mb-6", children: "Add your NSE, BSE or US positions to track P&L with live ₹/$ prices and AI-powered buy/hold/sell signals." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground font-mono mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "signal-buy px-2 py-0.5 rounded-sm", children: "BUY" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "signal-hold px-2 py-0.5 rounded-sm", children: "HOLD" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "signal-sell px-2 py-0.5 rounded-sm", children: "SELL" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1", children: "signals refresh every 60s" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            onClick: onAdd,
            className: "font-mono font-semibold gap-1.5",
            "data-ocid": "portfolio.empty_state.add_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "w-3.5 h-3.5" }),
              "Add Your First Position"
            ]
          }
        )
      ]
    }
  );
}
function Portfolio() {
  const { data: positions, isLoading } = usePortfolio();
  const [showForm, setShowForm] = reactExports.useState(true);
  const positionList = positions ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto p-4 space-y-5", "data-ocid": "portfolio.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-semibold text-foreground tracking-wide", children: "Portfolio" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "NSE · BSE · US · Live P&L · AI signals" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          size: "sm",
          className: "font-mono text-xs border-border gap-1.5",
          onClick: () => setShowForm((v) => !v),
          "data-ocid": "portfolio.add_position.toggle",
          children: showForm ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-3.5 h-3.5" }),
            "Hide Form"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "w-3.5 h-3.5" }),
            "Add Position"
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCards, { positionCount: positionList.length }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border/50" }),
    showForm && /* @__PURE__ */ jsxRuntimeExports.jsx(AddPositionForm, { onAdded: () => setShowForm(false) }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(PositionsTableSkeleton, {}) : positionList.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { onAdd: () => setShowForm(true) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(PositionsTable, { positions: positionList })
  ] });
}
export {
  Portfolio as default
};
