import type { CasinoAuditRecord } from "./casino-catalog";

const MAINE_GCU_SOURCE = "https://www.maine.gov/dps/gcu/casino-gaming";
const KANSAS_KRGC_SOURCE = "https://krgc.kansas.gov/regulated-info/licensing-security/certified-lottery-gaming-facility-managers/";
const KANSAS_NIGC_SOURCE = "https://www.nigc.gov/downloads/gaming-locations/";
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

const MAINE_NOTES = "Maine Gambling Control Unit identifies exactly two current casino facilities: Hollywood Casino Bangor and Oxford Casino.";
const KANSAS_STATE_NOTES = "Kansas Racing and Gaming Commission identifies four state-owned lottery gaming facilities under the app's physical casino scope.";
const KANSAS_TRIBAL_NOTES = "NIGC and tribal sources reconcile six Kansas tribal casino facilities; convenience and one-stop gaming outlets are excluded from the physical casino-venue scope.";

export const CASINO_CATALOG_PASS_10: CasinoAuditRecord[] = [
  casino("hollywood-bangor", "Hollywood Casino Bangor", 44.78855, -68.77708, "500 Main St, Bangor, ME 04401", "Maine", "PENN Entertainment", "https://www.hollywoodcasinobangor.com/", MAINE_GCU_SOURCE, MAINE_NOTES, "https://www.openstreetmap.org/way/698223484"),
  casino("oxford-maine", "Oxford Casino Hotel & Sportsbook", 44.11505, -70.44592, "777 Casino Way, Oxford, ME 04270", "Maine", "Churchill Downs Incorporated", "https://www.oxfordcasino.com/", MAINE_GCU_SOURCE, MAINE_NOTES, "https://www.openstreetmap.org/way/583799433"),

  casino("hollywood-kansas-speedway", "Hollywood Casino at Kansas Speedway", 39.11187, -94.82763, "777 Hollywood Casino Blvd, Kansas City, KS 66111", "Kansas", "PENN Entertainment", "https://www.hollywoodcasinokansas.com/", KANSAS_KRGC_SOURCE, KANSAS_STATE_NOTES, "https://www.wikidata.org/wiki/Q126901053"),
  casino("boot-hill-kansas", "Boot Hill Casino & Resort", 37.76777, -100.06156, "4000 W Comanche St, Dodge City, KS 67801", "Kansas", "Boot Hill Casino Management Company, LLC", "https://www.boothillcasino.com/", KANSAS_KRGC_SOURCE, KANSAS_STATE_NOTES, "https://www.openstreetmap.org/way/783769862"),
  casino("kansas-star", "Kansas Star Casino", 37.46885, -97.32813, "777 Kansas Star Dr, Mulvane, KS 67110", "Kansas", "Boyd Gaming", "https://www.kansasstarcasino.com/", KANSAS_KRGC_SOURCE, KANSAS_STATE_NOTES, "https://www.openstreetmap.org/way/962103811"),
  casino("kansas-crossing", "Kansas Crossing Casino + Hotel", 37.34386, -94.70929, "1275 S Highway 69, Pittsburg, KS 66762", "Kansas", "Kansas Crossing Casino, L.C.", "https://www.kansascrossingcasino.com/", KANSAS_KRGC_SOURCE, KANSAS_STATE_NOTES),

  casino("casino-white-cloud", "Casino White Cloud", 39.98893, -95.36871, "777 Jackpot Dr, White Cloud, KS 66094", "Kansas", "Iowa Tribe of Kansas and Nebraska", "https://casinowhitecloud.org/", KANSAS_NIGC_SOURCE, KANSAS_TRIBAL_NOTES),
  casino("golden-eagle-kansas", "Golden Eagle Casino", 39.66983, -95.63914, "1121 Goldfinch Rd, Horton, KS 66439", "Kansas", "Kickapoo Tribe in Kansas", "https://goldeneaglecasino.com/", KANSAS_NIGC_SOURCE, KANSAS_TRIBAL_NOTES),
  casino("prairie-band", "Prairie Band Casino & Resort", 39.31516, -95.75073, "12305 150th Rd, Mayetta, KS 66509", "Kansas", "Prairie Band Potawatomi Nation", "https://www.prairieband.com/", KANSAS_NIGC_SOURCE, KANSAS_TRIBAL_NOTES),
  casino("sac-and-fox-kansas", "Sac & Fox Casino", 39.70047, -95.72826, "1322 US Hwy 75, Powhattan, KS 66527", "Kansas", "Sac and Fox Nation of Missouri in Kansas and Nebraska", "https://www.sacandfoxcasino.com/", KANSAS_NIGC_SOURCE, KANSAS_TRIBAL_NOTES),
  casino("crosswinds-kansas", "CrossWinds Casino", 37.8373, -97.3165, "777 Jackpot Way, Park City, KS 67147", "Kansas", "Wyandotte Nation", "https://crosswindscasino.com/", KANSAS_NIGC_SOURCE, KANSAS_TRIBAL_NOTES),
  casino("7th-street-kansas", "7th Street Casino", 39.11393, -94.62639, "777 N 7th Street Trafficway, Kansas City, KS 66101", "Kansas", "Wyandotte Nation", "https://7th-streetcasino.com/", KANSAS_NIGC_SOURCE, KANSAS_TRIBAL_NOTES, "https://www.openstreetmap.org/way/461596843"),
];
