/**
 * ArcGIS MapServer export tiles (Web Mercator) for Montana MSDI cadastral services.
 * Mapbox GL substitutes {bbox-epsg-3857} with west,south,east,north in EPSG:3857.
 * @see https://msl.mt.gov/geoinfo/data/web_services
 */

const QS =
  'size=256,256&f=image&format=png32&transparent=true&dpi=96&bboxSR=3857&imageSR=3857';

function exportTileUrl(servicePath: string, layersParam: string): string {
  const base = `https://gisservicemt.gov/arcgis/rest/services/${servicePath}/export`;
  return `${base}?bbox={bbox-epsg-3857}&${QS}&layers=${encodeURIComponent(layersParam)}`;
}

/** Publicly administered lands (MT DOR tax appraisal), single layer */
export const MSDI_PUBLIC_LANDS_TILES = exportTileUrl(
  'MSDI_Framework/PublicLands/MapServer',
  'show:0',
);

/** Conservation easements (private land; no public access implied) */
export const MSDI_CONSERVATION_EASEMENTS_TILES = exportTileUrl(
  'MSDI_Framework/ConservationEasements/MapServer',
  'show:0',
);

/**
 * Cadastral parcel boundaries (tax + exempt). Heavy — use at mid–high zoom only.
 */
export const MSDI_PARCELS_TILES = exportTileUrl(
  'MSDI_Framework/Parcels/MapServer',
  'show:0',
);

/**
 * PLSS grid (township / section / subdivisions); excludes Metadata group subtree.
 */
export const MSDI_PLSS_TILES = exportTileUrl(
  'MSDI_Framework/PLSS/MapServer',
  'show:5,6,1,2,3,4',
);
