# Pick For Us — Date Night Live Discovery Resilience — Live Timeout Diagnosis 1

Repository: `caleb1234calvin-art/dinner-roulette`

Instruction branch:
`handoff/date-night-live-discovery-resilience-live-timeout-diagnosis-1`

Starting checkpoint:
`e8730f7e44ba48a78a3335657190f7e5aaf82d7b`

Starting tree:
`50a412de4e6ef656ce0f7c8b8e4a39fb720b9e20`

Starting sole parent:
`08893d73a5e22674d4f9fccbdf04599cdd2c6f25`

Frozen production main:
`4d937e58d2a65567b54ac5271915bc85b498898b`

Current state:
`DATE NIGHT LIVE DISCOVERY RESILIENCE REVERIFICATION REMEDIATION 2 INCOMPLETE — REVIEW REQUIRED`

Validated remediation facts to preserve:
- lifecycle parity deterministic GREEN
- 673 JavaScript passes, 4 inherited skips, 0 failures
- build/security GREEN
- controlled browser 4/4 GREEN
- V-DR-02 preserved; cache source unchanged
- no successful immutable candidate exists
- no promotion is authorized

Exact existing Preview used for failed live acceptance:
- deployment `dpl_99Fu4mmCHAy1DnNhpipeR7DLiSeF`
- URL `https://dinner-roulette-962xkmg15-minions-9e2c.vercel.app`
- exact executable SHA `c4e42663c7a25519f443456e031d99d1c16dafdd`
- READY / non-production
- prior single 15-mile Anything acquisition: all four groups timed out; no 50-mile acquisition was attempted

---

## Mission

Determine, without speculative code changes, whether the failed 15-mile live Preview acceptance is best explained by:

1. transient/public-provider availability or network conditions,
2. material provider cost introduced by the broader lifecycle carrier query,
3. another concrete runtime/query defect.

Do not treat one timeout as proof of query-cost regression.
Do not treat deterministic GREEN as proof of acceptable live-provider performance.

This is a diagnosis/review task first, not an implementation task.

---

## Hard prohibitions

Until a concrete runtime defect is established:

DO NOT:
- edit runtime source
- edit tests to weaken assertions
- change provider list
- change hedge schedule
- extend 8s / 20s / 25s deadlines
- change cache behavior
- broaden/narrow positive category semantics
- change package/lockfile
- change Vercel settings
- run migrations
- merge
- update main
- deploy production
- promote any candidate

Do not repeatedly hammer public Overpass providers.

---

## Required reading

Read IN FULL before conclusion:

1. `docs/handoffs/active/date-night-live-discovery-resilience-reverification-remediation-2.md`
2. `docs/handoffs/active/date-night-live-discovery-resilience-reverification-remediation-2-continuation.md`
3. `audit/date-night-live-discovery-resilience-reverification-remediation-2-2026-10-03.md`
4. matching JSON
5. `audit/date-night-live-discovery-resilience-reverification-remediation-2-evidence/live-runtime-investigation.md`
6. live failure JSON/log/runtime excerpts
7. query before/after measurements
8. current lifecycle/query source and test-support evaluator
9. prior successful live acceptance evidence from remediation 1 for comparison
10. current top `AI_CONTINUITY.md`

Treat retained evidence as claims to verify, not conclusions to inherit.

---

## Phase 1 — integrity and preservation

Freshly verify:

- starting checkpoint SHA/tree/sole parent exactly
- main remains frozen or report movement
- production remains unchanged or report movement
- exact Preview remains READY/non-production/exact `c4e4266...`
- working copy is clean
- no runtime change occurred after the validated executable checkpoint
- cache remains byte-identical to the failed candidate

If any of these are false, stop and report before further live testing.

---

## Phase 2 — read-only timeout forensics

Analyze the retained failed 15-mile acquisition before issuing any new public-provider request.

At minimum determine:

- per-group provider duration
- per-mirror attempt timing where evidence exists
- whether failures are connection, TLS, HTTP, parser, body, abort, or attempt-timeout shaped
- whether all four groups fail in the same way
- whether mirrors fail synchronously or at staggered hedge times
- whether any group returned partial/valid-empty/HTTP response before timeout
- whether runtime logs show provider-side status codes or only local deadline expiry
- whether Vercel execution itself had cold-start/queueing anomalies
- whether there is evidence of a malformed or rejected Overpass query
- whether query bodies materially differ from deterministic query measurements

Use hosted/runtime logs read-only where available.

Do not infer provider engine versions from local source inspection.

---

## Phase 3 — query-cost comparison without public-provider load

Compare current lifecycle carrier query shape against the previously accepted remediation-1 query shape.

At minimum report:

