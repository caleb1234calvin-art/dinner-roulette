import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, readFile, realpath, stat, writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { isDeepStrictEqual } from "node:util";
import { pathToFileURL } from "node:url";
import { assertBrowserBuild } from "./browser-build-proof.mjs";

const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");
const json = value => JSON.stringify(value, null, 2) + "\n";
const same = isDeepStrictEqual;
const hashPattern = /^[a-f0-9]{64}$/;
const statuses = new Set(["PASS", "QUALIFIED_PASS", "FAIL", "SKIP", "NOT_RUN"]);
const git = (repo, ...args) => execFileSync("git", ["-C", repo, ...args], { encoding: "utf8" }).trim();

// Reuse the existing source/output fingerprint implementation. No build is run.
export function inspectSubject(repo) {
  assert.equal(git(repo, "status", "--porcelain=v1", "--untracked-files=all"), "", "Checkout must be clean");
  const [sha, tree, parentText = ""] = git(repo, "show", "-s", "--format=%H%n%T%n%P", "HEAD").split("\n");
  const proof = assertBrowserBuild(repo, "true");
  return { sha, tree, parents: parentText ? parentText.split(" ") : [], source: proof.source, output: proof.output };
}

export async function hashArtifact(path) {
  const before = await stat(path);
  assert.ok(before.isFile(), "Artifact must be a regular file: " + path);
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(path)) hash.update(chunk);
  const after = await stat(path);
  assert.ok(before.size === after.size && before.mtimeMs === after.mtimeMs && before.ino === after.ino,
    "Artifact changed while hashing: " + path);
  return { bytes: after.size, sha256: hash.digest("hex") };
}

function validateReceipt(receipt, subject) {
  assert.equal(receipt.schemaVersion, 1, "Unsupported receipt schema");
  assert.deepEqual(receipt.subject, subject, "Receipt identity differs from the current exact source/build; do not transfer acceptance");
  assert.ok(receipt.environment && Object.keys(receipt.environment).length, "Explicit environment inputs are required");
  for (const value of Object.values(receipt.environment)) assert.equal(typeof value, "string", "Environment inputs must be strings");
  assert.ok(Array.isArray(receipt.artifacts) && receipt.artifacts.length, "Artifact receipts are required");
  assert.ok(Array.isArray(receipt.checks) && receipt.checks.length, "Check receipts are required");
  const ids = new Set();
  for (const artifact of receipt.artifacts) {
    assert.ok(artifact.id && !ids.has(artifact.id), "Artifact IDs must be unique");
    ids.add(artifact.id);
    assert.ok(typeof artifact.path === "string" && artifact.path, "Artifact path is required");
    assert.match(artifact.sha256, hashPattern, "Expected artifact SHA-256 is required");
  }
  const checkIds = new Set();
  for (const check of receipt.checks) {
    assert.ok(check.id && !checkIds.has(check.id), "Check IDs must be unique");
    checkIds.add(check.id);
    assert.ok(statuses.has(check.status), "Unsupported check status");
    assert.equal(typeof check.required, "boolean", "Declare whether each check is required");
    assert.equal(typeof check.timeSensitive, "boolean", "Declare check time sensitivity");
    assert.ok(check.runReference && Number.isFinite(Date.parse(check.observedAt)), "Check run reference and observation time are required");
    assert.ok(Array.isArray(check.artifacts) && check.artifacts.length && check.artifacts.every(id => ids.has(id)),
      "Every check must reference existing artifact IDs");
  }
}

// This classifies reuse of recorded evidence, never creates a new test PASS.
export function classifyReuse(current, previous) {
  return current.checks.map(check => {
    const reasons = [];
    const old = previous?.checks?.find(item => item.id === check.id);
    if (!previous) reasons.push("NO_PREVIOUS_MANIFEST");
    else {
      if (!same(current.subject, previous.subject)) reasons.push("EXACT_IDENTITY_OR_BUILD_CHANGED");
      if (!same(current.environment, previous.environment)) reasons.push("ENVIRONMENT_CHANGED");
      if (!same(current.tool, previous.tool)) reasons.push("PACKET_TOOL_CHANGED");
      if (!same(check, old)) reasons.push("CHECK_RECEIPT_CHANGED");
      for (const id of check.artifacts) {
        const now = current.artifacts.find(item => item.id === id);
        const prior = previous.artifacts?.find(item => item.id === id);
        if (!prior || now.sha256 !== prior.sha256 || now.bytes !== prior.bytes) reasons.push("ARTIFACT_CHANGED:" + id);
      }
    }
    if (check.timeSensitive) reasons.push("TIME_SENSITIVE_RECHECK_REQUIRED");
    if (!["PASS", "QUALIFIED_PASS"].includes(check.status)) reasons.push("CHECK_NOT_SUCCESSFUL");
    return { checkId: check.id, eligibleForUnchangedInputReuse: reasons.length === 0, reasons };
  });
}

