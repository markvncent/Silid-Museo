import Particles from '@/components/ui/Particles';

export default function AboutPage() {
  return (
    <div className="relative z-0">
      {/* Particles background covering the entirety of the About page */}
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
        className="fixed inset-0 w-screen h-screen pointer-events-none z-[-1] opacity-[0.08] dark:opacity-[0.2]"
      />

      {/* Header */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 z-[-2]" style={{ backgroundColor: 'var(--bg-surface)' }} />
        <div
          className="absolute inset-0 z-[-2]"
          style={{
            background: 'linear-gradient(to bottom, var(--bg-overlay), var(--bg-primary))',
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl" style={{ color: 'var(--text-primary)' }}>
            About the Gallery
          </h1>
          <p className="mx-auto max-w-xl text-lg" style={{ color: 'var(--text-muted)' }}>
            The story behind the virtual space.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6">
          <div className="grid gap-12 md:grid-cols-5">
            {/* Photo placeholder */}
            <div className="flex items-start justify-center md:col-span-2">
              <div
                className="flex h-64 w-48 items-center justify-center rounded-2xl border"
                style={{
                  borderColor: 'var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                }}
              >
                <div className="text-center">
                  <div className="mb-2 text-4xl">&#128100;</div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Artist Photo</p>
                </div>
              </div>
            </div>

            {/* Bio text */}
            <div className="md:col-span-3">
              <h2 className="mb-4 text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                The Artist
              </h2>
              <p className="mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Welcome to my virtual gallery, a space where creativity knows no boundaries.
                This project was born from a passion for showcasing diverse art mediums in one
                cohesive, interactive experience.
              </p>
              <p className="mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                As a multidisciplinary creator, I believe art thrives when it is accessible.
                Whether it is a photograph capturing a fleeting moment, a digital illustration
                pushing the boundaries of imagination, or a musical composition that moves
                the soul, every piece deserves a stage.
              </p>
              <p className="leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                This gallery is that stage. Explore, rate, and share your thoughts.
                Your feedback shapes the future of this creative space.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-6 text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Our Mission
          </h2>
          <p className="mx-auto max-w-xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            To create an inclusive virtual space that celebrates artistic expression across
            all mediums, making art accessible and interactive for everyone.
          </p>
        </div>
      </section>
    </div>
  );
}
