import Link from 'next/link';
import { clusterConfigs } from './cluster-data';

const CITY_META: Record<string, { name: string; tagline: string }> = {
  missoula: { name: 'Missoula', tagline: 'The Garden City' },
  bozeman: { name: 'Bozeman', tagline: 'College town & outdoor hub' },
  kalispell: { name: 'Kalispell', tagline: 'Gateway to Glacier' },
  whitefish: { name: 'Whitefish', tagline: 'Mountain resort town' },
  helena: { name: 'Helena', tagline: 'State capital' },
  billings: { name: 'Billings', tagline: "Montana's largest city" },
  'great-falls': { name: 'Great Falls', tagline: 'The Electric City' },
  butte: { name: 'Butte', tagline: 'The Richest Hill on Earth' },
  livingston: { name: 'Livingston', tagline: 'Gateway to Yellowstone' },
  'red-lodge': { name: 'Red Lodge', tagline: 'Beartooth Highway gateway' },
  hamilton: { name: 'Hamilton', tagline: 'Bitterroot Valley' },
  'west-yellowstone': { name: 'West Yellowstone', tagline: 'Yellowstone west entrance' },
  'big-sky': { name: 'Big Sky', tagline: 'Mountain resort destination' },
  'miles-city': { name: 'Miles City', tagline: 'Cow Capital of Montana' },
  polson: { name: 'Polson', tagline: 'Flathead Lake gateway' },
  dillon: { name: 'Dillon', tagline: 'Blue-ribbon fishing & frontier heritage' },
  'columbia-falls': { name: 'Columbia Falls', tagline: 'Gateway to Glacier National Park' },
  anaconda: { name: 'Anaconda', tagline: 'Copper heritage & Pintler wilderness' },
  bigfork: { name: 'Bigfork', tagline: 'Flathead Lake arts village' },
  'deer-lodge': { name: 'Deer Lodge', tagline: 'Frontier ranching heritage & prison history' },
  'three-forks': { name: 'Three Forks', tagline: 'Birthplace of the Missouri River' },
  'choteau': { name: 'Choteau', tagline: 'Rocky Mountain Front & dinosaur country' },
};

type Props = {
  slug: string;
  townName: string;
};

export default function CrossHubCities({ slug, townName }: Props) {
  const otherHubs = Object.keys(clusterConfigs)
    .filter(s => s !== slug)
    .map(s => ({ slug: s, ...(CITY_META[s] || { name: s, tagline: '' }) }));

  if (otherHubs.length === 0) return null;

  return (
    <div className="content-section" style={{ marginTop: '1.5rem' }}>
      <h2 id="explore-other-cities">Explore Other Montana City Guides</h2>
      <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: 1.6, marginBottom: '1rem' }}>
        Compare {townName} with other Montana communities. Each guide includes cost of living, housing, jobs, schools, hiking, fishing, and a weekend itinerary.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
        {otherHubs.map(c => (
          <Link
            key={c.slug}
            href={`/montana-towns/${c.slug}/`}
            style={{
              display: 'block', padding: '1rem',
              background: '#f8faf8', border: '1px solid #e2ebe2', borderRadius: '10px',
              textDecoration: 'none', color: '#204051',
              transition: 'box-shadow 0.2s, transform 0.2s',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: '0.95rem', fontFamily: 'var(--font-primary)', marginBottom: '0.2rem' }}>
              {c.name}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>{c.tagline}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
