import {
  BookOpenCheck,
  FileText,
  GraduationCap,
  MapPin,
  ShieldCheck,
  Target,
  ArrowUpRight,
} from "lucide-react";
import { site } from "../config/site";
import Reveal, { SectionHead } from "./Reveal";

const principles = [
  {
    icon: BookOpenCheck,
    number: "01",
    title: "Learn Continuously",
    text: "Building practical expertise through hands-on labs, research, and continuous experimentation.",
  },
  {
    icon: ShieldCheck,
    number: "02",
    title: "Test Responsibly",
    text: "Approaching penetration testing ethically, with explicit authorization and a security-first mindset.",
  },
  {
    icon: FileText,
    number: "03",
    title: "Document Clearly",
    text: "Turning technical investigations into structured findings, useful insights, and clear reports.",
  },
];

const interests = [
  "Web Penetration Testing",
  "Ethical Hacking",
  "Vulnerability Assessment",
  "Network Security",
  "CTFs",
  "Linux & Security Tools",
];

export default function About() {
  return (
    <section id="about" className="section section-alt relative overflow-hidden !pt-16 !pb-20 sm:!pt-20 sm:!pb-24 lg:!pt-24 lg:!pb-28">
      {/* Subtle ambient decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/4 h-80 w-80 rounded-full bg-[var(--glow)] opacity-20 blur-[100px]"
      />

      <div className="container-x relative">
        <SectionHead
          index="01"
          label="About"
          title="Curiosity drives discovery. Discipline builds security."
        />

        <div className="mt-12 grid items-start gap-8 lg:grid-cols-[1.25fr_0.85fr] lg:gap-12">
          {/* Introduction and principles */}
          <div>
            <Reveal>
              <div className="group relative border-l-2 border-[var(--accent-line)] py-1 pl-5 transition-colors duration-300 hover:border-[var(--accent)] sm:pl-7">
                <span
                  aria-hidden="true"
                  className="absolute -left-[5px] top-2 h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_14px_var(--glow)]"
                />

                <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg sm:leading-9">
                  I’m a BS Cybersecurity student at NUTECH University,
                  Islamabad, driven by a strong interest in{" "}
                  <span className="font-semibold text-[var(--text)] transition-colors duration-300 group-hover:text-accent">
                    web penetration testing
                  </span>
                  . I enjoy hands-on security testing, investigating
                  vulnerabilities, and discovering how systems can be made
                  more secure.
                </p>
              </div>
            </Reveal>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {principles.map((principle, index) => {
                const Icon = principle.icon;

                return (
                  <Reveal
                    key={principle.number}
                    delay={index * 100}
                    className="h-full"
                  >
                    <article className="card group relative h-full overflow-hidden p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[var(--accent-line)] hover:shadow-[0_12px_32px_var(--glow)] sm:p-6">
                      {/* Animated top accent */}
                      <div
                        aria-hidden="true"
                        className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-500 group-hover:scale-x-100"
                      />

                      <div className="mb-5 flex items-center justify-between">
                        <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--chip-bg)] text-accent transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_18px_var(--glow)]">
                          <Icon size={21} aria-hidden="true" />
                        </span>

                        <span className="font-mono text-xs tracking-widest text-muted transition-colors duration-300 group-hover:text-accent">
                          {principle.number}
                        </span>
                      </div>

                      <h3 className="font-display text-base font-bold leading-snug sm:text-lg">
                        {principle.title}
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-muted">
                        {principle.text}
                      </p>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* Interactive Quick Facts card */}
          <Reveal delay={150}>
            <aside
              className="group/facts relative transform-gpu rounded-2xl border border-line bg-[var(--card-bg,var(--surface))] p-6 shadow-[var(--shadow)] transition-[transform,border-color,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:rotate-[0.4deg] hover:border-[var(--accent-line)] hover:shadow-[0_16px_45px_var(--glow)] motion-reduce:transform-none motion-reduce:transition-none sm:p-7"
              aria-label="Quick facts about me"
            >
              {/* Hover glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[var(--glow)] opacity-20 blur-3xl transition-all duration-500 group-hover/facts:scale-150 group-hover/facts:opacity-50"
              />

              {/* Animated border accent */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-8 top-0 h-px origin-center scale-x-0 bg-[var(--accent)] shadow-[0_0_12px_var(--glow)] transition-transform duration-500 group-hover/facts:scale-x-100"
              />

              <div className="relative">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-accent">
                    Quick Facts
                  </h3>

                  <ArrowUpRight
                    size={18}
                    className="text-muted transition-all duration-300 group-hover/facts:-translate-y-1 group-hover/facts:translate-x-1 group-hover/facts:text-accent"
                    aria-hidden="true"
                  />
                </div>

                <dl className="mt-7 space-y-6">
                  {/* Education */}
                  <div className="flex gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--chip-bg)] text-accent transition-all duration-300 group-hover/facts:shadow-[0_0_18px_var(--glow)]">
                      <GraduationCap size={21} aria-hidden="true" />
                    </span>

                    <div className="min-w-0">
                      <dt className="text-sm text-muted">Education</dt>
                      <dd className="mt-1 font-semibold leading-6">
                        BS Cybersecurity
                        <span className="block text-sm font-medium text-muted">
                          2024 – Present
                        </span>
                        <span className="mt-0.5 block text-sm">
                          {site.university}, Islamabad
                        </span>
                      </dd>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--chip-bg)] text-accent transition-all duration-300 group-hover/facts:shadow-[0_0_18px_var(--glow)]">
                      <MapPin size={20} aria-hidden="true" />
                    </span>

                    <div>
                      <dt className="text-sm text-muted">Location</dt>
                      <dd className="mt-1 font-semibold">
                        {site.location}
                      </dd>
                    </div>
                  </div>

                  {/* Primary focus */}
                  <div>
                    <div className="flex gap-4">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--chip-bg)] text-accent transition-all duration-300 group-hover/facts:shadow-[0_0_18px_var(--glow)]">
                        <Target size={20} aria-hidden="true" />
                      </span>

                      <div className="min-w-0">
                        <dt className="text-sm text-muted">
                          Primary focus
                        </dt>
                        <dd className="mt-1 font-semibold leading-6">
                          Web Penetration Testing
                        </dd>
                      </div>
                    </div>

                    <dd className="mt-4 flex flex-wrap gap-2">
                      {interests.map((interest) => (
                        <span
                          key={interest}
                          className="chip cursor-default transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent-line)] hover:text-accent hover:shadow-[0_0_12px_var(--glow)]"
                        >
                          {interest}
                        </span>
                      ))}
                    </dd>
                  </div>
                </dl>

                {/* Footer motto */}
                <div className="mt-7 flex items-center gap-3 border-t border-line pt-5">
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 shrink-0 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--glow)]"
                  />

                  <p className="font-mono text-xs tracking-wide text-muted sm:text-sm">
                    Learn. Test. Secure. Repeat.
                  </p>
                </div>
              </div>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}