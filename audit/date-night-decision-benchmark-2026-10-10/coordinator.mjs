import { readFileSync,writeFileSync,mkdirSync,existsSync,readdirSync,appendFileSync } from 'node:fs';
import { resolve,dirname } from 'node:path';import { pathToFileURL,fileURLToPath } from 'node:url';import { fork,execFileSync } from 'node:child_process';import { setTimeout as delay } from 'node:timers/promises';import { createHash } from 'node:crypto';
import {createLedger} from './request-ledger.mjs';import {boundedAwait} from './runner-lifecycle.mjs';import {runBrowserCase} from './browser-runner.mjs';
const here=dirname(fileURLToPath(import.meta.url));
const manifestBytes=readFileSync(resolve(here,'HARNESS-MANIFEST.json'));
const harnessManifestSha=createHash('sha256').update(manifestBytes).digest('hex');
for(const [file,expected] of Object.entries(JSON.parse(manifestBytes).files)){const local=resolve(here,file);const actual=file==='workflow.yml'&&!existsSync(local)?resolve(here,'../../.github/workflows/pr61-decision-benchmark.yml'):local;const bytes=readFileSync(actual);if(bytes.length!==expected.bytes||createHash('sha256').update(bytes).digest('hex')!==expected.sha256)throw Error(`Harness freeze mismatch: ${file}`);}
const mode=process.argv[2];if(!['fixture','live'].includes(mode))throw Error('Explicit fixture or live mode required');
const roots={A:resolve(process.env.PFU_BASELINE_ROOT),B:resolve(process.env.PFU_CANDIDATE_ROOT)};
const shas={A:'fe22c15cc6442fc4a48fec23c9a1331c69d70bd2',B:'c78b97175cc094436e454fa888e1ed83486f750d'};
const trees={A:'8d5059c9fee871c522616971cce0a80b153e4d23',B:'6f7130dc46e5decc9b045c2841b63c73406ae2ae'};
const output=resolve(process.env.PFU_BENCH_OUTPUT??`/tmp/pfu-decision-${mode}`);
if(existsSync(output)&&readdirSync(output).length)throw Error('Evidence exists: restart refused');mkdirSync(output,{recursive:true});
if(mode==='live'){
 if(process.env.PFU_LIVE_APPROVED!=='yes'||process.env.GITHUB_RUN_ATTEMPT!=='1')throw Error('Single reviewed first-attempt live run only');
 const receipt=JSON.parse(readFileSync(resolve(here,'LIVE-APPROVAL.json'),'utf8'));
 if(receipt.harnessManifestSha!==harnessManifestSha)throw Error('Live approval harness identity mismatch');
 if(String(receipt.expectedWorkflowRunNumber)!==process.env.GITHUB_RUN_NUMBER||receipt.repository!==process.env.GITHUB_REPOSITORY||receipt.workflowRef!==process.env.GITHUB_WORKFLOW_REF)throw Error('Approval is not bound to this unique workflow execution');
 if(receipt.maxAttempts!==1280||receipt.maxWallMs!==2700000||receipt.candidate!==shas.B||receipt.baseline!==shas.A||receipt.protocol!=='PASS')throw Error('Live approval mismatch');
}
const checkSources=()=>{for(const s of ['A','B']){const g=(...a)=>execFileSync('git',['-C',roots[s],...a],{encoding:'utf8'}).trim();if(g('rev-parse','HEAD')!==shas[s]||g('rev-parse','HEAD^{tree}')!==trees[s]||g('status','--porcelain'))throw Error('Exact clean source identity mismatch');}};
checkSources();
const proofs={};for(const s of ['A','B']){const {assertBrowserBuild}=await import(pathToFileURL(`${roots[s]}/scripts/browser-build-proof.mjs`));proofs[s]=assertBrowserBuild(roots[s],'true');}
const locations={Joplin:{lat:37.0842,lon:-94.5133},Columbia:{lat:38.9517,lon:-92.3341},KansasCity:{lat:39.0997,lon:-94.5786}};
const blocks=[['Columbia',20,'ABBA'],['Joplin',50,'BAAB'],['KansasCity',20,'ABBA'],['Columbia',50,'BAAB'],['Joplin',20,'BAAB'],['KansasCity',50,'ABBA']];
let jobs=blocks.flatMap(([location,radius,order],block)=>[...order].map((strategy,position)=>({block,position,location,radius,radiusMiles:radius,strategy,...locations[location],activityTypes:['movies'],controlOrder:['pick','options','plan'],reducedMotion:'no-preference'})));
if(mode==='fixture')jobs=[...jobs.slice(0,2),{...jobs[0],fixtureScenario:'baseline-one-failed-patch'},{...jobs[1],fixtureScenario:'hybrid-failed-primary'}];
const policyClock='2026-10-10T12:00:00.000Z';
writeFileSync(`${output}/manifest.json`,JSON.stringify({mode,publicProviderCalls:mode==='fixture'?0:null,shas,trees,proofs,jobs,policyClock,node:process.version,harnessSha:process.env.GITHUB_SHA??null},null,2));
const ledger=createLedger(`${output}/${mode==='fixture'?'fixture-accounting':'physical-ledger'}.jsonl`),rows=[];
let child=null,currentCase=null;
const caseSummary=row=>{const {metrics,rpc,finalState,...summary}=row;return summary;};
const persist=()=>writeFileSync(`${output}/progress.json`,JSON.stringify({mode,rows:rows.map(caseSummary),currentCase,ledger:ledger.snapshot(),planned:jobs},null,2));
const signalStop=()=>{if(child?.connected)child.send({type:'stop',reason:ledger.snapshot().stopped??'coordinator-stop'});};ledger.signal.addEventListener('abort',signalStop);
process.on('SIGTERM',()=>{ledger.stop('runner-sigterm');persist();});process.on('SIGINT',()=>{ledger.stop('owner-stop');persist();});
try{
 for(let i=0;i<jobs.length;i++){
  if(ledger.snapshot().stopped)break;checkSources();const job={...jobs[i],caseId:`${i}-${jobs[i].location}-${jobs[i].radius}-${jobs[i].strategy}`};const root=roots[job.strategy];
  process.chdir(root);const {appModuleLoader}=await import(pathToFileURL(`${root}/scripts/test-support/load-app-module.mjs`));const load=appModuleLoader();const {planDateNightPatches}=load('src/lib/date-night/radial-plan.ts');job.expectedPatches=planDateNightPatches(job,job.radius);
  const caseOutput=resolve(output,job.caseId);mkdirSync(caseOutput,{recursive:true});currentCase={...job,status:'starting',startedUtc:new Date().toISOString()};persist();
  const cfg={...job,patches:job.expectedPatches,policyClock,mode,output:caseOutput};
  child=fork(`${root}/node_modules/vite/bin/vite.js`,['preview','--host','127.0.0.1','--port','8087','--strictPort'],{cwd:root,execArgv:['--import',resolve(here,'server-preload.mjs')],env:{...process.env,CI:'true',TZ:'UTC',DATABASE_URL:'',VITE_AUTH_ENABLED:'true',PFU_BENCH_CASE:JSON.stringify(cfg)},stdio:['ignore','pipe','pipe','ipc']});
  const activeChild=child;let unexpectedExit=null;
  const messages=new Set();
  child.on('message',m=>{const task=(async()=>{try{let reply={type:'reply',nonce:m.nonce};if(m.type==='reserve'){reply.attempt=ledger.reserve(m.metadata);}else if(m.type==='finish'){ledger.finish(m.attempt,m.outcome,m.metadata);}else if(m.type==='integrity'){ledger.stop(`harness-integrity:${m.reason}`);reply.error=m.reason;}else throw Error('Unknown IPC message');if(activeChild.connected)activeChild.send(reply);persist();}catch(e){if(activeChild.connected)activeChild.send({type:'reply',nonce:m.nonce,error:e.message});if(!ledger.snapshot().stopped)ledger.stop(`harness-integrity:${e.message}`);persist();}})();messages.add(task);task.finally(()=>messages.delete(task));});
  child.stdout.on('data',b=>appendFileSync(`${caseOutput}/server.log`,b));child.stderr.on('data',b=>appendFileSync(`${caseOutput}/server.log`,b));
  child.on('exit',(code,signal)=>{unexpectedExit={code,signal};});
  const origin='http://127.0.0.1:8087';let healthy=false;
  for(let p=0;p<300;p++){if(unexpectedExit)throw Error(`Preview exited ${JSON.stringify(unexpectedExit)}`);try{const r=await fetch(origin);if(r.ok){healthy=true;break;}}catch{}await delay(100);}
  if(!healthy)throw Error('Preview startup timed out');
  currentCase.status='browser-running';persist();
  let result;
  try{result=await boundedAwait(runBrowserCase({root,job,output:caseOutput,ledger,server:child,origin,policyClock}),190000,()=>{if(child?.connected)child.send({type:'stop',reason:'case-observation-limit'});});}
  catch(e){result={outcome:'harness-error',error:{name:e.name,message:e.message,stack:e.stack}};ledger.stop('browser-harness-error');}
  if(child?.connected)child.send({type:'stop',reason:'case-terminal-drain'});
  const drainStart=performance.now();while(ledger.snapshot().pending.length&&performance.now()-drainStart<10000)await delay(50);
  await Promise.allSettled([...messages]);
  if(ledger.snapshot().pending.length)ledger.stop('unsettled-attempt-hold');
  child.kill('SIGTERM');for(let t=0;t<50&&!unexpectedExit;t++)await delay(100);if(!unexpectedExit){child.kill('SIGKILL');ledger.stop('server-drain-hold');}
  child=null;rows.push({...job,...result,outcome:result.outcome??result.terminal??(result.censored?'censored':'unknown'),serverExit:unexpectedExit,ledgerAtEnd:ledger.snapshot(),finishedUtc:new Date().toISOString()});currentCase=null;persist();
  console.log(JSON.stringify({caseId:job.caseId,outcome:result.outcome??result.terminal??null,attempts:ledger.snapshot().attempts,stop:ledger.snapshot().stopped}));
  if(result.censored||result.outcome==='censored')ledger.stop('observation-censored-no-complete-decision');
  if(mode==='live'&&i===jobs.length-1&&jobs.length===24&&!ledger.snapshot().stopped&&ledger.snapshot().remaining>=176&&ledger.snapshot().remainingMs>=480000){
   ledger.note({optionalMixedReservation:176,remaining:ledger.snapshot().remaining,remainingMs:ledger.snapshot().remainingMs});
   jobs.push(...[...'ABBA'].map((strategy,position)=>({block:6,position,location:'Columbia',radius:20,radiusMiles:20,strategy,...locations.Columbia,activityTypes:['movies','park'],controlOrder:['pick','options','plan'],reducedMotion:'no-preference',optional:true})));
  }
 }
}catch(e){ledger.stop(`coordinator-error:${e.message}`);currentCase={...currentCase,error:e.stack};persist();}
finally{if(child?.connected)child.send({type:'stop',reason:'final-drain'});const at=performance.now();while(ledger.snapshot().pending.length&&performance.now()-at<10000)await delay(50);if(child)child.kill('SIGTERM');try{checkSources();}catch(e){ledger.stop('source-drift');currentCase={...currentCase,sourceDrift:e.message};}persist();writeFileSync(`${output}/terminal.json`,JSON.stringify({mode,verdict:ledger.snapshot().pending.length?'PROTOCOL HOLD':'REVIEW REQUIRED',rows:rows.length,planned:jobs.length,unrun:jobs.slice(rows.length),ledger:ledger.snapshot(),finishedUtc:new Date().toISOString(),sourceIdentityFinal:ledger.snapshot().stopped==='source-drift'?'HOLD':'checked'},null,2));ledger.dispose();}
