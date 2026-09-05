export type ThemeId = "dark" | "light";

export function isThemeId(value: unknown): value is ThemeId {
  return value === "dark" || value === "light";
}

export function applyTheme(theme: ThemeId) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  const color = getComputedStyle(root).getPropertyValue("--app-bg").trim();
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta && color) meta.setAttribute("content", color);
}

export const THEME_BOOTSTRAP_SCRIPT =
  'try{var s=localStorage.getItem("pick-for-us-v1");if(s){var p=JSON.parse(s);var t=p&&p.state&&p.state.theme;if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}}}catch(e){}';
