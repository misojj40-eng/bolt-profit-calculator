import type { TripEntry } from "./trips";

export type Goal = {
  /** Target take-home (net profit) per driving day, in the display currency. */
  dailyTarget: number;
  /** Driving days per week, used to derive the weekly target. */
  daysPerWeek: number;
};

export const DEFAULT_GOAL: Goal = { dailyTarget: 1200, daysPerWeek: 6 };

function isoDaysAgo(base: Date, n: number): string {
  const d = new Date(base.getTime() - n * 86400000);
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

export type GoalStats = {
  todayNet: number;
  todayPct: number; // 0..1+
  streak: number;
  weekNet: number;
  weekTarget: number;
  weekPct: number;
};

/**
 * Consecutive-day streak of hitting the target, counting back from today.
 * A not-yet-logged today does not break the streak (it resumes from yesterday).
 */
export function computeStreak(trips: TripEntry[], target: number): number {
  if (target <= 0) return 0;
  const met = new Map<string, number>();
  for (const t of trips) met.set(t.date, (met.get(t.date) ?? 0) + t.netProfit);

  const now = new Date();
  const today = isoDaysAgo(now, 0);
  let offset = met.has(today) ? 0 : 1; // allow today to be missing
  let streak = 0;
  // Guard against infinite loops with a sane cap.
  for (let i = 0; i < 3650; i++) {
    const day = isoDaysAgo(now, offset);
    const net = met.get(day);
    if (net == null || net < target) break;
    streak++;
    offset++;
  }
  return streak;
}

export function computeGoalStats(
  trips: TripEntry[],
  goal: Goal,
  todayNetLive: number
): GoalStats {
  const now = new Date();
  const today = isoDaysAgo(now, 0);
  const weekAgo = new Date(now.getTime() - 7 * 86400000);

  const loggedToday = trips.find((t) => t.date === today);
  const todayNet = loggedToday ? loggedToday.netProfit : todayNetLive;

  let weekNet = 0;
  for (const t of trips) {
    const d = new Date(`${t.date}T00:00:00`);
    if (d >= weekAgo) weekNet += t.netProfit;
  }

  const weekTarget = goal.dailyTarget * Math.max(1, goal.daysPerWeek);
  return {
    todayNet,
    todayPct: goal.dailyTarget > 0 ? todayNet / goal.dailyTarget : 0,
    streak: computeStreak(trips, goal.dailyTarget),
    weekNet,
    weekTarget,
    weekPct: weekTarget > 0 ? weekNet / weekTarget : 0,
  };
}
