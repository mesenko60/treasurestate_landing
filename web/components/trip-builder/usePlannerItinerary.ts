import { useCallback, useEffect, useState } from 'react';
import type { City, ItineraryPOI, POI } from './types';
import { ACTIVITY_TYPES } from './types';

export function usePlannerItinerary({
  cities,
  allPOIs,
}: {
  cities: City[];
  allPOIs: POI[];
}) {
  const [itinerary, setItinerary] = useState<ItineraryPOI[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>(['']);
  const [selectedActivityTypes, setSelectedActivityTypes] = useState<string[]>([...ACTIVITY_TYPES]);

  const buildItinerary = useCallback(() => {
    const cityIds = selectedCities.filter(Boolean);
    if (!cityIds.length || cities.length === 0) {
      setItinerary([]);
      return;
    }

    const result: ItineraryPOI[] = [];
    for (let i = 0; i < cityIds.length; i++) {
      const city = cities.find((c) => c.id === cityIds[i]);
      if (!city) continue;

      result.push({ id: city.id, name: city.name, lat: city.lat, lon: city.lon, itemType: 'city', enabled: true });

      if (i < cityIds.length - 1) {
        const next = cities.find((c) => c.id === cityIds[i + 1]);
        if (!next) continue;

        const pad = 0.5;
        const minLat = Math.min(city.lat, next.lat) - pad;
        const maxLat = Math.max(city.lat, next.lat) + pad;
        const minLon = Math.min(city.lon, next.lon) - pad;
        const maxLon = Math.max(city.lon, next.lon) + pad;
        const dx = next.lon - city.lon;
        const dy = next.lat - city.lat;
        const len2 = dx * dx + dy * dy;

        const near = allPOIs
          .filter((p) => {
            const inBox = p.lat >= minLat && p.lat <= maxLat && p.lon >= minLon && p.lon <= maxLon;
            const matchType = selectedActivityTypes.length === 0 || (p.type && selectedActivityTypes.includes(p.type));
            return inBox && matchType;
          })
          .map((p) => {
            const t = len2 > 0 ? ((p.lon - city.lon) * dx + (p.lat - city.lat) * dy) / len2 : 0;
            const cross = Math.abs((p.lat - city.lat) * dx - (p.lon - city.lon) * dy);
            const dist = len2 > 0 ? cross / Math.sqrt(len2) : 0;
            return { poi: p, t, near: dist <= 0.3 && t >= -0.1 && t <= 1.1 };
          })
          .filter((x) => x.near)
          .sort((a, b) => a.t - b.t)
          .slice(0, 5)
          .map(({ poi }) => ({ ...poi, itemType: 'activity' as const, enabled: true }));

        result.push(...near);
      }
    }

    setItinerary(result);
  }, [selectedCities, cities, allPOIs, selectedActivityTypes]);

  useEffect(() => { buildItinerary(); }, [buildItinerary]);

  return {
    itinerary,
    setItinerary,
    selectedCities,
    setSelectedCities,
    selectedActivityTypes,
    setSelectedActivityTypes,
  };
}
