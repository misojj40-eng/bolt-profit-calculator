import type { VehicleBrand } from "../types";

export const gpx: VehicleBrand = {
  id: "gpx",
  name: "GPX",
  models: [
    {
      id: "demon",
      name: "Demon 150 GR",
      type: "motorbike",
      years: [2026, 2025, 2024, 2023, 2022, 2021],
      trims: [{ id: "demon150", name: "150 GR", fuelType: "petrol", spec: { fuelConsumption: 2.5 } }],
    },
    {
      id: "drone",
      name: "Drone 150",
      type: "motorbike",
      years: [2024, 2023, 2022],
      trims: [{ id: "drone150", name: "150", fuelType: "petrol", spec: { fuelConsumption: 2.3 } }],
    },
    {
      id: "rock",
      name: "Rock 110",
      type: "motorbike",
      years: [2026, 2025, 2024, 2023],
      trims: [{ id: "rock110", name: "110", fuelType: "petrol", spec: { fuelConsumption: 1.7 } }],
    },
  ],
};
