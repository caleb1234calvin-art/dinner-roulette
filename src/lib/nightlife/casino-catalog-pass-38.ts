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

export const CASINO_CATALOG_PASS_38: NightlifePlace[] = [
  casino(
    "casino-catalog-nv-jerrys-nugget",
    "Jerry's Nugget Casino",
    36.1932,
    -115.13263,
    "1821 Las Vegas Blvd N, North Las Vegas, NV 89030",
    "https://www.jerrysnugget.com/",
  ),
];
