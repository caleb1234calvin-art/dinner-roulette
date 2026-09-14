import type { CasinoAuditRecord } from "./casino-catalog";

const CHICKASAW_SOURCE = "https://www.chickasaw.net/Our-Nation/Locations.aspx?searchtext=casino";
const CHOCTAW_SOURCE = "https://www.choctawcasinos.com/locations/";
const CHEROKEE_SOURCE = "https://www.cherokeecasino.com/casinos";
const MUSCOGEE_SOURCE = "https://creekcasinojobs.com/locations/";
const OSAGE_SOURCE = "https://osagecasino.com/locations-maps/";
const CPN_SOURCE = "https://www.potawatomi.org/enterprises/";
const VERIFIED_ON = "2026-09-11";

const casino=(id:string,name:string,lat:number,lon:number,address:string,operator:string,website:string,identitySource:string,notes:string):CasinoAuditRecord=>({id:`casino-catalog-${id}`,name,lat,lon,address,cuisines:["other"],cuisineLabel:"Casino",priceLevel:null,rating:null,reviewCount:null,openingHours:null,phone:null,website,isChain:false,photoKey:"cafe",source:"catalog",venueTypes:["casino"],energyLevel:2,audit:{verifiedOn:VERIFIED_ON,jurisdiction:"Oklahoma",operator,identitySource,notes}});

const CURRENT_NOTE = "Current Oklahoma destination verified through the September 11, 2026 statewide identity/address, property-coordinate and runtime-lineage QA passes.";
const SUCCESSOR_NOTE = `${CURRENT_NOTE} Current successor property only; obsolete predecessor-site geometry is excluded.`;

