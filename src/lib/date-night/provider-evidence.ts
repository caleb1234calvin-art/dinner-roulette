import type { ConcreteDateNightType, DateNightLifecycle } from "./types";

// Complement the ordinary activity query within its existing capped radius.
// Broad place kinds are acquisition hints, never seasonal classifications.
const SEASONAL_SELECTORS: Partial<Record<ConcreteDateNightType, { values: string; words: string }>> = {
  "corn-maze": { values: "corn_maze|maize_maze", words: "(corn|maize)[ _-]+maze" },
  "pumpkin-patch": { values: "pumpkin_patch", words: "pumpkin[ _-]+(patch|picking)" },
  "haunted-house": { values: "haunted_house|haunted_trail|haunted_forest|haunted_attraction", words: "haunted[ _-]+(house|trail|forest|attraction)" },
};

/** Materialize only classifier-supported, spatially bounded contexts before
 * applying prose predicates. This set is input to the final union, never output
 * itself: a generic farm, maze or park is not a seasonal result. */
export function seasonalQueryPrelude(around: string): string {
  const contexts = [
    '["leisure"="maze"]',
    '["attraction"="maze"]',
    '["tourism"="theme_park"]',
    '["tourism"="attraction"]',
    '["tourism"="farm"]',
    '["leisure"="park"]',
    '["landuse"="farmyard"]',
    '["landuse"="farmland"]',
  ];
  return `(\n  ${contexts.map((context) => `nwr${context}${around};`).join("\n  ")}\n)->.seasonal_context;\n`;
}

export function seasonalQueryClauses(around: string, selected: readonly ConcreteDateNightType[] = ["haunted-house", "corn-maze", "pumpkin-patch"]): string {
  const selectors = selected.flatMap((type) => SEASONAL_SELECTORS[type] ? [SEASONAL_SELECTORS[type]!] : []);
  if (!selectors.length) return "";
  const clauses = [
    `["attraction"~"^(${selectors.map((selector) => selector.values).join("|")})$"]`,
    ...(selected.includes("corn-maze") ? ['["leisure"="maze"]', '["attraction"="maze"]'].flatMap((maze) =>
      [`${maze}["maze:type"~"^(corn|maize)$"]`, `${maze}["crop"~"^(corn|maize)$"]`]) : []),
  ];
  // Exact classifier-owned keys retain case-insensitive values. The named set
  // restricts each prose filter to the context pool acquired in the prelude.
  const prose = ["name", "description", "seasonal:description", "seasonal:activities"].map((key) =>
    `nwr.seasonal_context["${key}"~"${selectors.map((selector) => selector.words).join("|")}",i];`);
  return [...clauses.map((clause) => `nwr${clause}${around};`), ...prose].join("\n  ");
}

// The same identity can have active and lifecycle-only representations classified
// under different activities. Keep negative acquisition independent of selection,
// using only the existing supported tag/value vocabulary. Aggregating by exact
// key bounds this to 4 keys × 7 prefixes, instead of one clause per category.
const LIFECYCLE_TAG_VALUES = {
  leisure: "bowling_alley|amusement_arcade|miniature_golf|escape_game|ice_rink|park|maze",
  amenity: "cinema",
  tourism: "museum",
  attraction: "haunted_house|haunted_trail|haunted_forest|haunted_attraction|corn_maze|maize_maze|maze|pumpkin_patch",
};

/** Shared identity-negative companions; affirmative acquisition stays selected.
 * Existing classification, lifecycle precedence and eligibility remain decisive. */
export function lifecycleQueryClauses(around: string): string[] {
  return Object.entries(LIFECYCLE_TAG_VALUES).flatMap(([key, values]) =>
    ["disused", "abandoned", "was", "demolished", "removed", "razed", "destroyed"].map((prefix) =>
      `nwr["${prefix}:${key}"~"^(${values})$"]${around};`));
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
