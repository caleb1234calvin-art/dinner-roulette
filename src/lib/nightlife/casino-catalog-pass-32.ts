import type { CasinoAuditRecord } from "./casino-catalog";

const VERIFIED_ON="2026-09-11";
const NGCB_SOURCE="https://www.gaming.nv.gov/";
const LAUGHLIN_QA="audit/nevada-runtime-batch-2-laughlin-qa-2026-09-11.json";
const RENO_QA="audit/nevada-runtime-batch-2-reno-sparks-qa-2026-09-11.json";
const casino=(id:string,name:string,lat:number,lon:number,address:string,coordinateSource:string,notes:string):CasinoAuditRecord=>({id:`casino-catalog-nv-${id}`,name,lat,lon,address,cuisines:["other"],cuisineLabel:"Casino",priceLevel:null,rating:null,reviewCount:null,openingHours:null,phone:null,website:null,isChain:false,photoKey:"cafe",source:"catalog",venueTypes:["casino"],energyLevel:2,audit:{verifiedOn:VERIFIED_ON,jurisdiction:"Nevada",identitySource:NGCB_SOURCE,coordinateSource,notes}});
const NOTE="Nevada rolling runtime batch NV-02 staged subset. Current physical operation, normalized address, property-specific coordinate, stable ID and alias/collision QA were cleared in the cited segment artifact. This pass does not claim Nevada statewide completeness.";

/** Nevada Pass 32: QA-cleared Laughlin and Reno-Sparks NV-02 segments. */
export const CASINO_CATALOG_PASS_32:CasinoAuditRecord[]=[
  casino("aquarius-laughlin","Aquarius Casino Resort",35.16368,-114.57216,"1900 S Casino Dr, Laughlin, NV 89029",LAUGHLIN_QA,NOTE),
  casino("riverside-laughlin","Don Laughlin's Riverside Resort Hotel & Casino",35.16742,-114.57152,"1650 S Casino Dr, Laughlin, NV 89029",LAUGHLIN_QA,NOTE),
  casino("edgewater-laughlin","Edgewater Casino Resort",35.16049,-114.57195,"2020 S Casino Dr, Laughlin, NV 89029",LAUGHLIN_QA,NOTE),
  casino("golden-nugget-laughlin","Golden Nugget Laughlin",35.15411,-114.57335,"2300 S Casino Dr, Laughlin, NV 89029",LAUGHLIN_QA,NOTE),
  casino("harrahs-laughlin","Harrah's Laughlin Beach Resort & Casino",35.14479,-114.57676,"2900 S Casino Dr, Laughlin, NV 89029",LAUGHLIN_QA,NOTE),
  casino("laughlin-river-lodge","Laughlin River Lodge Hotel & Casino",35.14971,-114.57596,"2700 S Casino Dr, Laughlin, NV 89029",LAUGHLIN_QA,NOTE),
  casino("new-pioneer","The New Pioneer",35.15547,-114.57272,"2200 S Casino Dr, Laughlin, NV 89029",LAUGHLIN_QA,`${NOTE} Preserve Pioneer Hotel & Gambling Hall as an alias for dedupe protection.`),
  casino("tropicana-laughlin","Tropicana Laughlin",35.15786,-114.57567,"2121 S Casino Dr, Laughlin, NV 89029",LAUGHLIN_QA,NOTE),
  casino("atlantis-reno","Atlantis Casino Resort Spa",39.4888,-119.7951,"3800 S Virginia St, Reno, NV 89502",RENO_QA,NOTE),
  casino("peppermill-reno","Peppermill Resort Spa Casino",39.49732,-119.80139,"2707 S Virginia St, Reno, NV 89502",RENO_QA,NOTE),
  casino("grand-sierra-resort","Grand Sierra Resort and Casino",39.52357,-119.77888,"2500 E 2nd St, Reno, NV 89595",RENO_QA,NOTE),
  casino("nugget-sparks","Nugget Casino Resort",39.53438,-119.75784,"1100 Nugget Ave, Sparks, NV 89431",RENO_QA,NOTE),
  casino("western-village-sparks","Western Village Inn & Casino",39.53436,-119.73436,"815 Nichols Blvd, Sparks, NV 89434",RENO_QA,NOTE),
  casino("alamo-sparks-petro","Alamo Casino Sparks Petro",39.523855,-119.708235,"1950 E Greg St, Sparks, NV 89431",RENO_QA,`${NOTE} Coordinate is address-specific to the verified 1950 E Greg St casino parcel.`),
  casino("bonanza-reno","Bonanza Casino",39.57111,-119.82561,"4720 N Virginia St, Reno, NV 89506",RENO_QA,NOTE),
];
