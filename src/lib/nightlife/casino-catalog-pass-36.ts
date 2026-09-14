import type { CasinoAuditRecord } from "./casino-catalog";

const VERIFIED_ON="2026-09-12";
const JURISDICTION="Nevada";
const QA="audit/nevada-boulder-henderson-coordinate-qa-pass-9-2026-09-12.json";
const casino=(id:string,name:string,lat:number,lon:number,address:string,website:string,notes:string):CasinoAuditRecord=>({id:`casino-catalog-nv-${id}`,name,lat,lon,address,cuisines:["other"],cuisineLabel:"Casino",priceLevel:null,rating:null,reviewCount:null,openingHours:null,phone:null,website,isChain:false,photoKey:"cafe",source:"catalog",venueTypes:["casino"],energyLevel:2,audit:{verifiedOn:VERIFIED_ON,jurisdiction:JURISDICTION,identitySource:website,coordinateSource:QA,notes}});
const NOTE="Nevada rolling Boulder/Henderson runtime increment. Current identity/operation, normalized address, property-specific coordinate, stable ID and duplicate/collision QA cleared in the cited audit artifact. This pass does not claim Nevada statewide completeness.";

/** Nevada Pass 36: six QA-cleared Boulder Strip / Henderson destinations. */
export const CASINO_CATALOG_PASS_36:CasinoAuditRecord[]=[
  casino("boulder-station","Boulder Station Hotel & Casino",36.13379,-115.08525,"4111 Boulder Highway, Las Vegas, NV 89121","https://boulderstation.com/",NOTE),
  casino("sams-town-las-vegas","Sam's Town Hotel & Gambling Hall",36.11298,-115.06238,"5111 Boulder Highway, Las Vegas, NV 89122","https://samstownlv.boydgaming.com/",NOTE),
  casino("arizona-charlies-boulder","Arizona Charlie's Boulder",36.1240958,-115.0755858,"4575 Boulder Highway, Las Vegas, NV 89121","https://arizonacharliesboulder.com/",`${NOTE} Coordinate is the casino/hotel property, not the adjacent RV park.`),
  casino("sunset-station","Sunset Station Hotel & Casino",36.0629,-115.0404,"1301 W Sunset Rd, Henderson, NV 89014","https://sunsetstation.com/",NOTE),
  casino("green-valley-ranch","Green Valley Ranch Resort Spa Casino",36.02068,-115.08966,"2300 Paseo Verde Parkway, Henderson, NV 89052","https://greenvalleyranch.com/",NOTE),
  casino("wildfire-boulder","Wildfire Boulder",36.004894,-114.941267,"2000 S Boulder Hwy, Henderson, NV 89002","https://wildfiregaming.com/wildfires/wildfire-boulder/",`${NOTE} ID remains explicitly Boulder-specific to avoid collisions with other Wildfire properties.`),
];
