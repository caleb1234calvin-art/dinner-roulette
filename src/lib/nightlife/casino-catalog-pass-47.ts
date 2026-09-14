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

export const CASINO_CATALOG_PASS_47: NightlifePlace[] = [
  casino(
    "casino-catalog-ok-coweta-casino-hotel",
    "Coweta Casino Hotel",
    35.97281,
    -95.66006,
    "13185 Oklahoma 51, Coweta, OK 74429",
    "https://cowetacasinohotel.com/",
  ),
];
