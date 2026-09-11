import type { CasinoAuditRecord } from "./casino-catalog";

const WISCONSIN_SOURCE = "https://doa.wi.gov/Pages/AboutDOA/Gaming.aspx";
const WISCONSIN_MAP_SOURCE = "https://doa.wi.gov/Gaming/Casino%20Location%20Map.pdf";
const IDAHO_SOURCE = "https://www.nigc.gov/downloads/gaming-locations/";
const VERIFIED_ON = "2026-09-10";

const casino=(id:string,name:string,lat:number,lon:number,address:string,jurisdiction:string,operator:string,website:string,identitySource:string,notes:string):CasinoAuditRecord=>({id:`casino-catalog-${id}`,name,lat,lon,address,cuisines:["other"],cuisineLabel:"Casino",priceLevel:null,rating:null,reviewCount:null,openingHours:null,phone:null,website,isChain:false,photoKey:"cafe",source:"catalog",venueTypes:["casino"],energyLevel:2,audit:{verifiedOn:VERIFIED_ON,jurisdiction,operator,identitySource,notes}});

const WI_NOTES="Wisconsin destination-casino scope reconciles the state-linked Class III gaming roster with current tribal/operator materials. Oneida Travel Center and One Stop Packerland are excluded as convenience-store gaming locations; Ho-Chunk Gaming Madison is included separately as a dedicated Class II casino destination.";
const ID_NOTES="Idaho tribal gaming is reconciled against NIGC gaming-location materials and current operator sources. Convenience, automotive, express, and travel-center gaming outlets are excluded from the destination-casino scope; Bannock Peak remains included because the operator presents it as a distinct named casino adjacent to its truck stop.";

