import test from 'node:test';
import assert from 'node:assert/strict';
import { createObserverCostAccumulator } from './browser-runner.mjs';
import { readFileSync } from 'node:fs';
test('Observer cost counters are bounded and record exact count/total/max with conservative p95',()=>{
 const costs=createObserverCostAccumulator();
 assert.equal(costs.snapshot().count,0); assert.equal(costs.snapshot().p95UpperBoundMs,null);
 for(let i=0;i<10000;i++) costs.add(1.01);
 const s=costs.snapshot();
 assert.equal(s.count,10000); assert.ok(Math.abs(s.totalMs-10100)<1e-6);
 assert.equal(s.maxMs,1.01); assert.equal(s.p95UpperBoundMs,1.1);
 assert.equal(s.storageBinCount,502); assert.equal(s.confounded,false);
 costs.add(NaN);costs.add(-1);assert.equal(costs.snapshot().count,10000);
});
test('Predeclared confounding boundary is p95 >10ms or any maximum >=50ms',()=>{
 const edge=createObserverCostAccumulator(); for(let i=0;i<100;i++)edge.add(10);
 assert.equal(edge.snapshot().confounded,false);
 const p95=createObserverCostAccumulator(); for(let i=0;i<100;i++)p95.add(10.01);
 assert.equal(p95.snapshot().confounded,true);
 const spike=createObserverCostAccumulator();for(let i=0;i<100;i++)spike.add(1);spike.add(50);
 assert.equal(spike.snapshot().p95UpperBoundMs,1);assert.equal(spike.snapshot().confounded,true);
 const overflow=createObserverCostAccumulator();overflow.add(1234);assert.equal(overflow.snapshot().maxMs,1234);assert.equal(overflow.snapshot().confounded,true);
});
test('Same serialized helper runs without module closure, cost counters stay outside snapshot signature',()=>{
 const injected=Function(`return (${createObserverCostAccumulator.toString()});`)();
 const costs=injected();costs.add(2.5);assert.equal(costs.snapshot().totalMs,2.5);
 const source=readFileSync(new URL('./browser-runner.mjs',import.meta.url),'utf8');
 const content=source.slice(source.indexOf('  function readDOM()'),source.indexOf('  function capture()'));
 assert.ok(!content.includes('recordCost'));assert.ok(!content.includes('observerCosts'));
 assert.ok(source.includes('const signature = JSON.stringify({ ...snapshot, browserMs: 0 });'));
 assert.ok(source.includes("recordCost('readCPU', performance.now() - started)"));
 assert.ok(source.includes("recordCost('synchronousScanAndEmitDispatch', performance.now() - started)"));
});
