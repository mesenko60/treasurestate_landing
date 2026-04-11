import React, { useRef, useEffect, useMemo, useCallback, useState } from 'react';
import Map, { Marker, NavigationControl, Source, Layer } from 'react-map-gl/mapbox';
import type { MapRef } from 'react-map-gl/mapbox';
import { getCategoryInfo } from '../../lib/nearbyApi';
import type { NearbyPOI } from '../../lib/nearbyApi';
import { trackNearbyPOIView, trackMapInteraction } from '../../lib/gtag';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

function radiusCircleGeoJSON(lat: number, lng: number, radiusMeters: number) {
  const points = 64;
  const coords: [number, number][] = [];
  const earthRadius = 6371000;
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * 2 * Math.PI;
    const dLat = (radiusMeters / earthRadius) * Math.cos(angle);
    const dLng = (radiusMeters / (earthRadius * Math.cos((lat * Math.PI) / 180))) * Math.sin(angle);
    coords.push([lng + (dLng * 180) / Math.PI, lat + (dLat * 180) / Math.PI]);
  }
  return {
    type: 'Feature' as const,
    geometry: { type: 'Polygon' as const, coordinates: [coords] },
    properties: {},
  };
}

export default function NearbyMap({
  userLat,
  userLng,
  pois,
  selectedPoi,
  onSelectPoi,
  radiusMeters,
}: {
  userLat: number;
  userLng: number;
  pois: NearbyPOI[];
  selectedPoi: NearbyPOI | null;
  onSelectPoi: (poi: NearbyPOI | null) => void;
  radiusMeters: number;
}) {
  const mapRef = useRef<MapRef>(null);

  const circleData = useMemo(
    () => radiusCircleGeoJSON(userLat, userLng, radiusMeters),
    [userLat, userLng, radiusMeters],
  );

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const padding = 60;
    const bounds = circleData.geometry.coordinates[0];
    const lngs = bounds.map((c) => c[0]);
    const lats = bounds.map((c) => c[1]);
    map.fitBounds(
      [
        [Math.min(...lngs), Math.min(...lats)],
        [Math.max(...lngs), Math.max(...lats)],
      ],
      { padding, duration: 800 },
    );
  }, [circleData]);

  const handleMarkerClick = useCallback(
    (poi: NearbyPOI) => (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelectPoi(poi);
      trackNearbyPOIView(poi.name, poi.category, poi.distance_meters);
      trackMapInteraction('poi_marker_click');
      if (mapRef.current) {
        mapRef.current.flyTo({ center: [poi.lng, poi.lat], zoom: 14, duration: 600 });
      }
    },
    [onSelectPoi],
  );

  if (!MAPBOX_TOKEN) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0', color: '#999' }}>
        Map unavailable — NEXT_PUBLIC_MAPBOX_TOKEN not configured.
      </div>
    );
  }

  return (
    <div style={{ flex: 1, position: 'relative' }}>
      <Map
        ref={mapRef}
        initialViewState={{
          latitude: userLat,
          longitude: userLng,
          zoom: 12,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        attributionControl={false}
        onClick={() => onSelectPoi(null)}
      >
        <NavigationControl position="top-right" />

        <Source id="radius-circle" type="geojson" data={circleData}>
          <Layer
            id="radius-fill"
            type="fill"
            paint={{ 'fill-color': '#3b6978', 'fill-opacity': 0.06 }}
          />
          <Layer
            id="radius-border"
            type="line"
            paint={{ 'line-color': '#3b6978', 'line-width': 2, 'line-dasharray': [3, 2], 'line-opacity': 0.4 }}
          />
        </Source>

        {/* User position */}
        <Marker latitude={userLat} longitude={userLng} anchor="center">
          <div style={{
            width: 18,
            height: 18,
            background: '#4285f4',
            border: '3px solid white',
            borderRadius: '50%',
            boxShadow: '0 0 0 2px rgba(66,133,244,0.3), 0 2px 6px rgba(0,0,0,0.2)',
          }} />
        </Marker>

        {/* POI markers */}
        {pois.map((poi) => {
          const info = getCategoryInfo(poi.category);
          const isSelected = selectedPoi?.id === poi.id;
          return (
            <Marker
              key={poi.id}
              latitude={poi.lat}
              longitude={poi.lng}
              anchor="bottom"
              onClick={handleMarkerClick(poi) as any}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  zIndex: isSelected ? 10 : 1,
                  position: 'relative',
                  transition: 'all 0.15s',
                }}
              >
                {isSelected && (
                  <div style={{
                    background: 'white',
                    borderRadius: 8,
                    padding: '4px 8px',
                    marginBottom: 4,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    maxWidth: 160,
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: info.color, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                      {info.label}
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#204051', lineHeight: 1.2, marginTop: 1 }}>
                      {poi.name}
                    </div>
                  </div>
                )}
                <div
                  style={{
                    width: isSelected ? 36 : 28,
                    height: isSelected ? 36 : 28,
                    background: info.color,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isSelected ? '1.1rem' : '0.8rem',
                    border: isSelected ? '3px solid white' : '2px solid white',
                    boxShadow: isSelected
                      ? '0 0 0 2px ' + info.color + ', 0 3px 8px rgba(0,0,0,0.3)'
                      : '0 1px 4px rgba(0,0,0,0.2)',
                    transition: 'all 0.15s',
                  }}
                  title={`${info.label}: ${poi.name}`}
                >
                  {info.icon}
                </div>
                <div style={{
                  background: info.color,
                  color: 'white',
                  fontSize: '0.55rem',
                  fontWeight: 700,
                  padding: '1px 5px',
                  borderRadius: 4,
                  marginTop: 2,
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}>
                  {info.label}
                </div>
              </div>
            </Marker>
          );
        })}
      </Map>
    </div>
  );
}
