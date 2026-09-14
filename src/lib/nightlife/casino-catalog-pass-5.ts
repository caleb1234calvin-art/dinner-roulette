import type { CasinoAuditRecord } from "./casino-catalog";

const INDIANA_IGC_SOURCE = "https://www.in.gov/igc/about-us/casino-locations-and-information/";
const INDIANA_NIGC_SOURCE = "https://www.nigc.gov/wp-content/uploads/2025/12/12112025TribesByStateTribeList.pdf";
const ILLINOIS_IGB_SOURCE = "https://igb.illinois.gov/about.html";
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

const INDIANA_NOTES = "Indiana pass includes 13 state-regulated casinos/racinos plus Four Winds South Bend, the state's tribal casino venue.";
const ILLINOIS_NOTES = "Illinois pass reconciles all 17 casinos currently identified by the Illinois Gaming Board, including Fairmount Park Casino & Racing, the state's first racino.";

export const CASINO_CATALOG_PASS_5: CasinoAuditRecord[] = [
  // Indiana
  casino("ameristar-east-chicago", "Ameristar Casino East Chicago", 41.65205, -87.43612, "777 Ameristar Dr, East Chicago, IN 46312", "Indiana", "PENN Entertainment", "https://www.ameristareastchicago.com/", INDIANA_IGC_SOURCE, INDIANA_NOTES, "https://www.openstreetmap.org/way/534210265"),
  casino("ballys-evansville", "Bally's Evansville", 37.97248, -87.57798, "421 NW Riverside Dr, Evansville, IN 47708", "Indiana", "Bally's Corporation", "https://www.ballys.com/evansville/", INDIANA_IGC_SOURCE, INDIANA_NOTES, "https://www.openstreetmap.org/way/354181297"),
  casino("belterra-indiana", "Belterra Casino Resort", 38.77918, -84.93848, "777 Belterra Dr, Florence, IN 47020", "Indiana", "Boyd Gaming", "https://www.belterracasino.com/", INDIANA_IGC_SOURCE, INDIANA_NOTES, "https://www.openstreetmap.org/way/314809065"),
  casino("blue-chip-indiana", "Blue Chip Casino", 41.71883, -86.8926, "777 Blue Chip Dr, Michigan City, IN 46360", "Indiana", "Boyd Gaming", "https://www.bluechipcasino.com/", INDIANA_IGC_SOURCE, INDIANA_NOTES, "https://www.openstreetmap.org/way/665882868"),
  casino("caesars-southern-indiana", "Caesars Southern Indiana", 38.1794, -85.90293, "11999 Casino Center Dr SE, Elizabeth, IN 47117", "Indiana", "Caesars Entertainment", "https://www.caesars.com/caesars-southern-indiana", INDIANA_IGC_SOURCE, INDIANA_NOTES, "https://www.openstreetmap.org/way/534775599"),
  casino("french-lick", "French Lick Resort & Casino", 38.553, -86.62, "8670 W State Road 56, French Lick, IN 47432", "Indiana", "Orange County Holdings", "https://www.frenchlick.com/", INDIANA_IGC_SOURCE, INDIANA_NOTES),
  casino("hard-rock-northern-indiana", "Hard Rock Casino Northern Indiana", 41.56815, -87.40682, "5400 W 29th Ave, Gary, IN 46406", "Indiana", "Hard Rock International", "https://www.hardrockcasinonorthernindiana.com/", INDIANA_IGC_SOURCE, INDIANA_NOTES, "https://www.openstreetmap.org/way/953206212"),
  casino("hollywood-lawrenceburg", "Hollywood Casino Lawrenceburg", 39.09708, -84.84354, "777 Hollywood Blvd, Lawrenceburg, IN 47025", "Indiana", "PENN Entertainment", "https://www.hollywoodindiana.com/", INDIANA_IGC_SOURCE, INDIANA_NOTES, "https://www.openstreetmap.org/way/121060505"),
  casino("harrahs-hoosier-park", "Harrah's Hoosier Park Casino", 40.069402, -85.640757, "4500 Dan Patch Cir, Anderson, IN 46013", "Indiana", "Caesars Entertainment", "https://www.caesars.com/harrahs-hoosier-park/casino", INDIANA_IGC_SOURCE, INDIANA_NOTES),
  casino("horseshoe-hammond", "Horseshoe Hammond Casino", 41.69413, -87.50705, "777 Casino Center Dr, Hammond, IN 46320", "Indiana", "Caesars Entertainment", "https://www.caesars.com/horseshoe-hammond", INDIANA_IGC_SOURCE, INDIANA_NOTES, "https://www.openstreetmap.org/way/511808866"),
  casino("horseshoe-indianapolis", "Horseshoe Indianapolis", 39.59, -85.822, "4300 N Michigan Rd, Shelbyville, IN 46176", "Indiana", "Caesars Entertainment", "https://www.caesars.com/horseshoe-indianapolis", INDIANA_IGC_SOURCE, INDIANA_NOTES),
  casino("rising-star-indiana", "Rising Star Casino Resort", 38.952906, -84.846794, "777 Rising Star Dr, Rising Sun, IN 47040", "Indiana", "Full House Resorts", "https://www.risingstarcasino.com/", INDIANA_IGC_SOURCE, INDIANA_NOTES),
  casino("terre-haute", "Terre Haute Casino Resort", 39.4338, -87.3422, "4500 E Margaret Dr, Terre Haute, IN 47803", "Indiana", "Churchill Downs Incorporated", "https://www.terrehautecasino.com/", INDIANA_IGC_SOURCE, INDIANA_NOTES),
  casino("four-winds-south-bend", "Four Winds Casino South Bend", 41.64044, -86.29125, "3000 Prairie Ave, South Bend, IN 46614", "Indiana", "Pokagon Band of Potawatomi Indians", "https://fourwindscasino.com/south-bend/", INDIANA_NIGC_SOURCE, INDIANA_NOTES, "https://www.openstreetmap.org/way/653629053"),

  // Illinois
  casino("argosy-alton", "Argosy Casino Alton", 38.88924, -90.18674, "1 Piasa St, Alton, IL 62002", "Illinois", "PENN Entertainment", "https://www.argosyalton.com/", ILLINOIS_IGB_SOURCE, ILLINOIS_NOTES, "https://www.openstreetmap.org/node/7184894326"),
  casino("ballys-chicago", "Bally's Chicago", 41.89289, -87.62725, "600 N Wabash Ave, Chicago, IL 60611", "Illinois", "Bally's Corporation", "https://casinos.ballys.com/chicago/", ILLINOIS_IGB_SOURCE, ILLINOIS_NOTES, "https://www.openstreetmap.org/way/210680454"),
  casino("ballys-quad-cities", "Bally's Quad Cities Casino & Hotel", 41.45921, -90.61316, "777 Bally Blvd, Rock Island, IL 61201", "Illinois", "Bally's Corporation", "https://casinos.ballys.com/quad-cities/", ILLINOIS_IGB_SOURCE, ILLINOIS_NOTES, "https://www.openstreetmap.org/way/865988283"),
  casino("casino-queen-east-st-louis", "DraftKings at Casino Queen", 38.62564, -90.17408, "200 S Front St, East St. Louis, IL 62201", "Illinois", "Casino Queen, Inc.", "https://draftkingsatcasinoqueen.com/", ILLINOIS_IGB_SOURCE, ILLINOIS_NOTES, "https://www.openstreetmap.org/way/239594939"),
  casino("fairmount-park", "Fairmount Park Casino & Racing", 38.66306, -90.03556, "9301 Collinsville Rd, Collinsville, IL 62234", "Illinois", "Accel Entertainment", "https://www.fairmountparkcasino.com/", ILLINOIS_IGB_SOURCE, ILLINOIS_NOTES),
  casino("grand-victoria-elgin", "Grand Victoria Casino", 42.03131, -88.27989, "250 S Grove Ave, Elgin, IL 60120", "Illinois", "Caesars Entertainment", "https://www.caesars.com/grand-victoria-casino", ILLINOIS_IGB_SOURCE, ILLINOIS_NOTES, "https://www.openstreetmap.org/way/98742667"),
  casino("golden-nugget-danville", "Golden Nugget Danville", 40.12505, -87.54798, "204 Eastgate Dr, Danville, IL 61834", "Illinois", "Danville Development, LLC / Golden Nugget", "https://www.goldennugget.com/danville/", ILLINOIS_IGB_SOURCE, ILLINOIS_NOTES, "https://www.openstreetmap.org/way/887984121"),
  casino("hard-rock-rockford", "Hard Rock Casino Rockford", 42.26923, -88.96215, "7801 E State St, Rockford, IL 61108", "Illinois", "815 Entertainment / Hard Rock", "https://casino.hardrock.com/rockford/", ILLINOIS_IGB_SOURCE, ILLINOIS_NOTES, "https://www.openstreetmap.org/way/1390820532"),
  casino("harrahs-metropolis", "Harrah's Metropolis Casino", 37.14646, -88.73517, "101 Metropolis St, Metropolis, IL 62960", "Illinois", "Caesars Entertainment", "https://www.caesars.com/harrahs-metropolis", ILLINOIS_IGB_SOURCE, ILLINOIS_NOTES, "https://www.openstreetmap.org/way/183038048"),
  casino("harrahs-joliet", "Harrah's Joliet Casino & Hotel", 41.526833, -88.084454, "151 N Joliet St, Joliet, IL 60432", "Illinois", "Caesars Entertainment", "https://www.caesars.com/harrahs-joliet", ILLINOIS_IGB_SOURCE, ILLINOIS_NOTES),
  casino("hollywood-aurora", "Hollywood Casino Aurora", 41.7593, -88.31351, "1 W New York St, Aurora, IL 60506", "Illinois", "PENN Entertainment", "https://www.hollywoodcasinoaurora.com/", ILLINOIS_IGB_SOURCE, ILLINOIS_NOTES, "https://www.openstreetmap.org/way/238792548"),
  casino("hollywood-joliet", "Hollywood Casino Joliet", 41.47954, -88.14426, "1401 Gateway Blvd, Joliet, IL 60431", "Illinois", "PENN Entertainment", "https://www.hollywoodcasinojoliet.com/", ILLINOIS_IGB_SOURCE, ILLINOIS_NOTES, "https://www.openstreetmap.org/way/646577407"),
  casino("par-a-dice", "Par-A-Dice Hotel Casino", 40.68, -89.56833, "21 Blackjack Blvd, East Peoria, IL 61611", "Illinois", "Boyd Gaming", "https://www.paradicecasino.com/", ILLINOIS_IGB_SOURCE, ILLINOIS_NOTES),
  casino("rivers-des-plaines", "Rivers Casino Des Plaines", 41.99751, -87.86425, "3000 S River Rd, Des Plaines, IL 60018", "Illinois", "Rush Street Gaming / Churchill Downs", "https://www.riverscasino.com/desplaines/", ILLINOIS_IGB_SOURCE, ILLINOIS_NOTES),
  casino("american-place-waukegan", "American Place Casino", 42.34271, -87.90173, "4011 Fountain Square Pl, Waukegan, IL 60085", "Illinois", "Full House Resorts", "https://americanplace.com/", ILLINOIS_IGB_SOURCE, ILLINOIS_NOTES, "https://www.openstreetmap.org/way/1195453568"),
  casino("walkers-bluff", "Walker's Bluff Casino Resort", 37.80264, -89.14971, "777 Walker's Bluff Way, Carterville, IL 62918", "Illinois", "Walker's Bluff Casino Resort, LLC", "https://www.walkersbluffcasinoresort.com/", ILLINOIS_IGB_SOURCE, ILLINOIS_NOTES, "https://www.openstreetmap.org/way/1258027983"),
  casino("wind-creek-chicago-southland", "Wind Creek Chicago Southland", 41.57502, -87.63827, "17300 S Halsted St, East Hazel Crest, IL 60429", "Illinois", "Wind Creek Hospitality", "https://windcreek.com/chicagosouthland", ILLINOIS_IGB_SOURCE, ILLINOIS_NOTES, "https://www.openstreetmap.org/way/1358765835"),
];
