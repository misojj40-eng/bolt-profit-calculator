import type { VehicleBrand } from "../types";

export const tesla: VehicleBrand = {
  id: "tesla",
  name: "Tesla",
  models: [
    {
      id: "model3",
      name: "Model 3",
      years: [2026, 2025, 2024, 2023, 2022],
      trims: [
        { id: "m3-rwd", name: "RWD 57.5 kWh", fuelType: "ev", spec: { energyConsumption: 13.5, batteryKwh: 57.5 } },
        { id: "m3-lr", name: "Long Range 75 kWh", fuelType: "ev", spec: { energyConsumption: 14.5, batteryKwh: 75 } },
      ],
    },
    {
      id: "modely",
      name: "Model Y",
      years: [2026, 2025, 2024, 2023, 2022],
      trims: [
        { id: "my-rwd", name: "RWD 60 kWh", fuelType: "ev", spec: { energyConsumption: 15.0, batteryKwh: 60 } },
        { id: "my-lr", name: "Long Range 75 kWh", fuelType: "ev", spec: { energyConsumption: 16.5, batteryKwh: 75 } },
      ],
    },
  ],
};
