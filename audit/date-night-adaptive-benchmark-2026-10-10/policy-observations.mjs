/** Read-only reconstruction from actual RPC receipts and committed eligible DOM snapshots.
 * Never calls a controller or dispatches a provider request. */
export function policyObservations({job,rpc,metrics,finalState,policy,semanticEligible,pairCompatible,fixture=false}) {
 const primary=rpc.find(r=>r.phase==='primary'),audits=rpc.filter(r=>r.phase==='audit'&&r.end).sort((a,b)=>a.start-b.start);
 const snapAfter=(end,next=Infinity)=>metrics.snapshots.filter(s=>s.browserMs>=end&&s.browserMs<next&&Array.isArray(s.eligiblePool)).at(-1);
 const beforeAudit=metrics.snapshots.filter(s=>s.browserMs<(audits[0]?.startBrowserMs??Infinity)&&s.browserMs>=(primary?.responseEndBrowserMs??0)&&Array.isArray(s.eligiblePool)).at(-1);
 const primaryFailed=primary?policy.dateNightPrimaryFailed(primary.acquisition??null,job.activityTypes,true):null;
 const rawSeen=new Set();for(const v of primary?.acquisition?.venues??[])policy.rememberDateNightUsefulIdentities([v],rawSeen);
 const seen=new Set();const additions=places=>policy.rememberDateNightUsefulIdentities(places??[],seen);
 additions(beforeAudit?.eligiblePool);let mode=primaryFailed?'recovery':beforeAudit&&policy.dateNightHealthyPool(beforeAudit.eligiblePool,job.activityTypes,true)?'healthy':'thin';
 const initialMode=mode;let zeros=0;const patches=[];
 for(let i=0;i<audits.length;i++){
  const r=audits[i],s=snapAfter(r.responseEndBrowserMs,audits[i+1]?.startBrowserMs);const pool=s?.eligiblePool;
  const nextMode=primaryFailed?'recovery':pool&&policy.dateNightHealthyPool(pool,job.activityTypes,true)?'healthy':'thin';
  const newlyEligible=pool?additions(pool):null;const fullySuccessful=r.groups?.length>0&&r.groups.every(g=>['succeeded-empty','succeeded-nonempty','cache-hit'].includes(g.outcome));
  zeros=fullySuccessful&&mode==='healthy'&&nextMode==='healthy'&&newlyEligible===0?zeros+1:0;
  const rawVenues=r.acquisition?.venues??[];const rawNewIdentities=policy.rememberDateNightUsefulIdentities(rawVenues,rawSeen);
  patches.push({rawNewIdentities,rawDuplicateRows:rawVenues.length-rawNewIdentities,rpcId:r.id,patchId:r.patchId,startBrowserMs:r.startBrowserMs,settledBrowserMs:r.responseEndBrowserMs,modeBefore:mode,modeAfter:nextMode,fullySuccessful,eligibleObservationMs:s?.browserMs??null,newlyEligible,zeroYieldPatches:zeros,eligibleIds:pool?.map(v=>v.id)??null,categoryYield:pool?Object.fromEntries(job.activityTypes.map(t=>[t,pool.filter(v=>v.activityTypes.includes(t)).map(v=>v.id)])):null,rawRows:r.acquisition?.venues.length??null,observedNegatives:r.acquisition?.venues.filter(v=>v.lifecycle)??[]});mode=nextMode;
 }
 const deferMs=Number.isFinite(audits[0]?.startBrowserMs)&&Number.isFinite(primary?.responseEndBrowserMs)?audits[0].startBrowserMs-primary.responseEndBrowserMs:null;
 const healthySpacing=patches.slice(1).filter((p,i)=>patches[i].modeAfter==='healthy').map((p,i)=>({rpcId:p.rpcId,spacingSincePreviousSettlementMs:p.startBrowserMs-patches[patches.indexOf(p)-1].settledBrowserMs}));
 const sourceStopped=['audit-stopped','empty-audit-stopped'].includes(finalState?.phase);
 const truthfulStop=sourceStopped&&finalState.coverage?.complete===false&&zeros>=4&&patches.slice(-4).every(p=>p.fullySuccessful&&p.newlyEligible===0);
 const healthy=initialMode==='healthy'&&deferMs>=2000&&healthySpacing.every(p=>p.spacingSincePreviousSettlementMs>=2000)&&truthfulStop;
 const thin=initialMode==='thin'&&primaryFailed===false&&deferMs!==null&&deferMs<2000&&(!sourceStopped||truthfulStop&&patches.some(p=>p.modeBefore==='thin'&&p.modeAfter==='healthy'));
 const aliases=v=>[v.id,...(v.discoveryEvidence?.map(e=>e.id)??[])];
 const observedNegatives=rpc.flatMap(r=>(r.acquisition?.venues??[]).filter(v=>v.lifecycle).map(venue=>({rpcId:r.id,settledBrowserMs:r.responseEndBrowserMs,venue})));
 const knownNegativeResurrections=observedNegatives.flatMap(n=>(finalState?.eligiblePool??[]).filter(v=>aliases(v).some(id=>aliases(n.venue).includes(id))).map(venue=>({negative:n,visible:venue})));
 const invalidControls=[];
 for(const [name,c] of Object.entries(metrics.controls)){if(!c.identities)continue;const eligible=semanticEligible(c.identities,c.renderedMs);if(eligible.length!==c.identities.length)invalidControls.push(name);if(name==='plan'){c.semanticPair=eligible.length===2&&pairCompatible(eligible);if(!c.semanticPair)invalidControls.push(name);}}
 const recoveryRows=rpc.filter(r=>r.phase==='primary'&&(r.whollyFailed||policy.dateNightPrimaryFailed(r.acquisition??null,job.activityTypes,true))).map(r=>{
  const successfulAudit=audits.find(a=>a.success&&a.startBrowserMs>=r.responseEndBrowserMs);
  const recoveredControls=Object.fromEntries(Object.entries(metrics.controls).filter(([name,c])=>Number.isFinite(c.renderedMs)&&c.renderedMs>=r.responseEndBrowserMs&&c.identities?.length>0&&semanticEligible(c.identities,c.renderedMs).length===c.identities.length&&(name!=='plan'||pairCompatible(c.identities))&&c.identities.some(v=>audits.some(audit=>audit.success&&audit.physicalAttempts>0&&audit.responseEndBrowserMs<=c.renderedMs&&audit.acquisition?.venues.some(a=>a.id===v.id||a.discoveryEvidence?.some(e=>e.id===v.id)||v.discoveryEvidence?.some(e=>e.id===a.id))))).map(([name,c])=>[name,{renderedMs:c.renderedMs,fromPrimaryFailureMs:c.renderedMs-r.responseEndBrowserMs,identities:c.identities}]));
  const firstActual=Math.min(...Object.values(recoveredControls).map(c=>c.renderedMs));
  return {primaryRpcId:r.id,classification:r.whollyFailed?'failed':'partial',failureSettledBrowserMs:r.responseEndBrowserMs,physicalAuditDispatched:audits.some(a=>a.physicalAttempts>0),firstSuccessfulAuditMs:successfulAudit?.responseEndBrowserMs??null,firstLiveEligibleMs:metrics.firstAuditRecoveryEligibleMs,controls:recoveredControls,firstUsableFromFailureMs:Number.isFinite(firstActual)?firstActual-r.responseEndBrowserMs:null,qualifiedNaturalRecovery:!fixture&&!knownNegativeResurrections.length&&!invalidControls.length&&!metrics.stabilityViolations?.length&&metrics.observerConfounded===false&&metrics.driverSchedulingConfounded===false&&r.whollyFailed&&r.physicalAttempts>0&&successfulAudit?.physicalAttempts>0&&Boolean(successfulAudit)&&Number.isFinite(firstActual)&&firstActual-r.responseEndBrowserMs<=30000};
 });

 return {policyEvidence:{reconstruction:true,primaryFailed,initialMode,deferMs,healthySpacing,patches,sourceStopped,truthfulStop,observedNegatives,knownNegativeResurrections,coverageHoles:finalState?.coverage?.patches?.filter(p=>p.missingActivityTypes?.length)??[],invalidControls},recovery:recoveryRows,mechanisms:{healthy,thin,naturalRecovery:recoveryRows.some(r=>r.qualifiedNaturalRecovery)}};
}
