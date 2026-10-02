# Pick For Us — Halloween Verification Notice Remediation Continuation 1

Repository:
`caleb1234calvin-art/dinner-roulette`

Instruction branch:
`fix/pickforus-halloween-verification-notice-1`

Implementation branch:
`fix/pickforus-halloween-verification-notice-candidate-1`

Original locally tested candidate:
`e766b1a3c01af59264b5c7193b528a33331c71c9`

Exact tested tree:
`fd1d24383f88b763dc6c5ba97d920c0abeb566c3`

Required sole parent:
`91e1bc6b2d3e6ea38af4acfe4099f4cfc7085509`

Current remote implementation branch:
`91e1bc6b2d3e6ea38af4acfe4099f4cfc7085509`

Current production main:
`91e1bc6b2d3e6ea38af4acfe4099f4cfc7085509`

## Reason for continuation

The implementation, regression tests, typecheck, lint, migration-free build, and fresh local mobile browser checks all passed.

Normal non-forced Git push failed only because the worker environment lacks GitHub HTTPS credentials.

The original remediation handoff intentionally prohibited connector publication without a continuation.

This continuation authorizes connector publication under exact-tree constraints.

## Authoritative prior handoff

Read IN FULL:

`docs/handoffs/active/pickforus-halloween-verification-notice-remediation-1.md`

Treat it as authoritative.

This continuation supersedes only the candidate publication transport rule.

All scope, test, Preview, no-production, no-DNS, no-Android, and reporting boundaries remain unchanged.

## Exact-tree publication authority

If normal authenticated Git push remains unavailable, use GitHub Git Database / connector APIs to publish a transport-equivalent candidate.

The published candidate MUST have:

Tree:
`fd1d24383f88b763dc6c5ba97d920c0abeb566c3`

Sole parent:
`91e1bc6b2d3e6ea38af4acfe4099f4cfc7085509`

Changed paths exactly:
- `src/components/date-night-home.tsx`
- `scripts/seasonal-discovery.test.mjs`

No other path may differ.

The published commit SHA may differ from local `e766b1a3...` solely because connector-created commit metadata may differ.

No content drift is authorized.

## Publication proof

Before moving the implementation branch:

1. Upload/reuse exact candidate blobs only.
2. Create/verify a Git tree whose SHA is EXACTLY:
   `fd1d24383f88b763dc6c5ba97d920c0abeb566c3`
3. If the tree differs, STOP:
   `PICK FOR US HALLOWEEN VERIFICATION NOTICE — TRANSPORT TREE MISMATCH`
4. Create one commit using that exact tree and sole parent:
   `91e1bc6b2d3e6ea38af4acfe4099f4cfc7085509`
5. Use commit message:
   `Add Halloween seasonal verification notice`
6. Read the created commit back.
7. Verify exact tree, exact sole parent, and exact two-path diff.
8. Verify `main` and the remote implementation branch are still at the base before ref update.
9. Advance only:
   `refs/heads/fix/pickforus-halloween-verification-notice-candidate-1`
   using `force=false`.
10. Read remote branch back and verify the new SHA/tree/parent.

Do NOT force-push.
Do NOT move main.
Do NOT add reports/handoffs to the candidate.
Do NOT regenerate or reimplement the change.

## Preview verification

After exact-tree publication:

- wait for the Git-linked Vercel Preview
- require Preview source SHA = the NEW remote candidate SHA
- require target Preview / target null
- require state/readyState READY
- require alias error absent

Then rerun the hosted/browser checks from the original handoff.

At minimum verify on the exact Preview:

### Halloween active
- exact caution text visible
- visible during loading
- visible after settlement
- Pick our date visible/usable
- Give us options visible/usable
- Plan the night visible/usable

### Ordinary Date Night
- caution absent
- primary controls unchanged

### Fallback
- exact original fallback disclosure still visible
- new caution visible simultaneously

### Mobile
- verify at 390×844
- verify at 320×568 if browser tooling permits
- no horizontal overflow
- sticky card/actions remain usable and unobscured

### General
- Settings/History/Favorites render
- no application console errors
- production main remains unchanged

## Report finalization

Finalize the existing remediation Markdown/JSON to record:

- original local candidate `e766b1a3...`
- exact tested tree `fd1d2438...`
- connector publication method
- new remote candidate SHA
- tree/parent/path equality proof
- Preview deployment ID/source/state
- hosted mobile/notice/action/browser checks
- production unchanged

Successful final state:

`PICK FOR US HALLOWEEN VERIFICATION NOTICE — CANDIDATE READY FOR INDEPENDENT VERIFICATION`

Otherwise use the original FAILED/BLOCKED state.

## Library artifact note

Persistent Library upload of reports/evidence is OPTIONAL and not required for candidate publication, Preview verification, or independent verification.

Do not attempt Library upload unless the owner explicitly authorizes a destination in a separate instruction.

## Boundaries

Still prohibited:
- merge to main
- production deployment
- DNS/domain changes
- Vercel settings changes
- discovery/provider/catalog changes
- Android signing/Play publication
- dependency changes
- auth/database changes

Stop after exact-tree publication, Preview/browser verification, and report finalization.
