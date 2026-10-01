# Pick For Us — Seasonal Source Resilience Phase 0C — Free Permission Outreach 1

Repository: `caleb1234calvin-art/dinner-roulette`
Branch: `audit/seasonal-source-resilience-1`

Frozen production baseline:
`9337f6ede14b314f10d6b79720aef62ee94fad7d`

Frozen research baseline:
`7eb7ceae23f071b6bd642828e8693a93d53b9bc7`

Frozen research tree:
`bb2193a6d9ad4432b20e4116976e6ba7764abffd`

Authorizing user instruction:
The owner explicitly said to continue after being told the next step was free permission outreach to the smallest high-value source set. This handoff authorizes outreach only within the bounded scope below.

Required repository reading:
- `docs/handoffs/active/seasonal-source-resilience-audit-1.md`
- `docs/handoffs/active/seasonal-source-resilience-phase-0-overture-pilot-1.md`
- `docs/handoffs/active/seasonal-source-resilience-phase-0b-operator-dmo-pilot-1.md`

Prior Phase-0B final state:
`SEASONAL SOURCE PHASE 0B — OPERATOR/DMO NO-GO / DEFER`

## Purpose

Perform a **bounded, free permission-outreach task** to determine whether two high-value official sources will grant Pick For Us explicit permission to retrieve, store/cache, combine and publicly display a narrowly defined seasonal fact set.

This is NOT an integration task.

This task may contact only:

1. **Visit Springfield**
2. **Exeter Corn Maze**

Do not contact Aurora, Annabelle, Hotel of Terror / Dungeons of Doom, Park Board, or any other organization in this task.

## Why these two

Phase 0B found useful current-season research evidence but zero useful acquired sources with proven reusable rights.

The recommended next task was explicit owner-authorized outreach, beginning with:
- Visit Springfield as the smallest high-value regional partner
- Exeter Corn Maze as the Carthage-area multi-activity primary control

Aurora was explicitly optional only if needed after the first responses and is NOT authorized in this task.

## Free-only invariant

This task must remain **zero-cost**.

DO NOT:
- purchase anything
- start a paid trial
- subscribe to a paid service
- create a commercial provider account
- enter payment information
- accept a paid license
- accept a contract that creates fees, minimum commitments, exclusivity or other financial obligations
- create API keys or credentials
- agree to usage-based billing
- sign on behalf of the owner
- accept click-through terms on behalf of the owner
- negotiate pricing

If a source replies that permission requires payment, a paid tier, paid API, paid license, contract signature, or account purchase:
- do not proceed
- preserve the reply
- classify the target as `PAID_PERMISSION_REQUIRED`
- stop that target without commitment

Free written permission, a free licensed feed, or a no-cost documented data-use grant is acceptable for evaluation.

## Starting-state gates

Before outreach:

1. Fetch fresh refs.
2. Verify `origin/main` remains exactly `9337f6ede14b314f10d6b79720aef62ee94fad7d`.
3. Verify the research branch contains this handoff and descends from `7eb7ceae23f071b6bd642828e8693a93d53b9bc7`.
4. Verify the pre-handoff research tree is exactly `bb2193a6d9ad4432b20e4116976e6ba7764abffd`.
5. Verify branch-vs-main changes are documentation/evidence only with no executable, dependency, configuration, catalog or workflow change.
6. Read all required handoffs IN FULL.
7. If the uncommitted Phase-0B report/JSON/evidence are available in the worker workspace, read them IN FULL and preserve them unchanged. If unavailable, do not reconstruct them; use the locked findings in this handoff and repository handoffs.
8. Begin from a clean checkout before creating any Phase-0C evidence.

If immutable state cannot be verified, stop as `OUTREACH BLOCKED — REPOSITORY STATE`.

## Locked Phase-0B findings

Preserve these findings:

- 29 source paths were assessed across all six geographic controls.
- Useful 2026 seasonal evidence exists.
- No useful acquired source cleared the reusable-rights gate.
- The only explicitly reusable path was a legacy USDA CC0 dataset whose export yielded no useful acquired records.
- No actual snapshot was built.
- No publisher contact occurred.
- No product/runtime changes occurred.
- Phase 1 remains unimplemented.
- Overture remains separately deferred.
- The 20,000 ms server provider budget and independent 25,000 ms client watchdog remain invariants.

For Visit Springfield:
- Phase 0B classified it `permission_required`.
- It provided useful regional pumpkin/corn/Halloween research coverage.
- No public licensed feed was established.
- No retrieval/cache/display grant was established.
- Its current public content is research evidence only until permission is granted.

