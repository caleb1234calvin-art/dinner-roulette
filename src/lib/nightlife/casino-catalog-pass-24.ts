import type { CasinoAuditRecord } from "./casino-catalog";

const NYGC_SOURCE = "https://gaming.ny.gov/system/files/documents/2025/09/annualreport_2024_final.pdf";
const NIGC_SOURCE = "https://www.nigc.gov/downloads/gaming-locations/";
const VERIFIED_ON = "2026-09-10";

const casino=(id:string,name:string,lat:number,lon:number,address:string,operator:string,website:string,identitySource:string,notes:string):CasinoAuditRecord=>({id:`casino-catalog-${id}`,name,lat,lon,address,cuisines:["other"],cuisineLabel:"Casino",priceLevel:null,rating:null,reviewCount:null,openingHours:null,phone:null,website,isChain:false,photoKey:"cafe",source:"catalog",venueTypes:["casino"],energyLevel:2,audit:{verifiedOn:VERIFIED_ON,jurisdiction:"New York",operator,identitySource,notes}});

const NOTES="New York's current destination-casino scope is reconciled to the New York State Gaming Commission facility roster and current tribal/NIGC materials: seven tribal casinos, nine video-lottery/racino properties, and four commercial casinos. Thoroughbred and harness tracks without casino gaming are excluded, as are lottery customer-service centers and non-casino charitable gaming.";

export const CASINO_CATALOG_PASS_24: CasinoAuditRecord[] = [
casino("ny-akwesasne","Akwesasne Mohawk Casino Resort",44.97059,-74.64174,"873 State Route 37, Akwesasne, NY 13655","Saint Regis Mohawk Tribe","https://mohawkcasino.com/",NIGC_SOURCE,NOTES),
casino("ny-seneca-niagara","Seneca Niagara Resort & Casino",43.0864,-79.05667,"310 4th St, Niagara Falls, NY 14303","Seneca Nation of Indians","https://senecacasinos.com/senecaniagara/",NIGC_SOURCE,NOTES),
casino("ny-seneca-buffalo-creek","Seneca Buffalo Creek Casino",42.87361,-78.8703,"1 Fulton St, Buffalo, NY 14204","Seneca Nation of Indians","https://senecacasinos.com/senecabuffalocreek/",NIGC_SOURCE,NOTES),
casino("ny-seneca-allegany","Seneca Allegany Resort & Casino",42.15226,-78.75016,"777 Seneca Allegany Blvd, Salamanca, NY 14779","Seneca Nation of Indians","https://senecacasinos.com/senecaallegany/",NIGC_SOURCE,NOTES),
casino("ny-point-place","Point Place Casino",43.15344,-75.96696,"450 NY-31, Bridgeport, NY 13030","Oneida Indian Nation","https://www.pointplacecasino.com/",NIGC_SOURCE,NOTES),
casino("ny-yellow-brick-road","Yellow Brick Road Casino & Sportsbook",43.0494,-75.90051,"800 W Genesee St, Chittenango, NY 13037","Oneida Indian Nation","https://www.yellowbrickroadcasino.com/",NIGC_SOURCE,NOTES),
casino("ny-turning-stone","Turning Stone Resort Casino",43.11504,-75.58934,"5218 Patrick Rd, Verona, NY 13478","Oneida Indian Nation","https://www.turningstone.com/",NIGC_SOURCE,NOTES),
casino("ny-hamburg-gaming","Hamburg Gaming",42.73936,-78.82345,"5600 McKinley Pkwy, Hamburg, NY 14075","Buffalo Trotting Association","https://www.hamburggaming.com/",NYGC_SOURCE,NOTES),
casino("ny-batavia-downs","Batavia Downs Gaming & Hotel",43.01864,-78.18896,"8315 Park Rd, Batavia, NY 14020","Western Regional Off-Track Betting Corporation","https://www.bataviadownsgaming.com/",NYGC_SOURCE,NOTES),
casino("ny-vernon-downs","Vernon Downs Casino Hotel",43.0767,-75.5387,"4229 Stuhlman Rd, Vernon, NY 13476","American Racing and Entertainment","https://www.vernondowns.com/",NYGC_SOURCE,NOTES),
casino("ny-saratoga-casino","Saratoga Casino Hotel",43.06162,-73.77416,"342 Jefferson St, Saratoga Springs, NY 12866","Saratoga Casino Holdings","https://www.saratogacasino.com/",NYGC_SOURCE,NOTES),
casino("ny-empire-city","Empire City Casino by MGM Resorts",40.92059,-73.8652,"810 Yonkers Ave, Yonkers, NY 10704","MGM Resorts International","https://www.empirecitycasino.com/",NYGC_SOURCE,NOTES),
casino("ny-jakes-58","Jake's 58 Casino Hotel",40.80532,-73.17379,"3635 Express Dr N, Islandia, NY 11749","Suffolk Regional Off-Track Betting Corporation","https://jakes58.com/",NYGC_SOURCE,NOTES),
casino("ny-resorts-world-hudson-valley","Resorts World Hudson Valley",41.52166,-74.12074,"1100 NY-17K, Newburgh, NY 12550","Genting Americas","https://www.rwhudsonvalleyny.com/",NYGC_SOURCE,NOTES),
casino("ny-resorts-world-nyc","Resorts World New York City",40.67453,-73.83075,"110-00 Rockaway Blvd, Queens, NY 11420","Genting Americas","https://www.rwnewyork.com/",NYGC_SOURCE,NOTES),
casino("ny-finger-lakes","Finger Lakes Gaming & Racetrack",42.95947,-77.34883,"5857 NY-96, Farmington, NY 14425","Delaware North","https://www.fingerlakesgaming.com/",NYGC_SOURCE,NOTES),
casino("ny-tioga-downs","Tioga Downs Casino Resort",42.03534,-76.3492,"2384 W River Rd, Nichols, NY 13812","American Racing and Entertainment","https://www.tiogadowns.com/",NYGC_SOURCE,NOTES),
casino("ny-del-lago","del Lago Resort & Casino",42.97006,-76.84536,"1133 NY-414, Waterloo, NY 13165","del Lago Resort & Casino","https://dellagoresort.com/",NYGC_SOURCE,NOTES),
casino("ny-resorts-world-catskills","Resorts World Catskills",41.65567,-74.67685,"888 Resorts World Dr, Monticello, NY 12701","Genting Americas","https://rwcatskills.com/",NYGC_SOURCE,NOTES),
casino("ny-rivers-schenectady","Rivers Casino & Resort Schenectady",42.81718,-73.94808,"1 Rush St, Schenectady, NY 12305","Rush Street Gaming","https://www.riverscasino.com/schenectady/",NYGC_SOURCE,NOTES),
];
