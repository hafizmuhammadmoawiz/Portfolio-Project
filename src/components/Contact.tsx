import { Download, Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";
import { emailConfigured, site } from "../config/site";
import ContactForm from "./ContactForm";
import NetworkCanvas from "./NetworkCanvas";
import Reveal from "./Reveal";

function LinkCard({ icon: Icon, label, value, href, external = true, note }: { icon: typeof Mail; label: string; value: string; href?: string; external?: boolean; note?: string }) {
  const body = (
    <>
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[var(--chip-bg)] text-accent"><Icon size={22} aria-hidden /></span>
      <span className="min-w-0 flex-1"><span className="block text-xs uppercase tracking-wider text-muted">{label}</span><span className="block truncate font-semibold">{value}</span>{note && <span className="block text-xs text-muted">{note}</span>}</span>
      {href && <ArrowUpRight size={18} className="text-accent" aria-hidden />}
    </>
  );
  const cls = "card flex items-center gap-4 p-4";
  return href
    ? <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={`${cls} card-hover`} aria-label={`${label}: ${value}${external ? " (opens in new tab)" : ""}`}>{body}</a>
    : <div className={`${cls} opacity-70`} aria-disabled="true">{body}</div>;
}

export default function Contact() {
  return (
    <section id="contact" className="section section-alt overflow-hidden" >
      <div className="ambient" /><NetworkCanvas className="opacity-50" />
      <div className="container-x relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">07 / Contact</p>
          <h2 id="contact-h" className="h2">Let's Build <span className="grad-text">Something Secure.</span></h2>
          <p className="lead mx-auto">Have a project idea, security collaboration, internship opportunity, or question? I'd love to hear from you.</p>
        </Reveal>
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Reveal><ContactForm /></Reveal>
          <Reveal delay={120}>
            <div className="space-y-4">
              <LinkCard icon={Mail} label="Email" value={site.email} href={`mailto:${site.email}`} external={false} note={emailConfigured ? undefined : "Placeholder — set in src/config/site.ts"} />
              <LinkCard icon={Github} label="GitHub" value={site.github ? site.github.replace(/^https?:\/\//, "") : "Not linked yet"} href={site.github || undefined} />
              <LinkCard icon={Linkedin} label="LinkedIn" value={site.linkedin ? site.linkedin.replace(/^https?:\/\//, "") : "Not linked yet"} href={site.linkedin || undefined} />
              {site.cv && <LinkCard icon={Download} label="Curriculum vitae" value="Download CV (PDF)" href={site.cv} external={false} />}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
