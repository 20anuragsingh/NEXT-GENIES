import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

const KEY = "ng-theme";
const read = () => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
};

function subscribeSystemTheme(callback) {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSystemThemeSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getServerSnapshot() {
  return false;
}

export function useTheme() {
  const [theme, setTheme] = useState(() => read() || "system");
  const systemDark = useSyncExternalStore(subscribeSystemTheme, getSystemThemeSnapshot, getServerSnapshot);
  const isDark = theme === "system" ? systemDark : theme === "dark";

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
  }, [theme]);

  const toggle = useCallback(() => {
    const current = theme === "system" ? (systemDark ? "dark" : "light") : theme;
    const next = current === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* ignore */
    }
  }, [theme, systemDark]);

  return { theme, isDark, toggle };
}
