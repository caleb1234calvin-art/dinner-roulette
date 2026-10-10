# Independent hosted preflight gate R2 — PASS FOR FIXTURES ONLY

Reviewed 2026-10-10. Public-provider live gate remains HOLD.

## Exact frozen scope
- HARNESS-MANIFEST.json SHA256 48776935fce7e9b4a7d5023bca1a0bd128f48a35ce635f86ba605cfe9f0f5001.
- All 13 listed files independently read/rehashed: every byte length and SHA256 matches.
- PREFLIGHT-TRIGGER.json SHA256 0808b01cae1df6b39ddde8b40ab1c766c4a7c34093801c5a46c4061de32a16d0. Explicit fixture-only / public requests 0/no live authorization.
- Browser runner 5077719ac7cd2dbf365f013b588a27eee44654926681567a02985ffcb13f272b; browser tests 80362dc947a07bb874d7d7913f29c5198a03a9dec9ceed475dd47e8e40253694.
- Protocol f9a4083f977ab21641bf6c16687f0313bd50f5bb6278aad972439c2540751211.
- Baseline fe22c15cc6442fc4a48fec23c9a1331c69d70bd2 / tree 8d5059c9fee871c522616971cce0a80b153e4d23.
- Candidate c78b97175cc094436e454fa888e1ed83486f750d / tree 6f7130dc46e5decc9b045c2841b63c73406ae2ae.

## Independent offline rerun
PFU_BASELINE_ROOT=/tmp/decision-baseline-fe22 PFU_CANDIDATE_ROOT=/tmp/hybrid-frozen-c78b971 node --test decision-benchmark/*.test.mjs

33 PASS, 0 fail, 0 skip. No provider traffic.

Coverage includes canonical 50:10 versus 50:1 patch boundary; separate exact-source checkout contracts; installed TanStack retained-byte decoder; recognized serialized application acquisition failure requiring matching failed physical evidence; actual browser terminal predicate for 32-patch quiescent partial and failed-core pause; handler/physical failure counters across phases; immutable budget; pending recovery HOLD; durable 429/failure-threshold replay; referenced process-liveness watchdog; body-read timeout; concurrent IPC physical cap/query attribution; unique workflow-run binding and terminal-source-drift preservation.

## Corrections accepted for preflight
Earlier exact patch substring and hosted path errors are corrected in actual frozen bytes. Expected acquisition errors are separated from corrupt transport through exact error-envelope decoding and aligned failed physical attempts. Actual browser termination invokes the tested source-specific predicate. Coordinator normalizes terminal/outcome fields, preserves terminal evidence on source drift, verifies harness manifest before execution, and binds any later live approval to one repository/workflow/run number/first attempt and frozen manifest.

## Authorized next execution
Publish the 13 exact manifest files, manifest and fixture trigger on the separately approved deployment-disabled benchmark branch. workflow.yml must be byte-identical between retained audited copy and actual workflow destination. No LIVE-APPROVAL.json may be included by this gate.

Run only four mock-provider actual-browser cases: baseline complete; hybrid complete; baseline one failed outer patch/quiescent partial; hybrid failed primary with audit recovery. Expected terminal sequence complete, complete, quiescent-partial, complete. Preload fixture mode supplies all provider responses without native public requests. Actual application RPC/SSR/browser transport remains unchanged. Build auth-enabled and migration-free; no production deployment/source mutation.

## Separate live gate still required
Independently inspect hosted artifacts, raw RPC/provider accounting, actual rendered-choice pixels, expected failed-primary error/recovery and quiescent-partial evidence, zero-public-request proof, complete starts/settles, and source/output binding. Review observer overhead, stable choice identity evidence and final metrics/provenance/yield mappings before any live marker. Frozen manifest or executable changes require delta review and a new bound receipt; fixture failure remains preserved rather than relabeled.

This PASS is not browser-preflight completion, live permission, performance/adoption PASS, candidate release readiness or merge/deployment authority. Prior R1 HOLD and historical Track F/later 327-attempt failures remain preserved.
