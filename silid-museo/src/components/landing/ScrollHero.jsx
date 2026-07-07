import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * ScrollHero — Scroll-scrubbed frame-sequence animation using <canvas>.
 *
 * Props:
 *   frameCount  — total number of frames (e.g. 142)
 *   framePath   — function (index) => URL string, index is 1-based
 *   scrollHeight — how many viewport-heights the sticky section spans
 *                  (default 5 → user scrolls 5× the viewport to scrub
 *                   through all frames)
 *   children    — optional overlay content rendered on top of the canvas
 */
export default function ScrollHero({
  frameCount,
  framePath,
  scrollHeight = 5,
  onProgress,
  children,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const framesRef = useRef([]);
  const rafRef = useRef(null);
  const lastDrawnFrame = useRef(-1);

  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  // ─── Preload all frames into Image objects ───
  useEffect(() => {
    let cancelled = false;
    const images = [];
    let loadedCount = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = framePath(i);
      img.onload = () => {
        if (cancelled) return;
        loadedCount++;
        setProgress(loadedCount / frameCount);
        if (loadedCount === frameCount) {
          framesRef.current = images;
          setLoaded(true);
        }
      };
      img.onerror = () => {
        if (cancelled) return;
        // Count errors as loaded so we don't hang forever
        loadedCount++;
        setProgress(loadedCount / frameCount);
        if (loadedCount === frameCount) {
          framesRef.current = images;
          setLoaded(true);
        }
      };
      images.push(img);
    }

    return () => {
      cancelled = true;
    };
  }, [frameCount, framePath]);

  // ─── Draw a specific frame to the canvas ───
  const drawFrame = useCallback((index) => {
    const canvas = canvasRef.current;
    const frames = framesRef.current;
    if (!canvas || !frames.length) return;

    const clamped = Math.max(0, Math.min(index, frames.length - 1));
    if (clamped === lastDrawnFrame.current) return;
    lastDrawnFrame.current = clamped;

    const ctx = canvas.getContext('2d');
    const img = frames[clamped];
    if (!img || !img.naturalWidth) return;

    // Size canvas to fill its CSS container at device pixel ratio
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = rect.width * dpr;
    const h = rect.height * dpr;

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    // "cover" the canvas, centred
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = w / h;
    let sx, sy, sw, sh;

    if (imgRatio > canvasRatio) {
      // Image is wider — crop sides
      sh = img.naturalHeight;
      sw = sh * canvasRatio;
      sx = (img.naturalWidth - sw) / 2;
      sy = 0;
    } else {
      // Image is taller — crop top/bottom
      sw = img.naturalWidth;
      sh = sw / canvasRatio;
      sx = 0;
      sy = (img.naturalHeight - sh) / 2;
    }

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
  }, []);

  // ─── Draw first frame once loaded ───
  useEffect(() => {
    if (loaded) {
      drawFrame(0);
    }
  }, [loaded, drawFrame]);

  // ─── Scroll handler: map scroll position to frame index ───
  useEffect(() => {
    if (!loaded) return;

    const onScroll = () => {
      if (rafRef.current) return; // Already scheduled

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const scrollable = container.scrollHeight - window.innerHeight;

        // How far the sticky top has scrolled past the container top
        const scrolled = -rect.top;
        const fraction = Math.max(0, Math.min(1, scrolled / scrollable));
        const frameIndex = Math.round(fraction * (frameCount - 1));

        drawFrame(frameIndex);

        if (onProgress) {
          onProgress(fraction);
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Initial draw

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [loaded, frameCount, drawFrame, onProgress]);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `${scrollHeight * 100}vh` }}
    >
      {/* Sticky wrapper — pinned to viewport while user scrolls */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Loading state - Glassmorphic Skeleton */}
        {!loaded && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
            {/* Pulsing Logo Skeleton */}
            <div className="w-64 h-24 sm:w-96 sm:h-36 bg-neutral-900/40 rounded-2xl border border-white/5 animate-pulse flex items-center justify-center shadow-2xl">
              <span className="text-amber-500/20 text-5xl sm:text-7xl font-kingston tracking-widest animate-pulse font-normal">M</span>
            </div>

            {/* Pulsing Text & Progress */}
            <div className="mt-8 flex flex-col items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400 animate-pulse">
                Entering Silid-Museo
              </span>
              {/* Progress bar */}
              <div className="h-1.5 w-48 overflow-hidden rounded-full bg-neutral-950 border border-white/5 mt-2">
                <div
                  className="h-full rounded-full transition-all duration-200"
                  style={{
                    width: `${progress * 100}%`,
                    backgroundColor: 'var(--accent-gold)',
                  }}
                />
              </div>
              <span className="text-xs text-neutral-500 font-medium">
                {Math.round(progress * 100)}%
              </span>
            </div>
          </div>
        )}

        {/* Canvas — always mounted so we can draw to it while loading */}
        <canvas
          ref={canvasRef}
          className="h-full w-full"
          style={{ display: 'block', filter: 'blur(3px)' }}
        />

        {/* Optional overlay content (title, CTA, etc.) */}
        {loaded && children && (
          <div className="absolute inset-0 z-10">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
