import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import LandLegend from './LandLegend';
import {
  CATEGORY_COLORS,
  EMPTY_FC,
  LAYER_CE,
  LAYER_HUNTING,
  LAYER_PARCELS,
  LAYER_PLSS,
  LAYER_PUBLIC,
  LAYER_PUBLIC_VEC_FILL,
  SOURCE_HUNTING,
  SOURCE_MAPBOX_TERRAIN,
  SOURCE_PUBLIC_VEC,
  addMontanaCadastralLayers,
  buildHuntingGeoJson,
  ensureMapboxTerrainDemSource,
  syncHybridHillshadeOverlay,
  toMapGeoJSON,
  type HuntingMarker,
} from '../lib/montanaCadastralMapLayers';
import { PUBLIC_LAND_SEMANTICS, type PublicLandTier } from '../lib/classifyMontanaPublicOwner';
import { fetchMsdiPublicLandPatches } from '../lib/fetchMsdiPublicLandPatches';
import { trackMapInteraction } from '../lib/gtag';

export type { HuntingMarker };

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

const BASEMAP_STYLES = {
  topo: 'mapbox://styles/mapbox/outdoors-v12',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  /** Same Mapbox style as satellite; Hybrid adds DEM hillshade below MSDI overlays. */
  hybrid: 'mapbox://styles/mapbox/satellite-streets-v12',
} as const;

export type BasemapId = keyof typeof BASEMAP_STYLES;

export type LayerToggleId = 'publicLands' | 'conservation' | 'parcels' | 'plss' | 'huntingMarkers';

const DEFAULT_TOGGLES: Record<LayerToggleId, boolean> = {
  publicLands: true,
  conservation: true,
  parcels: false,
  plss: true,
  huntingMarkers: true,
};

const PARCEL_MIN_ZOOM = 12;
const VECTOR_PUBLIC_MIN_ZOOM = 12;
/** Skip MSDI GeoJSON fetch when viewport span exceeds this (degrees). */
const MAX_VECTOR_VIEWPORT_SPAN_DEG = 0.35;

function resizeMapSoon(map: mapboxgl.Map | null) {
  if (!map) return;
  requestAnimationFrame(() => {
    map.resize();
    requestAnimationFrame(() => map.resize());
  });
}

