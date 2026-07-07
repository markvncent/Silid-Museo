import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * ThemeToggle — A circular medallion-style button (like a wax seal)
 * that toggles between light and dark mode.
 */
export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 hover:scale-110 active:scale-95"
      style={{
        borderColor: 'var(--border-brown)',
        backgroundColor: 'var(--bg-surface)',
        color: 'var(--accent-gold)',
        boxShadow: '0 0 12px var(--accent-gold-glow)',
      }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      id="theme-toggle"
    >
      {theme === 'dark' ? (
        <Sun size={16} strokeWidth={2} />
      ) : (
        <Moon size={16} strokeWidth={2} />
      )}
    </button>
  );
}
