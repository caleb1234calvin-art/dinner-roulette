#!/usr/bin/env python3
"""Deterministic social card from the complete approved clay master.

Reproduce with native-android/requirements.txt (Pillow 12.3.0). No remote
fonts, generated imagery, crops, masks, retouching or changes to the master.
The base og.jpg has no reusable typography and x-banner.jpg does not exist.
Use Pillow's embedded font for the required identity/domain on neutral black.
"""
import argparse
import hashlib
import io
from pathlib import Path

import PIL
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "public/brand/pick-for-us-icon-master.jpg"
SOURCE_SHA256 = "12afcedace4aacb19109e561fc70af76076ece7d4997348021422a9396e865d5"
TARGET = ROOT / "public/og.jpg"
CARD_SIZE = (1200, 630)
ART_SIZE = (520, 520)
ART_POSITION = (55, 55)
MAX_BYTES = 600 * 1024


def render():
    if PIL.__version__ != "12.3.0":
        raise SystemExit("Use Pillow 12.3.0 from native-android/requirements.txt.")
    source = SOURCE.read_bytes()
    if len(source) != 494490 or hashlib.sha256(source).hexdigest() != SOURCE_SHA256:
        raise SystemExit("Approved clay master identity changed; stop.")
    with Image.open(io.BytesIO(source)) as master:
        if (master.format, master.size, master.mode) != ("JPEG", (1536, 1536), "RGB"):
            raise SystemExit("Approved clay master properties changed; stop.")
        # Uniform full-square resize; every part of the approved composition
        # remains inside the card. No old food-card pixels are used.
        art = master.resize(ART_SIZE, Image.Resampling.LANCZOS)
    card = Image.new("RGB", CARD_SIZE, (0, 0, 0))
    card.paste(art, ART_POSITION)
    draw = ImageDraw.Draw(card)
    draw.text((635, 255), "Pick For Us", font=ImageFont.load_default(size=76),
              fill=(255, 255, 255), anchor="lt")
    draw.text((638, 353), "pickforus.app", font=ImageFont.load_default(size=34),
              fill=(255, 255, 255), anchor="lt")
    output = io.BytesIO()
    card.save(output, format="JPEG", quality=92, subsampling=0,
              optimize=True, progressive=False)
    data = output.getvalue()
    if len(data) >= MAX_BYTES:
        raise SystemExit("Social card exceeds the <600 KiB budget.")
    return data


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    expected = render()
    if args.check:
        if TARGET.read_bytes() != expected:
            raise SystemExit("Social card bytes drifted; reproduce the approved composite.")
    else:
        TARGET.write_bytes(expected)
    print(f"{'Verified' if args.check else 'Wrote'} public/og.jpg: "
          f"1200x630 JPEG, {len(expected)} bytes, "
          f"SHA-256 {hashlib.sha256(expected).hexdigest()}; full clay master unchanged.")


if __name__ == "__main__":
    main()
