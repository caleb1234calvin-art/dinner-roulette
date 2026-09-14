import type { CasinoAuditRecord } from "./casino-catalog";

const MICHIGAN_SOURCE = "https://www.michigan.gov/mgcb/-/media/Project/Websites/mgcb/Annual-Reports/2025/2025-Tribal-Gaming-Report-Final.pdf";
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
    jurisdiction: "Michigan",
    operator,
    identitySource: MICHIGAN_SOURCE,
    coordinateSource,
    notes: "Reconciled against the Michigan Gaming Control Board 2025 Tribal Gaming Annual Report.",
  },
});

/** Michigan pass: 16 tribal Class III facilities missing from the original national seed. */
export const CASINO_CATALOG_PASS_3: CasinoAuditRecord[] = [
  casino("crystal-shores", "Crystal Shores Casino", 44.58888, -86.0934, "7282 Hoadley Rd, Benzonia, MI 49616", "Grand Traverse Band of Ottawa and Chippewa Indians", "https://www.leelanausandscasino.com/", "https://www.openstreetmap.org/way/1354709948"),
  casino("leelanau-sands", "Leelanau Sands Casino & Lodge", 45.01765, -85.60766, "2521 NW Bayshore Dr, Peshawbestown, MI 49682", "Grand Traverse Band of Ottawa and Chippewa Indians", "https://www.leelanausandscasino.com/", "https://www.openstreetmap.org/way/306581524"),
  casino("ojibwa-baraga", "Ojibwa Casino Baraga", 46.78065, -88.50798, "16449 Michigan Ave, Baraga, MI 49908", "Keweenaw Bay Indian Community", "https://www.ojibwacasino.com/", "https://www.openstreetmap.org/way/838378513"),
  casino("ojibwa-marquette", "Ojibwa Casino Marquette", 46.47903, -87.24277, "105 Acre Trail, Marquette, MI 49855", "Keweenaw Bay Indian Community", "https://www.ojibwacasino.com/"),
  casino("northern-waters", "Northern Waters Casino Resort", 46.29037, -89.17666, "N5384 US-45, Watersmeet, MI 49969", "Lac Vieux Desert Band of Lake Superior Chippewa Indians", "https://www.northernwaterscasino.com/", "https://www.openstreetmap.org/way/289676212"),
  casino("odawa-mackinaw", "Odawa Casino Mackinaw", 45.76657, -84.73417, "1080 S Nicolet St, Mackinaw City, MI 49701", "Little Traverse Bay Bands of Odawa Indians", "https://www.odawacasino.com/", "https://www.openstreetmap.org/way/1365113679"),
  casino("odawa-petoskey", "Odawa Casino Resort", 45.35275, -84.97933, "1760 Lears Rd, Petoskey, MI 49770", "Little Traverse Bay Bands of Odawa Indians", "https://www.odawacasino.com/", "https://www.openstreetmap.org/way/287107776"),
  casino("four-winds-dowagiac", "Four Winds Casino Dowagiac", 41.97836, -86.13194, "58700 M-51 S, Dowagiac, MI 49047", "Pokagon Band of Potawatomi Indians", "https://fourwindscasino.com/dowagiac/"),
  casino("four-winds-hartford", "Four Winds Casino Hartford", 42.20192, -86.21255, "68600 Red Arrow Hwy, Hartford, MI 49057", "Pokagon Band of Potawatomi Indians", "https://fourwindscasino.com/hartford/", "https://www.openstreetmap.org/way/1025360161"),
  casino("saganing-eagles-landing", "Saganing Eagles Landing Casino & Hotel", 43.92742, -83.91262, "2690 Worth Rd, Standish, MI 48658", "Saginaw Chippewa Indian Tribe", "https://soaringeaglecasino.com/saganing-eagles-landing/", "https://www.openstreetmap.org/way/609818360"),
  casino("soaring-eagle-slot-palace", "Soaring Eagle Slot Palace", 43.60596, -84.70535, "6800 Soaring Eagle Blvd, Mount Pleasant, MI 48858", "Saginaw Chippewa Indian Tribe", "https://soaringeaglecasino.com/slot-palace/", "https://www.openstreetmap.org/way/328099893"),
  casino("kewadin-christmas", "Kewadin Casino Christmas", 46.43717, -86.70657, "N7761 Candy Cane Ln, Christmas, MI 49862", "Sault Ste. Marie Tribe of Chippewa Indians", "https://kewadin.com/locations/"),
  casino("kewadin-hessel", "Kewadin Casino Hessel", 46.05346, -84.42589, "3395 N 3 Mile Rd, Hessel, MI 49745", "Sault Ste. Marie Tribe of Chippewa Indians", "https://kewadin.com/locations/"),
  casino("kewadin-manistique", "Kewadin Casino Manistique", 45.968744, -86.160884, "5630 W US-2, Manistique, MI 49854", "Sault Ste. Marie Tribe of Chippewa Indians", "https://kewadin.com/locations/"),
  casino("kewadin-sault", "Kewadin Casino Sault Ste. Marie", 46.47505, -84.32197, "2186 Shunk Rd, Sault Ste. Marie, MI 49783", "Sault Ste. Marie Tribe of Chippewa Indians", "https://kewadin.com/locations/"),
  casino("kewadin-st-ignace", "Kewadin Casino St. Ignace", 45.92915, -84.73304, "3015 Mackinac Trail, St. Ignace, MI 49781", "Sault Ste. Marie Tribe of Chippewa Indians", "https://kewadin.com/locations/"),
];
