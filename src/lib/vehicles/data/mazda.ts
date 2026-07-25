import type { VehicleBrand } from "../types";

export const mazda: VehicleBrand = {
  id: "mazda",
  name: "Mazda",
  models: [
    {
      id: "mazda2",
      name: "Mazda2",
      years: [2026, 2025, 2024, 2023, 2022, 2021, 2020],
      trims: [
        { id: "m2-1-3", name: "1.3 Skyactiv", fuelType: "petrol", spec: { fuelConsumption: 5.6 } },
        { id: "m2-1-5d", name: "1.5 XDL Diesel", fuelType: "diesel", spec: { fuelConsumption: 4.4 } },
      ],
    },
    {
      id: "mazda3",
      name: "Mazda3",
      years: [2026, 2025, 2024, 2023, 2022, 2021],
      trims: [
        { id: "m3-2-0", name: "2.0 Skyactiv-G", fuelType: "petrol", spec: { fuelConsumption: 6.5 } },
      ],
    },
    {
      id: "cx-30",
      name: "CX-30",
      years: [2026, 2025, 2024, 2023, 2022],
      trims: [
        { id: "cx30-2-0", name: "2.0 Skyactiv-G", fuelType: "petrol", spec: { fuelConsumption: 6.7 } },
      ],
    },
  ],
};
