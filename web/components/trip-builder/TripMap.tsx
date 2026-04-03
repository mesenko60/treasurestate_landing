import React, { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { ItineraryPOI, City, RouteData } from './types';

interface TripMapProps {
  itinerary: ItineraryPOI[];
  selectedCities: string[];
  cities: City[];
}

export default function TripMap({ itinerary, selectedCities = [], cities = [] }: TripMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const routeRef = useRef<{ source: boolean; layers: string[] }>({
    source: false,
    layers: [],
  });
  const [mapReady, setMapReady] = useState(false);
  const [isDrawingRoute, setIsDrawingRoute] = useState(false);
  const [lastItinerary, setLastItinerary] = useState<string>('');

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    const defaultCenter: [number, number] = [-110.3626, 47.0525];
    const initialCenter: [number, number] =
      itinerary && itinerary.length > 0
        ? [itinerary[0].lon, itinerary[0].lat]
        : defaultCenter;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: initialCenter,
      zoom: 6,
      pitch: 45,
      bearing: 0,
      attributionControl: true,
      antialias: true,
      fadeDuration: 0,
      pitchWithRotate: false,
    });

    mapRef.current = map;

    map.on('load', () => {
      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.terrain-rgb',
        tileSize: 512,
        maxzoom: 14,
      });

      map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });

      map.setFog({
        range: [0.5, 10],
        color: '#dbeafe',
        'high-color': '#f0f9ff',
        'space-color': '#bcdff1',
        'horizon-blend': 0.05,
      });

      fetch('/montana-border.geojson')
        .then((resp) => resp.json())
        .then((geojson) => {
          if (!map.getSource('montana-border')) {
            map.addSource('montana-border', {
              type: 'geojson',
              data: geojson,
            });

            map.addLayer({
              id: 'montana-border-line',
              type: 'line',
              source: 'montana-border',
              paint: {
                'line-color': '#fff',
                'line-width': 2,
                'line-opacity': 0.7,
              },
            });
          }
        })
        .catch((err) => console.error('Failed to load Montana border:', err))
        .finally(() => {
          setMapReady(true);
        });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        setMapReady(false);
      }
    };
  }, []);

  const cleanupRoute = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    try {
      routeRef.current.layers.forEach((layerId) => {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
      });

      if (routeRef.current.source && map.getSource('route')) {
        map.removeSource('route');
      }

      routeRef.current.source = false;
      routeRef.current.layers = [];
    } catch (err) {
      console.error('Error cleaning up route:', err);
    }
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    if (itinerary.length === 0) {
      return;
    }

    const markers = itinerary.map((poi, idx) => {
      const el = document.createElement('div');

      if (poi.itemType === 'city') {
        el.className = 'city-marker';
        el.style.backgroundColor = '#3b82f6';
        el.style.width = '30px';
        el.style.height = '30px';
      } else {
        el.className = 'poi-marker';
        el.style.backgroundColor = '#ef4444';
        el.style.width = '24px';
        el.style.height = '24px';
      }

      el.style.borderRadius = '50%';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.color = '#fff';
      el.style.fontWeight = 'bold';
      el.style.fontSize = '14px';
      el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
      el.style.border = '2px solid #fff';
      el.style.cursor = 'pointer';

      el.textContent = `${idx + 1}`;

      const popupContent = `
        <div style="padding: 8px; max-width: 280px;">
          <h3 style="font-weight: bold; font-size: 1rem; margin: 0 0 4px 0;">${poi.name}</h3>
          ${poi.description ? `<p style="font-size: 0.875rem; margin: 0 0 4px 0;">${poi.description}</p>` : ''}
          ${poi.itemType !== 'city' && poi.type ? `<p style="font-size: 0.75rem; color: #3b82f6; margin: 0;">${poi.type}</p>` : ''}
          ${poi.rating ? `<p style="font-size: 0.75rem; margin: 4px 0 0 0;">⭐ ${poi.rating}</p>` : ''}
        </div>
      `;

      const popup = new mapboxgl.Popup({
        offset: 20,
        closeButton: false,
        maxWidth: '320px',
      }).setHTML(popupContent);

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([poi.lon, poi.lat])
        .setPopup(popup)
        .addTo(map);

      el.addEventListener('click', () => marker.togglePopup());

      return marker;
    });

    markersRef.current = markers;

    if (markers.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      itinerary.forEach((poi) => {
        bounds.extend([poi.lon, poi.lat]);
      });

      map.fitBounds(bounds, {
        padding: 150,
        duration: 1200,
        maxZoom: 8,
      });
    }
  }, [itinerary, mapReady]);

  const drawRoute = useCallback(async () => {
    const map = mapRef.current;
    if (!map || !mapReady || isDrawingRoute) return;

    if (!itinerary || itinerary.length < 2) {
      return;
    }

    const validPOIs = itinerary.filter(
      (poi) =>
        poi.lon != null &&
        poi.lat != null &&
        !isNaN(Number(poi.lon)) &&
        !isNaN(Number(poi.lat))
    );

    if (validPOIs.length < 2) {
      return;
    }

    const itineraryKey = validPOIs.map((poi) => `${poi.id}-${poi.lon}-${poi.lat}`).join('|');
    if (itineraryKey === lastItinerary) {
      return;
    }

    setIsDrawingRoute(true);

    try {
      cleanupRoute();

      const enabledPOIs = validPOIs.filter((poi) => poi.enabled !== false);
      const coordinates = enabledPOIs.map((poi) => [poi.lon, poi.lat]);

      if (map.getLayer('route')) {
        map.removeLayer('route');
      }
      if (map.getSource('route')) {
        map.removeSource('route');
      }

      const coordinateString = coordinates.map((coord) => coord.join(',')).join(';');
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinateString}?geometries=geojson&overview=full&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Mapbox API error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.routes || data.routes.length === 0) {
        console.error('No route found');
        return;
      }

      const route = data.routes[0] as RouteData;
      const routeGeometry = route.geometry;

      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString' as const,
            coordinates: routeGeometry.coordinates,
          },
        },
      });
      routeRef.current.source = true;

      map.addLayer({
        id: 'route-glow',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#fff',
          'line-width': 12,
          'line-opacity': 0.6,
          'line-blur': 3,
        },
      });
      routeRef.current.layers.push('route-glow');

      map.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#3b82f6',
          'line-width': 6,
          'line-opacity': 0.8,
        },
      });
      routeRef.current.layers.push('route-line');

      setLastItinerary(itineraryKey);

      const legDistances = route.legs.map((leg) => leg.distance * 0.000621371);
      const legDurations = route.legs.map((leg) => leg.duration / 60);
      const totalDistance = route.distance * 0.000621371;
      const totalDuration = route.duration / 60;

      const routeEvent = new CustomEvent('routeCalculated', {
        detail: {
          distance: totalDistance,
          duration: totalDuration,
          legDistances,
          legDurations,
        },
      });

      window.dispatchEvent(routeEvent);
    } catch (err) {
      console.error('Error drawing route:', err);
    } finally {
      setIsDrawingRoute(false);
    }
  }, [itinerary, mapReady, isDrawingRoute, lastItinerary, cleanupRoute]);

  useEffect(() => {
    if (!mapReady) return;

    if (!itinerary || itinerary.length < 2) {
      cleanupRoute();
      return;
    }

    const timer = setTimeout(() => {
      drawRoute();
    }, 300);

    return () => clearTimeout(timer);
  }, [itinerary, mapReady, drawRoute, cleanupRoute]);

  return (
    <div
      ref={mapContainer}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
      aria-label="Montana Trip Map"
      tabIndex={0}
    />
  );
}
