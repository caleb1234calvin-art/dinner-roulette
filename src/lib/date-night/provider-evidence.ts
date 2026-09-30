import type { ConcreteDateNightType, DateNightLifecycle } from "./types";

// Complement the ordinary activity query within its existing capped radius.
// Broad place kinds are acquisition hints, never seasonal classifications.
const ACTIVITY_VALUES =
  "corn_maze|maize_maze|pumpkin_patch|haunted_house|haunted_trail|haunted_forest|haunted_attraction";
const ACTIVITY_WORDS =
  "corn[ _-]maze|maize[ _-]maze|pumpkin[ _-](patch|picking)|haunted[ _-](house|trail|forest|attraction)";
export function seasonalQueryClauses(around: string): string {
  const clauses = [
    '["leisure"="maze"]',
    '["attraction"="maze"]',
    `["attraction"~"^(${ACTIVITY_VALUES})$"]`,
    '["tourism"="theme_park"]',
    ...[
      '["tourism"~"^(attraction|farm)$"]',
      '["leisure"="park"]',
      '["landuse"~"^(farmyard|farmland)$"]',
    ].map(
      (context) =>
        `${context}[~"^(name|description|seasonal:description|seasonal:activities)$"~"${ACTIVITY_WORDS}",i]`,
    ),
  ];
  return clauses.map((clause) => `nwr${clause}${around};`).join("\n  ");
}

/** Structured lifecycle evidence wins over still-present active tags. */
export function providerLifecycle(tags: Record<string, string>): DateNightLifecycle | undefined {
  const positive = (value: string | undefined) => Boolean(value && !/^(no|false|0)$/i.test(value));
  if (
    ["demolished", "removed", "razed", "destroyed"].some((key) => positive(tags[key])) ||
    Object.keys(tags).some(
      (key) => /^(demolished|removed|razed|destroyed):/.test(key) && positive(tags[key]),
    )
  ) {
    return "permanently-closed";
  }
  if (
    ["disused", "abandoned", "was"].some((key) => positive(tags[key])) ||
    Object.keys(tags).some(
      (key) =>
        /^(disused|abandoned|was):(leisure|tourism|attraction|amenity)$/.test(key) &&
        positive(tags[key]),
    )
  ) {
    return "disused";
  }
  return undefined;
}

export function seasonalTypes(tags: Record<string, string>): ConcreteDateNightType[] {
  const types = new Set<ConcreteDateNightType>();
  const attraction = tags.attraction;
  const maze = tags.leisure === "maze" || attraction === "maze";
  if (["corn_maze", "maize_maze"].includes(attraction)) types.add("corn-maze");
  if (
    maze &&
    (/^(corn|maize)$/.test(tags["maze:type"] ?? "") || /^(corn|maize)$/.test(tags.crop ?? ""))
  ) {
    types.add("corn-maze");
  }
  if (attraction === "pumpkin_patch") types.add("pumpkin-patch");
  if (
    ["haunted_house", "haunted_trail", "haunted_forest", "haunted_attraction"].includes(attraction)
  )
    types.add("haunted-house");

  // A name alone on an unrelated shop, house or restaurant is insufficient.
  const context =
    maze ||
    ["theme_park", "attraction", "farm"].includes(tags.tourism) ||
    tags.leisure === "park" ||
    ["farmyard", "farmland"].includes(tags.landuse);
  if (context) {
    for (const field of ["name", "description", "seasonal:description", "seasonal:activities"]) {
      const text = (tags[field] ?? "").toLowerCase().replaceAll("_", " ");
      // Negative/historical activity prose cannot substantiate an offering.
      if (/\b(no|not|former|formerly|removed|closed|without|disused)\b/.test(text)) continue;
      if (/\b(corn|maize)[ _-]+maze\b/.test(text) && !/\b(hedge|meditation|labyrinth)\b/.test(text))
        types.add("corn-maze");
      if (/\bpumpkin[ _-]+(patch|picking)\b/.test(text)) types.add("pumpkin-patch");
      if (/\bhaunted[ _-]+(house|trail|forest|attraction)\b/.test(text)) types.add("haunted-house");
    }
  }
  return [...types].sort();
}
