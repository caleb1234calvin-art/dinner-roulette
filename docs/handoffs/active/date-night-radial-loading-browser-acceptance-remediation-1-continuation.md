# Radial browser acceptance remediation 1 — continuation

Authority: a1a6a2d2dc718e86f85e1b94769000d200262945. Required fix branch created directly from 7b33c6aeb34a625bb9ff0e6427f68821c27ddd74, tree 16847a7f9c11c528bb95c8200b1affa5d245438e, sole parent 028b2db775133f3343c41d1f8a0a4001d6ab122c. Frozen main and READY production freshly verified unchanged. Full required handoffs, reports, continuity, shared Slider, all eight callers and relevant tests read before runtime edit.

## RED then narrow fix

The permanent real React/Radix Chromium regression was published before runtime changes. Initial setup-only failure (Vite build array shape) retained; no product RED claimed from it. Corrected unchanged-runtime d02e9a0eecd63e1218ce8a9e13238f6d94ba027e, GitHub run37156707435/job111301468825: eight failures including both requested exact role/name queries; ticks/root props passed; no page errors/network requests. Exact DOM and accessibility snapshot retained.

Runtime checkpoint 1e140777a8ea1107ad8dcfdc8b01821197e6af79 changes only src/components/ui/slider.tsx. aria-label and aria-labelledby now name Thumb; single labels unchanged, multi labels get minimum/maximum or value N. External label references append unique hidden suffix references. Existing two-thumb Dinner/Nightlife price sliders retained, all Root props/events/values and all classes/ticks unchanged. No caller special case or radial/provider/cache/session change.

GREEN run37156889299/job111301991317 passes all9 real browser checks: all supplied labels, external-label precedence, distinct range names, controlled Home/End/arrows, price changes and ticks/root props. Zero page errors/network. React review: unconditional stable useId, no effects or mirrored state, existing API preserved. Test-only fixture has a harmless Fast Refresh export warning; zero lint errors.

## Full gates before controlled reacceptance

Focused183 (not additive); full729=658repository+71application,4inherited skips,0failures; compiledsecurity14; lifecycle154/111/zero gaps; legacy cache46/V-DR-02; typecheck/lint/dependencies/casino883/899/60/Android15+4/Python3 all pass. Direct auth-enabled migration-free Vite build and capture/complete/verify pass. Never npm run build or migrations. Protected-scope review proves only Slider runtime changed, existing class names identical, both radial acceptance scripts and blocking preload unchanged, all prior audit evidence unchanged. Exact commands, timing, raw logs losslessly JSON-wrapped, hashes, RED/GREEN DOM and build proof retained separately.

A branch-scoped read-only GitHub Actions workflow runs the permanent slider regression. This checkpoint adds the unchanged controlled radial harness after a fresh safe build/proof. No public providers can run in this workflow. Live remains prohibited until controlled10/10 succeeds and screenshots are reviewed. No successful freeze yet.

NEXT: inspect fresh controlled run from scenario1. Stop/preserve any new concrete product defect. Only after10/10, verify exact READY non-production Preview and run unchanged bounded live harness (core,20:0,20:1;3RPC/48theoretical attempts). Report product usability separately from maximum completeness. Main/production unchanged; no promotion. SAFE TO RESUME.
