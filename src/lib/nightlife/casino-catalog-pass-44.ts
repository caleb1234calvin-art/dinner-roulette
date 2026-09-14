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

export const CASINO_CATALOG_PASS_44: NightlifePlace[] = [
  casino(
    "casino-catalog-nv-club-fortune-north-north-las-vegas",
    "Club Fortune North",
    36.2100482,
    -115.107488,
    "2757 Las Vegas Blvd N, North Las Vegas, NV 89030",
    "https://clubfortunecasino.com/",
  ),
];
