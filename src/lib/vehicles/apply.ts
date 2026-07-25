import type { CostSettings } from "../types";
import type { VehicleTrim } from "./types";

/**
 * Map a selected trim's factory spec onto the cost settings. Only energy-related
 * fields are touched; wear, insurance, tax etc. are left untouched. Missing spec
 * values fall back to the current setting so nothing is wiped out.
 */
export function specToSettingsPatch(trim: VehicleTrim, current: CostSettings): Partial<CostSettings> {
  const s = trim.spec;
  return {
    fuelType: trim.fuelType,
    fuelConsumption: s.fuelConsumption ?? current.fuelConsumption,
    energyConsumption: s.energyConsumption ?? current.energyConsumption,
    batteryKwh: s.batteryKwh ?? current.batteryKwh,
    evShare: s.evShare ?? current.evShare,
  };
}
