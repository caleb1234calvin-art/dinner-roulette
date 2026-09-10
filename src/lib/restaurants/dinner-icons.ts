import type { CuisineId, Restaurant } from "./types";

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

const DINNER_ICON_ROOT = "/dinner-icons";

export const DINNER_ICON_PATHS: Record<DinnerIconKey, string> = {
  burger: `${DINNER_ICON_ROOT}/burger.jpg`,
  pizza: `${DINNER_ICON_ROOT}/pizza.jpg`,
  mexican: `${DINNER_ICON_ROOT}/mexican.jpg`,
  chinese: `${DINNER_ICON_ROOT}/chinese.jpg`,
  japanese: `${DINNER_ICON_ROOT}/japanese.jpg`,
  italian: `${DINNER_ICON_ROOT}/italian.jpg`,
  steakhouse: `${DINNER_ICON_ROOT}/steakhouse.jpg`,
  bbq: `${DINNER_ICON_ROOT}/bbq.jpg`,
  chicken: `${DINNER_ICON_ROOT}/chicken.jpg`,
  "cafe-bakery": `${DINNER_ICON_ROOT}/cafe-bakery.jpg`,
  dessert: `${DINNER_ICON_ROOT}/dessert.jpg`,
  seafood: `${DINNER_ICON_ROOT}/seafood.jpg`,
  buffet: `${DINNER_ICON_ROOT}/buffet.jpg`,
  breakfast: `${DINNER_ICON_ROOT}/breakfast.jpg`,
  fallback: `${DINNER_ICON_ROOT}/fallback.jpg`,
};

const CUISINE_ICON_PRIORITY: Array<[CuisineId[], DinnerIconKey]> = [
  [["burgers", "fast_food"], "burger"],
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
];

function normalizedLabel(restaurant: Restaurant): string {
  return `${restaurant.name} ${restaurant.cuisineLabel}`.toLowerCase();
}

export function dinnerIconKey(restaurant: Restaurant): DinnerIconKey {
  const cuisines = new Set(restaurant.cuisines);

  for (const [candidates, icon] of CUISINE_ICON_PRIORITY) {
    if (candidates.some((cuisine) => cuisines.has(cuisine))) return icon;
  }

  const label = normalizedLabel(restaurant);
  if (label.includes("buffet") || label.includes("smorgasbord")) return "buffet";
  if (label.includes("burger")) return "burger";
  if (label.includes("pizza")) return "pizza";
  if (label.includes("taco") || label.includes("mexican")) return "mexican";
  if (label.includes("sushi") || label.includes("japanese")) return "japanese";
  if (label.includes("chinese")) return "chinese";
  if (label.includes("italian") || label.includes("pasta")) return "italian";
  if (label.includes("steak")) return "steakhouse";
  if (label.includes("bbq") || label.includes("barbecue") || label.includes("rib")) return "bbq";
  if (label.includes("chicken") || label.includes("wing")) return "chicken";
  if (label.includes("coffee") || label.includes("cafe") || label.includes("bakery")) return "cafe-bakery";
  if (label.includes("dessert") || label.includes("custard") || label.includes("ice cream") || label.includes("donut")) return "dessert";
  if (label.includes("seafood") || label.includes("fish")) return "seafood";
  if (label.includes("breakfast") || label.includes("brunch") || label.includes("pancake")) return "breakfast";

  switch (restaurant.photoKey) {
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

export function dinnerRestaurantIcon(restaurant: Restaurant): string {
  return DINNER_ICON_PATHS[dinnerIconKey(restaurant)];
}
