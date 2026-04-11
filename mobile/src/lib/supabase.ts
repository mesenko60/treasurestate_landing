import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl ?? '';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface NearbyPOI {
  id: number;
  source_id: string | null;
  slug: string | null;
  name: string;
  description: string | null;
  category: string;
  subcategory: string | null;
  lat: number;
  lng: number;
  content_url: string | null;
  image_url: string | null;
  nearest_town: string | null;
  website: string | null;
  phone: string | null;
  address: string | null;
  rating: number | null;
  reviews: number | null;
  metadata: Record<string, unknown>;
  distance_meters: number;
}

export const POI_CATEGORIES: Record<string, { label: string; icon: string; color: string }> = {
  historic_marker:   { label: 'Historic Markers',    icon: '🏛️',  color: '#8b4513' },
  hot_spring:        { label: 'Hot Springs',         icon: '♨️',  color: '#e74c3c' },
  campground:        { label: 'Campgrounds',         icon: '⛺',  color: '#27ae60' },
  hiking:            { label: 'Hiking & Trails',     icon: '🥾',  color: '#2ecc71' },
  state_park:        { label: 'State Parks',         icon: '🌲',  color: '#16a085' },
  ski_area:          { label: 'Ski Areas',            icon: '⛷️',  color: '#3498db' },
  wildlife_viewing:  { label: 'Wildlife Viewing',    icon: '🦌',  color: '#f39c12' },
  photography:       { label: 'Photography Spots',   icon: '📷',  color: '#9b59b6' },
  hunting_area:      { label: 'Hunting Areas',       icon: '🎯',  color: '#795548' },
  golf_course:       { label: 'Golf Courses',        icon: '⛳',  color: '#4caf50' },
  town:              { label: 'Towns',               icon: '🏘️',  color: '#607d8b' },
  corridor_poi:      { label: 'Scenic Corridor POIs',icon: '🛣️',  color: '#e67e22' },
  waterfall:         { label: 'Waterfalls',          icon: '💧',  color: '#00bcd4' },
  fishing_access:    { label: 'Fishing Access',      icon: '🎣',  color: '#0277bd' },
  recreation_site:   { label: 'Recreation Sites',    icon: '🏕️',  color: '#ff9800' },
};

export function formatDistance(meters: number): string {
  const miles = meters / 1609.344;
  if (miles < 0.1) {
    const feet = Math.round(meters * 3.281);
    return `${feet} ft`;
  }
  return `${miles.toFixed(1)} mi`;
}

export function getCategoryInfo(category: string) {
  return POI_CATEGORIES[category] || { label: category, icon: '📍', color: '#999' };
}

export async function fetchNearbyPOIs(
  lat: number,
  lng: number,
  radiusMeters: number = 8000,
  categories: string[] | null = null,
  limit: number = 100,
): Promise<NearbyPOI[]> {
  const { data, error } = await supabase.rpc('nearby_pois', {
    user_lat: lat,
    user_lng: lng,
    radius_meters: radiusMeters,
    categories: categories?.length ? categories : null,
    result_limit: limit,
  });
  if (error) throw error;
  return (data as NearbyPOI[]) || [];
}
