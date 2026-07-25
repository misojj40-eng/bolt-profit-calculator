export type DriveMode = "rides" | "delivery";

export type SpotTag =
  | "nightlife"
  | "offices"
  | "hotels"
  | "mall"
  | "market"
  | "tourist"
  | "dining"
  | "transport"
  | "condos"
  | "beach";

/** A busy window during the day. `to` may be smaller than `from` to wrap past
 * midnight (e.g. { from: 22, to: 3 }). Weight is a rough demand level 1..3. */
export type SpotWindow = { from: number; to: number; w: number };

export type Hotspot = {
  id: string;
  name: string;
  area: string;
  /** Translation key for the one-line "why", e.g. "reason.nightlife". */
  reason: string;
  windows: SpotWindow[];
  /** Days it's especially strong (0=Sun..6=Sat). Omitted = every day. */
  bestDows?: number[];
  modes: DriveMode[];
  tags: SpotTag[];
  /** Free-text query used to open Google Maps. */
  mapsQuery: string;
};

export type City = {
  id: string;
  name: string;
  nameTh: string;
  spots: Hotspot[];
};
