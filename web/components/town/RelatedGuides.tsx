import Link from 'next/link';
import { getClusterConfig } from './cluster-data';

type Props = {
  slug: string;
  townName: string;
  currentTopic: string;
};

export default function RelatedGuides({ slug, townName, currentTopic }: Props) {
  const config = getClusterConfig(slug);
  if (!config) return null;

  const siblings = config.guides.filter(g => g.topic !== currentTopic);
  const guideHref = `/guides/moving-to-${slug}-montana/`;

  return (
    <div style={{ margin: '2.5rem 0', padding: '1.5rem', background: '#f8faf8', borderRadius: '12px', border: '1px solid #e2ebe2' }}>
      <h2 style={{ margin: '0 0 1rem', fontSize: '1.15rem', color: '#204051', fontFamily: 'var(--font-primary)' }}>
        More {townName} Guides
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
        {siblings.map(g => (
          <Link
            key={g.topic}
            href={`/montana-towns/${slug}/${g.topic}/`}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              padding: '0.75rem 1rem', background: '#fff', border: '1px solid #dde8dd',
              borderRadius: '8px', textDecoration: 'none', color: '#204051',
              fontSize: '0.9rem', fontWeight: 500, transition: 'box-shadow 0.2s',
            }}
          >
            <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{g.icon}</span>
            <span>{g.title}</span>
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem' }}>
        <Link
          href={`/montana-towns/${slug}/`}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
            color: '#3b6978', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none',
          }}
        >
          &larr; Back to {townName} Guide
        </Link>
        <span style={{ color: '#ccc' }}>|</span>
        <Link
          href={`/lodging/${slug === 'anaconda' ? 'anaconda-montana' : slug}/`}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
            color: '#3b6978', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none',
          }}
        >
          Where to Stay in {townName} &rarr;
        </Link>
        <span style={{ color: '#ccc' }}>|</span>
        <Link
          href={guideHref}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
            color: '#3b6978', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none',
          }}
        >
          Moving to {townName} Guide &rarr;
        </Link>
      </div>
    </div>
  );
}
