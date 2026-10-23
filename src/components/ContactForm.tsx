import { useState, type FormEvent } from "react";
import { Check, Copy, Loader2, Send } from "lucide-react";
import { site } from "../config/site";

const init = { name: "", email: "", subject: "", message: "" };
type F = typeof init;
const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v: F): Partial<F> {
  const e: Partial<F> = {};
  if (!v.name.trim()) e.name = "Please enter your full name.";
  if (!v.email.trim()) e.email = "Please enter your email address.";
  else if (!re.test(v.email.trim())) e.email = "Enter a valid email, e.g. name@example.com.";
  if (!v.subject.trim()) e.subject = "Please add a subject.";
  if (v.message.trim().length < 10) e.message = "Please write at least 10 characters.";
  return e;
}

export default function ContactForm() {
  const [v, setV] = useState<F>(init);
  const [err, setErr] = useState<Partial<F>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof F, boolean>>>({});
  const [state, setState] = useState<"idle" | "loading" | "opened">("idle");
  const [copied, setCopied] = useState(false);

  const mailto = () => `mailto:${encodeURIComponent(site.email).replace("%40", "@")}?subject=${encodeURIComponent(v.subject.trim())}&body=${encodeURIComponent(`${v.message.trim()}\n\n— ${v.name.trim()}\n${v.email.trim()}`)}`;
  const set = (k: keyof F, val: string) => { const n = { ...v, [k]: val }; setV(n); if (touched[k]) setErr(validate(n)); };
  const blur = (k: keyof F) => { setTouched((t) => ({ ...t, [k]: true })); setErr(validate(v)); };

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate(v); setErr(e); setTouched({ name: true, email: true, subject: true, message: true });
    if (Object.keys(e).length) { (document.querySelector('[aria-invalid="true"]') as HTMLElement | null)?.focus(); return; }
    setState("loading");
    window.setTimeout(() => { window.location.href = mailto(); setState("opened"); }, 600);
  };
  const copy = async () => { try { await navigator.clipboard.writeText(`To: ${site.email}\nSubject: ${v.subject}\n\n${v.message}`); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* clipboard blocked */ } };

  const field = (k: keyof F, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, area = false) => {
    const id = `cf-${k}`, bad = touched[k] && err[k];
    const common = { id, name: k, value: v[k], required: true, "aria-invalid": bad ? true : undefined, "aria-describedby": bad ? `${id}-e` : undefined, className: "input", onBlur: () => blur(k) } as const;
    return (
      <div>
        <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">{label} <span className="text-accent" aria-hidden>*</span></label>
        {area ? <textarea {...common} rows={5} maxLength={3000} onChange={(e) => set(k, e.target.value)} className="input resize-y" />
          : <input {...common} {...props} maxLength={200} onChange={(e) => set(k, e.target.value)} />}
        {bad && <p id={`${id}-e`} role="alert" className="mt-1.5 text-sm text-[#e5484d]">{err[k]}</p>}
      </div>
    );
  };

  return (
    <form onSubmit={submit} noValidate className="card space-y-5 p-6 sm:p-8" aria-label="Contact form">
      <div className="grid gap-5 sm:grid-cols-2">{field("name", "Full Name", { autoComplete: "name" })}{field("email", "Email Address", { type: "email", autoComplete: "email" })}</div>
      {field("subject", "Email Subject")}
      {field("message", "Message", {}, true)}
      <button type="submit" disabled={state === "loading"} className="btn btn-primary w-full sm:w-auto">
        {state === "loading" ? <><Loader2 size={18} className="animate-spin" aria-hidden /> Preparing email…</> : <><Send size={18} aria-hidden /> Send Message</>}
      </button>
      <div aria-live="polite">
        {state === "opened" && (
          <div className="rounded-xl border border-[var(--accent-line)] bg-[var(--chip-bg)] p-4 text-sm">
            <p className="font-semibold">Your email app should have opened with a draft.</p>
            <p className="mt-1 text-muted">Nothing has been sent yet — please press Send in your email app. If nothing opened, copy the message and email {site.email} directly.</p>
            <div className="mt-3 flex flex-wrap gap-2"><a className="btn btn-ghost !min-h-10 !py-2 text-sm" href={mailto()}>Open email app again</a><button type="button" onClick={copy} className="btn btn-ghost !min-h-10 !py-2 text-sm">{copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}{copied ? "Copied" : "Copy message"}</button></div>
          </div>
        )}
      </div>
    </form>
  );
}
