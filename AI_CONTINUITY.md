# Pick For Us — AI Continuity: independent radius-evidence acceptance

## CURRENT — Astra's Nov 11 (Chicago) radius placement acceptance, recorded Nov 12 UTC

**Milestone DONE, release HOLD.** Astra independently verified Dot's candidate visitor-placement evidence and posted its complete acceptance and bounded Codex handoff in [Issue #93 comment 6813951806](https://github.com/caleb1234calvin-art/dinner-roulette/issues/93#issuecomment-6813951806). Reviewed source access: November 11, 2026 America/Chicago / November 12 UTC. This latest acceptance supplements Dot's [research 6813704313](https://github.com/caleb1234calvin-art/dinner-roulette/issues/93#issuecomment-6813704313); it does **not** supersede Astra's separate PR #96 [ACCEPT WITH REQUIRED CHANGES 6813347588](https://github.com/caleb1234calvin-art/dinner-roulette/issues/93#issuecomment-6813347588), fix code, establish visitor entrances or authorize publication. Preserve the complete previous continuity below unchanged.

### Field-level radius decisions (exact reviewed precision)

- **C26-010 NEWcaps: ACCEPT RADIUS-ONLY** school-district-linked Neosho High School KML named marker `36.8638487, -94.3805242`. Marker record `46AFBEFC73F983ED` is expressly the campus host, NOT the fair door, visitor arrival, parking or navigation. Map dates to September 2024; no marker-specific accuracy bound. An independent MSHSAA school locator is **193 m** away; this demonstrates a meaningful near-cutoff discrepancy but is **not a measured error bound**. Date Night only for the December 5, 2026 fair (9 a.m.–3 p.m. CST, free visitors) if all other gates pass. Do not create ordinary school venue.
- **C26-001 Sparkle: ACCEPT RADIUS-ONLY** `37.1734644, -94.3130247`, independently reconstructed bounding-box midpoint of Central Park OSM way `987588580` v2 / changeset `189037687`; point lies inside this mapped polygon. OSM boundary nodes are from **September 2021**; the 2026 way-tag revision is not a new geographic survey. Farthest bounding-box corner ~113 m is site extent, not coordinate accuracy. Preserve existing canonical park ID `date-night-osm-way-987588580`. **Ordinary-path binding HOLD**: `out center tags;` omits required revision fields, mirror replication freshness and operational revision-acquisition were not established. The independent direct OSM API result does not clear the application path. Visitor entrance/directions/accessible approach remain unknown. Product lights window Nov 27–Dec 31; display 5 p.m.–midnight.
- **C26-005 Olde World: ACCEPT RADIUS-ONLY** `37.1721466, -94.3086071`, church-linked Google named place for Grace Episcopal, 820 Howard St, corroborated by OSM mapped footprint (way `437235888`). A separate place representation ~1.3 m away is not a distinct destination. Church calendar first-party public iCalendar names the Parish House, classrooms, hallways and kitchen in both shopper sessions. No fair-specific exterior door, check-in, parking, entry accessibility or nav authorization. Friday Dec 4 gala $10, 5:30–7 p.m.; Saturday Dec 5 free market 9 a.m.–2 p.m., no overnight access. One edition-scoped event key with two sessions; no ordinary church venue.
- **C26-007 Downtown lighting/parade: HOLD RADIUS for BOTH sessions; REJECT both city calendar points.** Lighting geocode `37.1765791, -94.31021799999999` lies within courthouse footprint OSM way `437235836` (~7.5 m mapped edge). Parade geocode `37.1765922, -94.3111831` lies within separate west-side building way `437235858` (~9.0 m from mapped edge). Neither is a known spectator placement. Square sidewalk way `1375949279` is a closed **footway line**, not a filled spectator polygon. Historic walking-tour guidance is not a 2026 event crowd allocation. Separate fixed square lighting and moving parade route; starts on Dec 7 are known, finishes unknown. Do not infer Open Now or accept a route/float start as spectator arrival.

### Required interpretation and handoff

1. **Approximate host radius is not strict boundary clearance.** Carry each accepted point with method, date, host/event key, source URLs and uncertainty metadata. Do NOT treat the existing picker `+0.05 mi` allowance as geolocation accuracy. Hold ambiguous near-radius decisions unless site extent/uncertainty can no longer change eligibility. Maintain inside/outside/ambiguous tests, both market sessions, zero downtown radius placements and no event Directions/rideshare/parking actions sourced from any radius point.
2. **Publication HOLD unchanged for all four.** An accepted approximate host coordinate is not an approved spectator region, event entrance, drop-off, navigation pin, parking facility, accessibility assurance or sign-off to activate the record. Three temporary-event venues remain distinct from ordinary catalog rows; Sparkle's park binding still depends on normal discovery revision evidence, and no missing park may be fabricated from a midpoint.
3. **Next Codex engineering task is sequential, NOT a duplicate concurrent implementation.** Owner has previously sent Codex the three high-priority PR #96 corrections (open-screen event/occurrence continuity to stop ordinary Directions leaks; preservation of conflicting raw OSM revisions; keyboard/focus/Escape/dialog semantics and AA contrast). At this checkpoint its new SHA and CI were not supplied or independently accepted. **After that returns**, use Astra's [radius implementation handoff](https://github.com/caleb1234calvin-art/dinner-roulette/issues/93#issuecomment-6813951806) to integrate precisely three reviewed host points in an isolated candidate, test radius ambiguity/fail-closed handling, preserve existing HOLD statuses, and separately review the combined outcome. Do not edit an active implementation branch or treat either stream as completed before a returned SHA.
4. **Future evidence:** A 2026 venue/spectator plan is still needed for **each downtown session**. A park arrival gate and the two other event entrances remain unverified. An OSM ordinary discovery path with revision and mirror freshness, contradictory-revision preservation and safe open-selection behavior are required before any public park binding. Combined Storybook Christmas V4, full visual/keyboard/screen-reader/TalkBack and physical Android/WebView acceptance are still separate milestones.

### Exact state and authority

- Master scope Issue #86; attraction queue and independent research Issue #93.
- Last independently reviewed UI candidate draft PR #96: `ba50b14ae36b80961036986f0cdfe50786039a52`, tree `4904392d3cba03f92fe070abb2221f173ca3d519`. Its prior general/Android CI succeeded but does not cover Astra's newly found regressions.
- Visual candidate draft PR #90 remains separate at `5f6c2175306af8da76df49cc9a11ce492f555595`. Main last checked at `e078dcdaa9f0ca84951409cdb92805731af3d34b`.
- **No production merge/deployment, Android signing, Google Play action, external operator contact, public catalog import, event activation or owner release authorization.** Milestone continuity protocol remains mandatory after each completed significant checkpoint; preserve history and verify a one-file docs-only commit.

---

## Preserved previous continuity checkpoint (Dot evidence collection; verbatim)

# Pick For Us — AI Continuity: Dot visitor-placement research checkpoint

## CURRENT — November 12, 2026 UTC: Dot targeted evidence DONE; Astra review pending; Codex critical corrections in progress

**Documentation-only milestone.** Recorded from Dot's verified GitHub research handoff at Issue #93, comment [`6813704313`](https://github.com/caleb1234calvin-art/dinner-roulette/issues/93#issuecomment-6813704313). Dot says requests and research occurred on November 12, 2026 UTC; the record distinguishes individual content acquisition times from access/request dates and publication dates. This is *new research*, not independent Astra acceptance or implementation clearance. Prior continuity is reproduced unchanged after this checkpoint.

### DONE — new evidence, correctly scoped

- **C26-001 Sparkle in the Park:** Authoritative OSM object/history/changeset endpoints reported way `987588580` at v2, changeset `189037687` (timestamp September 15, 2026). A derived OSM park bounding-box midpoint `37.1734644, -94.3130247` is a **radius-only review candidate**, NOT an entrance, travel destination or proof of measured accuracy. Existing normal Date Night Overpass query uses `out center tags;`, lacks reviewed version/changeset, and a verified live `out meta` packet was not obtained (one endpoint HTTP 403, another timed out). The existing synthetic mixed-v2/v3 conflicting-classification bug and in-flight open-event selection bug remain unresolved. The 2026 walk-through event's entrance, parking and directions are not established.
- **C26-010 NEWcaps Holiday Craft Fair:** The official Neosho School District map links a named `Neosho High School` marker at `36.8638487, -94.3805242`. This is a **campus-level radius candidate** from district-linked map material with visible 2024 publication and unstated positional precision; not a 2026 event-specific entrance, drop-off, parking or door. The current 2026 fair listing supports December 5, 9 a.m.–3 p.m. CST, free public visitor admission in cafeteria/hallways/auxiliary gym. District school does not become an ordinary Date Night venue.
- **C26-005 Olde World Christmas Market:** Grace Episcopal's rendered calendar details name `Parish House, Classrooms, Hallways, Kitchen` for the December 4 gala and December 5 market. Diocesan hours and $10 Friday/free Saturday admissions are reaffirmed. Neither calendar room names nor old general building ramp/parking statements establish a 2026 fair-specific exterior door, arrival point, parking permission or accessible route. **No independently sourced radius coordinate** acquired for market; HOLD.
- **C26-007 downtown lighting/parade:** City calendar geocodes for lighting and parade were found inside mapped building outlines (courthouse and a west-side building), so both were explicitly **rejected as visitor/spectator placement**. Public sidewalk around Carthage Square is an **area/line candidate**, NOT a verified 2026 spectator zone, radius point or event gate. OSM sidewalk way `1375949279` is a closed *line*, not a filled plaza polygon. Start-only caroling/lighting/parade schedule remains; calendar end slots are not confirmed actual finish times; neither event session becomes Open Now.

### Independent verification handoff — next action

**Send to Astra Work:** independently evaluate Dot's four-record evidence packet at Issue #93 comment `6813704313`, ranked **NEWcaps → Sparkle → Olde World Market → Downtown**. Verify first-party/district source affiliation, source freshness and point geometry, radius-only precision and uncertainty, whether candidate placements can support actual radius decisions, and whether any missing event-specific placement still blocks them. Review invalid downtown city geocodes and closed sidewalk-line semantics. Confirm the normal OSM revision-acquisition gap separately from authoritative direct-API reads. For each field, return ACCEPT RADIUS-ONLY, HOLD or REJECT with reason and sources. Do **not** change existing Astra verdicts, production event flags or code. No operator outreach, publishing, maps/navigation/ticket actions, merge, signing or deployment.

### Workstream and safety state

- Dot's targeted research assignment is **DONE** for source collection and issue handoff; it is not independently VERIFIED for the new radius evidence. Earlier discovery queue in #93 remains preserved, including its 24 deduplicated leads and initial 12 Astra verdicts.
- Codex's separate critical correction assignment is **owner-reported RUNNING**, without a returned new SHA in this thread. Scope: (1) open selection/occurrence continuity so event cannot switch to ordinary host and leak Directions, (2) mixed provider revision/classification conflict, (3) keyboard dialog focus/Escape and AA contrast at 320/390/512. Do not mark complete merely because earlier #96 CI was green.
- Astra is next for this read-only **location-evidence acceptance**; its independent code acceptance should follow the new Codex candidate separately. Combined Storybook V4 and actual Android/TalkBack/WebView acceptance remain outstanding.
- Draft PR #96 remains at last verified head `ba50b14ae36b80961036986f0cdfe50786039a52`; V4 draft #90 at `5f6c2175306af8da76df49cc9a11ce492f555595`. Last verified main `e078dcdaa9f0ca84951409cdb92805731af3d34b`. All four Christmas attraction publication flags remain HOLD; no public import/merge/deploy/sign/Play action or owner release authority.

### Milestone continuity procedure

Owner's November 11 rule continues: update this `AI_CONTINUITY.md` on the deployment-suppressed documentation branch after each material **completed** milestone, preserve prior historical text and provenance, verify the exact file-only diff and commit, and never treat research candidates or green CI as publication approval. The current handoff is Astra verification of Dot's evidence, parallel with ongoing Codex corrections.

---

## Previous continuity checkpoint (Nov 11, 2026; preserved verbatim)
# Pick For Us — AI Continuity: Christmas 2026 operational checkpoint

## CURRENT — November 11, 2026: Storybook Christmas; two independent assignments active

**Scope and authority:** Documentation-only continuity delta. This file is an AI-to-AI handoff, not a change to production, a completed feature release, an automated recurring task, or a blanket authorization to merge/deploy/sign/publish. Preserve the entire preceding continuity history below unchanged. Release authorization always requires a separate explicit owner decision.

**Current deployment and baseline:** Main remained e078dcdaa9f0ca84951409cdb92805731af3d34b at the last GitHub read; the four Christmas pilot attractions are all DISABLED/HOLD. Do not claim PRs #90, #94, #95 or #96 have been merged or released. The Christmas season for the Date Night experience is November 27–December 31, 2026, inclusive, America/Chicago; no Christmas category in Dinner/Nightlife; no seasonal recurrence into 2027.

### OWNER DESIGN — Storybook Christmas V4 baseline

- Owner accepted the peaceful, visibly continuous snowfall after V3: visual density 68/100, natural mix of distant flecks, soft irregular midground and rare crystalline foreground flakes, roughly 10% faster falling than V3, not a blizzard. Visual stack is winter background and village/scenery, then transparent snow, then interactive bubbles/text/controls; touches never intercepted.
- Storybook Christmas is nostalgic, cozy, miniature-village/stop-motion-influenced. V4 visual candidate exists at draft PR #90, head 5f6c2175306af8da76df49cc9a11ce492f555595 (two exact-head general and Android workflows reported SUCCESS). The V4 visual has NOT been accepted together with the event-aware UI on PR #96. Compact opt-out design, light-theme, screen-reader/keyboard, ordinary-motion and physical Android/WebView acceptance remain separate gates.

### MILESTONES — work completed and retained

1. **Design and foundation:** Master GitHub Issue #86. Issue #87 isolated venue-wide resolver at a44967628f27e198390dc8222fff3d8ff194eb07. Issue #88 modular atmosphere foundation at a8119007345f1c4524884bf05b1c13d1fbb6a282. Issue #89 tracked V4 preference. The approved visual branch remained separate from event/picker branches.
2. **Picker architecture:** Issue #91 and draft PR #92, original adapter head 4f866c31a6d8a9219944b250a8dd9536213a9e59. Original general CI FAIL (radial browser expected October-only Plan button outside its test season); Android PASS. Do not retrospectively mark #92 general PASS.
3. **Fixture repair:** Draft PR #94 at a85c151282759addc744aaa071c1e065ab41cfce corrected disposable test clocks without altering product calendar; general and Android exact-head CI SUCCESS. No merge.
4. **Discovery:** Dot produced 24 candidate research records in Issue #93. Astra independently reviewed 12: seven VERIFIED for reviewed fields, five HOLD, zero rejected; 12 original leads not independently reviewed. VERIFIED research does NOT authorize production import. Owner chose Dot for continuing discovery/evidence collection, Astra for independent verification/acceptance, Codex for code/test changes, and owner for release decisions.
5. **Four-activity pilot:** Draft PR #95 at 2fb7fba7393be98909dace3ac9135ab6cbf9b5f1, tree ecb55a539dec177aa567e3d41a419ea68a85092b. Exact-head general and Android CI SUCCESS. Scope restricted to C26-001 Sparkle in the Park, C26-005 Olde World Christmas Market, C26-010 NEWcaps Holiday Craft Fair, C26-007 Carthage Downtown Lighting/Parade. The three temporary hosts are not automatically ordinary Date Night venues. All public records remain held.
6. **First independent identity review:** Astra Issue #93 comment 6810772595: ACCEPT WITH REQUIRED CHANGES. Sparkle has reviewed Central Park permanent ID date-night-osm-way-987588580, OSM way 987588580 v2, changeset 189037687. Grace Episcopal Church, Neosho High School and downtown square/route are not legitimate ordinary Date Night host IDs: use separate edition-scoped temporary event keys, preserve event sessions, and never substitute a courthouse or a school/church host as an ordinary selectable activity. A wrong-host binding and stale Christmas category on season exit were reproduced.
7. **Identity and five-surface candidate:** Draft PR #96, branch integration/work-93-christmas-identity-ui, exact head ba50b14ae36b80961036986f0cdfe50786039a52, tree 4904392d3cba03f92fe070abb2221f173ca3d519. Correction touched 37 files against reviewed #95; 47 files in main-relative comparison. Candidate added edition-scoped events, session identity, preference/history persistence, ordinary season fallback and event-aware Result, Four Options, Plan, Favorites, History. Exact-head general CI 19/19 SUCCESS; unsigned Android readiness SUCCESS; protected signing SKIPPED. Reported and Astra-reproduced: 1,342 repository tests passed, four inherited skips, 75 application tests, 63 focused Christmas tests, 41 targeted browser scenarios. Test PASS did NOT imply independent acceptance or release.
8. **Second independent acceptance:** Astra Issue #93 comment 6813347588 (reviewed exact PR #96 head and tree): ACCEPT WITH REQUIRED CHANGES; all four PUBLICATION HOLD. Event/venue/session identity and storage/persistence PASS; stale holiday-filter exit PASS; open-screen continuity, mixed provider evidence and keyboard/contrast FAIL or PARTIAL. This comment supersedes any optimistic publication conclusion based only on CI.

### CURRENT HIGH-PRIORITY BLOCKERS — do not minimize

**P0 / User action and safety of meaning:** An open Sparkle Result/Plan/Options may silently become ordinary Central Park when Christmas expires at Jan 1 midnight or live park revision metadata disappears. It can then expose ordinary park Directions despite no verified event visitor gate. The Friday paid market session can reopen as the Saturday free session without a fresh user choice. Selection must pin event/occurrence/presentation independently of canonical preference ID, and close/retire rather than silently substitute.

**P0 / Binding integrity:** A synthetic conflicting later OSM revision reclassifying way 987588580 as a school can be dropped by ordinary discovery before binding validation; mixed v2+v3 then incorrectly accepts stale v2 in either input order. Preserve contrary raw provider observations through the validation boundary and reject conflicts. Actual reviewed OSM object was still v2/changeset 189037687 when Astra checked; the v3 case is a synthetic regression, not evidence that OSM has changed.

**P1 / Accessibility:** Keyboard Enter opens Result/Options/Plan without moving focus into overlay; Escape did not close; Options lacked dialog semantics; focus could traverse underlying controls. All five event surfaces had normal-text contrast failures at 320 CSS px in light and dark themes (examples 3.39:1 light Result, 4.08:1 dark Favorites, below 4.5:1). Require focus entry/trap/return, Escape, dialog labels, semantic isolation and tested contrast at 320/390/512.

**Publication evidence:** Sparkle's canonical park ID was independently matched but the ordinary provider query lacks required version/changeset metadata. Gate/entrance remains unverified, so event Directions unavailable. Temporary market/fair/downtown event radius placements are unconfirmed; distinguish independently supported distance placement from arrival-entrance and navigational authorization. Market $10 Dec 4 gala 17:30–19:00 and free Dec 5 market 09:00–14:00; fair free Dec 5 09:00–15:00; downtown lighting/parade start-only Dec 7 and neither qualifies Open Now. All four event publication flags disabled until independent evidence and explicit approval.

### NEXT — separate bounded owners; status is OWNER-REPORTED RUNNING, not DONE

- **Codex:** Owner has sent the critical correction assignment after Astra comment 6813347588. Produce NEW isolated SHA/tree and draft PR; fix open selection/occurrence continuity, preserve conflicting provider revisions, correct accessibility, add adversarial matrix and exact-head general/Android CI. Do not edit PR #90 or merge, deploy, sign, publish, or activate records.
- **Dot:** Owner has sent targeted evidence assignment separately: authoritative park revision acquisition path, reviewed event placement for church fair / school fair / downtown square-and-parade, distinction among venue-level address, radius point, visitor gate/spectator site and nav-ready directions. Return fresh sourced findings for Astra review. No operator outreach, false coordinate, production import or status promotion on unreviewed claims.
- **Astra:** Await NEW Codex commit and Dot evidence. Independently review corrections and placements (in separate read-only assignments). Combined V4-plus-UI, keyboard/screen-reader and physical Android/WebView/device acceptance remain to be executed after a bounded integration candidate exists.
- **Owner / coordinator:** Manage sequencing, exact commits, original failed checks and evidence provenance. Keep PRs #90/#94/#95/#96 draft and preserve existing branches. Separately authorize any future merge/release; November 27 is a target season start, not permission to ship unsafe or unverified records.

### AI CONTINUITY PROTOCOL — owner decision adopted November 11, 2026

**Update this repository AI_CONTINUITY.md immediately after every completed material milestone and before any agent takeover or release decision.** Never wait for the whole Christmas update. Each checkpoint must preserve earlier history and include: what changed, exact GitHub issue/PR/branch/commit/tree; owner vs independent evidence, pass/fail/not-run and preexisting failures; current production and deployment state; open high-severity blockers; DONE / NEXT / HOLD; accountable agent and next prompt; and whether release authorization exists. Distinguish owner-reported in-flight work from returned evidence. Publish only to deployment-suppressed documentation branch unless separately authorized; read back exact committed bytes and verify only intended documentation changed. Keep release continuity separate; do not touch the release continuity branch or production silently.

**Agent handoff read order:** (1) this latest CURRENT checkpoint on continuity branch, (2) master Issue #86, (3) Issue #93 primary independent review comments 6810772595 and 6813347588, (4) exact draft PR #90 for V4 and #96 for event/UI, (5) newer exact-head Codex/Dot outputs when they actually exist. Never assume a reported new task has completed or that an event marked VERIFIED for one field is publication-ready.

### Immutable references for this checkpoint

- Master: https://github.com/caleb1234calvin-art/dinner-roulette/issues/86
- Research and verdicts: https://github.com/caleb1234calvin-art/dinner-roulette/issues/93#issuecomment-6810772595 and https://github.com/caleb1234calvin-art/dinner-roulette/issues/93#issuecomment-6813347588
- Visual: https://github.com/caleb1234calvin-art/dinner-roulette/pull/90
- Fixture correction: https://github.com/caleb1234calvin-art/dinner-roulette/pull/94
- Four-event pilot: https://github.com/caleb1234calvin-art/dinner-roulette/pull/95
- Event identity and five-surface candidate: https://github.com/caleb1234calvin-art/dinner-roulette/pull/96
- Exact accepted CI receipts for #96: general https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/43132273565 ; Android https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/43132273588 . Independent review found additional defects outside those passing suites.

---

## Preserved earlier continuity (prior latest checkpoint October 19, 2026)
## Current checkpoint — October 19, 2026, 19:42 UTC: existing signed-AAB review reconciled

**Qualified PASS recorded for the exact signed artifact, based on an existing independent report read in full.** This checkpoint reconciles that report; it is not a new root cryptographic verification or a new signing operation. The signed AAB was not rematerialized or reverified in this reconciliation.

Signed `PickForUs-upload-signed.aab`: **3,144,515 bytes**, SHA-256 `aa29027197802cc08bf6070772929cce816f7bf13f7a7c86d2f3beb6c54cdc12`. Public upload-certificate SHA-256: `8CB8B5CE2E67142AD2B257248584BC0FBBBFDE37B04885CB6F1AF13622D4E370`. The existing reviewer reports that this certificate matches the independently pre-recorded owner-provided fingerprint; this reconciliation did not reread that original record.

The report states all **430 original payload entries** are byte-identical and have reviewed signature coverage. The signed archive adds only the three expected signature metadata files. Package `app.pickforus.android`, versionCode 1 / versionName 1.0.0, and SDK 24/36/36 remain unchanged. Strict verification exit 4 was specifically attributed to a self-signed/untrusted chain, with no-timestamp and future 2054-expiry notices; no corrupt/unsigned payload, unexpected signer, weak algorithm, expired or not-yet-valid certificate was reported. This is not blanket acceptance of exit code 4.

See the [signed report reconciliation](audit/play-local-signing-2026-10-19/SIGNED-REPORT-RECONCILIATION.md) for traceable report identity and complete qualifications. The earlier “ready for local signing” and signed-review-pending statements below are historical stages, superseded by this receipt. No key regeneration or repeat signing is needed on the evidence reviewed; the owner's private key stays on the phone.

**Play Console acceptance remains unproven and no upload is authorized by this receipt.** Signing enrollment/key choice and terms, unused versionCode confirmation, exact-bundle upload and rollout remain separate owner decisions. Play-delivered physical testing follows an authorized internal rollout. Preserve existing debug installations and local data. The website remains LIVE with the existing no-JavaScript/responsive-browser certification HOLD. No source, production, key, signing or Console action occurred in this documentation update.

---

## Current checkpoint — October 19, 2026, 18:44 UTC: local Termux signing preparation

**READY FOR LOCAL SIGNING**, scoped to the reviewed owner-operated procedure and verified unsigned input. The owner reports local key setup and the recorded backup checks are complete; a second backup is deferred. These are owner attestations, not independent access to the key. The expected public certificate fingerprint must be established and checked locally before signing; its actual value is not known in this record.

The selected path is owner-operated Termux signing. It supersedes the earlier GitHub signing-environment prerequisite for this path only; no GitHub signing secrets or settings are needed or authorized here. No agent signed a bundle, accessed a private key/password, uploaded to Play, accepted terms, or changed source or production.

Use the verified artifact `12171094706` from run `39015345242`, attempt 2. Exact ZIP member `PickForUs-unsigned.aab`: 3,103,485 bytes, SHA-256 `ac5623cfcae5aecdda24b6c61f04fc251c21a58bc091ea82e536f4aeaebe559a`. Checkout `cf18ff1c5a56ecf59f8006d4f7c83fb289f393df` has the identical complete tree `6300c1061a790d84447bb92166f340aec895757b` as released main `e078dcdaa9f0ca84951409cdb92805731af3d34b`; this was not an exact-main workflow run. Artifact availability, digest, CRC, source binding and unsigned state were reverified at 18:40 UTC. Retention ends November 2 at 08:07:44 UTC.

Read [artifact provenance](audit/play-local-signing-2026-10-19/ARTIFACT.md), [the local signing procedure](audit/play-local-signing-2026-10-19/LOCAL-SIGNING.md), and [later Console decisions](audit/play-local-signing-2026-10-19/NEXT-CONSOLE.md). The signed output will have a new digest. Actual signed-bundle validation, matching its signer to the independently established expected public certificate, Play signing enrollment/terms, version availability, upload, rollout and Play-delivered device acceptance remain unperformed. Future physical testing follows separately authorized internal upload/rollout; it is not an impossible prerequisite to the first upload.

Preserve existing same-package debug installations and local data: their signer differs from Play's distribution signer. Prefer a clean permitted device/profile; no uninstall or data clearing without a preservation plan and separate approval. Do not promise backup restoration.

PR #82 remains LIVE with its named website certification HOLD; local signing does not close the deployed no-JavaScript or responsive-browser gaps. See the [release report](audit/pr82-release-2026-10-19/final/FINAL-REPORT.md). PR #84/#85 remain frozen qualified offline research; PR #61 remains parked: “Radial discovery becomes an audit layer.” All prior continuity below remains historical evidence; only the explicitly superseded local-signing prerequisite and owner-reported key status change here.

---

# AI continuity — current checkpoint

Updated October 19, 2026, 08:11 UTC.

## Authoritative history

The complete prior AI continuity document, through canonical commit `a6685bc987e0beb074c81af63997752e1be0fe4e`, is preserved without any byte changes at [AI_CONTINUITY-through-a6685bc.md](audit/continuity-history/AI_CONTINUITY-through-a6685bc.md). Its Git blob is `4414bd9f7ab55bb33cc66eaff21064ed17554537` (1,398,599 UTF-8 bytes). That archive remains authoritative for historical decisions, receipts, failures, qualifications, and work not repeated here. Git history also remains intact. This packaging correction avoids a tool preview limit; it does not erase or supersede historical facts. Current status below supersedes older pending-status statements only where explicitly stated.

## PR #82: live release; final website certification HOLD

PR #82 merged at 06:40:14 UTC on October 19 under the owner's exact-release authorization and one-release unprotected-main exception. Main is `e078dcdaa9f0ca84951409cdb92805731af3d34b`; its tree is the approved `6300c1061a790d84447bb92166f340aec895757b`, identical to candidate `cf18ff1c5a56ecf59f8006d4f7c83fb289f393df`. Production `dpl_9R5RMpECSSZeVGXRHhcsNWAJ7dPe` is READY on that main source. The exception was used for this release and is not standing permission. No branch-protection settings changed.

Policies version 1.0 are live and effective October 19, America/Chicago. The first observed complete policy response was 06:40:51.645120 UTC / 01:40:51.645120 Chicago; this is an observation timestamp, not the exact activation instant. All five hostnames and 96 asset fetches passed. Complete script-excluded policy HTTP checks passed on apex and chi, including 58 Privacy and 33 Terms text units each. Bounded fresh unsigned desktop checks passed for themes, legal/footer navigation, settings, manual Kansas City location, restaurant result, seasonal plan, and actual external Maps/return with plan state preserved. Prior exact-source CI and controlled browser evidence remain valid within their original scopes.

Certification remains HOLD: actual live rendered JavaScript-disabled policies and live 320/390/512-pixel and tablet portrait/landscape browser layouts were blocked or not run. HTTP delivery is not rendered no-JavaScript verification. Local browser startup and sanctioned escalation failed; cloud DevTools access was explicitly denied. No bypass was attempted. Existing unchanged workflows do not provide the missing live-browser checks. No critical application regression or rollback trigger was observed.

Actual post-release recovery UI offered the previous FMS deployment `dpl_FMS2SBg4ymuDwU4avpywV6yB5vg6` on source `c3208d9` for the three configured domains: pickforus.app, www.pickforus.app, and dinner-roulette-chi.vercel.app. The selector was canceled; no rollback executed. The owner explicitly accepted this three-domain requirement and the predeployment uncertainty of future FMS eligibility. The two generated aliases currently deliver the release and remain separate recovery qualifications.

Next acceptance decision: explicitly accept this release with the named browser gaps retained, or obtain the missing observations using a permitted browser. The settled release does not require reapproval. See [final report](audit/pr82-release-2026-10-19/final/FINAL-REPORT.md), [independent review](audit/pr82-release-2026-10-19/final/INDEPENDENT-TERMINAL-REVIEW.md), and [Issue #71 terminal checkpoint](https://github.com/caleb1234calvin-art/dinner-roulette/issues/71#issuecomment-6261645181). The initial rejected merge and approved same-route expected-head retry remain recorded.

## Frozen research and parked work

- PR #84 remains draft and unmerged at `9eb1b85c503d900993e6ab0d0e5797fd7bcacfb4`, tree `26725dfcfe2de5e82f49cda02b9ec49addb421ce`: qualified isolated mock research only, with no live activation or rights claim. Its inventory receipt expired October 18 at 19:41:16 UTC; it was not renewed.
- PR #85 remains draft and unmerged at `8b574be4f437d029246af107812c7b0227029b14`, tree `a1a575e487a00d034162011d78230664a1237326`: qualified offline audit metadata only, with no new query, runtime integration, or observed coverage gain.
- PR #61 remains parked under its existing intent: “Radial discovery becomes an audit layer.” This checkpoint authorizes no revival or merge; consult the authoritative history for its full scope.
- Physical-device, PWA, native-handler, signing, Play, and historical offline qualifications remain separate from the website result.

## Google Play internal preparation: unsigned validation PASS; signing/upload HOLD

OWNER-REPORTED at 07:59 UTC, not independently inspected in Play Console:
“Verified the Caustic Relay Google Play developer account. Created the Pick For Us Play Console app. Confirmed package identity app.pickforus.android is available and selected. Created and saved the internal tester email list.”

The owner authorized internal preparation and documentation. This checkpoint grants no additional upload, registration, signing, or Google account action authority. No Google Console action was performed for this documentation update.

Unsigned workflow run `39015345242`, attempt 2, validation job `117953155780` passed; signing job `117954634084` was skipped because signing is ineligible for this PR event. Actual checkout is candidate `cf18ff1c5a56ecf59f8006d4f7c83fb289f393df`, whose complete tree equals released main `e078dc`; this is not an exact-main run. JavaScript: 1,352 pass, 4 skips, 0 failures; Python: 17 pass. Native unit tasks were NO-SOURCE. App lint reported 14 warnings and 0 app errors, while six dependency errors were filtered by the pre-existing Capacitor baseline.

Artifact `12171094706` was downloaded, its ZIP digest matched GitHub, and the actual unsigned AAB independently passed compiled inspection. The AAB is 3,103,485 bytes, SHA-256 `ac5623cfcae5aecdda24b6c61f04fc251c21a58bc091ea82e536f4aeaebe559a`. It is validation-only and cannot be uploaded unsigned. The debug APK is development-only. See [Android review](audit/play-internal-2026-10-19/ANDROID-READINESS.md) and [artifact receipt](audit/play-internal-2026-10-19/ARTIFACT-RECEIPT.json).

Signing/upload readiness remains HOLD: protected environment and source governance are unverified; expected upload-certificate comparison and owner-controlled credentials/actions remain outstanding. No P0 source defect has been demonstrated. The owner's account type (Personal/Organization) and whether an upload keystore already exists were asked at 08:04 UTC and remain unanswered here. See the [owner checklist](audit/play-internal-2026-10-19/OWNER-CHECKLIST.md) and [independent signing procedure](audit/play-internal-2026-10-19/SIGNING-PROCEDURE.md).

An existing `app.pickforus.android` debug installation has a different signer from a Play-delivered build. Preferences are local-only and source backup is disabled; do not promise restoration from Google backup. Prefer a clean permitted device/profile. Otherwise obtain an owner-approved preservation plan and separate approval before uninstalling or clearing data. Historical tablet observations are not acceptance of a new Play-delivered binary. No additional APK installation is requested by this checkpoint.

Stage boundary: prepare a clean installation/data-preservation plan now. Actual Play-delivered binary testing follows separately authorized internal upload and rollout; it is not a prerequisite to the first internal upload. Current signing gates concern operational controls, owner keys/certificate, source/version confirmation and authorization. Wider device/public-production acceptance and the internal-only Data safety exemption remain separate.
