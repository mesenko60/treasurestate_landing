import fs from 'fs';
import path from 'path';

export type TownCorridor = {
  id: string;
  name: string;
  highways: string[];
  distanceMiles: number;
  difficulty: string;
  color: string;
  relation: 'start' | 'end' | 'through' | 'nearby';
};

type Corridor = {
  id: string;
  name: string;
  highways: string[];
  distanceMiles: number;
  difficulty: string;
  color: string;
  startTown: string;
  endTown: string;
  throughTowns: string[];
  geometry: { type: string; coordinates: number[][] };
};

let _cache: Record<string, TownCorridor[]> | null = null;

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function minDistToLine(lat: number, lng: number, coords: number[][]): number {
  let min = Infinity;
  for (const [cLng, cLat] of coords) {
    const d = haversine(lat, lng, cLat, cLng);
    if (d < min) min = d;
  }
  return min;
}

function buildIndex(): Record<string, TownCorridor[]> {
  const corridorsPath = path.resolve(process.cwd(), 'data', 'corridors.json');
  const coordsPath = path.resolve(process.cwd(), 'data', 'town-coordinates.json');
  if (!fs.existsSync(corridorsPath) || !fs.existsSync(coordsPath)) return {};

  const corridors: Corridor[] = JSON.parse(fs.readFileSync(corridorsPath, 'utf-8'));
  const coords: Record<string, { name: string; lat: number; lng: number }> = JSON.parse(fs.readFileSync(coordsPath, 'utf-8'));

  const result: Record<string, TownCorridor[]> = {};

  const addEntry = (slug: string, c: Corridor, relation: TownCorridor['relation']) => {
    if (!result[slug]) result[slug] = [];
    if (result[slug].some(e => e.id === c.id)) return;
    result[slug].push({
      id: c.id,
      name: c.name,
      highways: c.highways,
      distanceMiles: c.distanceMiles,
      difficulty: c.difficulty,
      color: c.color,
      relation,
    });
  };

  for (const c of corridors) {
    if (coords[c.startTown]) addEntry(c.startTown, c, 'start');
    if (coords[c.endTown]) addEntry(c.endTown, c, 'end');
    for (const t of c.throughTowns) {
      if (coords[t]) addEntry(t, c, 'through');
    }

    for (const [slug, coord] of Object.entries(coords)) {
      if (slug === c.startTown || slug === c.endTown || c.throughTowns.includes(slug)) continue;
      const dist = minDistToLine(coord.lat, coord.lng, c.geometry.coordinates);
      if (dist <= 25) {
        addEntry(slug, c, 'nearby');
      }
    }
  }

  return result;
}

export function getCorridorsForTown(slug: string): TownCorridor[] {
  if (!_cache) _cache = buildIndex();
  return _cache[slug] || [];
}
