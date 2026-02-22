import React from 'react';

type RecreationPlace = {
  name: string;
  type: string;
  distMiles: number;
};

type NearbyRecreationProps = {
  townName: string;
  places: RecreationPlace[];
};

const TYPE_ICONS: Record<string, string> = {
  'National Park': '🏔️',
  'Nature Reserve': '🌲',
  'Park': '🌳',
  'Fishing': '🎣',
  'Campground': '⛺',
  'Trailhead': '🥾',
  'Recreation': '🏞️',
};

export default function NearbyRecreation({ townName, places }: NearbyRecreationProps) {
  if (!places || places.length === 0) return null;

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3 style={{ fontSize: '1.2rem', color: '#204051', marginBottom: '0.75rem' }}>
        Outdoor Recreation Near {townName}
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '0.6rem',
      }}>
        {places.map((place, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.6rem 0.8rem',
            background: '#f8f9fa',
            borderRadius: '6px',
            border: '1px solid #eee',
          }}>
            <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{TYPE_ICONS[place.type] || '🏞️'}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 500, fontSize: '0.9rem', color: '#204051', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {place.name}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#888' }}>
                {place.type} · {place.distMiles} mi
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
