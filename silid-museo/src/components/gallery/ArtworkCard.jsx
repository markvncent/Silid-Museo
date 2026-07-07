import React from 'react';

export default function ArtworkCard({ artwork, onClick }) {
  const { title, description, thumbnail_url, media_url, media_type, artwork_ratings_summary, is_fallback } = artwork;
  
  // Calculate average rating
  const avgRating = artwork_ratings_summary?.average_rating || 0;
  const ratingCount = artwork_ratings_summary?.rating_count || 0;

  // Use thumbnail or fallback media url
  const displayImage = thumbnail_url || (media_type === 'audio' 
    ? 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=500&auto=format&fit=crop'
    : media_url);

  // Emojis representing the medium
  const typeIcons = {
    image: '🖼️',
    audio: '🔊',
    video: '🎬',
    text: '📄',
    sculpture: '📐'
  };

  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/5"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {/* Media Preview Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950">
        <img
          src={displayImage}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {/* Ambient Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />
        
        {/* Media type icon badge */}
        <span className="absolute top-3 left-3 bg-neutral-900/80 backdrop-blur-md text-xs py-1 px-2.5 rounded-full border border-white/5 flex items-center gap-1.5 text-white">
          <span>{typeIcons[media_type] || '✨'}</span>
          <span className="capitalize text-[10px] tracking-wide font-medium">{media_type}</span>
        </span>

        {/* Fallback Preview Tag */}
        {is_fallback && (
          <span className="absolute top-3 right-3 bg-amber-500/20 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Preview
          </span>
        )}
      </div>

      {/* Info details */}
      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-lg font-semibold line-clamp-1 mb-1" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h3>
          <p className="text-sm line-clamp-2 mb-4" style={{ color: 'var(--text-muted)' }}>
            {description}
          </p>
        </div>

        {/* Card Footer: Rating stars & Details */}
        <div className="flex items-center justify-between border-t pt-4" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-1.5">
            <span className="text-amber-500 text-sm">★</span>
            <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
              {avgRating > 0 ? avgRating : 'No ratings'}
            </span>
            {ratingCount > 0 && (
              <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                ({ratingCount})
              </span>
            )}
          </div>
          <span
            className="text-xs font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform duration-300"
            style={{ color: 'var(--accent-gold)' }}
          >
            Open Exhibition
            <span className="text-xs">→</span>
          </span>
        </div>
      </div>
    </div>
  );
}