For Exeter Corn Maze:
- Phase 0B classified it `permission_required`.
- The operator supplies useful 2026 C/P/H season/activity information.
- No licensed machine feed was established.
- No reuse grant was established.
- Public role address observed in the prior report: `info@exetercornmaze.com`.

## Outreach objective

Ask each target for **free, explicit permission** or a free existing licensed feed covering the minimum fields needed for Pick For Us seasonal discovery.

The requested use is:

- public consumer app: Pick For Us
- commercial/public app use is possible in the future, so permission must cover public product use rather than private research only
- offline regional refresh rather than sending each user's precise location upstream
- versioned local storage/cache of a small normalized fact set
- combining permitted claims with other independently sourced claims
- public display/return of permitted normalized facts in app responses
- canonical source link and any required attribution/branding
- no raw-content resale
- no reviews/photos/editorial prose requested
- no bulk redistribution of their original content requested

## Requested field set

Ask whether they can authorize the following fields, or provide an existing feed containing them:

### Venue identity
- stable venue/site ID
- canonical venue name
- street address
- latitude/longitude if they control/license it for reuse
- canonical website URL
- operator/publisher identity

### Seasonal activity
- activity type limited to:
  - haunted attraction
  - corn maze
  - pumpkin patch
- season year
- opening/start date
- closing/end date
- recurring/open days and hours where available
- venue timezone

### Lifecycle / changes
- cancellation
- weather closure
- temporary closure
- not operating this season
- permanently closed/disused if they publish it
- modified/updated timestamp
- stable event/occurrence ID where relevant
- deletion/tombstone or complete-export semantics if available

### Provenance
- source record ID
- publisher/source lineage where known
- canonical source URL

Do not request or ingest:
- reviews
- customer personal data
- photos
- copyrighted marketing copy
- long descriptions
- mailing lists
- analytics
- private partner data unrelated to the requested fields

## Permission questions

The outreach must explicitly ask:

1. Do you authorize Pick For Us to automatically retrieve the specified fields from the named feed/page/export?
2. May Pick For Us store/cache those fields locally for offline regional refresh?
3. May Pick For Us combine those fields with independently sourced claims?
4. May Pick For Us publicly display/return those normalized fields in consumer app responses?
5. Is this permission free of charge?
6. What attribution or branding is required?
7. Are there rate limits or refresh limits?
8. Are there retention, backup or expiration limits?
9. What correction, deletion, revocation or purge requirements apply?
10. Which source records/fields do you own or have authority to sublicense?
11. Are stable venue/activity/event IDs, modified timestamps, cancellations and complete-export markers available?
12. If a structured feed/API exists, may it be used without creating a paid account or paid credential?

The answer must be explicit enough to map into a source-policy record.

## Message quality

Use a concise professional message.

Explain Pick For Us plainly:
- a consumer app that helps people find places/activities
- seasonal discovery currently needs reliable current-season facts
- the project is asking for permission before automating or caching their data
- only a small factual field set is requested
- attribution and canonical links can be included
- no reviews/photos/editorial text are requested

Do not overstate user count, business size, launch status, partnerships, legal status or commercial reach.

Do not claim an existing partnership.

Do not imply that silence equals permission.

## Target 1 — Visit Springfield

Preferred route:
- official Visit Springfield public contact route

Request:
- regional seasonal H/C/P venue/activity/event data for Southwest Missouri
- stable IDs if available
- licensed addresses/coordinates if available
- 2026+ season intervals
- recurrence/hours
- cancellations/closures
- modified timestamps
- source lineage
- a reusable feed/export/API if one already exists

If a general public contact form or role contact is available, use it.

Do not:
- create a partner/extranet account
- create a CRM account
- create a Simpleview account
- accept partner terms
- request paid access

If the only available route requires account creation, paid access, or contract acceptance, classify:
`READY_FOR_OWNER_SEND / CONTACT_ROUTE_RESTRICTED`
and do not proceed through that route.

## Target 2 — Exeter Corn Maze

Preferred route:
- public role email `info@exetercornmaze.com`
- or official public contact form if the email route is unavailable and the form requires no account/paid terms

Request:
- permission for one stable operator record representing the Exeter venue
- separate C/P/H activity claims and calendars
- season dates/hours
- weather closure/cancellation changes
- current address/location fields they are willing to license for reuse
- stable IDs/timestamps if available

Keep C/P/H schedules separate so farm/patch hours never automatically imply haunted-attraction hours.

