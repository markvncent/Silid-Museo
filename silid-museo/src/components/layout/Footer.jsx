import { Link, useLocation } from 'react-router-dom';
import wordmarkImg from '../../assets/Wordmark.png';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const isAboutPage = location.pathname === '/about';

  return (
    <footer
      className="transition-colors duration-300"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      {isAboutPage ? (
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col gap-6 w-full">
          {/* Bento Header */}
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <span className="h-[1px] w-8 bg-[var(--border-subtle)] hidden md:block"></span>
            <h4 className="font-heading text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: 'var(--accent-gold)' }}>
              Artists
            </h4>
            <span className="h-[1px] flex-1 bg-[var(--border-subtle)] hidden md:block"></span>
          </div>

          {/* Bento Layout */}
          <div className="flex flex-wrap justify-center gap-3 w-full">
            {[
              { name: 'Achas, Kieth Lawrence', email: 's.achas.kiethlawrence@cmu.edu.ph' },
              { name: 'Espinosa, Heart Arachelli', email: 's.espinosa.heartarachelli@cmu.edu.ph' },
              { name: 'Galleros, Kimberly', email: 's.galleros.kimberly@cmu.edu.ph' },
              { name: 'Pañares, Frenche Jyne', email: 's.panares.frenchejyne@cmu.edu.ph' },
              { name: 'Ramir, Ceth Gayle', email: 's.ramir.cethgayle@cmu.edu.ph' },
              { name: 'Revilla, Cherlyn', email: 's.revillia.cherlyn@cmu.edu.ph' },
              { name: 'Saballia, Clarence', email: 's.saballia.clarence@cmu.edu.ph' },
              { name: 'Tan, Rodge Daniellette', email: 's.tan.rodgedaniellette@cmu.edu.ph' },
            ].map((artist, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 border text-center select-none w-[calc(50%-6px)] sm:w-[calc(33.333%-8px)] lg:w-[calc(16.666%-10px)] min-w-[120px] max-w-[180px]"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--bg-surface-hover) 80%, transparent)',
                  borderColor: 'var(--border-subtle)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-gold)';
                  e.currentTarget.style.boxShadow = '0 10px 25px -10px var(--accent-gold-glow), inset 0 1px 0 rgba(255,255,255,0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Artist Name */}
                <p
                  className="font-sans font-medium text-xs sm:text-[13px] leading-tight transition-all duration-300 py-1.5"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {artist.name}
                </p>

                {/* Popover Email Block */}
                <div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 px-3 py-1.5 rounded-lg border opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none shadow-xl z-50 text-[10px] font-sans tracking-wide whitespace-nowrap"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--accent-gold)',
                    color: 'var(--text-secondary)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                  }}
                >
                  {artist.email}
                  {/* Tooltip arrow */}
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-r border-b"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--accent-gold)',
                      marginTop: '-5px'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom minimal footer details */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-[var(--border-subtle)] text-[11px]" style={{ color: 'var(--text-muted)' }}>
            <p>&copy; {currentYear} silid-museo. All rights reserved.</p>
            <Link
              to="/admin"
              className="hover:underline transition-colors duration-300 mt-2 sm:mt-0"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-gold)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-12 md:grid-cols-3">
            {/* Brand Column */}
            <div>
              <Link to="/" className="group mb-4 inline-flex items-center">
                <img
                  src={wordmarkImg}
                  alt="silid-museo logo"
                  className="h-18 w-auto object-contain transition-all duration-300 dark:invert-0 invert"
                />
              </Link>
              <p
                className="mt-3 max-w-xs text-sm leading-relaxed"
                style={{ color: 'var(--text-muted)' }}
              >
                An interactive virtual gallery showcasing diverse art mediums and creative expressions.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3
                className="mb-4 text-sm font-semibold uppercase tracking-wider"
                style={{ color: 'var(--text-secondary)' }}
              >
                Navigation
              </h3>
              <ul className="space-y-3">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/#gallery', label: 'Gallery' },
                  { to: '/about', label: 'About' },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm transition-colors duration-300"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-gold)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Admin Redirection */}
            <div>
              <h3
                className="mb-4 text-sm font-semibold uppercase tracking-wider"
                style={{ color: 'var(--text-secondary)' }}
              >
                Administration
              </h3>
              <p className="mb-4 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Are you an authorized creator? Access the dashboard to manage artworks and comments.
              </p>
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 text-white"
                style={{
                  backgroundColor: 'var(--accent-gold)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--accent-gold-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--accent-gold)'; }}
              >
                <span>Admin Dashboard</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Bottom Bar */}
          <div
            className="mt-12 pt-8 text-center"
            style={{ borderTop: '1px solid var(--border-subtle)' }}
          >
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              &copy; {currentYear} silid-museo. All rights reserved.
            </p>
          </div>
        </div>
      )}
    </footer>
  );
}
