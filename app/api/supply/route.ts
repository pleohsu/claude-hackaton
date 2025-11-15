import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/util/supabaseClient';
import { supplyStreamSchema } from '@/app/util/validators';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = supplyStreamSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      return NextResponse.json({ errors }, { status: 400 });
    }

    const data = validationResult.data;

    // Verify restaurant exists
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .select('id')
      .eq('id', data.restaurant_id)
      .single();

    if (restaurantError || !restaurant) {
      return NextResponse.json(
        { message: 'Restaurant not found' },
        { status: 404 }
      );
    }

    // Create supply stream
    const { data: supplyStream, error: supplyError } = await supabase
      .from('supply_streams')
      .insert({
        restaurant_id: data.restaurant_id,
        shell_type: data.shell_type,
        weekly_quantity_kg: data.weekly_quantity_kg,
        storage_method: data.storage_method,
        cleanliness_level: data.cleanliness_level,
        pickup_window: data.pickup_window || null,
        notes: data.notes || null,
        status: 'active',
      })
      .select()
      .single();

    if (supplyError) {
      console.error('Supply stream creation error:', supplyError);
      throw supplyError;
    }

    // TODO: Trigger matching algorithm
    // This could be done asynchronously or as a separate endpoint call

    return NextResponse.json(
      {
        message: 'Supply stream created successfully',
        supply_id: supplyStream.id,
        supply: supplyStream,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Supply creation error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurant_id');
    const status = searchParams.get('status');

    let query = supabase.from('supply_streams').select('*');

    if (restaurantId) {
      query = query.eq('restaurant_id', restaurantId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ supplies: data });
  } catch (error) {
    console.error('Supply fetch error:', error);
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
        { message: 'Supply stream ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('supply_streams')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: 'Supply stream updated successfully',
      supply: data,
    });
  } catch (error) {
    console.error('Supply update error:', error);
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
        { message: 'Supply stream ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('supply_streams')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Supply stream deleted successfully' });
  } catch (error) {
    console.error('Supply deletion error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
