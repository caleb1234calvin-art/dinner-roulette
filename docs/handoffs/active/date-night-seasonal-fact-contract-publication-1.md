# Pick For Us — Seasonal Fact Contract Publication #1

Repository:
`caleb1234calvin-art/dinner-roulette`

Instruction branch:
`handoff/date-night-seasonal-fact-contract-publication-1`

LOCAL VERIFIED CANDIDATE TO PUBLISH:
`e097f949d2871054a47ab55869396d7ce1baca86`

Required tree:
`174b0efc91532029a7d6a989346579871e246de7`

Required sole parent:
`f7fa63f5688b1d09e5b0baccfd5e617d0748a41a`

Authorized publication branch:
`fix/date-night-seasonal-fact-contract-remediation-1`

Independent reverification result:
`SEASONAL FACT CONTRACT INDEPENDENT REVERIFICATION PASSED — EXACT LOCAL CANDIDATE AUTHORIZED FOR PUBLICATION AS SOURCE-PILOT BASE`

Current production main:
`078f65c5d194435452ca14569ea00e57f52a20f3`

Current production deployment:
`dpl_HmqKyiLqCqMSTrhxKktsy9mJtDKy`

---

## Mission

Publish the exact already-verified local Git commit to GitHub without changing a single byte or commit identity.

This is publication only.

Do NOT:
- amend the candidate
- rebase
- squash
- cherry-pick into a replacement commit
- reconstruct the patch manually
- create a different tree
- merge main
- merge radial pacing into this branch
- merge this branch into main
- activate real sources
- add network transport
- crawl websites
- call geocoders
- integrate generated facts into runtime
- mutate Vercel settings
- deploy production
- run migrations

The purpose is only to make the exact independently verified Git object available remotely as the canonical source-pilot base.

---

## Required local identity before push

Resolve from the local repository/Git bundle and require EXACT:

Candidate:
`e097f949d2871054a47ab55869396d7ce1baca86`

Tree:
`174b0efc91532029a7d6a989346579871e246de7`

Sole parent:
`f7fa63f5688b1d09e5b0baccfd5e617d0748a41a`

Require:
- commit exists locally
- worktree clean
- no amend/rewrite since independent reverification
- exact candidate is one commit ahead of failed parent
- exact candidate content matches the independently verified bundle

If any identity differs, STOP.

---

## Remote preconditions

Before push, verify:
- remote branch `fix/date-night-seasonal-fact-contract-remediation-1` does not already point to a different commit
- historical failed candidate `f7fa63f...` remains available
- main is `078f65c5d194435452ca14569ea00e57f52a20f3`
- production is READY `dpl_HmqKyiLqCqMSTrhxKktsy9mJtDKy`
- production source SHA is exact current main
- all five production aliases remain on that production deployment

If main/production changes unexpectedly, record it, but do not modify either. Publication remains separate unless the change creates ambiguity or collision.

---

## Exact publication action

Push EXACT local commit:

`e097f949d2871054a47ab55869396d7ce1baca86`

to remote branch:

`fix/date-night-seasonal-fact-contract-remediation-1`

Do not create a replacement commit.

Preferred push semantics:
- ordinary non-force creation/update if branch is absent or expected at the parent
- if remote branch exists at an unexpected SHA, STOP
- never use unguarded force
- do not rewrite remote history

After push, read remote branch back and require:

Remote branch SHA:
`e097f949d2871054a47ab55869396d7ce1baca86`

Remote commit tree:
`174b0efc91532029a7d6a989346579871e246de7`

Remote sole parent:
`f7fa63f5688b1d09e5b0baccfd5e617d0748a41a`

If any differ, publication FAILED.

---

## Preview side effect

Automatic Preview deployment may occur when this branch is pushed.

That is acceptable only as a side effect of publication.

If a Preview appears:
- require target = non-production / null
- require Git SHA = exact published candidate
- require no production aliases
- do not run public-provider discovery
- do not perform a live source crawl
- do not treat Preview existence as source-pilot activation

No manual deployment is required.

---

## Post-publication preservation

Verify:
- main remains `078f65c5d194435452ca14569ea00e57f52a20f3`
- production remains READY at `dpl_HmqKyiLqCqMSTrhxKktsy9mJtDKy` unless a separately explained unrelated production event occurred
- production aliases remain unchanged
- no Vercel settings changed
- no source was activated
- no collector network requests occurred
- no code was modified during publication

---

## Source-pilot authorization boundary

Successful publication means ONLY that the exact remote commit is now eligible to be used as the base for a NEW source-pilot branch.

It does NOT itself authorize:
- choosing a real source
- crawling a real source
- enabling automatic collection
- geocoding
- runtime integration
- production merge

Those require a separate source-pilot handoff after publication succeeds.

---

## Success verdict

If exact publication and readback pass:

`SEASONAL FACT CONTRACT PUBLISHED — EXACT VERIFIED CANDIDATE AVAILABLE AS SOURCE-PILOT BASE`

Report:
- local candidate SHA/tree/parent
- remote branch
- remote readback SHA/tree/parent
- whether a non-production Preview appeared
- Preview ID/URL if present
- main/production preservation
- zero source/network activation
- confirmation no candidate mutation occurred

---

## Failure verdict

If exact commit identity cannot be preserved or remote state conflicts:

`SEASONAL FACT CONTRACT PUBLICATION FAILED — HOLD SOURCE PILOT`

Do not reconstruct or replace the candidate.

---

## First action

Resolve the exact local candidate from the already-verified local Git state/bundle and compare it to the remote branch state before any push.
