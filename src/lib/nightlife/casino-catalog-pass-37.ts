import type { CasinoAuditRecord } from "./casino-catalog";

const VERIFIED_ON="2026-09-12";
const JURISDICTION="Nevada";
const QA="audit/nevada-north-las-vegas-coordinate-qa-pass-10-2026-09-12.json";
const casino=(id:string,name:string,lat:number,lon:number,address:string,website:string,notes:string):CasinoAuditRecord=>({id:`casino-catalog-nv-${id}`,name,lat,lon,address,cuisines:["other"],cuisineLabel:"Casino",priceLevel:null,rating:null,reviewCount:null,openingHours:null,phone:null,website,isChain:false,photoKey:"cafe",source:"catalog",venueTypes:["casino"],energyLevel:2,audit:{verifiedOn:VERIFIED_ON,jurisdiction:JURISDICTION,identitySource:website,coordinateSource:QA,notes}});
const NOTE="Nevada rolling North Las Vegas / northwest-valley runtime increment. Current identity/operation, normalized address, property-specific coordinate, stable ID and duplicate/collision QA cleared in the cited audit artifact. This pass does not claim Nevada statewide completeness.";

/** Nevada Pass 37: four QA-cleared North Las Vegas / northwest-valley destinations. */
export const CASINO_CATALOG_PASS_37:CasinoAuditRecord[]=[
  casino("bighorn-north-las-vegas","Bighorn Casino",36.196354,-115.106376,"3016 E Lake Mead Blvd, North Las Vegas, NV 89030","https://www.bighorncasino.com/",NOTE),
  casino("cannery-north-las-vegas","Cannery Casino & Hotel",36.2393063,-115.1229429,"2121 E Craig Rd, North Las Vegas, NV 89030","https://www.cannerycasino.com/",`${NOTE} Distinct from the closed Eastside Cannery property.`),
  casino("aliante","Aliante Casino + Hotel + Spa",36.2919823,-115.184763,"7300 N Aliante Pkwy, North Las Vegas, NV 89084","https://www.aliantegaming.com/",`${NOTE} Historical Aliante Station naming collapses to this current property.`),
  casino("santa-fe-station","Santa Fe Station Hotel & Casino",36.2498453,-115.2442324,"4949 N Rancho Dr, Las Vegas, NV 89130","https://santafestation.com/",NOTE),
];
