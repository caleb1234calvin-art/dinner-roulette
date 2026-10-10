# Hybrid candidate remediation R3

Parent candidate: a4f43e9b886764592053a53652dc91602749ba11; tree44929e3f3d0b6ba2e4dd366de847b952388f9cb3.

## HYB-IV-03: truthful empty primary status

Independent actual-component review demonstrated that a failed primary with no eligible pool stopped foreground loading but displayed “Ready” while all decision controls remained disabled. The corrected state separates foreground settlement from usable readiness: `empty` and `unavailable` are terminal no-pool display phases. Background acquisition still starts after primary settlement, continues without foreground loading, and may transition to a usable phase when it recovers venues. An eligible curated pool remains ready despite live failure. Empty partial warnings no longer claim that available places remain usable.

The change is limited to state labels/copy and regression tests. It does not alter request sequencing, provider queries, cache admission/retirement, cancellation, curated data, radius authority, or lifecycle policy. Nevertheless the source identity changed: exact-head gates must rerun. Benchmark consumers must not equate loading=false or primary settlement with usable controls; completion should consult coverage independently of no-pool display phase. Existing a4 measurements are preserved and require independent applicability review, not blanket PASS transfer.

## HYB-BR-02: hosted unmount harness origin

Hosted run38000254537 failed after14 browser scenarios passed: its own about:blank navigation caused SecurityError during fixture storage seeding. The origin guard restricts fixture seeding to the owned application origin. Full pageerror name/message/stack/URL are now preserved; zero-pageerror acceptance remains unchanged. Failed artifacts remain under a4-browser-failure. The abort itself and healthy reload were observed, but later skipped acceptance is not PASS.

## Performance limitation retained

Controlled a4 radius changes added zero RPCs but were not uniformly instant. Anything median CPU was85.98ms versus baseline8.02ms; maximum370.67ms. A bounded instrumented offline diagnostic implicated repeated full-pool identity merging before clipping (one-mile output1 row, hybrid571 cumulative merge input rows). Instrumented timings are diagnostic only, overlapped live benchmarking22:45:10–22:45:39UTC, and are not acceptance evidence. No CPU optimization is included in this correction. Browser timing and independent recommendation remain required.

No production/main publication or deployment is authorized.
