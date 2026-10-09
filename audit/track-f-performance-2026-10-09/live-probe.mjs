import {writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {appModuleLoader} from '/tmp/track-f-source/scripts/test-support/load-app-module.mjs';
process.chdir('/tmp/track-f-source');
const output='/workspace/scratch/a0ea701c7b34/track-f-radial-audit/live';mkdirSync(output,{recursive:true});
const nativeFetch=globalThis.fetch, log=[], acquisitions=[];let current, stopped429=false;
const hash=s=>createHash('sha256').update(s).digest('hex');
globalThis.fetch=async(url,init)=>{
 if(log.length>=240||stopped429)throw new Error('Audit request safety stop');
 const rec={index:log.length+1,acquisition:current,url,query:new URLSearchParams(init.body).get('data'),startedAt:new Date().toISOString(),start:performance.now()};log.push(rec);
 rec.querySha256=hash(rec.query);init.signal?.addEventListener('abort',()=>{rec.abortAtMs=performance.now()-rec.start},{once:true});
 try{const response=await nativeFetch(url,init);rec.status=response.status;if(response.status===429)stopped429=true;
 const body=await response.text();rec.bytes=Buffer.byteLength(body);rec.sha256=hash(body);writeFileSync(`${output}/response-${rec.index}.txt`,body);rec.elapsedMs=performance.now()-rec.start;
 return new Response(body,{status:response.status,headers:response.headers});
 }catch(e){rec.error={name:e.name,message:e.message,cause:e.cause?.message};rec.elapsedMs=performance.now()-rec.start;throw e;}
};
const load=appModuleLoader();const {searchDateNight}=load('src/lib/date-night/search.ts');
const {decorateDateNight,eligibleDateNight}=load('src/lib/date-night/eligibility.ts');
const base={lat:37.0842,lon:-94.5133,radiusMiles:50,spookySeasonEnabled:true,activityTypes:['movies']};
for(const mode of ['radial-core','selected-radius-50']){
 current=mode;const started=performance.now(),from=log.length;const row={mode,location:'Joplin',startedAt:new Date().toISOString(),applicationCache:'cold',providerCache:'unknown',transport:'local exact handler, TanStack transport stubbed',data:{...base,...(mode==='radial-core'?{patchId:'radial-v1:core'}:{})}};
 try{const result=await searchDateNight({data:row.data});row.result=result;row.elapsedMs=performance.now()-started;row.eligible=eligibleDateNight(decorateDateNight(result.venues,base),{radiusMiles:50,activityTypes:['movies'],mood:50,openNowOnly:false,favoritesOnly:false,reduceParks:false},true).map(x=>x.id);row.allGroupsFailed=result.discovery.groups.every(x=>x.outcome==='failed');}
 catch(e){row.error={name:e.name,message:e.message};row.elapsedMs=performance.now()-started;row.allGroupsFailed=true;}
 row.upstreamRequests=log.length-from;acquisitions.push(row);writeFileSync(`${output}/live-results.json`,JSON.stringify({source:'fe22c15cc6442fc4a48fec23c9a1331c69d70bd2',acquisitions,requests:log,stopped429},null,2));
 if(stopped429)break;
}
console.log(JSON.stringify({acquisitions:acquisitions.map(({result,...r})=>({...r,venues:result?.venues.length,source:result?.source,groups:result?.discovery.groups})),requests:log.length,stopped429}));
