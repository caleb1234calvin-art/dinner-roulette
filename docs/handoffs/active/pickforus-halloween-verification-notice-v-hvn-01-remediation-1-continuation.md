# Pick For Us — Halloween Verification Notice V-HVN-01 Remediation Continuation 1

Repository:
`caleb1234calvin-art/dinner-roulette`

Instruction branch:
`fix/pickforus-halloween-verification-notice-v-hvn-01-remediation-1`

Implementation branch:
`fix/pickforus-halloween-verification-notice-v-hvn-01-candidate-1`

Original local remediation candidate:
`e87434166653bcad24156a7505cdec51247e3721`

Exact tested remediation tree:
`4f39061bc32e3b362232907191efaf0f3d1715ce`

Required sole parent:
`cf5e98d7fa6817f1fef4d67a182c518ea760bb79`

Current remote implementation branch:
`cf5e98d7fa6817f1fef4d67a182c518ea760bb79`

Current production main:
`91e1bc6b2d3e6ea38af4acfe4099f4cfc7085509`

## Reason for continuation

The V-HVN-01 remediation passed locally.

Measured browser clearance:
- 320×568: 22.21875px positive clearance
- 390×844: 41.71875px positive clearance
- zero overlap
- all fallback/caution words unobscured
- all action controls unobscured

The only product change is one line in:

`src/components/date-night-home.tsx`

Changing:

`<main className="px-4 pb-48 pt-5">`

to:

`<main className={cn("px-4 pt-5", halloweenActive ? "pb-56" : "pb-48")}>`

All 119 required tests passed:
- 24 seasonal
- 95 provider-deadline/client-lifecycle

Typecheck, bounded lint, diff checks and exact migration-free production build passed.

Normal Git push failed only because GitHub HTTPS credentials are unavailable.

The original V-HVN-01 handoff intentionally prohibited connector publication without a continuation.

This continuation authorizes connector publication under exact-tree constraints.

## Authoritative prior handoff

Read IN FULL:

`docs/handoffs/active/pickforus-halloween-verification-notice-v-hvn-01-remediation-1.md`

Also preserve all boundaries from:
- original Halloween notice remediation
- original publication continuation
- independent verification finding

This continuation supersedes ONLY the remediation candidate publication transport rule.

## Exact-tree publication authority

If normal authenticated Git push remains unavailable, use GitHub Git Database / connector APIs to publish a transport-equivalent candidate.

The published remediation candidate MUST have:

Tree:
`4f39061bc32e3b362232907191efaf0f3d1715ce`

Sole parent:
`cf5e98d7fa6817f1fef4d67a182c518ea760bb79`

Changed paths exactly:
- `src/components/date-night-home.tsx`

No other tracked path may differ from the failed parent.

The published commit SHA may differ from local `e8743416...` solely because connector-created commit metadata may differ.

No content drift is authorized.

## Publication proof

Before moving the implementation branch:

1. Upload/reuse exact tested remediation blob(s) only.
2. Create/verify a Git tree whose SHA is EXACTLY:
   `4f39061bc32e3b362232907191efaf0f3d1715ce`
3. If the tree differs, STOP:
   `PICK FOR US HALLOWEEN VERIFICATION NOTICE V-HVN-01 — TRANSPORT TREE MISMATCH`
4. Create one commit using that exact tree and sole parent:
   `cf5e98d7fa6817f1fef4d67a182c518ea760bb79`
5. Use commit message:
   `Fix Halloween notice mobile scroll clearance`
6. Read the created commit back.
7. Verify:
   - exact tree
   - exact sole parent
   - exact one-path diff
8. Verify `main` is still:
   `91e1bc6b2d3e6ea38af4acfe4099f4cfc7085509`
9. Verify remote remediation candidate branch is still:
   `cf5e98d7fa6817f1fef4d67a182c518ea760bb79`
10. Advance only:
    `refs/heads/fix/pickforus-halloween-verification-notice-v-hvn-01-candidate-1`
    using `force=false`.
11. Read the remote branch back and verify new SHA/tree/parent.

Do NOT:
- force push
- move main
- rebuild or reimplement the fix
- add reports/evidence/handoffs to the candidate
- modify tests in transport
- change any other file

## Preview verification

After exact-tree publication:

- wait for Git-linked Vercel Preview
- require source branch = remediation candidate branch
- require source SHA = NEW remote remediation candidate SHA
- require target Preview / null
- require READY
- require aliasError null

Then rerun the exact hosted checks from the V-HVN-01 handoff.

At minimum:

### 320×568
- true max scroll
- full fallback sentence visible
- fallback bottom <= action-card top
- prefer >=8px positive clearance
- all fallback words unobscured
- all caution words unobscured
- no horizontal overflow
- Pick our date usable
- Give us options usable
- Plan the night usable
- bottom navigation not obscuring card

### 390×844
- same layout/fallback coexistence checks
- no regression

### Ordinary Date Night
- retains pb-48 / 192px bottom padding
- caution absent
- no unintended extra spacing

### General
- exact caution unchanged
- exact fallback unchanged
- role=note preserved
- Settings / History / Favorites render
- no application console/page errors

## Report finalization

Finalize the V-HVN-01 remediation Markdown/JSON to record:
- local candidate `e8743416...`
- exact tested tree `4f39061b...`
- connector publication method
- new remote remediation candidate SHA
- tree/parent/path equality proof
- Preview deployment ID/source/state
- hosted 320×568 geometry
- hosted 390×844 geometry
- ordinary-mode padding preservation
- hosted actions/navigation/console
- production unchanged

Successful final state:

`PICK FOR US HALLOWEEN VERIFICATION NOTICE V-HVN-01 — CANDIDATE READY FOR INDEPENDENT REVERIFICATION`

Otherwise use FAILED/BLOCKED as appropriate.

## Boundaries

Still prohibited:
- merge main
- production deployment
- DNS/domain changes
- Vercel settings changes
- discovery/provider/catalog changes
- copy changes
- Android signing/Play publication
- dependency changes
- auth/database changes

Stop after exact-tree publication, Preview/browser verification and report finalization.
