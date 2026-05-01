import Head from 'next/head';
import { useRouter } from 'next/router';
import { GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import Header from '../../components/Header';
import SiteSearchWithHistory from '../../components/SiteSearchWithHistory';
import AppInstallCTA from '../../components/AppInstallCTA';
import { trackMapInteraction } from '../../lib/gtag';
import {
  orderStopsNearestNeighborFromEast,
} from '../../lib/historyTrailMapOrder';
import type {
  Corridor, CorridorPOI, HistoricMarker, HistoryTrailMapData,
  HistoryTrailStopItem, ItineraryPOI, MapHoverPoint, POI,
} from '../../components/trip-builder/types';
import { POI_LAYER_CATEGORIES } from '../../components/trip-builder/types';
import type { UnifiedMapHandle } from '../../components/trip-builder/UnifiedMap';
import { usePlannerData } from '../../components/trip-builder/usePlannerData';
import { usePlannerItinerary } from '../../components/trip-builder/usePlannerItinerary';
import { usePlannerUrlState, PlannerMode } from '../../components/trip-builder/usePlannerUrlState';
import type { MutableRefObject } from 'react';

const UnifiedMap = dynamic(() => import('../../components/trip-builder/UnifiedMap'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#111827' }}>
      <span style={{ color: '#6b7890' }}>Loading map...</span>
    </div>
  ),
});

const UnifiedSidebar = dynamic(() => import('../../components/trip-builder/UnifiedSidebar'), {
  ssr: false,
});

