import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Particles from '@/components/ui/Particles';
import wordmarkImg from '../assets/Wordmark.png';
import ScrollReveal from '../components/ui/ScrollReveal';

export default function AboutPage() {
  const scrollContainerRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    const listener = () => setIsDesktop(media.matches);
    listener(); // initial evaluation
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  return (
    <div className="relative z-0 min-h-screen md:h-screen md:overflow-hidden flex flex-col justify-start">
      {/* Dynamic Style block to control page-level scrolling and hide layout scrollbar on desktop */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Hide scrollbars but keep functionality */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        
        /* Justify ScrollReveal paragraphs */
        .justify-paragraphs .scroll-reveal-text {
          text-align: justify !important;
          text-justify: inter-word !important;
        }

        @media (min-width: 768px) {
          html, body {
            overflow: hidden !important;
            height: 100vh !important;
          }
          /* Lock standard layout wrapper scroll */
          .flex.min-h-screen.flex-col {
            height: 100vh !important;
            min-height: 100vh !important;
            overflow: hidden !important;
          }
        }
      `}} />

      {/* Particles background covering the entirety of the About page */}
      <div className="fixed inset-0 w-screen h-screen pointer-events-none z-[-1] opacity-[0.08] dark:opacity-[0.2]">
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

      {/* Header (stays static above the scrollable area) */}
      <header className="relative pt-28 pb-8 flex flex-col items-center justify-center text-center select-none z-10 shrink-0">
        <span 
          className="uppercase tracking-[0.2em] font-sans font-semibold mb-2"
          style={{
            fontSize: '0.85rem',
            color: 'var(--text-primary)',
            opacity: 0.55
          }}
        >
          All About
        </span>
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 px-6 animate-fade-in"
        >
          <img 
            src={wordmarkImg} 
            alt="Silid Museo" 
            className="h-18 sm:h-22 md:h-26 w-auto object-contain mx-auto filter dark:brightness-110 dark:invert-0 invert" 
          />
        </motion.div>
      </header>

      {/* Content wrapper - behaves like inner scroll container on desktop */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 w-full px-6 md:px-8 no-scrollbar justify-paragraphs overflow-y-visible h-auto max-h-none md:overflow-y-scroll md:h-[55vh] shrink-0"
      >
        <div className="mx-auto max-w-[680px] w-full pb-24 space-y-10">
          <ScrollReveal
            scrollContainerRef={isDesktop ? scrollContainerRef : null}
            enableBlur={true}
            baseOpacity={0.1}
            baseRotation={2}
            blurStrength={4}
            containerClassName="mx-auto text-justify"
            textClassName="!text-sm md:!text-base leading-relaxed text-theme-primary font-heading font-normal text-justify"
          >
            {"Silid Museo is a conceptual digital sanctuary where art, history, space, and sound converge to create an interactive cultural experience. Conceived as a multi-room exhibition, Silid Museo—literally meaning \"Museum Room\"—reimagines how diverse artistic mediums can coexist, interact, and speak to the contemporary observer."}
          </ScrollReveal>

          <ScrollReveal
            scrollContainerRef={isDesktop ? scrollContainerRef : null}
            enableBlur={true}
            baseOpacity={0.1}
            baseRotation={2}
            blurStrength={4}
            containerClassName="mx-auto text-justify"
            textClassName="!text-sm leading-relaxed text-theme-secondary font-sans !font-normal text-justify"
          >
            {"Our journey begins in Silid-Lona (The Canvas Room). Here, the boundaries of visual creation are expanded by juxtaposing the organic with the digital. In one light, we showcase hand-drawn illustrations that document the artist's personal thoughts, raw observations, and immediate experiences of a fleeting moment through the purity of line, form, and composition. In another, we explore the frontiers of technology with digital paintings co-created with artificial intelligence. The centerpiece—a digital painting inspired by the 128th Philippine Independence Day—translates semantic artist descriptions into complex visual allegories. Together, they invite the viewer to reflect on the intersection of human intentionality and synthetic intelligence."}
          </ScrollReveal>

          <ScrollReveal
            scrollContainerRef={isDesktop ? scrollContainerRef : null}
            enableBlur={true}
            baseOpacity={0.1}
            baseRotation={2}
            blurStrength={4}
            containerClassName="mx-auto text-justify"
            textClassName="!text-sm leading-relaxed text-theme-secondary font-sans !font-normal text-justify"
          >
            {"Moving deeper, we enter the acoustic sanctuary of Silid-Tinig (The Audio Room). In this space, sound and original songwriting become instruments of critical reflection and social advocacy. The highlight of this room is the original composition \"Hindi Kami Kaaway,\" a poignant sonic response to the struggles of red-tagging. Through evocative melodies and lyrics, the piece illuminates the human cost of false accusations, red-tagging, and social labeling, urging listeners to reflect on the human cost and the importance of protecting truth, dignity, and justice."}
          </ScrollReveal>

          <ScrollReveal
            scrollContainerRef={isDesktop ? scrollContainerRef : null}
            enableBlur={true}
            baseOpacity={0.1}
            baseRotation={2}
            blurStrength={4}
            containerClassName="mx-auto text-justify"
            textClassName="!text-sm leading-relaxed text-theme-secondary font-sans !font-normal text-justify"
          >
            {"In Silid-Salin (The Transcreation Room), the boundary between static canvas and live performance is dissolved. This space is dedicated to the art of transcreation—the adaptation of works across different media. It features our original musical play, Larong Pinoy, inspired by the heritage paintings of Rico Doronio. The narrative follows a modern child who is magically transported into the painted canvas by her grandmother, learning to play traditional Filipino games like luksong baka, patintero, luksong tinik, and tumbang preso. By bringing these painted scenes to life through music, storytelling, and performance, the production explores the value of play, memory, and culture across generations."}
          </ScrollReveal>

          <ScrollReveal
            scrollContainerRef={isDesktop ? scrollContainerRef : null}
            enableBlur={true}
            baseOpacity={0.1}
            baseRotation={2}
            blurStrength={4}
            containerClassName="mx-auto text-justify"
            textClassName="!text-sm leading-relaxed text-theme-secondary font-sans !font-normal text-justify"
          >
            {"Silid-Kasaysayan (The History Room) provides the intellectual foundation of our journey, tracing the visual styles and techniques that have defined human history. This curated presentation walks visitors through the epochal shifts of art history—from the primal markings of Prehistoric Art and the symbolic monuments of Egyptian Art to the architectural mastery of Classical Greece and Rome, the spiritual depth of Medieval Art, and the humanist revolutions of the Renaissance and Mannerism. It offers a structured lens through which we can appreciate the historical currents that still influence our modern aesthetics."}
          </ScrollReveal>

          <ScrollReveal
            scrollContainerRef={isDesktop ? scrollContainerRef : null}
            enableBlur={true}
            baseOpacity={0.1}
            baseRotation={2}
            blurStrength={4}
            containerClassName="mx-auto text-justify"
            textClassName="!text-sm leading-relaxed text-theme-secondary font-sans !font-normal text-justify"
          >
            {"Physicality and materiality take center stage in Silid-Espasyo (The Spatial Room). Dedicated to three-dimensional expression and installation art, this room features a scale model of an Ancient Greek temple. Crafted entirely from discarded cardboard and recycled materials, this project demonstrates how classical architectural principles can be reimagined through a modern lens of ecological sustainability. It bridges the ancient past and the green future, proving that monumental design can be built upon mindful preservation."}
          </ScrollReveal>

          <ScrollReveal
            scrollContainerRef={isDesktop ? scrollContainerRef : null}
            enableBlur={true}
            baseOpacity={0.1}
            baseRotation={2}
            blurStrength={4}
            containerClassName="mx-auto text-justify"
            textClassName="!text-sm leading-relaxed text-theme-secondary font-sans !font-normal text-justify"
          >
            {"In Silid-Aninag (The Screening Room), light and time weave cinematic narratives. This space features moving image and video content, capturing temporal beauty and visual storytelling that cannot be held in a single frame."}
          </ScrollReveal>

          <ScrollReveal
            scrollContainerRef={isDesktop ? scrollContainerRef : null}
            enableBlur={true}
            baseOpacity={0.1}
            baseRotation={2}
            blurStrength={4}
            containerClassName="mx-auto text-justify"
            textClassName="!text-sm leading-relaxed text-theme-secondary font-sans !font-normal text-justify"
          >
            {"Finally, we arrive at Silid-Manlilikha (The Creators' Room). Silid Museo is not merely a collection of rooms, but a testament to collaborative human effort. This final space is dedicated to the group of creators and our subject instructor whose guidance, critique, and shared vision transformed a digital architecture into a living, breathing museum. It is a warm tribute to the creative bonds, hard work, and shared ideals that made this virtual sanctuary a reality."}
          </ScrollReveal>

          <ScrollReveal
            scrollContainerRef={isDesktop ? scrollContainerRef : null}
            enableBlur={true}
            baseOpacity={0.1}
            baseRotation={2}
            blurStrength={4}
            containerClassName="mx-auto text-justify pt-8 border-t border-theme-subtle"
            textClassName="!text-sm font-medium leading-relaxed text-theme-primary font-sans text-justify"
          >
            {"At its core, the mission of Silid Museo remains to create an inclusive virtual space that celebrates artistic expression across all mediums, making art accessible, dialogic, and interactive for everyone."}
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
