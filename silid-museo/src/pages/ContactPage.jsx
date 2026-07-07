export default function ContactPage() {
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
            Get in Touch
          </h1>
          <p className="mx-auto max-w-xl text-lg" style={{ color: 'var(--text-muted)' }}>
            Have a question or want to collaborate? We would love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16">
        <div className="mx-auto max-w-2xl px-6">
          <div
            className="rounded-2xl border p-8"
            style={{
              borderColor: 'var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
            }}
          >
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-2 block text-sm font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-300 focus:ring-1"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-primary)',
                    }}
                    placeholder="Your name"
                    disabled
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-2 block text-sm font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-300 focus:ring-1"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-primary)',
                    }}
                    placeholder="you@example.com"
                    disabled
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-2 block text-sm font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows="5"
                    className="w-full resize-none rounded-xl border p-4 text-sm outline-none transition-all duration-300 focus:ring-1"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-primary)',
                    }}
                    placeholder="Tell us what is on your mind..."
                    disabled
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full cursor-not-allowed rounded-xl px-8 py-3.5 text-sm font-semibold opacity-50 text-white"
                  style={{
                    backgroundColor: 'var(--accent-gold)',
                  }}
                  disabled
                >
                  Send Message
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-xs italic" style={{ color: 'var(--text-muted)' }}>
              Contact form will be functional once the backend is connected.
            </p>
          </div>

          {/* Alternative contact */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <div
              className="rounded-2xl border p-6 text-center"
              style={{
                borderColor: 'var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
              }}
            >
              <div className="mb-3 text-2xl" style={{ color: 'var(--accent-gold)' }}>&#9993;</div>
              <h3 className="mb-1 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Email</h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>hello@virtualgallery.com</p>
            </div>
            <div
              className="rounded-2xl border p-6 text-center"
              style={{
                borderColor: 'var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
              }}
            >
              <div className="mb-3 text-2xl" style={{ color: 'var(--accent-gold)' }}>&#9826;</div>
              <h3 className="mb-1 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Location</h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Manila, Philippines</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
