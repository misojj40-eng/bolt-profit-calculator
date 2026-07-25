import type { City } from "../types";
import { bangkok } from "./bangkok";
import { huahin } from "./huahin";

/** Registry of supported cities. Add a city by creating a file here and
 * registering it in this array — the engine and UI pick it up automatically. */
export const CITIES: City[] = [bangkok, huahin];
