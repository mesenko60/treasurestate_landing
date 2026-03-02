import Link from 'next/link';
import { clusterConfigs } from './cluster-data';

const CITY_NAMES: Record<string, string> = {
  missoula: 'Missoula',
  bozeman: 'Bozeman',
  kalispell: 'Kalispell',
  whitefish: 'Whitefish',
  helena: 'Helena',
  billings: 'Billings',
  'great-falls': 'Great Falls',
  butte: 'Butte',
  livingston: 'Livingston',
  'red-lodge': 'Red Lodge',
  hamilton: 'Hamilton',
  'west-yellowstone': 'West Yellowstone',
  'big-sky': 'Big Sky',
  'miles-city': 'Miles City',
  polson: 'Polson',
  dillon: 'Dillon',
  'columbia-falls': 'Columbia Falls',
  anaconda: 'Anaconda',
  bigfork: 'Bigfork',
  'deer-lodge': 'Deer Lodge',
  'three-forks': 'Three Forks',
  'choteau': 'Choteau',
  'libby': 'Libby',
  'lewistown': 'Lewistown',
  'glendive': 'Glendive',
};

type Props = {
  slug: string;
  topic: string;
  townName: string;
};

export default function CrossHubLinks({ slug, topic, townName }: Props) {
  const otherCities = Object.keys(clusterConfigs)
    .filter(s => s !== slug)
    .map(s => {
      const guide = clusterConfigs[s].guides.find(g => g.topic === topic);
      if (!guide) return null;
      return { slug: s, name: CITY_NAMES[s] || s, icon: guide.icon, title: guide.title };
    })
    .filter(Boolean) as { slug: string; name: string; icon: string; title: string }[];

  if (otherCities.length === 0) return null;

  const topicLabel = otherCities[0]?.title || topic;

  return (
    <div style={{ margin: '2rem 0', padding: '1.5rem', background: '#f0f4f8', borderRadius: '12px', border: '1px solid #d4dde8' }}>
      <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.1rem', color: '#204051', fontFamily: 'var(--font-primary)' }}>
        {topicLabel} in Other Montana Cities
      </h2>
      <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: '#666', lineHeight: 1.5 }}>
        See how {townName} compares to other Montana cities.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.6rem' }}>
        {otherCities.map(c => (
          <Link
            key={c.slug}
            href={`/montana-towns/${c.slug}/${topic}/`}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.65rem 0.85rem', background: '#fff', border: '1px solid #d4dde8',
              borderRadius: '8px', textDecoration: 'none', color: '#204051',
              fontSize: '0.88rem', fontWeight: 500, transition: 'box-shadow 0.2s, transform 0.2s',
            }}
          >
            <span style={{ fontSize: '1.15rem', flexShrink: 0 }}>{c.icon}</span>
            <span>{c.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
