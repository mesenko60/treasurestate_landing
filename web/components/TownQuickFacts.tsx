import React from 'react';

type TownDataProps = {
  elevation: number | null;
  county: string | null;
  region: string | null;
  zipCode?: string | null;
  areaCode?: string | null;
  timeZone?: string | null;
  population?: number | null;
  nearestHospital?: string | null;
  nearestHospitalDist?: number | null;
  mainIndustry?: string | null;
  industryVintage?: string | null;
  healthcareVintage?: string | null;
};

export default function TownQuickFacts({ elevation, county, region, zipCode, areaCode, timeZone, population, nearestHospital, nearestHospitalDist, mainIndustry, industryVintage, healthcareVintage }: TownDataProps) {
  const hospitalValue = nearestHospitalDist != null
    ? (nearestHospitalDist <= 5 ? `${nearestHospital} (in town)` : `${nearestHospital} (${nearestHospitalDist} mi)`)
    : null;

  const facts = [
    population && { label: 'Population', value: population.toLocaleString() },
    county && { label: 'County', value: county },
    region && { label: 'Region', value: `${region} Montana` },
    elevation && { label: 'Elevation', value: `${elevation.toLocaleString()} ft` },
    mainIndustry && { label: 'Top Industry', value: mainIndustry },
    hospitalValue && { label: 'Nearest Hospital', value: hospitalValue },
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
      {(mainIndustry || nearestHospital) && (
        <div style={{ gridColumn: '1 / -1', fontSize: '0.68rem', color: '#bbb', textAlign: 'center', fontStyle: 'italic' }}>
          {mainIndustry ? `Industry: Census ${industryVintage || 'ACS 2019–2023'}` : ''}{mainIndustry && nearestHospital ? ' · ' : ''}{nearestHospital ? `Hospital: ${healthcareVintage || 'MT DPHHS 2024'}` : ''}
        </div>
      )}
    </div>
  );
}
