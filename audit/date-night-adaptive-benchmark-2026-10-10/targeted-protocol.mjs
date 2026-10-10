import {warmEvidence} from './reserve-rubric.mjs';
export const LOCATIONS=Object.freeze({Joplin:{lat:37.0842,lon:-94.5133},Columbia:{lat:38.9517,lon:-92.3341},KansasCity:{lat:39.0997,lon:-94.5786}});
const job=(location,radius,strategy,extra={})=>({location,radius,radiusMiles:radius,strategy,...LOCATIONS[location],activityTypes:['movies'],controlOrder:['pick','options','plan'],reducedMotion:'no-preference',...extra});
const mixed={activityTypes:['escape-room','movies']};
export const MAIN_JOBS=[job('KansasCity',20,'D',{...mixed,holdPick:true}),job('KansasCity',20,'R',{...mixed,holdPick:true}),job('Joplin',50,'R'),job('Joplin',50,'D',{holdPick:true}),job('Joplin',50,'D',{holdControl:'options'}),job('Joplin',50,'R'),job('Columbia',20,'D'),job('Columbia',50,'D',{...mixed,holdControl:'plan'})].map((j,i)=>({...j,block:i<2?0:i<6?1:i-4,position:i,stage:'main'}));
export const RESERVE_JOBS=[job('KansasCity',20,'D',mixed),job('Joplin',20,'D')].map((j,i)=>({...j,block:4,position:i,stage:'reserve',optional:true}));
export function reserveDecision(rows,ledger,rubric){
 const missingRequired=[];if(rubric?.passed!==true)missingRequired.push('adoptionRubric');
 const main=rows.filter(r=>r.stage==='main');
 const complete=r=>['complete','adaptive-stopped'].includes(r.coldTerminal)&&!r.censored&&!r.censorReason&&!r.integrityError&&!['censored','harness-error','integrity-hold'].includes(r.outcome)&&r.metrics?.observerConfounded===false&&r.metrics?.driverSchedulingConfounded===false&&Number.isFinite(r.metrics?.controls?.pick?.renderedMs)&&r.metrics.controls.pick.identities?.length===1&&Number.isFinite(r.metrics?.controls?.options?.renderedMs)&&(!r.metrics?.policyEvidence?.invalidControls?.length)&&(!r.metrics?.policyEvidence?.knownNegativeResurrections?.length)&&(!r.metrics?.stabilityViolations?.length)&&warmEvidence(r).accepted;
 const mainComplete=main.length===8&&main.every(complete);
 if(!mainComplete)missingRequired.push('main');
 const adaptive=rows.filter(r=>r.strategy==='D'&&complete(r));
 if(!adaptive.some(r=>r.metrics?.mechanisms?.naturalRecovery===true))missingRequired.push('naturalRecovery');
 if(!adaptive.some(r=>r.metrics?.mechanisms?.healthy===true))missingRequired.push('healthy');
 if(!adaptive.some(r=>r.metrics?.mechanisms?.thin===true))missingRequired.push('thin');
 if(!main.filter(r=>r.location==='Joplin').every(r=>r.metrics?.controls?.optionsFour?.fullFour||r.metrics?.controls?.options?.fullFour))missingRequired.push('fourOptions');
 if(!main.filter(r=>r.activityTypes.length>1).every(r=>r.metrics?.controls?.plan?.semanticPair===true))missingRequired.push('genuinePlan');
 const mainCensored=Boolean(ledger.stopped)||main.some(r=>r.censorReason||['censored','global-stop','deadline'].includes(r.coldTerminal));
 return {mainComplete,mainCensored,missingRequired,rubric,inheritedWarmHolds:rows.filter(r=>warmEvidence(r).inheritedHold).map(r=>r.caseId),allowed:mainComplete&&!mainCensored&&missingRequired.length===1&&['naturalRecovery','healthy','thin'].includes(missingRequired[0])};
}
