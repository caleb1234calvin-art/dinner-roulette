// Preload only for the offline contract tests. A denied attempt fails even if
// product code catches the error. No mocks ever fall through to real transport.
import http from "node:http";
import https from "node:https";
import net from "node:net";
import tls from "node:tls";
import dgram from "node:dgram";
import dns from "node:dns";
import childProcess from "node:child_process";
import { syncBuiltinESMExports } from "node:module";

let attempts = 0;
const denied = () => { attempts++; throw new Error("Unmocked network/transport forbidden by offline test guard"); };
globalThis.fetch = denied;
globalThis.WebSocket = denied;
for (const [object, methods] of [[http, ["request", "get"]], [https, ["request", "get"]],
  [net, ["connect", "createConnection"]], [tls, ["connect"]], [dgram, ["createSocket"]],
  [dns, ["lookup", "resolve", "resolve4", "resolve6", "reverse"]],
  [dns.promises, ["lookup", "resolve", "resolve4", "resolve6", "reverse"]],
  [childProcess, ["exec", "execSync", "execFile", "execFileSync", "spawn", "spawnSync", "fork"]]]) {
  for (const method of methods) object[method] = denied;
}
net.Socket.prototype.connect = denied;
syncBuiltinESMExports();
globalThis.__seasonalNetworkAttempts = () => attempts;
process.on("exit", () => {
  console.log(`OFFLINE_NETWORK_PROOF unmocked_attempts=${attempts}`);
  if (attempts) process.exitCode = 1;
});
