import type { CasinoAuditRecord } from "./casino-catalog";

const NIGC_SOURCE = "https://www.nigc.gov/downloads/gaming-locations/";
const VERIFIED_ON = "2026-09-09";
const NOTES = "NIGC gaming-location records identify three Poarch Band of Creek Indians casino properties in Alabama. Wind Creek Hospitality's current property pages confirm all three are operating at their current addresses.";

const casino = (
  id: string,
  name: string,
  lat: number,
  lon: number,
  address: string,
  website: string,
  coordinateSource?: string,
): CasinoAuditRecord => ({
  id: `casino-catalog-${id}`,
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
  audit: {
    verifiedOn: VERIFIED_ON,
    jurisdiction: "Alabama",
    operator: "Poarch Band of Creek Indians / Wind Creek Hospitality",
    identitySource: NIGC_SOURCE,
    coordinateSource,
    notes: NOTES,
  },
});

export const CASINO_CATALOG_PASS_12: CasinoAuditRecord[] = [
  casino("wind-creek-atmore", "Wind Creek Atmore", 31.10444, -87.48291, "303 Poarch Rd, Atmore, AL 36502", "https://windcreek.com/atmore"),
  casino("wind-creek-montgomery", "Wind Creek Montgomery", 32.42517, -86.13916, "1801 Eddie L. Tullis Rd, Montgomery, AL 36117", "https://windcreek.com/montgomery", "https://www.openstreetmap.org/way/1119996013"),
  casino("wind-creek-wetumpka", "Wind Creek Wetumpka", 32.52712, -86.21004, "100 River Oaks Dr, Wetumpka, AL 36092", "https://windcreek.com/wetumpka", "https://www.openstreetmap.org/way/765779263"),
];
