export interface City {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

export interface POI {
  id: string;
  name: string;
  description?: string;
  lat: number;
  lon: number;
  type?: string;
  category?: string;
  rating?: number;
  reviews?: number;
  website?: string;
  thumbnail?: string;
}

export interface ItineraryPOI extends POI {
  itemType: 'city' | 'activity';
  enabled?: boolean;
}

export interface RouteData {
  geometry: {
    coordinates: [number, number][];
    type: string;
  };
  legs: {
    distance: number;
    duration: number;
  }[];
  distance: number;
  duration: number;
}

export interface RouteCalculatedEvent extends CustomEvent {
  detail: {
    distance: number;
    duration: number;
    legDistances: number[];
    legDurations: number[];
  };
}

export const ACTIVITY_TYPES = [
  'Campground',
  'Hiking area',
  'Park',
  'State park',
  'Tourist attraction',
  'Hot spring',
  'Fishing area',
  'RV park',
  'Boat ramp',
] as const;

export const POI_LAYER_CATEGORIES: Record<string, { label: string; icon: string; color: string; types: string[] }> = {
  outdoors: {
    label: 'Outdoors',
    icon: '🏕️',
    color: '#27ae60',
    types: ['Campground', 'Hiking area', 'Park', 'State park', 'RV park', 'Boat ramp', 'Fishing area', 'Fishing camp', 'Fishing', 'Fishing pier', 'Fishing charter', 'Picnic ground', 'Wildlife refuge', 'Wildlife park', 'Natural feature', 'River', 'Spring'],
  },
  attractions: {
    label: 'Attractions',
    icon: '⭐',
    color: '#e67e22',
    types: ['Tourist attraction', 'Hot spring', 'Thermal baths', 'Health resort', 'Resort hotel', 'Hotel', 'Motel', 'Capsule hotel', 'Swimming pool', 'Recreation center'],
  },
  food: {
    label: 'Food & Coffee',
    icon: '☕',
    color: '#8e44ad',
    types: ['Coffee shop', 'Coffee stand', 'Coffee roasters', 'Espresso bar', 'Cafe', 'Restaurant', 'American restaurant', 'Fine dining restaurant', 'Bakery', 'Bar', 'Bar & grill', 'Deli', 'Distillery'],
  },
  services: {
    label: 'Services',
    icon: '⛽',
    color: '#3498db',
    types: ['Gas station', 'Grocery store', 'Supermarket', 'Convenience store', 'General store', 'Dollar store', 'Electric vehicle charging station', 'Compressed natural gas station'],
  },
};

export const MONTANA_BOUNDS = {
  minLat: 44.0,
  maxLat: 49.0,
  minLng: -116.5,
  maxLng: -104.0,
};

export type CorridorPOI = {
  name: string;
  type: string;
  category: string;
  lat: number;
  lng: number;
  distFromRoute: number;
  rating?: number | null;
  reviews?: number | null;
};

export type Corridor = {
  id: string;
  name: string;
  description: string;
  highways: string[];
  distanceMiles: number;
  elevationRange: [number, number];
  season: string;
  difficulty: string;
  color: string;
  startTown: string;
  endTown: string;
  throughTowns: string[];
  connections: string[];
  geometry: { type: string; coordinates: number[][] };
  pois: CorridorPOI[];
};

export type HistoricMarker = {
  id: string;
  slug: string;
  title: string;
  lat: number;
  lng: number;
  town: string | null;
  inscription: string;
  isCurated: boolean;
};

export type HistoryTrailMapData = {
  id: string;
  name: string;
  markerCount: number;
  lineSegments: [number, number][][];
  stops: HistoricMarker[];
};
