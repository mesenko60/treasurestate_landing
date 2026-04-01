import React from 'react';
import Link from 'next/link';
import inscriptionStyles from '../MarkerInscription.module.css';
import { renderTextWith1910FireArticleLinks } from '../../lib/renderMontana1910FireArticleLinks';

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
};

const TOPIC_LABELS: Record<string, string> = {
  'architecture': 'Architecture',
  'industry': 'Industry',
  'exploration': 'Exploration',
  'native-american': 'Native American',
  'settlements': 'Settlements',
  'military': 'Military',
  'nature': 'Nature',
  'transportation': 'Transportation',
  'railroads': 'Railroads',
  'mining': 'Mining',
};

export default function HistoricMarkers({ markers, townName, townSlug }: Props) {
  if (markers.length === 0) return null;

  const displayMarkers = markers.slice(0, 5);
  const hasMore = markers.length > 5;

  return (
    <section style={{ marginTop: '2rem' }}>
      <h2 style={{ fontSize: '1.25rem', color: '#204051', marginBottom: '0.5rem' }}>
        History &amp; Landmarks
      </h2>
      <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '1rem' }}>
        {markers.length} historic marker{markers.length !== 1 ? 's' : ''} in and around {townName}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {displayMarkers.map(m => (
          <div
            key={m.id}
            style={{
              padding: '1rem',
              background: '#f8faf8',
              borderRadius: '8px',
              border: '1px solid #e8ede8',
            }}
          >
            <h3 style={{ fontSize: '1rem', color: '#204051', margin: '0 0 0.3rem' }}>
              {m.title}
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#555', lineHeight: 1.5, margin: '0 0 0.5rem' }}>
              {renderTextWith1910FireArticleLinks(m.inscription.substring(0, 150), {
                linkClassName: inscriptionStyles.fireArticleLink,
              })}
              ...
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {m.topics.slice(0, 2).map(t => (
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
                  Read More &rarr;
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <Link
            href={`/historic-markers/?county=${encodeURIComponent(townName)}`}
            style={{
              display: 'inline-block',
              padding: '0.6rem 1.25rem',
              background: '#204051',
              color: '#fff',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            View All {markers.length} Markers
          </Link>
        </div>
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
        <span style={{ fontSize: '1.5rem' }}>📜</span>
        <div>
          <div style={{ fontSize: '0.9rem', color: '#204051', fontWeight: 600 }}>
            Explore History Trails
          </div>
          <div style={{ fontSize: '0.82rem', color: '#666' }}>
            Curated driving routes connecting historic markers by theme
          </div>
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
          View Trails &rarr;
        </Link>
      </div>
    </section>
  );
}
