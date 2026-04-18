import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import dynamic from 'next/dynamic';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import Footer from '../../components/Footer';
import Breadcrumbs from '../../components/Breadcrumbs';

const MapboxMap = dynamic(() => import('react-map-gl/mapbox').then((mod) => mod.default), { ssr: false });
const Marker = dynamic(() => import('react-map-gl/mapbox').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-map-gl/mapbox').then((mod) => mod.Popup), { ssr: false });
const NavigationControl = dynamic(
  () => import('react-map-gl/mapbox').then((mod) => mod.NavigationControl),
  { ssr: false },
);

type Detail = {
  slug: string;
  name: string;
  countyLabel: string;
  region: string;
  status: string;
  nearestLivingTownSlug: string | null;
  gnisId: number | null;
  matchedGnisName: string | null;
  featureType: string | null;
  lat: number | null;
  lng: number | null;
  hasMarkerSlug: boolean;
  matchNote: string | null;
};

type Cemetery = { name: string; miles: number; lat: number; lng: number; gnisId: number };

type TownDataEntry = { name?: string };

type Props = {
  town: Detail;
  bodyHtml: string;
  cemeteries: Cemetery[];
  nearestTownName: string | null;
  nearestTownLat: number | null;
  nearestTownLng: number | null;
};

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

const STATUS_LABEL: Record<string, string> = {
  preserved: 'Preserved / interpretive site',
  ruins: 'Ruins / remnants',
  partial: 'Partial — small population may remain',
  vanished: 'Mostly vanished',
  manual: 'Approximate map point',
};

type HeroMapProps = {
  lat: number;
  lng: number;
  name: string;
  slug: string;
  nearestTownName: string | null;
  nearestTownSlug: string | null;
  nearestLat: number | null;
  nearestLng: number | null;
  zoom: number;
};

function DetailHeroMap({
  lat,
  lng,
  name,
  nearestTownName,
  nearestTownSlug,
  nearestLat,
  nearestLng,
  zoom,
}: HeroMapProps) {
  type PopupKind = 'ghost' | 'near';
  const [popup, setPopup] = React.useState<PopupKind | null>(null);

  // Center on the midpoint when we have a nearest town, otherwise on the ghost town itself.
  const centerLat = nearestLat != null && nearestLng != null ? (lat + nearestLat) / 2 : lat;
  const centerLng = nearestLat != null && nearestLng != null ? (lng + nearestLng) / 2 : lng;

  return (
    <div className="gt-hero-map">
      <MapboxMap
        initialViewState={{ latitude: centerLat, longitude: centerLng, zoom }}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="top-right" showCompass={false} />

        <Marker
          latitude={lat}
          longitude={lng}
          anchor="center"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setPopup((p) => (p === 'ghost' ? null : 'ghost'));
          }}
        >
          <div className="gt-pin" title={name} />
        </Marker>

        {popup === 'ghost' && (
          <Popup
            latitude={lat}
            longitude={lng}
            anchor="top"
            onClose={() => setPopup(null)}
            closeOnClick={false}
            closeButton={true}
            offset={14}
          >
            <strong>{name}</strong>
            <div style={{ fontSize: '0.8rem', color: '#555' }}>Ghost town</div>
          </Popup>
        )}

        {nearestLat != null && nearestLng != null && nearestTownName && (
          <>
            <Marker
              latitude={nearestLat}
              longitude={nearestLng}
              anchor="center"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setPopup((p) => (p === 'near' ? null : 'near'));
              }}
            >
              <div className="gt-pin-near" title={nearestTownName} />
            </Marker>

            {popup === 'near' && (
              <Popup
                latitude={nearestLat}
                longitude={nearestLng}
                anchor="top"
                onClose={() => setPopup(null)}
                closeOnClick={false}
                closeButton={true}
                offset={12}
              >
                <strong>{nearestTownName}</strong>
                <div style={{ fontSize: '0.8rem', color: '#555' }}>Nearest active town</div>
                {nearestTownSlug && (
                  <div style={{ marginTop: '0.35rem' }}>
                    <Link href={`/montana-towns/${nearestTownSlug}/`} style={{ color: '#3b6978' }}>
                      Visit guide →
                    </Link>
                  </div>
                )}
              </Popup>
            )}
          </>
        )}
      </MapboxMap>
    </div>
  );
}

