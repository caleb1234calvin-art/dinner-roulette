# Pick For Us — Production Loading Hang Incident Audit 1

Repository: `caleb1234calvin-art/dinner-roulette`

Audit branch: `audit/production-loading-hang-1`

Frozen production/main base:
`66eed1409e1076bcea388f36891c31fa7fa3eb84`

Production URL:
`https://dinner-roulette-chi.vercel.app/`

## Incident trigger

After the verified seasonal-discovery production promotion, the owner observed the live application remaining indefinitely in loading states on at least two separate modes:

- Date Night: `Finding date ideas near you...`
- Dinner: `Finding restaurants near you...`

The owner supplied screenshots showing both loading states.

This occurred after the controlled promotion had already completed a successful bounded production smoke at the same main revision. That promotion smoke had observed:

- Dinner loading successfully with a populated result pool
- Date Night loading successfully
- seasonal live-provider failure falling back honestly to saved places

Therefore this incident must not be assumed to be a deterministic seasonal-regression failure merely because it appeared after the seasonal release.

The cross-mode symptom makes shared request/discovery infrastructure, provider/network behavior, server-side request settlement, timeout/fallback handling, caching, RPC, or another common dependency plausible.

These are hypotheses only. Establish the actual cause from evidence.

## Nature of task

This is a READ-ONLY production incident audit.

DO NOT:

- modify product code
- modify catalogs
- fix the incident
- commit implementation changes
- merge
- deploy/redeploy
- change Vercel settings
- run migrations
- roll back
- add venues
- sign/publish Android
- upload to Google Play

Audit/report artifacts may be produced on the dedicated audit branch if needed. Do not alter runtime behavior.

## Required starting verification

Before diagnosis:

1. Fetch fresh remote refs.
2. Verify `main` is still exactly `66eed1409e1076bcea388f36891c31fa7fa3eb84` or report movement and stop before attributing behavior to the frozen revision.
3. Verify this audit branch began exactly at that production revision plus this handoff.
4. Verify clean checkout.
5. Verify current production deployment/alias still resolves to the expected main revision using read-only metadata if available.
6. Read the seasonal promotion report/evidence and prior production-impact/promotion evidence needed to understand the known production configuration.
7. Read current TOP continuity and relevant discovery implementation.

## Mission

Determine why live Pick For Us can remain in an apparent indefinite loading state for both Dinner and Date Night.

Answer separately:

1. Can the incident be reproduced now?
2. Which client/server request is pending when each mode hangs?
3. Are Dinner and Date Night blocked by the same dependency or by independent provider failures with a shared UI symptom?
4. Does every upstream/provider request have a finite timeout?
5. Does mirror/failover logic have a finite aggregate deadline?
6. Does the server/RPC layer settle with success, fallback, or error after upstream failure?
7. Does the client always clear loading state on success, fallback, handled error, timeout, cancellation, navigation and stale-request replacement?
8. Can a provider request remain pending beyond the intended UX deadline?
9. Can multiple retries/mirrors multiply into a very long apparent hang even if each individual request has a timeout?
10. Is fallback available for each affected mode, and if so why was it not reached/displayed?
11. Is this production-only, provider-dependent, browser/device-dependent, location-dependent, or deterministic in current source?
12. Did the seasonal release introduce the defect, expose an inherited weakness, or merely coincide with an upstream outage?
13. What is the smallest systemic remediation?

## Reproduction matrix

Attempt bounded production reproduction against the exact live URL.

Use ordinary anonymous interactions only.

At minimum test:

### Dinner
- current/default location path where safely available
- manual Carthage, Missouri
- a modest radius
- Open Now ON and OFF if applicable

### Date Night ordinary
- manual Carthage, Missouri
- ordinary non-seasonal categories
- Open Now OFF

### Date Night seasonal
- Carthage
- 50 miles
- Haunted House + Corn Maze + Pumpkin Patch
- Open Now OFF
- Spooky Season enabled if required

### Nightlife control
Test Nightlife as a control because it is another discovery mode.

Record for each:

- start timestamp
- first visible loading state
- network/RPC request if observable
- response/failure timestamp
- total loading duration
- resulting source state
- result count/fallback/error
- whether loading clears
- console/runtime errors

Do not wait indefinitely. Establish an audit timeout appropriate to the product's intended behavior and record when it is exceeded.

## Request-lifecycle trace

Trace the complete Dinner and Date Night loading paths from UI action/mount through server/provider and back.

At minimum identify:

- component loading-state owner
- query/fetch/RPC hook
- request key/dependency behavior
- cancellation/stale request behavior
- server handler
- provider request
- timeout implementation
- mirror/failover/retry behavior
- fallback behavior
- error normalization
- final response serialization
- client success/error/finally settlement
- loading-state clearing

