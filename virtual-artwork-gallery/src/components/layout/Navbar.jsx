import { SpotlightNavbar } from '../ui/spotlight-navbar';

export default function Navbar() {
  return (
    <nav className="fixed top-6 left-0 right-0 z-50 pointer-events-none flex justify-center px-4">
      <div
        className="flex items-center gap-3 px-3 py-1.5 rounded-full pointer-events-auto border transition-all duration-300 shadow-lg"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--bg-surface) 60%, transparent)',
          borderColor: 'var(--border-subtle)',
          boxShadow: '0 10px 30px -10px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
          backdropFilter: 'blur(3px)',
        }}
      >
        <SpotlightNavbar
          items={[
            { label: 'Home', href: '/' },
            { label: 'Gallery', href: '/#gallery' },
            { label: 'About', href: '/about' },
          ]}
        />
      </div>
    </nav>
  );
}
