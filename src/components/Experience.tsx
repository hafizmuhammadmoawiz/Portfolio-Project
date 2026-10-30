import { experience } from "../data/timeline";
import Reveal, { SectionHead } from "./Reveal";

export default function Experience() {
  return (
    <section id="experience" className="section relative overflow-hidden">
      <div className="container-x">
        <SectionHead
          index="04"
          label="Experience"
          title="Practical learning."
          lead="Hands-on cybersecurity experience through professional training, security labs, and self-directed practice."
        />

        <ol className="relative mt-10 space-y-5 sm:mt-12 sm:space-y-6">
          {/* Timeline line */}
          <span
            className="tl-line absolute bottom-0 left-[1.05rem] top-4 w-px sm:left-[1.2rem]"
            aria-hidden="true"
          />

          {experience.map((x, i) => (
            <li key={x.title} className="relative pl-10 sm:pl-14">
              {/* Timeline marker */}
              <span
                className={`absolute left-0 top-6 z-10 grid h-[2.15rem] w-[2.15rem] place-items-center rounded-full border-2 bg-[var(--card)] transition-all duration-300 sm:left-[0.15rem] sm:h-10 sm:w-10 ${
                  i === 0
                    ? "border-[var(--accent)] text-accent shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                    : "border-[var(--border)] text-muted"
                }`}
                aria-hidden="true"
              >
                <x.icon size={18} />
              </span>

              <Reveal delay={i * 70}>
                <article
                  className={`card card-hover relative rounded-2xl p-5 transition-all duration-300 sm:p-6 md:p-7 ${
                    i === 0
                      ? "border border-[var(--accent)]/40 shadow-[0_8px_30px_rgba(34,197,94,0.06)]"
                      : ""
                  }`}
                >
                  {/* Entry header */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-display text-base font-bold leading-snug sm:text-lg">
                          {x.title}
                        </h3>

                        <span className="chip chip-warn">{x.status}</span>
                      </div>

                      <p className="mt-2 text-sm font-semibold leading-relaxed text-accent sm:text-base">
                        {x.organization}
                      </p>
                    </div>

                    <span className="shrink-0 font-mono text-xs text-accent sm:pt-1 sm:text-sm">
                      {x.dates}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mt-3 max-w-4xl text-sm leading-7 text-muted">
                    {x.description}
                  </p>

                  {/* Tools */}
                  {x.tools.length > 0 && (
                    <ul
                      className="mt-4 flex flex-wrap gap-2"
                      aria-label="Tools used"
                    >
                      {x.tools.map((tool) => (
                        <li key={tool} className="chip">
                          {tool}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
