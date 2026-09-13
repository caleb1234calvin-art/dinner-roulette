import type { NightlifePlace } from "./types";

const casino = (
  id: string,
  name: string,
  lat: number,
  lon: number,
  address: string,
  website: string,
): NightlifePlace => ({
  id,
  name,
  lat,
  lon,
  address,
  cuisines: ["other"],
  cuisineLabel: "Casino",
  priceLevel: null,
  rating: null,
  reviewCount: null,
  openingHours: null,
  phone: null,
  website,
  isChain: false,
  photoKey: "cafe",
  source: "catalog",
  venueTypes: ["casino"],
  energyLevel: 2,
});

export const CASINO_CATALOG_PASS_49: NightlifePlace[] = [
  casino(
    "casino-catalog-nv-cadence-crossing",
    "Cadence Crossing Casino",
    36.052633,
    -114.994834,
    "920 N Boulder Hwy, Henderson, NV 89011",
    "https://cadencecrossing.boydgaming.com/",
  ),
];
