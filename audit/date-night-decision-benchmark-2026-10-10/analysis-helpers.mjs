export function classifyPrimary(rpc) {
 const primary=rpc.filter(r=>r.phase==='primary');
 const complete=primary.length>0&&primary.every(r=>r.acquisition?.discovery?.groups?.length>0&&r.acquisition.discovery.groups.every(g=>['succeeded-empty','succeeded-nonempty'].includes(g.outcome)));
 return {primary,complete,stratum:complete?'successful-primary marginal yield':primary.length?'failed-or-partial-primary recovery':'radial baseline'};
}
export function visibleAuditEvidence({primary,audit,snapshots,finalVisible,rawPrimaryEligible,merge}) {
 const same=(a,b)=>merge([a],[b]).length===1;
 const auditEnds=audit.map(r=>r.responseEndBrowserMs).filter(Number.isFinite),primaryEnds=primary.map(r=>r.responseEndBrowserMs).filter(Number.isFinite);
 const firstAudit=auditEnds.length?Math.min(...auditEnds):Infinity,primaryEnd=primaryEnds.length?Math.min(...primaryEnds):Infinity;
 const observed=snapshots.filter(s=>Number.isFinite(s.browserMs)&&s.browserMs>=primaryEnd&&s.browserMs<firstAudit&&Array.isArray(s.eligiblePool)).at(-1);
 const baseline=observed?.eligiblePool??rawPrimaryEligible;
 const additional=v=>!baseline.some(p=>same(p,v));
 const received=(v,t)=>audit.some(r=>Number.isFinite(r.responseEndBrowserMs)&&r.responseEndBrowserMs<=t&&r.acquisition?.venues?.some(p=>same(p,v)));
 const finalAdditions=finalVisible?.filter(v=>additional(v)&&received(v,Infinity))??null;
 const moments=snapshots.filter(s=>s.eligiblePool?.some(v=>additional(v)&&received(v,s.browserMs))).map(s=>s.browserMs);
 return {basis:observed?'actual last observed pre-audit eligible pool':'raw primary eligibility fallback; pre-audit UI pool not separately observed',observedPrimaryPool:observed?.eligiblePool??null,baselineIds:baseline.map(v=>v.id),finalAdditions,firstAuditAdditionBrowserMs:moments.length?Math.min(...moments):null};
}
