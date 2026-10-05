# Pick For Us — Seasonal Source Candidate Selection #2

**SEASONAL SOURCE CANDIDATE SELECTION #2 BLOCKED — NO SUITABLE SOURCE FOUND**

Review date: October 4, 2026, America/Chicago (October 5 UTC). Exactly three candidates were reviewed. None meets the existing affirmative permission predicate. No candidate is selected, and Pilot #2 implementation is not authorized by this report.

## Immutable Git boundary

| Identity | Value |
| --- | --- |
| Starting SHA | `bdd8b92e81d9f54a99c4e4c52aa54d7d3609b2d9` |
| Starting tree | `da7a9d00aaa9f66030439547a18e6e28846e3399` |
| Starting sole parent | `e097f949d2871054a47ab55869396d7ce1baca86` |
| Starting branch | `feature/date-night-seasonal-source-pilot-1` |
| Research branch | `research/date-night-seasonal-source-candidate-selection-2` |
| Production main | `078f65c5d194435452ca14569ea00e57f52a20f3` |

The exact local starting identity and clean worktree were verified before discovery. Remote starting-branch and main readbacks matched. This report's introducing research commit has the starting SHA as its sole parent; its exact SHA/tree are recorded in the separately delivered final report and are resolvable from Git. A commit cannot contain its own final identity without changing that identity.

## Decision and method

`tools/seasonal-facts/README.md` and `policy.ts` were read at the immutable base. The unchanged `permissionApproved` predicate requires affirmative robots, terms, permission and reuse reviews, evidence, reviewer/time, unexpired permission, and any required attribution/license. The A1 collection gate remains disabled. Public reachability, indexing, a government association, an allow directive, or missing terms does not grant collection/reuse approval.

Search was used only for domain, policy-page and factual-page discovery. Indexed material is labeled as a lead below; it was not converted into verified source facts or permission evidence. No search result was explicitly opened. Search may perform opaque upstream work, whose request count is unavailable; the exact direct-review counts below cover the controlled HTTPS attempts only.

Each direct attempt used unauthenticated HTTPS, the same curl client/default user agent, no redirects, no retries, a 5-second connection limit and 10-second total limit. Robots responses were bounded to 16 KiB; the representative page to 2 MiB. No browser, remote script execution, subresources, general crawl, alternate proxy, host fallback, HTTP downgrade, user-agent rotation or access-control bypass was used.

After an unsuccessful request the candidate was stopped. Exeter had no discoverable terms URL, so the authorized representative home-page review was used as its second request to inspect ordinary access and potentially discover footer policy links. This did not approve reuse. It timed out, leaving no page to inspect and no third request justified.

## Candidate comparison

| Candidate / source class | Candidate host and canonical status | Robots | Terms / reuse | Ordinary HTTPS | Direct requests | Decision |
| --- | --- | --- | --- | --- | ---: | --- |
| Exeter Corn Maze — apparent first-party seasonal operator | `www.exetercornmaze.com`; robots served at this host; canonical page/ownership not independently confirmed | HTTP 200; wildcard allows `/`, disallows `*?lightbox=` | UNKNOWN; no website terms URL found by bounded discovery; no reuse/attribution/license approval | robots succeeded; home page timed out with no origin HTTP response | 2 | NO-GO |
| Right Choices Corn Maze — apparent first-party seasonal operator | `www.rightchoicescornmaze.com`; historical domain association only; live canonical host unverified | No HTTP response; connection-establishment timeout | UNKNOWN; stopped before policy/page access | Not established; robots attempt timed out | 1 | NO-GO |
| Visit Missouri / Missouri Division of Tourism — official state tourism event directory lead | `www.visitmo.com`; official association indicated by indexed pages; live canonical host unverified | No HTTP response; connection-establishment timeout | UNKNOWN; privacy/legal URL discovered but not fetched after stop | Not established; robots attempt timed out | 1 | NO-GO |

### 1. Exeter Corn Maze

