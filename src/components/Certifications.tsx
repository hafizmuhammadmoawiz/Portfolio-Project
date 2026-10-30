/**
 * Certifications section.
 * Displays real certificate images, details, and accessible previews.
 * Keeps the existing card design and Reveal entrance effects.
 */
import { Award, ExternalLink } from "lucide-react";
import { certifications, type Certification } from "../data/certifications";
import Reveal, { SectionHead } from "./Reveal";

function Thumb({ c }: { c: Certification }) {
  if (c.image) {
    return (
      <a
        href={c.image}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View full certificate: ${c.title} (opens in new tab)`}
        className="group relative block overflow-hidden rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
      >
        <img
          src={c.image}
          alt={`${c.title} certificate`}
          loading="lazy"
          width={400}
          height={280}
          className="aspect-[10/7] w-full rounded-xl border border-line object-contain bg-[var(--bg-2)] transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
        />
      </a>
    );
  }

  return (
    <div
      className="relative grid aspect-[10/7] place-items-center overflow-hidden rounded-xl border border-dashed border-[var(--accent-line)]"
      style={{
        background: "linear-gradient(135deg,var(--bg-2),var(--card))",
      }}
      role="img"
      aria-label={`Certificate preview unavailable for ${c.title}`}
    >
      <div
        className="absolute inset-3 rounded-lg border border-line"
        aria-hidden="true"
      />

      <div className="text-center">
        <Award
          className="mx-auto text-accent"
          size={40}
          strokeWidth={1.4}
          aria-hidden="true"
        />

        <p className="mt-2 font-display text-sm font-bold">
          Certificate of {c.category}
        </p>

        <div className="mx-auto mt-2 h-1 w-20 rounded bg-[var(--line)]" />
        <div className="mx-auto mt-1.5 h-1 w-14 rounded bg-[var(--line)]" />
      </div>
    </div>
  );
}

export default function Certifications() {
  return (
    <section id="certifications" className="section relative overflow-hidden">
      <div className="container-x">
        <SectionHead
          index="06"
          label="Certification"
          title="Credentials & Learning."
          lead="Professional training and certifications in cybersecurity, networking, and security fundamentals."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {certifications.map((c, i) => (
            <Reveal key={c.title} delay={i * 100} className="h-full">
              <article className="card card-hover flex h-full flex-col p-5">
                <Thumb c={c} />

                {c.placeholder && (
                  <span className="chip chip-warn mt-4 self-start">
                    Placeholder
                  </span>
                )}

                <h3 className="mt-3 font-display text-lg font-bold leading-snug">
                  {c.title}
                </h3>

                <dl className="mt-2 space-y-1 text-sm text-muted">
                  <div>
                    <dt className="sr-only">Issuing organization</dt>
                    <dd>
                      <strong className="font-semibold text-[var(--text)]">
                        Issued By:
                      </strong>{" "}
                      {c.issuer}
                    </dd>
                  </div>

                  <div>
                    <dt className="sr-only">Issue date</dt>
                    <dd>
                      <strong className="font-semibold text-[var(--text)]">
                        Issue Date:
                      </strong>{" "}
                      {c.date}
                    </dd>
                  </div>

                  <div className="font-mono text-xs">
                    <dt className="inline font-semibold text-[var(--text)]">
                      ID:{" "}
                    </dt>
                    <dd className="inline font-normal">{c.credentialId}</dd>
                  </div>
                </dl>

                <div className="mt-auto pt-4">
                  {c.verifyUrl ? (
                    <a
                      href={c.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost !min-h-10 !w-fit !px-4 !py-2 text-sm"
                    >
                      <ExternalLink size={15} aria-hidden="true" />
                      Verify Certificate
                      <span className="sr-only">(opens in new tab)</span>
                    </a>
                  ) : (
                    <span
                      className="btn btn-ghost !min-h-10 !w-fit !px-4 !py-2 text-sm opacity-50"
                      aria-disabled="true"
                      title="Verification link has not been added yet"
                    >
                      <ExternalLink size={15} aria-hidden="true" />
                      Verify Certificate
                    </span>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
