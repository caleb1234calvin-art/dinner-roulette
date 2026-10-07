// Audit-only: real provider requests, immutable source modules, recorded raw responses.
import fs from 'node:fs';
import { createTsTestLoader } from '../../scripts/ts-test-loader.mjs';
const dir='audit/seasonal-discovery-coverage-audit-1-evidence';
const load=createTsTestLoader();
const app=load('src/lib/date-night/search.ts','\nexport { elementToPlace, dedupeDateNight };');
const nativeFetch=globalThis.fetch;
const origins=[{label:'Carthage',lat:37.176447,lon:-94.310223},{label:'Joplin',lat:37.084184,lon:-94.513339},{label:'Springfield',lat:37.208957,lon:-93.292299},{label:'Lockwood rural',lat:37.3856,lon:-93.953},{label:'Aurora',lat:36.970891,lon:-93.717979}];
const runs=[];
for(const origin of origins){
 const run={origin,startedAt:new Date().toISOString(),calls:[]};
 globalThis.fetch=async(url,options)=>{
  const call={url,query:new URLSearchParams(options.body).get('data'),startedAt:new Date().toISOString()};run.calls.push(call);
  try{const r=await nativeFetch(url,options);call.status=r.status;const body=await r.clone().text();call.body=body;try{const json=JSON.parse(body);call.rawCandidateCount=Array.isArray(json.elements)?json.elements.length:null;call.normalized=Array.isArray(json.elements)?json.elements.map(e=>app.elementToPlace(e,true)).filter(Boolean):null;}catch{/* Retain the raw response when candidate decoding fails. */} call.finishedAt=new Date().toISOString();console.log(JSON.stringify({origin:origin.label,url,status:call.status,count:call.rawCandidateCount}));return r;}
  catch(e){call.error=e.message;call.cause=e.cause?.message??null;call.finishedAt=new Date().toISOString();console.log(JSON.stringify({origin:origin.label,url,error:call.error,cause:call.cause}));throw e;}
 };
 try{run.result=await app.searchDateNight.execute({data:app.searchDateNight.validate({...origin,radiusMiles:50,spookySeasonEnabled:true})});}catch(e){run.error=e.message;}
 run.finishedAt=new Date().toISOString();runs.push(run);fs.writeFileSync(dir+'/live-provider-observations.json',JSON.stringify({observedAt:new Date().toISOString(),notAnInventory:true,runs},null,2)+'\n');
}
globalThis.fetch=nativeFetch;
