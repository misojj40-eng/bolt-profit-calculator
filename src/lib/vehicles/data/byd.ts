import type { VehicleBrand } from "../types";

export const byd: VehicleBrand = {
  id: "byd",
  name: "BYD",
  models: [
    {
      id: "dolphin",
      name: "Dolphin",
      years: [2025, 2024, 2023],
      trims: [
        { id: "dolphin-std", name: "Standard 44.9 kWh", fuelType: "ev", spec: { energyConsumption: 13.5, batteryKwh: 44.9 } },
        { id: "dolphin-ext", name: "Extended 60.5 kWh", fuelType: "ev", spec: { energyConsumption: 14.5, batteryKwh: 60.5 } },
      ],
    },
    {
      id: "atto3",
      name: "Atto 3",
      years: [2025, 2024, 2023, 2022],
      trims: [
        { id: "atto3-ext", name: "Extended 60.5 kWh", fuelType: "ev", spec: { energyConsumption: 16.0, batteryKwh: 60.5 } },
      ],
    },
    {
      id: "seal",
      name: "Seal",
      years: [2025, 2024, 2023],
      trims: [
        { id: "seal-dynamic", name: "Dynamic 61.4 kWh", fuelType: "ev", spec: { energyConsumption: 15.0, batteryKwh: 61.4 } },
        { id: "seal-awd", name: "AWD 82.5 kWh", fuelType: "ev", spec: { energyConsumption: 17.5, batteryKwh: 82.5 } },
      ],
    },
  ],
};
