import type { VehicleBrand } from "../types";

export const gwm: VehicleBrand = {
  id: "gwm",
  name: "GWM (Ora / Haval)",
  models: [
    {
      id: "ora-good-cat",
      name: "Ora Good Cat",
      years: [2026, 2025, 2024, 2023, 2022],
      trims: [
        { id: "goodcat-400", name: "400 (47.8 kWh)", fuelType: "ev", spec: { energyConsumption: 14.5, batteryKwh: 47.8 } },
        { id: "goodcat-500", name: "500 Ultra (63.1 kWh)", fuelType: "ev", spec: { energyConsumption: 15.5, batteryKwh: 63.1 } },
      ],
    },
    {
      id: "haval-h6",
      name: "Haval H6",
      years: [2026, 2025, 2024, 2023, 2022],
      trims: [
        { id: "h6-hev", name: "1.5T Hybrid", fuelType: "hybrid", spec: { fuelConsumption: 5.6 } },
        { id: "h6-phev", name: "1.5T PHEV", fuelType: "phev", spec: { fuelConsumption: 6.8, energyConsumption: 19, batteryKwh: 34, evShare: 0.55 } },
      ],
    },
  ],
};
