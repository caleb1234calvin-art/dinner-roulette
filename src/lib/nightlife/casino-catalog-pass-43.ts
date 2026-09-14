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

export const CASINO_CATALOG_PASS_43: NightlifePlace[] = [
  casino(
    "casino-catalog-nv-wildfire-fremont-las-vegas",
    "Wildfire on Fremont",
    36.1556,
    -115.1135,
    "2700 E Fremont St, Las Vegas, NV 89104",
    "https://wildfiregaming.com/wildfires/wildfire-on-fremont/",
  ),
];