/** Oklahoma Pass 28: 46 destinations that cleared the first runtime-eligibility batch. */
export const CASINO_CATALOG_PASS_28: CasinoAuditRecord[] = [
  casino("winstar","WinStar World Casino and Resort",33.75762,-97.12994,"777 Casino Ave, Thackerville, OK 73459","Chickasaw Nation","https://www.winstar.com/",CHICKASAW_SOURCE,`${CURRENT_NOTE} Preserves the existing WinStar stable-ID lineage.`),
  casino("riverwind-casino","Riverwind Casino",35.18068,-97.50033,"1544 State Highway 9, Norman, OK 73072","Chickasaw Nation","https://www.riverwind.com/",CHICKASAW_SOURCE,CURRENT_NOTE),
  casino("newcastle-casino","Newcastle Casino",35.27734,-97.59848,"2457 Highway 62 N Service Rd, Newcastle, OK 73065","Chickasaw Nation","https://www.newcastlecasino.com/",CHICKASAW_SOURCE,`${CURRENT_NOTE} Distinct from Newcastle Travel Gaming.`),
  casino("choctaw-durant","Choctaw Casino & Resort-Durant",33.95116,-96.41404,"4216 S Hwy 69/75, Durant, OK 74701","Choctaw Nation of Oklahoma","https://www.choctawcasinos.com/durant/",CHOCTAW_SOURCE,`${CURRENT_NOTE} Preserves the existing Choctaw Durant stable-ID lineage.`),
  casino("ok-choctaw-pocola","Choctaw Casino & Resort-Pocola",35.29053,-94.43634,"3400 Choctaw Rd, Pocola, OK 74902","Choctaw Nation of Oklahoma","https://www.choctawcasinos.com/pocola/",CHOCTAW_SOURCE,`${CURRENT_NOTE} Casino Too travel-plaza gaming is excluded.`),
  casino("ok-hard-rock-tulsa","Hard Rock Hotel & Casino Tulsa",36.16535,-95.76476,"777 W Cherokee St, Catoosa, OK 74015","Cherokee Nation Entertainment","https://www.hardrockcasinotulsa.com/",CHEROKEE_SOURCE,CURRENT_NOTE),
  casino("ok-cherokee-west-siloam-springs","Cherokee Casino & Hotel West Siloam Springs",36.17766,-94.56769,"2416 US-412, West Siloam Springs, OK 74338","Cherokee Nation Entertainment","https://www.cherokeecasino.com/casinos/west-siloam-springs",CHEROKEE_SOURCE,CURRENT_NOTE),
  casino("ok-firelake-casino","FireLake Casino",35.30360,-96.92794,"41170 Hardesty Rd, Shawnee, OK 74801","Citizen Potawatomi Nation","https://www.firelakecasino.com/",CPN_SOURCE,CURRENT_NOTE),
  casino("ok-grand-casino-shawnee","Grand Casino Hotel & Resort",35.38074,-97.05920,"777 Grand Casino Blvd, Shawnee, OK 74804","Citizen Potawatomi Nation","https://www.grandresortok.com/",CPN_SOURCE,CURRENT_NOTE),
  casino("ok-choctaw-grant","Choctaw Casino & Resort-Grant",33.93549,-95.52671,"1516 US-271, Grant, OK 74738","Choctaw Nation of Oklahoma","https://www.choctawcasinos.com/grant/",CHOCTAW_SOURCE,`${CURRENT_NOTE} Distinct from nearby travel-plaza gaming.`),
  casino("ok-choctaw-mcalester","Choctaw Casino-McAlester",34.88696,-95.78531,"1638 S George Nigh Expy, McAlester, OK 74501","Choctaw Nation of Oklahoma","https://www.choctawcasinos.com/mcalester/",CHOCTAW_SOURCE,CURRENT_NOTE),
  casino("ok-choctaw-broken-bow","Choctaw Casino-Broken Bow",34.00569,-94.74117,"1790 S Park Dr, Broken Bow, OK 74728","Choctaw Nation of Oklahoma","https://www.choctawcasinos.com/broken-bow/",CHOCTAW_SOURCE,CURRENT_NOTE),
  casino("ok-choctaw-stringtown","Choctaw Casino-Stringtown",34.48713,-96.05020,"893 N US-69, Stringtown, OK 74569","Choctaw Nation of Oklahoma","https://www.choctawcasinos.com/stringtown/",CHOCTAW_SOURCE,`${CURRENT_NOTE} Distinct from nearby travel-plaza gaming.`),
  casino("ok-cherokee-roland","Cherokee Casino & Hotel Roland",35.40791,-94.52864,"109 Cherokee Blvd, Roland, OK 74954","Cherokee Nation Entertainment","https://www.cherokeecasino.com/casinos/roland",CHEROKEE_SOURCE,`${CURRENT_NOTE} Uses casino geometry rather than the adjacent hotel or travel plaza.`),
  casino("ok-cherokee-sallisaw","Cherokee Casino Sallisaw",35.44958,-94.80742,"1621 W Ruth St, Sallisaw, OK 74955","Cherokee Nation Entertainment","https://www.cherokeecasino.com/casinos/sallisaw",CHEROKEE_SOURCE,CURRENT_NOTE),
  casino("ok-cherokee-tahlequah","Cherokee Casino Tahlequah",35.87730,-94.97161,"3307 Seven Clans Ave, Tahlequah, OK 74464","Cherokee Nation Entertainment","https://www.cherokeecasino.com/casinos/tahlequah",CHEROKEE_SOURCE,CURRENT_NOTE),
  casino("ok-cherokee-grove","Cherokee Casino Grove",36.65732,-94.83043,"24979 US-59, Grove, OK 74344","Cherokee Nation Entertainment","https://www.cherokeecasino.com/casinos/grove",CHEROKEE_SOURCE,CURRENT_NOTE),
  casino("ok-cherokee-ramona","Cherokee Casino Ramona",36.56442,-95.93067,"31501 US-75, Ramona, OK 74061","Cherokee Nation Entertainment","https://www.cherokeecasino.com/casinos/ramona",CHEROKEE_SOURCE,CURRENT_NOTE),
  casino("ok-cherokee-will-rogers-downs","Cherokee Casino Will Rogers Downs",36.31121,-95.53248,"20900 S 4200 Rd, Claremore, OK 74019","Cherokee Nation Entertainment","https://www.cherokeecasino.com/casinos/will-rogers-downs",CHEROKEE_SOURCE,CURRENT_NOTE),
  casino("ok-choctaw-idabel","Choctaw Casino-Idabel",33.89708,-94.81007,"1425 SE Washington St, Idabel, OK 74745","Choctaw Nation of Oklahoma","https://www.choctawcasinos.com/idabel/",CHOCTAW_SOURCE,CURRENT_NOTE),
  casino("ok-border-casino","Border Casino",33.73283,-97.14479,"22953 Brown Springs Rd, Thackerville, OK 73459","Chickasaw Nation","https://www.chickasaw.net/Our-Nation/Locations/Border-Casino.aspx",CHICKASAW_SOURCE,`${CURRENT_NOTE} Distinct from the nearby Chickasaw Travel Stop.`),
  casino("ok-saltcreek-casino","SaltCreek Casino",35.17549,-97.96517,"1600 US-81, Pocasset, OK 73079","Chickasaw Nation","https://www.saltcreekcasino.com/",CHICKASAW_SOURCE,CURRENT_NOTE),
  casino("ok-texoma-casino","Texoma Casino",33.99917,-96.67528,"1795 US-70, Kingston, OK 73439","Chickasaw Nation","https://www.texomacasino.com/",CHICKASAW_SOURCE,CURRENT_NOTE),
  casino("ok-washita-casino","Washita Casino",34.82787,-97.30759,"30639 OK-145, Paoli, OK 73074","Chickasaw Nation","https://www.washitacasino.com/",CHICKASAW_SOURCE,CURRENT_NOTE),
  casino("ok-megastar-casino","MegaStar Casino",33.88736,-96.83308,"4350 S Hwy 377, Willis, OK 73439","Chickasaw Nation","https://megastarcasino.com/",CHICKASAW_SOURCE,`${CURRENT_NOTE} Preserves current first-party Willis locality.`),
  casino("ok-west-bay-casino-resort","West Bay Casino & Resort",33.99650,-96.63449,"11840 State Park Rd, Kingston, OK 73439","Chickasaw Nation","https://westbaycasino.com/",CHICKASAW_SOURCE,CURRENT_NOTE),
  casino("ok-chisholm-trail-casino","Chisholm Trail Casino",34.58484,-97.96889,"7807 N Highway 81, Duncan, OK 73533","Chickasaw Nation","https://www.chisholmtrailcasino.com/",CHICKASAW_SOURCE,CURRENT_NOTE),
  casino("ok-treasure-valley-casino-hotel","Treasure Valley Casino & Hotel",34.50916,-97.17254,"12252 Ruppe Rd, Davis, OK 73030","Chickasaw Nation","https://www.treasurevalleycasino.com/",CHICKASAW_SOURCE,`${CURRENT_NOTE} Distinct from the nearby Chickasaw Travel Stop.`),
  casino("ok-jet-stream-casino","Jet Stream Casino",34.70523,-97.24842,"2001 W Airline Rd, Pauls Valley, OK 73075","Chickasaw Nation","https://jetstreamcasino.com/",CHICKASAW_SOURCE,CURRENT_NOTE),
  casino("ok-black-gold-casino","Black Gold Casino",34.17207,-97.41381,"288 Mulberry Ln, Wilson, OK 73463","Chickasaw Nation","https://myblackgoldcasino.com/",CHICKASAW_SOURCE,`${CURRENT_NOTE} Co-located travel-stop/convenience component is not a second roulette destination.`),
  casino("ok-gold-mountain-casino","Gold Mountain Casino",34.18478,-97.10860,"1410 Sam Noble Pkwy, Ardmore, OK 73401","Chickasaw Nation","https://www.chickasaw.net/Our-Nation/Locations/Gold-Mountain-Casino.aspx",CHICKASAW_SOURCE,`${CURRENT_NOTE} Preserves verified Ardmore ZIP 73401.`),
  casino("ok-riverstar-casino","RiverStar Casino",33.88333,-97.93150,"11801 E 2160 Rd, Terral, OK 73569","Chickasaw Nation","https://www.theriverstarcasino.com/",CHICKASAW_SOURCE,CURRENT_NOTE),
  casino("ok-muscogee-river-spirit","River Spirit Casino Resort",36.04121,-95.96420,"8330 Riverside Pkwy, Tulsa, OK 74137","Muscogee Nation Gaming Enterprises","https://www.riverspirittulsa.com/",MUSCOGEE_SOURCE,`${CURRENT_NOTE} River Spirit and Margaritaville gaming areas are treated as one resort destination.`),
  casino("ok-muscogee-one-fire","One Fire Casino",35.63958,-95.96130,"1901 Wood Dr, Okmulgee, OK 74447","Muscogee Nation Gaming Enterprises","https://creeknationcasinoonefire.com/",MUSCOGEE_SOURCE,CURRENT_NOTE),
  casino("ok-osage-hominy","Osage Casino Hominy",36.4325815,-96.3896826,"39 Deer Ave, Hominy, OK 74035","Osage Nation","https://osagecasino.com/",OSAGE_SOURCE,CURRENT_NOTE),
  casino("ok-osage-sand-springs","Osage Casino Sand Springs",36.16280,-96.1231616,"301 Blackjack Dr, Sand Springs, OK 74063","Osage Nation","https://osagecasino.com/",OSAGE_SOURCE,CURRENT_NOTE),
  casino("ok-muscogee-muskogee","Muscogee Casino",35.71352,-95.40620,"3420 W Peak Blvd, Muskogee, OK 74401","Muscogee Nation Gaming Enterprises","https://creeknationcasinomuscogee.com/",MUSCOGEE_SOURCE,CURRENT_NOTE),
  casino("ok-muscogee-okemah","Okemah Casino",35.41935,-96.30037,"1101 Woody Guthrie Blvd, Okemah, OK 74859","Muscogee Nation Gaming Enterprises","https://creeknationcasinookemah.com/",MUSCOGEE_SOURCE,CURRENT_NOTE),
  casino("ok-muscogee-bristow","Bristow Casino",35.82650,-96.39170,"121 W Lincoln Ave, Bristow, OK 74010","Muscogee Nation Gaming Enterprises","https://creeknationcasinobristow.com/",MUSCOGEE_SOURCE,CURRENT_NOTE),
  casino("ok-osage-bartlesville","Osage Casino Hotel Bartlesville",36.75100,-96.03454,"1803 US-60, Bartlesville, OK 74003","Osage Nation","https://osagecasino.com/",OSAGE_SOURCE,SUCCESSOR_NOTE),
  casino("ok-osage-skiatook","Osage Casino Hotel Skiatook",36.3696996,-96.0516333,"5591 W Rogers Blvd, Skiatook, OK 74070","Osage Nation","https://osagecasino.com/",OSAGE_SOURCE,CURRENT_NOTE),
  casino("ok-osage-pawhuska","Osage Casino Hotel Pawhuska",36.67034,-96.31188,"1421 John Dahl Ave, Pawhuska, OK 74056","Osage Nation","https://osagecasino.com/",OSAGE_SOURCE,SUCCESSOR_NOTE),
  casino("ok-choctaw-hochatown","Choctaw Casino & Resort-Hochatown",34.14258,-94.74290,"272 N State Highway 259A, Hochatown, OK 74728","Choctaw Nation of Oklahoma","https://choctawlanding.com/",CHOCTAW_SOURCE,CURRENT_NOTE),
  casino("ok-cherokee-fort-gibson","Cherokee Casino Fort Gibson",35.7712679,-95.2698870,"107 N Georgetown Rd, Fort Gibson, OK 74434","Cherokee Nation Entertainment","https://www.cherokeecasino.com/casinos/fort-gibson",CHEROKEE_SOURCE,CURRENT_NOTE),
  casino("ok-osage-tulsa","Osage Casino Hotel Tulsa",36.20507,-96.0101453,"951 W 36th St N, Tulsa, OK 74127","Osage Nation","https://osagecasino.com/tulsa/",OSAGE_SOURCE,CURRENT_NOTE),
  casino("ok-osage-ponca-city","Osage Casino Hotel Ponca City",36.681126,-97.042300,"64464 US Highway 60, Ponca City, OK 74604","Osage Nation","https://osagecasino.com/hotel-ponca-city/",OSAGE_SOURCE,SUCCESSOR_NOTE),
];
