# Independent PR82 recovery-assurance review

Reviewed 2026-10-19 06:04 UTC. Verdict: **HOLD**. Read-only review; no release or recovery execution.

Scope: exact commit `cf18ff1c5a56ecf59f8006d4f7c83fb289f393df`, tree `6300c1061a790d84447bb92166f340aec895757b`. The owner's separately approved one-release unprotected-main exception does not waive the remaining mandatory gates.

The supplied dashboard evidence verifies today's rollback selection of `8DBJFLQwkBGckTxM5RYPM63dLqS5` / `ead2319`, not the intended post-release restore to `dpl_FMS2SBg4ymuDwU4avpywV6yB5vg6` / `c3208d9fdc9a21d698efa9254be1286f5d3d2836`, and does not establish restoration of all five hostnames.

## Official documentation and proof gap

- Vercel documents Hobby rollback only to the immediately previous deployment. FMS becoming that eligible target after this release is a conditional expectation, not the required pre-execution verification. The existing selector's 8DB target cannot substitute.
- Vercel explicitly requires checking the domains in the confirmation screen. Its custom-alias inclusion is conditional on their presence on the previous production deployment. The three listed hosts therefore do not prove coverage of the two omitted generated hosts. Omission also does not prove they cannot restore.
- Rollback disables automatic production-domain assignment afterward; the observed warning matches documented behavior.

Source: [Instant Rollback documentation](https://vercel.com/docs/instant-rollback), read independently during this review.

The generated main-branch URL is especially important: Vercel distinguishes branch URLs, which follow the latest branch deployment, from production URLs, which follow production. Its documentation does not establish that Instant Rollback moves this particular branch URL back with production. Current shared bindings cannot resolve that distinction. The generated production-style URL is more consistent with production-following behavior, but still lacks project-specific recovery proof. Source: [Generated URL documentation](https://vercel.com/docs/deployments/generated-urls).

The alias CLI documentation describes manual alias assignment and recommends rollback/promote commands for production domains. It supplies no missing guarantee for these two generated aliases; it is not evidence authorizing an alternate recovery route. Source: [Alias documentation](https://vercel.com/docs/cli/alias).

## Project-specific evidence boundary

The supplied dashboard confirmation lists:
- `pickforus.app`
- `www.pickforus.app`
- `dinner-roulette-chi.vercel.app`

It does not list:
- `dinner-roulette-minions-9e2c.vercel.app`
- `dinner-roulette-git-main-minions-9e2c.vercel.app`

The parent reports that fresh browser observation at 06:04 UTC reconfirmed the same three-host list, the effective hosted build override PASS, and FMS READY. These are supplied observations, not independent browser observations by this reviewer. They do not close the recovery proof gap.

## Exact-source release procedure

Independently fetched and read `docs/legal/PUBLICATION.md` at commit `cf18ff1c5a56ecf59f8006d4f7c83fb289f393df`; returned Git blob SHA `3271363639f459eded7bde9ce84e8f102b2f3299`.

The procedure requires renewed operational/rollback checks before release and HOLD on readiness changes. The new unprotected-main exception does not resolve this separate gate. Source: [Exact-source procedure](https://github.com/caleb1234calvin-art/dinner-roulette/blob/cf18ff1c5a56ecf59f8006d4f7c83fb289f393df/docs/legal/PUBLICATION.md).

## Separate owner decision

If supported preverification remains unavailable, the smallest separate owner decision is whether to keep release on HOLD or explicitly revise this exact release's recovery-evidence requirement, acknowledging unverified FMS eligibility and both generated-host restore paths. No release can proceed under unchanged conditions. This is an evidence gap, not a finding that rollback is universally impossible.

The parent reported HOLD and the separate owner decision; no release occurred. This review performed no production mutation, browser operation, denied API retry, or settings change.
