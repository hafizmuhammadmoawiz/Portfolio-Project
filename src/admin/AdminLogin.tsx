import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Fingerprint,
  LockKeyhole,
  Mail,
  ShieldCheck,
  KeyRound,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "../lib/supabase";

type Stage = "credentials" | "mfa";
type Notice = { type: "error" | "success"; text: string } | null;

export default function AdminLogin() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [factorId, setFactorId] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function fail(message: string) {
    setNotice({ type: "error", text: message });
  }

  async function onCredentialsSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);
    if (!email.trim() || !password) {
      fail("Enter your administrator email and password.");
      return;
    }
    setBusy(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      if (!data.session)
        throw new Error("Sign-in did not create a session. Please try again.");

      const { data: factorsData, error: factorsError } =
        await supabase.auth.mfa.listFactors();
      if (factorsError) throw factorsError;
      const verifiedTotp = factorsData.totp?.find(
        (factor) => factor.status === "verified",
      );
      if (!verifiedTotp) {
        await supabase.auth.signOut();
        throw new Error(
          "No verified authenticator is enrolled for this account. Contact the site administrator to configure MFA.",
        );
      }

      const { data: assurance, error: assuranceError } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (assuranceError) throw assuranceError;
      if (assurance.currentLevel === "aal2") {
        await finishAdminAuthorization();
        return;
      }

      const { data: challenge, error: challengeError } =
        await supabase.auth.mfa.challenge({ factorId: verifiedTotp.id });
      if (challengeError) throw challengeError;
      setFactorId(verifiedTotp.id);
      setChallengeId(challenge.id);
      setStage("mfa");
      setNotice({
        type: "success",
        text: "Password accepted. Enter the current code from your authenticator app.",
      });
    } catch (error) {
      fail(
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function finishAdminAuthorization() {
    const { data, error } = await supabase.functions.invoke("admin-api", {
      body: { action: "authorize" },
    });
    if (error || data?.authorized !== true) {
      await supabase.auth.signOut();
      throw new Error(
        "This account is not authorized for the admin workspace.",
      );
    }
    navigate("/admin", { replace: true });
  }

  async function onMfaSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);
    const cleanOtp = otp.replace(/\s/g, "");
    if (!/^\d{6}$/.test(cleanOtp)) {
      fail("Enter the 6-digit code from your authenticator app.");
      return;
    }
    if (!factorId || !challengeId) {
      fail("Your verification session expired. Please sign in again.");
      setStage("credentials");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code: cleanOtp,
      });
      if (error)
        throw new Error(
          "Verification code is invalid or expired. Check your authenticator and try again.",
        );
      const { data: assurance, error: assuranceError } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (assuranceError) throw assuranceError;
      if (assurance.currentLevel !== "aal2") {
        throw new Error(
          "Second-factor verification is not complete. Please try a fresh code.",
        );
      }
      setNotice({
        type: "success",
        text: "Identity verified. Opening your secure workspace…",
      });
      await finishAdminAuthorization();
    } catch (error) {
      fail(
        error instanceof Error
          ? error.message
          : "Verification failed. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function backToCredentials() {
    setNotice(null);
    setOtp("");
    setFactorId("");
    setChallengeId("");
    setPassword("");
    setStage("credentials");

    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  }

  return (
    <main
      className={`admin-login min-h-screen overflow-hidden text-white ${mounted ? "is-ready" : ""}`}
    >
      <style>{`
        .admin-login{--base:#101426;min-height:100svh;position:relative;isolation:isolate;display:block;background:radial-gradient(ellipse at 12% 10%,rgba(123,92,255,.23),transparent 36%),radial-gradient(ellipse at 92% 18%,rgba(31,196,220,.15),transparent 34%),linear-gradient(145deg,#171a30 0%,#0d1120 58%,#151126 100%);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        .admin-login:before{content:"";position:fixed;inset:0;z-index:-2;pointer-events:none;opacity:.15;background-image:radial-gradient(rgba(218,225,255,.38) .65px,transparent .65px);background-size:19px 19px;mask-image:linear-gradient(to bottom,#000,transparent 92%)}
        .login-orb{position:absolute;z-index:-1;border-radius:999px;filter:blur(2px);pointer-events:none;animation:orb-drift 13s ease-in-out infinite alternate}
        .login-card{background:linear-gradient(145deg,rgba(39,44,70,.97),rgba(22,26,45,.98));border:1px solid rgba(164,176,229,.2);box-shadow:22px 22px 55px rgba(1,3,14,.46),-10px -10px 30px rgba(111,122,177,.075),inset 1px 1px 0 rgba(223,230,255,.09),inset -1px -1px 0 rgba(0,0,0,.24);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px)}
        .login-input{width:100%;min-width:0;border:1px solid rgba(164,176,229,.17);border-radius:15px;background:rgba(8,11,24,.48);color:#f8fafc;padding:13px 14px;outline:none;box-shadow:inset 3px 3px 8px rgba(1,3,14,.28),inset -1px -1px 0 rgba(220,230,255,.025);transition:border-color .2s,box-shadow .2s,background .2s}
        .login-input:focus{border-color:rgba(103,232,249,.65);background:rgba(8,11,24,.68);box-shadow:inset 2px 2px 6px rgba(1,3,14,.24),0 0 0 4px rgba(103,232,249,.08),0 0 22px rgba(103,232,249,.07)}
        .login-input::placeholder{color:rgba(226,232,240,.31)}
        .login-primary{background:linear-gradient(105deg,#8b5cf6 0%,#6d5df6 48%,#06b6d4 100%);box-shadow:0 10px 25px rgba(99,72,220,.24),inset 1px 1px 0 rgba(255,255,255,.24);transition:transform .2s,filter .2s,box-shadow .2s}
        .login-primary:hover:not(:disabled){transform:translateY(-2px);filter:brightness(1.08);box-shadow:0 15px 32px rgba(99,72,220,.3),inset 1px 1px 0 rgba(255,255,255,.25)}
        .login-primary:active:not(:disabled){transform:scale(.985)}
        .login-reveal{opacity:0;transform:translateY(18px) scale(.985);transition:opacity .7s ease,transform .7s cubic-bezier(.2,.8,.2,1)}
        .is-ready .login-reveal{opacity:1;transform:translateY(0) scale(1)}
        .login-reveal-delay{transition-delay:.12s}
        .login-visual{animation:visual-float 7s ease-in-out infinite}
        .login-ring{animation:ring-pulse 3.2s ease-in-out infinite}
        .login-code{letter-spacing:.45em;font-variant-numeric:tabular-nums}
        .login-login-mark{box-shadow:5px 5px 13px rgba(2,4,14,.35),-3px -3px 9px rgba(177,187,244,.1),inset 1px 1px 0 rgba(255,255,255,.16)}
        @keyframes orb-drift{from{transform:translate3d(-10px,-12px,0) scale(.96)}to{transform:translate3d(18px,20px,0) scale(1.06)}}
        @keyframes visual-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
        @keyframes ring-pulse{0%,100%{box-shadow:0 0 0 0 rgba(103,232,249,.08),inset 0 0 25px rgba(103,232,249,.025)}50%{box-shadow:0 0 0 12px rgba(103,232,249,0),inset 0 0 35px rgba(103,232,249,.08)}}
        @media(max-width:767px){.login-card{box-shadow:10px 12px 30px rgba(1,3,14,.4),-5px -5px 17px rgba(111,122,177,.055),inset 1px 1px 0 rgba(223,230,255,.07)}}
        @media(min-width:1024px){.admin-login .login-reveal{width:100%;min-width:0}.admin-login .login-card{max-width:100%}}
        .admin-login input[type="email"],.admin-login input[type="password"],.admin-login input[type="text"]{box-sizing:border-box}
        .admin-login label>span.relative>svg{z-index:1}
        .admin-login label>span.relative>input{position:relative;z-index:0}
        .admin-login label>span.relative>button{z-index:2}
        @media(prefers-reduced-motion:reduce){.admin-login *, .admin-login *:before,.admin-login *:after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}.login-reveal{opacity:1;transform:none}}
      `}</style>
      <div className="login-orb left-[-150px] top-[10%] h-72 w-72 bg-violet-500/15 blur-3xl" />
      <div className="login-orb right-[-150px] top-[18%] h-80 w-80 bg-cyan-400/10 blur-3xl" />
      <div className="login-orb bottom-[-170px] left-[35%] h-96 w-96 bg-fuchsia-500/10 blur-3xl" />

      <div className="relative flex min-h-screen w-full items-center justify-center px-4 py-6 sm:px-6">
        <section className="login-reveal mx-auto w-full max-w-[440px]">
          <div className="mb-5 flex items-center justify-center gap-3">
            <div className="login-login-mark flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-gradient-to-br from-violet-300/25 to-cyan-200/10">
              <Fingerprint size={25} className="text-cyan-100" />
            </div>
            <div>
              <p className="text-sm font-bold tracking-[.18em]">
                MOAWIZ<span className="text-cyan-300">.</span>
              </p>
              <p className="mt-1 text-[9px] uppercase tracking-[.25em] text-white/40">
                Creative OS · Admin
              </p>
            </div>
          </div>

          <div className="login-card rounded-[28px] p-6 sm:rounded-[32px] sm:p-9">
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[.045] text-cyan-100 shadow-inner">
                  {stage === "credentials" ? (
                    <KeyRound size={20} />
                  ) : (
                    <ShieldCheck size={21} />
                  )}
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-[.24em] text-cyan-100/70">
                  Secure access
                </p>
                <h1 className="mt-2 text-2xl font-semibold tracking-[-.035em] sm:text-[28px]">
                  {stage === "credentials"
                    ? "Welcome back."
                    : "Verify it’s you."}
                </h1>
                <p className="mt-2 max-w-xs text-xs leading-6 text-white/45">
                  {stage === "credentials"
                    ? "Sign in to your secure administrator workspace."
                    : "Enter the 6-digit code from your authenticator app."}
                </p>
              </div>
              <div className="hidden items-center gap-1.5 rounded-full border border-emerald-200/15 bg-emerald-300/[.06] px-2.5 py-1.5 text-[9px] text-emerald-100 sm:flex">
                <ShieldCheck size={12} /> Secure
              </div>
            </div>

            {notice && (
              <div
                role="status"
                aria-live="polite"
                className={`mb-5 flex items-start gap-2.5 rounded-2xl border px-3.5 py-3 text-xs leading-5 ${notice.type === "error" ? "border-rose-200/20 bg-rose-300/[.07] text-rose-100" : "border-emerald-200/20 bg-emerald-300/[.07] text-emerald-100"}`}
              >
                {notice.type === "error" ? (
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                ) : (
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                )}
                <span>{notice.text}</span>
              </div>
            )}

            {stage === "credentials" ? (
              <form onSubmit={onCredentialsSubmit} className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-xs font-medium text-white/70">
                    Administrator email
                  </span>
                  <span className="relative block">
                    <input
                      className="login-input pl-12 text-sm"
                      type="email"
                      autoComplete="username"
                      inputMode="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </span>
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-medium text-white/70">
                    Password
                  </span>
                  <span className="relative block">
                    <input
                      className="login-input pl-12 pr-12 text-sm"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-lg p-2 text-white/40 transition hover:bg-white/[.06] hover:text-white/80"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </span>
                </label>
                <div className="flex items-center justify-between gap-3 text-[10px] text-white/40">
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />{" "}
                    MFA verification required
                  </span>
                  <span>Admin access only</span>
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="login-primary flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-65"
                >
                  {busy ? (
                    <>
                      <LoaderCircle size={17} className="animate-spin" />{" "}
                      Verifying credentials…
                    </>
                  ) : (
                    <>
                      Continue securely <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={onMfaSubmit} className="space-y-5">
                <div className="rounded-2xl border border-cyan-100/10 bg-cyan-200/[.04] p-4">
                  <div className="flex items-center gap-2 text-cyan-100">
                    <Fingerprint size={18} />
                    <span className="text-xs font-semibold">
                      Authenticator verification
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] leading-5 text-white/45">
                    Open your enrolled authenticator app and enter its current
                    code.
                  </p>
                </div>
                <label className="block">
                  <span className="mb-2 block text-xs font-medium text-white/70">
                    6-digit verification code
                  </span>
                  <input
                    className="login-input login-code py-4 text-center text-xl font-semibold"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9 ]{6,8}"
                    maxLength={8}
                    autoFocus
                    required
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/[^0-9 ]/g, "").slice(0, 8))
                    }
                    placeholder="000 000"
                    aria-label="Authenticator verification code"
                  />
                </label>
                <button
                  type="submit"
                  disabled={busy}
                  className="login-primary flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-65"
                >
                  {busy ? (
                    <>
                      <LoaderCircle size={17} className="animate-spin" />{" "}
                      Verifying code…
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={17} /> Verify and open dashboard
                    </>
                  )}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void backToCredentials()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs text-white/50 transition hover:text-white/85 disabled:opacity-50"
                >
                  <ArrowLeft size={14} /> Back to sign in
                </button>
              </form>
            )}

            <div className="mt-7 border-t border-white/[.08] pt-5">
              <div className="flex items-center justify-center gap-2 text-[10px] text-white/35">
                <LockKeyhole size={12} /> Encrypted session{" "}
                <span className="text-white/15">·</span>
                <ShieldCheck size={12} /> MFA protected
              </div>
              <p className="mt-3 text-center text-[9px] leading-5 text-white/25">
                Authorized administrators only. Access is verified securely.
              </p>
            </div>
          </div>
          <p className="mt-5 text-center text-[10px] text-white/30">
            © {new Date().getFullYear()} Moawiz Studio · Secure admin portal
          </p>
        </section>
      </div>
    </main>
  );
}