Do not request photos, marketing copy, reviews or private customer data.

## Contact execution rules

This task authorizes **actual sending** of the two bounded permission requests if the worker has an authorized outbound capability and the route is a normal public contact channel.

Before sending:
- confirm the target is the official organization/operator
- confirm the route is public
- confirm no fee/account/paid terms are required
- preserve the exact outgoing text in evidence

Do not invent a sender email address, phone number, business title or legal entity.

If the outbound tool requires a sender identity that is not already available/authorized, do not fabricate one. Mark the target:
`READY_FOR_OWNER_SEND — SENDER IDENTITY REQUIRED`

If a CAPTCHA, anti-bot challenge, login wall or access control blocks submission:
- do not bypass it
- mark the target `READY_FOR_OWNER_SEND — MANUAL SUBMISSION REQUIRED`

If a route requires agreeing to new legal terms or a contract:
- do not accept
- mark the target `READY_FOR_OWNER_SEND — TERMS REVIEW REQUIRED`

Do not send duplicate messages to the same target during this task.

## Response handling

If a response is immediately available during the same task, classify it conservatively.

Allowed states:

- `FREE_PERMISSION_GRANTED`
- `FREE_PERMISSION_GRANTED_WITH_CONDITIONS`
- `MORE_INFORMATION_REQUESTED`
- `PAID_PERMISSION_REQUIRED`
- `PERMISSION_DENIED`
- `NO_RESPONSE_YET`
- `READY_FOR_OWNER_SEND — SENDER IDENTITY REQUIRED`
- `READY_FOR_OWNER_SEND — MANUAL SUBMISSION REQUIRED`
- `READY_FOR_OWNER_SEND — CONTACT_ROUTE_RESTRICTED`
- `READY_FOR_OWNER_SEND — TERMS REVIEW REQUIRED`
- `OUTREACH BLOCKED — REPOSITORY STATE`

Do not interpret no reply as permission.

Do not implement or ingest anything merely because permission is granted; acquisition validation is a separate later phase.

## Permission artifact requirements

For each target produce a compact evidence record containing:

- target/source ID
- official organization/operator
- public contact route
- exact route used or why not used
- exact outgoing message
- timestamp sent or prepared
- sending result
- response if any
- response timestamp if any
- rights classification
- free/paid status
- exact fields covered
- retrieval permission
- storage/cache permission
- combining permission
- public display permission
- attribution requirements
- rate/refresh limits
- retention/backups limits
- deletion/revocation requirements
- stable IDs/timestamps/cancellation support
- unresolved questions
- evidence URL/message ID where available

Do not store private personal contact information beyond what is necessary to document a public role contact.

## Repository evidence

Produce:

`audit/seasonal-source-resilience-phase-0c-permission-outreach-1-2026-09-30.md`

and:

`audit/seasonal-source-resilience-phase-0c-permission-outreach-1-2026-09-30.json`

plus a bounded evidence directory/archive if useful.

The report must include:

1. exact repository/main/branch identity
2. required reading/evidence availability
3. free-only invariant confirmation
4. Visit Springfield contact route and exact message
5. Exeter contact route and exact message
6. whether each message was actually sent
7. any immediate responses
8. rights classification per target
9. paid/free status
10. exact permission fields/purposes resolved
11. unresolved questions
12. next action per target
13. confirmation that no product/runtime changes occurred
14. final outreach state

## Commit/push policy

Do not modify product/runtime code.

Outreach evidence may remain uncommitted/untracked if it contains response metadata better kept out of Git.

Do not commit personal/private message metadata unless clearly safe and necessary.

Do not merge.
Do not deploy.
Do not run migrations.
Do not change Vercel settings.
Do not add venues.
Do not integrate any source.
Do not create accounts, API keys or credentials.
Do not publish Android/Play artifacts.

If a reusable permission grant is obtained, STOP. The next step is a separate acquisition/refresh/tombstone/snapshot pilot handoff.

## Final state

End with exactly one overall state:

`SEASONAL SOURCE PHASE 0C — OUTREACH SENT / AWAITING RESPONSE`

or

`SEASONAL SOURCE PHASE 0C — PARTIAL OUTREACH / OWNER ACTION REQUIRED`

or

`SEASONAL SOURCE PHASE 0C — FREE PERMISSION RESPONSE RECEIVED`

or

`SEASONAL SOURCE PHASE 0C — PAID OR DENIED`

or

`SEASONAL SOURCE PHASE 0C — OUTREACH BLOCKED`

Stop after the bounded two-target outreach/evidence task.
