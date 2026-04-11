import Head from 'next/head';
import dynamic from 'next/dynamic';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from '../components/Header';
import { fetchNearbyPOIs, formatDistance, getCategoryInfo, POI_CATEGORIES } from '../lib/nearbyApi';
import type { NearbyPOI } from '../lib/nearbyApi';
import ProximityToast from '../components/nearby/ProximityToast';
import type { ProximityAlert } from '../components/nearby/ProximityToast';
import AlertPreferences, { loadAlertSettings, saveAlertSettings } from '../components/nearby/AlertPreferences';
import type { AlertSettings } from '../components/nearby/AlertPreferences';
import 'mapbox-gl/dist/mapbox-gl.css';

const NearbyMap = dynamic(() => import('../components/nearby/NearbyMap'), { ssr: false });

const RADIUS_OPTIONS = [
  { label: '1 mi', value: 1609 },
  { label: '5 mi', value: 8047 },
  { label: '10 mi', value: 16093 },
  { label: '25 mi', value: 40234 },
  { label: '50 mi', value: 80467 },
];

const DEFAULT_RADIUS = 8047;

type GeoState =
  | { status: 'idle' }
  | { status: 'requesting' }
  | { status: 'granted'; lat: number; lng: number }
  | { status: 'denied'; message: string };

const ALERT_COOLDOWN_MS = 5 * 60 * 1000;

