import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import type { HuntingMarker } from '../components/MontanaMapApp';

const MontanaMapApp = dynamic(() => import('../components/MontanaMapApp'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0f6f9',
        color: '#5a7582',
        fontSize: '0.95rem',
      }}
    >
      Loading Montana map…
    </div>
  ),
});

type Props = { huntingMarkers: HuntingMarker[] };

const url = 'https://treasurestate.com/map/';
const title = 'Montana Land Map — Full Viewport GIS';
const desc =
  'Full-screen Montana map: Topo, satellite, Hybrid (satellite plus shaded relief), optional 3D terrain, Montana State Library parcel and public-land overlays, PLSS grid, hunting pins. Informational only — see the land ownership guide for MSL disclaimers.';

export default function MontanaMapPage({ huntingMarkers }: Props) {
  return (
    <>
      <Head>
        <link rel="canonical" href={url} />
        <title>{`${title} | Treasure State`}</title>
        <meta name="description" content={desc} />
        <meta
          name="keywords"
          content="Montana map, Montana GIS, land ownership map, public lands Montana, MSDI parcels, 3D terrain map, Montana satellite map"
        />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content="https://treasurestate.com/images/hero-image.jpg" />
      </Head>

      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#fff' }}>
        <header
          style={{
            flexShrink: 0,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '0.65rem 1.25rem',
            padding: '0.55rem 1rem',
            borderBottom: '1px solid #e8eef0',
            background: '#fbfdfe',
            fontFamily: 'var(--font-primary, system-ui, sans-serif)',
          }}
        >
          <Link href="/" style={{ fontWeight: 800, color: '#204051', textDecoration: 'none', fontSize: '0.95rem' }}>
            Treasure State
          </Link>
          <span style={{ color: '#5a7582', fontSize: '0.85rem' }}>Montana land map</span>
          <Link href="/guides/land-ownership/" style={{ marginLeft: 'auto', fontWeight: 600, color: '#3b6978', fontSize: '0.82rem' }}>
            MSL disclaimers &amp; sources →
          </Link>
          <Link href="/guides/" style={{ fontWeight: 600, color: '#3b6978', fontSize: '0.82rem' }}>
            All guides
          </Link>
        </header>

        <div
          role="note"
          style={{
            flexShrink: 0,
            padding: '0.45rem 1rem',
            borderBottom: '1px solid #eee6d6',
            background: '#fffbf3',
            fontFamily: 'var(--font-primary, system-ui, sans-serif)',
            fontSize: '0.78rem',
            lineHeight: 1.55,
            color: '#4d483f',
          }}
        >
          <strong style={{ color: '#71582e' }}>Informational only.</strong> MSDI parcel and public-lands GIS from the Montana State Library is not for legal, surveying, or engineering use—boundaries can lag deeds and closures.
          {' '}
          <Link href="/guides/land-ownership/" style={{ fontWeight: 700, color: '#3b6978', whiteSpace: 'nowrap' }}>
            Full disclaimers &amp; sources
          </Link>
        </div>

        <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
          <MontanaMapApp huntingMarkers={huntingMarkers} />
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const dataDir = path.join(process.cwd(), 'data');
  const areasRaw = JSON.parse(fs.readFileSync(path.join(dataDir, 'hunting-areas.json'), 'utf8')) as {
    name: string;
    slug: string;
    lat: number;
    lng: number;
    category: string;
  }[];

  const huntingMarkers: HuntingMarker[] = areasRaw.map((a) => ({
    name: a.name,
    slug: a.slug,
    lat: a.lat,
    lng: a.lng,
    category: a.category,
  }));

  return { props: { huntingMarkers } };
};
