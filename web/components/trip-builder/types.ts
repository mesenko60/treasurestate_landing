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
