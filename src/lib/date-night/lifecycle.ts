import type { DateNightLifecycle } from "./types";

// One vocabulary owns interpretation, lifecycle-key normalization and acquisition.
// Ordering is precedence: a permanent terminal claim always wins over disuse.
export const LIFECYCLE_FAMILIES = [
  { lifecycle: "permanently-closed", prefixes: ["demolished", "removed", "razed", "destroyed"], anySuffix: true },
  { lifecycle: "disused", prefixes: ["disused", "abandoned", "was"], anySuffix: false },
] as const;
export const LIFECYCLE_CLASSIFICATION_KEYS = ["leisure", "tourism", "attraction", "amenity"] as const;
const FALSE_VALUES = ["no", "false", "0"] as const;
const ALL_PREFIXES = LIFECYCLE_FAMILIES.flatMap((family) => [...family.prefixes]);
const normalizedKey = new RegExp(`^(${ALL_PREFIXES.join("|")}):(${LIFECYCLE_CLASSIFICATION_KEYS.join("|")})$`);

// A POSIX ERE complement of the finite false-value vocabulary. Overpass key-regex
// predicates cannot negate their value regex. Enumerate the first differing
// character (or a proper prefix/extension), avoiding lookahead and flags that
// would also make lifecycle KEYS case-insensitive. [^a]|a includes newlines.
const ANY_CHARACTER = "([^a]|a)";
function positiveValuePattern(): string {
  const branches: string[] = [];
  const visit = (prefix: string, words: readonly string[]) => {
    if (prefix && !words.includes("")) branches.push(prefix);
    const next = [...new Set(words.filter(Boolean).map((word) => word[0]!))];
    if (!next.length) {
      branches.push(`${prefix}${ANY_CHARACTER}+`);
      return;
    }
    const variants = (letter: string) => letter.toLowerCase() === letter.toUpperCase()
      ? letter : `${letter.toLowerCase()}${letter.toUpperCase()}`;
    branches.push(`${prefix}[^${next.map(variants).join("")}]${ANY_CHARACTER}*`);
    for (const letter of next) {
      visit(`${prefix}[${variants(letter)}]`, words.filter((word) => word.startsWith(letter)).map((word) => word.slice(1)));
    }
  };
  visit("", FALSE_VALUES);
  return `^(${branches.join("|")})$`;
}
export const LIFECYCLE_POSITIVE_VALUE_PATTERN = positiveValuePattern();

const representations = LIFECYCLE_FAMILIES.map((family) => ({
  lifecycle: family.lifecycle,
  keyPattern: `^(${family.prefixes.join("|")})($|:${family.anySuffix ? "" : `(${LIFECYCLE_CLASSIFICATION_KEYS.join("|")})$`})`,
}));
const matchers = representations.map((representation) => ({
  ...representation, key: new RegExp(representation.keyPattern),
}));

/** Preserve nonempty / no|false|0 semantics, including untrimmed provider values. */
export function providerLifecycle(tags: Record<string, string>): DateNightLifecycle | undefined {
  for (const { lifecycle, key } of matchers) {
    if (Object.entries(tags).some(([name, value]) => key.test(name) &&
      Boolean(value) && !FALSE_VALUES.some((negative) => value.toLowerCase() === negative))) return lifecycle;
  }
  return undefined;
}

/** Fill only missing/falsy classifier keys, preserving provider iteration order. */
export function normalizeLifecycleTags(rawTags: Record<string, string>): Record<string, string> {
  const tags = { ...rawTags };
  for (const [key, value] of Object.entries(rawTags)) {
    const match = key.match(normalizedKey);
    if (match && !tags[match[2]!]) tags[match[2]!] = value;
  }
  return tags;
}

// Necessary carrier contexts for the unchanged classifier. These are acquisition
// hints only: generic farms/parks/mazes cannot pass through the set unfiltered.
const CLASSIFICATION_CONTEXTS = {
  leisure: "bowling_alley|amusement_arcade|miniature_golf|escape_game|ice_rink|park|maze",
  amenity: "cinema",
  tourism: "museum|theme_park|attraction|farm",
  attraction: "haunted_house|haunted_trail|haunted_forest|haunted_attraction|corn_maze|maize_maze|maze|pumpkin_patch",
  sport: "roller_skating",
  landuse: "farmyard|farmland",
};

export function lifecycleQueryPrelude(around: string): string {
  const selectors = Object.entries(CLASSIFICATION_CONTEXTS).flatMap(([key, values]) => {
    const keys = [key, ...(LIFECYCLE_CLASSIFICATION_KEYS.some((candidate) => candidate === key)
      ? ALL_PREFIXES.map((prefix) => `${prefix}:${key}`) : [])];
    return keys.map((name) => `nwr["${name}"~"^(${values})$"]${around};`);
  });
  return `(\n  ${selectors.join("\n  ")}\n)->.lifecycle_context;\n`;
}

/** Regex key scans operate ONLY on the bounded classifier carrier set. */
export function lifecycleQueryClauses(): string[] {
  return representations.map(({ keyPattern }) =>
    `nwr.lifecycle_context[~"${keyPattern}"~"${LIFECYCLE_POSITIVE_VALUE_PATTERN}"];`);
}
