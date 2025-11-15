import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/util/supabaseClient';
import { demandStreamSchema } from '@/app/util/validators';
import { mockDemands } from '@/app/util/mockDashboardData';

// Check if Supabase is configured
const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== '' &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "''";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = demandStreamSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      return NextResponse.json({ errors }, { status: 400 });
    }

    const data = validationResult.data;

    // Verify lab exists
    const { data: lab, error: labError } = await supabase
      .from('labs')
      .select('id')
      .eq('id', data.lab_id)
      .single();

    if (labError || !lab) {
      return NextResponse.json(
        { message: 'Lab not found' },
        { status: 404 }
      );
    }

    // Create demand stream
    const { data: demandStream, error: demandError } = await supabase
      .from('demand_streams')
      .insert({
        lab_id: data.lab_id,
        shell_type_needed: data.shell_type_needed,
        weekly_quantity_needed_kg: data.weekly_quantity_needed_kg,
        extraction_frequency: data.extraction_frequency,
        max_pickup_radius_km: data.max_pickup_radius_km,
        application: data.application,
        priority_level: data.priority_level || 'medium',
        status: 'active',
      })
      .select()
      .single();

    if (demandError) {
      console.error('Demand stream creation error:', demandError);
      throw demandError;
    }

    // TODO: Trigger matching algorithm
    // This could be done asynchronously or as a separate endpoint call

    return NextResponse.json(
      {
        message: 'Demand stream created successfully',
        demand_id: demandStream.id,
        demand: demandStream,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Demand creation error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const labId = searchParams.get('lab_id');
    const status = searchParams.get('status');

    // DEMO MODE: Use mock data
    if (!isSupabaseConfigured) {
      let filteredDemands = mockDemands;

      if (labId) {
        filteredDemands = filteredDemands.filter(d => d.lab_id === labId);
      }

      if (status) {
        filteredDemands = filteredDemands.filter(d => d.status === status);
      }

      return NextResponse.json({ demands: filteredDemands });
    }

    let query = supabase
      .from('demand_streams')
      .select(`
        *,
        lab:labs (
          id,
          institution_name,
          dept,
          lab_name,
          address,
          latitude,
          longitude,
          extraction_frequency,
          max_pickup_radius_km,
          application,
          contact_phone
        )
      `);

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

    return NextResponse.json({ demands: data });
  } catch (error) {
    console.error('Demand fetch error:', error);
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
        { message: 'Demand stream ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('demand_streams')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: 'Demand stream updated successfully',
      demand: data,
    });
  } catch (error) {
    console.error('Demand update error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { message: 'Demand stream ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('demand_streams')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Demand stream deleted successfully' });
  } catch (error) {
    console.error('Demand deletion error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
