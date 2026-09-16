import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
export const APP_ID = "com.calebcalvin.pickforus";
export const APP_NAME = "Pick For Us";
const read = (path) => readFileSync(resolve(root, path), "utf8");

export function validateNativeConfig(config) {
  assert.equal(config.appId, APP_ID, "The permanent Android identity must not drift");
  assert.equal(config.appName, APP_NAME);
  assert.equal(config.webDir, "native-web");
  assert.equal(config.server?.url, "https://dinner-roulette-chi.vercel.app");
  assert.equal(config.server?.cleartext, false);
  assert.equal(config.server?.errorPath, "index.html");
  assert.ok(!config.server?.allowNavigation?.length, "Do not bridge arbitrary remote sites");
  assert.equal(config.android?.allowMixedContent, false);
  assert.equal(config.android?.webContentsDebuggingEnabled, false);
  assert.equal(config.plugins?.SystemBars?.insetsHandling, "native");
}

export function parseAndroidVersion(text) {
  const values = Object.fromEntries(text.split(/\r?\n/).filter((line) => line && !line.startsWith("#")).map((line) => line.split("=")));
  const code = Number(values.versionCode);
  assert.ok(Number.isInteger(code) && code >= 1 && code <= 2100000000, "Invalid Play versionCode");
  assert.match(values.versionName ?? "", /^\d+\.\d+\.\d+$/);
  return { versionCode: code, versionName: values.versionName };
}

export function checkAndroid() {
  validateNativeConfig(JSON.parse(read("capacitor.config.json")));
  const manifest = read("android/app/src/main/AndroidManifest.xml");
  assert.match(manifest, /android:usesCleartextTraffic="false"/);
  for (const permission of ["INTERNET", "ACCESS_COARSE_LOCATION", "ACCESS_FINE_LOCATION"]) {
    assert.ok(manifest.includes(`android.permission.${permission}`));
  }
  assert.ok(!manifest.includes("ACCESS_BACKGROUND_LOCATION"));
  assert.match(manifest, /android:exported="true"/);
  const app = read("android/app/build.gradle");
  assert.ok(app.includes(`namespace = "${APP_ID}"`) && app.includes(`applicationId = "${APP_ID}"`));
  assert.match(app, /debuggable = false/);
  assert.ok(!app.includes("signingConfigs.debug"), "A release must never use the debug key");
  const vars = read("android/variables.gradle");
  for (const [key, value] of Object.entries({ minSdkVersion: 24, compileSdkVersion: 36, targetSdkVersion: 36 })) {
    assert.match(vars, new RegExp(`${key} = ${value}\\b`));
  }
  const pkg = JSON.parse(read("package.json"));
  const lock = JSON.parse(read("package-lock.json"));
  for (const name of ["@capacitor/core", "@capacitor/android", "@capacitor/cli"]) {
    assert.equal(pkg.dependencies?.[name] ?? pkg.devDependencies?.[name], "8.5.2");
    assert.equal(lock.packages[`node_modules/${name}`].version, "8.5.2");
  }
  const master = readFileSync(resolve(root, "public/brand/grok_1789541884918.jpg"));
  assert.equal(createHash("sha256").update(master).digest("hex"), "5d823a5c4ef6cc0a76ffc8926f83f0eaae85cb8b59cdcd280d9b8d148f99500a");
  const wrapper = readFileSync(resolve(root, "android/gradle/wrapper/gradle-wrapper.jar"));
  assert.equal(createHash("sha256").update(wrapper).digest("hex"), "7d3a4ac4de1c32b59bc6a4eb8ecb8e612ccd0cf1ae1e99f66902da64df296172");
  return { appId: APP_ID, appName: APP_NAME, ...parseAndroidVersion(read("android/version.properties")), minSdk: 24, targetSdk: 36, compileSdk: 36, capacitor: "8.5.2" };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(checkAndroid(), null, 2));
}
