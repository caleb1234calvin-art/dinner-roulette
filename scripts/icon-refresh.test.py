"""Pixel and geometry checks for the approved mechanical icon derivatives."""
import hashlib
import importlib.util
import io
import math
import unittest
from pathlib import Path

from PIL import Image

spec = importlib.util.spec_from_file_location("icons", Path(__file__).with_name("android-icons.py"))
icons = importlib.util.module_from_spec(spec)
spec.loader.exec_module(icons)


class IconRefreshTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.master = icons.load_master()
        cls.outputs = icons.outputs(cls.master)

    def test_exact_source(self):
        data = icons.SOURCE.read_bytes()
        self.assertEqual(len(data), 494490)
        self.assertEqual(hashlib.sha256(data).hexdigest(),
                         "12afcedace4aacb19109e561fc70af76076ece7d4997348021422a9396e865d5")
        with Image.open(io.BytesIO(data)) as image:
            self.assertEqual((image.format, image.size, image.mode), ("JPEG", (1536, 1536), "RGB"))

    def test_committed_derivative_bytes_and_dimensions(self):
        self.assertEqual(len(self.outputs), 19)
        for path, image in self.outputs.items():
            with self.subTest(path=path):
                buffer = io.BytesIO()
                image.save(buffer, format="PNG", optimize=True)
                self.assertEqual(path.read_bytes(), buffer.getvalue())
                with Image.open(path) as committed:
                    self.assertEqual((committed.format, committed.size), ("PNG", image.size))
        for name, size in [("favicon.png", 64), ("apple-touch-icon.png", 192),
                           ("pwa-icon-512.png", 512), ("pwa-icon-maskable-512.png", 512)]:
            self.assertEqual(self.outputs[icons.ROOT / "public" / name].size, (size, size))

    def test_web_any_preserves_entire_uniformly_resized_master(self):
        for name, size in [("favicon.png", 64), ("pwa-icon-512.png", 512)]:
            self.assertEqual(self.outputs[icons.ROOT / "public" / name].tobytes(),
                             self.master.resize((size, size), Image.Resampling.LANCZOS).tobytes())

    def test_maskable_full_art_and_neutral_padding_inside_safe_circle(self):
        image = self.outputs[icons.ROOT / "public/pwa-icon-maskable-512.png"]
        side, offset = 287, 112
        expected_art = self.master.resize((side, side), Image.Resampling.LANCZOS)
        self.assertEqual(image.crop((offset, offset, offset + side, offset + side)).tobytes(), expected_art.tobytes())
        self.assertLess(math.hypot(offset - 256, offset - 256), 512 * 0.4)
        for x in range(512):
            for y in range(512):
                if not (offset <= x < offset + side and offset <= y < offset + side):
                    self.assertEqual(image.getpixel((x, y)), icons.BACKGROUND)

    def test_apple_matches_android_and_round_masks_preserve_all_art(self):
        public = icons.ROOT / "public/apple-touch-icon.png"
        android = icons.ROOT / "android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png"
        self.assertEqual(public.read_bytes(), android.read_bytes())
        for density, scale in icons.DENSITIES.items():
            folder = icons.ROOT / f"android/app/src/main/res/mipmap-{density}"
            size = round(48 * scale)
            side = round(size * 46 / 72)
            offset = (size - side) // 2
            region = (offset, offset, offset + side, offset + side)
            square = self.outputs[folder / "ic_launcher.png"]
            rounded = self.outputs[folder / "ic_launcher_round.png"]
            self.assertEqual(square.crop(region).convert("RGB").tobytes(),
                             rounded.crop(region).convert("RGB").tobytes())
            # Lanczos mask resampling can ring by one alpha level within the
            # safe square. No RGB content is removed or made transparent.
            self.assertGreaterEqual(rounded.crop(region).getchannel("A").getextrema()[0], 254)
            foreground = self.outputs[folder / "ic_launcher_foreground.png"]
            self.assertEqual(foreground.size, (round(108 * scale),) * 2)
            self.assertEqual(foreground.getpixel((0, 0)), (0, 0, 0, 0))
        self.assertLess(46 * math.sqrt(2), 66)


if __name__ == "__main__":
    unittest.main()
