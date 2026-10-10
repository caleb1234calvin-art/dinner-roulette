import { readFileSync,writeFileSync,mkdirSync,existsSync,readdirSync,appendFileSync } from 'node:fs';
import { resolve,dirname } from 'node:path';import { pathToFileURL,fileURLToPath } from 'node:url';import { fork,execFileSync } from 'node:child_process';import { setTimeout as delay } from 'node:timers/promises';import { createHash } from 'node:crypto';
import {assessReserveRubric} from './reserve-rubric.mjs';
import {MAIN_JOBS,RESERVE_JOBS,reserveDecision} from './targeted-protocol.mjs';
import {createLedger} from './request-ledger.mjs';import {boundedAwait} from './runner-lifecycle.mjs';import {runBrowserCase} from './browser-runner.mjs';
const here=dirname(fileURLToPath(import.meta.url));
const manifestBytes=readFileSync(resolve(here,'HARNESS-MANIFEST.json'));
const harnessManifestSha=createHash('sha256').update(manifestBytes).digest('hex');
for(const [file,expected] of Object.entries(JSON.parse(manifestBytes).files)){const local=resolve(here,file);const actual=file==='workflow.yml'&&!existsSync(local)?resolve(here,'../../.github/workflows/pr61-adaptive-benchmark.yml'):local;const bytes=readFileSync(actual);if(bytes.length!==expected.bytes||createHash('sha256').update(bytes).digest('hex')!==expected.sha256)throw Error(`Harness freeze mismatch: ${file}`);}
if(process.env.GITHUB_ACTIONS==='true'){const workflow=readFileSync(resolve(here,'../../.github/workflows/pr61-adaptive-benchmark.yml'));if(createHash('sha256').update(workflow).digest('hex')!==JSON.parse(manifestBytes).files['workflow.yml'].sha256)throw Error('Running workflow differs from frozen workflow');}
const mode=process.argv[2];if(!['fixture','live'].includes(mode))throw Error('Explicit fixture or live mode required');
const sourceIdentity=JSON.parse(readFileSync(resolve(here,'SOURCE-IDENTITIES.json'),'utf8'));
const roots={R:resolve(process.env.PFU_BASELINE_ROOT),D:resolve(process.env.PFU_CANDIDATE_ROOT)};
const shas=sourceIdentity.shas,trees=sourceIdentity.trees;
const historicalReplay=JSON.parse(readFileSync(resolve(here,'REPLAY-QUALIFICATION.json'),'utf8'));
const output=resolve(process.env.PFU_BENCH_OUTPUT??`/tmp/pfu-adaptive-${mode}`);
if(existsSync(output)&&readdirSync(output).length)throw Error('Evidence exists: restart refused');mkdirSync(output,{recursive:true});
if(mode==='live'){
 if(historicalReplay.passed!==true||historicalReplay.candidate!==shas.D||historicalReplay.independentReview!=='PASS')throw Error('Exact reviewed historical replay qualification required');
 if(process.env.PFU_LIVE_APPROVED!=='yes'||process.env.GITHUB_RUN_ATTEMPT!=='1')throw Error('Single reviewed first-attempt live run only');
 const receipt=JSON.parse(readFileSync(resolve(here,'LIVE-APPROVAL.json'),'utf8'));
 if(receipt.harnessManifestSha!==harnessManifestSha)throw Error('Live approval harness identity mismatch');
 if(String(receipt.expectedWorkflowRunNumber)!==process.env.GITHUB_RUN_NUMBER||receipt.repository!==process.env.GITHUB_REPOSITORY||receipt.workflowRef!==process.env.GITHUB_WORKFLOW_REF)throw Error('Approval is not bound to this unique workflow execution');
 if(receipt.maxAttempts!==384||receipt.maxCumulativeFailures!==96||receipt.maxMainAttempts!==288||receipt.maxReserveAttempts!==96||receipt.maxWallMs!==1800000||receipt.candidate!==shas.D||receipt.baseline!==shas.R||receipt.protocol!=='PASS'||receipt.phase1!=='PASS'||receipt.hostedFixtures!=='PASS'||receipt.ownerGo!==true)throw Error('Live approval mismatch');
}
const checkSources=()=>{for(const s of ['R','D']){const g=(...a)=>execFileSync('git',['-C',roots[s],...a],{encoding:'utf8'}).trim();if(g('rev-parse','HEAD')!==shas[s]||g('rev-parse','HEAD^{tree}')!==trees[s]||g('status','--porcelain'))throw Error('Exact clean source identity mismatch');}};
checkSources();
const proofs={};for(const s of ['R','D']){const {assertBrowserBuild}=await import(pathToFileURL(`${roots[s]}/scripts/browser-build-proof.mjs`));proofs[s]=assertBrowserBuild(roots[s],'true');}
let jobs=MAIN_JOBS.map(j=>({...j}));
if(mode==='fixture')jobs=[{...MAIN_JOBS[2],fixtureScenario:'radial-healthy'}, {...MAIN_JOBS[3],fixtureScenario:'adaptive-healthy'}, {...MAIN_JOBS[2],radius:20,radiusMiles:20,fixtureScenario:'baseline-one-failed-patch'}, {...MAIN_JOBS[3],radius:20,radiusMiles:20,fixtureScenario:'hybrid-failed-primary'}, {...MAIN_JOBS[6],fixtureScenario:'adaptive-thin'}, {...MAIN_JOBS[7],fixtureScenario:'adaptive-mixed',holdControl:'plan'}, {...MAIN_JOBS[4],fixtureScenario:'adaptive-options',holdControl:'options'}];
const policyClock='2026-10-10T12:00:00.000Z';
writeFileSync(`${output}/manifest.json`,JSON.stringify({mode,publicProviderCalls:mode==='fixture'?0:null,shas,trees,proofs,jobs,policyClock,node:process.version,harnessSha:process.env.GITHUB_SHA??null},null,2));
const ledger=createLedger(`${output}/${mode==='fixture'?'fixture-accounting':'physical-ledger'}.jsonl`),rows=[];
let child=null,currentCase=null;
const assessRubric=async()=>{const evaluators={};for(const arm of ['R','D']){process.chdir(roots[arm]);const {appModuleLoader}=await import(pathToFileURL(`${roots[arm]}/scripts/test-support/load-app-module.mjs`));const load=appModuleLoader();evaluators[arm]={...load('src/lib/date-night/eligibility.ts'),...load('src/lib/date-night/identity.ts')};}return assessReserveRubric(rows,{historicalReplay,sourceD:shas.D,sameIdentity:(a,b)=>evaluators.D.mergeDateNight([a],[b]).length===1,semanticEligible:(row,venues,ms)=>{const e=evaluators[row.strategy],now=new Date(Date.parse(policyClock)+ms),filters={radiusMiles:row.radius,activityTypes:row.activityTypes,mood:50,openNowOnly:false,favoritesOnly:false,reduceParks:false};return e.eligibleDateNight(e.decorateDateNight(venues,row,now),filters,true,{},[],now.getTime());}});};
const caseSummary=row=>{const {metrics,rpc,finalState,...summary}=row;return summary;};
const persist=()=>writeFileSync(`${output}/progress.json`,JSON.stringify({mode,rows:rows.map(caseSummary),currentCase,ledger:ledger.snapshot(),planned:jobs},null,2));
const signalStop=()=>{if(child?.connected)child.send({type:'stop',reason:ledger.snapshot().stopped??'coordinator-stop'});};ledger.signal.addEventListener('abort',signalStop);
process.on('SIGTERM',()=>{ledger.stop('runner-sigterm');persist();});process.on('SIGINT',()=>{ledger.stop('owner-stop');persist();});
try{
 for(let i=0;i<jobs.length;i++){
  if(ledger.snapshot().stopped)break;checkSources();const job={...jobs[i],mode,caseId:`${i}-${jobs[i].location}-${jobs[i].radius}-${jobs[i].strategy}`};const root=roots[job.strategy];
  process.chdir(root);const {appModuleLoader}=await import(pathToFileURL(`${root}/scripts/test-support/load-app-module.mjs`));const load=appModuleLoader();const {planDateNightPatches}=load('src/lib/date-night/radial-plan.ts');job.expectedPatches=planDateNightPatches(job,job.radius);
  const caseOutput=resolve(output,job.caseId);mkdirSync(caseOutput,{recursive:true});currentCase={...job,status:'starting',startedUtc:new Date().toISOString()};persist();
  const cfg={...job,patches:job.expectedPatches,policyClock,mode,output:caseOutput};
  child=fork(`${root}/node_modules/vite/bin/vite.js`,['preview','--host','127.0.0.1','--port','8087','--strictPort'],{cwd:root,execArgv:['--import',resolve(here,'server-preload.mjs')],env:{...process.env,CI:'true',TZ:'UTC',DATABASE_URL:'',VITE_AUTH_ENABLED:'true',PFU_BENCH_CASE:JSON.stringify(cfg)},stdio:['ignore','pipe','pipe','ipc']});
  const activeChild=child;let unexpectedExit=null;
  const messages=new Set();
  child.on('message',m=>{const task=(async()=>{try{let reply={type:'reply',nonce:m.nonce};if(m.type==='reserve'){reply.attempt=await ledger.reserveWhenAvailable(m.metadata);}else if(m.type==='finish'){ledger.finish(m.attempt,m.outcome,m.metadata);}else if(m.type==='integrity'){ledger.stop(`harness-integrity:${m.reason}`);reply.error=m.reason;}else throw Error('Unknown IPC message');if(activeChild.connected)activeChild.send(reply);persist();}catch(e){if(activeChild.connected)activeChild.send({type:'reply',nonce:m.nonce,error:e.message});if(!ledger.snapshot().stopped)ledger.stop(`harness-integrity:${e.message}`);persist();}})();messages.add(task);task.finally(()=>messages.delete(task));});
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
  child=null;const outcomes=ledger.outcomesFor({caseId:job.caseId});result.physicalSummary={starts:outcomes.length,knownBodyBytes:outcomes.reduce((n,r)=>n+(Number.isFinite(r.metadata?.bytes)?r.metadata.bytes:0),0),unknownBodyAttempts:outcomes.filter(r=>!Number.isFinite(r.metadata?.bytes)).length};rows.push({...job,...result,outcome:result.outcome??result.terminal??(result.censored?'censored':'unknown'),serverExit:unexpectedExit,ledgerAtEnd:ledger.snapshot(),finishedUtc:new Date().toISOString()});currentCase=null;persist();
  console.log(JSON.stringify({caseId:job.caseId,outcome:result.outcome??result.terminal??null,attempts:ledger.snapshot().attempts,stop:ledger.snapshot().stopped}));
  if(result.censored||result.outcome==='censored')ledger.stop('observation-censored-no-complete-decision');
  if(mode==='live'&&i===7){const evidence=reserveDecision(rows,ledger.snapshot(),await assessRubric());ledger.note({reserveDecision:evidence});if(evidence.allowed){ledger.enterReserve(evidence);jobs.push(...RESERVE_JOBS.map(j=>({...j})));}}
  if(mode==='live'&&i>=8){const evidence=reserveDecision(rows,ledger.snapshot(),await assessRubric());ledger.note({reserveReassessment:evidence});if(evidence.missingRequired.length===0||evidence.rubric?.passed!==true)break;}
 }
}catch(e){ledger.stop(`coordinator-error:${e.message}`);currentCase={...currentCase,error:e.stack};persist();}
finally{if(child?.connected)child.send({type:'stop',reason:'final-drain'});const at=performance.now();while(ledger.snapshot().pending.length&&performance.now()-at<10000)await delay(50);if(child)child.kill('SIGTERM');try{checkSources();}catch(e){ledger.stop('source-drift');currentCase={...currentCase,sourceDrift:e.message};}persist();writeFileSync(`${output}/terminal.json`,JSON.stringify({mode,verdict:ledger.snapshot().pending.length?'PROTOCOL HOLD':'REVIEW REQUIRED',rows:rows.length,planned:jobs.length,unrun:jobs.slice(rows.length),ledger:ledger.snapshot(),finishedUtc:new Date().toISOString(),sourceIdentityFinal:ledger.snapshot().stopped==='source-drift'?'HOLD':'checked'},null,2));ledger.dispose();}
