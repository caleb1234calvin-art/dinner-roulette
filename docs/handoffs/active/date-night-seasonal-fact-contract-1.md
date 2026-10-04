# Pick For Us — Seasonal Fact Contract #1

Repository:
`caleb1234calvin-art/dinner-roulette`

Instruction branch:
`handoff/date-night-seasonal-fact-contract-1`

Starting immutable base:
`908510ac25fe5c24335126a0f34ff42fe4d80632`

Starting tree:
`3211b4df4eccb638a8c492da047eac3b24abb600`

Required implementation branch:
`feature/date-night-seasonal-fact-contract-1`

Design authority:
`handoff/date-night-seasonal-web-enrichment-radial-speed-design-1`
at commit
`edb524d2fe49174b217dbcbaf97a1c7edc81608f`

Current state:
`SEASONAL WEB ENRICHMENT + RADIAL SPEED DESIGN READY FOR IMPLEMENTATION`

## Mission

Implement the OFFLINE seasonal fact/evidence/identity contract and deterministic index builder foundation.

This task does NOT activate real web sources and does NOT integrate enriched records into the app runtime yet.

Do not modify the approved release candidate.
Do not move main.
Do not promote/deploy.
Do not crawl real sites.
Do not call public geocoders.
Do not add paid/metered APIs.
All network adapters must remain disabled/inert.

## Data model

Create a strict versioned contract supporting:

### Occurrence
A specific seasonal event occurrence for a specific season/year:
- stable occurrence ID
- attraction/entity relation
- physical venue/location version
- activity types
- season/year
- explicit date/calendar/timezone data
- eligibility state
- current verification state
- field-level provenance references

### Coordinates
- WGS84 lat/lon
- method
- precision/uncertainty
- normalized address fingerprint
- source/evidence IDs
- verifiedAt/reviewer
- meaning of point (entrance/venue)
- status: unresolved / candidate / verified

Unresolved coordinates are never runtime-radius eligible.

### Observation
- stable evidenceId
- sourceId
- source-native record ID when present
- canonical source URL
- adapter/version
- checked/fetched time
- content hash
- explicit season/year evidence
- normalized factual assertions
- verification basis

### Field resolution
- selected assertion IDs
- rejected/conflicting assertion IDs
- reason enum
- reviewer/time
- missing field is NOT deletion

### Verification state
Support at least:
- operator-confirmed
- current-season-directory
- current-season-secondary
- historical/unconfirmed

These are evidence-quality states, not probability scores.

### Lifecycle
Support scoped factual states:
- active assertion
- season-not-operating
- event-cancelled
- moved
- disused
- permanently-closed

Include:
- subject scope: operator / venue / attraction / occurrence
- effective interval/date
- evidence IDs

Never reduce this to a bare boolean closed flag.

### Identity links
Support explicit:
- source/OSM/catalog crosswalks
- alias decisions
- same-event
- hosted-at
- moved-from
- successor/prior-year relation
- explicit do-not-merge pairs

Same address + same category MUST NOT automatically mean same event.

## Fact-only boundary

Allowed factual fields include:
- name
- address
- city/state/postal/country
- phone
- operator website
- category
- operating dates
- hours
- timezone
- coordinates
- source URL/source ID
- checkedAt
- season/year
- verification/lifecycle state

Do not ingest into the runtime index:
- reviews
- descriptions
- promotional prose
- rankings
- logos
- photos
- screenshots
- arbitrary page text
- fabricated ratings/prices/popularity

Normalize whitespace/Unicode but preserve display spelling.

## Bounds

First contract must enforce:
- <=100 published occurrences
- <=512 reviewed identities including quarantines/tombstones
- <=20 observations per occurrence
- URL <=2048 chars
- name <=200 chars
- address <=500 chars
- runtime JSON <=2 MiB

Reject overflow with review output; never silently truncate provenance.

## Source registry contract

