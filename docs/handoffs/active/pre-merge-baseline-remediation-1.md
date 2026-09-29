# Pick For Us — Pre-Merge Baseline Remediation 1

## Repository and scope

Repository: `caleb1234calvin-art/dinner-roulette`

Working branch: `polish/pre-google-play-pass-1`

Target baseline after later independent verification: `main`

This is a **targeted remediation task**. It is not a merge, deployment, publication, Play Console, signing, or unrelated cleanup task.

The authoritative independent audit is:

- `pick-for-us-pre-merge-baseline-audit-2026-09-29.md`
- corresponding audit evidence bundle: `pick-for-us-pre-merge-baseline-audit-evidence-2026-09-29.zip`

If those artifacts are not already tracked at the expected repository location, locate the exact audit artifacts available to the worker before modifying code. Do not substitute memory or this summary for the detailed audit evidence.

## Required starting checkpoint

The independent audit examined candidate:

`d5eba7d4829622435cbb097f38f2f98af572b5b7`

against main:

`6b811ae427339902f456c2706330689c2d6ad54b`

with merge base:

`6b811ae427339902f456c2706330689c2d6ad54b`

Audit relationship: candidate ahead 17, behind 0.

Before modifying anything:

1. Fetch current remote refs.
2. Verify the working branch is `polish/pre-google-play-pass-1`.
3. Verify the expected audited checkpoint is present in branch history.
4. Inspect whether any later commits exist.
5. If later commits materially alter any F01/F02/F03 remediation surface, stop and report the discrepancy rather than applying this handoff blindly.
6. Confirm a clean working tree.

## Mission

Remediate **exactly the three merge-gating findings F01, F02, and F03** from the independent pre-merge audit.

Do not expand scope.

F04 and F05 are explicitly deferred and must not be remediated during this task.

After remediation, run the required gates, record evidence, create one remediation checkpoint commit, push it to `polish/pre-google-play-pass-1`, and stop.

**Do not merge.**

---

# F01 — BLOCKER — stale casino browser acceptance locator

## Audit finding

The approved UI now renders:

`Pick For Us in 30 seconds`

but both casino browser harnesses retain the old first-run tour expectation:

`Dinner Roulette in 30 seconds`

Known locations from the audit:

- `scripts/casino-browser-smoke.mjs:86`
- `scripts/casino-browser-live-check.mjs:70`

The deterministic stock casino browser suite timed out before completing any scenario group because of this stale locator.

The main-PR validation path invokes the deterministic harness through `.github/workflows/validate-icon-pack.yml`.

## Required remediation

Update **both** stale casino harness expectations to the approved Pick For Us tour title.

Requirements:

- Preserve the actual first-run-tour assertion.
- Do not bypass or auto-dismiss the tour merely to make tests green.
- Do not weaken the locator into an assertion that would also accept the old name.
- Do not skip scenario groups.
- Do not revert the public rebrand.
- Do not alter casino selection behavior unless a new independent defect is discovered; if that happens, stop and report it rather than expanding this remediation.

## Required F01 validation

At minimum:

1. Run the deterministic casino browser smoke/acceptance harness against the exact remediated head.
2. Verify it completes all expected scenario groups.
3. Run the repository validation path equivalent to the relevant main-PR check in `.github/workflows/validate-icon-pack.yml`.
4. Statically verify the live-provider harness contains the corrected locator.
5. If a live-provider run is performed, report it separately from deterministic fixture acceptance. A live-provider run is not required merely to prove the stale locator is fixed unless repository standards require it.

---

# F02 — IMPORTANT — incomplete current public rebrand

## Audit finding

Seven **current user-visible** strings across five components still use Dinner Roulette.

These are not historical evidence, internal keys, repository names, hosted URLs, or historical APK names.

Exact audited locations:

1. `src/components/pick-home.tsx:360`
   - Dinner provider-fallback notice

2. `src/components/nightlife-home.tsx:194`
   - Nightlife/casino provider-fallback notice

3. `src/components/date-night-home.tsx:356`
   - Seasonal provider-fallback notice

4. `src/components/date-night-home.tsx:357`
   - Normal Date Night provider-fallback notice

