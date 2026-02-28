import React from 'react';

type AirportDistance = {
  distanceMiles: number;
  durationSeconds: number;
  airportName?: string; // fallback if needed
};

type TownDistancesProps = {
  distances: Record<string, AirportDistance>;
};

const AIRPORTS: Record<string, { name: string; icon: string }> = {
  BZN: { name: 'Bozeman (BZN)', icon: '✈️' },
  BIL: { name: 'Billings (BIL)', icon: '✈️' },
  MSO: { name: 'Missoula (MSO)', icon: '✈️' },
  FCA: { name: 'Kalispell (FCA)', icon: '✈️' },
  GTF: { name: 'Great Falls (GTF)', icon: '✈️' },
  HLN: { name: 'Helena (HLN)', icon: '✈️' },
  BTM: { name: 'Butte (BTM)', icon: '✈️' },
  WYS: { name: 'West Yellowstone (WYS)', icon: '✈️' },
  SDY: { name: 'Sidney (SDY)', icon: '🛩️' },
  GGW: { name: 'Glasgow (GGW)', icon: '🛩️' },
  OLF: { name: 'Wolf Point (OLF)', icon: '🛩️' },
  GDV: { name: 'Glendive (GDV)', icon: '🛩️' },
  HVR: { name: 'Havre (HVR)', icon: '🛩️' },
};

export default function TownDistances({ distances }: TownDistancesProps) {
  if (!distances || Object.keys(distances).length === 0) return null;

  // Convert seconds to readable "Xh Ym"
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  // Sort by closest distance
  const sortedAirports = Object.entries(distances)
    .sort((a, b) => a[1].distanceMiles - b[1].distanceMiles)
    .slice(0, 3); // Only show top 3 closest

  return (
    <div style={{ 
      background: '#f9f9f9', 
      border: '1px solid #e0e0e0',
      borderRadius: '8px', 
      padding: '1.5rem',
      marginBottom: '2rem'
    }}>
      <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', color: '#204051' }}>Nearest Major Airports</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {sortedAirports.map(([code, data]) => (
          <div key={code} style={{ background: 'white', padding: '1rem', borderRadius: '6px', border: '1px solid #eee' }}>
            <div style={{ fontWeight: 'bold', color: '#3b6978', marginBottom: '0.5rem' }}>
              {AIRPORTS[code]?.icon || '✈️'} {AIRPORTS[code]?.name || data.airportName || code}
            </div>
            <div style={{ color: '#555', fontSize: '0.95rem' }}>
              {data.distanceMiles} miles
              <br/>
              <span style={{ color: '#888', fontSize: '0.85rem' }}>~{formatDuration(data.durationSeconds)} drive</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