- selectors and bytes per group before vs current
- carrier exact-key selector count
- lifecycle predicate count
- duplicated lifecycle carrier work across four groups
- theoretical maximum mirror requests unchanged
- whether the same lifecycle carrier is repeated identically across groups
- whether any obvious redundant acquisition can be removed while preserving full parity
- whether current Overpass QL likely forces broad radius scans before filtering
- whether the inspected official engine's named-set/range behavior materially reduces that concern

If practical, use one or more of the following WITHOUT hitting public mirrors:
- local/scratch Overpass parser or engine if available
- static query-plan analysis
- deterministic synthetic fixture cost probes
- source-level execution-path review
- query AST/string decomposition

The goal is to identify a concrete cost mechanism, not merely note that the query is larger.

---

## Phase 4 — decision gate before any new live request

Choose exactly one:

### A. Evidence supports likely transient/provider availability
If retained evidence shows ordinary attempt deadlines without parser/query rejection and no concrete query-cost defect is established, a single bounded re-attempt is authorized.

### B. Evidence supports concrete query-cost/runtime defect
Do NOT issue another live request. Report the specific mechanism and propose a new narrow remediation handoff. Do not implement it in this diagnosis task.

### C. Evidence remains ambiguous
One single bounded 15-mile re-attempt is authorized only if it is likely to discriminate transient provider availability from deterministic query cost.

No other live requests are authorized before this gate.

---

## Phase 5 — single bounded 15-mile canary, if authorized

Use the exact existing non-production Preview:
`dpl_99Fu4mmCHAy1DnNhpipeR7DLiSeF`

Run exactly ONE new 15-mile Anything acquisition.

Record:

- discovery RPC count
- total visible settlement time
- provider duration
- group success/failure
- per-group timing
- source/partial/fallback state
- live/saved observed counts
- page errors
- overflow
- provider/runtime logs

Do not run subset checks yet.
Do not run 50 miles yet.

### Canary outcomes

If all four groups fail again with the same timeout signature:
- STOP.
- Treat repeated failure as strong evidence that current live acceptance is not ready.
- Do not rewrite runtime in this task.
- Produce a diagnosis verdict and recommended narrow next remediation.

If at least one group succeeds but others fail:
- STOP and analyze whether partial behavior is acceptable but performance regressed.
- Do not automatically continue to 50 miles.

If all groups succeed within established deadlines:
- the prior failure is consistent with transient provider/environment conditions.
- proceed to Phase 6.

---

## Phase 6 — complete bounded acceptance only after a successful canary

Only after the single 15-mile Anything canary succeeds cleanly:

1. verify covered local subset/filter reuse without new provider RPCs where coverage exists
2. perform ONE 50-mile Anything acquisition
3. verify covered local subset/filter reuse from that result
4. complete the established 12-row matrix using no more than those two successful acquisition RPCs

Do not exceed the existing bounded acceptance model.

Counts are observations, not invariants.

Verify:
- truthful valid-empty/nonempty/partial state
- no lifecycle-only leakage
- Corn/Pumpkin subset consistency
- Open Now/mood/favorites/Fewer Parks local reuse
- no page/harness errors
- no horizontal overflow
- no material provider-runtime regression relative to prior accepted architecture

---

## Phase 7 — outcome

End with exactly one:

`DATE NIGHT LIVE DISCOVERY LIVE TIMEOUT DIAGNOSIS — TRANSIENT PROVIDER FAILURE; REMEDIATION 2 ACCEPTANCE MAY RESUME`

or

`DATE NIGHT LIVE DISCOVERY LIVE TIMEOUT DIAGNOSIS — QUERY/RUNTIME COST BLOCKER CONFIRMED`

or

`DATE NIGHT LIVE DISCOVERY LIVE TIMEOUT DIAGNOSIS — AMBIGUOUS; REVIEW REQUIRED`

If the canary and full bounded matrix pass with no new blocker, do NOT freeze/promote in this task. Instead report that the remediation-2 branch is eligible to resume its final acceptance/freeze protocol.

If a blocker is confirmed, stop with a narrow recommended remediation scope.

---

## Parallel-agent rule

This diagnosis may use Astra and Codex on the same project, but role ownership must be explicit.

Recommended:
- Astra: hosted/Vercel/runtime/browser forensics and bounded live acceptance
- Codex: repository/query-plan/static-cost analysis

They may share READ-ONLY findings through this branch's evidence only.

Do not allow either agent to make runtime edits in this diagnosis task.

Do not recursively delegate the full mission. Any subagent must receive a bounded subtask and may not spawn further agents.

---

## Final report

Report:

1. identity/main/production/Preview integrity
2. retained timeout signature
3. query-cost comparison
4. any concrete cost mechanism found
5. whether a live canary was authorized
6. live canary result, if run
7. whether 50-mile/full matrix was run
8. exact public-provider RPC count
9. final diagnosis state
10. exact next action

Stop after diagnosis.
