import { skillCategories } from "../data/skills";
import Reveal, { SectionHead } from "./Reveal";

export default function Skills() {
  return (
    <section id="skills" className="section" >
      <div className="container-x">
        <SectionHead index="02" label="Skills" title="Tools and fundamentals I work with." lead="Grouped by area. No inflated percentages — just what I actively learn and practise." />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((c, i) => (
            <Reveal key={c.title} delay={(i % 3) * 100} className="h-full">
              <article className="card card-hover group h-full p-7">
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--chip-bg)] text-accent transition group-hover:scale-110"><c.icon size={24} aria-hidden /></span>
                  <h3 className="font-display text-xl font-bold leading-tight">{c.title}</h3>
                </div>
                <p className="mt-3 text-sm text-muted">{c.blurb}</p>
                <ul className="mt-5 space-y-3">
                  {c.skills.map((s) => (
                    <li key={s.name} className="flex items-start gap-3">
                      <s.icon size={17} className="mt-1 shrink-0 text-accent" aria-hidden />
                      <span className="text-sm"><span className="font-semibold">{s.name}</span><span className="text-muted"> — {s.desc}</span></span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
