export const config = {
  verify_jwt: false,
};

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Your custom secrets
const TOKEN_SECRET = Deno.env.get("ADMIN_TOKEN_SECRET")!;
const ACCESS_CODE = Deno.env.get("access_code")!;

const TOKEN_TTL_SECONDS = 60 * 60 * 4;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods":
    "GET, POST, PATCH, DELETE, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

async function sign(payload: object): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(TOKEN_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const payloadB64 = btoa(JSON.stringify(payload));

  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payloadB64)
  );

  const sigB64 = btoa(
    String.fromCharCode(...new Uint8Array(sig))
  );

  return `${payloadB64}.${sigB64}`;
}

async function verifyToken(token: string): Promise<boolean> {
  try {
    const [payloadB64, sigB64] = token.split(".");

    if (!payloadB64 || !sigB64) {
      return false;
    }

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(TOKEN_SECRET),
      {
        name: "HMAC",
        hash: "SHA-256",
      },
      false,
      ["verify"]
    );

    const sigBytes = Uint8Array.from(
      atob(sigB64),
      (c) => c.charCodeAt(0)
    );

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      new TextEncoder().encode(payloadB64)
    );

    if (!valid) {
      return false;
    }

    const payload = JSON.parse(atob(payloadB64));

    return payload.exp > Date.now();
  } catch {
    return false;
  }
}

async function requireValidAdmin(
  req: Request
): Promise<boolean> {
  const auth =
    req.headers.get("Authorization") || "";

  const token = auth.replace("Bearer ", "");

  if (!token) {
    return false;
  }

  return await verifyToken(token);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace("/admin", "");

  const supabaseAdmin = createClient(
    SUPABASE_URL,
    SERVICE_ROLE_KEY
  );

  try {
    // LOGIN
    if (path === "/login" && req.method === "POST") {
      const { code } = await req.json();

      console.log(
        "Received code:",
        JSON.stringify(code)
      );

      console.log(
        "Expected code:",
        JSON.stringify(ACCESS_CODE)
      );

      if (!code) {
        return json(
          { error: "Code required" },
          400
        );
      }

      if (!ACCESS_CODE) {
        return json(
          {
            error:
              "access_code secret is not configured",
          },
          500
        );
      }

      if (code !== ACCESS_CODE) {
        return json(
          {
            error: "Invalid access code",
          },
          401
        );
      }

      const token = await sign({
        role: "admin",
        exp:
          Date.now() +
          TOKEN_TTL_SECONDS * 1000,
      });

      return json({
        token,
        expiresIn: TOKEN_TTL_SECONDS,
      });
    }

    // Protected Routes
    if (!(await requireValidAdmin(req))) {
      return json(
        {
          error:
            "Unauthorized — invalid or expired admin session",
        },
        401
      );
    }

    // KEEP ALL YOUR EXISTING ARTWORKS AND MEDIA ROUTES HERE

    return json(
      { error: "Not found" },
      404
    );
  } catch (err) {
    return json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Internal error",
      },
      500
    );
  }
});