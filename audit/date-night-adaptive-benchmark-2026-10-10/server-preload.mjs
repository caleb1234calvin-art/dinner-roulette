// Benchmark-only server boundary. Exact application code is not altered.
import { mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const NativeDate=Date,nativeFetch=globalThis.fetch,realNow=Date.now.bind(Date);
const cfg=JSON.parse(process.env.PFU_BENCH_CASE??'null');
if(!cfg||!['fixture','live'].includes(cfg.mode)||!process.send||process.env.CI!=='true')throw Error('Benchmark preload requires isolated IPC server');
const policyMs=NativeDate.parse(cfg.policyClock), anchorReal=realNow();
class PolicyDate extends NativeDate {constructor(...args){super(...(args.length?args:[policyMs+realNow()-anchorReal]));}static now(){return policyMs+realNow()-anchorReal;}}
globalThis.Date=PolicyDate;
const pending=new Map(),successfulQueries=new Set(),stopController=new AbortController();let nonce=0;
const ask=(type,data)=>new Promise((resolve,reject)=>{const id=++nonce;pending.set(id,{resolve,reject});process.send({type,nonce:id,...data});});
process.on('message',m=>{if(m.type==='stop'){stopController.abort(new Error(m.reason));return;}const p=pending.get(m.nonce);if(p){pending.delete(m.nonce);m.error?p.reject(Error(m.error)):p.resolve(m);}});
process.on('disconnect',()=>{stopController.abort(Error('Parent disconnected'));for(const p of pending.values())p.reject(Error('Parent disconnected'));});
const digest=b=>createHash('sha256').update(b).digest('hex');
const providers=new Set(['overpass.openstreetmap.fr','overpass.private.coffee','maps.mail.ru','overpass-api.de']);
mkdirSync(cfg.output,{recursive:true});
globalThis.fetch=async(input,init={})=>{
 const url=new URL(input instanceof Request?input.url:input);
 if(['127.0.0.1','localhost','[::1]'].includes(url.hostname))return nativeFetch(input,init);
 if(!providers.has(url.hostname)){await ask('integrity',{reason:'Unexpected server egress',url:String(url)});throw Error('Unexpected server egress blocked');}
 const body=typeof init.body==='string'?init.body:'';
 const query=new URLSearchParams(body).get('data')??'';
 const match=query.match(/\(around:([^)]*)\)/);
 const values=match?.[1].split(',').map(Number);
 if(!values||values.length!==3||!query.includes('.lifecycle_context')){await ask('integrity',{reason:'Unrecognized provider query',url:String(url)});throw Error('Unrecognized provider query blocked');}
 const[radius,lat,lon]=values;
 const patch=cfg.patches.find(p=>Math.abs(p.radiusMeters-radius)<0.01&&Math.abs(p.center.lat-lat)<1e-8&&Math.abs(p.center.lon-lon)<1e-8);
 const primary=['B','D'].includes(cfg.strategy)&&Math.abs(lat-cfg.lat)<1e-8&&Math.abs(lon-cfg.lon)<1e-8&&Math.abs(radius-Math.max(cfg.radius,15)*1609.344)<1;
 if(!patch&&!primary){await ask('integrity',{reason:'Unbounded query geometry',radius,lat,lon});throw Error('Unbounded query blocked');}
 const metadata={caseId:cfg.caseId,phase:primary?'primary':['B','D'].includes(cfg.strategy)?'audit':'radial-primary',patchId:primary?null:patch.id,url:String(url),query,querySha256:digest(query),radius,lat,lon};
 const {attempt}=await ask('reserve',{metadata});
 const at=performance.now(),signal=init.signal?AbortSignal.any([init.signal,stopController.signal]):stopController.signal;
 let finished=false;
 const finish=async(outcome,detail)=>{if(finished)return;finished=true;await ask('finish',{attempt,outcome,metadata:{...metadata,...detail,elapsedMs:performance.now()-at,settledUtc:new NativeDate(realNow()).toISOString()}});};
 try{
   const fixtureFailure=cfg.mode==='fixture'&&((cfg.fixtureScenario==='baseline-one-failed-patch'&&patch?.id==='radial-v1:20:0')||(cfg.fixtureScenario==='hybrid-failed-primary'&&primary));
   if(cfg.mode==='fixture')await new Promise(resolve=>setTimeout(resolve,primary?(cfg.fixtureScenario==='adaptive-options'?6000:300):350));
   const fixtureCount=cfg.fixtureScenario==='adaptive-thin'?3:4;
   const response=fixtureFailure ? new Response('Preregistered fixture failure',{status:504}) : cfg.mode==='fixture' ? Response.json({elements:Array.from({length:fixtureCount},(_,i)=>({type:'node',id:980000+i,lat:cfg.lat+i*0.003,lon:cfg.lon,tags:{name:`Adaptive benchmark fixture venue ${i+1}`, ...(cfg.activityTypes?.includes('escape-room')&&i%2?{leisure:'escape_game'}:{amenity:'cinema'}),opening_hours:'24/7'}}))}) : await nativeFetch(input,{...init,signal});
   if(response.status===429){writeFileSync(`${cfg.output}/response-${attempt}-429.json`,JSON.stringify({status:429,headers:Object.fromEntries(response.headers)}));await finish('rate-limited',{status:429,body:'not read: immediate stop'});return response;}
   const bytes=Buffer.from(await response.arrayBuffer());writeFileSync(`${cfg.output}/response-${attempt}.bin`,bytes);
   let valid=false,rawRows=null,parseError=null;try{const d=JSON.parse(bytes.toString());valid=Array.isArray(d?.elements)&&!d.remark;rawRows=Array.isArray(d?.elements)?d.elements.length:null;}catch(e){parseError=e.message;}
   if(response.ok&&valid)successfulQueries.add(metadata.querySha256);
   await finish(response.ok&&valid?'success':'failure',{status:response.status,bytes:bytes.length,sha256:digest(bytes),validProviderPayload:valid,rawRows,parseError});
   return new Response(bytes,{status:response.status,statusText:response.statusText,headers:response.headers});
 }catch(e){
   const reason=init.signal?.reason;
   const outcome=stopController.signal.aborted?'benchmark-abort':reason?.name==='TimeoutError'||e.name==='TimeoutError'?'timeout':init.signal?.aborted?(successfulQueries.has(metadata.querySha256)?'hedge-abort':'session-abort'):'failure';
   await finish(outcome,{error:{name:e.name,message:e.message},abortReason:{name:reason?.name,message:String(reason?.message??reason)}});throw e;
 }
};
