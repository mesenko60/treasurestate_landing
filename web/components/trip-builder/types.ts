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