function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function NearbyPage() {
  const [geo, setGeo] = useState<GeoState>({ status: 'idle' });
  const [pois, setPois] = useState<NearbyPOI[]>([]);
  const [loading, setLoading] = useState(false);
  const [radius, setRadius] = useState(DEFAULT_RADIUS);
  const [enabledCategories, setEnabledCategories] = useState<Set<string>>(new Set(Object.keys(POI_CATEGORIES)));
  const [selectedPoi, setSelectedPoi] = useState<NearbyPOI | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const watchIdRef = useRef<number | null>(null);
  const lastFetchRef = useRef<string>('');

  // Proximity alert state
  const [alertSettings, setAlertSettings] = useState<AlertSettings>(() => loadAlertSettings());
  const [alertPrefsOpen, setAlertPrefsOpen] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState<ProximityAlert[]>([]);
  const alertedIdsRef = useRef<Map<number, number>>(new Map());

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeo({ status: 'denied', message: 'Geolocation is not supported by your browser.' });
      return;
    }
    setGeo({ status: 'requesting' });
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setGeo({ status: 'granted', lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        const messages: Record<number, string> = {
          1: 'Location access was denied. Please enable location services in your browser settings.',
          2: 'Unable to determine your location. Please check your GPS signal.',
          3: 'Location request timed out. Please try again.',
        };
        setGeo({ status: 'denied', message: messages[err.code] || err.message });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 },
    );
  }, []);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (geo.status !== 'granted') return;
    const key = `${geo.lat.toFixed(4)}_${geo.lng.toFixed(4)}_${radius}`;
    if (key === lastFetchRef.current) return;
    lastFetchRef.current = key;

    setLoading(true);
    fetchNearbyPOIs(geo.lat, geo.lng, radius, null, 200)
      .then(setPois)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [geo, radius]);

  // Proximity alert detection
  useEffect(() => {
    if (geo.status !== 'granted' || !alertSettings.enabled || pois.length === 0) return;

    const now = Date.now();
    const newAlerts: ProximityAlert[] = [];

    for (const poi of pois) {
      if (!alertSettings.alertCategories.has(poi.category)) continue;

      const dist = haversineMeters(geo.lat, geo.lng, poi.lat, poi.lng);
      if (dist > alertSettings.triggerDistance) continue;

      const lastAlerted = alertedIdsRef.current.get(poi.id);
      if (lastAlerted && now - lastAlerted < ALERT_COOLDOWN_MS) continue;

      alertedIdsRef.current.set(poi.id, now);
      newAlerts.push({ poi: { ...poi, distance_meters: dist }, triggeredAt: now });
    }

    if (newAlerts.length > 0) {
      setActiveAlerts((prev) => [...newAlerts, ...prev].slice(0, 3));

      if (alertSettings.soundEnabled && typeof window !== 'undefined') {
        try {
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = 800;
          osc.type = 'sine';
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.3);
        } catch { /* audio context not available */ }
      }
    }
  }, [geo, pois, alertSettings]);

  const dismissAlert = useCallback((poiId: number) => {
    setActiveAlerts((prev) => prev.filter((a) => a.poi.id !== poiId));
  }, []);

  const handleAlertSelect = useCallback((poi: NearbyPOI) => {
    setSelectedPoi(poi);
    setActiveAlerts((prev) => prev.filter((a) => a.poi.id !== poi.id));
    setViewMode('map');
  }, []);

  const handleAlertNavigate = useCallback((poi: NearbyPOI) => {
    window.open(`https://maps.google.com/maps?daddr=${poi.lat},${poi.lng}`, '_blank');
    setActiveAlerts((prev) => prev.filter((a) => a.poi.id !== poi.id));
  }, []);

  const handleAlertSettingsUpdate = useCallback((next: AlertSettings) => {
    setAlertSettings(next);
    saveAlertSettings(next);
  }, []);

  const filteredPois = pois.filter((p) => enabledCategories.has(p.category));

  const toggleCategory = (cat: string) => {
    setEnabledCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const selectAll = () => setEnabledCategories(new Set(Object.keys(POI_CATEGORIES)));
  const selectNone = () => setEnabledCategories(new Set());

  const presentCategories = Array.from(new Set(pois.map((p) => p.category)));

  return (
    <>
      <Head>
        <title>Nearby Points of Interest | Treasure State</title>
        <meta name="description" content="Discover historic markers, hot springs, trails, and points of interest near your current location in Montana." />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <Header />
      <div className="nearby-page">
        {geo.status === 'idle' && (
          <div className="nearby-prompt">
            <div className="nearby-prompt-inner">
              <div className="nearby-prompt-icon">📍</div>
              <h1>What&apos;s Nearby?</h1>
              <p>Discover historic markers, hot springs, trails, campgrounds, and more near your current location in Montana.</p>
              <button className="nearby-cta" onClick={requestLocation}>
                Enable Location
              </button>
              <p className="nearby-note">Your location stays on your device and is never stored.</p>
            </div>
          </div>
        )}

        {geo.status === 'requesting' && (
          <div className="nearby-prompt">
            <div className="nearby-prompt-inner">
              <div className="nearby-spinner" />
              <p>Requesting location access...</p>
            </div>
          </div>
        )}

        {geo.status === 'denied' && (
          <div className="nearby-prompt">
            <div className="nearby-prompt-inner">
              <div className="nearby-prompt-icon">⚠️</div>
              <p>{geo.message}</p>
              <button className="nearby-cta" onClick={requestLocation}>Try Again</button>
            </div>
          </div>
        )}

        {geo.status === 'granted' && (
          <div className="nearby-active">
            <div className="nearby-controls">
              <div className="nearby-controls-row">
                <div className="nearby-radius-group">
                  {RADIUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      className={`nearby-radius-btn${radius === opt.value ? ' active' : ''}`}
                      onClick={() => setRadius(opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div className="nearby-right-controls">
                  <button
                    className={`nearby-alert-bell${alertSettings.enabled ? ' active' : ''}`}
                    onClick={() => setAlertPrefsOpen(true)}
                    aria-label="Alert settings"
                    title="Pop-up alert settings"
                  >
                    {alertSettings.enabled ? '🔔' : '🔕'}
                  </button>
                  <div className="nearby-view-toggle">
                    <button
                      className={viewMode === 'map' ? 'active' : ''}
                      onClick={() => setViewMode('map')}
                      aria-label="Map view"
                    >
                      🗺️
                    </button>
                    <button
                      className={viewMode === 'list' ? 'active' : ''}
                      onClick={() => setViewMode('list')}
                      aria-label="List view"
                    >
                      📋
                    </button>
                  </div>
                </div>
              </div>

              <div className="nearby-category-filters">
                <button className="nearby-filter-meta" onClick={selectAll}>All</button>
                <button className="nearby-filter-meta" onClick={selectNone}>None</button>
                {presentCategories.map((cat) => {
                  const info = getCategoryInfo(cat);
                  const count = pois.filter((p) => p.category === cat).length;
                  return (
                    <button
                      key={cat}
                      className={`nearby-filter-btn${enabledCategories.has(cat) ? ' active' : ''}`}
                      onClick={() => toggleCategory(cat)}
                      style={{ '--cat-color': info.color } as React.CSSProperties}
                    >
                      <span className="nearby-filter-icon">{info.icon}</span>
                      <span className="nearby-filter-label">{info.label}</span>
                      <span className="nearby-filter-count">{count}</span>
                    </button>
                  );
                })}
              </div>

              <div className="nearby-status">
                {loading ? 'Searching...' : `${filteredPois.length} places within ${RADIUS_OPTIONS.find((o) => o.value === radius)?.label}`}
              </div>
            </div>

            {viewMode === 'map' ? (
              <NearbyMap
                userLat={geo.lat}
                userLng={geo.lng}
                pois={filteredPois}
                selectedPoi={selectedPoi}
                onSelectPoi={setSelectedPoi}
                radiusMeters={radius}
              />
            ) : (
              <div className="nearby-list">
                {filteredPois.length === 0 && !loading && (
                  <div className="nearby-empty">No points of interest found within this range. Try increasing the radius.</div>
                )}
                {filteredPois.map((poi) => {
                  const info = getCategoryInfo(poi.category);
                  return (
                    <article
                      key={poi.id}
                      className={`nearby-card${selectedPoi?.id === poi.id ? ' selected' : ''}`}
                      onClick={() => setSelectedPoi(poi)}
                    >
                      <div className="nearby-card-icon" style={{ background: info.color }}>{info.icon}</div>
                      <div className="nearby-card-body">
                        <h3>{poi.name}</h3>
                        <div className="nearby-card-meta">
                          <span className="nearby-card-category">{info.label}</span>
                          <span className="nearby-card-distance">{formatDistance(poi.distance_meters)}</span>
                          {poi.rating && <span className="nearby-card-rating">★ {poi.rating}</span>}
                        </div>
                        {poi.description && (
                          <p className="nearby-card-desc">{poi.description.substring(0, 150)}{poi.description.length > 150 ? '...' : ''}</p>
                        )}
                        {poi.content_url && (
                          <a href={poi.content_url} className="nearby-card-link" onClick={(e) => e.stopPropagation()}>
                            Learn more →
                          </a>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {selectedPoi && viewMode === 'map' && (
              <div className="nearby-detail-panel">
                <button className="nearby-detail-close" onClick={() => setSelectedPoi(null)} aria-label="Close">×</button>
                <div className="nearby-detail-header">
                  <span className="nearby-detail-icon" style={{ background: getCategoryInfo(selectedPoi.category).color }}>
                    {getCategoryInfo(selectedPoi.category).icon}
                  </span>
                  <div>
                    <h2>{selectedPoi.name}</h2>
                    <div className="nearby-detail-meta">
                      <span>{getCategoryInfo(selectedPoi.category).label}</span>
                      <span>{formatDistance(selectedPoi.distance_meters)}</span>
                    </div>
                  </div>
                </div>
                {selectedPoi.description && <p className="nearby-detail-desc">{selectedPoi.description}</p>}
                <div className="nearby-detail-info">
                  {selectedPoi.address && <div>📍 {selectedPoi.address}</div>}
                  {selectedPoi.phone && <div>📞 <a href={`tel:${selectedPoi.phone}`}>{selectedPoi.phone}</a></div>}
                  {selectedPoi.website && <div>🌐 <a href={selectedPoi.website} target="_blank" rel="noopener noreferrer">Website</a></div>}
                  {selectedPoi.rating && <div>★ {selectedPoi.rating}{selectedPoi.reviews ? ` (${selectedPoi.reviews} reviews)` : ''}</div>}
                </div>
                <div className="nearby-detail-actions">
                  <a
                    href={`https://maps.google.com/maps?daddr=${selectedPoi.lat},${selectedPoi.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nearby-nav-btn"
                  >
                    Navigate
                  </a>
                  {selectedPoi.content_url && (
                    <a href={selectedPoi.content_url} className="nearby-detail-btn">Read More</a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {geo.status === 'granted' && (
          <>
            <ProximityToast
              alerts={activeAlerts}
              onDismiss={dismissAlert}
              onSelect={handleAlertSelect}
              onNavigate={handleAlertNavigate}
            />
            <AlertPreferences
              settings={alertSettings}
              onUpdate={handleAlertSettingsUpdate}
              open={alertPrefsOpen}
              onClose={() => setAlertPrefsOpen(false)}
            />
          </>
        )}
      </div>

      <style jsx>{`
        .nearby-page {
          min-height: 100vh;
          background: #f5f5f5;
        }

        .nearby-prompt {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 60px);
          padding: 2rem;
        }

        .nearby-prompt-inner {
          text-align: center;
          max-width: 420px;
        }

        .nearby-prompt-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .nearby-prompt h1 {
          font-family: var(--font-primary);
          font-size: 2rem;
          color: var(--dark);
          margin: 0 0 0.75rem;
        }

        .nearby-prompt p {
          color: var(--text-light);
          line-height: 1.6;
          margin: 0 0 1.5rem;
        }

        .nearby-cta {
          background: var(--primary);
          color: white;
          border: none;
          padding: 0.9rem 2.5rem;
          border-radius: 8px;
          font-size: 1.05rem;
          font-family: var(--font-primary);
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .nearby-cta:hover {
          background: var(--dark);
        }

        .nearby-note {
          font-size: 0.8rem;
          color: #999;
          margin-top: 1rem;
        }

        .nearby-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e0e0e0;
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .nearby-active {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 60px);
          position: relative;
        }

        .nearby-controls {
          background: white;
          border-bottom: 1px solid #e0e0e0;
          padding: 0.5rem 1rem;
          z-index: 10;
        }

        .nearby-controls-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .nearby-radius-group {
          display: flex;
          gap: 4px;
        }

        .nearby-radius-btn {
          background: #f0f0f0;
          border: 1px solid #ddd;
          padding: 0.3rem 0.7rem;
          border-radius: 6px;
          font-size: 0.8rem;
          cursor: pointer;
          font-family: var(--font-primary);
          transition: all 0.15s;
        }

        .nearby-radius-btn.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        .nearby-right-controls {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .nearby-alert-bell {
          background: #f0f0f0;
          border: 1px solid #ddd;
          width: 34px;
          height: 34px;
          border-radius: 8px;
          font-size: 1.1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
          position: relative;
        }

        .nearby-alert-bell.active {
          background: var(--primary);
          border-color: var(--primary);
          animation: bell-pulse 2s ease-in-out infinite;
        }

        @keyframes bell-pulse {
          0%, 100% { box-shadow: none; }
          50% { box-shadow: 0 0 0 3px rgba(59, 105, 120, 0.2); }
        }

        .nearby-view-toggle {
          display: flex;
          gap: 2px;
          background: #f0f0f0;
          border-radius: 8px;
          padding: 2px;
        }

        .nearby-view-toggle button {
          background: none;
          border: none;
          padding: 0.3rem 0.6rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
          transition: background 0.15s;
        }

        .nearby-view-toggle button.active {
          background: white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .nearby-category-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          padding: 0.25rem 0;
        }

        .nearby-filter-meta {
          background: none;
          border: 1px solid #ccc;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          cursor: pointer;
          color: #666;
          font-family: var(--font-primary);
        }

        .nearby-filter-btn {
          display: flex;
          align-items: center;
          gap: 3px;
          background: #f5f5f5;
          border: 1px solid #ddd;
          padding: 0.2rem 0.5rem;
          border-radius: 16px;
          font-size: 0.7rem;
          cursor: pointer;
          transition: all 0.15s;
          font-family: var(--font-secondary);
        }

        .nearby-filter-btn.active {
          background: white;
          border-color: var(--cat-color);
          box-shadow: inset 0 0 0 1px var(--cat-color);
        }

        .nearby-filter-icon {
          font-size: 0.85rem;
        }

        .nearby-filter-count {
          background: #e8e8e8;
          padding: 0 4px;
          border-radius: 8px;
          font-size: 0.65rem;
          min-width: 16px;
          text-align: center;
        }

        .nearby-filter-btn.active .nearby-filter-count {
          background: var(--cat-color);
          color: white;
        }

        .nearby-status {
          font-size: 0.75rem;
          color: #888;
          padding: 0.25rem 0;
          font-family: var(--font-primary);
        }

        .nearby-list {
          flex: 1;
          overflow-y: auto;
          padding: 0.5rem;
        }

        .nearby-empty {
          text-align: center;
          padding: 3rem 1rem;
          color: #999;
        }

        .nearby-card {
          display: flex;
          gap: 0.75rem;
          background: white;
          border-radius: 10px;
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          cursor: pointer;
          border: 2px solid transparent;
          transition: border-color 0.15s, box-shadow 0.15s;
        }

        .nearby-card:hover,
        .nearby-card.selected {
          border-color: var(--primary);
          box-shadow: 0 2px 8px rgba(59,105,120,0.12);
        }

        .nearby-card-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          flex-shrink: 0;
        }

        .nearby-card-body {
          flex: 1;
          min-width: 0;
        }

        .nearby-card-body h3 {
          margin: 0;
          font-size: 0.95rem;
          font-family: var(--font-primary);
          color: var(--dark);
          line-height: 1.3;
        }

        .nearby-card-meta {
          display: flex;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: #888;
          margin-top: 0.15rem;
          flex-wrap: wrap;
        }

        .nearby-card-distance {
          font-weight: 600;
          color: var(--primary);
        }

        .nearby-card-rating {
          color: #e67e22;
        }

        .nearby-card-desc {
          font-size: 0.8rem;
          color: #666;
          margin: 0.4rem 0 0;
          line-height: 1.4;
        }

        .nearby-card-link {
          font-size: 0.8rem;
          color: var(--primary);
          text-decoration: none;
          font-weight: 600;
          font-family: var(--font-primary);
        }

        .nearby-card-link:hover {
          text-decoration: underline;
        }

        .nearby-detail-panel {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          border-radius: 16px 16px 0 0;
          box-shadow: 0 -4px 20px rgba(0,0,0,0.15);
          padding: 1.25rem;
          z-index: 20;
          max-height: 55vh;
          overflow-y: auto;
          animation: slideUp 0.25s ease-out;
        }

        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        .nearby-detail-close {
          position: absolute;
          top: 0.5rem;
          right: 0.75rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #999;
          padding: 0.25rem;
          line-height: 1;
        }

        .nearby-detail-header {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .nearby-detail-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .nearby-detail-header h2 {
          margin: 0;
          font-size: 1.15rem;
          font-family: var(--font-primary);
          color: var(--dark);
        }

        .nearby-detail-meta {
          display: flex;
          gap: 0.75rem;
          font-size: 0.8rem;
          color: #888;
          margin-top: 0.15rem;
        }

        .nearby-detail-desc {
          font-size: 0.85rem;
          color: #555;
          line-height: 1.5;
          margin: 0.75rem 0;
        }

        .nearby-detail-info {
          font-size: 0.8rem;
          color: #666;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          margin: 0.75rem 0;
        }

        .nearby-detail-info a {
          color: var(--primary);
        }

        .nearby-detail-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .nearby-nav-btn {
          flex: 1;
          background: var(--primary);
          color: white;
          text-align: center;
          padding: 0.7rem;
          border-radius: 8px;
          text-decoration: none;
          font-family: var(--font-primary);
          font-weight: 600;
          font-size: 0.9rem;
        }

        .nearby-detail-btn {
          flex: 1;
          background: #f0f0f0;
          color: var(--dark);
          text-align: center;
          padding: 0.7rem;
          border-radius: 8px;
          text-decoration: none;
          font-family: var(--font-primary);
          font-weight: 600;
          font-size: 0.9rem;
        }

        @media (min-width: 769px) {
          .nearby-detail-panel {
            left: auto;
            width: 400px;
            bottom: 1rem;
            right: 1rem;
            border-radius: 16px;
            max-height: 70vh;
          }

          .nearby-active {
            height: calc(100vh - 60px);
          }
        }

        @media (max-width: 768px) {
          .nearby-active {
            height: calc(100vh - 60px - var(--bottom-nav-height));
          }

          .nearby-radius-btn {
            padding: 0.25rem 0.5rem;
            font-size: 0.75rem;
          }

          .nearby-filter-label {
            display: none;
          }

          .nearby-card {
            padding: 0.6rem;
          }
        }
      `}</style>
    </>
  );
}
