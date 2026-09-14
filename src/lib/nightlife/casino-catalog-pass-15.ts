import type { CasinoAuditRecord } from "./casino-catalog";

const LSP_SOURCE = "https://lsp.org/about/leadershipsections/bureau-of-investigations/gaming-enforcement-division/gaming-operations/";
const NIGC_SOURCE = "https://www.nigc.gov/downloads/gaming-locations/";
const VERIFIED_ON = "2026-09-09";
const COMMERCIAL_NOTES = "Louisiana State Police Gaming Operations identifies twenty current state-regulated casino-style properties: fifteen riverboat/landside casino licenses, the Caesars New Orleans land-based casino, and four racetrack casinos. Current operator pages are used for post-2025 branding such as Bally's Baton Rouge and Live! Casino & Hotel Louisiana.";
const TRIBAL_NOTES = "NIGC gaming-location records and current tribal/operator materials identify four Louisiana tribal casino destinations under the app's physical casino-venue scope: Cypress Bayou, Coushatta, Jena Choctaw Pines, and Paragon.";

const casino = (id:string,name:string,lat:number,lon:number,address:string,operator:string,website:string,identitySource:string,notes:string,coordinateSource?:string):CasinoAuditRecord=>({id:`casino-catalog-${id}`,name,lat,lon,address,cuisines:["other"],cuisineLabel:"Casino",priceLevel:null,rating:null,reviewCount:null,openingHours:null,phone:null,website,isChain:false,photoKey:"cafe",source:"catalog",venueTypes:["casino"],energyLevel:2,audit:{verifiedOn:VERIFIED_ON,jurisdiction:"Louisiana",operator,identitySource,coordinateSource,notes}});

