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

const PREVIEW_MAX = 3;

export default function HistoricMarkers({ markers, townName, townSlug, countyRaw }: Props) {
  const directoryHref = townHistoricMarkersDirectoryHref(townSlug);
  const countyBase = normalizeCountyForMarkerFilter(countyRaw ?? null);
  const countyHref = countyBase ? countyHistoricMarkersDirectoryHref(countyBase) : null;

  const displayMarkers = markers.slice(0, PREVIEW_MAX);

  return (
    <section style={{ marginTop: '2rem' }} id="local-history" aria-labelledby="local-history-heading">
      <h2 id="local-history-heading" style={{ fontSize: '1.25rem', color: '#204051', marginBottom: '0.65rem' }}>
        Local History &amp; Markers
      </h2>

      <p style={{ fontSize: '0.92rem', color: '#555', margin: '0 0 0.85rem', lineHeight: 1.55 }}>
        <Link href={directoryHref} style={{ color: '#204051', fontWeight: 700, textDecoration: 'none' }}>
          Historic markers directory for {townName}
        </Link>
        {' — map, marker pages, and deep reads.'}
        {countyHref && countyBase && (
          <>
            {' '}
            <Link href={countyHref} style={{ color: '#3b6978', fontWeight: 600, textDecoration: 'none' }}>
              {countyBase} County (wider area)
            </Link>
          </>
        )}
        {' · '}
        <Link href="/guides/history-trails/" style={{ color: '#3b6978', fontWeight: 600, textDecoration: 'none' }}>
          History trails
        </Link>
      </p>

      {markers.length > 0 && (
        <>
          <p style={{ fontSize: '0.82rem', color: '#777', margin: '0 0 0.65rem' }}>
            Sample of markers tied to {townName} in our dataset ({markers.length} total
            {markers.length > PREVIEW_MAX ? ` — see directory for all` : ''}).
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {displayMarkers.map((m) => (
              <div
                key={m.id}
                style={{
                  padding: '0.85rem 1rem',
                  background: '#f8faf8',
                  borderRadius: '8px',
                  border: '1px solid #e8ede8',
                }}
              >
                <h3 style={{ fontSize: '0.98rem', color: '#204051', margin: '0 0 0.25rem' }}>{m.title}</h3>
                <div style={{ margin: '0 0 0.4rem' }}>
                  <MarkerInscription text={m.inscription} variant="compact" />
                </div>
                <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {m.topics.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: '0.7rem',
                        padding: '0.15rem 0.45rem',
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
                      style={{ fontSize: '0.8rem', color: '#3b6978', marginLeft: 'auto' }}
                    >
                      Full page &rarr;
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
