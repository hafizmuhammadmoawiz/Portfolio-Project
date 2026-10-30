import { useCallback, useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";

const script: { cmd: string; out: string }[] = [
  { cmd: "whoami", out: "Hafiz Muhammad Moawiz" },
  {
    cmd: "education",
    out: "BS Cybersecurity @ NUTECH University, Islamabad",
  },
  {
    cmd: "interests",
    out: "Web Security | Penetration Testing | CTFs",
  },
  { cmd: "mission", out: "Learn. Test. Secure. Repeat." },
];

export default function Terminal() {
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [step, setStep] = useState(reduce ? script.length : 0);
  const [chars, setChars] = useState(0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (reduce || step >= script.length) return;

    const cmd = script[step].cmd;
    const timer = window.setTimeout(
      () => {
        if (chars < cmd.length) {
          setChars((current) => current + 1);
        } else {
          setStep((current) => current + 1);
          setChars(0);
        }
      },
      chars === 0 ? 500 : chars < cmd.length ? 55 : 400,
    );

    return () => window.clearTimeout(timer);
  }, [step, chars, reduce, run]);

  const replay = useCallback(() => {
    setStep(0);
    setChars(0);
    setRun((current) => current + 1);
  }, []);

  const done = step >= script.length;

  return (
    <div
      className="w-full overflow-hidden rounded-2xl border border-[var(--accent-line)] shadow-[var(--shadow-hover)]"
      style={{ background: "var(--term-bg)" }}
    >
      {/* Terminal title bar */}
      <div
        className="flex min-h-12 items-center gap-2 border-b border-white/5 px-3 sm:px-4"
        style={{ background: "var(--term-bar)" }}
      >
        <span
          className="h-3 w-3 shrink-0 rounded-full bg-[#ff5f57]"
          aria-hidden="true"
        />
        <span
          className="h-3 w-3 shrink-0 rounded-full bg-[#febc2e]"
          aria-hidden="true"
        />
        <span
          className="h-3 w-3 shrink-0 rounded-full bg-[#28c840]"
          aria-hidden="true"
        />

        <span
          className="ml-2 min-w-0 flex-1 truncate font-mono text-xs sm:text-sm"
          style={{ color: "var(--term-dim)" }}
        >
          moawiz@sec-lab: ~
        </span>

        <button
          type="button"
          onClick={replay}
          aria-label="Replay terminal animation"
          title="Replay animation"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg transition hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
          style={{ color: "var(--term-dim)" }}
        >
          <RotateCcw size={15} aria-hidden="true" />
        </button>
      </div>

      <p className="sr-only">
        Terminal summary:{" "}
        {script.map((item) => `${item.cmd}: ${item.out}`).join(". ")}
      </p>

      {/* Terminal output */}
      <div
        aria-hidden="true"
        className="min-h-[15rem] space-y-3 px-3 py-5 font-mono text-xs leading-6 sm:space-y-4 sm:px-5 sm:py-6 sm:text-sm sm:leading-7"
        style={{ color: "var(--term-text)" }}
      >
        {script.map((item, index) => {
          if (index > step) return null;

          const typing = index === step;

          return (
            <div key={item.cmd} className="min-w-0">
              <div className="break-words">
                <span style={{ color: "var(--term-green)" }}>$</span>{" "}
                <span>{typing ? item.cmd.slice(0, chars) : item.cmd}</span>
                {typing && <span className="cursor" />}
              </div>

              {!typing && (
                <div className="mt-1 break-words pl-3 sm:pl-4">
                  <span style={{ color: "var(--term-dim)" }} className="mr-2">
                    └
                  </span>
                  {item.out.split(" | ").map((part, partIndex) => (
                    <span key={`${item.cmd}-${partIndex}`}>
                      {partIndex > 0 && (
                        <span style={{ color: "var(--term-dim)" }}> | </span>
                      )}
                      <span style={{ color: "var(--term-green)" }}>{part}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {done && (
          <div>
            <span style={{ color: "var(--term-green)" }}>$</span>{" "}
            <span className="cursor" />
          </div>
        )}
      </div>
    </div>
  );
}