Define disabled-by-default adapter metadata:
- source ID/name/class
- exact allowed HTTPS hosts
- allowed path patterns
- allowed query parameters
- allowed content types
- parser ID/version
- field allowlist
- season/category rules
- attribution/license requirements
- robots/terms review metadata
- permission/reuse evidence
- review expiry
- manual/automatic mode
- request budgets
- cadence metadata
- last attempted/successful refresh
- failure state

Unknown/conflicting permission keeps automatic collection disabled.

No site is approved merely because it is publicly reachable.

## Security contract

Build the collector boundary so later adapters cannot casually bypass it:
- HTTPS only, port 443
- exact allowlisted hosts/paths
- no credentials/userinfo
- no IP literals
- redirect revalidation
- reject private/loopback/link-local/reserved/metadata IPs incl. mapped forms
- DNS/peer validation design hooks
- max 2 redirects
- bounded headers/body/DOM/JSON-LD
- 2 MiB decompressed response ceiling
- 10 s request ceiling
- inert HTML/text parsing only
- no scripts/browser/eval/LLM-driven extraction
- no remote parser/schema code
- no subresource/image/favicon fetching
- no arbitrary user URL
- no login/CAPTCHA/paywall/anti-bot bypass
- no automatic retry
- no paid fallback

In this A1 task, real network fetching remains disabled. Test policy logic with synthetic fixture hosts/data only.

## Deterministic build

Implement an offline deterministic builder that can:
- validate source registry/policy state
- ingest synthetic/manual reviewed observations
- resolve facts/conflicts
- preserve field provenance
- resolve occurrence/entity relations
- quarantine historical/conflicting/closed/unresolved records
- reuse only verified coordinates
- produce runtime facts + manifest + field-source map + exclusions/tombstones + human-readable diff
- generate identical content revision from identical logical inputs independent of input order
- fail atomically on schema/manifest mismatch
- retain last-good freshness rather than refreshing timestamps after a failed build

No production app/runtime integration yet.

## Identity requirements

Guard occurrence identity BEFORE legacy proximity-only dedupe.

Must correctly represent synthetic fixtures for:
- missing-OSM seasonal attraction
- OSM + web duplicate
- same operator different event
- two events at same address
- recurring next-year occurrence
- moved venue
- closed attraction with active duplicate source
- generic farm hosting multiple events
- explicit do-not-merge pair

## Tests

Use only invented/synthetic facts and deterministic timestamps.

Required:
- schema rejection/unknown fields
- bounds
- provenance/conflict resolution
- current-year vs footer-year ambiguity
- historical/unconfirmed quarantine
- lifecycle scope
- moved identity
- same-address distinct events
- order-independent stable IDs/output
- coordinate unresolved exclusion
- timezone/calendar representation
- source policy disabled-by-default
- permission state cannot be bypassed
- hostile URL/SSRF validation
- zero unmocked network
- zero metered dependencies
- deterministic repeated build
- failed refresh does not refresh stale facts
- terminal negatives persist in tombstone output

Preserve existing product files byte-for-byte except the new offline contract/build/test surface unless a narrowly necessary shared type extension is proven and documented.

## Real-source activation boundary

Do NOT activate:
- MissouriHauntedHouses
- Visit Springfield
- Exeter operator pages
- any other public site

in A1.

Real source work belongs to the later:
`feature/date-night-seasonal-source-pilot-1`
from a verified A1 candidate.

## Final state

If the offline contract/build/tests pass:

`SEASONAL FACT CONTRACT IMPLEMENTED — AWAITING SOURCE PILOT / VERIFICATION`

Freeze exact SHA/tree/parent and write continuation/evidence.

Otherwise:

`SEASONAL FACT CONTRACT INCOMPLETE — REVIEW REQUIRED`

## First action

Freshly verify the exact base SHA/tree, read the design handoff, inspect existing Date Night types/identity/lifecycle/catalog structures, create `feature/date-night-seasonal-fact-contract-1` from the exact base, and implement only the offline contract/build/test foundation with all network paths disabled.
