import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import Map, { Marker, Popup, Source, Layer, NavigationControl } from 'react-map-gl/mapbox';
import type { MapRef, LayerProps } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import Link from 'next/link';
import type { RailroadPoint, RailroadRoute } from '../lib/railroadArticles';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

const SUBTYPE_ICONS: Record<string, string> = {
  depot: '🚂',
  mine_disaster: '⚠️',
  disaster_site: '⚠️',
  historic_ceremony: '🎉',
  industrial_site: '🏭',
  mountain_pass: '⛰️',
  monument: '🗿',
  electrification_terminal: '⚡',
  historic_site: '📍',
  historic_community: '🏘️',
  indigenous_site: '🪶',
  tunnel_portal: '🚇',
  abandonment_site: '🛤️',
  historic_landing: '⚓',
  labor_history: '✊',
  railroad_town: '🏠',
  historic_district: '🏛️',
};

const STATUS_STYLES: Record<string, { color: string; dashArray?: number[] }> = {
  active: { color: '#27ae60' },
  active_as_bnsf: { color: '#8B6914', dashArray: [4, 2] },
  abandoned: { color: '#888' },
  abandoned_trail: { color: '#2ecc71', dashArray: [2, 2] },
};

type Props = {
  points: RailroadPoint[];
  routes: RailroadRoute[];
  highlightedArticle?: string | null;
  subtypeLabels: Record<string, string>;
  statusLabels: Record<string, string>;
  height?: number;
};

export default function RailroadMap({
  points,
  routes,
  highlightedArticle,
  subtypeLabels,
  statusLabels,
  height = 500,
}: Props) {
  const mapRef = useRef<MapRef>(null);
  const [selectedPoint, setSelectedPoint] = useState<RailroadPoint | null>(null);
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);

  const routeGeoJSON = useMemo(() => ({
    type: 'FeatureCollection' as const,
    features: routes.map(route => ({
      type: 'Feature' as const,
      properties: {
        id: route.id,
        name: route.name,
        articleSlug: route.articleSlug,
        status: route.status,
        railroad: route.railroad,
        description: route.description,
        color: route.color,
      },
      geometry: {
        type: 'LineString' as const,
        coordinates: route.coordinates,
      },
    })),
  }), [routes]);

  const activeRoutes = useMemo(
    () => routes.filter(r => r.status === 'active' || r.status === 'active_as_bnsf'),
    [routes]
  );

  const abandonedRoutes = useMemo(
    () => routes.filter(r => r.status === 'abandoned' || r.status === 'abandoned_trail'),
    [routes]
  );

  useEffect(() => {
    if (highlightedArticle && mapRef.current) {
      const articlePoints = points.filter(p => p.articleSlug === highlightedArticle);
      const articleRoutes = routes.filter(r => r.articleSlug === highlightedArticle);

      if (articlePoints.length > 0 || articleRoutes.length > 0) {
        const lngs: number[] = [];
        const lats: number[] = [];

        articlePoints.forEach(p => {
          lngs.push(p.lng);
          lats.push(p.lat);
        });

        articleRoutes.forEach(r => {
          r.coordinates.forEach(([lng, lat]) => {
            lngs.push(lng);
            lats.push(lat);
          });
        });

        if (lngs.length > 0) {
          const minLng = Math.min(...lngs);
          const maxLng = Math.max(...lngs);
          const minLat = Math.min(...lats);
          const maxLat = Math.max(...lats);

          mapRef.current.fitBounds(
            [[minLng - 0.5, minLat - 0.3], [maxLng + 0.5, maxLat + 0.3]],
            { duration: 800, padding: 40 }
          );
        }
      }
    }
  }, [highlightedArticle, points, routes]);

  const onPointClick = useCallback((point: RailroadPoint) => {
    setSelectedPoint(point);
  }, []);

  const activeRouteLayer: LayerProps = {
    id: 'active-routes',
    type: 'line',
    paint: {
      'line-color': ['get', 'color'],
      'line-width': 4,
      'line-opacity': 0.9,
    },
    filter: ['in', ['get', 'status'], ['literal', ['active', 'active_as_bnsf']]],
  };

  const abandonedRouteLayer: LayerProps = {
    id: 'abandoned-routes',
    type: 'line',
    paint: {
      'line-color': ['get', 'color'],
      'line-width': 3,
      'line-opacity': 0.6,
      'line-dasharray': [4, 3],
    },
    filter: ['in', ['get', 'status'], ['literal', ['abandoned', 'abandoned_trail']]],
  };

  return (
    <div style={{ height, position: 'relative' }}>
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: -110.5,
          latitude: 47.0,
          zoom: 5.5,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        cooperativeGestures={true}
        keyboard={true}
      >
        <NavigationControl position="top-right" />

        <Source id="routes" type="geojson" data={routeGeoJSON}>
          <Layer {...abandonedRouteLayer} />
          <Layer {...activeRouteLayer} />
        </Source>

        {points.map(point => {
          const isHighlighted = highlightedArticle === point.articleSlug;
          const icon = SUBTYPE_ICONS[point.subtype] || '📍';

          return (
            <Marker
              key={point.id}
              longitude={point.lng}
              latitude={point.lat}
              anchor="center"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                onPointClick(point);
              }}
            >
              <div
                style={{
                  width: isHighlighted ? 32 : 26,
                  height: isHighlighted ? 32 : 26,
                  borderRadius: '50%',
                  background: point.color,
                  border: isHighlighted ? '3px solid #fff' : '2px solid rgba(255,255,255,0.8)',
                  boxShadow: isHighlighted
                    ? '0 0 12px rgba(255,255,255,0.6)'
                    : '0 2px 6px rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: isHighlighted ? '14px' : '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  transform: isHighlighted ? 'scale(1.1)' : 'scale(1)',
                }}
                title={point.name}
              >
                {icon}
              </div>
            </Marker>
          );
        })}

        {selectedPoint && (
          <Popup
            longitude={selectedPoint.lng}
            latitude={selectedPoint.lat}
            anchor="bottom"
            onClose={() => setSelectedPoint(null)}
            closeButton={true}
            closeOnClick={false}
            maxWidth="300px"
          >
            <div style={{ padding: '0.5rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#204051', marginBottom: '0.25rem' }}>
                {selectedPoint.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.5rem' }}>
                {subtypeLabels[selectedPoint.subtype] || selectedPoint.subtype} · {selectedPoint.year}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#555', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                {selectedPoint.description}
              </div>
              <Link
                href={`/guides/montana-railroad-history/${selectedPoint.articleSlug}/`}
                style={{
                  display: 'inline-block',
                  fontSize: '0.8rem',
                  color: '#3b6978',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Read Article →
              </Link>
            </div>
          </Popup>
        )}
      </Map>

      <style jsx>{`
        .mapboxgl-popup-content {
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
}