Trace Nightlife far enough to determine whether it shares the implicated layer.

Create a concise sequence/timing model for each affected path.

## Timeout accounting

Calculate the **worst-case intended wall-clock time** for each provider chain.

Do not merely list individual timeout constants.

For sequential mirrors/retries calculate aggregate worst case, including:

- per-request timeout
- mirror count
- retries
- retry delay/backoff
- server/platform timeout
- client timeout if any

Determine whether the current design can legitimately appear frozen for tens of seconds/minutes even when technically finite.

Distinguish:

- genuinely unbounded request
- bounded but excessively long aggregate timeout
- client loading state that survives a settled request
- server function timeout before application fallback
- browser/network connection that ignores expected abort
- stale request/race condition

## Provider and infrastructure evidence

Use read-only production/server metadata and logs where available.

Check:

- Vercel function/runtime errors
- timeout/504/429 patterns
- provider endpoints/mirrors
- deployment status
- recent relevant logs around reproduction timestamps
- response durations
- rate-limit evidence

Do not change providers or settings.

If Vercel logs are unavailable, say so explicitly.

Do not infer provider health from absence of logs.

## Source comparison

Compare the current production source against the previous known-good production baseline:

Previous main:
`0a8f30dc57fcc1156342d1bfc8a07524f3125e3b`

Current main:
`66eed1409e1076bcea388f36891c31fa7fa3eb84`

Determine whether the seasonal diff changed:

- Dinner discovery code
- shared RPC/network code
- common provider utilities
- generic loading-state infrastructure
- Nightlife
- only Date Night/seasonal-specific paths

If Dinner's hanging path is byte-identical to previous main, that is important evidence against claiming the seasonal change directly introduced the Dinner defect.

Still test whether changed shared dependencies/configuration indirectly affect it.

## Deterministic failure injection

Without modifying production code, use existing tests/harnesses or temporary out-of-tree audit probes to simulate:

- provider never resolves until abort
- provider times out
- all mirrors time out
- provider 429
- provider 500/504
- malformed provider response
- client navigation during loading
- overlapping/stale requests if architecture permits
- server handler fallback

Verify whether loading always settles.

Do not commit product modifications during the audit.

If a test requires a repository code change, record it as recommended remediation rather than making it.

## Regression history

Inspect existing tests for timeout/fallback/loading settlement.

Determine whether tests currently prove:

- finite aggregate provider deadline
- fallback after all mirrors fail
- loading clears after fallback
- loading clears after error
- loading clears after cancellation/navigation
- no stale request can keep the spinner active
- Dinner and Date Night both handle provider outage
- Nightlife control behavior

Identify exact missing coverage.

## Severity

Classify findings:

### BLOCKER
Production can remain effectively/unboundedly unusable for ordinary discovery and requires remediation before treating current main as healthy.

### IMPORTANT
Loading eventually settles but exceeds a reasonable UX bound or fallback/error handling is brittle.

### NON-BLOCKING
Observability/presentation/testing weakness without demonstrated material user impact.

Do not classify based only on the owner's screenshot; establish timing/settlement behavior.

## Rollback analysis

This audit does NOT authorize rollback.

However, determine whether rollback to previous main would actually remove the implicated code.

Report one of:

- rollback likely removes introduced regression
- rollback would not remove implicated inherited/shared path
- evidence insufficient

Do not execute rollback.

## Required output

Produce:

`audit/production-loading-hang-audit-1-2026-09-30.md`

and machine-readable evidence such as:

`audit/production-loading-hang-audit-1-2026-09-30.json`

Include:

1. exact audited main/deployment
2. reproduction matrix
3. measured timings
4. Dinner lifecycle trace
5. Date Night lifecycle trace
6. Nightlife control trace
7. timeout aggregate calculations
8. provider/log evidence
9. previous-main source comparison
10. deterministic failure-injection results
11. regression-test gap analysis
12. root cause(s)
13. severity
14. rollback relevance
15. exact systemic remediation recommendation
16. limitations
17. final incident state

If useful, retain raw timing/log/network evidence under a dedicated audit evidence directory.

## Stop condition

Do not fix the incident.

End with exactly one:

`PRODUCTION LOADING INCIDENT — NO PRODUCT DEFECT FOUND`

or

`PRODUCTION LOADING INCIDENT — REMEDIATION RECOMMENDED`

or

`PRODUCTION LOADING INCIDENT — REMEDIATION REQUIRED`

If production is currently materially unusable due to the proven behavior, say so clearly.

Stop after audit/evidence production.
