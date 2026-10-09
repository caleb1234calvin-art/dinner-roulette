import assert from 'node:assert/strict';import test from 'node:test';
import {appModuleLoader} from '/tmp/hybrid-date-night-source/scripts/test-support/load-app-module.mjs';
import {discoveryClock} from '/tmp/hybrid-date-night-source/scripts/test-support/discovery-clock.mjs';
import {discoveryComponentHarness,discoveryModes,discoveryPayload} from '/tmp/hybrid-date-night-source/scripts/test-support/discovery-component-harness.mjs';
const {buildDateNightQueryPlan}=appModuleLoader()('src/lib/date-night/query-plan.ts');
for(const [label,overlay,prop] of [['Pick our date','ResultOverlay','restaurant'],['Give us options','OptionsOverlay','restaurants'],['Plan the night','DateNightPlanOverlay','plan']])test('open decision preserves alias discovery '+overlay,async t=>{
 discoveryClock(t);const h=discoveryComponentHarness(discoveryModes[1]);t.after(()=>h.dispose());h.store.spookySeasonEnabled=true;h.store.location={lat:43,lon:-79,label:'control',source:'manual'};h.store.setDateNightFilters({radiusMiles:20,activityTypes:['movies']});h.render();
 const v=id=>({...discoveryPayload(discoveryModes[1]).venues[0],lat:43,lon:-79,id,name:'Independent Alias Cinema'});
 const reply=(i,id)=>{const q=h.requests[i].args.data;h.requests[i].resolve({venues:[v(id)],source:'live',...(q.patchId?{patch:{id:q.patchId,version:'radial-v1'}}:{}),discovery:{partial:false,groups:buildDateNightQueryPlan(q.activityTypes,false).map(g=>({...g,outcome:'succeeded-nonempty'}))}})};
 reply(0,'date-night-osm-z');await h.settle();h.button(h.render(),label).props.onClick();
 const first=h.overlay(h.render(),overlay);assert.ok(first);const names=x=>[x.props[prop]].flat().map(v=>v.name);const before=names(first);
 reply(1,'date-night-osm-a');await h.settle();const after=h.overlay(h.render(),overlay);
 console.log(overlay,'AFTER',after?.props[prop]);assert.ok(after,'Audit duplicate must not dismiss an open decision');assert.deepEqual(names(after),before);
});
