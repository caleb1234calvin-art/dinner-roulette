import type { CasinoAuditRecord } from "./casino-catalog";

const MGC_PROPERTY_SOURCE = "https://www.msgamingcommission.com/reports/property_data";
const MGC_PROPERTY_LIST_SOURCE = "https://www.msgamingcommission.com/images/uploads/Casino_Properties_List_10.23.2025.pdf";
const MBCI_SOURCE = "https://www.pearlriverresort.com/our-properties";
const VERIFIED_ON = "2026-09-09";
const COMMERCIAL_NOTES = "Mississippi Gaming Commission July 2026 property data identifies 25 active state-regulated casino properties across the Central, Coastal, and Northern regions. Property addresses are reconciled against the Commission casino-properties list. Distributed gaming and non-casino retail gaming are outside this destination-venue scope.";
const TRIBAL_NOTES = "Mississippi Band of Choctaw Indians / Pearl River Resort materials identify three casino destinations under the app scope: Silver Star Hotel & Casino, Golden Moon Hotel & Casino, and Bok Homa Casino. Crystal Sky Travel Plaza is not counted as a separate casino destination.";

const casino = (id:string,name:string,lat:number,lon:number,address:string,operator:string,website:string,identitySource:string,notes:string,coordinateSource?:string):CasinoAuditRecord=>({id:`casino-catalog-${id}`,name,lat,lon,address,cuisines:["other"],cuisineLabel:"Casino",priceLevel:null,rating:null,reviewCount:null,openingHours:null,phone:null,website,isChain:false,photoKey:"cafe",source:"catalog",venueTypes:["casino"],energyLevel:2,audit:{verifiedOn:VERIFIED_ON,jurisdiction:"Mississippi",operator,identitySource,coordinateSource,notes}});

