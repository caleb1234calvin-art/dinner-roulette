"""Positive and negative compiled manifest and DEX identity regression checks."""
import hashlib
import io
import struct
import zipfile
import zlib
import importlib.util
from pathlib import Path
import unittest
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("verify_bundle", ROOT / "scripts/verify-android-bundle.py")
verifier = importlib.util.module_from_spec(spec)
spec.loader.exec_module(verifier)
RECEIVER = "app.pickforus.android.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION"


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
        for protection in ["signature", "2", "0x2", "0x00000002"]:
            with self.subTest(protection=protection):
                self.assertIn(RECEIVER, verifier.verify_permissions(manifest(protection=protection)))

    def test_rejects_unexpected_background_location(self):
        with self.assertRaises(AssertionError):
            verifier.verify_permissions(manifest(extra="android.permission.ACCESS_BACKGROUND_LOCATION"))

    def test_rejects_missing_or_weakened_receiver_protection(self):
        for protection in [None, "", "normal", "dangerous", "0", "1", "3", "0x12", "signature|privileged", "invalid"]:
            with self.subTest(protection=protection), self.assertRaises(AssertionError):
                verifier.verify_permissions(manifest(protection=protection))



def identity_manifest(startup=True):
    root = manifest()
    root.set("package", verifier.APP_ID)
    app = ET.SubElement(root, "application")
    activity = ET.SubElement(app, "activity", {
        verifier.ANDROID + "name": ".MainActivity", verifier.ANDROID + "exported": "true",
        verifier.ANDROID + "launchMode": "singleTask",
    })
    intent = ET.SubElement(activity, "intent-filter")
    ET.SubElement(intent, "action", {verifier.ANDROID + "name": "android.intent.action.MAIN"})
    ET.SubElement(intent, "category", {verifier.ANDROID + "name": "android.intent.category.LAUNCHER"})
    ET.SubElement(app, "provider", {
        verifier.ANDROID + "name": "androidx.core.content.FileProvider",
        verifier.ANDROID + "authorities": verifier.APP_ID + ".fileprovider",
        verifier.ANDROID + "exported": "false", verifier.ANDROID + "grantUriPermissions": "true",
    })
    if startup:
        ET.SubElement(app, "provider", {
            verifier.ANDROID + "name": "androidx.startup.InitializationProvider",
            verifier.ANDROID + "authorities": verifier.APP_ID + ".androidx-startup",
            verifier.ANDROID + "exported": "false",
        })
    return root


def dex_fixture(definitions, references=()):
    """Small structural DEX fixture with real class/type/string tables and digests."""
    descriptors = list(definitions) + list(references)
    count = len(descriptors)
    strings_offset = 112
    types_offset = strings_offset + count * 4
    classes_offset = types_offset + count * 4
    data = bytearray(classes_offset + len(definitions) * 32)
    data[:8] = b"dex\n035\0"
    def put(offset, value):
        struct.pack_into("<I", data, offset, value)
    put(36, 112)
    put(40, 0x12345678)
    for header, size, offset in [(56, count, strings_offset), (64, count, types_offset), (96, len(definitions), classes_offset)]:
        put(header, size)
        put(header + 4, offset if size else 0)
    for index, descriptor in enumerate(descriptors):
        put(strings_offset + index * 4, len(data))
        put(types_offset + index * 4, index)
        encoded = descriptor.encode()
        assert len(encoded) < 128
        data.extend(bytes([len(encoded)]) + encoded + b"\0")
    for index in range(len(definitions)):
        put(classes_offset + index * 32, index)
    put(32, len(data))
    return seal_dex(data)


def seal_dex(data):
    data = bytearray(data)
    data[12:32] = hashlib.sha1(data[32:]).digest()
    struct.pack_into("<I", data, 8, zlib.adler32(data[12:]) & 0xffffffff)
    return bytes(data)


