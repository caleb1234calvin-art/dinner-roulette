# Pick For Us — Date Night Radial Loading — Browser Acceptance 1

Repository: `caleb1234calvin-art/dinner-roulette`

Instruction branch:
`handoff/date-night-radial-loading-browser-acceptance-1`

Starting preserved implementation checkpoint:
`028b2db775133f3343c41d1f8a0a4001d6ab122c`

Expected tree:
`b604d9f6c41c18ec8eee4def0c8420f7960ce629`

Expected sole parent:
`95bee7379490c959bcaeaa78691cbecdbe53a899`

Frozen production main:
`4d937e58d2a65567b54ac5271915bc85b498898b`

Implementation branch:
`feature/date-night-radial-loading-1`

Known validated executable Preview:
- deployment `dpl_HviVcpJT1dNBQg54n3Sx2b5ZeDsA`
- URL `https://dinner-roulette-1xc11et6w-minions-9e2c.vercel.app`
- executable SHA `b270e725baff0047cbaa3385515b24e911ba0bbe`
- READY / non-production

Current state:
`DATE NIGHT RADIAL LOADING INCOMPLETE — REVIEW REQUIRED`

---

## Mission

Resume only the blocked browser/live acceptance stages for the already-implemented Date Night Radial Loading work.

Do NOT reimplement Radial Loading unless browser/live acceptance reproduces a concrete defect.

The deterministic implementation is already preserved and validated. Browser acceptance was not executed because the prior runner could not create the Chromium process-singleton socket and sandbox escalation was rejected before execution.

---

## Preserve

Treat the following as retained historical gates, not fresh claims unless rerun:

- 729 JavaScript passes = 658 repository + 71 application
- 4 inherited skips
- 0 failures
- compiled TanStack security 14/14
- focused 294/294
- 43 new radial tests
- lifecycle parity 154 / 111 / zero gaps
- existing V-DR-02 regressions GREEN
- typecheck/lint/dependency/casino/Android/Python GREEN
- migration-free auth-enabled build/proof GREEN
- protected scope / secret / junk review GREEN
- main and production unchanged

Do not weaken or bypass any acceptance assertion.

---

## Hard prohibitions

DO NOT:
- merge
- update main
- deploy production
- run migrations
- run migration-chaining `npm run build`
- change Vercel settings
- change providers/hedges/deadlines
- broaden public-provider traffic beyond the existing live harness cap
- treat automatic Preview creation as acceptance
- modify runtime merely to get the browser harness to launch

If browser acceptance reveals a real product defect, preserve the failure and STOP for remediation planning rather than silently fixing it inside this acceptance task.

---

## Phase 1 — integrity

Verify fresh:

- starting SHA/tree/sole parent exactly
- linear ancestry
- clean checkout/worktree
- feature branch state
- frozen main unchanged or report movement
- production unchanged or report movement
- pinned radial handoff authority and full continuation/report
- build proof/source identity
- exact executable Preview identity

If a clean checkout lacks compiled output, restore dependencies with the unchanged lockfile and rerun only the safe migration-free auth-enabled build/proof as required.

---

## Phase 2 — controlled browser acceptance

Run the existing controlled radial browser harness in an authorized browser-capable runner.

Required command shape:

`CI=true VITE_AUTH_ENABLED=true PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/absolute/path/to/chrome DATE_NIGHT_RADIAL_OUTPUT=/tmp/pfu-radial-browser-acceptance-1 node scripts/date-night-radial-browser.mjs`

Keep all external provider interception/blocking enabled.

Public-provider calls from controlled acceptance must be ZERO.

Require all 10 scenarios:

1. core succeeds; outer patches progressively succeed
2. core succeeds; middle patch fails
3. outermost patch fails; inner coverage remains usable
4. options open while background patch completes; visible options remain stable
5. reroll after patch completion can use new venues
6. radius 15→50 schedules only outer work
7. radius decrease during expansion cancels unnecessary outer work
8. Open Now creates zero provider requests
9. progress text is truthful and mobile-safe
10. all-stall core settles honestly

Also inspect screenshots for:
- mobile horizontal overflow
- truthful coverage progress
- enabled interaction after useful core coverage
- stable open overlays
- no misleading “loaded through X” claim

If any controlled scenario fails:
- preserve exact failure evidence
- STOP
- do not proceed to live acceptance

---

## Phase 3 — bounded exact-Preview live acceptance

Only after controlled 10/10 PASS.

Freshly verify exact READY non-production Preview and executable source identity.

Use the existing live harness only:

`PFU_RADIAL_PREVIEW_VERIFIED=1 PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/absolute/path/to/chrome node scripts/date-night-radial-live.mjs https://EXACT-VERIFIED-PREVIEW.vercel.app /tmp/pfu-radial-live-acceptance-1`

Do not increase its hard cap.

Existing live harness budget:
- allowed progressive sequence: core, 20:0, 20:1
- maximum 3 public patch RPCs
- maximum theoretical 48 physical provider attempts
- outer traffic only after accepted core success
- no monolithic 50-mile request

Report separately:

### Product usability
- core/nearby coverage succeeds or fails
- UI becomes usable before max-radius completion
- outer patch merge behavior
- stable overlays
- local-only filters do not refetch
- failed outer patch preserves inner results
- no page errors/overflow/lifecycle leakage

### Maximum-radius completeness
- exact continuous radial coverage achieved by the bounded sequence
- exact remaining missing/failed/loading coverage
- no false “loaded through X” claim

A product-usable partial radial result is not the same as complete 50-mile coverage.

---

## Phase 4 — final outcome

If controlled browser and bounded live acceptance both pass their required criteria:

1. update evidence/continuation only
2. rerun final integrity/protected-scope/readbacks
3. freeze a new immutable successful candidate on the feature branch
4. report exact SHA/tree/sole parent
5. STOP for fresh independent verification

If any required acceptance gate fails:

- preserve failure evidence
- keep status INCOMPLETE
- do not freeze/promote
- report exact remediation scope if a concrete product defect exists

Success state:

`DATE NIGHT RADIAL LOADING IMPLEMENTED — AWAITING INDEPENDENT VERIFICATION`

Failure state:

`DATE NIGHT RADIAL LOADING INCOMPLETE — REVIEW REQUIRED`

---

## Delegation rule

One primary worker owns this task.

Do not recursively delegate the full mission.

A bounded helper may be used only for a specific read-only subtask and may not spawn further agents.

---

## First action

Start from exact preserved checkpoint `028b2db775133f3343c41d1f8a0a4001d6ab122c`.

Read the full radial continuation and final report.

Verify integrity.

Then run controlled browser acceptance in a genuinely browser-capable authorized runner before any public-provider traffic.
