import type { VehicleBrand } from "../types";

export const mg: VehicleBrand = {
  id: "mg",
  name: "MG",
  models: [
    {
      id: "mg3",
      name: "MG3",
      years: [2025, 2024, 2023, 2022, 2021],
      trims: [
        { id: "mg3-1-5", name: "1.5 CVT", fuelType: "petrol", spec: { fuelConsumption: 6.2 } },
      ],
    },
    {
      id: "zs",
      name: "ZS",
      years: [2025, 2024, 2023, 2022, 2021],
      trims: [
        { id: "zs-1-5", name: "1.5 Petrol", fuelType: "petrol", spec: { fuelConsumption: 6.8 } },
      ],
    },
    {
      id: "mg4",
      name: "MG4 Electric",
      years: [2025, 2024, 2023],
      trims: [
        { id: "mg4-51", name: "Standard 51 kWh", fuelType: "ev", spec: { energyConsumption: 15.5, batteryKwh: 51 } },
        { id: "mg4-64", name: "Long Range 64 kWh", fuelType: "ev", spec: { energyConsumption: 16.5, batteryKwh: 64 } },
      ],
    },
    {
      id: "zs-ev",
      name: "ZS EV",
      years: [2025, 2024, 2023, 2022],
      trims: [
        { id: "zsev-50", name: "50.3 kWh", fuelType: "ev", spec: { energyConsumption: 17.0, batteryKwh: 50.3 } },
      ],
    },
  ],
};
