#!/usr/bin/env python3
"""Deterministic web/launcher derivatives; no crop or alteration of approved art.

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
SOURCE = ROOT / "public/brand/pick-for-us-icon-master.jpg"
SOURCE_SHA256 = "12afcedace4aacb19109e561fc70af76076ece7d4997348021422a9396e865d5"
BACKGROUND = (41, 42, 38, 255)
DENSITIES = {"mdpi": 1, "hdpi": 1.5, "xhdpi": 2, "xxhdpi": 3, "xxxhdpi": 4}
MASKABLE_FRACTION = 0.56  # Entire square fits inside the central 80% safe circle.


def load_master():
    data = SOURCE.read_bytes()
    if len(data) != 494490 or hashlib.sha256(data).hexdigest() != SOURCE_SHA256:
        raise SystemExit("Approved icon master changed; stop for artwork review.")
    with Image.open(io.BytesIO(data)) as image:
        if (image.format, image.size, image.mode) != ("JPEG", (1536, 1536), "RGB"):
            raise SystemExit("Approved icon master properties differ; stop.")
        return image.convert("RGBA")


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
    result[ROOT / "public/favicon.png"] = padded(master, 64, 1)
    result[ROOT / "public/apple-touch-icon.png"] = result[ROOT / "android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png"]
    result[ROOT / "public/pwa-icon-512.png"] = padded(master, 512, 1)
    result[ROOT / "public/pwa-icon-maskable-512.png"] = padded(master, 512, MASKABLE_FRACTION)
    return result


def preview(master, path):
    """Mechanical size/mask review; no art edits or physical-device claims."""
    cell, height = 560, 720
    sheet = Image.new("RGB", (cell * 3, height * 3), "#eeeae5")
    draw = ImageDraw.Draw(sheet)
    items = [("Original master (uniform 512px view)", master.resize((512, 512), Image.Resampling.LANCZOS))]
    items += [(f"Favicon {size}x{size} (actual size; 8x inset)", padded(master, size, 1)) for size in (16, 32, 64)]
    items += [("Apple / Android legacy 192x192", padded(master, 192, 46 / 72)),
              ("PWA any 512x512", padded(master, 512, 1))]
    for label, fraction, kind in [("Maskable 512: central 80% safe circle", MASKABLE_FRACTION, "safe"),
                                  ("Android adaptive circle (72dp viewport)", 46 / 72, "circle"),
                                  ("Android adaptive squircle (72dp viewport)", 46 / 72, "squircle")]:
        art = padded(master, 512, fraction)
        mask = Image.new("L", (2048, 2048))
        pen = ImageDraw.Draw(mask)
        if kind == "squircle":
            points = []
            for step in range(721):
                angle = step * 2 * math.pi / 720
                x, y = math.cos(angle), math.sin(angle)
                points.append((1023.5 + 1023.5 * math.copysign(abs(x) ** 0.5, x),
                               1023.5 + 1023.5 * math.copysign(abs(y) ** 0.5, y)))
            pen.polygon(points, fill=255)
        else:
            inset = round(2048 * 0.1) if kind == "safe" else 0
            pen.ellipse((inset, inset, 2047 - inset, 2047 - inset), fill=255)
        art.putalpha(mask.resize((512, 512), Image.Resampling.LANCZOS))
        items.append((label, art))
    for index, (label, art) in enumerate(items):
        x, y = (index % 3) * cell, (index // 3) * height
        draw.text((x + 16, y + 16), label, fill="#252522")
        sheet.paste(art, (x + (cell - art.width) // 2, y + 62), art)
        if index in (1, 2, 3):
            enlarged = art.resize((art.width * 8, art.height * 8), Image.Resampling.NEAREST)
            sheet.paste(enlarged, (x + (cell - enlarged.width) // 2, y + 86 + art.height))
    path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(path, format="PNG", optimize=True)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    parser.add_argument("--preview", type=Path)
    args = parser.parse_args()
    assert 46 * math.sqrt(2) < 66
    assert round(512 * MASKABLE_FRACTION) * math.sqrt(2) < 512 * 0.8
    master = load_master()
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
        raise SystemExit("Icon resource drift: " + ", ".join(failures))
    if args.preview:
        preview(master, args.preview)
    print(f"{'Verified' if args.check else 'Generated'} 15 launcher resources and 4 web icons; approved master hash unchanged; full artwork within Android and maskable safe circles.")


if __name__ == "__main__":
    main()
