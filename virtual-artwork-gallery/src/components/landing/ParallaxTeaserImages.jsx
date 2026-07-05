import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxTeaserImages() {
  const containerRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Apply parallax scrub on each of the cards relative to the container scroll trigger
    gsap.fromTo(
      card1Ref.current,
      { y: -60 },
      {
        y: 60,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );

    gsap.fromTo(
      card2Ref.current,
      { y: 30 },
      {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );

    gsap.fromTo(
      card3Ref.current,
      { y: 80 },
      {
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex h-[400px] w-full items-center justify-center sm:h-[450px]"
    >
      {/* Background Card 1 (Left-top position, slides down) */}
      <div
        ref={card1Ref}
        className="absolute left-4 top-8 z-10 h-44 w-36 rounded-2xl border p-4 shadow-lg flex flex-col justify-between sm:h-52 sm:w-44"
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderColor: 'var(--border-subtle)',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
        }}
      >
        <div className="text-4xl">&#128247;</div>
        <div>
          <span className="text-xs uppercase tracking-wider text-theme-muted">Medium</span>
          <h4 className="text-sm font-semibold text-theme-primary font-heading">Photography</h4>
        </div>
      </div>

      {/* Main Card 2 (Center position, slides up) */}
      <div
        ref={card2Ref}
        className="absolute z-20 h-60 w-48 rounded-2xl border p-6 shadow-xl flex flex-col justify-between sm:h-72 sm:w-56"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-subtle)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)',
        }}
      >
        <div className="flex justify-between items-start">
          <div className="text-5xl">&#127912;</div>
          <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-3xs font-semibold text-amber-500 uppercase tracking-widest">
            Featured
          </span>
        </div>
        <div>
          <span className="text-xs uppercase tracking-wider text-theme-muted">Medium</span>
          <h4 className="text-base font-semibold text-theme-primary font-heading">Digital Painting</h4>
        </div>
      </div>

      {/* Foreground Card 3 (Right-bottom position, slides up faster) */}
      <div
        ref={card3Ref}
        className="absolute right-4 bottom-8 z-30 h-48 w-40 rounded-2xl border p-5 shadow-lg flex flex-col justify-between sm:h-56 sm:w-48"
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderColor: 'var(--border-subtle)',
          boxShadow: '0 15px 30px -8px rgba(0,0,0,0.15)',
        }}
      >
        <div className="text-4xl">&#127916;</div>
        <div>
          <span className="text-xs uppercase tracking-wider text-theme-muted">Medium</span>
          <h4 className="text-sm font-semibold text-theme-primary font-heading">Film & Video</h4>
        </div>
      </div>

      {/* Floating background blur nodes */}
      <div
        className="absolute -top-6 -right-6 h-36 w-36 rounded-full blur-2xl pointer-events-none"
        style={{ backgroundColor: 'var(--accent-gold-glow)' }}
      />
      <div
        className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full blur-2xl pointer-events-none"
        style={{ backgroundColor: 'var(--accent-gold-glow)' }}
      />
    </div>
  );
}
