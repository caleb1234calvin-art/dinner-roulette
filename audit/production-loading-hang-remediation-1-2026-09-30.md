# Pick For Us — Production Loading Hang Remediation #1

Date: 2026-09-30. Branch: `audit/production-loading-hang-1`.

**PRODUCTION LOADING HANG REMEDIATED — AWAITING INDEPENDENT VERIFICATION**

PLH-F01, PLH-F02 and PLH-F03 are implemented and pass the required local validation. This is a remediation checkpoint, not independent verification or authorization to promote main.

## Starting authority and integrity

Read the remediation and incident handoffs, original report/JSON and supporting evidence, current TOP continuity, and complete discovery/location/transport lifecycles before implementation. Fresh fetch verified:

| Item | Exact value |
|---|---|
| Start / required sole parent | `6cc0a2b76613c52dbf4a6ea4e9a55494287cb057` |
| Starting tree | `9e8bec1ee5b33237a015e1d0d9c41b5ac090be45` |
| Frozen main | `66eed1409e1076bcea388f36891c31fa7fa3eb84` |
| Main tree | `c016f0f8ac934adb0494cfa479012993972011fc` |
| Incident audit checkpoint | `6959ac4712bac0b26bca32879cce473e66b6eef3` |
| Audit tree | `63ad41ee6a2b25a3af02b2fb1333f994a5554292` |
| Production deployment | `dpl_Bd4mLsVSBtaYi5THxgdo1VqCs4qm`, READY, exact frozen main |

The clean isolated checkout had only the incident handoff and remediation handoff above frozen main. No unreviewed executable descendant existed. A final fresh fetch before commit again matched frozen main and the starting branch SHA. The prior audit's working directory was not reset or edited.

Original incident evidence is preserved byte-for-byte: the report and JSON are separate files under `audit/`; the original 47-member ZIP is committed as `audit/production-loading-hang-audit-1-evidence-2026-09-30.zip`. All 44 original manifest entries match; every ZIP member matches the original artifact. Extract the ZIP from the repository root to recover its original `audit/production-loading-hang-audit-1-evidence/` paths. The historical audit conclusion remains unchanged.

| Original artifact | SHA-256 |
|---|---|
| Report | `25e70c91bc986a8fa0c18cbfbf1d033f53416f191e6b2b500462b90e6d296864` |
| JSON | `03d6ade45704f1f53fb0cde3ed642af0bd77bcbcc09066c2e2d20b877122e313` |
| ZIP | `261893fe60427cfe8ad475f85d9d1845cc73c2f11594bb278779a4d1d8fd1f6b` |

## Finding mapping and behavior

**PLH-F01:** `src/lib/discovery/provider-chain.ts` owns a monotonic 20,000-ms aggregate deadline and a maximum 8,000-ms mirror attempt. Dinner, ordinary/seasonal Date Night and Nightlife use the same helper. Each timeout is `min(8000, remaining)` and stays armed through response-body JSON completion and normalization. Every attempt clears its timer and aborts its controller, including unread HTTP-error bodies. No new mirror starts after exhaustion. No retries or backoff were added.

The existing mirror order and query text are unchanged. Dinner continues after valid empty responses and retains successful-empty precedence if later mirrors fail. Date Night and Nightlife accept the first valid empty response and retain their local merge behavior. Saved coverage, outside-coverage terminal errors, radius semantics and source/warning disclosure are preserved. HTTP and malformed-response errors retain their existing messages; typed categories are used only for bounded logging.

**PLH-F02:** `src/lib/discovery/client-request.ts` is used by all three home components. Each request gets an AbortController and 25,000-ms watchdog. Its signal is supplied as the supported top-level TanStack RPC option. Timeout invalidates the request before aborting, explicitly clears loading through the settlement callback and shows a mode-specific timeout notice with a real **Try again** action. No fabricated saved data is supplied. Cleanup/unmount/replacement invalidate and abort the old request; old late success/rejection cannot write state or settle a new spinner. Success/fallback/error clear the watchdog. A received server fallback remains fallback.

The installed TanStack source and a test executing its real RPC fetcher prove exact signal forwarding to fetch. Its installed server handler context does not expose a cancellation signal; immediate cancellation of provider work on browser disconnect is not claimed. Provider work retains the independent 20-second bound.

**PLH-F03:** 95 permanent regression groups execute actual application handlers and home components: 41 provider cases and 54 client/transport cases. Provider coverage includes headers/body stalls, local fallback/foreign error, the 8s recovery path, immediate 429/500/504, invalid JSON, missing elements, incomplete responses, mode-correct empty results, cleanup, no post-budget mirror and observability privacy. Client coverage includes normal success/fallback/error/AbortError, an RPC that never settles or ignores abort, abort-compliant timeout, unmount/remount, location/radius/seasonal replacement, stale resolution/rejection in either order, post-timeout settlement, working retry, timer cleanup, filtering/options/pick and pinned RPC signal forwarding.

One structured provider summary is emitted per degraded/empty request, containing mode, final source, elapsed milliseconds, budget exhaustion and at most four mirror-ordinal/outcome/duration/status records. Ordinary first-mirror success is quiet. One client timeout event contains only mode and deadline. Logs contain no query bodies, coordinates, addresses, personal identifiers, secrets or raw provider exceptions. No external telemetry service or new dependency was added.

Changed runtime files: the two shared helpers; Dinner provider/search; Date Night search; Nightlife search; the three home components; and the existing notice's optional retry button. New permanent tests are `scripts/discovery-provider-deadlines.test.mjs`, `scripts/discovery-client-lifecycle.test.mjs` and their two `scripts/test-support/discovery-*` helpers. Source hashes and precise finding-to-path mappings are in the companion JSON.

