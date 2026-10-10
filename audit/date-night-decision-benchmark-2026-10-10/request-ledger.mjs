import { appendFileSync, existsSync, readFileSync, mkdirSync, openSync, fsyncSync, closeSync } from 'node:fs';
import { dirname } from 'node:path';
import { createHash } from 'node:crypto';
export const LIMITS = Object.freeze({ maxAttempts:1280, maxPhysicalFailures:8, maxHandlerFailures:2, maxWallMs:2700000 });
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const nativeUtcAnchor=Date.now(),nativeMonotonicAnchor=performance.now();
const monotonicEpochNow=()=>nativeUtcAnchor+performance.now()-nativeMonotonicAnchor;
export function createLedger(path,{now=monotonicEpochNow,limits=LIMITS}={}) {
  mkdirSync(dirname(path),{recursive:true});
  const rows=existsSync(path)?readFileSync(path,'utf8').split('\n').filter(Boolean).map(JSON.parse):[];
  const state={attempts:0,outcomes:0,pending:new Set(),physicalFailures:0,handlerFailures:0,stopped:null,startedAt:null,config:null};
  let previous=null,timer;
  const abort=new AbortController();
  const apply=row=>{
    if(row.type==='config')state.config=row.limits;
    if(row.type==='attempt'){state.startedAt??=row.at;state.attempts++;state.pending.add(row.attempt);}
    if(row.type==='outcome'){if(!state.pending.delete(row.attempt))throw Error('Duplicate/missing outcome');state.outcomes++;if(row.outcome==='success')state.physicalFailures=0;else if(['failure','timeout','rate-limited'].includes(row.outcome))state.physicalFailures++;}
    if(row.type==='handler')state.handlerFailures=row.whollyFailed?state.handlerFailures+1:row.successfulProviderGroup?0:state.handlerFailures;
    if(row.type==='stop')state.stopped??=row.reason;
  };
  for(const row of rows){const {hash:expected,...body}=row;if(body.previous!==previous||hash(body)!==expected)throw Error('Ledger integrity failure');previous=expected;apply(row);}
  const event=data=>{const body={...data,at:now(),previous};const row={...body,hash:hash(body)};appendFileSync(path,JSON.stringify(row)+'\n');const fd=openSync(path,'r');try{fsyncSync(fd);}finally{closeSync(fd);}previous=row.hash;rows.push(row);apply(row);return row;};
  const stop=reason=>{if(!state.stopped)event({type:'stop',reason});if(!abort.signal.aborted)abort.abort(Error(state.stopped));clearTimeout(timer);};
  const expired=()=>state.startedAt!==null&&now()-state.startedAt>=limits.maxWallMs;
  const check=()=>{if(expired())stop('wall-clock-cap');if(state.stopped)throw Error(state.stopped);};
  const arm=()=>{if(timer||state.startedAt===null||state.stopped)return;timer=setTimeout(()=>stop('wall-clock-cap'),Math.max(0,limits.maxWallMs-(now()-state.startedAt)));}; // Referenced: quiescent awaits cannot exit silently.
  if(!rows.length)event({type:'config',limits});
  else if(JSON.stringify(state.config)!==JSON.stringify(limits))throw Error('Immutable budget mismatch');
  if(state.pending.size)stop('incomplete-attempt-recovery-hold');
  if(rows.some(r=>r.type==='outcome'&&r.outcome==='rate-limited'))stop('provider-429');
  // Replayed thresholds are checked at every historical prefix, not just final state.
  let failures=0,handlers=0;
  for(const row of rows){if(row.type==='outcome'){if(row.outcome==='success')failures=0;else if(['failure','timeout','rate-limited'].includes(row.outcome))failures++;if(failures>=limits.maxPhysicalFailures)stop('physical-failure-cap');}if(row.type==='handler'){handlers=row.whollyFailed?handlers+1:row.successfulProviderGroup?0:handlers;if(handlers>=limits.maxHandlerFailures)stop('handler-failure-cap');}}
  if(state.attempts>=limits.maxAttempts)stop('physical-request-cap');
  if(expired())stop('wall-clock-cap');if(state.stopped&&!abort.signal.aborted)abort.abort(Error(state.stopped));arm();
  return {signal:abort.signal,stop,check,limits,
    outcomesFor(metadata){return rows.filter(r=>r.type==='outcome'&&Object.entries(metadata).every(([key,value])=>r.metadata?.[key]===value)).map(r=>({...r}));},
    snapshot:()=>({...state,pending:[...state.pending],lastHash:previous,remaining:limits.maxAttempts-state.attempts,remainingMs:state.startedAt===null?limits.maxWallMs:Math.max(0,limits.maxWallMs-(now()-state.startedAt))}),
    reserve(metadata){check();if(state.attempts>=limits.maxAttempts){stop('physical-request-cap');throw Error(state.stopped);}const id=state.attempts+1;event({type:'attempt',attempt:id,metadata});arm();return id;},
    finish(attempt,outcome,metadata){if(!state.pending.has(attempt))throw Error('Duplicate/missing outcome');if(!['success','failure','timeout','rate-limited','hedge-abort','session-abort','benchmark-abort'].includes(outcome))throw Error('Invalid outcome');event({type:'outcome',attempt,outcome,metadata});if(outcome==='rate-limited')stop('provider-429');if(state.physicalFailures>=limits.maxPhysicalFailures)stop('physical-failure-cap');},
    handler(metadata){event({type:'handler',...metadata});if(state.handlerFailures>=limits.maxHandlerFailures)stop('handler-failure-cap');},
    note(metadata){event({type:'note',metadata});},
    dispose(){clearTimeout(timer);},
  };
}
