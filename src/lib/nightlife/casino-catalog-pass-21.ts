import type { CasinoAuditRecord } from "./casino-catalog";

const WA_SOURCE = "https://wsgc.wa.gov/tribal-partnerships/tribal-casino-locations";
const OR_SOURCE = "https://www.oregon.gov/osp/programs/pages/gaming-enforcement.aspx";
const NIGC_SOURCE = "https://www.nigc.gov/downloads/gaming-locations/";
const VERIFIED_ON = "2026-09-10";

const casino=(id:string,name:string,lat:number,lon:number,address:string,jurisdiction:string,operator:string,website:string,identitySource:string,notes:string):CasinoAuditRecord=>({id:`casino-catalog-${id}`,name,lat,lon,address,cuisines:["other"],cuisineLabel:"Casino",priceLevel:null,rating:null,reviewCount:null,openingHours:null,phone:null,website,isChain:false,photoKey:"cafe",source:"catalog",venueTypes:["casino"],energyLevel:2,audit:{verifiedOn:VERIFIED_ON,jurisdiction,operator,identitySource,notes}});

const WA_NOTES="Washington State Gambling Commission states that 23 tribes operate 29 casinos under compact. Its live directory currently renders 28 entries; Shoalwater Bay Casino is the omitted operating property and is separately confirmed by the casino's current site. This pass therefore reconciles 29 tribal casino destinations. Commercial house-banked card rooms are outside the national casino-destination scope.";
const OR_NOTES="Oregon tribal gaming is reconciled against Oregon State Police compact oversight, NIGC materials, and current tribal/operator sites. Eight compacted tribes currently operate gaming; Burns Paiute's Old Camp Casino remains closed. The Coquille Tribe now operates two Ko-Kwel destinations, including the expanded Class II Medford casino, while the Confederated Tribes of Coos, Lower Umpqua and Siuslaw operate two Three Rivers locations. This produces ten current casino destinations under the app scope.";

