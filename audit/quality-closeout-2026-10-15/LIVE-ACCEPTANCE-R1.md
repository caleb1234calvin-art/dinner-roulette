# Production acceptance — 2026-10-15

Status: PARTIAL / HOLD. This is direct production interaction in a cloud Chrome browser, not a fixture run, physical Android acceptance, or proof that every live provider succeeded. Observations occurred during the 18:09–18:46 UTC takeover session. Later additions are explicitly labeled.

Production source: `991978fe24ec165eeacd5500a26d66f35d86c560`; tree `95f66498048590cbd30c623b17d15bf2d5b7cc73`; deployment `dpl_72on94mDyDhNBbmN356bdXBsMqtY`, READY. All five alias lookups independently returned that deployment: pickforus.app, www.pickforus.app, dinner-roulette-chi.vercel.app, dinner-roulette-minions-9e2c.vercel.app, dinner-roulette-git-main-minions-9e2c.vercel.app. Apex HTTP 200; www redirects to apex. The 92 count is curated source identities, not a promise of 92 currently visible or open attractions.

## Directly completed

| Area | Actions and observed result | Qualification |
| --- | --- | --- |
| Load / navigation | Production hydrated; dismissed initial tour; Date Night controls, Options, Result, Details, Favorites and History routes rendered | No physical device used |
| Seasonal switch | ON exposed seasonal categories, presets and Plan; OFF restored ordinary Date Night and removed seasonal controls | No exhaustive OFF inventory proof |
| Kansas City, Kansas | City search resolved. Haunted House, Open Now OFF: 15-mile and 50-mile selections both returned Edge of Hell, Beast and Worlds of Fun during incomplete live coverage | Reproduced outer-radius defect; see defect report |
| Kansas / Topeka | Relocated successfully at 50 miles; two haunted matches observed: Nightmare Festival and a live Sallie House result | Partial provider coverage remained visible |
| Released Nightmare Festival | Options → Result → Details: Season upcoming on Oct 15; One Expocentre Drive, Topeka KS 66612-1442; address encoded in Directions; source dates Oct 16–18, 23–25, 30–31; Blackout Oct 31; hours and clear-bag/token notices present | Direct UI verification, not a fresh independent venue audit |
| Missouri / Edge of Hell | Options → Result → Details rendered; approximate location, schedule unknown, waiver/video/security and early check-in notice present | Kansas City metro sample, not statewide coverage |
| Edge arrival address | Display venue is 1300 W 12th; Directions uses first-stop waiver station 1300 W 13th, Kansas City MO 64102 | Correct, not a defect: official safety/security source requires waiver station 60 minutes early |
| Open Now | Kansas City Haunted House with Open Now ON returned zero; explained how to include unconfirmed/upcoming listings; Pick, Options and Plan disabled | Sampled fail-closed behavior only |
| Favorites | Saved Edge from Result; Favorites route showed it, updated distance after relocation, and retained waiver-station Directions; removed only that test-created favorite; verified empty state | No preexisting personal favorites altered |
| History | Route rendered “No choices logged yet” and explained We chose this | Did not create a fictitious visit; history-write flow remains untested live |
| Plan empty state | Topeka Haunted House-only Plan showed “No complete seasonal pair yet” | Honest failure to find a distinct settle stop; valid pair not yet verified live |
| Arkansas / Benton | “Benton, Arkansas, United States” unexpectedly resolved to Benton County; ZIP “72015, Arkansas, United States” corrected to Benton city | See separate location ambiguity defect |
| Released Royal Haunted House | Haunted House Options → Result → Details showed 111 South Market Street, Benton AR 72015, same address in Directions; Check today's hours; Oct 15–17, 22–24, 29–31; Thursday 7–9 PM, Friday/Saturday 7–10 PM; access/medical/ticket/security notices | Address-based fallback and partial hours remain conservative |
| Oklahoma / Tulsa | Relocation succeeded. Options showed Hex House (unknown schedule) and Psycho Path (closed now) | Seasonal live-map inclusion notice then partial provider warning |
| Psycho Path | Result and Details: 1517 East 106th Street North, Sperry OK 74073 in Directions; Friday/Saturday October 2026; Oct 30–31 lights out; timed tickets, weather/strobes/fog/loud-noise notice | No invented open-now assertion |
| Progressive search / failures | Loaded-through-15/20/30/40-mile progress and incomplete-provider warnings visible; Topeka eventually reported outer areas unavailable | Application remained usable with saved/available results; provider recovery not assumed |

Cloud input sometimes reported `Input.dispatchMouseEvent timed out` although the requested UI transition completed. Each such action was followed by a fresh accessibility read before proceeding. These tool-input timeouts are not classified as product defects.

## Still incomplete at this checkpoint

Live History writes, exhaustive cache/expiration boundaries, live 320/390/512 geometry, physical Android/GPS/rotation/back-key and fresh independent factual acceptance remain incomplete. No browser viewport override is exposed in this cloud session. Hosted browser suites are fixture-based and will be reported separately; they do not erase live-provider or physical-device qualifications. Actual production time was not changed to manufacture an expiration pass.

## Subsequent live observations (same session, through 18:46 UTC)

- Illinois relocation to Herrin succeeded. Haunted-only search reached “Loaded through 50 miles.” Options contained Chittyville at approximately 2.1 miles and Missouri's Haunted Hall of Horror at approximately 45 miles. The cross-state option was honestly unconfirmed; no state-line cutoff was implied.
- Chittyville Result and expanded Details showed 401 Chittyville Road, Herrin IL 62948; the same address in Directions; closed now; Fridays/Saturdays through Oct 31, 7 PM–midnight, ticket office 6:30–11:30 PM; virtual queue/group size, stairs/uneven-floor access limitations, effects, medical, child, impairment, security and booking notices. No ticket availability guarantee appeared.
- Switching Haunted House to Anything changed the search to incomplete coverage. Clicking **Retry missing areas** visibly resumed expansion; progress then reached 15 and 20 miles with 97 and 105 activities respectively. This verifies graceful resumption and usable results, not complete recovery of all providers.
- **Plan the night** with Anything produced distinct stops: Chittyville (Scare, closed now, address Maps and operator Info) and Circle Park (Settle, 12 miles, unknown hours explicitly warned, coordinate Maps, Info unavailable disabled). Open Now was OFF. The plan retained availability qualifications and did not relabel the park as a haunt.

## Primary source cross-check

https://www.edgeofhell.com/safety-security — retrieved Oct 15, 2026; explicitly explains Central Waiver Station first stop, 1300 W 13th Street and 60-minute-early arrival. This resolves the apparent venue/Directions discrepancy without changing either address.
