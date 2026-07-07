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

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  const url = new URL(req.url);
  const path = url.pathname.split("/admin").pop();
  console.log("Incoming path:", path, "| Full URL:", url.pathname);
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

    // ── Everything below requires a valid room key ──
    if (!(await requireValidAdmin(req))) {
      return json(
        {
          error:
            "Unauthorized — invalid or expired admin session",
        },
        401
      );
    }

    // ── ARTWORKS: add / update / delete ──
    if (path === "/artworks" && req.method === "POST") {
      const body = await req.json();
      const { data, error } = await supabaseAdmin
        .from("artworks")
        .insert({
          category_id: body.categoryId,
          title: body.title,
          description: body.description,
          media_url: body.mediaUrl,
          media_type: body.mediaType,
          thumbnail_url: body.thumbnailUrl ?? null,
        })
        .select()
        .single();
      if (error) return json({ error: error.message }, 400);
      return json(data);
    }

    if (path === "/artworks" && req.method === "PATCH") {
      const body = await req.json();
      const { data, error } = await supabaseAdmin
        .from("artworks")
        .update(body.updates)
        .eq("id", body.artworkId)
        .select()
        .single();
      if (error) return json({ error: error.message }, 400);
      return json(data);
    }

    if (path === "/artworks" && req.method === "DELETE") {
      const { artworkId } = await req.json();
      const { error } = await supabaseAdmin
        .from("artworks")
        .delete()
        .eq("id", artworkId);
      if (error) return json({ error: error.message }, 400);
      return json({ success: true });
    }

    // ── CATEGORIES: update ──
    // Same front desk, new department — the receptionist checks the
    // same room key, then walks the request down this hallway instead.
    if (path === "/categories" && req.method === "PATCH") {
      const body = await req.json();
      const { data, error } = await supabaseAdmin
        .from("categories")
        .update(body.updates)
        .eq("id", body.categoryId)
        .select()
        .single();
      if (error) return json({ error: error.message }, 400);
      return json(data);
    }

    // ── MEDIA: upload / delete ──
    if (path === "/media" && req.method === "POST") {
      const formData = await req.formData();
      const file = formData.get("file") as File;
      const categoryId = formData.get("categoryId") as string;
      if (!file || !categoryId) {
        return json({ error: "file and categoryId required" }, 400);
      }

      const ext = file.name.split(".").pop();
      const fileName = `${categoryId}/${crypto.randomUUID()}.${ext}`;

      const { data, error } = await supabaseAdmin.storage
        .from("artwork-media")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (error) return json({ error: error.message }, 400);

      const { data: urlData } = supabaseAdmin.storage
        .from("artwork-media")
        .getPublicUrl(data.path);

      return json({ path: data.path, publicUrl: urlData.publicUrl });
    }

    if (path === "/media" && req.method === "DELETE") {
      const { path: filePath } = await req.json();
      const { error } = await supabaseAdmin.storage
        .from("artwork-media")
        .remove([filePath]);
      if (error) return json({ error: error.message }, 400);
      return json({ success: true });
    }
// ── ARTWORK FEEDBACK: add / update / delete ──
    if (path === "/artwork-feedback" && req.method === "POST") {
      const body = await req.json();
      const { data, error } = await supabaseAdmin
        .from("artwork_feedback")
        .insert({ artwork_id: body.artworkId, comment_text: body.commentText })
        .select()
        .single();
      if (error) return json({ error: error.message }, 400);
      return json(data);
    }

    if (path === "/artwork-feedback" && req.method === "PATCH") {
      const body = await req.json();
      const { data, error } = await supabaseAdmin
        .from("artwork_feedback")
        .update(body.updates)
        .eq("id", body.feedbackId)
        .select()
        .single();
      if (error) return json({ error: error.message }, 400);
      return json(data);
    }

    if (path === "/artwork-feedback" && req.method === "DELETE") {
      const { feedbackId } = await req.json();
      const { error } = await supabaseAdmin
        .from("artwork_feedback")
        .delete()
        .eq("id", feedbackId);
      if (error) return json({ error: error.message }, 400);
      return json({ success: true });
    }

    // ── CATEGORY FEEDBACK: add / update / delete ──
    if (path === "/category-feedback" && req.method === "POST") {
      const body = await req.json();
      const { data, error } = await supabaseAdmin
        .from("category_feedback")
        .insert({ category_id: body.categoryId, comment_text: body.commentText })
        .select()
        .single();
      if (error) return json({ error: error.message }, 400);
      return json(data);
    }

    if (path === "/category-feedback" && req.method === "PATCH") {
      const body = await req.json();
      const { data, error } = await supabaseAdmin
        .from("category_feedback")
        .update(body.updates)
        .eq("id", body.feedbackId)
        .select()
        .single();
      if (error) return json({ error: error.message }, 400);
      return json(data);
    }

    if (path === "/category-feedback" && req.method === "DELETE") {
      const { feedbackId } = await req.json();
      const { error } = await supabaseAdmin
        .from("category_feedback")
        .delete()
        .eq("id", feedbackId);
      if (error) return json({ error: error.message }, 400);
      return json({ success: true });
    }

    // ── RATINGS: add / update / delete ──
    if (path === "/ratings" && req.method === "POST") {
      const body = await req.json();
      const { data, error } = await supabaseAdmin
        .from("ratings")
        .insert({ artwork_id: body.artworkId, score: body.score, voter_token: body.voterToken ?? null })
        .select()
        .single();
      if (error) return json({ error: error.message }, 400);
      return json(data);
    }

    if (path === "/ratings" && req.method === "PATCH") {
      const body = await req.json();
      const { data, error } = await supabaseAdmin
        .from("ratings")
        .update(body.updates)
        .eq("id", body.ratingId)
        .select()
        .single();
      if (error) return json({ error: error.message }, 400);
      return json(data);
    }

    if (path === "/ratings" && req.method === "DELETE") {
      const { ratingId } = await req.json();
      const { error } = await supabaseAdmin
        .from("ratings")
        .delete()
        .eq("id", ratingId);
      if (error) return json({ error: error.message }, 400);
      return json({ success: true });
    }
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