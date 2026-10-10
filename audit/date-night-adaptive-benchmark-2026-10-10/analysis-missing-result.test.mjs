import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
test('offline analysis preserves a missing browser result without hiding other terminal evidence',()=>{
 const dir=mkdtempSync(join(tmpdir(),'pfu-missing-result-'));
 try{
  writeFileSync(join(dir,'progress.json'),JSON.stringify({mode:'fixture',rows:[{caseId:'missing',strategy:'A'}],ledger:{attempts:0}}));
  writeFileSync(join(dir,'fixture-accounting.jsonl'),'');
  const r=spawnSync(process.execPath,[fileURLToPath(new URL('./analyze.mjs',import.meta.url)),dir],{env:{...process.env,PFU_BASELINE_ROOT:dir,PFU_CANDIDATE_ROOT:dir},encoding:'utf8'});
  assert.equal(r.status,0,r.stderr);
  const analysis=JSON.parse(readFileSync(join(dir,'analysis.json'),'utf8'));
  assert.deepEqual(analysis.cases,[{caseId:'missing',missingBrowserResult:true}]);
  assert.equal(analysis.networkCalls,0);
  assert.equal(analysis.decision,'INDEPENDENT REVIEW REQUIRED');
 }finally{rmSync(dir,{recursive:true,force:true});}
});