## Timing and cancellation acceptance

| Gate | Dinner | Date Night | Nightlife |
|---|---:|---:|---:|
| Fake-clock all-stall headers/body, local fallback and foreign error | 20,000 ms | 20,000 ms | 20,000 ms |
| First timeout → second success | 8,000 ms | 8,000 ms | 8,000 ms |
| Never-settling/abort-ignoring RPC → visible timeout, loading false | 25,000 ms | 25,000 ms | 25,000 ms |
| Final native-clock all-stall → fallback | 20,023.007 ms | 20,022.844 ms | 20,022.631 ms |

All native results pass the explicit 500-ms scheduling/processing tolerance. A permanent local HTTP test also proves that a real fetch body stalled after headers rejects when the helper aborts; only that selected test's timer scheduling boundary is shortened to 100 ms to keep the suite fast. It is not presented as a real 8-second measurement. Full native 20-second measurements are separately retained with their executable evidence harness.

At 20s, a valid server fallback clears the client watchdog and remains fallback past 25s. Timeout/cleanup/replacement tests verify both abort issuance and the absence of stale state writes. A fresh request after timeout succeeds. Tests distinguish modeled component hooks/leaf controls from real browser rendering.

Six selected new checks were also run against an isolated extraction of the unchanged starting revision. All six failed as expected: Dinner/Date Night exceed 20s; all three clients remain loading at 25s; Nightlife already meets 20s but lacks the required structured summary. This demonstrates that the regressions detect the audited defects.

## Required validation

| Command / gate | Result |
|---|---|
| `npm ci --no-audit --no-fund` | PASS; 507 packages |
| `npm ls --all` | PASS; complete dependency tree |
| `npm run typecheck` | PASS |
| `npm test` | PASS; 488 passed, 0 failed; 4 inherited external-workspace documentation skips |
| New deadline/client suites | PASS; 95 permanent groups; included in full suite |
| Seasonal regression suite | PASS; all 17 groups, including V-F03-01 |
| Location-discovery suite | PASS; 10 groups |
| Availability + location model/controller subset | PASS; 6 + 20 tests |
| `python3 -m unittest discover -s native-android -p 'test_*.py'` | PASS; 3 tests |
| Explicit changed-code ESLint | PASS; all 14 runtime/test files plus native timing evidence harness |
| `npm run audit:casinos` | PASS; 883 canonical / 899 serialized / 60 catalogs |
| `npm run android:check` | PASS; identity/structure and 15 launcher resources |
| `npm run android:sync` and tracked-byte comparison | PASS; all 40 tracked Android/config files unchanged |
| Migration-free production build | PASS |
| Scope/integrity, secret/generated-junk sanity and `git diff --check` | PASS; retained evidence records |
| Browser acceptance | UNAVAILABLE; not claimed |

The exact production build command was:

```sh
VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production
```

No `npm run build` or database migration was run. Exact commands, exit codes and logs are retained under `audit/production-loading-hang-remediation-1-evidence/validation.json`. The final full suite, typecheck, lint, build and native timing run followed the final provider cleanup correction; unaffected install/config/native-byte gate inputs remain identical. The initial test run retained three harness-only failures (two singular Dinner-count assertions and one missing TanStack test runtime context); these were corrected and later runs pass. No product failure or skip was hidden. Raw command output is preserved byte-for-byte in `raw-validation-logs.zip`; readable `.log` copies only remove trailing whitespace/blank lines for the whitespace gate. The first whitespace check flagged those log-formatting characters; the final check passes after preserving raw bytes and normalizing the copies.

AST/source comparisons prove all three query/mirror declarations and unaffected normalization/merge/coverage functions are byte-identical. All 69 catalog/fallback files and protected location/store/selection/seasonal/configuration/native paths remain unchanged. Branding, favorites/history/settings, ordinary/seasonal filters, casino invariants and Android Phase B boundaries retain their existing behavior.

## Limits and platform margin

The production alias readback confirms the frozen READY deployment. Effective hosted `maxDuration` remains unavailable: the project connector rejected its documented argument schema, deployment metadata exposes no cutoff, and both repository configuration and the newly generated Node 24 Vercel function config omit it. **Platform margin cannot be verified from these sources.** The 20s provider budget and 25s client watchdog are application policies. No platform limit is invented and no Vercel setting was changed.

Chromium download/extraction failed, and the agent-browser daemon could not start. Browser hydration/layout, controlled browser RPC flows, physical Android/WebView and physical GPS acceptance are not claimed. Native-clock provider tests use real timers/controllers with mocked provider fetch; the separate local HTTP body test uses real fetch. Provider bounds depend on normal abort-compliant fetch/body behavior and responsive scheduling. Synchronous processing or a suspended browser/event loop cannot be preempted by a JS timer.

## Immutable checkpoint and stop

To avoid a self-referential evidence amend, the remediation checkpoint is defined as the unique commit introducing this report's companion JSON, with sole parent `6cc0a2b76613c52dbf4a6ea4e9a55494287cb057`:

```sh
git log --diff-filter=A --format=%H -- audit/production-loading-hang-remediation-1-2026-09-30.json
git show -s --format='%H %T %P' <resolved-commit>
```

The exact resulting SHA/tree/sole parent and remote readback are reported after the authorized push. No merge, main promotion, deployment command, settings change, migration, catalog/provider change or Android/Play publication is part of this checkpoint. A fresh Astra must independently verify the immutable checkpoint before any main promotion.

PRODUCTION LOADING HANG REMEDIATED — AWAITING INDEPENDENT VERIFICATION
