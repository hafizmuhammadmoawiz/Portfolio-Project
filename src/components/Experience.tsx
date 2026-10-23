import { experience } from "../data/timeline";
import Reveal, { SectionHead } from "./Reveal";

export default function Experience() {
  return (
    <section id="experience" className="section" >
      <div className="container-x">
        <SectionHead index="05" label="Experience" title="Practical learning." lead="Labs and self-directed practice — not paid employment. Entries are sample content until edited." />
        <ol className="relative mt-14 space-y-8">
          <span className="tl-line absolute bottom-0 left-[1.45rem] top-0 w-px lg:left-1/2" aria-hidden />
          {experience.map((x, i) => (
            <li key={x.title} className={`relative pl-16 lg:grid lg:grid-cols-2 lg:gap-16 lg:pl-0 ${i % 2 ? "" : ""}`}>
              <span className="absolute left-0 top-2 z-10 grid h-[2.9rem] w-[2.9rem] place-items-center rounded-full border-2 border-[var(--accent)] bg-card text-accent lg:left-1/2 lg:-translate-x-1/2"><x.icon size={20} aria-hidden /></span>
              <Reveal delay={60} className={i % 2 ? "lg:col-start-2" : "lg:col-start-1"}>
                <article className="card card-hover p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2"><span className="chip chip-warn">{x.status}</span><span className="font-mono text-xs text-muted">{x.dates}</span></div>
                  <h3 className="mt-3 font-display text-lg font-bold leading-snug">{x.title}</h3>
                  <p className="text-sm font-semibold text-accent">{x.organization}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{x.description}</p>
                  <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tools">{x.tools.map((t) => <li key={t} className="chip">{t}</li>)}</ul>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
