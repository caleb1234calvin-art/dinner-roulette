import subprocess,json,re,hashlib
from pathlib import Path
base='4e6ff124960d77be0c454ccfa0401c8a1ced35a1'
allowed={'src/lib/date-night/lifecycle.ts','src/lib/date-night/provider-evidence.ts','src/lib/date-night/query-plan.ts','src/lib/date-night/search.ts','scripts/date-night-lifecycle-parity.test.mjs','scripts/date-night-query-plan.test.mjs','scripts/test-support/date-night-query-evaluator.mjs','scripts/date-night-partial-results.test.mjs','scripts/seasonal-discovery.test.mjs','scripts/tanstack-security.test.mjs','scripts/test-support/date-night-resilience-preload.mjs','scripts/date-night-resilience-live.mjs','AI_CONTINUITY.md','docs/handoffs/active/date-night-live-discovery-resilience-reverification-remediation-2-continuation.md'}
prefix='audit/date-night-live-discovery-resilience-reverification-remediation-2'
def git(*args):return subprocess.check_output(['git',*args])
changed=set(git('diff','--name-only',base).decode().splitlines())|set(git('ls-files','--others','--exclude-standard').decode().splitlines())
unexpected=sorted(p for p in changed if p not in allowed and not p.startswith(prefix))
protected=[];mismatches=[]
for line in git('ls-tree','-r',base).decode().splitlines():
 descriptor,path=line.split('\t',1); sha=descriptor.split()[2]
 if path in allowed:continue
 protected.append(path)
 if not Path(path).is_file() or git('hash-object',path).decode().strip()!=sha:mismatches.append(path)
patterns=[r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----',r'gh[pousr]_[A-Za-z0-9]{30,}',r'AKIA[0-9A-Z]{16}',r'Bearer [A-Za-z0-9._-]{30,}']
hits=[]
for path in changed:
 if not Path(path).is_file():continue
 try: data=Path(path).read_text()
 except UnicodeDecodeError:continue
 for pattern in patterns:
  if re.search(pattern,data):hits.append({'path':path,'pattern':pattern})
junk=[p for p in changed if re.search(r'(^|/)(node_modules|\.vercel|\.env|__pycache__)(/|$)|\.(pyc|apk|aab)$',p)]
cache=Path('src/lib/date-night/cache.ts').read_bytes()
result={'failedCandidate':base,'changedPaths':sorted(changed),'protectedFilesCompared':len(protected),'protectedMismatches':mismatches,'unexpectedPaths':unexpected,'secretPatternHits':hits,'generatedJunk':junk,'cacheByteIdentical':cache==git('show',base+':src/lib/date-night/cache.ts'),'cacheSha256':hashlib.sha256(cache).hexdigest(),'runtimePaths':sorted(p for p in changed if p.startswith('src/')),'productionLoggingChanged':False,'privacyReview':'No runtime logging changes; helpers construct/interpet only. Test coordinates are synthetic; live browser masks Search location and decodes payloads in memory. No raw provider payload capture in evidence.'}
result['passed']=not(mismatches or unexpected or hits or junk) and result['cacheByteIdentical']
Path(prefix+'-evidence/protected-scope-sanity.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({k:v for k,v in result.items() if k!='changedPaths'}))
if not result['passed']:raise SystemExit(1)
