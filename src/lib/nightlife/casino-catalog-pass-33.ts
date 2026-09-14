import type { CasinoAuditRecord } from "./casino-catalog";

const VERIFIED_ON="2026-09-12";
const RECONCILIATION="audit/texas-runtime-reconciliation-2026-09-12.json";
const casino=(id:string,name:string,lat:number,lon:number,address:string,website:string,notes:string):CasinoAuditRecord=>({id:`casino-catalog-${id}`,name,lat,lon,address,cuisines:["other"],cuisineLabel:"Casino",priceLevel:null,rating:null,reviewCount:null,openingHours:null,phone:null,website,isChain:false,photoKey:"cafe",source:"catalog",venueTypes:["casino"],energyLevel:2,audit:{verifiedOn:VERIFIED_ON,jurisdiction:"Texas",identitySource:website,coordinateSource:RECONCILIATION,notes}});
const NOTE="Texas statewide runtime reconciliation: current physical destination, normalized public address, property-specific coordinate, stable ID and duplicate/alias QA cleared. See the cited reconciliation artifact for provenance.";

/** Texas Pass 33: complete reconciled current Dinner Roulette casino destination set. */
export const CASINO_CATALOG_PASS_33:CasinoAuditRecord[]=[
  casino("tx-kickapoo-lucky-eagle","Kickapoo Lucky Eagle Casino Hotel",28.61092,-100.44078,"794 Lucky Eagle Drive, Eagle Pass, TX 78852","https://luckyeagletexas.com/",NOTE),
  casino("tx-naskila-livingston","Naskila Casino",30.7142259,-94.6746959,"540 State Park Road 56, Livingston, TX 77351","https://www.naskila.com/",`${NOTE} Duplicate historical Naskila Gaming regulator rows collapse to this Livingston property.`),
  casino("tx-naskila-leggett","Naskila Casino Leggett",30.8342009,-94.8624389,"10314 US 59 N, Livingston, TX 77351","https://www.naskila.com/leggett/",`${NOTE} Current temporary casino opened August 25, 2026; numerical point was closed by user-assisted current map-pin verification and is preserved as such in audit provenance.`),
  casino("tx-speaking-rock","Speaking Rock Entertainment Center",31.690126,-106.326605,"122 S Old Pueblo Rd, El Paso, TX 79907","https://www.speakingrock.com/",`${NOTE} Repeated regulator rows collapse to one physical Speaking Rock destination.`),
];
