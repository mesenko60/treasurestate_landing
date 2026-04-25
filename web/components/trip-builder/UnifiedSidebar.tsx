import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import type {
  Corridor, CorridorPOI, HistoricMarker, HistoryTrailMapData,
  City, HistoryTrailStopItem, ItineraryPOI, POI,
} from './types';
import { ACTIVITY_TYPES, POI_LAYER_CATEGORIES } from './types';
import { formatDriveTime, formatDistance } from './utils';
import type { PlannerDataStatus } from './usePlannerData';
import type { PlannerMode } from './usePlannerUrlState';

const MODE_OPTIONS: Array<{ id: PlannerMode; label: string; body: string }> = [
  { id: 'scenic', label: 'Scenic Drives', body: 'Browse curated corridors and add the best roads to your trip.' },
  { id: 'towns', label: 'Town to Town', body: 'Pick destinations and let the planner suggest stops between them.' },
  { id: 'history', label: 'History Trails', body: 'Follow marker routes and historic story lines across Montana.' },
  { id: 'outdoors', label: 'Outdoor Stops', body: 'Layer in campgrounds, hikes, hot springs, food, fuel, and services.' },
];

const CATEGORY_ICONS: Record<string, string> = {
  hotspring: '♨️', campground: '⛺', hiking: '🥾', recreation: '🏔️',
};
const CATEGORY_LABELS: Record<string, string> = {
  hotspring: 'Hot Springs', campground: 'Campgrounds', hiking: 'Hiking', recreation: 'Recreation',
};
const DIFFICULTY_COLORS: Record<string, string> = {
  easy: '#27ae60', moderate: '#f39c12', challenging: '#c0392b',
};

