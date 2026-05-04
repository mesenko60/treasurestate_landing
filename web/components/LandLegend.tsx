import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { PUBLIC_LAND_SEMANTICS, PUBLIC_LAND_TIER_DISPLAY_ORDER } from '../lib/classifyMontanaPublicOwner';

const SWATCH: React.CSSProperties = {
  flexShrink: 0,
  width: 26,
  height: 12,
  borderRadius: '3px',
  border: '1px solid rgba(0,0,0,0.12)',
};

type Props = {
  /** Expanded on mount (fewer overlooked tier swatches). */
  defaultExpanded?: boolean;
  /** Rising edge expands again when entering full screen mode. */
  fullscreenActive?: boolean;
  /** Shorter summary line (e.g. narrow viewports). */
  compactSummary?: boolean;
};

/** Public land tier swatches plus MSL attribution (mounted under the map viewport). */
export default function LandLegend({ defaultExpanded = true, fullscreenActive, compactSummary }: Props) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const prevFsRef = useRef(false);

  useLayoutEffect(() => {
    const el = detailsRef.current;
    if (el) el.open = defaultExpanded;
  }, [defaultExpanded]);

  useEffect(() => {
    const el = detailsRef.current;
    const now = Boolean(fullscreenActive);
    const prev = prevFsRef.current;
    prevFsRef.current = now;

    if (el && now && !prev) {
      el.open = true;
    }
  }, [fullscreenActive]);

  return (
    <details
      ref={detailsRef}
      style={{
        margin: 0,
        borderTop: compactSummary ? 'none' : '1px solid #e8eef0',
        padding: compactSummary ? '0.25rem 0' : '0.5rem 1rem',
        background: compactSummary ? 'transparent' : '#fafcfd',
        flexShrink: 0,
      }}
    >
      <summary
        style={{
          cursor: 'pointer',
          fontWeight: 600,
          color: '#204051',
          fontSize: compactSummary ? '0.75rem' : '0.8rem',
          fontFamily: 'var(--font-primary, sans-serif)',
          listStyle: 'none',
          minHeight: compactSummary ? 32 : 44,
          display: 'flex',
          alignItems: 'center',
          padding: compactSummary ? '0.15rem 0' : '0.35rem 0',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        {compactSummary ? 'Legend — steward colors & MSL note' : 'Legend — public steward colors / private rule of thumb'}
      </summary>
      <div style={{ marginTop: '0.55rem', fontSize: '0.76rem', color: '#45555e', lineHeight: 1.5 }}>
        <p style={{ margin: '0 0 0.5rem' }}>
          Zoom in for colored public-land polygons by steward. Unfilled base map is usually private—use parcel linework to see lot boundaries.{' '}
          <a href="https://msl.mt.gov/geoinfo/msdi/cadastral/" target="_blank" rel="noopener noreferrer" style={{ color: '#3b6978', fontWeight: 600 }}>
            Montana State Library land GIS portal
          </a>
          {' '}
          is informational only.
        </p>
        <ul style={{ margin: '0 0 0.5rem', paddingLeft: '0', listStyle: 'none' }}>
          {PUBLIC_LAND_TIER_DISPLAY_ORDER.map((tier) => (
            <li key={tier} style={{ marginBottom: '0.25rem', display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
              <span
                style={{
                  ...SWATCH,
                  background: PUBLIC_LAND_SEMANTICS[tier].fill,
                  border: `1px solid ${PUBLIC_LAND_SEMANTICS[tier].outline}`,
                }}
                aria-hidden
              />
              <span>{PUBLIC_LAND_SEMANTICS[tier].label}</span>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
