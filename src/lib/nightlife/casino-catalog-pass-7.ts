import type { CasinoAuditRecord } from "./casino-catalog";

const WV_LOTTERY_SOURCE = "https://business.wvlottery.com/aboutUs";
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
    jurisdiction: "West Virginia",
    operator,
    identitySource: WV_LOTTERY_SOURCE,
    coordinateSource,
    notes: "West Virginia Lottery regulates video lottery and table games at four racetrack casinos plus the Greenbrier historic-resort casino. Distributed limited-video-lottery retailers are outside the app's casino-venue scope.",
  },
});

export const CASINO_CATALOG_PASS_7: CasinoAuditRecord[] = [
  casino("hollywood-charles-town", "Hollywood Casino at Charles Town Races", 39.29569, -77.84861, "750 Hollywood Dr, Charles Town, WV 25414", "PENN Entertainment", "https://www.hollywoodcasinocharlestown.com/", "https://www.wikidata.org/wiki/Q5882641"),
  casino("mardi-gras-west-virginia", "Mardi Gras Casino & Resort", 38.42056, -81.81021, "1 Greyhound Dr, Cross Lanes, WV 25313", "Delaware North", "https://www.mardigrascasinowv.com/", "https://www.openstreetmap.org/way/1023367357"),
  casino("mountaineer-west-virginia", "Mountaineer Casino Resort", 40.58007, -80.6622, "1420 Mountaineer Cir, New Cumberland, WV 26047", "Century Casinos", "https://www.cnty.com/mountaineer/", "https://www.openstreetmap.org/way/336953818"),
  casino("wheeling-island", "Wheeling Island Hotel-Casino-Racetrack", 40.0628, -80.7322, "1 S Stone St, Wheeling, WV 26003", "Delaware North", "https://www.wheelingisland.com/", "https://www.wikidata.org/wiki/Q7992304"),
  casino("greenbrier-casino-club", "The Casino Club at The Greenbrier", 37.78613, -80.30777, "101 Main St W, White Sulphur Springs, WV 24986", "The Greenbrier", "https://www.greenbrier.com/casino/"),
];
