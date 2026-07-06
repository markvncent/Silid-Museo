import { useState, useEffect } from 'react';
import { getAllArtworkFeedback, getAllCategoryFeedback, deleteArtworkFeedback, deleteCategoryFeedback } from '../../services/feedback';
import { getAllRatings, deleteRating } from '../../services/ratings';
import categories from '../../data/categoryConfig';

const SUB_TABS = [
  { key: 'artwork_comments', label: 'Artwork Comments' },
  { key: 'category_comments', label: 'Category Comments' },
  { key: 'ratings', label: 'Ratings' },
];

/**
 * Admin moderation panel for reviewing and deleting feedback/ratings (FR-5.7).
 */
export default function ModerationList() {
  const [activeSubTab, setActiveSubTab] = useState('artwork_comments');
  const [artworkFeedback, setArtworkFeedback] = useState([]);
  const [categoryFeedback, setCategoryFeedback] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Build a lookup for category names
  const categoryLookup = {};
  categories.forEach((c) => { categoryLookup[c.id] = c.name; });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [af, cf, rt] = await Promise.allSettled([
        getAllArtworkFeedback(),
        getAllCategoryFeedback(),
        getAllRatings(),
      ]);
      setArtworkFeedback(af.status === 'fulfilled' ? af.value : []);
      setCategoryFeedback(cf.status === 'fulfilled' ? cf.value : []);
      setRatings(rt.status === 'fulfilled' ? rt.value : []);
    } catch (err) {
      console.error('Failed to load moderation data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArtworkFeedback = async (id) => {
    if (!confirm('Delete this comment?')) return;
    setDeletingId(id);
    try {
      await deleteArtworkFeedback(id);
      setArtworkFeedback((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete. Check Supabase RLS policies.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteCategoryFeedback = async (id) => {
    if (!confirm('Delete this comment?')) return;
    setDeletingId(id);
    try {
      await deleteCategoryFeedback(id);
      setCategoryFeedback((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete. Check Supabase RLS policies.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteRating = async (id) => {
    if (!confirm('Delete this rating?')) return;
    setDeletingId(id);
    try {
      await deleteRating(id);
      setRatings((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete. Check Supabase RLS policies.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const renderStars = (score) => {
    return '★'.repeat(score) + '☆'.repeat(5 - score);
  };

  return (
    <div className="space-y-5">
      {/* Sub-Tab Navigation */}
      <div className="flex gap-1 rounded-xl p-1 border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-subtle)' }}>
        {SUB_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveSubTab(tab.key)}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 ${
              activeSubTab === tab.key
                ? 'bg-amber-500/15 text-amber-400 shadow-sm'
                : 'hover:bg-white/5'
            }`}
            style={{ color: activeSubTab === tab.key ? undefined : 'var(--text-muted)' }}
          >
            {tab.label}
            <span className="ml-1.5 text-[10px] opacity-60">
              ({tab.key === 'artwork_comments' ? artworkFeedback.length : tab.key === 'category_comments' ? categoryFeedback.length : ratings.length})
            </span>
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl animate-pulse border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-subtle)' }} />
          ))}
        </div>
      ) : (
        <>
          {/* Artwork Comments Tab */}
          {activeSubTab === 'artwork_comments' && (
            <div className="space-y-2">
              {artworkFeedback.length === 0 ? (
                <EmptyState message="No artwork comments found." />
              ) : (
                artworkFeedback.map((fb) => (
                  <FeedbackRow
                    key={fb.id}
                    text={fb.comment_text}
                    meta={fb.artworks?.title || 'Unknown artwork'}
                    subMeta={categoryLookup[fb.artworks?.category_id] || ''}
                    date={formatDate(fb.created_at)}
                    deleting={deletingId === fb.id}
                    onDelete={() => handleDeleteArtworkFeedback(fb.id)}
                  />
                ))
              )}
            </div>
          )}

          {/* Category Comments Tab */}
          {activeSubTab === 'category_comments' && (
            <div className="space-y-2">
              {categoryFeedback.length === 0 ? (
                <EmptyState message="No category comments found." />
              ) : (
                categoryFeedback.map((fb) => (
                  <FeedbackRow
                    key={fb.id}
                    text={fb.comment_text}
                    meta={fb.categories?.name || 'Unknown category'}
                    date={formatDate(fb.created_at)}
                    deleting={deletingId === fb.id}
                    onDelete={() => handleDeleteCategoryFeedback(fb.id)}
                  />
                ))
              )}
            </div>
          )}

          {/* Ratings Tab */}
          {activeSubTab === 'ratings' && (
            <div className="space-y-2">
              {ratings.length === 0 ? (
                <EmptyState message="No ratings found." />
              ) : (
                ratings.map((rt) => (
                  <FeedbackRow
                    key={rt.id}
                    text={<span className="text-amber-500 tracking-wide">{renderStars(rt.score)}</span>}
                    meta={rt.artworks?.title || 'Unknown artwork'}
                    subMeta={`Score: ${rt.score}/5`}
                    date={formatDate(rt.created_at)}
                    deleting={deletingId === rt.id}
                    onDelete={() => handleDeleteRating(rt.id)}
                  />
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ─── Sub-components ────────────────────────────────── */

function FeedbackRow({ text, meta, subMeta, date, deleting, onDelete }) {
  return (
    <div
      className="flex items-start gap-4 rounded-xl border p-4 transition-all duration-200 hover:border-white/10"
      style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-subtle)' }}
    >
      <div className="flex-1 min-w-0">
        <div className="text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
          {text}
        </div>
        <div className="flex items-center gap-2 text-[11px] flex-wrap" style={{ color: 'var(--text-muted)' }}>
          <span className="font-medium text-amber-500/70">{meta}</span>
          {subMeta && (
            <>
              <span className="opacity-30">•</span>
              <span>{subMeta}</span>
            </>
          )}
          <span className="opacity-30">•</span>
          <span>{date}</span>
        </div>
      </div>
      <button
        onClick={onDelete}
        disabled={deleting}
        className="shrink-0 flex items-center gap-1 rounded-lg border border-red-500/20 bg-red-500/5 px-2.5 py-1.5 text-[11px] font-medium text-red-400 transition-all duration-200 hover:bg-red-500/15 hover:border-red-500/30 disabled:opacity-40"
      >
        {deleting ? '...' : 'Delete'}
      </button>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 rounded-xl border"
      style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-subtle)' }}
    >
      <span className="text-2xl mb-3 opacity-20">—</span>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{message}</p>
    </div>
  );
}
