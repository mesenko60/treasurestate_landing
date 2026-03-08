import React, { useMemo, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { trackHubCityClick } from '../lib/gtag';

const TownMap = dynamic(() => import('./TownMap'), {
  ssr: false,
  loading: () => (
    <div className="town-map-container" style={{ background: '#e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      Loading map...
    </div>
  )
});

type TownEntry = {
  name: string;
  slug: string;
  lat?: number | null;
  lng?: number | null;
  population?: number | null;
  region?: string | null;
  nickname?: string | null;
  isHub?: boolean;
  hubTagline?: string | null;
  hubGuideCount?: number;
};

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function TownDirectory({ towns }: { towns: TownEntry[] }) {
  const directoryRef = useRef<HTMLDivElement>(null);

  const hubCities = useMemo(() =>
    towns
      .filter(t => t.isHub)
      .sort((a, b) => (b.population || 0) - (a.population || 0)),
    [towns]
  );

  const mapTowns = useMemo(() =>
    towns.filter(t => t.lat && t.lng),
    [towns]
  );

  const grouped = useMemo(() => {
    const map: Record<string, TownEntry[]> = {};
    for (const t of towns) {
      const letter = t.name.charAt(0).toUpperCase();
      if (!map[letter]) map[letter] = [];
      map[letter].push(t);
    }
    return map;
  }, [towns]);

  const activeLetters = useMemo(() =>
    new Set(Object.keys(grouped)),
    [grouped]
  );

  function scrollToLetter(letter: string) {
    const el = document.getElementById(`letter-${letter}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  return (
    <div className="town-directory" ref={directoryRef}>

      {/* Featured Hub Cities */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.6rem', color: '#204051', marginBottom: '0.25rem', textAlign: 'center' }}>
          Featured Cities
        </h2>
        <p style={{ textAlign: 'center', color: '#666', fontSize: '0.95rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
          In-depth guides covering cost of living, housing, jobs, schools, hiking, fishing &amp; weekend itineraries
        </p>
        <div className="hub-featured-grid">
          {hubCities.map(city => (
            <Link key={city.slug} href={`/montana-towns/${city.slug}/`} className="hub-featured-card" onClick={() => trackHubCityClick(city.name)}>
              <span className="hub-featured-name">{city.name}</span>
              <span className="hub-featured-tagline">{city.hubTagline || city.nickname}</span>
              {city.population && (
                <span className="hub-featured-pop">Pop. {city.population.toLocaleString()}</span>
              )}
              <span className="hub-featured-badge">
                {city.hubGuideCount || 7} Guides
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Map */}
      <TownMap towns={mapTowns as any} />

      {/* A-Z Directory */}
      <div style={{ marginTop: '1rem' }}>
        <h2 style={{ fontSize: '1.6rem', color: '#204051', marginBottom: '1rem', textAlign: 'center' }}>
          All Towns A{'\u2013'}Z
        </h2>

        {/* Letter bar */}
        <div className="az-bar">
          {LETTERS.map(letter => (
            <button
              key={letter}
              className={`az-letter ${activeLetters.has(letter) ? 'az-letter--active' : ''}`}
              disabled={!activeLetters.has(letter)}
              onClick={() => scrollToLetter(letter)}
              aria-label={`Jump to ${letter}`}
            >
              {letter}
            </button>
          ))}
        </div>

        {/* Grouped town list */}
        {LETTERS.filter(l => grouped[l]).map(letter => (
          <div key={letter} id={`letter-${letter}`} className="az-group">
            <h3 className="az-group-heading">{letter}</h3>
            <div className="towns-grid">
              {grouped[letter].map(t => (
                <Link key={t.slug} href={`/montana-towns/${t.slug}/`} className={t.isHub ? 'town-link--hub' : ''}>
                  <span>{t.name}</span>
                  {t.isHub && <span className="town-hub-dot" title="In-depth guides available" />}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
