import React from 'react';
import Link from 'next/link';
import MarkerInscription from '../MarkerInscription';
import {
  townHistoricMarkersDirectoryHref,
  countyHistoricMarkersDirectoryHref,
  normalizeCountyForMarkerFilter,
} from '../../lib/townHistoricMarkers';
import type { MarkerDeepRead } from '../../lib/markerDeepReadsTypes';

type Marker = {
  id: string;
  slug: string;
  title: string;
  inscription: string;
  topics: string[];
  isCurated: boolean;
};

type Props = {
  markers: Marker[];
  townName: string;
  townSlug: string;
  countyRaw?: string | null;
  deepReads?: Record<string, MarkerDeepRead>;
  historyProse?: string;
};

const TOPIC_LABELS: Record<string, string> = {
  architecture: 'Architecture',
  industry: 'Industry',
  exploration: 'Exploration',
  'native-american': 'Native American',
  settlements: 'Settlements',
  military: 'Military',
  nature: 'Nature',
  transportation: 'Transportation',
  railroads: 'Railroads',
  mining: 'Mining',
};

const innerDetailsStyle: React.CSSProperties = {
  border: '1px solid #e0e8e0',
  borderRadius: '8px',
  marginBottom: '0.5rem',
  background: '#fff',
  overflow: 'hidden',
};

const innerSummaryStyle: React.CSSProperties = {
  padding: '0.75rem 1rem',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '0.92rem',
  color: '#204051',
  listStyle: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.75rem',
};

const mapLinkStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.3rem',
  fontSize: '0.82rem',
  color: '#3b6978',
  fontWeight: 600,
  textDecoration: 'none',
};

export default function HistoricMarkers({
  markers,
  townName,
  townSlug,
  countyRaw,
  deepReads = {},
  historyProse,
}: Props) {
  const mapHref = townHistoricMarkersDirectoryHref(townSlug);
  const countyBase = normalizeCountyForMarkerFilter(countyRaw ?? null);
  const countyHref = countyBase ? countyHistoricMarkersDirectoryHref(countyBase) : null;

  const sorted = [...markers].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div id="local-history" className="content-section" style={{ marginTop: '2rem' }}>
      <section aria-labelledby="history-heritage-heading">
        <h2
          id="history-heritage-heading"
          style={{ fontSize: '1.25rem', color: '#204051', marginBottom: '0.5rem' }}
        >
          History &amp; Heritage
        </h2>

        {historyProse && (
          <div
            style={{ fontSize: '0.92rem', color: '#444', lineHeight: 1.65, marginBottom: '1rem' }}
            dangerouslySetInnerHTML={{ __html: historyProse }}
          />
        )}

        <p style={{ fontSize: '0.9rem', color: '#666', margin: '0 0 1rem', lineHeight: 1.55 }}>
          Official historic markers tied to {townName} in our statewide dataset. Expand the list
          to read inscriptions and follow links to full pages or deep reads where available.
          {countyHref && countyBase && (
            <>
              {' '}
              <Link href={countyHref} style={{ color: '#3b6978', fontWeight: 600, textDecoration: 'none' }}>
                Browse {countyBase} County on the map
              </Link>
              {' · '}
            </>
          )}
          {!countyHref && ' '}
          <Link href="/guides/history-trails/" style={{ color: '#3b6978', fontWeight: 600, textDecoration: 'none' }}>
            History trails
          </Link>
        </p>

        {sorted.length === 0 ? (
          <p style={{ fontSize: '0.9rem', color: '#777' }}>
            No markers are matched to {townName} in our dataset yet. Use the map below to explore
            nearby markers by county, or open the full explorer.
          </p>
        ) : (
          <details
            style={{
              border: '1px solid #d5e0d5',
              borderRadius: '10px',
              marginBottom: '1.5rem',
              background: '#f8faf8',
              overflow: 'hidden',
            }}
          >
            <summary
              style={{
                padding: '0.85rem 1.15rem',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.95rem',
                color: '#204051',
                listStyle: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>Historic markers in {townName} ({sorted.length})</span>
              <span style={{ fontSize: '0.75rem', color: '#888', fontWeight: 400 }}>
                tap to expand
              </span>
            </summary>

            <div style={{ padding: '0.65rem 0.85rem 0.85rem' }}>
              {sorted.map((m) => {
                const dr = deepReads[m.slug];
                return (
                  <details key={m.id} style={innerDetailsStyle}>
                    <summary style={innerSummaryStyle}>
                      <span style={{ flex: 1, textAlign: 'left' }}>{m.title}</span>
                      {(m.isCurated || dr) && (
                        <span
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                            color: '#2d6a4f',
                            flexShrink: 0,
                          }}
                        >
                          {dr ? 'Deep Read' : 'Story'}
                        </span>
                      )}
                    </summary>
                    <div
                      style={{
                        padding: '0 1rem 1rem',
                        borderTop: '1px solid #eef2ee',
                        paddingTop: '0.75rem',
                      }}
                    >
                      <div style={{ marginBottom: '0.65rem' }}>
                        <MarkerInscription text={m.inscription} variant="compact" />
                      </div>
                      {m.topics.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.65rem' }}>
                          {m.topics.map((t) => (
                            <span
                              key={t}
                              style={{
                                fontSize: '0.68rem',
                                padding: '0.12rem 0.4rem',
                                background: '#e8f4f8',
                                borderRadius: '4px',
                                color: '#3b6978',
                              }}
                            >
                              {TOPIC_LABELS[t] || t}
                            </span>
                          ))}
                        </div>
                      )}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', alignItems: 'center' }}>
                        {m.isCurated && (
                          <Link
                            href={`/historic-markers/${m.slug}/`}
                            style={{ fontSize: '0.84rem', color: '#2d6a4f', fontWeight: 600, textDecoration: 'none' }}
                          >
                            Full marker page &rarr;
                          </Link>
                        )}
                        {dr && (
                          <Link
                            href={dr.href}
                            style={{ fontSize: '0.84rem', color: '#925f14', fontWeight: 600, textDecoration: 'none' }}
                          >
                            {dr.title} &rarr;
                          </Link>
                        )}
                        <Link href={mapHref} style={mapLinkStyle}>
                          View on map &rarr;
                        </Link>
                      </div>
                    </div>
                  </details>
                );
              })}
            </div>
          </details>
        )}
      </section>

      <section
        id="historic-markers-map"
        aria-labelledby="historic-markers-map-heading"
        style={{
          padding: '1.15rem 1.25rem',
          background: '#f4f7f5',
          borderRadius: '10px',
          border: '1px solid #dce8dc',
        }}
      >
        <h3
          id="historic-markers-map-heading"
          style={{ fontSize: '1.05rem', color: '#204051', margin: '0 0 0.45rem' }}
        >
          Historic markers map
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#555', margin: '0 0 1rem', lineHeight: 1.5 }}>
          Open the interactive map filtered to {townName}. The view zooms to the markers for this community.
        </p>
        <Link
          href={mapHref}
          style={{
            display: 'inline-block',
            padding: '0.7rem 1.35rem',
            background: '#204051',
            color: '#fff',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '0.92rem',
            boxShadow: '0 2px 8px rgba(32,64,81,0.2)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Open map zoomed to {townName} &rarr;
        </Link>
      </section>
    </div>
  );
}
