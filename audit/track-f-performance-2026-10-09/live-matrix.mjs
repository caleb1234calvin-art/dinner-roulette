import {writeFileSync,mkdirSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {appModuleLoader} from '/tmp/track-f-source/scripts/test-support/load-app-module.mjs';
process.chdir('/tmp/track-f-source');
const output='/workspace/scratch/a0ea701c7b34/track-f-radial-audit/live-matrix';mkdirSync(output,{recursive:true});
const nativeFetch=globalThis.fetch,requests=[],cases=[],summaries=[];let current,stopped=false,failures=0;
const hash=s=>createHash('sha256').update(s).digest('hex');
const warn=console.warn;console.warn=(...args)=>{summaries.push({case:current,args});warn(...args)};
globalThis.fetch=async(url,init)=>{
 if(requests.length+8>=240||stopped)throw new Error('Audit safety stop');
 const rec={index:requests.length+9,case:current,url,query:new URLSearchParams(init.body).get('data'),startedAt:new Date().toISOString(),start:performance.now()};requests.push(rec);rec.querySha256=hash(rec.query);
 init.signal?.addEventListener('abort',()=>{rec.abortAtMs=performance.now()-rec.start},{once:true});
 try{const response=await nativeFetch(url,init);rec.status=response.status;if(response.status===429){stopped=true;rec.stop='429';}
 const body=await response.text();rec.bytes=Buffer.byteLength(body);rec.sha256=hash(body);writeFileSync(`${output}/response-${rec.index}.txt`,body);rec.elapsedMs=performance.now()-rec.start;return new Response(body,{status:response.status,headers:response.headers});
 }catch(e){rec.error={name:e.name,message:e.message,cause:e.cause?.message};rec.elapsedMs=performance.now()-rec.start;throw e;}
};
const load=appModuleLoader();const{searchDateNight}=load('src/lib/date-night/search.ts');const{createDateNightRadialSession}=load('src/lib/date-night/radial-session.ts');const{createDateNightDiscoveryCache}=load('src/lib/date-night/cache.ts');const{clipDateNightRadius}=load('src/lib/date-night/radial-cache.ts');const{decorateDateNight,eligibleDateNight}=load('src/lib/date-night/eligibility.ts');
const eligible=(venues,q)=>eligibleDateNight(decorateDateNight(clipDateNightRadius(venues,q),q),{radiusMiles:q.radiusMiles,activityTypes:q.activityTypes,mood:50,openNowOnly:false,favoritesOnly:false,reduceParks:false},true);
const locations=[{name:'Columbia',lat:38.9517,lon:-92.3341},{name:'Kansas City',lat:39.0997,lon:-94.5786},{name:'Joplin',lat:37.0842,lon:-94.5133}];
const designs=[['selected-radius-one-shot',20],['radial-v1',20],['50-mile-session',50]];
const jobs=locations.flatMap((l,i)=>[...designs.slice(i),...designs.slice(0,i)].map(([strategy,radiusMiles])=>({location:l,strategy,radiusMiles})));
jobs.push({location:locations[2],strategy:'radial-v1',radiusMiles:50});
for(const job of jobs){
 if(stopped)break;current=`${job.location.name}/${job.strategy}/${job.radiusMiles}`;const at=performance.now(),from=requests.length,row={...job,startAt:new Date().toISOString(),applicationCache:'cold',providerCache:'unknown',handlerCalls:0,patchResults:[],firstUsefulMs:null,fullSelectedRadiusCompletionMs:null};cases.push(row);
 const q={...job.location,radiusMiles:job.radiusMiles,halloweenActive:true,activityTypes:['movies']};let result,session;
 const request=async aq=>{row.handlerCalls++;const t=performance.now();try{const r=await searchDateNight({data:{lat:aq.lat,lon:aq.lon,radiusMiles:aq.radiusMiles,spookySeasonEnabled:true,activityTypes:aq.activityTypes,...(aq.patchId?{patchId:aq.patchId}:{})}});const bad=r.discovery.groups.every(g=>g.outcome==='failed');failures=bad?failures+1:0;row.patchResults.push({patchId:aq.patchId??null,ms:performance.now()-t,groups:r.discovery.groups,source:r.source,venues:r.venues.length});if(failures>=2)stopped=true;return r;}catch(e){failures++;if(failures>=2)stopped=true;row.patchResults.push({patchId:aq.patchId??null,ms:performance.now()-t,error:{name:e.name,message:e.message}});throw e;}};
 if(job.strategy==='radial-v1'){
  await new Promise(resolve=>{session=createDateNightRadialSession();session.update(q,{request,onChange:s=>{result=s.response;row.coverage=s.coverage;if(row.firstUsefulMs===null&&result&&eligible(result.venues,q).length)row.firstUsefulMs=performance.now()-at;if(s.coverage.complete){row.fullSelectedRadiusCompletionMs=performance.now()-at;resolve();}else if(stopped||s.paused&&!s.loading){row.partialStopped=true;resolve();}}});});session.dispose();
 }else{
  try{result=await request(q);if(eligible(result.venues,q).length)row.firstUsefulMs=performance.now()-at;if(result.discovery.groups.every(g=>g.outcome!=='failed'))row.fullSelectedRadiusCompletionMs=performance.now()-at;
   const cache=createDateNightDiscoveryCache();row.cacheAccepted=cache.store(q,result);row.radiusChanges=[];for(const radius of[1,10,20,50,10].filter(x=>x<=q.radiusMiles)){const t=process.hrtime.bigint();const view={...q,radiusMiles:radius};const snap=cache.read(view);row.radiusChanges.push({radiusMiles:radius,ms:Number(process.hrtime.bigint()-t)/1e6,coverageMissing:snap.missingActivityTypes.length,eligible:eligible(snap.response?.venues??[],view).length});}
  }catch(e){row.error={name:e.name,message:e.message};}
 }
 row.elapsedMs=performance.now()-at;row.upstreamRequests=requests.length-from;row.response=result;row.eligibleIds=eligible(result?.venues??[],q).map(x=>x.id).sort();row.responseBytes=Buffer.byteLength(JSON.stringify(result));
 writeFileSync(`${output}/results.json`,JSON.stringify({source:'fe22c15cc6442fc4a48fec23c9a1331c69d70bd2',cases,requests,summaries,stopped,consecutiveFailedHandlerAcquisitions:failures,planned:jobs,totalPhysicalRequestsIncludingInitialProbe:requests.length+8},null,2));
 console.log(JSON.stringify({case:current,elapsed:row.elapsedMs,first:row.firstUsefulMs,complete:row.fullSelectedRadiusCompletionMs,requests:row.upstreamRequests,eligible:row.eligibleIds.length,stopped}));
 await new Promise(r=>setTimeout(r,500));
}
