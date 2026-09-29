# Pick For Us — Pre-Merge Baseline Remediation 1 — Independent Verification

## Repository

`caleb1234calvin-art/dinner-roulette`

## Branch

`polish/pre-google-play-pass-1`

## Verification target

`8bd1a0b47c3b1b0dbeafddede2e4f2e0ca30728f`

Expected sole parent:

`9a33daa692b8408395b1198f30e8a30932bace92`

Original audited candidate:

`d5eba7d4829622435cbb097f38f2f98af572b5b7`

Main at original audit:

`6b811ae427339902f456c2706330689c2d6ad54b`

## Nature of this task

This is an **independent, read-only remediation verification**.

The implementation worker reported:

`REMEDIATED_AWAITING_INDEPENDENT_VERIFICATION`

Your job is to independently determine whether the exact target checkpoint actually remediates F01, F02 and F03 without introducing a new merge blocker.

Do not trust the implementation worker's conclusion merely because it is recorded in continuity or evidence.

Use the repository state, original audit, remediation handoff, remediation evidence, Git history and fresh validation.

## Hard prohibitions

DO NOT:

- modify repository files
- fix defects
- commit
- push
- merge
- deploy
- publish
- sign a release
- generate credentials
- upload to Google Play
- change Vercel
- remove F04
- modify F05
- broaden scope into unrelated cleanup

If verification fails, preserve the failure and report it. Do not repair it.

---

# Required reading

Read IN FULL before verification:

1. `docs/handoffs/active/pre-merge-baseline-remediation-1.md`
2. the independent pre-merge audit report:
   `pick-for-us-pre-merge-baseline-audit-2026-09-29.md`
3. its corresponding evidence bundle if available
4. `audit/pick-for-us-pre-merge-baseline-remediation-1-2026-09-29.json`
5. the TOP current checkpoint in `AI_CONTINUITY.md`
6. `ANDROID_RELEASE.md` where relevant to preserved Android invariants

Treat the original audit as authority for the findings being remediated.

Treat the remediation handoff as authority for permitted implementation scope.

Treat implementation evidence as a claim to verify, not as proof by itself.

---

# Checkpoint integrity

Before testing:

1. Fetch current remote refs.
2. Verify the target commit exists.
3. Verify target SHA exactly:
   `8bd1a0b47c3b1b0dbeafddede2e4f2e0ca30728f`
4. Verify its sole parent exactly:
   `9a33daa692b8408395b1198f30e8a30932bace92`
5. Verify the parent contains the remediation handoff and that the original audited candidate is in ancestry.
6. Verify the target's exact tree in a clean detached/fresh checkout.
7. Do not silently verify a later branch head if it has moved. Verification is pinned to the immutable target SHA.

---

# Scope-diff verification

Independently compare:

`9a33daa692b8408395b1198f30e8a30932bace92...8bd1a0b47c3b1b0dbeafddede2e4f2e0ca30728f`

Confirm the implementation is bounded to:

- F01 harness locator corrections
- F02 seven public-copy corrections
- F03 dependency-resolution repair
- required evidence
- required continuity

Confirm F04 and F05 were not remediated.

Flag any unrelated behavioral change.

---

# F01 independent verification

Original finding:

Both casino harnesses expected:

`Dinner Roulette in 30 seconds`

while the approved UI renders:

`Pick For Us in 30 seconds`.

Required verification:

1. Inspect both:
   - `scripts/casino-browser-smoke.mjs`
   - `scripts/casino-browser-live-check.mjs`
2. Confirm both require the exact approved Pick For Us tour title.
3. Confirm the assertion was not weakened to accept both old/new names.
4. Confirm the tour is not bypassed.
5. Confirm scenario groups were not skipped.
6. Freshly run the deterministic casino browser acceptance harness.
7. Verify all expected deterministic casino groups complete.
8. Freshly run the relevant local equivalent of the main-PR validation path that invokes this acceptance behavior.
9. Distinguish any live-provider test from deterministic fixture acceptance.
10. A live-provider run is not required solely for this verification unless current repository procedure requires it.

F01 passes only if the previously broken acceptance path is genuinely restored.

---

# F02 independent verification

Original finding:

Seven current user-visible strings retained Dinner Roulette.

Audited locations:

- `src/components/pick-home.tsx:360`
- `src/components/nightlife-home.tsx:194`
- `src/components/date-night-home.tsx:356`
- `src/components/date-night-home.tsx:357`
- `src/components/result-overlay.tsx:109`
- `src/components/result-overlay.tsx:110`
- `src/components/date-night-plan-overlay.tsx:55`

Required verification:

1. Independently inspect all seven surfaces.
2. Confirm each now uses Pick For Us appropriately.
3. Confirm surrounding behavioral code is unchanged except where required for the copy replacement.
4. Search current runtime/user-facing source for remaining Dinner Roulette / Pick For Me branding.
5. Classify every remaining hit.
6. Do not classify historical evidence, internal identifiers, storage/event keys, repository/host identifiers, historical APK names or hidden non-user-facing provenance as current public-brand failures without evidence.
7. Freshly verify corrected surfaces in browser/runtime fixtures where feasible:
   - Dinner fallback
   - Dinner disclosure
   - Nightlife/casino fallback
   - Nightlife/casino disclosure
   - normal Date Night fallback
   - seasonal Date Night fallback
   - incomplete seasonal plan explanation
8. Verify both normal and Halloween/seasonal paths.
9. Confirm no user-visible old brand remains in the audited current surfaces.

F02 passes only if the public rebrand defect is actually closed without unrelated behavior changes.

---

# F03 independent verification

Original finding:

The candidate dependency tree resolved Nitro/unstorage's optional `lru-cache ^11.2.6` requirement to incompatible root `lru-cache 5.1.1`, and `npm ls --all` exited 1.

