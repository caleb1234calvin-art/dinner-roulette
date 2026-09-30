# Pick For Us — Production Loading Hang Remediation 1

Repository: `caleb1234calvin-art/dinner-roulette`

Working branch: `audit/production-loading-hang-1`

Frozen production base:
`66eed1409e1076bcea388f36891c31fa7fa3eb84`

Incident audit handoff commit:
`6959ac4712bac0b26bca32879cce473e66b6eef3`

## Authority

Read IN FULL before modification:

- `docs/handoffs/active/production-loading-hang-audit-1.md`
- `audit/production-loading-hang-audit-1-2026-09-30.md`
- `audit/production-loading-hang-audit-1-2026-09-30.json`
- supporting incident evidence
- current TOP continuity
- relevant Dinner, Date Night, Nightlife, transport and location source/tests

Audit final state:

`PRODUCTION LOADING INCIDENT — REMEDIATION RECOMMENDED`

This handoff authorizes remediation of exactly:

- PLH-F01 — IMPORTANT — excessive inherited aggregate provider wait
- PLH-F02 — IMPORTANT — missing client RPC deadline / transport cancellation
- PLH-F03 — NON-BLOCKING — missing timing/lifecycle regression coverage and bounded observability

Do not expand into discovery redesign, provider replacement, catalog work, migrations, deployment configuration changes, or unrelated features.

## Mandatory starting gates

Before modifying:

1. Fetch fresh refs.
2. Verify `main` is still `66eed1409e1076bcea388f36891c31fa7fa3eb84` or stop/report movement.
3. Verify working branch ancestry from that frozen main.
4. Verify incident audit handoff/evidence is available and unchanged.
5. Verify commits after the audit checkpoint are documentation/evidence-only.
6. Verify no unreviewed executable change exists.
7. Verify clean checkout.
8. Read the complete current request lifecycles before designing the shared correction.

If an executable change exists after the frozen/audited baseline, STOP rather than combining work.

---

# Mission

Guarantee that ordinary discovery cannot present an effectively indefinite spinner and materially reduce provider-outage wait across Dinner, Date Night and Nightlife while preserving existing success, fallback, error, filtering, seasonal, stale-request and source-disclosure semantics.

The remediation should create two independent safety layers:

1. a bounded **server/provider-chain budget**
2. a bounded **client discovery lifecycle deadline**

A failure of either layer must not leave the user waiting indefinitely.

---

# PLH-F01 — Shared provider-chain budget

## Audit proof

Dinner and Date Night currently permit four sequential 22-second provider attempts, producing approximately 88 seconds before fallback.

Native-clock audit measurements:

- Dinner: approximately 88.011 seconds
- Date Night: approximately 88.012 seconds
- Nightlife: approximately 20.001 seconds

Live seasonal production remained loading beyond 80.456 seconds and settled by 90.571 seconds.

The behavior existed on previous main and was not introduced by the seasonal release.

## Required remediation

Implement one coherent provider-chain deadline policy across Dinner, Date Night and Nightlife:

- aggregate provider budget: **20,000 ms**
- maximum individual mirror attempt: **8,000 ms**
- each attempt timeout: `min(8,000 ms, remaining aggregate budget)`
- never begin another mirror once aggregate budget is exhausted
- timeout must include normal response-body completion under the existing fetch/AbortSignal behavior
- preserve provider ordering unless evidence requires otherwise
- preserve current validation/error normalization
- preserve current empty-result semantics per mode
- preserve saved fallback coverage rules
- preserve honest `source` / fallback / coverage disclosure semantics
- preserve outside-saved-coverage terminal error behavior

Do not add retries/backoff beyond the bounded mirror sequence.

Do not replace Overpass providers in this task.

Prefer a shared helper/policy where it reduces drift without forcing unrelated architectural refactoring.

## Timing acceptance

Under deterministic all-stall, abort-compliant providers:

- Dinner provider chain must settle to fallback/error at or below 20s plus small scheduling/processing tolerance
- Date Night same
- Nightlife same

A first-mirror timeout followed by second-mirror success should settle around the first attempt's bounded timeout rather than waiting for unused mirrors.

