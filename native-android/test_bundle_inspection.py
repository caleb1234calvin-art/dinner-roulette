"""Negative regression checks for permissions in the compiled Android manifest."""
import importlib.util
from pathlib import Path
import unittest
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("verify_bundle", ROOT / "scripts/verify-android-bundle.py")
verifier = importlib.util.module_from_spec(spec)
spec.loader.exec_module(verifier)
RECEIVER = "com.calebcalvin.pickforus.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION"


def manifest(protection="signature", extra=None):
    root = ET.Element("manifest")
    for name in ["android.permission.INTERNET", "android.permission.ACCESS_COARSE_LOCATION",
                 "android.permission.ACCESS_FINE_LOCATION", RECEIVER] + ([extra] if extra else []):
        ET.SubElement(root, "uses-permission", {verifier.ANDROID + "name": name})
    if protection is not None:
        ET.SubElement(root, "permission", {
            verifier.ANDROID + "name": RECEIVER,
            verifier.ANDROID + "protectionLevel": protection,
        })
    return root


class BundlePermissionTests(unittest.TestCase):
    def test_accepts_androidx_signature_only_receiver_permission(self):
        self.assertIn(RECEIVER, verifier.verify_permissions(manifest()))

    def test_rejects_unexpected_background_location(self):
        with self.assertRaises(AssertionError):
            verifier.verify_permissions(manifest(extra="android.permission.ACCESS_BACKGROUND_LOCATION"))

    def test_rejects_missing_or_weakened_receiver_protection(self):
        for protection in [None, "normal", "dangerous"]:
            with self.subTest(protection=protection), self.assertRaises(AssertionError):
                verifier.verify_permissions(manifest(protection=protection))


if __name__ == "__main__":
    unittest.main()
