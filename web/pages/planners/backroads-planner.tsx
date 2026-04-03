import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GetStaticProps } from 'next';
import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import MapGL, { Source, Layer, Marker, Popup, NavigationControl, MapRef } from 'react-map-gl/mapbox';
import type { LayerProps } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import Header from '../../components/Header';
import MarkerInscription from '../../components/MarkerInscription';
import { HISTORIC_MARKER_MAP_POPUP_SCROLL } from '../../lib/historicMarkerMapPopup';
import { trackMapInteraction } from '../../lib/gtag';
import {
  orderStopsNearestNeighborFromEast,
  buildLineSegmentsLngLat,
  HISTORY_TRAIL_MAX_EDGE_MILES,
} from '../../lib/historyTrailMapOrder';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

type POI = {
  name: string;
  type: string;
  category: string;
  lat: number;
  lng: number;
  distFromRoute: number;
  rating?: number | null;
  reviews?: number | null;
};

type Corridor = {
  id: string;
  name: string;
  description: string;
  highways: string[];
  distanceMiles: number;
  elevationRange: [number, number];
  season: string;
  difficulty: string;
  color: string;
  startTown: string;
  endTown: string;
  throughTowns: string[];
  connections: string[];
  geometry: { type: string; coordinates: number[][] };
  pois: POI[];
};

type TownCoords = Record<string, { name: string; lat: number; lng: number }>;

type HistoricMarker = {
  id: string;
  slug: string;
  title: string;
  lat: number;
  lng: number;
  town: string | null;
  inscription: string;
  isCurated: boolean;
};

/** History trail with map geometry built from marker order in history-trails.json */
type HistoryTrailMapData = {
  id: string;
  name: string;
  markerCount: number;
  /** One or more [lng,lat] paths; long jumps omitted between segments */
  lineSegments: [number, number][][];
  /** Stops in map visualization order (nearest-neighbor from east), not markerIds file order */
  stops: HistoricMarker[];
};

const HISTORY_TRAIL_LINE_COLOR = '#c9a227';
const HISTORY_TRAIL_LINE_WIDTH = 4;

const CATEGORY_ICONS: Record<string, string> = {
  hotspring: '♨️',
  campground: '⛺',
  hiking: '🥾',
  recreation: '🏔️',
};

const CATEGORY_LABELS: Record<string, string> = {
  hotspring: 'Hot Springs',
  campground: 'Campgrounds',
  hiking: 'Hiking',
  recreation: 'Recreation',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: '#27ae60',
  moderate: '#f39c12',
  challenging: '#c0392b',
};

