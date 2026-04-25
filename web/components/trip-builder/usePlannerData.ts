import { useEffect, useMemo, useState } from 'react';
import type { City, Corridor, POI } from './types';
import { MONTANA_BOUNDS, POI_LAYER_CATEGORIES } from './types';

type TownCoords = Record<string, { name: string; lat: number; lng: number }>;

export type PlannerDataStatus = 'loading' | 'ready' | 'fallback';

const MAJOR_CITIES = [
  'Billings', 'Missoula', 'Great Falls', 'Bozeman', 'Butte', 'Helena',
  'Kalispell', 'Havre', 'Anaconda', 'Miles City', 'Livingston', 'Whitefish',
  'Lewistown', 'Sidney', 'Glendive', 'Dillon', 'Hamilton', 'Cut Bank',
  'Shelby', 'Glasgow', 'Wolf Point', 'Polson', 'Libby', 'Red Lodge',
  'Big Timber', 'Deer Lodge', 'Hardin', 'Roundup', 'Conrad', 'Chinook',
];

function citySlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function fallbackCitiesFromTownCoords(townCoords: TownCoords): City[] {
  const majorSet = new Set(MAJOR_CITIES.map((c) => c.toLowerCase()));

  return Object.entries(townCoords)
    .filter(([, town]) => town.name && majorSet.has(town.name.toLowerCase()))
    .map(([slug, town]) => ({
      id: slug,
      name: town.name,
      lat: town.lat,
      lon: town.lng,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function usePlannerData({
  corridors,
  townCoords,
  showSupabasePois,
  supabasePoiCategories,
}: {
  corridors: Corridor[];
  townCoords: TownCoords;
  showSupabasePois: boolean;
  supabasePoiCategories: string[];
}) {
  const fallbackCities = useMemo(() => fallbackCitiesFromTownCoords(townCoords), [townCoords]);
  const [cities, setCities] = useState<City[]>(fallbackCities);
  const [allPOIs, setAllPOIs] = useState<POI[]>([]);
  const [status, setStatus] = useState<PlannerDataStatus>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSupabase() {
      setStatus('loading');
      setError(null);

      try {
        const { getSupabase } = await import('../../lib/supabaseClient');
        const supabase = getSupabase();

        const { data: townData, error: townError } = await supabase
          .from('montana_town_coords')
          .select('gnis_id, city, latitude, longitude')
          .not('city', 'is', null)
          .not('latitude', 'is', null)
          .not('longitude', 'is', null);

        if (townError) throw townError;

        const majorSet = new Set(MAJOR_CITIES.map((c) => c.toLowerCase()));
        const filteredCities: City[] = (townData || [])
          .filter((t) => t.city && majorSet.has(t.city.toLowerCase()))
          .map((t) => ({
            id: citySlug(t.city!),
            name: t.city!,
            lat: t.latitude!,
            lon: t.longitude!,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        const { data: poiData, error: poiError } = await supabase
          .from('places')
          .select('id, place_id, name, description, latitude, longitude, type, category, rating, reviews, website, thumbnail')
          .not('latitude', 'is', null)
          .not('longitude', 'is', null)
          .not('name', 'is', null)
          .gte('latitude', MONTANA_BOUNDS.minLat)
          .lte('latitude', MONTANA_BOUNDS.maxLat)
          .gte('longitude', MONTANA_BOUNDS.minLng)
          .lte('longitude', MONTANA_BOUNDS.maxLng);

        if (poiError) throw poiError;

        const pois: POI[] = (poiData || []).map((p) => ({
          id: p.place_id || String(p.id),
          name: p.name!,
          description: p.description || undefined,
          lat: p.latitude!,
          lon: p.longitude!,
          type: p.type || undefined,
          category: p.category || undefined,
          rating: p.rating ? Number(p.rating) : undefined,
          reviews: p.reviews ? Number(p.reviews) : undefined,
          website: p.website || undefined,
          thumbnail: p.thumbnail || undefined,
        }));

        if (cancelled) return;
        setCities(filteredCities.length > 0 ? filteredCities : fallbackCities);
        setAllPOIs(pois);
        setStatus('ready');
      } catch (err) {
        if (cancelled) return;
        setCities(fallbackCities);
        setAllPOIs([]);
        setStatus('fallback');
        setError(err instanceof Error ? err.message : 'Travel data is temporarily unavailable.');
      }
    }

    loadSupabase();
    return () => { cancelled = true; };
  }, [fallbackCities]);

  const visibleSupabasePois = useMemo(() => {
    if (!showSupabasePois || allPOIs.length === 0) return [];

    const allowedTypes = new Set<string>();
    for (const catKey of supabasePoiCategories) {
      const cat = POI_LAYER_CATEGORIES[catKey];
      if (cat) cat.types.forEach((t) => allowedTypes.add(t));
    }

    const typed = allPOIs.filter((p) => p.type && allowedTypes.has(p.type));
    const corridorCoords = corridors.flatMap((c) =>
      c.pois.map((cp) => ({ lat: cp.lat, lng: cp.lng, name: cp.name.toLowerCase().trim() })),
    );

    return typed.filter((p) => {
      const pName = p.name.toLowerCase().trim();
      for (const cp of corridorCoords) {
        const dlat = p.lat - cp.lat;
        const dlng = p.lon - cp.lng;
        const dist = Math.sqrt(dlat * dlat + dlng * dlng);
        if (dist < 0.002 && pName === cp.name) return false;
      }
      return true;
    });
  }, [showSupabasePois, allPOIs, supabasePoiCategories, corridors]);

  return {
    cities,
    allPOIs,
    visibleSupabasePois,
    supabaseReady: status !== 'loading',
    supabaseStatus: status,
    supabaseError: error,
  };
}