function slugToName(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

interface UnifiedSidebarProps {
  corridors: Corridor[];
  corridorMap: Record<string, Corridor>;
  historyTrails: HistoryTrailMapData[];
  historicMarkers: HistoricMarker[];
  activeMode: PlannerMode;
  onSetActiveMode: (mode: PlannerMode) => void;

  selectedCorridorId: string | null;
  activeHistoryTrailId: string | null;
  activeHistoryTrail: HistoryTrailMapData | null;
  canonicalActiveHistoryTrail: HistoryTrailMapData | null;
  activeHistoryStops: HistoricMarker[];
  historyTrailStopIds: string[] | null;
  setHistoryTrailStopIds: React.Dispatch<React.SetStateAction<string[] | null>>;
  historyRouteStops: HistoryTrailStopItem[];
  isHistoryTrailCustomized: boolean;
  tripCorridorIds: string[];
  difficultyFilter: string | null;
  poiFilter: string | null;
  showHistoricMarkers: boolean;
  filteredCorridors: Corridor[];
  activeCorridor: Corridor | null;
  filteredPois: CorridorPOI[];

  onSelectCorridor: (id: string) => void;
  onDeselectCorridor: () => void;
  onSelectHistoryTrail: (id: string) => void;
  onClearHistoryTrail: () => void;
  onAddToTrip: (id: string) => void;
  onRemoveFromTrip: (id: string) => void;
  onSetDifficultyFilter: (val: string | null) => void;
  onSetPoiFilter: (val: string | null) => void;
  onSetShowHistoricMarkers: (val: boolean) => void;
  onPoiHover: (poi: CorridorPOI | null) => void;
  onPoiFlyTo: (poi: CorridorPOI) => void;
  onResetView: () => void;

  cities: City[];
  selectedCities: string[];
  setSelectedCities: (ids: string[]) => void;
  itinerary: ItineraryPOI[];
  setItinerary: React.Dispatch<React.SetStateAction<ItineraryPOI[]>>;
  allPOIs: POI[];
  selectedActivityTypes: string[];
  setSelectedActivityTypes: React.Dispatch<React.SetStateAction<string[]>>;
  supabaseReady: boolean;
  supabaseStatus: PlannerDataStatus;
  supabaseError: string | null;

  sidebarOpen: boolean;
  onToggleSidebar: () => void;

  showSupabasePois: boolean;
  onSetShowSupabasePois: (val: boolean) => void;
  supabasePoiCategories: string[];
  onSetSupabasePoiCategories: React.Dispatch<React.SetStateAction<string[]>>;
  supabasePoiCount: number;
}

export default function UnifiedSidebar(props: UnifiedSidebarProps) {
  const {
    corridors, corridorMap, historyTrails, historicMarkers,
    activeMode, onSetActiveMode,
    selectedCorridorId, activeHistoryTrailId, activeHistoryTrail,
    canonicalActiveHistoryTrail, activeHistoryStops, historyTrailStopIds,
    setHistoryTrailStopIds, historyRouteStops, isHistoryTrailCustomized,
    tripCorridorIds, difficultyFilter, poiFilter, showHistoricMarkers,
    filteredCorridors, activeCorridor, filteredPois,
    onSelectCorridor, onDeselectCorridor, onSelectHistoryTrail, onClearHistoryTrail,
    onAddToTrip, onRemoveFromTrip, onSetDifficultyFilter, onSetPoiFilter,
    onSetShowHistoricMarkers, onPoiHover, onPoiFlyTo, onResetView,
    cities, selectedCities, setSelectedCities,
    itinerary, setItinerary, allPOIs,
    selectedActivityTypes, setSelectedActivityTypes,
    supabaseReady, supabaseStatus, supabaseError, sidebarOpen, onToggleSidebar,
    showSupabasePois, onSetShowSupabasePois,
    supabasePoiCategories, onSetSupabasePoiCategories, supabasePoiCount,
  } = props;

  const [totalDistance, setTotalDistance] = useState<number | null>(null);
  const [totalDuration, setTotalDuration] = useState<number | null>(null);
  const [optimizing, setOptimizing] = useState(false);
  const [routeMessage, setRouteMessage] = useState<string | null>(null);
  const tab: string = activeMode === 'towns' ? 'plan' : activeMode === 'scenic' ? 'explore' : activeMode;

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      setTotalDistance(e.detail.distance);
      setTotalDuration(e.detail.duration);
      setRouteMessage(null);
    };
    const errorHandler = (e: CustomEvent) => {
      setRouteMessage(e.detail?.message || 'Route calculation is temporarily unavailable.');
    };
    window.addEventListener('routeCalculated', handler as EventListener);
    window.addEventListener('routeError', errorHandler as EventListener);
    return () => {
      window.removeEventListener('routeCalculated', handler as EventListener);
      window.removeEventListener('routeError', errorHandler as EventListener);
    };
  }, []);

  useEffect(() => {
    if (itinerary.filter((i) => i.itemType === 'city').length < 2) {
      setTotalDistance(null);
      setTotalDuration(null);
    }
  }, [itinerary]);

  useEffect(() => {
    if (activeHistoryTrail && activeHistoryStops.length < 2) {
      setTotalDistance(null);
      setTotalDuration(null);
    }
    if (activeHistoryTrail && !isHistoryTrailCustomized) {
      setTotalDistance(null);
      setTotalDuration(null);
    }
  }, [activeHistoryTrail, activeHistoryStops.length, isHistoryTrailCustomized]);

  const tripStats = React.useMemo(() => {
    const routes = tripCorridorIds.map((id) => corridorMap[id]).filter(Boolean);
    return {
      totalMiles: routes.reduce((s, r) => s + r.distanceMiles, 0),
      totalPois: routes.reduce((s, r) => s + r.pois.length, 0),
      routes,
    };
  }, [tripCorridorIds, corridorMap]);

  const historyTrailRouteLabel = isHistoryTrailCustomized
    ? 'custom road route'
    : activeHistoryTrail?.lineSegments.length
      ? 'saved road overview'
      : 'marker overview';

  const activeHistoryStopIds = React.useMemo(
    () => activeHistoryStops.map((stop) => stop.id),
    [activeHistoryStops],
  );

  const removedHistoryStops = React.useMemo(() => {
    if (!canonicalActiveHistoryTrail || !historyTrailStopIds) return [];
    const activeIds = new Set(activeHistoryStopIds);
    return canonicalActiveHistoryTrail.stops.filter((stop) => !activeIds.has(stop.id));
  }, [canonicalActiveHistoryTrail, historyTrailStopIds, activeHistoryStopIds]);

  const customizeHistoryStops = useCallback(() => {
    if (!canonicalActiveHistoryTrail) return [];
    return historyTrailStopIds || canonicalActiveHistoryTrail.stops.map((stop) => stop.id);
  }, [canonicalActiveHistoryTrail, historyTrailStopIds]);

  const removeHistoryStop = useCallback((id: string) => {
    setHistoryTrailStopIds(customizeHistoryStops().filter((stopId) => stopId !== id));
  }, [customizeHistoryStops, setHistoryTrailStopIds]);

  const restoreHistoryStop = useCallback((id: string) => {
    const current = customizeHistoryStops();
    if (!current.includes(id)) setHistoryTrailStopIds([...current, id]);
  }, [customizeHistoryStops, setHistoryTrailStopIds]);

  const resetHistoryStops = useCallback(() => {
    setHistoryTrailStopIds(null);
  }, [setHistoryTrailStopIds]);

  const addCity = useCallback(() => {
    if (selectedCities.length < 10 && !selectedCities.includes('')) {
      setSelectedCities([...selectedCities, '']);
    }
  }, [selectedCities, setSelectedCities]);

  const handleCityChange = useCallback((idx: number, cityId: string) => {
    const arr = [...selectedCities];
    arr[idx] = cityId;
    setSelectedCities(arr);
  }, [selectedCities, setSelectedCities]);

  const removeCity = useCallback((idx: number) => {
    setSelectedCities(selectedCities.filter((_, i) => i !== idx));
  }, [selectedCities, setSelectedCities]);

  const getAvailableCities = useCallback((excludeIdx: number) =>
    cities.filter((c) => !selectedCities.includes(c.id) || selectedCities[excludeIdx] === c.id),
  [cities, selectedCities]);

  const handleOptimize = useCallback(async () => {
    const enabled = itinerary.filter((item) => item.itemType === 'city' || item.enabled !== false);
    if (enabled.length < 3) {
      setRouteMessage('Add at least three active stops before optimizing.');
      return;
    }
    if (enabled.length > 8) {
      setRouteMessage('Optimization supports up to 8 active stops. Turn off or remove a few stops first.');
      return;
    }
    setOptimizing(true);
    try {
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      if (!token) throw new Error('Map routing is unavailable until a Mapbox token is configured.');
      const coords = enabled.map((p) => `${p.lon},${p.lat}`).join(';');
      const resp = await fetch(`https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${coords}?annotations=duration&access_token=${token}`);
      if (!resp.ok) throw new Error('Matrix API error');
      const data = await resp.json();
      const durations: number[][] = data.durations;
      const n = enabled.length;
      const permute = (arr: number[]): number[][] => {
        if (arr.length === 1) return [arr];
        const result: number[][] = [];
        for (let i = 0; i < arr.length; i++) {
          const rest = arr.slice(0, i).concat(arr.slice(i + 1));
          for (const p of permute(rest)) result.push([arr[i], ...p]);
        }
        return result;
      };
      const perms = permute(Array.from({ length: n }, (_, i) => i).slice(1));
      let best = Array.from({ length: n }, (_, i) => i);
      let bestTime = Infinity;
      for (const p of perms) {
        const order = [0, ...p];
        let t = 0;
        for (let j = 0; j < order.length - 1; j++) {
          const d = durations[order[j]][order[j + 1]];
          if (typeof d !== 'number' || !isFinite(d)) { t = Infinity; break; }
          t += d;
        }
        if (t < bestTime) { bestTime = t; best = order; }
      }
      const optimizedEnabled = best.map((i) => enabled[i]);
      const disabled = itinerary.filter((item) => item.itemType !== 'city' && item.enabled === false);
      setItinerary([...optimizedEnabled, ...disabled]);
      setRouteMessage(null);
    } catch (err) {
      setRouteMessage(err instanceof Error ? err.message : 'Route optimization failed.');
    } finally {
      setOptimizing(false);
    }
  }, [itinerary, setItinerary]);

  const onDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;
    const from = result.source.index;
    const to = result.destination.index;
    if (from === to) return;
    const updated = Array.from(itinerary);
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    const seen = new Set<string>();
    setItinerary(updated.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    }));
  }, [itinerary, setItinerary]);

  const onHistoryDragEnd = useCallback((result: DropResult) => {
    if (!result.destination || !canonicalActiveHistoryTrail) return;
    const from = result.source.index;
    const to = result.destination.index;
    if (from === to) return;
    const updated = Array.from(activeHistoryStopIds);
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setHistoryTrailStopIds(updated);
  }, [activeHistoryStopIds, canonicalActiveHistoryTrail, setHistoryTrailStopIds]);

  const handleActivityToggle = useCallback((tag: string) => {
    setSelectedActivityTypes((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, [setSelectedActivityTypes]);

  // If user navigates to corridor detail while on plan tab, switch to explore
  useEffect(() => {
    if (selectedCorridorId && activeMode !== 'scenic') onSetActiveMode('scenic');
  }, [selectedCorridorId, activeMode, onSetActiveMode]);

  return (
    <aside className={`planner-sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
      <div className="mobile-handle" onClick={onToggleSidebar} />

      <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
        <div style={{ fontSize: '0.72rem', color: '#6b7890', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
          What kind of trip?
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {MODE_OPTIONS.map((mode) => {
            const active = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => { if (mode.id !== 'scenic') onDeselectCorridor(); onSetActiveMode(mode.id); }}
                style={{
                  textAlign: 'left',
                  padding: '9px 10px',
                  borderRadius: '10px',
                  border: active ? '1px solid rgba(96,165,250,0.75)' : '1px solid rgba(255,255,255,0.1)',
                  background: active ? 'rgba(59,130,246,0.18)' : 'rgba(255,255,255,0.04)',
                  color: active ? '#fff' : '#c0c8d8',
                  cursor: 'pointer',
                }}
              >
                <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800 }}>{mode.label}</span>
                <span style={{ display: 'block', marginTop: '4px', fontSize: '0.68rem', lineHeight: 1.35, color: active ? '#b8d4ff' : '#7f8aa0' }}>{mode.body}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* === EXPLORE TAB === */}
      {tab === 'explore' && !selectedCorridorId && (
        <>
          <div className="sidebar-header">
            <h1>Montana Backroads</h1>
            <p>{corridors.length} scenic corridors · 850+ points of interest</p>
            <Link href="/guides" style={{ display: 'inline-block', marginTop: '8px', fontSize: '0.72rem', color: '#6b9fff', textDecoration: 'none' }}>
              Looking for travel guides? &rarr;
            </Link>
          </div>

          <div className="filter-bar">
            {['easy', 'moderate', 'challenging'].map((d) => (
              <button key={d} className={`filter-chip ${difficultyFilter === d ? 'active' : ''}`}
                onClick={() => onSetDifficultyFilter(difficultyFilter === d ? null : d)}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
            <span style={{ width: '100%', height: 0 }} />
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
              <button key={k} className={`filter-chip ${poiFilter === k ? 'active' : ''}`}
                onClick={() => onSetPoiFilter(poiFilter === k ? null : k)}
              >
                {CATEGORY_ICONS[k]} {v}
              </button>
            ))}
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#a0aab8', cursor: 'pointer', marginLeft: 'auto' }}>
              <input
                type="checkbox"
                checked={showHistoricMarkers}
                onChange={(e) => onSetShowHistoricMarkers(e.target.checked)}
                style={{ accentColor: '#c0392b' }}
              />
              Historic Markers ({historicMarkers.length})
            </label>
          </div>

          {/* Supabase POI layer toggle + category chips */}
          <div style={{ padding: '6px 18px 8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#a0aab8', cursor: 'pointer', marginBottom: showSupabasePois ? '6px' : 0 }}>
              <input
                type="checkbox"
                checked={showSupabasePois}
                onChange={(e) => onSetShowSupabasePois(e.target.checked)}
                style={{ accentColor: '#3498db' }}
              />
              Points of Interest{showSupabasePois ? ` (${supabasePoiCount})` : ''}
            </label>
            {showSupabasePois && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {Object.entries(POI_LAYER_CATEGORIES).map(([key, cat]) => {
                  const active = supabasePoiCategories.includes(key);
                  return (
                    <button
                      key={key}
                      onClick={() => onSetSupabasePoiCategories((prev) =>
                        active ? prev.filter((k) => k !== key) : [...prev, key]
                      )}
                      className={`filter-chip ${active ? 'active' : ''}`}
                      style={active ? { borderColor: cat.color, color: cat.color } : {}}
                    >
                      {cat.icon} {cat.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {activeHistoryTrail && (
            <div className="history-trail-active-bar">
              <strong>{activeHistoryTrail.name}</strong>
              <span style={{ color: '#8892a4' }}>
                {activeHistoryStops.length} active stop{activeHistoryStops.length === 1 ? '' : 's'}
                {` · ${historyTrailRouteLabel}`}
              </span>
              <Link href={`/guides/history-trails/${activeHistoryTrail.id}/`}>Trail guide →</Link>
              <button type="button" className="trail-clear-btn" onClick={onClearHistoryTrail}>Clear trail</button>
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
                    Click a trail to plot its marker collection. Edit the active stop list in History Trails mode to calculate a road-following route.
                  </p>
                  {historyTrails.map((t) => (
                    <div key={t.id} className={`history-trails-row ${activeHistoryTrailId === t.id ? 'active' : ''}`}>
                      <button type="button" className="history-trails-map-btn" onClick={() => onSelectHistoryTrail(t.id)}>
                        <span className="history-trails-link-name">{t.name}</span>
                        <span className="history-trails-meta">{t.stops.length} stops</span>
                      </button>
                      <Link href={`/guides/history-trails/${t.id}/`} className="history-trails-guide" prefetch={false} onClick={(e) => e.stopPropagation()}>
                        Guide
                      </Link>
                    </div>
                  ))}
                </div>
              </details>
            )}

            {filteredCorridors.map((c) => (
              <div key={c.id} className={`corridor-card ${selectedCorridorId === c.id ? 'selected' : ''}`} onClick={() => onSelectCorridor(c.id)}>
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
                  <button className="action-btn primary" onClick={(e) => { e.stopPropagation(); onSelectCorridor(c.id); }}>Explore</button>
                  {!tripCorridorIds.includes(c.id) ? (
                    <button className="action-btn secondary" onClick={(e) => { e.stopPropagation(); onAddToTrip(c.id); }}>+ Add to Trip</button>
                  ) : (
                    <button className="action-btn danger" onClick={(e) => { e.stopPropagation(); onRemoveFromTrip(c.id); }}>Remove</button>
                  )}
                </div>
              </div>
            ))}

            {filteredCorridors.length === 0 && (
              <div style={{ padding: '24px', textAlign: 'center', color: '#6b7890', fontSize: '0.85rem' }}>
                No corridors match your filters.
                <br />
                <button className="filter-chip" style={{ marginTop: '8px' }} onClick={() => { onSetDifficultyFilter(null); onSetPoiFilter(null); }}>Clear filters</button>
              </div>
            )}
          </div>
        </>
      )}

      {tab === 'history' && (
        <div className="corridor-list">
          <div className="sidebar-header">
            <h1>History Trails</h1>
            <p>Plot historic marker routes, then open the full guide for context.</p>
          </div>
          <div style={{ padding: '10px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#a0aab8', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showHistoricMarkers}
                onChange={(e) => onSetShowHistoricMarkers(e.target.checked)}
                style={{ accentColor: '#c0392b' }}
              />
              Show historic markers ({historicMarkers.length})
            </label>
          </div>
          {activeHistoryTrail && (
            <div className="history-trail-active-bar">
              <strong>{activeHistoryTrail.name}</strong>
              <span style={{ color: '#8892a4' }}>
                {activeHistoryStops.length} active stop{activeHistoryStops.length === 1 ? '' : 's'}
                {` · ${historyTrailRouteLabel}`}
              </span>
              <Link href={`/guides/history-trails/${activeHistoryTrail.id}/`}>Trail guide →</Link>
              <button type="button" className="trail-clear-btn" onClick={onClearHistoryTrail}>Clear trail</button>
            </div>
          )}
          {activeHistoryTrail && (
            <div style={{ padding: '0 18px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.78rem', color: '#a0a8b8', lineHeight: 1.45, marginBottom: '8px' }}>
                Remove or reorder stops to create a custom drive. The planner will use Mapbox road routing when available.
              </div>
              <DragDropContext onDragEnd={onHistoryDragEnd}>
                <Droppable droppableId="history-trail-editor">
                  {(provided) => (
                    <ul
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}
                    >
                      {activeHistoryStops.map((stop, i) => (
                        <Draggable key={stop.id} draggableId={`history-${stop.id}`} index={i}>
                          {(prov, snap) => (
                            <li
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                              style={{
                                ...prov.draggableProps.style,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '6px 8px',
                                borderRadius: '7px',
                                border: '1px solid rgba(201,162,39,0.28)',
                                background: snap.isDragging ? 'rgba(201,162,39,0.2)' : 'rgba(201,162,39,0.08)',
                              }}
                            >
                              <span className="trip-num" style={{ background: '#c9a227', color: '#1a1e2e' }}>{i + 1}</span>
                              <span style={{ flex: 1, minWidth: 0, color: '#e8d9b0', fontSize: '0.78rem' }}>{stop.title}</span>
                              <button type="button" className="trip-remove" onClick={() => removeHistoryStop(stop.id)}>Remove</button>
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </DragDropContext>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                {isHistoryTrailCustomized && (
                  <button type="button" className="action-btn secondary" onClick={resetHistoryStops}>Clear customizations</button>
                )}
                {removedHistoryStops.map((stop) => (
                  <button key={stop.id} type="button" className="action-btn secondary" onClick={() => restoreHistoryStop(stop.id)}>
                    Restore {stop.title}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="history-trails-body" style={{ borderTop: 0, paddingTop: '10px' }}>
            {historyTrails.map((t) => (
              <div key={t.id} className={`history-trails-row ${activeHistoryTrailId === t.id ? 'active' : ''}`}>
                <button type="button" className="history-trails-map-btn" onClick={() => onSelectHistoryTrail(t.id)}>
                  <span className="history-trails-link-name">{t.name}</span>
                  <span className="history-trails-meta">{t.stops.length} stops</span>
                </button>
                <Link href={`/guides/history-trails/${t.id}/`} className="history-trails-guide" prefetch={false} onClick={(e) => e.stopPropagation()}>
                  Guide
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'outdoors' && (
        <div className="corridor-list">
          <div className="sidebar-header">
            <h1>Outdoor Stops</h1>
            <p>Turn on map layers for stops, food, fuel, lodging, and services near your route.</p>
          </div>
          <div style={{ padding: '10px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#a0aab8', cursor: 'pointer', marginBottom: showSupabasePois ? '8px' : 0 }}>
              <input
                type="checkbox"
                checked={showSupabasePois}
                onChange={(e) => onSetShowSupabasePois(e.target.checked)}
                style={{ accentColor: '#3498db' }}
              />
              Show points of interest{showSupabasePois ? ` (${supabasePoiCount})` : ''}
            </label>
            {supabaseStatus === 'fallback' && (
              <div style={{ fontSize: '0.76rem', color: '#fbbf24', lineHeight: 1.45, marginBottom: '8px' }}>
                Live POI layers are unavailable right now. Town planning still works from local data.
                {supabaseError ? ` ${supabaseError}` : ''}
              </div>
            )}
            {showSupabasePois && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {Object.entries(POI_LAYER_CATEGORIES).map(([key, cat]) => {
                  const active = supabasePoiCategories.includes(key);
                  return (
                    <button
                      key={key}
                      onClick={() => onSetSupabasePoiCategories((prev) =>
                        active ? prev.filter((k) => k !== key) : [...prev, key]
                      )}
                      className={`filter-chip ${active ? 'active' : ''}`}
                      style={active ? { borderColor: cat.color, color: cat.color } : {}}
                    >
                      {cat.icon} {cat.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <div className="filter-bar">
            <button className={`filter-chip ${!poiFilter ? 'active' : ''}`} onClick={() => onSetPoiFilter(null)}>All route stops</button>
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
              <button key={k} className={`filter-chip ${poiFilter === k ? 'active' : ''}`}
                onClick={() => onSetPoiFilter(poiFilter === k ? null : k)}
              >
                {CATEGORY_ICONS[k]} {v}
              </button>
            ))}
          </div>
          {filteredCorridors.map((c) => (
            <div key={c.id} className={`corridor-card ${selectedCorridorId === c.id ? 'selected' : ''}`} onClick={() => onSelectCorridor(c.id)}>
              <div className="corridor-card-name">
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                {c.name}
              </div>
              <div className="corridor-card-meta">
                <span>{c.pois.length} curated stops</span>
                <span>{c.distanceMiles} mi</span>
              </div>
              <div className="corridor-card-desc">{c.description}</div>
            </div>
          ))}
        </div>
      )}

      {/* Corridor detail panel */}
      {tab === 'explore' && selectedCorridorId && activeCorridor && (
        <div className="detail-panel">
          <div className="detail-header">
            <button className="detail-back" onClick={onDeselectCorridor}>← All Routes</button>
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
              <div className="stat-val">{activeCorridor.elevationRange[0].toLocaleString()} – {activeCorridor.elevationRange[1].toLocaleString()}&apos;</div>
              <div className="stat-label">Elevation Range</div>
            </div>
            <div className="stat-box">
              <div className="stat-val">{activeCorridor.season}</div>
              <div className="stat-label">Season</div>
            </div>
          </div>
          <div style={{ padding: '8px 18px' }}>
            <p style={{ fontSize: '0.82rem', color: '#9aa0b0', lineHeight: 1.5, margin: 0 }}>{activeCorridor.description}</p>
            <div className="corridor-card-actions" style={{ marginTop: '10px' }}>
              {!tripCorridorIds.includes(activeCorridor.id) ? (
                <button className="action-btn primary" onClick={() => onAddToTrip(activeCorridor.id)}>+ Add to My Trip</button>
              ) : (
                <button className="action-btn danger" onClick={() => onRemoveFromTrip(activeCorridor.id)}>Remove from Trip</button>
              )}
            </div>
          </div>
          {activeCorridor.pois.length > 0 && (
            <div className="poi-section">
              <h3>Nearby Points of Interest ({filteredPois.length})</h3>
              <div className="filter-bar" style={{ padding: '0 0 8px' }}>
                <button className={`filter-chip ${!poiFilter ? 'active' : ''}`} onClick={() => onSetPoiFilter(null)}>All</button>
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => {
                  const count = activeCorridor.pois.filter((p) => p.category === k).length;
                  if (count === 0) return null;
                  return (
                    <button key={k} className={`filter-chip ${poiFilter === k ? 'active' : ''}`} onClick={() => onSetPoiFilter(poiFilter === k ? null : k)}>
                      {CATEGORY_ICONS[k]} {v} ({count})
                    </button>
                  );
                })}
              </div>
              {filteredPois.slice(0, 30).map((p, i) => (
                <div key={`${p.name}-${i}`} className="poi-item"
                  onMouseEnter={() => onPoiHover(p)}
                  onMouseLeave={() => onPoiHover(null)}
                  onClick={() => onPoiFlyTo(p)}
                >
                  <span>{CATEGORY_ICONS[p.category] || '📍'}</span>
                  <span>{p.name}</span>
                  {p.rating != null && <span style={{ fontSize: '0.72rem', color: '#d8973c' }}>★ {p.rating.toFixed(1)}</span>}
                  <span className="poi-dist">{p.distFromRoute.toFixed(1)} mi</span>
                </div>
              ))}
              {filteredPois.length > 30 && (
                <div style={{ fontSize: '0.75rem', color: '#6b7890', padding: '8px 0', textAlign: 'center' }}>+{filteredPois.length - 30} more</div>
              )}
            </div>
          )}
          {activeCorridor.connections.length > 0 && (
            <div className="connections-section">
              <h3 style={{ fontSize: '0.82rem', color: '#8892a4', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Connecting Routes</h3>
              {activeCorridor.connections.map((cId) => {
                const conn = corridorMap[cId];
                if (!conn) return null;
                return (
                  <span key={cId} className="connection-chip" onClick={() => onSelectCorridor(cId)}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: conn.color, display: 'inline-block', marginRight: 5 }} />
                    {conn.name}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* === PLAN TRIP TAB === */}
      {tab === 'plan' && (
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 style={{ fontSize: '0.92rem', color: '#fff', margin: '0 0 12px', fontWeight: 700 }}>Plan Your Trip</h2>

            {!supabaseReady ? (
              <div style={{ fontSize: '0.82rem', color: '#8892a4', textAlign: 'center', padding: '20px 0' }}>
                Loading destinations...
              </div>
            ) : (
              <>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#c0c8d8', marginBottom: '8px', display: 'block' }}>
                  Select Destinations
                </label>
                {supabaseStatus === 'fallback' && (
                  <div style={{ fontSize: '0.76rem', color: '#fbbf24', lineHeight: 1.45, marginBottom: '10px' }}>
                    Using local town data because live planner data is unavailable.
                    {supabaseError ? ` ${supabaseError}` : ''}
                  </div>
                )}

                {selectedCities.length < 10 && cities.some((c) => !selectedCities.includes(c.id)) && (
                  <button
                    onClick={addCity}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px',
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '6px', color: '#c0c8d8', fontSize: '0.78rem', cursor: 'pointer',
                      marginBottom: '10px',
                    }}
                  >
                    + Add destination
                  </button>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedCities.map((cityId, idx) => {
                    const city = cities.find((c) => c.id === cityId);
                    if (!city || cityId === '') {
                      return (
                        <div key={`empty-${idx}`} style={{
                          display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px',
                          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '6px',
                        }}>
                          <select
                            value=""
                            onChange={(e) => handleCityChange(idx, e.target.value)}
                            style={{
                              flex: 1, background: 'transparent', border: 'none', color: '#e0e4ec',
                              fontSize: '0.82rem', outline: 'none',
                            }}
                          >
                            <option value="" style={{ background: '#1a1e2e' }}>Select a city...</option>
                            {getAvailableCities(idx).map((c) => (
                              <option key={c.id} value={c.id} style={{ background: '#1a1e2e' }}>{c.name}</option>
                            ))}
                          </select>
                          <button onClick={() => removeCity(idx)} style={{ background: 'none', border: 'none', color: '#6b7890', cursor: 'pointer', fontSize: '0.9rem' }}>✕</button>
                        </div>
                      );
                    }
                    return (
                      <div key={`${cityId}-${idx}`} style={{
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px',
                        background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)',
                        borderRadius: '6px',
                      }}>
                        <span style={{
                          width: 22, height: 22, borderRadius: '50%', background: '#3b82f6',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.7rem', fontWeight: 700, color: '#fff', flexShrink: 0,
                        }}>{idx + 1}</span>
                        <span style={{ flex: 1, fontSize: '0.82rem', fontWeight: 600, color: '#e0e4ec' }}>{city.name}</span>
                        <button onClick={() => removeCity(idx)} style={{ background: 'none', border: 'none', color: '#6b7890', cursor: 'pointer', fontSize: '0.9rem' }}>✕</button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {supabaseReady && (
            <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#c0c8d8', marginBottom: '8px', display: 'block' }}>
                Filter Activities Along Route {allPOIs.length > 0 ? `(${allPOIs.length.toLocaleString()} candidates)` : ''}
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {ACTIVITY_TYPES.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleActivityToggle(tag)}
                    style={{
                      padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 500,
                      border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer',
                      background: selectedActivityTypes.includes(tag) ? 'rgba(59,130,246,0.3)' : 'transparent',
                      color: selectedActivityTypes.includes(tag) ? '#93c5fd' : '#a0a8b8',
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Route stats */}
          <div style={{
            padding: '12px 18px', background: 'rgba(59,130,246,0.06)',
            borderBottom: '1px solid rgba(59,130,246,0.15)',
            display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '0.82rem',
          }}>
            <div>
              <span style={{ color: '#8892a4' }}>Distance: </span>
              <span style={{ color: '#fff', fontWeight: 600 }}>{totalDistance ? formatDistance(totalDistance) : '—'}</span>
            </div>
            <div>
              <span style={{ color: '#8892a4' }}>Time: </span>
              <span style={{ color: '#fff', fontWeight: 600 }}>{totalDuration ? formatDriveTime(totalDuration) : '—'}</span>
            </div>
            {itinerary.length >= 3 && (
              <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
                <button
                  onClick={handleOptimize}
                  disabled={optimizing || itinerary.length > 8}
                  style={{
                    fontSize: '0.72rem', padding: '4px 12px', borderRadius: '6px',
                    background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer',
                    fontWeight: 600, opacity: optimizing ? 0.5 : 1,
                  }}
                >
                  {optimizing ? 'Optimizing...' : 'Optimize'}
                </button>
                <button
                  onClick={() => setItinerary([])}
                  style={{
                    fontSize: '0.72rem', padding: '4px 12px', borderRadius: '6px',
                    background: 'rgba(255,255,255,0.08)', color: '#c0c8d8', border: 'none', cursor: 'pointer',
                  }}
                >
                  Clear
                </button>
              </div>
            )}
          </div>
          {routeMessage && (
            <div style={{ padding: '8px 18px', fontSize: '0.76rem', color: '#fbbf24', borderBottom: '1px solid rgba(255,255,255,0.06)', lineHeight: 1.45 }}>
              {routeMessage}
            </div>
          )}

          {/* Corridor trip summary */}
          {tripCorridorIds.length > 0 && (
            <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 style={{ fontSize: '0.78rem', color: '#8892a4', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Corridor Routes ({tripCorridorIds.length})
              </h3>
              {tripCorridorIds.map((id, i) => {
                const c = corridorMap[id];
                if (!c) return null;
                return (
                  <div key={id} className="trip-item">
                    <div className="trip-num" style={{ background: c.color }}>{i + 1}</div>
                    <span className="trip-item-name" style={{ cursor: 'pointer' }} onClick={() => { onSetActiveMode('scenic'); onSelectCorridor(id); }}>{c.name}</span>
                    <span className="trip-item-miles">{c.distanceMiles} mi</span>
                    <button className="trip-remove" onClick={() => onRemoveFromTrip(id)}>✕</button>
                  </div>
                );
              })}
              <div style={{ fontSize: '0.78rem', color: '#8892a4', marginTop: '6px' }}>
                {tripStats.totalMiles} miles · {tripStats.totalPois} points of interest
              </div>
            </div>
          )}
        </div>
      )}

      {/* === ITINERARY TAB === */}
      {tab === 'itinerary' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px' }}>
          <h2 style={{ fontSize: '0.92rem', color: '#fff', margin: '0 0 12px', fontWeight: 700 }}>Your Itinerary</h2>

          {itinerary.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#6b7890', padding: '32px 0', fontSize: '0.82rem' }}>
              Select cities in the Plan Trip tab to start building your route.
            </div>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="unified-itinerary">
                {(provided) => (
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}
                    ref={provided.innerRef} {...provided.droppableProps}
                  >
                    {itinerary.map((item, i) => {
                      const isCity = item.itemType === 'city';
                      const isEnabled = item.enabled !== false;
                      return (
                        <Draggable key={item.id} draggableId={item.id} index={i}>
                          {(prov, snap) => (
                            <li
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                              style={{
                                ...prov.draggableProps.style,
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '6px 10px', borderRadius: '6px', fontSize: '0.82rem',
                                background: isCity ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.04)',
                                border: `1px solid ${isCity ? 'rgba(59,130,246,0.25)' : 'rgba(255,255,255,0.08)'}`,
                                marginLeft: isCity ? 0 : '16px',
                                opacity: !isEnabled && !isCity ? 0.5 : 1,
                                boxShadow: snap.isDragging ? '0 4px 16px rgba(0,0,0,0.4)' : 'none',
                              }}
                            >
                              <span style={{
                                width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                                background: isCity ? '#3b82f6' : '#ef4444',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.65rem', fontWeight: 700, color: '#fff',
                              }}>{i + 1}</span>
                              <span style={{ flex: 1, color: isCity ? '#e0e4ec' : '#c0c8d8', fontWeight: isCity ? 600 : 400 }}>{item.name}</span>
                              {!isCity && item.type && (
                                <span style={{ fontSize: '0.68rem', color: '#6b7890', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px' }}>{item.type}</span>
                              )}
                              {!isCity && (
                                <button
                                  onClick={() => setItinerary(itinerary.map((p) => p.id === item.id ? { ...p, enabled: !isEnabled } : p))}
                                  style={{ background: 'none', border: 'none', color: '#6b7890', cursor: 'pointer', fontSize: '0.75rem', padding: '2px' }}
                                  aria-label={isEnabled ? 'Disable stop' : 'Enable stop'}
                                >
                                  {isEnabled ? '👁' : '👁‍🗨'}
                                </button>
                              )}
                              <button
                                onClick={() => setItinerary(itinerary.filter((p) => p.id !== item.id))}
                                style={{ background: 'none', border: 'none', color: '#6b7890', cursor: 'pointer', fontSize: '0.8rem', padding: '2px' }}
                              >✕</button>
                            </li>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          )}

          {itinerary.length > 0 && (
            <div style={{
              marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
                  {totalDistance ? formatDistance(totalDistance) : '—'}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#6b7890' }}>
                  {totalDuration ? formatDriveTime(totalDuration) : '—'} drive time
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => {
                    const url = `${window.location.origin}${window.location.pathname}`;
                    navigator.clipboard.writeText(url);
                  }}
                  className="action-btn primary"
                >
                  Share
                </button>
                <button onClick={() => setItinerary([])} className="action-btn secondary">Clear</button>
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{
        flexShrink: 0,
        borderTop: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(10,14,24,0.92)',
        maxHeight: '44%',
        overflowY: 'auto',
        padding: '12px 14px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'flex-start', marginBottom: '10px' }}>
          <div>
            <h2 style={{ fontSize: '0.86rem', color: '#fff', margin: 0, fontWeight: 800 }}>Trip Summary</h2>
            <div style={{ fontSize: '0.72rem', color: '#6b7890', marginTop: '3px' }}>
              {tripCorridorIds.length} scenic route{tripCorridorIds.length === 1 ? '' : 's'} · {itinerary.length} itinerary stop{itinerary.length === 1 ? '' : 's'}
              {activeHistoryTrail ? ` · ${historyRouteStops.length} history stop${historyRouteStops.length === 1 ? '' : 's'}` : ''}
            </div>
          </div>
          <button
            type="button"
            className="action-btn primary"
            onClick={() => navigator.clipboard?.writeText(window.location.href)}
          >
            Share
          </button>
        </div>

        {(totalDistance || totalDuration || tripStats.totalMiles > 0) && (
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '0.78rem', color: '#c0c8d8', marginBottom: '10px' }}>
            {tripStats.totalMiles > 0 && <span>{tripStats.totalMiles} scenic mi</span>}
            {totalDistance && <span>{formatDistance(totalDistance)} routed</span>}
            {totalDuration && <span>{formatDriveTime(totalDuration)} drive time</span>}
          </div>
        )}

        {routeMessage && (
          <div style={{ fontSize: '0.74rem', color: '#fbbf24', lineHeight: 1.45, marginBottom: '10px' }}>{routeMessage}</div>
        )}

        {activeHistoryTrail && (
          <div style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
              <div style={{ fontSize: '0.74rem', color: '#e8d9b0', fontWeight: 800 }}>
                {activeHistoryTrail.name}
              </div>
              {isHistoryTrailCustomized && (
                <button type="button" className="trip-remove" onClick={resetHistoryStops}>Reset</button>
              )}
            </div>
            <DragDropContext onDragEnd={onHistoryDragEnd}>
              <Droppable droppableId="persistent-history-trail">
                {(provided) => (
                  <ul
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}
                  >
                    {activeHistoryStops.map((stop, i) => (
                      <Draggable key={`summary-${stop.id}`} draggableId={`summary-history-${stop.id}`} index={i}>
                        {(prov, snap) => (
                          <li
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            {...prov.dragHandleProps}
                            style={{
                              ...prov.draggableProps.style,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '6px 8px',
                              borderRadius: '6px',
                              fontSize: '0.78rem',
                              background: snap.isDragging ? 'rgba(201,162,39,0.2)' : 'rgba(201,162,39,0.08)',
                              border: '1px solid rgba(201,162,39,0.25)',
                            }}
                          >
                            <span className="trip-num" style={{ background: '#c9a227', color: '#1a1e2e' }}>{i + 1}</span>
                            <span className="trip-item-name">{stop.title}</span>
                            <button className="trip-remove" onClick={() => removeHistoryStop(stop.id)}>x</button>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
            {removedHistoryStops.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '7px' }}>
                {removedHistoryStops.map((stop) => (
                  <button key={stop.id} type="button" className="action-btn secondary" onClick={() => restoreHistoryStop(stop.id)}>
                    Restore {stop.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {tripCorridorIds.length > 0 && (
          <div style={{ marginBottom: '10px' }}>
            {tripCorridorIds.map((id, i) => {
              const c = corridorMap[id];
              if (!c) return null;
              return (
                <div key={id} className="trip-item">
                  <div className="trip-num" style={{ background: c.color }}>{i + 1}</div>
                  <span className="trip-item-name" style={{ cursor: 'pointer' }} onClick={() => { onSetActiveMode('scenic'); onSelectCorridor(id); }}>{c.name}</span>
                  <button className="trip-remove" onClick={() => onRemoveFromTrip(id)}>x</button>
                </div>
              );
            })}
          </div>
        )}

        {itinerary.length === 0 ? (
          <div style={{ fontSize: '0.78rem', color: '#6b7890', lineHeight: 1.45 }}>
            {activeHistoryTrail
              ? 'History stop changes are saved in the share URL. Pick Town to Town mode to add separate destinations.'
              : 'Pick Town to Town mode to add destinations, or add scenic routes from Scenic Drives.'}
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="persistent-itinerary">
              {(provided) => (
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}
                  ref={provided.innerRef} {...provided.droppableProps}
                >
                  {itinerary.map((item, i) => {
                    const isCity = item.itemType === 'city';
                    const isEnabled = item.enabled !== false;
                    return (
                      <Draggable key={`${item.id}-${i}`} draggableId={`${item.id}-${i}`} index={i}>
                        {(prov, snap) => (
                          <li
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            {...prov.dragHandleProps}
                            style={{
                              ...prov.draggableProps.style,
                              display: 'flex', alignItems: 'center', gap: '8px',
                              padding: '6px 8px', borderRadius: '6px', fontSize: '0.78rem',
                              background: isCity ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.04)',
                              border: `1px solid ${isCity ? 'rgba(59,130,246,0.25)' : 'rgba(255,255,255,0.08)'}`,
                              opacity: !isEnabled && !isCity ? 0.5 : 1,
                              boxShadow: snap.isDragging ? '0 4px 16px rgba(0,0,0,0.4)' : 'none',
                            }}
                          >
                            <span style={{
                              width: 19, height: 19, borderRadius: '50%', flexShrink: 0,
                              background: isCity ? '#3b82f6' : '#ef4444',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '0.62rem', fontWeight: 700, color: '#fff',
                            }}>{i + 1}</span>
                            <span style={{ flex: 1, color: isCity ? '#e0e4ec' : '#c0c8d8', fontWeight: isCity ? 700 : 400 }}>{item.name}</span>
                            {!isCity && (
                              <button
                                onClick={() => setItinerary(itinerary.map((p) => p.id === item.id ? { ...p, enabled: !isEnabled } : p))}
                                style={{ background: 'none', border: 'none', color: '#6b7890', cursor: 'pointer', fontSize: '0.7rem', padding: '2px' }}
                                aria-label={isEnabled ? 'Disable stop' : 'Enable stop'}
                              >
                                {isEnabled ? 'On' : 'Off'}
                              </button>
                            )}
                          </li>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </aside>
  );
}
