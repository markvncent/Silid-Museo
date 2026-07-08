import React, { useState } from 'react';
import { FileText } from 'lucide-react';

export default function MediaPlayer({ mediaUrl, mediaType, title, thumbnailUrl }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  switch (mediaType) {
    case 'image':
    case 'sculpture':
      return (
        <>
          <div
            onClick={() => setIsFullscreen(true)}
            className="relative overflow-hidden rounded-xl bg-neutral-900 flex items-center justify-center aspect-[4/3] md:aspect-video w-full group cursor-zoom-in"
          >
            <img
              src={mediaUrl}
              alt={title}
              className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            {mediaType === 'sculpture' && (
              <span className="absolute top-3 right-3 bg-amber-500/80 backdrop-blur-sm text-[10px] uppercase font-bold text-neutral-950 px-2.5 py-1 rounded-full tracking-wider">
                3D Model
              </span>
            )}
          </div>

          {/* Fullscreen Big Picture Lightbox */}
          {isFullscreen && (
            <div
              onClick={() => setIsFullscreen(false)}
              className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/95 cursor-zoom-out p-4 animate-fade-in"
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="absolute top-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900/80 text-white hover:bg-neutral-800 transition-all border border-white/10 text-xl"
              >
                ✕
              </button>

              {/* Centered big image */}
              <img
                src={mediaUrl}
                alt={title}
                className="max-w-[95vw] max-h-[85vh] object-contain shadow-2xl rounded-lg animate-zoom-in"
              />

              {/* Title & guidance */}
              <div className="mt-4 text-center">
                <h4 className="text-white text-base font-semibold tracking-wide font-heading">{title}</h4>
                <p className="text-neutral-400 text-xs mt-1">Click anywhere to return to details</p>
              </div>
            </div>
          )}
        </>
      );

    case 'audio':
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-neutral-900/50 border border-white/5 rounded-2xl w-full aspect-[4/3] md:aspect-video text-center">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover mb-4 shadow-lg border border-white/10"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 text-3xl mb-4 animate-pulse">
              🔊
            </div>
          )}
          <h4 className="text-white font-medium mb-1 truncate max-w-xs">{title}</h4>
          <p className="text-neutral-500 text-xs mb-6">Original Composition Playback</p>
          <audio
            src={mediaUrl}
            controls
            className="w-full max-w-sm accent-amber-500 rounded-lg"
          />
        </div>
      );

    case 'video':
      return (
        <div className="relative overflow-hidden rounded-xl bg-neutral-900 w-full aspect-[4/3] md:aspect-video">
          <video
            src={mediaUrl}
            controls
            className="w-full h-full object-contain"
            poster={thumbnailUrl || undefined}
          />
        </div>
      );
  case 'pdf':
    return (
      <>
        <div
          onClick={() => setIsFullscreen(true)}
          className="relative overflow-hidden rounded-xl bg-neutral-900 flex flex-col items-center justify-center aspect-[4/3] md:aspect-video w-full group cursor-zoom-in border border-white/5"
        >
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center gap-3 transition-colors duration-300 group-hover:bg-neutral-800"
              style={{
                background: 'linear-gradient(135deg, var(--bg-surface) 0%, rgba(255,168,0,0.03) 100%)',
              }}
            >
              <FileText className="w-12 h-12 text-amber-500" strokeWidth={1.5} />
              <span className="text-white text-sm font-semibold tracking-wide font-heading truncate max-w-[200px] px-2">{title}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-40 text-theme-muted">
                PDF Document
              </span>
            </div>
          )}

          {/* Hover Expand Badge */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="bg-neutral-950/80 backdrop-blur-md text-xs py-2 px-4 rounded-xl border border-white/15 text-white flex items-center gap-2 font-medium">
              <FileText className="w-4 h-4 text-amber-500" />
              Read Document
            </span>
          </div>
        </div>

        {/* Fullscreen PDF Reader Lightbox */}
        {isFullscreen && (
          <div
            className="fixed inset-0 z-[99999] flex flex-col bg-black/95 p-4 md:p-6 animate-fade-in"
          >
            {/* Header inside fullscreen view */}
            <div className="flex justify-between items-center mb-4 max-w-6xl w-full mx-auto shrink-0 px-2">
              <div>
                <h4 className="text-white text-base font-semibold tracking-wide font-heading">{title}</h4>
                <p className="text-neutral-400 text-xs mt-0.5">Scroll to read the document</p>
              </div>
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition-all border border-white/10 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Scrollable PDF Iframe */}
            <div className="flex-1 w-full max-w-6xl mx-auto rounded-xl overflow-hidden bg-neutral-900 border border-white/15 shadow-2xl">
              <iframe
                src={mediaUrl}
                title={title}
                className="w-full h-full"
                style={{ border: 'none' }}
              />
            </div>
          </div>
        )}
      </>
    );
    case 'text':
    default:
      return (
        <div className="w-full aspect-[4/3] md:aspect-video rounded-xl bg-neutral-900 border border-white/5 overflow-hidden flex flex-col font-sans leading-relaxed text-neutral-300 text-sm">
          {thumbnailUrl && (
            <div className="w-full h-32 sm:h-40 shrink-0 border-b border-white/5">
              <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="prose prose-invert">
              <p className="whitespace-pre-wrap">{mediaUrl}</p>
            </div>
          </div>
        </div>
      );
  }
}
