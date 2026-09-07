type AnalyticsValue = string | number | boolean | null;

declare global {
  interface Window {
    va?: (event: "event" | "pageview" | "beforeSend", properties?: unknown) => void;
  }
}

export function trackAppEvent(name: string, data?: Record<string, AnalyticsValue>): void {
  if (typeof window === "undefined" || typeof window.va !== "function") return;
  window.va("event", data ? { name, data } : { name });
}
