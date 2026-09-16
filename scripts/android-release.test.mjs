import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { checkAndroid, parseAndroidVersion, validateNativeConfig } from "./check-android.mjs";

const config = JSON.parse(readFileSync(new URL("../capacitor.config.json", import.meta.url), "utf8"));

test("persistent Android identity, SDK, lockfile and approved artwork agree", () => {
  assert.equal(checkAndroid().appId, "com.calebcalvin.pickforus");
});
test("native audit rejects package drift, insecure content and exposed WebView debugging", () => {
  const mutations = [
    (c) => { c.appId = "com.calebcalvin.dinnerroulette"; },
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
