import type { CasinoAuditRecord } from "./casino-catalog";

const VERIFIED_ON = "2026-09-12";
const casino=(id:string,name:string,lat:number,lon:number,address:string,operator:string,website:string,identitySource:string,notes:string):CasinoAuditRecord=>({id:`casino-catalog-${id}`,name,lat,lon,address,cuisines:["other"],cuisineLabel:"Casino",priceLevel:null,rating:null,reviewCount:null,openingHours:null,phone:null,website,isChain:false,photoKey:"cafe",source:"catalog",venueTypes:["casino"],energyLevel:2,audit:{verifiedOn:VERIFIED_ON,jurisdiction:"Oklahoma",operator,identitySource,notes}});
const NOTE="Current Oklahoma destination previously cleared property-specific coordinate QA and was withheld from Pass 28 only for street-number normalization. Address hold resolved September 12, 2026.";

/** Oklahoma Pass 30: two additions promoted after final address normalization. */
export const CASINO_CATALOG_PASS_30: CasinoAuditRecord[] = [
  casino("ok-muscogee-duck-creek","Duck Creek Casino",35.81431,-96.01402,"10071 Ferguson Rd, Beggs, OK 74421","Muscogee Nation Gaming Enterprises","https://creeknationcasinoduckcreek.com/","https://creeknationcasinoduckcreek.com/",`${NOTE} Canonical runtime address uses 10071 Ferguson Rd based on the current Muscogee gaming-network location directory and regional tourism corroboration; the competing 10085 form is retained only as provenance in the audit artifact.`),
  casino("ok-muscogee-checotah","Checotah Casino",35.48143,-95.52278,"830 N Broadway St, Checotah, OK 74426","Muscogee Nation Gaming Enterprises","https://creeknationcasinochecotah.com/","https://creeknationcasinochecotah.com/",`${NOTE} Canonical runtime address uses 830 N Broadway St based on the current casino's property-specific first-party FAQ plus TravelOK; the broader 831 directory variant is retained only as provenance in the audit artifact.`),
];
