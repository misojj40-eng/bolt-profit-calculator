export type FuelType = "petrol" | "diesel" | "hybrid" | "phev" | "ev";

export type ChargingLocation = "home" | "public";

export const FUEL_LABELS: Record<FuelType, string> = {
  petrol: "Petrol",
  diesel: "Diesel",
  hybrid: "Hybrid",
  phev: "Plug-in hybrid",
  ev: "Electric",
};

/** True for fuel types that consume liquid fuel (need L/100km + fuel price). */
export const usesLiquidFuel = (t: FuelType) => t !== "ev";
/** True for fuel types that consume electricity (need kWh/100km + tariff). */
export const usesElectricity = (t: FuelType) => t === "ev" || t === "phev";

export type VehicleSpec = {
  /** Combined fuel economy in litres / 100 km (petrol, diesel, hybrid, PHEV engine). */
  fuelConsumption?: number;
  /** Energy use in kWh / 100 km (EV, and PHEV in electric mode). */
  energyConsumption?: number;
  /** Usable battery capacity in kWh (EV, PHEV). */
  batteryKwh?: number;
  /** PHEV only: share of distance typically driven on electricity (0..1). */
  evShare?: number;
};

export type VehicleTrim = {
  id: string;
  name: string;
  fuelType: FuelType;
  spec: VehicleSpec;
};

export type VehicleModel = {
  id: string;
  name: string;
  /** Years the spec below is a reasonable estimate for (newest first). */
  years: number[];
  trims: VehicleTrim[];
};

export type VehicleBrand = {
  id: string;
  name: string;
  models: VehicleModel[];
};

/** A concrete user selection resolved to a trim. */
export type VehicleSelection = {
  brandId: string;
  modelId: string;
  year: number;
  fuelType: FuelType;
  trimId: string;
};
