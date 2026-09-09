import type { CasinoAuditRecord } from "./casino-catalog";

const KHRG_SOURCE = "https://khrc.ky.gov/new_docs.aspx?cat=46";
const VERIFIED_ON = "2026-09-09";
const NOTES = "Kentucky Horse Racing & Gaming's current facility roster plus its FY2026 historical-horse-racing reporting reconcile fourteen active casino-style HHR destinations. Sandy's Racing & Gaming is included because current wagering reports show active HHR play even though the regulator's page currently lists it under quarter-horse tracks rather than repeating it in the HHR subsection.";

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
    jurisdiction: "Kentucky",
    operator,
    identitySource: KHRG_SOURCE,
    coordinateSource,
    notes: NOTES,
  },
});

export const CASINO_CATALOG_PASS_14: CasinoAuditRecord[] = [
  casino("derby-city-gaming-hotel", "Derby City Gaming & Hotel", 38.18554, -85.70946, "4520 Poplar Level Rd, Louisville, KY 40213", "Churchill Downs Incorporated", "https://hotel.derbycitygaming.com/", "https://mapcarta.com/W1085691479"),
  casino("derby-city-gaming-downtown", "Derby City Gaming Downtown", 38.2556721, -85.7572527, "401 W Market St, Louisville, KY 40202", "Churchill Downs Incorporated", "https://downtown.derbycitygaming.com/"),
  casino("ellis-park", "Ellis Park Racing & Gaming", 37.91643, -87.5439, "3300 US-41 N, Henderson, KY 42420", "Churchill Downs Incorporated", "https://ellisparkracing.com/locations/ellis-park/"),
  casino("kentucky-downs", "The Mint Gaming Hall at Kentucky Downs", 36.6415454, -86.5622737, "5629 Nashville Rd, Franklin, KY 42134", "Kentucky Downs, LLC", "https://themintgaming.com/"),
  casino("marshall-yards", "Marshall Yards Racing & Gaming", 37.001912, -88.328076, "65 Campbell Dr, Calvert City, KY 42029", "Churchill Downs Incorporated", "https://www.marshallyardsgaming.com/"),
  casino("mint-bowling-green", "The Mint Gaming Hall Bowling Green", 36.951902, -86.428931, "2475 Scottsville Rd, Ste 101 & 102, Bowling Green, KY 42104", "Kentucky Downs, LLC", "https://themintbowlinggreen.com/"),
  casino("mint-cumberland-run", "The Mint Gaming Hall Cumberland Run", 36.9248184, -84.0564921, "777 Winners Ln, Corbin, KY 40701", "Kentucky Downs, LLC", "https://themintcumberlandrun.com/"),
  casino("mint-cumberland", "The Mint Gaming Hall Cumberland", 36.7268313, -84.1710975, "244 Penny Ln, Williamsburg, KY 40769", "Kentucky Downs, LLC", "https://themintcumberland.com/"),
  casino("newport-racing-gaming", "Newport Racing & Gaming", 39.0838588, -84.4806886, "1723 Monmouth St, Newport, KY 41071", "Churchill Downs Incorporated", "https://www.newportrg.com/"),
  casino("oak-grove-racing-gaming", "Oak Grove Racing, Gaming & Hotel", 36.661324, -87.43631, "777 Winners Way, Oak Grove, KY 42262", "Churchill Downs Incorporated", "https://www.oakgrovegaming.com/"),
  casino("owensboro-racing-gaming", "Owensboro Racing & Gaming", 37.825962, -87.0247, "460 Wrights Landing Rd, Owensboro, KY 42303", "Churchill Downs Incorporated", "https://www.ellisparkowensborogaming.com/locations/owensboro/"),
  casino("red-mile", "The Red Mile", 38.0409133, -84.5174322, "1200 Red Mile Rd, Lexington, KY 40504", "Lexington Trots Breeders Association", "https://redmileky.com/"),
  casino("turfway-park", "Turfway Park Racing & Gaming", 39.0217, -84.6336, "7500 Turfway Rd, Florence, KY 41042", "Churchill Downs Incorporated", "https://www.turfway.com/"),
  casino("sandys-racing-gaming", "Sandy's Racing & Gaming", 38.4054, -82.6999, "10775 US Route 60, Ashland, KY 41102", "Revolutionary Racing Kentucky, LLC", "https://sandysgaming.com/"),
];
