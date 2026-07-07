import { useState, useRef } from 'react';
import { uploadMedia, detectMediaType } from '../../services/storage';
import { addArtwork, updateArtwork } from '../../services/artworks';
import categories from '../../data/categoryConfig';

/**
 * Modal form for adding or editing an artwork (FR-5.3, FR-5.4).
 * - Add mode: categoryId is passed, artwork is null
 * - Edit mode: artwork object is passed with existing data
 */
export default function ArtworkForm({ artwork, categoryId, onClose, onSaved }) {
  const isEdit = !!artwork;

  const [title, setTitle] = useState(artwork?.title || '');
  const [description, setDescription] = useState(artwork?.description || '');
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    categoryId || artwork?.category_id || categories[0]?.id || ''
  );
  const [mediaType, setMediaType] = useState(artwork?.media_type || 'image');
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      const dropped = e.dataTransfer.files[0];
      setFile(dropped);
      setMediaType(detectMediaType(dropped));
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setMediaType(detectMediaType(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required.'); return; }
    if (!isEdit && !file) { setError('Please upload a media file.'); return; }

    setSaving(true);
    setError('');

    try {
      let mediaUrl = artwork?.media_url || '';

      // Upload new file if provided
      if (file) {
        const result = await uploadMedia(file, selectedCategoryId);
        mediaUrl = result.publicUrl;
      }

      if (isEdit) {
        // Update existing artwork
        const updates = {
          title: title.trim(),
          description: description.trim(),
          media_type: mediaType,
        };
        if (file) updates.media_url = mediaUrl;
        await updateArtwork(artwork.id, updates);
      } else {
        // Add new artwork
        await addArtwork({
          categoryId: selectedCategoryId,
          title: title.trim(),
          description: description.trim(),
          mediaUrl,
          mediaType,
        });
      }

      onSaved?.();
      onClose();
    } catch (err) {
      console.error('Artwork save error:', err);
      setError(err.message || 'Failed to save artwork. Check Supabase RLS policies.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border p-6 sm:p-8 shadow-2xl"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800/80 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-all"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
          {isEdit ? 'Edit Artwork' : 'Add New Artwork'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Artwork title..."
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-300 focus:ring-1 focus:ring-amber-500/30"
              style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this artwork..."
              rows="3"
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-300 resize-none focus:ring-1 focus:ring-amber-500/30"
              style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Category
            </label>
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-300 focus:ring-1 focus:ring-amber-500/30"
              style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Media Type */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Media Type
            </label>
            <div className="flex gap-2 flex-wrap">
              {['image', 'audio', 'video', 'text', 'sculpture'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setMediaType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all duration-200 ${
                    mediaType === type
                      ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      : 'bg-transparent border-white/5 hover:border-white/15'
                  }`}
                  style={{ color: mediaType === type ? undefined : 'var(--text-muted)' }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* File Upload (Drag & Drop) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Media File {!isEdit && <span className="text-red-400">*</span>}
              {isEdit && <span className="text-neutral-500 normal-case font-normal ml-1">(leave empty to keep current)</span>}
            </label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-amber-500/50 bg-amber-500/5'
                  : 'border-white/10 hover:border-white/20 bg-neutral-900/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,audio/*,video/*,.pdf,.txt,.doc,.docx"
              />
              {file ? (
                <div className="space-y-1">
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {file.name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB · {file.type || 'unknown type'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-sm font-medium opacity-30" style={{ color: 'var(--text-muted)' }}>Upload</div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Drag & drop a file here, or <span className="text-amber-500 font-medium">browse</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-300 hover:bg-white/5"
              style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
              style={{ backgroundColor: 'var(--accent-gold)' }}
            >
              {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Upload Artwork'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
