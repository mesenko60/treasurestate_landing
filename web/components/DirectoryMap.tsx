import React, { useState, useCallback } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { trackMapInteraction } from '../lib/gtag';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

type DirectoryItem = {
  name: string;
  slug: string;
  lat: number;
  lng: number;
  category: string;
  rating?: number | null;
  reviews?: number | null;
  address?: string | null;
};

export default function DirectoryMap({
  items,
  categoryColors,
  categoryLabels,
  height = '450px',
}: {
  items: DirectoryItem[];
  categoryColors: Record<string, string>;
  categoryLabels: Record<string, string>;
  height?: string;
}) {
  const [selected, setSelected] = useState<DirectoryItem | null>(null);

  const onMarkerClick = useCallback((item: DirectoryItem) => {
    trackMapInteraction(`directory_click:${item.name}`);
    setSelected(item);
  }, []);

  if (items.length === 0) return null;

  return (
    <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', marginBottom: '2rem' }}>
      <Map
        initialViewState={{ longitude: -109.5, latitude: 46.8, zoom: 5.3 }}
        style={{ width: '100%', height }}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        cooperativeGestures={true}
        onClick={() => setSelected(null)}
      >
        <NavigationControl position="top-right" />

        {items.map((item) => (
          <Marker
            key={item.slug}
            longitude={item.lng}
            latitude={item.lat}
            anchor="center"
            onClick={(e) => { e.originalEvent.stopPropagation(); onMarkerClick(item); }}
          >
            <div style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: categoryColors[item.category] || '#3b6978',
              border: '2px solid rgba(255,255,255,0.9)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
              cursor: 'pointer',
            }} />
          </Marker>
        ))}

        {selected && (
          <Popup
            longitude={selected.lng}
            latitude={selected.lat}
            anchor="bottom"
            offset={12}
            onClose={() => setSelected(null)}
            closeButton={true}
            closeOnClick={false}
            maxWidth="240px"
          >
            <div style={{ padding: '4px 2px' }}>
              <strong style={{ fontSize: '0.9rem', color: '#204051' }}>{selected.name}</strong>
              <div style={{ fontSize: '0.75rem', color: categoryColors[selected.category] || '#888', fontWeight: 600, marginTop: '2px' }}>
                {categoryLabels[selected.category] || selected.category}
              </div>
              {selected.rating != null && (
                <div style={{ fontSize: '0.78rem', color: '#d8973c', marginTop: '2px' }}>
                  {'★'.repeat(Math.round(selected.rating))} {selected.rating.toFixed(1)}
                  {selected.reviews ? ` (${selected.reviews.toLocaleString()})` : ''}
                </div>
              )}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '6px', flexWrap: 'wrap' }}>
                <a
                  href={`#${selected.slug}`}
                  onClick={() => setSelected(null)}
                  style={{ fontSize: '0.78rem', color: '#3b6978', textDecoration: 'none', fontWeight: 600 }}
                >
                  View Details ↓
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.78rem', color: '#3b6978', textDecoration: 'none', fontWeight: 600 }}
                >
                  Directions →
                </a>
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', padding: '0.6rem 1rem', background: '#fff', borderTop: '1px solid #eee', fontSize: '0.78rem', color: '#666' }}>
        {Object.entries(categoryLabels).map(([cat, label]) => {
          const count = items.filter(i => i.category === cat).length;
          if (count === 0) return null;
          return (
            <span key={cat} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: categoryColors[cat], display: 'inline-block' }} />
              {label} ({count})
            </span>
          );
        })}
      </div>
    </div>
  );
}
