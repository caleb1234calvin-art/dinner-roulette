# Original-owner phone observation reconciliation

Read-only reconciliation, 2026-10-16 22:29 UTC. **Owner-reported partial testing with offline cold-launch/recovery ISSUE/HOLD; not overall physical acceptance.** No repository/physical-test ledger updated, no user contacted, no tests repeated, no device/settings operations performed.

## Exact file identity

Materialized Library `libfile_fc63111be5048191ae5fb172f7065176`, backing file `file_00000000980c8230a83dcefe8ebb86f9`, as `PickForUs-debug(1).apk` in this directory. Size 4,174,814 bytes; SHA256 `7953b424b7224649bb4128b05dca83f91a19ced1542621c8ed2587a6893c491f`. Independent byte comparison equals prepared PR78 debug APK exactly. Consequently the uploaded file has the already-verified package, source and certificate binding. **This does not establish which file/package/version/certificate was actually installed on the phone.**

## Direct observations and precise provenance

Each link below is to an original owner message, not an assistant summary. All times UTC on October 16, 2026.

- 22:04: owner says “I have the debug apk.” [Original](https://chatgpt.com/c/6ad113a3-0b44-83e8-b4ec-f2509b331ed0?messageId=bbb2181f-7725-40c0-af9c-3ca63bc8fdc6).
- 22:08: owner reports an installation running. Supports owner-reported install/launch only; no device-bound ID or binary readback. [Original](https://chatgpt.com/c/6ad113a3-0b44-83e8-b4ec-f2509b331ed0?messageId=bbb21bbe-66b7-4b72-8486-e30291d7dd89).
- 22:09: owner says it works/functions separately and none of prior saved information is present. Consistent with fresh app-local state, not evidence of automatic transfer. [Original](https://chatgpt.com/c/6ad113a3-0b44-83e8-b4ec-f2509b331ed0?messageId=bbb21058-949d-4bea-8207-cf07ca89fed9).
- 22:10: owner says original is still there, old app dark/new app light, neither switched. Supports reported coexistence and separate themes at that time. The antecedent of “it's still there” cannot independently prove every old favorite/history item intact because the preceding assistant text is unavailable. [Original](https://chatgpt.com/c/6ad113a3-0b44-83e8-b4ec-f2509b331ed0?messageId=bbb211b0-07eb-47bd-af62-d1a27c65ccde).
- 22:11: favorite and preference remembered “after opening.” Supports reported reopen persistence; does not specify force-stop, reboot or same-target update. [Original](https://chatgpt.com/c/6ad113a3-0b44-83e8-b4ec-f2509b331ed0?messageId=bbb21696-5641-4fa9-aa09-2272d4817ec7).
- 22:12: GPS seems working; owner tried manual location and allowing it. No explicit deny/revoke/recovery result. [Original](https://chatgpt.com/c/6ad113a3-0b44-83e8-b4ec-f2509b331ed0?messageId=bbb21d26-a783-4cf4-b096-bef514a49b82).
- 22:14: Google Maps works; DoorDash and rideshare links open generic provider screens. Owner says generic behavior is not a major issue. Do not characterize those as destination-specific deep-link PASS. [Original](https://chatgpt.com/c/6ad113a3-0b44-83e8-b4ec-f2509b331ed0?messageId=bbb21315-1061-4362-91ac-5d6e82069115).
- 22:15: Google Maps populates restaurant destination and own location. [Original](https://chatgpt.com/c/6ad113a3-0b44-83e8-b4ec-f2509b331ed0?messageId=bbb2198b-5735-4a5c-a320-59127d30ef67).
- 22:15: owner can back out and return without losing progress. Supports reported external-app return/state retention. [Original](https://chatgpt.com/c/6ad113a3-0b44-83e8-b4ec-f2509b331ed0?messageId=bbb2163a-d898-45c6-8518-7ac4240e5657).
- 22:24: while already open, loaded restaurants and burger/breakfast modifications remain usable after connection loss; icons/logos fail to load. Offline cold-open stays black with nothing loading. Owner says clearing data/cache did not fix it, restarting phone did; also reports inability to send ChatGPT messages after losing/reconnecting. **Owner-reported offline cold-start/recovery problem, cause undetermined.** Data/cache clearing is a reported action, not an authorized or recommended remediation here; exact app/data affected and later saved-data preservation are unknown. [Original](https://chatgpt.com/c/6ad113a3-0b44-83e8-b4ec-f2509b331ed0?messageId=bbb21f07-eabc-4e69-b43d-5150f298f8d9).
- 22:27: clarifies ChatGPT application could show loaded past conversations and accept typing but lacked the send arrow. Does not establish network health or a common cause. [Original](https://chatgpt.com/c/6ad113a3-0b44-83e8-b4ec-f2509b331ed0?messageId=bbb21cac-f676-4421-8c83-29ef442eab0e).
- 22:28: Pick For Us loaded in Chrome after reconnect. Supports that browser observation only; does not demonstrate native app reconnect recovery. [Original](https://chatgpt.com/c/6ad113a3-0b44-83e8-b4ec-f2509b331ed0?messageId=bbb21251-9cd9-4264-8f10-508cd800aedc).

## Unknowns and ledger implications

No phone model, Android version, WebView version, installed package/version/signing certificate, install-source verification or on-device hash is given in accessible original text. Some attachment content and all intervening assistant text are unavailable; do not infer their contents. Earlier owner messages paste assistant summaries and hashes, which are context rather than new physical evidence. The uploaded APK identity is verified independently as above.

Replace blanket “all NOT RUN” only with bounded **OWNER-REPORTED** observations for the steps actually described, preserving missing device/binary binding. Offline cold-start/recovery is **ISSUE/HOLD**, not PASS. Warm cached interaction is partial offline functionality, not complete offline support. Original-data preservation was reported before later clearing activity; present state is not established.

No supported results found for denied/revoked permission recovery, same-target update continuity, rotation, accessibility, comprehensive discovery, reboot persistence, ident behavior, full old history/favorites audit, or tablet testing. SM-T220 remains deferred. Unpublished PR77 support/legal features are outside this evidence. No causality assignment to hardware, software, Android WebView or network is justified. Do not recommend further data clearing or reinstall as part of reconciliation.

`owner-observations.json` preserves exact retrieved owner messages, timestamps, content-omission flags and source links for review; nothing was taken from assistant summaries as a physical PASS.
