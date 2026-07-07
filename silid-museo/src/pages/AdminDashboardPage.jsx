import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import categories from '../data/categoryConfig.js';
import { getCategories } from '../services/categories.js';
import { getArtworksByCategory, deleteArtwork } from '../services/artworks.js';
import { deleteMedia } from '../services/storage.js';
import ArtworkForm from '../components/admin/ArtworkForm.jsx';
import CategoryForm from '../components/admin/CategoryForm.jsx';
import ModerationList from '../components/admin/ModerationList.jsx';

const TABS = [
  { key: 'artworks', label: 'Artworks' },
  { key: 'categories', label: 'Categories' },
  { key: 'moderation', label: 'Moderation' },
];

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  // ── Global State ───────────────────────────────────
  const [activeTab, setActiveTab] = useState('artworks');

  // ── Artworks Tab State ─────────────────────────────
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id || '');
  const [artworks, setArtworks] = useState([]);
  const [loadingArtworks, setLoadingArtworks] = useState(false);
  const [showArtworkForm, setShowArtworkForm] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState(null);
  const [deletingArtworkId, setDeletingArtworkId] = useState(null);

  // ── Categories Tab State ───────────────────────────
  const [dbCategories, setDbCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // ── Load artworks when category changes ────────────
  const loadArtworks = useCallback(async () => {
    if (!selectedCategoryId) return;
    setLoadingArtworks(true);
    try {
      const data = await getArtworksByCategory(selectedCategoryId);
      setArtworks(data || []);
    } catch (err) {
      console.warn('Failed to load artworks:', err.message);
      setArtworks([]);
    } finally {
      setLoadingArtworks(false);
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    if (activeTab === 'artworks') loadArtworks();
  }, [activeTab, loadArtworks]);

  // ── Load categories from DB ────────────────────────
  const loadCategories = useCallback(async () => {
    setLoadingCategories(true);
    try {
      const data = await getCategories();
      setDbCategories(data || []);
    } catch (_err) {
      console.warn('Failed to load categories from DB, using local config');
      setDbCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'categories') loadCategories();
  }, [activeTab, loadCategories]);

  // ── Handlers ───────────────────────────────────────
  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin');
    navigate('/admin');
  };

  const handleDeleteArtwork = async (art) => {
    if (!confirm(`Delete "${art.title}"? This cannot be undone.`)) return;
    setDeletingArtworkId(art.id);
    try {
      if (art.media_url) {
        try {
          const url = new URL(art.media_url);
          const pathMatch = url.pathname.match(/\/object\/public\/artwork-media\/(.+)/);
          if (pathMatch) await deleteMedia(pathMatch[1]);
        } catch (e) {
          console.warn('Could not delete media file:', e.message);
        }
      }
      await deleteArtwork(art.id);
      setArtworks((prev) => prev.filter((a) => a.id !== art.id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete artwork. Check Supabase RLS policies.');
    } finally {
      setDeletingArtworkId(null);
    }
  };

  // Merge local config with DB data for categories tab
  const mergedCategories = categories.map((localCat) => {
    const dbCat = dbCategories.find((d) => d.id === localCat.id);
    return dbCat ? { ...localCat, ...dbCat } : localCat;
  });

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* ═══ SIDEBAR ═══ */}
      <aside
        className="fixed top-0 left-0 z-40 flex h-screen w-60 flex-col border-r"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
      >
        {/* Sidebar Header / Branding */}
        <div className="px-5 py-5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-2.5">
            <span className="text-xl font-kingston" style={{ color: 'var(--accent-gold)' }}>M</span>
            <div>
              <h1 className="text-sm font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                Silid-Museo
              </h1>
              <p className="text-[10px] leading-tight" style={{ color: 'var(--text-muted)' }}>
                Admin Dashboard
              </p>
            </div>
          </div>
          <span className="mt-3 inline-block rounded-full bg-emerald-500/15 border border-emerald-500/25 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            Admin Mode
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 text-left ${
                activeTab === tab.key
                  ? 'bg-amber-500/10 text-amber-400 shadow-sm'
                  : 'hover:bg-white/5'
              }`}
              style={{ color: activeTab === tab.key ? undefined : 'var(--text-muted)' }}
            >
              {/* Active indicator dot */}
              <span
                className={`h-1.5 w-1.5 rounded-full shrink-0 transition-all duration-200 ${
                  activeTab === tab.key ? 'bg-amber-500' : 'bg-neutral-700'
                }`}
              />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Exit Admin Mode — pinned at bottom */}
        <div className="px-3 py-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-medium transition-all duration-300 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
          >
            Exit Admin Mode
          </button>
        </div>
      </aside>

      {/* ═══ MAIN CONTENT (offset by sidebar width) ═══ */}
      <main className="flex-1 ml-60">
        {/* Content Header */}
        <div
          className="sticky top-0 z-20 border-b backdrop-blur-xl px-8 py-5"
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
        >
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            {activeTab === 'artworks' && 'Manage Artworks'}
            {activeTab === 'categories' && 'Edit Categories'}
            {activeTab === 'moderation' && 'Moderate Feedback & Ratings'}
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {activeTab === 'artworks' && 'Browse, add, edit, and delete artworks across categories.'}
            {activeTab === 'categories' && 'Update category names, descriptions, and cover images.'}
            {activeTab === 'moderation' && 'Review and remove inappropriate comments or ratings.'}
          </p>
        </div>

        {/* Content Area */}
        <div className="px-8 py-8">

          {/* ─── ARTWORKS TAB ───────────────────────── */}
          {activeTab === 'artworks' && (
            <div className="space-y-6">
              {/* Top Bar: Category Selector + Add Button */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    Category:
                  </label>
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    className="rounded-xl border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:ring-1 focus:ring-amber-500/30"
                    style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => { setEditingArtwork(null); setShowArtworkForm(true); }}
                  className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-white transition-all duration-200 hover:brightness-110 hover:shadow-lg shadow-amber-500/10"
                  style={{ backgroundColor: 'var(--accent-gold)' }}
                >
                  <span className="text-sm">+</span> Add Artwork
                </button>
              </div>

              {/* Artworks Table */}
              {loadingArtworks ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-20 rounded-xl animate-pulse border"
                      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
                    />
                  ))}
                </div>
              ) : artworks.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-20 rounded-2xl border"
                  style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
                >
                  <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                    No artworks yet
                  </p>
                  <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                    Upload the first artwork to this category.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setEditingArtwork(null); setShowArtworkForm(true); }}
                    className="rounded-lg px-4 py-2 text-xs font-semibold text-white hover:brightness-110 transition-all"
                    style={{ backgroundColor: 'var(--accent-gold)' }}
                  >
                    + Add Artwork
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Table Header */}
                  <div
                    className="hidden sm:grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center px-5 py-2.5 rounded-xl text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-surface)' }}
                  >
                    <span className="w-14">Preview</span>
                    <span>Title</span>
                    <span className="w-16 text-center">Type</span>
                    <span className="w-16 text-center">Rating</span>
                    <span className="w-28 text-right">Actions</span>
                  </div>

                  {/* Table Rows */}
                  {artworks.map((art) => {
                    const displayImage = art.thumbnail_url || (art.media_type === 'audio'
                      ? 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=100&auto=format&fit=crop'
                      : art.media_url);
                    const avgRating = art.artwork_ratings_summary?.average_rating || 0;

                    return (
                      <div
                        key={art.id}
                        className="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto_auto_auto] gap-3 sm:gap-4 items-center rounded-xl border p-4 sm:px-5 sm:py-3 transition-all duration-200 hover:border-white/10"
                        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
                      >
                        {/* Preview Thumbnail */}
                        <div className="w-14 h-10 rounded-lg overflow-hidden bg-neutral-900 border border-white/5 shrink-0">
                          {displayImage && (
                            <img src={displayImage} alt={art.title} className="h-full w-full object-cover" />
                          )}
                        </div>

                        {/* Title + Description */}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                            {art.title}
                          </p>
                          <p className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>
                            {art.description || 'No description'}
                          </p>
                        </div>

                        {/* Type Badge */}
                        <span
                          className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-semibold capitalize w-fit"
                          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
                        >
                          {art.media_type}
                        </span>

                        {/* Rating */}
                        <span className="text-xs font-medium text-center w-16" style={{ color: 'var(--text-primary)' }}>
                          <span className="text-amber-500">★</span> {avgRating > 0 ? avgRating : '—'}
                        </span>

                        {/* Actions */}
                        <div className="flex gap-1.5 justify-end w-28">
                          <button
                            type="button"
                            onClick={() => { setEditingArtwork(art); setShowArtworkForm(true); }}
                            className="rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-all duration-200 hover:bg-white/5 hover:border-white/15"
                            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteArtwork(art)}
                            disabled={deletingArtworkId === art.id}
                            className="rounded-lg border border-red-500/20 bg-red-500/5 px-2.5 py-1.5 text-[11px] font-medium text-red-400 transition-all duration-200 hover:bg-red-500/15 disabled:opacity-40"
                          >
                            {deletingArtworkId === art.id ? '...' : 'Delete'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ─── CATEGORIES TAB ─────────────────────── */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs px-2.5 py-1 rounded-full border" style={{ color: 'var(--text-muted)', borderColor: 'var(--border-subtle)' }}>
                  {mergedCategories.length} categories
                </span>
              </div>

              {loadingCategories ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-32 rounded-xl animate-pulse border"
                      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {mergedCategories.map((cat) => (
                    <CategoryForm
                      key={cat.id}
                      category={cat}
                      onSaved={loadCategories}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── MODERATION TAB ─────────────────────── */}
          {activeTab === 'moderation' && (
            <ModerationList />
          )}
        </div>
      </main>

      {/* ═══ ARTWORK FORM MODAL ═══ */}
      {showArtworkForm && (
        <ArtworkForm
          artwork={editingArtwork}
          categoryId={selectedCategoryId}
          onClose={() => { setShowArtworkForm(false); setEditingArtwork(null); }}
          onSaved={loadArtworks}
        />
      )}
    </div>
  );
}