export const CASINO_CATALOG_PASS_23: CasinoAuditRecord[] = [
casino("wi-bad-river","Bad River Casino & Lodge",46.5925974,-90.6478307,"73370 US Highway 2, Odanah, WI 54861","Wisconsin","Bad River Band of Lake Superior Chippewa Indians","https://www.badriver.com/",WISCONSIN_MAP_SOURCE,WI_NOTES),
casino("wi-legendary-waters","Legendary Waters Resort & Casino",46.854791,-90.786659,"37600 Onigamiing Dr, Red Cliff, WI 54814","Wisconsin","Red Cliff Band of Lake Superior Chippewa Indians","https://www.legendarywaters.com/",WISCONSIN_MAP_SOURCE,WI_NOTES),
casino("wi-mole-lake","Mole Lake Casino Lodge & Event Center",45.4845165,-88.9743475,"3084 State Highway 55 S, Crandon, WI 54520","Wisconsin","Sokaogon Chippewa Community","https://www.molelakecasino.com/",WISCONSIN_MAP_SOURCE,WI_NOTES),
casino("wi-lake-torches","Lake of the Torches Resort Casino",45.9741614,-89.8917995,"510 Old Abe Rd, Lac du Flambeau, WI 54538","Wisconsin","Lac du Flambeau Band of Lake Superior Chippewa Indians","https://lakeofthetorches.com/",WISCONSIN_MAP_SOURCE,WI_NOTES),
casino("wi-north-star-mohican","North Star Mohican Casino Resort",44.8723742,-88.8637304,"W12180 County Road A, Bowler, WI 54416","Wisconsin","Stockbridge-Munsee Community","https://www.northstarcasinoresort.com/",WISCONSIN_MAP_SOURCE,WI_NOTES),
casino("wi-potawatomi-milwaukee","Potawatomi Casino Hotel Milwaukee",43.0305353,-87.9347178,"1721 W Canal St, Milwaukee, WI 53233","Wisconsin","Forest County Potawatomi Community","https://www.paysbig.com/",WISCONSIN_MAP_SOURCE,WI_NOTES),
casino("wi-potawatomi-carter","Potawatomi Casino Hotel Carter",45.39894,-88.62812,"618 State Highway 32, Wabeno, WI 54566","Wisconsin","Forest County Potawatomi Community","https://www.potawatomi.com/carter/",WISCONSIN_MAP_SOURCE,WI_NOTES),
casino("wi-oneida-airport","Oneida Casino - Airport Drive",44.4984,-88.1212,"2020 Airport Dr, Green Bay, WI 54313","Wisconsin","Oneida Nation","https://oneidacasinohotel.com/locations/",WISCONSIN_MAP_SOURCE,WI_NOTES),
casino("wi-oneida-west-mason","Oneida Casino - West Mason",44.5245823,-88.0955733,"2522 W Mason St, Green Bay, WI 54303","Wisconsin","Oneida Nation","https://oneidacasinohotel.com/locations/",WISCONSIN_MAP_SOURCE,WI_NOTES),
casino("wi-oneida-imac","Oneida Casino - Irene Moore Activity Center",44.4983,-88.1211,"2100 Airport Dr, Green Bay, WI 54313","Wisconsin","Oneida Nation","https://oneidacasinohotel.com/locations/",WISCONSIN_MAP_SOURCE,WI_NOTES),
casino("wi-menominee","Menominee Casino Resort",44.863129,-88.630024,"N277 WI-47/55, Keshena, WI 54135","Wisconsin","Menominee Indian Tribe of Wisconsin","https://menomineecasinoresort.com/",WISCONSIN_MAP_SOURCE,WI_NOTES),
casino("wi-thunderbird","The Thunderbird",44.9437,-88.6073,"W106 County Trunk VV, Keshena, WI 54135","Wisconsin","Menominee Indian Tribe of Wisconsin","https://menomineecasinoresort.com/dining/",WISCONSIN_MAP_SOURCE,WI_NOTES),
casino("wi-sevenwinds","Sevenwinds Casino, Lodge & Conference Center",45.9959012,-91.382116,"13767 W County Road B, Hayward, WI 54843","Wisconsin","Lac Courte Oreilles Band of Lake Superior Chippewa Indians","https://www.sevenwindscasino.com/",WISCONSIN_MAP_SOURCE,WI_NOTES),
casino("wi-grindstone-creek","Grindstone Creek Casino",45.9446491,-91.3782192,"13394 W Trepania Rd, Hayward, WI 54843","Wisconsin","Lac Courte Oreilles Band of Lake Superior Chippewa Indians","https://www.sevenwindscasino.com/play/grindstone-creek-casino/",WISCONSIN_MAP_SOURCE,WI_NOTES),
casino("wi-st-croix-danbury","St. Croix Casino Danbury",46.008032,-92.3613151,"30222 State Road 35, Danbury, WI 54830","Wisconsin","St. Croix Chippewa Indians of Wisconsin","https://www.stcroixcasino.com/danbury",WISCONSIN_MAP_SOURCE,WI_NOTES),
casino("wi-st-croix-hertel","St. Croix Casino Hertel",45.8094661,-92.2041018,"4348 State Road 70, Webster, WI 54893","Wisconsin","St. Croix Chippewa Indians of Wisconsin","https://www.stcroix-casinos.com/",WISCONSIN_MAP_SOURCE,WI_NOTES),
casino("wi-st-croix-turtle-lake","St. Croix Casino Turtle Lake",45.397144,-92.149617,"777 US Highway 8/63, Turtle Lake, WI 54889","Wisconsin","St. Croix Chippewa Indians of Wisconsin","https://www.stcroixcasino.com/turtle-lake",WISCONSIN_MAP_SOURCE,WI_NOTES),
casino("wi-hochunk-wittenberg","Ho-Chunk Gaming Wittenberg",44.8523494,-89.1659039,"N7198 US Highway 45, Wittenberg, WI 54499","Wisconsin","Ho-Chunk Nation","https://www.ho-chunkgaming.com/wittenberg/",WISCONSIN_MAP_SOURCE,WI_NOTES),
casino("wi-hochunk-black-river-falls","Ho-Chunk Gaming Black River Falls",44.32881,-90.7677877,"W9010 Highway 54 East, Black River Falls, WI 54615","Wisconsin","Ho-Chunk Nation","https://www.ho-chunkgaming.com/blackriverfalls/",WISCONSIN_MAP_SOURCE,WI_NOTES),
casino("wi-hochunk-nekoosa","Ho-Chunk Gaming Nekoosa",44.2800511,-89.9640798,"949 County Rd G, Nekoosa, WI 54457","Wisconsin","Ho-Chunk Nation","https://www.ho-chunkgaming.com/nekoosa/",WISCONSIN_MAP_SOURCE,WI_NOTES),
casino("wi-hochunk-tomah","Ho-Chunk Gaming Tomah",44.0295853,-90.435612,"27867 State Highway 21, Tomah, WI 54660","Wisconsin","Ho-Chunk Nation","https://www.ho-chunkgaming.com/tomah/",WISCONSIN_MAP_SOURCE,WI_NOTES),
casino("wi-hochunk-wisconsin-dells","Ho-Chunk Gaming Wisconsin Dells",43.5285735,-89.7751928,"S3214 County Road BD, Baraboo, WI 53913","Wisconsin","Ho-Chunk Nation","https://www.ho-chunkgaming.com/wisconsindells/",WISCONSIN_MAP_SOURCE,WI_NOTES),
casino("wi-hochunk-madison","Ho-Chunk Gaming Madison",43.0394498,-89.2720501,"4002 Evan Acres Rd, Madison, WI 53718","Wisconsin","Ho-Chunk Nation","https://www.ho-chunkgaming.com/madison/",WISCONSIN_SOURCE,WI_NOTES),
casino("id-coeur-dalene","Coeur d'Alene Casino Resort Hotel",47.42663,-116.97417,"37914 S Nukwalqw St, Worley, ID 83876","Idaho","Coeur d'Alene Tribe","https://www.cdacasino.com/",IDAHO_SOURCE,ID_NOTES),
casino("id-kootenai-river","Kootenai River Inn Casino & Spa",48.6966558,-116.3082339,"7169 Plaza St, Bonners Ferry, ID 83805","Idaho","Kootenai Tribe of Idaho","https://www.kootenairiverinn.com/",IDAHO_SOURCE,ID_NOTES),
casino("id-clearwater-river","Clearwater River Casino & Lodge",46.436,-116.9088,"17500 Nez Perce Rd, Lewiston, ID 83501","Idaho","Nez Perce Tribe","https://www.crcasino.com/",IDAHO_SOURCE,ID_NOTES),
casino("id-itse-yeye","It'se Ye-Ye Casino",46.2286406,-116.0263815,"419 Third St, Kamiah, ID 83536","Idaho","Nez Perce Tribe","https://www.crcasino.com/itse-ye-ye-casino/",IDAHO_SOURCE,ID_NOTES),
casino("id-bannock-peak","Bannock Peak Casino",42.886939,-112.63572,"1103 E County Rd, Pocatello, ID 83204","Idaho","Shoshone-Bannock Tribes","https://www.shobangaming.com/casinos/bannock-peak/",IDAHO_SOURCE,ID_NOTES),
casino("id-shoshone-bannock","Shoshone-Bannock Casino Hotel",43.0246511,-112.410992,"777 Bannock Trail, Fort Hall, ID 83203","Idaho","Shoshone-Bannock Tribes","https://www.shobangaming.com/",IDAHO_SOURCE,ID_NOTES),
];
