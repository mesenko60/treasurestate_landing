'use client';

import type { CSSProperties } from 'react';
import TodayInHistory from './TodayInHistory';

type Layout = 'home' | 'hero' | 'strip';

type Props = {
  layout: Layout;
};

function SearchMontanaButton({
  className,
  style,
  stripBorder,
  useCssHover,
}: {
  className?: string;
  style?: CSSProperties;
  stripBorder?: boolean;
  /** When true, hover is from CSS only (e.g. .hp-hero-search). */
  useCssHover?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('openSearch'))}
      aria-label="Open search"
      className={className}
      style={style}
      onMouseEnter={
        useCssHover
          ? undefined
          : (e) => {
              e.currentTarget.style.boxShadow = stripBorder
                ? '0 4px 16px rgba(15,35,48,0.12)'
                : '0 6px 28px rgba(0,0,0,0.35)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
      }
      onMouseLeave={
        useCssHover
          ? undefined
          : (e) => {
              e.currentTarget.style.boxShadow = stripBorder
                ? '0 2px 12px rgba(15,35,48,0.08)'
                : '0 4px 20px rgba(0,0,0,0.25)';
              e.currentTarget.style.transform = 'none';
            }
      }
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <span
        style={{
          flex: 1,
          textAlign: 'left',
          color: '#9ca3af',
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '0.95rem',
          fontWeight: 500,
        }}
      >
        Search Montana...
      </span>
      <kbd
        style={{
          fontSize: '0.7rem',
          padding: '2px 6px',
          borderRadius: '4px',
          border: '1px solid #d1d5db',
          color: '#9ca3af',
          background: '#f9fafb',
        }}
      >
        ⌘K
      </kbd>
    </button>
  );
}

export default function SiteSearchWithHistory({ layout }: Props) {
  if (layout === 'home') {
    return (
      <>
        <SearchMontanaButton className="hp-hero-search" useCssHover />
        <div className="hp-hero-history">
          <TodayInHistory variant="pill" tone="glass" />
        </div>
      </>
    );
  }

  if (layout === 'hero') {
    return (
      <div className="hero-search-with-history">
        <SearchMontanaButton
          className="hero-search-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255,255,255,0.95)',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 18px',
            margin: '1.75rem auto 0',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
            maxWidth: '340px',
            width: 'auto',
            transition: 'box-shadow 0.2s, transform 0.2s',
          }}
        />
        <div className="hp-hero-history">
          <TodayInHistory variant="pill" tone="glass" />
        </div>
      </div>
    );
  }

  return (
    <section
      aria-label="Search and today in history"
      style={{
        background: 'linear-gradient(180deg, #f0f4f6 0%, #e8ecef 100%)',
        borderBottom: '1px solid #dce3e8',
        padding: '0.9rem 1rem 1rem',
        textAlign: 'center',
      }}
    >
      <SearchMontanaButton
        stripBorder
        className="ts-strip-search"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(255,255,255,0.98)',
          border: '1px solid #dce6ed',
          borderRadius: '8px',
          padding: '10px 18px',
          margin: '0 auto',
          cursor: 'pointer',
          boxShadow: '0 2px 12px rgba(15,35,48,0.08)',
          maxWidth: '340px',
          width: '100%',
          boxSizing: 'border-box',
          transition: 'box-shadow 0.2s, transform 0.2s',
        }}
      />
      <div className="hp-hero-history" style={{ marginTop: '0.75rem' }}>
        <TodayInHistory variant="pill" tone="light" />
      </div>
    </section>
  );
}
