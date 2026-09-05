import type { CuisineId, PhotoKey } from "./types";

export const CUISINE_CHIPS: { id: CuisineId; label: string }[] = [
  { id: "anything", label: "Anything" },
  { id: "american", label: "American" },
  { id: "burgers", label: "Burgers" },
  { id: "pizza", label: "Pizza" },
  { id: "mexican", label: "Mexican" },
  { id: "tex-mex", label: "Tex-Mex" },
  { id: "italian", label: "Italian" },
  { id: "chinese", label: "Chinese" },
  { id: "japanese", label: "Japanese" },
  { id: "sushi", label: "Sushi" },
  { id: "korean", label: "Korean" },
  { id: "thai", label: "Thai" },
  { id: "indian", label: "Indian" },
  { id: "mediterranean", label: "Mediterranean" },
  { id: "greek", label: "Greek" },
  { id: "bbq", label: "BBQ" },
  { id: "steakhouse", label: "Steakhouse" },
  { id: "seafood", label: "Seafood" },
  { id: "cajun", label: "Cajun" },
  { id: "southern", label: "Southern" },
  { id: "breakfast", label: "Breakfast" },
  { id: "brunch", label: "Brunch" },
  { id: "sandwiches", label: "Sandwiches" },
  { id: "deli", label: "Deli" },
  { id: "chicken", label: "Chicken" },
  { id: "wings", label: "Wings" },
  { id: "fast_food", label: "Fast Food" },
  { id: "cafe", label: "Cafe" },
  { id: "bakery", label: "Bakery" },
  { id: "dessert", label: "Dessert" },
  { id: "ice_cream", label: "Ice Cream" },
  { id: "coffee", label: "Coffee" },
  { id: "healthy", label: "Healthy" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "international", label: "International" },
  { id: "other", label: "Other" },
];

export const PRIMARY_CUISINES: CuisineId[] = [
  "anything",
  "american",
  "burgers",
  "pizza",
  "mexican",
  "italian",
  "chinese",
  "bbq",
  "steakhouse",
  "thai",
  "breakfast",
  "fast_food",
  "cafe",
];

export const CUISINE_LABEL: Record<CuisineId, string> = Object.fromEntries(
  CUISINE_CHIPS.map((c) => [c.id, c.label]),
) as Record<CuisineId, string>;

const OSM_CUISINE_MAP: Record<string, CuisineId[]> = {
  american: ["american"],
  burger: ["burgers", "american"],
  burgers: ["burgers", "american"],
  pizza: ["pizza"],
  mexican: ["mexican"],
  "tex-mex": ["tex-mex", "mexican"],
  texmex: ["tex-mex", "mexican"],
  italian: ["italian"],
  pasta: ["italian"],
  chinese: ["chinese"],
  japanese: ["japanese"],
  sushi: ["sushi", "japanese"],
  korean: ["korean"],
  thai: ["thai"],
  indian: ["indian"],
  mediterranean: ["mediterranean"],
  greek: ["greek", "mediterranean"],
  barbecue: ["bbq"],
  barbeque: ["bbq"],
  bbq: ["bbq"],
  steak: ["steakhouse"],
  steak_house: ["steakhouse"],
  steakhouse: ["steakhouse"],
  seafood: ["seafood"],
  fish: ["seafood"],
  fish_and_chips: ["seafood"],
  cajun: ["cajun"],
  creole: ["cajun"],
  southern: ["southern"],
  breakfast: ["breakfast"],
  brunch: ["brunch", "breakfast"],
  pancake: ["breakfast"],
  sandwich: ["sandwiches"],
  sandwiches: ["sandwiches"],
  deli: ["deli", "sandwiches"],
  chicken: ["chicken"],
  wings: ["wings", "chicken"],
  chicken_wings: ["wings", "chicken"],
  coffee: ["coffee", "cafe"],
  coffee_shop: ["coffee", "cafe"],
  cafe: ["cafe"],
  bakery: ["bakery"],
  dessert: ["dessert"],
  ice_cream: ["ice_cream", "dessert"],
  frozen_yogurt: ["ice_cream", "dessert"],
  vegetarian: ["vegetarian", "healthy"],
  vegan: ["vegetarian", "healthy"],
  healthy: ["healthy"],
  salad: ["healthy"],
  poke: ["healthy", "seafood"],
  asian: ["international"],
  noodle: ["international"],
  buffet: ["american"],
  diner: ["american", "breakfast"],
  juice: ["cafe"],
  gastropub: ["american"],
  regional: ["american"],
};

