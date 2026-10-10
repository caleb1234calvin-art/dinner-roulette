/** Pure benchmark lifecycle classification. Never upgrades partial/censored work. */
export function terminalState({activeRpc,activePhysical,expectedIds,attemptedIds,settledIds,loading,expanding,paused,complete,elapsedMs,maxObservationMs=180000,stopped}) {
 if(stopped)return {terminal:true,outcome:'stopped',reason:stopped};
 if(elapsedMs>=maxObservationMs)return {terminal:true,outcome:'censored',reason:'observation-limit'};
 if(activeRpc||activePhysical||loading||expanding)return {terminal:false};
 if(complete)return {terminal:true,outcome:'complete'};
 if(paused)return {terminal:true,outcome:'partial',reason:'source-paused'};
 const attempted=new Set(attemptedIds),settled=new Set(settledIds);
 if(expectedIds.length&&expectedIds.every(id=>attempted.has(id)&&settled.has(id)))return {terminal:true,outcome:'partial',reason:'quiescent-incomplete'};
 return {terminal:false};
}
/** Referenced timer: even an otherwise quiescent promise settles or censors. */
export async function boundedAwait(work,ms,onDeadline=()=>{}) {
 let timer;
 const deadline=new Promise(resolve=>{timer=setTimeout(()=>{onDeadline();resolve({censored:true,reason:'observation-limit'});},ms);});
 try{return await Promise.race([work,deadline]);}finally{clearTimeout(timer);}
}
