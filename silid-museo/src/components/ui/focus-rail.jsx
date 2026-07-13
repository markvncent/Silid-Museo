"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getArtworksByCategory } from "@/services/artworks.js";
import { fallbackArtworks } from "@/data/fallbackArtworks.js";

function CategoryThumbnailCycler({ categoryId, categorySlug, defaultImage, alt }) {
  const [images, setImages] = React.useState([defaultImage]);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    let active = true;
    const fetchImages = async () => {
      let artworkList = [];
      try {
        if (categoryId) {
          artworkList = await getArtworksByCategory(categoryId);
        }
      } catch (err) {
        console.warn(`Failed to fetch artworks for category ID ${categoryId}:`, err);
      } finally {
        if (!artworkList || artworkList.length === 0) {
          artworkList = fallbackArtworks[categorySlug] || [];
        }
        
        // Extract display images (thumbnail_url or image media_url)
        const extractedImages = artworkList
          .map(art => art.thumbnail_url || (art.media_type === 'image' ? art.media_url : null))
          .filter(Boolean);

        if (active) {
          if (extractedImages.length > 0) {
            setImages(extractedImages);
          } else {
            setImages([defaultImage]);
          }
        }
      }
    };

    fetchImages();

    return () => {
      active = false;
    };
  }, [categoryId, categorySlug, defaultImage]);

  React.useEffect(() => {
    if (images.length <= 1) return;

    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // cycle every 4 seconds

    return () => clearInterval(intervalId);
  }, [images]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-neutral-950 flex items-center justify-center">
      <AnimatePresence mode="popLayout">
        <motion.img
          key={images[currentIndex]}
          src={images[currentIndex]}
          alt={alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full object-cover pointer-events-none rounded-2xl"
        />
      </AnimatePresence>
    </div>
  );
}

function parseCategoryName(fullName) {
  if (!fullName) return { main: "", sub: "" };
  const match = fullName.match(/^(Silid-[^\s(]+)(?:\s*(\([^)]+\)))?/);
  if (match) {
    return {
      main: match[1],
      sub: match[2] || ""
    };
  }
  return { main: fullName, sub: "" };
}

/**
 * Helper to wrap indices (e.g., -1 becomes length-1)
 */
function wrap(min, max, v) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

/**
 * Physics Configuration
 * Base spring for spatial movement (x/z)
 */
const BASE_SPRING = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 1,
};

/**
 * Scale Spring
 * Bouncier spring specifically for the visual "Click/Tap" feedback on the center card
 */
const TAP_SPRING = {
  type: "spring",
  stiffness: 450,
  damping: 18,
  mass: 1,
};

