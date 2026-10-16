import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { captureBuildInputs, completeBuildProof } from "./browser-build-proof.mjs";
import { appendContinuity, classifyReuse, hashArtifact, inspectSubject, preparePacket } from "./verification-packet.mjs";

async function fixture(t) {
  const dir = await mkdtemp(join(tmpdir(), "verification-packet-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const repo = join(dir, "repo");
  await mkdir(join(repo, "src"), { recursive: true });
  await mkdir(join(repo, ".vercel/output"), { recursive: true });
  await writeFile(join(repo, "src/app.js"), "original source");
  await writeFile(join(repo, ".vercel/output/app.js"), "fixture output; not a real build");
  await writeFile(join(repo, ".gitignore"), ".vercel/\naudit/\n");
  const git = (...args) => execFileSync("git", ["-C", repo, ...args], { stdio: "pipe" });
  git("init"); git("config", "user.email", "fixture@example.invalid"); git("config", "user.name", "Test fixture");
  git("add", "."); git("commit", "-m", "Fixture");
  captureBuildInputs(repo, "true"); completeBuildProof(repo, "true");
  const log = join(dir, "check.log");
  await writeFile(log, "controlled test receipt\n");
  const receipt = {
    schemaVersion: 1, subject: inspectSubject(repo), environment: { node: process.version, fixture: "controlled" },
    artifacts: [{ id: "log", path: "check.log", sha256: (await hashArtifact(log)).sha256 }],
    checks: [{ id: "focused", status: "PASS", required: true, timeSensitive: false,
      runReference: "fixture-only", observedAt: "2026-10-16T00:00:00Z", artifacts: ["log"] }],
  };
  const receiptPath = join(dir, "receipt.json");
  const save = () => writeFile(receiptPath, JSON.stringify(receipt));
  await save();
  return { dir, repo, git, receipt, receiptPath, log, save, options: { repo, receiptPath, out: join(dir, "packet") } };
}

test("packet binds exact identity, hashes evidence and preserves every prior continuity byte", async t => {
  const f = await fixture(t);
  const base = Buffer.from("previous history with CRLF\r\n\x00final byte");
  const entry = Buffer.from("New verified observation.\n");
  await writeFile(join(f.dir, "base.md"), base); await writeFile(join(f.dir, "entry.md"), entry);
  const manifest = await preparePacket({ ...f.options, continuityBase: join(f.dir, "base.md"), continuityEntry: join(f.dir, "entry.md") });
  assert.deepEqual(manifest.subject, f.receipt.subject);
  assert.equal(manifest.recordedCheckSummary, "REQUIRED_CHECKS_RECORDED_PASS");
  assert.match(manifest.acceptance, /NOT_DETERMINED/);
  assert.equal(manifest.reuse[0].eligibleForUnchangedInputReuse, false);
  const proposal = await readFile(join(f.options.out, "continuity-proposal.md"));
  assert.ok(proposal.subarray(0, base.length).equals(base));
  assert.ok((await readFile(join(f.dir, "base.md"))).equals(base));
  const hashes = JSON.parse(await readFile(join(f.options.out, "packet-hashes.json")));
  for (const member of hashes.members) assert.equal((await hashArtifact(join(f.options.out, member.path))).sha256, member.sha256);
  assert.equal(f.git("status", "--porcelain").toString(), "");
  await assert.rejects(preparePacket(f.options), /EEXIST/);
});

test("same-tree new commit cannot reuse or apply predecessor acceptance", async t => {
  const f = await fixture(t);
  f.git("commit", "--allow-empty", "-m", "Different identity, identical source");
  assert.equal(inspectSubject(f.repo).tree, f.receipt.subject.tree);
  await assert.rejects(preparePacket(f.options), /identity differs/);
  const first = { subject: f.receipt.subject, environment: {}, tool: {}, checks: f.receipt.checks, artifacts: [{ id: "log", sha256: "a", bytes: 1 }] };
  const second = { ...first, subject: inspectSubject(f.repo) };
  assert.ok(classifyReuse(second, first)[0].reasons.includes("EXACT_IDENTITY_OR_BUILD_CHANGED"));
});

test("dirty source, stale output and altered artifact bytes fail closed", async t => {
  const f = await fixture(t);
  await writeFile(join(f.repo, "src/app.js"), "changed");
  await assert.rejects(preparePacket(f.options), /clean/);
  f.git("restore", "src/app.js");
  await writeFile(join(f.repo, ".vercel/output/app.js"), "changed output");
  await assert.rejects(preparePacket(f.options), /compiled output changed/);
  await writeFile(join(f.repo, ".vercel/output/app.js"), "fixture output; not a real build");
  await writeFile(f.log, "changed evidence");
  await assert.rejects(preparePacket(f.options), /Artifact hash differs/);
});

test("reuse requires unchanged environment, tool, receipt and artifact, with no time-sensitive reuse", async t => {
  const f = await fixture(t);
  const first = await preparePacket(f.options);
  const second = await preparePacket({ ...f.options, out: join(f.dir, "second"), previousPath: join(f.options.out, "manifest.json") });
  assert.equal(second.reuse[0].eligibleForUnchangedInputReuse, true);
  for (const [key, changed, reason] of [
    ["environment", { node: "different" }, "ENVIRONMENT_CHANGED"],
    ["tool", { preparerSha256: "different" }, "PACKET_TOOL_CHANGED"],
    ["artifacts", [{ ...first.artifacts[0], sha256: "different" }], "ARTIFACT_CHANGED:log"],
    ["checks", [{ ...first.checks[0], runReference: "another-run" }], "CHECK_RECEIPT_CHANGED"],
  ]) assert.ok(classifyReuse({ ...first, [key]: changed }, first)[0].reasons.includes(reason));
  const timed = { ...first, checks: [{ ...first.checks[0], timeSensitive: true }] };
  assert.ok(classifyReuse(timed, timed)[0].reasons.includes("TIME_SENSITIVE_RECHECK_REQUIRED"));
});

test("failed and skipped required checks remain visible and require review", async t => {
  const f = await fixture(t);
  f.receipt.checks[0].status = "FAIL"; await f.save();
  const failed = await preparePacket(f.options);
  assert.equal(failed.checks[0].status, "FAIL");
  assert.equal(failed.recordedCheckSummary, "REVIEW_REQUIRED");
  f.receipt.checks[0].status = "SKIP"; await f.save();
  const skipped = await preparePacket({ ...f.options, out: join(f.dir, "skipped") });
  assert.equal(skipped.recordedCheckSummary, "REVIEW_REQUIRED");
  assert.equal(classifyReuse(skipped, skipped)[0].eligibleForUnchangedInputReuse, false);
});

test("checks need artifact bindings and explicit time sensitivity; duplicate IDs are rejected", async t => {
  const f = await fixture(t);
  f.receipt.checks[0].artifacts = ["missing"]; await f.save();
  await assert.rejects(preparePacket(f.options), /existing artifact IDs/);
  f.receipt.checks[0].artifacts = ["log"]; delete f.receipt.checks[0].timeSensitive; await f.save();
  await assert.rejects(preparePacket(f.options), /time sensitivity/);
  f.receipt.checks[0].timeSensitive = false; f.receipt.artifacts.push(f.receipt.artifacts[0]); await f.save();
  await assert.rejects(preparePacket(f.options), /unique/);
});

test("output and continuity inputs cannot accidentally overwrite the source checkout", async t => {
  const f = await fixture(t);
  await assert.rejects(preparePacket({ ...f.options, out: join(f.repo, "packet") }), /outside/);
  await symlink(f.repo, join(f.dir, "alias"));
  await assert.rejects(preparePacket({ ...f.options, out: join(f.dir, "alias", "packet") }), /outside/);
  await assert.rejects(preparePacket({ ...f.options, continuityBase: "missing" }), /both continuity/);
  assert.throws(() => appendContinuity(Buffer.from("history"), Buffer.alloc(0), f.receipt.subject), /empty/);
});
