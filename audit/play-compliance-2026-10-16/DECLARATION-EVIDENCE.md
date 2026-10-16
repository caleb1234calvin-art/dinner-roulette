# Declaration evidence and unresolved facts

These are preparation notes, not Console answers or attestations.

| Topic | Established evidence | Still needed |
|---|---|---|
| Privacy policy | Settings text is incomplete at [lines 32–39](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/components/settings-page.tsx#L32-L39); live app pages corroborate it | Accurate full policy/contact/retention/recipients; public Console URL and accessibility |
| Location | Coarse and fine permissions declared; user action requests location; unrounded returned coordinates reach server/provider calls | Actual returned granularity, native permission choices, payloads/retention; collection purposes and user-facing disclosure triggers |
| Analytics and external scripts | Insights source/DOM integration, Mode Selected instrumentation and external script/font references | Successful requests, payloads, cookies/identifiers, provider role and retention; distinguish scripts merely present from events sent |
| Local favorites/history | Source uses local storage for user state | Actual backup/transfer and release behavior; local-only processing does not automatically describe all app data |
| Accounts/deletion | Auth code/dependencies exist; visible provider/route evidence does not establish in-app account creation | Reachability in final release; in-app and external deletion path if account creation applies |
| Data Safety | Controlled WebView and SDK processing must be assessed; source provides leads, not final answers | Actual off-device flows; service-provider/user-directed transfer facts; applicable track exceptions; owner review of exact form |
| Ads and monetization | No reviewed wager/payment/prize flow; absence in scoped source is bounded | Final installed build and remote behavior, any SDKs/ads/affiliate flows, truthful listing and declarations |
| Audience and rating | Casino/alcohol venue discovery and mixed activity modes exist | Intended audience, countries, final IARC answers and final store presentation |
| Package/version | com.calebcalvin.pickforus, versionCode 1/versionName 1.0.0 in inspected source/artifact | Existing Console package/version history; final owner choice and uniqueness |
| Signing | Upload guard exists; historical AAB is unsigned; separate distribution signing is expected | Actual account enrollment/public certificate inventory and owner-controlled final signature verification |
| App access | Public hosted Settings is reachable; shell points to controlled hosted origin | Reviewer access to all relevant production features without inaccessible login/geo/device assumptions |
| Export | HTTPS shell plus hosted/server crypto and locked libraries identified | Product-level classification/scope, jurisdictions, destinations and any applicable authorization/reporting evidence |

Do not answer “no data collected” from the absence of a native analytics dependency: the app uses a developer-controlled WebView. Do not mark precise location inapplicable solely because high accuracy is not requested. Collection and sharing have separate definitions; qualifying service-provider or user-directed sharing exceptions do not automatically erase collection.

The current Data Safety page contains inconsistent ephemeral-processing wording between its main section and later FAQ. Preserve that ambiguity and resolve the actual form/context rather than selecting the most convenient sentence. See [Data Safety guidance](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en).