- **Discovery/authority leads:** [operator home page](https://www.exetercornmaze.com/), [about page](https://www.exetercornmaze.com/about-us), and [Missouri Grown operator listing](https://missourigrownusa.com/members/10246) associate the attraction with this domain in indexed results. This supports candidate discovery, not independently verified legal ownership.
- **Likely coverage:** seasonal corn maze, pumpkin activities, haunted attractions, hours and admission. The indexed home page explicitly references the 2026 season; current-season factual evidence was not retrieved directly. Likely factual paths are `/`, `/about-3` and `/faq`, discovered in search. Only `/` was attempted as a representative page.
- **Robots:** `GET https://www.exetercornmaze.com/robots.txt` returned HTTP 200, `text/plain; charset=utf-8`, 496 bytes. `User-agent: *` has `Allow: /` and `Disallow: *?lightbox=`. AdsBot groups disallow `/_partials*` and `/pro-gallery-webapp/v1/galleries/*`; PetalBot is disallowed entirely; dotbot and AhrefsBot have 10-second crawl delays. These groups were not impersonated. The robots posture appears permissive for a generic client at ordinary non-lightbox paths; it is not a reuse license.
- **Terms/reuse:** targeted website terms/privacy discovery returned no results. This does not establish absence of terms. No automated-access restriction, factual reuse grant/restriction, attribution obligation or license could be affirmatively reviewed. State: **UNKNOWN**, neutral/unclear, not approved.
- **Ordinary access:** `GET https://www.exetercornmaze.com/` timed out during connection establishment, before an origin HTTP response or page body. Successful robots access does not establish factual-page access. Login/CAPTCHA/paywall/challenge presence, static HTML, structured data and JavaScript requirements are all unknown.
- **Fact suitability:** search suggests relevant 2026 and location material, but current-year/address facts, non-expressive field extraction, field-level provenance and a narrow inert adapter remain unverified. No address, coordinates or event assertions were promoted into the contract.
- **Cost:** no paid service was used or proposed. A future direct-HTTPS/inert-parser approach could have no billing dependency, but feasibility was not established. Any paid gateway/geocoder/API fallback remains excluded.
- **Decision:** **NO-GO**. The readable robots policy makes this the strongest technical lead among these attempts, but unreviewed terms/reuse and failed factual-page access prevent selection. This is not a finding that the operator forbids collection.

### 2. Right Choices Corn Maze

- **Discovery/authority lead:** the indexed [Missouri Farm Bureau agritourism directory](https://mofb.org/missouri-agritourism/) associates the attraction in southwest Missouri with `www.rightchoicescornmaze.com`. This is a historical operator-domain lead, not current ownership verification. The referenced HTTP domain was evaluated only using HTTPS; no downgrade was attempted.
- **Likely coverage:** corn maze, pumpkin patch, hayrides and visitor/event information. The home path `/` and historical `/index.html` are factual-page leads; neither was requested. Bounded search found no affirmative 2026 operator-season evidence.
- **Robots/ordinary access:** the sole request, `GET https://www.rightchoicescornmaze.com/robots.txt`, timed out during connection establishment. No HTTP status, body or directives were received. The recorded curl status `0` means no HTTP response, not an HTTP status code. Robots/access states: **UNKNOWN**.
- **Terms/reuse:** no direct review after the timeout. Existence, automated-use restrictions, factual reuse conditions and attribution/license are **UNKNOWN**; absence is not asserted.
- **Fact suitability:** current-year evidence, address/location accuracy, challenge/login/paywall state, static/structured content, JavaScript needs, non-expressive extraction, field provenance and adapter feasibility are all unverified.
- **Cost:** zero paid dependencies/calls used. A zero-cost source path was not established; no paid fallback is approved.
- **Decision:** **NO-GO**. Access/permission are unresolved, and discovery also lacks affirmative current-season evidence. No closure, site-wide outage or operator prohibition is inferred.

### 3. Visit Missouri / Missouri Division of Tourism

- **Discovery/authority leads:** [Visit Missouri](https://www.visitmo.com/) and [listing criteria](https://industry.visitmo.com/listings-criteria/) identify a Missouri Division of Tourism association in search. Class: official state tourism/destination directory lead; this is not a claim that government-associated content is unrestricted.
- **Likely coverage:** Missouri-wide event dates and locations, including seasonal events. Indexed `/events` results and the [Legends & Lanterns event URL](https://www.visitmo.com/events/legends-lanterns-a-spirited-journey-through-halloween-history) suggest explicit 2026 seasonal listings. Likely factual pattern: `/events/<slug>`. These are unverified discovery leads, with no factual-page request.
- **Robots/ordinary access:** the sole request, `GET https://www.visitmo.com/robots.txt`, timed out during connection establishment. No origin HTTP status/body/directives were received. Robots/access states: **UNKNOWN**.
- **Terms/reuse:** [privacy/legal page lead](https://www.visitmo.com/privacy-policy) was discovered in search. It was not fetched after the robots stop. Indexed policy text was not accepted as current permission, a reuse grant, or a reviewed restriction. Automated access, factual reuse, attribution and license remain **UNKNOWN**.
- **Fact suitability:** the event-specific URL pattern is promising for provenance, but static/structured availability, current-season/address evidence, non-expressive extraction, JavaScript requirements and narrow adapter feasibility were not directly established. Challenge/login/CAPTCHA/paywall presence remains unknown.
- **Cost:** zero paid dependencies/calls used. Direct HTTPS would be the only candidate architecture considered; paid gateways, geocoders and APIs are excluded. Feasibility remains unverified.
- **Decision:** **NO-GO**. Its apparent official standing and indexed 2026 coverage cannot resolve failed ordinary access or unreviewed reuse terms.

## Network and product boundary

- Direct candidate review requests: **4 total** (Exeter 2, Right Choices 1, Visit Missouri 1). Maximum for any candidate: 2 of the allowed 3.
- Cadaver Zone requests: **0**. No alternate host, retry or workaround.
- Collector calls: **0**. Geocoder calls: **0**. Paid API calls: **0**.
- Source registry additions, collector implementations/activation, real-source contract artifacts, runtime integration, migrations, manual deployments and main merges: **0**.
- Search: **5 built-in search calls, 13 queries**, zero explicit opens; upstream search requests are opaque. Search is research-only and introduces no runtime/provider dependency.
- GitHub/Vercel administrative reads and research-branch publication are separate from candidate access; only reduced preservation results are public. No administrative payloads, credentials, cookies, internal network details or unnecessary deployment metadata are included.

## Proportionate verification and preservation

The research delta is constrained to four new documentation/evidence files: this report, the bounded access evidence, network summary and continuation handoff. Validate every preexisting base tree entry by object ID and mode; validate all additions as non-executable `100644` Markdown/JSON; check the staged diff for whitespace errors. These Git-object checks prove that the exact starting tree remains intact beneath the research additions and that executable changed paths are **0**.

No implementation tests, dependency installs, fixture regeneration, builds or migrations are warranted for this additive documentation-only delta. No prior suite result is presented as a fresh test result.

Before publication, remote main and the production deployment serving `pickforus.app` were read: main matched the stated SHA and production was READY at that SHA. After publication, repeat main/starting-branch and production readbacks; record exact research SHA/tree/parent and preservation results in the owner report. Only the research branch may be created; no main, production, alias or configuration mutation is authorized. An automatic non-production Preview is acceptable.

## Exact continuation

Keep Pilot #2 implementation on hold. Obtain operator-supplied evidence that explicitly addresses narrow automated factual access, factual reuse, allowed paths, attribution/license conditions and review validity. With that evidence, authorize a fresh bounded access review that also establishes current robots/terms and ordinary HTTPS factual-page access. Only an affirmative decision under the unchanged contract can produce an implementation handoff. Do not retry these failed requests in this task, contact Cadaver Zone, weaken policy, add a registry entry or activate collection. No outreach was sent.
