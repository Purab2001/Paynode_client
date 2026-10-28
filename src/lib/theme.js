// Theme preference: "light" | "dark" | "system". "system" follows the OS and updates live.

export const THEME_KEY = "paynode.theme";
export const THEMES = ["light", "dark", "system"];

export const isTheme = (value) => THEMES.includes(value);

/** The theme actually shown. */
export const resolveTheme = (preference, systemPrefersDark) =>
  preference === "dark" || (preference !== "light" && systemPrefersDark) ? "dark" : "light";

export const systemPrefersDark = () =>
  typeof window !== "undefined" && !!window.matchMedia?.("(prefers-color-scheme: dark)").matches;

export function readStoredTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    return isTheme(saved) ? saved : "system";
  } catch {
    return "system";
  }
}

export function storeTheme(preference) {
  try {
    if (preference === "system") localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, preference);
  } catch {
    /* storage unavailable: the choice just won't persist */
  }
}

/** Put the resolved theme on <html>. The same logic runs inline in index.html before first paint. */
export function applyTheme(resolved, root = document.documentElement) {
  root.classList.toggle("dark", resolved === "dark");
}
