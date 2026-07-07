import { useEffect, useState } from 'react';
import pillarImg from '../../assets/pillar.png';

export default function PillarBorder() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById('gallery');
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, []);

  const transitionStyle = isVisible
    ? 'transform 900ms cubic-bezier(0.22, 1, 0.36, 1), opacity 900ms cubic-bezier(0.22, 1, 0.36, 1)'
    : 'transform 500ms ease-in, opacity 500ms ease-in';

  return (
    <>
      {/* Left Pillar */}
      <div
        className="hidden lg:block fixed top-0 h-screen w-[450px] z-30 pointer-events-none overflow-hidden"
        style={{
          left: '-200px', // 450px width - 200px offset = 250px visible
          transform: isVisible
            ? 'translateX(0) rotate(2deg)'
            : 'translateX(-120%) rotate(8deg)',
          opacity: isVisible ? 1 : 0,
          transition: transitionStyle,
        }}
      >
        <img
          src={pillarImg}
          alt=""
          className="h-full w-full object-cover pointer-events-none mix-blend-multiply"
          style={{ mixBlendMode: 'multiply', transform: 'scale(1.2)' }}
        />
      </div>

      {/* Right Pillar */}
      <div
        className="hidden lg:block fixed top-0 h-screen w-[450px] z-30 pointer-events-none overflow-hidden"
        style={{
          right: '-200px', // 450px width - 200px offset = 250px visible
          transform: isVisible
            ? 'translateX(0) rotate(-2deg) scaleX(-1)'
            : 'translateX(120%) rotate(-8deg) scaleX(-1)',
          opacity: isVisible ? 1 : 0,
          transition: transitionStyle,
        }}
      >
        <img
          src={pillarImg}
          alt=""
          className="h-full w-full object-cover pointer-events-none mix-blend-multiply"
          style={{ mixBlendMode: 'multiply', transform: 'scaleX(-1) scale(1.2)' }}
        />
      </div>
    </>
  );
}
