import type { VehicleBrand } from "../types";

export const suzuki: VehicleBrand = {
  id: "suzuki",
  name: "Suzuki",
  models: [
    {
      id: "swift",
      name: "Swift",
      years: [2025, 2024, 2023, 2022, 2021, 2020],
      trims: [
        { id: "swift-1-2", name: "1.2 CVT", fuelType: "petrol", spec: { fuelConsumption: 5.0 } },
      ],
    },
    {
      id: "ciaz",
      name: "Ciaz",
      years: [2024, 2023, 2022, 2021, 2020],
      trims: [
        { id: "ciaz-1-2", name: "1.2 CVT", fuelType: "petrol", spec: { fuelConsumption: 5.1 } },
      ],
    },
  ],
};
