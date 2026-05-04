/**
 * Shared MSDI cadastral overlays + hunting pins for embedded and full-viewport Montana maps.
 */
import mapboxgl, { type Expression } from 'mapbox-gl';
import type { FeatureCollection } from 'geojson';
import {
  MSDI_CONSERVATION_EASEMENTS_TILES,
  MSDI_PARCELS_TILES,
  MSDI_PLSS_TILES,
  MSDI_PUBLIC_LANDS_TILES,
} from './msdiCadastralTiles';
import { PUBLIC_LAND_SEMANTICS, PUBLIC_LAND_TIER_DISPLAY_ORDER } from './classifyMontanaPublicOwner';

export type HuntingMarker = {
  name: string;
  slug: string;
  lat: number;
  lng: number;
  category: string;
};

export const SOURCE_PUBLIC = 'msdi-public-lands';
export const SOURCE_CE = 'msdi-conservation';
export const SOURCE_PARCELS = 'msdi-parcels';
export const SOURCE_PLSS = 'msdi-plss';
export const SOURCE_PUBLIC_VEC = 'msdi-public-vector';
export const SOURCE_HUNTING = 'hunting-area-markers';

export const LAYER_PUBLIC = `${SOURCE_PUBLIC}-raster`;
export const LAYER_CE = `${SOURCE_CE}-raster`;
export const LAYER_PARCELS = `${SOURCE_PARCELS}-raster`;
export const LAYER_PLSS = `${SOURCE_PLSS}-raster`;
export const LAYER_PUBLIC_VEC_FILL = `${SOURCE_PUBLIC_VEC}-fill`;
export const LAYER_HUNTING = `${SOURCE_HUNTING}-circles`;

export const CATEGORY_COLORS: Record<string, string> = {
  wma: '#5a8a5c',
  'national-forest': '#3b6978',
  'national-wildlife-refuge': '#7a6b3d',
  blm: '#a0522d',
};

export const EMPTY_FC: FeatureCollection = { type: 'FeatureCollection', features: [] };

export function toMapGeoJSON(fc: FeatureCollection) {
  return fc as never;
}

export function buildTierPaint(prop: 'fill' | 'outline'): Expression {
  const expr: unknown[] = ['match', ['get', 'tier']];
  for (const k of PUBLIC_LAND_TIER_DISPLAY_ORDER) {
    expr.push(k);
    expr.push(PUBLIC_LAND_SEMANTICS[k][prop]);
  }
  expr.push('#9e9e9e');
  return expr as Expression;
}

export function buildHuntingGeoJson(markers: HuntingMarker[]) {
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

export function addRasterPair(
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

/** MSDI rasters + classified public fills + hunting circles (same stack as LandOwnershipMap). */
export function addMontanaCadastralLayers(map: mapboxgl.Map, huntingMarkers: HuntingMarker[]) {
  addRasterPair(map, SOURCE_PUBLIC, LAYER_PUBLIC, MSDI_PUBLIC_LANDS_TILES);
  addRasterPair(map, SOURCE_CE, LAYER_CE, MSDI_CONSERVATION_EASEMENTS_TILES, LAYER_PUBLIC);
  addRasterPair(map, SOURCE_PARCELS, LAYER_PARCELS, MSDI_PARCELS_TILES, LAYER_CE);
  addRasterPair(map, SOURCE_PLSS, LAYER_PLSS, MSDI_PLSS_TILES, LAYER_PARCELS);

  if (!map.getSource(SOURCE_PUBLIC_VEC)) {
    map.addSource(SOURCE_PUBLIC_VEC, {
      type: 'geojson',
      data: toMapGeoJSON(EMPTY_FC),
    });
  }

  const huntingFc = buildHuntingGeoJson(huntingMarkers);
  if (!map.getSource(SOURCE_HUNTING)) {
    map.addSource(SOURCE_HUNTING, {
      type: 'geojson',
      data: toMapGeoJSON(huntingFc),
    });
  } else {
    (map.getSource(SOURCE_HUNTING) as mapboxgl.GeoJSONSource).setData(toMapGeoJSON(huntingFc));
  }

  if (!map.getLayer(LAYER_HUNTING)) {
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
  }

  if (!map.getLayer(LAYER_PUBLIC_VEC_FILL)) {
    map.addLayer(
      {
        id: LAYER_PUBLIC_VEC_FILL,
        type: 'fill',
        source: SOURCE_PUBLIC_VEC,
        paint: {
          'fill-color': buildTierPaint('fill'),
          'fill-opacity': 0.5,
          'fill-outline-color': buildTierPaint('outline'),
        },
      },
      LAYER_HUNTING,
    );
  }
}

export const SOURCE_MAPBOX_TERRAIN = 'mapbox-dem';

/** Host elevation tiles for setTerrain (Mapbox global DEM until custom XYZ pipeline ships). */
export function ensureMapboxTerrainDemSource(map: mapboxgl.Map) {
  if (map.getSource(SOURCE_MAPBOX_TERRAIN)) return;
  map.addSource(SOURCE_MAPBOX_TERRAIN, {
    type: 'raster-dem',
    url: 'mapbox://mapbox.terrain-rgb',
    tileSize: 512,
    maxzoom: 14,
  });
}
