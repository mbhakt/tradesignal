import { SignalBadge } from "@/components/SignalBadge";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Activity,
  AlertTriangle,
  BarChart2,
  BookOpen,
  Info,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Signal } from "../types";

// ── Types ─────────────────────────────────────────────────────────────────────
interface IndicatorRow {
  name: string;
  full: string;
  measures: string;
  bullish: string;
  bearish: string;
  weight: string;
}

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}

// ── Static data ───────────────────────────────────────────────────────────────
const INDICATORS: IndicatorRow[] = [
  {
    name: "RSI",
    full: "Relative Strength Index",
    measures: "Momentum — overbought / oversold pressure (0–100 scale)",
    bullish: "< 30 (oversold zone) — mean-reversion rally likely",
    bearish: "> 70 (overbought zone) — pullback / reversal likely",
    weight: "25%",
  },
  {
    name: "MACD",
    full: "Moving Avg Convergence Divergence",
    measures: "Trend momentum via two EMAs and a signal line",
    bullish: "MACD line crosses above signal line (golden cross)",
    bearish: "MACD line crosses below signal line (death cross)",
    weight: "30%",
  },
  {
    name: "EMA",
    full: "Exponential Moving Average",
    measures: "Trend direction — weights recent prices more heavily than SMA",
    bullish: "Price > EMA-20 and EMA-20 > EMA-50 (stacked bullish)",
    bearish: "Price < EMA-20 and EMA-20 < EMA-50 (stacked bearish)",
    weight: "25%",
  },
  {
    name: "BB",
    full: "Bollinger Bands",
    measures: "Volatility envelope — 2σ bands around a 20-period SMA",
    bullish: "Price bounces off lower band with contracting bandwidth",
    bearish: "Price touches/breaks upper band with expanding bandwidth",
    weight: "20%",
  },
];

const CONFIDENCE_LEVELS = [
  {
    level: "HIGH",
    cls: "bg-primary/10 text-primary border border-primary/30",
    description:
      "≥ 3 of 4 indicators agree on direction. Strong conviction signal. Position sizing can be increased to full allocation.",
  },
  {
    level: "MEDIUM",
    cls: "bg-accent/10 text-accent border border-accent/30",
    description:
      "2 of 4 indicators agree. Moderate conviction. Standard position sizing recommended. Set tighter stop-losses.",
  },
  {
    level: "LOW",
    cls: "bg-muted text-muted-foreground border border-border",
    description:
      "Indicators are mixed or marginally aligned. Reduce position size or wait for a higher-confidence signal to form.",
  },
];

