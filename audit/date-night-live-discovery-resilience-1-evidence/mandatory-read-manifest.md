# Historical invariants read gate

Reader: /root/history_invariants. Read-only review; no repository source/branch edits.

## Read in full from frozen checkout or authoritative source

- ../authoritative-handoff.md (entire 1,273-line instruction, reread bounded chunks after first tool truncation).
- docs/handoffs/active/production-loading-hang-remediation-1.md
- docs/handoffs/active/production-loading-hang-remediation-1-verification.md
- audit/production-loading-hang-remediation-1-2026-09-30.md
- audit/production-loading-hang-remediation-1-2026-09-30.json
- audit/production-loading-hang-audit-1-2026-09-30.md
- audit/production-loading-hang-audit-1-2026-09-30.json (entire 2,019 lines)
- AI_CONTINUITY.md (entire 310 lines)
- package.json
- scripts/tanstack-security.test.mjs (entire 271 lines)
- ANDROID_RELEASE.md
- scripts/test-runner.mjs
- scripts/with-app-env.mjs
- vite.config.ts
- vercel.json

## Read in full from remote Git objects

- origin/fix/pickforus-halloween-verification-notice-1:docs/handoffs/active/pickforus-halloween-verification-notice-remediation-1.md
- same ref:docs/handoffs/active/pickforus-halloween-verification-notice-remediation-1-continuation.md
- origin/verify/pickforus-halloween-verification-notice-1:docs/handoffs/active/pickforus-halloween-verification-notice-verification-1.md
- origin/fix/pickforus-halloween-verification-notice-v-hvn-01-remediation-1:docs/handoffs/active/pickforus-halloween-verification-notice-v-hvn-01-remediation-1.md
- same ref:docs/handoffs/active/pickforus-halloween-verification-notice-v-hvn-01-remediation-1-continuation.md
- origin/verify/pickforus-halloween-verification-notice-v-hvn-01-1:docs/handoffs/active/pickforus-halloween-verification-notice-v-hvn-01-verification-1.md
- origin/promote/pickforus-halloween-verification-notice-v-hvn-01-1:docs/handoffs/active/pickforus-halloween-verification-notice-v-hvn-01-controlled-main-promotion-1.md
- origin/verify/pickforus-tanstack-security-1:docs/handoffs/active/pickforus-tanstack-security-verification-1.md

## Supporting Halloween reports read in full

These reports are absent from corresponding remote Git trees and were read through authenticated Library access using known file IDs:

- pickforus-halloween-verification-notice-remediation-1-2026-10-02-2.md (libfile_bb398bdfd89881918dd625b5a88d5f48)
- pickforus-halloween-verification-notice-verification-1-2026-10-02.md (libfile_139ad1230b1c8191a3b1ddb3a79ba773)
- pickforus-halloween-verification-notice-v-hvn-01-remediation-1-2026-10-02-1.md (libfile_266bbdf467f88191bbd61c4ac9d8a22a)
- pickforus-halloween-verification-notice-v-hvn-01-verification-1-2026-10-02.md (libfile_2177ed5c58bc8191845c83497f4ea55b)

Supporting large Halloween machine JSON began retrieval but is not claimed read in full; full Markdown evidence provides the relevant findings and preserved invariants. No mandatory explicit loading JSON was omitted.

## Critical invariants

- Keep provider aggregate 20,000 ms and client watchdog 25,000 ms initially. Preserve signal forwarding, explicit UI timeout settlement independent of transport compliance, stale-result invalidation before abort, cleanup and working retry. Browser disconnect does not currently imply immediate server cancellation; server work must independently end.
- Dinner remains serial with mode-specific successful-empty precedence; Nightlife remains serial and accepts valid empty immediately. Existing Date Night serial timing assertions intentionally need targeted updates, not global weakening.
- Halloween caution remains exact, static role=note, Halloween-only, source-independent and visible loading/settled. Exact fallback sentence remains. Preserve pb-56 Halloween versus pb-48 ordinary and >=8px maximum-scroll fallback clearance at 320x568 and 390x844. Existing tests alone did not catch CSS occlusion.
- Keep pinned TanStack requests/lock unchanged. Security suite uses actual compiled Nitro/Start output, real client codec, GET/POST fixtures, CSRF/method enforcement, internal marker rejection, legitimate Response behavior, hostile validator input and transport cancellation.
- TanStack suite currently assumes five provider calls for five RPC functions, calls[0]/calls[1] seasonal body ordering, and three all-stall attempts per mode. Date Night-only expectations must adapt to decomposition/hedging while preserving other modes and security assertions.
- Migration-free production command: VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production. Never npm run build (chains db:migrate). Run build before security suite/full npm test because security suite imports built .vercel output.
- npm test invokes repository *.test.mjs and listed application .test.ts suites; do not double-count focused subsets. Four external documentation skips are inherited and permitted, not silent new skips.
- Preserve Android/config tracked bytes through npm run android:sync. Android remains online hosted shell; no new native build/signing/Play claim. Existing full lint has unrelated known no-empty and warnings; bounded changed-code lint accepted.
- Current AI_CONTINUITY TOP entry is historical Sept 30 state; current task's frozen gate supersedes it. Prepend new current continuity; preserve history.
- No reports from prior loading/seasonal audits may be overwritten. No main/production promotion, settings, migrations, catalog inventions, signing or publication.

## Validation commands

- npm ci --ignore-scripts --no-audit --no-fund (current security convention; no manifest/lock drift)
- npm ls --all
- npm run typecheck
- VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production
- node --test scripts/tanstack-security.test.mjs
- npm test
- node --test scripts/discovery-provider-deadlines.test.mjs scripts/discovery-client-lifecycle.test.mjs scripts/seasonal-discovery.test.mjs scripts/location-discovery.test.mjs
- node --experimental-strip-types --test src/lib/date-night/availability.test.ts src/lib/location/location.test.ts
- python3 -m unittest discover -s native-android -p 'test_*.py'
- bounded ESLint over changed code/tests
- npm run audit:casinos
- npm run android:check
- npm run android:sync, compare tracked Android/config bytes before/after
- git diff --check; secret/generated-junk sanity

No validation execution claimed by this reader. Parent agent owns fresh baseline/test results.

## Seasonal read-only reviewer manifest (complete)

- All six seasonal active handoffs: coverage audit, remediation, independent verification, verification finding, V-F03-01 verification, controlled main promotion.
- All three `audit/seasonal-discovery-{coverage-audit-1,remediation-1,v-f03-01-remediation-1}-2026-09-29.md` and corresponding JSON reports (actual V-F03 basename `seasonal-discovery-v-f03-01-remediation-1`).
- Corresponding evidence manifests; V-F03 preflight, gates, final-sanity JSON; regression-before, regression-before-corrected, regression-after, seasonal and availability logs; prior verification report, confirmation JSON and log.
- Full `src/lib/date-night/{provider-evidence,eligibility,availability,coverage,season,search,types}.ts` and `scripts/seasonal-discovery.test.mjs`; date-night component test harness.

## Primary implementation reader

- Authoritative handoff fully read at exact instruction commit; full core provider-chain/client-request/search modules, both Date Night UI panels, types/season/provider-evidence/eligibility/availability/coverage/use-clock/location model.
- Full provider-deadline, client-lifecycle and TanStack security scripts; shared loader, fake clock, test runner and discovery component harness.
- Mandatory full reads delegated by artifact family and confirmed complete before milestone 1 executable edits.
- No historical evidence modified. New records in this directory are specific to this remediation.
