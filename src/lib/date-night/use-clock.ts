import { useEffect, useState } from "react";

/** Refresh at minute boundaries and immediately after a suspended tab resumes. */
export function useDateNightClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const refresh = () => {
      clearTimeout(timer);
      setNow(new Date());
      timer = setTimeout(refresh, 60_000 - (Date.now() % 60_000));
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
