# Pick For Us — Permanent Domain Readiness Remediation 1

Repository: `caleb1234calvin-art/dinner-roulette`
Branch: `fix/pickforus-domain-readiness-1`

Frozen production main:
`9337f6ede14b314f10d6b79720aef62ee94fad7d`

Source audit:
`docs/handoffs/active/pickforus-domain-migration-audit-1.md`

Audit final state:
`PICK FOR US DOMAIN MIGRATION AUDIT — REMEDIATION REQUIRED BEFORE DNS`

Purchased canonical domain:
`https://pickforus.app`

## Purpose

Perform the bounded **pre-DNS remediation and readiness closure** required by the permanent-domain audit.

This phase is authorized to:
- fix DM-F01 canonical/social metadata
- fix DM-F02 conflicting manifests / incorrect "Grok App" install identity
- add narrow regression tests
- make narrowly necessary documentation updates
- gather read-only configuration evidence needed for DM-G01 and DM-G02 where available

This phase is NOT authorized to:
- change DNS
- attach the domain to Vercel
- change Vercel project settings
- deploy
- merge to main
- change auth providers/settings
- retarget Android runtime
- migrate browser-local user data

## Starting gates

Before modifying anything:

1. Fetch fresh refs.
2. Verify `origin/main` is exactly `9337f6ede14b314f10d6b79720aef62ee94fad7d`.
3. Verify this branch descends directly from that exact main.
4. Verify a clean checkout.
5. Read IN FULL:
   - this handoff
   - `docs/handoffs/active/pickforus-domain-migration-audit-1.md`
6. If the uncommitted audit report/JSON/evidence are available in the worker workspace, read them in full and preserve unchanged.
7. Read all files listed by DM-F01 and DM-F02 before editing.

If immutable state cannot be established, STOP and report:
`PICK FOR US DOMAIN READINESS REMEDIATION — BLOCKED`

## Locked audit findings

Preserve these facts from the completed audit:

### DM-F01 — canonical/social metadata defect
Current production:
- has no canonical link
- lacks a complete final social identity
- the PWA/platform injector strips or overrides some React-head social tags
- fixing only `src/routes/__root.tsx` is insufficient

Relevant paths:
- `src/routes/__root.tsx`
- `scripts/grok-pwa-shared.mjs`
- `server/middleware/grok-pwa.ts`
- `scripts/grok-pwa-plugin.mjs`
- `src/lib/og/site.json`

Closure requirement:
- final rendered/SSR output must contain the intended canonical + OG/Twitter identity after all injectors/middleware run
- preview behavior must remain noindex/non-authoritative
- legacy production hostname must be able to serve content while declaring the new apex canonical after the apex is actually live
- no duplicated or stripped final social identity

### DM-F02 — manifest/install identity defect
Current production:
- serves both a static and platform/dynamic manifest
- static manifest says Pick For Us
- dynamic/platform manifest says `Grok App`
- iOS installation tutorial says `Add Grok App to your Home Screen`
- injector adds duplicate install/icon identity

Relevant paths:
- `scripts/grok-pwa-shared.mjs`
- `public/manifest.webmanifest`
- `scripts/install-page.html`
- `src/routes/__root.tsx`
- likely related plugin/middleware/tests

Closure requirement:
- one coherent Pick For Us install identity
- compatibility endpoints may remain, but must return Pick For Us identity
- no "Grok App" user-facing installation text
- no duplicate conflicting manifest/touch-icon producers
- preserve origin-relative start_url/scope and current non-offline behavior

### Android compatibility constraint
Current Android shell is a remote WebView pointing at:
`https://dinner-roulette-chi.vercel.app`

DO NOT change in this phase:
- `capacitor.config.json`
- Android package/application ID
- legacy WebView runtime hostname
- legacy retry/error link
- Android signing/release state

The legacy hostname must continue serving after later web-domain cutover.

### Browser-local state constraint
The new origin will start with fresh browser-local state.

