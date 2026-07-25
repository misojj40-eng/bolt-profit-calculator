import type { VehicleBrand } from "../types";

export const toyota: VehicleBrand = {
  id: "toyota",
  name: "Toyota",
  models: [
    {
      id: "vios",
      name: "Vios / Yaris Ativ",
      years: [2026, 2025, 2024, 2023, 2022, 2021, 2020],
      trims: [
        { id: "vios-1-2", name: "1.2 CVT", fuelType: "petrol", spec: { fuelConsumption: 5.3 } },
      ],
    },
    {
      id: "yaris",
      name: "Yaris",
      years: [2026, 2025, 2024, 2023, 2022, 2021],
      trims: [
        { id: "yaris-1-2", name: "1.2 CVT", fuelType: "petrol", spec: { fuelConsumption: 5.5 } },
      ],
    },
    {
      id: "corolla-altis",
      name: "Corolla Altis",
      years: [2026, 2025, 2024, 2023, 2022, 2021, 2020],
      trims: [
        { id: "altis-1-8", name: "1.8 CVT", fuelType: "petrol", spec: { fuelConsumption: 6.0 } },
        { id: "altis-hev", name: "1.8 Hybrid", fuelType: "hybrid", spec: { fuelConsumption: 4.3 } },
      ],
    },
    {
      id: "corolla-cross",
      name: "Corolla Cross",
      years: [2026, 2025, 2024, 2023, 2022],
      trims: [
        { id: "cc-1-8", name: "1.8 CVT", fuelType: "petrol", spec: { fuelConsumption: 6.4 } },
        { id: "cc-hev", name: "1.8 Hybrid", fuelType: "hybrid", spec: { fuelConsumption: 4.3 } },
      ],
    },
    {
      id: "camry",
      name: "Camry",
      years: [2026, 2025, 2024, 2023, 2022],
      trims: [
        { id: "camry-2-5", name: "2.5G", fuelType: "petrol", spec: { fuelConsumption: 7.0 } },
        { id: "camry-hev", name: "2.5 Hybrid", fuelType: "hybrid", spec: { fuelConsumption: 4.5 } },
      ],
    },
    {
      id: "hilux",
      name: "Hilux Revo",
      years: [2026, 2025, 2024, 2023, 2022, 2021, 2020],
      trims: [
        { id: "hilux-2-4", name: "2.4 Diesel", fuelType: "diesel", spec: { fuelConsumption: 7.6 } },
        { id: "hilux-2-8", name: "2.8 Diesel", fuelType: "diesel", spec: { fuelConsumption: 8.2 } },
      ],
    },
  ],
};
