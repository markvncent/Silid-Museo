import React from 'react';

export default function MediaPlayer({ mediaUrl, mediaType, title }) {
  switch (mediaType) {
    case 'image':
    case 'sculpture':
      return (
        <div className="relative overflow-hidden rounded-xl bg-neutral-900 flex items-center justify-center aspect-[4/3] md:aspect-video w-full group">
          <img
            src={mediaUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          {mediaType === 'sculpture' && (
            <span className="absolute top-3 right-3 bg-amber-500/80 backdrop-blur-sm text-[10px] uppercase font-bold text-neutral-950 px-2.5 py-1 rounded-full tracking-wider">
              3D Model
            </span>
          )}
        </div>
      );

    case 'audio':
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-neutral-900/50 border border-white/5 rounded-2xl w-full aspect-[4/3] md:aspect-video text-center">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 text-3xl mb-4 animate-pulse">
            🔊
          </div>
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
            poster="https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop"
          />
        </div>
      );

    case 'text':
    default:
      return (
        <div className="w-full aspect-[4/3] md:aspect-video rounded-xl bg-neutral-900 border border-white/5 p-6 overflow-y-auto font-sans leading-relaxed text-neutral-300 text-sm">
          <div className="prose prose-invert">
            <p className="whitespace-pre-wrap">{mediaUrl}</p>
          </div>
        </div>
      );
  }
}
