import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { applyTheme, readStoredTheme, resolveTheme, storeTheme, systemPrefersDark } from "@/lib/theme";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [preference, setPreferenceState] = useState(readStoredTheme);
  const [systemDark, setSystemDark] = useState(systemPrefersDark);

  // Follow the OS while the preference is "system".
  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => setSystemDark(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const resolved = resolveTheme(preference, systemDark);
  useEffect(() => applyTheme(resolved), [resolved]);

  const setPreference = useCallback((next) => {
    setPreferenceState(next);
    storeTheme(next);
  }, []);

  const value = useMemo(() => ({ preference, resolved, setPreference }), [preference, resolved, setPreference]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
