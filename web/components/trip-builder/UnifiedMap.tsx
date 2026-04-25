import React, { useRef, useEffect, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { ItineraryPOI, Corridor, HistoricMarker, HistoryTrailMapData, CorridorPOI, MapHoverPoint, RouteData, POI } from './types';
import { POI_LAYER_CATEGORIES } from './types';

const HISTORY_TRAIL_LINE_COLOR = '#c9a227';
const HISTORY_TRAIL_LINE_WIDTH = 4;
const MAX_DIRECTIONS_WAYPOINTS = 25;
const DIRECTIONS_PROFILE = 'mapbox/driving';

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
  filteredCorridorIds: string[];
  dimCorridors: boolean;
  activeHistoryTrail: HistoryTrailMapData | null;
  canonicalActiveHistoryTrail: HistoryTrailMapData | null;
  activeHistoryStopIds: string[];
  itinerary: ItineraryPOI[];
  historyRouteStops: ItineraryPOI[];
  useHistoryRouteStops: boolean;
  historicMarkers: HistoricMarker[];
  showHistoricMarkers: boolean;
  filteredPois: CorridorPOI[];
  selectedHistoricMarker: HistoricMarker | null;
  selectedMapPoint: MapHoverPoint | null;
  hoveredMapPoint: MapHoverPoint | null;
  onCorridorClick: (id: string) => void;
  onHistoricMarkerClick: (marker: HistoricMarker) => void;
  onPoiClick: (poi: CorridorPOI) => void;
  onCloseHistoricMarkerPopup: () => void;
  onClosePoiPopup: () => void;
  supabasePois: POI[];
  selectedSupabasePoi: POI | null;
  onSupabasePoiClick: (poi: POI) => void;
  onCloseSupabasePoiPopup: () => void;
  onAddHistoryTrailStop: (id: string) => void;
  onRemoveHistoryTrailStop: (id: string) => void;
  /** Bypass for next/dynamic not forwarding refs — pass a MutableRefObject here */
  handleRef?: React.MutableRefObject<UnifiedMapHandle | null>;
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

function corridorGeometryKey(corridor: Corridor) {
  return corridor.geometry.coordinates.map(([lng, lat]) => `${lng},${lat}`).join(';');
}

async function fetchRoadGeometry(waypoints: number[][], token: string): Promise<[number, number][]> {
  if (waypoints.length < 2) return [];

  const fetchChunk = async (chunk: number[][]) => {
    const coordStr = chunk.map(([lng, lat]) => `${lng},${lat}`).join(';');
    const url = `https://api.mapbox.com/directions/v5/${DIRECTIONS_PROFILE}/${coordStr}?geometries=geojson&overview=full&continue_straight=true&access_token=${token}`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Mapbox Directions ${resp.status}`);
    const data = await resp.json();
    const coords = data.routes?.[0]?.geometry?.coordinates;
    if (!Array.isArray(coords) || coords.length === 0) throw new Error('No road route returned');
    return coords as [number, number][];
  };

  if (waypoints.length <= MAX_DIRECTIONS_WAYPOINTS) {
    return fetchChunk(waypoints);
  }

  const routed: [number, number][] = [];
  let start = 0;
  while (start < waypoints.length - 1) {
    const end = Math.min(start + MAX_DIRECTIONS_WAYPOINTS, waypoints.length);
    const chunkCoords = await fetchChunk(waypoints.slice(start, end));
    routed.push(...(routed.length > 0 ? chunkCoords.slice(1) : chunkCoords));
    start = end - 1;
  }

  return routed;
}

function makePopupButton(label: string, variant: 'primary' | 'danger' | 'secondary', onClick: () => void) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  Object.assign(button.style, {
    border: 'none',
    borderRadius: '7px',
    cursor: 'pointer',
    fontSize: '0.78rem',
    fontWeight: '700',
    padding: '7px 10px',
    color: variant === 'primary' ? '#fff' : variant === 'danger' ? '#991b1b' : '#204051',
    background: variant === 'primary' ? '#2563eb' : variant === 'danger' ? '#fee2e2' : '#e8ede8',
  });
  button.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    onClick();
  });
  return button;
}

function makePopupLink(label: string, href: string) {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = label;
  Object.assign(link.style, {
    color: '#3b6978',
    fontSize: '0.8rem',
    fontWeight: '700',
    textDecoration: 'none',
  });
  if (href.startsWith('http')) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }
  return link;
}

function slugToName(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const UnifiedMap = forwardRef<UnifiedMapHandle, UnifiedMapProps>(function UnifiedMap(props, ref) {
  const {
    corridors, selectedCorridorId, filteredCorridorIds,
    dimCorridors, activeHistoryTrail, canonicalActiveHistoryTrail, activeHistoryStopIds,
    itinerary, historyRouteStops, useHistoryRouteStops, historicMarkers,
    showHistoricMarkers, filteredPois, selectedHistoricMarker, selectedMapPoint, hoveredMapPoint,
    onCorridorClick, onHistoricMarkerClick, onPoiClick,
    onCloseHistoricMarkerPopup, onClosePoiPopup,
    supabasePois, selectedSupabasePoi, onSupabasePoiClick, onCloseSupabasePoiPopup,
    onAddHistoryTrailStop, onRemoveHistoryTrailStop,
    handleRef,
  } = props;

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const itineraryMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const corridorStartEndRef = useRef<mapboxgl.Marker[]>([]);
  const poiMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const historicMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const supabasePoiMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const trailStopMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const roadCorridorCacheRef = useRef<Record<string, { key: string; coordinates: [number, number][] }>>({});

  const routeRef = useRef<{ source: boolean; layers: string[] }>({ source: false, layers: [] });
  const [isDrawingRoute, setIsDrawingRoute] = useState(false);
  const [roadCorridorVersion, setRoadCorridorVersion] = useState(0);
  const lastItineraryKeyRef = useRef<string>('');
  const routeStops = useHistoryRouteStops ? historyRouteStops : itinerary;
  const hasMapboxToken = Boolean(process.env.NEXT_PUBLIC_MAPBOX_TOKEN);

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
  const onSupabasePoiClickRef = useRef(onSupabasePoiClick);
  onSupabasePoiClickRef.current = onSupabasePoiClick;
  const onCloseSupabasePoiPopupRef = useRef(onCloseSupabasePoiPopup);
  onCloseSupabasePoiPopupRef.current = onCloseSupabasePoiPopup;
  const onAddHistoryTrailStopRef = useRef(onAddHistoryTrailStop);
  onAddHistoryTrailStopRef.current = onAddHistoryTrailStop;
  const onRemoveHistoryTrailStopRef = useRef(onRemoveHistoryTrailStop);
  onRemoveHistoryTrailStopRef.current = onRemoveHistoryTrailStop;

  const handle: UnifiedMapHandle = React.useMemo(() => ({
    flyTo: (opts) => { try { mapRef.current?.flyTo(opts); } catch { /* map destroyed */ } },
    fitBounds: (bounds, opts) => { try { mapRef.current?.fitBounds(bounds, opts); } catch { /* map destroyed */ } },
    getMap: () => mapRef.current,
  }), []);

  const buildHistoricMarkerPopup = useCallback((marker: HistoricMarker) => {
    const activeTrailIds = new Set(activeHistoryStopIds);
    const trailHasMarker = Boolean(canonicalActiveHistoryTrail?.stops.some((stop) => stop.id === marker.id));
    const markerIsActiveTrailStop = trailHasMarker && activeTrailIds.has(marker.id);

    const root = document.createElement('div');
    Object.assign(root.style, {
      padding: '0.75rem',
      maxWidth: '430px',
      maxHeight: 'min(70vh, 470px)',
      display: 'flex',
      flexDirection: 'column',
    });

    const title = document.createElement('strong');
    title.textContent = marker.title;
    Object.assign(title.style, { fontSize: '0.98rem', color: '#204051', marginBottom: '0.35rem' });
    root.appendChild(title);

    if (marker.town) {
      const town = document.createElement('div');
      town.textContent = marker.town;
      Object.assign(town.style, { fontSize: '0.76rem', color: '#888', marginBottom: '0.45rem' });
      root.appendChild(town);
    }

    const body = document.createElement('div');
    body.textContent = marker.inscription.length > 600 ? `${marker.inscription.slice(0, 600)}...` : marker.inscription;
    Object.assign(body.style, {
      flex: '1',
      overflowY: 'auto',
      fontSize: '0.8rem',
      color: '#333',
      lineHeight: '1.5',
      marginBottom: '0.65rem',
      whiteSpace: 'pre-wrap',
      WebkitOverflowScrolling: 'touch',
    });
    root.appendChild(body);

    const actions = document.createElement('div');
    Object.assign(actions.style, {
      paddingTop: '0.6rem',
      borderTop: '1px solid #e8ede8',
      display: 'flex',
      gap: '0.55rem',
      flexWrap: 'wrap',
      alignItems: 'center',
    });

    if (trailHasMarker) {
      actions.appendChild(makePopupButton(
        markerIsActiveTrailStop ? 'Remove from route' : 'Add back to route',
        markerIsActiveTrailStop ? 'danger' : 'primary',
        () => {
          if (markerIsActiveTrailStop) onRemoveHistoryTrailStopRef.current(marker.id);
          else onAddHistoryTrailStopRef.current(marker.id);
        },
      ));
    }

    if (marker.isCurated) actions.appendChild(makePopupLink('View full page', `/historic-markers/${marker.slug}/`));
    actions.appendChild(makePopupLink('Directions', `https://www.google.com/maps/dir/?api=1&destination=${marker.lat},${marker.lng}`));
    root.appendChild(actions);
    return root;
  }, [activeHistoryStopIds, canonicalActiveHistoryTrail]);

  const buildPoiPopup = useCallback((poi: POI | CorridorPOI, kind: 'supabase' | 'corridor') => {
    const isSupabase = kind === 'supabase';
    const lon = isSupabase ? (poi as POI).lon : (poi as CorridorPOI).lng;

    const root = document.createElement('div');
    Object.assign(root.style, { padding: '0.65rem', maxWidth: '330px' });

    const title = document.createElement('strong');
    title.textContent = poi.name;
    Object.assign(title.style, { display: 'block', fontSize: '0.92rem', color: '#204051', marginBottom: '0.25rem' });
    root.appendChild(title);

    if (poi.type || poi.category) {
      const meta = document.createElement('div');
      meta.textContent = poi.type || poi.category || '';
      Object.assign(meta.style, { fontSize: '0.72rem', color: '#6b7890', marginBottom: '0.35rem' });
      root.appendChild(meta);
    }

    if ('description' in poi && poi.description) {
      const desc = document.createElement('div');
      desc.textContent = poi.description;
      Object.assign(desc.style, {
        fontSize: '0.78rem',
        color: '#666',
        lineHeight: '1.45',
        marginBottom: '0.45rem',
        maxHeight: '120px',
        overflowY: 'auto',
      });
      root.appendChild(desc);
    }

    if (poi.rating != null) {
      const rating = document.createElement('div');
      rating.textContent = `Rating ${poi.rating.toFixed(1)}${poi.reviews ? ` (${poi.reviews.toLocaleString()})` : ''}`;
      Object.assign(rating.style, { fontSize: '0.74rem', color: '#b45309', marginBottom: '0.45rem' });
      root.appendChild(rating);
    }

    const actions = document.createElement('div');
    Object.assign(actions.style, { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' });
    actions.appendChild(makePopupLink('Directions', `https://www.google.com/maps/dir/?api=1&destination=${poi.lat},${lon}`));
    if ('website' in poi && poi.website) actions.appendChild(makePopupLink('Website', poi.website));
    root.appendChild(actions);
    return root;
  }, []);

  const buildHoverPopup = useCallback((point: MapHoverPoint) => {
    const root = document.createElement('div');
    Object.assign(root.style, { padding: '0.55rem 0.65rem', maxWidth: '280px' });

    const title = document.createElement('strong');
    title.textContent = point.name;
    Object.assign(title.style, { display: 'block', fontSize: '0.9rem', color: '#204051', marginBottom: '0.25rem' });
    root.appendChild(title);

    const metaText = point.type || point.category || point.description;
    if (metaText) {
      const meta = document.createElement('div');
      meta.textContent = metaText;
      Object.assign(meta.style, { color: '#6b7890', fontSize: '0.74rem', lineHeight: '1.35' });
      root.appendChild(meta);
    }

    return root;
  }, []);

  const buildMapPointPopup = useCallback((point: MapHoverPoint) => {
    const root = document.createElement('div');
    Object.assign(root.style, { padding: '0.65rem', maxWidth: '340px' });

    const title = document.createElement('strong');
    title.textContent = point.name;
    Object.assign(title.style, { display: 'block', fontSize: '0.94rem', color: '#204051', marginBottom: '0.25rem' });
    root.appendChild(title);

    if (point.type || point.category) {
      const meta = document.createElement('div');
      meta.textContent = point.type || point.category || '';
      Object.assign(meta.style, { fontSize: '0.72rem', color: '#6b7890', marginBottom: '0.35rem' });
      root.appendChild(meta);
    }

    if (point.description) {
      const desc = document.createElement('div');
      desc.textContent = point.description;
      Object.assign(desc.style, {
        fontSize: '0.78rem',
        color: '#555',
        lineHeight: '1.45',
        marginBottom: '0.45rem',
        maxHeight: '120px',
        overflowY: 'auto',
      });
      root.appendChild(desc);
    }

    if (point.rating != null) {
      const rating = document.createElement('div');
      rating.textContent = `Rating ${point.rating.toFixed(1)}${point.reviews ? ` (${point.reviews.toLocaleString()})` : ''}`;
      Object.assign(rating.style, { fontSize: '0.74rem', color: '#b45309', marginBottom: '0.45rem' });
      root.appendChild(rating);
    }

    const actions = document.createElement('div');
    Object.assign(actions.style, { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' });
    actions.appendChild(makePopupLink('Directions', `https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lng}`));
    if (point.website) actions.appendChild(makePopupLink('Website', point.website));
    root.appendChild(actions);

    return root;
  }, []);

  useImperativeHandle(ref, () => handle);

  useEffect(() => {
    if (handleRef) handleRef.current = handle;
    return () => { if (handleRef) handleRef.current = null; };
  }, [handle, handleRef]);

  // Initialize map
  useEffect(() => {
    if (!hasMapboxToken) return;
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
  }, [hasMapboxToken]);

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

  // Replace sparse corridor lines with road-following Directions geometry.
  useEffect(() => {
    if (!mapReady || !hasMapboxToken) return;
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return;

    let cancelled = false;
    const routeCorridors = async () => {
      let changed = false;
      for (const corridor of corridors) {
        if (cancelled) return;
        const key = corridorGeometryKey(corridor);
        const cached = roadCorridorCacheRef.current[corridor.id];
        if (cached?.key === key) continue;

        try {
          const coordinates = await fetchRoadGeometry(corridor.geometry.coordinates, token);
          if (cancelled) return;
          roadCorridorCacheRef.current[corridor.id] = { key, coordinates };
          changed = true;
          setRoadCorridorVersion((version) => version + 1);
        } catch (err) {
          console.error(`Failed to route corridor ${corridor.id}:`, err);
          roadCorridorCacheRef.current[corridor.id] = { key, coordinates: corridor.geometry.coordinates as [number, number][] };
          changed = true;
        }
      }
      if (changed && !cancelled) setRoadCorridorVersion((version) => version + 1);
    };

    routeCorridors();
    return () => { cancelled = true; };
  }, [corridors, hasMapboxToken, mapReady]);

  // Corridor GeoJSON data updates only
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !corridorLayersAdded.current) return;

    const filteredSet = new Set(filteredCorridorIds);
    const geojson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: corridors.map((c) => ({
        type: 'Feature' as const,
        properties: {
          id: c.id, color: c.color,
          isSelected: c.id === selectedCorridorId,
          inTrip: false,
          isFiltered: filteredSet.has(c.id),
          dim: dimCorridors ? 1 : 0,
        },
        geometry: {
          type: 'LineString' as const,
          coordinates: roadCorridorCacheRef.current[c.id]?.coordinates || c.geometry.coordinates,
        },
      })),
    };

    try {
      const src = map.getSource('corridors') as mapboxgl.GeoJSONSource | undefined;
      if (src) src.setData(geojson);
    } catch { /* map may be destroyed */ }
  }, [corridors, selectedCorridorId, filteredCorridorIds, dimCorridors, mapReady, roadCorridorVersion]);

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

    const trailForMarkers = canonicalActiveHistoryTrail || activeHistoryTrail;
    if (!trailForMarkers) return;

    const activeIds = new Set(activeHistoryStopIds);

    trailForMarkers.stops.forEach((stop) => {
      const activeIndex = activeHistoryStopIds.indexOf(stop.id);
      const isActive = activeIndex >= 0;
      const el = document.createElement('div');
      Object.assign(el.style, {
        minWidth: '22px', height: '22px', padding: '0 5px',
        borderRadius: '50%', background: isActive ? HISTORY_TRAIL_LINE_COLOR : 'rgba(148,163,184,0.85)',
        border: isActive ? '2px solid rgba(255,255,255,0.95)' : '2px dashed rgba(255,255,255,0.9)',
        boxShadow: '0 2px 5px rgba(0,0,0,0.35)',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.65rem', fontWeight: '800', color: isActive ? '#1a1e2e' : '#fff',
        opacity: activeIds.size === 0 || isActive ? '1' : '0.75',
      });
      el.textContent = isActive ? `${activeIndex + 1}` : '+';
      el.addEventListener('click', (e) => { e.stopPropagation(); onHistoricMarkerClickRef.current(stop); });

      try {
        const marker = new mapboxgl.Marker({ element: el }).setLngLat([stop.lng, stop.lat]).addTo(map);
        trailStopMarkersRef.current.push(marker);
      } catch { /* map may be destroyed */ }
    });
  }, [activeHistoryTrail, canonicalActiveHistoryTrail, activeHistoryStopIds, mapReady]);

  // Corridor start/end markers
  useEffect(() => {
    const map = mapRef.current;
    if (!isMapAlive(map) || !mapReady) return;

    corridorStartEndRef.current.forEach((m) => { try { m.remove(); } catch { /* noop */ } });
    corridorStartEndRef.current = [];

    const corridor = corridors.find((c) => c.id === selectedCorridorId);
    if (!corridor) return;

    const coords = corridor.geometry.coordinates;
    if (coords.length < 2) return;

    const makeEl = (label: string, color: string) => {
      const el = document.createElement('div');
      Object.assign(el.style, {
        width: '22px', height: '22px', borderRadius: '50%', background: color,
        border: '3px solid #fff', boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.58rem', color: '#fff', fontWeight: '800', cursor: 'pointer',
      });
      el.textContent = label;
      return el;
    };

    const makeEndpointPopup = (label: 'Start' | 'End', townSlug: string, placeLabel?: string) => {
      const root = document.createElement('div');
      Object.assign(root.style, { padding: '0.65rem', maxWidth: '280px' });

      const kicker = document.createElement('div');
      kicker.textContent = `${label} point`;
      Object.assign(kicker.style, {
        color: '#6b7890',
        fontSize: '0.72rem',
        fontWeight: '800',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        marginBottom: '0.25rem',
      });
      root.appendChild(kicker);

      const title = document.createElement('strong');
      title.textContent = placeLabel || slugToName(townSlug);
      Object.assign(title.style, { display: 'block', fontSize: '0.95rem', color: '#204051', marginBottom: '0.35rem' });
      root.appendChild(title);

      const body = document.createElement('div');
      body.textContent = `${corridor.name} ${label.toLowerCase()} location.`;
      Object.assign(body.style, { fontSize: '0.8rem', color: '#555', lineHeight: '1.45' });
      root.appendChild(body);

      return root;
    };

    try {
      const start = new mapboxgl.Marker({ element: makeEl('S', '#16a34a') })
        .setLngLat(coords[0] as [number, number])
        .setPopup(new mapboxgl.Popup({ closeButton: true, closeOnClick: true, offset: 18 }).setDOMContent(makeEndpointPopup('Start', corridor.startTown, corridor.startLabel)))
        .addTo(map);
      const end = new mapboxgl.Marker({ element: makeEl('E', '#dc2626') })
        .setLngLat(coords[coords.length - 1] as [number, number])
        .setPopup(new mapboxgl.Popup({ closeButton: true, closeOnClick: true, offset: 18 }).setDOMContent(makeEndpointPopup('End', corridor.endTown, corridor.endLabel)))
        .addTo(map);
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
        width: '10px', height: '10px', borderRadius: '2px',
        background: '#8b4513',
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

  // Supabase POI markers
  useEffect(() => {
    const map = mapRef.current;
    if (!isMapAlive(map) || !mapReady) return;

    supabasePoiMarkersRef.current.forEach((m) => { try { m.remove(); } catch { /* noop */ } });
    supabasePoiMarkersRef.current = [];

    if (supabasePois.length === 0) return;

    const typeToColor: Record<string, string> = {};
    for (const cat of Object.values(POI_LAYER_CATEGORIES)) {
      for (const t of cat.types) typeToColor[t] = cat.color;
    }

    supabasePois.forEach((p) => {
      const el = document.createElement('div');
      const color = (p.type && typeToColor[p.type]) || '#3498db';
      Object.assign(el.style, {
        width: '9px', height: '9px', borderRadius: '50%',
        background: color,
        border: '1.5px solid rgba(255,255,255,0.85)', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        cursor: 'pointer',
      });
      el.addEventListener('click', (e) => { e.stopPropagation(); onSupabasePoiClickRef.current(p); });

      try {
        const marker = new mapboxgl.Marker({ element: el }).setLngLat([p.lon, p.lat]).addTo(map);
        supabasePoiMarkersRef.current.push(marker);
      } catch { /* map may be destroyed */ }
    });
  }, [supabasePois, mapReady]);

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

      try {
        const popup = new mapboxgl.Popup({ maxWidth: '460px', closeButton: true, closeOnClick: false, anchor: 'top', offset: 10 })
          .setLngLat([m.lng, m.lat])
          .setDOMContent(buildHistoricMarkerPopup(m))
          .addTo(map);
        popup.on('close', () => onCloseHistoricMarkerPopupRef.current());
        popupRef.current = popup;
      } catch { /* map may be destroyed */ }
    } else if (selectedSupabasePoi) {
      const p = selectedSupabasePoi;

      try {
        const popup = new mapboxgl.Popup({ maxWidth: '340px', closeButton: true, closeOnClick: false, anchor: 'bottom', offset: 10 })
          .setLngLat([p.lon, p.lat])
          .setDOMContent(buildPoiPopup(p, 'supabase'))
          .addTo(map);
        popup.on('close', () => onCloseSupabasePoiPopupRef.current());
        popupRef.current = popup;
      } catch { /* map may be destroyed */ }
    } else if (selectedMapPoint) {
      const p = selectedMapPoint;

      try {
        const popup = new mapboxgl.Popup({ maxWidth: '360px', closeButton: true, closeOnClick: false, anchor: 'bottom', offset: 10 })
          .setLngLat([p.lng, p.lat])
          .setDOMContent(buildMapPointPopup(p))
          .addTo(map);
        popup.on('close', () => onClosePoiPopupRef.current());
        popupRef.current = popup;
      } catch { /* map may be destroyed */ }
    } else if (hoveredMapPoint) {
      const p = hoveredMapPoint;

      try {
        const popup = new mapboxgl.Popup({ maxWidth: '300px', closeButton: false, closeOnClick: false, anchor: 'bottom', offset: 10 })
          .setLngLat([p.lng, p.lat])
          .setDOMContent(buildHoverPopup(p))
          .addTo(map);
        popupRef.current = popup;
      } catch { /* map may be destroyed */ }
    }
  }, [
    selectedHistoricMarker,
    selectedSupabasePoi,
    selectedMapPoint,
    hoveredMapPoint,
    mapReady,
    buildHistoricMarkerPopup,
    buildPoiPopup,
    buildMapPointPopup,
    buildHoverPopup,
  ]);

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

      const popupContent = document.createElement('div');
      Object.assign(popupContent.style, { padding: '8px', maxWidth: '280px' });
      const title = document.createElement('h3');
      title.textContent = poi.name;
      Object.assign(title.style, { fontWeight: 'bold', fontSize: '1rem', margin: '0 0 4px' });
      popupContent.appendChild(title);
      if (poi.description) {
        const desc = document.createElement('p');
        desc.textContent = poi.description;
        Object.assign(desc.style, { fontSize: '0.875rem', margin: '0 0 4px' });
        popupContent.appendChild(desc);
      }
      if (!isCity && poi.type) {
        const type = document.createElement('p');
        type.textContent = poi.type;
        Object.assign(type.style, { fontSize: '0.75rem', color: '#3b82f6', margin: '0 0 6px' });
        popupContent.appendChild(type);
      }
      try {
        const popup = new mapboxgl.Popup({ offset: 20, closeButton: false, maxWidth: '320px' }).setDOMContent(popupContent);
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

    const enabledPOIs = routeStops.filter(
      (p) => p.enabled !== false && p.lon != null && p.lat != null && !isNaN(p.lon) && !isNaN(p.lat)
    );

    if (enabledPOIs.length < 2) return;
    if (enabledPOIs.length > MAX_DIRECTIONS_WAYPOINTS) {
      window.dispatchEvent(new CustomEvent('routeError', {
        detail: { message: `Routes are limited to ${MAX_DIRECTIONS_WAYPOINTS} active stops. Turn off or remove a few stops to calculate drive time.` },
      }));
      return;
    }

    const key = enabledPOIs.map((p) => `${p.id}-${p.lon}-${p.lat}`).join('|');
    if (key === lastItineraryKeyRef.current) return;

    setIsDrawingRoute(true);
    try {
      cleanupRoute();
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      if (!token) {
        window.dispatchEvent(new CustomEvent('routeError', {
          detail: { message: 'Map routing is unavailable until a Mapbox token is configured.' },
        }));
        return;
      }
      const coordStr = enabledPOIs.map((p) => `${p.lon},${p.lat}`).join(';');
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordStr}?geometries=geojson&overview=full&access_token=${token}`;
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
      window.dispatchEvent(new CustomEvent('routeError', {
        detail: { message: err instanceof Error ? err.message : 'Route calculation failed.' },
      }));
    } finally {
      setIsDrawingRoute(false);
    }
  }, [routeStops, mapReady, isDrawingRoute, cleanupRoute]);

  useEffect(() => {
    if (!mapReady) return;
    if (routeStops.filter((p) => p.enabled !== false).length < 2) {
      cleanupRoute();
      lastItineraryKeyRef.current = '';
      return;
    }
    const t = setTimeout(drawRoute, 300);
    return () => clearTimeout(t);
  }, [routeStops, mapReady, drawRoute, cleanupRoute]);

  // Fit to itinerary when stops change
  useEffect(() => {
    const map = mapRef.current;
    if (!isMapAlive(map) || !mapReady || routeStops.length === 0) return;

    const enabled = routeStops.filter((p) => p.enabled !== false);
    if (enabled.length === 0) return;

    try {
      const bounds = new mapboxgl.LngLatBounds();
      enabled.forEach((p) => bounds.extend([p.lon, p.lat]));
      map.fitBounds(bounds, { padding: 150, duration: 1200, maxZoom: 8 });
    } catch { /* map may be destroyed */ }
  }, [routeStops, mapReady]);

  if (!hasMapboxToken) {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #111827, #1f2937)',
          color: '#e5e7eb',
          padding: '2rem',
          textAlign: 'center',
        }}
        aria-label="Montana Trip Planner Map unavailable"
      >
        <div style={{ maxWidth: 420 }}>
          <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.25rem', color: '#fff' }}>Map preview unavailable</h2>
          <p style={{ margin: 0, color: '#aab4c4', lineHeight: 1.6 }}>
            Add `NEXT_PUBLIC_MAPBOX_TOKEN` to enable the interactive map, directions, and drive-time calculations.
            You can still browse routes and build a draft itinerary in the planner.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapContainer}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden' }}
      aria-label="Montana Trip Planner Map"
    />
  );
});

export default UnifiedMap;