export default function MontanaMapApp({ huntingMarkers }: { huntingMarkers: HuntingMarker[] }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const huntingMarkersRef = useRef(huntingMarkers);
  const terrain3dRef = useRef(false);
  const togglesRef = useRef({ ...DEFAULT_TOGGLES });
  const vecDebounceRef = useRef<number | undefined>(undefined);
  const vecAbortRef = useRef<AbortController | null>(null);
  const lastVectorFetchKey = useRef('');
  const interactionCleanupRef = useRef<(() => void) | undefined>(undefined);
  const basemapIdRef = useRef<BasemapId>('topo');

  const [noToken] = useState(() => !MAPBOX_TOKEN.trim());
  const [mapReady, setMapReady] = useState(false);
  const [basemapId, setBasemapId] = useState<BasemapId>('topo');
  const [terrain3d, setTerrain3d] = useState(false);
  const [layersOpen, setLayersOpen] = useState(false);
  const [toggles, setToggles] = useState({ ...DEFAULT_TOGGLES });

  huntingMarkersRef.current = huntingMarkers;
  terrain3dRef.current = terrain3d;
  basemapIdRef.current = basemapId;

  useEffect(() => {
    togglesRef.current = toggles;
  }, [toggles]);

  const huntingGeoJson = useMemo(() => buildHuntingGeoJson(huntingMarkers), [huntingMarkers]);

  const applyVisibility = useCallback((map: mapboxgl.Map) => {
    const t = togglesRef.current;
    const vis = (layerId: string, on: boolean) => {
      if (map.getLayer(layerId)) map.setLayoutProperty(layerId, 'visibility', on ? 'visible' : 'none');
    };
    const z = map.getZoom();
    const useVectorClasses = t.publicLands && z >= VECTOR_PUBLIC_MIN_ZOOM;

    if (map.getLayer(LAYER_PUBLIC)) {
      map.setLayoutProperty(LAYER_PUBLIC, 'visibility', t.publicLands ? 'visible' : 'none');
      const rasterOp = !t.publicLands ? 0 : useVectorClasses ? 0 : 0.78;
      map.setPaintProperty(LAYER_PUBLIC, 'raster-opacity', rasterOp);
    }

    vis(LAYER_PUBLIC_VEC_FILL, useVectorClasses);
    vis(LAYER_CE, t.conservation);

    if (map.getLayer(LAYER_PARCELS)) {
      map.setLayoutProperty(LAYER_PARCELS, 'visibility', 'visible');
      map.setPaintProperty(LAYER_PARCELS, 'raster-opacity', t.parcels && z >= PARCEL_MIN_ZOOM ? 0.72 : 0);
    }

    vis(LAYER_PLSS, t.plss);
    vis(LAYER_HUNTING, t.huntingMarkers);
  }, []);

  const scheduleVectorReload = useCallback(() => {
    if (typeof window === 'undefined') return;
    window.clearTimeout(vecDebounceRef.current);
    vecDebounceRef.current = window.setTimeout(async () => {
      const map = mapRef.current;
      if (!map) return;
      const geoSrc = map.getSource(SOURCE_PUBLIC_VEC) as mapboxgl.GeoJSONSource | undefined;
      if (!geoSrc) return;

      vecAbortRef.current?.abort();
      vecAbortRef.current = new AbortController();
      const sig = vecAbortRef.current.signal;

      try {
        if (!togglesRef.current.publicLands || map.getZoom() < VECTOR_PUBLIC_MIN_ZOOM) {
          geoSrc.setData(toMapGeoJSON(EMPTY_FC));
          lastVectorFetchKey.current = '';
          applyVisibility(map);
          return;
        }

        const b = map.getBounds() as mapboxgl.LngLatBounds;
        const span = Math.max(b.getEast() - b.getWest(), b.getNorth() - b.getSouth());
        if (span > MAX_VECTOR_VIEWPORT_SPAN_DEG) {
          geoSrc.setData(toMapGeoJSON(EMPTY_FC));
          lastVectorFetchKey.current = '';
          applyVisibility(map);
          return;
        }

        const bboxKey = `${map.getZoom().toFixed(2)}:${b.getWest().toFixed(4)},${b.getSouth().toFixed(4)},${b.getEast().toFixed(4)},${b.getNorth().toFixed(4)}`;
        if (bboxKey === lastVectorFetchKey.current) return;

        const fc = await fetchMsdiPublicLandPatches(b.getWest(), b.getSouth(), b.getEast(), b.getNorth(), {
          signal: sig,
        });

        geoSrc.setData(toMapGeoJSON(fc));
        lastVectorFetchKey.current = bboxKey;
      } catch (e: unknown) {
        const aborted = typeof e === 'object' && e !== null && (e as { name?: string }).name === 'AbortError';
        if (!aborted && geoSrc) geoSrc.setData(toMapGeoJSON(EMPTY_FC));
      } finally {
        if (mapRef.current) applyVisibility(mapRef.current);
      }
    }, 320);
  }, [applyVisibility]);

  const applyTerrainVisual = useCallback((map: mapboxgl.Map, enabled: boolean) => {
    ensureMapboxTerrainDemSource(map);
    if (enabled) {
      map.setTerrain({ source: SOURCE_MAPBOX_TERRAIN, exaggeration: 1.45 });
      map.setFog({
        range: [0.5, 10],
        color: '#dbeafe',
        'high-color': '#f0f9ff',
        'space-color': '#bcdff1',
        'horizon-blend': 0.05,
      });
      map.easeTo({ pitch: Math.max(map.getPitch(), 52), duration: 600 });
    } else {
      map.easeTo({ pitch: 0, duration: 450 });
      map.setTerrain(null);
      map.setFog({});
    }
  }, []);

  const wireInteractions = useCallback((map: mapboxgl.Map) => {
    interactionCleanupRef.current?.();

    const escapeHtml = (s: string) =>
      s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    const onCircleClick = (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
      const f = e.features?.[0];
      const coords = e.lngLat;
      const nameRaw = f?.properties && (f.properties as { name?: string }).name;
      const slugRaw = f?.properties && (f.properties as { slug?: string }).slug;
      const catRaw = f?.properties && (f.properties as { category?: string }).category;
      if (!nameRaw || !coords) return;
      const name = escapeHtml(String(nameRaw));
      const slug = encodeURIComponent(String(slugRaw ?? ''));
      const category = String(catRaw ?? '');
      const dot = CATEGORY_COLORS[category] || '#204051';

      popupRef.current?.remove();
      popupRef.current = new mapboxgl.Popup({ offset: 12, closeButton: true })
        .setLngLat(coords)
        .setHTML(
          `<div style="padding:6px 4px;font-family:sans-serif;max-width:220px;color:#222">
            <strong style="font-size:0.92rem">${name}</strong>
            <div style="font-size:0.74rem;color:${dot};font-weight:600;margin-top:3px;text-transform:capitalize">${escapeHtml(category.replace(/-/g, ' '))}</div>
            <a href="/guides/hunting-guide/#${slug}" style="display:inline-block;margin-top:6px;font-size:0.78rem;color:#3b6978;font-weight:600;text-decoration:none">Open in hunting guide ↓</a>
          </div>`,
        )
        .addTo(map);
      trackMapInteraction(`montana_map_hunt_click:${slugRaw}`);
    };

    const onPubClick = (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
      const f = e.features?.[0];
      const coords = e.lngLat;
      const props = f?.properties as { tier?: string; OWNER?: string } | undefined;
      if (!props?.tier || !coords) return;
      const tier = props.tier as PublicLandTier;
      const sem = PUBLIC_LAND_SEMANTICS[tier];
      const owner = escapeHtml(String(props.OWNER ?? 'Unknown stewardship'));

      popupRef.current?.remove();
      popupRef.current = new mapboxgl.Popup({ offset: 12, closeButton: true })
        .setLngLat(coords)
        .setHTML(
          `<div style="padding:8px 6px;font-family:sans-serif;max-width:240px;color:#222">
            <div style="font-size:0.68rem;text-transform:uppercase;letter-spacing:0.04em;color:${sem.outline};font-weight:700">MSDI PUBLIC LANDS</div>
            <strong style="font-size:0.93rem;display:block;margin-top:4px;color:#204051">${owner}</strong>
            <div style="font-size:0.78rem;line-height:1.45;color:#455;margin-top:6px">${escapeHtml(sem.label)}</div>
          </div>`,
        )
        .addTo(map);
      trackMapInteraction(`montana_map_public_polygon:${tier}`);
    };

    const setPointer = () => map.getCanvas().style.setProperty('cursor', 'pointer');
    const clearPointer = () => map.getCanvas().style.setProperty('cursor', '');
    map.on('click', LAYER_HUNTING, onCircleClick);
    map.on('mouseenter', LAYER_HUNTING, setPointer);
    map.on('mouseleave', LAYER_HUNTING, clearPointer);
    map.on('click', LAYER_PUBLIC_VEC_FILL, onPubClick);
    map.on('mouseenter', LAYER_PUBLIC_VEC_FILL, setPointer);
    map.on('mouseleave', LAYER_PUBLIC_VEC_FILL, clearPointer);

    interactionCleanupRef.current = () => {
      map.off('click', LAYER_HUNTING, onCircleClick);
      map.off('mouseenter', LAYER_HUNTING, setPointer);
      map.off('mouseleave', LAYER_HUNTING, clearPointer);
      map.off('click', LAYER_PUBLIC_VEC_FILL, onPubClick);
      map.off('mouseenter', LAYER_PUBLIC_VEC_FILL, setPointer);
      map.off('mouseleave', LAYER_PUBLIC_VEC_FILL, clearPointer);
    };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || noToken) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: el,
      style: BASEMAP_STYLES.topo,
      center: [-109.5, 46.9],
      zoom: 6.2,
      cooperativeGestures: false,
      customAttribution: [
        '<a href="https://www.mapbox.com/about/maps/">© Mapbox</a>',
        '<a href="https://msl.mt.gov/geoinfo/msdi/cadastral/">Montana GIS (MSL)</a>',
      ],
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.addControl(new mapboxgl.ScaleControl({ maxWidth: 90, unit: 'imperial' }), 'bottom-left');
    mapRef.current = map;

    const onStyleLoad = () => {
      map.off('idle', scheduleVectorReload);
      lastVectorFetchKey.current = '';

      addMontanaCadastralLayers(map, huntingMarkersRef.current);
      ensureMapboxTerrainDemSource(map);
      syncHybridHillshadeOverlay(map, basemapIdRef.current === 'hybrid');
      applyTerrainVisual(map, terrain3dRef.current);

      wireInteractions(map);

      map.on('idle', scheduleVectorReload);
      queueMicrotask(scheduleVectorReload);
      applyVisibility(map);

      setMapReady(true);
    };

    map.on('style.load', onStyleLoad);

    const onMoveEnd = () => applyVisibility(map);
    map.on('moveend', onMoveEnd);

    const onResize = () => resizeMapSoon(map);
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      interactionCleanupRef.current?.();
      interactionCleanupRef.current = undefined;
      window.clearTimeout(vecDebounceRef.current);
      vecAbortRef.current?.abort();
      map.off('style.load', onStyleLoad);
      map.off('moveend', onMoveEnd);
      map.off('idle', scheduleVectorReload);
      popupRef.current?.remove();
      popupRef.current = null;
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, [noToken, applyVisibility, scheduleVectorReload, applyTerrainVisual, wireInteractions]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    const src = map.getSource(SOURCE_HUNTING) as mapboxgl.GeoJSONSource | undefined;
    if (src) src.setData(toMapGeoJSON(huntingGeoJson));
  }, [huntingGeoJson, mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    applyTerrainVisual(map, terrain3d);
    trackMapInteraction(`montana_map_terrain:${terrain3d ? 'on' : 'off'}`);
  }, [terrain3d, mapReady, applyTerrainVisual]);

  useEffect(() => {
    const map = mapRef.current;
    if (map && mapReady) {
      applyVisibility(map);
      scheduleVectorReload();
    }
  }, [toggles, mapReady, applyVisibility, scheduleVectorReload]);

  const switchBasemap = useCallback(
    (id: BasemapId) => {
      const map = mapRef.current;
      if (!map || !mapReady) return;
      basemapIdRef.current = id;
      setBasemapId(id);
      trackMapInteraction(`montana_map_basemap:${id}`);
      map.setStyle(BASEMAP_STYLES[id]);
    },
    [mapReady],
  );

  const toggleLayer = useCallback((id: LayerToggleId) => {
    setToggles((prev) => {
      trackMapInteraction(`montana_map_toggle:${id}`);
      return { ...prev, [id]: !prev[id] };
    });
  }, []);

  const resetNorth = useCallback(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    map.easeTo({ bearing: 0, pitch: terrain3dRef.current ? Math.max(map.getPitch(), 45) : 0, duration: 400 });
    trackMapInteraction('montana_map_reset_north');
  }, [mapReady]);

  const pill = (active: boolean): React.CSSProperties => ({
    cursor: 'pointer',
    padding: '0.5rem 0.85rem',
    minHeight: 44,
    borderRadius: 999,
    border: active ? '2px solid #204051' : '1px solid rgba(0,0,0,0.14)',
    background: active ? 'rgba(240,247,250,0.96)' : 'rgba(255,255,255,0.94)',
    fontSize: '0.76rem',
    fontWeight: active ? 700 : 600,
    color: '#204051',
    fontFamily: 'var(--font-primary, sans-serif)',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    boxSizing: 'border-box',
  });

  if (noToken) {
    return (
      <div
        role="note"
        style={{
          height: '100%',
          minHeight: 320,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          textAlign: 'center',
          background: '#f5f9f8',
          color: '#555',
        }}
      >
        Map unavailable — add <code style={{ padding: '0 4px' }}>NEXT_PUBLIC_MAPBOX_TOKEN</code> to enable the Montana map.
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="montana-map-root" style={{ position: 'relative', width: '100%', height: '100%', minHeight: 0 }}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
      .montana-map-root button.montana-map-ui-btn:focus-visible,
      .montana-map-root label.montana-map-layer-row:focus-within {
        outline: 2px solid #204051;
        outline-offset: 3px;
        border-radius: 10px;
      }
      .montana-map-root label.montana-map-layer-row:focus-within { outline-offset: 2px; }
    `,
        }}
      />
      <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} aria-label="Montana land ownership full map" role="application" />

      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          alignItems: 'flex-start',
          pointerEvents: 'none',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'auto' }}>
          <button
            type="button"
            className="montana-map-ui-btn"
            style={pill(terrain3d)}
            disabled={!mapReady}
            onClick={() => setTerrain3d((v) => !v)}
            aria-pressed={terrain3d}
          >
            {terrain3d ? '3D terrain on' : '3D terrain off'}
          </button>
          <button type="button" className="montana-map-ui-btn" style={pill(false)} disabled={!mapReady} onClick={resetNorth}>
            Reset north
          </button>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 52,
          right: 12,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 10,
          pointerEvents: 'none',
        }}
      >
        <div style={{ pointerEvents: 'auto', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
          <button
            type="button"
            className="montana-map-ui-btn"
            style={pill(layersOpen)}
            disabled={!mapReady}
            onClick={() => setLayersOpen((o) => !o)}
            aria-expanded={layersOpen}
          >
            Layers
          </button>

          {layersOpen && (
            <div
              style={{
                background: 'rgba(255,255,255,0.96)',
                borderRadius: 12,
                border: '1px solid #e0e8ea',
                padding: '0.65rem 0.75rem',
                maxWidth: 280,
                boxShadow: '0 4px 18px rgba(0,0,0,0.12)',
              }}
            >
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#71808a', marginBottom: 8 }}>Land ownership</div>
              {(
                [
                  ['publicLands', 'Public lands'] as const,
                  ['conservation', 'Conservation easements'] as const,
                  ['parcels', `Parcels (zoom ≥ ${PARCEL_MIN_ZOOM})`] as const,
                  ['plss', 'PLSS grid'] as const,
                  ['huntingMarkers', 'Hunting pins'] as const,
                ] as const
              ).map(([id, label]) => (
                <label
                  key={id}
                  className="montana-map-layer-row"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontSize: '0.8rem',
                    color: '#204051',
                    marginBottom: 4,
                    padding: '6px 2px',
                    minHeight: 44,
                    cursor: 'pointer',
                  }}
                >
                  <input type="checkbox" checked={toggles[id]} onChange={() => toggleLayer(id)} style={{ width: 18, height: 18 }} />
                  {label}
                </label>
              ))}
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #eef2f5', fontSize: '0.72rem', color: '#6a7a82', lineHeight: 1.45 }}>
                MSDI GIS — informational only. See{' '}
                <Link href="/guides/land-ownership/" style={{ color: '#3b6978', fontWeight: 600 }}>
                  land ownership guide
                </Link>{' '}
                for disclaimers.
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end', pointerEvents: 'auto' }}>
            {(['topo', 'satellite', 'hybrid'] as const).map((id) => (
              <button
                key={id}
                type="button"
                className="montana-map-ui-btn"
                disabled={!mapReady}
                title={
                  id === 'hybrid'
                    ? 'Satellite imagery plus shaded relief from elevation data'
                    : id === 'satellite'
                      ? 'Satellite imagery with roads and labels'
                      : 'Topographic map with trails and contours'
                }
                style={{ ...pill(basemapId === id), opacity: mapReady ? 1 : 0.55 }}
                onClick={() => switchBasemap(id)}
              >
                {id === 'topo' ? 'Topo' : id === 'satellite' ? 'Satellite' : 'Hybrid'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 96,
          left: 12,
          zIndex: 10,
          maxWidth: 300,
          maxHeight: '38vh',
          overflow: 'auto',
          pointerEvents: 'auto',
          borderRadius: 12,
          boxShadow: '0 4px 18px rgba(0,0,0,0.1)',
          background: 'rgba(255,255,255,0.94)',
        }}
      >
        <LandLegend defaultExpanded fullscreenActive={false} />
      </div>
    </div>
  );
}
