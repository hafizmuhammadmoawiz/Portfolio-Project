import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";
const KEY = "moawiz-theme";
const system = (): Theme => (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

function apply(t: Theme) {
  const el = document.documentElement;
  el.dataset.theme = t;
  el.style.colorScheme = t;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", t === "dark" ? "#07090B" : "#F5F6F0");
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => (document.documentElement.dataset.theme as Theme) || system());

  useEffect(() => { apply(theme); }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const on = () => { if (!localStorage.getItem(KEY)) setTheme(system()); };
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const toggle = useCallback(() => {
    const el = document.documentElement;
    el.classList.add("theme-anim");
    window.setTimeout(() => el.classList.remove("theme-anim"), 500);
    setTheme((t) => {
      const next: Theme = t === "dark" ? "light" : "dark";
      try { localStorage.setItem(KEY, next); } catch { /* storage unavailable */ }
      return next;
    });
  }, []);

  return { theme, toggle };
}
