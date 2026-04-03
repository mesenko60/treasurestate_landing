import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import CitySelector from './CitySelector';
import type { City, ItineraryPOI, POI } from './types';
import { formatDriveTime, formatDistance } from './utils';
import { ACTIVITY_TYPES } from './types';

interface ItineraryPanelProps {
  itinerary: ItineraryPOI[];
  setItinerary: React.Dispatch<React.SetStateAction<ItineraryPOI[]>>;
  selectedCities: string[];
  setSelectedCities: (ids: string[]) => void;
  cities: City[];
  selectedActivityTypes: string[];
  setSelectedActivityTypes: React.Dispatch<React.SetStateAction<string[]>>;
  allPOIs: POI[];
}

export default function ItineraryPanel({
  itinerary,
  setItinerary,
  selectedCities,
  setSelectedCities,
  cities,
  selectedActivityTypes,
  setSelectedActivityTypes,
  allPOIs,
}: ItineraryPanelProps) {
  const [totalDistance, setTotalDistance] = useState<number | null>(null);
  const [totalDuration, setTotalDuration] = useState<number | null>(null);
  const [legDistances, setLegDistances] = useState<number[]>([]);
  const [legDurations, setLegDurations] = useState<number[]>([]);
  const [optimizing, setOptimizing] = useState(false);

  const handleActivityTypeToggle = (tag: string) => {
    setSelectedActivityTypes((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const removeFromItinerary = (poiId: string) => {
    setItinerary(itinerary.filter((item) => item.id !== poiId));
  };

  const handleClear = () => setItinerary([]);

  const handleOptimizeRoute = async () => {
    if (itinerary.length < 3) return;
    if (itinerary.length > 8) {
      alert('Route optimization is only supported for up to 8 stops.');
      return;
    }
    setOptimizing(true);
    try {
      const coords = itinerary.map((poi) => `${poi.lon},${poi.lat}`).join(';');
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      if (!token) throw new Error('Mapbox token missing');
      const url = `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${coords}?annotations=duration&access_token=${token}`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error('Failed to fetch drive time matrix');
      const data = await resp.json();
      const durations: number[][] = data.durations;
      if (!Array.isArray(durations) || durations.length !== itinerary.length)
        throw new Error('Invalid matrix');

      const n = itinerary.length;
      const permute = (arr: number[]): number[][] => {
        if (arr.length === 1) return [arr];
        const result: number[][] = [];
        for (let i = 0; i < arr.length; i++) {
          const rest = arr.slice(0, i).concat(arr.slice(i + 1));
          for (const p of permute(rest)) {
            result.push([arr[i], ...p]);
          }
        }
        return result;
      };
      const indices = Array.from({ length: n }, (_, i) => i);
      const perms = permute(indices.slice(1));
      let minOrder = indices;
      let minTime = Infinity;
      for (const p of perms) {
        const order = [0, ...p];
        let time = 0;
        for (let i = 0; i < order.length - 1; i++) {
          const d = durations[order[i]][order[i + 1]];
          if (typeof d !== 'number' || !isFinite(d)) {
            time = Infinity;
            break;
          }
          time += d;
        }
        if (time < minTime) {
          minTime = time;
          minOrder = order;
        }
      }
      const optimized = minOrder.map((i) => itinerary[i]);
      setItinerary(optimized);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      alert('Failed to optimize route: ' + message);
    } finally {
      setOptimizing(false);
    }
  };

  useEffect(() => {
    const handleRouteCalculated = (event: CustomEvent) => {
      const { distance, duration, legDistances, legDurations } = event.detail;
      setTotalDistance(distance);
      setTotalDuration(duration);
      setLegDistances(legDistances);
      setLegDurations(legDurations);
    };

    window.addEventListener('routeCalculated', handleRouteCalculated as EventListener);

    return () => {
      window.removeEventListener('routeCalculated', handleRouteCalculated as EventListener);
    };
  }, []);

  useEffect(() => {
    if (itinerary.filter((item) => item.itemType === 'city').length < 2) {
      setTotalDistance(null);
      setTotalDuration(null);
      setLegDistances([]);
      setLegDurations([]);
    }
  }, [itinerary]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const from = result.source.index;
    const to = result.destination.index;
    if (from === to) return;
    const updated = Array.from(itinerary);
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    const seen = new Set<string>();
    const deduped = updated.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
    setItinerary(deduped);
  };

  const routedItinerary = itinerary.filter(
    (item) => item.itemType === 'city' || item.enabled !== false
  );

  return (
    <aside className="w-[380px] max-w-full flex flex-col h-full bg-white border-r border-gray-200 shadow-sm overflow-y-auto">
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Plan Your Trip</h2>
        <CitySelector
          cities={cities}
          selectedCities={selectedCities}
          setSelectedCities={setSelectedCities}
        />
      </div>

      <div className="px-4 py-3 border-b border-gray-100">
        <label className="font-semibold text-gray-700 mb-2 block text-sm">
          Filter Activities
        </label>
        <div className="flex flex-wrap gap-1">
          {ACTIVITY_TYPES.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedActivityTypes.includes(tag)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => handleActivityTypeToggle(tag)}
              aria-pressed={selectedActivityTypes.includes(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span className="text-gray-600">Distance:</span>
            <span className="font-semibold text-gray-900">
              {totalDistance ? formatDistance(totalDistance) : '—'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-600">Time:</span>
            <span className="font-semibold text-gray-900">
              {totalDuration ? formatDriveTime(totalDuration) : '—'}
            </span>
          </div>
        </div>
        {itinerary.length >= 3 && (
          <div className="mt-2 flex gap-2">
            <button
              onClick={handleOptimizeRoute}
              disabled={optimizing || itinerary.length > 8}
              className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {optimizing ? 'Optimizing...' : 'Optimize Route'}
            </button>
            <button
              onClick={handleClear}
              className="text-xs px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Your Itinerary</h3>
        {itinerary.length === 0 ? (
          <div className="text-gray-500 text-center py-8 text-sm">
            Select cities above to start planning your trip.
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="itinerary-list">
              {(provided) => (
                <ul className="space-y-1" ref={provided.innerRef} {...provided.droppableProps}>
                  {itinerary.map((item, i) => {
                    const isCity = item.itemType === 'city';
                    const isEnabled = item.enabled !== false;

                    return (
                      <Draggable key={item.id} draggableId={item.id} index={i}>
                        {(provided, snapshot) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`
                              flex items-center gap-2 rounded px-2 py-1.5 text-sm
                              ${isCity ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-100 ml-4'}
                              ${!isEnabled && !isCity ? 'opacity-50' : ''}
                              ${snapshot.isDragging ? 'shadow-lg' : ''}
                            `}
                          >
                            <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-medium">
                              {i + 1}
                            </span>
                            <span className={`flex-1 ${isCity ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                              {item.name}
                            </span>
                            {!isCity && item.type && (
                              <span className="text-xs text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded">
                                {item.type}
                              </span>
                            )}
                            {!isCity && (
                              <button
                                type="button"
                                className="p-1 text-gray-400 hover:text-gray-600"
                                onClick={() => {
                                  setItinerary(
                                    itinerary.map((p) =>
                                      p.id === item.id ? { ...p, enabled: !isEnabled } : p
                                    )
                                  );
                                }}
                                aria-label={isEnabled ? 'Disable stop' : 'Enable stop'}
                              >
                                {isEnabled ? (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                ) : (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                  </svg>
                                )}
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
