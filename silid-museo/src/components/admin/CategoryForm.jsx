import { useState, useRef } from 'react';
import { updateCategory } from '../../services/categories.js';
import { uploadMedia } from '../../services/storage.js';

/**
 * Inline edit form for a single category's details (FR-5.6).
 * Shows editable fields for name, description, expanded_description, and cover_image_url.
 */
export default function CategoryForm({ category, onSaved, onCancel }) {
  const [name, setName] = useState(category?.name || '');
  const [description, setDescription] = useState(category?.description || '');
  const [expandedDescription, setExpandedDescription] = useState(category?.expanded_description || '');
  const [coverImageUrl, setCoverImageUrl] = useState(category?.cover_image_url || '');
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setError('Category name is required.'); return; }

    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      let finalCoverImageUrl = coverImageUrl;
      
      // Upload file if new one is selected
      if (file) {
        const result = await uploadMedia(file, category.id);
        finalCoverImageUrl = result.publicUrl;
      }

      await updateCategory(category.id, {
        name: name.trim(),
        description: description.trim(),
        expanded_description: expandedDescription.trim(),
        cover_image_url: finalCoverImageUrl ? finalCoverImageUrl.trim() : null,
      });

      // Reset file selection since it is now uploaded
      setFile(null);
      if (finalCoverImageUrl) {
        setCoverImageUrl(finalCoverImageUrl);
      }

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

      {/* Cover Image Upload */}
      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
          Cover Image (Carousel Cover)
        </label>
        <div
          onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
          onDragOver={(e) => { e.preventDefault(); }}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files?.[0]) {
              const dropped = e.dataTransfer.files[0];
              if (dropped.type.startsWith('image/')) {
                setFile(dropped);
              } else {
                setError('Cover image must be an image file.');
              }
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-xl border-2 border-dashed p-4 text-center transition-all duration-300 ${
            dragActive
              ? 'border-amber-500/50 bg-amber-500/5'
              : 'border-white/10 hover:border-white/20 bg-neutral-900/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => {
              const selected = e.target.files?.[0];
              if (selected) {
                if (selected.type.startsWith('image/')) {
                  setFile(selected);
                } else {
                  setError('Cover image must be an image file.');
                }
              }
            }}
            className="hidden"
            accept="image/*"
          />
          {file ? (
            <div className="space-y-1">
              <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                {file.name} (Ready to upload)
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="text-[10px] text-red-400 hover:text-red-300 font-semibold underline"
              >
                Cancel
              </button>
            </div>
          ) : coverImageUrl ? (
            <div className="space-y-2">
              <img
                src={coverImageUrl}
                alt="Current Cover"
                className="mx-auto h-16 w-auto rounded border border-white/10 object-cover"
              />
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                Drag & drop a new image here, or <span className="text-amber-500 font-medium">browse</span> to replace
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCoverImageUrl('');
                  setFile(null);
                }}
                className="text-[10px] text-red-400 hover:text-red-300 font-semibold underline"
              >
                Remove Cover Image
              </button>
            </div>
          ) : (
            <div className="space-y-1.5 py-1">
              <div className="text-xs font-medium opacity-30" style={{ color: 'var(--text-muted)' }}>Upload Cover Image</div>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                Drag & drop an image here, or <span className="text-amber-500 font-medium">browse</span>
              </p>
            </div>
          )}
        </div>
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
