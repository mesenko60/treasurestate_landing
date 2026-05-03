import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  MSDI_CONSERVATION_EASEMENTS_TILES,
  MSDI_PARCELS_TILES,
  MSDI_PLSS_TILES,
  MSDI_PUBLIC_LANDS_TILES,
} from '../lib/msdiCadastralTiles';
import { trackMapInteraction } from '../lib/gtag';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

const SOURCE_PUBLIC = 'msdi-public-lands';
const SOURCE_CE = 'msdi-conservation';
const SOURCE_PARCELS = 'msdi-parcels';
const SOURCE_PLSS = 'msdi-plss';
const SOURCE_HUNTING = 'hunting-area-markers';

const LAYER_PUBLIC = `${SOURCE_PUBLIC}-raster`;
const LAYER_CE = `${SOURCE_CE}-raster`;
const LAYER_PARCELS = `${SOURCE_PARCELS}-raster`;
const LAYER_PLSS = `${SOURCE_PLSS}-raster`;
const LAYER_HUNTING = `${SOURCE_HUNTING}-circles`;

export type HuntingMarker = {
  name: string;
  slug: string;
  lat: number;
  lng: number;
  category: string;
};

const CATEGORY_COLORS: Record<string, string> = {
  wma: '#5a8a5c',
  'national-forest': '#3b6978',
  'national-wildlife-refuge': '#7a6b3d',
  blm: '#a0522d',
};

const PARCEL_MIN_ZOOM = 12;

export type LayerToggleId = 'publicLands' | 'conservation' | 'parcels' | 'plss' | 'huntingMarkers';

/** Initial visibility for MSDI overlays */
export const DEFAULT_LAYER_TOGGLES: Record<LayerToggleId, boolean> = {
  publicLands: true,
  conservation: true,
  parcels: false,
  plss: true,
  huntingMarkers: true,
};

function buildHuntingGeoJson(markers: HuntingMarker[]) {
  return {
    type: 'FeatureCollection' as const,
    features: markers.map((m) => ({
      type: 'Feature' as const,
      properties: {
        slug: m.slug,
        name: m.name,
        category: m.category,
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [m.lng, m.lat],
      },
    })),
  };
}

function addRasterPair(
  map: mapboxgl.Map,
  sourceId: string,
  layerId: string,
  tilesTemplate: string,
  beforeLayerId?: string,
) {
  if (map.getSource(sourceId)) return;
  map.addSource(sourceId, {
    type: 'raster',
    tiles: [tilesTemplate],
    tileSize: 256,
    attribution:
      '<a href="https://msl.mt.gov/geoinfo/msdi/cadastral/" rel="noopener noreferrer">Montana State Library (MSDI)</a>',
  });
  const before = beforeLayerId && map.getLayer(beforeLayerId) ? beforeLayerId : undefined;
  map.addLayer(
    {
      id: layerId,
      type: 'raster',
      source: sourceId,
      paint: { 'raster-opacity': 0.82, 'raster-resampling': 'linear' },
    },
    before,
  );
}

