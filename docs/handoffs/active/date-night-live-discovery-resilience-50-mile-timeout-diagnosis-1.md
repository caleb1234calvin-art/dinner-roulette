# Pick For Us — Date Night Live Discovery Resilience — 50-Mile Timeout Diagnosis 1

Repository: `caleb1234calvin-art/dinner-roulette`

Instruction branch:
`handoff/date-night-live-discovery-resilience-50-mile-timeout-diagnosis-1`

Starting incomplete remediation checkpoint:
`d9cc8bdde2e531af6f029d3d558d25f4f7bb4ab5`

Starting tree:
`f9f46d16c876b4d608ab836d57a411a607e6f8fa`

Starting sole parent:
`8e67d959f5b19cb00c22533a6eb27a1b2e1bfb2f`

Frozen production main:
`4d937e58d2a65567b54ac5271915bc85b498898b`

Current state:
`DATE NIGHT LIVE DISCOVERY RESILIENCE LIVE TIMEOUT REMEDIATION INCOMPLETE — REVIEW REQUIRED`

Validated preservation facts:
- diagnosed common active-key regex path removed
- runtime change limited to `src/lib/date-night/lifecycle.ts`
- 686 JavaScript passes, 4 inherited skips, 0 failures
- compiled TanStack security 14/14
- lifecycle parity 154 audit cases / 111 authoritative negatives / zero gaps
- V-DR-02 preserved; cache byte-identical
- controlled browser 4/4 GREEN
- 15-mile live acquisition succeeded in all four groups
- 50-mile live acquisition failed in all four groups
- exactly two discovery RPCs were forwarded
- no successful immutable candidate exists
- no promotion is authorized

Exact tested non-production Preview:
- deployment `dpl_7kz238n3Fp2rNYGjvFDuHK18YKYk`
- URL `https://dinner-roulette-ijp958pl9-minions-9e2c.vercel.app`
- executable SHA `ce7d9df74cfda9d6ac1473a7392b8f089d87fc80`
- READY / target null

---

## Mission

Diagnose why the current lifecycle-parity-preserving query shape succeeds at 15 miles but fails at 50 miles, without immediately changing runtime code or issuing repeated public-provider requests.

The next decision must be based on evidence distinguishing:
1. radius-dependent query/index cost,
2. result-set/intermediate-set growth,
3. provider/network availability at the observation time,
4. a remaining query-planning inefficiency,
5. another concrete runtime defect.

Do not assume the exact-value carrier remediation failed merely because 50 miles timed out.
Do not assume the 15-mile success proves the current design scales acceptably to 50 miles.

This is a diagnosis task first.

---

## Hard prohibitions

Until a concrete defect is established:

DO NOT:
- edit runtime source
- weaken tests
- change provider list
- change hedge offsets
- extend 8s / 20s / 25s deadlines
- change cache behavior
- change positive category semantics
- change package/lockfile
- change Vercel settings
- run migrations
- merge
- update main
- deploy production
- promote any candidate
- issue repeated public-provider probes

Do not run a new 50-mile live request until the analysis gate below authorizes one.

---

## Required reading

Read IN FULL:

1. `docs/handoffs/active/date-night-live-discovery-resilience-live-timeout-remediation-1.md`
2. `docs/handoffs/active/date-night-live-discovery-resilience-live-timeout-remediation-1-continuation.md`
3. `audit/date-night-live-discovery-resilience-live-timeout-remediation-1-2026-10-03.md`
4. sibling JSON
5. prior timeout diagnosis handoff/report
6. current `src/lib/date-night/lifecycle.ts`
7. current `src/lib/date-night/query-plan.ts`
8. current `src/lib/date-night/provider-evidence.ts`
9. retained live 15/50 evidence and runtime excerpts
10. prior accepted remediation-1 live evidence
11. top `AI_CONTINUITY.md`

Treat prior evidence as claims to inspect, not conclusions to inherit.

---

## Phase 1 — integrity

Freshly verify:

- starting SHA/tree/sole parent exactly
- starting branch ancestry is linear
- main remains frozen or report movement
- production remains exact frozen main or report movement
- tested Preview remains READY/non-production/exact `ce7d9df...`
- no executable changes after `ce7d9df...`
- checkout/worktree is clean
- cache remains byte-identical

Stop on integrity drift.

---

## Phase 2 — retained 50-mile timeout forensics

Analyze the failed 50-mile acquisition before any new public request.

At minimum determine:

- per-group duration
- per-mirror timing where retained logs permit
- exact observed HTTP 504s
- which mirrors timed out versus returned 504
- whether immediate advancement after 504 behaved correctly
- whether failure signatures differ from the earlier 15-mile all-timeout failure
- whether any group returned headers/body/partial data before local deadline
- whether Vercel RPC overhead was material
- whether 50-mile failure clustered around specific mirrors
- whether the 15-mile success used different winning mirrors
- whether current provider conditions can be inferred only weakly or strongly

