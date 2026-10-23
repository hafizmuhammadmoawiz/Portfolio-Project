import { useRef, useState } from "react";
import { ArrowUpRight, Github, ExternalLink, X } from "lucide-react";
import { projects, type Project } from "../data/projects";
import Reveal, { SectionHead } from "./Reveal";

function Visual({ p, big }: { p: Project; big?: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-xl border border-line ${big ? "h-40" : "h-36"}`} style={{ background: "linear-gradient(135deg, var(--bg-2), var(--card))" }}>
      {p.image ? <img src={p.image} alt={`${p.title} screenshot`} loading="lazy" className="h-full w-full object-cover" /> : (
        <>
          <div className="grid-bg !animate-none opacity-80" />
          <span className="absolute left-4 top-3 font-display text-5xl font-extrabold text-accent/30">{p.number}</span>
          <p.icon className="absolute bottom-4 right-4 text-accent" size={44} strokeWidth={1.4} aria-hidden />
        </>
      )}
    </div>
  );
}

function LinkBtn({ href, label, icon: Icon, missing }: { href?: string; label: string; icon: typeof Github; missing: string }) {
  return href
    ? <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn-ghost !min-h-10 !px-4 !py-2 text-sm"><Icon size={16} aria-hidden />{label}<span className="sr-only"> (opens in new tab)</span></a>
    : <span className="btn btn-ghost !min-h-10 !px-4 !py-2 text-sm" aria-disabled="true" title={missing}><Icon size={16} aria-hidden />{label}<span className="sr-only"> — {missing}</span></span>;
}

export default function Projects() {
  const dlg = useRef<HTMLDialogElement>(null);
  const [sel, setSel] = useState<Project | null>(null);
  const open = (p: Project) => { setSel(p); requestAnimationFrame(() => dlg.current?.showModal()); };
  const close = () => dlg.current?.close();

  return (
    <section id="projects" className="section" >
      <div className="container-x">
        <SectionHead index="03" label="Projects" title="Things I've built and explored." lead="Educational and lab-based work. Repository and demo links appear once they are public." />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={(i % 2) * 120} className="h-full">
              <article className="card card-hover flex h-full flex-col p-6">
                <Visual p={p} />
                <div className="mt-5 flex items-baseline gap-3"><span className="font-mono text-sm text-accent">{p.number}</span><h3 className="font-display text-xl font-bold leading-snug">{p.title}</h3></div>
                <p className="mt-3 text-sm leading-relaxed text-muted">{p.description}</p>
                <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies">{p.tech.map((t) => <li key={t} className={`chip ${p.techEditable ? "chip-warn" : ""}`}>{t}</li>)}</ul>
                <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-line pt-5 mt-6">
                  <button type="button" onClick={() => open(p)} className="btn btn-primary !min-h-10 !px-4 !py-2 text-sm" aria-haspopup="dialog">View Details <ArrowUpRight size={16} aria-hidden /></button>
                  <LinkBtn href={p.github} label="Code" icon={Github} missing="Repository not published yet" />
                  <LinkBtn href={p.demo} label="Demo" icon={ExternalLink} missing="Demo not available" />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
      <dialog ref={dlg} className="modal" aria-labelledby="modal-title" onClose={() => setSel(null)} onClick={(e) => e.target === dlg.current && close()}>
        {sel && (
          <div className="overflow-y-auto p-6 sm:p-8" style={{ maxHeight: "calc(100dvh - 2rem)" }}>
            <div className="flex items-start justify-between gap-4">
              <div><p className="font-mono text-sm text-accent">Project {sel.number}</p><h3 id="modal-title" className="font-display text-2xl font-extrabold leading-tight">{sel.title}</h3></div>
              <button type="button" onClick={close} aria-label="Close project details" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line hover:border-[var(--accent-line)]"><X size={18} aria-hidden /></button>
            </div>
            <div className="mt-5"><Visual p={sel} big /></div>
            <p className="mt-5 leading-relaxed text-muted">{sel.details}</p>
            <h4 className="mt-6 font-mono text-xs uppercase tracking-[.14em] text-accent">Highlights</h4>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm marker:text-[var(--accent)]">{sel.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
            <div className="mt-5 flex flex-wrap gap-2">{sel.tech.map((t) => <span key={t} className="chip">{t}</span>)}</div>
            <div className="mt-6 flex flex-wrap gap-2"><LinkBtn href={sel.github} label="Code" icon={Github} missing="Repository not published yet" /><LinkBtn href={sel.demo} label="Demo" icon={ExternalLink} missing="Demo not available" /></div>
          </div>
        )}
      </dialog>
    </section>
  );
}
