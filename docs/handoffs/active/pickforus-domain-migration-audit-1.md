# Pick For Us — Permanent Domain Migration Audit 1

Repository: `caleb1234calvin-art/dinner-roulette`
Branch: `audit/pickforus-domain-migration-1`

Frozen production main:
`9337f6ede14b314f10d6b79720aef62ee94fad7d`

Known production tree:
`25efb32d8b769394acac7f9205a79dd7dfcd0ad6`

Purchased permanent domain:
`pickforus.app`

Registrar:
Porkbun

Owner-confirmed registration:
- 1-year registration purchased
- first-year price observed at checkout: $8.75
- estimated renewal observed at checkout: $14.93/year
- no Porkbun hosting or email hosting is required for this migration

Known Vercel state:
- team: `team_iBSXkvS9Z7tu8o8AtW0vlDt7` (`Minions`)
- project: `prj_Duz6oRktFrLVIMK1DfAxZyxQCCwm` (`dinner-roulette`)
- production deployment: `dpl_9KvaQ8T15txTWTkxTT1ifDruL7GS`
- production deployment Git SHA: `9337f6ede14b314f10d6b79720aef62ee94fad7d`
- production remains tied to main
- current public legacy hostname historically used: `dinner-roulette-chi.vercel.app`

## Purpose

Perform a read-only, evidence-based audit of everything required to migrate Pick For Us from its legacy Vercel hostname to the permanent public domain:

`https://pickforus.app`

This task DOES NOT change DNS.
This task DOES NOT add the domain to Vercel.
This task DOES NOT deploy or merge.
This task DOES NOT change production.

The output must be a precise migration plan suitable for a later bounded execution phase.

## Migration intent

The desired end state is:

1. `https://pickforus.app` is the canonical public production URL.
2. Existing production remains on the same Vercel project.
3. HTTPS is valid.
4. The old Vercel hostname remains functional as a legacy fallback unless the audit finds a reason not to.
5. If appropriate, legacy/public alternate hostnames redirect to the canonical domain without breaking API/runtime behavior.
6. Public-facing metadata, share links and app identity use Pick For Us rather than Dinner Roulette.
7. Auth, CORS, callbacks, deep links, Android/Capacitor, service-worker, manifest, analytics and API-origin behavior are not broken.
8. No unrelated product changes are mixed into the migration.

## Starting gates

Before audit:

1. Fetch fresh refs.
2. Verify `origin/main` is exactly `9337f6ede14b314f10d6b79720aef62ee94fad7d`.
3. Verify this audit branch starts from that exact main commit.
4. Verify branch changes before audit artifacts are documentation-only.
5. Verify the Vercel project and production deployment identities above if tooling permits.
6. Read relevant repository configuration and deployment files in full before conclusions.
7. Establish a clean checkout.

If main moved, do not silently continue against stale assumptions. Report the new immutable state and stop if the audit cannot safely rebase its assumptions.

## Hard prohibitions

DO NOT:
- change Porkbun DNS
- change nameservers
- add/remove/verify a Vercel domain
- change project domains
- change Vercel environment variables/settings
- redeploy
- merge
- push product/runtime changes
- change main
- run migrations
- alter auth provider settings
- alter Android package/application identifiers
- sign/publish Android artifacts
- publish to Google Play
- buy hosting/email/SSL
- transfer the domain away from Porkbun
- disable the old production hostname
- invent DNS records
- perform unrelated seasonal-source work

This is AUDIT ONLY.

## Official platform facts to preserve

Use current Vercel documentation and actual project configuration rather than stale examples.

Current Vercel documentation indicates:
- a custom domain should be added to the project before external DNS is finalized
- externally managed apex domains may require an A record supplied by Vercel
- subdomains such as `www` may require a CNAME supplied by Vercel
- Vercel provisions HTTPS for custom domains
- Vercel supports domain redirects
- Vercel emits HSTS on custom domains

Do not assume the exact DNS target values shown in generic documentation are necessarily the exact values Vercel will request for this project at execution time. The execution phase must use Vercel's project-specific instructions.

Because `.app` is HSTS-preloaded at the registry/browser ecosystem level, plaintext HTTP should not be treated as a usable fallback. The production target must be HTTPS-ready.

## Repository hostname audit

Search the entire tracked repository for:

- `dinner-roulette-chi.vercel.app`
- `dinner-roulette`
- `vercel.app`
- `pickforus.app`
- `http://`
- `https://`
- `origin`
- `allowedOrigins`
- `cors`
- `callback`
- `redirect`
- `returnTo`
- `siteUrl`
- `baseUrl`
- `canonical`
- `og:url`
- `twitter`
- `manifest`
- `start_url`
- `scope`
- `serviceWorker`
- `Capacitor`
- `server.url`
- Android deep-link/app-link intent filters
- asset links
- auth provider callback URLs
- analytics endpoint/origin configuration
- API client base URLs
- CSP/connect-src/frame-src/form-action if present
- sitemap/robots canonical host references
- share/copy-link generation
- QR-code/static promotional URLs
- privacy/support/legal links
- install/update URLs
- any test fixtures asserting old hostnames

Classify every hostname occurrence as:
- runtime-critical
- build/config-critical
- auth/security-critical
- Android/deep-link-critical
- metadata/SEO
- user-facing/share
- test-only
- documentation-only
- historical/no-change-needed

Do not replace anything in this task.

## Vercel production audit

Read-only verify, where tooling permits:

- project ID/name
- team ID
- production branch
- latest production deployment ID/SHA/state
- known production aliases/domains
- framework/build settings
- current Build Command
- environment-specific domain behavior
- whether deployment protection affects the custom domain
- whether Analytics/Web Analytics depends on hostname configuration
- redirect/domain settings currently present
- whether `www` is currently configured or absent

