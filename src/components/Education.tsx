/**
 * Education section.
 * Displays entries from data/timeline.ts and shares reveal/heading components
 * from Reveal.tsx. The section id is "education", used by the page navigation.
 */
import { education } from "../data/timeline";
import Reveal, { SectionHead } from "./Reveal";

export default function Education() {
  return (
    <section id="education" className="section relative overflow-hidden">
      <div className="container-x">
        <SectionHead index="02" label="Education" title="Academic path." />

        <ol className="relative mt-14 grid gap-8 lg:grid-cols-4 lg:gap-6">
          <span
            className="tl-line absolute bottom-0 left-[1.45rem] top-0 w-px lg:hidden"
            aria-hidden="true"
          />

          <span
            className="tl-line absolute left-0 right-0 top-[1.45rem] hidden h-px lg:block"
            style={{
              background: "linear-gradient(90deg,var(--accent),var(--line))",
            }}
            aria-hidden="true"
          />

          {education.map((e, i) => (
            <li key={e.institution} className="relative pl-16 lg:pl-0 lg:pt-16">
              <span
                className={`absolute left-0 top-0 grid h-[2.9rem] w-[2.9rem] place-items-center rounded-full border-2 bg-card ${
                  e.status === "Current"
                    ? "border-[var(--accent)] text-accent shadow-[0_0_0_6px_var(--glow)]"
                    : "border-line text-muted"
                }`}
              >
                <e.icon size={20} aria-hidden="true" />
              </span>

              <Reveal delay={i * 100} className="h-full">
                <article className="card card-hover h-full p-6 transition-transform duration-500 ease-out motion-reduce:transform-none lg:[transform:rotate(-1.5deg)] lg:hover:!transform-none lg:hover:-translate-y-1">
                  <div className="flex flex-wrap gap-2">
                    <span className="chip">{e.status}</span>
                    {e.placeholder && (
                      <span className="chip chip-warn">
                        Editable placeholder
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 font-display text-lg font-bold leading-snug">
                    {e.qualification}
                  </h3>

                  <p className="text-sm font-semibold text-accent">
                    {e.institution}
                  </p>

                  <p className="mt-1 font-mono text-xs text-muted">
                    {e.start} – {e.end}
                  </p>

                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {e.description}
                  </p>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
