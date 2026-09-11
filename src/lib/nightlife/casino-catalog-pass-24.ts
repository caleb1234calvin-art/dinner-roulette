import type { CasinoAuditRecord } from "./casino-catalog";

const MN_SOURCE = "https://www.house.mn.gov/hrd/pubs/indiangb.pdf";
const NE_SOURCE = "https://nrgc.nebraska.gov/gaming";
const NIGC_SOURCE = "https://www.nigc.gov/downloads/gaming-locations/";
const VERIFIED_ON = "2026-09-10";

const casino=(id:string,name:string,lat:number,lon:number,address:string,jurisdiction:string,operator:string,website:string,identitySource:string,notes:string):CasinoAuditRecord=>({id:`casino-catalog-${id}`,name,lat,lon,address,cuisines:["other"],cuisineLabel:"Casino",priceLevel:null,rating:null,reviewCount:null,openingHours:null,phone:null,website,isChain:false,photoKey:"cafe",source:"catalog",venueTypes:["casino"],energyLevel:2,audit:{verifiedOn:VERIFIED_ON,jurisdiction,operator,identitySource,notes}});

const MN_NOTES="Minnesota House Research's current American Indians, Indian Tribes, and State Government publication states that Minnesota's 11 tribes operate 19 casinos. This pass activates that complete destination-casino roster.";
const NE_NOTES="Nebraska scope combines five current Nebraska Racing and Gaming Commission-regulated commercial racetrack casinos with five tribal casino destinations physically located in Nebraska. Prairie Flower Casino is not double-counted because its physical property is in Carter Lake, Iowa. Rosebud Casino is retained in Nebraska because its current operator and tribal owner both use the physical address 30421 US Highway 83, Valentine, NE 69201 and the property lies immediately south of the state line.";
const WY_NOTES="Wyoming is reconciled to the current NIGC roster: Wind River Casino and Little Wind Casino for the Northern Arapaho Tribe, plus Shoshone Rose Casino for the Eastern Shoshone Tribe. The older 789 Casino is not separately promoted because it is absent from the current roster.";