function slugToName(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export default function BackroadsPlanner({
  corridors,
  townCoords,
  historicMarkers,
  historyTrails,
}: {
  corridors: Corridor[];
  townCoords: TownCoords;
  historicMarkers: HistoricMarker[];
  historyTrails: HistoryTrailMapData[];
}) {
  const router = useRouter();
  const mapRef = useRef<MapRef>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [trip, setTrip] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [poiFilter, setPoiFilter] = useState<string | null>(null);
  const [hoveredPoi, setHoveredPoi] = useState<POI | null>(null);
  const [mobileTab, setMobileTab] = useState<'corridors' | 'trip'>('corridors');
  const [showHistoricMarkers, setShowHistoricMarkers] = useState(false);
  const [selectedHistoricMarker, setSelectedHistoricMarker] = useState<HistoricMarker | null>(null);
  const [activeHistoryTrailId, setActiveHistoryTrailId] = useState<string | null>(null);

  const historyTrailById = useMemo(() => {
    const m: Record<string, HistoryTrailMapData> = {};
    historyTrails.forEach(t => { m[t.id] = t; });
    return m;
  }, [historyTrails]);

  const activeHistoryTrail = activeHistoryTrailId ? historyTrailById[activeHistoryTrailId] : null;

  // Restore trip + focus + history trail from URL on mount
  useEffect(() => {
    const routes = router.query.routes;
    if (typeof routes === 'string' && routes.length > 0) {
      const ids = routes.split(',').filter(id => corridors.some(c => c.id === id));
      if (ids.length > 0) setTrip(ids);
    }
    const trail = router.query.trail;
    if (typeof trail === 'string' && historyTrails.some(t => t.id === trail)) {
      setActiveHistoryTrailId(trail);
    } else {
      const focus = router.query.focus;
      if (typeof focus === 'string' && corridors.some(c => c.id === focus)) {
        setSelected(focus);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync trip / focus / trail to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (trip.length > 0) params.set('routes', trip.join(','));
    if (selected) params.set('focus', selected);
    if (activeHistoryTrailId) params.set('trail', activeHistoryTrailId);
    const qs = params.toString();
    const newUrl = qs ? `${router.pathname}?${qs}` : router.pathname;
    if (newUrl !== router.asPath) {
      router.replace(newUrl, undefined, { shallow: true });
    }
  }, [trip, selected, activeHistoryTrailId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fit map to active history trail (delayed so Map ref exists after first paint / deep link)
  useEffect(() => {
    if (!activeHistoryTrail || activeHistoryTrail.stops.length === 0) return;
    const pts = activeHistoryTrail.stops;
    let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
    pts.forEach(p => {
      if (p.lng < minLng) minLng = p.lng;
      if (p.lng > maxLng) maxLng = p.lng;
      if (p.lat < minLat) minLat = p.lat;
      if (p.lat > maxLat) maxLat = p.lat;
    });
    const padLng = Math.max(0.2, (maxLng - minLng) * 0.12);
    const padLat = Math.max(0.15, (maxLat - minLat) * 0.12);
    const bounds: [[number, number], [number, number]] = [
      [minLng - padLng, minLat - padLat],
      [maxLng + padLng, maxLat + padLat],
    ];
    const padding = { top: 60, bottom: 60, left: sidebarOpen ? 380 : 60, right: 60 };
    const run = () => {
      mapRef.current?.fitBounds(bounds, { duration: 1200, padding });
    };
    run();
    const t = window.setTimeout(run, 120);
    const t2 = window.setTimeout(run, 450);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(t2);
    };
  }, [activeHistoryTrail, sidebarOpen]);

  const corridorMap = useMemo(() => {
    const m: Record<string, Corridor> = {};
    corridors.forEach(c => { m[c.id] = c; });
    return m;
  }, [corridors]);

  const filtered = useMemo(() => {
    return corridors.filter(c => {
      if (difficultyFilter && c.difficulty !== difficultyFilter) return false;
      if (poiFilter && !c.pois.some(p => p.category === poiFilter)) return false;
      return true;
    });
  }, [corridors, difficultyFilter, poiFilter]);

  const geojsonLines = useMemo(() => ({
    type: 'FeatureCollection' as const,
    features: corridors.map(c => ({
      type: 'Feature' as const,
      properties: {
        id: c.id,
        name: c.name,
        color: c.color,
        isSelected: c.id === selected,
        inTrip: trip.includes(c.id),
        isFiltered: filtered.some(f => f.id === c.id),
        dim: activeHistoryTrailId ? 1 : 0,
      },
      geometry: {
        type: 'LineString' as const,
        coordinates: c.geometry.coordinates,
      },
    })),
  }), [corridors, selected, trip, filtered, activeHistoryTrailId]);

  const activeCorridor = selected ? corridorMap[selected] : null;

  const filteredPois = useMemo(() => {
    if (!activeCorridor) return [];
    return activeCorridor.pois.filter(p => !poiFilter || p.category === poiFilter);
  }, [activeCorridor, poiFilter]);

  const flyToCorridor = useCallback((c: Corridor) => {
    if (!mapRef.current) return;
    const coords = c.geometry.coordinates;
    let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
    coords.forEach(([lng, lat]) => {
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    });
    mapRef.current.fitBounds(
      [[minLng - 0.15, minLat - 0.1], [maxLng + 0.15, maxLat + 0.1]],
      { duration: 1200, padding: { top: 60, bottom: 60, left: sidebarOpen ? 380 : 60, right: 60 } }
    );
  }, [sidebarOpen]);

  const selectCorridor = useCallback((id: string) => {
    trackMapInteraction(`corridor_select:${id}`);
    setActiveHistoryTrailId(null);
    setSelected(id);
    const c = corridorMap[id];
    if (c) flyToCorridor(c);
  }, [corridorMap, flyToCorridor]);

  const selectHistoryTrail = useCallback((id: string) => {
    trackMapInteraction(`history_trail_map:${id}`);
    setSelected(null);
    setSelectedHistoricMarker(null);
    setHoveredPoi(null);
    setActiveHistoryTrailId(id);
  }, []);

  const addToTrip = useCallback((id: string) => {
    setTrip(prev => prev.includes(id) ? prev : [...prev, id]);
    trackMapInteraction(`trip_add:${id}`);
  }, []);

  const removeFromTrip = useCallback((id: string) => {
    setTrip(prev => prev.filter(t => t !== id));
  }, []);

  const tripStats = useMemo(() => {
    const routes = trip.map(id => corridorMap[id]).filter(Boolean);
    const totalMiles = routes.reduce((s, r) => s + r.distanceMiles, 0);
    const totalPois = routes.reduce((s, r) => s + r.pois.length, 0);
    return { totalMiles, totalPois, routes };
  }, [trip, corridorMap]);

  const resetView = useCallback(() => {
    mapRef.current?.flyTo({ center: [-109.5, 46.8], zoom: 5.5, duration: 1000 });
    setSelected(null);
    setActiveHistoryTrailId(null);
    setSelectedHistoricMarker(null);
  }, []);

  const historyTrailLineGeo = useMemo(() => {
    if (!activeHistoryTrail || activeHistoryTrail.lineSegments.length === 0) {
      return { type: 'FeatureCollection' as const, features: [] };
    }
    return {
      type: 'FeatureCollection' as const,
      features: activeHistoryTrail.lineSegments.map((coords, i) => ({
        type: 'Feature' as const,
        properties: { id: activeHistoryTrail!.id, seg: i },
        geometry: {
          type: 'LineString' as const,
          coordinates: coords,
        },
      })),
    };
  }, [activeHistoryTrail]);

  const lineLayer: LayerProps = {
    id: 'corridor-lines',
    type: 'line',
    paint: {
      'line-color': ['get', 'color'],
      'line-width': [
        'case',
        ['get', 'isSelected'], 5,
        ['get', 'inTrip'], 4,
        2.5,
      ],
      'line-opacity': [
        'case',
        ['get', 'isSelected'], 1,
        ['==', ['get', 'dim'], 1], 0.14,
        ['get', 'inTrip'], 0.9,
        ['get', 'isFiltered'], 0.6,
        0.15,
      ],
    },
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
  };

  const lineLayerCasing: LayerProps = {
    id: 'corridor-lines-casing',
    type: 'line',
    paint: {
      'line-color': '#fff',
      'line-width': [
        'case',
        ['get', 'isSelected'], 8,
        ['==', ['get', 'dim'], 1], 0,
        ['get', 'inTrip'], 7,
        0,
      ],
      'line-opacity': [
        'case',
        ['get', 'isSelected'], 0.8,
        ['==', ['get', 'dim'], 1], 0,
        ['get', 'inTrip'], 0.5,
        0,
      ],
    },
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
  };

  const historyTrailLineCasing: LayerProps = {
    id: 'history-trail-line-casing',
    type: 'line',
    paint: {
      'line-color': '#fff',
      'line-width': HISTORY_TRAIL_LINE_WIDTH + 5,
      'line-opacity': 0.45,
    },
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
  };

  const historyTrailLineLayer: LayerProps = {
    id: 'history-trail-line',
    type: 'line',
    paint: {
      'line-color': HISTORY_TRAIL_LINE_COLOR,
      'line-width': HISTORY_TRAIL_LINE_WIDTH,
      'line-opacity': 0.95,
    },
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
  };

  return (
    <>
      <Head>
        <link rel="canonical" href="https://treasurestate.com/planners/backroads-planner/" />
        <title>Montana Backroads Travel Planner — Interactive Scenic Route Map</title>
        <meta name="description" content="Plan your Montana backroads adventure with our interactive map. Explore 13 scenic corridors, discover hot springs, campgrounds, hiking trails, and chain routes for the ultimate road trip." />
        <meta property="og:title" content="Montana Backroads Travel Planner — Interactive Scenic Route Map" />
        <meta property="og:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <meta property="og:url" content="https://treasurestate.com/planners/backroads-planner/" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'TravelAction',
          name: 'Montana Backroads Travel Planner',
          description: 'Interactive scenic route planner for Montana backroads, covering 13 scenic corridors with 850+ points of interest.',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://treasurestate.com/planners/backroads-planner/',
          },
        })}} />
      </Head>

      <style dangerouslySetInnerHTML={{ __html: `
        .planner-wrap { display: flex; height: calc(100vh - 48px); overflow: hidden; position: relative; }
        .planner-sidebar {
          width: 380px; flex-shrink: 0; background: #1a1e2e; color: #e0e4ec;
          display: flex; flex-direction: column; overflow: hidden; z-index: 10;
          transition: margin-left 0.3s ease;
        }
        .planner-sidebar.collapsed { margin-left: -380px; }
        .sidebar-toggle {
          position: absolute; top: 12px; z-index: 20;
          background: #1a1e2e; color: #e0e4ec; border: none; padding: 8px 10px;
          border-radius: 0 8px 8px 0; cursor: pointer; font-size: 1.1rem;
          box-shadow: 2px 2px 8px rgba(0,0,0,0.3); transition: left 0.3s ease;
        }
        .sidebar-toggle.open { left: 380px; }
        .sidebar-toggle.closed { left: 0; }
        .sidebar-header { padding: 16px 18px 12px; border-bottom: 1px solid rgba(255,255,255,0.08); flex-shrink: 0; }
        .sidebar-header h1 { font-size: 1.15rem; margin: 0; color: #fff; font-weight: 700; letter-spacing: -0.3px; }
        .sidebar-header p { font-size: 0.78rem; margin: 6px 0 0; color: #8892a4; }
        .filter-bar { display: flex; gap: 6px; padding: 10px 18px; flex-wrap: wrap; border-bottom: 1px solid rgba(255,255,255,0.06); flex-shrink: 0; }
        .filter-chip {
          font-size: 0.72rem; padding: 4px 10px; border-radius: 20px; cursor: pointer; border: 1px solid rgba(255,255,255,0.15);
          background: transparent; color: #a0a8b8; transition: all 0.15s;
        }
        .filter-chip:hover { border-color: rgba(255,255,255,0.3); color: #d0d4dc; }
        .filter-chip.active { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.3); color: #fff; }
        .corridor-list { flex: 1; overflow-y: auto; padding: 8px 0; }
        .history-trails-details {
          margin: 4px 12px 10px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.04); flex-shrink: 0;
        }
        .history-trails-details summary {
          list-style: none; cursor: pointer; padding: 12px 14px; display: flex; align-items: center; gap: 10px;
          font-size: 0.92rem; font-weight: 600; color: #fff; user-select: none;
        }
        .history-trails-details summary::-webkit-details-marker { display: none; }
        .history-trails-chevron { font-size: 0.75rem; color: #8892a4; transition: transform 0.2s ease; margin-left: auto; }
        .history-trails-details[open] .history-trails-chevron { transform: rotate(90deg); }
        .history-trails-badge {
          font-size: 0.68rem; font-weight: 700; padding: 2px 8px; border-radius: 999px;
          background: rgba(59,130,246,0.25); color: #93c5fd;
        }
        .history-trails-body { padding: 0 8px 10px 14px; border-top: 1px solid rgba(255,255,255,0.06); }
        .history-trails-intro { font-size: 0.72rem; color: #8892a4; line-height: 1.45; margin: 10px 0 8px; padding-right: 6px; }
        .history-trail-active-bar {
          margin: 0 18px 10px; padding: 10px 12px; border-radius: 8px;
          background: rgba(201, 162, 39, 0.12); border: 1px solid rgba(201, 162, 39, 0.35);
          font-size: 0.78rem; color: #e8d9b0; display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px;
        }
        .history-trail-active-bar strong { color: #fff; font-weight: 600; }
        .history-trail-active-bar a { color: #93c5fd; text-decoration: none; font-weight: 600; font-size: 0.72rem; }
        .history-trail-active-bar a:hover { text-decoration: underline; }
        .history-trail-active-bar .trail-clear-btn {
          margin-left: auto; font-size: 0.72rem; padding: 4px 10px; border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.06); color: #c0c8d8; cursor: pointer;
        }
        .history-trail-active-bar .trail-clear-btn:hover { background: rgba(255,255,255,0.1); }
        .history-trails-row {
          display: flex; align-items: stretch; margin: 0 0 4px; border-radius: 8px;
          border: 1px solid transparent; overflow: hidden;
        }
        .history-trails-row.active { border-color: rgba(201, 162, 39, 0.45); background: rgba(201, 162, 39, 0.08); }
        .history-trails-map-btn {
          flex: 1; display: flex; align-items: baseline; justify-content: space-between; gap: 10px;
          padding: 8px 8px 8px 6px; margin: 0; border: none; border-radius: 8px 0 0 8px; cursor: pointer;
          background: transparent; text-align: left; color: #c8d0e0; font-size: 0.8rem; font-family: inherit;
        }
        .history-trails-map-btn:hover { background: rgba(255,255,255,0.06); color: #fff; }
        .history-trails-guide {
          display: flex; align-items: center; padding: 0 10px; font-size: 0.68rem; font-weight: 600; color: #6b9fff;
          text-decoration: none; white-space: nowrap; border-left: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.02);
        }
        .history-trails-guide:hover { color: #93c5fd; text-decoration: underline; }
        .history-trails-link-name { flex: 1; min-width: 0; line-height: 1.35; }
        .history-trails-meta { font-size: 0.68rem; color: #6b7890; white-space: nowrap; flex-shrink: 0; }
        .corridor-list::-webkit-scrollbar { width: 5px; }
        .corridor-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 3px; }
        .corridor-card {
          margin: 4px 12px; padding: 12px 14px; border-radius: 10px; cursor: pointer;
          border: 1px solid transparent; transition: all 0.15s;
        }
        .corridor-card:hover { background: rgba(255,255,255,0.04); }
        .corridor-card.selected { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.15); }
        .corridor-card-name { font-size: 0.92rem; font-weight: 600; display: flex; align-items: center; gap: 8px; }
        .corridor-card-meta { font-size: 0.74rem; color: #8892a4; margin-top: 4px; display: flex; gap: 12px; flex-wrap: wrap; }
        .corridor-card-desc { font-size: 0.78rem; color: #9aa0b0; margin-top: 6px; line-height: 1.4; }
        .corridor-card-actions { display: flex; gap: 8px; margin-top: 8px; }
        .action-btn {
          font-size: 0.72rem; padding: 4px 12px; border-radius: 6px; cursor: pointer; border: none; font-weight: 600; transition: all 0.15s;
        }
        .action-btn.primary { background: #3b82f6; color: #fff; }
        .action-btn.primary:hover { background: #2563eb; }
        .action-btn.secondary { background: rgba(255,255,255,0.08); color: #c0c8d8; }
        .action-btn.secondary:hover { background: rgba(255,255,255,0.14); }
        .action-btn.danger { background: rgba(239,68,68,0.15); color: #f87171; }

        .detail-panel { flex: 1; overflow-y: auto; padding: 0; }
        .detail-header { padding: 16px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .detail-back { font-size: 0.78rem; color: #6b7890; cursor: pointer; border: none; background: none; padding: 0; margin-bottom: 8px; }
        .detail-back:hover { color: #a0a8b8; }
        .detail-title { font-size: 1.1rem; font-weight: 700; color: #fff; margin: 0; }
        .detail-subtitle { font-size: 0.8rem; color: #8892a4; margin-top: 4px; }
        .detail-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 12px 18px; }
        .stat-box { background: rgba(255,255,255,0.04); padding: 10px; border-radius: 8px; }
        .stat-val { font-size: 1rem; font-weight: 700; color: #fff; }
        .stat-label { font-size: 0.7rem; color: #6b7890; margin-top: 2px; }
        .poi-section { padding: 12px 18px; }
        .poi-section h3 { font-size: 0.82rem; color: #8892a4; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.5px; }
        .poi-item {
          display: flex; align-items: center; gap: 8px; padding: 6px 0; font-size: 0.8rem; color: #c0c8d8;
          border-bottom: 1px solid rgba(255,255,255,0.04); cursor: pointer;
        }
        .poi-item:hover { color: #fff; }
        .poi-dist { font-size: 0.7rem; color: #6b7890; margin-left: auto; white-space: nowrap; }
        .connections-section { padding: 12px 18px; border-top: 1px solid rgba(255,255,255,0.06); }
        .connection-chip {
          display: inline-block; font-size: 0.74rem; padding: 4px 10px; margin: 3px 4px 3px 0;
          border-radius: 6px; background: rgba(255,255,255,0.06); color: #a0a8b8; cursor: pointer;
        }
        .connection-chip:hover { background: rgba(255,255,255,0.12); color: #fff; }

        .trip-panel { padding: 16px 18px; }
        .trip-panel h2 { font-size: 0.92rem; color: #fff; margin: 0 0 10px; }
        .trip-empty { font-size: 0.8rem; color: #6b7890; text-align: center; padding: 24px 0; }
        .trip-item { display: flex; align-items: center; gap: 8px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .trip-num { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; color: #fff; }
        .trip-item-name { font-size: 0.82rem; color: #e0e4ec; flex: 1; }
        .trip-item-miles { font-size: 0.72rem; color: #6b7890; }
        .trip-remove { background: none; border: none; color: #6b7890; cursor: pointer; font-size: 0.9rem; padding: 2px 6px; }
        .trip-remove:hover { color: #f87171; }
        .trip-total { padding: 12px 0 0; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 8px; display: flex; justify-content: space-between; align-items: center; }
        .trip-total-miles { font-size: 1rem; font-weight: 700; color: #fff; }
        .trip-total-label { font-size: 0.78rem; color: #6b7890; }

        .mobile-tabs { display: none; }

        @media (max-width: 768px) {
          .planner-sidebar { width: 100%; position: absolute; bottom: 0; left: 0; right: 0; top: auto; height: 55vh; border-radius: 16px 16px 0 0; margin-left: 0 !important; }
          .planner-sidebar.collapsed { transform: translateY(calc(100% - 48px)); }
          .sidebar-toggle { display: none; }
          .mobile-tabs {
            display: flex; gap: 0; border-bottom: 1px solid rgba(255,255,255,0.08); flex-shrink: 0;
          }
          .mobile-tab {
            flex: 1; text-align: center; padding: 10px; font-size: 0.8rem; font-weight: 600;
            color: #6b7890; background: none; border: none; cursor: pointer;
            border-bottom: 2px solid transparent;
          }
          .mobile-tab.active { color: #fff; border-bottom-color: #3b82f6; }
          .mobile-handle {
            width: 36px; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px;
            margin: 8px auto 4px; cursor: pointer;
          }
        }
      `}} />

      <Header />

      <div className="planner-wrap">
        <button
          className={`sidebar-toggle ${sidebarOpen ? 'open' : 'closed'}`}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {sidebarOpen ? '◀' : '▶'}
        </button>

        <aside className={`planner-sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
          <div className="mobile-handle" onClick={() => setSidebarOpen(!sidebarOpen)} />
          <div className="mobile-tabs">
            <button className={`mobile-tab ${mobileTab === 'corridors' ? 'active' : ''}`} onClick={() => setMobileTab('corridors')}>
              Routes
            </button>
            <button className={`mobile-tab ${mobileTab === 'trip' ? 'active' : ''}`} onClick={() => setMobileTab('trip')}>
              My Trip {trip.length > 0 && `(${trip.length})`}
            </button>
          </div>

          {(mobileTab === 'corridors' || typeof window === 'undefined' || window.innerWidth > 768) && !selected && (
            <>
              <div className="sidebar-header">
                <h1>Montana Backroads</h1>
                <p>{corridors.length} scenic corridors · 850+ points of interest</p>
                <Link href="/guides" style={{ display: 'inline-block', marginTop: '8px', fontSize: '0.72rem', color: '#6b9fff', textDecoration: 'none' }}>
                  Looking for travel guides? &rarr;
                </Link>
              </div>
              <div className="filter-bar">
                {['easy', 'moderate', 'challenging'].map(d => (
                  <button key={d} className={`filter-chip ${difficultyFilter === d ? 'active' : ''}`}
                    onClick={() => setDifficultyFilter(difficultyFilter === d ? null : d)}
                  >
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </button>
                ))}
                <span style={{ width: '100%', height: 0 }} />
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                  <button key={k} className={`filter-chip ${poiFilter === k ? 'active' : ''}`}
                    onClick={() => setPoiFilter(poiFilter === k ? null : k)}
                  >
                    {CATEGORY_ICONS[k]} {v}
                  </button>
                ))}
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#a0aab8', cursor: 'pointer', marginLeft: 'auto' }}>
                  <input
                    type="checkbox"
                    checked={showHistoricMarkers}
                    onChange={e => setShowHistoricMarkers(e.target.checked)}
                    style={{ accentColor: '#c0392b' }}
                  />
                  📜 Historic Markers ({historicMarkers.length})
                </label>
              </div>
              {activeHistoryTrail && (
                <div className="history-trail-active-bar">
                  <strong>{activeHistoryTrail.name}</strong>
                  <span style={{ color: '#8892a4' }}>{activeHistoryTrail.stops.length} stops · lines skip jumps over ~{HISTORY_TRAIL_MAX_EDGE_MILES} mi</span>
                  <Link href={`/guides/history-trails/${activeHistoryTrail.id}/`}>Trail guide →</Link>
                  <button
                    type="button"
                    className="trail-clear-btn"
                    onClick={() => {
                      setActiveHistoryTrailId(null);
                      setSelectedHistoricMarker(null);
                    }}
                  >
                    Clear trail
                  </button>
                </div>
              )}
              <div className="corridor-list">
                {historyTrails.length > 0 && (
                  <details className="history-trails-details">
                    <summary>
                      <span aria-hidden="true">📜</span>
                      <span>History trails &amp; routes</span>
                      <span className="history-trails-badge">{historyTrails.length}</span>
                      <span className="history-trails-chevron" aria-hidden="true">▸</span>
                    </summary>
                    <div className="history-trails-body">
                      <p className="history-trails-intro">
                        Click a trail to plot stops on the map. Lines connect nearby markers in a sensible order and omit very long gaps — they are not turn-by-turn driving routes. Which markers appear depends on our collection; many trails do not span the full width of Montana.
                      </p>
                      {historyTrails.map(t => (
                        <div
                          key={t.id}
                          className={`history-trails-row ${activeHistoryTrailId === t.id ? 'active' : ''}`}
                        >
                          <button
                            type="button"
                            className="history-trails-map-btn"
                            onClick={() => selectHistoryTrail(t.id)}
                          >
                            <span className="history-trails-link-name">{t.name}</span>
                            <span className="history-trails-meta">{t.stops.length} stops</span>
                          </button>
                          <Link
                            href={`/guides/history-trails/${t.id}/`}
                            className="history-trails-guide"
                            prefetch={false}
                            onClick={e => e.stopPropagation()}
                          >
                            Guide
                          </Link>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
                {filtered.map(c => (
                  <div key={c.id} className={`corridor-card ${selected === c.id ? 'selected' : ''}`} onClick={() => selectCorridor(c.id)}>
                    <div className="corridor-card-name">
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                      {c.name}
                    </div>
                    <div className="corridor-card-meta">
                      <span>{c.distanceMiles} mi</span>
                      <span style={{ color: DIFFICULTY_COLORS[c.difficulty] }}>{c.difficulty}</span>
                      <span>{c.highways.join(', ')}</span>
                    </div>
                    <div className="corridor-card-desc">{c.description}</div>
                    <div className="corridor-card-actions">
                      <button className="action-btn primary" onClick={(e) => { e.stopPropagation(); selectCorridor(c.id); }}>
                        Explore
                      </button>
                      {!trip.includes(c.id) ? (
                        <button className="action-btn secondary" onClick={(e) => { e.stopPropagation(); addToTrip(c.id); }}>
                          + Add to Trip
                        </button>
                      ) : (
                        <button className="action-btn danger" onClick={(e) => { e.stopPropagation(); removeFromTrip(c.id); }}>
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#6b7890', fontSize: '0.85rem' }}>
                    No corridors match your filters.
                    <br />
                    <button className="filter-chip" style={{ marginTop: '8px' }} onClick={() => { setDifficultyFilter(null); setPoiFilter(null); }}>
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {selected && activeCorridor && mobileTab === 'corridors' && (
            <div className="detail-panel">
              <div className="detail-header">
                <button className="detail-back" onClick={() => setSelected(null)}>← All Routes</button>
                <h2 className="detail-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: activeCorridor.color }} />
                  {activeCorridor.name}
                </h2>
                <div className="detail-subtitle">
                  {activeCorridor.highways.join(' / ')} · {slugToName(activeCorridor.startTown)} → {slugToName(activeCorridor.endTown)}
                </div>
              </div>

              <div className="detail-stats">
                <div className="stat-box">
                  <div className="stat-val">{activeCorridor.distanceMiles} mi</div>
                  <div className="stat-label">Distance</div>
                </div>
                <div className="stat-box">
                  <div className="stat-val" style={{ color: DIFFICULTY_COLORS[activeCorridor.difficulty] }}>
                    {activeCorridor.difficulty.charAt(0).toUpperCase() + activeCorridor.difficulty.slice(1)}
                  </div>
                  <div className="stat-label">Difficulty</div>
                </div>
                <div className="stat-box">
                  <div className="stat-val">{activeCorridor.elevationRange[0].toLocaleString()} – {activeCorridor.elevationRange[1].toLocaleString()}'</div>
                  <div className="stat-label">Elevation Range</div>
                </div>
                <div className="stat-box">
                  <div className="stat-val">{activeCorridor.season}</div>
                  <div className="stat-label">Season</div>
                </div>
              </div>

              <div style={{ padding: '8px 18px' }}>
                <p style={{ fontSize: '0.82rem', color: '#9aa0b0', lineHeight: 1.5, margin: 0 }}>
                  {activeCorridor.description}
                </p>
                <div className="corridor-card-actions" style={{ marginTop: '10px' }}>
                  {!trip.includes(activeCorridor.id) ? (
                    <button className="action-btn primary" onClick={() => addToTrip(activeCorridor.id)}>
                      + Add to My Trip
                    </button>
                  ) : (
                    <button className="action-btn danger" onClick={() => removeFromTrip(activeCorridor.id)}>
                      Remove from Trip
                    </button>
                  )}
                </div>
              </div>

              {activeCorridor.pois.length > 0 && (
                <div className="poi-section">
                  <h3>Nearby Points of Interest ({filteredPois.length})</h3>
                  <div className="filter-bar" style={{ padding: '0 0 8px' }}>
                    <button className={`filter-chip ${!poiFilter ? 'active' : ''}`} onClick={() => setPoiFilter(null)}>All</button>
                    {Object.entries(CATEGORY_LABELS).map(([k, v]) => {
                      const count = activeCorridor.pois.filter(p => p.category === k).length;
                      if (count === 0) return null;
                      return (
                        <button key={k} className={`filter-chip ${poiFilter === k ? 'active' : ''}`} onClick={() => setPoiFilter(poiFilter === k ? null : k)}>
                          {CATEGORY_ICONS[k]} {v} ({count})
                        </button>
                      );
                    })}
                  </div>
                  {filteredPois.slice(0, 30).map((p, i) => (
                    <div key={`${p.name}-${i}`} className="poi-item"
                      onMouseEnter={() => setHoveredPoi(p)}
                      onMouseLeave={() => setHoveredPoi(null)}
                      onClick={() => {
                        mapRef.current?.flyTo({ center: [p.lng, p.lat], zoom: 12, duration: 800 });
                        setHoveredPoi(p);
                      }}
                    >
                      <span>{CATEGORY_ICONS[p.category] || '📍'}</span>
                      <span>{p.name}</span>
                      {p.rating != null && <span style={{ fontSize: '0.72rem', color: '#d8973c' }}>★ {p.rating.toFixed(1)}</span>}
                      <span className="poi-dist">{p.distFromRoute.toFixed(1)} mi</span>
                    </div>
                  ))}
                  {filteredPois.length > 30 && (
                    <div style={{ fontSize: '0.75rem', color: '#6b7890', padding: '8px 0', textAlign: 'center' }}>
                      +{filteredPois.length - 30} more
                    </div>
                  )}
                </div>
              )}

              {activeCorridor.connections.length > 0 && (
                <div className="connections-section">
                  <h3 style={{ fontSize: '0.82rem', color: '#8892a4', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Connecting Routes
                  </h3>
                  {activeCorridor.connections.map(cId => {
                    const conn = corridorMap[cId];
                    if (!conn) return null;
                    return (
                      <span key={cId} className="connection-chip" onClick={() => selectCorridor(cId)}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: conn.color, display: 'inline-block', marginRight: 5 }} />
                        {conn.name}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {mobileTab === 'trip' && (
            <div className="trip-panel">
              <h2>My Trip</h2>
              {trip.length === 0 ? (
                <div className="trip-empty">
                  Click &ldquo;+ Add to Trip&rdquo; on any route to start building your adventure.
                </div>
              ) : (
                <>
                  {trip.map((id, i) => {
                    const c = corridorMap[id];
                    if (!c) return null;
                    return (
                      <div key={id} className="trip-item">
                        <div className="trip-num" style={{ background: c.color }}>{i + 1}</div>
                        <span className="trip-item-name" style={{ cursor: 'pointer' }} onClick={() => selectCorridor(id)}>
                          {c.name}
                        </span>
                        <span className="trip-item-miles">{c.distanceMiles} mi</span>
                        <button className="trip-remove" onClick={() => removeFromTrip(id)}>✕</button>
                      </div>
                    );
                  })}
                  <div className="trip-total">
                    <div>
                      <div className="trip-total-miles">{tripStats.totalMiles} miles</div>
                      <div className="trip-total-label">{tripStats.totalPois} points of interest</div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="action-btn primary" onClick={() => {
                        const url = `${window.location.origin}/planners/backroads-planner?routes=${trip.join(',')}`;
                        navigator.clipboard.writeText(url).then(() => {
                          const btn = document.getElementById('share-btn');
                          if (btn) { btn.textContent = 'Copied!'; setTimeout(() => { btn.textContent = 'Share Trip'; }, 2000); }
                        });
                      }}>
                        <span id="share-btn">Share Trip</span>
                      </button>
                      <button className="action-btn secondary" onClick={() => setTrip([])}>Clear</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </aside>

        {/* Map */}
        <div style={{ flex: 1, position: 'relative' }}>
          <MapGL
            ref={mapRef}
            initialViewState={{ longitude: -109.5, latitude: 46.8, zoom: 5.5 }}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/outdoors-v12"
            mapboxAccessToken={MAPBOX_TOKEN}
            onClick={(e) => {
              const features = e.target.queryRenderedFeatures(e.point, { layers: ['corridor-lines'] });
              if (features && features.length > 0) {
                const id = features[0].properties?.id;
                if (id) selectCorridor(id);
              } else {
                setHoveredPoi(null);
              }
            }}
            interactiveLayerIds={['corridor-lines']}
            cursor="pointer"
          >
            <NavigationControl position="top-right" />

            <Source id="corridors" type="geojson" data={geojsonLines}>
              <Layer {...lineLayerCasing} />
              <Layer {...lineLayer} />
            </Source>

            {historyTrailLineGeo.features.length > 0 && (
              <Source id="history-trail-line" type="geojson" data={historyTrailLineGeo}>
                <Layer {...historyTrailLineCasing} />
                <Layer {...historyTrailLineLayer} />
              </Source>
            )}

            {/* Start/end markers for selected corridor */}
            {activeCorridor && (() => {
              const coords = activeCorridor.geometry.coordinates;
              const startCoord = coords[0];
              const endCoord = coords[coords.length - 1];
              return (
                <>
                  <Marker longitude={startCoord[0]} latitude={startCoord[1]} anchor="center">
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%', background: activeCorridor.color,
                      border: '3px solid #fff', boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.55rem', color: '#fff', fontWeight: 700,
                    }}>S</div>
                  </Marker>
                  <Marker longitude={endCoord[0]} latitude={endCoord[1]} anchor="center">
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%', background: activeCorridor.color,
                      border: '3px solid #fff', boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.55rem', color: '#fff', fontWeight: 700,
                    }}>E</div>
                  </Marker>
                </>
              );
            })()}

            {/* POI markers for selected corridor */}
            {filteredPois.slice(0, 60).map((p, i) => (
              <Marker
                key={`poi-${p.name}-${i}`}
                longitude={p.lng}
                latitude={p.lat}
                anchor="center"
                onClick={(e) => { e.originalEvent.stopPropagation(); setHoveredPoi(p); }}
              >
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: p.category === 'hotspring' ? '#e74c3c' : p.category === 'campground' ? '#27ae60' : p.category === 'hiking' ? '#8e44ad' : '#3b6978',
                  border: '2px solid rgba(255,255,255,0.9)', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  cursor: 'pointer',
                }} />
              </Marker>
            ))}

            {/* History trail numbered stops */}
            {activeHistoryTrail && activeHistoryTrail.stops.map((m, idx) => (
              <Marker
                key={`htrail-${m.id}`}
                longitude={m.lng}
                latitude={m.lat}
                anchor="center"
                onClick={(e) => { e.originalEvent.stopPropagation(); setSelectedHistoricMarker(m); }}
              >
                <div style={{
                  minWidth: 22,
                  height: 22,
                  padding: '0 5px',
                  borderRadius: '50%',
                  background: HISTORY_TRAIL_LINE_COLOR,
                  border: '2px solid rgba(255,255,255,0.95)',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.35)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  color: '#1a1e2e',
                }}
                >
                  {idx + 1}
                </div>
              </Marker>
            ))}

            {/* Historic markers layer */}
            {showHistoricMarkers && historicMarkers.map(m => (
              <Marker
                key={`hist-${m.id}`}
                longitude={m.lng}
                latitude={m.lat}
                anchor="center"
                onClick={(e) => { e.originalEvent.stopPropagation(); setSelectedHistoricMarker(m); }}
              >
                <div style={{
                  width: 10, height: 10, borderRadius: '2px',
                  background: '#8b4513',
                  border: '2px solid rgba(255,255,255,0.9)', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  cursor: 'pointer', transform: 'rotate(45deg)',
                }} />
              </Marker>
            ))}

            {selectedHistoricMarker && (
              <Popup
                longitude={selectedHistoricMarker.lng}
                latitude={selectedHistoricMarker.lat}
                anchor="top"
                offset={10}
                onClose={() => setSelectedHistoricMarker(null)}
                closeButton={true}
                closeOnClick={false}
                maxWidth="500px"
              >
                <div
                  style={{
                    padding: '0.75rem',
                    maxWidth: 480,
                    maxHeight: 'min(78vh, 560px)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0,
                  }}
                >
                  <strong style={{ fontSize: '0.98rem', color: '#204051', display: 'block', marginBottom: '0.35rem', flexShrink: 0 }}>
                    {selectedHistoricMarker.title}
                  </strong>
                  {selectedHistoricMarker.town && (
                    <div style={{ fontSize: '0.76rem', color: '#888', marginBottom: '0.45rem', flexShrink: 0 }}>
                      📍 {selectedHistoricMarker.town}
                    </div>
                  )}
                  <div style={{ ...HISTORIC_MARKER_MAP_POPUP_SCROLL, flex: 1, minHeight: 0, marginBottom: '0.5rem' }}>
                    <MarkerInscription
                      text={selectedHistoricMarker.inscription}
                      variant="popup"
                    />
                  </div>
                  <div style={{ paddingTop: '0.55rem', borderTop: '1px solid #e8ede8', display: 'flex', gap: '1rem', flexWrap: 'wrap', flexShrink: 0 }}>
                    {selectedHistoricMarker.isCurated && (
                      <a
                        href={`/historic-markers/${selectedHistoricMarker.slug}/`}
                        style={{ fontSize: '0.82rem', color: '#27ae60', fontWeight: 600, textDecoration: 'none' }}
                      >
                        View full page →
                      </a>
                    )}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedHistoricMarker.lat},${selectedHistoricMarker.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.82rem', color: '#3b6978', fontWeight: 600, textDecoration: 'none' }}
                    >
                      Get directions
                    </a>
                  </div>
                </div>
              </Popup>
            )}

            {hoveredPoi && (
              <Popup
                longitude={hoveredPoi.lng}
                latitude={hoveredPoi.lat}
                anchor="bottom"
                offset={10}
                onClose={() => setHoveredPoi(null)}
                closeButton={true}
                closeOnClick={false}
                maxWidth="220px"
              >
                <div style={{ padding: '4px 2px' }}>
                  <strong style={{ fontSize: '0.85rem', color: '#204051' }}>{hoveredPoi.name}</strong>
                  <div style={{ fontSize: '0.72rem', color: '#888', marginTop: '2px' }}>
                    {CATEGORY_ICONS[hoveredPoi.category]} {CATEGORY_LABELS[hoveredPoi.category] || hoveredPoi.type}
                  </div>
                  {hoveredPoi.rating != null && (
                    <div style={{ fontSize: '0.75rem', color: '#d8973c', marginTop: '2px' }}>
                      ★ {hoveredPoi.rating.toFixed(1)} {hoveredPoi.reviews ? `(${hoveredPoi.reviews.toLocaleString()})` : ''}
                    </div>
                  )}
                  <div style={{ fontSize: '0.72rem', color: '#6b7890', marginTop: '2px' }}>
                    {hoveredPoi.distFromRoute.toFixed(1)} mi from route
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${hoveredPoi.lat},${hoveredPoi.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.75rem', color: '#3b6978', fontWeight: 600, textDecoration: 'none', marginTop: '4px', display: 'inline-block' }}
                  >
                    Directions →
                  </a>
                </div>
              </Popup>
            )}
          </MapGL>

          {/* Map overlay: reset button */}
          <button
            onClick={resetView}
            style={{
              position: 'absolute', bottom: 24, right: 16, background: '#1a1e2e', color: '#e0e4ec',
              border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '0.78rem',
              cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.3)', fontWeight: 600,
            }}
          >
            Show All Routes
          </button>

          {/* Trip summary overlay */}
          {trip.length > 0 && (
            <div style={{
              position: 'absolute', bottom: 24, left: 16, background: '#1a1e2e', color: '#e0e4ec',
              padding: '10px 16px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
              fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '12px',
            }}>
              <div>
                <strong>{trip.length} route{trip.length > 1 ? 's' : ''}</strong>
                <span style={{ color: '#6b7890', marginLeft: '8px' }}>{tripStats.totalMiles} mi</span>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {trip.map(id => {
                  const c = corridorMap[id];
                  return c ? <span key={id} style={{ width: 10, height: 10, borderRadius: '50%', background: c.color }} /> : null;
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const fs = await import('fs');
  const path = await import('path');

  const corridorsPath = path.join(process.cwd(), 'data', 'corridors.json');
  const raw: Corridor[] = JSON.parse(fs.readFileSync(corridorsPath, 'utf-8'));

  const round = (n: number, d: number) => Math.round(n * 10 ** d) / 10 ** d;

  const corridors = raw.map(c => ({
    ...c,
    geometry: {
      type: c.geometry.type,
      coordinates: c.geometry.coordinates.map(([lng, lat]) => [round(lng, 3), round(lat, 3)]),
    },
    pois: c.pois.slice(0, 40).map(p => ({
      name: p.name,
      category: p.category,
      lat: round(p.lat, 4),
      lng: round(p.lng, 4),
      distFromRoute: round(p.distFromRoute, 1),
      rating: p.rating != null ? round(p.rating, 1) : null,
      reviews: p.reviews || null,
      type: p.type,
    })),
  }));

  const townCoordsPath = path.join(process.cwd(), 'data', 'town-coordinates.json');
  const townCoords: TownCoords = JSON.parse(fs.readFileSync(townCoordsPath, 'utf-8'));

  // Load historic markers (limited subset for performance)
  const markersPath = path.join(process.cwd(), 'data', 'historic-markers.json');
  const curatedPath = path.join(process.cwd(), 'data', 'historic-markers-curated.json');
  let historicMarkers: HistoricMarker[] = [];
  if (fs.existsSync(markersPath)) {
    const allMarkers = JSON.parse(fs.readFileSync(markersPath, 'utf-8'));
    const curatedSlugs = new Set(
      fs.existsSync(curatedPath)
        ? JSON.parse(fs.readFileSync(curatedPath, 'utf-8')).map((m: { slug: string }) => m.slug)
        : []
    );
    // Take a sample for performance (every 3rd marker to get ~750)
    historicMarkers = allMarkers
      .filter((_: unknown, i: number) => i % 3 === 0)
      .map((m: { id: string; slug: string; title: string; lat: number; lng: number; town: string | null; inscription: string }) => ({
        id: m.id,
        slug: m.slug,
        title: m.title,
        lat: round(m.lat, 4),
        lng: round(m.lng, 4),
        town: m.town,
        inscription: m.inscription,
        isCurated: curatedSlugs.has(m.slug),
      }));
  }

  const trailsPath = path.join(process.cwd(), 'data', 'history-trails.json');
  let historyTrails: HistoryTrailMapData[] = [];
  if (fs.existsSync(trailsPath) && fs.existsSync(markersPath)) {
    const rawTrails = JSON.parse(fs.readFileSync(trailsPath, 'utf-8')) as Array<{
      id: string;
      name: string;
      markerCount: number;
      markerIds: string[];
    }>;
    const allMarkersRaw = JSON.parse(fs.readFileSync(markersPath, 'utf-8')) as Array<{
      id: string;
      slug: string;
      title: string;
      lat: number;
      lng: number;
      town: string | null;
      inscription: string;
    }>;
    const idLookup = new Map(allMarkersRaw.map(m => [m.id, m]));
    const curatedSlugsForTrail = new Set(
      fs.existsSync(curatedPath)
        ? JSON.parse(fs.readFileSync(curatedPath, 'utf-8')).map((m: { slug: string }) => m.slug)
        : []
    );
    historyTrails = [...rawTrails]
      .map((t): HistoryTrailMapData => {
        const rawStops: HistoricMarker[] = [];
        for (const mid of t.markerIds) {
          const raw = idLookup.get(mid);
          if (!raw) continue;
          const inscription = raw.inscription;
          rawStops.push({
            id: raw.id,
            slug: raw.slug,
            title: raw.title,
            lat: round(raw.lat, 4),
            lng: round(raw.lng, 4),
            town: raw.town,
            inscription,
            isCurated: curatedSlugsForTrail.has(raw.slug),
          });
        }
        const stops = orderStopsNearestNeighborFromEast(rawStops);
        const lineSegments = buildLineSegmentsLngLat(stops, HISTORY_TRAIL_MAX_EDGE_MILES);
        return {
          id: t.id,
          name: t.name,
          markerCount: t.markerCount,
          lineSegments,
          stops,
        };
      })
      .filter(t => t.stops.length > 0)
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  }

  return { props: { corridors, townCoords, historicMarkers, historyTrails } };
};
