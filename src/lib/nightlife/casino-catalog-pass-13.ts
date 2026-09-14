import type { CasinoAuditRecord } from "./casino-catalog";

const IRGC_SOURCE = "https://irgc.iowa.gov/licensing-information/facility-licenses";
const NIGC_SOURCE = "https://www.nigc.gov/downloads/gaming-locations/";
const VERIFIED_ON = "2026-09-09";
const STATE_NOTES = "Iowa Racing and Gaming Commission's current facility-license roster and July 2026 reporting identify 19 operating state-licensed casinos.";
const TRIBAL_NOTES = "NIGC gaming-location records identify four Iowa tribal casino properties under the app's physical casino-venue scope: Blackbird Bend, Meskwaki, Prairie Flower, and WinnaVegas.";

const casino = (
  id: string,
  name: string,
  lat: number,
  lon: number,
  address: string,
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
    jurisdiction: "Iowa",
    operator,
    identitySource,
    coordinateSource,
    notes,
  },
});

export const CASINO_CATALOG_PASS_13: CasinoAuditRecord[] = [
  casino("ameristar-council-bluffs", "Ameristar Casino Hotel Council Bluffs", 41.2426968, -95.9101644, "2200 River Rd, Council Bluffs, IA 51501", "Ameristar Casino Council Bluffs, LLC / PENN Entertainment", "https://www.ameristar.com/council-bluffs", IRGC_SOURCE, STATE_NOTES),
  casino("ballys-marquette", "Bally's Marquette", 43.0410167, -91.1784333, "100 Anti-Monopoly St, Marquette, IA 52158", "Casino Queen Marquette, Inc. / Bally's Corporation", "https://casinoqueenmarquette.com/", IRGC_SOURCE, STATE_NOTES),
  casino("diamond-jo-dubuque", "Diamond Jo Casino", 42.49763, -90.65873, "301 Bell St, Dubuque, IA 52001", "Diamond Jo, LLC / Boyd Gaming", "https://diamondjodubuque.boydgaming.com/", IRGC_SOURCE, STATE_NOTES, "https://mapcarta.com/36755446"),
  casino("diamond-jo-worth", "Diamond Jo Worth", 43.44749, -93.35241, "777 Diamond Jo Ln, Northwood, IA 50459", "Diamond Jo Worth, LLC / Boyd Gaming", "https://diamondjoworth.boydgaming.com/", IRGC_SOURCE, STATE_NOTES, "https://mapcarta.com/W166669444"),
  casino("grand-falls", "Grand Falls Casino Resort", 43.498412, -96.5033548, "1415 Grand Falls Blvd, Larchwood, IA 51241", "Grand Falls Casino Resort, LLC", "https://www.grandfallscasinoresort.com/", IRGC_SOURCE, STATE_NOTES),
  casino("great-river", "Great River Casino Resort", 40.8215691, -91.1397151, "3001 Winegard Dr, Burlington, IA 52601", "Great River Casino Resort, LLC", "https://www.funcityresort.com/", IRGC_SOURCE, STATE_NOTES),
  casino("hard-rock-sioux-city", "Hard Rock Hotel & Casino Sioux City", 42.493395, -96.40948, "111 3rd St, Sioux City, IA 51101", "SCE Partners, LLC", "https://www.hardrockcasinosiouxcity.com/", IRGC_SOURCE, STATE_NOTES),
  casino("harrahs-council-bluffs", "Harrah's Council Bluffs Casino & Hotel", 41.2512256, -95.914582, "1 Harrah's Blvd, Council Bluffs, IA 51501", "Harveys Iowa Management Company, LLC / Caesars Entertainment", "https://www.caesars.com/harrahs-council-bluffs", IRGC_SOURCE, STATE_NOTES, "https://caesarsrewards.custhelp.com/app/answers/detail/a_id/1509/"),
  casino("horseshoe-council-bluffs", "Horseshoe Casino Council Bluffs", 41.2362, -95.88673, "2701 23rd Ave, Council Bluffs, IA 51501", "Harveys Iowa Management Company, LLC / Caesars Entertainment", "https://www.caesars.com/horseshoe-council-bluffs", IRGC_SOURCE, STATE_NOTES, "https://mapcarta.com/W191679806"),
  casino("isle-waterloo", "Isle Casino Hotel Waterloo", 42.44846, -92.30955, "777 Isle of Capri Blvd, Waterloo, IA 50701", "IOC Black Hawk County, Inc. / Caesars Entertainment", "https://www.caesars.com/isle-waterloo", IRGC_SOURCE, STATE_NOTES, "https://mapcarta.com/W526263848"),
  casino("isle-bettendorf", "Isle Casino Hotel Bettendorf", 41.52328, -90.50726, "1777 Isle Pkwy, Bettendorf, IA 52722", "IOC Bettendorf, LLC / Caesars Entertainment", "https://www.caesars.com/isle-bettendorf", IRGC_SOURCE, STATE_NOTES, "https://mapcarta.com/W166723602"),
  casino("lakeside-osceola", "Lakeside Hotel Casino", 41.0372987, -93.8006325, "777 Casino Dr, Osceola, IA 50213", "Lakeside Casino, LLC", "https://www.lakesidehotelcasino.com/", IRGC_SOURCE, STATE_NOTES),
  casino("prairie-meadows", "Prairie Meadows Racetrack & Casino", 41.654392, -93.4897762, "1 Prairie Meadows Dr, Altoona, IA 50009", "Prairie Meadows Racetrack and Casino, Inc.", "https://www.prairiemeadows.com/", IRGC_SOURCE, STATE_NOTES),
  casino("q-casino", "Q Casino + Resort", 42.5174, -90.64421, "1855 Greyhound Park Rd, Dubuque, IA 52001", "Dubuque Racing Association, Ltd.", "https://qcasinoandresort.com/", IRGC_SOURCE, STATE_NOTES, "https://mapcarta.com/36755444"),
  casino("rhythm-city", "Rhythm City Casino Resort", 41.59483, -90.53081, "7077 Elmore Ave, Davenport, IA 52807", "Scott County Casino, LLC", "https://www.rhythmcitycasino.com/", IRGC_SOURCE, STATE_NOTES, "https://mapcarta.com/W676427380"),
  casino("riverside-iowa", "Riverside Casino & Golf Resort", 41.4993275, -91.528843, "3184 Highway 22, Riverside, IA 52327", "Riverside Casino and Golf Resort, LLC", "https://www.riversidecasinoandresort.com/", IRGC_SOURCE, STATE_NOTES),
  casino("wild-rose-clinton", "Wild Rose Casino & Resort - Clinton", 41.8197137, -90.2538406, "777 Wild Rose Dr, Clinton, IA 52732", "Wild Rose Clinton, LLC", "https://www.wildroseresorts.com/locations/clinton", IRGC_SOURCE, STATE_NOTES),
  casino("wild-rose-emmetsburg", "Wild Rose Casino & Resort - Emmetsburg", 43.115, -94.6633, "777 Main St, Emmetsburg, IA 50536", "Wild Rose Emmetsburg, LLC", "https://www.wildroseresorts.com/locations/emmetsburg", IRGC_SOURCE, STATE_NOTES),
  casino("wild-rose-jefferson", "Wild Rose Casino & Resort - Jefferson", 42.03495, -94.37891, "777 Wild Rose Dr, Jefferson, IA 50129", "Wild Rose Jefferson, LLC", "https://www.wildroseresorts.com/locations/jefferson", IRGC_SOURCE, STATE_NOTES),
  casino("blackbird-bend", "Blackbird Bend Casino", 42.056784, -96.209714, "17214 210th St, Onawa, IA 51040", "Omaha Tribe of Nebraska", "https://www.blackbirdbend.com/", NIGC_SOURCE, TRIBAL_NOTES),
  casino("meskwaki", "Meskwaki Bingo Casino Hotel", 41.99589, -92.66818, "1504 305th St, Tama, IA 52339", "Sac & Fox Tribe of the Mississippi in Iowa", "https://www.meskwaki.com/", NIGC_SOURCE, TRIBAL_NOTES, "https://mapcarta.com/W382531729"),
  casino("prairie-flower", "Prairie Flower Casino", 41.28056, -95.91748, "1031 Avenue H, Carter Lake, IA 51510", "Ponca Tribe of Nebraska", "https://www.prairieflowercasino.com/", NIGC_SOURCE, TRIBAL_NOTES, "https://mapcarta.com/W678988828"),
  casino("winnavegas", "WinnaVegas Casino Resort", 42.2279255, -96.3100066, "1500 330th St, Sloan, IA 51055", "Winnebago Tribe of Nebraska", "https://www.winnavegas.com/", NIGC_SOURCE, TRIBAL_NOTES),
];
