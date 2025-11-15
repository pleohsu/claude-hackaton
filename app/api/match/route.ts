import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/util/supabaseClient';
import { calculateDistance } from '@/app/util/geolocation';

/**
 * Matching Algorithm
 *
 * Steps:
 * 1. Get all active demand streams
 * 2. For each demand, find matching supplies with same shell type
 * 3. Calculate distance between lab and restaurant
 * 4. Filter by max pickup radius
 * 5. Check quantity match (supply >= 70% of demand)
 * 6. Pick closest match
 * 7. Create match entry
 */

interface MatchCandidate {
  supplyId: string;
  demandId: string;
  restaurantId: string;
  labId: string;
  shellType: string;
  matchedQuantity: number;
  distance: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { demand_id, supply_id } = body;

    // If specific IDs provided, try to match them
    if (demand_id && supply_id) {
      return await createSpecificMatch(demand_id, supply_id);
    }

    // Otherwise, run the matching algorithm for all active streams
    return await runMatchingAlgorithm();
  } catch (error) {
    console.error('Match creation error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function createSpecificMatch(demandId: string, supplyId: string) {
  // Fetch demand with lab details
  const { data: demand, error: demandError } = await supabase
    .from('demand_streams')
    .select('*, labs(*)')
    .eq('id', demandId)
    .single();

  if (demandError || !demand) {
    return NextResponse.json(
      { message: 'Demand not found' },
      { status: 404 }
    );
  }

  // Fetch supply with restaurant details
  const { data: supply, error: supplyError } = await supabase
    .from('supply_streams')
    .select('*, restaurants(*)')
    .eq('id', supplyId)
    .single();

  if (supplyError || !supply) {
    return NextResponse.json(
      { message: 'Supply not found' },
      { status: 404 }
    );
  }

  // Check if shell types match
  if (supply.shell_type !== demand.shell_type_needed) {
    return NextResponse.json(
      { message: 'Shell types do not match' },
      { status: 400 }
    );
  }

  // Calculate distance
  const lab = demand.labs;
  const restaurant = supply.restaurants;

  if (!lab.latitude || !lab.longitude || !restaurant.latitude || !restaurant.longitude) {
    return NextResponse.json(
      { message: 'Missing location data for distance calculation' },
      { status: 400 }
    );
  }

  const distance = calculateDistance(
    lab.latitude,
    lab.longitude,
    restaurant.latitude,
    restaurant.longitude
  );

  // Check if within radius
  if (demand.max_pickup_radius_km && distance > demand.max_pickup_radius_km) {
    return NextResponse.json(
      {
        message: `Distance ${distance}km exceeds max pickup radius ${demand.max_pickup_radius_km}km`,
      },
      { status: 400 }
    );
  }

  // Create match
  const matchedQuantity = Math.min(
    supply.weekly_quantity_kg,
    demand.weekly_quantity_needed_kg
  );

  const { data: match, error: matchError } = await supabase
    .from('matches')
    .insert({
      supply_id: supply.id,
      demand_id: demand.id,
      restaurant_id: restaurant.id,
      lab_id: lab.id,
      shell_type: supply.shell_type,
      matched_quantity_kg: matchedQuantity,
      distance_km: distance,
      status: 'pending',
    })
    .select()
    .single();

  if (matchError) {
    throw matchError;
  }

  return NextResponse.json(
    {
      matched: true,
      match_id: match.id,
      match,
    },
    { status: 201 }
  );
}

async function runMatchingAlgorithm() {
  const matches: MatchCandidate[] = [];

  // Get all active demands with lab details
  const { data: demands, error: demandsError } = await supabase
    .from('demand_streams')
    .select('*, labs(*)')
    .eq('status', 'active');

  if (demandsError) {
    throw demandsError;
  }

  if (!demands || demands.length === 0) {
    return NextResponse.json({
      message: 'No active demand streams found',
      matches_created: 0,
    });
  }

  // For each demand, find matching supplies
  for (const demand of demands) {
    const lab = demand.labs;

    if (!lab || !lab.latitude || !lab.longitude) {
      continue; // Skip if no location data
    }

    // Find supplies with matching shell type
    const { data: supplies, error: suppliesError } = await supabase
      .from('supply_streams')
      .select('*, restaurants(*)')
      .eq('shell_type', demand.shell_type_needed)
      .eq('status', 'active');

    if (suppliesError || !supplies || supplies.length === 0) {
      continue; // No matching supplies
    }

    // Filter and rank supplies
    const candidates: MatchCandidate[] = [];

    for (const supply of supplies) {
      const restaurant = supply.restaurants;

      if (!restaurant || !restaurant.latitude || !restaurant.longitude) {
        continue; // Skip if no location data
      }

      // Calculate distance
      const distance = calculateDistance(
        lab.latitude,
        lab.longitude,
        restaurant.latitude,
        restaurant.longitude
      );

      // Check if within radius
      if (demand.max_pickup_radius_km && distance > demand.max_pickup_radius_km) {
        continue; // Too far
      }

      // Check quantity match (supply should be >= 70% of demand)
      const quantityRatio = supply.weekly_quantity_kg / demand.weekly_quantity_needed_kg;
      if (quantityRatio < 0.7) {
        continue; // Insufficient supply
      }

      // Calculate matched quantity
      const matchedQuantity = Math.min(
        supply.weekly_quantity_kg,
        demand.weekly_quantity_needed_kg
      );

      candidates.push({
        supplyId: supply.id,
        demandId: demand.id,
        restaurantId: restaurant.id,
        labId: lab.id,
        shellType: supply.shell_type,
        matchedQuantity,
        distance,
      });
    }

    // Pick the closest candidate
    if (candidates.length > 0) {
      candidates.sort((a, b) => a.distance - b.distance);
      matches.push(candidates[0]);
    }
  }

  // Create matches in database
  const createdMatches = [];

  for (const candidate of matches) {
    // Check if match already exists
    const { data: existingMatch } = await supabase
      .from('matches')
      .select('id')
      .eq('supply_id', candidate.supplyId)
      .eq('demand_id', candidate.demandId)
      .single();

    if (existingMatch) {
      continue; // Skip if match already exists
    }

    const { data: match, error: matchError } = await supabase
      .from('matches')
      .insert({
        supply_id: candidate.supplyId,
        demand_id: candidate.demandId,
        restaurant_id: candidate.restaurantId,
        lab_id: candidate.labId,
        shell_type: candidate.shellType,
        matched_quantity_kg: candidate.matchedQuantity,
        distance_km: candidate.distance,
        status: 'pending',
      })
      .select()
      .single();

    if (!matchError && match) {
      createdMatches.push(match);
    }
  }

  return NextResponse.json({
    message: 'Matching algorithm completed',
    matches_created: createdMatches.length,
    matches: createdMatches,
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurant_id');
    const labId = searchParams.get('lab_id');
    const status = searchParams.get('status');

    let query = supabase
      .from('matches')
      .select(`
        *,
        supply:supply_streams(*),
        demand:demand_streams(*),
        restaurant:restaurants(*),
        lab:labs(*)
      `);

    if (restaurantId) {
      query = query.eq('restaurant_id', restaurantId);
    }

    if (labId) {
      query = query.eq('lab_id', labId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ matches: data });
  } catch (error) {
    console.error('Match fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json(
        { message: 'Match ID is required' },
        { status: 400 }
      );
    }

    const updates: any = {};
    if (status) updates.status = status;
    if (notes !== undefined) updates.notes = notes;

    const { data, error } = await supabase
      .from('matches')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: 'Match updated successfully',
      match: data,
    });
  } catch (error) {
    console.error('Match update error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
