# Independent PR85 adapter safety review

Reviewed original head `3e51d7a51871e4e765548955e2d6afd2f4af449e`, tree `caf1458c3314f78452e27fb0f7f462249da6da5a`. Exact separate clean checkout: `full-source/`. Immutable connector source copies in `source/` have a harmless extra trailing newline introduced during extraction; all final original evidence rerun against exact git checkout.

## Confirmed defects

1. `scripts/seasonal-osm-metadata.mjs:124-126,154-162`: filtering categories before identity indexing loses negative/nonseasonal siblings of a seasonal same-ID row. Seasonal node7 plus node7 `{shop:vacant,closed:yes}` returns one seasonal proposal without negative-lifecycle or conflict flags, in either order. All eligibility flags remain false. Minimal fix: validate/index every row before category selection, carry identity negatives to proposals or fail closed.
2. Lines35-45: first-wins merge across lifecycle prefixes suppresses legitimate historical categories. `disused:attraction=unknown` suppresses `demolished:attraction=haunted_house`; proposal disappears. Minimal fix: classify each prefix independently and union resulting hints.
3. Same merge invents categories across scopes: `disused:leisure=maze` plus `demolished:crop=corn` yields corn-maze, though neither lifecycle scope establishes one. Same fix as2.

Four independently written regression cases in `regressions.test.mjs` fail on original head; `regressions.log` preserves failure output. Upstream original tests pass11/11 (`baseline.log`).

## Safety checks passed

Three independent suites (`safety.test.mjs`, `safety.log`) cover exact512000-byte input acceptance/512001 rejection, UTF8 object boundary,100/101 element boundary, trailing invalid record, malformed primitive/cyclic fixtures, no fetch, no trusted input eligibility/date/website claims, and fixed OSM provenance/license links. No HTTP/provider retrieval was performed. Implementation has no imports or network call sites. Publication/Open Now/year2026 flags remain false. No implementation changes or publication performed by reviewer; PR84/82 untouched.

## Additional bounded issues

- Identical repeated rows labeled conflicting despite identical evidence. Conservative but misleading; separate exact-duplicate from conflicting-content states if improved.
- Name collision reason appended repeatedly.100 identical rows produce5251 reason entries, last row102 reasons,265651-byte result. Bounded by100 elements, so low severity; add each reason once.
- Object JSON normalization silently drops undefined/function/symbol-valued tags before malformed-tag checks. NaN/Infinity correctly become null and trigger coverage-incomplete. Explicit malformed object rejection would improve input fidelity without claiming hostile-object sandboxing. Optional failing probes preserved in `regressions-optional.test.mjs` / `.log`.

## Workflow

Original `.github/workflows/seasonal-osm-metadata.yml` uses default PR merge checkout, not explicitly candidate head. It is contents:read, persist-credentials:false, Node22, fixture test and npm-ci--ignore-scripts/lint; no venue retrieval. Candidate exact-source fix explicitly selects head and asserts/prints SHA and tree. Documentation-only PR edits may not trigger path-filtered job; head CI claims need match actual SHA.

## First correction verification

Reviewed uncommitted correction in `/workspace/shared/pr85-implementation`, based on same original head. Four external regression cases plus three safety suites pass7/7 (`fix-validation.log`). Preindexing every validated row retains sibling negative state; prefix-isolated classification resolves both historical problems. Workflow exact-source assertion is appropriate. Remaining bounded issues above are not a publication eligibility bypass.

## Final expanded correction review (2026-10-18 19:12 UTC)

Verdict: PASS for bounded offline adapter work, subject to aggregate checks and exact candidate CI. This is not production or live-retrieval approval.

Candidate at `/workspace/shared/pr85-implementation` changes exactly the adapter, its test, isolated workflow, and audit README. Four-file content manifest: `candidate-manifest.sha256`; changed-file list: `candidate-changed-files.txt`. Reviewed strict canonical JSON fixture checks, capture and row hashes, all original row pointers, raw-tag caps, preserved negative sibling indices, duplicate-vs-conflicting states, unique triage reasons, lifecycle vocabulary/false values, address fallbacks, and crop fallback. No runtime/PR84 changes. Only adapter import is `node:crypto`; no network call site. All eligibility/date/website output invariants remain intact.

Independent tests: `envelope-review.test.mjs` plus prior `fix-regressions.test.mjs` and `fix-safety.test.mjs` pass13/13, recorded in `envelope-review.log`. These include independently calculated input/row hashes; JSON roundtrip of negative pointers after filtering; identity isolation with mixed duplicate/conflicting rows; UTF8/key/count raw evidence bounds including irrelevant rows; prototype-named tags; rejection of getters/nonenumerable/custom/undefined values without getter execution; and false lifecycle values across seven prefixes. Upstream candidate tests pass30/30 in `candidate-baseline-cwd.log`. The attempted absolute test invocation from another CWD fails because existing test-only app loader resolves source from CWD (`candidate-baseline.log`). This is a nonblocking reproducibility constraint: run `node --test scripts/seasonal-osm-metadata.test.mjs` from repository root, as workflow does.

Local runtime was Node24.19.0. Workflow Node22 execution must be established by exact-candidate CI rather than inferred from this local test.

One documentation precision note: wildcard lifecycle-prefix raw fields include `destroyed:website` and `disused:phone`, despite ordinary website/phone/hour fields being omitted. Retained lifecycle namespaces remain bounded; they are not fetch permission. Author was notified to clarify README rather than broaden implementation scope. No external transmittal occurred.

README lifecycle-prefix exception was clarified before final manifest freeze at19:12 UTC. Adapter, tests and workflow hashes unchanged since independent13+30 pass. Final README hash is recorded in `candidate-manifest.sha256`. Reviewer disposition remains PASS for commit after aggregate checks; exact remote CI and all existing release gates still apply.