Current product state key:
`pick-for-us-v1`

Do not rename storage keys.
Do not implement cross-origin transfer in this phase.
Do not delete or rewrite user state.

## Canonical policy to implement in code

The intended production canonical origin is:

`https://pickforus.app`

Implement metadata logic so that:

### Canonical production apex
For requests on `pickforus.app`:
- canonical is the clean apex route URL
- OG URL matches canonical
- OG site name is Pick For Us
- OG/Twitter image uses an absolute HTTPS URL
- Twitter title/description/image are coherent
- product title remains Pick For Us

### Legacy production host
For `dinner-roulette-chi.vercel.app`:
- page continues serving normally
- public routes may declare canonical URLs at `https://pickforus.app` using equivalent route paths
- do not redirect
- do not break server functions/assets/manifests

### Preview/system hosts
For preview/immutable Vercel hosts:
- retain non-authoritative/noindex behavior
- do not give preview hosts independent canonical authority
- do not leak preview hostname into canonical production metadata

### Utility routes
Audit identified:
- `/` as public discovery landing page
- `/settings`
- `/history`
- `/favorites`

For utility routes:
- use clean canonical route paths under `https://pickforus.app`
- prefer `noindex,follow` for local-state utility pages
- do not collapse them all to `/` unless the implementation can justify that semantically

### URL hygiene
Canonical and OG URLs should:
- use HTTPS
- strip irrelevant query/tracking/install parameters
- preserve meaningful route path
- never use the parked/new-domain prelaunch response as canonical evidence

Do not introduce a sitemap/robots expansion unless strictly required by the remediation tests. That can remain separate polish.

## Manifest/install remediation

Required behavior:

1. Public manifest identity is Pick For Us.
2. Dynamic/platform compatibility manifest identity is also Pick For Us.
3. iOS/Home Screen tutorial says Pick For Us.
4. Exactly one intended manifest link is authoritative in final HTML.
5. Exactly one intended touch-icon identity is authoritative in final HTML.
6. Existing compatibility manifest endpoint(s) should not be removed if current clients may request them.
7. `start_url` and `scope` remain same-origin/root compatible.
8. No service worker/offline claim is added.
9. No new install feature is introduced.
10. No existing Android remote-WebView behavior is changed.

Remove user-visible `Grok App` naming from the install path without mass-replacing unrelated Grok platform/integration identifiers.

## OG/product description

`src/lib/og/site.json` currently has a food-only description while Pick For Us has expanded beyond food.

Update only as needed so the canonical/social description accurately reflects the current product at a high level.

Do not redesign branding or visuals.

## Focused test requirements

Add/update narrow regression tests covering at minimum:

### Final rendered head
For:
- canonical apex
- legacy production hostname
- one Vercel preview hostname

Verify:
- title
- canonical
- robots behavior
- og:url
- og:site_name
- OG image
- Twitter title
- Twitter description
- Twitter image
- no conflicting duplicate canonical/manifest/icon output

The test must exercise the final metadata producer/injector path, not merely inspect React head declarations.

### Manifests/install
Verify:
- `/manifest.webmanifest` returns Pick For Us identity
- dynamic/platform manifest compatibility endpoint returns Pick For Us identity
- iOS/install tutorial uses Pick For Us
- no user-facing `Grok App` remains in served installation content
- start_url/scope remain intended

### Legacy preservation
Verify:
- legacy hostname remains a supported serving host in metadata logic
- no redirect is introduced
- old Android runtime assertions remain unchanged

### Preview preservation
Verify:
- preview host remains non-authoritative/noindex
- preview hostname is not emitted as canonical

## Build/test boundary

Use the migration-free build path only:

`VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`

DO NOT run ordinary `npm run build` if it triggers `db:migrate`.

Run:
- targeted metadata/PWA/install tests
- relevant typecheck/lint if available and bounded
- migration-free build
- any existing focused smoke/unit tests needed to establish no regression

