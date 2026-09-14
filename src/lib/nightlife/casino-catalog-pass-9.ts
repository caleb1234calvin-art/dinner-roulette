import type { CasinoAuditRecord } from "./casino-catalog";

const ARKANSAS_DFA_SOURCE = "https://www.dfa.arkansas.gov/wp-content/uploads/FAQ_Casino_Gaming.pdf";
const RHODE_ISLAND_DBR_SOURCE = "https://dbr.ri.gov/gaming-and-athletics";
const VERIFIED_ON = "2026-09-09";

const casino = (
  id: string,
  name: string,
  lat: number,
  lon: number,
  address: string,
  jurisdiction: string,
  operator: string,
  website: string,
  identitySource: string,
  notes: string,
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
    jurisdiction,
    operator,
    identitySource,
    coordinateSource,
    notes,
  },
});

const ARKANSAS_NOTES = "Arkansas DFA Racing Commission materials identify three active casino licensees: Oaklawn, Southland, and Saracen.";
const RHODE_ISLAND_NOTES = "Rhode Island Department of Business Regulation gaming materials identify the state's two casino facilities: Bally's Twin River Lincoln and Bally's Tiverton.";

export const CASINO_CATALOG_PASS_9: CasinoAuditRecord[] = [
  casino("oaklawn", "Oaklawn Racing Casino Resort", 34.483333, -93.059722, "2705 Central Ave, Hot Springs, AR 71901", "Arkansas", "Oaklawn Jockey Club, Inc.", "https://oaklawn.com/", ARKANSAS_DFA_SOURCE, ARKANSAS_NOTES, "https://adeq.state.ar.us/home/pdssql/p_facil_details.aspx?AFIN=2600176&AFINDash=26-00176"),
  casino("southland", "Southland Casino Hotel", 35.16202, -90.159438, "1550 N Ingram Blvd, West Memphis, AR 72301", "Arkansas", "Southland Racing Corporation / Delaware North", "https://www.southlandcasino.com/", ARKANSAS_DFA_SOURCE, ARKANSAS_NOTES),
  casino("saracen", "Saracen Casino Resort", 34.2099, -91.9629, "1 Saracen Resort Dr, Pine Bluff, AR 71601", "Arkansas", "Saracen Development LLC / Quapaw Nation", "https://www.saracenresort.com/", ARKANSAS_DFA_SOURCE, ARKANSAS_NOTES),
  casino("ballys-twin-river-lincoln", "Bally's Twin River Lincoln Casino Resort", 41.88833, -71.44861, "100 Twin River Rd, Lincoln, RI 02865", "Rhode Island", "Bally's Corporation", "https://casinos.ballys.com/lincoln/", RHODE_ISLAND_DBR_SOURCE, RHODE_ISLAND_NOTES, "https://www.wikidata.org/wiki/Q7858275"),
  casino("ballys-tiverton", "Bally's Tiverton Casino", 41.6587, -71.1803, "777 Tiverton Casino Blvd, Tiverton, RI 02878", "Rhode Island", "Bally's Corporation", "https://casinos.ballys.com/tiverton/", RHODE_ISLAND_DBR_SOURCE, RHODE_ISLAND_NOTES),
];
