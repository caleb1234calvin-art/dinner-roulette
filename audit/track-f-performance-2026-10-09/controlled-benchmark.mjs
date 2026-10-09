import {mock} from 'node:test';
import {readFileSync,writeFileSync} from 'node:fs';
import {appModuleLoader} from '/tmp/track-f-source/scripts/test-support/load-app-module.mjs';
import {discoveryClock} from '/tmp/track-f-source/scripts/test-support/discovery-clock.mjs';
import {acquired} from '/tmp/track-f-source/scripts/test-support/date-night-query-evaluator.mjs';
process.chdir('/tmp/track-f-source');
const out='/workspace/scratch/a0ea701c7b34/track-f-radial-audit';
const load=appModuleLoader();
const {searchDateNight}=load('src/lib/date-night/search.ts');
const {createDateNightRadialSession}=load('src/lib/date-night/radial-session.ts');
const {createDateNightDiscoveryCache}=load('src/lib/date-night/cache.ts');
const {clipDateNightRadius}=load('src/lib/date-night/radial-cache.ts');
const {decorateDateNight,eligibleDateNight}=load('src/lib/date-night/eligibility.ts');
const {haversineMiles}=load('src/lib/restaurants/geo.ts');
const source=readFileSync('src/lib/date-night/search.ts','utf8');
const catalog=[...source.matchAll(/import \{ ([A-Z_0-9]+_CATALOG) \} from "\.\/([^\"]+)"/g)].flatMap(m=>load(`src/lib/date-night/${m[2]}.ts`)[m[1]]);
const locations=[{name:'Joplin',lat:37.0842,lon:-94.5133},{name:'Columbia',lat:38.9517,lon:-92.3341},{name:'Kansas City',lat:39.0997,lon:-94.5786}];
const modes={anything:['anything'],ordinary:['movies'],seasonal:['haunted-house'],mixed:['movies','haunted-house','park']};
const date=new Date('2026-10-09T21:00:00Z');
const tags=[{amenity:'cinema'},{leisure:'park'},{leisure:'bowling_alley'},{tourism:'museum'},{attraction:'haunted_house'},{attraction:'corn_maze'},{attraction:'pumpkin_patch'},{leisure:'escape_game'}];
function destination(o,m,b){const R=3958.8,d=m/R,a=b*Math.PI/180,p=o.lat*Math.PI/180,l=o.lon*Math.PI/180;const p2=Math.asin(Math.sin(p)*Math.cos(d)+Math.cos(p)*Math.sin(d)*Math.cos(a));return{lat:p2*180/Math.PI,lon:(l+Math.atan2(Math.sin(a)*Math.sin(d)*Math.cos(p),Math.cos(d)-Math.sin(p)*Math.sin(p2)))*180/Math.PI};}
function fixtures(o){let id=0;const rows=[5,17,25,35,45].flatMap(r=>tags.map((t,i)=>({type:'node',id:++id,...destination(o,r,i*45+13),tags:{...t,name:`Benchmark ${String(id).padStart(5,'0')} Hall`,opening_hours:'24/7'}})));return[...rows,{...rows[0],type:'way',id:999,center:{lat:rows[0].lat,lon:rows[0].lon}},{...rows[1],id:998,tags:{...rows[1].tags,demolished:'yes'}}];}
function eligible(venues,q,at=date){return eligibleDateNight(decorateDateNight(clipDateNightRadius(venues,q),q,at),{radiusMiles:q.radiusMiles,activityTypes:q.activityTypes,mood:50,openNowOnly:false,favoritesOnly:false,reduceParks:false},true,{},[],at.getTime());}
const rows=[];
for(const location of locations)for(const[mode,activityTypes]of Object.entries(modes))for(const radiusMiles of [15,20,50])for(const strategy of ['radial-v1','selected-radius-one-shot','50-mile-session']){
 const clock=discoveryClock({mock}),fixture=fixtures(location),calls=[];let rpc=0,first=null,done=false,latest=null;
 mock.method(console,'warn',()=>{});
 mock.method(globalThis,'fetch',(_url,init)=>new Promise((resolve,reject)=>{
   const query=new URLSearchParams(init.body).get('data');const g=query.match(/\(around:([0-9]+),([^,]+),([^)]+)\)/);const bounds={meters:Number(g[1]),lat:Number(g[2]),lon:Number(g[3])};
   const selected=fixture.filter(p=>haversineMiles(bounds.lat,bounds.lon,p.lat,p.lon)*1609.344<=bounds.meters&&acquired(query,p.tags));
   const rec={at:clock.now,rows:selected.length};calls.push(rec);const timer=setTimeout(()=>resolve(Response.json({elements:selected})),100);
   init.signal.addEventListener('abort',()=>{clearTimeout(timer);rec.aborted=true;reject(init.signal.reason)},{once:true});
 }));
 const q={...location,radiusMiles,halloweenActive:true,activityTypes};const data=q=>({lat:q.lat,lon:q.lon,radiusMiles:q.radiusMiles,spookySeasonEnabled:true,activityTypes:q.activityTypes,...(q.patchId?{patchId:q.patchId}:{})});
 let session,cache,pending;
 if(strategy==='radial-v1'){
   session=createDateNightRadialSession({now:()=>date.getTime()+clock.now});
   session.update(q,{request:aq=>{rpc++;return searchDateNight({data:data(aq)});},onChange:s=>{latest=s.response;if(first===null&&s.response&&eligible(s.response.venues,q).length)first=clock.now;if(s.coverage.complete||s.paused)done=true;}});
 }else{
   cache=createDateNightDiscoveryCache({now:()=>date.getTime()+clock.now});const aq={...q,radiusMiles:strategy==='50-mile-session'?50:radiusMiles};
   if(strategy==='50-mile-session'&&eligible(catalog,q).length)first=0;
   rpc++;pending=searchDateNight({data:data(aq)}).then(r=>{cache.store(aq,r);latest=r;if(first===null&&eligible(r.venues,q).length)first=clock.now;done=true;});
 }
 let loops=0;while(!done&&loops++<150)await clock.tick(500);await pending;
 const completedAt= calls.length? Math.max(...calls.map(c=>c.at))+100:0;
 const finalResponseBytes=Buffer.byteLength(JSON.stringify(latest));const pool=eligible(latest?.venues??[],q);const local=[];const beforeRpc=rpc;
 for(const radius of [1,5,10,20,50,10]){
   if(radius>radiusMiles&&strategy!=='50-mile-session')continue;
   const aq={...q,radiusMiles:radius};const start=process.hrtime.bigint();let result;
   if(session){session.update(aq,{request:x=>{rpc++;return searchDateNight({data:data(x)});},onChange:s=>{latest=s.response;}});result=eligible(latest?.venues??[],aq);}
   else{const snap=cache.read(aq);result=eligible(snap.response?.venues??[],aq);}
   local.push({radiusMiles:radius,cpuMs:Number(process.hrtime.bigint()-start)/1e6,eligible:result.length});
 }
 rows.push({location:location.name,mode,radiusMiles,strategy,clock:'deterministic virtual; fixed100ms provider',firstUsefulMs:first,completionMs:completedAt,handlerCalls:rpc,upstreamFixtureCalls:calls.length,rawFixtureRows:calls.reduce((n,x)=>n+x.rows,0),uniqueEligible:pool.length,ids:pool.map(p=>p.id).sort(),categories:[...new Set(pool.flatMap(p=>p.activityTypes))].sort(),responseBytes:finalResponseBytes,additionalRadiusChangeCalls:rpc-beforeRpc,localChanges:local,complete:done});
 session?.dispose();mock.restoreAll();
}
const comparisons=[];for(const l of locations)for(const m of Object.keys(modes))for(const r of [15,20,50]){const s=rows.filter(x=>x.location===l.name&&x.mode===m&&x.radiusMiles===r);comparisons.push({location:l.name,mode:m,radius:r,sameEligibleIds:s.every(x=>JSON.stringify(x.ids)===JSON.stringify(s[0].ids))});}
writeFileSync(`${out}/controlled-results.json`,JSON.stringify({source:'fe22c15cc6442fc4a48fec23c9a1331c69d70bd2',rows,comparisons,fixtureSize:42,actualProviderRequests:0,limitations:'Fixture recall is finite known-fixture parity only. C immediate catalog is prototype overlay, not current application behavior. No browser rendering or real provider latency measured.'},null,2));
console.log(JSON.stringify({runs:rows.length,parity:comparisons.filter(x=>x.sameEligibleIds).length,total:comparisons.length,examples:rows.filter(x=>x.location==='Joplin'&&x.mode==='anything'&&x.radiusMiles===50)},null,2));
