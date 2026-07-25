import type { VehicleBrand } from "../types";

export const mitsubishi: VehicleBrand = {
  id: "mitsubishi",
  name: "Mitsubishi",
  models: [
    {
      id: "attrage",
      name: "Attrage",
      years: [2026, 2025, 2024, 2023, 2022, 2021, 2020],
      trims: [
        { id: "attrage-1-2", name: "1.2 CVT", fuelType: "petrol", spec: { fuelConsumption: 5.0 } },
      ],
    },
    {
      id: "mirage",
      name: "Mirage",
      years: [2026, 2025, 2024, 2023, 2022, 2021, 2020],
      trims: [
        { id: "mirage-1-2", name: "1.2 CVT", fuelType: "petrol", spec: { fuelConsumption: 4.9 } },
      ],
    },
    {
      id: "triton",
      name: "Triton",
      years: [2026, 2025, 2024, 2023, 2022],
      trims: [
        { id: "triton-2-4", name: "2.4 Diesel", fuelType: "diesel", spec: { fuelConsumption: 7.4 } },
      ],
    },
    {
      id: "outlander-phev",
      name: "Outlander PHEV",
      years: [2026, 2025, 2024, 2023],
      trims: [
        {
          id: "outlander-phev",
          name: "2.4 PHEV",
          fuelType: "phev",
          spec: { fuelConsumption: 7.5, energyConsumption: 20, batteryKwh: 20, evShare: 0.5 },
        },
      ],
    },
  ],
};
