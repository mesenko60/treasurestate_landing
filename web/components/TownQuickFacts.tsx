import React from 'react';

type TownDataProps = {
  elevation: number | null;
  county: string | null;
  region: string | null;
  zipCode?: string | null;
  areaCode?: string | null;
  timeZone?: string | null;
  population?: number | null;
};

export default function TownQuickFacts({ elevation, county, region, zipCode, areaCode, timeZone, population }: TownDataProps) {
  const facts = [
    population && { label: 'Population', value: population.toLocaleString() },
    county && { label: 'County', value: county },
    region && { label: 'Region', value: `${region} Montana` },
    elevation && { label: 'Elevation', value: `${elevation.toLocaleString()} ft` },
    zipCode && { label: 'Zip Code', value: zipCode },
    areaCode && { label: 'Area Code', value: areaCode },
    timeZone && { label: 'Time Zone', value: timeZone },
  ].filter(Boolean) as { label: string; value: string }[];

  if (facts.length === 0) return null;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: '0.75rem',
      marginBottom: '2rem'
    }}>
      {facts.map(fact => (
        <div key={fact.label} style={{
          background: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '1rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#888', marginBottom: '0.25rem' }}>
            {fact.label}
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#204051' }}>
            {fact.value}
          </div>
        </div>
      ))}
    </div>
  );
}
