import type { CasinoAuditRecord } from "./casino-catalog";

const ARKANSAS_DFA_SOURCE = "https://www.dfa.arkansas.gov/wp-content/uploads/FAQ_Casino_Gaming.pdf";
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
    jurisdiction: "Arkansas",
    operator,
    identitySource: ARKANSAS_DFA_SOURCE,
    coordinateSource,
    notes: "Arkansas DFA Racing Commission materials identify three active casino licensees: Oaklawn, Southland, and Saracen.",
  },
});

export const CASINO_CATALOG_PASS_9: CasinoAuditRecord[] = [
  casino("oaklawn", "Oaklawn Racing Casino Resort", 34.483333, -93.059722, "2705 Central Ave, Hot Springs, AR 71901", "Oaklawn Jockey Club, Inc.", "https://oaklawn.com/", "https://adeq.state.ar.us/home/pdssql/p_facil_details.aspx?AFIN=2600176&AFINDash=26-00176"),
  casino("southland", "Southland Casino Hotel", 35.16202, -90.159438, "1550 N Ingram Blvd, West Memphis, AR 72301", "Southland Racing Corporation / Delaware North", "https://www.southlandcasino.com/"),
  casino("saracen", "Saracen Casino Resort", 34.2099, -91.9629, "1 Saracen Resort Dr, Pine Bluff, AR 71601", "Saracen Development LLC / Quapaw Nation", "https://www.saracenresort.com/"),
];