export const CASINO_CATALOG_PASS_21: CasinoAuditRecord[] = [
casino("wa-12-tribes-lake-chelan","12 Tribes Lake Chelan Casino",47.88556,-120.13187,"455 E Wapato Lake Rd, Manson, WA 98831","Washington","Confederated Tribes of the Colville Reservation","https://colvillecasinos.com/lake-chelan-casino/",WA_SOURCE,WA_NOTES),
casino("wa-12-tribes-omak","12 Tribes Omak Casino Hotel",48.38173,-119.53271,"28968 Highway 97, Omak, WA 98841","Washington","Confederated Tribes of the Colville Reservation","https://colvillecasinos.com/12-tribes-omak-casino-hotel/",WA_SOURCE,WA_NOTES),
casino("wa-12-tribes-coulee-dam","12 Tribes Coulee Dam Casino",47.966343,-118.977876,"515 Birch St, Coulee Dam, WA 99116","Washington","Confederated Tribes of the Colville Reservation","https://colvillecasinos.com/coulee-dam-casino/",WA_SOURCE,WA_NOTES),
casino("wa-7-cedars","7 Cedars Casino",48.02188,-123.01089,"270756 Hwy 101, Sequim, WA 98382","Washington","Jamestown S'Klallam Tribe","https://7cedars.com/",WA_SOURCE,WA_NOTES),
casino("wa-angel-winds","Angel of the Winds Casino Resort",48.2144,-122.1847,"3438 Stoluckquamish Ln, Arlington, WA 98223","Washington","Stillaguamish Tribe of Indians","https://www.angelofthewinds.com/",WA_SOURCE,WA_NOTES),
casino("wa-emerald-queen-fife","Emerald Queen Casino & Hotel - Fife",47.24215,-122.35218,"5700 Pacific Hwy E, Fife, WA 98424","Washington","Puyallup Tribe of Indians","https://www.emeraldqueen.com/",WA_SOURCE,WA_NOTES),
casino("wa-emerald-queen-tacoma","Emerald Queen Casino & Hotel - Tacoma",47.23788,-122.40837,"2920 E R St, Tacoma, WA 98404","Washington","Puyallup Tribe of Indians","https://www.emeraldqueen.com/tacoma/",WA_SOURCE,WA_NOTES),
casino("wa-ilani","ilani Casino Resort",45.85289,-122.706945,"1 Cowlitz Way, Ridgefield, WA 98642","Washington","Cowlitz Indian Tribe","https://ilaniresort.com/",WA_SOURCE,WA_NOTES),
casino("wa-kalispel","Kalispel Casino",48.34928,-117.30298,"420 Qlispe River Way, Cusick, WA 99119","Washington","Kalispel Tribe of Indians","https://www.kalispelcasino.com/",WA_SOURCE,WA_NOTES),
casino("wa-legends","Legends Casino",46.37328,-120.34118,"580 E Fort Rd, Toppenish, WA 98948","Washington","Confederated Tribes and Bands of the Yakama Nation","https://legendscasino.com/",WA_SOURCE,WA_NOTES),
casino("wa-little-creek","Little Creek Casino Resort",47.12832,-123.10175,"91 W State Route 108, Shelton, WA 98584","Washington","Squaxin Island Tribe","https://www.little-creek.com/",WA_SOURCE,WA_NOTES),
casino("wa-lucky-dog","Lucky Dog Casino",47.337269,-123.160611,"19330 N Hwy 101, Shelton, WA 98584","Washington","Skokomish Indian Tribe","https://wsgc.wa.gov/tribal-partnerships/tribal-casino-locations",WA_SOURCE,WA_NOTES),
casino("wa-lucky-eagle","Lucky Eagle Casino",46.814,-123.15417,"12888 188th Ave SW, Rochester, WA 98579","Washington","Confederated Tribes of the Chehalis Reservation","https://luckyeagle.com/",WA_SOURCE,WA_NOTES),
casino("wa-mistequa","Mistequa Casino Hotel",48.239205,-117.710747,"2555 Smith Rd, Chewelah, WA 99109","Washington","Spokane Tribe of Indians","https://mistequa.com/",WA_SOURCE,WA_NOTES),
casino("wa-muckleshoot","Muckleshoot Casino Resort",47.29027,-122.19541,"2402 Auburn Way S, Auburn, WA 98002","Washington","Muckleshoot Indian Tribe","https://www.muckleshootcasino.com/",WA_SOURCE,WA_NOTES),
casino("wa-northern-quest","Northern Quest Resort & Casino",47.65901,-117.56245,"100 N Hayford Rd, Airway Heights, WA 99001","Washington","Kalispel Tribe of Indians","https://www.northernquest.com/",WA_SOURCE,WA_NOTES),
casino("wa-northwood","Northwood Casino",48.99432,-122.405957,"9750 Northwood Rd, Lynden, WA 98264","Washington","Nooksack Indian Tribe","https://wsgc.wa.gov/tribal-partnerships/tribal-casino-locations",WA_SOURCE,WA_NOTES),
casino("wa-quil-ceda-creek","Quil Ceda Creek Casino",48.05154,-122.18867,"6221 31st Ave NE, Tulalip, WA 98271","Washington","Tulalip Tribes of Washington","https://www.quilcedacreekcasino.com/",WA_SOURCE,WA_NOTES),
casino("wa-quinault-beach","Quinault Beach Resort & Casino",47.0432,-124.17123,"78 State Route 115, Ocean Shores, WA 98569","Washington","Quinault Indian Nation","https://quinaultbeachresort.com/",WA_SOURCE,WA_NOTES),
casino("wa-red-wind","Red Wind Casino",47.00029,-122.66812,"12819 Yelm Hwy SE, Olympia, WA 98513","Washington","Nisqually Indian Tribe","https://www.redwindcasino.com/",WA_SOURCE,WA_NOTES),
casino("wa-shoalwater-bay","Shoalwater Bay Casino",46.72506,-124.02065,"4112 State Route 105, Tokeland, WA 98590","Washington","Shoalwater Bay Indian Tribe","https://shoalwaterbaycasino.com/",WA_SOURCE,WA_NOTES),
casino("wa-silver-reef","Silver Reef Casino Resort",48.81743,-122.62598,"4876 Haxton Way, Ferndale, WA 98248","Washington","Lummi Nation","https://silverreefcasino.com/",WA_SOURCE,WA_NOTES),
casino("wa-skagit-valley","Skagit Valley Casino Resort",48.55939,-122.34731,"5984 N Darrk Ln, Bow, WA 98232","Washington","Upper Skagit Indian Tribe","https://www.theskagit.com/",WA_SOURCE,WA_NOTES),
casino("wa-snoqualmie","Snoqualmie Casino",47.51863,-121.84172,"37500 SE North Bend Way, Snoqualmie, WA 98065","Washington","Snoqualmie Indian Tribe","https://www.snocasino.com/",WA_SOURCE,WA_NOTES),
casino("wa-spokane-tribe","Spokane Tribe Casino",47.64559,-117.60895,"14300 W State Route 2, Airway Heights, WA 99001","Washington","Spokane Tribe of Indians","https://www.spokanetribecasino.com/",WA_SOURCE,WA_NOTES),
casino("wa-clearwater","Suquamish Clearwater Casino Resort",47.71296,-122.57071,"15347 Suquamish Way NE, Suquamish, WA 98392","Washington","Suquamish Tribe","https://www.clearwatercasino.com/",WA_SOURCE,WA_NOTES),
casino("wa-swinomish","Swinomish Casino & Lodge",48.4581,-122.519978,"12885 Casino Dr, Anacortes, WA 98221","Washington","Swinomish Indian Tribal Community","https://swinomishcasinoandlodge.com/",WA_SOURCE,WA_NOTES),
casino("wa-point","The Point Casino",47.84461,-122.54328,"7989 Salish Ln NE, Kingston, WA 98346","Washington","Port Gamble S'Klallam Tribe","https://www.the-point-casino.com/",WA_SOURCE,WA_NOTES),
casino("wa-tulalip","Tulalip Resort Casino",48.08814,-122.18989,"10200 Quil Ceda Blvd, Tulalip, WA 98271","Washington","Tulalip Tribes of Washington","https://www.tulalipresortcasino.com/",WA_SOURCE,WA_NOTES),

casino("or-spirit-mountain","Spirit Mountain Casino",45.05796,-123.58199,"27100 SW Salmon River Hwy, Grand Ronde, OR 97347","Oregon","Confederated Tribes of the Grand Ronde Community of Oregon","https://www.spiritmountain.com/",OR_SOURCE,OR_NOTES),
casino("or-chinook-winds","Chinook Winds Casino Resort",44.998096,-124.009215,"1777 NW 44th St, Lincoln City, OR 97367","Oregon","Confederated Tribes of Siletz Indians","https://www.chinookwindscasino.com/",OR_SOURCE,OR_NOTES),
casino("or-three-rivers-florence","Three Rivers Casino Resort - Florence",43.982145,-124.087342,"5647 Hwy 126, Florence, OR 97439","Oregon","Confederated Tribes of Coos, Lower Umpqua and Siuslaw Indians","https://www.threeriverscasino.com/",OR_SOURCE,OR_NOTES),
casino("or-three-rivers-coos-bay","Three Rivers Casino - Coos Bay",43.39127,-124.265631,"1297 Ocean Blvd, Coos Bay, OR 97420","Oregon","Confederated Tribes of Coos, Lower Umpqua and Siuslaw Indians","https://www.threeriverscasino.com/coos-bay",OR_SOURCE,OR_NOTES),
casino("or-kokwel-coos-bay","Ko-Kwel Casino Resort - Coos Bay",43.39833,-124.21907,"3201 Tremont Ave, North Bend, OR 97459","Oregon","Coquille Indian Tribe","https://www.kokwelresorts.com/coos-bay/",OR_SOURCE,OR_NOTES),
casino("or-seven-feathers","Seven Feathers Casino Resort",42.93916,-123.28329,"146 Chief Miwaleta Ln, Canyonville, OR 97417","Oregon","Cow Creek Band of Umpqua Tribe of Indians","https://sevenfeathers.com/",OR_SOURCE,OR_NOTES),
casino("or-wildhorse","Wildhorse Resort & Casino",45.6474,-118.67951,"46510 Wildhorse Blvd, Pendleton, OR 97801","Oregon","Confederated Tribes of the Umatilla Indian Reservation","https://www.wildhorseresort.com/",OR_SOURCE,OR_NOTES),
casino("or-indian-head","Indian Head Casino",44.764209,-121.251601,"3236 Hwy 26, Warm Springs, OR 97761","Oregon","Confederated Tribes of the Warm Springs Reservation","https://www.indianheadcasino.com/",OR_SOURCE,OR_NOTES),
casino("or-kla-mo-ya","Kla-Mo-Ya Casino",42.53559,-121.88274,"34333 Hwy 97 N, Chiloquin, OR 97624","Oregon","The Klamath Tribes","https://www.klamoyacasino.com/",OR_SOURCE,OR_NOTES),
casino("or-kokwel-medford","Ko-Kwel Casino Resort - Medford",42.3037,-122.85041,"2375 S Pacific Hwy, Medford, OR 97501","Oregon","Coquille Indian Tribe","https://www.kokwelresorts.com/medford/",NIGC_SOURCE,OR_NOTES),
];
