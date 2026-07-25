import type { TripEntry } from "./trips";

export type WeekdayStat = { dow: number; sum: number; count: number; avg: number };

export type Insights = {
  count: number;
  totalNet: number;
  totalKm: number;
  totalHours: number;
  avgNet: number;
  avgPerHour: number;
  avgPerKm: number;
  byWeekday: WeekdayStat[]; // length 7, dow 0=Sun..6=Sat
  bestWeekday: WeekdayStat | null;
  bestDay: TripEntry | null;
};

export function computeInsights(trips: TripEntry[]): Insights {
  const byWeekday: WeekdayStat[] = Array.from({ length: 7 }, (_, dow) => ({
    dow, sum: 0, count: 0, avg: 0,
  }));

  let totalNet = 0;
  let totalKm = 0;
  let totalHours = 0;
  let bestDay: TripEntry | null = null;

  for (const t of trips) {
    totalNet += t.netProfit;
    totalKm += t.distanceKm;
    totalHours += t.hours;
    if (!bestDay || t.netProfit > bestDay.netProfit) bestDay = t;

    const dow = new Date(`${t.date}T00:00:00`).getDay();
    const w = byWeekday[dow];
    w.sum += t.netProfit;
    w.count += 1;
  }

  for (const w of byWeekday) w.avg = w.count ? w.sum / w.count : 0;

  const withData = byWeekday.filter((w) => w.count > 0);
  const bestWeekday = withData.length
    ? withData.reduce((a, b) => (b.avg > a.avg ? b : a))
    : null;

  const count = trips.length;
  return {
    count,
    totalNet,
    totalKm,
    totalHours,
    avgNet: count ? totalNet / count : 0,
    avgPerHour: totalHours > 0 ? totalNet / totalHours : 0,
    avgPerKm: totalKm > 0 ? totalNet / totalKm : 0,
    byWeekday,
    bestWeekday,
    bestDay,
  };
}
