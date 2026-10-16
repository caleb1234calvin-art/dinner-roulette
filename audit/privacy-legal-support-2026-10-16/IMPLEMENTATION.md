# Privacy, Legal & Support candidate

Nonproduction implementation from main c3208d9fdc9a21d698efa9254be1286f5d3d2836, tree c36112156cd11baefb6671194f0d59b9c181c2a3. Based on the independently reviewed audit at bb3f1436b0b21e03588ad4f2a2a3ff3e02f4bf31.

## Scope

- Public, server-rendered `/privacy` and `/terms` document routes with document versions, explicit draft status, contents links and contact.
- Settings links, Caustic Relay attribution, mailto support with selectable visible fallback and no account requirement.
- Existing reset behavior retained; expanded text describes exactly what resets and what remains. Existing preference switches receive accessible labels.
- Existing startup video is bypassed only for legal documents, so documents remain readable without video playback or JavaScript.
- No fabricated Play download URL, consent gate, account mechanism, tracking service or package rename.
- No changes to PR #75, curated catalog, lifecycle, acquisition architecture, native configuration or production settings.

## Publication boundaries

These are draft documents, not effective legal terms or a completed privacy compliance remediation. Operational/provider/support facts and owner/legal decisions remain explicitly unresolved. Proposed permanent production URLs are `https://pickforus.app/privacy` and `https://pickforus.app/terms`; this candidate does not publish them. Exact-head hosted test accessibility is not public production accessibility. No Console declarations or Play acceptance are implied.

## Validation history

- First dependency installation failed because the default npm cache path `/home/agent/.npm` was unavailable. Retry using `/tmp/pickforus-npm-cache` installed locked dependencies without package changes.
- Premature initial typecheck reported missing tsc before installation completed; subsequent typecheck passed.
- Initial new focused link-protocol assertion was overly restrictive for documented mailto and exact relative legal links. Corrected assertion accepts only HTTPS, mailto and exact `/privacy` or `/terms` paths. Failed attempt preserved in local evidence; existing tests unchanged.
- Local browser/socket restrictions prevent trustworthy HTTP/browser acceptance. Hosted CI must run the new legal-support matrix suite; no local browser PASS is claimed.
- Full exact-head results, independent review and immutable IDs are recorded at the freeze/acceptance checkpoint, not inferred from prior PRs.
