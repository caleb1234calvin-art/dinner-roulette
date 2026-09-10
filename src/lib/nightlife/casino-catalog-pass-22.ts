import type { CasinoAuditRecord } from "./casino-catalog";

const SD_DOR_SOURCE = "https://dor.sd.gov/businesses/gaming/";
const DEADWOOD_SOURCE = "https://www.deadwood.com/businesses/casinos/";
const ND_AG_SOURCE = "https://attorneygeneral.nd.gov/licensing-and-gaming/gaming/";
const NIGC_SOURCE = "https://www.nigc.gov/downloads/gaming-locations/";
const VERIFIED_ON = "2026-09-10";

const casino=(id:string,name:string,lat:number,lon:number,address:string,jurisdiction:string,operator:string,website:string,identitySource:string,notes:string):CasinoAuditRecord=>({id:`casino-catalog-${id}`,name,lat,lon,address,cuisines:["other"],cuisineLabel:"Casino",priceLevel:null,rating:null,reviewCount:null,openingHours:null,phone:null,website,isChain:false,photoKey:"cafe",source:"catalog",venueTypes:["casino"],energyLevel:2,audit:{verifiedOn:VERIFIED_ON,jurisdiction,operator,identitySource,notes}});

const SD_NOTES="South Dakota is reconciled as 18 current Deadwood casino destinations plus eight tribal casino destinations physically in South Dakota. Deadwood tourism's current casino directory is deduplicated to destination-level properties. A & B Pizza at Oyster Bay and Deadwood Badlands/Brothel Bar are not promoted as standalone casino destinations, while Bodega Casino and Buffalo-Bodega are treated as one complex. Rosebud Casino is excluded from South Dakota because the physical casino property is in Nebraska and is already cataloged there, despite legacy South Dakota references.";
const ND_NOTES="North Dakota Attorney General states that the state conducts inspections at five Indian casinos. This pass activates those five destination casinos: Dakota Magic, Spirit Lake, 4 Bears, Sky Dancer, and Prairie Knights. Charitable gaming, OTB sites, and smaller non-destination gaming listings are excluded from the curated casino backbone.";

