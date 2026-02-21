import React from 'react';
import Link from 'next/link';

interface Town {
  name: string;
  slug: string;
}

interface NearbyTownsProps {
  towns: Town[];
}

export default function NearbyTowns({ towns }: NearbyTownsProps) {
  if (!towns || towns.length === 0) return null;

  return (
    <section className="nearby-towns-section" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', borderTop: '1px solid #eee' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '1.8rem', color: '#333' }}>Explore Nearby Destinations</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        {towns.map((town) => (
          <Link 
            key={town.slug} 
            href={`/montana-towns/${town.slug}/`}
            style={{
              display: 'block',
              padding: '15px 30px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#333',
              fontWeight: '500',
              border: '1px solid #ddd',
              transition: 'all 0.2s ease',
              minWidth: '200px',
              textAlign: 'center'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#0a5cff';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.borderColor = '#0a5cff';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#f8f9fa';
              e.currentTarget.style.color = '#333';
              e.currentTarget.style.borderColor = '#ddd';
            }}
          >
            {town.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
