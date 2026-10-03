import { requireCoordinates } from "../location/model";
import { lifecycleQueryClauses, seasonalQueryClauses, seasonalQueryPrelude } from "./provider-evidence";
import type { ConcreteDateNightType, DateNightTypeId } from "./types";

export const DATE_NIGHT_QUERY_GROUPS = {
  seasonal: ["haunted-house", "corn-maze", "pumpkin-patch"],
  entertainment: ["bowling", "arcade", "mini-golf", "escape-room", "skating"],
  culture: ["movies", "museum"],
  outdoor: ["park"],
} as const;
export type DateNightQueryGroupId = keyof typeof DATE_NIGHT_QUERY_GROUPS;
export interface DateNightQueryGroup {
  id: DateNightQueryGroupId;
  activityTypes: ConcreteDateNightType[];
}
const ALL_TYPES: readonly ConcreteDateNightType[] = Object.values(DATE_NIGHT_QUERY_GROUPS).flat();

/** Public RPC input accepts category IDs, never provider query fragments. */
export function validateDateNightActivityTypes(raw: unknown): DateNightTypeId[] {
  if (raw === undefined) return ["anything"];
  if (!Array.isArray(raw) || raw.length > ALL_TYPES.length + 1) {
    throw new Error("Choose valid Date Night activities");
  }
  for (let i = 0; i < raw.length; i++) {
    if (!Object.hasOwn(raw, i) || typeof raw[i] !== "string" ||
      (raw[i] !== "anything" && !ALL_TYPES.includes(raw[i] as ConcreteDateNightType))) {
      throw new Error("Choose valid Date Night activities");
    }
  }
  if (!raw.length || raw.includes("anything")) return ["anything"];
  return ALL_TYPES.filter((type) => raw.includes(type));
}

export function normalizeDateNightActivityTypes(raw: unknown, halloweenActive: boolean): ConcreteDateNightType[] {
  const valid = validateDateNightActivityTypes(raw);
  const available = ALL_TYPES.filter((type) => halloweenActive || !DATE_NIGHT_QUERY_GROUPS.seasonal.includes(type as typeof DATE_NIGHT_QUERY_GROUPS.seasonal[number]));
  const selected = available.filter((type) => valid.includes(type));
  // Match existing eligibility normalization of stale seasonal-only filters.
  return valid.includes("anything") || !selected.length ? [...available] : selected;
}

export function buildDateNightQueryPlan(raw: unknown, halloweenActive: boolean): DateNightQueryGroup[] {
  const selected = normalizeDateNightActivityTypes(raw, halloweenActive);
  return (Object.entries(DATE_NIGHT_QUERY_GROUPS) as [DateNightQueryGroupId, readonly ConcreteDateNightType[]][])
    .map(([id, types]) => ({ id, activityTypes: types.filter((type) => selected.includes(type)) }))
    .filter((group) => group.activityTypes.length > 0);
}

const ORDINARY_CLAUSES: Partial<Record<ConcreteDateNightType, readonly string[]>> = {
  bowling: ['["leisure"="bowling_alley"]'],
  arcade: ['["leisure"="amusement_arcade"]'],
  movies: ['["amenity"="cinema"]'],
  "mini-golf": ['["leisure"="miniature_golf"]'],
  "escape-room": ['["leisure"="escape_game"]'],
  museum: ['["tourism"="museum"]'],
  skating: ['["leisure"="ice_rink"]', '["sport"="roller_skating"]'],
  park: ['["leisure"="park"]'],
};

/** All interpolated values are finite coordinates/radius or server-owned clauses. */
export function buildDateNightQuery(group: Pick<DateNightQueryGroup, "activityTypes">, lat: number, lon: number, radiusMeters: number): string {
  requireCoordinates({ lat, lon });
  if (!Number.isFinite(radiusMeters) || radiusMeters <= 0) throw new Error("A valid discovery radius is required");
  const selected = validateDateNightActivityTypes(group.activityTypes);
  if (selected.includes("anything")) throw new Error("A concrete Date Night query plan is required");
  const around = `(around:${Math.round(Math.min(radiusMeters, 80467))},${lat},${lon})`;
  const ordinary = selected.flatMap((type) => type === "anything" ? [] : ORDINARY_CLAUSES[type] ?? [])
    .map((clause) => `nwr${clause}${around};`);
  const seasonal = selected.filter((type): type is ConcreteDateNightType => type !== "anything" && DATE_NIGHT_QUERY_GROUPS.seasonal.includes(type as typeof DATE_NIGHT_QUERY_GROUPS.seasonal[number]));
  const clauses = [...ordinary, ...(seasonal.length ? [seasonalQueryClauses(around, seasonal)] : []),
    ...lifecycleQueryClauses(around, selected as ConcreteDateNightType[])];
  const prelude = seasonal.length ? seasonalQueryPrelude(around) : "";
  return `[out:json][timeout:20];\n${prelude}(\n  ${clauses.join("\n  ")}\n);\nout center tags;`;
}
