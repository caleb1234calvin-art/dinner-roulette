import type { CasinoAuditRecord } from "./casino-catalog";

const OSP_SOURCE = "https://www.oregon.gov/osp/programs/pages/gaming-enforcement.aspx";
const NIGC_SOURCE = "https://www.nigc.gov/wp-content/uploads/2025/12/12112025TribesByStateTribeList.pdf";
const COORDINATE_SOURCE = "audit/oregon-reconciliation-2026-09-10.json";
const VERIFIED_ON = "2026-09-11";
const NOTES = "Oregon physical-destination pass reconciled against Oregon tribal-gaming oversight plus NIGC/operator evidence. Includes nine current Class III-oriented destinations plus Ko-Kwel Casino Resort Medford, a current Class II casino destination. Old Camp Casino is excluded as closed and Plateau Travel Plaza is excluded as convenience/travel-plaza gaming outside the destination-casino scope. Property coordinates received a post-implementation QA sweep before completion.";

const casino=(id:string,name:string,lat:number,lon:number,address:string,website:string|null):CasinoAuditRecord=>({
  id:`casino-catalog-or-${id}`,
  name,
  lat,
  lon,
  address,
  cuisines:["other"],
  cuisineLabel:"Casino",
  priceLevel:null,
  rating:null,
  reviewCount:null,
  openingHours:null,
  phone:null,
  website,
  isChain:false,
  photoKey:"cafe",
  source:"catalog",
  venueTypes:["casino"],
  energyLevel:2,
  audit:{verifiedOn:VERIFIED_ON,jurisdiction:"Oregon",identitySource:OSP_SOURCE,coordinateSource:COORDINATE_SOURCE,notes:`${NOTES} NIGC supporting source: ${NIGC_SOURCE}`},
});

export const CASINO_CATALOG_PASS_20: CasinoAuditRecord[] = [
  casino("spirit-mountain","Spirit Mountain Casino",45.05796,-123.58199,"27100 SW Salmon River Hwy, Grand Ronde, OR 97347","https://spiritmountain.com/"),
  casino("chinook-winds","Chinook Winds Casino Resort",44.998096,-124.009215,"1777 NW 44th Street, Lincoln City, OR 97367","https://www.chinookwindscasino.com/"),
  casino("three-rivers-florence","Three Rivers Casino Resort",43.98252,-124.08737,"5647 Highway 126, Florence, OR 97439","https://www.threeriverscasino.com/florence"),
  casino("three-rivers-coos-bay","Three Rivers Casino Coos Bay",43.3900806,-124.2653679,"1297 Ocean Boulevard, Coos Bay, OR 97420","https://www.threeriverscasino.com/coos-bay"),
  casino("kokwel-coos-bay","Ko-Kwel Casino Resort | Coos Bay",43.3939453,-124.2183831,"3201 Tremont Avenue, North Bend, OR 97459","https://www.kokwelresorts.com/coos-bay/"),
  casino("kokwel-medford","Ko-Kwel Casino Resort | Medford",42.3043,-122.8612,"2375 S Pacific Hwy, Medford, OR 97501","https://www.kokwelresorts.com/medford/"),
  casino("seven-feathers","Seven Feathers Casino Resort",42.93916,-123.28329,"146 Chief Miwaleta Lane, Canyonville, OR 97417","https://sevenfeathers.com/"),
  casino("wildhorse","Wildhorse Resort & Casino",45.6474,-118.67951,"46510 Wildhorse Blvd, Pendleton, OR 97801","https://www.wildhorseresort.com/"),
  casino("indian-head","Indian Head Casino",44.764463,-121.247048,"3236 Hwy 26, Warm Springs, OR 97761","https://www.indianheadcasino.com/"),
  casino("kla-mo-ya","Kla-Mo-Ya Casino",42.53559,-121.88274,"34333 US-97, Chiloquin, OR 97624","https://klamoyacasino.com/"),
];

export const OREGON_AUDIT_SOURCE = OSP_SOURCE;
