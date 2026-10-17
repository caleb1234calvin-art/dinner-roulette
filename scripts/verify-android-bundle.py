#!/usr/bin/env python3
"""Validate a real AAB using Google's checksum-pinned bundletool and its manifest."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import subprocess
import struct
import zlib
import urllib.request
import xml.etree.ElementTree as ET
import zipfile

BUNDLETOOL_VERSION = "1.18.3"
BUNDLETOOL_SHA = "a099cfa1543f55593bc2ed16a70a7c67fe54b1747bb7301f37fdfd6d91028e29"
ROOT = Path(__file__).resolve().parent.parent
ANDROID = "{http://schemas.android.com/apk/res/android}"
APP_ID = "app.pickforus.android"
OLD_APP_ID = "com.calebcalvin.pickforus"
LEGACY_APP_IDS = (OLD_APP_ID, "com.calebcalvin.dinnerroulette")


def run(*args):
    return subprocess.run(args, check=True, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE).stdout


def verify_permissions(manifest):
    assert not manifest.findall("uses-permission-sdk-23"), "Unexpected SDK-specific permissions"
    permissions = sorted(e.attrib[ANDROID + "name"] for e in manifest.findall("uses-permission"))
    receiver = "app.pickforus.android.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION"
    expected = {
        "android.permission.INTERNET",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        receiver,
    }
    assert len(permissions) == len(expected) and set(permissions) == expected, f"Unexpected compiled permissions: {permissions}"
    declarations = manifest.findall("permission")
    assert len(declarations) == 1 and declarations[0].attrib.get(ANDROID + "name") == receiver, "Missing or duplicate AndroidX receiver permission declaration"
    protection = declarations[0].attrib.get(ANDROID + "protectionLevel", "")
    # Compiled manifests encode PROTECTION_SIGNATURE as integer 2 (often 0x2).
    # Compare the complete value: extra protection flags are not accepted.
    try:
        protection_value = 2 if protection == "signature" else int(protection, 0)
    except ValueError:
        protection_value = None
    assert protection_value == 2, f"AndroidX receiver permission must remain signature-only, got {protection!r}"
    return permissions


def class_name(name, package=APP_ID):
    if name.startswith("."):
        return package + name
    return name if "." in name else package + "." + name


def verify_manifest_identity(manifest):
    assert manifest.attrib.get("package") == APP_ID, "Unexpected compiled package"
    applications = manifest.findall("application")
    assert len(applications) == 1, "Expected exactly one application"
    application = applications[0]
    activities = application.findall("activity")
    main = [e for e in activities if class_name(e.attrib.get(ANDROID + "name", "")) == APP_ID + ".MainActivity"]
    assert len(main) == 1, "Missing or duplicate MainActivity"
    assert main[0].attrib.get(ANDROID + "exported") == "true", "MainActivity must be exported"
    assert main[0].attrib.get(ANDROID + "launchMode") in {"singleTask", "2", "0x2", "0x00000002"}, "Unexpected MainActivity launch mode"
    launchers = []
    for component in activities + application.findall("activity-alias"):
        assert not any(class_name(component.attrib.get(ANDROID + "name", "")).startswith(old + ".") for old in LEGACY_APP_IDS), "Stale activity identity"
        for intent in component.findall("intent-filter"):
            actions = {e.attrib.get(ANDROID + "name") for e in intent.findall("action")}
            categories = {e.attrib.get(ANDROID + "name") for e in intent.findall("category")}
            if "android.intent.category.LAUNCHER" in categories:
                assert actions == {"android.intent.action.MAIN"} and categories == {"android.intent.category.LAUNCHER"}, "Unexpected launcher intent filter"
                launchers.append(component)
    assert launchers == main, "Expected MainActivity as the only launcher"
    providers = application.findall("provider")
    files = [e for e in providers if e.attrib.get(ANDROID + "name") == "androidx.core.content.FileProvider"]
    assert len(files) == 1, "Missing or duplicate FileProvider"
    assert files[0].attrib.get(ANDROID + "authorities") == APP_ID + ".fileprovider", "Unexpected FileProvider authority"
    assert files[0].attrib.get(ANDROID + "exported") == "false", "FileProvider must not be exported"
    assert files[0].attrib.get(ANDROID + "grantUriPermissions") == "true", "FileProvider must grant URI permissions"
    startup = [e for e in providers if e.attrib.get(ANDROID + "name") == "androidx.startup.InitializationProvider"]
    assert len(startup) <= 1, "Duplicate AndroidX startup provider"
    if startup:
        assert startup[0].attrib.get(ANDROID + "authorities") == APP_ID + ".androidx-startup", "Unexpected AndroidX startup authority"
        assert startup[0].attrib.get(ANDROID + "exported") == "false", "AndroidX startup provider must not be exported"
    assert len(providers) == len(files) + len(startup), "Unexpected compiled provider"
    authorities = [e.attrib.get(ANDROID + "authorities", "") for e in providers]
    assert len(authorities) == len(set(authorities)), "Duplicate provider authority"
    assert not any(old in authority for authority in authorities for old in LEGACY_APP_IDS), "Stale provider authority"


def dex_defined_classes(data):
    """Read class_defs -> type_ids -> string_ids, never mistake references for definitions.

    Standard little-endian DEX versions emitted by the pinned Android toolchain
    are supported. Unknown/container formats fail closed for explicit review.
    bundletool validates the surrounding bundle; bounds and DEX digests are
    checked here before following any offsets.
    """
    assert len(data) >= 112, "Truncated DEX header"
    assert data[:8] in [b"dex\n" + version + b"\0" for version in (b"035", b"037", b"038", b"039", b"040")], "Unsupported DEX format"
    def uint(offset):
        assert 0 <= offset <= len(data) - 4, "DEX integer out of bounds"
        return struct.unpack_from("<I", data, offset)[0]
    assert uint(32) == len(data) and uint(36) == 112 and uint(40) == 0x12345678, "Invalid DEX header"
    assert uint(8) == zlib.adler32(data[12:]) & 0xffffffff, "DEX checksum mismatch"
    assert data[12:32] == hashlib.sha1(data[32:]).digest(), "DEX signature mismatch"
    def table(header_offset, width):
        count, offset = uint(header_offset), uint(header_offset + 4)
        assert (count == 0 and offset == 0) or (offset >= 112 and offset % 4 == 0 and count <= (len(data) - offset) // width), "DEX table out of bounds"
        return count, offset
    strings_count, strings_offset = table(56, 4)
    types_count, types_offset = table(64, 4)
    classes_count, classes_offset = table(96, 32)
    def string(index):
        assert index < strings_count, "Invalid DEX string index"
        offset = uint(strings_offset + index * 4)
        assert 112 <= offset < len(data), "Invalid DEX string offset"
        length = 0
        for shift in range(0, 35, 7):
            assert offset < len(data), "Truncated DEX string length"
            byte = data[offset]
            offset += 1
            length |= (byte & 127) << shift
            if not byte & 128:
                break
        else:
            raise AssertionError("Invalid DEX string length")
        end = data.find(b"\0", offset)
        assert end >= offset, "Unterminated DEX string"
        try:
            value = data[offset:end].replace(b"\xc0\x80", b"\0").decode("utf-8", errors="surrogatepass")
        except UnicodeDecodeError as error:
            raise AssertionError("Invalid DEX string encoding") from error
        assert len(value.encode("utf-16-le", errors="surrogatepass")) // 2 == length, "Invalid DEX string length"
        return value
    classes = []
    for index in range(classes_count):
        type_index = uint(classes_offset + index * 32)
        assert type_index < types_count, "Invalid DEX class type index"
        descriptor = string(uint(types_offset + type_index * 4))
        assert descriptor.startswith("L") and descriptor.endswith(";"), "Invalid DEX class descriptor"
        classes.append(descriptor)
    assert len(classes) == len(set(classes)), "Duplicate DEX class definitions"
    return classes


def verify_dex_identity(bundle):
    dex_names = [name for name in bundle.namelist() if "/dex/" in name and name.endswith(".dex")]
    assert "base/dex/classes.dex" in dex_names, "Missing base DEX"
    assert len(dex_names) == len(set(dex_names)), "Duplicate DEX archive entries"
    definitions = {name: dex_defined_classes(bundle.read(name)) for name in dex_names}
    classes = [descriptor for values in definitions.values() for descriptor in values]
    expected = "L" + APP_ID.replace(".", "/") + "/MainActivity;"
    stale = ["L" + old.replace(".", "/") + "/MainActivity" for old in LEGACY_APP_IDS]
    assert any(expected in values for name, values in definitions.items() if name.startswith("base/dex/")), "MainActivity must be defined in the base module"
    assert classes.count(expected) == 1, "Expected exactly one compiled MainActivity definition"
    assert not any(c == old + ";" or c.startswith(old + "$") for c in classes for old in stale), "Stale MainActivity DEX definition"
    return dex_names


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("bundle", type=Path)
    parser.add_argument("--expect", choices=["unsigned", "signed"], required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    cache = ROOT / "artifacts" / "tools"
    cache.mkdir(parents=True, exist_ok=True)
    jar = Path(os.environ.get("BUNDLETOOL_JAR", cache / f"bundletool-{BUNDLETOOL_VERSION}.jar"))
    if not jar.exists():
        url = f"https://github.com/google/bundletool/releases/download/{BUNDLETOOL_VERSION}/bundletool-all-{BUNDLETOOL_VERSION}.jar"
        with urllib.request.urlopen(url, timeout=60) as response:
            jar.write_bytes(response.read())
    if hashlib.sha256(jar.read_bytes()).hexdigest() != BUNDLETOOL_SHA:
        raise SystemExit("bundletool checksum mismatch")
    java = str(Path(os.environ["JAVA_HOME"]) / "bin/java") if "JAVA_HOME" in os.environ else "java"
    run(java, "-jar", str(jar), "validate", f"--bundle={args.bundle}")
    manifest_text = run(java, "-jar", str(jar), "dump", "manifest", f"--bundle={args.bundle}", "--module=base")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.with_suffix(".manifest.xml").write_text(manifest_text)
    manifest = ET.fromstring(manifest_text)
    print("Compiled manifest attributes:", json.dumps(manifest.attrib, sort_keys=True))
    sdk = manifest.find("uses-sdk")
    application = manifest.find("application")
    version = dict(line.split("=", 1) for line in (ROOT / "android/version.properties").read_text().splitlines() if line and not line.startswith("#"))
    verify_manifest_identity(manifest)
    assert manifest.attrib[ANDROID + "versionCode"] == version["versionCode"]
    assert manifest.attrib[ANDROID + "versionName"] == version["versionName"]
    assert sdk.attrib[ANDROID + "minSdkVersion"] == "24"
    assert sdk.attrib[ANDROID + "targetSdkVersion"] == "36"
    compile_sdk = manifest.attrib.get(ANDROID + "compileSdkVersion", manifest.attrib.get("platformBuildVersionCode"))
    assert compile_sdk == "36", f"Unexpected compiled SDK: {compile_sdk}"
    label_dump = run(java, "-jar", str(jar), "dump", "resources", f"--bundle={args.bundle}", "--resource=string/app_name", "--values")
    print("Compiled app label:", label_dump)
    assert "Pick For Us" in label_dump and "string/app_name" in label_dump
    assert application.attrib.get(ANDROID + "debuggable", "false") == "false"
    assert application.attrib.get(ANDROID + "usesCleartextTraffic") == "false"
    assert application.attrib.get(ANDROID + "allowBackup") == "false"
    print("Compiled permission declarations:", json.dumps([e.attrib for e in manifest.findall("permission")], sort_keys=True))
    permissions = verify_permissions(manifest)
    print("Compiled permissions:", json.dumps(permissions))
    with zipfile.ZipFile(args.bundle) as bundle:
        names = bundle.namelist()
        assert bundle.testzip() is None
        assert "BundleConfig.pb" in names and "base/dex/classes.dex" in names
        dex_files = verify_dex_identity(bundle)
        config = json.loads(bundle.read("base/assets/capacitor.config.json"))
        assert config == json.loads((ROOT / "capacitor.config.json").read_text())
        native_libraries = [name for name in names if name.endswith(".so")]
        assert not native_libraries, "New native libraries require a fresh ABI/16KB alignment audit"
        signed = any(name.startswith("META-INF/") and name.endswith((".RSA", ".DSA", ".EC")) for name in names)
        assert signed == (args.expect == "signed"), "Bundle signing state does not match the requested artifact type"
        launcher_images = sorted(name for name in names if name.startswith("base/res/mipmap-") and Path(name).name in {"ic_launcher.png", "ic_launcher_round.png", "ic_launcher_foreground.png"})
        assert len(launcher_images) == 15, f"Expected 15 density-specific launcher images, got {launcher_images}"
        adaptive_icons = sorted(name for name in names if name.startswith("base/res/mipmap-anydpi-v26/") and Path(name).name in {"ic_launcher.xml", "ic_launcher_round.xml"})
        assert len(adaptive_icons) == 2, f"Missing adaptive launcher resources: {adaptive_icons}"
        assert bundle.read("base/assets/public/index.html") == (ROOT / "native-web/index.html").read_bytes()
    if signed:
        jarsigner = str(Path(os.environ["JAVA_HOME"]) / "bin/jarsigner") if "JAVA_HOME" in os.environ else "jarsigner"
        result = run(jarsigner, "-J-Duser.language=en", "-verify", str(args.bundle))
        assert "jar verified." in result, "Upload signature verification did not succeed"
    report = {
        "artifact": args.bundle.name, "sha256": hashlib.sha256(args.bundle.read_bytes()).hexdigest(),
        "bytes": args.bundle.stat().st_size, "package": manifest.attrib["package"],
        "versionCode": int(version["versionCode"]), "versionName": version["versionName"],
        "minSdk": 24, "compileSdk": int(compile_sdk), "targetSdk": 36, "debuggable": False,
        "appLabel": "Pick For Us", "allowBackup": False, "cleartextTraffic": False,
        "launcherImages": launcher_images, "adaptiveIcons": adaptive_icons,
        "dexFiles": dex_files, "mainActivity": APP_ID + ".MainActivity",
        "bundletool": BUNDLETOOL_VERSION, "bundletoolValidation": "PASS",
        "signing": args.expect, "permissions": permissions, "nativeLibraries": native_libraries,
        "pageSizeAssessment": "No packaged native .so libraries; no ELF alignment requirement applies",
        "runtime": "Remote HTTPS app; not a snapshot of branch web content",
        "uploadSignatureVerified": signed, "playConsoleAcceptance": "NOT VERIFIED",
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
