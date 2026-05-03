import React from 'react';
import { PUBLIC_LAND_SEMANTICS, PUBLIC_LAND_TIER_DISPLAY_ORDER } from '../lib/classifyMontanaPublicOwner';

const SWATCH: React.CSSProperties = {
  flexShrink: 0,
  width: 26,
  height: 12,
  borderRadius: '3px',
  border: '1px solid rgba(0,0,0,0.12)',
};

/** Collapsible legend for public-land tiers (map chrome or standalone). */
export default function LandLegend({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <details
      open={defaultOpen}
      style={{
        margin: 0,
        borderTop: '1px solid #e8eef0',
        padding: '0.5rem 1rem',
        background: '#fafcfd',
      }}
    >
      <summary
        style={{
          cursor: 'pointer',
          fontWeight: 600,
          color: '#204051',
          fontSize: '0.8rem',
          fontFamily: 'var(--font-primary, sans-serif)',
          listStyle: 'none',
        }}
      >
        Legend
      </summary>
      <div style={{ marginTop: '0.55rem', fontSize: '0.76rem', color: '#45555e', lineHeight: 1.5 }}>
        <p style={{ margin: '0 0 0.5rem' }}>
          Zoom in for colored public-land polygons by steward. Unfilled base map is usually private—use parcel linework to see lot boundaries.{' '}
          <a href="https://msl.mt.gov/geoinfo/msdi/cadastral/" target="_blank" rel="noopener noreferrer" style={{ color: '#3b6978', fontWeight: 600 }}>
            MSL MSDI cadastral
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
