export const HALLOWEEN_DATE_NIGHT_START = { month: 9, day: 1 } as const;
export const HALLOWEEN_DATE_NIGHT_END = { month: 11, day: 2 } as const;

/**
 * Local-calendar gate for the experimental Halloween Date Night skin.
 * The season intentionally starts early enough for September planning and
 * disappears immediately after the Halloween weekend.
 */
export function isHalloweenDateNightSeason(now = new Date()): boolean {
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const start = HALLOWEEN_DATE_NIGHT_START;
  const end = HALLOWEEN_DATE_NIGHT_END;

  if (month > start.month && month < end.month) return true;
  if (month === start.month && day >= start.day) return true;
  if (month === end.month && day <= end.day) return true;
  return false;
}
