# Pick For Us — Domain Readiness Independent Verification 1

Repository: `caleb1234calvin-art/dinner-roulette`
Branch: `verify/pickforus-domain-readiness-1`

## Purpose

Perform an independent verification of the exact already-published domain-readiness remediation candidate.

This task is verification only.

Do not modify the candidate.
Do not remediate the TanStack dependency in this task.
Do not touch DNS.
Do not attach the domain.
Do not change Vercel settings.
Do not merge or deploy production.

## Exact candidate

Candidate commit:
`195fc422c3cde6bcae305296ae016ecae4bfd562`

Expected tree:
`2c5bbc7a24f83f5f88bca6a935dde9512863e89d`

Expected sole parent:
`5c5e9607985a3079b37c22f502ef0c4c7cafe0a7`

Frozen main:
`9337f6ede14b314f10d6b79720aef62ee94fad7d`

The candidate must be verified exactly as published. Do not substitute a later equivalent tree or locally recreated commit.

## Known Vercel preview state

The candidate triggered Preview deployment:

`dpl_GeHDiPFnnPdMxCAc26staHRcQz25`

Source branch:
`fix/pickforus-domain-readiness-1`

Source SHA:
`195fc422c3cde6bcae305296ae016ecae4bfd562`

Preview final state:
`ERROR`

Known blocker:
`BLOCKED_PACKAGE`

Known error:
`Vulnerable TanStack Start package detected (@tanstack/react-start@1.168.49). Please update to a patched version.`

Known advisory:
`GHSA-qx66-fv34-fjm8`

Treat this as a known external dependency/security blocker.

Do NOT:
- set `DANGEROUSLY_DEPLOY_VULNERABLE_TANSTACK_START_XSS=1`
- bypass the package block
- update dependencies in this verification task
- interpret the blocked Preview as proof that the metadata remediation itself is invalid

## Required reading

Read in full:

- `docs/handoffs/active/pickforus-domain-readiness-remediation-1.md`
- `docs/handoffs/active/pickforus-domain-migration-audit-1.md` if available in the repository/history
- the exact candidate diff from parent to `195fc422...`
- relevant metadata/PWA/install source and tests changed by the candidate
- current Android/runtime guards needed to verify preservation

If prior remediation Markdown/JSON/evidence are available in the worker workspace, read them as supporting evidence but independently reproduce the critical checks.

## Starting gates

Before verification:

1. Fetch fresh refs.
2. Verify `origin/main` remains exactly `9337f6ede14b314f10d6b79720aef62ee94fad7d`.
3. Verify `origin/fix/pickforus-domain-readiness-1` is exactly `195fc422c3cde6bcae305296ae016ecae4bfd562`.
4. Verify candidate tree exactly equals `2c5bbc7a24f83f5f88bca6a935dde9512863e89d`.
5. Verify candidate sole parent exactly equals `5c5e9607985a3079b37c22f502ef0c4c7cafe0a7`.
6. Verify the published candidate is exactly one commit ahead of that parent.
7. Establish a clean isolated checkout pinned to the candidate.
8. Do not make any tracked modifications.

If any immutable identity check fails, stop:

`PICK FOR US DOMAIN READINESS VERIFICATION — BLOCKED`

## Independent diff review

Review every candidate change from parent to candidate.

Expected changed files:

- `README.md`
- `public/apple-touch-icon.png`
- `public/manifest.webmanifest`
- `scripts/domain-readiness.test.mjs`
- `scripts/grok-pwa-plugin.mjs`
- `scripts/grok-pwa-plugin.test.mjs`
- `scripts/grok-pwa-shared.d.mts`
- `scripts/grok-pwa-shared.mjs`
- `scripts/install-page.html`
- `server/middleware/grok-pwa.ts`
- `server/virtual-grok-og-identity.d.ts`
- `src/lib/og/metadata.mjs`
- `src/lib/og/site.json`
- `src/routes/__root.tsx`

Verify there are no dependency, lockfile, Vercel config, Android runtime, auth, database, provider, deadline or migration changes.

## DM-F01 verification — canonical/social identity

Independently verify the candidate closes the audit defect.

Required behavior:

### Apex
For `pickforus.app`:
- canonical rooted at `https://pickforus.app`
- route-aware canonical for `/`, `/settings`, `/history`, `/favorites`
- `/` may be `index,follow`
- utility routes are `noindex,follow`
- `og:url` matches canonical
- complete Pick For Us OG identity
- complete Twitter identity
- absolute HTTPS OG/Twitter image
- one canonical only

### Legacy production host
For `dinner-roulette-chi.vercel.app`:
- continues serving
- no redirect introduced
- canonical points to equivalent apex path
- utility routes remain noindex
- metadata does not promote legacy as canonical origin

