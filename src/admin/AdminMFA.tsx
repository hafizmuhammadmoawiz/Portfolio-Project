import { FormEvent, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AdminMFA() {
  const navigate = useNavigate();
  const location = useLocation();
  const factorId = location.state?.factorId as string | undefined;

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!factorId) {
      setError("MFA session missing hai. Dobara login karo.");
      return;
    }

    setLoading(true);

    try {
      const { data: challenge, error: challengeError } =
        await supabase.auth.mfa.challenge({ factorId });

      if (challengeError || !challenge) {
        console.error("MFA challenge error:", challengeError);
        setError(
          challengeError?.message ??
            "MFA challenge create nahi hua. Dobara try karo."
        );
        return;
      }

      const { error: verifyError } =
        await supabase.auth.mfa.verify({
          factorId,
          challengeId: challenge.id,
          code: code.trim(),
        });

      if (verifyError) {
        setError("Code incorrect ya expired hai.");
        return;
      }

      const { data: assurance, error: assuranceError } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

      if (assuranceError || assurance.currentLevel !== "aal2") {
        setError("MFA verification complete nahi hui.");
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        setError("Session nahi mili. Dobara login karo.");
        return;
      }

      const { data: functionData, error: functionError } =
        await supabase.functions.invoke("admin-api", {
          body: { action: "authorize" },
        });

      if (
        functionError ||
        functionData?.authorized !== true
      ) {
        setError(
          functionData?.error ??
            "Admin authorization failed. Is account ko access nahi hai.",
        );
        await supabase.auth.signOut();
        return;
      }

      navigate("/admin", { replace: true });
    } catch {
      setError("Verification ke waqt error aaya. Dobara try karo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 text-white">
      <form
        onSubmit={handleVerify}
        className="w-full max-w-md space-y-5 rounded-2xl border border-white/10 bg-neutral-900 p-8"
      >
        <h1 className="text-2xl font-semibold">Authenticator Verification</h1>
        <p className="text-sm text-neutral-400">
          Apni authenticator app se current 6-digit code enter karo.
        </p>

        <label className="block space-y-2 text-sm">
          Verification code
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            value={code}
            onChange={(event) =>
              setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
            }
            className="w-full rounded-lg border border-white/10 bg-neutral-800 px-4 py-3 text-center text-2xl tracking-[0.4em] outline-none focus:border-cyan-400"
          />
        </label>

        {error && (
          <p role="alert" className="rounded-lg bg-red-950 p-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || code.length !== 6}
          className="w-full rounded-lg bg-cyan-400 px-4 py-3 font-semibold text-neutral-950 disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify and continue"}
        </button>

        <Link
          to="/admin/login"
          className="block text-center text-sm text-neutral-400 hover:text-white"
        >
          Back to login
        </Link>
      </form>
    </main>
  );
}
