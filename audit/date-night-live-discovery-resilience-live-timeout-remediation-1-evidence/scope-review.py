import subprocess,json,re,hashlib
from pathlib import Path
base='e8730f7e44ba48a78a3335657190f7e5aaf82d7b'
allowed={'src/lib/date-night/lifecycle.ts','scripts/date-night-query-cost.test.mjs','scripts/date-night-query-plan.test.mjs','AI_CONTINUITY.md','docs/handoffs/active/date-night-live-discovery-resilience-live-timeout-remediation-1-continuation.md'}
prefix='audit/date-night-live-discovery-resilience-live-timeout-remediation-1'
def git(*args): return subprocess.check_output(['git',*args])
changed=set(git('diff','--name-only',base).decode().splitlines())|set(git('ls-files','--others','--exclude-standard').decode().splitlines())
# Include explicitly scoped logs even though the repository ignores *.log.
changed.update(str(p) for p in Path(prefix+'-evidence').glob('*') if p.is_file())
unexpected=sorted(p for p in changed if p not in allowed and not p.startswith(prefix))
protected=[];mismatches=[]
for line in git('ls-tree','-r',base).decode().splitlines():
    descriptor,path=line.split('\t',1); sha=descriptor.split()[2]
    if path in allowed: continue
    protected.append(path)
    if not Path(path).is_file() or git('hash-object',path).decode().strip()!=sha: mismatches.append(path)
patterns=[r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----',r'gh[pousr]_[A-Za-z0-9]{30,}',r'AKIA[0-9A-Z]{16}',r'Bearer [A-Za-z0-9._-]{30,}']
hits=[]
for path in changed:
    if not Path(path).is_file(): continue
    try: data=Path(path).read_text()
    except UnicodeDecodeError: continue
    for pattern in patterns:
        if re.search(pattern,data): hits.append({'path':path,'pattern':pattern})
junk=[p for p in changed if re.search(r'(^|/)(node_modules|\.vercel|\.env|__pycache__)(/|$)|\.(pyc|apk|aab)$',p)]
cache=Path('src/lib/date-night/cache.ts').read_bytes()
result={'base':base,'changedPaths':sorted(changed),'protectedFilesCompared':len(protected),'protectedMismatches':mismatches,'unexpectedPaths':unexpected,'secretPatternHits':hits,'generatedJunk':junk,'cacheByteIdentical':cache==git('show',base+':src/lib/date-night/cache.ts'),'cacheSha256':hashlib.sha256(cache).hexdigest(),'runtimePaths':sorted(p for p in changed if p.startswith('src/')),'productionLoggingChanged':False,'privacyReview':'No runtime logging or query input boundary changes. Cost/parity evidence uses synthetic coordinates. Live response bytes decoded in memory by unchanged established harness; no raw response bodies or personal locations in new evidence.'}
old=git('show',base+':AI_CONTINUITY.md').decode(); current=Path('AI_CONTINUITY.md').read_text()
result['historicalContinuityPreservedVerbatim']=current.endswith(old)
result['passed']=not(mismatches or unexpected or hits or junk) and result['cacheByteIdentical'] and result['historicalContinuityPreservedVerbatim']
Path(prefix+'-evidence/protected-scope-sanity.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({k:v for k,v in result.items() if k!='changedPaths'}))
if not result['passed']: raise SystemExit(1)
