import type { CasinoAuditRecord } from "./casino-catalog";

const NIGC_SOURCE = "https://www.nigc.gov/downloads/gaming-locations/";
const TWO_KINGS_SOURCE = "https://www.twokingscasino.com/";
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
    jurisdiction: "North Carolina",
    operator,
    identitySource,
    coordinateSource,
    notes,
  },
});

const EBCI_NOTES = "NIGC gaming-location records identify the Eastern Band of Cherokee Indians' two North Carolina Class III casino properties.";
const CATAWBA_NOTES = "Catawba Two Kings opened its current introductory casino phase on May 20, 2026 at the Kings Mountain resort site; the prior temporary modular casino was replaced.";

export const CASINO_CATALOG_PASS_11: CasinoAuditRecord[] = [
  casino("harrahs-cherokee", "Harrah's Cherokee Casino Resort", 35.469825, -83.2994593, "777 Casino Dr, Cherokee, NC 28719", "Eastern Band of Cherokee Indians / EBCI Holdings", "https://www.caesars.com/harrahs-cherokee", NIGC_SOURCE, EBCI_NOTES, "https://caesarsrewards.custhelp.com/app/answers/detail/a_id/1493/"),
  casino("harrahs-cherokee-valley-river", "Harrah's Cherokee Valley River Casino & Hotel", 35.1149258, -83.992439, "777 Casino Pkwy, Murphy, NC 28906", "Eastern Band of Cherokee Indians / EBCI Holdings", "https://www.caesars.com/harrahs-cherokee-valley-river", NIGC_SOURCE, EBCI_NOTES),
  casino("catawba-two-kings", "Catawba Two Kings Casino", 35.20189, -81.37232, "538 Kings Mountain Blvd, Kings Mountain, NC 28086", "Catawba Indian Nation", "https://www.twokingscasino.com/", TWO_KINGS_SOURCE, CATAWBA_NOTES, "https://www.openstreetmap.org/way/1212166127"),
];