Do not invent truncated attempt records.

---

## Phase 3 — radius-dependent query-cost analysis

The query text is effectively the same structure at both radii; only the around radius changes.

Analyze what materially changes from 15 miles (~24,140m) to 50 miles (~80,467m):

- expected spatial candidate set growth
- active exact-value carrier range behavior
- 28 prefixed lifecycle carrier selectors
- two named-set lifecycle predicates
- seasonal context acquisition
- positive category selectors
- intermediate set sizes
- repeated per-group acquisition
- potential overlap between lifecycle and seasonal contexts
- whether exact-value active selectors are still likely index-selective
- whether prefixed regex selectors may dominate at larger radii
- whether arbitrary-prefix semantics force a costly path
- whether group duplication multiplies the radius-dependent work

Use static/source-level analysis and local synthetic probes first.

If practical, inspect the pinned Overpass engine source further for:
- range intersection ordering at larger radii
- exact-value selector handling with around constraints
- prefixed-key regex handling
- intermediate set materialization
- named-set filtering cost
- any threshold/cutoff behavior sensitive to candidate count

Do not claim public mirror versions.

---

## Phase 4 — compare accepted historical query shape

Compare three states:

A. accepted remediation-1 query shape
B. lifecycle-parity remediation before exact-value optimization
C. current exact-value remediation

For each state report, where available:

- selectors / bytes per group
- carrier selector composition
- regex vs equality active-key acquisition
- 15-mile observed provider timings
- 50-mile observed provider timings
- success/failure pattern

The goal is to determine whether the current 50-mile failure is likely caused by:
- remaining lifecycle carrier breadth,
- total duplicated group work,
- provider volatility,
- or another mechanism.

Do not infer causality from one timing sample alone.

---

## Phase 5 — decision gate

Choose exactly one:

### A. Concrete remaining query/runtime defect identified
Do not issue another public request.
Report the mechanism and recommend a narrow remediation handoff.
Do not implement it here.

### B. No concrete defect; evidence favors transient/provider variability
Authorize at most ONE 50-mile canary on the exact existing Preview.

### C. Ambiguous but one 50-mile canary is discriminative
Authorize at most ONE 50-mile canary.

### D. Ambiguous and another live request would not materially reduce uncertainty
Stop without live traffic.

---

## Phase 6 — single 50-mile canary, only if authorized

Use exact existing Preview:
`dpl_7kz238n3Fp2rNYGjvFDuHK18YKYk`

Run exactly ONE 50-mile Anything acquisition.

Do not rerun 15 miles.

Record:
- one discovery RPC
- provider duration
- visible settlement
- group success/failure
- per-mirror outcomes where observable
- source/partial/fallback
- live/saved counts
- page errors
- overflow
- runtime logs

If all four groups fail again with substantially the same signature:
STOP and report live scalability not accepted.

If some groups succeed:
STOP and assess whether partial behavior is correct but performance remains inadequate.

If all four groups succeed:
do not automatically continue the full matrix in this diagnosis task unless the handoff explicitly permits it below.

---

## Phase 7 — acceptance-resume eligibility

If and only if the single 50-mile canary succeeds cleanly and no concrete blocker remains:

Report that the live-timeout remediation branch is eligible to resume bounded 50-mile subset/filter checks and final 12-row acceptance/freeze protocol.

Do not freeze/promote in this diagnosis task.

---

## Parallel-agent operating model

Astra may coordinate hosted/runtime/Vercel forensics.
Codex may perform repository/query/source-cost analysis.

They may share read-only findings.

Rules:
- no runtime edits
- no shared write branch work
- no recursive delegation of the full mission
- any subagent gets only a bounded subtask
- subagents may not spawn further agents

---

## Final verdict

End with exactly one:

`DATE NIGHT LIVE DISCOVERY 50-MILE TIMEOUT DIAGNOSIS — QUERY/RUNTIME BLOCKER CONFIRMED`

or

`DATE NIGHT LIVE DISCOVERY 50-MILE TIMEOUT DIAGNOSIS — TRANSIENT/PROVIDER VARIABILITY LIKELY; ACCEPTANCE MAY RESUME`

or

`DATE NIGHT LIVE DISCOVERY 50-MILE TIMEOUT DIAGNOSIS — AMBIGUOUS; REVIEW REQUIRED`

---

## Final report

Report:

1. identity/main/production/Preview integrity
2. retained 50-mile timeout signature
3. 15-mile vs 50-mile comparison
4. radius-dependent query-cost analysis
5. historical-shape comparison
6. any concrete remaining cost mechanism
7. whether a live 50-mile canary was authorized
8. canary result if run
9. exact new public-provider RPC count
10. final diagnosis state
11. exact next action

Stop after diagnosis.
