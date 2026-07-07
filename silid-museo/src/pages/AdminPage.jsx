import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../services/adminApi.js";

export default function AdminPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedCode = code.trim();

    if (!trimmedCode) {
      setError("Please enter the access code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 🔐 Calls Edge Function (validates ADMIN_ACCESS_CODE in backend)
      await adminLogin(trimmedCode);

      // optional UI state (keeps your existing logic)
      sessionStorage.setItem("isAdmin", "true");

      // redirect to dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Admin login error:", err);

      setError(
        err?.message === "Invalid access code"
          ? "Invalid access code."
          : err.message || "Unable to verify access code."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <section className="relative overflow-hidden py-20">
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "var(--bg-surface)" }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, var(--bg-overlay), var(--bg-primary))",
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
          <h1
            className="mb-4 text-4xl font-bold sm:text-5xl"
            style={{ color: "var(--text-primary)" }}
          >
            Admin Access
          </h1>

          <p
            className="mx-auto max-w-xl text-lg"
            style={{ color: "var(--text-muted)" }}
          >
            Enter your access code to manage gallery content.
          </p>
        </div>
      </section>

      {/* Login */}
      <section className="py-16">
        <div className="mx-auto max-w-md px-6">
          <div
            className="rounded-2xl border p-8"
            style={{
              borderColor: "var(--border-subtle)",
              backgroundColor: "var(--bg-surface)",
            }}
          >
            <div className="mb-6 text-center">
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-subtle)",
                  color: "var(--accent-gold)",
                }}
              >
                <span className="text-2xl">🔒</span>
              </div>

              <h2
                className="text-xl font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Enter Access Code
              </h2>

              <p
                className="mt-2 text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                This area is restricted to authorized administrators.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <input
                  type="password"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="off"
                  className="w-full rounded-xl border px-4 py-3.5 text-center text-sm tracking-[0.3em] outline-none transition-all duration-300"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-subtle)",
                    color: "var(--text-primary)",
                  }}
                />

                {error && (
                  <div className="rounded-lg bg-red-100 px-4 py-2 text-center text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{
                    backgroundColor: "var(--accent-gold)",
                  }}
                >
                  {loading ? "Verifying..." : "Unlock Admin Mode"}
                </button>
              </div>
            </form>

            <p
              className="mt-6 text-center text-xs italic"
              style={{ color: "var(--text-muted)" }}
            >
              Your access code is securely verified before admin access is granted.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}