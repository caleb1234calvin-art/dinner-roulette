#!/usr/bin/env python3
"""Deterministic launcher derivatives; no cropping or alteration of approved art.

The entire square master fits inside Android's central 66dp safe circle:
46dp * sqrt(2) < 66dp. The foreground layer is 108dp; the nominal mask is 72dp.
Only uniform resizing and neutral padding are used. Pillow version is pinned in CI.
"""
import argparse
import hashlib
import io
import math
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "public/brand/grok_1789541884918.jpg"
SOURCE_SHA256 = "5d823a5c4ef6cc0a76ffc8926f83f0eaae85cb8b59cdcd280d9b8d148f99500a"
BACKGROUND = (41, 42, 38, 255)
DENSITIES = {"mdpi": 1, "hdpi": 1.5, "xhdpi": 2, "xxhdpi": 3, "xxxhdpi": 4}


def padded(master, size, fraction, transparent=False):
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0) if transparent else BACKGROUND)
    side = round(size * fraction)
    art = master.resize((side, side), Image.Resampling.LANCZOS)
    offset = (size - side) // 2
    canvas.paste(art, (offset, offset))
    return canvas


def outputs(master):
    result = {}
    for density, scale in DENSITIES.items():
        folder = ROOT / f"android/app/src/main/res/mipmap-{density}"
        size = round(48 * scale)
        launcher = padded(master, size, 46 / 72)
        result[folder / "ic_launcher.png"] = launcher
        # Pre-adaptive round resource; artwork remains fully inside the circle.
        mask = Image.new("L", (size * 4, size * 4))
        ImageDraw.Draw(mask).ellipse((0, 0, size * 4 - 1, size * 4 - 1), fill=255)
        rounded = launcher.copy()
        rounded.putalpha(mask.resize((size, size), Image.Resampling.LANCZOS))
        result[folder / "ic_launcher_round.png"] = rounded
        result[folder / "ic_launcher_foreground.png"] = padded(master, round(108 * scale), 46 / 108, True)
    return result


def preview(master, path):
    """Illustrative static mask proof, not a physical-device launcher test."""
    size = 288
    sheet = Image.new("RGB", (size * 4, size + 58), "#eeeae5")
    draw = ImageDraw.Draw(sheet)
    for index, kind in enumerate(("Legacy square", "Adaptive circle", "Adaptive squircle", "66dp safe circle")):
        art = padded(master, size, 46 / 72)
        mask = Image.new("L", (size, size))
        pen = ImageDraw.Draw(mask)
        if kind == "Legacy square":
            pen.rectangle((0, 0, size - 1, size - 1), fill=255)
        elif kind == "Adaptive squircle":
            pen.rounded_rectangle((0, 0, size - 1, size - 1), radius=size // 4, fill=255)
        else:
            inset = 0 if kind == "Adaptive circle" else round(size * 3 / 72)
            pen.ellipse((inset, inset, size - inset - 1, size - inset - 1), fill=255)
        sheet.paste(art.convert("RGB"), (index * size, 0), mask)
        draw.text((index * size + 12, size + 16), kind, fill="#252522")
    path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(path)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    parser.add_argument("--preview", type=Path)
    args = parser.parse_args()
    if hashlib.sha256(SOURCE.read_bytes()).hexdigest() != SOURCE_SHA256:
        raise SystemExit("Approved icon master changed; stop for artwork review.")
    assert 46 * math.sqrt(2) < 66
    master = Image.open(SOURCE).convert("RGBA")
    failures = []
    for path, image in outputs(master).items():
        buffer = io.BytesIO()
        image.save(buffer, format="PNG", optimize=True)
        expected = buffer.getvalue()
        if args.check:
            if not path.exists() or path.read_bytes() != expected:
                failures.append(str(path.relative_to(ROOT)))
        else:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(expected)
    if failures:
        raise SystemExit("Launcher resource drift: " + ", ".join(failures))
    if args.preview:
        preview(master, args.preview)
    print(f"{'Verified' if args.check else 'Generated'} 15 launcher resources; approved master hash unchanged; full artwork within 66dp safe circle.")


if __name__ == "__main__":
    main()
