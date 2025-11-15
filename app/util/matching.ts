import { supabase } from './supabaseClient';

interface SupplyStream {
  id: string;
  restaurant_id: string;
  shell_type: string;
  weekly_quantity_kg: number;
  status: string;
}

interface DemandStream {
  id: string;
  lab_id: string;
  shell_type_needed: string;
  weekly_quantity_needed_kg: number;
  max_pickup_radius_km: number;
  priority_level: string;
  status: string;
}

interface Restaurant {
  id: string;
  latitude: number | null;
  longitude: number | null;
}

interface Lab {
  id: string;
  latitude: number | null;
  longitude: number | null;
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Find matches for a newly created supply stream
export async function matchSupplyWithDemands(supplyId: string): Promise<void> {
  try {
    // Get the supply stream with restaurant location
    const { data: supply, error: supplyError } = await supabase
      .from('supply_streams')
      .select('*, restaurant:restaurants(*)')
      .eq('id', supplyId)
      .single();

    if (supplyError || !supply) {
      console.error('Supply not found:', supplyError);
      return;
    }

    // Get all active demands for the same shell type
    const { data: demands, error: demandsError } = await supabase
      .from('demand_streams')
      .select('*, lab:labs(*)')
      .eq('shell_type_needed', supply.shell_type)
      .eq('status', 'active');

    if (demandsError || !demands || demands.length === 0) {
      console.log('No matching demands found');
      return;
    }

    // Check each demand for compatibility
    for (const demand of demands) {
      // Skip if no coordinates available
      if (
        !supply.restaurant?.latitude ||
        !supply.restaurant?.longitude ||
        !demand.lab?.latitude ||
        !demand.lab?.longitude
      ) {
        continue;
      }

      // Calculate distance
      const distance = calculateDistance(
        supply.restaurant.latitude,
        supply.restaurant.longitude,
        demand.lab.latitude,
        demand.lab.longitude
      );

      // Check if within radius
      if (distance > demand.max_pickup_radius_km) {
        continue;
      }

      // Calculate matched quantity (smaller of supply and demand)
      const matchedQuantity = Math.min(
        supply.weekly_quantity_kg,
        demand.weekly_quantity_needed_kg
      );

      // Check if match already exists
      const { data: existingMatch } = await supabase
        .from('matches')
        .select('id')
        .eq('supply_id', supply.id)
        .eq('demand_id', demand.id)
        .single();

      if (existingMatch) {
        continue; // Match already exists
      }

      // Create the match
      await supabase.from('matches').insert({
        supply_id: supply.id,
        demand_id: demand.id,
        restaurant_id: supply.restaurant_id,
        lab_id: demand.lab_id,
        shell_type: supply.shell_type,
        matched_quantity_kg: matchedQuantity,
        distance_km: distance,
        status: 'pending',
      });

      console.log(`Created match between supply ${supply.id} and demand ${demand.id}`);
    }
  } catch (error) {
    console.error('Error in matchSupplyWithDemands:', error);
  }
}

// Find matches for a newly created demand stream
export async function matchDemandWithSupplies(demandId: string): Promise<void> {
  try {
    // Get the demand stream with lab location
    const { data: demand, error: demandError } = await supabase
      .from('demand_streams')
      .select('*, lab:labs(*)')
      .eq('id', demandId)
      .single();

    if (demandError || !demand) {
      console.error('Demand not found:', demandError);
      return;
    }

    // Get all active supplies for the same shell type
    const { data: supplies, error: suppliesError } = await supabase
      .from('supply_streams')
      .select('*, restaurant:restaurants(*)')
      .eq('shell_type', demand.shell_type_needed)
      .eq('status', 'active');

    if (suppliesError || !supplies || supplies.length === 0) {
      console.log('No matching supplies found');
      return;
    }

    // Check each supply for compatibility
    for (const supply of supplies) {
      // Skip if no coordinates available
      if (
        !supply.restaurant?.latitude ||
        !supply.restaurant?.longitude ||
        !demand.lab?.latitude ||
        !demand.lab?.longitude
      ) {
        continue;
      }

      // Calculate distance
      const distance = calculateDistance(
        supply.restaurant.latitude,
        supply.restaurant.longitude,
        demand.lab.latitude,
        demand.lab.longitude
      );

      // Check if within radius
      if (distance > demand.max_pickup_radius_km) {
        continue;
      }

      // Calculate matched quantity (smaller of supply and demand)
      const matchedQuantity = Math.min(
        supply.weekly_quantity_kg,
        demand.weekly_quantity_needed_kg
      );

      // Check if match already exists
      const { data: existingMatch } = await supabase
        .from('matches')
        .select('id')
        .eq('supply_id', supply.id)
        .eq('demand_id', demand.id)
        .single();

      if (existingMatch) {
        continue; // Match already exists
      }

      // Create the match
      await supabase.from('matches').insert({
        supply_id: supply.id,
        demand_id: demand.id,
        restaurant_id: supply.restaurant_id,
        lab_id: demand.lab_id,
        shell_type: demand.shell_type_needed,
        matched_quantity_kg: matchedQuantity,
        distance_km: distance,
        status: 'pending',
      });

      console.log(`Created match between demand ${demand.id} and supply ${supply.id}`);
    }
  } catch (error) {
    console.error('Error in matchDemandWithSupplies:', error);
  }
}
