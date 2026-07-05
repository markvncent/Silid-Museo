import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollHero from '../components/landing/ScrollHero';
import CategoryDoor from '../components/landing/CategoryDoor';
import categories from '../data/categoryConfig';
import wordmarkImg from '../assets/Wordmark.png';
import ScrollReveal from '../components/ui/ScrollReveal';
import ParallaxTeaserImages from '../components/landing/ParallaxTeaserImages';

const HERO_FRAME_COUNT = 142;

export default function HomePage() {
  const [activePhase, setActivePhase] = useState(0);

  // Stable reference so ScrollHero doesn't re-preload on every render
  const getFramePath = useCallback(
    (index) => `/hero-frames/ezgif-frame-${String(index).padStart(3, '0')}.jpg`,
    [],
  );

  const handleProgress = useCallback((fraction) => {
    let phase = 0;
    if (fraction < 0.20) {
      phase = 0;
    } else if (fraction < 0.60) {
      phase = 1;
    } else {
      phase = 2;
    }

    setActivePhase((prev) => {
      if (prev !== phase) return phase;
      return prev;
    });
  }, []);

  return (
    <div>
      {/* SCROLL-SCRUBBED HERO */}
      <ScrollHero
        frameCount={HERO_FRAME_COUNT}
        framePath={getFramePath}
        scrollHeight={5}
        onProgress={handleProgress}
      >
        {/* Hero content overlay */}
        <div className="relative z-20 flex h-full items-center justify-center px-8 md:px-16 lg:px-24 pt-28 pb-8">
          <div className="w-full max-w-[1200px] text-center transition-all duration-300 flex flex-col items-center">
            {/* Main Heading */}
            <div className="mb-6 animate-slide-up flex items-center justify-center w-full overflow-hidden h-24 sm:h-36 md:h-48 lg:h-60 xl:h-72">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePhase}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -30, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center justify-center w-full h-full px-4"
                >
                  {activePhase === 0 ? (
                    <img
                      src={wordmarkImg}
                      alt="Virtual Artwork Gallery"
                      className="h-full w-auto max-w-[300px] sm:max-w-[700px] md:max-w-[900px] lg:max-w-[1100px] object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
                    />
                  ) : (
                    <span className="text-5xl font-bold leading-none tracking-wide text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] sm:text-7xl md:text-8xl lg:text-9xl font-heading">
                      {activePhase === 1 ? "Art in Every Form." : "Inspiration in Every Piece."}
                    </span>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Subheading */}
            <p className="mb-8 max-w-2xl animate-slide-up text-base leading-relaxed text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] sm:text-lg mx-auto" style={{ animationDelay: '0.2s' }}>
              Explore a curated collection of creative works spanning photography, digital art,
              music, film, writing, sculpture, and more.
            </p>

            {/* CTA Buttons */}
            <div className="flex animate-slide-up flex-wrap items-center justify-center gap-4" style={{ animationDelay: '0.4s' }}>
              <a
                href="#gallery"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl px-6 py-3 text-sm font-semibold shadow-lg transition-all duration-300 text-white"
                style={{
                  background: 'var(--gradient-accent)',
                  boxShadow: '0 4px 20px var(--accent-gold-glow)',
                }}
                id="cta-explore"
              >
                <span className="relative z-10">Explore the Gallery</span>
                <svg className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
                {/* Hover shimmer */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </a>

              <a
                href="/about"
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300"
                style={{
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-overlay)',
                }}
                id="cta-about"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>

        {/* Dark gradient overlay at the bottom for smooth blending */}
        <div
          className="absolute bottom-0 left-0 right-0 h-180 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(to bottom, transparent, var(--bg-primary))',
          }}
        />
      </ScrollHero>

      {/* GALLERY / CATEGORIES SECTION */}
      <section className="relative py-24" id="gallery">
        <div
          className="absolute inset-0 transition-colors duration-300"
          style={{ backgroundColor: 'var(--bg-primary)' }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <h2
              className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl"
              style={{ color: 'var(--text-primary)' }}
            >
              Choose Your Door
            </h2>
            <p className="mx-auto max-w-2xl" style={{ color: 'var(--text-muted)' }}>
              Each door opens into a world of creativity. Select an art medium
              to discover the works within.
            </p>
          </div>

          {/* Category Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat, i) => (
              <CategoryDoor key={cat.slug} {...cat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT TEASER */}
      <section className="relative overflow-hidden py-24">
        <div
          className="absolute inset-0 transition-colors duration-300"
          style={{ backgroundColor: 'var(--bg-surface)' }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="flex flex-col justify-center">
              <ScrollReveal
                enableBlur={true}
                baseOpacity={0.1}
                baseRotation={4}
                blurStrength={6}
                containerClassName="mb-6"
                textClassName="!text-3xl sm:!text-4xl md:!text-5xl font-heading text-theme-primary leading-tight"
              >
                {"A Space for Every Art Form"}
              </ScrollReveal>
              
              <ScrollReveal
                enableBlur={true}
                baseOpacity={0.1}
                baseRotation={2}
                blurStrength={4}
                containerClassName="mb-6"
                textClassName="!text-base sm:!text-lg leading-snug text-theme-secondary font-sans !font-normal"
              >
                {"This virtual gallery is designed to celebrate the diversity of artistic expression. From traditional paintings to digital compositions, from poetry to film, every medium has a dedicated space to shine."}
              </ScrollReveal>
              
              <ScrollReveal
                enableBlur={true}
                baseOpacity={0.1}
                baseRotation={2}
                blurStrength={4}
                containerClassName="mb-6"
                textClassName="!text-base sm:!text-lg leading-snug text-theme-muted font-sans !font-normal"
              >
                {"Rate your favorite pieces, leave feedback, and immerse yourself in a curated experience that bridges the gap between artist and audience."}
              </ScrollReveal>
            </div>

            {/* Parallax Scrolling Images Stack */}
            <div className="flex items-center justify-center">
              <ParallaxTeaserImages />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