export function appendContinuity(base, entry, subject) {
  assert.ok(entry.length, "Continuity entry must not be empty");
  const boundary = Buffer.from("\n\n---\nVerification packet for " + subject.sha + " / tree " + subject.tree + "\n\n");
  const proposal = Buffer.concat([base, boundary, entry]);
  assert.ok(proposal.subarray(0, base.length).equals(base), "Prior continuity bytes must remain intact");
  return { proposal, integrity: {
    mode: "APPEND_ONLY_PROPOSAL", priorBytes: base.length, priorSha256: sha256(base),
    entryBytes: entry.length, entrySha256: sha256(entry), proposalBytes: proposal.length,
    proposalSha256: sha256(proposal), completePriorPrefixUnchanged: true,
    publication: "NOT_PERFORMED; recheck the remote base hash before applying",
  } };
}

export async function preparePacket({ repo, receiptPath, out, previousPath, continuityBase, continuityEntry }) {
  repo = await realpath(repo);
  receiptPath = resolve(receiptPath);
  out = join(await realpath(dirname(resolve(out))), basename(out));
  assert.ok(!out.startsWith(repo + "/") && out !== repo, "Write packets outside the target checkout");
  assert.equal(Boolean(continuityBase), Boolean(continuityEntry), "Supply both continuity base and entry");
  const subject = inspectSubject(repo);
  const receiptBytes = await readFile(receiptPath);
  const receipt = JSON.parse(receiptBytes);
  validateReceipt(receipt, subject);
  const artifacts = [];
  for (const artifact of receipt.artifacts) {
    const path = await realpath(resolve(dirname(receiptPath), artifact.path));
    const actual = await hashArtifact(path);
    assert.equal(actual.sha256, artifact.sha256, "Artifact hash differs: " + artifact.id);
    artifacts.push({ id: artifact.id, path, ...actual });
  }
  const previousBytes = previousPath ? await readFile(previousPath) : null;
  const previous = previousBytes ? JSON.parse(previousBytes) : null;
  if (previous) assert.equal(previous.schemaVersion, 1, "Unsupported prior manifest schema");
  const manifest = {
    schemaVersion: 1, generatedAt: new Date().toISOString(), subject,
    environment: receipt.environment,
    tool: {
      preparerSha256: sha256(await readFile(new URL(import.meta.url))),
      buildProofImplementationSha256: sha256(await readFile(new URL("./browser-build-proof.mjs", import.meta.url))),
    },
    receipt: { path: receiptPath, sha256: sha256(receiptBytes) },
    previousManifest: previousBytes ? { path: resolve(previousPath), sha256: sha256(previousBytes) } : null,
    artifacts, checks: receipt.checks,
    recordedCheckSummary: receipt.checks.some(check => check.required && check.status !== "PASS") ? "REVIEW_REQUIRED" : "REQUIRED_CHECKS_RECORDED_PASS",
    acceptance: "NOT_DETERMINED; this tool verifies identity and evidence bytes, not test meaning, review independence or release permission",
    preservation: "Hashes and paths are references; this packet does not preserve or inspect original archive contents or screenshots",
    releaseActions: "NONE; no network, build, tests, merge, deploy, migration, rollback or publication is executed",
  };
  manifest.reuse = classifyReuse(manifest, previous);
  let continuity;
  if (continuityBase) {
    continuity = appendContinuity(await readFile(continuityBase), await readFile(continuityEntry), subject);
    manifest.continuity = continuity.integrity;
  }
  assert.deepEqual(inspectSubject(repo), subject, "Source/build changed during packet preparation");
  // Exclusive directory creation prevents replacing earlier evidence or proposals.
  await mkdir(out);
  await writeFile(join(out, "manifest.json"), json(manifest), { flag: "wx" });
  await writeFile(join(out, "check-receipt.json"), receiptBytes, { flag: "wx" });
  if (continuity) await writeFile(join(out, "continuity-proposal.md"), continuity.proposal, { flag: "wx" });
  const packetFiles = ["manifest.json", "check-receipt.json", ...(continuity ? ["continuity-proposal.md"] : [])];
  const members = [];
  for (const name of packetFiles) members.push({ path: name, ...await hashArtifact(join(out, name)) });
  await writeFile(join(out, "packet-hashes.json"), json({ subject, members }), { flag: "wx" });
  return manifest;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const options = {};
  const names = { "--repo": "repo", "--receipt": "receiptPath", "--out": "out", "--previous": "previousPath", "--continuity-base": "continuityBase", "--continuity-entry": "continuityEntry" };
  try {
    for (let i = 2; i < process.argv.length; i += 2) {
      assert.ok(names[process.argv[i]] && process.argv[i + 1] && !process.argv[i + 1].startsWith("--"), "Use --repo PATH --receipt JSON --out NEW_DIRECTORY [--previous MANIFEST] [--continuity-base FILE --continuity-entry FILE]");
      assert.ok(!options[names[process.argv[i]]], "Duplicate option: " + process.argv[i]);
      options[names[process.argv[i]]] = process.argv[i + 1];
    }
    assert.ok(options.repo && options.receiptPath && options.out, "--repo, --receipt and --out are required");
    const manifest = await preparePacket(options);
    console.log(json({ subject: manifest.subject, recordedCheckSummary: manifest.recordedCheckSummary, acceptance: manifest.acceptance, output: resolve(options.out) }));
  } catch (error) {
    console.error("VERIFICATION_PACKET_HOLD: " + error.message);
    process.exitCode = 1;
  }
}
