# Pick For Us — Seasonal Fact Contract Independent Verification #1

Repository:
`caleb1234calvin-art/dinner-roulette`

Instruction branch:
`handoff/date-night-seasonal-fact-contract-independent-verification-1`

IMMUTABLE verification target:
`f7fa63f5688b1d09e5b0baccfd5e617d0748a41a`

Expected tree:
`b78b792c294de908259dcdd112d148e886eacc6c`

Expected sole parent:
`908510ac25fe5c24335126a0f34ff42fe4d80632`

Implementation branch:
`feature/date-night-seasonal-fact-contract-1`

Implementation authority:
`handoff/date-night-seasonal-fact-contract-1`
commit
`91951bdad7b4c2faad4dd668a32e6d740d5728db`

Design authority:
`handoff/date-night-seasonal-web-enrichment-radial-speed-design-1`
commit
`edb524d2fe49174b217dbcbaf97a1c7edc81608f`

Frozen production main:
`4d937e58d2a65567b54ac5271915bc85b498898b`

Frozen production deployment:
`dpl_7RkbrP1c5g1bd7wpnWgWpc9D25DL`

Current state:
`SEASONAL FACT CONTRACT IMPLEMENTED — AWAITING SOURCE PILOT / VERIFICATION`

---

## Mission

Independently verify the exact frozen Seasonal Fact Contract implementation before any real source pilot is allowed.

This is verification only.

Do NOT:
- modify the target
- amend/rebase/rewrite the implementation branch
- activate any real source
- perform public crawling
- call real geocoders
- add network transport
- add paid/metered APIs
- integrate generated facts into product runtime
- merge main
- promote/deploy production
- mutate Vercel settings
- run migrations
- merge/cherry-pick the separate radial pacing lane

The implementation report is evidence, not authority over Git truth.

---

## First action — immutable identity and scope

Freshly resolve from Git and require:

Candidate SHA:
`f7fa63f5688b1d09e5b0baccfd5e617d0748a41a`

Tree:
`b78b792c294de908259dcdd112d148e886eacc6c`

Sole parent:
`908510ac25fe5c24335126a0f34ff42fe4d80632`

Require:
- implementation branch resolves exactly to target
- target is exactly 1 commit ahead / 0 behind approved base
- merge base is exact approved base
- main remains frozen
- production remains frozen/READY
- aliases/settings unchanged

If any identity differs, STOP.

---

## Required evidence to read

Read in full:
- `audit/date-night-seasonal-fact-contract-1.md`
- all machine-readable evidence under `audit/date-night-seasonal-fact-contract-1-evidence/`
- implementation continuation
- implementation handoff
- design handoff
- every added file under `tools/seasonal-facts/`
- both new scripts
- generated contract artifacts
- exact candidate-vs-base diff

Do not trust the reported "43 added paths" without independently enumerating and classifying the complete delta.

---

## Scope verification

Independently prove:
- candidate is exactly 1 commit ahead / 0 behind approved base
- all pre-existing tracked files are byte-identical to base
- implementation consists only of newly added offline contract/builder/test/evidence/handoff files
- no existing product runtime file changed
- no product runtime imports the seasonal-facts tool surface
- no Vercel/runtime config changed
- no package or lockfile changed
- no dependency added
- no auth/database/native/catalog/UI/branding file changed
- no workflow change activates network/source collection
- no real source is enabled

Any existing-file modification is a verification failure unless Git proves the implementation report was wrong and a new review is warranted.

---

## Contract verification

Independently inspect the schema and builder semantics.

Require strict support for:

### Occurrence identity
- stable occurrence ID
- attraction/operator/location-version relation
- season/year
- eligibility and verification state
- explicit calendar/timezone
- field provenance

### Coordinates
- WGS84
- unresolved/candidate/verified states
- method
- uncertainty
- address fingerprint
- evidence/source IDs
- verifiedAt/reviewer
- point meaning
- unresolved/candidate cannot enter runtime-radius-ready output
- moved address cannot reuse stale verified coordinates without valid evidence

### Observation/evidence
- evidence ID
- source ID
- source-native ID
- canonical URL
- adapter/version
- fetched/checked time
- content hash
- explicit season evidence
- factual assertions
- verification basis

### Field resolution
- selected assertion IDs
- conflicts/rejections
- reason
- reviewer/time
- missing field is not deletion

### Verification state
At least:
- operator-confirmed
- current-season-directory
- current-season-secondary
- historical/unconfirmed

### Scoped lifecycle
At least:
- active assertion
- season-not-operating
- event-cancelled
- moved
- disused
- permanently-closed

Require scope:
- operator
- venue
- attraction
- occurrence

Terminal/negative evidence must survive into tombstone/review output.

### Identity relationships
Require explicit support for:
- source/OSM/catalog crosswalk
- alias decision
- same-event
- hosted-at
- moved-from
- successor/prior-year
- do-not-merge

Same address + same category must NOT auto-merge.

---

## Fact-only boundary

Independently prove runtime/review outputs reject or exclude expressive/non-authorized fields.

Allowed factual class includes:
- name/address/city/state/postal/country
- phone
- operator website
- activity type
- dates/hours/timezone
- coordinates
- source URL/source ID
- checkedAt
- season/year
- verification/lifecycle

Reject:
- reviews
- descriptions
- marketing prose
- photos
- logos
- screenshots
- rankings
- popularity
- ratings
- prices
- arbitrary article text

Unknown fields must fail strictly.

---

## Bounds

Verify enforced limits:
- <=100 published occurrences
- <=512 reviewed identities including quarantine/tombstone records
- <=20 observations per occurrence
- URL <=2048 chars
- name <=200 chars
- address <=500 chars
- runtime JSON <=2 MiB

