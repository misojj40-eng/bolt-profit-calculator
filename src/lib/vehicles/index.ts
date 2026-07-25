import type {
  FuelType,
  VehicleBrand,
  VehicleModel,
  VehicleSelection,
  VehicleTrim,
  VehicleType,
} from "./types";
import { VEHICLE_DB } from "./data";

export * from "./types";
export { VEHICLE_DB } from "./data";

const modelType = (m: VehicleModel): VehicleType => m.type ?? "car";

/** Brands that have at least one model of the given type (default "car"). */
export function getBrands(type: VehicleType = "car"): VehicleBrand[] {
  return VEHICLE_DB.filter((b) => b.models.some((m) => modelType(m) === type));
}

export function getBrand(brandId: string): VehicleBrand | undefined {
  return VEHICLE_DB.find((b) => b.id === brandId);
}

export function getModels(brandId: string, type: VehicleType = "car"): VehicleModel[] {
  return (getBrand(brandId)?.models ?? []).filter((m) => modelType(m) === type);
}

export function getModel(brandId: string, modelId: string): VehicleModel | undefined {
  return (getBrand(brandId)?.models ?? []).find((m) => m.id === modelId);
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
