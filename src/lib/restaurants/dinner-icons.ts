import type { ThemeId } from "../theme";
import type { CuisineId, PhotoKey, Restaurant } from "./types";

export type DinnerIconKey =
  | "burger"
  | "pizza"
  | "mexican"
  | "chinese"
  | "japanese"
  | "italian"
  | "steakhouse"
  | "bbq"
  | "chicken"
  | "cafe-bakery"
  | "dessert"
  | "seafood"
  | "buffet"
  | "breakfast"
  | "fallback";

const CUISINE_ICON_PRIORITY: Array<[CuisineId[], DinnerIconKey]> = [
  [["pizza"], "pizza"],
  [["mexican", "tex-mex"], "mexican"],
  [["chinese"], "chinese"],
  [["japanese", "sushi", "korean", "thai"], "japanese"],
  [["italian"], "italian"],
  [["steakhouse"], "steakhouse"],
  [["bbq", "southern"], "bbq"],
  [["chicken", "wings"], "chicken"],
  [["cafe", "bakery", "coffee"], "cafe-bakery"],
  [["dessert", "ice_cream"], "dessert"],
  [["seafood", "cajun"], "seafood"],
  [["breakfast", "brunch"], "breakfast"],
  [["burgers"], "burger"],
  [["sandwiches", "deli", "fast_food", "american", "healthy", "vegetarian", "international", "other"], "fallback"],
];

/**
 * Verified by visually inspecting the existing dark Dinner asset pack on the
 * hosted preview. These filenames were historically organized under labels
 * that do not match the object actually depicted, so semantic intent is mapped
 * to the verified artwork here without replacing any user-owned images.
 */
const ICON_ASSET_KEY: Record<DinnerIconKey, DinnerIconKey> = {
  burger: "bbq",            // burger
  pizza: "burger",          // pizza slice
  mexican: "fallback",      // taco
  chinese: "pizza",         // dumplings
  japanese: "breakfast",    // sushi
  italian: "mexican",       // pasta
  steakhouse: "chinese",    // steak
  bbq: "chicken",           // ribs
  chicken: "japanese",      // fried chicken
  "cafe-bakery": "italian", // coffee + croissant
  dessert: "cafe-bakery",   // cake
  seafood: "dessert",       // fish / shellfish
  buffet: "seafood",        // neutral covered dish
  breakfast: "buffet",      // pancakes
  fallback: "seafood",      // neutral covered dish
};

function normalizedLabel(name: string, cuisineLabel = ""): string {
  return `${name} ${cuisineLabel}`.toLowerCase();
}

export function dinnerIconKeyFromVisual(name: string, photoKey: PhotoKey, cuisineLabel = ""): DinnerIconKey {
  const label = normalizedLabel(name, cuisineLabel);
  if (label.includes("golden corral") || label.includes("buffet") || label.includes("smorgasbord")) return "buffet";
  if (label.includes("pizza")) return "pizza";
  if (label.includes("taco") || label.includes("mexican")) return "mexican";
  if (label.includes("sushi") || label.includes("japanese") || label.includes("thai") || label.includes("noodle")) return "japanese";
  if (label.includes("chinese")) return "chinese";
  if (label.includes("italian") || label.includes("pasta")) return "italian";
  if (label.includes("steak")) return "steakhouse";
  if (label.includes("bbq") || label.includes("barbecue") || label.includes("rib")) return "bbq";
  if (label.includes("chicken") || label.includes("wing")) return "chicken";
  if (label.includes("coffee") || label.includes("cafe") || label.includes("bakery")) return "cafe-bakery";
  if (label.includes("dessert") || label.includes("custard") || label.includes("ice cream") || label.includes("donut")) return "dessert";
  if (label.includes("seafood") || label.includes("fish") || label.includes("crab")) return "seafood";
  if (label.includes("breakfast") || label.includes("brunch") || label.includes("pancake")) return "breakfast";
  if (label.includes("burger")) return "burger";
  if (label.includes("sandwich") || label.includes("subway") || label.includes("deli")) return "fallback";

  switch (photoKey) {
    case "pizza": return "pizza";
    case "mexican": return "mexican";
    case "italian": return "italian";
    case "asian":
    case "thai": return "japanese";
    case "steak": return "steakhouse";
    case "bbq": return "bbq";
    case "seafood": return "seafood";
    case "cafe": return "cafe-bakery";
    case "dessert": return "dessert";
    default: return "fallback";
  }
}

export function dinnerIconKey(restaurant: Restaurant): DinnerIconKey {
  const cuisines = new Set(restaurant.cuisines);

  for (const [candidates, icon] of CUISINE_ICON_PRIORITY) {
    if (candidates.some((cuisine) => cuisines.has(cuisine))) return icon;
  }

  return dinnerIconKeyFromVisual(restaurant.name, restaurant.photoKey, restaurant.cuisineLabel);
}

export function dinnerIconPath(key: DinnerIconKey, theme: ThemeId): string {
  return `/dinner-icons/${theme}/${ICON_ASSET_KEY[key]}.jpg`;
}

export function dinnerRestaurantIcon(restaurant: Restaurant, theme: ThemeId): string {
  return dinnerIconPath(dinnerIconKey(restaurant), theme);
}
