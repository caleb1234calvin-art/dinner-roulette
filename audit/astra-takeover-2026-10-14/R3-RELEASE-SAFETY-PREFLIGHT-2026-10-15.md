# Pick For Us PR #72 — Independent release-safety preflight (October 15, 2026)

**Decision: RELEASE HOLD.** This checkpoint is read-only: no merge, deployment, promotion, rollback, settings/credential change, migration, Android signing, or Play publication. Technical acceptance is distinct from operational release authorization.

## Exact released and candidate state (freshly read back)

| Item | Verified |
|---|---|
| Released main | `0344ccce79ce157196ff9e84b1aaf3e40802afc5` |
| Released tree | `c7c49796abc809c4a00690cd282f69920e325bbc` |
| Published curated identities | **82** |
| Production Vercel | `dpl_J7TNPFJG4GAnZqytXfrJDR5f8RAb`, READY, exact main source |
| Production aliases | `pickforus.app`, `www.pickforus.app`, `dinner-roulette-chi.vercel.app`, `dinner-roulette-minions-9e2c.vercel.app`, `dinner-roulette-git-main-minions-9e2c.vercel.app` |
| Current previous READY production | `dpl_AQ75KpDS6AQ3g7GqHqYshiFhYfVf`, source `6c619adda4d9ef3b2683befb2ca874b257505eb2`, 70 source identities |
| Candidate | [Draft PR #72](https://github.com/caleb1234calvin-art/dinner-roulette/pull/72), OPEN/DRAFT/UNMERGED |
| Candidate head/tree | `4b2498e067fd7e4a1816fc3732e2cc7e75415486` / `95f66498048590cbd30c623b17d15bf2d5b7cc73` |
| Candidate direct parent/base | `0336b55a2a059423c8d5c0dc4f52f79b71bdcacc` / released main above |
| If separately approved and shipped | **92** source identities: previous 82 unchanged plus 10 seasonal listings |

At this preflight, [web/browser run 38651496637](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/38651496637) has **17/17 jobs SUCCESS**, including aggregate validation. [Unsigned Android run 38651496774](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/38651496774) completed `validate-android` SUCCESS; `sign-upload-bundle` SKIPPED. Independent R3 packet `audit/astra-takeover-2026-10-14/R3-RELEASE-DECISION-PACKET.md` records 1,244 repository and 71 app passes, 2,030 controlled integrated browser scenarios, 774 strict geometry tuples, 18 preserved original archives. A green CI route is not proof of live providers or future hosted settings.

## Gate A: Effective Vercel hosted build command — HOLD

**Verified repository risk:** released `package.json` contains:
```text
"build": "node scripts/with-app-env.mjs vite build && npm run db:migrate"
```
**Never use ordinary `npm run build`** as a migration-free production build. Released `vercel.json` excludes `integration/**` preview deployment but **does not set `buildCommand`**. Both scoped and unscoped Vercel project readback return a restricted projection containing project ID, TanStack Start framework and Node 24, **not the current Build Command or Override toggle**. The last released J7T deployment logs show `Running "vercel build"` and Vite client/SSR stages, with no observed migration, but cannot establish future build-command configuration.

The reviewed **CI** migration-free production route is:
```sh
VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production
```
This command has an exact-head CI PASS, but its use as an effective Vercel project command is **UNVERIFIED**.

**Necessary human owner readback (do not change anything yet):**
1. Open Vercel dashboard, select the confirmed team and project `dinner-roulette`.
2. Under **Settings → Build and Deployment → Build and Development Settings**, inspect `Build Command` and whether `Override` is enabled. Read the exact value; do **not** Save.
3. Report whether a migration-free command is explicitly and effectively configured for future production. A missing/automatic command, `npm run build`, or inaccessible field is a **HOLD**, even if an earlier deployment happened to build safely.
4. If an override is unsafe/unconfirmed, propose an **explicitly owner-approved** correction. A versioned `vercel.json` `buildCommand` could provide the same direct safe build with auditable precedence; alternatively a project-level override may be configured by the owner. **No correction was made in this preflight.** Any changed config/candidate identity requires a new exact head/tree and renewed validation before separate release approval.

Official docs: https://vercel.com/docs/builds/configure-a-build and https://vercel.com/docs/project-configuration/vercel-json.

## Gate B: Authorized rollback operator and path — OWNER IDENTIFIED; ACTIVATION HOLD

**Verified:** Read-only `list_team_members` for team `team_iBSXkvS9Z7tu8o8AtW0vlDt7` returned exactly **one confirmed OWNER role**, Vercel username `caleb1234calvin-6132`. This is the designated candidate **human dashboard operator**, not evidence that this connector has privileged rollback permission. Historical read-only `rollbackCandidate` permission inspection returned **HTTP 403 `deploymentRollback`**; the denied API was not retried or bypassed. No `request_rollback`, deployment promotion, or alias mutation was called.

**Critical rollback target distinction:** today, while 82-identity J7T serves production, the previous READY deployment is AQ75 (70 identities). If PR #72 is later approved and successfully deployed, **J7T becomes the immediate previous production deployment** and is the correct potential Hobby rollback target—not AQ75. Vercel documents that the Hobby plan permits rollback to the immediately previous production deployment.

**Owner dashboard read-only check:**
1. Sign in under the confirmed team OWNER account and open the project `dinner-roulette` Production Deployment tile. Locate **Instant Rollback** (or Deployments → previous deployment ⋮ → Instant Rollback).
2. Verify that this OWNER account can see the action and eligible **immediately previous** deployment. You may inspect the review dialog's listed domain/alias routing if accessible, **but never click Confirm Rollback** during this preflight.
3. Record the eligible deployment, controls, all relevant hostnames and any permission issue. Exit the dialog without changing production.
4. If the control is missing/forbidden, stop at **HOLD** and resolve via Vercel's official owner dashboard/support. Do not use an alternate token, privileged endpoint, or unapproved CLI route to bypass access restrictions.
5. For a separately approved future rollback, verify production source and all five aliases and note Vercel warns that rollback may disable automatic assignment of future production domains; env/config on a restored deployment may be stale. A READY candidate alone is not a validated recovery operation.

Official docs: https://vercel.com/docs/instant-rollback and https://vercel.com/docs/deployments/rollback-production-deployment.

## Other release qualifications — unchanged

- Independent source/copy disposition: **seven PASS / three qualified**. The three are Walters supplementary ticket/age evidence, 217 Terror supplementary warning/ticket evidence, and Boo Crew ancillary bans not freshly located; do not mislabel them fully source-current. Current Boo Crew 2026 ticket dates exclude Halloween; a historical FAQ does not override them.
- Inherited 320px Directions internal text overflow and occasional 1px Options notice wrapper discrepancies are disclosed; **not** a defect-free UI claim.
- Kansas City 50-mile provider timeout/inherited radial core gating (Exiled KC, Dark Nightmares, Terror at the Ranch) remains **separate** from PR72; no PR70 regression proved.
- Physical Android/WebView/GPS/PWA and Play signing/publication **not** accepted; Android workflow is unsigned readiness only.
- Original R3 evidence ZIPs and manifests are archived; ephemeral GitHub screenshots expire October 28. No guarantee of ticket capacity, operator operation, exact entrance/dropoff or present Open Now.
- The October 25 content-freeze target remains aspirational and never waives evidence or owner release approval.

## Defensible decision

**BUILD:** last hosted build observationally migration-free; actual future effective build command **HOLD**, requires dashboard setting/override readback.

**ROLLBACK:** READY deployment retention and Vercel human OWNER identified; actual authorized dashboard action/eligible destination **HOLD**, requires owner read-only interface inspection. Do not carry forward historical 403 as proof that a human owner cannot act; do not erase the connector restriction either.

**RELEASE:** PR72 remains DRAFT/UNMERGED, no owner release approval solicited or inferred from “Let's do it.” Even after these two controls are verified, explicitly confirm acceptance of the three source qualifications, inherited UI risk and separate provider/mobile limits before a separate exact-SHA/tree release authorization.

**NEXT:** Owner provides the **two read-only dashboard observations** (Build Command + Override state; Instant Rollback action availability + eligible prior deployment). Independent coordinator records findings and refreshes exact source/production before proposing any change or release decision. Stop cleanly on unknown/403.

Coordination: [Issue #71](https://github.com/caleb1234calvin-art/dinner-roulette/issues/71). This report is placed only on deployment-disabled `integration/continuity-refresh-2026-10-07` and alters no runtime/settings.