export const CASINO_CATALOG_PASS_24: CasinoAuditRecord[] = [
casino("mn-seven-clans-warroad","Seven Clans Warroad Casino",48.9022814,-95.2962683,"34966 605th Ave, Warroad, MN 56763","Minnesota","Red Lake Band of Chippewa Indians","https://www.sevenclanscasino.com/",MN_SOURCE,MN_NOTES),
casino("mn-grand-portage","Grand Portage Lodge & Casino",47.9540075,-89.6916412,"70 Casino Dr, Grand Portage, MN 55605","Minnesota","Grand Portage Band of Lake Superior Chippewa","https://www.grandportage.com/",MN_SOURCE,MN_NOTES),
casino("mn-seven-clans-thief-river-falls","Seven Clans Thief River Falls Casino",48.018537,-96.034234,"20595 Center St E, Thief River Falls, MN 56701","Minnesota","Red Lake Band of Chippewa Indians","https://www.sevenclanscasino.com/",MN_SOURCE,MN_NOTES),
casino("mn-seven-clans-red-lake","Seven Clans Red Lake Casino and Bingo",47.8031967,-95.0247124,"10200 Hwy 89, Red Lake, MN 56671","Minnesota","Red Lake Band of Chippewa Indians","https://www.sevenclanscasino.com/",MN_SOURCE,MN_NOTES),
casino("mn-fortune-bay","Fortune Bay Resort Casino",47.819708,-92.341313,"1430 Bois Forte Rd, Tower, MN 55790","Minnesota","Bois Forte Band of Chippewa","https://fortunebay.com/",MN_SOURCE,MN_NOTES),
casino("mn-white-oak","White Oak Casino",47.3402472,-93.8119461,"45830 US Highway 2, Deer River, MN 56636","Minnesota","Leech Lake Band of Ojibwe","https://whiteoakcasino.com/",MN_SOURCE,MN_NOTES),
casino("mn-shooting-star-bagley","Shooting Star Casino - Bagley",47.4955,-95.46,"13325 340th St, Bagley, MN 56621","Minnesota","White Earth Nation","https://www.starcasino.com/bagley/",MN_SOURCE,MN_NOTES),
casino("mn-shooting-star-mahnomen","Shooting Star Casino Hotel - Mahnomen",47.3082305,-95.9623601,"777 SE Casino Rd, Mahnomen, MN 56557","Minnesota","White Earth Nation","https://www.starcasino.com/",MN_SOURCE,MN_NOTES),
casino("mn-cedar-lakes","Cedar Lakes Casino & Hotel",47.384344,-94.6148,"6268 Upper Cass Frontage Rd NW, Cass Lake, MN 56633","Minnesota","Leech Lake Band of Ojibwe","https://cedarlakescasino.com/",MN_SOURCE,MN_NOTES),
casino("mn-northern-lights","Northern Lights Casino",47.0549446,-94.5363778,"6800 Y Frontage Rd NW, Walker, MN 56484","Minnesota","Leech Lake Band of Ojibwe","https://northernlightscasino.com/",MN_SOURCE,MN_NOTES),
casino("mn-fond-du-luth","Fond-du-Luth Casino",46.78888,-92.09624,"129 E Superior St, Duluth, MN 55802","Minnesota","Fond du Lac Band of Lake Superior Chippewa","https://fondduluthcasino.com/",MN_SOURCE,MN_NOTES),
casino("mn-black-bear","Black Bear Casino Resort",46.666096,-92.4781618,"1785 Highway 210, Carlton, MN 55718","Minnesota","Fond du Lac Band of Lake Superior Chippewa","https://www.blackbearcasinoresort.com/",MN_SOURCE,MN_NOTES),
casino("mn-grand-hinckley","Grand Casino Hinckley",46.0091115,-92.8982016,"777 Lady Luck Dr, Hinckley, MN 55037","Minnesota","Mille Lacs Band of Ojibwe","https://www.grandcasinomn.com/",MN_SOURCE,MN_NOTES),
casino("mn-grand-mille-lacs","Grand Casino Mille Lacs",46.1799087,-93.7590886,"777 Grand Ave, Onamia, MN 56359","Minnesota","Mille Lacs Band of Ojibwe","https://www.grandcasinomn.com/",MN_SOURCE,MN_NOTES),
casino("mn-prairies-edge","Prairie's Edge Casino Resort",44.7628954,-95.5261454,"5616 Prairies Edge Ln, Granite Falls, MN 56270","Minnesota","Upper Sioux Community","https://www.prairiesedgecasino.com/",MN_SOURCE,MN_NOTES),
casino("mn-jackpot-junction","Jackpot Junction Casino Hotel",44.5314688,-94.9992537,"39375 County Hwy 24, Morton, MN 56270","Minnesota","Lower Sioux Indian Community","https://www.jackpotjunction.com/",MN_SOURCE,MN_NOTES),
casino("mn-little-six","Little Six Casino",44.7369323,-93.4742462,"2450 Sioux Trail NW, Prior Lake, MN 55372","Minnesota","Shakopee Mdewakanton Sioux Community","https://www.littlesixcasino.com/",MN_SOURCE,MN_NOTES),
casino("mn-mystic-lake","Mystic Lake Casino Hotel",44.730845,-93.473571,"2400 Mystic Lake Blvd, Prior Lake, MN 55372","Minnesota","Shakopee Mdewakanton Sioux Community","https://mysticlake.com/",MN_SOURCE,MN_NOTES),
casino("mn-treasure-island","Treasure Island Resort & Casino",44.63189,-92.6497,"5734 Sturgeon Lake Rd, Welch, MN 55089","Minnesota","Prairie Island Indian Community","https://www.ticasino.com/",MN_SOURCE,MN_NOTES),
casino("ne-harrahs-columbus","Harrah's Columbus Racing & Casino",41.4469427,-97.3971746,"5944 Howard Blvd, Columbus, NE 68601","Nebraska","Columbus Exposition and Racing / Caesars Entertainment","https://www.caesars.com/harrahs-columbus",NE_SOURCE,NE_NOTES),
casino("ne-warhorse-lincoln","WarHorse Casino Lincoln",40.74207,-96.72549,"7055 S 1st St, Lincoln, NE 68512","Nebraska","Nebraska Horsemen / Ho-Chunk, Inc.","https://www.warhorsecasino.com/lincoln/",NE_SOURCE,NE_NOTES),
casino("ne-warhorse-omaha","WarHorse Casino Omaha",41.2039,-96.0124,"6303 Q St, Omaha, NE 68117","Nebraska","Nebraska Horsemen / Ho-Chunk, Inc.","https://www.warhorsecasino.com/omaha/",NE_SOURCE,NE_NOTES),
casino("ne-grand-island","Grand Island Casino Resort",40.90556,-98.32861,"777 E Fonner Park Rd, Grand Island, NE 68801","Nebraska","Fonner Park / Elite Casino Resorts","https://www.grandislandresort.com/",NE_SOURCE,NE_NOTES),
casino("ne-lake-mac","Lake Mac Casino Resort & Racetrack",41.11126,-101.72324,"777 Pony Express Ln, Ogallala, NE 69153","Nebraska","Fairplay Park / Elite Casino Resorts","https://lakemaccasinoresort.com/",NE_SOURCE,NE_NOTES),
casino("ne-lucky-77","Lucky 77 Casino",42.1481463,-96.4872519,"200 Main St, Walthill, NE 68067","Nebraska","Omaha Tribe of Nebraska","https://www.visitnebraska.com/walthill/lucky-77-casino",NIGC_SOURCE,NE_NOTES),
casino("ne-ohiya","Ohiya Casino & Resort",42.73175,-97.88879,"53142 Hwy 12, Niobrara, NE 68760","Nebraska","Santee Sioux Nation","https://www.ohiyacasino.com/",NIGC_SOURCE,NE_NOTES),
casino("ne-native-star","Native Star Casino",42.2411984,-96.4723853,"214 Industrial Rd, Winnebago, NE 68071","Nebraska","Winnebago Tribe of Nebraska","https://www.nativestarcasinowinnebago.com/",NIGC_SOURCE,NE_NOTES),
casino("ne-iron-horse","Iron Horse Bar & Casino",42.2769266,-96.7269806,"1106 S Main St, Emerson, NE 68733","Nebraska","Winnebago Tribe of Nebraska","https://www.hochunkinc.com/",NIGC_SOURCE,NE_NOTES),
casino("ne-rosebud","Rosebud Casino",42.9989518,-100.575624,"30421 US Highway 83, Valentine, NE 69201","Nebraska","Rosebud Sioux Tribe","https://www.rosebudcasino.com/",NIGC_SOURCE,NE_NOTES),
casino("wy-wind-river","Wind River Hotel & Casino",42.98508,-108.392156,"180 Red Wolf Pl, Riverton, WY 82501","Wyoming","Northern Arapaho Tribe","https://www.windriverhotelcasino.com/",NIGC_SOURCE,WY_NOTES),
casino("wy-little-wind","Little Wind Casino",43.04133,-108.77395,"690 Blue Sky Hwy, Ethete, WY 82520","Wyoming","Northern Arapaho Tribe","https://www.windriverhotelcasino.com/",NIGC_SOURCE,WY_NOTES),
casino("wy-shoshone-rose","Shoshone Rose Casino & Hotel",42.89047,-108.79221,"5690 US Hwy 287, Lander, WY 82520","Wyoming","Eastern Shoshone Tribe","https://shoshonerose.com/",NIGC_SOURCE,WY_NOTES),
];
