# Pick For Us — Date Night Radial Loading Browser Acceptance Remediation 1

Repository:
`caleb1234calvin-art/dinner-roulette`

Authoritative instruction branch:
`handoff/date-night-radial-loading-browser-acceptance-remediation-1`

Required implementation branch:
`fix/date-night-radial-loading-browser-acceptance-remediation-1`

Starting preserved checkpoint:
`7b33c6aeb34a625bb9ff0e6427f68821c27ddd74`

Frozen production main:
`4d937e58d2a65567b54ac5271915bc85b498898b`

Current state:
`DATE NIGHT RADIAL LOADING INCOMPLETE — REVIEW REQUIRED`

## Why this remediation exists

The first genuinely browser-capable GitHub-hosted acceptance run escaped all previous environment blockers and executed the real controlled harness.

Controlled acceptance result:

- progressive-success — PASS
- middle-failure — PASS
- outermost-failure — PASS
- options-stable — PASS
- future-pick — PASS
- radius-increase — BLOCKED by concrete accessibility/control defect
- remaining four scenarios not executed because the harness stopped on that failure
- public-provider calls: 0
- live acceptance: not run

The failure is no longer environmental.

The browser harness timed out on:

`getByRole('slider', { name: 'Travel distance', exact: true })`

Inspection of current shared slider implementation shows the Date Night caller passes:

`aria-label="Travel distance"`

to `<Slider ... />`, but the shared `src/components/ui/slider.tsx` spreads those props onto `SliderPrimitive.Root`.

Radix Slider exposes the actual accessible `role="slider"` on `SliderPrimitive.Thumb`, not the Root. Therefore the caller's accessible name is not necessarily attached to the element assistive technology/browser automation recognizes as the slider.

This is a concrete product accessibility defect exposed by real-browser acceptance, not merely a harness issue.

## Remediation scope

Fix the shared Slider primitive so a caller-provided accessible label/name reaches the actual slider thumb/control.

Preserve current public component API if practical.

Do not special-case Date Night unless the shared primitive cannot support the correct semantics.

The fix must preserve:

- single-thumb distance sliders
- mood/adventure sliders
- any other existing Slider callers
- Radix keyboard behavior
- current visible styling/layout
- distance tick rendering
- controlled values/onValueChange
- multi-thumb behavior if currently supported by the wrapper

## Required investigation

Before runtime edits:

1. Read all current `Slider` call sites.
2. Confirm how Radix Slider Root/Thumb expose ARIA attributes.
3. Determine whether existing callers provide `aria-label`, `aria-labelledby`, or neither.
4. Confirm whether spreading Root props currently drops/misplaces accessible naming.
5. Add a focused RED regression that queries the actual role=slider element by its supplied accessible name.

Do not weaken the acceptance harness to query an unlabeled slider.

## Preferred implementation direction

For a one-thumb Slider wrapper:

- extract accessible naming props intended for the interactive thumb
- pass them to `SliderPrimitive.Thumb`
- avoid leaving conflicting/invalid accessibility props on Root
- preserve other Root props

If multiple thumbs are supported, define deterministic semantics for labels rather than duplicating one label ambiguously. Existing usage may all be single-thumb; verify before choosing the smallest correct implementation.

## Mandatory tests

At minimum:

1. a supplied `aria-label="Travel distance"` yields a browser/DOM element with `role="slider"` and accessible name `Travel distance`
2. supplied mood/adventure label remains discoverable
3. keyboard Home/End on the named slider still changes the intended control
4. current distance tick UI remains unchanged
5. no regression to existing slider users
6. typecheck/lint/diff checks pass

If a shared Slider accessibility test framework already exists, extend it. Otherwise add the smallest permanent regression test consistent with the repository's test style.

## Revalidation after fix

Run focused slider/component tests first.

Then rerun all directly affected Date Night progressive/client tests.

Then rerun the GitHub-hosted controlled radial browser acceptance from the corrected implementation.

Acceptance must restart from scenario 1; do not count the prior 5 passes as the final 10/10, although preserve them as historical evidence.

If controlled 10/10 passes:

- proceed to the existing bounded live Preview acceptance
- keep the 3-RPC cap
- no monolithic 50-mile request
- preserve all evidence

If another concrete defect appears, stop and preserve it rather than chaining speculative fixes.

## Guardrails

Do NOT:

- modify the browser harness merely to bypass the missing accessible name
- merge to main
- promote production
- run migrations
- run migration-chaining `npm run build`
- broaden provider traffic
- touch Radial Loading geometry/cache/provider logic unless a new defect directly requires it

This remediation should be narrowly scoped to the shared control accessibility defect and its tests.

## Final outcome

If remediated and controlled/live acceptance later passes:

`DATE NIGHT RADIAL LOADING IMPLEMENTED — AWAITING INDEPENDENT VERIFICATION`

If a required gate still fails:

`DATE NIGHT RADIAL LOADING INCOMPLETE — REVIEW REQUIRED`

## First action

Create `fix/date-night-radial-loading-browser-acceptance-remediation-1` directly from `7b33c6aeb34a625bb9ff0e6427f68821c27ddd74`.

Read every Slider call site and existing slider/component tests.

Reproduce the missing accessible name RED before editing the shared Slider implementation.