Immediate HTTP failures should advance without artificial delay.

---

# PLH-F02 — Client deadline and cancellation

## Audit proof

All three components currently:

- start loading
- invoke a direct TanStack server function
- pass no AbortSignal
- register no watchdog
- clear loading only when the RPC promise settles
- suppress stale writes on cleanup but do not cancel transport/server work

Audit probes advanced virtual timers by 10 minutes with an unresolved RPC; all three remained loading.

## Required remediation

Create a coherent client discovery lifecycle used by Dinner, Date Night and Nightlife.

Required behavior:

- overall client watchdog: **25,000 ms**
- create an `AbortController` per active discovery request
- supply its signal through the supported TanStack server-function/RPC signal path
- abort on:
  - watchdog expiry
  - component cleanup/unmount
  - request replacement caused by location/radius/mode-relevant dependency change
- retain latest-request/stale-response guards
- watchdog expiry must **explicitly settle the UI** even if the transport ignores AbortSignal
- clear loading on watchdog expiry
- show a bounded actionable retry/error state appropriate to each mode
- do not fabricate fallback data that was never received
- if a legitimate server fallback arrives before the watchdog, preserve it normally
- a late success/error from a timed-out/replaced request must not overwrite newer/current state
- timers/listeners/controllers must be cleaned up

Do not simply call `abort()` and assume fetch will reject; the audit specifically requires a UI settlement guarantee independent of transport cooperation.

## Cancellation semantics

Navigation/unmount:

- abort old request
- do not write state after unmount

Replacement:

- abort old request
- old late resolution/rejection cannot alter new request state
- new request owns loading settlement

Watchdog:

- UI exits loading by 25s plus scheduler tolerance
- appropriate timeout notice/error is visible
- late transport settlement is ignored

Normal success/fallback/error:

- preserve existing user-facing semantics
- clear watchdog
- avoid duplicate notices/state writes

---

# Server/platform margin

Do not change Vercel settings during this remediation.

Inspect repository/runtime configuration and available read-only metadata.

The application provider budget must leave meaningful margin before any effective hosted function cutoff.

If effective hosted maxDuration remains unavailable, document that limitation. Do not invent a value and do not blindly change configuration.

The 20s server budget + 25s client watchdog are application policies, not claims about Vercel platform limits.

---

# PLH-F03 — Permanent regression coverage

Add deterministic tests that would have failed before this remediation.

At minimum cover all three modes:

## Provider-chain tests

- all mirrors stall until abort → aggregate ≤20s + tolerance
- body stalls until abort
- first mirror timeout → second succeeds
- immediate 429
- immediate 500
- immediate 504
- malformed/missing-elements response
- invalid JSON
- empty-success semantics remain mode-correct
- outage within saved coverage → fallback
- outage outside saved coverage → normalized terminal error
- no mirror starts after aggregate budget exhausted

## Client lifecycle tests

- success clears loading before watchdog
- server fallback clears loading before watchdog
- server error clears loading before watchdog
- AbortError settles appropriately
- transport promise never settles → UI exits loading at watchdog
- watchdog abort signal is issued
- transport ignores abort → UI still settles
- cleanup/unmount aborts transport
- replacement aborts prior request
- stale old success ignored
- stale old rejection ignored
- late post-timeout success ignored
- late post-timeout rejection ignored
- timers/controllers cleaned up
- retry/new request after timeout works normally

## Cross-mode preservation

Verify:

- Dinner normal filtering/result behavior
- Date Night ordinary behavior
- Date Night seasonal source/coverage disclosure
- seasonal lifecycle/17-group regression suite
- Nightlife normal filtering/result behavior
- location/manual/GPS behavior
- no casino regression

Use fake clocks for most deadline tests so validation does not take minutes.

Keep a small selected native-clock test if useful to prove AbortSignal integration, but do not make the full suite wait real 20/25-second windows repeatedly.

---

# PLH-F03 — Bounded observability

Add privacy-conscious structured observability sufficient to diagnose future provider outages.

Do NOT log precise user coordinates, addresses, personal identifiers or secrets.

Useful fields may include:

