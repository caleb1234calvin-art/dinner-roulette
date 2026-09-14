import type { CasinoAuditRecord } from "./casino-catalog";

const OHIO_CASINO_SOURCE = "https://dam.assets.ohio.gov/image/upload/v1734369247/casinocontrol.ohio.gov/annual-reports/2024_OCCC_Annual_Report_-_FINAL_for_web.pdf";
const OHIO_RACINO_SOURCE = "https://www.ohiolottery.com/vlt-central";
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
    jurisdiction: "Ohio",
    operator,
    identitySource,
    coordinateSource,
    notes: "Ohio pass includes the four state-regulated casinos and seven Ohio Lottery VLT racinos.",
  },
});

export const CASINO_CATALOG_PASS_4: CasinoAuditRecord[] = [
  casino("hard-rock-cincinnati", "Hard Rock Casino Cincinnati", 39.10816, -84.50661, "1000 Broadway St, Cincinnati, OH 45202", "Hard Rock International", "https://casino.hardrock.com/cincinnati/", OHIO_CASINO_SOURCE, "https://www.openstreetmap.org/way/168830714"),
  casino("jack-cleveland", "JACK Cleveland Casino", 41.4983, -81.69295, "100 Public Square, Cleveland, OH 44113", "JACK Entertainment", "https://www.jackentertainment.com/cleveland/", OHIO_CASINO_SOURCE, "https://www.openstreetmap.org/way/154146266"),
  casino("hollywood-columbus", "Hollywood Casino Columbus", 39.95056, -83.10722, "200 Georgesville Rd, Columbus, OH 43228", "PENN Entertainment", "https://www.hollywoodcolumbus.com/", OHIO_CASINO_SOURCE, "https://www.wikidata.org/wiki/Q16984620"),
  casino("hollywood-toledo", "Hollywood Casino Toledo", 41.6206, -83.54505, "1968 Miami St, Toledo, OH 43605", "PENN Entertainment", "https://www.hollywoodcasinotoledo.com/", OHIO_CASINO_SOURCE, "https://www.openstreetmap.org/way/186945385"),
  casino("belterra-park", "Belterra Park Gaming & Entertainment Center", 39.05283, -84.41146, "6301 Kellogg Ave, Cincinnati, OH 45230", "Boyd Gaming", "https://www.belterrapark.com/", OHIO_RACINO_SOURCE),
  casino("scioto-downs", "Eldorado Gaming Scioto Downs", 39.8394, -82.99734, "6000 S High St, Columbus, OH 43207", "Caesars Entertainment", "https://www.sciotodowns.com/", OHIO_RACINO_SOURCE, "https://www.openstreetmap.org/way/169121794"),
  casino("hollywood-dayton", "Hollywood Gaming at Dayton Raceway", 39.81627, -84.171, "777 Hollywood Blvd, Dayton, OH 45414", "PENN Entertainment", "https://www.hollywooddaytonraceway.com/", OHIO_RACINO_SOURCE, "https://www.openstreetmap.org/way/533081843"),
  casino("hollywood-mahoning-valley", "Hollywood Gaming at Mahoning Valley Race Course", 41.11591, -80.76109, "655 N Canfield Niles Rd, Youngstown, OH 44515", "PENN Entertainment", "https://www.hollywoodmahoningvalley.com/", OHIO_RACINO_SOURCE, "https://www.openstreetmap.org/way/303710176"),
  casino("jack-thistledown", "JACK Thistledown Racino", 41.4382, -81.53123, "21501 Emery Rd, Cleveland, OH 44128", "JACK Entertainment", "https://www.jackentertainment.com/thistledown/", OHIO_RACINO_SOURCE, "https://www.openstreetmap.org/way/1324144437"),
  casino("mgm-northfield", "MGM Northfield Park", 41.34919, -81.52139, "10777 Northfield Rd, Northfield, OH 44067", "MGM Resorts International", "https://mgmnorthfieldpark.mgmresorts.com/", OHIO_RACINO_SOURCE, "https://www.wikidata.org/wiki/Q7059389"),
  casino("miami-valley-gaming", "Miami Valley Gaming", 39.44324, -84.32003, "6000 OH-63, Lebanon, OH 45036", "Miami Valley Gaming and Racing", "https://www.miamivalleygaming.com/", OHIO_RACINO_SOURCE, "https://www.openstreetmap.org/way/243426059"),
];
