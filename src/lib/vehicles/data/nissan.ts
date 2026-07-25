import type { VehicleBrand } from "../types";

export const nissan: VehicleBrand = {
  id: "nissan",
  name: "Nissan",
  models: [
    {
      id: "almera",
      name: "Almera",
      years: [2026, 2025, 2024, 2023, 2022, 2021, 2020],
      trims: [
        { id: "almera-1-0", name: "1.0 Turbo", fuelType: "petrol", spec: { fuelConsumption: 5.0 } },
      ],
    },
    {
      id: "kicks",
      name: "Kicks e-POWER",
      years: [2026, 2025, 2024, 2023, 2022, 2021],
      trims: [
        { id: "kicks-epower", name: "e-POWER Hybrid", fuelType: "hybrid", spec: { fuelConsumption: 4.0 } },
      ],
    },
    {
      id: "leaf",
      name: "Leaf",
      years: [2026, 2025, 2024, 2023, 2022],
      trims: [
        { id: "leaf-40", name: "40 kWh", fuelType: "ev", spec: { energyConsumption: 16.5, batteryKwh: 40 } },
      ],
    },
  ],
};
