
/**
 * Site navigation.
 * Responsive desktop navigation and mobile menu.
 * Preserves site links, theme controls, and contact CTA.
 */
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navLinks, site } from "../config/site";
import ThemeToggle from "./ThemeToggle";
import type { Theme } from "../hooks/useTheme";

type NavbarProps = {
  theme: Theme;
  onToggle: () => void;
  onStartFlight: () => void;
};

export default function Navbar({
  theme,
  onToggle,
  onStartFlight,
}: NavbarProps) {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Update navbar background on scroll
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 16);

    on();
    window.addEventListener("scroll", on, { passive: true });

    return () => window.removeEventListener("scroll", on);
  }, []);

  // Keep the active navigation link synchronized with page scrolling
  useEffect(() => {
    const sectionIds = navLinks.map((link) => link.id);

    const updateActiveSection = () => {
      const marker = window.scrollY + window.innerHeight * 0.35;
      let currentSection = "home";

      for (const id of sectionIds) {
        const section = document.getElementById(id);

        if (section && section.getBoundingClientRect().top + window.scrollY <= marker) {
          currentSection = id;
        }
      }

      // At the bottom of the page, activate the final navigation section.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;

      if (atBottom) {
        currentSection = sectionIds[sectionIds.length - 1] ?? "home";
      }

      setActive(currentSection);
    };

    updateActiveSection();

    window.addEventListener("scroll", updateActiveSection, {
      passive: true,
    });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  // Close mobile menu with Escape
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "border-b border-line shadow-lg/5"
          : "border-b border-transparent"
      }`}
      style={{
        background: scrolled || open ? "var(--nav-bg)" : "transparent",
        backdropFilter:
          scrolled || open ? "blur(16px) saturate(1.4)" : "none",
      }}
    >
      <nav
        aria-label="Primary"
        className="container-x flex h-14 items-center justify-between gap-3 sm:h-16 sm:gap-4"
      >
        <a
          href="#home"
          className="shrink-0 font-mono text-base font-medium tracking-tight text-ink sm:text-[1.05rem]"
          aria-label={`${site.brand} – back to top`}
        >
          <span className="text-accent">&lt;</span>
          {site.brand}
          <span className="text-accent">/&gt;</span>
        </a>

        <ul className="hidden items-center gap-3 lg:flex xl:gap-5 2xl:gap-6">
          {navLinks.map((l) => (
            <li key={l.id}>
              <a
                href={l.id === "contact" ? "#contact-form" : `#${l.id}`}
                className="nav-link whitespace-nowrap text-sm font-bold xl:text-base"
                aria-current={active === l.id ? "true" : undefined}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={onStartFlight}
            className="btn btn-primary nav-cta !min-h-9 !px-3 !py-1.5 text-sm sm:!min-h-11 sm:!px-5 sm:!py-2 sm:text-base"
          >
            <span className="whitespace-nowrap">Let's Connect</span>
            <ArrowUpRight size={17} aria-hidden="true" />
          </button>

          <ThemeToggle theme={theme} onToggle={onToggle} />

          <button
            type="button"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-card text-ink lg:hidden sm:h-11 sm:w-11"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <Menu size={20} aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`lg:hidden overflow-hidden transition-[max-height] duration-500 ${
          open ? "max-h-[32rem]" : "max-h-0"
        }`}
        aria-hidden={!open}
        inert={!open}
      >
        <ul className="container-x flex flex-col gap-1 pb-5">
          {navLinks.map((l) => (
            <li key={l.id}>
              <a
                href={l.id === "contact" ? "#contact-form" : `#${l.id}`}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                aria-current={active === l.id ? "true" : undefined}
                className={`flex min-h-12 items-center rounded-xl px-4 font-bold transition ${
                  active === l.id
                    ? "bg-[var(--chip-bg)] text-accent"
                    : "text-ink hover:bg-[var(--chip-bg)]"
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
