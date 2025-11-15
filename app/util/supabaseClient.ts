import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a dummy client for demo mode (when env vars are not set)
// The actual API routes will check isSupabaseConfigured and use mock data instead
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://dummy.supabase.co', 'dummy-anon-key');

// Database types
export type User = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  user_type: 'restaurant' | 'lab';
  created_at: string;
  updated_at: string;
};

export type Restaurant = {
  id: string;
  user_id: string;
  restaurant_name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  storage_method: 'frozen' | 'refrigerated' | 'room_temp' | null;
  cleanliness_level: 'clean' | 'sauce_covered' | 'raw_only' | null;
  pickup_windows: Record<string, string> | null;
  contact_phone: string | null;
  created_at: string;
  updated_at: string;
};

export type Lab = {
  id: string;
  user_id: string;
  institution_name: string;
  dept: string | null;
  lab_name: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  extraction_frequency: 'weekly' | 'biweekly' | 'monthly' | null;
  max_pickup_radius_km: number | null;
  application: string | null;
  contact_phone: string | null;
  created_at: string;
  updated_at: string;
};

export type SupplyStream = {
  id: string;
  restaurant_id: string;
  shell_type: 'shrimp' | 'crab' | 'lobster' | 'prawn' | 'crayfish' | 'squid_pen';
  weekly_quantity_kg: number;
  storage_method: 'frozen' | 'refrigerated' | 'room_temp' | null;
  cleanliness_level: 'clean' | 'sauce_covered' | 'raw_only' | null;
  pickup_window: string | null;
  notes: string | null;
  status: 'active' | 'paused' | 'inactive';
  created_at: string;
  updated_at: string;
};

export type DemandStream = {
  id: string;
  lab_id: string;
  shell_type_needed: 'shrimp' | 'crab' | 'lobster' | 'prawn' | 'crayfish' | 'squid_pen';
  weekly_quantity_needed_kg: number;
  extraction_frequency: 'weekly' | 'biweekly' | 'monthly' | null;
  max_pickup_radius_km: number | null;
  application: string | null;
  priority_level: 'low' | 'medium' | 'high';
  status: 'active' | 'paused' | 'fulfilled' | 'inactive';
  created_at: string;
  updated_at: string;
};

export type Match = {
  id: string;
  supply_id: string;
  demand_id: string;
  restaurant_id: string;
  lab_id: string;
  shell_type: string;
  matched_quantity_kg: number;
  distance_km: number | null;
  status: 'pending' | 'active' | 'completed' | 'rejected' | 'cancelled';
  next_pickup_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type MatchWithDetails = Match & {
  restaurant: Restaurant;
  lab: Lab;
  supply: SupplyStream;
  demand: DemandStream;
};
