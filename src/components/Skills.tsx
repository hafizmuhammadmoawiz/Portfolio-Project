
import { ArrowUpRight } from "lucide-react";
import { skillCategories } from "../data/skills";
import Reveal, { SectionHead } from "./Reveal";

export default function Skills() {
  return (
    <section
      id="skills"
      className="section relative overflow-hidden !bg-[#05050675]">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-20 h-80 w-80 rounded-full bg-[var(--glow)] opacity-10 blur-[110px]"
      />

      <div className="container-x relative">
        <SectionHead
          index="02"
          label="Skills"
          title="Tools and fundamentals I work with."
          lead="Grouped by area. No inflated percentages — just what I actively learn and practise."
        />

        {/* Three columns on desktop, two on tablet */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((c, i) => {
            const CategoryIcon = c.icon;

            return (
              <Reveal
                key={c.title}
                delay={(i % 3) * 100}
                className="h-full"
              >
                <article className="card card-hover group relative h-full overflow-hidden p-7 transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:border-[var(--accent-line)] hover:shadow-[0_12px_32px_var(--glow)] motion-reduce:transform-none motion-reduce:transition-none">
                  {/* Animated neon top line */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-500 group-hover:scale-x-100"
                  />

                  {/* Hover glow */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[var(--glow)] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30"
                  />

                  <div className="relative">
                    {/* Category heading */}
                    <div className="flex items-center gap-4">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-transparent bg-[var(--chip-bg)] text-accent transition-all duration-300 group-hover:scale-110 group-hover:border-[var(--accent-line)] group-hover:shadow-[0_0_18px_var(--glow)]">
                        <CategoryIcon size={24} aria-hidden="true" />
                      </span>

                      <h3 className="min-w-0 flex-1 font-display text-xl font-bold leading-tight">
                        {c.title}
                      </h3>

                      <ArrowUpRight
                        size={17}
                        aria-hidden="true"
                        className="shrink-0 text-muted opacity-60 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent group-hover:opacity-100"
                      />
                    </div>

                    {/* Category description */}
                    <p className="mt-3 text-sm leading-6 text-muted">
                      {c.blurb}
                    </p>

                    {/* Skills list */}
                    <ul className="mt-5 space-y-3">
                      {c.skills.map((s) => {
                        const SkillIcon = s.icon;

                        return (
                          <li
                            key={s.name}
                            className="flex items-start gap-3 rounded-md transition-colors duration-200"
                          >
                            <SkillIcon
                              size={17}
                              className="mt-1 shrink-0 text-accent transition-transform duration-200 group-hover:scale-105"
                              aria-hidden="true"
                            />

                            <span className="text-sm leading-6">
                              <span className="font-semibold transition-colors duration-200 group-hover:text-accent">
                                {s.name}
                              </span>
                              <span className="text-muted">
                                {" "}— {s.desc}
                              </span>
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
