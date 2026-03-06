export type RecreationPlace = {
  name: string;
  type: string;
  distMiles: number;
};

export const MAX_RECREATION_DISTANCE_MILES = 50;

const EXCLUDED_TYPES = new Set([
  'National HQ',
]);

const EXCLUDED_NAMES = new Set([
  'Boone and Crockett Club National HQ',
  'Greater Yellowstone Coalition HQ',
  'Mt Flyfishing Connection LLC',
  'Garden City Monument Services',
  'Practice Bunker at Lake Hills Golf Course',
  'Picnic Area',
  'Selfie Spot',
  '10 Commandments',
]);

export function isNearbyRecreationPlace(place: RecreationPlace): boolean {
  if (!place || typeof place.distMiles !== 'number') return false;
  if (place.distMiles > MAX_RECREATION_DISTANCE_MILES) return false;
  if (EXCLUDED_TYPES.has(place.type)) return false;
  if (EXCLUDED_NAMES.has(place.name)) return false;
  if (place.name === 'Yellowstone National Park' && place.type === 'Wildlife Refuge') return false;
  return true;
}

export function filterNearbyRecreation<T extends RecreationPlace>(places: T[] | null | undefined): T[] {
  if (!places) return [];
  return places
    .filter((place): place is T => isNearbyRecreationPlace(place))
    .sort((a, b) => a.distMiles - b.distMiles);
}
