import { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollHero from '../components/landing/ScrollHero';
import { FocusRail } from '../components/ui/focus-rail';
import AnimatedRays from '@/components/ui/animated-rays';
import Particles from '@/components/ui/Particles';
import categories from '../data/categoryConfig';
import { getCategories } from '../services/categories';
import wordmarkImg from '../assets/Wordmark.png';
import ScrollReveal from '../components/ui/ScrollReveal';
import PillarBorder from '../components/landing/PillarBorder';

/**
 * Map each category to a FocusRail item with a representative Unsplash image.
 */
const CATEGORY_IMAGES = {
  'silid-lona': 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop',
  'silid-tinig': 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1000&auto=format&fit=crop',
  'silid-salin': 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?q=80&w=1000&auto=format&fit=crop',
  'silid-kasaysayan': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop',
  'silid-espasyo': 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?q=80&w=1000&auto=format&fit=crop',
  'silid-aninag': 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000&auto=format&fit=crop',
  'silid-manlilikha': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop',
};

const HERO_FRAME_COUNT = 142;

export default function HomePage() {
  const [activePhase, setActivePhase] = useState(0);
  const [railItems, setRailItems] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      let finalCategories = categories;

      try {
        const dbCats = await getCategories();
        if (dbCats && dbCats.length > 0) {
          // Merge database category metadata with local config styles (icons, gradients)
          finalCategories = dbCats.map((dbCat) => {
            // Match based on medium_type (which maps to our slugs)
            const localConfig = categories.find((c) => c.slug === dbCat.medium_type) || {};
            return {
              id: dbCat.id,
              slug: dbCat.medium_type,
              name: dbCat.name,
              description: dbCat.description,
              icon: localConfig.icon || '🎨',
              gradient: localConfig.gradient || 'from-neutral-800 to-neutral-900',
              cover_image_url: dbCat.cover_image_url || localConfig.cover_image_url,
            };
          });
        }
      } catch (err) {
        console.warn('Failed to load categories from Supabase, using local static config fallback:', err.message);
      } finally {
        // Map categories to FocusRail items format
        const items = finalCategories.map((cat) => ({
          id: cat.id || cat.slug,
          title: cat.name,
          description: cat.description,
          meta: `${cat.icon} Category`,
          imageSrc: cat.cover_image_url || CATEGORY_IMAGES[cat.slug] || CATEGORY_IMAGES['silid-lona'],
          href: `/category/${cat.slug}`,
        }));
        setRailItems(items);
      }
    };

    loadCategories();
  }, []);

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
    <div className="relative">
      {/* Fixed background light rays covering the entire homepage viewport */}
      <AnimatedRays className="fixed inset-0 w-screen h-screen rounded-none border-none opacity-[0.06] dark:opacity-[0.18] pointer-events-none z-40" />

      {/* SCROLL-SCRUBBED HERO */}
      <ScrollHero
        frameCount={HERO_FRAME_COUNT}
        framePath={getFramePath}
        scrollHeight={5}
        onProgress={handleProgress}
      >
        {/* Interactive particles overlay in the header banner */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-70">
          <Particles
            particleColors={["#ffdb6a"]}
            particleCount={150}
            particleSpread={12}
            speed={0.15}
            particleBaseSize={80}
            moveParticlesOnHover
            alphaParticles={false}
            disableRotation={false}
            pixelRatio={1}
          />
        </div>

        {/* Hero content overlay */}
        <div className="relative z-20 flex h-full items-center justify-center px-8 md:px-16 lg:px-24 pt-28 pb-8">
          <div className="w-full max-w-[1200px] text-center transition-all duration-300 flex flex-col items-center">
            {/* Main Heading */}
            <div className="mb-6 animate-slide-up flex items-center justify-center w-full min-h-[80px] sm:min-h-[120px] md:min-h-[180px] lg:min-h-[240px] py-4 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePhase}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center justify-center w-full px-4"
                >
                  {activePhase === 0 ? (
                    <img
                      src={wordmarkImg}
                      alt="Silid-Museo"
                      className="h-16 sm:h-24 md:h-36 lg:h-48 xl:h-56 w-auto max-w-[280px] sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px] object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
                    />
                  ) : (
                    <span className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-tight sm:leading-none tracking-wide text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] font-heading">
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

              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300"
                style={{
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-overlay)',
                }}
                id="cta-about"
              >
                Learn More
              </Link>
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
        <PillarBorder />
        <div
          className="absolute inset-0 transition-colors duration-300"
          style={{ backgroundColor: 'var(--bg-primary)' }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-[250px]">
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

          {/* Category Focus Rail */}
          {railItems.length > 0 ? (
            <FocusRail
              items={railItems}
              autoPlay={false}
              loop={true}
              className="rounded-2xl"
            />
          ) : (
            <div className="flex gap-6 overflow-hidden h-[600px] w-full justify-center items-center px-4">
              {/* Left Card Skeleton */}
              <div className="hidden lg:block w-[280px] h-[420px] opacity-30 bg-neutral-900/60 rounded-2xl animate-pulse border border-white/5" />
              
              {/* Center Card Skeleton */}
              <div className="w-[340px] sm:w-[380px] h-[520px] bg-neutral-950/70 rounded-2xl animate-pulse border border-amber-500/10 relative overflow-hidden flex flex-col justify-end p-6 shadow-2xl">
                {/* Background ambient glow inside the card */}
                <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 via-transparent to-transparent pointer-events-none" />
                
                {/* Glassmorphic info block placeholder */}
                <div className="space-y-3 relative z-10 w-full p-5 rounded-xl border border-white/5 bg-black/45 backdrop-blur-md">
                  {/* Category main name skeleton */}
                  <div className="h-7 w-1/2 bg-neutral-800/80 rounded animate-pulse" />
                  {/* Room subheading skeleton */}
                  <div className="h-4 w-1/3 bg-neutral-800/50 rounded animate-pulse" />
                  {/* Description line skeleton */}
                  <div className="space-y-1.5 pt-2">
                    <div className="h-3 w-full bg-neutral-800/50 rounded animate-pulse" />
                    <div className="h-3 w-5/6 bg-neutral-800/50 rounded animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Right Card Skeleton */}
              <div className="hidden lg:block w-[280px] h-[420px] opacity-30 bg-neutral-900/60 rounded-2xl animate-pulse border border-white/5" />
            </div>
          )}
        </div>
      </section>

      {/* ABOUT TEASER */}
      <section className="relative overflow-hidden py-24">
        <div
          className="absolute inset-0 transition-colors duration-300"
          style={{ 
            background: 'linear-gradient(to bottom, var(--bg-primary), var(--bg-surface) 20%, var(--bg-surface) 100%)' 
          }}
        />

        {/* Particles Background Overlay */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <Particles
            particleColors={["#ffdb6a"]}
            particleCount={200}
            particleSpread={10}
            speed={0.2}
            particleBaseSize={100}
            moveParticlesOnHover
            alphaParticles={false}
            disableRotation={false}
            pixelRatio={1}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <div className="flex flex-col items-center justify-center">
            <ScrollReveal
              enableBlur={true}
              baseOpacity={0.1}
              baseRotation={4}
              blurStrength={6}
              containerClassName="mb-6 mx-auto text-center"
              textClassName="!text-3xl sm:!text-4xl md:!text-5xl font-heading text-theme-primary leading-tight text-center"
            >
              {"A Space for Every Art Form"}
            </ScrollReveal>
            
            <ScrollReveal
              enableBlur={true}
              baseOpacity={0.1}
              baseRotation={2}
              blurStrength={4}
              containerClassName="mb-6 mx-auto text-center"
              textClassName="!text-base sm:!text-lg leading-snug text-theme-secondary font-sans !font-normal text-center"
            >
              {"This virtual gallery is designed to celebrate the diversity of artistic expression. From traditional paintings to digital compositions, from poetry to film, every medium has a dedicated space to shine."}
            </ScrollReveal>
            
            <ScrollReveal
              enableBlur={true}
              baseOpacity={0.1}
              baseRotation={2}
              blurStrength={4}
              containerClassName="mb-6 mx-auto text-center"
              textClassName="!text-base sm:!text-lg leading-snug text-theme-muted font-sans !font-normal text-center"
            >
              {"Rate your favorite pieces, leave feedback, and immerse yourself in a curated experience that bridges the gap between artist and audience."}
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
