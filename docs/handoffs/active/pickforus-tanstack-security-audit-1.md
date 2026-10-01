# Pick For Us — TanStack Start Security Audit 1

Repository: `caleb1234calvin-art/dinner-roulette`
Branch: `audit/pickforus-tanstack-security-1`

Verified domain-readiness candidate baseline:
`195fc422c3cde6bcae305296ae016ecae4bfd562`

Expected candidate tree:
`2c5bbc7a24f83f5f88bca6a935dde9512863e89d`

Candidate sole parent:
`5c5e9607985a3079b37c22f502ef0c4c7cafe0a7`

Frozen production main:
`9337f6ede14b314f10d6b79720aef62ee94fad7d`

## Context

The exact domain-readiness candidate has been independently verified.

Independent verification final state:

`PICK FOR US DOMAIN READINESS CANDIDATE VERIFIED — TANSTACK SECURITY REMEDIATION REQUIRED`

Known Vercel Preview deployment for the exact candidate:

`dpl_GeHDiPFnnPdMxCAc26staHRcQz25`

Preview source SHA:

`195fc422c3cde6bcae305296ae016ecae4bfd562`

Preview state:

`ERROR`

Preview error code:

`BLOCKED_PACKAGE`

Preview package:

`@tanstack/react-start@1.168.49`

Preview error step:

`direct:build`

Known advisory:

`GHSA-qx66-fv34-fjm8`

Known CVE:

`CVE-2026-102989`

## Official security baseline

Current official TanStack/GitHub advisory material states:

Affected:
- `@tanstack/react-start >=1.143.12, <1.168.60`
- `@tanstack/start-server-core >=1.143.12, <1.169.39`

First patched:
- `@tanstack/react-start@1.168.60`
- `@tanstack/start-server-core@1.169.39`

Official sources:
- https://github.com/TanStack/router/security/advisories/GHSA-qx66-fv34-fjm8
- https://tanstack.com/blog/tanstack-start-security-update-cve-2026-102989

The advisory describes a critical unauthenticated reflected XSS path through TanStack Start server-function response handling.

Do not reinterpret this as an ordinary dependency freshness task. The purpose is to close this specific security issue with the smallest compatible version movement.

## Current repository dependency baseline

At candidate `195fc422...`:

`package.json` contains:
- `@tanstack/react-start: ^1.168.0`
- `@tanstack/react-router: ^1.170.0`

Current lockfile resolves:
- `@tanstack/react-start@1.168.49`
- `@tanstack/start-server-core@1.169.31`

Both current resolved versions are within the affected advisory ranges.

## Purpose

Perform a read-only dependency/security audit that determines the narrowest safe remediation required to:

1. resolve `@tanstack/react-start` to a patched version
2. resolve `@tanstack/start-server-core` to a patched version
3. preserve the independently verified domain-readiness changes
4. avoid unrelated dependency churn
5. avoid weakening or bypassing Vercel's package-security gate
6. preserve the migration-free build path
7. preserve current Android/runtime/storage/deadline behavior

This task is AUDIT ONLY.

Do not change dependencies or lockfiles in this task.

## Hard prohibitions

DO NOT:
- modify `package.json`
- modify `package-lock.json`
- run `npm install`, `npm update`, `npm audit fix`, or equivalent dependency mutation
- set `DANGEROUSLY_DEPLOY_VULNERABLE_TANSTACK_START_XSS=1`
- bypass Vercel's package block
- change Vercel settings
- merge
- deploy production
- change DNS
- attach `pickforus.app`
- modify auth
- modify Android runtime/package/signing
- run database migrations
- alter provider deadlines
- alter product behavior
- broaden this into a general dependency upgrade

Read-only package metadata queries are allowed.

## Starting gates

Before audit:

1. Fetch fresh refs.
2. Verify `origin/main` remains exactly `9337f6ede14b314f10d6b79720aef62ee94fad7d`.
3. Verify `origin/fix/pickforus-domain-readiness-1` remains exactly `195fc422c3cde6bcae305296ae016ecae4bfd562`.
4. Verify the candidate tree remains exactly `2c5bbc7a24f83f5f88bca6a935dde9512863e89d`.
5. Verify this audit branch starts from the exact candidate.
6. Establish a clean isolated checkout.
7. Read this handoff in full.
8. Read the domain-readiness remediation and verification handoffs in full.

If immutable state cannot be established, stop:

`PICK FOR US TANSTACK SECURITY AUDIT — BLOCKED`

## Audit questions

Answer all of the following.

### A. Exact advisory applicability

Confirm independently:

- installed `@tanstack/react-start` version
- installed `@tanstack/start-server-core` version
- whether each falls in the affected range
- exact first patched versions
- whether the app actually uses TanStack Start server functions
- whether the vulnerability is reachable in this architecture
- whether current production is also affected despite the blocked Preview being on a branch

Do not attempt exploit execution against production.

Static/runtime-architecture proof is sufficient for reachability analysis.

