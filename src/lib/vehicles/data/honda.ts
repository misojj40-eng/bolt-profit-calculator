import type { VehicleBrand } from "../types";

export const honda: VehicleBrand = {
  id: "honda",
  name: "Honda",
  models: [
    {
      id: "city",
      name: "City",
      years: [2025, 2024, 2023, 2022, 2021, 2020],
      trims: [
        { id: "city-1-0", name: "1.0 Turbo", fuelType: "petrol", spec: { fuelConsumption: 5.4 } },
        { id: "city-hev", name: "e:HEV Hybrid", fuelType: "hybrid", spec: { fuelConsumption: 3.9 } },
      ],
    },
    {
      id: "civic",
      name: "Civic",
      years: [2025, 2024, 2023, 2022, 2021],
      trims: [
        { id: "civic-1-5", name: "1.5 Turbo", fuelType: "petrol", spec: { fuelConsumption: 6.0 } },
        { id: "civic-hev", name: "e:HEV Hybrid", fuelType: "hybrid", spec: { fuelConsumption: 4.0 } },
      ],
    },
    {
      id: "accord",
      name: "Accord",
      years: [2025, 2024, 2023],
      trims: [
        { id: "accord-hev", name: "e:HEV Hybrid", fuelType: "hybrid", spec: { fuelConsumption: 4.5 } },
      ],
    },
    {
      id: "hrv",
      name: "HR-V",
      years: [2025, 2024, 2023, 2022],
      trims: [
        { id: "hrv-hev", name: "e:HEV Hybrid", fuelType: "hybrid", spec: { fuelConsumption: 4.5 } },
      ],
    },
  ],
};
