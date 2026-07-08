import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
export default function CategoryDoor({ slug, name, description, icon, gradient, index }) {
  return (
    <Link
      to={`/category/${slug}`}
      className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'none',
        animationDelay: `${index * 100}ms`,
      }}
      id={`category-door-${slug}`}
    >
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 py-12 text-center">
        {/* Icon */}
        <div className="mb-5 text-5xl transition-transform duration-500 group-hover:scale-110">
          {icon}
        </div>

        {/* Name */}
        <h3
          className="mb-2 text-lg font-semibold transition-colors duration-300"
          style={{ color: 'var(--text-primary)' }}
        >
          {name}
        </h3>

        {/* Description */}
        <p
          className="text-sm leading-relaxed transition-colors duration-300 group-hover:text-white/80"
          style={{ color: 'var(--text-muted)' }}
        >
          {description}
        </p>

        {/* Arrow indicator */}
        <div
          className="mt-5 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 group-hover:text-white"
          style={{
            backgroundColor: 'var(--border-subtle)',
            color: 'var(--text-muted)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Subtle ring on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ boxShadow: '0 0 0 1px var(--accent-gold-glow)' }}
      />
    </Link>
  );
}
