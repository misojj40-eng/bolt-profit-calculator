import type { City, DriveMode, Hotspot, SpotTag } from "./types";
import { CITIES } from "./data";

export { CITIES };
export type { City, DriveMode, Hotspot } from "./types";

export function getCity(id: string): City {
  return CITIES.find((c) => c.id === id) ?? CITIES[0];
}

export type DriveContext = {
  hour: number; // 0..23
  dow: number; // 0=Sun..6=Sat
  mode: DriveMode;
  isHoliday: boolean;
  isPayday: boolean;
};

function windowWeight(spot: Hotspot, hour: number): number {
  let best = 0;
  for (const w of spot.windows) {
    const inWindow = w.from <= w.to ? hour >= w.from && hour < w.to : hour >= w.from || hour < w.to;
    if (inWindow) best = Math.max(best, w.w);
  }
  return best;
}

const hasTag = (spot: Hotspot, tags: SpotTag[]) => spot.tags.some((t) => tags.includes(t));

/** Demand score for a spot in a given context. 0 means "not active now". */
export function scoreSpot(spot: Hotspot, ctx: DriveContext): number {
  let score = windowWeight(spot, ctx.hour);
  if (score === 0) return 0;

  if (spot.bestDows && spot.bestDows.includes(ctx.dow)) score *= 1.35;
  if (!spot.modes.includes(ctx.mode)) score *= 0.5;

  const isNight = ctx.hour >= 18 || ctx.hour < 3;
  const isWeekendNight = (ctx.dow === 5 || ctx.dow === 6) && isNight;

  if (ctx.isHoliday && hasTag(spot, ["tourist", "mall", "beach", "market"])) score *= 1.3;
  if ((ctx.isPayday || isWeekendNight) && hasTag(spot, ["nightlife", "dining", "mall"]) && isNight) {
    score *= 1.2;
  }
  return score;
}

export type RankedSpot = { spot: Hotspot; score: number };

export function rankSpots(city: City, ctx: DriveContext): RankedSpot[] {
  return city.spots
    .map((spot) => ({ spot, score: scoreSpot(spot, ctx) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}

export type PlanBlock = { hour: number; spot: Hotspot | null };

/** Representative hours across the day for the "game plan" timeline. */
export const PLAN_HOURS = [1, 7, 10, 13, 16, 19, 22];

export function dayPlan(city: City, base: Omit<DriveContext, "hour">): PlanBlock[] {
  return PLAN_HOURS.map((hour) => {
    const ranked = rankSpots(city, { ...base, hour });
    return { hour, spot: ranked[0]?.spot ?? null };
  });
}

export function mapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
