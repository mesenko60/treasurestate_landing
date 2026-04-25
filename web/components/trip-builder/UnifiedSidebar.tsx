import React, { useEffect, useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import type {
  Corridor, CorridorPOI, HistoricMarker, HistoryTrailMapData,
  City, HistoryTrailStopItem, ItineraryPOI, MapHoverPoint, POI,
} from './types';
import { ACTIVITY_TYPES, POI_LAYER_CATEGORIES } from './types';
import { formatDriveTime, formatDistance } from './utils';
import type { PlannerDataStatus } from './usePlannerData';
import type { PlannerMode } from './usePlannerUrlState';

const MODE_OPTIONS: Array<{ id: PlannerMode; label: string; body: string }> = [
  { id: 'scenic', label: 'Scenic Drives', body: 'Pick a curated road route and review nearby POIs.' },
  { id: 'history', label: 'History Trails', body: 'Choose a historic marker itinerary and follow its stops.' },
  { id: 'build', label: 'Build a Route', body: 'Choose towns and filter outdoor stops along the drive.' },
];

const CATEGORY_ICONS: Record<string, string> = {
  hotspring: '♨',
  campground: 'Camp',
  hiking: 'Hike',
  recreation: 'Rec',
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
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function corridorEndpointLabel(corridor: Corridor, endpoint: 'start' | 'end') {
  return endpoint === 'start'
    ? corridor.startLabel || slugToName(corridor.startTown)
    : corridor.endLabel || slugToName(corridor.endTown);
}

function corridorPoiHoverPoint(poi: CorridorPOI, index: number): MapHoverPoint {
  return {
    id: `corridor-poi:${poi.name}:${poi.lat}:${poi.lng}`,
    name: poi.name,
    lat: poi.lat,
    lng: poi.lng,
    type: poi.type,
    category: poi.category,
    description: `${poi.distFromRoute.toFixed(1)} mi from route`,
    rating: poi.rating,
    reviews: poi.reviews,
  };
}

function historicMarkerHoverPoint(marker: HistoricMarker): MapHoverPoint {
  return {
    id: `history-marker:${marker.id}`,
    name: marker.title,
    lat: marker.lat,
    lng: marker.lng,
    type: 'Historic marker',
    description: marker.town || undefined,
  };
}

function itineraryHoverPoint(item: ItineraryPOI): MapHoverPoint {
  return {
    id: `itinerary:${item.id}`,
    name: item.name,
    lat: item.lat,
    lng: item.lon,
    type: item.itemType === 'city' ? 'Town stop' : item.type,
    category: item.category,
    description: item.description,
    rating: item.rating,
    reviews: item.reviews,
    website: item.website,
  };
}

function renderRouteSelect<T extends { id: string; name: string }>({
  id,
  label,
  value,
  options,
  placeholder,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: T[];
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="planner-select-label" htmlFor={id}>
      <span>{label}</span>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)} className="planner-select">
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>{option.name}</option>
        ))}
      </select>
    </label>
  );
}

