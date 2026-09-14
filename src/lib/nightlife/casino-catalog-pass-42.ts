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

export const CASINO_CATALOG_PASS_42: NightlifePlace[] = [
  casino(
    "casino-catalog-nv-longstreet-amargosa-valley",
    "Longstreet Inn, Casino & RV Resort",
    36.41254,
    -116.4246,
    "8570 S Nevada Highway 373, Amargosa Valley, NV 89020",
    "https://www.longstreetcasino.com/",
  ),
];
