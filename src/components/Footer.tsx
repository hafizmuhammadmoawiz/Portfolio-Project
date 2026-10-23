import { ArrowUp, Github, Linkedin, Mail } from "lucide-react";
import { site } from "../config/site";

export default function Footer() {
  const links = [
    site.github && { href: site.github, label: "GitHub", icon: Github, ext: true },
    site.linkedin && { href: site.linkedin, label: "LinkedIn", icon: Linkedin, ext: true },
    { href: `mailto:${site.email}`, label: "Email", icon: Mail, ext: false },
  ].filter(Boolean) as { href: string; label: string; icon: typeof Mail; ext: boolean }[];
  return (
    <footer className="border-t border-line bg-canvas py-10">
      <div className="container-x flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
        <div>
          <p className="font-display font-bold">Designed &amp; Built by {site.name}.</p>
          <p className="mt-1 text-sm text-muted">Focused on learning, ethical testing, and better security.</p>
          <p className="mt-1 font-mono text-xs text-muted">© {new Date().getFullYear()} {site.brand}</p>
        </div>
        <div className="flex items-center gap-2">
          {links.map((l) => <a key={l.label} href={l.href} {...(l.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} aria-label={l.label + (l.ext ? " (opens in new tab)" : "")} className="grid h-11 w-11 place-items-center rounded-full border border-line text-muted transition hover:-translate-y-0.5 hover:border-[var(--accent-line)] hover:text-accent"><l.icon size={18} aria-hidden /></a>)}
          <a href="#home" aria-label="Back to top" className="grid h-11 w-11 place-items-center rounded-full bg-[var(--btn-bg)] text-[var(--btn-fg)] transition hover:-translate-y-1"><ArrowUp size={18} aria-hidden /></a>
        </div>
      </div>
    </footer>
  );
}