type TownCoords = Record<string, { name: string; lat: number; lng: number }>;

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
  const mapRef = useRef<UnifiedMapHandle | null>(null) as MutableRefObject<UnifiedMapHandle | null>;

  // --- Corridor / explore state ---
  const [selected, setSelected] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [poiFilter, setPoiFilter] = useState<string | null>(null);
  const [hoveredMapPoint, setHoveredMapPoint] = useState<MapHoverPoint | null>(null);
  const [selectedMapPoint, setSelectedMapPoint] = useState<MapHoverPoint | null>(null);
  const [showHistoricMarkers, setShowHistoricMarkers] = useState(false);
  const [selectedHistoricMarker, setSelectedHistoricMarker] = useState<HistoricMarker | null>(null);
  const [activeHistoryTrailId, setActiveHistoryTrailId] = useState<string | null>(null);
  const [historyTrailStopIds, setHistoryTrailStopIds] = useState<string[] | null>(null);
  const [activeMode, setActiveMode] = useState<PlannerMode>('scenic');
  const [routeAlertsOpen, setRouteAlertsOpen] = useState(false);

  // --- Trip builder state ---
  const [showSupabasePois, setShowSupabasePois] = useState(false);
  const [supabasePoiCategories, setSupabasePoiCategories] = useState<string[]>(Object.keys(POI_LAYER_CATEGORIES));
  const [selectedSupabasePoi, setSelectedSupabasePoi] = useState<POI | null>(null);

  const {
    cities,
    allPOIs,
    visibleSupabasePois,
    supabaseReady,
    supabaseStatus,
    supabaseError,
  } = usePlannerData({
    corridors,
    townCoords,
    showSupabasePois,
    supabasePoiCategories,
  });

  const {
    itinerary,
    setItinerary,
    selectedCities,
    setSelectedCities,
    selectedActivityTypes,
    setSelectedActivityTypes,
  } = usePlannerItinerary({ cities, allPOIs });

  // --- Derived state ---
  const historyTrailById = useMemo(() => {
    const m: Record<string, HistoryTrailMapData> = {};
    historyTrails.forEach((t) => { m[t.id] = t; });
    return m;
  }, [historyTrails]);

  const canonicalActiveHistoryTrail = activeHistoryTrailId ? historyTrailById[activeHistoryTrailId] : null;

  const activeHistoryStops = useMemo(() => {
    if (!canonicalActiveHistoryTrail) return [];
    if (!historyTrailStopIds) return canonicalActiveHistoryTrail.stops;
    const byId = new Map(canonicalActiveHistoryTrail.stops.map((stop) => [stop.id, stop]));
    return historyTrailStopIds.map((id) => byId.get(id)).filter((stop): stop is HistoricMarker => Boolean(stop));
  }, [canonicalActiveHistoryTrail, historyTrailStopIds]);

  const activeHistoryTrail = useMemo<HistoryTrailMapData | null>(() => {
    if (!canonicalActiveHistoryTrail) return null;
    return {
      ...canonicalActiveHistoryTrail,
      stops: activeHistoryStops,
      lineSegments: historyTrailStopIds || itinerary.length > 0 ? [] : canonicalActiveHistoryTrail.lineSegments,
    };
  }, [canonicalActiveHistoryTrail, activeHistoryStops, historyTrailStopIds, itinerary.length]);

  const historyRouteStops = useMemo<HistoryTrailStopItem[]>(() => activeHistoryStops.map((stop) => ({
    id: stop.id,
    name: stop.title,
    description: stop.town || undefined,
    lat: stop.lat,
    lon: stop.lng,
    type: 'Historic marker',
    category: 'history',
    itemType: 'activity',
    enabled: true,
    markerSlug: stop.slug,
    markerTown: stop.town,
  })), [activeHistoryStops]);

  const isHistoryTrailCustomized = Boolean(activeHistoryTrailId && historyTrailStopIds);
  const activeHistoryStopIds = useMemo(() => activeHistoryStops.map((stop) => stop.id), [activeHistoryStops]);

  const corridorMap = useMemo(() => {
    const m: Record<string, Corridor> = {};
    corridors.forEach((c) => { m[c.id] = c; });
    return m;
  }, [corridors]);

  const filteredCorridors = useMemo(
    () => corridors.filter((c) => {
      if (difficultyFilter && c.difficulty !== difficultyFilter) return false;
      if (poiFilter && !c.pois.some((p) => p.category === poiFilter)) return false;
      return true;
    }),
    [corridors, difficultyFilter, poiFilter],
  );

  const filteredCorridorIds = useMemo(() => filteredCorridors.map((c) => c.id), [filteredCorridors]);

  const activeCorridor = selected ? corridorMap[selected] : null;

  const filteredPois = useMemo(() => {
    if (!activeCorridor) return [];
    return activeCorridor.pois.filter((p) => !poiFilter || p.category === poiFilter);
  }, [activeCorridor, poiFilter]);

  const availablePopupStops = useMemo<ItineraryPOI[]>(() => {
    const markerStops = historicMarkers.map((marker) => ({
      id: `marker:${marker.id}`,
      name: marker.title,
      description: marker.town || undefined,
      lat: marker.lat,
      lon: marker.lng,
      type: 'Historic marker',
      category: 'history',
      itemType: 'activity' as const,
      enabled: true,
      source: 'manual' as const,
    }));
    const supabaseStops = allPOIs.map((poi) => ({
      ...poi,
      id: `poi:${poi.id}`,
      itemType: 'activity' as const,
      enabled: true,
      source: 'manual' as const,
    }));
    const corridorStops = corridors.flatMap((corridor) => corridor.pois.map((poi) => ({
      id: `corridor-poi:${poi.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${poi.lat.toFixed(4)}-${poi.lng.toFixed(4)}`,
      name: poi.name,
      description: `${corridor.name}${poi.distFromRoute ? ` · ${poi.distFromRoute.toFixed(1)} mi from route` : ''}`,
      lat: poi.lat,
      lon: poi.lng,
      type: poi.type,
      category: poi.category,
      rating: poi.rating ?? undefined,
      reviews: poi.reviews ?? undefined,
      itemType: 'activity' as const,
      enabled: true,
      source: 'manual' as const,
    })));
    const byId = new Map<string, ItineraryPOI>();
    [...markerStops, ...supabaseStops, ...corridorStops].forEach((stop) => {
      if (!byId.has(stop.id)) byId.set(stop.id, stop);
    });
    return Array.from(byId.values());
  }, [allPOIs, corridors, historicMarkers]);

  const historyRouteWithManualStops = useMemo(
    () => [...historyRouteStops, ...itinerary.filter((item) => item.enabled !== false)],
    [historyRouteStops, itinerary],
  );
  const shouldUseHistoryRouteStops = Boolean(activeHistoryTrail && (isHistoryTrailCustomized || itinerary.length > 0));

  const addHistoryTrailStop = useCallback((id: string) => {
    if (!canonicalActiveHistoryTrail) return;
    setHistoryTrailStopIds((prev) => {
      const current = prev || canonicalActiveHistoryTrail.stops.map((stop) => stop.id);
      return current.includes(id) ? current : [...current, id];
    });
  }, [canonicalActiveHistoryTrail]);

  const removeHistoryTrailStop = useCallback((id: string) => {
    if (!canonicalActiveHistoryTrail) return;
    setHistoryTrailStopIds((prev) => {
      const current = prev || canonicalActiveHistoryTrail.stops.map((stop) => stop.id);
      return current.filter((stopId) => stopId !== id);
    });
  }, [canonicalActiveHistoryTrail]);

  const handleSupabasePoiClick = useCallback((p: POI) => {
    setSelectedSupabasePoi(p);
    setSelectedHistoricMarker(null);
    setSelectedMapPoint(null);
    setHoveredMapPoint(null);
  }, []);
  const closeSupabasePoiPopup = useCallback(() => setSelectedSupabasePoi(null), []);

  usePlannerUrlState({
    router,
    corridors,
    historyTrails,
    activeMode,
    setActiveMode,
    selected,
    setSelected,
    activeHistoryTrailId,
    setActiveHistoryTrailId,
    historyTrailStopIds,
    setHistoryTrailStopIds,
    difficultyFilter,
    setDifficultyFilter,
    poiFilter,
    setPoiFilter,
    showHistoricMarkers,
    setShowHistoricMarkers,
    showSupabasePois,
    setShowSupabasePois,
    supabasePoiCategories,
    setSupabasePoiCategories,
    selectedCities,
    setSelectedCities,
    selectedActivityTypes,
    setSelectedActivityTypes,
    itinerary,
    setItinerary,
    availableTripStops: availablePopupStops,
  });

  // --- Fit map to history trail ---
  useEffect(() => {
    if (!activeHistoryTrail || activeHistoryStops.length === 0) return;
    const pts = activeHistoryStops;
    let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
    pts.forEach((p) => {
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
    const run = () => mapRef.current?.fitBounds(bounds, { duration: 1200, padding });
    run();
    const t = setTimeout(run, 120);
    const t2 = setTimeout(run, 450);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [activeHistoryTrail, activeHistoryStops, sidebarOpen]);

  // --- Corridor actions ---
  const flyToCorridor = useCallback((c: Corridor) => {
    const coords = c.geometry.coordinates;
    let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
    coords.forEach(([lng, lat]) => {
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    });
    mapRef.current?.fitBounds(
      [[minLng - 0.15, minLat - 0.1], [maxLng + 0.15, maxLat + 0.1]],
      { duration: 1200, padding: { top: 60, bottom: 60, left: sidebarOpen ? 380 : 60, right: 60 } },
    );
  }, [sidebarOpen]);

  const selectCorridor = useCallback((id: string) => {
    trackMapInteraction(`corridor_select:${id}`);
    setActiveHistoryTrailId(null);
    setHistoryTrailStopIds(null);
    setSelectedMapPoint(null);
    setSelectedHistoricMarker(null);
    setSelectedSupabasePoi(null);
    setSelected(id);
    const c = corridorMap[id];
    if (c) flyToCorridor(c);
  }, [corridorMap, flyToCorridor]);

  const selectHistoryTrail = useCallback((id: string) => {
    trackMapInteraction(`history_trail_map:${id}`);
    setSelected(null);
    setSelectedHistoricMarker(null);
    setHoveredMapPoint(null);
    setActiveHistoryTrailId((current) => {
      if (current !== id) setHistoryTrailStopIds(null);
      return id;
    });
    setSelectedMapPoint(null);
    setSelectedSupabasePoi(null);
  }, []);

  const resetView = useCallback(() => {
    mapRef.current?.flyTo({ center: [-109.5, 46.8], zoom: 5.5, duration: 1000 });
    setSelected(null);
    setActiveHistoryTrailId(null);
    setHistoryTrailStopIds(null);
    setSelectedHistoricMarker(null);
  }, []);

  const handlePoiFlyTo = useCallback((poi: CorridorPOI) => {
    mapRef.current?.flyTo({ center: [poi.lng, poi.lat], zoom: 12, duration: 800 });
    setHoveredMapPoint(null);
  }, []);

  const deselectCorridor = useCallback(() => setSelected(null), []);
  const clearHistoryTrail = useCallback(() => {
    setActiveHistoryTrailId(null);
    setHistoryTrailStopIds(null);
    setSelectedHistoricMarker(null);
  }, []);
  const toggleSidebar = useCallback(() => setSidebarOpen((o) => !o), []);
  const handleHistoricMarkerClick = useCallback((m: HistoricMarker) => {
    setSelectedHistoricMarker(m);
    setSelectedMapPoint(null);
    setSelectedSupabasePoi(null);
    setHoveredMapPoint(null);
  }, []);
  const handleMapPointSelect = useCallback((point: MapHoverPoint) => {
    setSelectedMapPoint(point);
    setSelectedHistoricMarker(null);
    setSelectedSupabasePoi(null);
    setHoveredMapPoint(null);
  }, []);
  const handlePoiClick = useCallback((p: CorridorPOI) => {
    handleMapPointSelect({
      id: `corridor-poi:${p.name}:${p.lat}:${p.lng}`,
      name: p.name,
      lat: p.lat,
      lng: p.lng,
      type: p.type,
      category: p.category,
      description: `${p.distFromRoute.toFixed(1)} mi from route`,
      rating: p.rating,
      reviews: p.reviews,
    });
  }, [handleMapPointSelect]);
  const closeHistoricMarkerPopup = useCallback(() => setSelectedHistoricMarker(null), []);
  const closePoiPopup = useCallback(() => {
    setSelectedMapPoint(null);
    setHoveredMapPoint(null);
  }, []);

  const enabledItinerary = useMemo(
    () => itinerary.filter((i) => i.itemType === 'city' || i.enabled !== false),
    [itinerary],
  );

  return (
    <>
      <Head>
        <link rel="canonical" href="https://treasurestate.com/planners/backroads-planner/" />
        <title>Montana Backroads &amp; Trip Planner — Interactive Scenic Route Map</title>
        <meta name="description" content="Plan your Montana adventure with our unified trip planner. Explore 13 scenic corridors, build city-to-city road trips, discover hot springs, campgrounds, hiking trails, and get real driving routes with 3D terrain." />
        <meta property="og:title" content="Montana Backroads & Trip Planner — Interactive Scenic Route Map" />
        <meta property="og:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <meta property="og:url" content="https://treasurestate.com/planners/backroads-planner/" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'TravelAction',
          name: 'Montana Backroads & Trip Planner',
          description: 'Interactive scenic route planner and trip builder for Montana, covering 13 scenic corridors with 850+ points of interest and city-to-city road trip routing.',
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
        .preset-section { padding: 14px 14px 10px; border-bottom: 1px solid rgba(255,255,255,0.08); flex-shrink: 0; }
        .section-kicker { font-size: 0.72rem; color: #6b7890; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 8px; }
        .preset-grid { display: grid; grid-template-columns: 1fr; gap: 8px; }
        .preset-card {
          text-align: left; padding: 10px 11px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04); color: #c0c8d8; cursor: pointer;
        }
        .preset-card.active { border-color: rgba(96,165,250,0.75); background: rgba(59,130,246,0.18); color: #fff; }
        .preset-card span { display: block; font-size: 0.82rem; font-weight: 800; }
        .preset-card small { display: block; margin-top: 4px; font-size: 0.69rem; line-height: 1.35; color: #8fa0bb; }
        .preset-card.active small { color: #b8d4ff; }
        .planner-main { flex: 1; overflow-y: auto; }
        .planner-main::-webkit-scrollbar { width: 5px; }
        .planner-main::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 3px; }
        .planner-panel { min-height: 100%; padding-bottom: 16px; }
        .panel-block { padding: 12px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .panel-block.subtle { background: rgba(255,255,255,0.02); }
        .planner-select-label { display: grid; gap: 7px; font-size: 0.78rem; font-weight: 700; color: #c0c8d8; }
        .planner-select {
          width: 100%; min-width: 0; border: 1px solid rgba(255,255,255,0.14); border-radius: 8px;
          background: #111827; color: #e0e4ec; padding: 8px 10px; font: inherit; outline: none;
        }
        .planner-select:focus { border-color: rgba(96,165,250,0.75); box-shadow: 0 0 0 2px rgba(59,130,246,0.18); }
        .route-detail { padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .route-detail h2 { display: flex; align-items: center; gap: 8px; font-size: 1.05rem; color: #fff; margin: 0 0 8px; }
        .route-detail h2 span { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
        .route-detail p { color: #9aa0b0; font-size: 0.82rem; line-height: 1.5; margin: 0 0 8px; }
        .route-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
        .route-stats-line { display: flex; gap: 14px; flex-wrap: wrap; padding: 12px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); color: #8892a4; font-size: 0.8rem; }
        .route-stats-line strong { color: #fff; }
        .route-message { padding: 10px 18px; color: #fbbf24; font-size: 0.76rem; line-height: 1.45; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .planner-empty { padding: 24px 18px; color: #6b7890; font-size: 0.84rem; line-height: 1.5; text-align: center; }
        .checkbox-row { display: flex; align-items: center; gap: 8px; color: #a0aab8; font-size: 0.8rem; cursor: pointer; }
        .city-list { display: grid; gap: 7px; margin: 8px 0 10px; }
        .city-row { display: grid; grid-template-columns: 24px minmax(0, 1fr) 28px; align-items: center; gap: 8px; }
        .city-row > span {
          width: 22px; height: 22px; border-radius: 999px; background: #3b82f6; color: #fff;
          display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 800;
        }
        .city-row button, .stop-list button {
          border: none; border-radius: 6px; background: rgba(255,255,255,0.08); color: #c0c8d8;
          cursor: pointer; font-size: 0.72rem; padding: 5px 7px;
        }
        .stop-list { list-style: none; margin: 0; padding: 8px 18px 16px; display: grid; gap: 6px; }
        .stop-list li {
          display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 8px;
          padding: 8px 8px; border-bottom: 1px solid rgba(255,255,255,0.05); color: #c0c8d8; font-size: 0.8rem;
          border-radius: 8px; cursor: pointer;
        }
        .stop-list li:hover { background: rgba(255,255,255,0.05); color: #fff; }
        .stop-list li.selected {
          background: rgba(59,130,246,0.18); border-color: rgba(96,165,250,0.45);
          box-shadow: inset 3px 0 0 #60a5fa; color: #fff;
        }
        .stop-list li.disabled { opacity: 0.5; }
        .stop-list strong { color: #e0e4ec; font-size: 0.82rem; }
        .stop-list span { color: #6b7890; font-size: 0.72rem; }
        .filter-bar { display: flex; gap: 6px; padding: 10px 18px; flex-wrap: wrap; border-bottom: 1px solid rgba(255,255,255,0.06); flex-shrink: 0; }
        .filter-bar.compact { padding: 0; border-bottom: 0; margin-top: 8px; }
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
          position: relative; margin: 0 18px 8px; padding: 10px 40px 10px 12px; border-radius: 8px;
          background: rgba(201, 162, 39, 0.12); border: 1px solid rgba(201, 162, 39, 0.35);
          font-size: 0.78rem; color: #e8d9b0;
        }
        .history-trail-active-bar strong { color: #fff; font-weight: 700; display: block; line-height: 1.25; }
        .history-trail-active-meta { color: #9aa4b7; margin-top: 4px; line-height: 1.35; }
        .history-trail-active-actions { display: flex; align-items: center; gap: 8px; margin-top: 8px; flex-wrap: wrap; }
        a.trail-guide-btn {
          display: inline-flex; align-items: center; justify-content: center; border-radius: 7px; padding: 5px 10px;
          color: #dbeafe; text-decoration: none; font-weight: 800; font-size: 0.72rem;
          background: rgba(59,130,246,0.18); border: 1px solid rgba(96,165,250,0.42);
        }
        a.trail-guide-btn:hover { background: rgba(59,130,246,0.28); border-color: rgba(147,197,253,0.62); }
        .trail-clear-btn {
          position: absolute; top: 8px; right: 8px; width: 24px; height: 24px; padding: 0; border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.18); background: rgba(255,255,255,0.06); color: #c0c8d8;
          cursor: pointer; font-size: 0.92rem; line-height: 1;
        }
        .trail-clear-btn:hover { background: rgba(255,255,255,0.1); }
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
          display: flex; align-items: center; gap: 8px; padding: 7px 8px; font-size: 0.8rem; color: #c0c8d8;
          border: none; border-bottom: 1px solid rgba(255,255,255,0.04); border-radius: 8px;
          cursor: pointer; background: none; width: 100%; text-align: left;
        }
        .poi-item strong { flex: 1; font-size: 0.8rem; font-weight: 600; }
        .poi-item em { color: #d8973c; font-style: normal; font-size: 0.72rem; }
        .poi-item small { color: #6b7890; white-space: nowrap; }
        .poi-item:hover { color: #fff; }
        .poi-item.selected {
          background: rgba(59,130,246,0.18); box-shadow: inset 3px 0 0 #60a5fa;
          color: #fff;
        }
        .poi-dist { font-size: 0.7rem; color: #6b7890; margin-left: auto; white-space: nowrap; }
        .connections-section { padding: 12px 18px; border-top: 1px solid rgba(255,255,255,0.06); }
        .connection-chip {
          display: inline-block; font-size: 0.74rem; padding: 4px 10px; margin: 3px 4px 3px 0;
          border-radius: 6px; background: rgba(255,255,255,0.06); color: #a0a8b8; cursor: pointer;
        }
        .connection-chip:hover { background: rgba(255,255,255,0.12); color: #fff; }
        .trip-item { display: flex; align-items: center; gap: 8px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .trip-num { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; color: #fff; }
        .trip-item-name { font-size: 0.82rem; color: #e0e4ec; flex: 1; }
        .trip-item-miles { font-size: 0.72rem; color: #6b7890; }
        .trip-remove { background: none; border: none; color: #6b7890; cursor: pointer; font-size: 0.9rem; padding: 2px 6px; }
        .trip-remove:hover { color: #f87171; }
        .mobile-handle {
          width: 36px; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px;
          margin: 8px auto 4px; cursor: pointer; display: none;
        }
        .route-alerts-control {
          position: absolute; top: 16px; left: 54px; z-index: 6;
          display: flex; flex-direction: column; align-items: flex-start; gap: 8px;
        }
        .route-alerts-button {
          display: inline-flex; align-items: center; gap: 7px; border: 1px solid rgba(255,255,255,0.18);
          border-radius: 999px; padding: 8px 12px; background: rgba(26,30,46,0.9); color: #fff;
          font-size: 0.78rem; font-weight: 800; cursor: pointer; box-shadow: 0 2px 12px rgba(0,0,0,0.28);
          backdrop-filter: blur(10px);
        }
        .route-alerts-button:hover { background: rgba(37,44,66,0.95); border-color: rgba(255,255,255,0.28); }
        .route-alerts-popover {
          width: min(320px, calc(100vw - 36px)); border-radius: 14px; background: rgba(17,24,39,0.96);
          color: #e5e7eb; border: 1px solid rgba(255,255,255,0.14); box-shadow: 0 14px 32px rgba(0,0,0,0.36);
          padding: 14px; backdrop-filter: blur(14px);
        }
        .route-alerts-popover-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
        .route-alerts-popover h2 { margin: 0; font-size: 0.98rem; color: #fff; letter-spacing: -0.01em; }
        .route-alerts-popover p { margin: 7px 0 0; color: #aab4c5; font-size: 0.8rem; line-height: 1.45; }
        .route-alerts-close { border: none; background: rgba(255,255,255,0.08); color: #cbd5e1; cursor: pointer; border-radius: 999px; width: 26px; height: 26px; }
        .route-alerts-popover .app-cta-inline {
          margin: 12px 0 0; padding: 0.6rem 0.75rem; background: transparent; border-left: 0; border-radius: 0; color: #e5e7eb;
        }
        .route-alerts-popover .app-cta-inline-icon { display: none; }
        .route-alerts-popover .app-cta-inline-left { display: none; }
        .route-alerts-popover .app-cta-inline-btn {
          margin: 0; width: 100%; text-align: center; border-radius: 999px; padding: 0.5rem 0.9rem; font-size: 0.78rem;
        }
        .route-alerts-popover .app-cta-inline-help {
          color: #d6dce8; margin-top: 0; line-height: 1.4; max-width: none;
        }
        .route-alerts-popover .app-cta-inline-help button { background: var(--gold-display, #d8973c); }
        @media (max-width: 768px) {
          .planner-sidebar { width: 100%; position: absolute; bottom: 0; left: 0; right: 0; top: auto; height: 55vh; border-radius: 16px 16px 0 0; margin-left: 0 !important; }
          .planner-sidebar.collapsed { transform: translateY(calc(100% - 48px)); }
          .sidebar-toggle { display: none; }
          .mobile-handle { display: block; }
          .route-alerts-control { top: 12px; left: 12px; }
        }
      `}} />

      <Header />
      <SiteSearchWithHistory layout="strip" />

      <div className="planner-wrap">
        <button
          className={`sidebar-toggle ${sidebarOpen ? 'open' : 'closed'}`}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {sidebarOpen ? '◀' : '▶'}
        </button>

        <UnifiedSidebar
          corridors={corridors}
          corridorMap={corridorMap}
          historyTrails={historyTrails}
          historicMarkers={historicMarkers}
          activeMode={activeMode}
          onSetActiveMode={setActiveMode}
          selectedCorridorId={selected}
          selectedMapPoint={selectedMapPoint}
          activeHistoryTrailId={activeHistoryTrailId}
          activeHistoryTrail={activeHistoryTrail}
          canonicalActiveHistoryTrail={canonicalActiveHistoryTrail}
          activeHistoryStops={activeHistoryStops}
          selectedHistoricMarker={selectedHistoricMarker}
          historyTrailStopIds={historyTrailStopIds}
          setHistoryTrailStopIds={setHistoryTrailStopIds}
          historyRouteStops={historyRouteStops}
          isHistoryTrailCustomized={isHistoryTrailCustomized}
          difficultyFilter={difficultyFilter}
          poiFilter={poiFilter}
          showHistoricMarkers={showHistoricMarkers}
          filteredCorridors={filteredCorridors}
          activeCorridor={activeCorridor}
          filteredPois={filteredPois}
          onSelectCorridor={selectCorridor}
          onDeselectCorridor={deselectCorridor}
          onSelectHistoryTrail={selectHistoryTrail}
          onClearHistoryTrail={clearHistoryTrail}
          onSetDifficultyFilter={setDifficultyFilter}
          onSetPoiFilter={setPoiFilter}
          onSetShowHistoricMarkers={setShowHistoricMarkers}
          onMapPointHover={setHoveredMapPoint}
          onMapPointSelect={handleMapPointSelect}
          onHistoricMarkerSelect={handleHistoricMarkerClick}
          onPoiFlyTo={handlePoiFlyTo}
          onResetView={resetView}
          cities={cities}
          selectedCities={selectedCities}
          setSelectedCities={setSelectedCities}
          itinerary={itinerary}
          setItinerary={setItinerary}
          allPOIs={allPOIs}
          selectedActivityTypes={selectedActivityTypes}
          setSelectedActivityTypes={setSelectedActivityTypes}
          supabaseReady={supabaseReady}
          supabaseStatus={supabaseStatus}
          supabaseError={supabaseError}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={toggleSidebar}
          showSupabasePois={showSupabasePois}
          onSetShowSupabasePois={setShowSupabasePois}
          supabasePoiCategories={supabasePoiCategories}
          onSetSupabasePoiCategories={setSupabasePoiCategories}
          supabasePoiCount={visibleSupabasePois.length}
        />

        <div style={{ flex: 1, position: 'relative' }}>
          <UnifiedMap
            handleRef={mapRef}
            corridors={corridors}
            selectedCorridorId={selected}
            filteredCorridorIds={filteredCorridorIds}
            dimCorridors={!!activeHistoryTrailId}
            activeHistoryTrail={activeHistoryTrail}
            canonicalActiveHistoryTrail={canonicalActiveHistoryTrail}
            activeHistoryStopIds={activeHistoryStopIds}
            itinerary={enabledItinerary}
            historyRouteStops={historyRouteWithManualStops}
            useHistoryRouteStops={shouldUseHistoryRouteStops}
            historicMarkers={historicMarkers}
            showHistoricMarkers={showHistoricMarkers}
            filteredPois={filteredPois}
            selectedHistoricMarker={selectedHistoricMarker}
            selectedMapPoint={selectedMapPoint}
            hoveredMapPoint={hoveredMapPoint}
            onCorridorClick={selectCorridor}
            onHistoricMarkerClick={handleHistoricMarkerClick}
            onPoiClick={handlePoiClick}
            onCloseHistoricMarkerPopup={closeHistoricMarkerPopup}
            onClosePoiPopup={closePoiPopup}
            supabasePois={visibleSupabasePois}
            selectedSupabasePoi={selectedSupabasePoi}
            onSupabasePoiClick={handleSupabasePoiClick}
            onCloseSupabasePoiPopup={closeSupabasePoiPopup}
            onAddHistoryTrailStop={addHistoryTrailStop}
            onRemoveHistoryTrailStop={removeHistoryTrailStop}
          />

          <div className="route-alerts-control">
            <button
              type="button"
              className="route-alerts-button"
              onClick={() => setRouteAlertsOpen((open) => !open)}
              aria-expanded={routeAlertsOpen}
            >
              Point of Interest Alert App
            </button>
            {routeAlertsOpen && (
              <div className="route-alerts-popover" role="dialog" aria-label="Point of Interest Alert App information">
                <div className="route-alerts-popover-header">
                  <div>
                    <h2>Point of Interest Alert App</h2>
                    <p>
                      Install Treasure State to get notified as historic markers, hot springs,
                      trails, and other points of interest come up along your drive.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="route-alerts-close"
                    onClick={() => setRouteAlertsOpen(false)}
                    aria-label="Close Point of Interest Alert App"
                  >
                    ×
                  </button>
                </div>
                <AppInstallCTA
                  variant="inline"
                  forceShow
                  headline="Point of Interest Alert App"
                  body="Install this on your mobile device to be notified when approaching points of interest."
                />
              </div>
            )}
          </div>

          <button
            onClick={resetView}
            style={{
              position: 'absolute', bottom: 24, right: 16, background: '#1a1e2e', color: '#e0e4ec',
              border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '0.78rem',
              cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.3)', fontWeight: 600, zIndex: 5,
            }}
          >
            Show All Routes
          </button>

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
      routeGeometry?: [number, number][][];
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
          rawStops.push({
            id: raw.id,
            slug: raw.slug,
            title: raw.title,
            lat: round(raw.lat, 4),
            lng: round(raw.lng, 4),
            town: raw.town,
            inscription: raw.inscription,
            isCurated: curatedSlugsForTrail.has(raw.slug),
          });
        }
        const stops = orderStopsNearestNeighborFromEast(rawStops);
        const lineSegments = t.routeGeometry && t.routeGeometry.length > 0 ? t.routeGeometry : [];
        return { id: t.id, name: t.name, markerCount: t.markerCount, lineSegments, stops };
      })
      .filter(t => t.stops.length > 0)
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  }

  return { props: { corridors, townCoords, historicMarkers, historyTrails } };
};
