export const PRICE_LABELS = ["$", "$$", "$$$", "$$$$"] as const;
export type PriceLevel = 1 | 2 | 3 | 4;

export const DISTANCE_OPTIONS = [1, 3, 5, 10, 15, 20, 30] as const;
export type DistanceMiles = (typeof DISTANCE_OPTIONS)[number];

export type ChainPreference = "both" | "local" | "chains";

export type CuisineId =
  | "anything"
  | "american"
  | "burgers"
  | "pizza"
  | "mexican"
  | "tex-mex"
  | "italian"
  | "chinese"
  | "japanese"
  | "sushi"
  | "korean"
  | "thai"
  | "indian"
  | "mediterranean"
  | "greek"
  | "bbq"
  | "steakhouse"
  | "seafood"
  | "cajun"
  | "southern"
  | "breakfast"
  | "brunch"
  | "sandwiches"
  | "deli"
  | "chicken"
  | "wings"
  | "fast_food"
  | "cafe"
  | "bakery"
  | "dessert"
  | "ice_cream"
  | "coffee"
  | "healthy"
  | "vegetarian"
  | "international"
  | "other";

export type PhotoKey =
  | "american"
  | "pizza"
  | "mexican"
  | "italian"
  | "asian"
  | "thai"
  | "mediterranean"
  | "steak"
  | "bbq"
  | "seafood"
  | "cafe"
  | "dessert";

export interface Restaurant {
  id: string;
  name: string;
  lat: number;
  lon: number;
  address: string;
  cuisines: CuisineId[];
  cuisineLabel: string;
  priceLevel: PriceLevel | null;
  rating: number | null;
  reviewCount: number | null;
  openingHours: string | null;
  phone: string | null;
  website: string | null;
  isChain: boolean;
  photoKey: PhotoKey;
  source: "osm" | "catalog" | "merged";
}

export interface DecoratedRestaurant extends Restaurant {
  distanceMiles: number;
  isOpen: boolean;
  hoursKnown: boolean;
  closesLabel: string | null;
  closingSoon: boolean;
}

export interface SearchLocation {
  lat: number;
  lon: number;
  label: string;
  source: "geo" | "manual" | "default";
}

export interface SearchQuery {
  lat: number;
  lon: number;
  radiusMiles: number;
}

export interface SearchResponse {
  restaurants: Restaurant[];
  source: "live" | "fallback";
  warning?: string;
}

export interface GeocodeResult {
  lat: number;
  lon: number;
  label: string;
}

export interface RestaurantPreference {
  restaurantId: string;
  name: string;
  favorite: boolean;
  ourRating: number | null;
  timesVisited: number;
  lastVisited: string | null;
  neverRecommend: boolean;
  cuisineLabel?: string;
  photoKey?: PhotoKey;
  lat?: number;
  lon?: number;
  address?: string;
  priceLevel?: PriceLevel | null;
}

export interface VisitRecord {
  id: string;
  restaurantId: string;
  restaurantName: string;
  cuisineLabel: string;
  date: string;
  personalRating: number | null;
  note: string;
}

export interface TemporaryExclusion {
  restaurantId: string;
  name: string;
  expiresAt: number;
  reason: "not-tonight";
}

export interface AppFilters {
  radiusMiles: DistanceMiles;
  minPrice: PriceLevel;
  maxPrice: PriceLevel;
  cuisines: CuisineId[];
  adventure: number;
  openNowOnly: boolean;
  includeUnknownPrice: boolean;
  stretchRadius: boolean;
  neverRecommendOneStar: boolean;
  chainPreference: ChainPreference;
  favoritesOnly: boolean;
}

export const DEFAULT_LOCATION: SearchLocation = {
  lat: 37.084184,
  lon: -94.513339,
  label: "Joplin, Missouri",
  source: "default",
};

export const DEFAULT_FILTERS: AppFilters = {
  radiusMiles: 10,
  minPrice: 1,
  maxPrice: 4,
  cuisines: ["anything"],
  adventure: 50,
  openNowOnly: true,
  includeUnknownPrice: true,
  stretchRadius: false,
  neverRecommendOneStar: true,
  chainPreference: "both",
  favoritesOnly: false,
};

export const TAGLINES = [
  "The universe has decided.",
  "Tonight, we're eating here.",
  "No more debating.",
  "Decision made.",
  "The wheel has spoken.",
  "Dinner has been chosen.",
] as const;