function RouteStat({ label, value, color }: { label: string; value: React.ReactNode; color?: string }) {
  return (
    <div className="stat-box">
      <div className="stat-val" style={color ? { color } : undefined}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return <div className="planner-empty">{children}</div>;
}

interface UnifiedSidebarProps {
  corridors: Corridor[];
  corridorMap: Record<string, Corridor>;
  historyTrails: HistoryTrailMapData[];
  historicMarkers: HistoricMarker[];
  activeMode: PlannerMode;
  onSetActiveMode: (mode: PlannerMode) => void;

  selectedCorridorId: string | null;
  selectedMapPoint: MapHoverPoint | null;
  activeHistoryTrailId: string | null;
  activeHistoryTrail: HistoryTrailMapData | null;
  canonicalActiveHistoryTrail: HistoryTrailMapData | null;
  activeHistoryStops: HistoricMarker[];
  selectedHistoricMarker: HistoricMarker | null;
  historyTrailStopIds: string[] | null;
  setHistoryTrailStopIds: React.Dispatch<React.SetStateAction<string[] | null>>;
  historyRouteStops: HistoryTrailStopItem[];
  isHistoryTrailCustomized: boolean;
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
  onSetDifficultyFilter: (val: string | null) => void;
  onSetPoiFilter: (val: string | null) => void;
  onSetShowHistoricMarkers: (val: boolean) => void;
  onMapPointHover: (point: MapHoverPoint | null) => void;
  onMapPointSelect: (point: MapHoverPoint) => void;
  onHistoricMarkerSelect: (marker: HistoricMarker) => void;
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
    corridors, historyTrails, historicMarkers,
    activeMode, onSetActiveMode,
    selectedCorridorId, selectedMapPoint, activeHistoryTrailId, activeHistoryTrail,
    activeHistoryStops, selectedHistoricMarker, historyTrailStopIds, setHistoryTrailStopIds,
    difficultyFilter, poiFilter, showHistoricMarkers, filteredCorridors, activeCorridor, filteredPois,
    onSelectCorridor, onDeselectCorridor, onSelectHistoryTrail, onClearHistoryTrail,
    onSetDifficultyFilter, onSetPoiFilter, onSetShowHistoricMarkers, onMapPointHover, onMapPointSelect,
    onHistoricMarkerSelect, onPoiFlyTo,
    cities, selectedCities, setSelectedCities, itinerary, setItinerary, allPOIs,
    selectedActivityTypes, setSelectedActivityTypes, supabaseReady, supabaseStatus, supabaseError,
    sidebarOpen, onToggleSidebar, showSupabasePois, onSetShowSupabasePois,
    supabasePoiCategories, onSetSupabasePoiCategories, supabasePoiCount,
  } = props;

  const [totalDistance, setTotalDistance] = useState<number | null>(null);
  const [totalDuration, setTotalDuration] = useState<number | null>(null);
  const [routeMessage, setRouteMessage] = useState<string | null>(null);

  useEffect(() => {
    const handler = (event: CustomEvent) => {
      setTotalDistance(event.detail.distance);
      setTotalDuration(event.detail.duration);
      setRouteMessage(null);
    };
    const errorHandler = (event: CustomEvent) => {
      setRouteMessage(event.detail?.message || 'Route calculation is temporarily unavailable.');
    };
    window.addEventListener('routeCalculated', handler as EventListener);
    window.addEventListener('routeError', errorHandler as EventListener);
    return () => {
      window.removeEventListener('routeCalculated', handler as EventListener);
      window.removeEventListener('routeError', errorHandler as EventListener);
    };
  }, []);

  useEffect(() => {
    if (activeMode !== 'build') {
      setTotalDistance(null);
      setTotalDuration(null);
      setRouteMessage(null);
    }
  }, [activeMode]);

  const selectedCitySet = useMemo(() => new Set(selectedCities.filter(Boolean)), [selectedCities]);

  const addCity = useCallback(() => {
    if (selectedCities.length < 10 && !selectedCities.includes('')) {
      setSelectedCities([...selectedCities, '']);
    }
  }, [selectedCities, setSelectedCities]);

  const handleCityChange = useCallback((idx: number, cityId: string) => {
    const next = [...selectedCities];
    next[idx] = cityId;
    setSelectedCities(next);
  }, [selectedCities, setSelectedCities]);

  const removeCity = useCallback((idx: number) => {
    const next = selectedCities.filter((_, i) => i !== idx);
    setSelectedCities(next.length > 0 ? next : ['']);
  }, [selectedCities, setSelectedCities]);

  const getAvailableCities = useCallback((idx: number) =>
    cities.filter((city) => !selectedCitySet.has(city.id) || selectedCities[idx] === city.id),
  [cities, selectedCities, selectedCitySet]);

  const handleActivityToggle = useCallback((tag: string) => {
    setSelectedActivityTypes((current) =>
      current.includes(tag) ? current.filter((value) => value !== tag) : [...current, tag]
    );
  }, [setSelectedActivityTypes]);

  const resetHistoryStops = useCallback(() => {
    setHistoryTrailStopIds(null);
  }, [setHistoryTrailStopIds]);

  const handleModeSelect = (mode: PlannerMode) => {
    if (mode !== 'scenic') onDeselectCorridor();
    if (mode !== 'history') onClearHistoryTrail();
    onSetActiveMode(mode);
  };

  return (
    <aside className={`planner-sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
      <div className="mobile-handle" onClick={onToggleSidebar} />

      <div className="preset-section">
        <div className="section-kicker">What kind of trip?</div>
        <div className="preset-grid">
          {MODE_OPTIONS.map((mode) => {
            const active = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => handleModeSelect(mode.id)}
                className={`preset-card ${active ? 'active' : ''}`}
              >
                <span>{mode.label}</span>
                <small>{mode.body}</small>
              </button>
            );
          })}
        </div>
      </div>

      <div className="planner-main">
        {activeMode === 'scenic' && (
          <section className="planner-panel">
            <div className="sidebar-header">
              <h1>Scenic Drives</h1>
              <p>Choose one curated road route. Route points, nearby POIs, and optional historic markers appear below and on the map.</p>
            </div>

            <div className="filter-bar">
              <button className={`filter-chip ${!difficultyFilter ? 'active' : ''}`} onClick={() => onSetDifficultyFilter(null)}>All difficulties</button>
              {['easy', 'moderate', 'challenging'].map((difficulty) => (
                <button
                  key={difficulty}
                  className={`filter-chip ${difficultyFilter === difficulty ? 'active' : ''}`}
                  onClick={() => onSetDifficultyFilter(difficultyFilter === difficulty ? null : difficulty)}
                >
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </button>
              ))}
            </div>

            <div className="panel-block">
              {renderRouteSelect({
                id: 'scenic-route-select',
                label: 'Select a scenic drive',
                value: selectedCorridorId || '',
                options: filteredCorridors,
                placeholder: 'Choose a route...',
                onChange: (value) => {
                  if (value) onSelectCorridor(value);
                  else onDeselectCorridor();
                },
              })}
            </div>

            <div className="panel-block subtle">
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={showHistoricMarkers}
                  onChange={(event) => onSetShowHistoricMarkers(event.target.checked)}
                />
                Show historic markers ({historicMarkers.length})
              </label>
            </div>

            {activeCorridor ? (
              <>
                <div className="route-detail">
                  <h2>
                    <span style={{ background: activeCorridor.color }} />
                    {activeCorridor.name}
                  </h2>
                  <p>{activeCorridor.description}</p>
                  <div className="detail-subtitle">
                    {activeCorridor.highways.join(' / ')} · {corridorEndpointLabel(activeCorridor, 'start')} to {corridorEndpointLabel(activeCorridor, 'end')}
                  </div>
                  <div className="detail-stats">
                    <RouteStat label="Distance" value={`${activeCorridor.distanceMiles} mi`} />
                    <RouteStat label="Difficulty" value={activeCorridor.difficulty} color={DIFFICULTY_COLORS[activeCorridor.difficulty]} />
                    <RouteStat label="Elevation" value={`${activeCorridor.elevationRange[0].toLocaleString()}-${activeCorridor.elevationRange[1].toLocaleString()}'`} />
                    <RouteStat label="Season" value={activeCorridor.season} />
                  </div>
                </div>

                <div className="poi-section">
                  <h3>Route stops & points of interest ({filteredPois.length})</h3>
                  <div className="filter-bar compact">
                    <button className={`filter-chip ${!poiFilter ? 'active' : ''}`} onClick={() => onSetPoiFilter(null)}>All</button>
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
                      const count = activeCorridor.pois.filter((poi) => poi.category === key).length;
                      if (count === 0) return null;
                      return (
                        <button key={key} className={`filter-chip ${poiFilter === key ? 'active' : ''}`} onClick={() => onSetPoiFilter(poiFilter === key ? null : key)}>
                          {CATEGORY_ICONS[key]} {label} ({count})
                        </button>
                      );
                    })}
                  </div>
                  {filteredPois.map((poi, index) => {
                    const hoverPoint = corridorPoiHoverPoint(poi, index);
                    const selected = selectedMapPoint?.id === hoverPoint.id;
                    return (
                      <button
                        key={`${poi.name}-${index}`}
                        type="button"
                        className={`poi-item ${selected ? 'selected' : ''}`}
                        onMouseEnter={() => onMapPointHover(hoverPoint)}
                        onMouseLeave={() => onMapPointHover(null)}
                        onFocus={() => onMapPointHover(hoverPoint)}
                        onBlur={() => onMapPointHover(null)}
                        onClick={() => {
                          onMapPointSelect(hoverPoint);
                          onPoiFlyTo(poi);
                        }}
                      >
                        <span>{CATEGORY_ICONS[poi.category] || 'POI'}</span>
                        <strong>{poi.name}</strong>
                        <em>{poi.type || CATEGORY_LABELS[poi.category] || 'Point of interest'}</em>
                        {poi.rating != null && <em>{poi.rating.toFixed(1)}</em>}
                        <small>{poi.distFromRoute.toFixed(1)} mi</small>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <EmptyState>Select a scenic drive to see its route details, stops, and points of interest.</EmptyState>
            )}
          </section>
        )}

        {activeMode === 'history' && (
          <section className="planner-panel">
            <div className="sidebar-header">
              <h1>History Trails</h1>
              <p>Choose one historic marker route. Its marker stops appear below.</p>
            </div>

            <div className="panel-block">
              {renderRouteSelect({
                id: 'history-trail-select',
                label: 'Select a history trail',
                value: activeHistoryTrailId || '',
                options: historyTrails,
                placeholder: 'Choose a history trail...',
                onChange: (value) => {
                  if (value) onSelectHistoryTrail(value);
                  else onClearHistoryTrail();
                },
              })}
            </div>

            <div className="panel-block subtle">
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={showHistoricMarkers}
                  onChange={(event) => onSetShowHistoricMarkers(event.target.checked)}
                />
                Show all historic markers ({historicMarkers.length})
              </label>
            </div>

            {activeHistoryTrail ? (
              <>
                <div className="route-detail history">
                  <h2>{activeHistoryTrail.name}</h2>
                  <p>{activeHistoryStops.length} active marker stop{activeHistoryStops.length === 1 ? '' : 's'}.</p>
                  <div className="route-actions">
                    <Link href={`/guides/history-trails/${activeHistoryTrail.id}/`} className="trail-guide-btn">
                      Open full itinerary
                    </Link>
                    {historyTrailStopIds && (
                      <button type="button" className="action-btn secondary" onClick={resetHistoryStops}>
                        Reset stops
                      </button>
                    )}
                  </div>
                </div>

                <ol className="stop-list">
                  {activeHistoryStops.map((stop) => (
                    <li
                      key={stop.id}
                      className={selectedHistoricMarker?.id === stop.id ? 'selected' : ''}
                      onMouseEnter={() => onMapPointHover(historicMarkerHoverPoint(stop))}
                      onMouseLeave={() => onMapPointHover(null)}
                      onClick={() => onHistoricMarkerSelect(stop)}
                    >
                      <strong>{stop.title}</strong>
                      {stop.town && <span>{stop.town}</span>}
                    </li>
                  ))}
                </ol>
              </>
            ) : (
              <EmptyState>Select a history trail to see its marker stops.</EmptyState>
            )}
          </section>
        )}

        {activeMode === 'build' && (
          <section className="planner-panel">
            <div className="sidebar-header">
              <h1>Build a Route</h1>
              <p>Select towns, then choose which outdoor points of interest should appear along the road-following route.</p>
            </div>

            {!supabaseReady ? (
              <EmptyState>Loading destinations...</EmptyState>
            ) : (
              <>
                {supabaseStatus === 'fallback' && (
                  <div className="route-message">
                    Using local town data because live planner data is unavailable.
                    {supabaseError ? ` ${supabaseError}` : ''}
                  </div>
                )}

                <div className="panel-block">
                  <label className="planner-select-label">
                    <span>Town stops</span>
                  </label>
                  <div className="city-list">
                    {selectedCities.map((cityId, idx) => {
                      const city = cities.find((item) => item.id === cityId);
                      return (
                        <div key={`${cityId || 'empty'}-${idx}`} className="city-row">
                          <span>{idx + 1}</span>
                          <select value={city?.id || ''} onChange={(event) => handleCityChange(idx, event.target.value)} className="planner-select">
                            <option value="">Select a town...</option>
                            {getAvailableCities(idx).map((option) => (
                              <option key={option.id} value={option.id}>{option.name}</option>
                            ))}
                          </select>
                          <button type="button" onClick={() => removeCity(idx)} aria-label="Remove town">x</button>
                        </div>
                      );
                    })}
                  </div>
                  {selectedCities.length < 10 && cities.some((city) => !selectedCitySet.has(city.id)) && (
                    <button type="button" className="action-btn secondary" onClick={addCity}>Add another town</button>
                  )}
                </div>

                <div className="panel-block">
                  <label className="planner-select-label">
                    <span>Outdoor point-of-interest types {allPOIs.length > 0 ? `(${allPOIs.length.toLocaleString()} candidates)` : ''}</span>
                  </label>
                  <div className="filter-bar compact">
                    {ACTIVITY_TYPES.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className={`filter-chip ${selectedActivityTypes.includes(tag) ? 'active' : ''}`}
                        onClick={() => handleActivityToggle(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="panel-block subtle">
                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={showSupabasePois}
                      onChange={(event) => onSetShowSupabasePois(event.target.checked)}
                    />
                    Show extra points of interest{showSupabasePois ? ` (${supabasePoiCount})` : ''}
                  </label>
                  {showSupabasePois && (
                    <div className="filter-bar compact">
                      {Object.entries(POI_LAYER_CATEGORIES).map(([key, category]) => {
                        const active = supabasePoiCategories.includes(key);
                        return (
                          <button
                            key={key}
                            type="button"
                            className={`filter-chip ${active ? 'active' : ''}`}
                            style={active ? { borderColor: category.color, color: category.color } : undefined}
                            onClick={() => onSetSupabasePoiCategories((current) =>
                              active ? current.filter((value) => value !== key) : [...current, key]
                            )}
                          >
                            {category.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="route-stats-line">
                  <span>Distance: <strong>{totalDistance ? formatDistance(totalDistance) : '-'}</strong></span>
                  <span>Time: <strong>{totalDuration ? formatDriveTime(totalDuration) : '-'}</strong></span>
                </div>
                {routeMessage && <div className="route-message">{routeMessage}</div>}

                {itinerary.length > 0 ? (
                  <ol className="stop-list">
                    {itinerary.map((item) => {
                      const enabled = item.enabled !== false;
                      const hoverPoint = itineraryHoverPoint(item);
                      const selected = selectedMapPoint?.id === hoverPoint.id;
                      return (
                        <li
                          key={item.id}
                          className={`${enabled ? '' : 'disabled'} ${selected ? 'selected' : ''}`.trim()}
                          onMouseEnter={() => onMapPointHover(hoverPoint)}
                          onMouseLeave={() => onMapPointHover(null)}
                          onClick={() => onMapPointSelect(hoverPoint)}
                        >
                          <strong>{item.name}</strong>
                          {item.type && <span>{item.type}</span>}
                          {item.itemType !== 'city' && (
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                setItinerary((current) => current.map((stop) => (
                                  stop.id === item.id ? { ...stop, enabled: !enabled } : stop
                                )));
                              }}
                            >
                              {enabled ? 'On' : 'Off'}
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                ) : (
                  <EmptyState>Select at least two towns to generate a road route and suggested points of interest.</EmptyState>
                )}
              </>
            )}
          </section>
        )}
      </div>
    </aside>
  );
}
