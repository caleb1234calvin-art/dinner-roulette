import type { CasinoAuditRecord } from "./casino-catalog";

const DELAWARE_SOURCE = "https://www.delottery.com/More/Table-Games";
const VERIFIED_ON = "2026-09-09";

const casino = (
  id: string,
  name: string,
  lat: number,
  lon: number,
  address: string,
  operator: string,
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
    jurisdiction: "Delaware",
    operator,
    identitySource: DELAWARE_SOURCE,
    coordinateSource,
    notes: "Delaware Lottery identifies exactly three racetrack casinos with table games: Delaware Park, Bally's Dover, and Harrington Raceway & Casino.",
  },
});

export const CASINO_CATALOG_PASS_6: CasinoAuditRecord[] = [
  casino("delaware-park", "Delaware Park Casino", 39.70299, -75.66808, "777 Delaware Park Blvd, Wilmington, DE 19804", "Delaware Racing Association", "https://delawarepark.com/", "https://commons.wikimedia.org/wiki/Category:Delaware_Park_(casino)"),
  casino("ballys-dover", "Bally's Dover Casino Resort", 39.189201, -75.532675, "1131 N Dupont Hwy, Dover, DE 19901", "Bally's Corporation", "https://casinos.ballys.com/dover/", "https://www.wikidata.org/wiki/Q5302482"),
  casino("harrington-raceway", "Harrington Raceway & Casino", 38.91253, -75.57443, "18500 S Dupont Hwy, Harrington, DE 19952", "Harrington Raceway, Inc.", "https://casino.harringtonraceway.com/", "https://www.wikidata.org/wiki/Q5664634"),
];
