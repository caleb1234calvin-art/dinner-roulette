import test from 'node:test';
import assert from 'node:assert/strict';
import { extractPatchId, usable } from './browser-runner.mjs';
import { readFileSync } from 'node:fs';
import path from 'node:path';
const job = {lat:38.9517,lon:-92.3341,radiusMiles:20,activityTypes:['movies']};
const venue={id:'date-night-osm-node-1',name:'Fixture Cinema',lat:38.9517,lon:-92.3341,distanceMiles:0,activityTypes:['movies']};
test('Rendered identity requires real title, unique category/radius/origin eligible venue',()=>{
 assert.equal(usable({control:'pick',venues:[venue],titles:[venue.name]},job),true);
 assert.equal(usable({control:'pick',venues:[venue],titles:[]},job),false);
 assert.equal(usable({control:'pick',venues:[{...venue,lat:45}],titles:[venue.name]},job),false);
 assert.equal(usable({control:'pick',venues:[{...venue,activityTypes:['bar']}],titles:[venue.name]},job),false);
 assert.equal(usable({control:'options',venues:[venue,venue],titles:[venue.name,venue.name]},job),false);
 assert.equal(usable({control:'plan',venues:[venue],titles:[venue.name],validPair:false},job),false);
});
test('Actual request patch attribution is exact and ambiguous attribution rejected',()=>{
 const request=text=>({url:()=> 'http://127.0.0.1:8087/_serverFn/f?payload='+encodeURIComponent(text),postData:()=>null});
 const patches=[{id:'radial-v1-core-15'},{id:'radial-v1-ring-15-20-0'}];
 assert.equal(extractPatchId(request('{"patchId":"radial-v1-core-15"}'),patches),patches[0].id);
 assert.equal(extractPatchId(request('{}'),patches),null);
 assert.throws(()=>extractPatchId(request(patches.map(p=>p.id).join(' ')),patches),/Ambiguous/);
});
test('Sector 50:10 never collides with sector 50:1, in GET or POST payloads',()=>{
 const patches=Array.from({length:11},(_,i)=>({id:`radial-v1:50:${i}`}));
 const payload=JSON.stringify({data:{patchId:'radial-v1:50:10'}});
 assert.equal(extractPatchId({url:()=> 'http://local/_serverFn/f?payload='+encodeURIComponent(payload),postData:()=>null},patches),'radial-v1:50:10');
 assert.equal(extractPatchId({url:()=> 'http://local/_serverFn/f',postData:()=>payload},patches),'radial-v1:50:10');
 assert.equal(extractPatchId({url:()=> 'http://local/_serverFn/f',postData:()=>JSON.stringify({patchId:'radial-v1:50:100'})},patches),null);
});
test('Both exact source versions retain benchmark DOM/props and source pause contract',()=>{
 const roots=[['A',process.env.PFU_BASELINE_ROOT],['B',process.env.PFU_CANDIDATE_ROOT]];
 // The coordinator independently verifies these clean checkout identities before execution.
 for(const [strategy,root] of roots) {
  assert.ok(root, `PFU_${strategy === 'A' ? 'BASELINE' : 'CANDIDATE'}_ROOT is required`);
  const source=readFileSync(path.join(root,'src/components/date-night-home.tsx'),'utf8');
  for(const text of ['data-radial-progress','activities match','Pick our date','Give us options','Plan the night','restaurant={currentPick']) assert.ok(source.includes(text),`${strategy}: ${text}`);
  const radial=readFileSync(path.join(root,'src/lib/date-night/radial-session.ts'),'utf8');
  assert.ok(radial.includes('DATE_NIGHT_RADIAL_FAILURE_LIMIT = 3'));
  assert.ok(radial.includes('after.patches[0]!.missingActivityTypes.length'));
 }
});
test('Exact installed TanStack decoder reads retained bytes without a network call',async()=>{
 const {readDecodedRPC}=await import('./browser-runner.mjs');
 const root=process.env.PFU_CANDIDATE_ROOT;
 assert.ok(root, 'PFU_CANDIDATE_ROOT is required');
 const actual=await readDecodedRPC(root,{url:()=> 'http://fixture.invalid/_serverFn/test',status:()=>200,allHeaders:async()=>({'content-type':'application/json'})},Buffer.from('{"result":{"venues":[],"discovery":{"groups":[]}}}'));
 assert.deepEqual(actual,{result:{venues:[],discovery:{groups:[]}}});
});
test('Real browser predicate closes all 32 settled patches with one failure as quiescent partial',async()=>{
 const {browserTerminal}=await import('./browser-runner.mjs');
 const expected=Array.from({length:32},(_,i)=>({id:`p${i}`,innerMiles:i?15:0}));
 const rpc=expected.map((p,i)=>({patchId:p.id,end:i+1,success:i!==2}));
 const snapshot={loading:false,progress:'Loaded through 15 miles · some outer areas could not be loaded',coverage:{complete:false,patches:expected.map((p,i)=>({...p,missingActivityTypes:i===2?['movies']:[]}))}};
 const input={snapshot,rpc,expected,activeRpc:0,activePhysical:0,idleMs:1500,interactionsDone:true};
 assert.equal(browserTerminal(input).outcome,'quiescent-partial');
 assert.equal(browserTerminal({...input,activeRpc:1}).terminal,false);
 assert.equal(browserTerminal({...input,activePhysical:1}).terminal,false);
 assert.equal(browserTerminal({...input,rpc:rpc.slice(0,10)}).terminal,false);
});
test('Real browser predicate accepts source-specific failed-core pause and complete recovery',async()=>{
 const {browserTerminal}=await import('./browser-runner.mjs');
 const expected=[{id:'core',innerMiles:0},{id:'outer',innerMiles:15}];
 const base={expected,activeRpc:0,activePhysical:0,idleMs:1500,interactionsDone:true};
 assert.equal(browserTerminal({...base,rpc:[{patchId:'core',end:1}],snapshot:{loading:false,progress:'Nearby coverage is incomplete · some areas could not be loaded',coverage:{complete:false,patches:[{id:'core',missingActivityTypes:['movies']}]}}}).outcome,'quiescent-partial');
 assert.equal(browserTerminal({...base,rpc:[{phase:'primary',end:1,whollyFailed:true},{patchId:'core',end:2},{patchId:'outer',end:3}],snapshot:{loading:false,progress:'Ready · background coverage checked',coverage:{complete:true,patches:expected.map(p=>({...p,missingActivityTypes:[]}))}}}).outcome,'complete');
});
test('Retained genuine serialized acquisition error is accepted only with aligned failed physical attempts',async()=>{
 const {decodeRPCEnvelope,recognizedAcquisitionFailure}=await import('./browser-runner.mjs');
 const {createRequire}=await import('node:module');
 const root=process.env.PFU_CANDIDATE_ROOT; assert.ok(root);
 const require=createRequire(path.join(root,'package.json'));
 const error=new Error('Overpass 504');
 const bytes=Buffer.from(JSON.stringify(await require('seroval').toCrossJSONAsync(error,{refs:new Map()})));
 const response={url:()=> 'http://fixture.invalid/_serverFn/test',status:()=>500,allHeaders:async()=>({'content-type':'application/json','x-tss-serialized':'true'})};
 const decoded=await decodeRPCEnvelope(root,response,bytes);
 assert.ok(decoded.error instanceof Error);
 const physical=[{attempt:1,outcome:'failure',metadata:{status:504}}];
 assert.equal(recognizedAcquisitionFailure(decoded,physical).message,'Overpass 504');
 assert.equal(recognizedAcquisitionFailure(decoded,[]),null);
 assert.equal(recognizedAcquisitionFailure(decoded,[{attempt:1,outcome:'success',metadata:{status:200}}]),null);
 assert.equal(recognizedAcquisitionFailure(decoded,[{attempt:1,outcome:'failure',metadata:{status:503}}]),null);
 assert.equal(recognizedAcquisitionFailure({error:new Error('unknown decoder failure')},physical),null);
 await assert.rejects(()=>decodeRPCEnvelope(root,response,Buffer.from('{"corrupt":')));
 const wrapped=Buffer.from(JSON.stringify(await require('seroval').toCrossJSONAsync({error},{refs:new Map()})));
 assert.equal(recognizedAcquisitionFailure(await decodeRPCEnvelope(root,response,wrapped),physical).message,'Overpass 504');
});
