"use client";

import * as React from "react";
import { Clock, Route, Gauge, Flag, Zap } from "lucide-react";
import type { CostSettings, ShiftInputs } from "@/lib/types";
import type { VehicleSelection, VehicleType } from "@/lib/vehicles";
import type { TripEntry } from "@/lib/trips";
import { makeTripId, todayISO } from "@/lib/trips";
import { DEFAULT_INPUTS, DEFAULT_SETTINGS, calculateProfit, defaultSettingsFor } from "@/lib/calculator";
import { CURRENCIES, DEFAULT_CURRENCY } from "@/lib/currency";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useI18n } from "@/lib/i18n";

import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

import { ShiftInputsCard } from "./shift-inputs-card";
import { VehicleCard } from "./vehicle-card";
import { CostSettingsCard } from "./cost-settings-card";
import { ProfitHero } from "./profit-hero";
import { StatCard } from "./stat-card";
import { AnimatedNumber } from "./animated-number";
import { ExpenseBreakdown } from "./expense-breakdown";
import { MonthlyProjection } from "./monthly-projection";
import { TrackerCard } from "./tracker-card";
import { BottomNav } from "./bottom-nav";

const STORAGE_KEYS = {
  inputs: "bdpc.inputs.v1",
  settings: "bdpc.settings.v2",
  currency: "bdpc.currency.v1",
  vehicle: "bdpc.vehicle.v1",
  trips: "bdpc.trips.v1",
  vehicleType: "bdpc.vehicleType.v1",
} as const;

export function Dashboard() {
  const { t, money, num } = useI18n();
  const [inputs, setInputs] = useLocalStorage<ShiftInputs>(STORAGE_KEYS.inputs, DEFAULT_INPUTS);
  const [settings, setSettings] = useLocalStorage<CostSettings>(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
  const [currency, setCurrency] = useLocalStorage<string>(STORAGE_KEYS.currency, DEFAULT_CURRENCY);
  const [vehicle, setVehicle] = useLocalStorage<VehicleSelection | null>(STORAGE_KEYS.vehicle, null);
  const [trips, setTrips] = useLocalStorage<TripEntry[]>(STORAGE_KEYS.trips, []);
  const [logDate, setLogDate] = React.useState<string>(() => todayISO());
  const [vehicleType, setVehicleType] = useLocalStorage<VehicleType>(STORAGE_KEYS.vehicleType, "car");

  const result = React.useMemo(() => calculateProfit(inputs, settings), [inputs, settings]);
  const symbol = (CURRENCIES[currency] ?? CURRENCIES[DEFAULT_CURRENCY]).symbol;

  const patchInputs = (patch: Partial<ShiftInputs>) => setInputs((p) => ({ ...p, ...patch }));
  const patchSettings = (patch: Partial<CostSettings>) => setSettings((p) => ({ ...p, ...patch }));

  const changeVehicleType = (vt: VehicleType) => {
    setVehicleType(vt);
    setVehicle(null);
    const d = defaultSettingsFor(vt);
    // Reset the vehicle-class-specific figures; keep the driver's own pricing, tax and schedule.
    patchSettings({
      fuelType: d.fuelType,
      fuelConsumption: d.fuelConsumption,
      energyConsumption: d.energyConsumption,
      batteryKwh: d.batteryKwh,
      depreciationPerKm: d.depreciationPerKm,
      maintenancePerKm: d.maintenancePerKm,
      tyresSetCost: d.tyresSetCost,
      tyresLifespanKm: d.tyresLifespanKm,
      insuranceMonthly: d.insuranceMonthly,
    });
  };

  const logDrive = () => {
    const entry: TripEntry = {
      id: makeTripId(),
      date: logDate || todayISO(),
      earnings: result.earnings,
      distanceKm: inputs.distanceKm,
      hours: inputs.hours,
      netProfit: result.netProfit,
      totalCosts: result.totalCosts,
      fuelType: settings.fuelType,
      currency,
    };
    setTrips((prev) => [entry, ...prev.filter((t) => t.date !== entry.date)]);
  };
  const deleteTrip = (id: string) => setTrips((prev) => prev.filter((t) => t.id !== id));
  const clearTrips = () => setTrips([]);

  return (
    <div className="min-h-screen bottom-nav-space md:pb-0">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl pt-safe">
        <div className="container flex h-16 items-center justify-between gap-2 pl-safe pr-safe">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Zap className="h-5 w-5" />
            </span>
            <div className="min-w-0 leading-tight">
              <div className="truncate text-sm font-bold sm:text-base">{t("app.name")}</div>
              <div className="hidden truncate text-xs text-muted-foreground sm:block">{t("app.tagline")}</div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <LanguageSwitcher />
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-[84px]" aria-label="Currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(CURRENCIES).map((code) => (
                  <SelectItem key={code} value={code}>
                    {CURRENCIES[code].symbol} {code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container space-y-6 py-5 pl-safe pr-safe sm:py-8">
        <section id="overview" className="scroll-mt-20 space-y-6">
          <ProfitHero result={result} currency={currency} />

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatCard label={t("kpi.profitPerHour")} icon={Clock} tone="primary" delay={0.05}>
              <AnimatedNumber value={result.profitPerHour} format={(n) => money(n, currency, 0)} />
            </StatCard>
            <StatCard label={t("kpi.profitPerKm")} icon={Route} tone="info" delay={0.1}>
              <AnimatedNumber value={result.profitPerKm} format={(n) => money(n, currency, 1)} />
            </StatCard>
            <StatCard label={t("kpi.costPerKm")} icon={Gauge} tone="danger" delay={0.15} sub={t("kpi.costPerKm.sub")}>
              <AnimatedNumber value={result.costPerKm} format={(n) => money(n, currency, 1)} />
            </StatCard>
            <StatCard label={t("kpi.breakEven")} icon={Flag} tone="neutral" delay={0.2} sub={t("kpi.breakEven.sub")}>
              <AnimatedNumber value={result.breakEvenKm} format={(n) => `${num(n, 0)} ${t("unit.km")}`} />
            </StatCard>
          </div>
        </section>

        <section id="vehicle" className="scroll-mt-20 grid gap-6 lg:grid-cols-2">
          <VehicleCard
            settings={settings}
            onChangeSettings={patchSettings}
            selection={vehicle}
            onChangeSelection={setVehicle}
            vehicleType={vehicleType}
            onChangeVehicleType={changeVehicleType}
            symbol={symbol}
          />
          <div id="shift" className="scroll-mt-20">
            <ShiftInputsCard value={inputs} onChange={patchInputs} symbol={symbol} />
          </div>
        </section>

        <section id="tracker" className="scroll-mt-20">
          <TrackerCard
            trips={trips}
            currency={currency}
            logDate={logDate}
            onChangeDate={setLogDate}
            onLog={logDrive}
            onDelete={deleteTrip}
            onClear={clearTrips}
          />
        </section>

        <section id="analytics" className="scroll-mt-20 grid gap-6 lg:grid-cols-2">
          <ExpenseBreakdown result={result} currency={currency} fuelType={settings.fuelType} />
          <MonthlyProjection result={result} currency={currency} workingDays={settings.workingDaysPerMonth} />
        </section>

        <section id="costs" className="scroll-mt-20">
          <CostSettingsCard value={settings} onChange={patchSettings} onReset={() => setSettings(defaultSettingsFor(vehicleType))} symbol={symbol} />
        </section>

        <footer className="pt-2 text-center text-xs text-muted-foreground">{t("footer.note")}</footer>
      </main>

      <BottomNav />
    </div>
  );
}