export default function LandOwnershipMap({
  height = '560px',
  huntingMarkers,
  ariaLabel = 'Interactive Montana cadastral and public lands map',
}: {
  height?: string;
  huntingMarkers: HuntingMarker[];
  ariaLabel?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const huntingGeoInitial = useRef(huntingMarkers);
  const [ready, setReady] = useState(false);
  const [noToken] = useState(() => !MAPBOX_TOKEN.trim());
  const togglesRef = useRef({ ...DEFAULT_LAYER_TOGGLES });
  const [toggles, setToggles] = useState({ ...DEFAULT_LAYER_TOGGLES });

  huntingGeoInitial.current = huntingMarkers;

  useEffect(() => {
    togglesRef.current = toggles;
  }, [toggles]);

  /** GeoJSON keyed by slug list changes */
  const huntingGeoJson = useMemo(() => buildHuntingGeoJson(huntingMarkers), [huntingMarkers]);

  /** Apply MSDI overlay + hunting visibility from ref (used from map load + zoom handlers) */
  const applyVisibility = useCallback((map: mapboxgl.Map) => {
    const t = togglesRef.current;

    const vis = (layerId: string, on: boolean) => {
      if (map.getLayer(layerId)) map.setLayoutProperty(layerId, 'visibility', on ? 'visible' : 'none');
    };

    vis(LAYER_PUBLIC, t.publicLands);
    vis(LAYER_CE, t.conservation);

    const z = map.getZoom();
    /** Parcels raster is heavy; fade to 0 when zoom is too wide or toggle is off */
    if (map.getLayer(LAYER_PARCELS)) {
      map.setLayoutProperty(LAYER_PARCELS, 'visibility', 'visible');
      map.setPaintProperty(LAYER_PARCELS, 'raster-opacity', t.parcels && z >= PARCEL_MIN_ZOOM ? 0.72 : 0);
    }

    vis(LAYER_PLSS, t.plss);
    vis(LAYER_HUNTING, t.huntingMarkers);
  }, []);

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
        '<a href="https://msl.mt.gov/geoinfo/msdi/cadastral/">© Montana MSDI Cadastral</a>',
      ],
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    mapRef.current = map;

    map.once('load', () => {
      if (canceled || !mapRef.current) return;

      addRasterPair(map, SOURCE_PUBLIC, LAYER_PUBLIC, MSDI_PUBLIC_LANDS_TILES);
      addRasterPair(map, SOURCE_CE, LAYER_CE, MSDI_CONSERVATION_EASEMENTS_TILES, LAYER_PUBLIC);
      addRasterPair(map, SOURCE_PARCELS, LAYER_PARCELS, MSDI_PARCELS_TILES, LAYER_CE);
      addRasterPair(map, SOURCE_PLSS, LAYER_PLSS, MSDI_PLSS_TILES, LAYER_PARCELS);

      const initialData = buildHuntingGeoJson(huntingGeoInitial.current);
      map.addSource(SOURCE_HUNTING, {
        type: 'geojson',
        data: initialData,
      });

      map.addLayer({
        id: LAYER_HUNTING,
        type: 'circle',
        source: SOURCE_HUNTING,
        paint: {
          'circle-radius': 8,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-color': [
            'match',
            ['get', 'category'],
            'wma',
            CATEGORY_COLORS.wma,
            'national-forest',
            CATEGORY_COLORS['national-forest'],
            'national-wildlife-refuge',
            CATEGORY_COLORS['national-wildlife-refuge'],
            'blm',
            CATEGORY_COLORS.blm,
            '#204051',
          ],
          'circle-opacity': 0.95,
        },
      });

      applyVisibility(map);

      setReady(true);
    });

    const onMoveEnd = () => {
      applyVisibility(map);
    };
    map.on('moveend', onMoveEnd);

    return () => {
      canceled = true;
      map.off('moveend', onMoveEnd);
      popupRef.current?.remove();
      popupRef.current = null;
      map.remove();
      mapRef.current = null;
      setReady(false);
    };
  }, [noToken, applyVisibility]);

  useEffect(() => {
    const map = mapRef.current;
    const src = map?.getSource(SOURCE_HUNTING) as mapboxgl.GeoJSONSource | undefined;
    if (src && ready) src.setData(huntingGeoJson);
  }, [huntingGeoJson, ready]);

  useEffect(() => {
    const map = mapRef.current;
    if (map && ready) applyVisibility(map);
  }, [toggles, ready, applyVisibility]);

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

    const setPointer = () => map.getCanvas().style.setProperty('cursor', 'pointer');
    const clearPointer = () => map.getCanvas().style.setProperty('cursor', '');
    map.on('click', LAYER_HUNTING, onCircleClick);
    map.on('mouseenter', LAYER_HUNTING, setPointer);
    map.on('mouseleave', LAYER_HUNTING, clearPointer);

    return () => {
      map.off('click', LAYER_HUNTING, onCircleClick);
      map.off('mouseenter', LAYER_HUNTING, setPointer);
      map.off('mouseleave', LAYER_HUNTING, clearPointer);
    };
  }, [ready, noToken]);

  const toggle = useCallback((id: LayerToggleId) => {
    setToggles((prev) => {
      trackMapInteraction(`land_own_toggle:${id}`);
      return { ...prev, [id]: !prev[id] };
    });
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

  return (
    <div
      style={{
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        marginBottom: '1.25rem',
        background: '#fff',
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
          Map unavailable: configure <code style={{ padding: '0 4px' }}>NEXT_PUBLIC_MAPBOX_TOKEN</code> for Montana cadastral layers.
        </div>
      ) : (
        <>
          <div ref={containerRef} style={{ width: '100%', height }} aria-label={ariaLabel} role="img" />

          {/* Layer toggles */}
          <nav
            aria-label="Cadastral map layers"
            style={{
              padding: '0.65rem 1rem',
              borderTop: '1px solid #e8eef0',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.45rem',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#204051',
                width: '100%',
                marginBottom: '0.1rem',
              }}
            >
              Layers (Montana State Library Web Mercator services)
            </span>
            {(
              [
                ['publicLands', 'Public lands'] as const,
                ['conservation', 'Conservation easements'] as const,
                ['parcels', `Parcels (zoom ≥ ${PARCEL_MIN_ZOOM})`] as const,
                ['plss', 'PLSS grid'] as const,
                ['huntingMarkers', 'Hunting guide areas'] as const,
              ] as const
            ).map(([id, label]) => (
              <button key={id} type="button" style={chipStyle(toggles[id])} onClick={() => toggle(id)}>
                {label}
              </button>
            ))}
          </nav>

          <p style={{ margin: '0', padding: '0 1rem 0.75rem', fontSize: '0.68rem', color: '#71808a', lineHeight: 1.45 }}>
            Raster tiles load from live MSDI endpoints; cadastral is updated roughly monthly.

            Parcel boundaries appear only above zoom {PARCEL_MIN_ZOOM}. Not for legal, engineering, or surveying use.
          </p>
        </>
      )}
    </div>
  );
}
