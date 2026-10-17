# Independent icon export review

Reviewed 2026-10-17 UTC. Result: **PASS — technical verification only**.

- Export: `pick-for-us-play-icon-512-srgb.png`, 512 × 512, RGBA, 8 bits/channel (32-bit), fully opaque, 408,170 bytes.
- Output SHA-256: `4463f7849a13240995bd80b80a48abfaf27bb18c5e2804cb332dc66ee45e9ff9`.
- Every PNG chunk CRC passes. All original chunks are preserved byte-for-byte in order; the sole addition is iCCP immediately after IHDR.
- Decoded pixels exactly equal the original. Decoded pixel SHA-256: `4be1ac547fd2ebf340aefb931e11f124390c7c4133a7e0577e758331e809a61c`.
- Embedded ICC exactly equals the master’s sRGB profile; ICC SHA-256: `12afb4d9953adee0607d347daee5b78b18d6b3cab2d572b88970703f5edb37bc`.
- Original PNG SHA-256: `4d71389437dc6339ed31ae413e189f5d8a6abe966296333f58c9f1facd202be9`.
- Master JPEG SHA-256: `12afcedace4aacb19109e561fc70af76076ece7d4997348021422a9396e865d5`.
- Source PNG and master both match committed bytes at `4010edf31e71a7350d891a98dd43f20535602abd`; Git working tree was clean at review.
- Viewed full-size export and a separate 64 × 64 thumbnail. Both render correctly; wording remains recognizable at thumbnail size.

No original files or export were modified during verification. Only a temporary thumbnail was created under `/tmp`.

**Publication remains HOLD** for final selection and contextual attribution review. No upload was authorized. This review provides no legal clearance.

This document records the completed independent review; no additional revalidation was performed when saving it.
