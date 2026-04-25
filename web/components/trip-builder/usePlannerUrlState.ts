import { useEffect, useRef } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { NextRouter } from 'next/router';
import type { Corridor, HistoryTrailMapData, ItineraryPOI } from './types';
import { ACTIVITY_TYPES } from './types';

export type PlannerMode = 'scenic' | 'towns' | 'history' | 'outdoors';

const PLANNER_MODES: PlannerMode[] = ['scenic', 'towns', 'history', 'outdoors'];
const DEFAULT_ACTIVITY_TYPES = [...ACTIVITY_TYPES];

function matchesDefaultActivities(values: string[]) {
  if (values.length !== DEFAULT_ACTIVITY_TYPES.length) return false;
  return DEFAULT_ACTIVITY_TYPES.every((value) => values.includes(value));
}

function csv(value: string | string[] | undefined): string[] {
  if (typeof value !== 'string' || !value) return [];
  return value.split(',').filter(Boolean);
}

function first(value: string | string[] | undefined) {
  return typeof value === 'string' ? value : null;
}

function setCsv(params: URLSearchParams, key: string, values: string[]) {
  const clean = values.filter(Boolean);
  if (clean.length > 0) params.set(key, clean.join(','));
}

export function usePlannerUrlState({
  router,
  corridors,
  historyTrails,
  activeMode,
  setActiveMode,
  selected,
  setSelected,
  tripCorridorIds,
  setTripCorridorIds,
  activeHistoryTrailId,
  setActiveHistoryTrailId,
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
}: {
  router: NextRouter;
  corridors: Corridor[];
  historyTrails: HistoryTrailMapData[];
  activeMode: PlannerMode;
  setActiveMode: (mode: PlannerMode) => void;
  selected: string | null;
  setSelected: (id: string | null) => void;
  tripCorridorIds: string[];
  setTripCorridorIds: (ids: string[]) => void;
  activeHistoryTrailId: string | null;
  setActiveHistoryTrailId: (id: string | null) => void;
  difficultyFilter: string | null;
  setDifficultyFilter: (value: string | null) => void;
  poiFilter: string | null;
  setPoiFilter: (value: string | null) => void;
  showHistoricMarkers: boolean;
  setShowHistoricMarkers: (value: boolean) => void;
  showSupabasePois: boolean;
  setShowSupabasePois: (value: boolean) => void;
  supabasePoiCategories: string[];
  setSupabasePoiCategories: (value: string[]) => void;
  selectedCities: string[];
  setSelectedCities: (ids: string[]) => void;
  selectedActivityTypes: string[];
  setSelectedActivityTypes: (types: string[]) => void;
  itinerary: ItineraryPOI[];
  setItinerary: Dispatch<SetStateAction<ItineraryPOI[]>>;
}) {
  const lastWrittenUrl = useRef<string | null>(null);
  const enabledStopIdsFromUrl = useRef<Set<string> | null>(null);
  const corridorIds = corridors.map((c) => c.id).join('|');
  const trailIds = historyTrails.map((t) => t.id).join('|');

  useEffect(() => {
    if (!router.isReady) return;
    if (lastWrittenUrl.current === router.asPath) return;

    const query = router.query;
    const mode = first(query.mode);
    if (mode && PLANNER_MODES.includes(mode as PlannerMode)) setActiveMode(mode as PlannerMode);

    const validCorridors = new Set(corridors.map((c) => c.id));
    const routes = csv(query.routes).filter((id) => validCorridors.has(id));
    setTripCorridorIds(routes);

    const focus = first(query.focus);
    setSelected(focus && validCorridors.has(focus) ? focus : null);

    const validTrails = new Set(historyTrails.map((t) => t.id));
    const trail = first(query.trail);
    setActiveHistoryTrailId(trail && validTrails.has(trail) ? trail : null);

    setDifficultyFilter(first(query.diff));
    setPoiFilter(first(query.poi));
    setShowHistoricMarkers(first(query.markers) === '1');
    setShowSupabasePois(first(query.poiLayer) === '1');

    const categories = csv(query.poiCats);
    if (categories.length > 0) setSupabasePoiCategories(categories);

    const cities = csv(query.cities);
    if (cities.length > 0) setSelectedCities(cities);

    const activities = csv(query.activities);
    if (activities.length > 0) setSelectedActivityTypes(activities);

    const stops = csv(query.stops);
    enabledStopIdsFromUrl.current = stops.length > 0 ? new Set(stops) : null;
  }, [
    router.isReady,
    router.asPath,
    corridorIds,
    trailIds,
    corridors,
    historyTrails,
    router.query,
    setActiveMode,
    setActiveHistoryTrailId,
    setDifficultyFilter,
    setPoiFilter,
    setSelected,
    setSelectedActivityTypes,
    setSelectedCities,
    setShowHistoricMarkers,
    setShowSupabasePois,
    setSupabasePoiCategories,
    setTripCorridorIds,
  ]);

  useEffect(() => {
    const enabled = enabledStopIdsFromUrl.current;
    if (!enabled || itinerary.length === 0) return;

    setItinerary((prev) => prev.map((item) => (
      item.itemType === 'city' ? item : { ...item, enabled: enabled.has(item.id) }
    )));
    enabledStopIdsFromUrl.current = null;
  }, [itinerary.length, setItinerary]);

  useEffect(() => {
    if (!router.isReady) return;

    const params = new URLSearchParams();
    if (activeMode !== 'scenic') params.set('mode', activeMode);
    setCsv(params, 'routes', tripCorridorIds);
    if (selected) params.set('focus', selected);
    if (activeHistoryTrailId) params.set('trail', activeHistoryTrailId);
    if (difficultyFilter) params.set('diff', difficultyFilter);
    if (poiFilter) params.set('poi', poiFilter);
    if (showHistoricMarkers) params.set('markers', '1');
    if (showSupabasePois) params.set('poiLayer', '1');
    if (showSupabasePois) setCsv(params, 'poiCats', supabasePoiCategories);
    setCsv(params, 'cities', selectedCities.filter(Boolean));
    if (!matchesDefaultActivities(selectedActivityTypes)) setCsv(params, 'activities', selectedActivityTypes);
    setCsv(params, 'stops', itinerary.filter((item) => item.itemType === 'city' || item.enabled !== false).map((item) => item.id));

    const qs = params.toString();
    const currentPath = router.asPath.split('?')[0] || router.pathname;
    const nextUrl = qs ? `${currentPath}?${qs}` : currentPath;
    if (nextUrl !== router.asPath) {
      lastWrittenUrl.current = nextUrl;
      router.replace(nextUrl, undefined, { shallow: true });
    }
  }, [
    router,
    router.isReady,
    router.pathname,
    router.asPath,
    activeMode,
    tripCorridorIds,
    selected,
    activeHistoryTrailId,
    difficultyFilter,
    poiFilter,
    showHistoricMarkers,
    showSupabasePois,
    supabasePoiCategories,
    selectedCities,
    selectedActivityTypes,
    itinerary,
  ]);
}