class BundleIdentityTests(unittest.TestCase):
    def test_accepts_new_identity_and_optional_startup(self):
        for startup in (False, True):
            for name in (".MainActivity", "MainActivity", verifier.APP_ID + ".MainActivity"):
                root = identity_manifest(startup)
                root.find("application/activity").set(verifier.ANDROID + "name", name)
                verifier.verify_manifest_identity(root)

    def test_accepts_compiled_numeric_launch_mode(self):
        root = identity_manifest()
        root.find("application/activity").set(verifier.ANDROID + "launchMode", "2")
        verifier.verify_manifest_identity(root)

    def test_rejects_old_or_wrong_package(self):
        for package in (verifier.OLD_APP_ID, "app.pickforus.other", ""):
            root = identity_manifest()
            root.set("package", package)
            with self.subTest(package=package), self.assertRaises(AssertionError):
                verifier.verify_manifest_identity(root)

    def test_rejects_wrong_activity_provider_and_security_attributes(self):
        mutations = [
            ("application/activity", "name", verifier.OLD_APP_ID + ".MainActivity"),
            ("application/activity", "name", verifier.APP_ID + ".WrongActivity"),
            ("application/activity", "exported", "false"),
            ("application/activity", "launchMode", "standard"),
            ("application/activity/intent-filter/action", "name", "wrong.action"),
            ("application/activity/intent-filter/category", "name", "wrong.category"),
            ("application/provider", "name", "wrong.FileProvider"),
            ("application/provider", "authorities", verifier.OLD_APP_ID + ".fileprovider"),
            ("application/provider", "authorities", verifier.APP_ID + ".wrong"),
            ("application/provider", "exported", "true"),
            ("application/provider", "grantUriPermissions", "false"),
            ("application/provider[2]", "authorities", verifier.OLD_APP_ID + ".androidx-startup"),
            ("application/provider[2]", "authorities", verifier.APP_ID + ".wrong"),
            ("application/provider[2]", "exported", "true"),
        ]
        for path, attribute, value in mutations:
            root = identity_manifest()
            root.find(path).set(verifier.ANDROID + attribute, value)
            with self.subTest(path=path, attribute=attribute, value=value), self.assertRaises(AssertionError):
                verifier.verify_manifest_identity(root)

    def test_rejects_duplicate_launchers_and_providers(self):
        for path in ("activity", "provider", "provider[2]"):
            root = identity_manifest()
            app = root.find("application")
            app.append(ET.fromstring(ET.tostring(app.find(path))))
            with self.subTest(path=path), self.assertRaises(AssertionError):
                verifier.verify_manifest_identity(root)

    def test_rejects_both_legacy_identities_in_extra_components(self):
        for old in verifier.LEGACY_APP_IDS:
            for kind in ("activity", "provider"):
                root = identity_manifest()
                ET.SubElement(root.find("application"), kind, {
                    verifier.ANDROID + "name": old + ".OtherActivity" if kind == "activity" else "other.Provider",
                    verifier.ANDROID + "authorities": old + ".other",
                })
                with self.subTest(old=old, kind=kind), self.assertRaises(AssertionError):
                    verifier.verify_manifest_identity(root)

    def test_rejects_unexpected_provider_and_extra_launcher_actions(self):
        root = identity_manifest()
        ET.SubElement(root.find("application"), "provider", {
            verifier.ANDROID + "name": "other.Provider", verifier.ANDROID + "authorities": "other.provider",
        })
        with self.assertRaises(AssertionError):
            verifier.verify_manifest_identity(root)
        root = identity_manifest()
        ET.SubElement(root.find("application/activity/intent-filter"), "action", {
            verifier.ANDROID + "name": "android.intent.action.VIEW",
        })
        with self.assertRaises(AssertionError):
            verifier.verify_manifest_identity(root)

    def test_rejects_extra_duplicate_and_old_permissions(self):
        for mode in ("extra-declaration", "duplicate-use", "duplicate-declaration", "old-use", "old-declaration", "sdk-specific"):
            root = manifest()
            if mode == "extra-declaration":
                ET.SubElement(root, "permission", {verifier.ANDROID + "name": "extra.permission"})
            elif mode == "duplicate-use":
                root.append(ET.fromstring(ET.tostring(root.find("uses-permission"))))
            elif mode == "duplicate-declaration":
                root.append(ET.fromstring(ET.tostring(root.find("permission"))))
            elif mode == "old-use":
                root.findall("uses-permission")[-1].set(verifier.ANDROID + "name", verifier.OLD_APP_ID + ".DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION")
            elif mode == "old-declaration":
                root.find("permission").set(verifier.ANDROID + "name", verifier.OLD_APP_ID + ".DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION")
            else:
                ET.SubElement(root, "uses-permission-sdk-23", {verifier.ANDROID + "name": "android.permission.ACCESS_BACKGROUND_LOCATION"})
            with self.subTest(mode=mode), self.assertRaises(AssertionError):
                verifier.verify_permissions(root)


