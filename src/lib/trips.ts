import type { FuelType } from "./vehicles/types";

/** A single saved day of driving. Stored values are snapshots so history is
 * stable even if the user later changes their cost settings. */
export type TripEntry = {
  id: string;
  date: string; // ISO yyyy-mm-dd
  earnings: number;
  distanceKm: number;
  hours: number;
  netProfit: number;
  totalCosts: number;
  fuelType: FuelType;
  currency: string;
};

export type TripSummary = {
  count: number;
  weekNet: number;
  monthNet: number;
  avgNet: number;
  totalNet: number;
};

export function todayISO(): string {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

export function makeTripId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Newest-first for display. */
export function sortByDateDesc(trips: TripEntry[]): TripEntry[] {
  return [...trips].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/** Oldest-first for charting. */
export function sortByDateAsc(trips: TripEntry[]): TripEntry[] {
  return [...trips].sort((a, b) => (a.date > b.date ? 1 : a.date < b.date ? -1 : 0));
}

export function summarize(trips: TripEntry[]): TripSummary {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 86400000);
  const monthKey = now.toISOString().slice(0, 7); // yyyy-mm

  let weekNet = 0;
  let monthNet = 0;
  let totalNet = 0;

  for (const t of trips) {
    totalNet += t.netProfit;
    const d = new Date(`${t.date}T00:00:00`);
    if (d >= weekAgo) weekNet += t.netProfit;
    if (t.date.slice(0, 7) === monthKey) monthNet += t.netProfit;
  }

  return {
    count: trips.length,
    weekNet,
    monthNet,
    totalNet,
    avgNet: trips.length ? totalNet / trips.length : 0,
  };
}
