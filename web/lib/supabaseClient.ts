import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase environment variables are not configured. ' +
      'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }

  _supabase = createClient(supabaseUrl, supabaseAnonKey);
  return _supabase;
}

export interface Place {
  id: number;
  place_id: string;
  dynamic_place_id: string | null;
  name: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipcode: string | null;
  latitude: number | null;
  longitude: number | null;
  category: string | null;
  type: string | null;
  types: string[] | null;
  rating: number | null;
  reviews: number | null;
  phone: string | null;
  website: string | null;
  description: string | null;
  thumbnail: string | null;
  photo_link: string | null;
  photos_link: string | null;
  reviews_link: string | null;
}

export interface MontanaTown {
  gnis_id: number | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  dynamic_place_id: string | null;
}

export interface Highway {
  gid: number;
  linearid: string | null;
  fullname: string | null;
  rttyp: string | null;
  mtfcc: string | null;
}
