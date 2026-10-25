
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const allowedOrigins = new Set([
  "http://127.0.0.1:5173",
  "http://localhost:5173",
  "https://portfolio-project-nine-dusky.vercel.app",
]);

function getCorsHeaders(origin: string | null) {
  const allowedOrigin =
    origin && allowedOrigins.has(origin) ? origin : "";

  return {
    ...(allowedOrigin ? { "Access-Control-Allow-Origin": allowedOrigin } : {}),
    "Vary": "Origin",
    "Access-Control-Allow-Headers":
      "authorization, apikey, content-type, x-client-info",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };
}

function respond(
  body: unknown,
  status = 200,
  origin: string | null = null,
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: getCorsHeaders(origin),
  });
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("Origin");

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: getCorsHeaders(origin),
    });
  }

  if (req.method !== "POST") {
    return respond({ error: "Method not allowed" }, 405, origin);
  }

  const authorization = req.headers.get("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return respond({ error: "Authentication required" }, 401, origin);
  }

  const token = authorization.slice("Bearer ".length).trim();

  if (!token || token.split(".").length !== 3) {
    return respond({ error: "Invalid authentication token" }, 401, origin);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const publishableKey =
    Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ??
    Deno.env.get("SUPABASE_ANON_KEY");
  const adminUserId = Deno.env.get("ADMIN_USER_ID");

  if (!supabaseUrl || !publishableKey || !adminUserId) {
    return respond({ error: "Server configuration incomplete" }, 500, origin);
  }

  const supabase = createClient(supabaseUrl, publishableKey, {
    global: {
      headers: { Authorization: `Bearer ${token}` },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);

  if (userError || !user) {
    return respond({ error: "Invalid or expired session" }, 401, origin);
  }

  if (user.id !== adminUserId) {
    return respond({ error: "Forbidden" }, 403, origin);
  }

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims(token);

  if (claimsError || !claimsData?.claims) {
    return respond({ error: "Unable to verify session claims" }, 401, origin);
  }

  if (claimsData.claims.aal !== "aal2") {
    return respond({ error: "MFA verification required" }, 403, origin);
  }

  return respond({
    authorized: true,
    message: "Admin authentication and MFA verified",
  }, 200, origin);
});