export function FocusRail({
  items,
  initialIndex = 0,
  loop = true,
  autoPlay = false,
  interval = 4000,
  className,
}) {
  const [active, setActive] = React.useState(initialIndex);
  const [isHovering, setIsHovering] = React.useState(false);

  const count = items.length;
  const activeIndex = wrap(0, count, active);
  const activeItem = items[activeIndex];

  // --- NAVIGATION HANDLERS ---
  const handlePrev = React.useCallback(() => {
    if (!loop && active === 0) return;
    setActive((p) => p - 1);
  }, [loop, active]);

  const handleNext = React.useCallback(() => {
    if (!loop && active === count - 1) return;
    setActive((p) => p + 1);
  }, [loop, active, count]);

  // Autoplay logic
  React.useEffect(() => {
    if (!autoPlay || isHovering) return;
    const timer = setInterval(() => handleNext(), interval);
    return () => clearInterval(timer);
  }, [autoPlay, isHovering, handleNext, interval]);

  // Keyboard navigation
  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === "ArrowRight") handleNext();
  };

  // --- SWIPE / DRAG LOGIC ---
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const onDragEnd = (e, { offset, velocity }) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      handleNext();
    } else if (swipe > swipeConfidenceThreshold) {
      handlePrev();
    }
  };

  const visibleIndices = [-2, -1, 0, 1, 2];

  return (
    <div
      className={cn(
        "group relative flex h-[700px] w-full flex-col overflow-hidden bg-transparent text-white outline-none select-none overflow-x-hidden",
        className
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {/* Top Gradient Fade Overlay */}
      <div
        className="absolute top-0 left-0 right-0 h-24 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to bottom, var(--bg-primary), transparent)' }}
      />
      {/* Bottom Gradient Fade Overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to top, var(--bg-primary), transparent)' }}
      />
      {/* Left Gradient Fade Overlay */}
      <div
        className="absolute top-0 bottom-0 left-0 w-24 md:w-48 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to right, var(--bg-primary), transparent)' }}
      />
      {/* Right Gradient Fade Overlay */}
      <div
        className="absolute top-0 bottom-0 right-0 w-24 md:w-48 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to left, var(--bg-primary), transparent)' }}
      />

      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`bg-${activeItem.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src={activeItem.imageSrc}
              alt=""
              className="h-full w-full object-cover blur-3xl saturate-200"
            />
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, var(--bg-primary) 0%, rgba(0, 0, 0, 0.4) 50%, var(--bg-primary) 100%)'
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Stage */}
      <div className="relative z-10 flex flex-1 flex-col justify-center px-4 md:px-8">
        {/* DRAGGABLE RAIL CONTAINER */}
        <motion.div
          className="relative mx-auto flex h-[420px] w-full max-w-6xl items-center justify-center cursor-grab active:cursor-grabbing"
          style={{ perspective: "1200px" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={onDragEnd}
        >
          {visibleIndices.map((offset) => {
            const absIndex = active + offset;
            const index = wrap(0, count, absIndex);
            const item = items[index];

            if (!loop && (absIndex < 0 || absIndex >= count)) return null;

            const isCenter = offset === 0;
            const dist = Math.abs(offset);

            // Dynamic transforms — wider spacing for wider cards
            const xOffset = offset * 400;
            const zOffset = -dist * 200;
            const scale = isCenter ? 1 : 0.82;
            const rotateY = offset * -18;

            const opacity = isCenter ? 1 : Math.max(0.1, 1 - dist * 0.5);
            const blur = isCenter ? 0 : dist * 6;
            const brightness = isCenter ? 1 : 0.5;

            return (
              <motion.div
                key={absIndex}
                className={cn(
                  "absolute aspect-[3/4] w-[340px] md:w-[400px] rounded-2xl bg-neutral-900 shadow-2xl transition-shadow duration-300 overflow-hidden",
                  isCenter ? "z-20 shadow-white/10" : "z-10"
                )}
                initial={false}
                animate={{
                  x: xOffset,
                  z: zOffset,
                  scale: scale,
                  rotateY: rotateY,
                  opacity: opacity,
                  filter: `blur(${blur}px) brightness(${brightness})`,
                }}
                transition={(val) => {
                  if (val === "scale") return TAP_SPRING;
                  return BASE_SPRING;
                }}
                style={{
                  transformStyle: "preserve-3d",
                  border: "1px solid transparent",
                  backgroundImage: "linear-gradient(#171717, #171717), linear-gradient(to bottom right, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.01))",
                  backgroundOrigin: "border-box",
                  backgroundClip: "padding-box, border-box",
                }}
                onClick={() => {
                  if (offset !== 0) setActive((p) => p + offset);
                }}
              >
                <CategoryThumbnailCycler
                  categoryId={item.categoryId}
                  categorySlug={item.categorySlug}
                  defaultImage={item.imageSrc}
                  alt={item.title}
                />

                {/* Lighting layers */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                <div className="absolute inset-0 rounded-2xl bg-black/10 pointer-events-none mix-blend-multiply" />

                {/* Lower-third glassmorphism info overlay */}
                <div className="absolute bottom-0 left-0 right-0 rounded-b-2xl overflow-hidden" style={{ pointerEvents: isCenter ? 'auto' : 'none' }}>
                  {/* Gradient fade from transparent into the blur zone */}
                  <div
                    className="h-12"
                    style={{ background: 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.25))' }}
                  />
                  {/* Frosted glass container */}
                  <div
                    className="px-5 pb-5 pt-3"
                    style={{
                      backdropFilter: 'blur(24px) saturate(1.6)',
                      WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
                      backgroundColor: 'rgba(0, 0, 0, 0.35)',
                    }}
                  >
                    {(() => {
                      const { main, sub } = parseCategoryName(item.title);
                      return (
                        <div className="flex flex-col gap-0.5">
                          <h3 className="text-3xl md:text-4xl font-normal leading-tight text-white drop-shadow-md font-kingston tracking-wide">
                            {main}
                          </h3>
                          {sub && (
                            <span className="text-xs md:text-sm font-heading font-medium tracking-wider text-amber-500/90 drop-shadow-sm">
                              {sub}
                            </span>
                          )}
                        </div>
                      );
                    })()}
                    {item.description && (
                      <p className="mt-1.5 text-xs leading-relaxed text-neutral-300/80 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    {item.href && isCenter && (
                      <Link
                        to={item.href}
                        className="group/btn mt-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-black transition-all hover:bg-white hover:scale-105 active:scale-95"
                      >
                        Explore
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Controls */}
        <div className="mx-auto mt-18 flex w-full max-w-4xl items-center justify-center pointer-events-auto">
          <div className="flex items-center gap-1 rounded-full bg-neutral-900/80 p-1 ring-1 ring-white/10 backdrop-blur-md">
            <button
              onClick={handlePrev}
              className="rounded-full p-3 text-neutral-400 transition hover:bg-white/10 hover:text-white active:scale-95"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="min-w-[40px] text-center text-xs font-mono text-neutral-500">
              {activeIndex + 1} / {count}
            </span>
            <button
              onClick={handleNext}
              className="rounded-full p-3 text-neutral-400 transition hover:bg-white/10 hover:text-white active:scale-95"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
