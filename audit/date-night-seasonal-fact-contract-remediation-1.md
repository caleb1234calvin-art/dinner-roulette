# Seasonal Fact Contract Remediation #1

**SEASONAL FACT CONTRACT REMEDIATION IMPLEMENTED — AWAITING INDEPENDENT REVERIFICATION**

Authority: `e6806c5b62ca109d7e2a443f7ad4414b770b8afa`, read in full from `handoff/date-night-seasonal-fact-contract-remediation-1`. Failed candidate freshly verified as `f7fa63f5688b1d09e5b0baccfd5e617d0748a41a`, tree `b78b792c294de908259dcdd112d148e886eacc6c`, sole parent `908510ac25fe5c24335126a0f34ff42fe4d80632`. The remediation branch is `fix/date-night-seasonal-fact-contract-remediation-1`, directly from the failed candidate. That historical candidate was not amended or rebased.

## Change

Only `tools/seasonal-facts/policy.ts` changes existing implementation. Response envelopes must be non-null plain objects, with exactly nine own keys, string allowed content type, and safe non-negative integer values for all eight measurements. Missing, inherited-only, undefined, non-finite, fractional, negative and extra fields are rejected before the unchanged budget comparisons. Unknown non-enumerable and symbol keys are also rejected. Complete plain objects with null prototypes are supported.

Redirect validation now requires an Array and visits every numeric index with an own-property check, string check, and `validateUrl()`. The source redirect budget and absolute two-redirect/three-URL limit remain unchanged. There is no transport or automatic redirect following.

`scripts/seasonal-fact-contract-remediation.test.mjs` adds 196 JavaScript runtime cases. No schema, builder, identity, source permission, product runtime, package, lockfile or Vercel configuration changed. All other changes are this report, continuation and retained evidence.

## RED and GREEN

Before any implementation edit, the unchanged independent reproduction produced 99 tests: 90 passed and 9 failed. Eight failures independently omit one required numeric metric; the ninth deletes the middle redirect hop. Each failure is an assertion that malformed input should have been rejected, with valid source policy and remaining values.

The focused remediation matrix then produced 196 tests: 152 passed and 44 failed on the old implementation. After the fix it passes 196/196. The final test version was also rerun against an untouched checkout of the failed candidate, again producing the same 44 meaningful failures. Only import paths change in that external RED runner. The original independent reproduction now passes all 99 cases.

Coverage includes every individual field omission, explicit undefined, inherited-only values, malformed object shapes, every numeric field with NaN/infinities/fractions/negative/unsafe integers and wrong types, extra enumerable/hidden/symbol keys, each exact ceiling and ceiling-plus-one, tighter source ceilings, and all-zero counts. Redirect cases include one-hole arrays, both two-slot holes, a missing middle hop, undefined/non-string hops, inherited indexes, array-like objects, count bounds, dense chains of one/two/three URLs, and hostile URLs at every possible position. Deleting a hostile middle hop still fails.

## Fresh regressions

| Check | Result |
| --- | --- |
| Original contract suite | 112 passed |
| Added remediation suite | 196 passed |
| Combined contract cases | 308 passed |
| Independent adversarial suite | 99 passed |
| Full suite | 1,041 total; 1,037 passed; 0 failed; 4 inherited skips |
| Repository scripts / application | 970 total (966 passed, 4 skipped) / 71 passed |
| Contract and product typechecks | Both exit 0 |
| Changed-file lint | Exit 0, no diagnostics |
| Full lint | Exact inherited 3 errors + 6 warnings; **not clean** |
| Migration-free local build | Exit 0 |
| Offline locked install / dependency tree | 506 packages; both successful |

The first full-suite attempt ran before compiled fixtures existed and failed on missing build output. After `node scripts/with-app-env.mjs ./node_modules/.bin/vite build`, the complete suite passed. `npm run build` was not used because it includes migrations. Sparse-array literals in the new tests initially triggered lint; equivalent explicit-delete fixtures resolved this, followed by final RED/GREEN and lint reruns. Initial logs are retained rather than discarded.

Full lint was freshly run on both the failed candidate and remediation. Complete normalized diagnostics match, including messages, locations and fixes. All nine diagnostic-bearing files also have the same Git blobs as the approved Radial Loading base. No lint suppression or baseline change was made.

## Artifacts, network and scope

Two guarded regenerations in a separate directory reproduce all ten committed exports byte-for-byte. Every manifest payload SHA-256 and length matches. Revision remains `0b4823ffd0460646a0c6dc40e9cd30661c54a6ec9151cbf84e37a11fa1c06bcd`; runtime is 40,102 bytes, bundle 141,848 bytes, seven published synthetic occurrences, four exclusions and one tombstone. Schema/builder/generated artifacts remain unchanged.

All guarded contract, remediation, independent and generator runs report **zero unmocked collector network attempts**. No public source call, geocoder call, source activation, billing dependency, new package, retry, paid fallback, active transport or runtime integration was introduced. The existing AST dependency/scope audit passes before adding remediation documentation; the final scope evidence accounts for the new allowed audit/continuation paths. Package and lock blobs match both failed and approved bases. Administrative GitHub/Vercel reads are separate from collector activity. Existing product-suite local HTTP fixtures and mocked provider cases are not public-source calls.

Unchanged policy coverage includes HTTPS/443, host/path/query allowlists, IP-literal and private/reserved IP rejection, DNS-answer/peer pinning, redirect and response ceilings, disabled collection, and no scripts/browser/eval/LLM extraction. These remain offline validation hooks; no live transport was added or tested.

## Preservation and freeze

Beginning/end remote reads retain main `4d937e58d2a65567b54ac5271915bc85b498898b`, approved Radial Loading candidate `908510ac25fe5c24335126a0f34ff42fe4d80632`, failed fact candidate `f7fa63f5688b1d09e5b0baccfd5e617d0748a41a`, and remediation authority `e6806c5b62ca109d7e2a443f7ad4414b770b8afa`. READY production remains `dpl_7RkbrP1c5g1bd7wpnWgWpc9D25DL` at frozen main. Production aliases and every project-settings field exposed by the read API remain equal after unordered-list normalization. No Vercel mutation, deployment, migration or radial-pacing merge occurred.

The unique commit introducing this report is the frozen remediation candidate. Resolve its SHA/tree/sole parent as directed in the continuation; its sole parent must be the failed candidate. Exact identity and changed paths are also in the external freeze report and Git bundle. This local branch is intentionally not pushed: automatic preview deployments are not disabled for `fix/**`, and this task prohibits deployment and Vercel mutation. The portable bundle preserves the branch without either side effect.

Independent reverification of that exact commit is next. **The source pilot remains on hold.**
