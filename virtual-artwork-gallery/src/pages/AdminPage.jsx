import { useState } from 'react';

export default function AdminPage() {
  const [code, setCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Admin authentication will be implemented in a future phase
    alert('Admin authentication is not yet implemented. This is a wireframe.');
  };

  return (
    <div>
      {/* Header */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0" style={{ backgroundColor: 'var(--bg-surface)' }} />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, var(--bg-overlay), var(--bg-primary))',
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl" style={{ color: 'var(--text-primary)' }}>
            Admin Access
          </h1>
          <p className="mx-auto max-w-xl text-lg" style={{ color: 'var(--text-muted)' }}>
            Enter your access code to manage gallery content.
          </p>
        </div>
      </section>

      {/* Admin Gate */}
      <section className="py-16">
        <div className="mx-auto max-w-md px-6">
          <div
            className="rounded-2xl border p-8"
            style={{
              borderColor: 'var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
            }}
          >
            <div className="mb-6 text-center">
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--accent-gold)',
                }}
              >
                <span className="text-2xl">&#128274;</span>
              </div>
              <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                Enter Access Code
              </h2>
              <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                This area is restricted to authorized administrators.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <input
                  type="password"
                  id="admin-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3.5 text-center text-sm tracking-[0.3em] outline-none transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                  placeholder="&bull; &bull; &bull; &bull; &bull; &bull;"
                />
                <button
                  type="submit"
                  className="w-full rounded-xl px-8 py-3.5 text-sm font-semibold transition-all duration-300 text-white"
                  style={{
                    backgroundColor: 'var(--accent-gold)',
                  }}
                >
                  Unlock Admin Mode
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-xs italic" style={{ color: 'var(--text-muted)' }}>
              Admin authentication will be implemented in a future phase.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
