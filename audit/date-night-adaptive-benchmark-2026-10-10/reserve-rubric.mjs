/** Fail-closed pre-reserve assessment. No I/O, network or policy mutation. */
export const percentile=(values,p)=>{const s=values.filter(Number.isFinite).sort((a,b)=>a-b);return s.length?s[Math.ceil(s.length*p)-1]:null;};
const median=values=>{const s=values.filter(Number.isFinite).sort((a,b)=>a-b);return s.length?s.length%2?s[(s.length-1)/2]:(s[s.length/2-1]+s[s.length/2])/2:null;};
export function inheritedWarmHold(row){
 const m=row.metrics, w=m?.warm, refs=m?.warmRefetchAttempts;
 return row.strategy==='D'&&row.radius===20&&row.radiusMiles===20&&row.activityTypes?.length===1&&row.activityTypes[0]==='movies'&&row.warmStatus==='hold-refetch-required'
  &&row.rpc?.some(r=>r.phase==='primary'&&r.whollyFailed===true&&r.physicalAttempts>0)
  &&m.recovery?.some(r=>r.classification==='failed'&&r.physicalAuditDispatched===true&&Number.isFinite(r.firstSuccessfulAuditMs))
  &&w?.length===2&&w[0].radius===20&&w[0].newRPCs===0&&w[0].noRefetch===true&&w[0].controlledBlock===false&&Number.isFinite(w[0].radiusToEligibleDOMMs)
  &&w[1].radius===15&&w[1].status==='hold-refetch-required'&&w[1].noRefetch===false&&w[1].controlledBlock===true&&w[1].physicalAttempts===0
  &&refs?.length===1&&refs[0].targetRadius===15&&refs[0].controlledBlock===true&&refs[0].serverDispatched===false&&refs[0].physicalAttempts===0&&refs[0].outcome==='controlled-block'&&refs[0].providerFailure===false;
}
export function warmEvidence(row){
 const expected=row.radius===50?[50,20,1,20,50]:[20,15,1,15,20],m=row.metrics;
 const full=row.warmStatus==='pass-zero-refetch'&&m?.warmRefetchAttempts?.length===0&&m.warm?.length===5&&m.warm.every((w,i)=>w.radius===expected[i]&&w.noRefetch===true&&w.newRPCs===0&&Number.isFinite(w.radiusToEligibleDOMMs));
 const inherited=inheritedWarmHold(row);
 return {accepted:full||inherited,status:full?'measured-zero-refetch':inherited?'inherited-failed-primary20-to15-HOLD':'unassessed-or-new-refetch',warmPass:full,inheritedHold:inherited,latencyImputed:false,values:full?m.warm.map(w=>w.radiusToEligibleDOMMs):[]};
}
export function recoveryComparisons(rows){
 const observations=[];
 for(const row of rows.filter(r=>r.strategy==='D'))for(const primary of row.rpc?.filter(r=>r.phase==='primary'&&r.whollyFailed===true&&r.physicalAttempts>0)??[]){
  const recovery=row.metrics?.recovery?.find(r=>r.primaryRpcId===primary.id),rendered=Object.values(recovery?.controls??{}).map(c=>c.renderedMs).filter(Number.isFinite),first=rendered.length?Math.min(...rendered):null;
  const matched=rows.filter(r=>r.stage==='main'&&r.strategy==='R'&&r.location===row.location&&r.radius===row.radius&&JSON.stringify([...new Set(r.activityTypes??[])].sort())===JSON.stringify([...new Set(row.activityTypes??[])].sort())),radialValues=matched.map(r=>r.metrics?.controls?.pick?.renderedMs),radial=median(radialValues),ratio=first!==null&&radial>0?first/radial:null;
  const within30s=Number.isFinite(recovery?.firstUsableFromFailureMs)&&recovery.firstUsableFromFailureMs<=30000;
  const comparison=matched.length===0?'no-matched-radial-observation':radialValues.every(Number.isFinite)&&ratio!==null?'matched-radial-first-usable-Pick':'matched-radial-missing-measurement';
  const passed=first!==null&&within30s&&(matched.length===0||comparison==='matched-radial-first-usable-Pick'&&ratio<=2);
  observations.push({caseId:row.caseId,primaryRpcId:primary.id,firstProviderBackedUsableMs:first,fromPrimaryFailureMs:recovery?.firstUsableFromFailureMs??null,radialFirstPickMedianMs:matched.length?radial:null,ratio:matched.length?ratio:null,comparison,bound:'recovery-usability-bound; not like-for-like control speed',matchedRadialCases:matched.map(r=>r.caseId),passed});
 }
 return {passed:observations.every(o=>o.passed),observed:observations.length>0,observations};
}
export function assessReserveRubric(rows,{historicalReplay,sourceD,sameIdentity,semanticEligible}={}){
 const main=rows.filter(r=>r.stage==='main'),gates=[],timings=[],costs=[],warm=[],recall=[];
 const gate=(name,pass,details)=>gates.push({name,pass:pass===true,details});
 gate('exact-reviewed-historical-replay',historicalReplay?.passed===true&&historicalReplay?.candidate===sourceD&&historicalReplay?.independentReview==='PASS'&&historicalReplay?.scope==='retained-payload-counterfactual-only'&&historicalReplay?.requiredCostThresholdsPassed===true&&historicalReplay?.sampledEligibleParity===true&&historicalReplay?.boundaryTradeoffsDisclosed===true);
 gate('eight-exact-main-cases',main.length===8&&main.every((r,i)=>r.position===i));
 if(main.length!==8||typeof sameIdentity!=='function'||typeof semanticEligible!=='function'){gate('assessment-inputs',false,'Missing exact-source canonical/eligibility evaluator or main rows');return {passed:false,gates,timings,costs,warm,recall};}
 const validOutput=main.every(r=>!r.integrityError&&!r.censored&&!r.censorReason&&['complete','adaptive-stopped'].includes(r.coldTerminal)&&r.metrics?.observerConfounded===false&&r.metrics?.driverSchedulingConfounded===false&&!r.metrics?.stabilityViolations?.length&&!r.metrics?.policyEvidence?.invalidControls?.length&&!r.metrics?.policyEvidence?.knownNegativeResurrections?.length&&r.metrics?.holdingWindows?.every(w=>!w.liveOverlap||w.identityStable===true));
 gate('main-valid-observations',validOutput);
 const semanticFailures=[];
 for(const r of main){for(const [control,c]of Object.entries(r.metrics?.controls??{})){if(c.identities?.length&&semanticEligible(r,c.identities,c.renderedMs).length!==c.identities.length)semanticFailures.push({caseId:r.caseId,control});}for(const negative of r.rpc?.flatMap(p=>p.acquisition?.venues??[]).filter(v=>v.lifecycle)??[])if(r.finalState?.eligiblePool?.some(v=>sameIdentity(v,negative)))semanticFailures.push({caseId:r.caseId,reason:'observed-negative-visible'});}
 gate('semantic-and-observed-negative-safety',semanticFailures.length===0,semanticFailures);
 let benefit=false,timingValid=true;
 for(const [block,di,ri]of [['KansasCity20',[0],[1]],['Joplin50',[3,4],[2,5]]]){
  const ds=di.map(i=>main[i]),rs=ri.map(i=>main[i]);
  for(const control of ['pick','options',...(block==='KansasCity20'?['plan']:[])]){
   const value=r=>{const c=control==='options'?(r.metrics?.controls?.optionsFour?.fullFour?r.metrics.controls.optionsFour:r.metrics?.controls?.options):r.metrics?.controls?.[control];return control==='pick'?c?.renderedMs:control==='plan'&&c?.semanticPair!==true?null:control==='options'&&(block==='Joplin50'||Number.isFinite(r.metrics?.firstFourEligibleMs)||r.finalState?.eligiblePool?.length>=4)&&c?.fullFour!==true?null:c?.clickToRenderMs;};
   const dv=ds.map(value),rv=rs.map(value),d=median(dv),r=median(rv),assessed=dv.every(Number.isFinite)&&rv.every(Number.isFinite)&&r>0;
   const regression=assessed&&d-r>500&&d/r>1.2,improvement=assessed&&r-d>=500&&d/r<=0.8;
   timings.push({block,control,metric:control==='pick'?'navigation-to-first-render':'actual-click-to-correct-render',adaptive:d,radial:r,assessed,materialRegression:regression,materialImprovement:improvement});timingValid&&=assessed&&!regression;benefit||=improvement;
  }
  const pools=[...ds,...rs].map(r=>r.finalState?.eligiblePool);let equal=pools.every(Array.isArray)&&pools.every(p=>p.length===pools[0].length);
  if(equal)for(const pool of pools.slice(1)){const used=new Set();for(const v of pools[0]){const matches=pool.map((p,i)=>sameIdentity(p,v)?i:-1).filter(i=>i>=0);if(matches.length!==1||used.has(matches[0])){equal=false;break;}used.add(matches[0]);}}
  recall.push({block,canonicalEligibleParity:equal,counts:pools.map(p=>p?.length??null)});
  const dw=ds.flatMap(r=>warmEvidence(r).values),rw=rs.flatMap(r=>warmEvidence(r).values);const dp=percentile(dw,.95),rp=percentile(rw,.95);warm.push({block,adaptiveP95:dp,radialP95:rp,assessed:dp!==null&&rp!==null,pass:dp!==null&&rp!==null&&dp<=100&&dp-rp<=50});
 }
 const recovery=recoveryComparisons(rows);gate('observed-natural-recovery-speed',recovery.passed,recovery);
 gate('paired-control-no-material-regression',timingValid,timings);gate('actual-material-user-benefit',benefit,timings);gate('paired-canonical-eligible-parity',recall.every(r=>r.canonicalEligibleParity),recall);
 const primarySucceeded=r=>{const receipts=r.rpc?.filter(p=>r.strategy==='D'?p.phase==='primary':p.phase==='radial-primary')??[];return receipts.length>0&&receipts.every(p=>p.groups?.length>0&&p.groups.every(g=>['succeeded-empty','succeeded-nonempty','cache-hit'].includes(g.outcome)));};
 let dStarts=0,rStarts=0,costAssessed=true,matchedPairs=0;
 for(const [di,ri]of [[0,1],[3,2],[4,5]]){const d=main[di],r=main[ri];if(!primarySucceeded(d)||!primarySucceeded(r)){costs.push({adaptive:d.caseId,radial:r.caseId,stratum:'excluded-failed-primary; all-outcome costs retained'});continue;}const a=d.physicalSummary,b=r.physicalSummary,assessed=[a?.starts,b?.starts,a?.knownBodyBytes,b?.knownBodyBytes].every(Number.isFinite)&&b.starts>0&&b.knownBodyBytes>0;costAssessed&&=assessed;if(assessed){matchedPairs++;dStarts+=a.starts;rStarts+=b.starts;}costs.push({adaptive:d.caseId,radial:r.caseId,stratum:'paired-completed-success',assessed,adaptiveStarts:a?.starts,radialStarts:b?.starts,knownBodyRatio:assessed?a.knownBodyBytes/b.knownBodyBytes:null,unknownBodyAttempts:{adaptive:a?.unknownBodyAttempts,radial:b?.unknownBodyAttempts}});}
 gate('paired-physical-and-known-body-cost',costAssessed&&matchedPairs>0&&dStarts<=rStarts&&costs.filter(c=>c.assessed).every(c=>c.knownBodyRatio<=1.5),{matchedPairs,adaptiveStarts:dStarts,radialStarts:rStarts,costs,allOutcome:main.map(r=>({caseId:r.caseId,...r.physicalSummary}))});
 const warmth=main.map(r=>({caseId:r.caseId,...warmEvidence(r)})),allD=main.filter(r=>r.strategy==='D').flatMap(r=>warmEvidence(r).values),allDp95=percentile(allD,.95);
 gate('warm-observation-boundary',warmth.every(w=>w.accepted)&&allDp95!==null&&allDp95<=100&&warm.every(w=>w.pass),{allAdaptiveP95:allDp95,paired:warm,cases:warmth});
 return {passed:gates.every(g=>g.pass),gates,timings,costs,warm,recall,recovery};
}
