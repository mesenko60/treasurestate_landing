import React from 'react';
import Link from 'next/link';
import MarkerInscription from '../MarkerInscription';
import {
  townHistoricMarkersDirectoryHref,
  countyHistoricMarkersDirectoryHref,
  normalizeCountyForMarkerFilter,
} from '../../lib/townHistoricMarkers';

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
  /** Raw county from town data (e.g. "Yellowstone County"); used for wider-area explorer link */
  countyRaw?: string | null;
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

export default function HistoricMarkers({ markers, townName, townSlug, countyRaw }: Props) {
  const directoryHref = townHistoricMarkersDirectoryHref(townSlug);
  const countyBase = normalizeCountyForMarkerFilter(countyRaw ?? null);
  const countyHref = countyBase ? countyHistoricMarkersDirectoryHref(countyBase) : null;

  const displayMarkers = markers.slice(0, 5);
  const hasMore = markers.length > 5;

  return (
    <section style={{ marginTop: '2rem' }} id="local-history" aria-labelledby="local-history-heading">
      <h2 id="local-history-heading" style={{ fontSize: '1.25rem', color: '#204051', marginBottom: '0.5rem' }}>
        Local History: Markers &amp; Deep Reads
      </h2>
      <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '1rem', lineHeight: 1.6 }}>
        Browse every historic marker tied to {townName} on the statewide map, open curated marker pages, and read
        deep-research companion stories where we have published them.
      </p>

      <div
        style={{
          padding: '1rem 1.15rem',
          background: 'linear-gradient(135deg, #f4f7f5 0%, #eef5f0 100%)',
          borderRadius: '10px',
          border: '1px solid #dce8dc',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', alignItems: 'center' }}>
          <Link
            href={directoryHref}
            style={{
              display: 'inline-block',
              padding: '0.65rem 1.2rem',
              background: '#204051',
              color: '#fff',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
            }}
          >
            Open {townName} markers directory (map + stories) →
          </Link>
          {countyHref && countyBase && (
            <Link
              href={countyHref}
              style={{
                fontSize: '0.88rem',
                color: '#3b6978',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Wider area: all markers in {countyBase} County →
            </Link>
          )}
        </div>
      </div>

      {markers.length > 0 && (
        <>
          <p style={{ fontSize: '0.92rem', color: '#555', marginBottom: '0.85rem' }}>
            {markers.length} marker{markers.length !== 1 ? 's' : ''} in our dataset for {townName} (preview below).
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {displayMarkers.map((m) => (
              <div
                key={m.id}
                style={{
                  padding: '1rem',
                  background: '#f8faf8',
                  borderRadius: '8px',
                  border: '1px solid #e8ede8',
                }}
              >
                <h3 style={{ fontSize: '1rem', color: '#204051', margin: '0 0 0.3rem' }}>{m.title}</h3>
                <div style={{ margin: '0 0 0.5rem' }}>
                  <MarkerInscription text={m.inscription} variant="compact" />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {m.topics.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: '0.72rem',
                        padding: '0.2rem 0.5rem',
                        background: '#e8f4f8',
                        borderRadius: '4px',
                        color: '#3b6978',
                      }}
                    >
                      {TOPIC_LABELS[t] || t}
                    </span>
                  ))}
                  {m.isCurated && (
                    <Link
                      href={`/historic-markers/${m.slug}/`}
                      style={{ fontSize: '0.82rem', color: '#3b6978', marginLeft: 'auto' }}
                    >
                      Full marker page &rarr;
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <Link
                href={directoryHref}
                style={{
                  display: 'inline-block',
                  padding: '0.6rem 1.25rem',
                  background: '#3b6978',
                  color: '#fff',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                }}
              >
                View all {markers.length} markers in the directory →
              </Link>
            </div>
          )}
        </>
      )}

      <div
        style={{
          marginTop: '1.25rem',
          padding: '1rem',
          background: '#f0f4f0',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <span style={{ fontSize: '1.5rem' }} aria-hidden>
          🛤️
        </span>
        <div>
          <div style={{ fontSize: '0.9rem', color: '#204051', fontWeight: 600 }}>History Trails</div>
          <div style={{ fontSize: '0.82rem', color: '#666' }}>Driving routes that connect markers by theme</div>
        </div>
        <Link
          href="/guides/history-trails/"
          style={{
            marginLeft: 'auto',
            fontSize: '0.85rem',
            color: '#3b6978',
            whiteSpace: 'nowrap',
          }}
        >
          View trails &rarr;
        </Link>
      </div>
    </section>
  );
}
