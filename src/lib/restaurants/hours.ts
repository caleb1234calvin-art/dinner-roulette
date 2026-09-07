const DAY_CODES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

export interface OpenStatus {
  isOpen: boolean;
  hoursKnown: boolean;
  closesLabel: string | null;
  closingSoon: boolean;
}

function minutesNow(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

function parseClock(value: string): number | null {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 24 || minutes > 59) return null;
  return hours * 60 + minutes;
}

function formatClock(totalMinutes: number): string {
  const normalized = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const hours24 = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  const suffix = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  if (minutes === 0) return `${hours12} ${suffix}`;
  return `${hours12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

function expandDays(token: string): number[] {
  if (token === "PH" || token === "SH") return [];
  if (token.includes("-")) {
    const [startCode, endCode] = token.split("-") as [string, string];
    const start = DAY_CODES.indexOf(startCode as (typeof DAY_CODES)[number]);
    const end = DAY_CODES.indexOf(endCode as (typeof DAY_CODES)[number]);
    if (start < 0 || end < 0) return [];
    const days: number[] = [];
    let cursor = start;
    for (let i = 0; i < 7; i += 1) {
      days.push(cursor);
      if (cursor === end) break;
      cursor = (cursor + 1) % 7;
    }
    return days;
  }
  const index = DAY_CODES.indexOf(token as (typeof DAY_CODES)[number]);
  return index >= 0 ? [index] : [];
}

interface TimeWindow {
  days: number[] | "all";
  ranges: Array<[number, number]>;
  off: boolean;
}

function parseRule(rule: string): TimeWindow | null {
  const trimmed = rule.trim();
  if (!trimmed) return null;
  if (/^24\/7$/i.test(trimmed)) {
    return { days: "all", ranges: [[0, 24 * 60]], off: false };
  }

  const off = /\boff\b/i.test(trimmed) || /^closed$/i.test(trimmed);
  const dayTokens = trimmed.match(/\b(?:Mo|Tu|We|Th|Fr|Sa|Su)(?:-(?:Mo|Tu|We|Th|Fr|Sa|Su))?\b/g);
  const days = dayTokens?.flatMap(expandDays);
  const timeTokens = [...trimmed.matchAll(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/g)];
  const ranges: Array<[number, number]> = [];
  for (const token of timeTokens) {
    const start = parseClock(token[1] ?? "");
    const end = parseClock(token[2] ?? "");
    if (start == null || end == null) continue;
    ranges.push([start, end]);
  }

  if (off) {
    return { days: days && days.length > 0 ? days : "all", ranges: [], off: true };
  }
  if (ranges.length === 0) return null;
  return { days: days && days.length > 0 ? days : "all", ranges, off: false };
}

function ruleIncludesDay(rule: TimeWindow, day: number): boolean {
  return rule.days === "all" || rule.days.includes(day);
}

export function getOpenStatus(openingHours: string | null | undefined, now = new Date()): OpenStatus {
  if (!openingHours || openingHours.toLowerCase() === "unknown") {
    return { isOpen: true, hoursKnown: false, closesLabel: null, closingSoon: false };
  }
  const raw = openingHours.trim();
  if (/^closed$/i.test(raw)) {
    return { isOpen: false, hoursKnown: true, closesLabel: null, closingSoon: false };
  }

  const rules = raw
    .split(";")
    .map(parseRule)
    .filter((rule): rule is TimeWindow => rule !== null);

  if (rules.length === 0) {
    return { isOpen: true, hoursKnown: false, closesLabel: null, closingSoon: false };
  }

  const day = now.getDay();
  const previousDay = (day + 6) % 7;
  const minutes = minutesNow(now);
  const matching = rules.filter((rule) => ruleIncludesDay(rule, day));

  let openUntil: number | null = null;

  // First, check today's normal and overnight windows.
  for (const rule of matching) {
    if (rule.off) continue;
    for (const [start, end] of rule.ranges) {
      if (end > start) {
        if (minutes >= start && minutes < end) {
          openUntil = openUntil == null ? end : Math.max(openUntil, end);
        }
      } else if (minutes >= start) {
        // A window such as Fr 20:00-01:30 is open late on Friday night.
        const until = end + 24 * 60;
        openUntil = openUntil == null ? until : Math.max(openUntil, until);
      }
    }
  }

  // Then check whether we are in the after-midnight tail of yesterday's
  // overnight window. This matters heavily for nightlife: at 01:00 Saturday,
  // a Friday 20:00-01:30 rule must still count as open.
  for (const rule of rules) {
    if (rule.off || !ruleIncludesDay(rule, previousDay)) continue;
    for (const [start, end] of rule.ranges) {
      if (end <= start && minutes < end) {
        openUntil = openUntil == null ? end : Math.max(openUntil, end);
      }
    }
  }

  if (openUntil == null) {
    const hasTodayRules = matching.length > 0;
    if (!hasTodayRules) {
      return { isOpen: false, hoursKnown: true, closesLabel: null, closingSoon: false };
    }
    if (matching.some((rule) => rule.off && rule.ranges.length === 0)) {
      const hasOpenOverride = matching.some((rule) => !rule.off && rule.ranges.length > 0);
      if (!hasOpenOverride) {
        return { isOpen: false, hoursKnown: true, closesLabel: null, closingSoon: false };
      }
    }
    return { isOpen: false, hoursKnown: true, closesLabel: null, closingSoon: false };
  }

  const effectiveMinutes = openUntil > 24 * 60 ? minutes : minutes;
  const remaining = openUntil > 24 * 60 ? openUntil - effectiveMinutes : openUntil - minutes;
  return {
    isOpen: true,
    hoursKnown: true,
    closesLabel: `Open until ${formatClock(openUntil)}`,
    closingSoon: remaining <= 30 && remaining > 0,
  };
}

export function formatPrice(level: 1 | 2 | 3 | 4 | null): string {
  if (!level) return "Price unknown";
  return "$".repeat(level);
}
