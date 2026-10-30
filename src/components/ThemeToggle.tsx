import { Moon, Sun } from "lucide-react";
import type { Theme } from "../hooks/useTheme";

export default function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: Theme;
  onToggle: () => void;
}) {
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={dark}
      className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-card text-accent transition hover:border-[var(--accent-line)] hover:scale-105 active:scale-90 sm:h-11 sm:w-11"
    >
      <Sun
        size={16}
        className={`absolute transition-all duration-500 sm:h-[19px] sm:w-[19px] ${
          dark
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        }`}
        aria-hidden="true"
      />

      <Moon
        size={16}
        className={`absolute transition-all duration-500 sm:h-[19px] sm:w-[19px] ${
          dark
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        }`}
        aria-hidden="true"
      />
    </button>
  );
}
