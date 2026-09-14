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

export const CASINO_CATALOG_PASS_48: NightlifePlace[] = [
  casino(
    "casino-catalog-ok-cherokee-south-coffeyville",
    "Cherokee Casino South Coffeyville",
    36.9825777,
    -95.6283822,
    "1506 US-169, South Coffeyville, OK 74072",
    "https://cherokeecasino.com/casinos/south-coffeyville",
  ),
];
