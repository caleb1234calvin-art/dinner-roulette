import type { DateNightSearchResponse } from "@/lib/date-night/types";

// Only the RPC boundary is replaced. The local harness executes the selected
// checkout's real search handler and provider chain for every request.
let mode = "complete";
export const requests: { data: unknown; mode: string; completed: boolean; record?: unknown; error?: string }[] = [];
export function setCrossOriginPacketMode(next: string) { mode = next; }
export async function searchDateNight({ data, signal }: { data: unknown; signal?: AbortSignal }): Promise<DateNightSearchResponse> {
  const request: typeof requests[number] = { data: structuredClone(data), mode, completed: false };
  requests.push(request);
  try {
    const response = await fetch("/cross-origin-search", { method: "POST", signal,
      headers: { "Content-Type": "application/json" }, body: JSON.stringify({ data, mode }) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? `Fixture RPC ${response.status}`);
    request.record = result.record;
    return result.response;
  } catch (error) {
    request.error = error instanceof Error ? error.message : String(error);
    throw error;
  } finally { request.completed = true; }
}
export async function lookupLocation() { throw new Error("External location lookup is outside this fixture"); }
export async function lookupReverseLocation() { throw new Error("External reverse lookup is outside this fixture"); }
