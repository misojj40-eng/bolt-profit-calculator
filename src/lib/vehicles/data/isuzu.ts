import type { VehicleBrand } from "../types";

export const isuzu: VehicleBrand = {
  id: "isuzu",
  name: "Isuzu",
  models: [
    {
      id: "dmax",
      name: "D-Max",
      years: [2026, 2025, 2024, 2023, 2022, 2021, 2020],
      trims: [
        { id: "dmax-1-9", name: "1.9 Ddi Diesel", fuelType: "diesel", spec: { fuelConsumption: 6.8 } },
        { id: "dmax-3-0", name: "3.0 Ddi Diesel", fuelType: "diesel", spec: { fuelConsumption: 8.0 } },
      ],
    },
    {
      id: "mux",
      name: "MU-X",
      years: [2026, 2025, 2024, 2023, 2022],
      trims: [
        { id: "mux-1-9", name: "1.9 Diesel", fuelType: "diesel", spec: { fuelConsumption: 7.2 } },
        { id: "mux-3-0", name: "3.0 Diesel", fuelType: "diesel", spec: { fuelConsumption: 8.4 } },
      ],
    },
  ],
};
