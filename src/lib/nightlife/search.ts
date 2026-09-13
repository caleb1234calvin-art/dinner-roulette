import { validCoordinates, validateNightlifeQuery, inactivePlace, heldCasino, casinoIdentityName } from "./discovery-policy";
import { createServerFn } from "@tanstack/react-start";
import { namesMatch } from "@/lib/utils";
import { isLikelyChain, inferPriceLevel } from "@/lib/restaurants/chains";
import { haversineMiles } from "@/lib/restaurants/geo";
import type { RawPlace } from "@/lib/restaurants/normalize";
import type { PhotoKey } from "@/lib/restaurants/types";
import { CASINO_CATALOG } from "./casino-catalog";
import { CASINO_CATALOG_PASS_2 } from "./casino-catalog-pass-2";
import { CASINO_CATALOG_PASS_3 } from "./casino-catalog-pass-3";
import { CASINO_CATALOG_PASS_4 } from "./casino-catalog-pass-4";
import { CASINO_CATALOG_PASS_5 } from "./casino-catalog-pass-5";
import { CASINO_CATALOG_PASS_6 } from "./casino-catalog-pass-6";
import { CASINO_CATALOG_PASS_7 } from "./casino-catalog-pass-7";
import { CASINO_CATALOG_PASS_8 } from "./casino-catalog-pass-8";
import { CASINO_CATALOG_PASS_9 } from "./casino-catalog-pass-9";
import { CASINO_CATALOG_PASS_10 } from "./casino-catalog-pass-10";
import { CASINO_CATALOG_PASS_11 } from "./casino-catalog-pass-11";
import { CASINO_CATALOG_PASS_12 } from "./casino-catalog-pass-12";
import { CASINO_CATALOG_PASS_13 } from "./casino-catalog-pass-13";
import { CASINO_CATALOG_PASS_14 } from "./casino-catalog-pass-14";
import { CASINO_CATALOG_PASS_15 } from "./casino-catalog-pass-15";
import { CASINO_CATALOG_PASS_16 } from "./casino-catalog-pass-16";
import { CASINO_CATALOG_PASS_17 } from "./casino-catalog-pass-17";
import { CASINO_CATALOG_PASS_18 } from "./casino-catalog-pass-18";
import { CASINO_CATALOG_PASS_19 } from "./casino-catalog-pass-19";
import { CASINO_CATALOG_PASS_20 } from "./casino-catalog-pass-20";
import { CASINO_CATALOG_PASS_21 } from "./casino-catalog-pass-21";
import { CASINO_CATALOG_PASS_22 } from "./casino-catalog-pass-22";
import { CASINO_CATALOG_PASS_23 } from "./casino-catalog-pass-23";
import { CASINO_CATALOG_PASS_24 } from "./casino-catalog-pass-24";
import { CASINO_CATALOG_PASS_25 } from "./casino-catalog-pass-25";
import { CASINO_CATALOG_PASS_26 } from "./casino-catalog-pass-26";
import { CASINO_CATALOG_PASS_27 } from "./casino-catalog-pass-27";
import { CASINO_CATALOG_PASS_28 } from "./casino-catalog-pass-28";
import { CASINO_CATALOG_PASS_29 } from "./casino-catalog-pass-29";
import { CASINO_CATALOG_PASS_30 } from "./casino-catalog-pass-30";
import { CASINO_CATALOG_PASS_31 } from "./casino-catalog-pass-31";
import { CASINO_CATALOG_PASS_32 } from "./casino-catalog-pass-32";
import { CASINO_CATALOG_PASS_33 } from "./casino-catalog-pass-33";
import { CASINO_CATALOG_PASS_34 } from "./casino-catalog-pass-34";
import { CASINO_CATALOG_PASS_35 } from "./casino-catalog-pass-35";
import { CASINO_CATALOG_PASS_36 } from "./casino-catalog-pass-36";
import { CASINO_CATALOG_PASS_37 } from "./casino-catalog-pass-37";
import { CASINO_CATALOG_PASS_38 } from "./casino-catalog-pass-38";
import { CASINO_CATALOG_PASS_39 } from "./casino-catalog-pass-39";
import { CASINO_CATALOG_PASS_40 } from "./casino-catalog-pass-40";
import { CASINO_CATALOG_PASS_41 } from "./casino-catalog-pass-41";
import { CASINO_CATALOG_PASS_42 } from "./casino-catalog-pass-42";
import { CASINO_CATALOG_PASS_43 } from "./casino-catalog-pass-43";
import { CASINO_CATALOG_PASS_44 } from "./casino-catalog-pass-44";
import { CASINO_CATALOG_PASS_45 } from "./casino-catalog-pass-45";
import { CASINO_CATALOG_PASS_46 } from "./casino-catalog-pass-46";
import { CASINO_CATALOG_PASS_47 } from "./casino-catalog-pass-47";
import { CASINO_CATALOG_PASS_48 } from "./casino-catalog-pass-48";
import { CASINO_CATALOG_PASS_49 } from "./casino-catalog-pass-49";
import { CASINO_CATALOG_PASS_50 } from "./casino-catalog-pass-50";
import { CASINO_CATALOG_PASS_51 } from "./casino-catalog-pass-51";
import { LOCAL_NIGHTLIFE_CATALOG } from "./catalog";
import { JASPER_COUNTY_NIGHTLIFE_CATALOG } from "./jasper-county-catalog";
import { nightlifeTypeLabel, type ConcreteNightlifeType, type NightlifePlace, type NightlifeSearchResponse } from "./types";

