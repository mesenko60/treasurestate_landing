import type { Feature, FeatureCollection } from 'geojson';
import { classifyPublicLandOwner } from './classifyMontanaPublicOwner';

const PUBLIC_LANDS_QUERY =
  'https://gisservicemt.gov/arcgis/rest/services/MSDI_Framework/PublicLands/MapServer/0/query';

type MsdiPublicLandGeoJSON = FeatureCollection & { exceededTransferLimit?: boolean };

function annotateTiers(fc: FeatureCollection): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: fc.features.map((f) => {
      const props = (f.properties ?? {}) as Record<string, unknown>;
      const ownerRaw = (props.OWNER ?? props.owner) as string | undefined;
      const tier = classifyPublicLandOwner(ownerRaw);
      return {
        ...f,
        properties: { ...props, tier, OWNER: ownerRaw },
      } as Feature;
    }),
  };
}

/**
 * Paged GeoJSON query against MSDI Public Lands polygons for the current viewport envelope (EPSG:4326).
 * Caps feature count so dense viewports remain responsive on mobile.
 */
export async function fetchMsdiPublicLandPatches(
  xmin: number,
  ymin: number,
  xmax: number,
  ymax: number,
  options: { signal?: AbortSignal; pageSize?: number; maxFeatures?: number } = {},
): Promise<FeatureCollection> {
  const pageSize = options.pageSize ?? 2000;
  const maxFeatures = options.maxFeatures ?? 12000;

  const envelope = {
    xmin,
    ymin,
    xmax,
    ymax,
    spatialReference: { wkid: 4326 },
  };

  const aggregated: Feature[] = [];
  let offset = 0;
  let exhausted = false;

  while (!exhausted && aggregated.length < maxFeatures) {
    const params = new URLSearchParams({
      f: 'geojson',
      where: '1=1',
      outFields: 'OWNER',
      outSR: '4326',
      spatialRel: 'esriSpatialRelIntersects',
      geometryType: 'esriGeometryEnvelope',
      inSR: '4326',
      returnGeometry: 'true',
      geometry: JSON.stringify(envelope),
      resultOffset: String(offset),
      resultRecordCount: String(Math.min(pageSize, maxFeatures - aggregated.length)),
    });

    const resp = await fetch(`${PUBLIC_LANDS_QUERY}?${params.toString()}`, {
      signal: options.signal,
      cache: 'no-store',
      headers: { Accept: 'application/geo+json,application/json' },
    });

    if (!resp.ok) {
      throw new Error(`MSDI Public Lands query failed: ${resp.status}`);
    }

    const body = (await resp.json()) as MsdiPublicLandGeoJSON;
    if (!body || body.type !== 'FeatureCollection' || !Array.isArray(body.features)) {
      exhausted = true;
      break;
    }

    const chunk = body.features;
    if (chunk.length === 0) {
      exhausted = true;
      break;
    }

    aggregated.push(...chunk);
    offset += chunk.length;

    const moreRemain = body.exceededTransferLimit === true;
    if (!moreRemain || offset >= maxFeatures || chunk.length === 0) {
      exhausted = true;
    }
  }

  return annotateTiers({
    type: 'FeatureCollection',
    features: aggregated.slice(0, maxFeatures),
  });
}
