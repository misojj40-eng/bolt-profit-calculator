import type { VehicleBrand } from "../types";

export const yamaha: VehicleBrand = {
  id: "yamaha",
  name: "Yamaha",
  models: [
    {
      id: "aerox",
      name: "Aerox 155",
      type: "motorbike",
      years: [2026, 2025, 2024, 2023, 2022, 2021],
      trims: [{ id: "aerox155", name: "155", fuelType: "petrol", spec: { fuelConsumption: 2.2 } }],
    },
    {
      id: "nmax",
      name: "NMAX 155",
      type: "motorbike",
      years: [2026, 2025, 2024, 2023, 2022],
      trims: [{ id: "nmax155", name: "155", fuelType: "petrol", spec: { fuelConsumption: 2.2 } }],
    },
    {
      id: "grand-filano",
      name: "Grand Filano",
      type: "motorbike",
      years: [2026, 2025, 2024, 2023, 2022],
      trims: [{ id: "filano", name: "Hybrid 125", fuelType: "petrol", spec: { fuelConsumption: 1.9 } }],
    },
    {
      id: "fino",
      name: "Fino 125",
      type: "motorbike",
      years: [2026, 2025, 2024, 2023, 2022, 2021],
      trims: [{ id: "fino125", name: "125", fuelType: "petrol", spec: { fuelConsumption: 1.8 } }],
    },
    {
      id: "mio",
      name: "Mio 125",
      type: "motorbike",
      years: [2024, 2023, 2022, 2021],
      trims: [{ id: "mio125", name: "125", fuelType: "petrol", spec: { fuelConsumption: 1.9 } }],
    },
  ],
};
