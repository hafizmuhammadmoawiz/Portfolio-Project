import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navLinks, site } from "../config/site";
import ThemeToggle from "./ThemeToggle";
import type { Theme } from "../hooks/useTheme";

export default function Navbar({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
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
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    navLinks.forEach((l) => { const el = document.getElementById(l.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);

  const main = navLinks.filter((l) => l.id !== "contact");

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled || open ? "border-b border-line shadow-lg/5" : "border-b border-transparent"}`}
      style={{ background: scrolled || open ? "var(--nav-bg)" : "transparent", backdropFilter: scrolled || open ? "blur(16px) saturate(1.4)" : "none" }}>
      <nav aria-label="Primary" className="container-x flex h-16 items-center justify-between gap-4">
        <a href="#home" className="font-mono text-[1.05rem] font-medium tracking-tight text-ink" aria-label={`${site.brand} – back to top`}>
          <span className="text-accent">&lt;</span>{site.brand}<span className="text-accent">/&gt;</span>
        </a>
        <ul className="hidden items-center gap-6 xl:flex">
          {main.map((l) => (
            <li key={l.id}><a href={`#${l.id}`} className="nav-link font-bold" aria-current={active === l.id ? "true" : undefined}>{l.label}</a></li>
          ))}
        </ul>
        <div className="flex items-center gap-2.5">
          <a href="#contact" className="btn btn-primary nav-cta !min-h-11 !py-2">Let's Connect <ArrowUpRight size={17} aria-hidden /></a>
          <ThemeToggle theme={theme} onToggle={onToggle} />
          <button type="button" className="grid h-11 w-11 place-items-center rounded-full border border-line bg-card text-ink xl:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
            {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>
      </nav>
      <div id="mobile-menu" className={`xl:hidden overflow-hidden transition-[max-height] duration-500 ${open ? "max-h-[32rem]" : "max-h-0"}`} aria-hidden={!open}>
        <ul className="container-x flex flex-col gap-1 pb-5">
          {navLinks.map((l) => (
            <li key={l.id}>
              <a href={`#${l.id}`} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} aria-current={active === l.id ? "true" : undefined}
                className={`flex min-h-12 items-center rounded-xl px-4 font-bold transition ${active === l.id ? "bg-[var(--chip-bg)] text-accent" : "text-ink hover:bg-[var(--chip-bg)]"}`}>{l.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
