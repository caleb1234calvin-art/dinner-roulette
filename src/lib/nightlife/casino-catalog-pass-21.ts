import type { CasinoAuditRecord } from "./casino-catalog";

const WSGC_SOURCE = "https://wsgc.wa.gov/tribal-partnerships/tribal-casino-locations";
const NIGC_SOURCE = "https://www.nigc.gov/map";
const COORDINATE_SOURCE = "audit/washington-reconciliation-2026-09-10.json";
const VERIFIED_ON = "2026-09-10";
const NOTES = "Washington physical-destination pass reconciled against WSGC plus NIGC/current operator evidence. Runtime scope contains 30 current tribal casino destinations: WSGC's current compact-directory set plus Shoalwater Bay as the compact-directory reconciliation exception and Elwha River Casino as a current Class II destination. Commercial house-banked card rooms are outside this tribal-casino pass.";

const casino=(id:string,name:string,lat:number,lon:number,address:string,website:string|null):CasinoAuditRecord=>({
  id:`casino-catalog-wa-${id}`,
  name,
  lat,
  lon,
  address,
  cuisines:["other"],
  cuisineLabel:"Casino",
  priceLevel:null,
  rating:null,
  reviewCount:null,
  openingHours:null,
  phone:null,
  website,
  isChain:false,
  photoKey:"cafe",
  source:"catalog",
  venueTypes:["casino"],
  energyLevel:2,
  audit:{verifiedOn:VERIFIED_ON,jurisdiction:"Washington",identitySource:WSGC_SOURCE,coordinateSource:COORDINATE_SOURCE,notes:`${NOTES} NIGC supporting source: ${NIGC_SOURCE}`},
});

export const CASINO_CATALOG_PASS_21: CasinoAuditRecord[] = [
  casino("12-tribes-lake-chelan","12 Tribes Lake Chelan Casino",47.88556,-120.13187,"455 Wapato Lake Road, Manson, WA 98831","https://12tribes.com/"),
  casino("12-tribes-omak","12 Tribes Omak Casino Hotel",48.38173,-119.53271,"28968 Highway 97, Omak, WA 98841","https://12tribes.com/"),
  casino("12-tribes-coulee-dam","12 Tribes Coulee Dam Casino",47.9663435,-118.977855,"515 Birch Street, Coulee Dam, WA 99116","https://12tribes.com/"),
  casino("7-cedars","7 Cedars Casino",48.02188,-123.01089,"270756 Hwy 101, Sequim, WA 98382","https://www.7cedars.com/"),
  casino("angel-of-the-winds","Angel of the Winds Casino Resort",48.21444,-122.18472,"3438 Stoluckquamish Lane, Arlington, WA 98223","https://www.angelofthewinds.com/"),
  casino("elwha-river","Elwha River Casino",48.13506,-123.54634,"631 Stratton Rd, Port Angeles, WA 98363","https://elwharivercasino.com/"),
  casino("emerald-queen-fife","Emerald Queen Casino & Hotel in Fife",47.2421508,-122.3526763,"5700 Pacific Highway E, Fife, WA 98424","https://emeraldqueen.com/"),
  casino("emerald-queen-tacoma","Emerald Queen Casino & Hotel in Tacoma",47.23758,-122.40629,"2920 E R St, Tacoma, WA 98404","https://emeraldqueen.com/"),
  casino("ilani","ilani Casino Resort",45.85336,-122.70728,"1 Cowlitz Way, Ridgefield, WA 98642","https://ilaniresort.com/"),
  casino("kalispel","Kalispel Casino",48.34928,-117.30298,"420 Qlispe River Way, Cusick, WA 99119","https://www.kalispelcasino.com/"),
  casino("legends","Legends Casino Hotel",46.37333,-120.3413,"580 E Fort Road, Toppenish, WA 98948","https://legendscasino.com/"),
  casino("little-creek","Little Creek Casino Resort",47.12832,-123.10175,"91 West State Route 108, Shelton, WA 98584","https://www.little-creek.com/"),
  casino("lucky-dog","Lucky Dog Casino",47.337269,-123.160611,"19330 North Hwy 101, Shelton, WA 98584-9781","https://www.luckydogcasino.com/"),
  casino("lucky-eagle","Lucky Eagle Casino",46.814,-123.15417,"12888 188th Ave SW, Rochester, WA 98579","https://www.luckyeagle.com/"),
  casino("mistequa","Mistequa Casino Hotel",48.23826,-117.71255,"2555 Smith Road, Chewelah, WA 99109","https://mistequa.com/"),
  casino("muckleshoot","Muckleshoot Casino Resort",47.29027,-122.19541,"2402 Auburn Way S, Auburn, WA 98002","https://www.muckleshootcasino.com/"),
  casino("northern-quest","Northern Quest Resort & Casino",47.65901,-117.56245,"100 N Hayford Road, Airway Heights, WA 99001","https://www.northernquest.com/"),
  casino("northwood","Northwood Casino",48.9943196,-122.4059567,"9750 Northwood Road, Lynden, WA 98264","https://www.northwoodcasino.com/"),
  casino("quil-ceda-creek","Quil Ceda Creek Casino",48.05154,-122.18867,"6221 31st Avenue NE, Tulalip, WA 98271","https://www.quilcedacreekcasino.com/"),
  casino("quinault-beach","Quinault Beach Resort & Casino",47.0432,-124.17123,"78 State Route 115, Ocean Shores, WA 98569","https://www.quinaultbeachresort.com/"),
  casino("red-wind","Red Wind Casino",47.00029,-122.66812,"12819 Yelm Hwy SE, Olympia, WA 98513","https://www.redwindcasino.com/"),
  casino("shoalwater-bay","Shoalwater Bay Casino",46.72506,-124.02065,"4112 State Route 105, Tokeland, WA 98590","https://swbcasino.com/"),
  casino("silver-reef","Silver Reef Casino Resort",48.81743,-122.62598,"4876 Haxton Way, Ferndale, WA 98248","https://www.silverreefcasino.com/"),
  casino("skagit-valley","Skagit Valley Casino Resort",48.55939,-122.34731,"5984 N Darrk Lane, Bow, WA 98232","https://www.theskagit.com/"),
  casino("snoqualmie","Snoqualmie Casino",47.51863,-121.84172,"37500 SE North Bend Way, Snoqualmie, WA 98065","https://www.snocasino.com/"),
  casino("spokane-tribe","Spokane Tribe Casino",47.64559,-117.60895,"14300 W SR-2 Hwy, Airway Heights, WA 99001","https://www.spokanetribecasino.com/"),
  casino("suquamish-clearwater","Suquamish Clearwater Casino Resort",47.71218,-122.57082,"15347 Suquamish Way NE, Suquamish, WA 98392","https://www.clearwatercasino.com/"),
  casino("swinomish","Swinomish Casino and Lodge",48.4581002,-122.5199778,"12885 Casino Drive, Anacortes, WA 98221","https://www.swinomishcasinoandlodge.com/"),
  casino("point","The Point Casino",47.84461,-122.54328,"7989 Salish Ln NE, Kingston, WA 98346","https://the-point-casino.com/"),
  casino("tulalip-resort","Tulalip Resort Casino",48.08814,-122.18989,"10200 Quil Ceda Blvd, Tulalip, WA 98271","https://www.tulalipresortcasino.com/"),
];

export const WASHINGTON_AUDIT_SOURCE = WSGC_SOURCE;
