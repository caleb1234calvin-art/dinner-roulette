# Original-owner retest addendum

Appended evidence, 2026-10-16 23:28 UTC. Read-only reconciliation; the original 22:24 black-screen failure and prior receipt remain intact. **Later owner-reported offline fallback and retry recovery succeeded; the original failure was not reproduced in these later attempts. Cause remains unknown. This is not overall physical acceptance or proof of a permanent fix.**

## Original owner statements

- **22:38**: “Turning on my VPN worked, and I can turn off my VPN, and the app still works.” Establishes reported VPN-cycle sequence and continued app operation after turning it off at that point. [Owner message](https://chatgpt.com/c/6ad113a3-0b44-83e8-b4ec-f2509b331ed0?messageId=bbb212a4-6c5a-4b3a-b9ed-980bb4bb2d17).
- **22:40**: after one VPN use, disabling connection and entering the app shows cannot-connect instead of black; reconnecting and returning to the app works without needing VPN. Owner speculates about a permanent fix, which is not adopted as a finding. [Owner message](https://chatgpt.com/c/6ad113a3-0b44-83e8-b4ec-f2509b331ed0?messageId=bbb219da-57be-4db4-8989-519279929604).
- **22:42**: owner reports YouTube and chat also working. This is temporal co-recovery, not evidence that VPN, DNS, hardware, WebView or the app caused or fixed the issue. [Owner message](https://chatgpt.com/c/6ad113a3-0b44-83e8-b4ec-f2509b331ed0?messageId=bbb21ce5-6c0d-4d88-99f3-89582ec88abd).
- **22:46**: “I just turned off connection and click on the app. And I literally do not get the black screen anymore. I get that immediate pick for us has failed the load screen”. Supports later offline-open fallback appearance. [Owner message](https://chatgpt.com/c/6ad113a3-0b44-83e8-b4ec-f2509b331ed0?messageId=bbb21447-7bcf-442e-bd57-9094ab32552f).
- **22:47**: owner intends a full device restart and reattempt. This message alone is intent, not completed execution. [Owner message](https://chatgpt.com/c/6ad113a3-0b44-83e8-b4ec-f2509b331ed0?messageId=bbb217cf-1992-4be8-a882-872134bb61a1).
- **22:51:03**: “I honest-to-God cannot repeat the failure.” Supports unreproduced status in their later attempts, not impossibility of recurrence. [Owner message](https://chatgpt.com/c/6ad113a3-0b44-83e8-b4ec-f2509b331ed0?messageId=bbb21a5b-abf4-4846-a404-9ec06c6fdb4e).
- **22:51:45**: “Yeah, it survived the full phone restart. As a matter of fact, when it goes to that screen that says, try again, if I reconnect on that same screen and hit try again it loads immediately.” Direct support for owner-reported post-restart behavior and same-screen retry recovery. The reader flags content_omitted=true for this message; the quoted text is visible, but no unseen content or attachment is inferred. [Owner message](https://chatgpt.com/c/6ad113a3-0b44-83e8-b4ec-f2509b331ed0?messageId=bbb215dd-4880-4017-813c-fb94b1ae4c30).
- **22:54**: owner plans to try the failure attempt on the tablet at home. This is a future intention; tablet test remains NOT RUN/unconfirmed. [Owner message](https://chatgpt.com/c/6ad113a3-0b44-83e8-b4ec-f2509b331ed0?messageId=bbb2195d-a89b-4170-b3bc-a0f46064d57b).

## Screenshot evidence

Materialized and visually inspected Library `libfile_f6c0639383688191a7ad73d276528e46`, backing file `file_00000000ddd48230838e29795bb0926c`, filename `13673.jpg` (53,159 bytes), saved as `retest/13673.jpg`. It visibly shows Pick For Us, “We couldn't connect. Check your internet connection, then try again.” and the Try again control. It supports the appearance of the fallback screen only. It does not prove a successful recovery, exact timing, offline network state, phone model, installed package or VPN state.

## Bounded status update

The historical offline cold-open/recovery **OWNER-REPORTED ISSUE/HOLD** remains recorded. Append **OWNER-REPORTED later fallback/retry recovery success; original failure unreproduced in later attempts, cause unknown**. Do not erase the original failure or promote this to permanent resolution, broad offline support, controlled device-certified PASS, or release readiness.

The owner explicitly reported VPN-off continued operation at 22:38 and no VPN needed at 22:40. They did **not explicitly reconfirm VPN disconnected during the post-reboot trial** in the accessible original text. That exact trial condition remains unverified; do not copy it from the assistant summary.

Uploaded APK verification remains the earlier exact-file evidence, without repeating hashing. Installed device identity/package/version/certificate, model/Android/WebView versions, and post-data-clear preservation remain unknown. No source edits, device/network/settings actions, new user prompts or repeat device tests occurred during this reconciliation.

`retest-owner-observations.json` preserves the visible original statements, timestamps, URLs and omission flags. Assistant summaries were not used as execution evidence.
