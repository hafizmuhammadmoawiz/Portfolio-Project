import { ArrowRight, Github, MapPin } from "lucide-react";
import { site } from "../config/site";
import NetworkCanvas from "./NetworkCanvas";
import Terminal from "./Terminal";

export default function Hero() {
  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-16 lg:pt-24" aria-labelledby="hero-title">
      <div className="ambient" /><div className="grid-bg" /><NetworkCanvas className="opacity-70" />
      <span className="geo left-[6%] top-[22%] h-40 w-40 rotate-12 rounded-3xl" /><span className="geo bottom-[12%] right-[44%] h-24 w-24 rotate-45" />
      <div className="container-x relative grid items-center gap-14 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <p className="hero-in chip mb-6" style={{ ["--d" as string]: "50ms" }}><span className="pulse-dot" aria-hidden /> {site.learningStatus}</p>
          <h1 id="hero-title" className="hero-in font-display text-[clamp(2.4rem,5.4vw,4.6rem)] font-extrabold leading-[1.02] tracking-[-0.03em]" style={{ ["--d" as string]: "150ms" }}>
            Breaking Assumptions. <span className="grad-text">Strengthening Security.</span>
          </h1>
          <p className="hero-in mt-5 font-mono text-sm tracking-wide text-accent sm:text-base" style={{ ["--d" as string]: "280ms" }}>{site.role}</p>
          <p className="hero-in mt-5 max-w-xl text-[1.05rem] leading-relaxed text-muted" style={{ ["--d" as string]: "380ms" }}>
            I'm {site.name}, a cybersecurity student at NUTECH University, Islamabad. I explore web security, network security, ethical hacking, and practical security testing through continuous learning.
          </p>
          <div className="hero-in mt-8 flex flex-wrap items-center gap-3" style={{ ["--d" as string]: "480ms" }}>
            <a href="#projects" className="btn btn-primary">Explore My Work <ArrowRight size={18} aria-hidden /></a>
            <a href="#contact" className="btn btn-ghost">Let's Connect</a>
            {site.github && <a href={site.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" aria-label="GitHub profile (opens in new tab)"><Github size={18} aria-hidden /> GitHub</a>}
          </div>
          <p className="hero-in mt-8 flex items-center gap-2 text-sm text-muted" style={{ ["--d" as string]: "580ms" }}><MapPin size={15} className="text-accent" aria-hidden /> {site.location}</p>
        </div>

        <div className="hero-in mx-auto flex w-full max-w-md flex-col items-center lg:max-w-lg lg:items-end" style={{ ["--d" as string]: "300ms" }}>
          <div className="float relative h-[220px] w-[220px] sm:h-[260px] sm:w-[260px] lg:h-[320px] lg:w-[320px]">
            <div className="absolute -inset-8 rounded-full blur-3xl" style={{ background: "var(--glow)" }} aria-hidden />
            <div className="avatar-ring" aria-hidden />
            <img
                src={site.profileImage}
                alt={site.profileAlt}
                width={360}
                height={360}
                fetchPriority="high"
                className="relative h-full w-full rounded-full border-2 border-[var(--accent-line)] object-cover [object-position:center_25%] shadow-[var(--shadow-hover)]"
              />
          </div>
          <div className="relative z-10 mt-8 w-full lg:mt-10"><Terminal /></div>
        </div>
      </div>
      <a href="#about" aria-label="Scroll to About section" className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-muted lg:block">
        <span className="block h-9 w-5 rounded-full border border-[var(--accent-line)]"><span className="mx-auto mt-1.5 block h-2 w-1 rounded bg-[var(--accent)] float" /></span>
      </a>
    </section>
  );
}
