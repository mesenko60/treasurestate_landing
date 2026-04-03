import React, { useState, useEffect } from 'react';
import type { City } from './types';

interface CitySelectorProps {
  cities: City[];
  selectedCities: string[];
  setSelectedCities: (ids: string[]) => void;
}

const MAX_CITIES = 10;

export default function CitySelector({
  cities,
  selectedCities,
  setSelectedCities,
}: CitySelectorProps) {
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [mouse, setMouse] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [pendingDragIdx, setPendingDragIdx] = useState<number | null>(null);
  const [dragOrigin, setDragOrigin] = useState<{ x: number; y: number } | null>(null);

  const removeCity = (idx: number) => {
    setSelectedCities(selectedCities.filter((_, i) => i !== idx));
  };

  const handleChange = (idx: number, cityId: string) => {
    const newArr = [...selectedCities];
    newArr[idx] = cityId;
    setSelectedCities(newArr);
  };

  const addCity = () => {
    if (selectedCities.length < MAX_CITIES && !selectedCities.includes('')) {
      setSelectedCities([...selectedCities, '']);
    }
  };

  useEffect(() => {
    if (selectedCities.length === 0) {
      setSelectedCities(['']);
    }
  }, []);

  useEffect(() => {
    if (!dragging && pendingDragIdx === null) return;

    const dragThreshold = 10;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging && pendingDragIdx !== null && dragOrigin) {
        const dx = e.clientX - dragOrigin.x;
        const dy = e.clientY - dragOrigin.y;
        if (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold) {
          setDragging(true);
          setDraggedIdx(pendingDragIdx);
          setHoveredIdx(pendingDragIdx);
          setMouse({ x: e.clientX, y: e.clientY });
          setPendingDragIdx(null);
          setDragOrigin(null);
        }
      }
      if (dragging) {
        setMouse({ x: e.clientX, y: e.clientY });
        const itemElements = document.querySelectorAll('[data-city-idx]');
        let foundIdx: number | null = null;
        itemElements.forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
            foundIdx = parseInt(el.getAttribute('data-city-idx') || '', 10);
          }
        });
        setHoveredIdx(foundIdx);
      }
    };

    const handleMouseUp = () => {
      if (dragging && draggedIdx !== null && hoveredIdx !== null && draggedIdx !== hoveredIdx) {
        const newOrder = [...selectedCities];
        const [removed] = newOrder.splice(draggedIdx, 1);
        newOrder.splice(hoveredIdx, 0, removed);
        setSelectedCities(newOrder);
      }
      setDragging(false);
      setDraggedIdx(null);
      setHoveredIdx(null);
      setPendingDragIdx(null);
      setDragOrigin(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, pendingDragIdx, dragOrigin, draggedIdx, hoveredIdx, selectedCities, setSelectedCities]);

  const handleDragStart = (e: React.MouseEvent<Element, MouseEvent>, idx: number) => {
    e.preventDefault();
    setPendingDragIdx(idx);
    setDragOrigin({ x: e.clientX, y: e.clientY });
  };

  const getAvailableCities = (excludeIdx: number) =>
    cities.filter((c) => !selectedCities.includes(c.id) || selectedCities[excludeIdx] === c.id);

  return (
    <div className="flex flex-col gap-2 mb-4">
      <label className="font-semibold text-gray-800 mb-1 text-sm">
        Select Destinations
      </label>

      {selectedCities.length < MAX_CITIES &&
        cities.some((c) => !selectedCities.includes(c.id)) && (
          <button
            onClick={addCity}
            className="flex items-center gap-1 rounded border border-gray-300 bg-white text-gray-700 px-3 py-1.5 text-sm w-fit mb-2 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add destination</span>
          </button>
        )}

      <div className="flex flex-col gap-1.5">
        {selectedCities.map((cityId, idx) => {
          const city = cities.find((c) => c.id === cityId);

          if (!city || cityId === '') {
            return (
              <div
                key={`empty-${idx}`}
                data-city-idx={idx}
                className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm"
              >
                <select
                  className="flex-1 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
                  value=""
                  onChange={(e) => handleChange(idx, e.target.value)}
                >
                  <option value="">Select a city...</option>
                  {getAvailableCities(idx).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700 p-1"
                  onClick={() => removeCity(idx)}
                  aria-label="Remove empty slot"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          }

          if (dragging && idx === draggedIdx) {
            return null;
          }

          return (
            <div
              key={`${cityId}-${idx}`}
              data-city-idx={idx}
              className={`
                flex items-center gap-2 bg-white border border-gray-200 
                rounded px-3 py-2 text-sm shadow-sm
                hover:shadow transition-all duration-150
                cursor-grab active:cursor-grabbing
                ${dragging && hoveredIdx === idx && draggedIdx !== idx ? 'ring-2 ring-blue-400' : ''}
              `}
              onMouseDown={(e) => {
                if ((e.target as HTMLElement).closest('button')) return;
                handleDragStart(e, idx);
              }}
            >
              <span className="flex items-center text-gray-400 cursor-grab">
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                  <circle cx="6" cy="4" r="1.5" />
                  <circle cx="10" cy="4" r="1.5" />
                  <circle cx="6" cy="8" r="1.5" />
                  <circle cx="10" cy="8" r="1.5" />
                  <circle cx="6" cy="12" r="1.5" />
                  <circle cx="10" cy="12" r="1.5" />
                </svg>
              </span>
              <span className="flex-1 font-medium text-gray-800">{city.name}</span>
              <button
                type="button"
                className="text-red-500 hover:text-red-700 p-1"
                onClick={() => removeCity(idx)}
                aria-label={`Remove ${city.name}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          );
        })}

        {dragging && draggedIdx !== null && (
          <div
            className="fixed pointer-events-none z-50 flex items-center gap-2 bg-white border border-gray-200 rounded px-3 py-2 text-sm shadow-lg"
            style={{
              top: `${mouse.y - 20}px`,
              left: `${mouse.x - 100}px`,
              opacity: 0.9,
              minWidth: '180px',
              maxWidth: '280px',
            }}
          >
            <span className="flex items-center text-gray-400">
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="6" cy="4" r="1.5" />
                <circle cx="10" cy="4" r="1.5" />
                <circle cx="6" cy="8" r="1.5" />
                <circle cx="10" cy="8" r="1.5" />
                <circle cx="6" cy="12" r="1.5" />
                <circle cx="10" cy="12" r="1.5" />
              </svg>
            </span>
            <span className="flex-1 font-medium text-gray-800">
              {cities.find((c) => c.id === selectedCities[draggedIdx])?.name || 'City'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
