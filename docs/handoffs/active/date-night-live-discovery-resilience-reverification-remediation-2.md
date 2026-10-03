# Pick For Us — Date Night Live Discovery Resilience Reverification Remediation 2

Repository: `caleb1234calvin-art/dinner-roulette`

Instruction branch:
`handoff/date-night-live-discovery-resilience-reverification-remediation-2`

Required implementation branch:
`fix/date-night-live-discovery-resilience-reverification-remediation-2`

Failed immutable candidate:
`4e6ff124960d77be0c454ccfa0401c8a1ced35a1`

Failed candidate tree:
`a8abffa67584e64e03b37300967319b8e49f9c61`

Failed candidate sole parent:
`444a68dd17e058e11778f805311a768986481c0c`

Frozen production main:
`4d937e58d2a65567b54ac5271915bc85b498898b`

Independent reverification result:
`DATE NIGHT LIVE DISCOVERY RESILIENCE REVERIFICATION FAILED`

Historical blocker status at failed candidate:
- V-DR-01: FAILED — still reproducible through a fresh lifecycle representation
- V-DR-02: independently attacked with 21 probes and no resurrection reproduced; treat as PRESERVED unless a new concrete cache defect is found

---

## Authority

Read this handoff IN FULL before making executable changes.

This task is a narrow remediation of the single material blocker independently reproduced by the fresh reverifier against immutable candidate `4e6ff124960d77be0c454ccfa0401c8a1ced35a1`.

The failed candidate must remain preserved as failed reverification history. Do not amend it, rewrite its evidence to imply success, or promote it.

Create the implementation branch directly from the failed immutable candidate, not from this instruction branch.

No unrelated architecture, feature, catalog, dependency, build-system, native, auth, database, Vercel, branding, or production work is authorized.

V-DR-02 cache supersession behavior passed the fresh independent attack set. Do not modify `src/lib/date-night/cache.ts` unless this remediation independently reproduces a new cache defect that cannot be solved elsewhere. If no new cache defect exists, preserve cache source byte-for-byte.

---

# Reverification blocker

## V-DR-01 — lifecycle interpretation/acquisition parity remains incomplete

### Independently reproduced failure

The reverifier constructed two synthetic provider records sharing identity through the same name and coordinates:

- Node 9201: `attraction=corn_maze`
- Node 9202: `attraction=pumpkin_patch`, `demolished=yes`

Spooky Season was active. Open Now was OFF.

An independently written query-aware provider stub exercised the actual Date Night query builder, handler, identity merge and eligibility path.

Observed eligibility:

| Selection | Eligible result |
| --- | --- |
| Anything | none |
| Corn + Pumpkin | none |
| Pumpkin only | none |
| Corn only | Node 9201 incorrectly eligible |

Corn-only acquisition returned only Node 9201, source=live, partial=false, with no terminal lifecycle evidence available to suppress it.

The reverifier also confirmed twelve independent prefixed-lifecycle controls remained correct, including reverse seasonal representations, Movies/Museum, result-order reversal and first-mirror failure.

### Root cause identified by reverifier

The failed candidate broadened category-independent lifecycle acquisition for prefixed lifecycle tags such as:

- `demolished:attraction=...`
- related category-specific lifecycle forms

However, the application's interpretation path recognizes additional lifecycle representations.

Specifically, `providerLifecycle()` recognizes:

`demolished=yes`

as permanent closure.

The acquisition-side lifecycle query vocabulary does not ensure that this representation is reachable independently of the selected positive category.

Therefore:

**the set of provider representations that can be interpreted as terminal lifecycle evidence is still broader than the set of representations that the lifecycle acquisition path guarantees it can fetch under category narrowing.**

That breaks the intended invariant.

---

# Core invariant to restore

This remediation is NOT merely "add demolished=yes to the Corn query."

The required invariant is:

> Any provider representation that the Date Night interpretation path can recognize as authoritative lifecycle-negative evidence for a potentially matching identity must remain discoverable by the lifecycle acquisition strategy regardless of which supported positive Date Night category is selected, subject to bounded provider query behavior and existing privacy/security constraints.

Interpretation vocabulary and acquisition vocabulary must not silently drift apart.

The remediation must close the representation class, not special-case:

- Node 9201 / 9202
- the name `RV2 Twinfield`
- Corn Maze
- Pumpkin Patch
- one fixture ordering
- one provider mirror
- one precise coordinate

---

# Mandatory first phase — lifecycle parity audit

Before changing implementation, perform a source-level parity audit.

Identify every lifecycle-negative provider representation currently recognized by the final Date Night interpretation/eligibility path, including all relevant forms of:

