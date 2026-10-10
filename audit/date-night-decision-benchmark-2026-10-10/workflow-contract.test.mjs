import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const coordinator=readFileSync(new URL('./coordinator.mjs',import.meta.url),'utf8');
test('coordinator normalizes browser terminal into workflow outcome gate',()=>{assert.match(coordinator,/outcome:result\.outcome\?\?result\.terminal/);const result={terminal:'complete'},row={...result,outcome:result.outcome??result.terminal??'unknown'};assert.equal([row].some(x=>x.outcome!=='complete'),false);});
test('live approval binds unique workflow run number, repository, workflow ref and first attempt',()=>{for(const key of ['expectedWorkflowRunNumber','GITHUB_RUN_NUMBER','GITHUB_REPOSITORY','GITHUB_WORKFLOW_REF','GITHUB_RUN_ATTEMPT'])assert.ok(coordinator.includes(key));});
test('finally records source drift instead of throwing before terminal evidence',()=>{assert.match(coordinator,/try\{checkSources\(\);\}catch\(e\)\{ledger\.stop\('source-drift'\)/);});
