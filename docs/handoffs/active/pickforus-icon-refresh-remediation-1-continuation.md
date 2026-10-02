# Pick For Us — Icon Refresh Remediation Continuation 1

Instruction branch:
`fix/pickforus-icon-refresh-1`

Implementation branch:
`fix/pickforus-icon-refresh-candidate-1`

Exact tested local candidate:
`6052a0748256a25b54b5d5a6d94f2e9abd90ffd5`

Expected candidate tree:
`fd4374a52b6fc444be4747c17b0f90e76abfd373`

Expected sole parent:
`551c5f89fc4d2f8b054b3b4a5b4dce42ba544536`

Current remote implementation branch:
`551c5f89fc4d2f8b054b3b4a5b4dce42ba544536`

Current production main:
`551c5f89fc4d2f8b054b3b4a5b4dce42ba544536`

## Reason for continuation

The implementation and all local validation completed successfully.

The authorized normal Git push failed only because the worker environment lacked GitHub CLI credentials:

`fatal: could not read Username for 'https://github.com': No such device or address`

No candidate Preview exists yet.

The local candidate itself is already fully tested and must NOT be regenerated, rebased, squashed, amended, or replaced merely to work around transport.

## Authoritative prior handoff

Read IN FULL:

`docs/handoffs/active/pickforus-icon-refresh-remediation-1.md`

Treat that handoff as authoritative.

This continuation supersedes only the publication/transport instructions below.

All no-generation, no-retouch, scope, testing, Preview, no-production, no-DNS, no-Play, and reporting rules remain unchanged.

## Exact-object publication authorization

A GitHub API / connector publication fallback is now authorized if normal authenticated Git push is unavailable.

The publication method MUST preserve the exact already-tested candidate object identity:

Candidate commit:
`6052a0748256a25b54b5d5a6d94f2e9abd90ffd5`

Tree:
`fd4374a52b6fc444be4747c17b0f90e76abfd373`

Sole parent:
`551c5f89fc4d2f8b054b3b4a5b4dce42ba544536`

Do NOT substitute a new commit with merely the same tree.

Do NOT alter author, committer, dates, commit message, tree, or parent if doing so changes the SHA.

Do NOT force-update the branch.

Do NOT move main.

## Preferred transport sources

Use the already-created exact transfer artifacts from the remediation evidence:

Bundle:
`audit/pickforus-icon-refresh-candidate-6052a074.bundle`

Expected SHA-256:
`73086c1bc2a4054682c046dba0f286f6a7fc1ebbd742c6c33d1a93af02b8186c`

Patch:
`audit/pickforus-icon-refresh-candidate-6052a074.patch`

Expected SHA-256:
`4b155564bbe12fb60aa89b7625aad7a8535a2bbff9449b88e048546e08ec6fc2`

The bundle has already been replay-verified to preserve the literal commit identity.
The binary patch has already been replay-verified to reproduce the exact tree.

Prefer the bundle for literal commit publication.

## GitHub API fallback requirements

If using GitHub Git Database / connector APIs:

1. Read the exact local commit object and record:
   - tree SHA
   - parent SHA
   - author name/email/date
   - committer name/email/date
   - exact commit message
2. Ensure every changed blob uploaded to GitHub is byte-identical to the tested candidate.
3. Reconstruct or transfer the exact tree.
4. Reconstruct the commit with the exact metadata above.
5. Require the resulting GitHub commit SHA to equal:
   `6052a0748256a25b54b5d5a6d94f2e9abd90ffd5`
6. If the API-created SHA differs for ANY reason, STOP. Do not move the branch to a substitute commit.
7. Only after exact SHA equality is proven, update:
   `refs/heads/fix/pickforus-icon-refresh-candidate-1`
   from the current base to exact candidate using a non-forced fast-forward.
8. Read the remote branch back and independently verify SHA/tree/parent.

If the available GitHub API cannot preserve exact author/committer metadata and therefore cannot reproduce the exact commit SHA, STOP and report transport blocked. Do not relax the identity requirement.

## Preview

After exact remote publication:

- wait for the Git-linked Vercel Preview
- require Preview source SHA exactly:
  `6052a0748256a25b54b5d5a6d94f2e9abd90ffd5`
- require READY
- record deployment ID and URL
- no manual Production deploy

Then perform the originally required hosted checks:
- direct `/favicon.png`
- direct `/apple-touch-icon.png`
- direct `/pwa-icon-512.png`
- direct `/pwa-icon-maskable-512.png`
- `/manifest.webmanifest`
- compatibility manifests
- homepage head uses PNG favicon and does not use old SVG
- homepage hydration
- Dinner discovery
- Settings / History / Favorites
- no app console error

Browser chrome favicon cache lag is not a failure if the direct asset/head bytes are correct.

## Report continuation

Update/finalize the existing remediation report and JSON with:
- exact publication method
- exact remote SHA/tree/parent proof
- Preview ID/source/state
- hosted asset verification
- browser smoke
- final repository state

Successful final state remains:

`PICK FOR US ICON REFRESH — CANDIDATE READY FOR INDEPENDENT VERIFICATION`

Otherwise use the original FAILED/BLOCKED state.

## Boundaries

Still prohibited:
- merge to main
- production deployment
- DNS changes
- Vercel domain changes
- Android signing
- Play upload/publication
- auth/database changes
- dependency changes
- image generation or artwork edits

Stop after exact candidate publication, Preview/browser verification, and report finalization.