export const CASINO_CATALOG_PASS_16: CasinoAuditRecord[] = [
casino("ms-1st-jackpot","1st Jackpot Casino Tunica",34.8435037,-90.3246841,"1450 Jackpot Blvd, Tunica Resorts, MS 38664","Bally's Corporation","https://www.1stjackpot.com/",MGC_PROPERTY_SOURCE,COMMERCIAL_NOTES),
casino("ms-ameristar-vicksburg","Ameristar Casino Hotel Vicksburg",32.315941,-90.900318,"4116 Washington St, Vicksburg, MS 39180","PENN Entertainment","https://www.ameristarvicksburg.com/",MGC_PROPERTY_SOURCE,COMMERCIAL_NOTES,"https://www.openstreetmap.org/way/680903034"),
casino("ms-ballys-vicksburg","Bally's Vicksburg",32.2948687,-90.9152365,"1380 Warrenton Rd, Vicksburg, MS 39180","Bally's Corporation","https://casinos.ballys.com/vicksburg/",MGC_PROPERTY_SOURCE,COMMERCIAL_NOTES),
casino("ms-beau-rivage","Beau Rivage Casino",30.3924332,-88.8914837,"875 Beach Blvd, Biloxi, MS 39533","MGM Resorts International","https://www.beaurivage.com/",MGC_PROPERTY_SOURCE,COMMERCIAL_NOTES),
casino("ms-boomtown-biloxi","Boomtown Casino Biloxi",30.4127434,-88.8851559,"676 Bayview Ave, Biloxi, MS 39530","PENN Entertainment","https://www.boomtownbiloxi.com/",MGC_PROPERTY_SOURCE,COMMERCIAL_NOTES),
casino("ms-fitz-tunica","Fitz Casino & Hotel Tunica",34.8397282,-90.3583129,"711 Lucky Ln, Tunica Resorts, MS 38664","Foundation Gaming Group","https://www.fitzgeraldstunica.com/",MGC_PROPERTY_SOURCE,COMMERCIAL_NOTES),
casino("ms-gold-strike","Gold Strike Casino Resort",34.8464545,-90.332583,"1010 Casino Center Dr, Tunica Resorts, MS 38664","Cherokee Nation Businesses","https://goldstrike.com/",MGC_PROPERTY_SOURCE,COMMERCIAL_NOTES),
casino("ms-golden-nugget-biloxi","Golden Nugget Biloxi",30.3909577,-88.8608695,"151 Beach Blvd, Biloxi, MS 39530","Fertitta Entertainment / Landry's","https://www.goldennugget.com/biloxi/",MGC_PROPERTY_SOURCE,COMMERCIAL_NOTES),
casino("ms-hard-rock-biloxi","Hard Rock Hotel & Casino Biloxi",30.3921174,-88.8877736,"777 Beach Blvd, Biloxi, MS 39530","Twin River Management Group / Bally's Corporation","https://www.hrhcbiloxi.com/",MGC_PROPERTY_SOURCE,COMMERCIAL_NOTES),
casino("ms-harlows","Harlow's Casino Resort & Spa",33.3001676,-91.1410135,"4250 Hwy 82 W, Greenville, MS 38701","Churchill Downs Incorporated","https://www.harlowscasino.com/",MGC_PROPERTY_SOURCE,COMMERCIAL_NOTES),
casino("ms-harrahs-gulf-coast","Harrah's Gulf Coast",30.3928528,-88.8659224,"265 Beach Blvd, Biloxi, MS 39530","Caesars Entertainment","https://www.caesars.com/harrahs-gulf-coast",MGC_PROPERTY_SOURCE,COMMERCIAL_NOTES),
casino("ms-hollywood-gulf-coast","Hollywood Casino Gulf Coast",30.3351831,-89.353424,"711 Casino Magic Dr, Bay St. Louis, MS 39520","PENN Entertainment","https://www.hollywoodgulfcoast.com/",MGC_PROPERTY_SOURCE,COMMERCIAL_NOTES),
casino("ms-hollywood-tunica","Hollywood Casino Tunica",34.8126547,-90.4155831,"1150 Casino Strip Blvd, Tunica Resorts, MS 38664","PENN Entertainment","https://www.hollywoodcasinotunica.com/",MGC_PROPERTY_SOURCE,COMMERCIAL_NOTES),
casino("ms-horseshoe-tunica","Horseshoe Casino & Hotel Tunica",34.8479776,-90.3310865,"1021 Casino Center Dr, Tunica Resorts, MS 38664","Caesars Entertainment","https://www.caesars.com/horseshoe-tunica",MGC_PROPERTY_SOURCE,COMMERCIAL_NOTES),
casino("ms-ip-biloxi","IP Casino Resort Spa",30.413234,-88.891464,"850 Bayview Ave, Biloxi, MS 39533","Boyd Gaming","https://www.ipbiloxi.com/",MGC_PROPERTY_SOURCE,COMMERCIAL_NOTES),
casino("ms-island-view","Island View Casino Resort",30.3635268,-89.1027389,"3300 W Beach Blvd, Gulfport, MS 39501","Gulfside Casino Partnership","https://www.islandviewcasino.com/",MGC_PROPERTY_SOURCE,COMMERCIAL_NOTES),
casino("ms-isle-lula","Isle of Capri Casino Hotel Lula",34.498338,-90.580592,"777 Isle of Capri Pkwy, Lula, MS 38644","Bally's Corporation","https://www.isleofcaprilula.com/",MGC_PROPERTY_SOURCE,COMMERCIAL_NOTES),
casino("ms-magnolia-bluffs","Magnolia Bluffs Casino Hotel",31.5532424,-91.4108955,"7 Roth Hill Rd, Natchez, MS 39120","Saratoga Casino Holdings","https://www.magnoliabluffscasino.com/",MGC_PROPERTY_SOURCE,COMMERCIAL_NOTES),
casino("ms-palace-biloxi","Palace Casino Resort",30.396502,-88.860524,"158 Howard Ave, Biloxi, MS 39530","New Palace Casino LLC","https://www.palacecasinoresort.com/",MGC_PROPERTY_SOURCE,COMMERCIAL_NOTES),
casino("ms-riverwalk-vicksburg","Riverwalk Casino Hotel",32.2979412,-90.9136515,"1048 Warrenton Rd, Vicksburg, MS 39180","Foundation Gaming Group","https://www.riverwalkvicksburg.com/",MGC_PROPERTY_SOURCE,COMMERCIAL_NOTES),
casino("ms-scarlet-pearl","Scarlet Pearl Casino Resort",30.4250385,-88.8900561,"9380 Central Ave, D'Iberville, MS 39540","Land Holdings I, LLC","https://www.scarletpearlcasino.com/",MGC_PROPERTY_SOURCE,COMMERCIAL_NOTES),
casino("ms-silver-slipper","Silver Slipper Casino Hotel",30.239698,-89.425179,"5000 S Beach Blvd, Lakeshore, MS 39558","Full House Resorts","https://www.silverslipper-ms.com/",MGC_PROPERTY_SOURCE,COMMERCIAL_NOTES),
casino("ms-trop-greenville","Trop Casino Greenville",33.4154102,-91.0641848,"199 Lakefront Rd, Greenville, MS 38701","Bally's Corporation","https://www.tropgreenville.com/",MGC_PROPERTY_SOURCE,COMMERCIAL_NOTES),
casino("ms-treasure-bay","Treasure Bay Casino and Hotel",30.393909,-88.955194,"1980 Beach Blvd, Biloxi, MS 39531","Treasure Bay Gaming & Resorts","https://www.treasurebay.com/",MGC_PROPERTY_SOURCE,COMMERCIAL_NOTES),
casino("ms-waterview-vicksburg","WaterView Casino & Hotel",32.3243368,-90.8971855,"3990 Washington St, Vicksburg, MS 39182","Bally's Corporation","https://www.waterviewcasino.com/",MGC_PROPERTY_SOURCE,COMMERCIAL_NOTES),
casino("ms-silver-star","Silver Star Hotel & Casino",32.77128,-89.20572,"13541 MS-16, Philadelphia, MS 39350","Mississippi Band of Choctaw Indians / Pearl River Resort","https://www.pearlriverresort.com/silver-star",MBCI_SOURCE,TRIBAL_NOTES,"https://www.openstreetmap.org/way/647212528"),
casino("ms-golden-moon","Golden Moon Hotel & Casino",32.77408,-89.20392,"13550 MS-16, Choctaw, MS 39350","Mississippi Band of Choctaw Indians / Pearl River Resort","https://www.pearlriverresort.com/golden-moon",MBCI_SOURCE,TRIBAL_NOTES,"https://www.openstreetmap.org/way/196906558"),
casino("ms-bok-homa","Bok Homa Casino",31.7772,-89.00892,"1 Choctaw Rd, Heidelberg, MS 39439","Mississippi Band of Choctaw Indians / Pearl River Resort","https://www.pearlriverresort.com/bokhoma-casino",MBCI_SOURCE,TRIBAL_NOTES,"https://www.openstreetmap.org/node/4635086475"),
];
