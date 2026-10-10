import {readFileSync,writeFileSync} from 'node:fs';import {resolve} from 'node:path';import {pathToFileURL} from 'node:url';
export function preflightVerdict(progress,browsers){
 const errors=[],expected=['complete','adaptive-stopped','quiescent-partial','complete','complete','adaptive-stopped','adaptive-stopped'];
 if(progress.rows.length!==7||browsers.length!==7)errors.push('All seven targeted fixture cases must exist');
 if(progress.ledger.stopped||progress.ledger.pending.length)errors.push('Unexpected global stop or unsettled physical attempt');
 for(let i=0;i<browsers.length;i++){
  const b=browsers[i],m=b.metrics??{},name=b.caseId??String(i);const check=(ok,label)=>{if(!ok)errors.push(`${name}: ${label}`);};
  check(b.coldTerminal===expected[i]&&b.terminal===expected[i],'Wrong cold terminal');
  check(Number.isFinite(m.controls?.pick?.renderedMs)&&m.controls.pick.identities?.length===1,'Actual valid Pick not observed');
  if(i!==4)check(Number.isFinite(m.controls?.optionsFour?.renderedMs)&&m.controls.optionsFour.fullFour,'Four actual Options not observed');
  if(i===5)check(m.controls?.plan?.semanticPair===true&&m.controls.plan.identities?.length===2,'Genuine semantic mixed Plan not observed');
  else check(m.controls?.plan?.truthfulNoPair===true&&Number.isFinite(m.controls.plan.noPairUXMs),'Truthful no-pair Plan not observed');
  check(m.observerCosts?.cold&&m.observerConfounded===false,'Observer cost missing or confounded');
  check(m.driverSchedulingConfounded===false&&Number.isFinite(m.controls?.pick?.clickAttemptBrowserMs),'Driver scheduling missing or confounded');
  check(b.rpc.every(r=>Number.isFinite(r.startBrowserMs)&&Number.isFinite(r.responseEndBrowserMs)),'Exact RPC timing missing');
  check(Number.isFinite(m.firstVisibleVenueMs)&&Number.isFinite(m.firstUsefulLiveEligibleMs),'Visible/provider eligible timing missing');
  if(i===0||i===1){check(b.warmStatus==='pass-zero-refetch','Successful acquisition warm reuse failed');check(m.warm.length===5&&m.warm.every(w=>Number.isFinite(w.radiusToEligibleDOMMs)&&w.newRPCs===0),'Warm target timings missing or refetched');}
  check(!m.stabilityViolations?.length,'Observed overlay identity changed');
  check(!m.holdingWindows?.some(w=>w.liveOverlap&&w.identityStable!==true),'Observed control overlap lacked verified ordered identity stability');
  check(!m.policyEvidence?.knownNegativeResurrections?.length,'Observed lifecycle negative resurrected');
  check(!m.policyEvidence?.invalidControls?.length,'Source semantic eligibility rejected a control');
  if(i===1||i===5||i===6)check(m.mechanisms?.healthy===true,'Healthy defer/spacing/zero-yield-stop not demonstrated');
  if(i===4)check(m.mechanisms?.thin===true,'Thin immediate audit not demonstrated');
  if(i===2)check(b.warmStatus==='skipped','Partial authority must not claim warm cache pass');
  if(i===3){check(b.warmStatus==='hold-refetch-required','Known failed-primary warm refetch was hidden');check(m.warmRefetchAttempts?.length>=1&&m.warmRefetchAttempts.every(r=>r.controlledBlock===true&&r.serverDispatched===false),'Warm refetch not blocked before server dispatch');check(Number.isFinite(m.firstAuditRecoveryEligibleMs),'Failed primary recovery timing missing');check(m.recovery?.some(r=>r.classification==='failed'&&r.physicalAuditDispatched&&Number.isFinite(r.firstSuccessfulAuditMs)),'Physical recovery stages missing');check(m.mechanisms?.naturalRecovery===false,'Synthetic recovery mislabeled natural live evidence');}
  if(i===6){check(m.controls.options.eligibleCountAtClick<4&&m.controls.optionsFour.eligibleCountAtClick>=4&&m.controls.optionsFour.clickMs>m.controls.options.clickMs,'Early short Options followed by real four reclick missing');check(m.holdingWindows?.some(w=>w.control==='options'&&w.liveOverlap),'Options settlement overlap missing');}
  if(i===5)check(m.holdingWindows?.some(w=>w.control==='plan'&&w.liveOverlap),'Plan settlement overlap missing');
 }
 checkZero: {if(progress.mode!=='fixture')errors.push('Fixture verdict cannot authorize live evidence');}
 return {passed:errors.length===0,publicProviderCalls:0,cases:browsers.length,errors};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){const output=resolve(process.argv[2]),progress=JSON.parse(readFileSync(`${output}/progress.json`));const browsers=progress.rows.map(r=>JSON.parse(readFileSync(`${output}/${r.caseId}/browser-result.json`)));const verdict=preflightVerdict(progress,browsers);writeFileSync(`${output}/preflight-verdict.json`,JSON.stringify(verdict,null,2));console.log(JSON.stringify(verdict));if(!verdict.passed)process.exitCode=1;}
