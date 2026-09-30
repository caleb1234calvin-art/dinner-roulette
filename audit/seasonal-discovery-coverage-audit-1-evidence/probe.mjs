// Audit-only probe. Reads frozen application source; never edits production modules.
// Run from repository root: TZ=America/Chicago node audit/seasonal-discovery-coverage-audit-1-evidence/probe.mjs
import fs from 'node:fs';
import ts from 'typescript';
import vm from 'node:vm';
import { createTsTestLoader } from '../../scripts/ts-test-loader.mjs';
const dir = 'audit/seasonal-discovery-coverage-audit-1-evidence';
const load = createTsTestLoader();
const search = load('src/lib/date-night/search.ts', '\nexport { QUERY, MIRRORS, classify, elementToPlace, dedupeDateNight, mergeDateNight, localWithin };');
const { decorateAll } = load('src/lib/restaurants/decorate.ts');
const { haversineMiles } = load('src/lib/restaurants/geo.ts');
const season = load('src/lib/date-night/season.ts');
const availability = load('src/lib/date-night/availability.ts');
const { DEFAULT_DATE_NIGHT_FILTERS } = load('src/lib/date-night/types.ts');
const source = fs.readFileSync('src/components/date-night-home.tsx', 'utf8');
const ast = ts.createSourceFile('date-night-home.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const functionNames = ['venueWeightedPick', 'availableCategories', 'pickCategory', 'balancedPick', 'pickDiverseOptions'];
let extracted = ast.statements.filter(n => ts.isFunctionDeclaration(n) && functionNames.includes(n.name?.text)).map(n => n.getText(ast)).join('\n');
let predicate;
function walk(n) {
  if (ts.isVariableDeclaration(n) && n.name.getText(ast) === 'eligible') predicate = n.initializer.arguments[0].body.getText(ast);
  ts.forEachChild(n, walk);
}
walk(ast);
if (!predicate) throw new Error('Actual UI eligibility predicate not found');
extracted += '\nfunction eligible(decorated, filters, exclusions=[], preferences={}, halloweenActive=true) ' + predicate;
extracted += '\nexports.api = { eligible, balancedPick, pickDiverseOptions };';
const context = { exports: {}, HALLOWEEN_DATE_NIGHT_TYPES: season.HALLOWEEN_DATE_NIGHT_TYPES, Math, Date };
vm.runInNewContext(ts.transpileModule(extracted, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText, context);
const ui = context.exports.api;
const RealDate = Date;
const frozen = '2026-09-30T01:41:35.000Z';
globalThis.Date = class extends RealDate { constructor(...args) { super(...(args.length ? args : [frozen])); } static now() { return new RealDate(frozen).getTime(); } };
const origin = { label: 'Carthage city-center audit origin (not recovered production GPS)', lat: 37.176447, lon: -94.310223 };
const controls = [origin, {label:'Joplin',lat:37.084184,lon:-94.513339},{label:'Springfield',lat:37.208957,lon:-93.292299},{label:'Lockwood rural',lat:37.3856,lon:-93.953},{label:'Aurora regional seasonal cluster',lat:36.970891,lon:-93.717979}];
const selected = ['haunted-house','corn-maze','pumpkin-patch'];
const filters = {...DEFAULT_DATE_NIGHT_FILTERS,radiusMiles:50,activityTypes:selected,mood:50,openNowOnly:false};
const brief = v => ({id:v.id,name:v.name,types:v.activityTypes,distanceMiles:v.distanceMiles,hoursKnown:v.hoursKnown,isOpen:v.isOpen,closesLabel:v.closesLabel,source:v.source});
const final = (venues, f=filters, o=origin, now=new Date()) => ui.eligible(decorateAll(venues,o,now),f);
const mk = (id,name,tags={},miles=1) => ({type:'node',id,lat:origin.lat + miles/3958.8*180/Math.PI,lon:origin.lon,tags:{name,...tags}});
const fixtures = [
  mk(1,'Audit Corn Maze',{leisure:'maze',opening_hours:'closed'}),
  mk(2,'Audit Pumpkin Patch',{attraction:'pumpkin_patch'}),
  mk(3,'Audit Haunted House',{attraction:'haunted_house',opening_hours:'24/7'}),
  mk(4,'Audit Harvest Adventure',{leisure:'maze',description:'corn maze and pumpkin patch',opening_hours:'24/7'},2),
  mk(5,'Audit Corn Maze',{leisure:'maze',opening_hours:'closed'}),
  mk(6,'Audit Hedge Labyrinth',{leisure:'maze'},3),
  mk(7,'Audit Harvest Farm',{landuse:'farmland',crop:'pumpkin'},4),
  mk(8,'Audit Pumpkin Patch',{tourism:'attraction'},5),
  mk(9,'Audit Timber Terror',{attraction:'haunted_trail'},6),
  mk(10,'Audit Pumpkin Shop',{shop:'farm',description:'pumpkin patch'},7),
  mk(11,'Audit Corn Maze',{leisure:'maze',disused:'yes'},8),
  mk(12,'Audit Haunt Permanently Gone',{attraction:'haunted_house',opening_hours:'closed',disused:'yes'},9),
  mk(13,'Audit Closed Corn Maze',{leisure:'maze'},10),
  {type:'node',id:14,lat:origin.lat,lon:origin.lon,tags:{leisure:'maze'}},
  {type:'way',id:15,tags:{name:'Audit Corn Maze',leisure:'maze'}},
];
const query = search.QUERY(origin.lat,origin.lon,80467,true);
fs.writeFileSync(dir+'/carthage-query.overpassql',query);
const queryMatches = element => [...query.matchAll(/nwr\["([^"]+)"="([^"]+)"\]/g)].some(m=>element.tags?.[m[1]]===m[2]);
const normalized = fixtures.map(e=>search.elementToPlace(e,true)).filter(Boolean);
const providerMatched = fixtures.filter(queryMatches);
const actualNormalized = providerMatched.map(e=>search.elementToPlace(e,true)).filter(Boolean);
const deduped = search.dedupeDateNight(actualNormalized);
const allCalls=[];
async function scenario(name,elements=[],outage=false,o=origin) {
  const calls=[];
  globalThis.fetch = async (url, options) => {
    calls.push({url,query:new URLSearchParams(options.body).get('data'),status:outage?null:200,error:outage?'audit injected provider outage':null,rawCandidateCount:outage?null:elements.length});
    if(outage) throw new Error('audit injected provider outage');
    return Response.json({elements});
  };
  let result,error;
  try {const data=search.searchDateNight.validate({...o,radiusMiles:50,spookySeasonEnabled:true});result=await search.searchDateNight.execute({data});} catch(e){error=e.message;}
  const eligible=result?final(result.venues,filters,o):[];
  const row={name,origin:o,calls,serverSource:result?.source,warning:result?.warning??null,error:error??null,serverCount:result?.venues.length??0,eligible:eligible.map(brief),options:ui.pickDiverseOptions(eligible,filters,[],4).map(brief)};
  allCalls.push(row); return {row,result};
}
const empty=await scenario('valid empty live provider');
await scenario('all four providers fail',[],true);
await scenario('query-realistic fixture',providerMatched);
const classification=fixtures.map(e=>({raw:e,selectedByProviderQuery:queryMatches(e),normalized:search.elementToPlace(e,true),rootCause:!queryMatches(e)?'SOURCE COVERAGE GAP: query vocabulary':search.elementToPlace(e,true)?null:'INGESTION / CLASSIFICATION GAP or explicit input validation'}));
const combinations=[];
for(let mask=1;mask<8;mask++) {
 const categories=selected.filter((_,i)=>mask&(1<<i));const f={...filters,activityTypes:categories};
 combinations.push({categories,anchorOnly:final(empty.result.venues,f).map(brief),fixtureOnly:final(deduped,f).map(brief)});
}
const syntheticVenue=(distance)=>search.elementToPlace(mk(500+Math.round(distance*1000),'Radius '+distance,{attraction:'pumpkin_patch'},distance),true);
const radius=[0,49.9,50,50.049,50.05,50.051,51,60].map(distance=>{const v=syntheticVenue(distance);return{requestedDistance:distance,computedDistance:haversineMiles(origin.lat,origin.lon,v.lat,v.lon),eligible:final([v]).length===1,providerRadiusMeters:80467};});
const hours=[false,true,false].map(openNowOnly=>({openNowOnly,anchors:final(empty.result.venues,{...filters,openNowOnly}).map(brief),fixtures:final(deduped,{...filters,openNowOnly}).map(brief)}));
const seasonDates=['2026-09-24T20:00:00-05:00','2026-09-25T20:00:00-05:00','2026-11-01T20:00:00-06:00'].map(iso=>({iso,anchorsOff:final(empty.result.venues,filters,origin,new RealDate(iso)).map(brief),anchorsOn:final(empty.result.venues,{...filters,openNowOnly:true},origin,new RealDate(iso)).map(brief),selectableHelper:availability.isSeasonalDateSelectable('date-night-werehouse-joplin',new RealDate(iso))}));
for(const o of controls.slice(1)){await scenario('control empty provider',[],false,o);await scenario('control provider outage',[],true,o);}
const duplicateTags=[mk(101,'Same Harvest Farm',{leisure:'maze'}),mk(102,'Same Harvest Farm',{attraction:'pumpkin_patch'})];
const duplicateTransport=await scenario('same-coordinate multi-category duplicate transport',duplicateTags);
const duplicateTransportReverse=await scenario('same-coordinate multi-category duplicate transport reversed',[...duplicateTags].reverse());
const replay=[];
const verifiedRaw = JSON.parse(fs.readFileSync(dir+'/exeter-osm-node.json','utf8')).response.elements[0];
const verifiedPlace = search.elementToPlace(verifiedRaw,true);
const verifiedOsmQueryMiss = {raw:verifiedRaw,selectedByActualQuery:queryMatches(verifiedRaw),normalizedIfSupplied:verifiedPlace,distanceMiles:haversineMiles(origin.lat,origin.lon,verifiedPlace.lat,verifiedPlace.lon),eligibleIfSuppliedOpenOff:final([verifiedPlace]).map(brief),note:'Evidence-only direct OSM read. Not supplied to live search or added to catalogs.'};
const referenceBoundary = [
 {name:'Campbell Maze Daze directory point',lat:36.993237,lon:-93.407991},
 {name:'Campbell Maze Daze second directory point',lat:36.99419,lon:-93.41841},
 {name:'Rutledge-Wilson Farm Park OSM center',lat:37.1921975,lon:-93.35973},
 {name:'Turtle Moon Labyrinth OSM node',lat:36.4600896,lon:-93.8407795},
].map(point=>{const synthetic={...verifiedPlace,...point};return {...point,distanceMiles:haversineMiles(origin.lat,origin.lon,point.lat,point.lon),passesActualRadiusAndCategoryPredicate:final([synthetic]).length>0,note:'Coordinate-only boundary probe with a qualifying test category, not a claim this attraction has that category.'};});
const fixtureOptions=ui.pickDiverseOptions(final(deduped),filters,[],4).map(brief);
if(fs.existsSync(dir+'/live-provider-observations.json')){
 for(const run of JSON.parse(fs.readFileSync(dir+'/live-provider-observations.json','utf8')).runs){
  const raw=JSON.parse(run.calls.find(c=>c.status===200).body).elements;
  const normalized=raw.map(e=>search.elementToPlace(e,true)).filter(Boolean);
  const firstMap=new Map();for(const p of normalized)firstMap.set(`${p.name.toLowerCase()}-${p.lat.toFixed(4)}-${p.lon.toFixed(4)}`,p);
  const liveDedup=search.dedupeDateNight([...firstMap.values()]);
  const local=search.localWithin(run.origin.lat,run.origin.lon,50,true);
  const merged=search.mergeDateNight(liveDedup,local);
  const decorated=decorateAll(merged,run.origin,new Date(frozen));
  const within=decorated.filter(v=>v.distanceMiles<=50.05);
  replay.push({origin:run.origin,rawCount:raw.length,normalizedCount:normalized.length,classifiedLiveSeasonal:normalized.filter(v=>v.activityTypes.some(t=>selected.includes(t))).map(brief),firstMapCount:firstMap.size,dedupedLiveCount:liveDedup.length,localCount:local.length,mergedCount:merged.length,withinDistanceCount:within.length,finalOff:final(merged,filters,run.origin,new Date(frozen)).map(brief),finalOn:final(merged,{...filters,openNowOnly:true},run.origin,new Date(frozen)).map(brief),options:ui.pickDiverseOptions(final(merged,filters,run.origin,new Date(frozen)),filters,[],4).map(brief),serializationRoundTripCount:final(JSON.parse(JSON.stringify(merged)),filters,run.origin,new Date(frozen)).length,removedBeforeNormalization:raw.filter(e=>!search.elementToPlace(e,true))});
 }
}
globalThis.fetch=undefined;
globalThis.Date=RealDate;
const evidence={generatedAt:new Date().toISOString(),frozenClientTime:frozen,timezone:process.env.TZ,origin,filters,method:'actual search/decoration modules; exact TypeScript-AST-extracted UI predicate and picker functions; transport only stubbed; no product writes',liveReplay:replay,verifiedOsmQueryMiss,referenceBoundary,fixtureOptions,scenarios:allCalls,classification,stages:{raw:providerMatched.length,normalized:actualNormalized.length,deduped:deduped.length,final:final(deduped).map(brief)},combinations,radius,hours,seasonDates,duplicateMultiActivity:{before:duplicateTags,afterDirectDedupe:search.dedupeDateNight(duplicateTags.map(e=>search.elementToPlace(e,true))),afterActualTransport:duplicateTransport.result.venues.filter(v=>v.name==='Same Harvest Farm'),afterReversedTransport:duplicateTransportReverse.result.venues.filter(v=>v.name==='Same Harvest Farm')} };
fs.writeFileSync(dir+'/deterministic-probes.json',JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify({scenarios:allCalls.map(s=>({name:s.name,origin:s.origin.label,source:s.serverSource,count:s.serverCount,eligible:s.eligible.length,calls:s.calls.length,error:s.error})),combinations:combinations.map(x=>({categories:x.categories,anchorCount:x.anchorOnly.length,fixtureCount:x.fixtureOnly.length})),radius,hours:hours.map(x=>({on:x.openNowOnly,anchorCount:x.anchors.length,fixtureCount:x.fixtures.length}))},null,2));
