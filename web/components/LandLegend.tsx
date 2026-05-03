import React from 'react';
import { PUBLIC_LAND_SEMANTICS, PUBLIC_LAND_TIER_DISPLAY_ORDER } from '../lib/classifyMontanaPublicOwner';

const SWATCH: React.CSSProperties = {
  flexShrink: 0,
  width: 28,
  height: 14,
  borderRadius: '4px',
  border: '1px solid rgba(0,0,0,0.12)',
};

/**
 * Explains Treasure State vector classification, MSDI rasters, and hunting pins.
 */
export default function LandLegend() {
  return (
    <details
      style={{
        marginBottom: '1.5rem',
        borderRadius: '10px',
        border: '1px solid #e0e8ea',
        padding: '0.75rem 1rem',
        background: '#fbfdfe',
      }}
    >
      <summary style={{ cursor: 'pointer', fontWeight: 700, color: '#204051', fontSize: '0.92rem', fontFamily: 'var(--font-primary, sans-serif)' }}>
        Map legend &mdash; categorical public lands vs. rasters &amp; dots
      </summary>
      <div style={{ marginTop: '0.85rem', fontSize: '0.82rem', color: '#45555e', lineHeight: 1.55 }}>
        <p style={{ margin: '0 0 0.75rem' }}>
          After you zoom in (≈ Montana-wide scale 11+), MSDI Public Lands polygons are tinted with Treasure State colors so federal, DNRC trust parcels, Montana FWP parcels, broader state-managed blocks, tribal text matches (when detected), city/county ground, etc. visually separate.
          Regions without those fills typically remain privately held — turn on parcel linework when you want every lot boundary etched on top.
        </p>

        <p style={{ margin: '0 0 0.5rem', fontWeight: 700, color: '#204051', fontFamily: 'var(--font-primary, sans-serif)' }}>
          Treasure State categorical public fills
        </p>
        <ul style={{ margin: '0 0 0.9rem', paddingLeft: '0', listStyle: 'none' }}>
          {PUBLIC_LAND_TIER_DISPLAY_ORDER.map((tier) => (
            <li key={tier} style={{ marginBottom: '0.45rem', display: 'flex', gap: '0.55rem', alignItems: 'flex-start' }}>
              <span
                style={{
                  ...SWATCH,
                  marginTop: '0.1rem',
                  background: PUBLIC_LAND_SEMANTICS[tier].fill,
                  border: `1px solid ${PUBLIC_LAND_SEMANTICS[tier].outline}`,
                }}
                aria-hidden
              />
              <span>
                <strong style={{ display: 'block', color: '#204051', fontWeight: 700 }}>
                  {PUBLIC_LAND_SEMANTICS[tier].label}
                </strong>
              </span>
            </li>
          ))}
        </ul>

        <p style={{ margin: '0 0 0.65rem', fontWeight: 700, color: '#204051', fontFamily: 'var(--font-primary, sans-serif)' }}>
          MSDI raster overlays (PNG tiles from ArcGIS Export)
        </p>
        <p style={{ margin: '0 0 0.75rem' }}>
          Montana State Library also streams shaded conservation parcels, statewide parcel envelopes, township grids, and the tinted public panorama you see farther zoomed-out. Those symbologies match the authoritative{' '}
          <a href="https://gis.mt.gov/" target="_blank" rel="noopener noreferrer" style={{ color: '#3b6978', fontWeight: 600 }}>
            Montana Cadastral viewer
          </a>
          {' '}for lookups and disclaimers — Treasure State overlays are educational only.
        </p>

        <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
          <li style={{ marginBottom: '0.45rem' }}>
            <strong>Conservation easements</strong> &mdash; private parcels with legally recorded restrictions; shading does{' '}
            <em>not</em>
            promise recreation access.
          </li>
          <li style={{ marginBottom: '0.45rem' }}>
            <strong>Parcel grid</strong> &mdash; turn on zoomed-in linework whenever you must decide where one lot ends and another begins.
          </li>
          <li style={{ marginBottom: '0.45rem' }}>
            <strong>PLSS township grid</strong> &mdash; legal township / range references for surveying notes and hunting district cross-checks.
          </li>
        </ul>
        <p style={{ margin: '0.85rem 0 0', fontSize: '0.78rem', color: '#6a7a82' }}>
          <strong>Hunting guide dots</strong> (green WMA · blue Forest · desert brown BLM · tan refuge shades) reuse the Montana Hunting palette and deep-link straight to each pinned write-up when you zoom to the symbol.
        </p>
      </div>
    </details>
  );
}
