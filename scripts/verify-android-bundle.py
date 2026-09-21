#!/usr/bin/env python3
"""Validate a real AAB using Google's checksum-pinned bundletool and its manifest."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import subprocess
import urllib.request
import xml.etree.ElementTree as ET
import zipfile

BUNDLETOOL_VERSION = "1.18.3"
BUNDLETOOL_SHA = "a099cfa1543f55593bc2ed16a70a7c67fe54b1747bb7301f37fdfd6d91028e29"
ROOT = Path(__file__).resolve().parent.parent
ANDROID = "{http://schemas.android.com/apk/res/android}"


def run(*args):
    return subprocess.run(args, check=True, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE).stdout


def verify_permissions(manifest):
    permissions = sorted(e.attrib[ANDROID + "name"] for e in manifest.findall("uses-permission"))
    receiver = "com.calebcalvin.pickforus.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION"
    expected = {
        "android.permission.INTERNET",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        receiver,
    }
    assert set(permissions) == expected, f"Unexpected compiled permissions: {permissions}"
    declarations = [e for e in manifest.findall("permission") if e.attrib.get(ANDROID + "name") == receiver]
    assert len(declarations) == 1, "Missing or duplicate AndroidX receiver permission declaration"
    protection = declarations[0].attrib.get(ANDROID + "protectionLevel", "")
    # Compiled manifests encode PROTECTION_SIGNATURE as integer 2 (often 0x2).
    # Compare the complete value: extra protection flags are not accepted.
    try:
        protection_value = 2 if protection == "signature" else int(protection, 0)
    except ValueError:
        protection_value = None
    assert protection_value == 2, f"AndroidX receiver permission must remain signature-only, got {protection!r}"
    return permissions


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
    assert manifest.attrib["package"] == "com.calebcalvin.pickforus"
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