### B. Smallest patched upgrade set

Determine the minimum dependency change that can produce a lockfile resolving at least:

- `@tanstack/react-start >=1.168.60`
- `@tanstack/start-server-core >=1.169.39`

Evaluate whether changing only the top-level `@tanstack/react-start` requested version is sufficient.

Also determine whether compatible resolution requires aligned changes to:

- `@tanstack/react-router`
- `@tanstack/start-plugin-core`
- `@tanstack/react-start-client`
- `@tanstack/react-start-server`
- `@tanstack/start-client-core`
- any related TanStack package pulled by the patched release

Do not assume every TanStack package should be upgraded.

### C. Version selection

Compare at least:

1. exact first patched `@tanstack/react-start@1.168.60`
2. the smallest current compatible patch line that resolves the advisory
3. any newer patch release only if required for dependency consistency

Prefer the smallest security-necessary movement unless a dependency graph makes it invalid.

Do not choose a major/minor upgrade merely because it is newer.

### D. Package-lock churn forecast

Without mutating the repo, estimate which lockfile entries would be expected to change for the minimal remediation.

Classify:
- required direct change
- required transitive TanStack alignment
- unrelated churn that should be rejected

The later remediation should fail review if unrelated packages move without a documented reason.

### E. Compatibility risk

Review changelogs/releases around the intended patched versions for:

- server function behavior
- Vite integration
- Nitro/server runtime
- React Start client/server package alignment
- router compatibility
- API or type changes
- Node requirements
- build changes

Determine whether the existing candidate code is likely source-compatible.

Identify any tests that should specifically target the upgrade.

### F. Vercel gate behavior

Confirm:

- current exact candidate Preview is blocked by `BLOCKED_PACKAGE`
- bypass env var exists but is prohibited
- expected condition for clearing the block is a patched package resolution
- whether Vercel inspects only top-level `react-start`, transitive `start-server-core`, or both where evidence exists

Do not trigger a deployment in this audit.

### G. Production exposure

Production remains at main `9337f6...`, while the security issue is in the same dependency baseline unless evidence proves otherwise.

Determine:
- whether production currently resolves the same vulnerable versions
- whether production should be treated as security-remediation priority
- whether the dependency fix can be safely promoted together with the already-verified domain-readiness candidate later
- whether domain DNS work should remain blocked until the security fix is independently verified

Do not deploy or merge.

## Required remediation proposal

Produce a precise later remediation plan with:

- exact branch base
- exact dependency edits
- exact allowed lockfile scope
- exact commands to generate lockfile deterministically
- exact tests
- migration-free build command
- expected Vercel Preview behavior
- rollback boundary
- independent verification requirements

The remediation should normally start from exact candidate:

`195fc422c3cde6bcae305296ae016ecae4bfd562`

Do not base the dependency remediation on the verification-handoff documentation commit.

## Required test plan for later remediation

At minimum propose:

### Security/version gates
- assert resolved `@tanstack/react-start >=1.168.60`
- assert resolved `@tanstack/start-server-core >=1.169.39`
- confirm vulnerable exact versions are absent from effective runtime dependency graph

### Existing domain readiness
Re-run all 178 focused/preservation tests used by the verified candidate.

### Type/lint
- typecheck
- bounded lint

### Migration-free build
Use only:

`VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`

Do not use ordinary `npm run build` if it runs `db:migrate`.

### Built output
Re-check:
- apex metadata
- legacy metadata
- preview metadata
- manifests
- install tutorial

### TanStack server-function smoke
Add or run bounded tests proving legitimate server-function GET/POST flows still work after the patched upgrade.

Do not add exploit payloads against production.

### Vercel Preview
Later remediation may push a candidate branch and observe Preview.

Success expectation:
- no `BLOCKED_PACKAGE` for this advisory
- build reaches normal framework/build execution

A different build failure should be treated separately, not hidden.

## Output

Produce:

`audit/pickforus-tanstack-security-audit-1-2026-10-01.md`

and:

`audit/pickforus-tanstack-security-audit-1-2026-10-01.json`

plus bounded evidence if useful.

Report:

1. exact repository identity
2. advisory applicability
3. production exposure
4. current exact resolved versions
5. official affected/patched ranges
6. minimum patched dependency set
7. version-selection comparison
8. expected lockfile delta
9. compatibility/changelog findings
10. Vercel blocker analysis
11. security bypass prohibition
12. proposed exact remediation scope
13. required regression/security tests
14. migration-free build requirements
15. expected Preview acceptance
16. rollback/recovery
17. limitations
18. final repository state
19. exact next step

## Final state

End with exactly one:

`PICK FOR US TANSTACK SECURITY AUDIT — REMEDIATION READY`

or

`PICK FOR US TANSTACK SECURITY AUDIT — REDESIGN REQUIRED`

or

`PICK FOR US TANSTACK SECURITY AUDIT — BLOCKED`

Do not implement the dependency upgrade in this task.

Stop after audit/report/evidence production.
