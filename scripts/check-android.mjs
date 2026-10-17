import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
export const APP_ID = "app.pickforus.android";
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

export function validateSourceIdentity({ gradle, manifest, strings, javaSources }) {
  for (const key of ["namespace", "applicationId"]) {
    const values = [...gradle.matchAll(new RegExp(`^\\s*${key}\\s*=\\s*"([^"\\n]+)"`, "gm"))];
    assert.deepEqual(values.map((match) => match[1]), [APP_ID], `${key} must match the permanent identity exactly once`);
  }
  const expectedPath = `android/app/src/main/java/${APP_ID.replaceAll(".", "/")}/MainActivity.java`;
  assert.deepEqual(Object.keys(javaSources).sort(), [expectedPath], "Only the target MainActivity source may exist");
  assert.match(javaSources[expectedPath], new RegExp(`^package ${APP_ID.replaceAll(".", "\\.")};`, "m"), "Java package must match its path");
  assert.match(javaSources[expectedPath], /public class MainActivity extends BridgeActivity/);
  for (const name of ["package_name", "custom_url_scheme"]) {
    const values = [...strings.matchAll(new RegExp(`<string name="${name}">([^<]+)</string>`, "g"))];
    assert.deepEqual(values.map((match) => match[1]), [APP_ID], `${name} must match the permanent identity`);
  }
  const activities = [...manifest.matchAll(/<activity\b[^>]*>[\s\S]*?<\/activity>/g)].map((match) => match[0]);
  assert.equal(activities.length, 1, "Exactly one launcher activity is expected");
  assert.match(activities[0], /android:name="\.MainActivity"/);
  assert.match(activities[0], /android:exported="true"/);
  assert.match(activities[0], /android.intent.action.MAIN/);
  assert.match(activities[0], /android.intent.category.LAUNCHER/);
  const providers = [...manifest.matchAll(/<provider\b[^>]*>/g)].map((match) => match[0]);
  assert.equal(providers.length, 1);
  assert.match(providers[0], /android:name="androidx.core.content.FileProvider"/);
  assert.ok(providers[0].includes('android:authorities="${applicationId}.fileprovider"'), "FileProvider must derive its authority from applicationId");
  assert.match(providers[0], /android:exported="false"/);
  assert.match(providers[0], /android:grantUriPermissions="true"/);
  const permissions = [...manifest.matchAll(/<uses-permission\b[^>]*android:name="([^"]+)"/g)].map((match) => match[1]).sort();
  assert.deepEqual(permissions, ["android.permission.ACCESS_COARSE_LOCATION", "android.permission.ACCESS_FINE_LOCATION", "android.permission.INTERNET"]);
  assert.match(manifest, /android:allowBackup="false"/);
}

function readJavaSources(directory = "android/app/src/main/java") {
  return Object.fromEntries(readdirSync(resolve(root, directory), { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.(java|kt)$/.test(entry.name))
    .map((entry) => {
      const path = resolve(entry.parentPath, entry.name).slice(root.length);
      return [path, read(path)];
    }));
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
  validateSourceIdentity({ gradle: app, manifest, strings: read("android/app/src/main/res/values/strings.xml"), javaSources: readJavaSources() });
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
  const master = readFileSync(resolve(root, "public/brand/pick-for-us-icon-master.jpg"));
  assert.equal(master.length, 494490);
  assert.equal(createHash("sha256").update(master).digest("hex"), "12afcedace4aacb19109e561fc70af76076ece7d4997348021422a9396e865d5");
  const wrapper = readFileSync(resolve(root, "android/gradle/wrapper/gradle-wrapper.jar"));
  assert.equal(createHash("sha256").update(wrapper).digest("hex"), "7d3a4ac4de1c32b59bc6a4eb8ecb8e612ccd0cf1ae1e99f66902da64df296172");
  return { appId: APP_ID, appName: APP_NAME, ...parseAndroidVersion(read("android/version.properties")), minSdk: 24, targetSdk: 36, compileSdk: 36, capacitor: "8.5.2" };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(checkAndroid(), null, 2));
}
