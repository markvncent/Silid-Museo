import React from 'react';
import { Music, Video, FileText, Shapes, AlignLeft } from 'lucide-react';

const fallbackIcons = {
  audio: Music,
  video: Video,
  pdf: FileText,
  text: AlignLeft,
  sculpture: Shapes,
};

export default function ArtworkCard({ artwork, onClick }) {
  const { title, description, thumbnail_url, media_url, media_type, artwork_ratings_summary, is_fallback } = artwork;
  
  // Calculate average rating
  const avgRating = artwork_ratings_summary?.average_rating || 0;
  const ratingCount = artwork_ratings_summary?.rating_count || 0;

  // Use thumbnail or fallback media url
  const displayImage = thumbnail_url || (media_type === 'image' ? media_url : null);
  const IconComponent = fallbackIcons[media_type];

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
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950 flex items-center justify-center">
        {displayImage ? (
          <img
            src={displayImage}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div 
            className="w-full h-full flex flex-col items-center justify-center gap-3 transition-colors duration-300 group-hover:bg-neutral-900"
            style={{ 
              background: 'linear-gradient(135deg, var(--bg-surface) 0%, rgba(255,168,0,0.03) 100%)',
            }}
          >
            {IconComponent ? (
              <IconComponent 
                className="w-12 h-12 transition-transform duration-500 group-hover:scale-110" 
                style={{ color: 'var(--accent-gold)' }}
                strokeWidth={1.5}
              />
            ) : (
              <span className="text-4xl">✨</span>
            )}
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-40 text-center px-4" style={{ color: 'var(--text-muted)' }}>
              {media_type} preview
            </span>
          </div>
        )}
        {/* Ambient Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent pointer-events-none" />
        
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

        {artwork.subcategory && (
          <div
            className="text-[10px] tracking-wider uppercase mb-3 select-none font-semibold"
            style={{ color: 'var(--accent-gold)', fontVariant: 'small-caps' }}
          >
            {artwork.subcategory}
          </div>
        )}

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
