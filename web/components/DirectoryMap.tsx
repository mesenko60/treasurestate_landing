import React, { useState, useCallback, useRef, useMemo } from 'react';
import Map, { Marker, Popup, NavigationControl, type MapRef } from 'react-map-gl/mapbox';
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
  const mapRef = useRef<MapRef>(null);

  const onMarkerClick = useCallback((item: DirectoryItem) => {
    trackMapInteraction(`directory_click:${item.name}`);
    setSelected(item);
  }, []);

  const selectFromPeerList = useCallback((item: DirectoryItem) => {
    trackMapInteraction(`directory_peer:${item.name}`);
    setSelected(item);
    const ref = mapRef.current;
    if (ref) {
      const z = ref.getZoom?.() ?? 6;
      ref.flyTo({
        center: [item.lng, item.lat],
        zoom: Math.max(z, 8),
        duration: 550,
      });
    }
  }, []);

  const sameCategoryItems = useMemo(() => {
    if (!selected) return [];
    return items
      .filter((i) => i.category === selected.category)
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [items, selected]);

  if (items.length === 0) return null;

  const peerLabel = selected
    ? categoryLabels[selected.category] || selected.category
    : '';

  return (
    <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', marginBottom: '2rem' }}>
      <Map
        ref={mapRef}
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

      {selected && sameCategoryItems.length > 0 && (
        <nav
          aria-label={`More ${peerLabel} locations on this map`}
          style={{
            padding: '0.85rem 1rem 1rem',
            background: '#f8faf9',
            borderTop: '1px solid #e4ebe6',
          }}
        >
          <div
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#204051',
              marginBottom: '0.55rem',
              letterSpacing: '0.02em',
            }}
          >
            {peerLabel} on this map ({sameCategoryItems.length})
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.4rem',
            }}
          >
            {sameCategoryItems.map((item) => {
              const isCurrent = item.slug === selected.slug;
              const dot = categoryColors[item.category] || '#3b6978';
              return (
                <a
                  key={item.slug}
                  href={`#${item.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    selectFromPeerList(item);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.8rem',
                    lineHeight: 1.3,
                    padding: '0.35rem 0.65rem',
                    borderRadius: '999px',
                    textDecoration: 'none',
                    fontWeight: isCurrent ? 700 : 500,
                    color: isCurrent ? '#fff' : '#204051',
                    background: isCurrent ? dot : '#fff',
                    border: isCurrent ? `1px solid ${dot}` : '1px solid #dde5e0',
                    boxShadow: isCurrent ? 'none' : '0 1px 2px rgba(0,0,0,0.04)',
                  }}
                >
                  {!isCurrent && (
                    <span
                      aria-hidden
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: dot,
                        flexShrink: 0,
                      }}
                    />
                  )}
                  {item.name}
                </a>
              );
            })}
          </div>
          <p style={{ fontSize: '0.68rem', color: '#7a8a82', margin: '0.65rem 0 0', lineHeight: 1.45 }}>
            {`Tap another name to move the map and open its pin. Use "View details ↓" in the popup to jump to the full listing.`}
          </p>
        </nav>
      )}
    </div>
  );
}
