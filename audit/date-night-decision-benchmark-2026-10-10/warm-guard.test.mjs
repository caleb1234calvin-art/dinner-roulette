import test from 'node:test';
import assert from 'node:assert/strict';
import { routeBenchmarkRequest } from './browser-runner.mjs';
import { readFileSync } from 'node:fs';
const origin='http://127.0.0.1:8087';
function fixture({acquisition=true,external=false}={}) {
 const events=[];
 const request={url:()=>external?'https://external.invalid/image':`${origin}/_serverFn/shared`,headers:()=>({'x-tsr-serverfn':'true'}),postData:()=>acquisition?'"activityTypes":["movies"]':'"session":true'};
 return {events,route:{request:()=>request,abort:async reason=>events.push(`abort:${reason}`),continue:async()=>events.push('server-dispatch')}};
}
test('Cold acquisitions preserve exact server dispatch; warm attempted refetch is logged then blocked first',async()=>{
 const cold=fixture();await routeBenchmarkRequest(cold.route,{origin,postColdGuard:false,onWarmRefetch:()=>cold.events.push('refetch')});
 assert.deepEqual(cold.events,['server-dispatch']);
 const warm=fixture();await routeBenchmarkRequest(warm.route,{origin,postColdGuard:true,onWarmRefetch:()=>warm.events.push('refetch-required')});
 assert.deepEqual(warm.events,['refetch-required','abort:blockedbyclient']);
 assert.ok(!warm.events.includes('server-dispatch'));
});
test('Warm guard preserves unrelated local auth reads and continues blocking external assets',async()=>{
 const auth=fixture({acquisition:false});await routeBenchmarkRequest(auth.route,{origin,postColdGuard:true,onWarmRefetch:()=>auth.events.push('refetch')});assert.deepEqual(auth.events,['server-dispatch']);
 const external=fixture({external:true});await routeBenchmarkRequest(external.route,{origin,postColdGuard:true,onWarmRefetch:()=>external.events.push('refetch')});assert.deepEqual(external.events,['abort:blockedbyclient']);
});
test('Runtime preserves independent cold outcome and never treats controlled warm abort as provider handler failure',()=>{
 const source=readFileSync(new URL('./browser-runner.mjs',import.meta.url),'utf8');
 assert.ok(source.includes('coldTerminal = terminal; postColdGuard = true;'));
 assert.ok(source.includes("warmStatus = 'hold-refetch-required'"));
 const warmSettle=source.slice(source.indexOf('      const warm = warmRequests.get(request);'),source.indexOf('      const record = request.__benchRecord;'));
 assert.ok(warmSettle.includes("emit('warm-rpc-settle'"));assert.ok(warmSettle.includes('return;'));assert.ok(!warmSettle.includes('ledger.handler'));
 assert.ok(!source.includes("ledger.stop('unexpected-warm-network')"));
});
test('Controlled warm ERR_BLOCKED_BY_CLIENT preserves physical and cross-case handler failure streaks',async()=>{
 const {createLedger}=await import('./request-ledger.mjs');
 const {settleControlledWarmObservation}=await import('./browser-runner.mjs');
 const {mkdtempSync,rmSync}=await import('node:fs');const {tmpdir}=await import('node:os');const {join}=await import('node:path');
 const dir=mkdtempSync(join(tmpdir(),'warm-guard-ledger-'));
 const ledger=createLedger(join(dir,'ledger.jsonl'),{now:()=>1000});
 try {
  const id=ledger.reserve({caseId:'preceding-cold'});ledger.finish(id,'failure',{caseId:'preceding-cold'});
  ledger.handler({caseId:'preceding-cold',whollyFailed:true,successfulProviderGroup:false});
  const before=ledger.snapshot();
  // Simulate request event before route callback: the warm request already has its separate record.
  const record={id:'warm-attempt-1',controlledBlock:false,serverDispatched:false};
  const warm=fixture();
  await routeBenchmarkRequest(warm.route,{origin,postColdGuard:true,onWarmRefetch:()=>{record.controlledBlock=true;}});
  const settled=settleControlledWarmObservation(record,{end:2000,failure:'net::ERR_BLOCKED_BY_CLIENT',timing:{startTime:1500,responseEnd:-1}});
  assert.equal(settled.outcome,'controlled-block');assert.equal(settled.providerFailure,false);assert.equal(settled.physicalAttempts,0);
  assert.deepEqual(ledger.snapshot(),before);
  assert.equal(ledger.snapshot().physicalFailures,1);assert.equal(ledger.snapshot().handlerFailures,1);
 } finally {ledger.dispose();rmSync(dir,{recursive:true,force:true});}
});
