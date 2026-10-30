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

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 16);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    const sectionIds = navLinks.map((link) => link.id);

    const updateActiveSection = () => {
      const marker = window.scrollY + window.innerHeight * 0.35;
      let currentSection = "home";

      for (const id of sectionIds) {
        const section = document.getElementById(id);

        if (
          section &&
          section.getBoundingClientRect().top + window.scrollY <= marker
        ) {
          currentSection = id;
        }
      }

      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;

      if (atBottom) {
        currentSection = sectionIds[sectionIds.length - 1] ?? "home";
      }

      setActive(currentSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

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
        backdropFilter: scrolled || open ? "blur(16px) saturate(1.4)" : "none",
      }}
    >
      <nav
        aria-label="Primary"
        className="container-x flex h-14 items-center justify-between gap-2 sm:h-16 sm:gap-4"
      >
        <a
          href="#home"
          className="shrink-0 font-mono text-base font-medium tracking-tight text-ink sm:text-[1.05rem]"
          aria-label={`${site.brand} – ${site.tagline} – back to top`}
        >
          <span className="flex flex-col items-start leading-tight">
            <span>
              <span className="text-accent">&lt;</span>
              {site.brand}
              <span className="text-accent">/&gt;</span>
            </span>
            <span className="mt-0.5 font-sans text-[9px] font-normal tracking-wide text-muted sm:text-[10px]">
              {site.tagline}
            </span>
          </span>
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

        {/* Header Write-ups button: visible on mobile and desktop */}
        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          <a
            href="/blog"
            className="btn btn-primary nav-cta !flex !min-h-9 !shrink-0 !items-center !gap-1 !px-2 !py-1.5 text-xs sm:!min-h-11 sm:!gap-2 sm:!px-5 sm:!py-2 sm:text-base"
          >
            <span className="whitespace-nowrap">Write-ups</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>

          <ThemeToggle theme={theme} onToggle={onToggle} />

          <button
            type="button"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-card text-ink lg:hidden sm:h-11 sm:w-11"
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

      {/* Mobile hamburger menu */}
      <div
        id="mobile-menu"
        className={`lg:hidden overflow-hidden transition-[max-height] duration-500 ${
          open ? "max-h-[36rem]" : "max-h-0"
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

          {/* Write-ups link inside the hamburger menu */}
          <li>
            <a
              href="/blog"
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              className="flex min-h-12 items-center justify-between rounded-xl px-4 font-bold text-ink transition hover:bg-[var(--chip-bg)] hover:text-accent"
            >
              Write-ups
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
