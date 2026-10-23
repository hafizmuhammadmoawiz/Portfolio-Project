import { BookOpenCheck, FileText, GraduationCap, MapPin, ShieldCheck, Target } from "lucide-react";
import { site } from "../config/site";
import Reveal, { SectionHead } from "./Reveal";

const principles = [
  { icon: BookOpenCheck, title: "Learn Continuously", text: "Developing technical knowledge through research and practice." },
  { icon: ShieldCheck, title: "Test Responsibly", text: "Testing only systems that are owned or explicitly authorized." },
  { icon: FileText, title: "Document Clearly", text: "Presenting findings and technical work in a structured format." },
];
const interests = ["Ethical hacking", "Penetration testing", "Web app security", "Network security", "Vulnerability assessment", "Linux & tools", "Secure development"];

export default function About() {
  return (
    <section id="about" className="section section-alt" >
      <div className="container-x">
        <SectionHead index="01" label="About" title="A student building real security habits." />
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <Reveal>
              <p className="max-w-2xl text-lg leading-relaxed text-muted">
                I'm a BS Cybersecurity student in my fourth semester at NUTECH University, Islamabad. My work centres on understanding how systems break so they can be built and defended better — through lab practice, small projects, and careful documentation.
              </p>
            </Reveal>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {principles.map((p, i) => (
                <Reveal key={p.title} delay={i * 110} className="h-full">
                  <div className="card card-hover h-full p-6">
                    <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-[var(--chip-bg)] text-accent"><p.icon size={22} aria-hidden /></span>
                    <h3 className="font-display text-lg font-bold">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{p.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal delay={150}>
            <aside className="card p-7" aria-label="Quick facts">
              <h3 className="font-mono text-xs uppercase tracking-[.14em] text-accent">Quick facts</h3>
              <dl className="mt-5 space-y-5 text-sm">
                <div className="flex gap-3"><GraduationCap className="mt-0.5 shrink-0 text-accent" size={19} aria-hidden /><div><dt className="text-muted">Education</dt><dd className="font-semibold">BS Cybersecurity · 2024–Present<br />{site.university}</dd></div></div>
                <div className="flex gap-3"><MapPin className="mt-0.5 shrink-0 text-accent" size={19} aria-hidden /><div><dt className="text-muted">Location</dt><dd className="font-semibold">{site.location}</dd></div></div>
                <div className="flex gap-3"><Target className="mt-0.5 shrink-0 text-accent" size={19} aria-hidden /><div><dt className="text-muted">Security interests</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">{interests.map((t) => <span key={t} className="chip">{t}</span>)}</dd></div></div>
              </dl>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
