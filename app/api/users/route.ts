import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/util/supabaseClient';
import { geocodeAddress } from '@/app/util/geolocation';
import bcrypt from 'bcryptjs';
import { restaurantRegistrationSchema, labRegistrationSchema } from '@/app/util/validators';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_type } = body;

    // Validate based on user type
    let validationResult;
    if (user_type === 'restaurant') {
      validationResult = restaurantRegistrationSchema.safeParse(body);
    } else if (user_type === 'lab') {
      validationResult = labRegistrationSchema.safeParse(body);
    } else {
      return NextResponse.json(
        { message: 'Invalid user type' },
        { status: 400 }
      );
    }

    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      return NextResponse.json({ errors }, { status: 400 });
    }

    const data = validationResult.data;

    // Hash password
    const password_hash = await bcrypt.hash(data.password, 10);

    // Geocode address
    const coordinates = await geocodeAddress(data.address);
    const latitude = coordinates?.latitude || null;
    const longitude = coordinates?.longitude || null;

    // Create user
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        name: data.name,
        email: data.email,
        password_hash,
        user_type,
      })
      .select()
      .single();

    if (userError) {
      console.error('User creation error:', userError);
      if (userError.code === '23505') {
        // Unique constraint violation
        return NextResponse.json(
          { message: 'Email already registered' },
          { status: 409 }
        );
      }
      throw userError;
    }

    // Create restaurant or lab profile
    let entityId: string | undefined;

    if (user_type === 'restaurant') {
      const { data: restaurantData, error: restaurantError } = await supabase
        .from('restaurants')
        .insert({
          user_id: userData.id,
          restaurant_name: (data as any).restaurant_name,
          address: data.address,
          latitude,
          longitude,
          storage_method: (data as any).storage_method,
          cleanliness_level: (data as any).cleanliness_level,
          pickup_windows: (data as any).pickup_windows || null,
          contact_phone: (data as any).contact_phone || null,
        })
        .select()
        .single();

      if (restaurantError) {
        console.error('Restaurant creation error:', restaurantError);
        // Rollback user creation
        await supabase.from('users').delete().eq('id', userData.id);
        throw restaurantError;
      }

      entityId = restaurantData.id;
    } else if (user_type === 'lab') {
      const { data: labData, error: labError } = await supabase
        .from('labs')
        .insert({
          user_id: userData.id,
          institution_name: (data as any).institution_name,
          dept: (data as any).dept || null,
          lab_name: (data as any).lab_name || null,
          address: data.address,
          latitude,
          longitude,
          extraction_frequency: (data as any).extraction_frequency,
          max_pickup_radius_km: (data as any).max_pickup_radius_km,
          application: (data as any).application,
          contact_phone: (data as any).contact_phone || null,
        })
        .select()
        .single();

      if (labError) {
        console.error('Lab creation error:', labError);
        // Rollback user creation
        await supabase.from('users').delete().eq('id', userData.id);
        throw labError;
      }

      entityId = labData.id;
    }

    return NextResponse.json(
      {
        message: 'Registration successful',
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          user_type: userData.user_type,
        },
        entityId, // Include restaurant_id or lab_id for session storage
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');
    const email = searchParams.get('email');

    if (!userId && !email) {
      return NextResponse.json(
        { message: 'User ID or email is required' },
        { status: 400 }
      );
    }

    let query = supabase.from('users').select('*');

    if (userId) {
      query = query.eq('id', userId);
    } else if (email) {
      query = query.eq('email', email);
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
      throw error;
    }

    // Remove password hash from response
    const { password_hash, ...userWithoutPassword } = data;

    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('User fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
