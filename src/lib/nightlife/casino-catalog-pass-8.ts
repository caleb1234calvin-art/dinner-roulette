import type { CasinoAuditRecord } from "./casino-catalog";

const MISSOURI_MGC_SOURCE = "https://mgc.dps.mo.gov/MGCwebCrystalReports/dxClassALicensee.aspx";
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
    jurisdiction: "Missouri",
    operator,
    identitySource: MISSOURI_MGC_SOURCE,
    coordinateSource,
    notes: "Missouri Gaming Commission operator-license and contact records reconcile the state's 13 current licensed riverboat casino properties.",
  },
});

export const CASINO_CATALOG_PASS_8: CasinoAuditRecord[] = [
  casino("ameristar-kansas-city", "Ameristar Casino Kansas City", 39.15014, -94.48399, "3200 NE Ameristar Dr, Kansas City, MO 64161", "Boyd Gaming Corporation", "https://ameristarkansascity.boydgaming.com/", "https://www.wikidata.org/wiki/Q4745797"),
  casino("ameristar-st-charles", "Ameristar Casino St. Charles", 38.76667, -90.4875, "1 Ameristar Blvd, St. Charles, MO 63301", "Boyd Gaming Corporation", "https://ameristarstcharles.boydgaming.com/"),
  casino("argosy-riverside", "Argosy Riverside Casino", 39.16139, -94.62032, "777 NW Argosy Pkwy, Riverside, MO 64150", "PENN Entertainment, Inc.", "https://www.argosykansascity.com/", "https://www.openstreetmap.org/way/587783942"),
  casino("century-cape-girardeau", "Century Casino Cape Girardeau", 37.31361, -89.51694, "777 N Main St, Cape Girardeau, MO 63701", "Century Casinos, Inc.", "https://www.cnty.com/cape-girardeau/"),
  casino("century-caruthersville", "Century Casino Caruthersville", 36.19037, -89.65008, "777 E 3rd St, Caruthersville, MO 63830", "Century Casinos, Inc.", "https://www.cnty.com/caruthersville/", "https://www.openstreetmap.org/way/314591925"),
  casino("harrahs-kansas-city", "Harrah's Kansas City", 39.148548, -94.535371, "1 Riverboat Dr, North Kansas City, MO 64116", "Caesars Entertainment, Inc.", "https://www.caesars.com/harrahs-kansas-city", "https://www.wikidata.org/wiki/Q14704299"),
  casino("hollywood-st-louis", "Hollywood Casino St. Louis", 38.75425, -90.48306, "777 Casino Center Dr, Maryland Heights, MO 63043", "PENN Entertainment, Inc.", "https://www.hollywoodcasinostlouis.com/"),
  casino("isle-boonville", "Isle of Capri Casino Boonville", 38.97719, -92.74925, "100 Isle of Capri Blvd, Boonville, MO 65233", "Caesars Entertainment, Inc.", "https://www.isleofcapriboonville.com/"),
  casino("ballys-kansas-city", "Bally's Kansas City Casino", 39.12194, -94.56278, "1800 E Front St, Kansas City, MO 64120", "Bally's Corporation", "https://casinos.ballys.com/kansas-city/"),
  casino("horseshoe-st-louis", "Horseshoe St. Louis Casino", 38.63368, -90.18487, "999 N 2nd St, St. Louis, MO 63102", "Caesars Entertainment, Inc.", "https://www.caesars.com/horseshoe-st-louis"),
  casino("mark-twain", "Mark Twain Casino", 40.03595, -91.49965, "104 Pierce St, LaGrange, MO 63448", "Affinity Interactive", "https://marktwaincasinolagrange.com/", "https://www.openstreetmap.org/way/878855733"),
  casino("river-city-st-louis", "River City Casino", 38.5308, -90.26451, "777 River City Casino Blvd, St. Louis, MO 63125", "PENN Entertainment, Inc.", "https://www.rivercity.com/", "https://www.openstreetmap.org/way/328849076"),
  casino("st-jo-frontier", "St. Jo Frontier Casino", 39.78366, -94.87617, "777 Winners Cir, St. Joseph, MO 64505", "Affinity Interactive", "https://www.stjofrontiercasino.com/"),
];
