import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/util/supabaseClient';

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
        restaurant:restaurants(*),
        lab:labs(*),
        supply:supply_streams(*),
        demand:demand_streams(*)
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
    console.error('Matches fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      supply_id,
      demand_id,
      restaurant_id,
      lab_id,
      shell_type,
      matched_quantity_kg,
      distance_km,
    } = body;

    // Verify supply and demand exist
    const { data: supply, error: supplyError } = await supabase
      .from('supply_streams')
      .select('*')
      .eq('id', supply_id)
      .single();

    if (supplyError || !supply) {
      return NextResponse.json(
        { message: 'Supply stream not found' },
        { status: 404 }
      );
    }

    const { data: demand, error: demandError } = await supabase
      .from('demand_streams')
      .select('*')
      .eq('id', demand_id)
      .single();

    if (demandError || !demand) {
      return NextResponse.json(
        { message: 'Demand stream not found' },
        { status: 404 }
      );
    }

    // Create match
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .insert({
        supply_id,
        demand_id,
        restaurant_id,
        lab_id,
        shell_type,
        matched_quantity_kg,
        distance_km: distance_km || null,
        status: 'pending',
      })
      .select()
      .single();

    if (matchError) {
      console.error('Match creation error:', matchError);
      throw matchError;
    }

    return NextResponse.json(
      {
        message: 'Match created successfully',
        match_id: match.id,
        match,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Match creation error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { message: 'Match ID is required' },
        { status: 400 }
      );
    }

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
