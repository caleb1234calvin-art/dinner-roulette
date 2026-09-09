import type { NightlifePlace } from "./types";

/**
 * National casino audit backbone.
 *
 * Curated records are deliberately conservative: a venue is activated only when
 * its identity, physical address and coordinates are sufficiently trusted for
 * Dinner Roulette's distance calculations. Live OSM discovery remains the
 * supplemental layer and is merged/deduplicated at runtime.
 */
export interface CasinoAuditRecord extends NightlifePlace {
  audit: {
    verifiedOn: string;
    jurisdiction: string;
    operator?: string;
    notes?: string;
  };
}

const casino = (
  id: string,
  name: string,
  lat: number,
  lon: number,
  address: string,
  jurisdiction: string,
  operator?: string,
  website?: string,
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
  website: website ?? null,
  isChain: false,
  photoKey: "cafe",
  source: "catalog",
  venueTypes: ["casino"],
  energyLevel: 2,
  audit: { verifiedOn: "2026-09-08", jurisdiction, operator },
});

/**
 * Pass-1 verified national seed.
 *
 * This is intentionally not presented as a complete census. It establishes
 * high-confidence anchors across the country while the national reconciliation
 * continues. A missing venue can still be discovered by the live OSM layer.
 */
export const CASINO_CATALOG: CasinoAuditRecord[] = [
  // Northeast / Mid-Atlantic
  casino("foxwoods", "Foxwoods Resort Casino", 41.4741, -71.9580, "350 Trolley Line Blvd, Mashantucket, CT 06338", "Connecticut", "Mashantucket Pequot Tribal Nation", "https://www.foxwoods.com/"),
  casino("mohegan-sun", "Mohegan Sun", 41.4918, -72.0918, "1 Mohegan Sun Blvd, Uncasville, CT 06382", "Connecticut", "Mohegan Tribe", "https://mohegansun.com/"),
  casino("encore-boston", "Encore Boston Harbor", 42.3942, -71.0696, "1 Broadway, Everett, MA 02149", "Massachusetts", "Wynn Resorts", "https://www.encorebostonharbor.com/"),
  casino("mgm-springfield", "MGM Springfield", 42.0997, -72.5886, "One MGM Way, Springfield, MA 01103", "Massachusetts", "MGM Resorts International", "https://mgmspringfield.mgmresorts.com/"),
  casino("plainridge", "Plainridge Park Casino", 42.0217, -71.3054, "301 Washington St, Plainville, MA 02762", "Massachusetts", "PENN Entertainment", "https://www.plainridgeparkcasino.com/"),
  casino("borgata", "Borgata Hotel Casino & Spa", 39.3783, -74.4358, "1 Borgata Way, Atlantic City, NJ 08401", "New Jersey", "MGM Resorts International", "https://borgata.mgmresorts.com/"),
  casino("hard-rock-ac", "Hard Rock Hotel & Casino Atlantic City", 39.3597, -74.4211, "1000 Boardwalk, Atlantic City, NJ 08401", "New Jersey", "Hard Rock International", "https://casino.hardrock.com/atlantic-city"),
  casino("ocean-ac", "Ocean Casino Resort", 39.3618, -74.4179, "500 Boardwalk, Atlantic City, NJ 08401", "New Jersey", undefined, "https://www.theoceanac.com/"),
  casino("caesars-ac", "Caesars Atlantic City", 39.3538, -74.4350, "2100 Pacific Ave, Atlantic City, NJ 08401", "New Jersey", "Caesars Entertainment", "https://www.caesars.com/caesars-ac"),
  casino("parx", "Parx Casino", 40.1187, -74.9592, "2999 Street Rd, Bensalem, PA 19020", "Pennsylvania", "Greenwood Gaming and Entertainment", "https://www.parxcasino.com/"),
  casino("wind-creek-bethlehem", "Wind Creek Bethlehem", 40.6157, -75.3592, "77 Wind Creek Blvd, Bethlehem, PA 18015", "Pennsylvania", "Wind Creek Hospitality", "https://windcreek.com/bethlehem"),
  casino("rivers-pittsburgh", "Rivers Casino Pittsburgh", 40.4473, -80.0228, "777 Casino Dr, Pittsburgh, PA 15212", "Pennsylvania", "Rush Street Gaming", "https://www.riverscasino.com/pittsburgh"),
  casino("mgm-national-harbor", "MGM National Harbor", 38.7951, -77.0103, "101 MGM National Ave, Oxon Hill, MD 20745", "Maryland", "MGM Resorts International", "https://mgmnationalharbor.mgmresorts.com/"),
  casino("horseshoe-baltimore", "Horseshoe Casino Baltimore", 39.2715, -76.6284, "1525 Russell St, Baltimore, MD 21230", "Maryland", "Caesars Entertainment", "https://www.caesars.com/horseshoe-baltimore"),

  // Great Lakes / Midwest
  casino("mgm-detroit", "MGM Grand Detroit", 42.3327, -83.0597, "1777 3rd Ave, Detroit, MI 48226", "Michigan", "MGM Resorts International", "https://mgmgranddetroit.mgmresorts.com/"),
  casino("motorcity", "MotorCity Casino Hotel", 42.3390, -83.0671, "2901 Grand River Ave, Detroit, MI 48201", "Michigan", undefined, "https://www.motorcitycasino.com/"),
  casino("greektown", "Hollywood Casino at Greektown", 42.3340, -83.0411, "555 E Lafayette St, Detroit, MI 48226", "Michigan", "PENN Entertainment", "https://www.hollywoodgreektown.com/"),
  casino("firekeepers", "FireKeepers Casino Hotel", 42.2975, -85.0014, "11177 E Michigan Ave, Battle Creek, MI 49014", "Michigan", "Nottawaseppi Huron Band of the Potawatomi", "https://firekeeperscasino.com/"),
  casino("gun-lake", "Gun Lake Casino", 42.6316, -85.6622, "1123 129th Ave, Wayland, MI 49348", "Michigan", "Gun Lake Tribe", "https://gunlakecasino.com/"),
  casino("four-winds-new-buffalo", "Four Winds Casino New Buffalo", 41.7994, -86.7437, "11111 Wilson Rd, New Buffalo, MI 49117", "Michigan", "Pokagon Band of Potawatomi Indians", "https://fourwindscasino.com/newbuffalo/"),
  casino("soaring-eagle", "Soaring Eagle Casino & Resort", 43.6085, -84.7114, "6800 Soaring Eagle Blvd, Mount Pleasant, MI 48858", "Michigan", "Saginaw Chippewa Indian Tribe", "https://www.soaringeaglecasino.com/"),
  casino("turtle-creek", "Turtle Creek Casino & Hotel", 44.7472, -85.5127, "7741 M-72 E, Williamsburg, MI 49690", "Michigan", "Grand Traverse Band of Ottawa and Chippewa Indians", "https://www.turtlecreekcasino.com/"),
  casino("little-river", "Little River Casino Resort", 44.2867, -86.2432, "2700 Orchard Hwy, Manistee, MI 49660", "Michigan", "Little River Band of Ottawa Indians", "https://www.lrcr.com/"),
  casino("island-resort", "Island Resort & Casino", 45.7032, -87.5008, "W399 US-2, Harris, MI 49845", "Michigan", "Hannahville Indian Community", "https://www.islandresortandcasino.com/"),
  casino("bay-mills", "Bay Mills Resort & Casino", 46.4200, -84.5874, "11386 W Lakeshore Dr, Brimley, MI 49715", "Michigan", "Bay Mills Indian Community", "https://www.baymillscasinos.com/"),

  // South / Gulf
  casino("beau-rivage", "Beau Rivage Resort & Casino", 30.3925, -88.8913, "875 Beach Blvd, Biloxi, MS 39530", "Mississippi", "MGM Resorts International", "https://beaurivage.mgmresorts.com/"),
  casino("caesars-new-orleans", "Caesars New Orleans", 29.9490, -90.0648, "8 Canal St, New Orleans, LA 70130", "Louisiana", "Caesars Entertainment", "https://www.caesars.com/caesars-new-orleans"),
  casino("choctaw-durant", "Choctaw Casino & Resort - Durant", 33.9522, -96.4141, "4216 S Hwy 69/75, Durant, OK 74701", "Oklahoma", "Choctaw Nation of Oklahoma", "https://www.choctawcasinos.com/durant/"),
  casino("winstar", "WinStar World Casino and Resort", 33.7580, -97.1307, "777 Casino Ave, Thackerville, OK 73459", "Oklahoma", "Chickasaw Nation", "https://www.winstar.com/"),
  casino("indigo-sky", "Indigo Sky Casino", 36.8278, -94.6186, "70220 US-60, Wyandotte, OK 74370", "Oklahoma", "Eastern Shawnee Tribe of Oklahoma", "https://indigoskycasino.com/"),
  casino("buffalo-run", "Buffalo Run Casino & Resort", 36.8947, -94.8818, "1000 Buffalo Run Blvd, Miami, OK 74354", "Oklahoma", "Peoria Tribe of Indians of Oklahoma", "https://buffalorun.com/"),

  // Southwest / West
  casino("talking-stick", "Talking Stick Resort", 33.5391, -111.8695, "9800 E Talking Stick Way, Scottsdale, AZ 85256", "Arizona", "Salt River Pima-Maricopa Indian Community", "https://www.talkingstickresort.com/"),
  casino("bellagio", "Bellagio", 36.1126, -115.1767, "3600 S Las Vegas Blvd, Las Vegas, NV 89109", "Nevada", "MGM Resorts International", "https://bellagio.mgmresorts.com/"),
  casino("mgm-grand-las-vegas", "MGM Grand", 36.1021, -115.1696, "3799 S Las Vegas Blvd, Las Vegas, NV 89109", "Nevada", "MGM Resorts International", "https://mgmgrand.mgmresorts.com/"),
  casino("caesars-palace", "Caesars Palace", 36.1162, -115.1745, "3570 S Las Vegas Blvd, Paradise, NV 89109", "Nevada", "Caesars Entertainment", "https://www.caesars.com/caesars-palace"),
  casino("wynn-las-vegas", "Wynn Las Vegas", 36.1263, -115.1658, "3131 Las Vegas Blvd S, Las Vegas, NV 89109", "Nevada", "Wynn Resorts", "https://www.wynnlasvegas.com/"),
  casino("peppermill-reno", "Peppermill Resort Spa Casino", 39.4977, -119.8011, "2707 S Virginia St, Reno, NV 89502", "Nevada", undefined, "https://www.peppermillreno.com/"),
  casino("thunder-valley", "Thunder Valley Casino Resort", 38.8390, -121.3067, "1200 Athens Ave, Lincoln, CA 95648", "California", "United Auburn Indian Community", "https://thundervalleyresort.com/"),
  casino("pechanga", "Pechanga Resort Casino", 33.4565, -117.1065, "45000 Pechanga Pkwy, Temecula, CA 92592", "California", "Pechanga Band of Indians", "https://www.pechanga.com/"),
  casino("yaamava", "Yaamava' Resort & Casino at San Manuel", 34.1500, -117.2294, "777 San Manuel Blvd, Highland, CA 92346", "California", "San Manuel Band of Mission Indians", "https://www.yaamava.com/"),
];

export const CASINO_CATALOG_META = {
  scope: "United States",
  strategy: "live-plus-curated",
  status: "verified-seed-pass-1",
  startedOn: "2026-09-08",
  verifiedOn: "2026-09-08",
  requirements: ["identity", "address", "coordinates"],
  activeRecords: CASINO_CATALOG.length,
  coverageNote:
    "High-confidence national seed, not a complete census. Live OSM remains supplemental while additional regulator-backed records are reconciled.",
} as const;
