import type { ChargingLocation, FuelType } from "./vehicles/types";

export type ShiftInputs = {
  /** Gross earnings received from Bolt for the shift (before any costs). */
  earnings: number;
  /** Distance driven during the shift, in kilometres. */
  distanceKm: number;
  /** Hours worked during the shift. */
  hours: number;
};

export type CostSettings = {
  // --- Energy / fuel model ---
  /** How the vehicle is powered — drives which energy cost formula is used. */
  fuelType: FuelType;
  /** Liquid-fuel economy, litres per 100 km (petrol/diesel/hybrid, and PHEV engine). */
  fuelConsumption: number;
  /** Liquid-fuel price, currency per litre. */
  fuelPricePerLitre: number;
  /** Electric energy use, kWh per 100 km (EV, and PHEV electric mode). */
  energyConsumption: number;
  /** Usable battery capacity in kWh (informational for EV/PHEV). */
  batteryKwh: number;
  /** PHEV only: share of distance driven on electricity (0..1). */
  evShare: number;
  /** Where the driver mostly charges — selects which tariff applies. */
  chargingLocation: ChargingLocation;
  /** Home electricity tariff, currency per kWh. */
  electricityHomePrice: number;
  /** Public/DC charging tariff, currency per kWh. */
  electricityPublicPrice: number;
  /** Charging efficiency %, accounts for energy lost while charging (e.g. 90). */
  chargingEfficiencyPercent: number;

  // --- Per-kilometre wear costs ---
  depreciationPerKm: number;
  maintenancePerKm: number;
  tyresSetCost: number;
  tyresLifespanKm: number;

  // --- Recurring monthly costs ---
  insuranceMonthly: number;
  phoneMonthly: number;
  otherMonthly: number;

  // --- Tax ---
  taxRatePercent: number;

  // --- Projection assumptions ---
  workingDaysPerMonth: number;
};

export type CostLine = {
  key: string;
  label: string;
  amount: number;
  type: "variable" | "fixed" | "tax";
  color: string;
};

export type ProfitResult = {
  earnings: number;
  totalCosts: number;
  netProfit: number;
  margin: number;
  profitPerHour: number;
  profitPerKm: number;
  costPerKm: number;
  breakEvenKm: number;
  /** Label for the energy line, e.g. "Fuel", "Charging", "Fuel + charging". */
  energyLabel: string;
  lines: CostLine[];
  monthly: {
    earnings: number;
    costs: number;
    net: number;
  };
};

export type { FuelType, ChargingLocation } from "./vehicles/types";
