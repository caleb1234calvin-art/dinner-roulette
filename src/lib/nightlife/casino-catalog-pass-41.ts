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

export const CASINO_CATALOG_PASS_41: NightlifePlace[] = [
  casino(
    "casino-catalog-nv-club-fortune-henderson",
    "Club Fortune Casino",
    36.01776,
    -114.94821,
    "725 S Racetrack Rd, Henderson, NV 89015",
    "https://clubfortunecasino.com/",
  ),
  casino(
    "casino-catalog-nv-rainbow-club-henderson",
    "Rainbow Club Casino",
    36.03269,
    -114.98372,
    "122 S Water St, Henderson, NV 89015",
    "https://rainbowhenderson.com/",
  ),
];
