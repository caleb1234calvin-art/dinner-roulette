import type { CasinoAuditRecord } from "./casino-catalog";

const VERIFIED_ON="2026-09-12";
const QA="audit/nevada-rural-coordinate-qa-pass-7-2026-09-12.json";
const casino=(id:string,name:string,lat:number,lon:number,address:string,website:string,notes:string):CasinoAuditRecord=>({id:`casino-catalog-nv-${id}`,name,lat,lon,address,cuisines:["other"],cuisineLabel:"Casino",priceLevel:null,rating:null,reviewCount:null,openingHours:null,phone:null,website,isChain:false,photoKey:"cafe",source:"catalog",venueTypes:["casino"],energyLevel:2,audit:{verifiedOn:VERIFIED_ON,jurisdiction:"Nevada",identitySource:website,coordinateSource:QA,notes}});
const NOTE="Nevada rolling rural runtime increment. Current identity/operation, normalized address, property-specific coordinate, stable ID and duplicate/collision QA cleared in the cited audit artifact. This pass does not claim Nevada statewide completeness.";

/** Nevada Pass 34: seven QA-cleared rural destinations. */
export const CASINO_CATALOG_PASS_34:CasinoAuditRecord[]=[
  casino("stockmans-fallon","Stockman's Casino",39.4755101,-118.7945951,"1560 W Williams Ave, Fallon, NV 89406","https://stockmanscasino.com/",NOTE),
  casino("winnemucca-inn","Winnemucca Inn & Casino",40.96759,-117.74107,"741 W Winnemucca Blvd, Winnemucca, NV 89445","https://winnemuccainn.com/",NOTE),
  casino("model-t-winnemucca","Model T Casino",40.964722,-117.744339,"1130 W Winnemucca Blvd, Winnemucca, NV 89445","https://modeltcasino.com/",NOTE),
  casino("winners-inn-winnemucca","Winners Inn & Casino",40.9725,-117.7361,"185 W Winnemucca Blvd, Winnemucca, NV 89445","https://winnersinn.com/",NOTE),
  casino("tonopah-station","Tonopah Station Hotel and Casino",38.05841,-117.2184,"1137 Erie Street, Tonopah, NV 89049","https://www.tonopahstation.com/",`${NOTE} Main/Erie corridor naming is normalized to the current first-party Erie Street form.`),
  casino("hotel-nevada-ely","Hotel Nevada & Gambling Hall",39.2479193,-114.892643,"501 Aultman St, Ely, NV 89301","https://www.hotelnevada.com/",NOTE),
  casino("prospector-ely","Prospector Hotel & Gambling Hall",39.258688,-114.859298,"1501 E Aultman St, Ely, NV 89301","https://www.prospectorhotel.com/",NOTE),
];
