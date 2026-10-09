import assert from 'node:assert/strict';
import test from 'node:test';
import {appModuleLoader} from '/tmp/hybrid-date-night-source/scripts/test-support/load-app-module.mjs';
import {discoveryClock,deferred,flush,untilAbort} from '/tmp/hybrid-date-night-source/scripts/test-support/discovery-clock.mjs';
const load=appModuleLoader();
const {createDateNightDiscoveryCache}=load('src/lib/date-night/cache.ts');
const {createDateNightHybridSession}=load('src/lib/date-night/hybrid-session.ts');
const {buildDateNightQueryPlan}=load('src/lib/date-night/query-plan.ts');
const q={lat:43,lon:-79,radiusMiles:50,halloweenActive:true,activityTypes:['movies']};
const v=(id, extra={})=>({id,name:id,lat:43,lon:-79,source:'osm',activityTypes:['movies'],address:'A',openingHours:null,...extra});
const response=(q,venues)=>({venues,source:'live',...(q.patchId?{patch:{id:q.patchId,version:'radial-v1'}}:{}),discovery:{partial:false,groups:buildDateNightQueryPlan(q.activityTypes,q.halloweenActive).map(g=>({...g,outcome:venues.length?'succeeded-nonempty':'succeeded-empty'}))}});
for(const patchId of [undefined,'radial-v1:core']) test('all parallel active hedges cancel '+patchId, async t=>{
 const clock=discoveryClock(t), controller=new AbortController(),signals=[];t.mock.method(console,'warn',()=>{});
 const {searchDateNight}=appModuleLoader({requestSignal:controller.signal})('src/lib/date-night/search.ts');
 t.mock.method(globalThis,'fetch',(_u,{signal})=>{signals.push(signal);return untilAbort(signal)});
 const pending=assert.rejects(searchDateNight({data:{lat:q.lat,lon:q.lon,radiusMiles:q.radiusMiles,activityTypes:['movies','museum','park'],spookySeasonEnabled:true,patchId}}),{name:'AbortError'});
 await clock.tick(3200); assert.ok(signals.length>=6);controller.abort();await pending; assert.ok(signals.every(s=>s.aborted));const n=signals.length; await clock.tick(30000);assert.equal(signals.length,n);assert.equal(clock.pending,0);
});
for (const cap of [1,20000]) test('audit negative retained when response exceeds cache capacity '+cap, async t=>{
 discoveryClock(t);const calls=[],states=[];const session=createDateNightHybridSession({cache:createDateNightDiscoveryCache({maxVenues:cap})});t.after(()=>session.dispose());
 session.update(q,{request(query,signal){const d=deferred();calls.push({query,signal,...d});return d.promise},onChange:s=>states.push(s)});
 calls[0].resolve(response(calls[0].query,[v('movie')]));await flush();
 calls[1].resolve(response(calls[1].query,[v('movie',{lifecycle:'permanently-closed'}),...Array.from({length:cap},(_,i)=>v('other-'+i))]));await flush();
 const found=states.at(-1).response.venues.find(x=>x.id==='movie');
 console.log('CAP_REJECTION_STATE',JSON.stringify({phase:states.at(-1).phase,venues:states.at(-1).response.venues}));
 assert.ok(!found||found.lifecycle==='permanently-closed','Observed closure must suppress the older primary positive even if positive cache admission is rejected');
});