class DexIdentityTests(unittest.TestCase):
    expected = "Lapp/pickforus/android/MainActivity;"
    old = "Lcom/calebcalvin/pickforus/MainActivity;"

    def verify_bundle(self, *dex_files):
        output = io.BytesIO()
        with zipfile.ZipFile(output, "w") as bundle:
            for index, data in enumerate(dex_files):
                name = "base/dex/classes.dex" if index == 0 else "base/dex/classes%d.dex" % (index + 1)
                bundle.writestr(name, data)
        with zipfile.ZipFile(output) as bundle:
            return verifier.verify_dex_identity(bundle)

    def test_accepts_real_class_definition_in_multidex(self):
        self.assertEqual(len(self.verify_bundle(dex_fixture(["Lother/Class;"]), dex_fixture([self.expected]))), 2)

    def test_reference_is_not_a_definition(self):
        with self.assertRaises(AssertionError):
            self.verify_bundle(dex_fixture(["Lother/Class;"], [self.expected]))

    def test_rejects_missing_old_duplicate_or_wrong_class(self):
        for definitions in ([self.old], ["Lapp/pickforus/android/WrongActivity;"], [self.expected, self.old], [self.expected, self.old[:-1] + "$Inner;"]):
            with self.subTest(definitions=definitions), self.assertRaises(AssertionError):
                self.verify_bundle(dex_fixture(definitions))
        with self.assertRaises(AssertionError):
            self.verify_bundle(dex_fixture([self.expected]), dex_fixture([self.expected]))
        for old in verifier.LEGACY_APP_IDS:
            descriptor = "L" + old.replace(".", "/") + "/MainActivity;"
            with self.subTest(old=old), self.assertRaises(AssertionError):
                self.verify_bundle(dex_fixture([self.expected]), dex_fixture([descriptor]))

    def test_rejects_invalid_class_descriptor(self):
        for descriptor in ("I", "[Lsome/Class;", "Lmissing/Semicolon"):
            with self.subTest(descriptor=descriptor), self.assertRaises(AssertionError):
                verifier.dex_defined_classes(dex_fixture([descriptor]))

    def test_rejects_main_activity_only_in_dynamic_feature(self):
        output = io.BytesIO()
        with zipfile.ZipFile(output, "w") as bundle:
            bundle.writestr("base/dex/classes.dex", dex_fixture(["Lother/Class;"]))
            bundle.writestr("feature/dex/classes.dex", dex_fixture([self.expected]))
        with zipfile.ZipFile(output) as bundle, self.assertRaises(AssertionError):
            verifier.verify_dex_identity(bundle)

    def test_rejects_truncated_corrupt_or_invalid_dex(self):
        original = dex_fixture([self.expected])
        malformed = [b"", original[:80], original[:-1], original[:8] + b"bad!" + original[12:]]
        for offset, value in ((40, 0x78563412), (60, 0xffffffff), (112, 0xffffffff), (116, 0xffffffff), (120, 0xffffffff)):
            data = bytearray(original)
            struct.pack_into("<I", data, offset, value)
            malformed.append(seal_dex(data))
        for data in malformed:
            with self.subTest(data=data[:16]), self.assertRaises(AssertionError):
                verifier.dex_defined_classes(data)

if __name__ == "__main__":
    unittest.main()
