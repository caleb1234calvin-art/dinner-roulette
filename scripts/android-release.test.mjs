import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { checkAndroid, parseAndroidVersion, validateNativeConfig, validateSourceIdentity } from "./check-android.mjs";

const config = JSON.parse(readFileSync(new URL("../capacitor.config.json", import.meta.url), "utf8"));

test("persistent Android identity, SDK, lockfile and approved artwork agree", () => {
  assert.equal(checkAndroid().appId, "app.pickforus.android");
});
test("native audit rejects package drift, insecure content and exposed WebView debugging", () => {
  const mutations = [
    (c) => { c.appId = "com.calebcalvin.dinnerroulette"; },
    (c) => { c.appId = "com.calebcalvin.pickforus"; },
    (c) => { c.server.url = "http://localhost:8080"; },
    (c) => { c.server.allowNavigation = ["*"]; },
    (c) => { c.android.allowMixedContent = true; },
    (c) => { c.android.webContentsDebuggingEnabled = true; },
  ];
  for (const mutate of mutations) {
    const broken = structuredClone(config); mutate(broken);
    assert.throws(() => validateNativeConfig(broken));
  }
});
test("Android version parser accepts future releases and rejects invalid Play codes", () => {
  assert.deepEqual(parseAndroidVersion("versionCode=2\nversionName=1.0.1\n"), { versionCode: 2, versionName: "1.0.1" });
  for (const code of ["0", "-1", "2.5", "NaN", "2100000001"]) {
    assert.throws(() => parseAndroidVersion(`versionCode=${code}\nversionName=1.0.0`));
  }
});
test("Android workflow is artifact-only and does not regenerate the project or migrate", () => {
  const workflow = readFileSync(new URL("../.github/workflows/android-apk.yml", import.meta.url), "utf8");
  assert.match(workflow, /contents: read/);
  assert.ok(workflow.includes("bundleRelease") && workflow.includes("assembleDebug"));
  for (const forbidden of ["gh release", "--clobber", "cap add", "db:migrate", "npm run build\n", "serviceAccountJson", "contents: write"]) {
    assert.ok(!workflow.includes(forbidden), `Unsafe Android workflow: ${forbidden}`);
  }
});
test("Settings does not advertise an Android artifact that has not been published", () => {
  const settings = readFileSync(new URL("../src/components/settings-page.tsx", import.meta.url), "utf8");
  assert.ok(!settings.includes("/downloads/PickForUs.apk"));
  assert.ok(settings.includes("The Google Play release is being prepared."));
});

test("source identity audit rejects isolated package, path, resources and manifest drift", () => {
  const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
  const path = "android/app/src/main/java/app/pickforus/android/MainActivity.java";
  const source = {
    gradle: read("android/app/build.gradle"), manifest: read("android/app/src/main/AndroidManifest.xml"),
    strings: read("android/app/src/main/res/values/strings.xml"), javaSources: { [path]: read(path) },
  };
  validateSourceIdentity(source);
  const mutations = [
    (s) => { s.gradle = s.gradle.replace('namespace = "app.pickforus.android"', 'namespace = "com.calebcalvin.pickforus"'); },
    (s) => { s.gradle = s.gradle.replace('applicationId = "app.pickforus.android"', 'applicationId = "com.calebcalvin.pickforus"'); },
    (s) => { s.javaSources[path] = s.javaSources[path].replace("package app.pickforus.android;", "package com.calebcalvin.pickforus;"); },
    (s) => { s.javaSources["android/app/src/main/java/com/calebcalvin/pickforus/MainActivity.java"] = s.javaSources[path]; delete s.javaSources[path]; },
    (s) => { s.javaSources["android/app/src/main/java/com/calebcalvin/dinnerroulette/MainActivity.java"] = s.javaSources[path]; },
    ...["package_name", "custom_url_scheme"].map((name) => (s) => { s.strings = s.strings.replace(`<string name="${name}">app.pickforus.android`, `<string name="${name}">com.calebcalvin.pickforus`); }),
    (s) => { s.manifest = s.manifest.replace('android:name=".MainActivity"', 'android:name="com.calebcalvin.pickforus.MainActivity"'); },
    (s) => { s.manifest = s.manifest.replace("${applicationId}.fileprovider", "com.calebcalvin.pickforus.fileprovider"); },
    (s) => { s.manifest = s.manifest.replace("android.intent.category.LAUNCHER", "android.intent.category.DEFAULT"); },
    (s) => { s.manifest = s.manifest.replace("android.permission.ACCESS_FINE_LOCATION", "android.permission.ACCESS_BACKGROUND_LOCATION"); },
  ];
  for (const mutate of mutations) {
    const broken = structuredClone(source); mutate(broken);
    assert.throws(() => validateSourceIdentity(broken));
  }
});
