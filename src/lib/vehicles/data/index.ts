import type { VehicleBrand } from "../types";
import { toyota } from "./toyota";
import { honda } from "./honda";
import { mazda } from "./mazda";
import { nissan } from "./nissan";
import { mitsubishi } from "./mitsubishi";
import { suzuki } from "./suzuki";
import { isuzu } from "./isuzu";
import { mg } from "./mg";
import { byd } from "./byd";
import { tesla } from "./tesla";
import { gwm } from "./gwm";
import { yamaha } from "./yamaha";
import { gpx } from "./gpx";

/**
 * The vehicle database. To add a vehicle, edit the relevant brand file (or add a
 * new one and register it here). Each brand is self-contained, so the dataset
 * scales without touching query logic. Brands are shown alphabetically in the UI.
 */
export const VEHICLE_DB: VehicleBrand[] = [
  toyota,
  honda,
  mazda,
  nissan,
  mitsubishi,
  suzuki,
  isuzu,
  mg,
  byd,
  tesla,
  gwm,
  yamaha,
  gpx,
].sort((a, b) => a.name.localeCompare(b.name));