Implementation claims an exact `lru-cache 11.5.2` development pin restores the compatible Nitro/unstorage resolution while preserving Babel's required 5.1.1 resolution.

Required verification from a clean dependency state:

1. Inspect `package.json` and `package-lock.json`.
2. Determine exactly what dependency change was made.
3. Confirm there was no broad unrelated dependency upgrade.
4. Run:
   `npm ci --no-audit --no-fund`
5. Confirm the lockfile does not mutate.
6. Run:
   `npm ls --all`
   or an equivalent complete JSON inspection.
7. Require successful exit.
8. Directly inspect Nitro/unstorage's resolved `lru-cache`.
9. Confirm it satisfies `^11.2.6` and exposes the expected modern API.
10. Confirm consumers requiring the old 5.x dependency still receive an appropriate compatible nested resolution where required.
11. Confirm no force/legacy-peer suppression is hiding invalid resolution.
12. Run the full JavaScript test suite.
13. Run typecheck.
14. Run changed-code lint.
15. Run the migration-free production web build specified by current continuity/release instructions.

F03 passes only if the dependency graph is genuinely valid rather than merely installable.

---

# Regression / invariant verification

Freshly verify enough surrounding gates to establish that remediation did not destabilize the candidate.

At minimum:

- clean install
- dependency-tree validity
- typecheck
- full JavaScript tests
- relevant Python verifier tests
- changed-code lint
- Android structural/icon checks
- Capacitor sync / tracked-byte stability if current procedure requires it
- casino invariant audit
- deterministic casino browser acceptance
- location browser suite if environment supports the repository's documented fixture path
- migration-free production build
- seven corrected branding surfaces
- `git diff --check`
- clean source checkout after validation

Expected casino invariant remains:

- 883 canonical
- 899 serialized
- 60 catalog passes

Do not change casino data.

---

# Main-PR validation warning handling

The remediation evidence records a workspace-specific Node 22 UNDICI-EHPA warning that polluted a CLI JSON assertion and states that only that warning was filtered for local validation while assertions/network preload remained unchanged.

Independently inspect this claim.

Verification must determine that:

- product assertions were not weakened,
- scenario assertions were not skipped,
- warning handling does not hide actual stderr/errors that matter,
- the relevant main-PR-equivalent path genuinely passes under the documented environment.

If the warning adjustment masks meaningful failure output, verification fails.

---

# Android / native evidence boundary

The remediation claims Android source/config/workflow inputs were unchanged.

Verify that claim from the remediation diff.

If native executable inputs are unchanged, it is acceptable to rely on the previously validated Phase B native evidence rather than rebuilding the Android SDK/Gradle toolchain solely for this verification.

Do not claim a fresh native build if none was run.

Preserved expected Android state includes:

- `com.calebcalvin.pickforus`
- Pick For Us
- version 1 / 1.0.0
- SDK 24 / 36 / 36
- Capacitor 8.5.2
- AGP 8.13.0
- Gradle 8.14.3
- Java 21 expectation
- approved launcher derivatives
- fail-closed signing
- explicit unsigned validation
- artifact-only CI
- no Play/public-release publisher

---

# Deferred findings

Confirm both remain deferred and untouched:

## F04
Unused byte-identical root icon duplicate:
`public/grok_1789541884918.jpg`

Do not remove it.

## F05
Inherited immediate Mordax media-error overlay resilience weakness.

Do not modify startup resilience.

These do not fail remediation verification merely by remaining present.

---

# Secret / generated-junk sanity check

Verify the remediation commit introduces no:

- credentials
- passwords
- private keys
- keystores
- tokens
- service-account data
- local.properties
- machine-specific SDK paths
- APK/AAB build outputs
- temporary build directories
- unrelated generated debris

---

# Evidence integrity

Review:

`audit/pick-for-us-pre-merge-baseline-remediation-1-2026-09-29.json`

Cross-check its important claims against fresh results.

Do not require a self-referential commit SHA inside a file committed by that same commit.

Use Git history to establish the evidence record's containing checkpoint.

Report material discrepancies between evidence and fresh verification.

---

# Production / release boundary

This verification does NOT authorize:

- merge to main
- Vercel deployment
- database migration
- signing
- Play Console action
- Play upload
- publication

The original audit left automatic next-main-merge Vercel behavior and effective hosted build command UNVERIFIED.

Do not convert remediation verification into release authorization.

---

# Verification outcome

End with exactly one of:

`REMEDIATION VERIFIED — PRE-MERGE CANDIDATE READY`

or

`REMEDIATION VERIFICATION FAILED`

Use the first state only if:

- F01 is independently closed,
- F02 is independently closed,
- F03 is independently closed,
- required regression gates pass,
- no new merge blocker was introduced,
- scope remained bounded,
- F04/F05 remain properly deferred.

If verification fails, report exact evidence and stop.

Do not fix.

---

# Final report

Report:

1. Verification target SHA
2. Sole parent SHA
3. Tree/checkpoint integrity
4. Exact remediation diff scope
5. F01 result and fresh browser totals
6. F02 result and remaining-brand classification
7. F03 result and exact LRU resolution
8. Test/typecheck/lint results
9. Casino invariant result
10. Location-browser result
11. Build result
12. Main-PR-equivalent validation result
13. Android/native evidence status
14. F04/F05 deferred-state confirmation
15. Secret/generated-junk result
16. Evidence-record consistency
17. Any limitations
18. Whether any new merge blocker exists
19. Final verification state

DO NOT MODIFY.
DO NOT COMMIT.
DO NOT PUSH.
DO NOT MERGE.
DO NOT DEPLOY.
DO NOT PUBLISH.

Stop after independent verification.
