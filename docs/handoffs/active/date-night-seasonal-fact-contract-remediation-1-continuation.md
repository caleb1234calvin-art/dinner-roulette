# Seasonal Fact Contract Remediation #1 — continuation

**SEASONAL FACT CONTRACT REMEDIATION IMPLEMENTED — AWAITING INDEPENDENT REVERIFICATION**

Required local branch: `fix/date-night-seasonal-fact-contract-remediation-1`.

The immutable candidate is the unique commit introducing `audit/date-night-seasonal-fact-contract-remediation-1.md`. Resolve it without assuming a moving branch head:

```sh
git log --diff-filter=A --format=%H -- audit/date-night-seasonal-fact-contract-remediation-1.md
git show -s --format='%H%n%T%n%P' <resolved-candidate>
```

Require exactly one parent: `f7fa63f5688b1d09e5b0baccfd5e617d0748a41a`. That parent has tree `b78b792c294de908259dcdd112d148e886eacc6c` and sole parent `908510ac25fe5c24335126a0f34ff42fe4d80632`. The final delivery provides the remediation SHA and tree externally to avoid self-referential commit metadata.

The evidence ZIP includes the portable Git bundle, patch, freeze report, original independent test script and RED runner. The bundle requires the failed candidate history, available on `feature/date-night-seasonal-fact-contract-1`. In an isolated repository that already has that base, verify and import locally:

```sh
git bundle verify /absolute/path/seasonal-fact-contract-remediation-1.bundle
git fetch /absolute/path/seasonal-fact-contract-remediation-1.bundle refs/heads/fix/date-night-seasonal-fact-contract-remediation-1:refs/heads/fix/date-night-seasonal-fact-contract-remediation-1
```

Do not push as part of reverification: non-integration branch automatic deployments remain enabled and this task did not authorize a deployment. No remote remediation ref was created. Do not alter Vercel settings to work around this constraint.

Read the report and `audit/date-night-seasonal-fact-contract-remediation-1-evidence/validation-summary.json`, validate the retained evidence hashes, then independently rerun:

```sh
node --import ./tools/seasonal-facts/network-guard.mjs --test scripts/seasonal-fact-contract.test.mjs scripts/seasonal-fact-contract-remediation.test.mjs
node_modules/.bin/tsc -p tools/seasonal-facts/tsconfig.json
npm run typecheck
node_modules/.bin/eslint tools/seasonal-facts/policy.ts scripts/seasonal-fact-contract-remediation.test.mjs
node scripts/with-app-env.mjs ./node_modules/.bin/vite build
npm test
```

Use the failed candidate plus the final remediation tests to independently establish RED; copied external runners change import roots only. With the ZIP evidence folder beside a `candidate/` checkout, run `node --import ./candidate/tools/seasonal-facts/network-guard.mjs --test evidence/independent-adversarial.test.mjs`. It yields 90/99 on the failed target and 99/99 on remediation. The focused matrix yields 152/196 on failed and 196/196 on remediation. The original 112 tests remain unchanged. Full-suite expected totals are 1,041, with 1,037 passing and four inherited skips.

Full lint must retain exactly the inherited 3 errors and 6 warnings; it is not clean. All ten generated offline artifacts must remain deterministic. Require zero unmocked collector network attempts and unchanged package/lock, schema, builder, identity, src, production/main and approved candidate. No source activation, network transport, crawl, geocoder, paid API, runtime integration, migrations, radial pacing merge, promotion or deployment is authorized. Keep the source pilot on hold until separate independent reverification and subsequent authorization.
