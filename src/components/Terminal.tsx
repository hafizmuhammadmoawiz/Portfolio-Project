import { useCallback, useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";

const script: { cmd: string; out: string }[] = [
  { cmd: "whoami", out: "hafiz-muhammad-moawiz" },
  { cmd: "education", out: "BS Cybersecurity @ NUTECH" },
  { cmd: "interests", out: "web_security | pentesting | networking" },
  { cmd: "mission", out: "learn. test. secure. repeat." },
];

export default function Terminal() {
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [step, setStep] = useState(reduce ? script.length : 0);
  const [chars, setChars] = useState(0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (reduce || step >= script.length) return;
    const cmd = script[step].cmd;
    const t = window.setTimeout(() => {
      if (chars < cmd.length) setChars(chars + 1);
      else { setStep(step + 1); setChars(0); }
    }, chars === 0 ? 500 : chars < cmd.length ? 60 : 450);
    return () => clearTimeout(t);
  }, [step, chars, reduce, run]);

  const replay = useCallback(() => { setStep(0); setChars(0); setRun((r) => r + 1); }, []);
  const done = step >= script.length;

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--accent-line)] shadow-[var(--shadow-hover)]" style={{ background: "var(--term-bg)" }}>
      <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: "var(--term-bar)" }}>
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" aria-hidden /><span className="h-3 w-3 rounded-full bg-[#febc2e]" aria-hidden /><span className="h-3 w-3 rounded-full bg-[#28c840]" aria-hidden />
        <span className="ml-2 flex-1 truncate font-mono text-xs" style={{ color: "var(--term-dim)" }}>moawiz@sec-lab: ~</span>
        <button type="button" onClick={replay} aria-label="Replay terminal animation" className="grid h-8 w-8 place-items-center rounded-md transition hover:bg-black/10" style={{ color: "var(--term-dim)" }}><RotateCcw size={14} aria-hidden /></button>
      </div>
      <p className="sr-only">Terminal summary: {script.map((s) => `${s.cmd}: ${s.out}`).join(". ")}</p>
      <div aria-hidden className="min-h-[13.5rem] space-y-0.5 px-4 py-4 font-mono text-[.8rem] leading-6 sm:text-sm sm:leading-7" style={{ color: "var(--term-text)" }}>
        {script.map((s, i) => {
          if (i > step) return null;
          const typing = i === step;
          return (
            <div key={s.cmd}>
              <div><span style={{ color: "var(--term-green)" }}>$</span> {typing ? s.cmd.slice(0, chars) : s.cmd}{typing && <span className="cursor" />}</div>
              {!typing && <div className="pl-3 break-words">{s.out.split(" | ").map((p, k) => <span key={k}>{k > 0 && <span style={{ color: "var(--term-dim)" }}> | </span>}<span style={{ color: "var(--term-green)" }}>{p}</span></span>)}</div>}
            </div>
          );
        })}
        {done && <div><span style={{ color: "var(--term-green)" }}>$</span> <span className="cursor" /></div>}
      </div>
    </div>
  );
}
