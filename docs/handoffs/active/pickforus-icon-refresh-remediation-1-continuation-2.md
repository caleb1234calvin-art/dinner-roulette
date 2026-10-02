# Pick For Us — Icon Refresh Remediation Continuation 2

Instruction branch:
`fix/pickforus-icon-refresh-1`

Implementation branch:
`fix/pickforus-icon-refresh-candidate-1`

Original locally tested candidate:
`6052a0748256a25b54b5d5a6d94f2e9abd90ffd5`

Exact tested tree:
`fd4374a52b6fc444be4747c17b0f90e76abfd373`

Required sole parent:
`551c5f89fc4d2f8b054b3b4a5b4dce42ba544536`

Current remote implementation branch:
`551c5f89fc4d2f8b054b3b4a5b4dce42ba544536`

Current production main:
`551c5f89fc4d2f8b054b3b4a5b4dce42ba544536`

## Why this revision exists

The icon implementation and all local validation passed.

Normal Git push is unavailable because the worker lacks Git credentials.

The GitHub connector can create blobs, trees, commits and update refs, but cannot set the original local author/committer timestamps needed to reproduce literal commit SHA:

`6052a0748256a25b54b5d5a6d94f2e9abd90ffd5`

For this bounded artwork-only remediation, exact content identity is represented by the already-tested Git tree, not by author/committer metadata.

Therefore this continuation supersedes the prior literal-SHA transport rule.

## Revised publication authority

An exact-tree substitute commit is authorized ONLY if all requirements below pass.

Required tree:
`fd4374a52b6fc444be4747c17b0f90e76abfd373`

Required sole parent:
`551c5f89fc4d2f8b054b3b4a5b4dce42ba544536`

The published commit SHA may differ from `6052a074...` solely because of commit-object metadata that the connector cannot reproduce.

No content difference is authorized.

## Exact-tree proof requirements

Before updating the implementation branch:

1. Reconstruct/upload every blob from the exact tested candidate.
2. Create or verify a Git tree whose SHA is EXACTLY:
   `fd4374a52b6fc444be4747c17b0f90e76abfd373`
3. If the reconstructed tree SHA differs by even one bit, STOP:
   `PICK FOR US ICON REFRESH — TRANSPORT TREE MISMATCH`
4. Create one commit from that exact tree with sole parent:
   `551c5f89fc4d2f8b054b3b4a5b4dce42ba544536`
5. Use commit message:
   `Refresh Pick For Us app and web icons`
6. Record the resulting new remote candidate SHA.
7. Read the new commit back and independently verify:
   - tree = `fd4374a52b6fc444be4747c17b0f90e76abfd373`
   - sole parent = `551c5f89...`
   - changed-path set is exactly the same bounded 28-path icon-refresh set from the locally tested candidate
8. Only then move:
   `refs/heads/fix/pickforus-icon-refresh-candidate-1`
   by normal non-forced fast-forward from base to the new commit.

Do not force-push.
Do not move main.
Do not add documentation files to the implementation candidate.
Do not regenerate artwork or derivatives.

## Relationship to locally tested candidate

The new remote candidate is a transport-equivalent commit, not a newly implemented variant.

Acceptance requires:

- same exact tested tree
- same exact sole parent
- same exact changed bytes
- same exact changed-path set

Because the commit SHA changes, all hosted/independent verification must pin the NEW remote SHA.

The local validation of tree `fd4374a5...` remains valid evidence for file contents, but it does not replace hosted Preview and independent verification of the new remote commit identity.

## Preview and browser verification

After publishing the exact-tree substitute candidate:

1. Wait for Git-linked Vercel Preview.
2. Require Preview source SHA = the new remote candidate SHA.
3. Require READY.
4. Verify direct assets:
   - `/favicon.png`
   - `/apple-touch-icon.png`
   - `/pwa-icon-512.png`
   - `/pwa-icon-maskable-512.png`
5. Verify:
   - `/manifest.webmanifest`
   - compatibility manifests
   - homepage HTML/head uses `/favicon.png`
   - no runtime/manifest reference to old `/favicon.svg`
6. Browser smoke:
   - homepage hydrates
   - Dinner discovery settles
   - Settings renders
   - History renders
   - Favorites renders
   - no application console errors

Browser-chrome favicon cache lag is not a failure if direct asset bytes and head metadata are correct.

## Report finalization

Finalize the remediation Markdown/JSON to record:

- original local candidate SHA `6052a074...`
- exact tested tree `fd4374a5...`
- reason literal SHA could not be transported
- revised exact-tree transport authority
- new remote candidate SHA
- exact tree/parent equality proof
- exact changed-path equality
- Preview deployment ID/source/state
- hosted asset verification
- browser verification
- production remains unchanged

Successful final state:

`PICK FOR US ICON REFRESH — CANDIDATE READY FOR INDEPENDENT VERIFICATION`

Otherwise use:

`PICK FOR US ICON REFRESH — FAILED`

or

`PICK FOR US ICON REFRESH — BLOCKED`

## All original boundaries remain

Still prohibited:
- merge to main
- Production deployment
- DNS/domain changes
- Android signing
- Play publication
- auth/database changes
- dependency changes
- image generation
- redraw/retouch/restyle/crop

Stop after exact-tree publication, Preview/browser verification and report finalization.