Do not run migrations.

## DM-G01 — read-only Vercel readiness evidence

Attempt to obtain and record, using read-only authorized tooling only:

- effective production Build Command
- production Git branch
- root directory
- output directory
- install command
- current domain/redirect assignments
- relevant nonsecret environment summaries/presence for:
  - `VITE_AUTH_ENABLED`
  - `VITE_PUBLIC_HOSTNAME`
  - `VITE_OG_SERVICE_URL`
  - `BETTER_AUTH_URL`
  - `GROK_GATE_ORIGIN`
  - `GROK_CONNECTORS_URL`
- presence only, never values, for database/auth secrets where relevant

Do not dump secrets.

If tooling cannot expose a value:
- record `UNAVAILABLE`
- do not fabricate it
- identify the exact owner/manual readback needed before DNS

Do not change any Vercel setting.

## DM-G02 — read-only Porkbun readiness evidence

Attempt to obtain exact current zone evidence only if an already-authorized authenticated route exists.

Need:
- root record type/value/TTL/ID
- whether root is A vs ALIAS/flattened
- www record type/value/TTL/ID
- whether www is explicit vs wildcard-derived
- wildcard records relevant to root/www
- DNSSEC state
- forwarding state
- unrelated records that must be preserved

Do not:
- log in with invented credentials
- ask for password in chat
- alter DNS
- delete parking
- change nameservers
- disable DNSSEC
- enable forwarding
- transfer registrar

If authenticated Porkbun access is unavailable:
- prepare a concise owner-readback checklist
- classify DM-G02 as `OWNER READBACK REQUIRED`
- do not block code remediation from completing

## Documentation

Update only current, non-historical docs necessary to reflect:
- Pick For Us public identity
- `pickforus.app` as planned canonical URL, not yet live unless actually proven
- legacy Android/hostname preservation
- clean-start browser-state policy for new apex
- no DNS changes yet

Do not rewrite historical evidence/handoffs.
Do not rewrite old audit reports.

## Commit policy

This remediation SHOULD produce a committed immutable candidate.

Commit only:
- bounded F01/F02 code fixes
- narrow tests
- current documentation necessary for migration readiness
- safe readback summaries/evidence if appropriate

Do not commit:
- secrets
- private Porkbun account data
- copied registrar dashboard screenshots with sensitive info
- unrelated audit artifacts
- build outputs

Push the remediation branch.

Record:
- candidate SHA
- tree
- sole parent
- exact changed files

Do not merge.

## Required output

Produce:

`audit/pickforus-domain-readiness-remediation-1-2026-10-01.md`

and:

`audit/pickforus-domain-readiness-remediation-1-2026-10-01.json`

plus bounded evidence if useful.

Report:

1. exact repository identity
2. starting-gate results
3. DM-F01 root cause and exact fix
4. DM-F02 root cause and exact fix
5. final metadata behavior by apex/legacy/preview
6. final manifest/install behavior
7. exact changed files
8. focused tests and results
9. migration-free build result
10. Android/legacy preservation evidence
11. local-state policy unchanged
12. DM-G01 readback status
13. DM-G02 readback status / owner-action packet if needed
14. warnings/limitations
15. candidate SHA/tree/parent
16. push status
17. final repository state
18. exact next step

## Final state

End with exactly one:

`PICK FOR US DOMAIN READINESS REMEDIATION — CANDIDATE READY FOR INDEPENDENT VERIFICATION`

or

`PICK FOR US DOMAIN READINESS REMEDIATION — OWNER READBACK REQUIRED`

or

`PICK FOR US DOMAIN READINESS REMEDIATION — BLOCKED`

If the code candidate is complete but DM-G02 still needs owner readback, prefer:
`PICK FOR US DOMAIN READINESS REMEDIATION — OWNER READBACK REQUIRED`

Do not start independent verification in this task.
Do not touch DNS.
Do not attach the domain.
Stop after report/evidence/push.