/** Pick a Mapbox zoom that comfortably shows both points; falls back to ~10 if no nearest town. */
function fitZoom(townLat: number, townLng: number, nearLat: number | null, nearLng: number | null): number {
  if (nearLat == null || nearLng == null) return 10;
  const dLat = Math.abs(townLat - nearLat);
  const dLng = Math.abs(townLng - nearLng);
  const span = Math.max(dLat, dLng * Math.cos((townLat * Math.PI) / 180));
  if (span <= 0) return 11;
  if (span < 0.05) return 11;
  if (span < 0.12) return 10;
  if (span < 0.25) return 9.5;
  if (span < 0.5) return 9;
  if (span < 1) return 8.5;
  if (span < 2) return 8;
  return 7.5;
}

export default function GhostTownPage({
  town,
  bodyHtml,
  cemeteries,
  nearestTownName,
  nearestTownLat,
  nearestTownLng,
}: Props) {
  const url = `https://treasurestate.com/ghost-towns/${town.slug}/`;
  const plainDesc = bodyHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 158);
  const desc = plainDesc ? `${plainDesc}…` : `${town.name} — Montana ghost town in ${town.countyLabel}.`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: town.name,
    description: desc,
    url,
    ...(town.lat != null && town.lng != null
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: town.lat,
            longitude: town.lng,
          },
        }
      : {}),
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Montana',
      addressCountry: 'US',
    },
  };

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Ghost Towns', url: '/ghost-towns/' },
    { name: town.name, url },
  ];

  return (
    <>
      <Head>
        <title>{`${town.name} — Montana Ghost Town | Treasure State`}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={`${town.name} — Montana Ghost Town`} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta name="twitter:card" content="summary" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <link href="https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css" rel="stylesheet" />
      </Head>
      <Header />
      <Hero
        title={town.name}
        subtitle={`${town.countyLabel} · ${STATUS_LABEL[town.status] || town.status}`}
        image="/images/hero-image.jpg"
        alt={town.name}
        small
      />
      <Breadcrumbs items={breadcrumbs} />

      <style dangerouslySetInnerHTML={{ __html: `
        .gt-detail { max-width: 960px; margin: 0 auto; padding: 1.25rem 1rem 3rem; }
        .gt-detail-grid { display: grid; grid-template-columns: 1fr 300px; gap: 2rem; margin-top: 1.5rem; }
        @media (max-width: 860px) { .gt-detail-grid { grid-template-columns: 1fr; } }
        .gt-sidebar { font-size: 0.9rem; color: #444; }
        .gt-sidebar h2 { font-size: 1rem; color: #204051; margin: 0 0 0.5rem; }
        .gt-hero-map { height: 380px; border-radius: 12px; overflow: hidden; border: 1px solid #e0e0e0; margin: 0 auto; max-width: 960px; }
        @media (max-width: 600px) { .gt-hero-map { height: 280px; } }
        .gt-pin { width: 18px; height: 18px; background: #c9a227; border: 2px solid #fff; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3); cursor: pointer; }
        .gt-pin-near { width: 14px; height: 14px; background: #3b6978; border: 2px solid #fff; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3); cursor: pointer; }
        .gt-cem { margin-top: 1.25rem; }
        .gt-cem ul { margin: 0.35rem 0 0 1rem; padding: 0; font-size: 0.85rem; color: #555; }
        .compare-intro-prose.gt-prose { text-align: left; }
        .compare-intro-prose.gt-prose h2 { text-align: left; }
      `}} />

      <main className="gt-detail">
        {town.lat != null && town.lng != null && MAPBOX_TOKEN && (
          <DetailHeroMap
            lat={town.lat}
            lng={town.lng}
            name={town.name}
            slug={town.slug}
            nearestTownName={nearestTownName}
            nearestTownSlug={town.nearestLivingTownSlug}
            nearestLat={nearestTownLat}
            nearestLng={nearestTownLng}
            zoom={fitZoom(town.lat, town.lng, nearestTownLat, nearestTownLng)}
          />
        )}

        <div className="gt-detail-grid">
          <article
            className="compare-intro-prose gt-prose"
            style={{ marginBottom: '2rem' }}
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />

          <aside className="gt-sidebar">
            {town.nearestLivingTownSlug && nearestTownName && (
              <p>
                <strong>Nearest town guide:</strong>{' '}
                <Link href={`/montana-towns/${town.nearestLivingTownSlug}/`}>{nearestTownName}</Link>
              </p>
            )}

            {town.hasMarkerSlug && (
              <p>
                <strong>Historic marker:</strong>{' '}
                <Link href={`/historic-markers/${town.slug}/`}>Read the roadside marker page</Link>
              </p>
            )}

            {cemeteries.length > 0 && (
              <div className="gt-cem">
                <h2>Pioneer cemeteries (within 10 mi)</h2>
                <p style={{ fontSize: '0.82rem', color: '#666', margin: '0.25rem 0 0.5rem' }}>
                  From GNIS cemetery features — verify on the ground before visiting.
                </p>
                <ul>
                  {cemeteries.map((c) => (
                    <li key={`${c.gnisId}-${c.name}`}>
                      {c.name.replace(/\s*\(historical\)\s*$/i, '')} — {c.miles} mi
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p style={{ marginTop: '1.25rem' }}>
              <Link href="/ghost-towns/">← All Montana ghost towns</Link>
            </p>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const detailPath = path.join(process.cwd(), 'data', 'ghost-towns-detail.json');
  if (!fs.existsSync(detailPath)) {
    return { paths: [], fallback: false };
  }
  const detail: Detail[] = JSON.parse(fs.readFileSync(detailPath, 'utf8'));
  return {
    paths: detail.map((d) => ({ params: { slug: d.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string;
  const detailPath = path.join(process.cwd(), 'data', 'ghost-towns-detail.json');
  const cemPath = path.join(process.cwd(), 'data', 'cemeteries-near-ghost-towns.json');
  const townDataPath = path.join(process.cwd(), 'data', 'town-data.json');
  const mdPath = path.join(process.cwd(), 'content', 'ghost-towns', `${slug}.md`);

  const detail: Detail[] = JSON.parse(fs.readFileSync(detailPath, 'utf8'));
  const town = detail.find((d) => d.slug === slug);
  if (!town) return { notFound: true };

  const cemMap: Record<string, Cemetery[]> = fs.existsSync(cemPath)
    ? JSON.parse(fs.readFileSync(cemPath, 'utf8'))
    : {};
  const cemeteries = cemMap[slug] || [];

  const townData: Record<string, TownDataEntry> = fs.existsSync(townDataPath)
    ? JSON.parse(fs.readFileSync(townDataPath, 'utf8'))
    : {};
  const nearestSlug = town.nearestLivingTownSlug;
  const nearestTownName =
    nearestSlug && townData[nearestSlug]?.name ? (townData[nearestSlug].name as string) : null;

  const coordsPath = path.join(process.cwd(), 'data', 'town-coordinates.json');
  type TownCoord = { name?: string; lat?: number; lng?: number };
  const townCoords: Record<string, TownCoord> = fs.existsSync(coordsPath)
    ? JSON.parse(fs.readFileSync(coordsPath, 'utf8'))
    : {};
  const nearestCoord = nearestSlug ? townCoords[nearestSlug] : undefined;
  const nearestTownLat =
    nearestCoord && typeof nearestCoord.lat === 'number' ? nearestCoord.lat : null;
  const nearestTownLng =
    nearestCoord && typeof nearestCoord.lng === 'number' ? nearestCoord.lng : null;

  let bodyHtml = '';
  if (fs.existsSync(mdPath)) {
    const raw = fs.readFileSync(mdPath, 'utf8');
    const { markdownToHtml, stripLeadingMarkdownH1 } = await import('../../lib/markdown');
    bodyHtml = await markdownToHtml(stripLeadingMarkdownH1(raw));
  }

  return {
    props: {
      town,
      bodyHtml,
      cemeteries,
      nearestTownName,
      nearestTownLat,
      nearestTownLng,
    },
  };
};
