import Head from 'next/head';
import dynamic from 'next/dynamic';
import React, { useState, useEffect, useCallback } from 'react';
import Header from '../../components/Header';
import { supabase } from '../../lib/supabaseClient';
import type { City, POI, ItineraryPOI } from '../../components/trip-builder/types';
import { ACTIVITY_TYPES } from '../../components/trip-builder/types';

const TripMap = dynamic(() => import('../../components/trip-builder/TripMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-100">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
});

const ItineraryPanel = dynamic(
  () => import('../../components/trip-builder/ItineraryPanel'),
  { ssr: false }
);

const MAJOR_CITIES = [
  'Billings',
  'Missoula',
  'Great Falls',
  'Bozeman',
  'Butte',
  'Helena',
  'Kalispell',
  'Havre',
  'Anaconda',
  'Miles City',
  'Livingston',
  'Whitefish',
  'Lewistown',
  'Sidney',
  'Glendive',
  'Dillon',
  'Hamilton',
  'Cut Bank',
  'Shelby',
  'Glasgow',
  'Wolf Point',
  'Polson',
  'Libby',
  'Red Lodge',
  'Big Timber',
  'Deer Lodge',
  'Hardin',
  'Roundup',
  'Conrad',
  'Chinook',
];

export default function TripBuilderPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [allPOIs, setAllPOIs] = useState<POI[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryPOI[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedActivityTypes, setSelectedActivityTypes] = useState<string[]>([
    ...ACTIVITY_TYPES,
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        const { data: townData, error: townError } = await supabase
          .from('montana_town_coords')
          .select('gnis_id, city, latitude, longitude')
          .not('city', 'is', null)
          .not('latitude', 'is', null)
          .not('longitude', 'is', null);

        if (townError) {
          throw new Error(`Failed to load cities: ${townError.message}`);
        }

        const majorCitySet = new Set(MAJOR_CITIES.map((c) => c.toLowerCase()));
        const filteredCities: City[] = (townData || [])
          .filter((t) => t.city && majorCitySet.has(t.city.toLowerCase()))
          .map((t) => ({
            id: String(t.gnis_id || `${t.latitude}_${t.longitude}`),
            name: t.city!,
            lat: t.latitude!,
            lon: t.longitude!,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setCities(filteredCities);

        const { data: poiData, error: poiError } = await supabase
          .from('places')
          .select(
            'id, place_id, name, description, latitude, longitude, type, category, rating, reviews, website, thumbnail'
          )
          .not('latitude', 'is', null)
          .not('longitude', 'is', null)
          .not('name', 'is', null);

        if (poiError) {
          console.warn('Failed to load POIs:', poiError.message);
        } else {
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
          setAllPOIs(pois);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const buildItinerary = useCallback(() => {
    if (!selectedCities.length || cities.length === 0) {
      setItinerary([]);
      return;
    }

    const newItinerary: ItineraryPOI[] = [];

    for (let i = 0; i < selectedCities.length; i++) {
      const city = cities.find((c) => c.id === selectedCities[i]);
      if (!city) continue;

      newItinerary.push({
        id: city.id,
        name: city.name,
        lat: city.lat,
        lon: city.lon,
        itemType: 'city',
        enabled: true,
      });

      if (i < selectedCities.length - 1) {
        const nextCity = cities.find((c) => c.id === selectedCities[i + 1]);
        if (!nextCity) continue;

        const padding = 0.5;
        const minLat = Math.min(city.lat, nextCity.lat) - padding;
        const maxLat = Math.max(city.lat, nextCity.lat) + padding;
        const minLon = Math.min(city.lon, nextCity.lon) - padding;
        const maxLon = Math.max(city.lon, nextCity.lon) + padding;

        const poisInBox = allPOIs.filter((poi) => {
          const inBox =
            poi.lat >= minLat &&
            poi.lat <= maxLat &&
            poi.lon >= minLon &&
            poi.lon <= maxLon;

          const matchesType =
            selectedActivityTypes.length === 0 ||
            (poi.type && selectedActivityTypes.includes(poi.type));

          return inBox && matchesType;
        });

        const dx = nextCity.lon - city.lon;
        const dy = nextCity.lat - city.lat;
        const length2 = dx * dx + dy * dy;

        const poisNearRoute = poisInBox
          .map((poi) => {
            let t = 0;
            if (length2 > 0) {
              t = ((poi.lon - city.lon) * dx + (poi.lat - city.lat) * dy) / length2;
            }

            const crossProduct = Math.abs(
              (poi.lat - city.lat) * dx - (poi.lon - city.lon) * dy
            );
            const distanceFromLine = length2 > 0 ? crossProduct / Math.sqrt(length2) : 0;

            const maxDist = 0.3;
            const isNear = distanceFromLine <= maxDist && t >= -0.1 && t <= 1.1;

            return { poi, t, isNear };
          })
          .filter((p) => p.isNear)
          .sort((a, b) => a.t - b.t)
          .slice(0, 5)
          .map(({ poi }) => ({
            ...poi,
            itemType: 'activity' as const,
            enabled: true,
          }));

        newItinerary.push(...poisNearRoute);
      }
    }

    setItinerary(newItinerary);
  }, [selectedCities, cities, allPOIs, selectedActivityTypes]);

  useEffect(() => {
    buildItinerary();
  }, [buildItinerary]);

  if (loading) {
    return (
      <>
        <Head>
          <title>Trip Builder | TreasureState</title>
        </Head>
        <Header />
        <main className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading trip builder...</p>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>Trip Builder | TreasureState</title>
        </Head>
        <Header />
        <main className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center max-w-md p-6">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Unable to Load</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Trip Builder - Plan Your Montana Adventure | TreasureState</title>
        <meta
          name="description"
          content="Build your perfect Montana road trip with our interactive trip planner. Select destinations, discover activities along your route, and optimize your itinerary."
        />
      </Head>
      <Header />
      <main
        className="flex"
        style={{
          maxWidth: 'none',
          margin: 0,
          padding: 0,
          height: 'calc(100vh - 50px)',
        }}
      >
        <ItineraryPanel
          itinerary={itinerary}
          setItinerary={setItinerary}
          selectedCities={selectedCities}
          setSelectedCities={setSelectedCities}
          cities={cities}
          selectedActivityTypes={selectedActivityTypes}
          setSelectedActivityTypes={setSelectedActivityTypes}
          allPOIs={allPOIs}
        />
        <div className="flex-1 relative">
          <TripMap
            itinerary={itinerary.filter(
              (item) => item.itemType === 'city' || item.enabled !== false
            )}
            selectedCities={selectedCities}
            cities={cities}
          />
        </div>
      </main>
    </>
  );
}
