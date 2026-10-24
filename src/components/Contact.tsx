
/**
 * Contact section.
 * Uses site contact details from config/site.ts, ContactForm.tsx for form UI,
 * NetworkCanvas.tsx for the decorative network, and Reveal.tsx for reveal effects.
 */

import {
  Download,
  Github,
  Linkedin,
  Mail,
  ArrowUpRight,
} from "lucide-react";

import { site } from "../config/site";
import ContactForm from "./ContactForm";
import NetworkCanvas from "./NetworkCanvas";
import Reveal from "./Reveal";

function ContactNetworkLines() {
  const nodes = [
    [55, 20],
    [170, 65],
    [290, 15],
    [390, 85],
    [500, 25],
    [590, 110],
    [240, 175],
    [430, 190],
    [535, 250],
    [330, 275],
    [120, 245],
  ];

  const lines = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [1, 6],
    [2, 6],
    [6, 7],
    [3, 7],
    [7, 8],
    [6, 9],
    [9, 10],
    [10, 6],
    [7, 9],
  ];

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 650 300"
      preserveAspectRatio="xMidYMid slice"
      className="contact-network pointer-events-none absolute inset-0 h-full w-full"
    >
      <defs>
        <linearGradient id="contactLineGradient">
          <stop
            offset="0%"
            stopColor="currentColor"
            stopOpacity="0.05"
          />
          <stop
            offset="50%"
            stopColor="currentColor"
            stopOpacity="0.8"
          />
          <stop
            offset="100%"
            stopColor="currentColor"
            stopOpacity="0.1"
          />
        </linearGradient>
      </defs>

      <g
        stroke="url(#contactLineGradient)"
        strokeWidth="1.4"
        fill="none"
      >
        {lines.map(([from, to], index) => (
          <line
            key={index}
            x1={nodes[from][0]}
            y1={nodes[from][1]}
            x2={nodes[to][0]}
            y2={nodes[to][1]}
            className="contact-network-line"
            style={{ animationDelay: `${index * 0.18}s` }}
          />
        ))}
      </g>

      {nodes.map(([x, y], index) => (
        <g key={index}>
          <circle
            cx={x}
            cy={y}
            r={index % 3 === 0 ? 8 : 5}
            fill="currentColor"
            opacity="0.10"
          />
          <circle
            cx={x}
            cy={y}
            r={index % 3 === 0 ? 4 : 2.5}
            fill="currentColor"
            className="contact-network-node"
            style={{ animationDelay: `${index * 0.25}s` }}
          />
        </g>
      ))}
    </svg>
  );
}

type LinkCardProps = {
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
  note?: string;
};

function LinkCard({
  icon: Icon,
  label,
  value,
  href,
  external = true,
  note,
}: LinkCardProps) {
  const className =
    "card card-hover group flex min-w-0 items-center gap-4 rounded-xl border border-line p-4 transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_8px_30px_-12px_rgba(var(--glow),0.2)]";

  const content = (
    <>
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-line bg-[var(--chip-bg)] text-accent transition-colors duration-300 group-hover:border-accent/40">
        <Icon size={22} aria-hidden="true" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="mb-1 block text-xs uppercase tracking-[0.16em] text-muted">
          {label}
        </span>

        <span className="block truncate font-semibold text-ink">
          {value}
        </span>

        {note && (
          <span className="mt-1 block text-xs text-muted">
            {note}
          </span>
        )}
      </span>

      {href && (
        <ArrowUpRight
          size={18}
          className="shrink-0 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
          aria-hidden="true"
        />
      )}
    </>
  );

  if (!href) {
    return (
      <div
        className={`${className} cursor-not-allowed opacity-70`}
        aria-disabled="true"
      >
        {content}
      </div>
    );
  }

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={className}
      aria-label={`${label}: ${value}`}
    >
      {content}
    </a>
  );
}

export default function Contact() {
  return (
    <section
      id="contact"
      className="section section-alt relative isolate overflow-hidden"
      aria-labelledby="contact-heading"
    >
      {/* Background effects */}
      <div
        className="ambient pointer-events-none"
        aria-hidden="true"
      />
      <NetworkCanvas className="pointer-events-none opacity-40" />

      <div className="container-x relative z-10">
        {/* Contact hero */}
        <Reveal>
          <div className="contact-hero contact-hero-tilted relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-line p-6 sm:p-10 lg:p-12">
            <ContactNetworkLines />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/[0.06] via-transparent to-transparent" />

            <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              {/* Intro */}
              <div>
                <p className="eyebrow">
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_rgba(var(--glow),0.8)]" />
                  07 / Contact
                </p>

                <h2
                  id="contact-heading"
                  className="mt-4 text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl"
                >
                  Let&apos;s Build
                  <span className="grad-text glow-text mt-1 block">
                    Something Secure.
                  </span>
                </h2>

                <p className="lead mt-5 max-w-xl">
                  Have a project idea, security collaboration, internship
                  opportunity, or question? I&apos;d love to hear from you.
                </p>

                <p className="mt-5 flex items-center gap-2 text-sm text-muted">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
                  Open to cybersecurity opportunities and collaboration
                </p>

                {site.cv && (
                  <a
                    href={site.cv}
                    download
                    className="mt-7 inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 font-medium transition-all duration-300 hover:border-accent hover:bg-accent/5 hover:text-accent"
                  >
                    <Download size={17} aria-hidden="true" />
                    Download CV
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                )}
              </div>

              {/* Contact links */}
              <div className="grid gap-3">
                <LinkCard
                  icon={Mail}
                  label="Email"
                  value="Let's Talk"
                  href={`mailto:${site.email}`}
                  external={false}
                  note="Get in touch with me"
                />

                <LinkCard
                  icon={Github}
                  label="GitHub"
                  value="Explore My Projects"
                  href={site.github || undefined}
                  note="Explore my work and code"
                />

                <LinkCard
                  icon={Linkedin}
                  label="LinkedIn"
                  value="Let's Connect"
                  href={site.linkedin || undefined}
                  note="Connect with me professionally"
                />
              </div>
            </div>

            {/* Decorative bottom accent */}
            <div
              className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-accent/50 to-transparent"
              aria-hidden="true"
            />
          </div>
        </Reveal>

        {/* Contact form */}
        <Reveal delay={120}>
          <div className="mx-auto mt-12 max-w-3xl">
            <div className="mb-6 text-center">
              <p className="eyebrow justify-center">
                <Mail size={14} aria-hidden="true" />
                Get in touch
              </p>

              <h3 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                Send Me a Message
              </h3>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted sm:text-base">
                Tell me about your idea, project, or opportunity. Fill out
                the form below to prepare your message.
              </p>
            </div>

            <div className="card rounded-2xl border border-line p-5 sm:p-8">
              <ContactForm />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