### Preview/system hosts
- no preview hostname becomes canonical
- preview/system hosts are non-authoritative / noindex
- stale `VITE_PUBLIC_HOSTNAME` must not override canonical identity

### Final producer behavior
Verify the final middleware/injector output, not merely React declarations.

Confirm:
- earlier conflicting canonical/social metadata is removed or normalized
- repeated injection is idempotent
- no duplicate canonical tag
- no duplicate final title/description/OG/Twitter identity

## DM-F02 verification — manifest/install identity

Independently verify:

- authoritative public manifest name is `Pick For Us`
- short_name is `Pick For Us`
- description matches current broader product
- start_url remains `/`
- scope remains `/`
- compatibility endpoints remain functional:
  - `/__grok/manifest.webmanifest`
  - `/__grok/manifest.json`
- compatibility manifests return Pick For Us identity
- install tutorial says Pick For Us
- user-facing `Grok App` is absent from installation identity
- one intended manifest link in final HTML
- one intended apple-touch-icon link in final HTML
- icon is valid and expected
- no service worker/offline feature was added

## Preservation verification

Verify unchanged behavior for:

- Android application ID `com.calebcalvin.pickforus`
- Android remote runtime remains `https://dinner-roulette-chi.vercel.app`
- legacy retry/error link remains legacy
- no Android retargeting
- browser storage key remains `pick-for-us-v1`
- storage schema unchanged
- no cross-origin state transfer
- server provider deadline remains 20,000 ms
- client watchdog remains 25,000 ms
- no database migration
- no package-lock/package dependency modification
- no Vercel config modification
- no auth provider/config activation

## Required validation

Run independently:

### Focused tests
At minimum:
`node --test scripts/domain-readiness.test.mjs scripts/grok-pwa-plugin.test.mjs`

### Preservation tests
At minimum relevant existing:
- Android release/config tests
- provider deadline tests
- client lifecycle tests
- app-env wrapper tests

### Typecheck
`node node_modules/typescript/bin/tsc --noEmit`

### Targeted lint
Run bounded lint over candidate-changed JS/TS/declaration files.

### Migration-free build
Run exactly:

`VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`

Do NOT run ordinary `npm run build` if it invokes `db:migrate`.

### Built output
Independently inspect or exercise actual built output for:
- apex
- legacy
- preview
- manifest compatibility endpoints
- install tutorial

Do not rely only on source-level unit tests.

### Browser verification
If a browser is available, verify hydration/client navigation for:
- `/`
- `/settings`
- `/history`
- `/favorites`

If browser process/socket restrictions prevent this, record exactly:
`BROWSER VERIFICATION ENVIRONMENT-BLOCKED`

Do not weaken other verification requirements merely because browser execution is unavailable.

## Vercel preview observation

Read-only observe the candidate Preview deployment.

Record:
- deployment ID
- source SHA
- branch
- target/environment
- state
- error code
- error step
- package/version
- advisory link

Expected known state is a dependency/security block.

Do not attempt to make the Preview deploy in this task.

## Readback gates

The prior remediation still has owner readback requirements for Vercel and Porkbun.

Verification may confirm those remain pending.

Do not treat missing owner readbacks as a candidate code-verification failure.

Do not change them.

## Commit/push policy

This is independent verification.

Do not modify candidate files.
Do not create a remediation commit.
Do not update dependencies.
Do not push changes to the candidate branch.
Do not merge.
Do not deploy production.
Do not change DNS/domain settings.

Verification reports/evidence may remain uncommitted/untracked unless a later handoff explicitly authorizes documentation publication.

## Required output

Produce:

`audit/pickforus-domain-readiness-verification-1-2026-10-01.md`

and:

`audit/pickforus-domain-readiness-verification-1-2026-10-01.json`

plus bounded evidence if useful.

Report:

1. exact repository/candidate identity
2. exact tree/parent verification
3. candidate diff classification
4. DM-F01 verification results
5. DM-F02 verification results
6. final metadata matrix
7. manifest/install verification
8. preservation verification
9. focused test results
10. typecheck/lint/build results
11. built-output verification
12. browser verification status
13. Vercel Preview observation
14. known TanStack blocker distinction
15. owner readback gates still pending
16. warnings/limitations
17. exact final repository state
18. next bounded step

## Final state

End with exactly one:

`PICK FOR US DOMAIN READINESS CANDIDATE VERIFIED — TANSTACK SECURITY REMEDIATION REQUIRED`

or

`PICK FOR US DOMAIN READINESS VERIFICATION — FAILED`

or

`PICK FOR US DOMAIN READINESS VERIFICATION — BLOCKED`

A successful code verification should use the first state even though the Vercel Preview remains blocked by the separate TanStack security gate.

Stop after verification.
