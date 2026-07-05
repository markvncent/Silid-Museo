import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import categories from '../data/categoryConfig';
import { fallbackArtworks } from '../data/fallbackArtworks';
import { getArtworksByCategory } from '../services/artworks';
import { getCategoryFeedback, submitCategoryFeedback } from '../services/feedback';
import ArtworkCard from '../components/gallery/ArtworkCard';
import ArtworkModal from '../components/gallery/ArtworkModal';

export default function CategoryPage() {
  const { slug } = useParams();
  const category = categories.find((c) => c.slug === slug);

  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeArtwork, setActiveArtwork] = useState(null);

  // Category General Feedback States
  const [feedbackList, setFeedbackList] = useState([]);
  const [newFeedback, setNewFeedback] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  useEffect(() => {
    if (!category) return;
    
    // Reset page states
    setArtworks([]);
    setFeedbackList([]);
    setNewFeedback('');
    setActiveArtwork(null);
    setLoading(true);

    const loadData = async () => {
      let fetchedArtworks = [];
      let fetchedFeedback = [];

      try {
        // Try fetching artworks from Supabase
        try {
          fetchedArtworks = await getArtworksByCategory(category.id);
        } catch (e) {
          console.warn('Failed to fetch from Supabase, using mock fallback artworks');
        }

        // Try fetching general category comments
        try {
          fetchedFeedback = await getCategoryFeedback(category.id);
        } catch (e) {
          console.warn('Failed to fetch category feedback from Supabase');
        }
      } catch (err) {
        console.error('Data loading error:', err);
      } finally {
        // Fallback checks
        if (!fetchedArtworks || fetchedArtworks.length === 0) {
          fetchedArtworks = fallbackArtworks[category.slug] || [];
        }
        
        // Merge category feedback with localStorage category feedback
        const localFeedback = JSON.parse(localStorage.getItem(`cat_feedback_${category.slug}`) || '[]');
        const combinedFeedback = [...localFeedback, ...fetchedFeedback].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setArtworks(fetchedArtworks);
        setFeedbackList(combinedFeedback);
        setLoading(false);
      }
    };

    loadData();
  }, [slug, category]);

  const handleUpdateArtwork = (artworkId, updatedFields) => {
    setArtworks((prev) =>
      prev.map((art) => (art.id === artworkId ? { ...art, ...updatedFields } : art))
    );
    // If currently expanded in the modal, update its details
    if (activeArtwork && activeArtwork.id === artworkId) {
      setActiveArtwork((prev) => ({ ...prev, ...updatedFields }));
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!newFeedback.trim() || isSubmittingFeedback) return;
    setIsSubmittingFeedback(true);

    const feedbackObject = {
      id: `local-cat-feedback-${Date.now()}`,
      category_id: category.id,
      comment_text: newFeedback.trim(),
      created_at: new Date().toISOString()
    };

    try {
      // Try DB submit first
      try {
        await submitCategoryFeedback(category.id, newFeedback.trim());
        // Reload feedback
        const freshFeedback = await getCategoryFeedback(category.id);
        const localFeedback = JSON.parse(localStorage.getItem(`cat_feedback_${category.slug}`) || '[]');
        setFeedbackList([...localFeedback, ...freshFeedback].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        ));
        setNewFeedback('');
        return;
      } catch (dbErr) {
        console.warn('Database write failed, writing category feedback locally');
      }

      // Local storage fallback
      const localFeedback = JSON.parse(localStorage.getItem(`cat_feedback_${category.slug}`) || '[]');
      localFeedback.unshift(feedbackObject);
      localStorage.setItem(`cat_feedback_${category.slug}`, JSON.stringify(localFeedback));

      setFeedbackList((prev) => [feedbackObject, ...prev]);
      setNewFeedback('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

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
          <p className="mx-auto max-w-xl text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {category.description}
          </p>
        </div>
      </section>

      {/* Artworks Display Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Collection Pieces
            </h2>
            {artworks.some(art => art.is_fallback) && (
              <span className="text-xs px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
                Interactive Fallback Previews Loaded
              </span>
            )}
          </div>

          {loading ? (
            /* Skeleton Loading Grid Placeholders */
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((skeletonIndex) => (
                <div
                  key={skeletonIndex}
                  className="rounded-2xl border p-4 space-y-4 animate-pulse bg-neutral-900/30"
                  style={{ borderColor: 'var(--border-subtle)' }}
                >
                  <div className="aspect-[4/3] w-full rounded-xl bg-neutral-800/40" />
                  <div className="h-6 w-3/4 rounded bg-neutral-800/40" />
                  <div className="h-4 w-5/6 rounded bg-neutral-800/40" />
                  <div className="h-10 w-full rounded bg-neutral-800/40" />
                </div>
              ))}
            </div>
          ) : artworks.length === 0 ? (
            /* Empty State */
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
          ) : (
            /* Active Grid List */
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {artworks.map((artwork) => (
                <ArtworkCard
                  key={artwork.id}
                  artwork={artwork}
                  onClick={() => setActiveArtwork(artwork)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Category Level Feedback Section */}
      <section className="py-16" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="mb-2 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Exhibition Hall Feedback
          </h2>
          <p className="mb-8 text-sm" style={{ color: 'var(--text-muted)' }}>
            Share your general thoughts, notes, or reviews on the {category.name} collection.
          </p>

          {/* Feedback Submission Form */}
          <div
            className="rounded-2xl border p-6 mb-8"
            style={{
              borderColor: 'var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
            }}
          >
            <form onSubmit={handleFeedbackSubmit}>
              <textarea
                value={newFeedback}
                onChange={(e) => setNewFeedback(e.target.value)}
                className="w-full resize-none rounded-xl border p-4 text-sm outline-none transition-all duration-300 bg-neutral-900/40"
                style={{
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
                rows="3"
                placeholder="Write your feedback for this hall here..."
                required
              />
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmittingFeedback || !newFeedback.trim()}
                  className="rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                  style={{
                    backgroundColor: 'var(--accent-gold)',
                  }}
                >
                  {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          </div>

          {/* Category Feedback List */}
          <div className="space-y-4">
            {feedbackList.length === 0 ? (
              <p className="text-center text-xs italic py-6" style={{ color: 'var(--text-muted)' }}>
                No feedback submitted yet.
              </p>
            ) : (
              feedbackList.map((feedback) => (
                <div
                  key={feedback.id}
                  className="p-4 rounded-xl border text-xs leading-relaxed"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                  }}
                >
                  <p style={{ color: 'var(--text-secondary)' }}>{feedback.comment_text}</p>
                  <span className="block mt-2 text-[10px] text-right" style={{ color: 'var(--text-muted)' }}>
                    {new Date(feedback.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Back to Home Gallery */}
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
          Back to all rooms
        </Link>
      </section>

      {/* Lightbox / Artwork Modal */}
      {activeArtwork && (
        <ArtworkModal
          artwork={activeArtwork}
          onClose={() => setActiveArtwork(null)}
          onUpdateArtwork={handleUpdateArtwork}
        />
      )}
    </div>
  );
}
