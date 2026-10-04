import { readFileSync, writeFileSync, renameSync, unlinkSync, openSync, closeSync, fsyncSync } from "node:fs";
import { dirname, join } from "node:path";
import { randomUUID } from "node:crypto";
import { canonical } from "./canonical.ts";
import { buildSnapshot, verifySnapshot, type Snapshot } from "./builder.ts";

export function readJson(path: string): unknown {
  // Local files only. This module has no URL loader or transport.
  if (path.includes("://")) throw new Error("Local file required");
  const bytes = readFileSync(path);
  if (bytes.length > 32 * 1024 * 1024) throw new Error("Offline input exceeds 32 MiB");
  return JSON.parse(bytes.toString("utf8"));
}
/** One verified bundle is the atomic publication unit. No partial sidecar set. */
export function writeSnapshot(path: string, raw: unknown): Snapshot {
  const snapshot = verifySnapshot(raw);
  const bytes = canonical(snapshot) + "\n";
  const temporary = join(dirname(path), `.seasonal-${randomUUID()}.tmp`);
  let renamed = false;
  try {
    writeFileSync(temporary, bytes, { flag: "wx", mode: 0o600 });
    const fd = openSync(temporary, "r");
    try { fsyncSync(fd); } finally { closeSync(fd); }
    renameSync(temporary, path); renamed = true;
  } finally { if (!renamed) { try { unlinkSync(temporary); } catch { /* May not have been created. */ } } }
  return snapshot;
}
export function buildFile(inputPath: string, outputPath: string, previousPath?: string): Snapshot {
  const snapshot = buildSnapshot(readJson(inputPath), previousPath ? readJson(previousPath) : undefined);
  return writeSnapshot(outputPath, snapshot);
}
