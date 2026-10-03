import type { ConcreteDateNightType, DateNightLifecycle } from "./types";

// Complement the ordinary activity query within its existing capped radius.
// Broad place kinds are acquisition hints, never seasonal classifications.
const SEASONAL_SELECTORS: Partial<Record<ConcreteDateNightType, { values: string; words: string }>> = {
  "corn-maze": { values: "corn_maze|maize_maze", words: "(corn|maize)[ _-]+maze" },
  "pumpkin-patch": { values: "pumpkin_patch", words: "pumpkin[ _-]+(patch|picking)" },
  "haunted-house": { values: "haunted_house|haunted_trail|haunted_forest|haunted_attraction", words: "haunted[ _-]+(house|trail|forest|attraction)" },
};
export function seasonalQueryClauses(around: string, selected: readonly ConcreteDateNightType[] = ["haunted-house", "corn-maze", "pumpkin-patch"]): string {
  const selectors = selected.flatMap((type) => SEASONAL_SELECTORS[type] ? [SEASONAL_SELECTORS[type]!] : []);
  if (!selectors.length) return "";
  const clauses = [
    `["attraction"~"^(${selectors.map((selector) => selector.values).join("|")})$"]`,
    ...(selected.includes("corn-maze") ? ['["leisure"="maze"]', '["attraction"="maze"]'].flatMap((maze) =>
      [`${maze}["maze:type"~"^(corn|maize)$"]`, `${maze}["crop"~"^(corn|maize)$"]`]) : []),
    ...[
      '["leisure"="maze"]',
      '["attraction"="maze"]',
      '["tourism"="theme_park"]',
      '["tourism"~"^(attraction|farm)$"]',
      '["leisure"="park"]',
      '["landuse"~"^(farmyard|farmland)$"]',
    ].map(
      (context) =>
        `${context}[~"^(name|description|seasonal:description|seasonal:activities)$"~"${selectors.map((selector) => selector.words).join("|")}",i]`,
    ),
  ];
  return clauses.map((clause) => `nwr${clause}${around};`).join("\n  ");
}

/** Negative evidence must remain discoverable when active tags were removed.
 * Otherwise a narrower query can resurrect a duplicate still carrying active tags.
 * Values are category-owned; lifecycle/classification precedence stays below. */
export function lifecycleQueryClauses(around: string, selected: readonly ConcreteDateNightType[]): string[] {
  const tags: Record<ConcreteDateNightType, readonly [string, string][]> = {
    bowling: [["leisure", "bowling_alley"]],
    arcade: [["leisure", "amusement_arcade"]],
    movies: [["amenity", "cinema"]],
    "mini-golf": [["leisure", "miniature_golf"]],
    "escape-room": [["leisure", "escape_game"]],
    museum: [["tourism", "museum"]],
    skating: [["leisure", "ice_rink"]],
    park: [["leisure", "park"]],
    "haunted-house": [["attraction", "haunted_house|haunted_trail|haunted_forest|haunted_attraction"]],
    "corn-maze": [["attraction", "corn_maze|maize_maze|maze"], ["leisure", "maze"]],
    "pumpkin-patch": [["attraction", "pumpkin_patch"]],
  };
  return selected.flatMap((type) => tags[type]).map(([key, values]) =>
    `nwr[~"^(disused|abandoned|was|demolished|removed|razed|destroyed):${key}$"~"^(${values})$"]${around};`);
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