- mode
- provider/mirror identifier
- attempt ordinal
- elapsed/duration bucket or milliseconds
- outcome category: success / empty / timeout / HTTP error / malformed / abort / budget exhausted
- final source category: live / merged / fallback / error
- aggregate provider duration
- client timeout event where appropriate without sensitive location payload

Prefer existing logging conventions.

Logging must not flood normal production operation or expose full provider query bodies containing coordinates.

If adding production telemetry requires a new external service or secret, do not do that here. Implement only repository-native bounded logging or document the limitation.

---

# Source/behavior invariants

Do not regress:

- Pick For Us branding
- Dinner filters/options
- Date Night ordinary behavior
- Spooky Season controls
- seasonal F01–F06 fixes
- V-F03-01 lifecycle precedence fix
- seasonal coverage disclosure
- Nightlife behavior
- manual location and GPS controller semantics
- favorites/history/settings
- casino catalogs/invariants
- Android Phase B architecture
- production URL assumptions
- migration-free Vercel build configuration

No venue additions or catalog changes are authorized.

---

# Required validation

Against the final implementation tree, run at minimum:

- clean dependency install if environment permits
- complete dependency tree
- typecheck
- full JavaScript suite
- all new loading/deadline/cancellation tests
- existing 17 seasonal regression groups
- availability tests
- location-discovery tests
- relevant Python verifier tests
- changed-code lint
- casino invariants
- Android structural/icon checks
- Capacitor sync/tracked-byte stability
- migration-free production build
- `git diff --check`
- secret/generated-junk sanity

Browser acceptance:

If available, run bounded browser acceptance for Dinner, Date Night and Nightlife with controlled/failing providers where architecture permits.

Do not claim browser acceptance if unavailable.

Do not use live provider instability as the only proof of deadline correctness.

---

# Performance acceptance

The implementation/evidence must demonstrate:

- provider chain all-stall ≤20s + small tolerance
- client unresolved transport settles UI ≤25s + small tolerance
- server fallback received before watchdog remains fallback, not timeout
- client timeout does not allow stale late responses to overwrite state
- replacement/navigation cancellation works

If deterministic tests cannot establish these, remediation is incomplete.

---

# Audit artifact preservation

Persist the original incident audit report/JSON/evidence unchanged if they are not already committed and are available.

Do not rewrite the audit conclusion.

Create separate remediation evidence, suggested:

- `audit/production-loading-hang-remediation-1-2026-09-30.md`
- `audit/production-loading-hang-remediation-1-2026-09-30.json`

Record:

- starting SHA/tree
- original audit artifact hashes
- changed paths
- PLH-F01 mapping
- PLH-F02 mapping
- PLH-F03 mapping
- timing policy implementation
- cancellation/watchdog implementation
- observability implementation
- regression tests
- exact commands/results
- source hashes
- limitations
- resulting checkpoint

Update continuity according to repository convention without rewriting historical evidence.

---

# Scope limits

Do NOT:

- redesign discovery ranking/query vocabulary
- add/remove provider mirrors
- add venues
- modify seasonal acquisition semantics except where needed to use the shared deadline helper without changing query meaning
- change saved fallback coverage
- change radius semantics
- change Vercel settings
- run migrations
- rollback
- merge
- deploy
- publish Android/Play
- add external observability vendors
- perform unrelated refactors

---

# Commit/push protocol

If and only if remediation and validation pass:

1. Review complete diff.
2. Verify every executable change maps to PLH-F01/F02/F03.
3. Verify original incident evidence is preserved.
4. Commit the remediation checkpoint to `audit/production-loading-hang-1`.
5. Push.
6. Report exact SHA/tree/sole parent.
7. Confirm clean working tree.
8. STOP.

Do not merge or deploy.

## Completion state

Success:

`PRODUCTION LOADING HANG REMEDIATED — AWAITING INDEPENDENT VERIFICATION`

Incomplete/failure:

`PRODUCTION LOADING HANG REMEDIATION INCOMPLETE — REVIEW REQUIRED`

A fresh Astra must independently verify the immutable remediation checkpoint before any main promotion.
