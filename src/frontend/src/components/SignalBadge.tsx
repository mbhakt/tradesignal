import { cn } from "@/lib/utils";
import { type Confidence, Signal } from "../types";

interface SignalBadgeProps {
  signal: Signal;
  confidence?: Confidence;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const signalConfig = {
  [Signal.Buy]: {
    label: "BUY",
    cls: "signal-buy",
    dot: "bg-primary",
  },
  [Signal.Hold]: {
    label: "HOLD",
    cls: "signal-hold",
    dot: "bg-accent",
  },
  [Signal.Sell]: {
    label: "SELL",
    cls: "signal-sell",
    dot: "bg-destructive",
  },
};

const sizeConfig = {
  sm: "text-[10px] px-1.5 py-0.5 gap-1",
  md: "text-xs px-2 py-1 gap-1.5",
  lg: "text-sm px-3 py-1.5 gap-2",
};

export function SignalBadge({
  signal,
  confidence,
  size = "md",
  className,
}: SignalBadgeProps) {
  const cfg = signalConfig[signal];
  const sizeCls = sizeConfig[size];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm font-mono font-semibold tracking-wider",
        cfg.cls,
        sizeCls,
        className,
      )}
      aria-label={`Signal: ${cfg.label}${confidence ? ` (${confidence})` : ""}`}
    >
      <span
        className={cn(
          "rounded-full flex-shrink-0",
          cfg.dot,
          size === "sm" ? "w-1 h-1" : "w-1.5 h-1.5",
        )}
      />
      {cfg.label}
      {confidence && (
        <span className="opacity-70 font-normal">
          · {confidence.toUpperCase()}
        </span>
      )}
    </span>
  );
}

// Compact dot-only variant for table cells
export function SignalDot({ signal }: { signal: Signal }) {
  const cfg = signalConfig[signal];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-mono font-semibold tracking-wider",
        signal === Signal.Buy && "text-primary",
        signal === Signal.Hold && "text-accent",
        signal === Signal.Sell && "text-destructive",
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", cfg.dot)} />
      {cfg.label}
    </span>
  );
}