5. `src/components/result-overlay.tsx:109`
   - Dinner external-delivery disclosure

6. `src/components/result-overlay.tsx:110`
   - Nightlife/casino discovery disclosure

7. `src/components/date-night-plan-overlay.tsx:55`
   - Seasonal-plan explanation

The independent audit reproduced two of these visibly in the browser.

## Required remediation

Update those seven current public strings from Dinner Roulette branding to **Pick For Us**, preserving the meaning of each notice/disclosure.

Do not perform a blind global replacement.

Preserve old names where historically or technically appropriate, including:

- historical audit/continuity evidence
- artwork provenance notes
- internal storage/event keys
- repository identifiers
- existing hosted URL
- historical APK/release names
- other explicitly historical references

Do not alter behavior merely to change copy.

## Required F02 validation

At minimum:

1. Verify all seven audited current strings are corrected.
2. Search current runtime/user-facing source for remaining visible Dinner Roulette branding and classify every remaining hit rather than blindly replacing it.
3. Verify normal Dinner fallback/disclosure surfaces.
4. Verify Nightlife/casino fallback/disclosure surfaces.
5. Verify normal Date Night fallback surfaces.
6. Verify Halloween/seasonal Date Night fallback/plan surfaces.
7. Run relevant typecheck, changed-code lint, tests, and browser checks.

If a remaining old-name occurrence is intentionally retained, document exactly why it is historical, internal, hidden, or otherwise non-public.

---

# F03 — IMPORTANT — invalid Nitro / unstorage lru-cache resolution

## Audit finding

The candidate lockfile removed Nitro's compatible nested `lru-cache` resolution.

Fresh audit reproduction:

- candidate `npm ci --no-audit --no-fund`: PASS
- candidate `npm ls --all --json`: FAIL / exit 1
- `unstorage` requires optional peer `lru-cache ^11.2.6`
- candidate resolution reaches root `lru-cache 5.1.1`
- main control resolves compatible `nitro/node_modules/lru-cache 11.5.2`
- main control `npm ls`: exit 0

The audit did not observe a current application crash, but the invalid dependency graph must not become canonical unnoticed.

## Required remediation

Restore a valid `lru-cache` resolution satisfying Nitro/unstorage's `^11.2.6` requirement.

Constraints:

- Preserve the required Capacitor 8.5.2 additions.
- Preserve unrelated pinned web dependencies.
- Do not perform a broad dependency upgrade.
- Do not use `--force`, `--legacy-peer-deps`, or equivalent suppression to hide the invalid graph.
- Do not simply ignore `npm ls` failure.
- Prefer the smallest deterministic package/lockfile change that restores valid module resolution.
- Understand and document why the chosen package/lockfile change produces the intended Nitro/unstorage resolution.

## Required F03 validation

From a clean dependency state:

1. `npm ci --no-audit --no-fund` must pass.
2. `npm ls --all` (or JSON equivalent) must exit successfully.
3. Directly inspect the Nitro/unstorage `lru-cache` resolution and verify it satisfies `^11.2.6`.
4. Verify no unrelated direct dependency drift.
5. Run the full JavaScript test suite.
6. Run typecheck.
7. Run changed-code lint.
8. Run the migration-free production web build documented by current continuity/release instructions.
9. Confirm lockfile remains unchanged after clean install.

Do not invoke the repository's migration-triggering ordinary build if current authoritative continuity instructs use of the migration-free direct Vite build.

---

# Explicitly deferred findings

## F04 — duplicate icon master

`public/grok_1789541884918.jpg` is a byte-identical unused duplicate of:

`public/brand/grok_1789541884918.jpg`

**Do not remove it in this remediation.**

It is non-blocking and may be cleaned in a separately authorized task after baseline consolidation.

## F05 — inherited immediate Mordax media-failure resilience

The audit found an inherited event-only dismissal weakness where an immediate media failure can leave the startup overlay visible.

The relevant source behavior is inherited from main and was not established as a new candidate regression.

**Do not modify startup-ident resilience in this remediation.**

It belongs to a separate robustness task.

---

# Android / release invariants to preserve

The independent audit found the Android Phase B architecture consistent with the validated unsigned candidate.