export const CASINO_CATALOG_PASS_22: CasinoAuditRecord[] = [
casino("sd-777-deadwood","777 Casino at the Holiday Inn Express",44.37735,-103.72975,"665 Main St, Deadwood, SD 57732","South Dakota","Gold Dust / Holiday Inn Express","https://www.deadwood.com/business/casinos/777-casino-at-the-holiday-inn-express/",DEADWOOD_SOURCE,SD_NOTES),
casino("sd-buffalo-bodega","Buffalo-Bodega Gaming Complex",44.3770685,-103.7301568,"658 Main St, Deadwood, SD 57732","South Dakota","Buffalo-Bodega","https://www.deadwood.com/business/casinos/",DEADWOOD_SOURCE,SD_NOTES),
casino("sd-cadillac-jacks","Cadillac Jack's Gaming Resort",44.3850646,-103.721125,"360 Main St, Deadwood, SD 57732","South Dakota","Liv Hospitality","https://www.cadillacjacksgaming.com/",DEADWOOD_SOURCE,SD_NOTES),
casino("sd-celebrity","Celebrity Hotel Museum & Gaming",44.37794,-103.72872,"629 Main St, Deadwood, SD 57732","South Dakota","Celebrity Hotel","https://www.deadwood.com/business/casinos/",DEADWOOD_SOURCE,SD_NOTES),
casino("sd-deadwood-gulch","Deadwood Gulch Gaming Resort",44.3646834,-103.7357344,"304 Cliff St, Deadwood, SD 57732","South Dakota","Deadwood Gulch","https://www.deadwoodgulchresort.com/",DEADWOOD_SOURCE,SD_NOTES),
casino("sd-mountain-grand","Deadwood Mountain Grand Casino",44.376651,-103.7296415,"1906 Deadwood Mountain Dr, Deadwood, SD 57732","South Dakota","Deadwood Mountain Grand","https://www.deadwoodmountaingrand.com/",DEADWOOD_SOURCE,SD_NOTES),
casino("sd-first-gold","First Gold Gaming Resort",44.3866043,-103.7180213,"270 Main St, Deadwood, SD 57732","South Dakota","First Gold","https://www.firstgold.com/",DEADWOOD_SOURCE,SD_NOTES),
casino("sd-gold-dust","Gold Dust Casino",44.37675,-103.7308,"688 Main St, Deadwood, SD 57732","South Dakota","Gold Dust","https://www.golddustdeadwood.com/",DEADWOOD_SOURCE,SD_NOTES),
casino("sd-bullock","Historic Bullock Hotel Casino",44.3777193,-103.7289887,"633 Main St, Deadwood, SD 57732","South Dakota","Bullock Hotel","https://www.deadwood.com/business/hotels-motels/bullock-hotel/",DEADWOOD_SOURCE,SD_NOTES),
casino("sd-midnight-star","Midnight Star Casino",44.3769,-103.73015,"677 Main St, Deadwood, SD 57732","South Dakota","Midnight Star","https://www.deadwood.com/business/casual-dining/midnight-star/",DEADWOOD_SOURCE,SD_NOTES),
casino("sd-mineral-palace","Mineral Palace Casino",44.3782874,-103.7284607,"601 Main St, Deadwood, SD 57732","South Dakota","Mineral Palace","https://www.deadwood.com/business/casinos/mineral-palace-casino/",DEADWOOD_SOURCE,SD_NOTES),
casino("sd-mr-wus","Mr Wu's Casino",44.3794289,-103.726059,"560 Main St, Deadwood, SD 57732","South Dakota","Mr Wu's","https://www.deadwood.com/business/casinos/mr-wus/",DEADWOOD_SOURCE,SD_NOTES),
casino("sd-rocksino","Rocksino by Hard Rock Deadwood",44.3763622,-103.730816,"685 Main St, Deadwood, SD 57732","South Dakota","Hard Rock International","https://rocksino.hardrock.com/deadwood",DEADWOOD_SOURCE,SD_NOTES),
casino("sd-saloon-10","Saloon No. 10 Casino",44.37825,-103.72921,"657 Main St, Deadwood, SD 57732","South Dakota","Saloon No. 10","https://www.deadwood.com/business/casinos/saloon-10-casino/",DEADWOOD_SOURCE,SD_NOTES),
casino("sd-silverado-franklin","Silverado Franklin Historic Hotel & Gaming Complex",44.3760844,-103.7314249,"709 Main St, Deadwood, SD 57732","South Dakota","Silverado Franklin","https://silveradofranklin.com/",DEADWOOD_SOURCE,SD_NOTES),
casino("sd-landmark","The Landmark Deadwood - Hotel & Casino",44.375506,-103.728927,"53 Sherman St, Deadwood, SD 57732","South Dakota","The Landmark Deadwood","https://deadwoodlandmark.com/",DEADWOOD_SOURCE,SD_NOTES),
casino("sd-lodge-deadwood","The Lodge at Deadwood Gaming Resort",44.3950056,-103.7155495,"100 Pine Crest Ln, Deadwood, SD 57732","South Dakota","The Lodge at Deadwood","https://www.deadwoodlodge.com/",DEADWOOD_SOURCE,SD_NOTES),
casino("sd-tin-lizzie","Tin Lizzie Gaming Resort",44.37964,-103.72553,"555 Main St, Deadwood, SD 57732","South Dakota","Tin Lizzie Gaming Resort","https://www.tinlizzie.com/",DEADWOOD_SOURCE,SD_NOTES),
casino("sd-dakota-sioux","Dakota Sioux Casino & Hotel",45.0041622,-97.1487316,"16415 Sioux Conifer Rd, Watertown, SD 57201","South Dakota","Sisseton Wahpeton Oyate","https://www.dakotasioux.com/",SD_DOR_SOURCE,SD_NOTES),
casino("sd-dakota-connection","Dakota Connection Casino",45.6611719,-96.9770289,"46102 SD-10, Sisseton, SD 57262","South Dakota","Sisseton Wahpeton Oyate","https://www.dakotaconnectioncasino.com/",SD_DOR_SOURCE,SD_NOTES),
casino("sd-fort-randall","Fort Randall Casino & Hotel",43.083096,-98.475512,"38538 SD-46, Lake Andes, SD 57356","South Dakota","Yankton Sioux Tribe","https://www.fortrandall.com/",SD_DOR_SOURCE,SD_NOTES),
casino("sd-royal-river","Royal River Casino & Hotel",44.041836,-96.606206,"607 S Veterans St, Flandreau, SD 57028","South Dakota","Flandreau Santee Sioux Tribe","https://royalrivercasino.com/",SD_DOR_SOURCE,SD_NOTES),
casino("sd-lode-star","Lode Star Casino",44.0694746,-99.4387291,"1003 SD Hwy 34/47, Fort Thompson, SD 57339","South Dakota","Crow Creek Sioux Tribe","https://www.lodestarcasino.com/",SD_DOR_SOURCE,SD_NOTES),
casino("sd-golden-buffalo","Golden Buffalo Casino & Hotel",44.071461,-99.578632,"321 Sitting Bull St, Lower Brule, SD 57548","South Dakota","Lower Brule Sioux Tribe","https://goldenbuffalocasino.com/",SD_DOR_SOURCE,SD_NOTES),
casino("sd-prairie-wind","Prairie Wind Casino & Hotel",43.1849031,-102.9936007,"26 Casino Dr, Oglala, SD 57764","South Dakota","Oglala Sioux Tribe","https://www.prairiewindcasino.com/",SD_DOR_SOURCE,SD_NOTES),
casino("sd-grand-river","Grand River Casino & Resort",45.561482,-100.5065658,"2 US-12, Mobridge, SD 57601","South Dakota","Standing Rock Sioux Tribe","https://grandrivercasino.com/",SD_DOR_SOURCE,SD_NOTES),

casino("nd-dakota-magic","Dakota Magic Casino & Hotel",45.9382511,-96.8354809,"16849 102nd St SE, Hankinson, ND 58041","North Dakota","Sisseton Wahpeton Oyate","https://www.dakotamagic.com/",ND_AG_SOURCE,ND_NOTES),
casino("nd-spirit-lake","Spirit Lake Casino & Resort",48.0159855,-98.9073949,"7889 ND-57, St Michael, ND 58370","North Dakota","Spirit Lake Tribe","https://www.spiritlakecasino.com/",ND_AG_SOURCE,ND_NOTES),
casino("nd-four-bears","4 Bears Casino & Lodge",47.9797359,-102.5751896,"202 Frontage Rd, New Town, ND 58763","North Dakota","Three Affiliated Tribes of the Fort Berthold Reservation","https://www.4bearscasino.com/",ND_AG_SOURCE,ND_NOTES),
casino("nd-sky-dancer","Sky Dancer Casino & Resort",48.810522,-99.845838,"3965 Sky Dancer Way NE, Belcourt, ND 58316","North Dakota","Turtle Mountain Band of Chippewa Indians","https://skydancercasino.com/",ND_AG_SOURCE,ND_NOTES),
casino("nd-prairie-knights","Prairie Knights Casino & Resort",46.2739807,-100.6368225,"7932 ND-24, Fort Yates, ND 58538","North Dakota","Standing Rock Sioux Tribe","https://prairieknights.com/",ND_AG_SOURCE,ND_NOTES),
];
