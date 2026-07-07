import { useState } from 'react';
import { updateCategory } from '../../services/categories';

/**
 * Inline edit form for a single category's details (FR-5.6).
 * Shows editable fields for name, description, expanded_description, and cover_image_url.
 */
export default function CategoryForm({ category, onSaved, onCancel }) {
  const [name, setName] = useState(category?.name || '');
  const [description, setDescription] = useState(category?.description || '');
  const [expandedDescription, setExpandedDescription] = useState(category?.expanded_description || '');
  const [coverImageUrl, setCoverImageUrl] = useState(category?.cover_image_url || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setError('Category name is required.'); return; }

    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      await updateCategory(category.id, {
        name: name.trim(),
        description: description.trim(),
        expanded_description: expandedDescription.trim(),
        cover_image_url: coverImageUrl.trim() || null,
      });
      setSuccess(true);
      onSaved?.();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Category update error:', err);
      setError(err.message || 'Failed to update category. Check Supabase RLS policies.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border p-5 space-y-4 transition-all duration-300"
      style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-subtle)' }}
    >
      {/* Category Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-amber-500/50 shrink-0" />
          <div>
            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              {category?.name || 'Category'}
            </h3>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              ID: {category?.id?.slice(0, 8)}...
            </p>
          </div>
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
          Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:ring-1 focus:ring-amber-500/30"
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
        />
      </div>

      {/* Short Description */}
      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
          Short Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="2"
          className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-all duration-200 resize-none focus:ring-1 focus:ring-amber-500/30"
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
        />
      </div>

      {/* Expanded Description */}
      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
          Expanded Description
        </label>
        <textarea
          value={expandedDescription}
          onChange={(e) => setExpandedDescription(e.target.value)}
          rows="4"
          className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-all duration-200 resize-none focus:ring-1 focus:ring-amber-500/30"
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
        />
      </div>

      {/* Cover Image URL */}
      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
          Cover Image URL
        </label>
        <input
          type="url"
          value={coverImageUrl}
          onChange={(e) => setCoverImageUrl(e.target.value)}
          placeholder="https://..."
          className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:ring-1 focus:ring-amber-500/30"
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
        />
        {coverImageUrl && (
          <div className="mt-2 rounded-lg overflow-hidden border h-24 w-40" style={{ borderColor: 'var(--border-subtle)' }}>
            <img src={coverImageUrl} alt="Cover preview" className="h-full w-full object-cover" />
          </div>
        )}
      </div>

      {/* Error / Success */}
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs text-emerald-400">
          Category updated successfully!
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border px-4 py-2 text-xs font-medium transition-all duration-200 hover:bg-white/5"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg px-5 py-2 text-xs font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
          style={{ backgroundColor: 'var(--accent-gold)' }}
        >
          {saving ? 'Saving...' : 'Save Category'}
        </button>
      </div>
    </form>
  );
}
