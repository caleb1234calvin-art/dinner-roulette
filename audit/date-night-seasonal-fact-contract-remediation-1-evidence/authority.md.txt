# Pick For Us — Seasonal Fact Contract Remediation #1

Repository:
`caleb1234calvin-art/dinner-roulette`

Instruction branch:
`handoff/date-night-seasonal-fact-contract-remediation-1`

Starting failed verification target:
`f7fa63f5688b1d09e5b0baccfd5e617d0748a41a`

Starting tree:
`b78b792c294de908259dcdd112d148e886eacc6c`

Starting sole parent:
`908510ac25fe5c24335126a0f34ff42fe4d80632`

Required remediation branch:
`fix/date-night-seasonal-fact-contract-remediation-1`

Original implementation authority:
`handoff/date-night-seasonal-fact-contract-1`
commit
`91951bdad7b4c2faad4dd668a32e6d740d5728db`

Independent verification authority:
`handoff/date-night-seasonal-fact-contract-independent-verification-1`
commit
`30b4f8e8693ee931b17ecf90282f50b9a3434735`

Current state:
`SEASONAL FACT CONTRACT INDEPENDENT VERIFICATION FAILED — HOLD SOURCE PILOT`

---

## Mission

Repair ONLY the two independently reproduced policy-validation blockers in `tools/seasonal-facts/policy.ts`, add meaningful regression tests, rerun the full offline verification surface, and freeze a new remediation candidate.

This is a narrow remediation task.

Do NOT:
- activate real sources
- add real network transport
- crawl public websites
- call geocoders
- add paid/metered APIs
- integrate seasonal facts into product runtime
- modify main
- promote/deploy production
- mutate Vercel settings
- run migrations
- merge/cherry-pick radial pacing work
- redesign the schema/builder/identity model
- broaden source permissions

The failed candidate remains historical evidence and MUST NOT be amended/rebased.

---

# Blocker 1 — Missing response metrics accepted

## Independent finding

`validateResponseEnvelope()` accepts objects where one or more required numeric response-budget metrics are omitted.

Current implementation destructures `contentType`, then evaluates only `Object.values(counts)`. Missing properties are absent from `counts`, and comparisons such as `undefined > limit` do not reject them.

That creates a future-policy bypass: a transport could omit a measured size/time field and escape that bound.

## Required fix

Make `validateResponseEnvelope()` perform strict runtime shape validation before any budget comparison.

Require EXACT required fields:

- `contentType`
- `headerBytes`
- `wireBytes`
- `decompressedBytes`
- `elapsedMs`
- `domNodes`
- `depth`
- `jsonLdBytes`
- `requests`

Requirements:
- metrics must be a non-null plain object
- every required field must be an own property
- no sparse/missing key can be accepted
- all numeric fields must be finite safe non-negative integers
- contentType must be a string and allowed by source policy
- preferably reject unknown extra keys so future callers cannot silently pass malformed measurement envelopes
- then enforce all configured size/time/request ceilings

Do not weaken any existing maximum.

## Required RED/GREEN tests

Add direct failures for omission of EACH required metric one at a time.

At minimum test missing:
- headerBytes
- wireBytes
- decompressedBytes
- elapsedMs
- domNodes
- depth
- jsonLdBytes
- requests

Also test:
- missing contentType
- undefined explicit values
- null metrics object
- arrays/non-object shapes
- NaN/Infinity/fractional/negative numeric values
- unexpected extra key if strict shape is adopted
- exact-bound values continue to pass
- bound+1 continues to fail

The test must call the exported function through real runtime JS semantics, not rely only on TypeScript compile-time types.

---

# Blocker 2 — Sparse redirect arrays skip validation

## Independent finding

`validateRedirectChain()` uses `chain.forEach(...)`.

JavaScript `Array.prototype.forEach` skips holes in sparse arrays, so a chain such as a sparse three-slot array can satisfy length bounds while one or more redirect hops are never validated.

## Required fix

Reject sparse arrays and validate EVERY redirect hop by index.

