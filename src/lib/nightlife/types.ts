import type {
  DecoratedRestaurant,
  DistanceMiles,
  PriceLevel,
  Restaurant,
} from "@/lib/restaurants/types";

export type HomeMode = "dinner" | "nightlife" | "date-night";

export type NightlifeTypeId =
  | "anything"
  | "bar"
  | "pub"
  | "club"
  | "lounge"
  | "brewery"
  | "casino"
  | "comedy-club";

export type ConcreteNightlifeType = Exclude<NightlifeTypeId, "anything">;

export interface NightlifeFilters {
  radiusMiles: DistanceMiles;
  minPrice: PriceLevel;
  maxPrice: PriceLevel;
  venueTypes: NightlifeTypeId[];
  energy: number;
  openNowOnly: boolean;
  includeUnknownPrice: boolean;
  stretchRadius: boolean;
  favoritesOnly: boolean;
}

export interface NightlifePlace extends Restaurant {
  venueTypes: ConcreteNightlifeType[];
  energyLevel: 1 | 2 | 3;
}

export interface DecoratedNightlifePlace extends DecoratedRestaurant {
  venueTypes: ConcreteNightlifeType[];
  energyLevel: 1 | 2 | 3;
}

export interface NightlifeSearchResponse {
  venues: NightlifePlace[];
  source: "live" | "merged" | "fallback";
  warning?: string;
}

export const DEFAULT_NIGHTLIFE_FILTERS: NightlifeFilters = {
  radiusMiles: 10,
  minPrice: 1,
  maxPrice: 4,
  venueTypes: ["anything"],
  energy: 50,
  openNowOnly: true,
  includeUnknownPrice: true,
  stretchRadius: false,
  favoritesOnly: false,
};

export const NIGHTLIFE_TYPE_CHIPS: ReadonlyArray<{
  id: NightlifeTypeId;
  label: string;
  iconSrc?: string;
}> = [
  { id: "anything", label: "Anything" },
  { id: "bar", label: "Bar" },
  { id: "pub", label: "Pub" },
  { id: "club", label: "Club" },
  { id: "lounge", label: "Lounge" },
  { id: "brewery", label: "Brewery / Beer Garden" },
  { id: "casino", label: "Casino" },
  { id: "comedy-club", label: "Comedy Club" },
];

export const NIGHTLIFE_TAGLINES = [
  "The night has spoken.",
  "That's the move.",
  "No group chat debate required.",
  "Tonight starts here.",
  "Decision made. Go make a night of it.",
  "The roulette picked the first stop.",
] as const;

export function nightlifeEnergyLabel(value: number): string {
  if (value < 34) return "Chill";
  if (value < 67) return "Balanced";
  return "Lively";
}

export function nightlifeTypeLabel(types: readonly ConcreteNightlifeType[]): string {
  if (types.includes("casino")) return "Casino";
  if (types.includes("comedy-club")) return "Comedy Club";
  if (types.includes("club")) return "Nightclub";
  if (types.includes("lounge")) return "Lounge";
  if (types.includes("brewery")) return "Brewery / Beer Garden";
  if (types.includes("pub")) return "Pub";
  return "Bar";
}

export function nightlifeArtwork(types: readonly ConcreteNightlifeType[]): string | null {
  if (types.includes("casino")) return "/grok_1788913461447.jpg";
  if (types.includes("comedy-club")) return "/grok_1788914079961.jpg";
  return null;
}