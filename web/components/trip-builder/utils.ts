export function haversineMeters(
  [lon1, lat1]: [number, number],
  [lon2, lat2]: [number, number]
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371000;
  const φ1 = toRad(lat1),
    φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);
  const a =
    Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function nearestSegmentIndex(
  lon: number,
  lat: number,
  line: [number, number][]
): number {
  let minDist = Infinity;
  let minIdx = 0;
  for (let i = 0; i < line.length - 1; i++) {
    const [lon1, lat1] = line[i];
    const [lon2, lat2] = line[i + 1];
    const dx = lon2 - lon1,
      dy = lat2 - lat1;
    const length2 = dx * dx + dy * dy;
    let t = length2 === 0 ? 0 : ((lon - lon1) * dx + (lat - lat1) * dy) / length2;
    t = Math.max(0, Math.min(1, t));
    const proj = [lon1 + t * dx, lat1 + t * dy] as [number, number];
    const dist = haversineMeters([lon, lat], proj);
    if (dist < minDist) {
      minDist = dist;
      minIdx = i;
    }
  }
  return minIdx;
}

export function pointToLineDistance(
  lon: number,
  lat: number,
  line: [number, number][]
): number {
  let minDist = Infinity;
  for (let i = 0; i < line.length - 1; i++) {
    const [lon1, lat1] = line[i];
    const [lon2, lat2] = line[i + 1];
    const dx = lon2 - lon1,
      dy = lat2 - lat1;
    const length2 = dx * dx + dy * dy;
    let t = length2 === 0 ? 0 : ((lon - lon1) * dx + (lat - lat1) * dy) / length2;
    t = Math.max(0, Math.min(1, t));
    const proj = [lon1 + t * dx, lat1 + t * dy] as [number, number];
    const dist = haversineMeters([lon, lat], proj);
    if (dist < minDist) minDist = dist;
  }
  return minDist;
}

export function formatDriveTime(minutes: number): string {
  const hr = Math.floor(minutes / 60);
  const min = Math.round(minutes % 60);
  if (hr > 0 && min > 0) return `${hr} hr ${min} min`;
  if (hr > 0) return `${hr} hr`;
  return `${min} min`;
}

export function formatDistance(miles: number): string {
  return `${miles.toFixed(1)} mi`;
}
