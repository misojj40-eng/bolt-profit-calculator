import type { VehicleBrand } from "../types";

export const honda: VehicleBrand = {
  id: "honda",
  name: "Honda",
  models: [
    {
      id: "city",
      name: "City",
      years: [2026, 2025, 2024, 2023, 2022, 2021, 2020],
      trims: [
        { id: "city-1-0", name: "1.0 Turbo", fuelType: "petrol", spec: { fuelConsumption: 5.4 } },
        { id: "city-hev", name: "e:HEV Hybrid", fuelType: "hybrid", spec: { fuelConsumption: 3.9 } },
      ],
    },
    {
      id: "civic",
      name: "Civic",
      years: [2026, 2025, 2024, 2023, 2022, 2021],
      trims: [
        { id: "civic-1-5", name: "1.5 Turbo", fuelType: "petrol", spec: { fuelConsumption: 6.0 } },
        { id: "civic-hev", name: "e:HEV Hybrid", fuelType: "hybrid", spec: { fuelConsumption: 4.0 } },
      ],
    },
    {
      id: "accord",
      name: "Accord",
      years: [2026, 2025, 2024, 2023],
      trims: [
        { id: "accord-hev", name: "e:HEV Hybrid", fuelType: "hybrid", spec: { fuelConsumption: 4.5 } },
      ],
    },
    {
      id: "hrv",
      name: "HR-V",
      years: [2026, 2025, 2024, 2023, 2022],
      trims: [
        { id: "hrv-hev", name: "e:HEV Hybrid", fuelType: "hybrid", spec: { fuelConsumption: 4.5 } },
      ],
    },
    {
      id: "wave110i",
      name: "Wave 110i",
      type: "motorbike",
      years: [2026, 2025, 2024, 2023, 2022, 2021, 2020],
      trims: [
        { id: "wave110i", name: "110i", fuelType: "petrol", spec: { fuelConsumption: 1.6 } },
      ],
    },
    {
      id: "click",
      name: "Click",
      type: "motorbike",
      years: [2026, 2025, 2024, 2023, 2022, 2021],
      trims: [
        { id: "click125", name: "125i", fuelType: "petrol", spec: { fuelConsumption: 1.7 } },
        { id: "click160", name: "160", fuelType: "petrol", spec: { fuelConsumption: 1.9 } },
      ],
    },
    {
      id: "pcx",
      name: "PCX",
      type: "motorbike",
      years: [2026, 2025, 2024, 2023, 2022, 2021],
      trims: [
        { id: "pcx160", name: "160", fuelType: "petrol", spec: { fuelConsumption: 2.0 } },
      ],
    },
    {
      id: "scoopy",
      name: "Scoopy",
      type: "motorbike",
      years: [2026, 2025, 2024, 2023, 2022, 2021],
      trims: [
        { id: "scoopy", name: "i Club12", fuelType: "petrol", spec: { fuelConsumption: 1.8 } },
      ],
    },
    {
      id: "adv160",
      name: "ADV 160",
      type: "motorbike",
      years: [2026, 2025, 2024, 2023],
      trims: [
        { id: "adv160", name: "160", fuelType: "petrol", spec: { fuelConsumption: 2.1 } },
      ],
    },
    {
      id: "em1e",
      name: "EM1 e:",
      type: "motorbike",
      years: [2026, 2025, 2024, 2023],
      trims: [
        { id: "em1e", name: "e: (electric)", fuelType: "ev", spec: { energyConsumption: 4.0, batteryKwh: 1.5 } },
      ],
    },
  ],
};