Requirements:
- input must be a dense Array
- no missing numeric index from `0..length-1`
- every element must be a string
- every hop must pass `validateUrl()`
- redirect count remains bounded by source policy and absolute max 2 redirects / max 3 URLs
- no automatic redirects are introduced
- no URL-policy relaxation

A simple indexed loop with explicit own-index checks is acceptable.

## Required RED/GREEN tests

Add direct failures for:
- `new Array(1)`
- sparse two-hop chain
- sparse three-slot chain with a missing middle hop
- array with explicit `undefined`
- array with non-string hop
- over-limit dense chain

Retain passing cases for:
- one valid URL / zero redirects
- two valid URLs / one redirect
- three valid URLs / two redirects when source budget allows
- all hops individually revalidated

Include a test where the skipped/missing position would otherwise hide a hostile URL scenario.

---

# Scope

Expected product/runtime impact:
NONE.

Expected implementation delta:
- `tools/seasonal-facts/policy.ts`
- focused seasonal fact-contract tests
- remediation evidence/continuation only

Existing product files must remain byte-identical to failed candidate/base.

Do not modify:
- schema.ts unless independently necessary to express strict metric shape and the change is justified
- builder identity/resolution logic
- generated production-runtime app files
- package.json/package-lock
- Vercel config
- application `src/`

If repair requires broader architectural changes, STOP and return:
`SEASONAL FACT CONTRACT REMEDIATION INCOMPLETE — REVIEW REQUIRED`

---

# Regression requirements

Freshly rerun:
- original 112 contract tests
- new remediation tests
- independent reproductions for both blockers
- deterministic artifact generation/reproduction
- full suite
- contract typecheck
- product typecheck
- changed/new-file lint
- full lint parity against base
- safe migration-free local build
- dependency/no-new-package proof
- protected-scope audit
- offline network tripwire

Require:
- zero unmocked collector network attempts
- no source activation
- no runtime integration
- no package/lock change
- no billing dependency

Full repository lint is still allowed to retain ONLY the exact inherited 3 errors + 6 warnings. Do NOT call it clean.

---

# Security verification

Independently add an adversarial matrix specifically proving:

### Envelope completeness
No required measurement can be absent, sparse, inherited-only, undefined, non-integer, non-finite, or negative.

### Redirect density
No redirect hop can be skipped because of sparse-array semantics.

### Existing policy remains intact
- HTTPS only
- port 443
- host/path/query allowlists
- IP-literal rejection
- private/reserved IP rejection
- DNS/peer pinning contract
- max redirects
- resource ceilings
- no active transport
- no scripts/browser/eval/LLM extraction
- no retries
- no paid fallback

---

# Preservation

Freshly verify at beginning and end:
- main remains `4d937e58d2a65567b54ac5271915bc85b498898b`
- approved Radial Loading base remains `908510ac25fe5c24335126a0f34ff42fe4d80632`
- failed fact-contract candidate remains `f7fa63f5688b1d09e5b0baccfd5e617d0748a41a`
- production remains READY `dpl_7RkbrP1c5g1bd7wpnWgWpc9D25DL`
- aliases/settings unchanged

No production movement is authorized.

---

# Final state

If both blockers are meaningfully RED on the failed candidate, GREEN on remediation, and all regressions pass:

`SEASONAL FACT CONTRACT REMEDIATION IMPLEMENTED — AWAITING INDEPENDENT REVERIFICATION`

Freeze and report:
- exact remediation SHA
- tree
- sole parent
- exact changed paths
- meaningful RED evidence for both blockers
- GREEN adversarial matrix
- updated contract/full-suite counts
- deterministic artifact verification
- network/dependency/cost proof
- lint parity caveat
- main/production preservation

Do NOT start the source pilot.

If any blocker remains:

`SEASONAL FACT CONTRACT REMEDIATION INCOMPLETE — REVIEW REQUIRED`

Stop.

---

## First action

Freshly verify the failed candidate identity, read the independent verification failure and `policy.ts`, create `fix/date-night-seasonal-fact-contract-remediation-1` from exact failed candidate `f7fa63f...`, and reproduce both failures BEFORE editing.