- demolition
- disused/inactive state
- permanently closed state
- abandoned/removed state if supported
- lifecycle namespace/prefix forms
- simple flag/value forms such as `demolished=yes`
- status/calendar/state representations where they participate in provider lifecycle exclusion
- any equivalent terminal forms recognized through aliases or helper normalization

For each recognized representation, record:

1. where the interpretation path recognizes it
2. whether provider acquisition can retrieve it
3. whether retrieval remains possible under:
   - Anything
   - single seasonal category
   - mixed seasonal categories
   - ordinary non-seasonal Date Night category narrowing where cross-category identity representations are possible
4. whether acquisition is category-independent or category-coupled
5. whether the representation can protect a matching positive identity without leaking unrelated lifecycle-only records into returned eligible results

Create a machine-readable or clearly auditable parity matrix in separate remediation evidence.

Do not assume the verifier's `demolished=yes` example is the only gap.

---

# Mandatory RED reproduction

Before implementation changes, reproduce the fresh reverifier failure deterministically against the failed candidate.

At minimum:

1. active Corn identity: `attraction=corn_maze`
2. matching lifecycle identity: `attraction=pumpkin_patch`, `demolished=yes`
3. Anything excludes
4. Corn + Pumpkin excludes
5. Pumpkin-only excludes where positive identity is otherwise reachable
6. Corn-only incorrectly resurrects on the failed candidate
7. preserve the failing RED log/evidence before fixing

The test must exercise enough of the real path to catch acquisition omission:

- real query planner/builder
- query-aware provider behavior
- handler/acquisition merge
- identity merge
- lifecycle/eligibility evaluation

A unit test of `providerLifecycle()` by itself is insufficient.

Preserve RED evidence permanently; do not overwrite it with GREEN output.

---

# Mandatory parity regressions

After reproducing the specific failure, add permanent tests covering the full audited lifecycle vocabulary.

At minimum cover:

## Simple lifecycle flags

- `demolished=yes`
- each other simple lifecycle-negative flag/value recognized by interpretation

## Prefixed/category lifecycle forms

- `demolished:attraction=...`
- equivalent disused/abandoned/prefix forms currently supported
- cross-seasonal category pairings
- at least one ordinary non-seasonal cross-category identity representation where the model allows it

## Category narrowing

For every supported representation class where meaningful, test:

- Anything
- single category
- mixed categories
- reversed positive/lifecycle category relationship

A narrower selection must not resurrect a terminal identity.

## Ordering and mirror behavior

- lifecycle record before positive record
- positive before lifecycle
- records arriving from different query groups where allowed
- first mirror failure / later valid mirror
- duplicate identity representations

Terminal lifecycle precedence must remain deterministic.

## Leakage controls

Lifecycle-only records must not become eligible positive results merely because lifecycle acquisition was broadened.

Specifically preserve:

- generic farm/park/maze rejection
- positive seasonal evidence requirements
- ordinary category classification requirements
- unrelated demolished/disused identities not appearing as user-visible options

## Security controls

Broadening lifecycle acquisition must not:

- accept arbitrary user-provided Overpass syntax
- make activity input part of an unrestricted query fragment
- increase provider count
- create unbounded retry behavior
- expose query bodies/coordinates/addresses/raw provider exceptions in production logs

---

# Required remediation design properties

Choose the narrowest architecture that restores parity.

Acceptable approaches include:

1. a shared bounded lifecycle-negative clause set derived from the same canonical representation registry used by interpretation
2. a canonical lifecycle representation definition consumed by both:
   - interpretation/classification
   - acquisition query generation
3. another deterministic structure that proves acquisition coverage for every recognized lifecycle-negative representation

Strong preference:

**avoid maintaining two independent hard-coded lifecycle vocabularies that can drift again.**

If practical, introduce a single canonical lifecycle representation model or an executable parity assertion so adding a new recognized lifecycle form without acquisition support causes tests to fail.

Do not over-generalize provider queries into an unbounded "fetch all inactive things" monolith.

Positive acquisition must remain category-aware and narrow.

Lifecycle-only acquisition must remain bounded, identity-protective and filtered from final eligible results.

---

# Performance and provider-budget constraints

The previous remediation increased lifecycle-negative query breadth. This remediation must measure the new final query shape.

Record:

- selector/clause count for Anything
- selector/clause count for each major single-category plan
- seasonal group size
- query byte size
- any change in number of groups
- any change in number of mirrors
- focused construction/runtime comparison where practical

Hard preservation requirements:

- provider list unchanged
- Date Night mirror schedule remains approximately 0 / 1500 / 3000 / 4500 ms
- maximum groups × mirrors unchanged
- 8s attempt bound unchanged
- 20s provider deadline unchanged
- 25s client watchdog unchanged
- no retry storm
- Dinner behavior unchanged
- Nightlife behavior unchanged

