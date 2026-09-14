import type { CasinoAuditRecord } from "./casino-catalog";

const ADG_SOURCE = "https://gaming.az.gov/tribal-gaming/casino-tribal-gaming-offices";
const ADG_STATUS_SOURCE = "https://gaming.az.gov/status-tribal-gaming-arizona-08012026";
const VERIFIED_ON = "2026-09-09";
const NOTES = "Arizona Department of Gaming's current tribal-gaming directory identifies 26 Class III casino facilities operated by 16 tribes. This pass follows that regulator roster and excludes event-wagering retail locations, OTBs, and online-only operators. ADG separately notes one Class II facility; it is not promoted here without a matching current destination entry in the state casino directory.";

const casino=(id:string,name:string,lat:number,lon:number,address:string,operator:string,website:string):CasinoAuditRecord=>({id:`casino-catalog-${id}`,name,lat,lon,address,cuisines:["other"],cuisineLabel:"Casino",priceLevel:null,rating:null,reviewCount:null,openingHours:null,phone:null,website,isChain:false,photoKey:"cafe",source:"catalog",venueTypes:["casino"],energyLevel:2,audit:{verifiedOn:VERIFIED_ON,jurisdiction:"Arizona",operator,identitySource:ADG_SOURCE,notes:NOTES}});

export const CASINO_CATALOG_PASS_18: CasinoAuditRecord[] = [
casino("az-apache-gold","Apache Gold Casino Resort",33.358342,-110.668755,"777 Geronimo Springs Blvd, San Carlos, AZ 85550","San Carlos Apache Tribe","https://apachegoldcasinos.com/"),
casino("az-apache-sky","Apache Sky Casino",32.887734,-110.702219,"777 Apache Sky Blvd, Winkelman, AZ 85192","San Carlos Apache Tribe","https://myapachecasinos.com/"),
casino("az-bluewater","BlueWater Resort & Casino",34.166842,-114.267984,"11300 Resort Dr, Parker, AZ 85344","Colorado River Indian Tribes","https://bluewaterfun.com/"),
casino("az-buckys","Bucky's Casino",34.551122,-112.447267,"1500 AZ-69, Prescott, AZ 86301","Yavapai-Prescott Indian Tribe","https://www.buckyscasino.com/"),
casino("az-casino-arizona","Casino Arizona",33.45438,-111.885694,"524 N 92nd St, Scottsdale, AZ 85256","Salt River Pima-Maricopa Indian Community","https://www.casinoarizona.com/"),
casino("az-casino-del-sol","Casino Del Sol",32.13104,-111.086897,"5655 W Valencia Rd, Tucson, AZ 85757","Pascua Yaqui Tribe","https://www.casinodelsol.com/"),
casino("az-casino-of-sun","Casino of the Sun",32.117459,-111.064173,"7406 S Camino De Oeste, Tucson, AZ 85746","Pascua Yaqui Tribe","https://www.casinodelsol.com/casino-of-the-sun"),
casino("az-cliff-castle","Cliff Castle Casino Hotel",34.606494,-111.862328,"555 W Middle Verde Rd, Camp Verde, AZ 86322","Yavapai-Apache Nation","https://cliffcastlecasinohotel.com/"),
casino("az-cocopah","Cocopah Casino",32.606617,-114.651656,"15318 S Avenue B, Somerton, AZ 85350","Cocopah Indian Tribe","https://www.cocopahcasino.com/"),
casino("az-dd-sahuarita","Desert Diamond Casino & Entertainment - Sahuarita",32.005556,-110.988106,"1100 W Pima Mine Rd, Sahuarita, AZ 85629","Tohono O'odham Nation","https://www.ddcaz.com/sahuarita"),
casino("az-dd-tucson","Desert Diamond Casino & Hotel - Tucson",32.118157,-110.964147,"7350 S Nogales Hwy, Tucson, AZ 85756","Tohono O'odham Nation","https://www.ddcaz.com/tucson"),
casino("az-dd-west-valley","Desert Diamond Casino - West Valley",33.546502,-112.26123,"9431 W Northern Ave, Glendale, AZ 85305","Tohono O'odham Nation","https://www.ddcaz.com/west-valley"),
casino("az-dd-white-tanks","Desert Diamond Casino - White Tanks at San Lucy",33.55517,-112.41245,"8200 N Sarival Ave, Waddell, AZ 85340","Tohono O'odham Nation","https://www.ddcaz.com/white-tanks"),
casino("az-harrahs-ak-chin","Harrah's Ak-Chin Casino",33.023989,-112.050679,"15406 N Maricopa Rd, Maricopa, AZ 85139","Ak-Chin Indian Community","https://www.caesars.com/harrahs-ak-chin"),
casino("az-hon-dah","Hon-Dah Casino",34.078918,-109.904782,"777 AZ-260, Pinetop, AZ 85935","White Mountain Apache Tribe","https://www.hon-dah.com/"),
casino("az-lone-butte","Lone Butte Casino",33.289141,-111.942719,"1077 S Kyrene Rd, Chandler, AZ 85226","Gila River Indian Community","https://playatgila.com/casinos/lone-butte/"),
casino("az-mazatzal","Mazatzal Casino",34.220427,-111.330052,"Highway 87, Mile Marker 251, Payson, AZ 85541","Tonto Apache Tribe","https://mazatzalcasino.com/"),
casino("az-paradise","Paradise Casino",32.734279,-114.613007,"450 Quechan Dr, Yuma, AZ 85364","Quechan Indian Tribe","https://paradisecasinoa.com/"),
casino("az-santan-mountain","Santan Mountain Casino",33.2904,-111.788,"7101 S Gilbert Rd, Chandler, AZ 85249","Gila River Indian Community","https://playatgila.com/casinos/santan-mountain/"),
casino("az-spirit-mountain","Spirit Mountain Casino",34.907643,-114.597878,"8555 AZ-95, Mohave Valley, AZ 86440","Fort Mojave Indian Tribe","https://www.runtothemountain.com/"),
casino("az-talking-stick","Talking Stick Resort",33.540113,-111.869849,"9800 Talking Stick Way, Scottsdale, AZ 85256","Salt River Pima-Maricopa Indian Community","https://www.talkingstickresort.com/"),
casino("az-twin-arrows","Twin Arrows Navajo Casino Resort",35.167267,-111.258919,"22181 Resort Blvd, Flagstaff, AZ 86004","Navajo Nation","https://www.twinarrows.com/"),
casino("az-vee-quiva","Vee Quiva Hotel & Casino",33.310132,-112.157063,"15091 S Komatke Ln, Laveen Village, AZ 85339","Gila River Indian Community","https://playatgila.com/casinos/vee-quiva/"),
casino("az-we-ko-pa","We-Ko-Pa Casino Resort",33.5817,-111.681,"10438 Wekopa Way, Fort McDowell, AZ 85264","Fort McDowell Yavapai Nation","https://www.wekopacasinoresort.com/"),
casino("az-wild-horse-pass","Wild Horse Pass Hotel & Casino",33.28171,-111.973714,"5040 Wild Horse Pass Blvd, Chandler, AZ 85226","Gila River Indian Community","https://playatgila.com/casinos/wild-horse-pass/"),
casino("az-yavapai","Yavapai Casino",34.547576,-112.444822,"1505 AZ-69, Prescott, AZ 86303","Yavapai-Prescott Indian Tribe","https://www.buckyscasino.com/yavapai-casino/"),
];

export const ARIZONA_AUDIT_SOURCE = ADG_STATUS_SOURCE;
