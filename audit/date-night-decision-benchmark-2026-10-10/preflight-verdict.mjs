import {readFileSync,writeFileSync} from 'node:fs';import {resolve} from 'node:path';import {pathToFileURL} from 'node:url';
export function preflightVerdict(progress,browsers){
 const errors=[],expected=['complete','complete','quiescent-partial','complete'];
 if(progress.rows.length!==4||browsers.length!==4)errors.push('All four fixture cases must exist');
 if(progress.ledger.stopped||progress.ledger.pending.length)errors.push('Unexpected global stop or unsettled physical attempt');
 for(let i=0;i<browsers.length;i++){
  const b=browsers[i],m=b.metrics??{},name=b.caseId??String(i);const check=(ok,label)=>{if(!ok)errors.push(`${name}: ${label}`);};
  check(b.coldTerminal===expected[i]&&b.terminal===expected[i],'Wrong cold terminal');
  check(Number.isFinite(m.controls?.pick?.renderedMs)&&m.controls.pick.identities?.length===1,'Actual valid Pick not observed');
  check(Number.isFinite(m.controls?.options?.renderedMs)&&m.controls.options.uniqueCount===4&&m.controls.options.fullFour,'Four actual Options not observed');
  check(m.controls?.plan?.truthfulNoPair===true&&Number.isFinite(m.controls.plan.noPairUXMs),'Truthful no-pair Plan not observed');
  check(m.observerCosts?.cold&&m.observerConfounded===false,'Observer cost missing or confounded');
  check(m.driverSchedulingConfounded===false&&Number.isFinite(m.controls?.pick?.clickAttemptBrowserMs),'Driver scheduling missing or confounded');
  check(b.rpc.every(r=>Number.isFinite(r.startBrowserMs)&&Number.isFinite(r.responseEndBrowserMs)),'Exact RPC timing missing');
  check(Number.isFinite(m.firstVisibleVenueMs)&&Number.isFinite(m.firstUsefulLiveEligibleMs),'Visible/live eligible timing missing');
  if(i===0||i===1){check(b.warmStatus==='pass-zero-refetch','Successful acquisition warm reuse failed');check(m.warm.length===5&&m.warm.every(w=>Number.isFinite(w.radiusToEligibleDOMMs)&&w.newRPCs===0),'Warm target timings missing or refetched');}
  if(i===2)check(b.warmStatus==='skipped','Partial authority must not claim warm cache pass');
  if(i===3){check(Number.isFinite(m.firstAuditRecoveryEligibleMs),'Failed primary recovery timing missing');check(b.warmStatus==='hold-refetch-required','Known failed-primary warm refetch was hidden');check(m.warmRefetchAttempts?.length>=1&&m.warmRefetchAttempts.every(r=>r.controlledBlock===true&&r.serverDispatched===false),'Warm refetch not blocked before server dispatch');}
 }
 return {passed:errors.length===0,publicProviderCalls:0,cases:browsers.length,errors};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){const output=resolve(process.argv[2]),progress=JSON.parse(readFileSync(`${output}/progress.json`));const browsers=progress.rows.map(r=>JSON.parse(readFileSync(`${output}/${r.caseId}/browser-result.json`)));const verdict=preflightVerdict(progress,browsers);writeFileSync(`${output}/preflight-verdict.json`,JSON.stringify(verdict,null,2));console.log(JSON.stringify(verdict));if(!verdict.passed)process.exitCode=1;}