Do not extend deadlines merely to absorb a larger query.

If the parity fix causes material provider-runtime regression, investigate the query design before accepting it.

---

# V-DR-02 preservation

The fresh reverifier reported:

- 21 independent cache probes passed
- max-entry eviction passed
- aggregate/raw-venue eviction passed
- equal/increasing timestamps passed
- radius changes passed
- TTL passed
- signature isolation passed
- rejected-response supersession behavior passed
- retained classification/evidence passed

Therefore V-DR-02 is not an authorized implementation target.

Required preservation:

- do not modify `src/lib/date-night/cache.ts` unless a new independently reproduced defect requires it
- rerun the full existing cache suite after lifecycle remediation
- rerun client/session lifecycle coverage
- preserve component teardown behavior
- preserve conservative refetch semantics after supersession
- preserve unrelated-category reuse
- preserve raw identity/classification/evidence semantics

If cache tests fail because of lifecycle changes, diagnose the integration carefully; do not casually rewrite the already verified cache model.

---

# Starting gates

Before executable changes:

1. fetch fresh refs
2. verify main is still `4d937e58d2a65567b54ac5271915bc85b498898b` or STOP/report movement
3. verify failed candidate SHA/tree/sole parent exactly
4. verify failed candidate is still 28 ahead / 0 behind frozen main or report actual movement
5. create `fix/date-night-live-discovery-resilience-reverification-remediation-2` directly from `4e6ff124960d77be0c454ccfa0401c8a1ced35a1`
6. verify clean worktree and linear ancestry
7. read IN FULL:
   - original Date Night resilience handoff
   - original resilience continuation
   - first independent verification handoff
   - verification remediation 1 authority
   - verification remediation 1 continuation
   - final remediation MD/JSON
   - independent reverification 2 handoff
   - relevant lifecycle/query/provider source
   - relevant lifecycle/query/seasonal/security tests
   - current top `AI_CONTINUITY.md`
8. reproduce V-DR-01 fresh failure RED before changing implementation
9. perform the lifecycle interpretation/acquisition parity audit
10. preserve RED and parity evidence
11. checkpoint/push the RED/parity state before implementation if practical

Do not use this instruction branch as the implementation base.

---

# Authorized runtime scope

Expected runtime paths:

- `src/lib/date-night/provider-evidence.ts`
- `src/lib/date-night/query-plan.ts` if required
- a narrowly scoped shared lifecycle representation helper/registry if architectural parity cannot be safely achieved otherwise

Do not change `src/lib/date-night/cache.ts` without a new reproduced cache defect.

Shared Date Night search/identity code may be edited only if genuinely necessary to enforce interpretation/acquisition parity and only after documenting why.

Expected test paths may include:

- `scripts/date-night-query-plan.test.mjs`
- `scripts/seasonal-discovery.test.mjs`
- relevant provider/lifecycle/security tests
- a new focused parity test if cleaner than overloading existing suites

Do not change:

- provider list
- hedge offsets
- 8s attempt deadline
- 20s provider deadline
- 25s client watchdog
- saved catalogs
- Dinner
- Nightlife
- casino data
- package/lockfile
- auth/database
- Vercel configuration
- Android/native product behavior
- branding/domain/PWA
- production/main

---

# Continuity / checkpoint protocol

Create and maintain:

`docs/handoffs/active/date-night-live-discovery-resilience-reverification-remediation-2-continuation.md`

Checkpoint/push at minimum:

1. failed candidate identity + V-DR-01 RED reproduced + lifecycle parity audit complete
2. lifecycle acquisition/interpretation parity implementation complete + focused GREEN
3. V-DR-02/cache preservation and broader focused Date Night suites GREEN
4. before full validation/build/browser
5. after deterministic/full/build/security validation
6. after controlled browser + bounded Preview acceptance
7. final evidence freeze / immutable candidate

Each save must state:

- branch/base/latest SHA
- changed runtime/test/evidence paths
- RED/GREEN status
- parity matrix status
- query size/performance observations
- V-DR-02 preservation status
- remaining gates
- exact next action
- main/production untouched
- Preview identity if any
- resume state

If a long command stalls, preserve coherent work and checkpoint before changing diagnostic approach.

---

# Focused validation after GREEN

Before full suite:

1. new lifecycle parity tests
2. query-plan tests
3. seasonal/lifecycle tests
4. provider/identity merge tests
5. partial-result tests
6. cache full suite
7. client/session lifecycle suite
8. hedge/provider deadline suites
9. TanStack security suite
10. typecheck
11. changed-code lint
12. `git diff --check`

Explicitly confirm V-DR-02 remains GREEN without cache implementation changes.

---

# Full validation

