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

export const CASINO_CATALOG_PASS_45: NightlifePlace[] = [
  casino(
    "casino-catalog-nv-nevada-casino-bar-battle-mountain",
    "The Nevada Casino & Bar",
    40.6420387,
    -116.9344845,
    "36 E Front St, Battle Mountain, NV 89820",
    "https://www.google.com/travel/hotels/entity/CgoI9r20oIDi27AeEAE",
  ),
];
