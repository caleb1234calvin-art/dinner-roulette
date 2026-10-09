import {mock} from 'node:test';
import {writeFileSync} from 'node:fs';
import {appModuleLoader} from '/tmp/track-f-source/scripts/test-support/load-app-module.mjs';
import {discoveryClock,untilAbort} from '/tmp/track-f-source/scripts/test-support/discovery-clock.mjs';
process.chdir('/tmp/track-f-source');const rows=[];
for(const patched of [true,false]){
 const clock=discoveryClock({mock}),controller=new AbortController(),calls=[];mock.method(console,'warn',()=>{});
 mock.method(globalThis,'fetch',async(_url,{signal})=>{const row={start:clock.now};calls.push(row);signal.addEventListener('abort',()=>row.abortAt=clock.now,{once:true});return untilAbort(signal);});
 const {searchDateNight}=appModuleLoader({requestSignal:controller.signal})('src/lib/date-night/search.ts');let result;
 const pending=searchDateNight({data:{lat:38.9517,lon:-92.3341,radiusMiles:50,spookySeasonEnabled:true,activityTypes:['movies'],...(patched?{patchId:'radial-v1:core'}:{})}}).then(r=>{result={source:r.source,at:clock.now}},e=>{result={error:e.name,at:clock.now}});
 await clock.tick(100);controller.abort();await clock.tick(20000);await pending;rows.push({patched,cancelAt:100,calls,result});mock.restoreAll();
}
writeFileSync('/workspace/scratch/a0ea701c7b34/track-f-radial-audit/cancellation-results.json',JSON.stringify({kind:'deterministic stalled-provider fixture, no actual provider traffic',rows},null,2));console.log(JSON.stringify(rows));
