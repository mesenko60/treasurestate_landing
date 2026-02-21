import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import the map to avoid SSR issues with Leaflet using window
const TownMap = dynamic(() => import('./TownMap'), { 
  ssr: false, 
  loading: () => (
    <div style={{ height: '400px', background: '#e8e8e8', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
      Loading map...
    </div>
  ) 
});

type TownCoordinate = {
  name: string;
  slug: string;
  lat?: number | null;
  lng?: number | null;
};

export default function TownDirectory({ towns }: { towns: TownCoordinate[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTowns = useMemo(() => {
    if (!searchTerm.trim()) return towns;
    const lowerTerm = searchTerm.toLowerCase();
    return towns.filter(t => t.name.toLowerCase().includes(lowerTerm));
  }, [towns, searchTerm]);

  const mapTowns = useMemo(() => {
    return filteredTowns.filter(t => t.lat && t.lng);
  }, [filteredTowns]);

  return (
    <div className="town-directory">
      <div className="search-container" style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Search for a town in Montana..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            fontSize: '1.2rem',
            borderRadius: '8px',
            border: '2px solid #e0e0e0',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            outline: 'none',
            fontFamily: 'inherit',
            transition: 'border-color 0.3s ease'
          }}
          onFocus={(e) => e.target.style.borderColor = '#3b6978'}
          onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
        />
      </div>

      <TownMap towns={mapTowns as any} />

      <div className="towns-grid">
        {filteredTowns.length > 0 ? (
          filteredTowns.map((t) => (
            <Link key={t.slug} href={`/montana-towns/${t.slug}/`}>
              {t.name}
            </Link>
          ))
        ) : (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', fontSize: '1.1rem', color: '#666' }}>
            No towns found matching "{searchTerm}".
          </p>
        )}
      </div>
    </div>
  );
}
