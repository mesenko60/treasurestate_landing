import React, { useState, useCallback, useRef, useEffect } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/mapbox';
import type { MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { trackMapInteraction } from '../lib/gtag';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

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

const REC_ICONS: Record<string, string> = {
  'Hot Spring': '♨️',
  'Campground': '⛺',
  'Trailhead': '🥾',
  'Lake': '🏞️',
  'Fishing Access': '🎣',
  'Ski Area': '⛷️',
  'Golf': '⛳',
  'Disc Golf': '🥏',
  'State Park': '🌲',
  'National Park': '🏔️',
  'National Forest': '🌿',
  'Wilderness': '🏔️',
  'Waterfall': '💧',
  'Museum': '🏛️',
  'Historic Site': '🏚️',
  'Viewpoint': '👁️',
  'Boat Launch': '🚤',
  'River': '🏞️',
  'Nature Reserve': '🦅',
  'Wildlife Refuge': '🦌',
  'Scenic Drive': '🛣️',
};

export default function TownMap({
  towns,
  center = [46.9653, -109.5337],
  zoom = 6,
  recreation,
  highlightTown,
  focusedRec,
  ariaLabel,
  containerStyle,
}: {
  towns: TownCoordinate[];
  center?: [number, number];
  zoom?: number;
  recreation?: RecMarker[];
  highlightTown?: string;
  focusedRec?: RecMarker | null;
  ariaLabel?: string;
  containerStyle?: React.CSSProperties;
}) {
  const mapRef = useRef<MapRef>(null);
  const [selected, setSelected] = useState<(TownCoordinate & { _kind: 'town' }) | (RecMarker & { _kind: 'rec' }) | null>(null);

  useEffect(() => {
    if (focusedRec && mapRef.current) {
      mapRef.current.flyTo({
        center: [focusedRec.lng, focusedRec.lat],
        zoom: 11,
        duration: 1200,
      });
      setSelected({ ...focusedRec, _kind: 'rec', slug: '' } as any);
    }
  }, [focusedRec]);

  const onTownClick = useCallback((town: TownCoordinate) => {
    trackMapInteraction(`marker_click:${town.name}`);
    setSelected({ ...town, _kind: 'town' });
  }, []);

  const onRecClick = useCallback((rec: RecMarker) => {
    trackMapInteraction(`rec_click:${rec.name}`);
    setSelected({ ...rec, _kind: 'rec', slug: '' } as any);
  }, []);

  return (
    <div className="town-map-container" role="region" aria-label={ariaLabel || 'Interactive map'} style={containerStyle}>
      <Map
        ref={mapRef}
        initialViewState={{ longitude: center[1], latitude: center[0], zoom }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        cooperativeGestures={true}
        keyboard={true}
        onClick={() => setSelected(null)}
      >
        <NavigationControl position="top-right" />

        {/* Recreation markers (render first so town markers are on top) */}
        {recreation?.map((rec, i) => (
          <Marker
            key={`rec-${i}-${rec.name}`}
            longitude={rec.lng}
            latitude={rec.lat}
            anchor="center"
            onClick={(e) => { e.originalEvent.stopPropagation(); onRecClick(rec); }}
          >
            <span style={{ fontSize: '16px', cursor: 'pointer', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }} title={rec.name}>
              {REC_ICONS[rec.type] || '📍'}
            </span>
          </Marker>
        ))}

        {/* Town markers */}
        {towns.map((town) => {
          const isHighlighted = highlightTown && town.slug === highlightTown;
          return (
            <Marker
              key={town.slug}
              longitude={town.lng}
              latitude={town.lat}
              anchor="bottom"
              onClick={(e) => { e.originalEvent.stopPropagation(); onTownClick(town); }}
            >
              <div style={{
                width: isHighlighted ? 18 : 12,
                height: isHighlighted ? 18 : 12,
                borderRadius: '50%',
                background: isHighlighted ? '#c0392b' : '#3b6978',
                border: `2px solid ${isHighlighted ? '#fff' : 'rgba(255,255,255,0.8)'}`,
                boxShadow: isHighlighted ? '0 0 8px rgba(192,57,43,0.6)' : '0 1px 4px rgba(0,0,0,0.3)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }} />
            </Marker>
          );
        })}

        {/* Popup */}
        {selected && (
          <Popup
            longitude={selected.lng}
            latitude={selected.lat}
            anchor="bottom"
            offset={selected._kind === 'town' ? 16 : 10}
            onClose={() => setSelected(null)}
            closeButton={true}
            closeOnClick={false}
            maxWidth="220px"
          >
            {selected._kind === 'town' ? (
              <div style={{ textAlign: 'center', padding: '4px 2px' }}>
                <strong style={{ fontSize: '0.95rem', color: '#204051' }}>{selected.name}</strong>
                <br />
                <a
                  href={`/montana-towns/${(selected as TownCoordinate).slug}/`}
                  style={{ fontSize: '0.8rem', color: '#3b6978', textDecoration: 'none', fontWeight: 600 }}
                >
                  View Town Profile →
                </a>
              </div>
            ) : (
              <div style={{ padding: '4px 2px' }}>
                <strong style={{ fontSize: '0.9rem', color: '#204051' }}>{selected.name}</strong>
                <div style={{ fontSize: '0.78rem', color: '#888', marginTop: '2px' }}>{(selected as RecMarker).type}</div>
                {(selected as RecMarker).distMiles != null && (
                  <div style={{ fontSize: '0.78rem', color: '#666', marginTop: '2px' }}>{(selected as RecMarker).distMiles} mi away</div>
                )}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.78rem', color: '#3b6978', textDecoration: 'none', fontWeight: 600, display: 'inline-block', marginTop: '4px' }}
                >
                  Get Directions →
                </a>
              </div>
            )}
          </Popup>
        )}
      </Map>
    </div>
  );
}
