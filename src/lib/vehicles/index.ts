import type {
  FuelType,
  VehicleBrand,
  VehicleModel,
  VehicleSelection,
  VehicleTrim,
} from "./types";
import { VEHICLE_DB } from "./data";

export * from "./types";
export { VEHICLE_DB } from "./data";

export function getBrands(): VehicleBrand[] {
  return VEHICLE_DB;
}

export function getBrand(brandId: string): VehicleBrand | undefined {
  return VEHICLE_DB.find((b) => b.id === brandId);
}

export function getModels(brandId: string): VehicleModel[] {
  return getBrand(brandId)?.models ?? [];
}

export function getModel(brandId: string, modelId: string): VehicleModel | undefined {
  return getModels(brandId).find((m) => m.id === modelId);
}

export function getYears(brandId: string, modelId: string): number[] {
  return getModel(brandId, modelId)?.years ?? [];
}

/** Distinct fuel types offered on a model (in a stable, sensible order). */
export function getFuelTypes(brandId: string, modelId: string): FuelType[] {
  const order: FuelType[] = ["petrol", "diesel", "hybrid", "phev", "ev"];
  const present = new Set((getModel(brandId, modelId)?.trims ?? []).map((t) => t.fuelType));
  return order.filter((f) => present.has(f));
}

/** Trims of a model filtered by fuel type. */
export function getTrims(brandId: string, modelId: string, fuelType: FuelType): VehicleTrim[] {
  return (getModel(brandId, modelId)?.trims ?? []).filter((t) => t.fuelType === fuelType);
}

export function getTrim(sel: Pick<VehicleSelection, "brandId" | "modelId" | "trimId">) {
  return getModel(sel.brandId, sel.modelId)?.trims.find((t) => t.id === sel.trimId);
}

/** Resolve a full selection to its trim, tolerating partial/stale selections. */
export function resolveSelection(sel: VehicleSelection | null): VehicleTrim | undefined {
  if (!sel) return undefined;
  return getTrim(sel);
}