const MIRRORS = ["https://overpass.openstreetmap.fr/api/interpreter","https://overpass.private.coffee/api/interpreter","https://maps.mail.ru/osm/tools/overpass/api/interpreter","https://overpass-api.de/api/interpreter"];
const QUERY = (lat:number,lon:number,radiusMeters:number)=>`\n[out:json][timeout:20];\n(\n  nwr["amenity"="bar"](around:${Math.round(radiusMeters)},${lat},${lon});\n  nwr["amenity"="pub"](around:${Math.round(radiusMeters)},${lat},${lon});\n  nwr["amenity"="nightclub"](around:${Math.round(radiusMeters)},${lat},${lon});\n  nwr["amenity"="biergarten"](around:${Math.round(radiusMeters)},${lat},${lon});\n  nwr["amenity"="casino"](around:${Math.round(radiusMeters)},${lat},${lon});\n  nwr["gambling"="casino"](around:${Math.round(radiusMeters)},${lat},${lon});\n  nwr["craft"="brewery"](around:${Math.round(radiusMeters)},${lat},${lon});\n  nwr["microbrewery"="yes"](around:${Math.round(radiusMeters)},${lat},${lon});\n  nwr["amenity"="restaurant"]["bar"="yes"](around:${Math.round(radiusMeters)},${lat},${lon});\n);\nout center tags;\n`;
interface OverpassElement{type:string;id:number;lat?:number;lon?:number;center?:{lat:number;lon:number};tags?:Record<string,string>}
const CASINO_PASSES=[CASINO_CATALOG,CASINO_CATALOG_PASS_2,CASINO_CATALOG_PASS_3,CASINO_CATALOG_PASS_4,CASINO_CATALOG_PASS_5,CASINO_CATALOG_PASS_6,CASINO_CATALOG_PASS_7,CASINO_CATALOG_PASS_8,CASINO_CATALOG_PASS_9,CASINO_CATALOG_PASS_10,CASINO_CATALOG_PASS_11,CASINO_CATALOG_PASS_12,CASINO_CATALOG_PASS_13,CASINO_CATALOG_PASS_14,CASINO_CATALOG_PASS_15,CASINO_CATALOG_PASS_16,CASINO_CATALOG_PASS_17,CASINO_CATALOG_PASS_18,CASINO_CATALOG_PASS_19,CASINO_CATALOG_PASS_20,CASINO_CATALOG_PASS_21,CASINO_CATALOG_PASS_22,CASINO_CATALOG_PASS_23,CASINO_CATALOG_PASS_24,CASINO_CATALOG_PASS_25,CASINO_CATALOG_PASS_26,CASINO_CATALOG_PASS_27,CASINO_CATALOG_PASS_28,CASINO_CATALOG_PASS_29,CASINO_CATALOG_PASS_30,CASINO_CATALOG_PASS_31,CASINO_CATALOG_PASS_32,CASINO_CATALOG_PASS_33,CASINO_CATALOG_PASS_34,CASINO_CATALOG_PASS_35,CASINO_CATALOG_PASS_36,CASINO_CATALOG_PASS_37,CASINO_CATALOG_PASS_38,CASINO_CATALOG_PASS_39,CASINO_CATALOG_PASS_40,CASINO_CATALOG_PASS_41,CASINO_CATALOG_PASS_42,CASINO_CATALOG_PASS_43,CASINO_CATALOG_PASS_44,CASINO_CATALOG_PASS_45,CASINO_CATALOG_PASS_46,CASINO_CATALOG_PASS_47,CASINO_CATALOG_PASS_48,CASINO_CATALOG_PASS_49,CASINO_CATALOG_PASS_50,CASINO_CATALOG_PASS_51] as const;
function normalizedNightlifeName(name:string){return name.toLowerCase().replace(/[^a-z0-9]+/g," ").trim()}
function dedupeCuratedCasinosLatestWins(){const canonical:NightlifePlace[]=[];for(const pass of CASINO_PASSES){for(const place of pass){const normalizedName=normalizedNightlifeName(place.name);const matchIndex=canonical.findIndex((candidate)=>(candidate.id===place.id||normalizedNightlifeName(candidate.name)===normalizedName)&&haversineMiles(candidate.lat,candidate.lon,place.lat,place.lon)<0.35);if(matchIndex>=0)canonical[matchIndex]=place;else canonical.push(place)}}return canonical}
const ALL_CURATED_NIGHTLIFE=[...dedupeCuratedCasinosLatestWins(),...JASPER_COUNTY_NIGHTLIFE_CATALOG,...LOCAL_NIGHTLIFE_CATALOG];
const RETIRED_NIGHTLIFE_NAMES=["dead cow saloon and grill","dead cow saloon & grill","dead cow saloon"] as const;
const NIGHTLIFE_ALIAS_GROUPS=[["joe's 19th hole","joes 19th hole","aussie's","aussies"],["the vanderpump hotel","the cromwell"]] as const;
function isRetiredNightlifeName(name:string){return RETIRED_NIGHTLIFE_NAMES.some((retired)=>namesMatch(retired,name))}
function nightlifeNamesMatch(a:string,b:string){if(namesMatch(a,b))return true;return NIGHTLIFE_ALIAS_GROUPS.some((group)=>group.some((candidate)=>namesMatch(candidate,a))&&group.some((candidate)=>namesMatch(candidate,b)))}
function classify(tags:Record<string,string>,name:string):ConcreteNightlifeType[]{const types=new Set<ConcreteNightlifeType>();const amenity=tags.amenity??"";const lower=`${name} ${tags.description??""}`.toLowerCase();if(amenity==="casino"||tags.gambling==="casino")types.add("casino");if(amenity==="nightclub")types.add("club");if(amenity==="pub")types.add("pub");if(amenity==="bar"||tags.bar==="yes")types.add("bar");if(amenity==="biergarten"||tags.craft==="brewery"||tags.microbrewery==="yes")types.add("brewery");if(/lounge|cocktail|wine bar/.test(lower))types.add("lounge");if(/club|dance/.test(lower)&&!/country club/.test(lower))types.add("club");if(types.size===0)types.add("bar");return[...types]}
function energyFor(types:readonly ConcreteNightlifeType[],tags:Record<string,string>,name:string):1|2|3{const lower=`${name} ${tags.description??""}`.toLowerCase();if(types.includes("club")||/dance|dj|nightclub|dancefloor|karaoke/.test(lower))return 3;if(types.includes("lounge")||types.includes("brewery")||/wine|cocktail|speakeasy/.test(lower))return 1;return 2}
function elementToPlace(element:OverpassElement):NightlifePlace|null{if(!element||typeof element!=="object")return null;const tags=element.tags??{};const name=typeof tags.name==="string"?tags.name.trim():"";if(!name||/closed/i.test(name)||isRetiredNightlifeName(name))return null;const lat=element.lat??element.center?.lat;const lon=element.lon??element.center?.lon;if(!validCoordinates(lat,lon)||typeof lon!=="number"||inactivePlace(tags)||!["node","way","relation"].includes(element.type)||!Number.isSafeInteger(element.id)||element.id<=0)return null;const house=tags["addr:housenumber"]??"";const street=tags["addr:street"]??"";const city=tags["addr:city"]??"";const address=[`${house} ${street}`.trim(),city].filter(Boolean).join(", ")||"Address unavailable";const venueTypes=classify(tags,name);if(venueTypes.includes("casino")&&heldCasino(name,lat,lon))return null;const isChain=isLikelyChain(name,tags.brand??null);const raw:RawPlace={id:`nightlife-osm-${element.type}-${element.id}`,name,lat,lon,address,amenity:tags.amenity??"bar",cuisine:tags.cuisine??"",openingHours:tags.opening_hours??null,phone:tags.phone??tags["contact:phone"]??null,website:tags.website??tags["contact:website"]??null,brand:tags.brand??null};return{id:raw.id,name,lat,lon,address,cuisines:["other"],cuisineLabel:nightlifeTypeLabel(venueTypes),priceLevel:inferPriceLevel({amenity:raw.amenity,cuisine:raw.cuisine,name,isChain}),rating:null,reviewCount:null,openingHours:raw.openingHours,phone:raw.phone,website:raw.website,isChain,photoKey:"cafe" as PhotoKey,source:"osm",venueTypes,energyLevel:energyFor(venueTypes,tags,name)}}
async function queryMirror(url:string,body:string,timeoutMs=8000):Promise<NightlifePlace[]>{const response=await fetch(url,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8",Accept:"application/json","User-Agent":"PickForUs/2.0 (nightlife roulette)"},body,signal:AbortSignal.timeout(timeoutMs)});if(!response.ok)throw new Error(`Overpass ${response.status}`);const json=(await response.json()) as {elements?:OverpassElement[]};if(!Array.isArray(json.elements))throw new Error("Malformed nightlife provider response");const unique=new Map<string,NightlifePlace>();for(const element of json.elements){const place=elementToPlace(element);if(!place)continue;unique.set(`${place.name.toLowerCase()}-${place.lat.toFixed(4)}-${place.lon.toFixed(4)}`,place)}return[...unique.values()]}
function curatedWithin(lat:number,lon:number,radiusMiles:number){return ALL_CURATED_NIGHTLIFE.filter((place)=>haversineMiles(lat,lon,place.lat,place.lon)<=radiusMiles+1)}
function mergeNightlife(live:NightlifePlace[],curated:NightlifePlace[]){const merged=[...curated];for(const place of live){const matchIndex=merged.findIndex((candidate)=>((candidate.venueTypes.includes("casino")&&place.venueTypes.includes("casino"))?(casinoIdentityName(candidate.name)===casinoIdentityName(place.name)||NIGHTLIFE_ALIAS_GROUPS.some(group=>group.some(alias=>alias===candidate.name.toLowerCase())&&group.some(alias=>alias===place.name.toLowerCase()))):nightlifeNamesMatch(candidate.name,place.name))&&haversineMiles(candidate.lat,candidate.lon,place.lat,place.lon)<0.35);if(matchIndex>=0){const saved=merged[matchIndex]!;merged[matchIndex]={...place,id:saved.id,name:saved.name,lat:saved.lat,lon:saved.lon,address:saved.address||place.address,cuisines:saved.cuisines,cuisineLabel:saved.cuisineLabel,priceLevel:saved.priceLevel??place.priceLevel,rating:saved.rating??place.rating,reviewCount:saved.reviewCount??place.reviewCount,openingHours:saved.openingHours||place.openingHours,phone:saved.phone??place.phone,website:saved.website??place.website,venueTypes:saved.venueTypes,energyLevel:saved.energyLevel,source:"merged"};continue}merged.push(place)}return merged}
export const searchNightlife=createServerFn({method:"POST"}).validator(validateNightlifeQuery).handler(async({data}):Promise<NightlifeSearchResponse>=>{const fetchRadius=Math.max(data.radiusMiles,15);const radiusMeters=Math.min(fetchRadius*1609.34,80467);const body=`data=${encodeURIComponent(QUERY(data.lat,data.lon,radiusMeters))}`;const curated=curatedWithin(data.lat,data.lon,fetchRadius);let lastError:unknown;const deadline=Date.now()+20000;for(const mirror of MIRRORS){const remaining=deadline-Date.now();if(remaining<=0)break;try{const live=await queryMirror(mirror,body,Math.min(8000,remaining));const venues=mergeNightlife(live,curated);return{venues,source:curated.length?"merged":"live"}}catch(error){lastError=error}}if(curated.length>0)return{venues:curated,source:"fallback",warning:"Using saved nightlife while live discovery is unavailable."};throw lastError instanceof Error?lastError:new Error("Could not load nightlife venues for that area.")});