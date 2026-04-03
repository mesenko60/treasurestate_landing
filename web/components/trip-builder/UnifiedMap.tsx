import React, { useRef, useEffect, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { ItineraryPOI, Corridor, HistoricMarker, HistoryTrailMapData, CorridorPOI, RouteData } from './types';

const HISTORY_TRAIL_LINE_COLOR = '#c9a227';
const HISTORY_TRAIL_LINE_WIDTH = 4;

const POI_CATEGORY_COLORS: Record<string, string> = {
  hotspring: '#e74c3c',
  campground: '#27ae60',
  hiking: '#8e44ad',
};

export interface UnifiedMapHandle {
  flyTo: (opts: { center?: [number, number]; zoom?: number; duration?: number; pitch?: number; bearing?: number }) => void;
  fitBounds: (bounds: [[number, number], [number, number]], opts?: { duration?: number; padding?: number | { top: number; bottom: number; left: number; right: number }; maxZoom?: number }) => void;
  getMap: () => mapboxgl.Map | null;
}

interface UnifiedMapProps {
  corridors: Corridor[];
  selectedCorridorId: string | null;
  tripCorridorIds: string[];
  filteredCorridorIds: string[];
  dimCorridors: boolean;
  activeHistoryTrail: HistoryTrailMapData | null;
  itinerary: ItineraryPOI[];
  historicMarkers: HistoricMarker[];
  showHistoricMarkers: boolean;
  filteredPois: CorridorPOI[];
  selectedHistoricMarker: HistoricMarker | null;
  hoveredPoi: CorridorPOI | null;
  onCorridorClick: (id: string) => void;
  onHistoricMarkerClick: (marker: HistoricMarker) => void;
  onPoiClick: (poi: CorridorPOI) => void;
  onCloseHistoricMarkerPopup: () => void;
  onClosePoiPopup: () => void;
}

function isMapAlive(map: mapboxgl.Map | null): map is mapboxgl.Map {
  if (!map) return false;
  try {
    map.getCanvas();
    return true;
  } catch {
    return false;
  }
}

const UnifiedMap = forwardRef<UnifiedMapHandle, UnifiedMapProps>(function UnifiedMap(props, ref) {
  const {
    corridors, selectedCorridorId, tripCorridorIds, filteredCorridorIds,
    dimCorridors, activeHistoryTrail, itinerary, historicMarkers,
    showHistoricMarkers, filteredPois, selectedHistoricMarker, hoveredPoi,
    onCorridorClick, onHistoricMarkerClick, onPoiClick,
    onCloseHistoricMarkerPopup, onClosePoiPopup,
  } = props;

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const itineraryMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const corridorStartEndRef = useRef<mapboxgl.Marker[]>([]);
  const poiMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const historicMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const trailStopMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  const routeRef = useRef<{ source: boolean; layers: string[] }>({ source: false, layers: [] });
  const [isDrawingRoute, setIsDrawingRoute] = useState(false);
  const lastItineraryKeyRef = useRef<string>('');

  // Stable refs for callbacks so effects don't re-run when callbacks change
  const onCorridorClickRef = useRef(onCorridorClick);
  onCorridorClickRef.current = onCorridorClick;
  const onHistoricMarkerClickRef = useRef(onHistoricMarkerClick);
  onHistoricMarkerClickRef.current = onHistoricMarkerClick;
  const onPoiClickRef = useRef(onPoiClick);
  onPoiClickRef.current = onPoiClick;
  const onCloseHistoricMarkerPopupRef = useRef(onCloseHistoricMarkerPopup);
  onCloseHistoricMarkerPopupRef.current = onCloseHistoricMarkerPopup;
  const onClosePoiPopupRef = useRef(onClosePoiPopup);
  onClosePoiPopupRef.current = onClosePoiPopup;

  useImperativeHandle(ref, () => ({
    flyTo: (opts) => { try { mapRef.current?.flyTo(opts); } catch { /* map destroyed */ } },
    fitBounds: (bounds, opts) => { try { mapRef.current?.fitBounds(bounds, opts); } catch { /* map destroyed */ } },
    getMap: () => mapRef.current,
  }));

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [-109.5, 46.8],
      zoom: 5.5,
      pitch: 45,
      bearing: 0,
      attributionControl: true,
      antialias: true,
      fadeDuration: 0,
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    mapRef.current = map;

    map.on('load', () => {
      try {
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
      } catch { /* ignore terrain setup errors */ }

      fetch('/montana-border.geojson')
        .then((r) => r.json())
        .then((geojson) => {
          try {
            if (isMapAlive(map) && !map.getSource('montana-border')) {
              map.addSource('montana-border', { type: 'geojson', data: geojson });
              map.addLayer({
                id: 'montana-border-line',
                type: 'line',
                source: 'montana-border',
                paint: { 'line-color': '#fff', 'line-width': 2, 'line-opacity': 0.7 },
              });
            }
          } catch { /* map may have been destroyed */ }
        })
        .catch(() => {})
        .finally(() => {
          if (mapRef.current === map) setMapReady(true);
        });
    });

    return () => {
      mapRef.current = null;
      try { map.remove(); } catch { /* already removed */ }
    };
  }, []);

  // One-time corridor layer setup (separate from data updates)
  const corridorLayersAdded = useRef(false);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || corridorLayersAdded.current) return;

    try {
      const emptyGeo: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] };
      map.addSource('corridors', { type: 'geojson', data: emptyGeo });

      map.addLayer({
        id: 'corridor-lines-casing', type: 'line', source: 'corridors',
        paint: {
          'line-color': '#fff',
          'line-width': ['case', ['get', 'isSelected'], 8, ['==', ['get', 'dim'], 1], 0, ['get', 'inTrip'], 7, 0],
          'line-opacity': ['case', ['get', 'isSelected'], 0.8, ['==', ['get', 'dim'], 1], 0, ['get', 'inTrip'], 0.5, 0],
        },
        layout: { 'line-cap': 'round', 'line-join': 'round' },
      });

      map.addLayer({
        id: 'corridor-lines', type: 'line', source: 'corridors',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': ['case', ['get', 'isSelected'], 5, ['get', 'inTrip'], 4, 2.5],
          'line-opacity': [
            'case', ['get', 'isSelected'], 1,
            ['==', ['get', 'dim'], 1], 0.14,
            ['get', 'inTrip'], 0.9,
            ['get', 'isFiltered'], 0.6, 0.15,
          ],
        },
        layout: { 'line-cap': 'round', 'line-join': 'round' },
      });

      map.on('click', 'corridor-lines', (e) => {
        if (e.features && e.features.length > 0) {
          const id = e.features[0].properties?.id;
          if (id) onCorridorClickRef.current(id);
        }
      });
      map.on('mouseenter', 'corridor-lines', () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', 'corridor-lines', () => { map.getCanvas().style.cursor = ''; });

      corridorLayersAdded.current = true;
    } catch (err) {
      console.error('Corridor layer setup error:', err);
    }
  }, [mapReady]);

  // Corridor GeoJSON data updates only
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !corridorLayersAdded.current) return;

    const filteredSet = new Set(filteredCorridorIds);
    const tripSet = new Set(tripCorridorIds);

    const geojson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: corridors.map((c) => ({
        type: 'Feature' as const,
        properties: {
          id: c.id, color: c.color,
          isSelected: c.id === selectedCorridorId,
          inTrip: tripSet.has(c.id),
          isFiltered: filteredSet.has(c.id),
          dim: dimCorridors ? 1 : 0,
        },
        geometry: { type: 'LineString' as const, coordinates: c.geometry.coordinates },
      })),
    };

    try {
      const src = map.getSource('corridors') as mapboxgl.GeoJSONSource | undefined;
      if (src) src.setData(geojson);
    } catch { /* map may be destroyed */ }
  }, [corridors, selectedCorridorId, tripCorridorIds, filteredCorridorIds, dimCorridors, mapReady]);

  // One-time history trail layer setup
  const trailLayersAdded = useRef(false);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || trailLayersAdded.current) return;

    try {
      const emptyGeo: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] };
      map.addSource('history-trail-line', { type: 'geojson', data: emptyGeo });
      map.addLayer({
        id: 'history-trail-line-casing', type: 'line', source: 'history-trail-line',
        paint: { 'line-color': '#fff', 'line-width': HISTORY_TRAIL_LINE_WIDTH + 5, 'line-opacity': 0.45 },
        layout: { 'line-cap': 'round', 'line-join': 'round' },
      });
      map.addLayer({
        id: 'history-trail-line-layer', type: 'line', source: 'history-trail-line',
        paint: { 'line-color': HISTORY_TRAIL_LINE_COLOR, 'line-width': HISTORY_TRAIL_LINE_WIDTH, 'line-opacity': 0.95 },
        layout: { 'line-cap': 'round', 'line-join': 'round' },
      });
      trailLayersAdded.current = true;
    } catch (err) {
      console.error('Trail layer setup error:', err);
    }
  }, [mapReady]);

  // History trail data updates
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !trailLayersAdded.current) return;

    const geojson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: activeHistoryTrail
        ? activeHistoryTrail.lineSegments.map((coords, i) => ({
            type: 'Feature' as const,
            properties: { seg: i },
            geometry: { type: 'LineString' as const, coordinates: coords },
          }))
        : [],
    };

    try {
      const src = map.getSource('history-trail-line') as mapboxgl.GeoJSONSource | undefined;
      if (src) src.setData(geojson);
    } catch { /* map may be destroyed */ }
  }, [activeHistoryTrail, mapReady]);

  // History trail stop markers
  useEffect(() => {
    const map = mapRef.current;
    if (!isMapAlive(map) || !mapReady) return;

    trailStopMarkersRef.current.forEach((m) => { try { m.remove(); } catch { /* already removed */ } });
    trailStopMarkersRef.current = [];

    if (!activeHistoryTrail) return;

    activeHistoryTrail.stops.forEach((stop, idx) => {
      const el = document.createElement('div');
      Object.assign(el.style, {
        minWidth: '22px', height: '22px', padding: '0 5px',
        borderRadius: '50%', background: HISTORY_TRAIL_LINE_COLOR,
        border: '2px solid rgba(255,255,255,0.95)', boxShadow: '0 2px 5px rgba(0,0,0,0.35)',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.65rem', fontWeight: '800', color: '#1a1e2e',
      });
      el.textContent = `${idx + 1}`;
      el.addEventListener('click', (e) => { e.stopPropagation(); onHistoricMarkerClickRef.current(stop); });

      try {
        const marker = new mapboxgl.Marker({ element: el }).setLngLat([stop.lng, stop.lat]).addTo(map);
        trailStopMarkersRef.current.push(marker);
      } catch { /* map may be destroyed */ }
    });
  }, [activeHistoryTrail, mapReady]);

  // Corridor start/end markers
  useEffect(() => {
    const map = mapRef.current;
    if (!isMapAlive(map) || !mapReady) return;

    corridorStartEndRef.current.forEach((m) => { try { m.remove(); } catch { /* noop */ } });
    corridorStartEndRef.current = [];

    const corridor = corridors.find((c) => c.id === selectedCorridorId);
    if (!corridor) return;

    const coords = corridor.geometry.coordinates;
    const makeEl = (label: string) => {
      const el = document.createElement('div');
      Object.assign(el.style, {
        width: '18px', height: '18px', borderRadius: '50%', background: corridor.color,
        border: '3px solid #fff', boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.55rem', color: '#fff', fontWeight: '700',
      });
      el.textContent = label;
      return el;
    };

    try {
      const start = new mapboxgl.Marker({ element: makeEl('S') }).setLngLat(coords[0] as [number, number]).addTo(map);
      const end = new mapboxgl.Marker({ element: makeEl('E') }).setLngLat(coords[coords.length - 1] as [number, number]).addTo(map);
      corridorStartEndRef.current = [start, end];
    } catch { /* map may be destroyed */ }
  }, [selectedCorridorId, corridors, mapReady]);

  // Corridor POI markers
  useEffect(() => {
    const map = mapRef.current;
    if (!isMapAlive(map) || !mapReady) return;

    poiMarkersRef.current.forEach((m) => { try { m.remove(); } catch { /* noop */ } });
    poiMarkersRef.current = [];

    filteredPois.slice(0, 60).forEach((p) => {
      const el = document.createElement('div');
      Object.assign(el.style, {
        width: '10px', height: '10px', borderRadius: '50%',
        background: POI_CATEGORY_COLORS[p.category] || '#3b6978',
        border: '2px solid rgba(255,255,255,0.9)', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        cursor: 'pointer',
      });
      el.addEventListener('click', (e) => { e.stopPropagation(); onPoiClickRef.current(p); });

      try {
        const marker = new mapboxgl.Marker({ element: el }).setLngLat([p.lng, p.lat]).addTo(map);
        poiMarkersRef.current.push(marker);
      } catch { /* map may be destroyed */ }
    });
  }, [filteredPois, mapReady]);

  // Historic markers
  useEffect(() => {
    const map = mapRef.current;
    if (!isMapAlive(map) || !mapReady) return;

    historicMarkersRef.current.forEach((m) => { try { m.remove(); } catch { /* noop */ } });
    historicMarkersRef.current = [];

    if (!showHistoricMarkers) return;

    historicMarkers.forEach((m) => {
      const el = document.createElement('div');
      Object.assign(el.style, {
        width: '10px', height: '10px', borderRadius: '2px', background: '#8b4513',
        border: '2px solid rgba(255,255,255,0.9)', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        cursor: 'pointer', transform: 'rotate(45deg)',
      });
      el.addEventListener('click', (e) => { e.stopPropagation(); onHistoricMarkerClickRef.current(m); });

      try {
        const marker = new mapboxgl.Marker({ element: el }).setLngLat([m.lng, m.lat]).addTo(map);
        historicMarkersRef.current.push(marker);
      } catch { /* map may be destroyed */ }
    });
  }, [showHistoricMarkers, historicMarkers, mapReady]);

  // Historic marker / POI popup
  useEffect(() => {
    const map = mapRef.current;
    if (!isMapAlive(map) || !mapReady) return;

    if (popupRef.current) {
      try { popupRef.current.remove(); } catch { /* noop */ }
      popupRef.current = null;
    }

    if (selectedHistoricMarker) {
      const m = selectedHistoricMarker;
      const truncated = m.inscription.length > 600 ? m.inscription.slice(0, 600) + '...' : m.inscription;
      const html = `
        <div style="padding:0.75rem;max-width:420px;max-height:min(70vh,460px);display:flex;flex-direction:column;">
          <strong style="font-size:0.98rem;color:#204051;margin-bottom:0.35rem;">${m.title}</strong>
          ${m.town ? `<div style="font-size:0.76rem;color:#888;margin-bottom:0.45rem;">${m.town}</div>` : ''}
          <div style="flex:1;overflow-y:auto;font-size:0.8rem;color:#333;line-height:1.5;margin-bottom:0.5rem;-webkit-overflow-scrolling:touch;">${truncated.replace(/\n/g, '<br>')}</div>
          <div style="padding-top:0.55rem;border-top:1px solid #e8ede8;display:flex;gap:1rem;flex-wrap:wrap;">
            ${m.isCurated ? `<a href="/historic-markers/${m.slug}/" style="font-size:0.82rem;color:#27ae60;font-weight:600;text-decoration:none;">View full page &rarr;</a>` : ''}
            <a href="https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}" target="_blank" rel="noopener noreferrer" style="font-size:0.82rem;color:#3b6978;font-weight:600;text-decoration:none;">Get directions</a>
          </div>
        </div>`;

      try {
        const popup = new mapboxgl.Popup({ maxWidth: '460px', closeButton: true, closeOnClick: false, anchor: 'top', offset: 10 })
          .setLngLat([m.lng, m.lat])
          .setHTML(html)
          .addTo(map);
        popup.on('close', () => onCloseHistoricMarkerPopupRef.current());
        popupRef.current = popup;
      } catch { /* map may be destroyed */ }
    } else if (hoveredPoi) {
      const p = hoveredPoi;
      const html = `
        <div style="padding:4px 2px;">
          <strong style="font-size:0.85rem;color:#204051;">${p.name}</strong>
          <div style="font-size:0.72rem;color:#888;margin-top:2px;">${p.type || p.category}</div>
          ${p.rating != null ? `<div style="font-size:0.75rem;color:#d8973c;margin-top:2px;">&#9733; ${p.rating.toFixed(1)}${p.reviews ? ` (${p.reviews.toLocaleString()})` : ''}</div>` : ''}
          <div style="font-size:0.72rem;color:#6b7890;margin-top:2px;">${p.distFromRoute.toFixed(1)} mi from route</div>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}" target="_blank" rel="noopener noreferrer" style="font-size:0.75rem;color:#3b6978;font-weight:600;text-decoration:none;margin-top:4px;display:inline-block;">Directions &rarr;</a>
        </div>`;

      try {
        const popup = new mapboxgl.Popup({ maxWidth: '220px', closeButton: true, closeOnClick: false, anchor: 'bottom', offset: 10 })
          .setLngLat([p.lng, p.lat])
          .setHTML(html)
          .addTo(map);
        popup.on('close', () => onClosePoiPopupRef.current());
        popupRef.current = popup;
      } catch { /* map may be destroyed */ }
    }
  }, [selectedHistoricMarker, hoveredPoi, mapReady]);

  // Itinerary stop markers
  useEffect(() => {
    const map = mapRef.current;
    if (!isMapAlive(map) || !mapReady) return;

    itineraryMarkersRef.current.forEach((m) => { try { m.remove(); } catch { /* noop */ } });
    itineraryMarkersRef.current = [];

    if (itinerary.length === 0) return;

    itinerary.forEach((poi, idx) => {
      const el = document.createElement('div');
      const isCity = poi.itemType === 'city';
      const size = isCity ? 30 : 24;
      Object.assign(el.style, {
        width: `${size}px`, height: `${size}px`, borderRadius: '50%',
        background: isCity ? '#3b82f6' : '#ef4444',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontWeight: 'bold', fontSize: '14px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)', border: '2px solid #fff', cursor: 'pointer',
      });
      el.textContent = `${idx + 1}`;

      const popupHtml = `
        <div style="padding:8px;max-width:280px;">
          <h3 style="font-weight:bold;font-size:1rem;margin:0 0 4px;">${poi.name}</h3>
          ${poi.description ? `<p style="font-size:0.875rem;margin:0 0 4px;">${poi.description}</p>` : ''}
          ${!isCity && poi.type ? `<p style="font-size:0.75rem;color:#3b82f6;margin:0;">${poi.type}</p>` : ''}
          ${poi.rating ? `<p style="font-size:0.75rem;margin:4px 0 0;">&#11088; ${poi.rating}</p>` : ''}
        </div>`;

      try {
        const popup = new mapboxgl.Popup({ offset: 20, closeButton: false, maxWidth: '320px' }).setHTML(popupHtml);
        const marker = new mapboxgl.Marker({ element: el }).setLngLat([poi.lon, poi.lat]).setPopup(popup).addTo(map);
        el.addEventListener('click', () => marker.togglePopup());
        itineraryMarkersRef.current.push(marker);
      } catch { /* map may be destroyed */ }
    });
  }, [itinerary, mapReady]);

  // Route drawing via Mapbox Directions
  const cleanupRoute = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    try {
      routeRef.current.layers.forEach((id) => { if (map.getLayer(id)) map.removeLayer(id); });
      if (routeRef.current.source && map.getSource('route')) map.removeSource('route');
      routeRef.current = { source: false, layers: [] };
    } catch {
      routeRef.current = { source: false, layers: [] };
    }
  }, []);

  const drawRoute = useCallback(async () => {
    const map = mapRef.current;
    if (!isMapAlive(map) || !mapReady || isDrawingRoute) return;

    const enabledPOIs = itinerary.filter(
      (p) => p.enabled !== false && p.lon != null && p.lat != null && !isNaN(p.lon) && !isNaN(p.lat)
    );

    if (enabledPOIs.length < 2) return;

    const key = enabledPOIs.map((p) => `${p.id}-${p.lon}-${p.lat}`).join('|');
    if (key === lastItineraryKeyRef.current) return;

    setIsDrawingRoute(true);
    try {
      cleanupRoute();
      const coordStr = enabledPOIs.map((p) => `${p.lon},${p.lat}`).join(';');
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordStr}?geometries=geojson&overview=full&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`Mapbox API: ${resp.status}`);
      const data = await resp.json();
      if (!data.routes?.length) return;

      if (!isMapAlive(mapRef.current)) return;
      const route = data.routes[0] as RouteData;

      map.addSource('route', {
        type: 'geojson',
        data: { type: 'Feature', properties: {}, geometry: { type: 'LineString' as const, coordinates: route.geometry.coordinates } },
      });
      routeRef.current.source = true;

      map.addLayer({
        id: 'route-glow', type: 'line', source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#fff', 'line-width': 12, 'line-opacity': 0.6, 'line-blur': 3 },
      });
      routeRef.current.layers.push('route-glow');

      map.addLayer({
        id: 'route-line', type: 'line', source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#3b82f6', 'line-width': 6, 'line-opacity': 0.8 },
      });
      routeRef.current.layers.push('route-line');

      lastItineraryKeyRef.current = key;

      window.dispatchEvent(new CustomEvent('routeCalculated', {
        detail: {
          distance: route.distance * 0.000621371,
          duration: route.duration / 60,
          legDistances: route.legs.map((l) => l.distance * 0.000621371),
          legDurations: route.legs.map((l) => l.duration / 60),
        },
      }));
    } catch (err) {
      console.error('Route error:', err);
    } finally {
      setIsDrawingRoute(false);
    }
  }, [itinerary, mapReady, isDrawingRoute, cleanupRoute]);

  useEffect(() => {
    if (!mapReady) return;
    if (itinerary.filter((p) => p.enabled !== false).length < 2) {
      cleanupRoute();
      lastItineraryKeyRef.current = '';
      return;
    }
    const t = setTimeout(drawRoute, 300);
    return () => clearTimeout(t);
  }, [itinerary, mapReady, drawRoute, cleanupRoute]);

  // Fit to itinerary when stops change
  useEffect(() => {
    const map = mapRef.current;
    if (!isMapAlive(map) || !mapReady || itinerary.length === 0) return;

    const enabled = itinerary.filter((p) => p.enabled !== false);
    if (enabled.length === 0) return;

    try {
      const bounds = new mapboxgl.LngLatBounds();
      enabled.forEach((p) => bounds.extend([p.lon, p.lat]));
      map.fitBounds(bounds, { padding: 150, duration: 1200, maxZoom: 8 });
    } catch { /* map may be destroyed */ }
  }, [itinerary.length, mapReady]);

  return (
    <div
      ref={mapContainer}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden' }}
      aria-label="Montana Trip Planner Map"
    />
  );
});

export default UnifiedMap;
