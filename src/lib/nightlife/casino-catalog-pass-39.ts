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

export const CASINO_CATALOG_PASS_39: NightlifePlace[] = [
  casino(
    "casino-catalog-nv-skyline-henderson",
    "Skyline Hotel & Casino",
    36.06229,
    -115.00823,
    "1741 N Boulder Hwy, Henderson, NV 89011",
    "https://skylinehotelandcasino.com/",
  ),
  casino(
    "casino-catalog-nv-emerald-island-henderson",
    "Emerald Island Casino",
    36.03251,
    -114.98463,
    "120 Market St, Henderson, NV 89015",
    "https://emeraldislandcasino.com/",
  ),
];
