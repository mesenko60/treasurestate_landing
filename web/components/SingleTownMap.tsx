import React from 'react';
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
  lat: number;
  lng: number;
};

export default function SingleTownMap({ 
  currentTown, 
  relatedTowns 
}: { 
  currentTown?: TownCoordinate | null,
  relatedTowns: TownCoordinate[] 
}) {
  const towns = [...(currentTown ? [currentTown] : []), ...relatedTowns];
  
  if (towns.length === 0) return null;

  // Center on the current town if available, otherwise default to Montana center
  const center: [number, number] = currentTown 
    ? [currentTown.lat, currentTown.lng]
    : [46.9653, -109.5337];

  return (
    <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <h3 style={{ fontSize: '1.6rem', color: '#204051', marginBottom: '1rem', borderBottom: '1px solid #e0e0e0', paddingBottom: '0.5rem' }}>Map & Nearby</h3>
      <TownMap towns={towns} center={center} zoom={currentTown ? 8 : 6} />
    </div>
  );
}
