import { useEffect, useState } from "react";

/** Refresh at minute boundaries and immediately after a suspended tab resumes.
 * A start-only announcement expires just after its inclusive start instant, so
 * an exactly-on-the-minute tick also schedules the following millisecond. */
export function useDateNightClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const refresh = () => {
      clearTimeout(timer);
      setNow(new Date());
      const elapsed = Date.now() % 60_000;
      timer = setTimeout(refresh, elapsed === 0 ? 1 : 60_000 - elapsed);
    };
    refresh();
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);
  return now;
}
