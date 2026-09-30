export const flush = () => new Promise((resolve) => setImmediate(resolve));

// Deterministic scheduling with real AbortControllers/events and promise queues.
// Date and monotonic time both advance; AbortSignal.timeout is virtualized for
// before/after controls against the original implementation as well.
export function discoveryClock(t) {
  let now = 0,
    nextId = 0;
  const timers = new Map();
  const schedule = (fn, ms = 0) => {
    const id = ++nextId;
    timers.set(id, { fn, at: now + ms });
    return id;
  };
  t.mock.method(globalThis, "setTimeout", schedule);
  t.mock.method(globalThis, "clearTimeout", (id) => timers.delete(id));
  t.mock.method(performance, "now", () => now);
  t.mock.method(Date, "now", () => 1790798400000 + now);
  t.mock.method(AbortSignal, "timeout", (ms) => {
    const controller = new AbortController();
    schedule(() => controller.abort(new DOMException("Timed out", "TimeoutError")), ms);
    return controller.signal;
  });
  return {
    get now() {
      return now;
    },
    get pending() {
      return timers.size;
    },
    async tick(ms) {
      const end = now + ms;
      await flush();
      for (;;) {
        const next = [...timers].sort((a, b) => a[1].at - b[1].at)[0];
        if (!next || next[1].at > end) break;
        const [id, timer] = next;
        timers.delete(id);
        now = timer.at;
        timer.fn();
        await flush();
      }
      now = end;
      await flush();
    },
  };
}

export function untilAbort(signal) {
  return new Promise((_resolve, reject) => {
    if (signal.aborted) reject(signal.reason);
    else signal.addEventListener("abort", () => reject(signal.reason), { once: true });
  });
}

export function deferred() {
  let resolve, reject;
  const promise = new Promise((a, b) => {
    resolve = a;
    reject = b;
  });
  return { promise, resolve, reject };
}