Preserve the known special Build Command behavior from prior work:

`VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`

Do not replace it with a migration-running build.

## Porkbun / DNS audit

Do not mutate Porkbun.

Produce the exact later execution sequence for an external-registrar domain:

1. add `pickforus.app` to the Vercel project
2. read Vercel's actual requested verification/DNS records
3. configure only those records in Porkbun
4. wait for DNS verification
5. verify certificate issuance/HTTPS
6. configure canonical/redirect policy
7. verify legacy hostname behavior
8. production smoke

Audit whether to use:
- apex only
- apex + `www`
- `www` redirect to apex

Default preference:
- canonical: `https://pickforus.app`
- optional `www.pickforus.app` redirect to apex

But do not authorize or execute this preference unless audit evidence supports it.

Identify:
- any conflicting Porkbun parking/default records that may need removal
- whether DNSSEC should be left unchanged
- TTL considerations
- whether nameserver delegation should remain at Porkbun
- whether transfer to Vercel is unnecessary

## Auth and security audit

Determine whether changing the public origin requires updates to any:

- OAuth redirect/callback allowlists
- WebAuthn/passkey RP IDs
- magic-link origins
- email redirect URLs
- Supabase/Firebase/Auth0/Clerk/etc. allowed URLs, if present
- CORS allowlists
- CSRF trusted origins
- CSP
- cookie Domain/SameSite/Secure behavior
- session storage assumptions
- service worker scope
- localStorage keys tied to host origin
- cross-origin APIs
- server-side host validation

If auth is feature-flagged, distinguish:
- current production behavior
- latent future risk

Do not mutate external auth dashboards.

## Android / Capacitor audit

Inspect the Android and Capacitor configuration for domain implications.

Determine whether migration affects:
- Capacitor `server.url`
- WebView origin behavior
- Android App Links
- Digital Asset Links / `.well-known/assetlinks.json`
- intent filters
- package ID `com.calebcalvin.pickforus`
- Play listing URLs
- privacy/support URLs
- app update flows
- deep-link routing
- browser handoff

Do not alter the Android package ID.

If Android currently bundles the web app locally rather than loading the production hostname, state that explicitly.

## SEO / metadata / social audit

Inspect:
- canonical link tags
- Open Graph URL/title/site-name
- Twitter metadata
- manifest name/short_name
- favicon/icon references
- sitemap
- robots
- structured data
- share URLs
- page title/description

Identify any remaining Dinner Roulette branding that should be changed as part of the domain migration versus separately during consumer polish.

Avoid unrelated visual redesign.

## Legacy URL policy

Audit the safest behavior for the existing public Vercel hostname.

Preferred principle:
- old links should not break

Evaluate:
A. keep both hosts serving the same content
B. redirect old public hostname to `pickforus.app`
C. retain old host only for technical fallback

For each, report:
- SEO/canonical implications
- auth/cookie implications
- analytics implications
- share-link behavior
- operational risk

Do not configure the redirect in this audit.

## Migration smoke plan

Design a bounded post-change smoke test that includes at minimum:

### Domain / TLS
- apex resolves
- HTTPS certificate valid
- no mixed content
- HTTP behavior appropriate for .app/HSTS
- optional www behavior
- legacy hostname behavior
- canonical URL behavior

### App shell
- homepage loads
- Settings loads
- History loads
- Favorites loads
- static assets load
- no console-breaking origin errors where observable

### Core product
- Dinner discovery settles
- Date Night discovery settles
- Nightlife discovery settles
- seasonal filter path settles
- existing 20s server / 25s client guarantees remain intact

### Persistence
- favorites/history/settings remain usable
- note that localStorage/session storage are origin-scoped: determine whether moving host causes a clean state for users and whether any migration is feasible/necessary

### Mobile
- Android browser
- iOS/Safari risk notes
- PWA/installability if applicable
- Android shell implications

### Observability
- Vercel Web Analytics continues recording under the project
- verify traffic appears under the new host where supported

## Local storage / user-state migration

This audit must explicitly investigate whether existing users' browser-local:
- Favorites
- History
- Settings
- onboarding state
- other localStorage/IndexedDB/sessionStorage

will appear empty on `pickforus.app` because browser storage is origin-scoped.

If yes:
- quantify which product state is affected
- determine whether a one-time cross-origin migration is technically possible and worth doing at current scale
- compare that against accepting a clean reset because the product is still small

Do not implement state migration in this task.

## Required output

Produce:

`audit/pickforus-domain-migration-audit-1-2026-10-01.md`

and:

`audit/pickforus-domain-migration-audit-1-2026-10-01.json`

plus bounded evidence as needed.

Report must include:

1. exact repository identity
2. exact Vercel project/production identity
3. purchased-domain facts
4. repository hostname inventory
5. runtime/config/auth-sensitive occurrences
6. Vercel project/domain baseline
7. Porkbun DNS migration plan
8. apex/www recommendation
9. HTTPS/HSTS implications
10. auth/security findings
11. Android/Capacitor implications
12. SEO/social metadata findings
13. local storage/user-state impact
14. legacy URL policy options
15. exact files/settings requiring later change
16. explicit no-change items
17. execution order
18. rollback/recovery plan
19. production smoke plan
20. risks/blockers
21. exact next bounded execution scope
22. final repository state

## Final state

End with exactly one:

`PICK FOR US DOMAIN MIGRATION AUDIT — READY FOR BOUNDED EXECUTION`

or

`PICK FOR US DOMAIN MIGRATION AUDIT — REMEDIATION REQUIRED BEFORE DNS`

or

`PICK FOR US DOMAIN MIGRATION AUDIT — BLOCKED`

Do not execute the domain migration.

Stop after audit/report/evidence production.
