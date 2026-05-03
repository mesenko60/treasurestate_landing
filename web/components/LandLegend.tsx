import React from 'react';

const SWATCH: React.CSSProperties = {
  flexShrink: 0,
  width: 28,
  height: 14,
  borderRadius: '4px',
  border: '1px solid rgba(0,0,0,0.12)',
};

/**
 * Explains Treasure State overlays (Mapbox dots) and MSDI raster symbology
 * rendered by Montana State Library services.
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
        Map legend &mdash; MSDI raster vs. Treasure State dots
      </summary>
      <div style={{ marginTop: '0.85rem', fontSize: '0.82rem', color: '#45555e', lineHeight: 1.55 }}>
        <p style={{ margin: '0 0 0.75rem' }}>
          <strong>Cadastral rasters:</strong> Public lands, conservation easements, parcel linework, and PLSS grids are streamed as transparent PNG tiles from Montana
          State Library ArcGIS map services. Fill colors and labels follow the state&rsquo;s published symbology &mdash; use the official{' '}
          <a href="https://gis.mt.gov/" target="_blank" rel="noopener noreferrer" style={{ color: '#3b6978', fontWeight: 600 }}>
            Montana Cadastral map
          </a>{' '}
          for parcel research and legal descriptions.
        </p>
        <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
          <li style={{ marginBottom: '0.45rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ ...SWATCH, background: 'linear-gradient(90deg,#c4a574,#5a8a5c)' }} aria-hidden />
              <strong>Public lands</strong> &mdash; federal, state, tribal, and other publicly administered surface ownership from the DOR cadastral framework.
            </span>
          </li>
          <li style={{ marginBottom: '0.45rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ ...SWATCH, background: 'repeating-linear-gradient(45deg,#a8c8a0,#a8c8a0 4px,#e8f4e4 4px,#e8f4e4 8px)' }} aria-hidden />
              <strong>Conservation easements</strong> &mdash; private parcels with registered easements; <em>no public access is implied</em>.
            </span>
          </li>
          <li style={{ marginBottom: '0.45rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ ...SWATCH, background: '#f5f5f5', boxShadow: 'inset 0 0 0 1px #888' }} aria-hidden />
              <strong>Parcels</strong> &mdash; statewide tax and exempt parcel boundaries (linework can be dense; enable only when zoomed in).
            </span>
          </li>
          <li style={{ marginBottom: '0.45rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ ...SWATCH, background: 'repeating-linear-gradient(90deg,#ccc 0 2px,transparent 2px 6px)' }} aria-hidden />
              <strong>PLSS</strong> &mdash; townships, ranges, sections, and subdivisions for legal land descriptions.
            </span>
          </li>
        </ul>
        <p style={{ margin: '0.85rem 0 0', fontSize: '0.78rem', color: '#6a7a82' }}>
          <strong>Hunting guide dots</strong> (green = WMA, blue = National Forest, brown = BLM, tan = refuge) match the{' '}
          <a href="/guides/hunting-guide/" style={{ color: '#3b6978', fontWeight: 600 }}>Montana Hunting Guide</a> map and link back to each area card on that page.
        </p>
      </div>
    </details>
  );
}
