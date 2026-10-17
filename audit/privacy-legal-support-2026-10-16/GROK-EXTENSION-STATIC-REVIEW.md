# Grok app-builder extension: bounded read-only retry

Retrieved 2026-10-16 05:29:09 UTC from https://grok.com/grok-app-builder/extensions.js.
HTTP 200; 14,545 bytes; SHA256 `97ed143407ba7548ad242f53a566aaa1dcd9907f322141695532fafce908ae9e`.
Owner explicitly authorized retry of the earlier cancelled public download. This review downloaded but did not execute the script. No application source, configuration, deployment or credentials were changed.

## Findings from the complete captured script

- Lines 46–55 read a project identifier from the extension script's `data-project-id` attribute, falling back to a `grok-project-id` meta tag.
- Lines 342–344 return if no project identifier exists. The already captured production Settings HTML contains the extension script tag without `data-project-id`; no `grok-project-id` meta tag was found. Therefore this captured HTML does not itself enable the conditional request below. A subsequent runtime DOM mutation was not observed/tested by this static inspection.
- Lines 345–350 contain the sole fetch: GET `https://app-builder-deployer.grok.com/rest/app-deployer/v1/projects/{encoded-project-id}/remix-eligibility`, with `credentials: omit` and JSON Accept header. Staging hosts instead select the mouseion development origin. Request payload is the project ID in the path, not location or saved application preferences. Normal network metadata can still accompany the request.
- Only if the JSON response says `forkable === true`, the code renders a Created with Grok / Remix banner and installs viewport/layout observers. The link opens `https://grok.com/remix?app_id={encoded-project-id}` with `noopener noreferrer`.
- The remainder measures DOM layout, inserts CSS/banner/spacer elements, adjusts viewport shells, and responds to resize/orientation/mutation/media-query changes. No DOM text serialization/transmission was found.
- No location API, local/session storage access, document-cookie access, support-email processing, analytics beacon, WebSocket, external code loader or eval was found in these exact bytes. These are bounded static findings, not proof of every previous/future script version or server-side behavior.

## Initial script download still matters

The extension is included in production HTML, so its download exposes ordinary request metadata to Grok/its delivery infrastructure. The captured response offers a `grok_device_id` cookie (HttpOnly; Secure; SameSite=Lax) and a Cloudflare bot-management cookie (HttpOnly; Secure; SameSite=None). Curl used no cookie jar and did not reuse the offered cookies. Whether individual browsers accept/send these third-party cookies depends on browser policy and existing state and was not tested here. Do not describe the initial download as credentials-omitted: that flag belongs only to the conditional eligibility fetch.

This is separate from the owner-disabled Gmail support bot. There is no evidence in this captured script of support-email processing or AI-powered recommendations.

## Policy consequence

The earlier wholly-uninspected-script uncertainty is narrowed materially. Consumer disclosure can accurately say that the website loads a Grok app-builder resource, which receives ordinary web request metadata, and that Grok may apply its own delivery/cookie practices. Do not claim zero third-party transfer or globally cookie-free operation based on Vercel Analytics' narrower policy. Optional removal of an unnecessary production development resource should be a separately reviewed source correction, not performed silently during this evidence task.

No new source revision is required merely to report this evidence against the existing non-effective draft. Before effective policy publication, review final wording against the actual chosen inclusion/removal behavior and any independently observed runtime requests.

## Preservation

Publish `evidence/grok-extension.js`, `evidence/grok-extension.headers.sanitized`, and `evidence/grok-extension-retry-manifest.json`. The raw `grok-extension.headers` contains response cookie identifiers and is local-only; do not commit/upload it. Sanitized headers preserve names/attributes while redacting values; the retry manifest records the raw-header hash for integrity. The earlier cancelled zero-byte header result is preserved as `grok-extension-cancelled-empty.headers` and the original manifest's historical record now names that file. Historical cancellation remains a cancelled attempt, not retroactively PASS.


Packaging qualification: this candidate preserves the static-review memo and source hash only. Raw JavaScript and unsanitized response headers are not published in this source tree. Sanitized evidence and the original read-only capture receipt remain in the continuity package.
