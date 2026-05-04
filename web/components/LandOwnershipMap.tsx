import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { FeatureCollection } from 'geojson';
import LandLegend from './LandLegend';
import {
  CATEGORY_COLORS,
  EMPTY_FC,
  LAYER_HUNTING,
  LAYER_PARCELS,
  LAYER_PLSS,
  LAYER_PUBLIC,
  LAYER_PUBLIC_VEC_FILL,
  LAYER_CE,
  SOURCE_HUNTING,
  SOURCE_PUBLIC_VEC,
  addMontanaCadastralLayers,
  buildHuntingGeoJson,
  ensurePlssRasterLayer,
  toMapGeoJSON,
  type HuntingMarker,
} from '../lib/montanaCadastralMapLayers';
import { PUBLIC_LAND_SEMANTICS, type PublicLandTier } from '../lib/classifyMontanaPublicOwner';
import { fetchMsdiPublicLandPatches } from '../lib/fetchMsdiPublicLandPatches';
import { trackMapInteraction } from '../lib/gtag';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

const PARCEL_MIN_ZOOM = 12;
/** Treasure State categorical fills load above this zoom; below it the MSDI public-lands raster provides context. */
const VECTOR_PUBLIC_MIN_ZOOM = 11;

export type { HuntingMarker };

export type LayerToggleId = 'publicLands' | 'conservation' | 'parcels' | 'plss' | 'huntingMarkers';

/** Initial visibility for MSDI overlays */
export const DEFAULT_LAYER_TOGGLES: Record<LayerToggleId, boolean> = {
  publicLands: true,
  conservation: true,
  parcels: false,
  plss: false,
  huntingMarkers: true,
};

function resizeMapSoon(map: mapboxgl.Map | null) {
  if (!map) return;
  requestAnimationFrame(() => {
    map.resize();
    requestAnimationFrame(() => map.resize());
  });
}

