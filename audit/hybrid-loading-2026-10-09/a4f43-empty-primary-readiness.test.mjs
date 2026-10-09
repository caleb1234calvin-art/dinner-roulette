import assert from 'node:assert/strict';import test from 'node:test';
import {discoveryClock} from '/tmp/hybrid-independent-a4/scripts/test-support/discovery-clock.mjs';
import {discoveryComponentHarness,discoveryModes,textOf} from '/tmp/hybrid-independent-a4/scripts/test-support/discovery-component-harness.mjs';
test('failed primary without eligible places does not label controls Ready',async t=>{
 discoveryClock(t);t.mock.method(console,'warn',()=>{});const h=discoveryComponentHarness(discoveryModes[1]);t.after(()=>h.dispose());h.store.location={lat:43,lon:-79,label:'control',source:'manual'};h.store.setDateNightFilters({radiusMiles:50,activityTypes:['movies']});h.render();h.requests[0].reject(new Error('Primary provider unavailable'));await h.settle();const tree=h.render();const button=h.button(tree,'Pick our date');assert.equal(button.props.disabled,true);console.log('READY_TEXT',textOf(tree));assert.doesNotMatch(textOf(tree),/Ready ·/,'Ready must denote usable controls, not empty primary failure settlement');
});
