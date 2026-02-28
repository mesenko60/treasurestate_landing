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
  'National Forest': '🌲',
  'Wilderness': '🏕️',
  'State Park': '🌳',
  'Lake': '🏞️',
  'River': '🎣',
  'Hot Spring': '♨️',
  'Ski Area': '⛷️',
  'Scenic Drive': '🛣️',
  'Wildlife Refuge': '🦅',
  'Historic Site': '🏛️',
  'National Rec Area': '🏞️',
  'Golf': '⛳',
  'Museum': '🏛️',
};

const TYPE_COLORS: Record<string, string> = {
  'National Park': '#2d7d46',
  'National Forest': '#3a7d44',
  'Wilderness': '#4a7c59',
  'State Park': '#5a8f3c',
  'Lake': '#3b6978',
  'River': '#2980b9',
  'Hot Spring': '#c0392b',
  'Ski Area': '#5b6abf',
  'Scenic Drive': '#d68910',
  'Wildlife Refuge': '#7d6608',
  'Historic Site': '#8b4513',
  'National Rec Area': '#2e86ab',
  'Golf': '#27ae60',
  'Museum': '#6c3483',
};

export default function NearbyRecreation({ townName, places }: NearbyRecreationProps) {
  if (!places || places.length === 0) return null;

  return (
    <section style={{ marginBottom: '2rem' }}>
      <h3 style={{ fontSize: '1.2rem', color: '#204051', marginBottom: '0.75rem' }}>
        Outdoor Recreation &amp; Attractions Near {townName}
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '0.5rem',
      }}>
        {places.map((place, i) => {
          const color = TYPE_COLORS[place.type] || '#3b6978';
          return (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.65rem 0.8rem',
              background: '#f8f9fa',
              borderRadius: '6px',
              border: '1px solid #eee',
              borderLeft: `3px solid ${color}`,
            }}>
              <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>
                {TYPE_ICONS[place.type] || '📍'}
              </span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{
                  fontWeight: 500, fontSize: '0.88rem', color: '#204051',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {place.name}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.72rem', color, fontWeight: 500,
                    textTransform: 'uppercase', letterSpacing: '0.3px',
                  }}>
                    {place.type}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#888' }}>
                    {place.distMiles} mi
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
