import type { CasinoAuditRecord } from "./casino-catalog";

const NIGC_SOURCE = "https://www.nigc.gov/downloads/gaming-locations/";
const TWO_KINGS_SOURCE = "https://www.twokingscasino.com/";
const VIRGINIA_LOTTERY_SOURCE = "https://www.valottery.com/aboutus/casinosandsportsbetting/casinos";
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

const EBCI_NOTES = "NIGC gaming-location records identify the Eastern Band of Cherokee Indians' two North Carolina Class III casino properties.";
const CATAWBA_NOTES = "Catawba Two Kings opened its current introductory casino phase on May 20, 2026 at the Kings Mountain resort site; the prior temporary modular casino was replaced.";
const VIRGINIA_NOTES = "Virginia Lottery's July 2026 casino activity roster identifies five active casino properties: Hard Rock Bristol, Rivers Portsmouth, Caesars Virginia, The Interim Gaming Hall Norfolk, and Live! Virginia.";

export const CASINO_CATALOG_PASS_11: CasinoAuditRecord[] = [
  casino("harrahs-cherokee", "Harrah's Cherokee Casino Resort", 35.469825, -83.2994593, "777 Casino Dr, Cherokee, NC 28719", "North Carolina", "Eastern Band of Cherokee Indians / EBCI Holdings", "https://www.caesars.com/harrahs-cherokee", NIGC_SOURCE, EBCI_NOTES, "https://caesarsrewards.custhelp.com/app/answers/detail/a_id/1493/"),
  casino("harrahs-cherokee-valley-river", "Harrah's Cherokee Valley River Casino & Hotel", 35.1149258, -83.992439, "777 Casino Pkwy, Murphy, NC 28906", "North Carolina", "Eastern Band of Cherokee Indians / EBCI Holdings", "https://www.caesars.com/harrahs-cherokee-valley-river", NIGC_SOURCE, EBCI_NOTES),
  casino("catawba-two-kings", "Catawba Two Kings Casino", 35.20189, -81.37232, "538 Kings Mountain Blvd, Kings Mountain, NC 28086", "North Carolina", "Catawba Indian Nation", "https://www.twokingscasino.com/", TWO_KINGS_SOURCE, CATAWBA_NOTES, "https://www.openstreetmap.org/way/1212166127"),

  casino("hard-rock-bristol", "Hard Rock Hotel & Casino Bristol", 36.59863, -82.21907, "500 Gate City Hwy, Bristol, VA 24201", "Virginia", "HR Bristol, LLC / Hard Rock International", "https://casino.hardrock.com/bristol", VIRGINIA_LOTTERY_SOURCE, VIRGINIA_NOTES, "https://www.openstreetmap.org/way/803024347"),
  casino("rivers-portsmouth", "Rivers Casino Portsmouth", 36.80749, -76.35315, "3630 Victory Blvd, Portsmouth, VA 23701", "Virginia", "Rivers Portsmouth Gaming, LLC / Rush Street Gaming", "https://www.riverscasino.com/portsmouth/", VIRGINIA_LOTTERY_SOURCE, VIRGINIA_NOTES, "https://www.openstreetmap.org/way/1152578653"),
  casino("caesars-virginia", "Caesars Virginia", 36.571, -79.42787, "1100 W Main St, Danville, VA 24541", "Virginia", "Caesars Virginia, LLC", "https://www.caesars.com/caesars-virginia", VIRGINIA_LOTTERY_SOURCE, VIRGINIA_NOTES, "https://www.openstreetmap.org/way/1496561992"),
  casino("norfolk-interim-gaming-hall", "The Interim Gaming Hall", 36.841265, -76.277495, "200 Park Ave, Norfolk, VA 23510", "Virginia", "Golden Eagle Corporation II, LLC / Pamunkey Indian Tribe / Boyd Gaming", "https://norfolk.boydgaming.com/the-interim-gaming-hall", VIRGINIA_LOTTERY_SOURCE, VIRGINIA_NOTES, "https://www.nao.usace.army.mil/Media/News-Stories/Article/2658770/nao-2020-02444/"),
  casino("live-casino-virginia", "Live! Casino Virginia", 37.1906, -77.3663, "301 Wagner Rd, Petersburg, VA 23805", "Virginia", "PPE Casino Resorts Petersburg, LLC / The Cordish Companies / Bruce Smith Enterprise", "https://www.livech.com/virginia/", VIRGINIA_LOTTERY_SOURCE, VIRGINIA_NOTES),
];