// ── Shared sub-components ─────────────────────────────────────────────────────
function SectionHeader({ icon, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="p-2 rounded-sm bg-secondary border border-border mt-0.5 flex-shrink-0">
        {icon}
      </div>
      <div>
        <h2 className="text-base font-semibold text-foreground tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function InfoCard({ children }: { children: React.ReactNode }) {
  return <div className="trading-card p-5">{children}</div>;
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  return (
    <div
      className="max-w-4xl mx-auto px-4 py-6 space-y-8"
      data-ocid="settings.page"
    >
      {/* Page heading */}
      <div>
        <h1 className="text-xl font-semibold text-foreground tracking-tight">
          Settings &amp; Reference
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Signal methodology, indicator reference, and signal legend for Quantum
          Trade.
        </p>
      </div>

      {/* ── 1. About ──────────────────────────────────────────────────────────── */}
      <section data-ocid="settings.about.section">
        <SectionHeader
          icon={<BookOpen className="w-4 h-4 text-muted-foreground" />}
          title="About the Signal Engine"
          subtitle="How BUY / HOLD / SELL signals are generated from live market data"
        />
        <InfoCard>
          <p className="text-sm text-muted-foreground leading-relaxed mb-5">
            Quantum Trade evaluates every ticker in your watchlist using a
            composite score derived from four industry-standard technical
            indicators. Each indicator is computed from the latest available
            price data, weighted by reliability, and aggregated into a single
            directional signal with a confidence level.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: <Activity className="w-3.5 h-3.5 text-primary" />,
                name: "RSI",
                body: (
                  <>
                    The{" "}
                    <strong className="text-foreground">
                      Relative Strength Index
                    </strong>{" "}
                    measures price momentum on a 0–100 scale. Readings below{" "}
                    <span className="text-primary font-mono">30</span> signal
                    oversold conditions with potential for a recovery rally.
                    Readings above{" "}
                    <span className="text-destructive font-mono">70</span>{" "}
                    indicate overbought conditions where a pullback is likely.
                  </>
                ),
              },
              {
                icon: <TrendingUp className="w-3.5 h-3.5 text-primary" />,
                name: "MACD",
                body: (
                  <>
                    <strong className="text-foreground">
                      Moving Average Convergence Divergence
                    </strong>{" "}
                    tracks the gap between a 12-period and 26-period EMA. When
                    the MACD line crosses its signal line upward (golden cross)
                    it fires a bullish signal; a downward cross (death cross)
                    signals bearish momentum.
                  </>
                ),
              },
              {
                icon: <BarChart2 className="w-3.5 h-3.5 text-accent" />,
                name: "EMA",
                body: (
                  <>
                    <strong className="text-foreground">
                      Exponential Moving Averages
                    </strong>{" "}
                    (EMA-20 and EMA-50) define the underlying trend by weighting
                    recent price action more heavily than older data. Stacked
                    alignment — price above EMA-20 above EMA-50 — confirms an
                    uptrend; the reverse confirms a downtrend.
                  </>
                ),
              },
              {
                icon: <Zap className="w-3.5 h-3.5 text-accent" />,
                name: "Bollinger Bands",
                body: (
                  <>
                    <strong className="text-foreground">Bollinger Bands</strong>{" "}
                    place 2-standard-deviation envelopes around a 20-period SMA.
                    A price bounce off the lower band with contracting width
                    signals mean-reversion potential. Touching the upper band
                    during expanding width signals an extended, potentially
                    exhausted move.
                  </>
                ),
              },
            ].map((item) => (
              <div
                key={item.name}
                className="bg-secondary/50 border border-border rounded-sm p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  {item.icon}
                  <span className="text-xs font-semibold text-foreground uppercase tracking-widest">
                    {item.name}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </InfoCard>
      </section>

      <Separator className="bg-border" />

      {/* ── 2. Indicator Reference ────────────────────────────────────────────── */}
      <section data-ocid="settings.indicators.section">
        <SectionHeader
          icon={<BarChart2 className="w-4 h-4 text-muted-foreground" />}
          title="Indicator Reference"
          subtitle="What each indicator measures and the conditions that trigger a signal"
        />
        <InfoCard>
          <div className="overflow-x-auto scrollbar-thin -mx-1">
            <table className="w-full text-xs min-w-[680px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left data-label pb-3 pr-4 pl-1 w-28">
                    Indicator
                  </th>
                  <th className="text-left data-label pb-3 pr-4">
                    What It Measures
                  </th>
                  <th className="text-left data-label pb-3 pr-4">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-primary" />
                      Bullish Condition
                    </span>
                  </th>
                  <th className="text-left data-label pb-3 pr-4">
                    <span className="flex items-center gap-1">
                      <TrendingDown className="w-3 h-3 text-destructive" />
                      Bearish Condition
                    </span>
                  </th>
                  <th className="text-right data-label pb-3 pr-1 w-16">
                    Weight
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {INDICATORS.map((ind, i) => (
                  <tr
                    key={ind.name}
                    className="hover:bg-secondary/40 transition-colors-fast"
                    data-ocid={`settings.indicator.item.${i + 1}`}
                  >
                    <td className="py-3 pr-4 pl-1 align-top">
                      <div className="font-mono font-semibold text-foreground">
                        {ind.name}
                      </div>
                      <div className="text-muted-foreground text-[10px] mt-0.5 leading-tight break-words">
                        {ind.full}
                      </div>
                    </td>
                    <td className="py-3 pr-4 align-top text-muted-foreground leading-relaxed">
                      {ind.measures}
                    </td>
                    <td className="py-3 pr-4 align-top text-primary/80">
                      {ind.bullish}
                    </td>
                    <td className="py-3 pr-4 align-top text-destructive/80">
                      {ind.bearish}
                    </td>
                    <td className="py-3 pr-1 align-top text-right">
                      <Badge
                        variant="outline"
                        className="font-mono text-[10px] border-border text-muted-foreground"
                      >
                        {ind.weight}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </InfoCard>
      </section>

      <Separator className="bg-border" />

      {/* ── 3. Signal Legend ──────────────────────────────────────────────────── */}
      <section data-ocid="settings.signal_legend.section">
        <SectionHeader
          icon={<Zap className="w-4 h-4 text-muted-foreground" />}
          title="Signal Legend"
          subtitle="What each signal means and how to act on confidence levels"
        />

        {/* Signal cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div
            className="trading-card p-4 glow-buy"
            data-ocid="settings.signal.buy.card"
          >
            <div className="flex items-center justify-between mb-3">
              <SignalBadge signal={Signal.Buy} size="lg" />
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Composite score exceeds the bullish threshold. Indicators agree on
              upward momentum — a potentially favorable entry point. Consider
              initiating or adding to a long position.
            </p>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
              <span className="data-label">Composite Score</span>
              <span className="font-mono text-primary text-sm font-semibold">
                ≥ +0.50
              </span>
            </div>
          </div>

          <div
            className="trading-card p-4"
            data-ocid="settings.signal.hold.card"
          >
            <div className="flex items-center justify-between mb-3">
              <SignalBadge signal={Signal.Hold} size="lg" />
              <Activity className="w-4 h-4 text-accent" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Indicators are mixed or directionally neutral. No strong
              conviction to add or reduce exposure. Existing positions can be
              maintained while waiting for a clearer signal.
            </p>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
              <span className="data-label">Composite Score</span>
              <span className="font-mono text-accent text-sm font-semibold">
                −0.49 to +0.49
              </span>
            </div>
          </div>

          <div
            className="trading-card p-4 glow-sell"
            data-ocid="settings.signal.sell.card"
          >
            <div className="flex items-center justify-between mb-3">
              <SignalBadge signal={Signal.Sell} size="lg" />
              <TrendingDown className="w-4 h-4 text-destructive" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Composite score falls below the bearish threshold. Indicators
              signal downward momentum and elevated risk. Consider reducing
              exposure or closing existing long positions.
            </p>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
              <span className="data-label">Composite Score</span>
              <span className="font-mono text-destructive text-sm font-semibold">
                ≤ −0.50
              </span>
            </div>
          </div>
        </div>

        {/* Confidence levels */}
        <InfoCard>
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-widest mb-4">
            Confidence Levels
          </h3>
          <div className="space-y-0 divide-y divide-border">
            {CONFIDENCE_LEVELS.map((c, i) => (
              <div
                key={c.level}
                className="flex items-start gap-4 py-3"
                data-ocid={`settings.confidence.item.${i + 1}`}
              >
                <span
                  className={`inline-flex items-center rounded-sm font-mono text-xs font-semibold px-2.5 py-1.5 tracking-wider flex-shrink-0 w-20 justify-center ${c.cls}`}
                >
                  {c.level}
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed pt-0.5">
                  {c.description}
                </p>
              </div>
            ))}
          </div>
        </InfoCard>
      </section>

      <Separator className="bg-border" />

      {/* ── 4. App Info ───────────────────────────────────────────────────────── */}
      <section data-ocid="settings.app_info.section">
        <SectionHeader
          icon={<Info className="w-4 h-4 text-muted-foreground" />}
          title="App Information"
          subtitle="Version details and legal disclaimer"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Version table */}
          <InfoCard>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-widest mb-4">
              Version
            </h3>
            <div className="space-y-3">
              {[
                { label: "App", value: "Quantum Trade" },
                { label: "Version", value: "1.0.0" },
                { label: "Platform", value: "Internet Computer" },
                { label: "Build", value: "2026.04" },
                { label: "Signal Engine", value: "v2 — RSI · MACD · EMA · BB" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="data-label">{label}</span>
                  <span className="data-value">{value}</span>
                </div>
              ))}
            </div>
          </InfoCard>

          {/* Disclaimer */}
          <div className="trading-card p-5 border-destructive/25 bg-destructive/5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
              <h3 className="text-xs font-semibold text-destructive uppercase tracking-widest">
                Important Disclaimer
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              Quantum Trade is a{" "}
              <strong className="text-foreground">
                technical analysis tool
              </strong>{" "}
              for informational purposes only. All signals, indicators, and
              analysis are algorithmically generated and{" "}
              <strong className="text-foreground">
                do not constitute financial advice
              </strong>
              .
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              Past performance of any signal or strategy does not guarantee
              future results. Markets are inherently unpredictable and all
              trading carries a risk of loss, including total loss of capital.
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Always conduct your own due diligence and consult a{" "}
              <strong className="text-foreground">
                licensed financial advisor
              </strong>{" "}
              before making any investment decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Branding footer */}
      <p className="text-center text-xs text-muted-foreground py-4">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
            typeof window !== "undefined" ? window.location.hostname : "",
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </p>
    </div>
  );
}
