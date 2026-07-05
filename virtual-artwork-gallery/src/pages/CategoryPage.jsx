import { useParams, Link } from 'react-router-dom';
import categories from '../data/categoryConfig';

export default function CategoryPage() {
  const { slug } = useParams();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <h1 className="mb-4 text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Category Not Found
        </h1>
        <p className="mb-8" style={{ color: 'var(--text-muted)' }}>
          The category you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300"
          style={{
            backgroundColor: 'var(--accent-gold)',
            color: 'var(--bg-primary)',
            boxShadow: '0 4px 14px var(--accent-gold-glow)',
          }}
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Category Header */}
      <section className="relative overflow-hidden py-20">
        <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-10`} />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, var(--bg-overlay), var(--bg-primary))',
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
          <div className="mb-4 text-6xl">{category.icon}</div>
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl" style={{ color: 'var(--text-primary)' }}>
            {category.name}
          </h1>
          <p className="mx-auto max-w-xl text-lg" style={{ color: 'var(--text-muted)' }}>
            {category.description}
          </p>
        </div>
      </section>

      {/* Artwork Grid (Empty State) */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-8 text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Artworks
          </h2>

          <div
            className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center"
            style={{
              borderColor: 'var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
            }}
          >
            <div className="mb-4 text-5xl opacity-40">&#128444;</div>
            <h3 className="mb-2 text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>
              No artworks uploaded yet
            </h3>
            <p className="max-w-md text-sm" style={{ color: 'var(--text-muted)' }}>
              Artworks for this category will appear here once they are added through the admin panel.
            </p>
          </div>
        </div>
      </section>

      {/* Category Feedback Section (Placeholder) */}
      <section className="py-16" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="mb-6 text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Category Feedback
          </h2>
          <p className="mb-8 text-sm" style={{ color: 'var(--text-muted)' }}>
            Share your thoughts about this collection.
          </p>

          {/* Feedback Form Placeholder */}
          <div
            className="rounded-2xl border p-6"
            style={{
              borderColor: 'var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
            }}
          >
            <textarea
              className="w-full resize-none rounded-xl border p-4 text-sm outline-none transition-all duration-300"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
              rows="3"
              placeholder="Write your feedback here..."
              disabled
            />
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="cursor-not-allowed rounded-xl px-6 py-2.5 text-sm font-semibold opacity-50 text-white"
                style={{
                  backgroundColor: 'var(--accent-gold)',
                }}
                disabled
              >
                Submit Feedback
              </button>
            </div>
          </div>

          <p className="mt-4 text-center text-xs italic" style={{ color: 'var(--text-muted)' }}>
            Feedback submission will be enabled once the backend is connected.
          </p>
        </div>
      </section>

      {/* Back to Gallery */}
      <section className="pb-16 text-center">
        <Link
          to="/#gallery"
          className="inline-flex items-center gap-2 text-sm transition-colors duration-300"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          Back to all categories
        </Link>
      </section>
    </div>
  );
}