Require explicit failure on overflow; no silent provenance truncation.

---

## Source registry / permission boundary

This is critical.

Verify source adapters are disabled by default and cannot become active merely because:
- URL is public
- robots/terms are absent
- permission metadata is missing
- an approval boolean is malformed
- review expired
- automatic mode is selected

Unknown/conflicting permission must remain disabled.

Confirm the implementation target contains ONLY invented/synthetic source definitions such as reserved `.invalid` hosts.

No real source may be activated.

---

## Security-policy verification

Independently reproduce policy behavior using synthetic inputs only.

Require:
- HTTPS only
- port 443 only
- exact allowed host/path/query rules
- no userinfo/credentials
- no IP literals
- reject private/loopback/link-local/reserved/metadata IPs
- mapped IPv4/IPv6 handling
- DNS answers validated
- peer address validation hook/contract
- redirect target revalidation
- max 2 redirects
- bounded headers/body/decompressed payload/DOM/JSON-LD
- <=2 MiB decompressed response ceiling
- <=10 s request deadline
- inert HTML/text/JSON-LD only
- no script execution
- no browser/eval
- no LLM-driven ingestion
- no remote parser/schema code
- no image/favicon/subresource fetching
- no arbitrary user URL
- no CAPTCHA/login/paywall/anti-bot bypass
- no automatic retry
- no paid fallback

Important:
This target must NOT contain an implemented real transport that can reach public sites.

---

## Deterministic builder verification

Independently reproduce:
- deterministic stable IDs
- input-order independent content revision/output
- provenance retention
- explicit conflict quarantine
- historical/unconfirmed quarantine
- scoped lifecycle behavior
- moved-event behavior
- same-address distinct events
- recurring next-year occurrences remain distinct
- generic farm hosts multiple events without collapse
- do-not-merge overrides transitive equivalence
- unresolved/candidate coordinates excluded
- failed refresh preserves last-good bytes/freshness
- omitted records do not imply deletion
- terminal negatives persist
- schema/manifest mismatch fails atomically
- tampered manifest/runtime artifacts are rejected
- identical logical inputs produce identical output revision

Verify published generated artifacts:
- bundle.json
- runtime.json
- manifest.json
- ledger.json
- field-source-map.json
- exclusions.json
- tombstones.json
- diff.json / diff.txt

Confirm:
- manifest hashes/byte counts match physical files
- runtime output <=2 MiB
- atomic bundle is coherent
- generated fixtures are synthetic, not scraped real entities

---

## Network and cost proof

Freshly establish:
- zero unmocked collector network attempts
- no real source requests
- no geocoder calls
- no new network SDK
- no Google Places
- no paid search API
- no billing dependency
- no package/lock change
- collector core relies only on Node builtins + already-present dependency surface

Do not claim "free forever" in an absolute sense.
Claim only that this implementation introduces zero metered/billing dependency and no active network collection.

---

## Validation

Expected retained implementation evidence:
- 112/112 new tests
- full suite 841 pass
- 4 existing documentation skips
- zero failures
- dedicated contract typecheck pass
- product typecheck pass
- changed/new-file lint pass
- local migration-free build pass
- offline dependency install/audit checks pass
- zero unmocked network attempts

Independently rerun:
- all seasonal fact-contract tests
- an independent adversarial test matrix
- full suite
- relevant identity/lifecycle/catalog regressions
- dedicated and product typechecks
- changed/new-file lint
- safe migration-free build
- dependency/no-new-package proof
- protected-scope review
- deterministic artifact regeneration/hash comparison

Counts may overlap; do not add overlapping counts.

---

## Full repository lint caveat

Implementation reports:
- repository lint exit 1
- 3 inherited errors
- 6 inherited warnings
- zero new findings

Independently compare exact diagnostics against approved base.

Accept only if:
- candidate adds zero new lint finding
- all changed/new executable files lint clean
- inherited diagnostic files are byte-identical to base

Do NOT report repository lint as clean.

---

## Product preservation

Freshly verify at beginning and end:
- main unchanged
- approved Radial Loading candidate unchanged
- production deployment unchanged
- aliases/settings unchanged
- no preview or workflow is treated as production
- no product runtime behavior changes from this contract candidate

---

## Source-pilot readiness decision

If verification passes, decide whether this exact candidate is ready to serve as the ONLY starting base for:

`feature/date-night-seasonal-source-pilot-1`

The source pilot must still require its own new handoff and permission review.

Independent verification does NOT authorize:
- real crawling
- operator/source activation
- geocoding
- runtime app integration

---

## Final verdict

If all identity, scope, contract, policy, deterministic build, security, offline/network, validation, lint-parity and preservation checks pass:

`SEASONAL FACT CONTRACT INDEPENDENT VERIFICATION PASSED — EXACT CANDIDATE AUTHORIZED AS SOURCE-PILOT BASE`

Authorization applies ONLY to:

`f7fa63f5688b1d09e5b0baccfd5e617d0748a41a`

Tree:
`b78b792c294de908259dcdd112d148e886eacc6c`

Report:
- exact SHA/tree/parent
- complete changed-path classification
- independent adversarial test count/results
- deterministic artifact verification
- network/cost proof
- lint parity caveat
- main/production preservation
- remaining source-pilot boundaries

Do NOT create or run the source pilot in this verification task.

If any blocker exists:

`SEASONAL FACT CONTRACT INDEPENDENT VERIFICATION FAILED — HOLD SOURCE PILOT`

Preserve the blocker and stop.
