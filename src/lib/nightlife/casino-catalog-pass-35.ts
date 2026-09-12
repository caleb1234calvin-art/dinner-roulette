import type { CasinoAuditRecord } from "./casino-catalog";

const VERIFIED_ON="2026-09-12";
const QA="audit/nevada-outer-clark-mesquite-coordinate-qa-pass-8-2026-09-12.json";
const casino=(id:string,name:string,lat:number,lon:number,address:string,website:string,notes:string):CasinoAuditRecord=>({id:`casino-catalog-nv-${id}`,name,lat,lon,address,cuisines:["other"],cuisineLabel:"Casino",priceLevel:null,rating:null,reviewCount:null,openingHours:null,phone:null,website,isChain:false,photoKey:"cafe",source:"catalog",venueTypes:["casino"],energyLevel:2,audit:{verifiedOn:VERIFIED_ON,jurisdiction:"Nevada",identitySource:website,coordinateSource:QA,notes}});
const NOTE="Nevada rolling NV-02 outer-Clark/Mesquite/Primm runtime increment. Current identity/operation, normalized address, property-specific coordinate, stable ID and duplicate/alias QA cleared in the cited audit artifact. This pass does not claim Nevada statewide completeness.";

/** Nevada Pass 35: ten QA-cleared outer-Clark / Mesquite / Primm destinations. */
export const CASINO_CATALOG_PASS_35:CasinoAuditRecord[]=[
  casino("durango-resort","Durango Casino & Resort",36.06391,-115.28266,"6915 S Durango Dr, Las Vegas, NV 89113","https://durangoresort.com/",NOTE),
  casino("red-rock-resort","Red Rock Casino Resort & Spa",36.1561,-115.33357,"11011 W Charleston Blvd, Las Vegas, NV 89135","https://redrockresort.com/",NOTE),
  casino("suncoast","Suncoast Hotel & Casino",36.1691,-115.29128,"9090 Alta Drive, Las Vegas, NV 89145","https://suncoast.boydgaming.com/",NOTE),
  casino("rampart","Rampart Casino",36.17607,-115.2915,"221 N Rampart Blvd, Las Vegas, NV 89145","https://theresortatsummerlin.com/",`${NOTE} Casino within The Resort at Summerlin complex; do not split the adjoining resort/hotel branding into another casino destination.`),
  casino("palace-station","Palace Station Hotel & Casino",36.14246,-115.17497,"2411 W Sahara Ave, Las Vegas, NV 89102","https://palacestation.com/",NOTE),
  casino("silverton","Silverton Casino Lodge",36.04162,-115.18384,"3333 Blue Diamond Road, Las Vegas, NV 89139","https://silvertoncasino.com/",NOTE),
  casino("primm-valley-resort","Primm Valley Resort & Casino",35.6113,-115.3871,"31900 Las Vegas Blvd S, Primm, NV 89019","https://primmvalleyresorts.com/",`${NOTE} Buffalo Bill's and Whiskey Pete's remain separate current-operation holds and are not inferred from this active property.`),
  casino("casablanca-mesquite","CasaBlanca Resort & Casino",36.802662,-114.100662,"950 W Mesquite Blvd, Mesquite, NV 89027","https://casablancaresort.com/",NOTE),
  casino("virgin-river-mesquite","Virgin River Casino & Lodge",36.81519,-114.06604,"100 E Pioneer Blvd, Mesquite, NV 89027","https://virginriver.com/",`${NOTE} Collapse Virgin River Hotel & Casino / Virgin River Casino & Lodge naming variants to this one physical property.`),
  casino("eureka-mesquite","Eureka Casino Resort",36.817637,-114.063413,"275 Mesa Blvd, Mesquite, NV 89027","https://www.eurekamesquite.com/",NOTE),
];
