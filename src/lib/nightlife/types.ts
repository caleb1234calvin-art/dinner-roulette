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
  | "casino";

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
  // Saved casinos often have unconfirmed hours; strict Open now is opt-in.
  openNowOnly: false,
  includeUnknownPrice: true,
  stretchRadius: false,
  favoritesOnly: false,
};

const NIGHTLIFE_ARTWORK: Record<ConcreteNightlifeType, string> = {
  bar: "/grok_1789341445435.jpg",
  pub: "/grok_1789340964876.jpg",
  club: "/grok_1789340968434.jpg",
  lounge: "/grok_1789340971434.jpg",
  brewery: "/grok_1789340974874.jpg",
  casino: "/grok_1788913461447.jpg",
};

export const NIGHTLIFE_TYPE_CHIPS: ReadonlyArray<{
  id: NightlifeTypeId;
  label: string;
  iconSrc?: string;
}> = [
  { id: "anything", label: "Anything" },
  { id: "bar", label: "Bar", iconSrc: NIGHTLIFE_ARTWORK.bar },
  { id: "pub", label: "Pub", iconSrc: NIGHTLIFE_ARTWORK.pub },
  { id: "club", label: "Club", iconSrc: NIGHTLIFE_ARTWORK.club },
  { id: "lounge", label: "Lounge", iconSrc: NIGHTLIFE_ARTWORK.lounge },
  { id: "brewery", label: "Brewery / Beer Garden", iconSrc: NIGHTLIFE_ARTWORK.brewery },
  { id: "casino", label: "Casino", iconSrc: NIGHTLIFE_ARTWORK.casino },
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
  if (types.includes("club")) return "Nightclub";
  if (types.includes("lounge")) return "Lounge";
  if (types.includes("brewery")) return "Brewery / Beer Garden";
  if (types.includes("pub")) return "Pub";
  return "Bar";
}

export function nightlifeArtwork(types: readonly ConcreteNightlifeType[]): string | null {
  if (types.includes("casino")) return NIGHTLIFE_ARTWORK.casino;
  if (types.includes("club")) return NIGHTLIFE_ARTWORK.club;
  if (types.includes("lounge")) return NIGHTLIFE_ARTWORK.lounge;
  if (types.includes("brewery")) return NIGHTLIFE_ARTWORK.brewery;
  if (types.includes("pub")) return NIGHTLIFE_ARTWORK.pub;
  if (types.includes("bar")) return NIGHTLIFE_ARTWORK.bar;
  return null;
}
