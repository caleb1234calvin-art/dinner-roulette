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

/**
 * Specific cuisines must win over broad provider tags such as fast_food or
 * american. Providers commonly return both (for example dessert + fast_food),
 * and the broad tag previously forced obviously wrong artwork.
 */
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
 * The generated image pack was saved under semantic filenames in a different
 * order from the actual objects. Map semantic intent to the object that is
 * visibly present in the current pack. When the pack has no trustworthy match
 * (burger/sandwich/general restaurant), prefer the neutral covered-dish tile
 * rather than showing a confidently wrong food.
 */
const ICON_ASSET_KEY: Record<DinnerIconKey, DinnerIconKey> = {
  burger: "seafood",       // neutral covered dish
  pizza: "burger",         // pizza slice
  mexican: "fallback",     // taco
  chinese: "pizza",        // dumplings
  japanese: "pizza",       // neutral Asian dumplings
  italian: "mexican",      // pasta
  steakhouse: "chinese",   // steak
  bbq: "chicken",          // ribs
  chicken: "japanese",     // fried chicken
  "cafe-bakery": "cafe-bakery", // cake / cafe-adjacent
  dessert: "cafe-bakery",  // cake
  seafood: "dessert",      // fish / shellfish
  buffet: "buffet",
  breakfast: "breakfast",
  fallback: "seafood",     // neutral covered dish
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
  if (label.includes("seafood") || label.includes("fish") || label.includes("crab") || label.includes("sushi")) return "seafood";
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
