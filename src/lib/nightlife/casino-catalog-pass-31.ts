import type { CasinoAuditRecord } from "./casino-catalog";

const VERIFIED_ON = "2026-09-12";
const casino=(id:string,name:string,lat:number,lon:number,address:string,operator:string,website:string,identitySource:string,notes:string):CasinoAuditRecord=>({id:`casino-catalog-${id}`,name,lat,lon,address,cuisines:["other"],cuisineLabel:"Casino",priceLevel:null,rating:null,reviewCount:null,openingHours:null,phone:null,website,isChain:false,photoKey:"cafe",source:"catalog",venueTypes:["casino"],energyLevel:2,audit:{verifiedOn:VERIFIED_ON,jurisdiction:"Oklahoma",operator,identitySource,notes}});

/** Oklahoma Pass 31: Artesian Casino promoted after current-site lineage/address reconciliation. */
export const CASINO_CATALOG_PASS_31: CasinoAuditRecord[] = [
  casino("ok-artesian-casino","Artesian Casino",34.507847,-96.967535,"23 W Vinita Ave, Sulphur, OK 73086","Chickasaw Nation","https://www.artesianhotel.com/casino/","https://www.chickasaw.net/Our-Nation/Locations.aspx?searchtext=casino","Current Chickasaw casino directory and Artesian property directory use 23 W Vinita Ave for the casino; the integrated hotel/casino complex also uses 1001 W 1st Street as its broader property address. Treat these as one current destination, not separate casinos. Property-specific coordinate QA cleared September 12, 2026 in audit/oklahoma-coordinate-qa-pass-9-2026-09-12.json."),
];