After focused gates pass:

1. clean dependency install using established no-migration procedure
2. `npm ls --all`
3. `npm run typecheck`
4. full `npm test` in a loopback-capable environment
5. changed-code lint
6. `git diff --check`
7. compiled TanStack security suite
8. casino invariants
9. Android structural/icon checks
10. relevant Python native verifier
11. migration-free auth-enabled production build
12. build proof capture/complete/verify
13. protected-scope sanity
14. secret/generated-junk check
15. final clean worktree

Previous validated total was:

- 641 JavaScript passes
- 570 repository + 71 application
- 4 inherited skips
- 0 failures

This remediation should add permanent regression coverage, so report the actual new total. Do not force the total to remain 641 and do not double-count focused suites.

Never run migration-chaining `npm run build`.

If a restricted runner produces EPERM/loopback failure, preserve the environmental result and rerun unchanged in a capable runner. Do not weaken tests.

---

# Controlled browser acceptance

Only after deterministic/build/security gates pass, rerun the four established controlled real-browser/TanStack-RPC scenarios:

1. second mirror wins
2. third mirror wins
3. partial groups
4. all groups stall

Confirm:

- bounded loading/spinner
- truthful source/partial/fallback disclosure
- expected loser cancellation
- Open Now local/no-refetch
- no page errors
- no horizontal/mobile overflow
- zero public-provider calls from controlled harness

---

# Bounded live Preview acceptance

Only after controlled browser acceptance passes.

Use a non-production Preview tied exactly to the new remediation candidate/checkpoint.

Do not hammer public providers.

Preferred maximum pattern:

- one 15-mile Anything acquisition
- local subset/filter reuse checks
- one 50-mile Anything acquisition
- local subset/filter reuse checks

Because this remediation changes lifecycle query shape, additionally validate from those acquisitions, where observable:

- Corn Maze subset reuse
- Pumpkin Patch subset reuse
- Anything consistency
- truthful valid-empty / nonempty / partial status
- no unexpected lifecycle-only leakage
- no material provider timeout/regression caused by query expansion

Counts are observations, not invariants.

Do not add live provider requests merely to reproduce synthetic terminal lifecycle fixtures; deterministic query-aware tests are authoritative for those edge cases.

---

# Evidence

Create separate remediation evidence; do not overwrite prior failed/reverified reports.

Suggested final paths:

- `audit/date-night-live-discovery-resilience-reverification-remediation-2-2026-10-03.md`
- `audit/date-night-live-discovery-resilience-reverification-remediation-2-2026-10-03.json`
- `audit/date-night-live-discovery-resilience-reverification-remediation-2-evidence/`

Record:

- failed candidate SHA/tree/sole parent
- independent reverification finding exactly
- exact RED reproduction
- lifecycle parity matrix
- complete recognized lifecycle vocabulary
- acquisition coverage mapping
- root cause
- implementation design
- focused GREEN
- V-DR-02/cache preservation proof
- query-size/performance comparison
- full deterministic/security/build validation
- browser acceptance
- bounded live Preview result
- changed paths
- protected-scope/privacy review
- final SHA/tree/sole parent
- main/production preservation

Clearly state that `4e6ff124...` remains a failed reverification candidate.

---

# Final freeze

If and only if:

- the fresh `demolished=yes` counterexample is GREEN
- the complete lifecycle parity audit has no unexplained acquisition gap
- permanent parity regressions are GREEN
- positive query narrowness remains intact
- lifecycle-only records do not leak
- V-DR-02 remains preserved
- focused suites pass
- full validation/security/build passes
- controlled browser passes
- bounded Preview acceptance reveals no blocker
- scope/privacy/preservation checks pass

then:

1. review diff against failed candidate
2. confirm only authorized lifecycle remediation/tests/evidence changed
3. freeze a new immutable candidate
4. push
5. report exact SHA/tree/sole parent
6. verify clean worktree
7. verify main and production remain untouched
8. STOP for a fresh independent reverification #3

Do not promote.

Success state:

`DATE NIGHT LIVE DISCOVERY RESILIENCE REVERIFICATION REMEDIATED — AWAITING INDEPENDENT REVERIFICATION #3`

Failure/incomplete state:

`DATE NIGHT LIVE DISCOVERY RESILIENCE REVERIFICATION REMEDIATION 2 INCOMPLETE — REVIEW REQUIRED`

---

# First action

Start from failed candidate `4e6ff124960d77be0c454ccfa0401c8a1ced35a1`.

Reproduce the fresh reverifier's `demolished=yes` cross-category lifecycle failure as deterministic RED using the real query-aware path.

Then audit interpretation/acquisition parity for the complete lifecycle vocabulary before changing implementation.

Do not begin by editing runtime code.
