import { useState, useEffect } from 'react';
import {
  getAllArtworkFeedback,
  getAllCategoryFeedback,
  createArtworkFeedbackAdmin,
  updateArtworkFeedback,
  deleteArtworkFeedback,
  createCategoryFeedbackAdmin,
  updateCategoryFeedback,
  deleteCategoryFeedback,
} from '../../services/feedback.js';
import {
  getAllRatings,
  createRatingAdmin,
  updateRating,
  deleteRating,
} from '../../services/ratings.js';
import categories from '../../data/categoryConfig.js';
import { supabase } from '../../lib/supabase.js';

const SUB_TABS = [
  { key: 'artwork_comments', label: 'Artwork Comments' },
  { key: 'category_comments', label: 'Category Comments' },
  { key: 'ratings', label: 'Ratings' },
];

/**
 * Admin moderation panel for reviewing, creating, editing and deleting
 * feedback/ratings (FR-5.7).
 */
export default function ModerationList() {
  const [activeSubTab, setActiveSubTab] = useState('artwork_comments');
  const [artworkFeedback, setArtworkFeedback] = useState([]);
  const [categoryFeedback, setCategoryFeedback] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [artworkOptions, setArtworkOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null); // covers delete + save + create

  // New-entry form state (shared shape across tabs)
  const [newTargetId, setNewTargetId] = useState('');
  const [newText, setNewText] = useState('');
  const [newScore, setNewScore] = useState(5);

  // Inline-edit state
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editScore, setEditScore] = useState(5);

  const categoryLookup = {};
  categories.forEach((c) => { categoryLookup[c.id] = c.name; });

  useEffect(() => {
    loadAll();
    loadArtworkOptions();
  }, []);

  // Reset the "new entry" form whenever the tab changes, so stale
  // values from one tab don't leak into another.
  useEffect(() => {
    setNewTargetId('');
    setNewText('');
    setNewScore(5);
    setEditingId(null);
  }, [activeSubTab]);

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

  // Read-only lookup list for the "attach to artwork" dropdown.
  // Public SELECT, so it uses the direct client — no admin badge
  // needed just to browse titles.
  const loadArtworkOptions = async () => {
    const { data, error } = await supabase
      .from('artworks')
      .select('id, title, category_id')
      .order('title');
    if (!error) setArtworkOptions(data || []);
  };

  /* ── Create ──────────────────────────────────────── */

  const handleCreateArtworkComment = async () => {
    if (!newTargetId || !newText.trim()) return;
    setBusyId('new');
    try {
      const created = await createArtworkFeedbackAdmin(newTargetId, newText.trim());
      const artwork = artworkOptions.find((a) => a.id === newTargetId);
      setArtworkFeedback((prev) => [{ ...created, artworks: artwork }, ...prev]);
      setNewTargetId('');
      setNewText('');
    } catch (err) {
      console.error(err);
      alert('Failed to add comment.');
    } finally {
      setBusyId(null);
    }
  };

  const handleCreateCategoryComment = async () => {
    if (!newTargetId || !newText.trim()) return;
    setBusyId('new');
    try {
      const created = await createCategoryFeedbackAdmin(newTargetId, newText.trim());
      const category = { name: categoryLookup[newTargetId] };
      setCategoryFeedback((prev) => [{ ...created, categories: category }, ...prev]);
      setNewTargetId('');
      setNewText('');
    } catch (err) {
      console.error(err);
      alert('Failed to add comment.');
    } finally {
      setBusyId(null);
    }
  };

  const handleCreateRating = async () => {
    if (!newTargetId) return;
    setBusyId('new');
    try {
      const created = await createRatingAdmin(newTargetId, newScore);
      const artwork = artworkOptions.find((a) => a.id === newTargetId);
      setRatings((prev) => [{ ...created, artworks: artwork }, ...prev]);
      setNewTargetId('');
      setNewScore(5);
    } catch (err) {
      console.error(err);
      alert('Failed to add rating.');
    } finally {
      setBusyId(null);
    }
  };

  /* ── Edit ────────────────────────────────────────── */

  const startEdit = (row) => {
    setEditingId(row.id);
    setEditText(row.comment_text ?? '');
    setEditScore(row.score ?? 5);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveArtworkEdit = async (id) => {
    setBusyId(id);
    try {
      const updated = await updateArtworkFeedback(id, { comment_text: editText.trim() });
      setArtworkFeedback((prev) => prev.map((f) => (f.id === id ? { ...f, ...updated } : f)));
      cancelEdit();
    } catch (err) {
      console.error(err);
      alert('Failed to save edit.');
    } finally {
      setBusyId(null);
    }
  };

  const saveCategoryEdit = async (id) => {
    setBusyId(id);
    try {
      const updated = await updateCategoryFeedback(id, { comment_text: editText.trim() });
      setCategoryFeedback((prev) => prev.map((f) => (f.id === id ? { ...f, ...updated } : f)));
      cancelEdit();
    } catch (err) {
      console.error(err);
      alert('Failed to save edit.');
    } finally {
      setBusyId(null);
    }
  };

  const saveRatingEdit = async (id) => {
    setBusyId(id);
    try {
      const updated = await updateRating(id, { score: editScore });
      setRatings((prev) => prev.map((r) => (r.id === id ? { ...r, ...updated } : r)));
      cancelEdit();
    } catch (err) {
      console.error(err);
      alert('Failed to save edit.');
    } finally {
      setBusyId(null);
    }
  };

  /* ── Delete ──────────────────────────────────────── */

  const handleDeleteArtworkFeedback = async (id) => {
    if (!confirm('Delete this comment?')) return;
    setBusyId(id);
    try {
      await deleteArtworkFeedback(id);
      setArtworkFeedback((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete. Check Supabase RLS policies.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteCategoryFeedback = async (id) => {
    if (!confirm('Delete this comment?')) return;
    setBusyId(id);
    try {
      await deleteCategoryFeedback(id);
      setCategoryFeedback((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete. Check Supabase RLS policies.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteRating = async (id) => {
    if (!confirm('Delete this rating?')) return;
    setBusyId(id);
    try {
      await deleteRating(id);
      setRatings((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete. Check Supabase RLS policies.');
    } finally {
      setBusyId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const renderStars = (score) => '★'.repeat(score) + '☆'.repeat(5 - score);

  return (
    <div className="space-y-5">
      {/* Sub-Tab Navigation */}
      <div className="flex gap-1 rounded-xl p-1 border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-subtle)' }}>
        {SUB_TABS.map((tab) => (
          <button
          type="button"
            key={tab.key}
            onClick={() => setActiveSubTab(tab.key)}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 ${
              activeSubTab === tab.key ? 'bg-amber-500/15 text-amber-400 shadow-sm' : 'hover:bg-white/5'
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

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl animate-pulse border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-subtle)' }} />
          ))}
        </div>
      ) : (
        <>
          {/* Artwork Comments */}
          {activeSubTab === 'artwork_comments' && (
            <div className="space-y-2">
              <NewCommentForm
                targetLabel="Artwork"
                options={artworkOptions.map((a) => ({ value: a.id, label: a.title }))}
                targetId={newTargetId}
                onTargetChange={setNewTargetId}
                text={newText}
                onTextChange={setNewText}
                onSubmit={handleCreateArtworkComment}
                busy={busyId === 'new'}
              />
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
                    busy={busyId === fb.id}
                    isEditing={editingId === fb.id}
                    editText={editText}
                    onEditTextChange={setEditText}
                    onEdit={() => startEdit(fb)}
                    onSaveEdit={() => saveArtworkEdit(fb.id)}
                    onCancelEdit={cancelEdit}
                    onDelete={() => handleDeleteArtworkFeedback(fb.id)}
                  />
                ))
              )}
            </div>
          )}

          {/* Category Comments */}
          {activeSubTab === 'category_comments' && (
            <div className="space-y-2">
              <NewCommentForm
                targetLabel="Category"
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
                targetId={newTargetId}
                onTargetChange={setNewTargetId}
                text={newText}
                onTextChange={setNewText}
                onSubmit={handleCreateCategoryComment}
                busy={busyId === 'new'}
              />
              {categoryFeedback.length === 0 ? (
                <EmptyState message="No category comments found." />
              ) : (
                categoryFeedback.map((fb) => (
                  <FeedbackRow
                    key={fb.id}
                    text={fb.comment_text}
                    meta={fb.categories?.name || 'Unknown category'}
                    date={formatDate(fb.created_at)}
                    busy={busyId === fb.id}
                    isEditing={editingId === fb.id}
                    editText={editText}
                    onEditTextChange={setEditText}
                    onEdit={() => startEdit(fb)}
                    onSaveEdit={() => saveCategoryEdit(fb.id)}
                    onCancelEdit={cancelEdit}
                    onDelete={() => handleDeleteCategoryFeedback(fb.id)}
                  />
                ))
              )}
            </div>
          )}

          {/* Ratings */}
          {activeSubTab === 'ratings' && (
            <div className="space-y-2">
              <NewRatingForm
                options={artworkOptions.map((a) => ({ value: a.id, label: a.title }))}
                targetId={newTargetId}
                onTargetChange={setNewTargetId}
                score={newScore}
                onScoreChange={setNewScore}
                onSubmit={handleCreateRating}
                busy={busyId === 'new'}
              />
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
                    busy={busyId === rt.id}
                    isEditing={editingId === rt.id}
                    isRating
                    editScore={editScore}
                    onEditScoreChange={setEditScore}
                    onEdit={() => startEdit(rt)}
                    onSaveEdit={() => saveRatingEdit(rt.id)}
                    onCancelEdit={cancelEdit}
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

function NewCommentForm({ targetLabel, options, targetId, onTargetChange, text, onTextChange, onSubmit, busy }) {
  return (
    <div className="rounded-xl border p-4 space-y-2" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-subtle)' }}>
      <div className="text-[11px] font-semibold text-amber-500/70">Add {targetLabel} Comment</div>
      <select
        value={targetId}
        onChange={(e) => onTargetChange(e.target.value)}
        className="w-full rounded-lg border bg-transparent px-2 py-1.5 text-xs"
        style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
      >
        <option value="">Select {targetLabel.toLowerCase()}…</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <textarea
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Comment text…"
        rows={2}
        className="w-full rounded-lg border bg-transparent px-2 py-1.5 text-xs resize-none"
        style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
      />
      <button
      type="button"
        onClick={onSubmit}
        disabled={busy || !targetId || !text.trim()}
        className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-[11px] font-medium text-amber-400 disabled:opacity-40"
      >
        {busy ? 'Adding…' : 'Add Comment'}
      </button>
    </div>
  );
}

function NewRatingForm({ options, targetId, onTargetChange, score, onScoreChange, onSubmit, busy }) {
  return (
    <div className="rounded-xl border p-4 space-y-2" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-subtle)' }}>
      <div className="text-[11px] font-semibold text-amber-500/70">Add Rating</div>
      <select
        value={targetId}
        onChange={(e) => onTargetChange(e.target.value)}
        className="w-full rounded-lg border bg-transparent px-2 py-1.5 text-xs"
        style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
      >
        <option value="">Select artwork…</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <StarPicker score={score} onChange={onScoreChange} />
      <button
      type="button"
        onClick={onSubmit}
        disabled={busy || !targetId}
        className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-[11px] font-medium text-amber-400 disabled:opacity-40"
      >
        {busy ? 'Adding…' : 'Add Rating'}
      </button>
    </div>
  );
}

function StarPicker({ score, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`text-lg leading-none ${n <= score ? 'text-amber-500' : 'text-white/20'}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function FeedbackRow({
  text, meta, subMeta, date, busy, onDelete,
  isEditing, onEdit, onSaveEdit, onCancelEdit,
  editText, onEditTextChange,
  isRating, editScore, onEditScoreChange,
}) {
  return (
    <div
      className="flex items-start gap-4 rounded-xl border p-4 transition-all duration-200 hover:border-white/10"
      style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-subtle)' }}
    >
      <div className="flex-1 min-w-0">
        {isEditing ? (
          isRating ? (
            <StarPicker score={editScore} onChange={onEditScoreChange} />
          ) : (
            <textarea
              value={editText}
              onChange={(e) => onEditTextChange(e.target.value)}
              rows={2}
              className="w-full rounded-lg border bg-transparent px-2 py-1.5 text-xs resize-none mb-1"
              style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
              autoFocus
            />
          )
        ) : (
          <div className="text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{text}</div>
        )}
        <div className="flex items-center gap-2 text-[11px] flex-wrap" style={{ color: 'var(--text-muted)' }}>
          <span className="font-medium text-amber-500/70">{meta}</span>
          {subMeta && (<><span className="opacity-30">•</span><span>{subMeta}</span></>)}
          <span className="opacity-30">•</span>
          <span>{date}</span>
        </div>
      </div>

      <div className="shrink-0 flex items-center gap-2">
        {isEditing ? (
          <>
            <button
            type="button"
              onClick={onSaveEdit}
              disabled={busy}
              className="rounded-lg border border-green-500/20 bg-green-500/5 px-2.5 py-1.5 text-[11px] font-medium text-green-400 hover:bg-green-500/15 disabled:opacity-40"
            >
              {busy ? '...' : 'Save'}
            </button>
            <button
            type="button"
              onClick={onCancelEdit}
              disabled={busy}
              className="rounded-lg border px-2.5 py-1.5 text-[11px] font-medium hover:bg-white/5 disabled:opacity-40"
              style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
            type="button"
              onClick={onEdit}
              className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-2.5 py-1.5 text-[11px] font-medium text-amber-400 hover:bg-amber-500/15"
            >
              Edit
            </button>
            <button
            type="button"
              onClick={onDelete}
              disabled={busy}
              className="rounded-lg border border-red-500/20 bg-red-500/5 px-2.5 py-1.5 text-[11px] font-medium text-red-400 hover:bg-red-500/15 disabled:opacity-40"
            >
              {busy ? '...' : 'Delete'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 rounded-xl border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-subtle)' }}>
      <span className="text-2xl mb-3 opacity-20">—</span>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{message}</p>
    </div>
  );
}