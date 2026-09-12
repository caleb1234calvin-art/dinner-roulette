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

export const CASINO_CATALOG_PASS_46: NightlifePlace[] = [
  casino(
    "casino-catalog-nv-bonanza-inn-casino-fallon",
    "Bonanza Inn & Casino",
    39.473817,
    -118.786436,
    "855 W Williams Ave, Fallon, NV 89406",
    "https://www.wyndhamhotels.com/super-8/fallon-nevada/super-8-fallon/overview",
  ),
];
