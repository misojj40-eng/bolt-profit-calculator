/** Thai public holidays (approximate, government-observed) for demand hints.
 * Extend as needed; used only to nudge recommendations, not for exactness. */
const TH_HOLIDAYS: Record<string, string[]> = {
  "2026": [
    "2026-01-01", // New Year's Day
    "2026-03-03", // Makha Bucha
    "2026-04-06", // Chakri Day
    "2026-04-13", "2026-04-14", "2026-04-15", // Songkran
    "2026-05-01", // Labour Day
    "2026-05-04", // Coronation Day
    "2026-06-01", // Visakha Bucha (observed)
    "2026-06-03", // Queen Suthida's Birthday
    "2026-07-28", // King's Birthday
    "2026-07-30", // Asalha Bucha (approx)
    "2026-08-12", // Mother's Day
    "2026-10-13", // King Bhumibol Memorial Day
    "2026-10-23", // Chulalongkorn Day
    "2026-12-05", // Father's Day
    "2026-12-10", // Constitution Day
    "2026-12-31", // New Year's Eve
  ],
};

export function isThaiHoliday(d = new Date()): boolean {
  const y = String(d.getFullYear());
  const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  return (TH_HOLIDAYS[y] ?? []).includes(iso);
}

/** Payday window: many Thai employers pay around the 25th–end of month and the
 * 1st, when nightlife and dining demand rises. */
export function isPaydayWindow(d = new Date()): boolean {
  const day = d.getDate();
  return day >= 25 || day <= 2;
}