export const CASINO_CATALOG_PASS_15: CasinoAuditRecord[] = [
casino("queen-baton-rouge","The Queen Baton Rouge",30.4595323,-91.1915258,"1717 River Park Blvd, Baton Rouge, LA 70802","Louisiana Casino Cruises, LLC / Bally's Corporation","https://thequeenbr.com/",LSP_SOURCE,COMMERCIAL_NOTES),
casino("ballys-baton-rouge","Bally's Baton Rouge Casino & Hotel",30.4419601,-91.1894648,"103 France St, Baton Rouge, LA 70802","Bally's Corporation","https://casinos.ballys.com/baton-rouge/",LSP_SOURCE,COMMERCIAL_NOTES),
casino("lauberge-baton-rouge","L'Auberge Casino & Hotel Baton Rouge",30.345602,-91.151,"777 L'Auberge Ave, Baton Rouge, LA 70820","PENN Entertainment","https://www.lbatonrouge.com/",LSP_SOURCE,COMMERCIAL_NOTES),
casino("caesars-new-orleans","Caesars New Orleans",29.9481107,-90.0655636,"8 Canal St, New Orleans, LA 70130","Caesars Entertainment","https://www.caesars.com/caesars-new-orleans",LSP_SOURCE,COMMERCIAL_NOTES),
casino("boomtown-new-orleans","Boomtown Casino & Hotel New Orleans",29.8478793,-90.0601512,"4132 Peters Rd, Harvey, LA 70058","PENN Entertainment","https://www.boomtownneworleans.com/",LSP_SOURCE,COMMERCIAL_NOTES),
casino("treasure-chest-kenner","Treasure Chest Casino",30.04201,-90.23611,"5050 Williams Blvd, Kenner, LA 70065","Boyd Gaming","https://treasurechest.boydgaming.com/",LSP_SOURCE,COMMERCIAL_NOTES,"https://www.openstreetmap.org/way/534523258"),
casino("fair-grounds","Fair Grounds Race Course & Slots",29.9822208,-90.078295,"1751 Gentilly Blvd, New Orleans, LA 70119","Churchill Downs Incorporated","https://www.fairgroundsracecourse.com/",LSP_SOURCE,COMMERCIAL_NOTES),
casino("amelia-belle","Amelia Belle Casino",29.6645377,-91.1024892,"500 Lake Palourde Rd, Amelia, LA 70340","Boyd Gaming","https://ameliabelle.boydgaming.com/",LSP_SOURCE,COMMERCIAL_NOTES),
casino("evangeline-downs","Evangeline Downs Racetrack & Casino",30.52624,-92.06028,"2235 Creswell Ln Ext, Opelousas, LA 70570","Boyd Gaming","https://evangelinedowns.boydgaming.com/",LSP_SOURCE,COMMERCIAL_NOTES,"https://www.openstreetmap.org/way/574142160"),
casino("horseshoe-lake-charles","Horseshoe Lake Charles",30.2348439,-93.2491886,"100 Westlake Ave, Westlake, LA 70669","Caesars Entertainment","https://www.caesars.com/horseshoe-lake-charles",LSP_SOURCE,COMMERCIAL_NOTES),
casino("golden-nugget-lake-charles","Golden Nugget Lake Charles",30.2047869,-93.2624952,"2550 Golden Nugget Blvd, Lake Charles, LA 70601","Landry's, Inc.","https://www.goldennugget.com/lake-charles/",LSP_SOURCE,COMMERCIAL_NOTES,"https://www.openstreetmap.org/way/493745505"),
casino("lauberge-lake-charles","L'Auberge Casino Resort Lake Charles",30.207311,-93.258787,"777 Ave L'Auberge, Lake Charles, LA 70601","PENN Entertainment","https://www.llakecharles.com/",LSP_SOURCE,COMMERCIAL_NOTES),
casino("delta-downs","Delta Downs Racetrack Casino Hotel",30.1950801,-93.6233275,"2717 Delta Downs Dr, Vinton, LA 70668","Boyd Gaming","https://deltadowns.boydgaming.com/",LSP_SOURCE,COMMERCIAL_NOTES,"https://www.openstreetmap.org/way/699912721"),
casino("ballys-shreveport","Bally's Shreveport Casino & Hotel",32.517155,-93.7445193,"451 Clyde Fant Pkwy, Shreveport, LA 71101","Bally's Corporation","https://casinos.ballys.com/shreveport/",LSP_SOURCE,COMMERCIAL_NOTES),
casino("sams-town-shreveport","Sam's Town Shreveport",32.5184832,-93.7452918,"315 Clyde Fant Pkwy, Shreveport, LA 71101","Boyd Gaming","https://samstownshreveport.boydgaming.com/",LSP_SOURCE,COMMERCIAL_NOTES),
casino("boomtown-bossier","Boomtown Bossier City",32.5100517,-93.7329553,"300 Riverside Dr, Bossier City, LA 71111","PENN Entertainment","https://www.boomtownbossier.com/",LSP_SOURCE,COMMERCIAL_NOTES),
casino("horseshoe-bossier-city","Horseshoe Bossier City",32.5152538,-93.7382333,"711 Horseshoe Blvd, Bossier City, LA 71111","Caesars Entertainment","https://www.caesars.com/horseshoe-bossier-city",LSP_SOURCE,COMMERCIAL_NOTES),
casino("live-louisiana","Live! Casino & Hotel Louisiana",32.509854,-93.727056,"711 Live Casino Blvd, Bossier City, LA 71111","The Cordish Companies","https://www.livech.com/louisiana",LSP_SOURCE,COMMERCIAL_NOTES),
casino("margaritaville-bossier","Margaritaville Resort Casino Bossier City",32.5211504,-93.7436314,"777 Margaritaville Way, Bossier City, LA 71111","Bally's Corporation","https://www.margaritavillebossiercity.com/",LSP_SOURCE,COMMERCIAL_NOTES),
casino("louisiana-downs","Louisiana Downs Casino & Racetrack",32.5467023,-93.6251591,"8000 East Texas St, Bossier City, LA 71111","Rubico Acquisition Corp.","https://ladowns.com/",LSP_SOURCE,COMMERCIAL_NOTES),
casino("cypress-bayou","Cypress Bayou Casino Hotel",29.8722,-91.53817,"832 Martin Luther King Jr Rd, Charenton, LA 70523","Chitimacha Tribe of Louisiana","https://www.cypressbayou.com/",NIGC_SOURCE,TRIBAL_NOTES,"https://www.openstreetmap.org/node/12003574214"),
casino("coushatta","Coushatta Casino Resort",30.5459,-92.81431,"777 Coushatta Dr, Kinder, LA 70648","Coushatta Tribe of Louisiana","https://www.coushattacasinoresort.com/",NIGC_SOURCE,TRIBAL_NOTES,"https://www.openstreetmap.org/way/911050750"),
casino("jena-choctaw-pines","Jena Choctaw Pines Casino",31.4394391,-92.4929822,"149 Chahta Trails, Dry Prong, LA 71423","Jena Band of Choctaw Indians","https://choctawpines.com/",NIGC_SOURCE,TRIBAL_NOTES),
casino("paragon","Paragon Casino Resort",31.1065037,-92.0603608,"711 Paragon Pl, Marksville, LA 71351","Tunica-Biloxi Tribe of Louisiana","https://www.paragoncasinoresort.com/",NIGC_SOURCE,TRIBAL_NOTES),
];