Do not redesign or unnecessarily regenerate it.

Preserve:

- package: `com.calebcalvin.pickforus`
- app label: `Pick For Us`
- versionCode: `1`
- versionName: `1.0.0`
- min / compile / target SDK: `24 / 36 / 36`
- Capacitor core/Android/CLI: `8.5.2`
- AGP: `8.13.0`
- Gradle: `8.14.3`
- Java 21 expectation
- approved icon master at `public/brand/grok_1789541884918.jpg`
- deterministic launcher derivatives
- foreground location permissions
- fail-closed normal release signing
- explicit unsigned validation path
- artifact-only Android CI
- no Play publisher
- no automatic public GitHub APK release
- existing hosted runtime URL
- historical `android-latest` release unchanged

No signing credentials are part of this task.

---

# Product/runtime invariants to preserve

Do not regress:

- Dinner
- Nightlife
- Date Night
- Halloween/seasonal behavior
- casino catalog and routing
- location/international behavior
- favorites
- history
- settings
- themes
- navigation
- analytics
- external links
- Mordax approved presentation
- current Android release-preparation messaging

Casino invariant expected by the audit:

- 883 canonical
- 899 serialized rows
- 60 catalog passes

Do not change casino inventory during this remediation.

---

# Required final validation

After all three findings are remediated, run the relevant gates against the exact final working tree.

At minimum include:

- clean dependency install
- successful complete dependency-tree inspection
- direct Nitro/unstorage LRU resolution inspection
- typecheck
- full JavaScript tests
- changed-code lint
- Android structural check
- Android icon check as currently defined
- Capacitor sync / tracked-byte stability if current repository procedure requires it
- casino invariant audit
- deterministic casino browser acceptance
- relevant main-PR validation path
- location browser suite if executable in the environment
- migration-free production web build
- targeted browser verification of corrected public branding, including normal and seasonal surfaces
- `git diff --check`
- secret/generated-junk sanity review for remediation changes

Do not claim physical Android/WebView acceptance, signed AAB validation, Play Console validation, or production deployment.

Existing verified native Phase B evidence may remain relied upon if executable/native inputs are unchanged by this remediation. If remediation changes native executable inputs, rerun the affected native gates.

---

# Evidence and continuity

Create a remediation evidence record under the repository's existing `audit/` evidence convention.

Suggested name:

`audit/pick-for-us-pre-merge-baseline-remediation-1-2026-09-29.json`

Record at minimum:

- audited base candidate SHA
- actual remediation starting SHA
- exact changed paths
- exact F01 changes
- exact F02 changes
- exact F03 dependency-resolution change
- commands run
- exit results
- test totals
- browser scenario totals
- dependency-resolution evidence
- casino invariant result
- build result
- limitations
- explicitly deferred F04/F05
- final remediation commit SHA or a clearly documented post-commit evidence linkage strategy

Update the TOP current section of `AI_CONTINUITY.md` with a concise remediation checkpoint.

Do not overwrite or rewrite historical Phase B/audit evidence.

---

# Commit / push / stop protocol

When all required remediation and validation pass:

1. Review the complete remediation diff.
2. Confirm only F01/F02/F03 plus required tests/evidence/continuity changed.
3. Confirm F04/F05 were not remediated.
4. Commit the remediation checkpoint to:
   `polish/pre-google-play-pass-1`
5. Push the branch.
6. Record/report the exact resulting commit SHA.
7. Confirm the working tree is clean.
8. STOP.

Do not merge.

Do not deploy.

Do not publish.

Do not sign a production bundle.

Do not upload to Play.

---

# Failure protocol

If any required gate fails for a reason not directly attributable to F01/F02/F03:

- investigate enough to classify the failure,
- preserve evidence,
- do not expand into unrelated remediation,
- report the blocker and stop if resolving it would exceed this handoff.

If remediation reveals that the independent audit assumptions are materially wrong, stop and report rather than improvising a broader project change.

---

# Completion state

Successful completion should be reported as:

`REMEDIATED_AWAITING_INDEPENDENT_VERIFICATION`

This task does **not** declare the branch merge-ready.

A fresh independent worker must verify the remediation checkpoint before any merge decision.
