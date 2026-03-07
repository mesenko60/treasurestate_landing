import React from 'react';
import dynamic from 'next/dynamic';

const TownMap = dynamic(() => import('./TownMap'), { 
  ssr: false, 
  loading: () => (
    <div className="town-map-container" style={{ background: '#e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      Loading map...
    </div>
  ) 
});

type TownCoordinate = {
  name: string;
  slug: string;
  lat: number;
  lng: number;
};

type RecMarker = {
  name: string;
  type: string;
  lat: number;
  lng: number;
  distMiles?: number;
};

export default function SingleTownMap({ 
  currentTown, 
  relatedTowns,
  recreation,
  focusedRec,
}: { 
  currentTown?: TownCoordinate | null;
  relatedTowns: TownCoordinate[];
  recreation?: RecMarker[];
  focusedRec?: RecMarker | null;
}) {
  const towns = [...(currentTown ? [currentTown] : []), ...relatedTowns];
  
  if (towns.length === 0) return null;

  const center: [number, number] = currentTown 
    ? [currentTown.lat, currentTown.lng]
    : [46.9653, -109.5337];

  return (
    <div id="town-map" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <h3 style={{ fontSize: '1.6rem', color: '#204051', marginBottom: '1rem', borderBottom: '1px solid #e0e0e0', paddingBottom: '0.5rem' }}>Map &amp; Nearby</h3>
      <TownMap
        towns={towns}
        center={center}
        zoom={currentTown ? 8 : 6}
        recreation={recreation}
        highlightTown={currentTown?.slug}
        focusedRec={focusedRec}
      />
    </div>
  );
}
