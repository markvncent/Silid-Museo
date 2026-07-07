import { Link } from 'react-router-dom';
import wordmarkImg from '../../assets/Wordmark.png';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="transition-colors duration-300"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
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
    </footer>
  );
}