export default function LandOwnershipMap({
  height = '560px',
  huntingMarkers,
  ariaLabel = 'Interactive Montana land ownership map: parcels and public lands',
}: {
  height?: string;
  huntingMarkers: HuntingMarker[];
  ariaLabel?: string;
}) {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const huntingGeoInitial = useRef(huntingMarkers);
  const vecDebounceRef = useRef<number | undefined>(undefined);
  const vecAbortRef = useRef<AbortController | null>(null);
  const lastVectorFetchKey = useRef<string>('');
  const [ready, setReady] = useState(false);
  const [fullscreenUi, setFullscreenUi] = useState(false);
  const [noToken] = useState(() => !MAPBOX_TOKEN.trim());
  const togglesRef = useRef({ ...DEFAULT_LAYER_TOGGLES });
  const [toggles, setToggles] = useState({ ...DEFAULT_LAYER_TOGGLES });

  huntingGeoInitial.current = huntingMarkers;

  useEffect(() => {
    togglesRef.current = toggles;
  }, [toggles]);

  useEffect(() => {
    const onFullscreenChange = () => {
      const shell = shellRef.current;
      const root = typeof document !== 'undefined' ? document : null;
      if (!shell || !root) return;
      const active =
        root.fullscreenElement === shell ||
        (root as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement === shell;
      setFullscreenUi(active);
      resizeMapSoon(mapRef.current);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange as EventListener);
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange as EventListener);
    };
  }, []);

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
        const bboxKey = `${map.getZoom().toFixed(2)}:${b.getWest().toFixed(4)},${b.getSouth().toFixed(4)},${b.getEast().toFixed(4)},${b.getNorth().toFixed(4)}`;
        if (bboxKey === lastVectorFetchKey.current) {
          return;
        }

        const fc = await fetchMsdiPublicLandPatches(
          b.getWest(),
          b.getSouth(),
          b.getEast(),
          b.getNorth(),
          { signal: sig },
        );

        geoSrc.setData(toMapGeoJSON(fc));
        lastVectorFetchKey.current = bboxKey;
      } catch (e: unknown) {
        const aborted = typeof e === 'object' && e !== null && (e as { name?: string }).name === 'AbortError';
        if (!aborted && geoSrc) {
          geoSrc.setData(toMapGeoJSON(EMPTY_FC));
        }
      } finally {
        if (mapRef.current) applyVisibility(mapRef.current);
      }
    }, 320);
  }, [applyVisibility]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || noToken) return;

    let canceled = false;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: el,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [-109.5, 46.9],
      zoom: 6.2,
      cooperativeGestures: true,
      customAttribution: [
        '<a href="https://www.mapbox.com/about/maps/">© Mapbox</a>',
        '<a href="https://msl.mt.gov/geoinfo/msdi/cadastral/">Montana GIS (MSL)</a>',
      ],
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    mapRef.current = map;

    map.once('load', () => {
      if (canceled || !mapRef.current) return;

      addMontanaCadastralLayers(map, huntingGeoInitial.current);
      if (togglesRef.current.plss) ensurePlssRasterLayer(map);

      map.on('idle', scheduleVectorReload);
      queueMicrotask(scheduleVectorReload);

      applyVisibility(map);

      setReady(true);
    });

    const onMoveEnd = () => {
      applyVisibility(map);
    };
    map.on('moveend', onMoveEnd);

    return () => {
      canceled = true;
      window.clearTimeout(vecDebounceRef.current);
      vecAbortRef.current?.abort();
      map.off('moveend', onMoveEnd);
      map.off('idle', scheduleVectorReload);
      popupRef.current?.remove();
      popupRef.current = null;
      map.remove();
      mapRef.current = null;
      setReady(false);
    };
  }, [noToken, applyVisibility, scheduleVectorReload]);

  useEffect(() => {
    const map = mapRef.current;
    const src = map?.getSource(SOURCE_HUNTING) as mapboxgl.GeoJSONSource | undefined;
    if (src && ready) src.setData(toMapGeoJSON(huntingGeoJson));
  }, [huntingGeoJson, ready]);

  useEffect(() => {
    const map = mapRef.current;
    if (map && ready) {
      if (toggles.plss) ensurePlssRasterLayer(map);
      applyVisibility(map);
      scheduleVectorReload();
    }
  }, [toggles, ready, applyVisibility, scheduleVectorReload]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || noToken || !ready) return;

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
          `
          <div style="padding:6px 4px;font-family:sans-serif;max-width:220px;color:#222">
            <strong style="font-size:0.92rem">${name}</strong>
            <div style="font-size:0.74rem;color:${dot};font-weight:600;margin-top:3px;text-transform:capitalize">${escapeHtml(category.replace(/-/g, ' '))}</div>
            <a href="/guides/hunting-guide/#${slug}" style="display:inline-block;margin-top:6px;font-size:0.78rem;color:#3b6978;font-weight:600;text-decoration:none">Open in hunting guide ↓</a>
          </div>
        `,
        )
        .addTo(map);

      trackMapInteraction(`land_own_hunt_click:${slugRaw}`);
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
          `
          <div style="padding:8px 6px;font-family:sans-serif;max-width:240px;color:#222">
            <div style="font-size:0.68rem;text-transform:uppercase;letter-spacing:0.04em;color:${sem.outline};font-weight:700">
              MSDI PUBLIC LANDS
            </div>
            <strong style="font-size:0.93rem;display:block;margin-top:4px;color:#204051">${owner}</strong>
            <div style="font-size:0.78rem;line-height:1.45;color:#455;margin-top:6px">${escapeHtml(sem.label)}</div>
          </div>
        `,
        )
        .addTo(map);

      trackMapInteraction(`land_own_public_polygon:${tier}`);
    };

    const setPointer = () => map.getCanvas().style.setProperty('cursor', 'pointer');
    const clearPointer = () => map.getCanvas().style.setProperty('cursor', '');
    map.on('click', LAYER_HUNTING, onCircleClick);
    map.on('mouseenter', LAYER_HUNTING, setPointer);
    map.on('mouseleave', LAYER_HUNTING, clearPointer);

    map.on('click', LAYER_PUBLIC_VEC_FILL, onPubClick);
    map.on('mouseenter', LAYER_PUBLIC_VEC_FILL, setPointer);
    map.on('mouseleave', LAYER_PUBLIC_VEC_FILL, clearPointer);

    return () => {
      map.off('click', LAYER_HUNTING, onCircleClick);
      map.off('mouseenter', LAYER_HUNTING, setPointer);
      map.off('mouseleave', LAYER_HUNTING, clearPointer);
      map.off('click', LAYER_PUBLIC_VEC_FILL, onPubClick);
      map.off('mouseenter', LAYER_PUBLIC_VEC_FILL, setPointer);
      map.off('mouseleave', LAYER_PUBLIC_VEC_FILL, clearPointer);
    };
  }, [ready, noToken]);

  const toggle = useCallback((id: LayerToggleId) => {
    setToggles((prev) => {
      trackMapInteraction(`land_own_toggle:${id}`);
      return { ...prev, [id]: !prev[id] };
    });
  }, []);

  const toggleFullscreen = useCallback(() => {
    const shell = shellRef.current;
    if (!shell) return;
    const doc = document as Document & {
      webkitExitFullscreen?: () => Promise<void> | void;
      webkitFullscreenElement?: Element | null;
    };
    const el = shell as HTMLElement & {
      webkitRequestFullscreen?: (allowKeyboard?: boolean) => Promise<void> | void;
      msRequestFullscreen?: () => Promise<void> | void;
    };
    const fsActive = document.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
    if (!fsActive) {
      const p = shell.requestFullscreen?.() ?? el.webkitRequestFullscreen?.() ?? el.msRequestFullscreen?.();
      Promise.resolve(p as Promise<void> | void)
        .then(() => undefined)
        .catch(() => undefined)
        .finally(() => {
          trackMapInteraction('land_own_fullscreen:on');
          resizeMapSoon(mapRef.current);
        });
      return;
    }
    if (fsActive === shell) {
      Promise.resolve(document.exitFullscreen?.() ?? doc.webkitExitFullscreen?.())
        .then(() => undefined)
        .catch(() => undefined)
        .finally(() => {
          trackMapInteraction('land_own_fullscreen:off');
          resizeMapSoon(mapRef.current);
        });
    }
  }, []);

  const chipStyle = (
    active: boolean,
  ): React.CSSProperties => ({
    cursor: 'pointer',
    padding: '0.35rem 0.65rem',
    borderRadius: '999px',
    border: active ? '2px solid #3b6978' : '1px solid #d4e4ec',
    background: active ? '#f0f7fa' : '#fff',
    fontSize: '0.78rem',
    fontWeight: active ? 700 : 500,
    color: '#204051',
    fontFamily: 'var(--font-primary, sans-serif)',
  });

  const shellStyle: React.CSSProperties = fullscreenUi
    ? {
        borderRadius: 0,
        marginBottom: 0,
        height: '100vh',
        maxHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        overflowX: 'hidden',
      }
    : {};

  const mapViewportStyle: React.CSSProperties = fullscreenUi
    ? {
        position: 'relative',
        flex: '1 1 auto',
        minHeight: 0,
        width: '100%',
      }
    : { position: 'relative', width: '100%', height };

  const fsBtnStyle: React.CSSProperties = {
    position: 'absolute',
    zIndex: 2,
    top: 10,
    left: 10,
    padding: '0.35rem 0.65rem',
    borderRadius: 8,
    border: '1px solid rgba(0,0,0,0.12)',
    background: 'rgba(255,255,255,0.92)',
    color: '#204051',
    fontSize: '0.74rem',
    fontWeight: 700,
    fontFamily: 'var(--font-primary, sans-serif)',
    cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  };

  return (
    <div
      ref={shellRef}
      style={{
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        marginBottom: '1.25rem',
        background: '#fff',
        ...shellStyle,
      }}
    >
      {noToken ? (
        <div
          role="note"
          style={{
            height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            textAlign: 'center',
            background: '#f5f9f8',
            color: '#555',
          }}
        >
          Map unavailable: configure <code style={{ padding: '0 4px' }}>NEXT_PUBLIC_MAPBOX_TOKEN</code> for Montana land GIS layers (parcels / public lands).
        </div>
      ) : (
        <>
          <div style={mapViewportStyle}>
            <button type="button" style={fsBtnStyle} onClick={toggleFullscreen} aria-pressed={fullscreenUi}>
              {fullscreenUi ? 'Exit full screen' : 'Full screen'}
            </button>
            <div ref={containerRef} style={{ width: '100%', height: fullscreenUi ? '100%' : '100%' }} aria-label={ariaLabel} role="img" />
          </div>

          <LandLegend defaultExpanded fullscreenActive={fullscreenUi} />

          <nav
            aria-label="Land ownership map GIS layers"
            style={{
              padding: '0.65rem 1rem',
              borderTop: '1px solid #e8eef0',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.45rem',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#204051', width: '100%', marginBottom: '0.1rem' }}>
              Layers (MSDI)
            </span>
            {(
              [
                ['publicLands', 'Public lands'] as const,
                ['conservation', 'Conservation easements'] as const,
                ['parcels', `Parcels / lot lines (zoom ≥ ${PARCEL_MIN_ZOOM})`] as const,
                ['plss', 'PLSS grid'] as const,
                ['huntingMarkers', 'Hunting pins'] as const,
              ] as const
            ).map(([id, label]) => (
              <button key={id} type="button" style={chipStyle(toggles[id])} onClick={() => toggle(id)}>
                {label}
              </button>
            ))}
          </nav>
        </>
      )}
    </div>
  );
}
