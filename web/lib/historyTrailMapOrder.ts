/**
 * Build sensible map paths for history trails. Raw markerIds order is often thematic
 * or database order, not geographic — connecting points in that order creates zig-zags.
 */

/** Edges longer than this are not drawn (avoids misleading chords). Keep in sync with planner UI copy. */
export const HISTORY_TRAIL_MAX_EDGE_MILES = 95;

export function haversineMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/** Greedy path from the easternmost stop (highest longitude) to reduce cross-state jumps. */
export function orderStopsNearestNeighborFromEast<T extends { lat: number; lng: number }>(stops: T[]): T[] {
  if (stops.length <= 2) return [...stops];
  const remaining = [...stops];
  const easternmost = remaining.reduce((a, b) => (a.lng >= b.lng ? a : b));
  const startIdx = remaining.indexOf(easternmost);
  const ordered: T[] = [];
  const [first] = remaining.splice(startIdx, 1);
  ordered.push(first);
  let current = first;
  while (remaining.length) {
    let bestI = 0;
    let bestD = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const d = haversineMiles(current.lat, current.lng, remaining[i].lat, remaining[i].lng);
      if (d < bestD) {
        bestD = d;
        bestI = i;
      }
    }
    current = remaining.splice(bestI, 1)[0];
    ordered.push(current);
  }
  return ordered;
}

/** Split into multiple LineString coordinate lists when consecutive stops are too far apart (no misleading long chords). */
export function buildLineSegmentsLngLat(
  ordered: { lat: number; lng: number }[],
  maxEdgeMiles: number
): [number, number][][] {
  if (ordered.length < 2) return [];
  const segments: [number, number][][] = [];
  let seg: [number, number][] = [[ordered[0].lng, ordered[0].lat]];
  for (let i = 1; i < ordered.length; i++) {
    const d = haversineMiles(ordered[i - 1].lat, ordered[i - 1].lng, ordered[i].lat, ordered[i].lng);
    const pt: [number, number] = [ordered[i].lng, ordered[i].lat];
    if (d <= maxEdgeMiles) {
      seg.push(pt);
    } else {
      if (seg.length >= 2) segments.push(seg);
      seg = [pt];
    }
  }
  if (seg.length >= 2) segments.push(seg);
  return segments;
}
