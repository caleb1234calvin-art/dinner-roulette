/** Only use in disposable tests. Keep wall-clock deltas moving while pinning
 * the observed calendar for both new Date() and Date.now(). */
export function installFixtureCalendar(isoTimestamp) {
  const NativeDate = globalThis.Date;
  const desired = NativeDate.parse(isoTimestamp);
  if (!Number.isFinite(desired)) throw new Error("Invalid fixture calendar timestamp");
  const offset = desired - NativeDate.now();
  class FixtureDate extends NativeDate {
    constructor(...args) {
      if (args.length === 0) super(NativeDate.now() + offset);
      else super(...args);
    }
    static now() { return NativeDate.now() + offset; }
  }
  globalThis.Date = FixtureDate;
  return () => { if (globalThis.Date === FixtureDate) globalThis.Date = NativeDate; };
}
