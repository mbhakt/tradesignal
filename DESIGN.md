# Design Brief

**Category:** Productivity (Stock Trading Dashboard) | **Theme:** Dark | **Tone:** Professional, data-dense, signal-driven

## Direction
Dark trading dashboard inspired by Bloomberg/TradingView. Minimize decoration, maximize information clarity. Semantic signal colors guide trading decisions: green=BUY, amber=HOLD, red=SELL. Tight layout, minimal curves, subtle elevation via shadows.

## Palette
| Role | Value | Purpose |
|------|-------|---------|
| Background | `oklch(0.12 0 0)` | Deep charcoal, minimal distraction |
| Card | `oklch(0.16 0.01 280)` | Subtle blue tint for data containers |
| Foreground | `oklch(0.92 0 0)` | High contrast text |
| Primary (BUY) | `oklch(0.65 0.2 142)` | Vibrant green for buy signals |
| Accent (HOLD) | `oklch(0.65 0.18 82)` | Amber/yellow for hold signals |
| Destructive (SELL) | `oklch(0.58 0.2 20)` | Red for sell signals |
| Muted | `oklch(0.25 0 0)` | Secondary text, inactive state |
| Border | `oklch(0.24 0.01 280)` | Subtle grid lines, card edges |

## Typography
**Display:** General Sans (600–700 weight for headers, data labels) | **Body:** General Sans (400 weight, clean & readable) | **Mono:** JetBrains Mono (real-time prices, technical values)

Scale: `0.875rem` (small label) → `1rem` (body) → `1.125rem` (card title) → `1.5rem` (price header)

## Shape & Elevation
**Border radius:** `0.375rem` (tight, professional) | **Shadows:** xs (1px subtle), card (4px depth), elevated (8px) | **Spacing:** 4px grid baseline (compact, dense)

## Structural Zones
| Zone | Background | Border | Purpose |
|------|------------|--------|---------|
| Sidebar | `--sidebar` (charcoal) | `--sidebar-border` | Persistent nav, stock list |
| Header | `--card` (subtle blue) | `--border` (bottom) | Logo, dark mode toggle |
| Content | `--background` (black) | None | Watchlist cards, portfolio grid |
| Card Containers | `--card` (blue tint) | `--border` (1px) | Data containers, chart area |
| Footer/Status | `--muted/40` | `--border` (top) | Order status, notifications |

## Components
**Signal Badges:** `.signal-buy` (green), `.signal-hold` (amber), `.signal-sell` (red) with border + background opacity | **Price Display:** `.price-highlight` (semibold, tracking-tight, high contrast) | **Data Labels:** `.data-label` (uppercase, letter-spacing, muted color)

## Motion
**Base transition:** 0.3s ease-out (smooth, subtle) | **Price updates:** Gentle fade, no bounce | **Signal changes:** Border pulse (CSS animation on badge state change)

## Signature Detail
Real-time price ticker with monospace numerals + signal confidence badge. Watchlist cards show last 5-min sparkline trend (chart-1 color for momentum visual).

## Constraints
✓ Dark mode only (professional fintech standard) | ✓ OKLCH system, no hex/rgb | ✓ Data density prioritized over whitespace | ✓ Semantic signal colors non-negotiable | ✓ No gradients (premium aesthetic)

## Usage Rules
- `.signal-buy/hold/sell` applied to badge containers
- Chart colors map to `--chart-1` (green), `--chart-2` (amber), `--chart-3` (red)
- Sidebar: sticky positioning, persistent across viewport
- Responsive: sidebar collapses to icons on `md:` breakpoint
