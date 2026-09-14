# Casino + location reconciliation plan

Historical architecture plan, now completed. The combined candidate was validated and merged through PR #42 into non-production integration at 189c46bfee0ac0983ea9100eae90e92ee58915b7. See the existing shared AI_CONTINUITY.md and reconciliation validation evidence for the final state.

Authoritative casino base: `integration/active-work-pass-1` at `183d3e1d71355a27e4bc35a2969d73037c9e6e33`.
Location source: `integration/location-international-2026-09-13` at `4a93870c05ec53bd49fae5143df420c301696839` (draft PR #39).
Common ancestor: `a6d38616fe4490ff46b87232cbc7abb82f176926` (808 canonical casinos).
Main safety baseline: `c187d518cf8b0c8b9202ee0ae6493667eb4c0ab5`.

The user now authorizes reconciliation into non-production integration. The earlier casino-only instruction to keep location separate is superseded for this task. Main, production, deployment, migrations, credentials, recurring automation and Exa remain prohibited.

## Read before editing

Read both branch diffs from their common ancestor, current shared AI_CONTINUITY.md, pinned LOCATION_HANDOFF.md, location architecture/validation artifacts, and the casino final-freeze, adversarial, live-provider findings and browser evidence. Location changes cover 30 paths; exactly five overlap casino continuation changes. No location commit changes casino catalog data files, closure policy or casino evidence. A whole-file restore of its Nightlife search would nevertheless remove Pass 55–60 registration and regress the runtime to 808.

## Overlap decisions

| Classification | Path | Intended source of truth / resolution |
| --- | --- | --- |
| Location control | src/components/nightlife-home.tsx | Adopt shared LocationControl architecture, preserve casino visible error/manual recovery and disable repeated requests while busy. Review Dinner and Date Night for the same behavior. |
| Discovery / provider | src/lib/nightlife/search.ts | Keep current 60-pass registry, dedupe, canonical routing, 20-second deadline, bounded casino holds/aliases. Apply location address formatting, Joplin-bounded retired-name filtering and malformed/remark handling only. |
| Browser | scripts/casino-browser-smoke.mjs | Keep current owned detached preview, strict port, ANSI-safe readiness, canonical pool checks, permission/manual recovery and full 16-group coverage. Adapt input/action labels and coordinate Maps assertions to the shared control. |
| CI / workflow | .github/workflows/validate-icon-pack.yml | Keep current PR-head checkout, safe builds, auth-enabled production rendering and casino acceptance. Add location acceptance and evidence retention; never replace current guards wholesale. |
| Continuity / docs | AI_CONTINUITY.md | Existing shared integration file is authoritative. Record every work checkpoint here; never restore the location branch's older casino state or create another active continuity file. |

## Non-overlapping paths that still require integration review

- Casino data/status/history: retain every current catalog file, 60-pass order, 899 serialized rows, 883 canonical rows (NV 204, OK 113, CO 31, TX 4), 18 closure groups, seven evidence-gated holds and all frozen evidence unchanged.
- Persistence/model: forward location model, controller and store compatibility guards; preserve legacy saved locations and filter persistence. GPS remains explicit-action only, immediate coordinates precede optional reverse enrichment, and stale callbacks cannot override newer choices.
- Providers/discovery: forward global Nominatim and general country/region/locality support, international OSM addresses and coordinate Maps links. Keep geographic fallback limits and casino provider semantics. Distinguish malformed/incomplete provider responses from valid empty results.
- Tests: retain all current casino tests and all 28 location additions. Test names/files will be inventoried before/after. Report only actual combined execution totals, never 329 + 342.
- Browser/live network: retain current six-region casino real-provider review guards and public entity observation. Strengthen the location harness with owned-process/strict-port/current-build safeguards; retain its 12 checks, simulated native coordinates and explicit error mocks. No physical GPS or hosted acceptance claim.
- Configuration/dependencies: neither package manifest nor lockfile differs on location source. Preserve deployment exclusion for integration/** and safe direct Vite production builds. No dependency upgrade planned.
- Location source evidence: import as historical independent-branch evidence, explicitly label 808-casino/342-test results as pre-combination. New combined evidence will be separate audit records, not a competing handoff.

## Checkpoints and validation

1. Publish this plan, then update and verify the shared continuity in GitHub.
2. Create a dedicated candidate from current shared integration; audit counts and freeze-file identity, publish baseline checkpoint and shared continuity.
3. Reconcile shared controls/model/persistence and necessary geocoder dependencies; validate targeted controller tests/typecheck; publish work and shared continuity.
4. Apply remaining discovery/provider changes while proving current casino registry/policy intact; validate casino and international regressions; publish work and shared continuity.
5. Inventory both test suites and add meaningful combined regressions; publish stabilized tests and shared continuity.
6. Reconcile browser harnesses/workflow and validate deterministic browser behavior on a fresh auth-enabled production bundle; publish work and shared continuity.
7. Run actual combined repository/application tests, casino/location regressions, schema/ID/manifest/alias audits, typecheck, changed-code lint, safe dev and production builds, 30 icons and deterministic/real-provider browser checks. Publish first complete green combined state immediately.
8. Adversarial review focused on integration changes; fix/revalidate findings, then reconcile current shared continuity before non-production integration. Verify exact candidate/integration revisions and CI, publish final shared continuity.

Each shared update records the already-known work SHA/message, branch, completed validation, blockers and next action, and is read back from GitHub before the next major phase. Candidate commits and shared continuity commits will be reported chronologically. No claim that an immutable commit embeds its own SHA.

## Boundaries and stop condition

Physical-phone GPS, installed PWA, authenticated hosted sessions and external Maps app navigation remain explicit later acceptance checks. Public providers may time out; retain honest fallback/error behavior and record actual observations. Stop with a clean combined non-production candidate, preserved casino freeze, actual passing combined gates and current shared continuity. Casino research is not reopened.