const PHOTO_BY_CUISINE: Partial<Record<CuisineId, PhotoKey>> = {
  pizza: "pizza",
  burgers: "american",
  american: "american",
  sandwiches: "american",
  deli: "american",
  chicken: "american",
  wings: "american",
  fast_food: "american",
  mexican: "mexican",
  "tex-mex": "mexican",
  italian: "italian",
  chinese: "asian",
  japanese: "asian",
  sushi: "asian",
  korean: "asian",
  indian: "asian",
  international: "asian",
  thai: "thai",
  mediterranean: "mediterranean",
  greek: "mediterranean",
  steakhouse: "steak",
  bbq: "bbq",
  seafood: "seafood",
  cajun: "seafood",
  breakfast: "cafe",
  brunch: "cafe",
  cafe: "cafe",
  bakery: "cafe",
  coffee: "cafe",
  southern: "cafe",
  healthy: "cafe",
  vegetarian: "cafe",
  dessert: "dessert",
  ice_cream: "dessert",
};

export function photoForCuisines(cuisines: CuisineId[]): PhotoKey {
  for (const id of cuisines) {
    const photo = PHOTO_BY_CUISINE[id];
    if (photo) return photo;
  }
  return "american";
}

export function cuisinePhotoSrc(key: PhotoKey): string {
  return `/food/${key}.jpg`;
}

export function mapOsmCuisines(raw: string | undefined, amenity?: string, name?: string): CuisineId[] {
  const ids = new Set<CuisineId>();
  const parts = (raw ?? "")
    .toLowerCase()
    .split(/[;,/]/)
    .map((part) => part.trim())
    .filter(Boolean);

  for (const part of parts) {
    const mapped = OSM_CUISINE_MAP[part] ?? OSM_CUISINE_MAP[part.replaceAll(" ", "_")];
    if (mapped) mapped.forEach((id) => ids.add(id));
  }

  if (amenity === "fast_food") ids.add("fast_food");
  if (amenity === "cafe") {
    ids.add("cafe");
    ids.add("coffee");
  }
  if (amenity === "ice_cream") {
    ids.add("ice_cream");
    ids.add("dessert");
  }

  if (ids.size === 0 && name) {
    inferFromName(name).forEach((id) => ids.add(id));
  }

  if (ids.size === 0) ids.add("other");
  return [...ids];
}

function inferFromName(name: string): CuisineId[] {
  const n = name.toLowerCase();
  if (/\b(taco|mexican|taqueria|habanero|torito|gringo|cantina|burrito)\b/.test(n)) return ["mexican"];
  if (/\b(pizza|pizzeria)\b/.test(n)) return ["pizza"];
  if (/\b(sushi|hibachi|ramen|teriyaki|tokyo|sakura)\b/.test(n)) return ["japanese", "sushi"];
  if (/\b(thai|kinnaree|noodle)\b/.test(n)) return ["thai"];
  if (/\b(chinese|panda|wok|dragon|bamboo|orient)\b/.test(n)) return ["chinese"];
  if (/\b(indian|rasoi|curry|tandoor)\b/.test(n)) return ["indian"];
  if (/\b(bbq|barbecue|smokehouse)\b/.test(n)) return ["bbq"];
  if (/\b(steakhouse|steak house|roadhouse)\b/.test(n)) return ["steakhouse"];
  if (/\b(burger|burgers)\b/.test(n)) return ["burgers", "american"];
  if (/\b(wing)\b/.test(n)) return ["wings", "chicken"];
  if (/\b(donut|doughnut|bakery)\b/.test(n)) return ["bakery", "dessert"];
  if (/\b(coffee|brew|starbucks)\b/.test(n)) return ["coffee", "cafe"];
  if (/\b(ice cream|custard|blizzard)\b/.test(n)) return ["ice_cream", "dessert"];
  if (/\b(breakfast|brunch|pancake|waffle|egg)\b/.test(n)) return ["breakfast", "brunch"];
  if (/\b(greek|gyro|mythos)\b/.test(n)) return ["greek", "mediterranean"];
  if (/\b(italian|pasta|olive garden)\b/.test(n)) return ["italian"];
  if (/\b(seafood|crab|fish)\b/.test(n)) return ["seafood"];
  return [];
}

export function cuisineLabelFor(ids: CuisineId[]): string {
  const visible = ids.filter((id) => id !== "anything" && id !== "other" && id !== "fast_food");
  if (visible.length === 0) {
    if (ids.includes("fast_food")) return "Fast Food";
    return "Restaurant";
  }
  return visible.slice(0, 2).map((id) => CUISINE_LABEL[id]).join(" / ");
}

export function isAnythingSelected(cuisines: CuisineId[]): boolean {
  return cuisines.length === 0 || cuisines.includes("anything");
}
