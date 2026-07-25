# Bolt Driver Profit Calculator

Know your **true net profit** — not just your Bolt earnings. This app subtracts the
real cost of driving (energy, depreciation, maintenance, tyres, insurance, phone, other
recurring bills and a tax set-aside) so you can see what you actually keep, per hour and
per kilometre, plus a monthly projection.

Built as a clean, premium **fintech dashboard**: mobile-first, responsive, dark-mode by
default, smooth animations, bilingual (Thai / English), and PWA-ready.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmisojj40-eng%2Fbolt-profit-calculator)

> One-click deploy of this repo to Vercel. Full step-by-step instructions are in [`DEPLOY.md`](./DEPLOY.md).

## Tech stack

- **Next.js 14** (App Router) + **React 18**
- **TypeScript** (strict)
- **Tailwind CSS** with CSS-variable theming
- **shadcn/ui** primitives (Radix under the hood)
- **Recharts** for expense + projection charts
- **Framer Motion** for animations
- **next-themes** for dark/light mode
- **Geist** + **Noto Sans Thai** via `next/font/local`

## Features

### Core
- **True net profit** hero with animated count-up and margin badge
- KPIs: profit / hour, profit / km, cost / km, and break-even distance
- **Expense analytics** — donut split and ranked bar of every cost line
- **Monthly projection** from your working-days assumption
- Fully editable cost model, multi-currency (defaults to **THB ฿**)
- All data persists locally on your device (localStorage)

### Vehicle model database (`src/lib/vehicles/`)
- Onboarding picker: **brand → model → year → engine/fuel → trim**
- Auto-loads factory **fuel economy (L/100 km)** or **energy use (kWh/100 km)**
- Supports **Petrol, Diesel, Hybrid, PHEV, and EV**
- Override any figure with your real-world consumption (with one-tap reset to factory)
- **EV specifics**: battery capacity, energy use, charging efficiency, and **home vs public**
  charging tariffs. **PHEV**: electric-drive share slider blends fuel + charging cost.
- Note shown: *"Estimated consumption based on manufacturer specifications. Adjust to your
  real-world driving for the most accurate profit calculation."*
- One file per brand under `src/lib/vehicles/data/` — add a car by editing a brand file (or
  drop in a new one and register it in `data/index.ts`). Query logic never changes.

### Internationalization (`src/lib/i18n/`)
- Full **Thai + English** UI — labels, buttons, forms, tooltips, charts, notes
- Language switcher in the header; **defaults to the browser locale**
- **Instant switching** with no page reload; preference stored locally
- Locale-aware number and currency formatting (Thai uses `th-TH`)
- Scalable: add a language by adding one dictionary in `translations.ts`

### Mobile-first & PWA
- Mobile-first responsive layouts, touch-friendly targets, no horizontal scrolling
- **Sticky bottom navigation** (mobile) with scroll-spy section highlighting
- **Safe-area insets** for iOS notch/home-indicator (`viewport-fit=cover`)
- Responsive charts (Recharts `ResponsiveContainer`)
- **PWA-ready**: web manifest, theme color, standalone display, app icon
- Respects `prefers-reduced-motion`

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build      # production build
npm run start      # run the production build
npm run typecheck  # tsc --noEmit
npm run lint       # next lint
```

## How the numbers work

All logic lives in `src/lib/calculator.ts` as one pure function, `calculateProfit`:

- **Energy** — petrol/diesel/hybrid: `(distance ÷ 100) × L/100km × price per litre`.
  EV: `(distance ÷ 100) × kWh/100km ÷ charging-efficiency × electricity tariff`.
  PHEV blends both by the electric-drive share.
- **Depreciation / maintenance** = distance × per-km rate
- **Tyres** = distance × (tyre-set cost ÷ tyre lifespan km)
- **Insurance / phone / other** = monthly cost ÷ working days per month
- **Tax** = gross earnings × tax %
- **Break-even km** = the distance at which variable costs consume your earnings

## Project structure

```
src/
  app/            # App Router (layout, page, globals, local fonts)
  components/
    ui/           # shadcn/ui primitives
    dashboard/    # feature components (hero, KPIs, charts, forms, vehicle, bottom nav)
    theme-*.tsx   # dark-mode provider + toggle
    language-switcher.tsx
  hooks/          # useLocalStorage (SSR-safe persistence)
  lib/
    vehicles/     # scalable vehicle database + query API
    i18n/         # translations + provider/hook + formatters
    calculator.ts # pure calculation engine
    currency.ts   # currency metadata
    types.ts
public/           # manifest.webmanifest, icon.svg
```

## Notes

Figures are estimates. Vehicle consumption values approximate manufacturer specifications;
adjust them to your real driving and local market for the most accurate picture. This tool is
for personal planning and is not tax advice.
