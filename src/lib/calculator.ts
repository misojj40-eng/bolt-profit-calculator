import type { CostSettings, ProfitResult, ShiftInputs, CostLine } from "./types";
import { usesElectricity } from "./vehicles/types";

export const DEFAULT_INPUTS: ShiftInputs = {
  earnings: 1800,
  distanceKm: 220,
  hours: 10,
};

/**
 * Sensible starting assumptions for a typical Bolt driver in Thailand (THB).
 * Every value is user-editable in the UI, and the energy figures are normally
 * auto-filled from the selected vehicle.
 */
export const DEFAULT_SETTINGS: CostSettings = {
  fuelType: "petrol",
  fuelConsumption: 6, // L / 100km
  fuelPricePerLitre: 38, // THB / litre
  energyConsumption: 16, // kWh / 100km
  batteryKwh: 60,
  evShare: 0.5,
  chargingLocation: "home",
  electricityHomePrice: 4.5, // THB / kWh
  electricityPublicPrice: 7.5, // THB / kWh
  chargingEfficiencyPercent: 90,

  depreciationPerKm: 1.5,
  maintenancePerKm: 0.8,
  tyresSetCost: 8000,
  tyresLifespanKm: 40000,

  insuranceMonthly: 1800,
  phoneMonthly: 400,
  otherMonthly: 600,

  taxRatePercent: 5,
  workingDaysPerMonth: 24,
};

export const COST_COLORS: Record<string, string> = {
  fuel: "hsl(158 84% 42%)",
  depreciation: "hsl(199 89% 48%)",
  maintenance: "hsl(38 92% 50%)",
  tyres: "hsl(280 65% 60%)",
  insurance: "hsl(0 72% 55%)",
  phone: "hsl(220 70% 60%)",
  other: "hsl(215 20% 55%)",
  tax: "hsl(340 75% 55%)",
};

function safe(n: number): number {
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

/** Electricity tariff for the currently selected charging location. */
function electricityPrice(s: CostSettings): number {
  return s.chargingLocation === "public"
    ? safe(s.electricityPublicPrice)
    : safe(s.electricityHomePrice);
}

/**
 * Effective energy cost per kilometre for the vehicle's power type.
 * Returns both the per-km cost and a human label for the cost line.
 */
export function energyCostPerKm(s: CostSettings): { perKm: number; label: string } {
  const eff = s.chargingEfficiencyPercent > 0 ? s.chargingEfficiencyPercent / 100 : 1;
  const fuelPerKm = (safe(s.fuelConsumption) / 100) * safe(s.fuelPricePerLitre);
  const elecPerKm = (safe(s.energyConsumption) / 100) * electricityPrice(s) / eff;

  switch (s.fuelType) {
    case "ev":
      return { perKm: elecPerKm, label: "Charging" };
    case "phev": {
      const share = clamp01(s.evShare);
      return { perKm: elecPerKm * share + fuelPerKm * (1 - share), label: "Fuel + charging" };
    }
    default:
      return { perKm: fuelPerKm, label: "Fuel" };
  }
}

/**
 * Pure calculation function — takes shift inputs + cost settings and returns a
 * fully-resolved profit breakdown. No side effects.
 */
export function calculateProfit(
  inputs: ShiftInputs,
  settings: CostSettings
): ProfitResult {
  const earnings = safe(inputs.earnings);
  const distanceKm = safe(inputs.distanceKm);
  const hours = safe(inputs.hours);

  // --- Energy (fuel and/or electricity) ---
  const energy = energyCostPerKm(settings);
  const energyCost = distanceKm * energy.perKm;

  // --- Other variable (per-distance) costs ---
  const depreciationCost = distanceKm * safe(settings.depreciationPerKm);
  const maintenanceCost = distanceKm * safe(settings.maintenancePerKm);
  const tyresPerKm =
    settings.tyresLifespanKm > 0 ? settings.tyresSetCost / settings.tyresLifespanKm : 0;
  const tyresCost = distanceKm * tyresPerKm;

  // --- Fixed (recurring) costs allocated to this single shift ---
  const days = settings.workingDaysPerMonth > 0 ? settings.workingDaysPerMonth : 1;
  const insuranceCost = safe(settings.insuranceMonthly) / days;
  const phoneCost = safe(settings.phoneMonthly) / days;
  const otherCost = safe(settings.otherMonthly) / days;

  // --- Tax set-aside ---
  const taxCost = earnings * (safe(settings.taxRatePercent) / 100);

  const lines: CostLine[] = [
    { key: "fuel", label: energy.label, amount: energyCost, type: "variable", color: COST_COLORS.fuel },
    { key: "depreciation", label: "Depreciation", amount: depreciationCost, type: "variable", color: COST_COLORS.depreciation },
    { key: "maintenance", label: "Maintenance", amount: maintenanceCost, type: "variable", color: COST_COLORS.maintenance },
    { key: "tyres", label: "Tyres", amount: tyresCost, type: "variable", color: COST_COLORS.tyres },
    { key: "insurance", label: "Insurance", amount: insuranceCost, type: "fixed", color: COST_COLORS.insurance },
    { key: "phone", label: "Phone", amount: phoneCost, type: "fixed", color: COST_COLORS.phone },
    { key: "other", label: "Other", amount: otherCost, type: "fixed", color: COST_COLORS.other },
    { key: "tax", label: "Tax set-aside", amount: taxCost, type: "tax", color: COST_COLORS.tax },
  ];

  const totalCosts = lines.reduce((sum, l) => sum + l.amount, 0);
  const netProfit = earnings - totalCosts;
  const margin = earnings > 0 ? netProfit / earnings : 0;

  const profitPerHour = hours > 0 ? netProfit / hours : 0;
  const profitPerKm = distanceKm > 0 ? netProfit / distanceKm : 0;
  const costPerKm = distanceKm > 0 ? totalCosts / distanceKm : 0;

  const variablePerKm =
    safe(settings.depreciationPerKm) +
    safe(settings.maintenancePerKm) +
    tyresPerKm +
    energy.perKm;
  const fixedForShift = insuranceCost + phoneCost + otherCost + taxCost;
  const breakEvenKm =
    variablePerKm > 0 ? Math.max(0, (earnings - fixedForShift) / variablePerKm) : 0;

  return {
    earnings,
    totalCosts,
    netProfit,
    margin,
    profitPerHour,
    profitPerKm,
    costPerKm,
    breakEvenKm,
    energyLabel: energy.label,
    lines: lines.sort((a, b) => b.amount - a.amount),
    monthly: {
      earnings: earnings * days,
      costs: totalCosts * days,
      net: netProfit * days,
    },
  };
}

/** Convenience: is the current vehicle electricity-powered (EV or PHEV)? */
export function isElectric(settings: CostSettings): boolean {
  return usesElectricity(settings.fuelType);
}

/** Translation key for the energy cost line, based on power type. */
export function energyLabelKey(fuelType: CostSettings["fuelType"]): string {
  if (fuelType === "ev") return "line.charging";
  if (fuelType === "phev") return "line.fuelCharging";
  return "line.fuel";
}
