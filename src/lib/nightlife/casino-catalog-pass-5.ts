import type { CasinoAuditRecord } from "./casino-catalog";

const INDIANA_IGC_SOURCE = "https://www.in.gov/igc/about-us/casino-locations-and-information/";
const INDIANA_NIGC_SOURCE = "https://www.nigc.gov/wp-content/uploads/2025/12/12112025TribesByStateTribeList.pdf";
const VERIFIED_ON = "2026-09-09";

const casino = (
  id: string,
  name: string,
  lat: number,
  lon: number,
  address: string,
  operator: string,
  website: string,
  identitySource: string,
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
    jurisdiction: "Indiana",
    operator,
    identitySource,
    coordinateSource,
    notes: "Indiana pass includes 13 state-regulated casinos/racinos plus Four Winds South Bend, the state's tribal casino venue.",
  },
});

export const CASINO_CATALOG_PASS_5: CasinoAuditRecord[] = [
  casino("ameristar-east-chicago", "Ameristar Casino East Chicago", 41.65205, -87.43612, "777 Ameristar Dr, East Chicago, IN 46312", "PENN Entertainment", "https://www.ameristareastchicago.com/", INDIANA_IGC_SOURCE, "https://www.openstreetmap.org/way/534210265"),
  casino("ballys-evansville", "Bally's Evansville", 37.97248, -87.57798, "421 NW Riverside Dr, Evansville, IN 47708", "Bally's Corporation", "https://www.ballys.com/evansville/", INDIANA_IGC_SOURCE, "https://www.openstreetmap.org/way/354181297"),
  casino("belterra-indiana", "Belterra Casino Resort", 38.77918, -84.93848, "777 Belterra Dr, Florence, IN 47020", "Boyd Gaming", "https://www.belterracasino.com/", INDIANA_IGC_SOURCE, "https://www.openstreetmap.org/way/314809065"),
  casino("blue-chip-indiana", "Blue Chip Casino", 41.71883, -86.8926, "777 Blue Chip Dr, Michigan City, IN 46360", "Boyd Gaming", "https://www.bluechipcasino.com/", INDIANA_IGC_SOURCE, "https://www.openstreetmap.org/way/665882868"),
  casino("caesars-southern-indiana", "Caesars Southern Indiana", 38.1794, -85.90293, "11999 Casino Center Dr SE, Elizabeth, IN 47117", "Caesars Entertainment", "https://www.caesars.com/caesars-southern-indiana", INDIANA_IGC_SOURCE, "https://www.openstreetmap.org/way/534775599"),
  casino("french-lick", "French Lick Resort & Casino", 38.553, -86.62, "8670 W State Road 56, French Lick, IN 47432", "Orange County Holdings", "https://www.frenchlick.com/", INDIANA_IGC_SOURCE),
  casino("hard-rock-northern-indiana", "Hard Rock Casino Northern Indiana", 41.56815, -87.40682, "5400 W 29th Ave, Gary, IN 46406", "Hard Rock International", "https://www.hardrockcasinonorthernindiana.com/", INDIANA_IGC_SOURCE, "https://www.openstreetmap.org/way/953206212"),
  casino("hollywood-lawrenceburg", "Hollywood Casino Lawrenceburg", 39.09708, -84.84354, "777 Hollywood Blvd, Lawrenceburg, IN 47025", "PENN Entertainment", "https://www.hollywoodindiana.com/", INDIANA_IGC_SOURCE, "https://www.openstreetmap.org/way/121060505"),
  casino("harrahs-hoosier-park", "Harrah's Hoosier Park Casino", 40.069402, -85.640757, "4500 Dan Patch Cir, Anderson, IN 46013", "Caesars Entertainment", "https://www.caesars.com/harrahs-hoosier-park/casino", INDIANA_IGC_SOURCE),
  casino("horseshoe-hammond", "Horseshoe Hammond Casino", 41.69413, -87.50705, "777 Casino Center Dr, Hammond, IN 46320", "Caesars Entertainment", "https://www.caesars.com/horseshoe-hammond", INDIANA_IGC_SOURCE, "https://www.openstreetmap.org/way/511808866"),
  casino("horseshoe-indianapolis", "Horseshoe Indianapolis", 39.59, -85.822, "4300 N Michigan Rd, Shelbyville, IN 46176", "Caesars Entertainment", "https://www.caesars.com/horseshoe-indianapolis", INDIANA_IGC_SOURCE),
  casino("rising-star-indiana", "Rising Star Casino Resort", 38.952906, -84.846794, "777 Rising Star Dr, Rising Sun, IN 47040", "Full House Resorts", "https://www.risingstarcasino.com/", INDIANA_IGC_SOURCE),
  casino("terre-haute", "Terre Haute Casino Resort", 39.4338, -87.3422, "4500 E Margaret Dr, Terre Haute, IN 47803", "Churchill Downs Incorporated", "https://www.terrehautecasino.com/", INDIANA_IGC_SOURCE),
  casino("four-winds-south-bend", "Four Winds Casino South Bend", 41.64044, -86.29125, "3000 Prairie Ave, South Bend, IN 46614", "Pokagon Band of Potawatomi Indians", "https://fourwindscasino.com/south-bend/", INDIANA_NIGC_SOURCE, "https://www.openstreetmap.org/way/653629053"),
];
