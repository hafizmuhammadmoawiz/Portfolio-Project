/**
 * Hero / home section.
 * Uses site details from config/site.ts and visual components such as NetworkCanvas
 * and Terminal. The onStartFlight prop is provided by App.tsx for the contact CTA.
 */
import { ArrowRight, Github, MapPin } from "lucide-react";
import { site } from "../config/site";
import NetworkCanvas from "./NetworkCanvas";
import Terminal from "./Terminal";

// Props passed from App.tsx to trigger the flight transition
type HeroProps = {
  onStartFlight: () => void;
};

export default function Hero({ onStartFlight }: HeroProps) {
  return (
    <section
      id="home"
      className="relative flex items-center overflow-hidden pt-24 pb-8 sm:pt-28 sm:pb-10 lg:min-h-screen lg:pt-24 lg:pb-12"
      aria-labelledby="hero-title"
    >
      {/* Background effects */}
      <div className="ambient" />
      <div className="grid-bg" />
      <NetworkCanvas className="opacity-70" />

      {/* Decorative geometric shapes */}
      <span className="geo left-[6%] top-[22%] h-40 w-40 rotate-12 rounded-3xl" />
      <span className="geo bottom-[12%] right-[44%] h-24 w-24 rotate-45" />

      {/* Main hero content: introduction and profile */}
      <div className="container-x relative grid items-center gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        {/* Introduction and headline */}
        <div className="order-1 lg:order-1">
          <p
            className="hero-in mb-2 text-lg font-medium text-muted sm:text-xl"
            style={{ ["--d" as string]: "100ms" }}
          >
            Hi, I'm
          </p>

          <p
            className="hero-in mb-5 font-display text-[clamp(2.5rem,8vw,4.5rem)] font-extrabold leading-tight tracking-tight text-[var(--text)]"
            style={{ ["--d" as string]: "125ms" }}
          >
            Hafiz M. Moawiz
          </p>

          {/* Profile picture: visible only on mobile */}
          <div className="order-2 mb-10 flex justify-center lg:hidden">
            <div className="float relative h-[220px] w-[220px] sm:h-[260px] sm:w-[260px]">
              <div
                className="absolute -inset-8 rounded-full blur-3xl"
                style={{ background: "var(--glow)" }}
                aria-hidden="true"
              />
              <div className="avatar-ring" aria-hidden="true" />
              <img
                src={site.profileImage}
                alt={site.profileAlt}
                width={360}
                height={360}
                fetchPriority="high"
                className="relative h-full w-full rounded-full border-2 border-[var(--accent-line)] object-cover [object-position:center_25%] shadow-[var(--shadow-hover)]"
              />
            </div>
          </div>

          {/* Section identifier */}
          <div
            className="hero-separator my-5 flex items-center gap-3"
            aria-hidden="true"
          >
            <span className="hero-separator-line" />
            <span className="hero-separator-dot" />
            <span className="font-mono text-[10px] tracking-[0.25em] text-accent">
              SEC_01
            </span>
          </div>

          {/* Main hero heading */}
          <h1
            id="hero-title"
            className="hero-in font-display text-[clamp(2.4rem,8vw,4.6rem)] font-extrabold leading-[1.02] tracking-[-0.03em]"
            style={{ ["--d" as string]: "150ms" }}
          >
            Breaking Assumptions.{" "}
            <span className="grad-text">Strengthening Security.</span>
          </h1>

          {/* Professional role */}
          <p
            className="hero-in mt-5 font-mono text-sm tracking-wide text-accent sm:text-base"
            style={{ ["--d" as string]: "280ms" }}
          >
            {site.role}
          </p>

          {/* Short professional introduction */}
          <p
            className="hero-in mt-5 max-w-xl text-[1.05rem] leading-relaxed text-muted"
            style={{ ["--d" as string]: "380ms" }}
          >
            I'm {site.name}, a cybersecurity student at NUTECH University,
            Islamabad. Driven by the challenge of web penetration
            testing—discovering vulnerabilities, breaking assumptions, and
            turning hands-on testing into stronger security.
          </p>

          {/* Hero action buttons */}
          <div
            className="hero-in mt-8 flex flex-wrap items-center gap-3"
            style={{ ["--d" as string]: "480ms" }}
          >
            {/* Navigate to the Projects section */}
            <a href="#projects" className="btn btn-primary">
              Explore My Work{" "}
              <ArrowRight size={18} aria-hidden="true" />
            </a>

            {/* Start the cinematic flight transition to Contact */}
            <button
              type="button"
              onClick={onStartFlight}
              className="btn btn-ghost"
            >
              Let's Connect
            </button>

            {/* External GitHub profile */}
            {site.github && (
              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
                aria-label="GitHub profile (opens in new tab)"
              >
                <Github size={18} aria-hidden="true" /> GitHub
              </a>
            )}
          </div>

          {/* Location information */}
          <p
            className="hero-in mt-8 flex items-center gap-2 text-sm text-muted"
            style={{ ["--d" as string]: "580ms" }}
          >
            <MapPin
              size={15}
              className="text-accent"
              aria-hidden="true"
            />
            {site.location}
          </p>
        </div>

        {/* Desktop profile picture and terminal */}
        <div
          className="hero-in order-2 mx-auto hidden w-full max-w-md flex-col items-center lg:flex lg:max-w-lg lg:items-end"
          style={{ ["--d" as string]: "300ms" }}
        >
          {/* Profile picture with glow effect */}
          <div className="float relative h-[320px] w-[320px]">
            <div
              className="absolute -inset-8 rounded-full blur-3xl"
              style={{ background: "var(--glow)" }}
              aria-hidden="true"
            />
            <div className="avatar-ring" aria-hidden="true" />
            <img
              src={site.profileImage}
              alt={site.profileAlt}
              width={360}
              height={360}
              fetchPriority="high"
              className="relative h-full w-full rounded-full border-2 border-[var(--accent-line)] object-cover [object-position:center_25%] shadow-[var(--shadow-hover)]"
            />
          </div>

          {/* Terminal preview */}
          <div className="relative z-10 mt-8 w-full lg:mt-10">
            <Terminal />
          </div>
        </div>

        {/* Terminal shown below the content on mobile */}
        <div className="order-3 w-full lg:hidden">
          <Terminal />
        </div>
      </div>

      {/* Scroll indicator: desktop only */}
      <a
        href="#about"
        aria-label="Scroll to About section"
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-muted lg:block"
      >
        <span className="block h-9 w-5 rounded-full border border-[var(--accent-line)]">
          <span className="float mx-auto mt-1.5 block h-2 w-1 rounded bg-[var(--accent)]" />
        </span>
      </a>
    </section>
  );
}
