import { appendFileSync, existsSync, readFileSync, mkdirSync, openSync, fsyncSync, closeSync } from 'node:fs';
import { dirname } from 'node:path';
import { createHash } from 'node:crypto';
export const LIMITS = Object.freeze({ maxAttempts:384, maxCumulativeFailures:96, maxPhysicalFailures:8, maxHandlerFailures:2, maxWallMs:1800000, maxMainAttempts:288, maxReserveAttempts:96 });
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const nativeUtcAnchor=Date.now(),nativeMonotonicAnchor=performance.now();
const monotonicEpochNow=()=>nativeUtcAnchor+performance.now()-nativeMonotonicAnchor;
export function createLedger(path,{now=monotonicEpochNow,limits=LIMITS}={}) {
  mkdirSync(dirname(path),{recursive:true});
  const rows=existsSync(path)?readFileSync(path,'utf8').split('\n').filter(Boolean).map(JSON.parse):[];
  const state={attempts:0,outcomes:0,pending:new Set(),physicalFailures:0,cumulativeFailures:0,handlerFailures:0,stopped:null,startedAt:null,config:null,stage:'main',stageAttempts:{main:0,reserve:0},reserveEntered:false};
  let previous=null,timer;
  const abort=new AbortController(),waiters=new Set();
  const wake=()=>{for(const done of waiters)done();waiters.clear();};
  const apply=row=>{
    if(row.type==='config')state.config=row.limits;
    if(row.type==='stage'){state.stage=row.stage;state.reserveEntered=true;}
    if(row.type==='attempt'){state.startedAt??=row.at;state.attempts++;state.pending.add(row.attempt);state.stageAttempts[row.stage]++;}
    if(row.type==='outcome'){if(!state.pending.delete(row.attempt))throw Error('Duplicate/missing outcome');state.outcomes++;if(row.outcome==='success')state.physicalFailures=0;else if(['failure','timeout','rate-limited'].includes(row.outcome)){state.physicalFailures++;state.cumulativeFailures++;}}
    if(row.type==='handler'&&row.physicalAttempts>0)state.handlerFailures=row.whollyFailed?state.handlerFailures+1:row.successfulProviderGroup?0:state.handlerFailures;
    if(row.type==='stop')state.stopped??=row.reason;
  };
  const reserveProof=e=>e?.mainComplete===true&&e?.mainCensored===false&&Array.isArray(e?.missingRequired)&&e.missingRequired.length===1&&['naturalRecovery','healthy','thin'].includes(e.missingRequired[0]);
  let prefixStop=null;
  for(const row of rows){const {hash:expected,...body}=row;if(body.previous!==previous||hash(body)!==expected)throw Error('Ledger integrity failure');previous=expected;
    if(row.type==='stage'&&(prefixStop||state.stopped||state.pending.size||state.reserveEntered||row.stage!=='reserve'||!reserveProof(row.evidence)))throw Error('Ledger prefix stage violation');
    if(row.type==='attempt'&&(row.stage!==state.stage||!['main','reserve'].includes(row.stage)))throw Error('Ledger prefix stage attribution violation');
    if(row.type==='attempt'&&(prefixStop||state.stopped||state.attempts>=limits.maxAttempts||state.cumulativeFailures+state.pending.size>=limits.maxCumulativeFailures||state.stageAttempts[row.stage]>=(row.stage==='main'?limits.maxMainAttempts:limits.maxReserveAttempts)))throw Error('Ledger prefix admission violation');
    apply(row);if(state.cumulativeFailures>=limits.maxCumulativeFailures)prefixStop??='cumulative-failure-cap';if(state.physicalFailures>=limits.maxPhysicalFailures)prefixStop??='physical-failure-cap';if(state.handlerFailures>=limits.maxHandlerFailures)prefixStop??='handler-failure-cap';if(row.outcome==='rate-limited')prefixStop='provider-429';
  }
  const event=data=>{const body={...data,at:now(),previous};const row={...body,hash:hash(body)};appendFileSync(path,JSON.stringify(row)+'\n');const fd=openSync(path,'r');try{fsyncSync(fd);}finally{closeSync(fd);}previous=row.hash;rows.push(row);apply(row);return row;};
  const stop=reason=>{if(!state.stopped)event({type:'stop',reason});if(!abort.signal.aborted)abort.abort(Error(state.stopped));clearTimeout(timer);wake();};
  const expired=()=>state.startedAt!==null&&now()-state.startedAt>=limits.maxWallMs;
  const check=()=>{if(expired())stop('wall-clock-cap');if(state.stopped)throw Error(state.stopped);};
  const arm=()=>{if(timer||state.startedAt===null||state.stopped)return;timer=setTimeout(()=>stop('wall-clock-cap'),Math.max(0,limits.maxWallMs-(now()-state.startedAt)));};
  if(!rows.length)event({type:'config',limits});
  else if(JSON.stringify(state.config)!==JSON.stringify(limits))throw Error('Immutable budget mismatch');
  if(state.pending.size)stop('incomplete-attempt-recovery-hold');
  if(prefixStop)stop(prefixStop);
  if(state.attempts>=limits.maxAttempts)stop('physical-request-cap');
  if(expired())stop('wall-clock-cap');if(state.stopped&&!abort.signal.aborted)abort.abort(Error(state.stopped));arm();
  const reserve=metadata=>{check();if(state.attempts>=limits.maxAttempts){stop('physical-request-cap');throw Error(state.stopped);}if(state.stageAttempts[state.stage]>=(state.stage==='main'?limits.maxMainAttempts:limits.maxReserveAttempts)){stop(`${state.stage}-stage-cap`);throw Error(state.stopped);}if(state.cumulativeFailures+state.pending.size>=limits.maxCumulativeFailures){const e=Error('pending-failure-risk-wait');e.code='PENDING_FAILURE_RISK';throw e;}const id=state.attempts+1;event({type:'attempt',attempt:id,stage:state.stage,metadata});arm();return id;};
  return {signal:abort.signal,stop,check,limits,
    outcomesFor(metadata){return rows.filter(r=>r.type==='outcome'&&Object.entries(metadata).every(([key,value])=>r.metadata?.[key]===value)).map(r=>({...r}));},
    snapshot:()=>({...state,stageAttempts:{...state.stageAttempts},pending:[...state.pending],lastHash:previous,remaining:limits.maxAttempts-state.attempts,remainingMs:state.startedAt===null?limits.maxWallMs:Math.max(0,limits.maxWallMs-(now()-state.startedAt))}),
    reserve,
    async reserveWhenAvailable(metadata){for(;;){try{return reserve(metadata);}catch(e){if(e.code!=='PENDING_FAILURE_RISK')throw e;await new Promise(resolve=>waiters.add(resolve));}}},
    enterReserve(evidence){check();if(state.pending.size||state.reserveEntered||state.stage!=='main'||!reserveProof(evidence))throw Error('Reserve entry forbidden');event({type:'stage',stage:'reserve',evidence});},
    finish(attempt,outcome,metadata){if(!state.pending.has(attempt))throw Error('Duplicate/missing outcome');if(!['success','failure','timeout','rate-limited','hedge-abort','session-abort','benchmark-abort'].includes(outcome))throw Error('Invalid outcome');event({type:'outcome',attempt,outcome,metadata});if(outcome==='rate-limited')stop('provider-429');if(state.cumulativeFailures>=limits.maxCumulativeFailures)stop('cumulative-failure-cap');if(state.physicalFailures>=limits.maxPhysicalFailures)stop('physical-failure-cap');wake();},
    handler(metadata){event({type:'handler',...metadata});if(state.handlerFailures>=limits.maxHandlerFailures)stop('handler-failure-cap');},
    note(metadata){event({type:'note',metadata});},
    dispose(){clearTimeout(timer);wake();},
  };
}
