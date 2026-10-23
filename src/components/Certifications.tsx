import { Award, ExternalLink } from "lucide-react";
import { certifications, type Certification } from "../data/certifications";
import Reveal, { SectionHead } from "./Reveal";

function Thumb({ c }: { c: Certification }) {
  if (c.image) return <img src={c.image} alt={`${c.title} certificate`} loading="lazy" width={400} height={280} className="aspect-[10/7] w-full rounded-xl border border-line object-cover" />;
  return (
    <div className="relative grid aspect-[10/7] place-items-center overflow-hidden rounded-xl border border-dashed border-[var(--accent-line)]" style={{ background: "linear-gradient(135deg,var(--bg-2),var(--card))" }} role="img" aria-label={`Placeholder thumbnail for ${c.title}`}>
      <div className="absolute inset-3 rounded-lg border border-line" aria-hidden />
      <div className="text-center"><Award className="mx-auto text-accent" size={40} strokeWidth={1.4} aria-hidden /><p className="mt-2 font-display text-sm font-bold">Certificate of {c.category}</p><div className="mx-auto mt-2 h-1 w-20 rounded bg-[var(--line)]" /><div className="mx-auto mt-1.5 h-1 w-14 rounded bg-[var(--line)]" /></div>
      <span className="absolute right-3 top-3 -rotate-6 rounded border border-[var(--accent-line)] px-2 py-0.5 font-mono text-[.65rem] tracking-widest text-accent">SAMPLE</span>
    </div>
  );
}

export default function Certifications() {
  return (
    <section id="certifications" className="section relative overflow-hidden !bg-[#05050675]">
      <div className="container-x">
        <SectionHead index="06" label="Certifications" title="Credentials, once earned." lead="These cards are placeholders. No certification is claimed until real details and images are added." />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {certifications.map((c, i) => (
            <Reveal key={c.title} delay={i * 100} className="h-full">
              <article className="card card-hover flex h-full flex-col p-5">
                <Thumb c={c} />
                {c.placeholder && <span className="chip chip-warn mt-4 self-start">Placeholder</span>}
                <h3 className="mt-3 font-display text-lg font-bold leading-snug">{c.title}</h3>
                <dl className="mt-2 space-y-1 text-sm text-muted"><div><dt className="sr-only">Issuer</dt><dd>{c.issuer}</dd></div><div><dt className="sr-only">Date</dt><dd>{c.date}</dd></div><div className="font-mono text-xs"><dt className="inline">ID: </dt><dd className="inline">{c.credentialId}</dd></div></dl>
                <div className="mt-auto pt-4">
                  {c.verifyUrl ? <a href={c.verifyUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost !min-h-10 !px-4 !py-2 text-sm"><ExternalLink size={15} aria-hidden /> Verify<span className="sr-only"> (opens in new tab)</span></a>
                    : <span className="btn btn-ghost !min-h-10 !px-4 !py-2 text-sm" aria-disabled="true"><ExternalLink size={15} aria-hidden /> Verification unavailable</span>}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
