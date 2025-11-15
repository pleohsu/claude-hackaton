import { NextRequest } from 'next/server';
import { supabase } from '@/app/util/supabaseClient';
import bcrypt from 'bcryptjs';
import { loginSchema } from '@/app/util/validators';
import { createSessionResponse } from '@/app/util/session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      return Response.json({ errors }, { status: 400 });
    }

    const { email, password } = validationResult.data;

    // Find user by email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return Response.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return Response.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Get additional profile data based on user type
    let profileData = null;
    if (user.user_type === 'restaurant') {
      const { data: restaurant } = await supabase
        .from('restaurants')
        .select('id, restaurant_name')
        .eq('user_id', user.id)
        .single();
      profileData = restaurant;
    } else if (user.user_type === 'lab') {
      const { data: lab } = await supabase
        .from('labs')
        .select('id, institution_name, lab_name')
        .eq('user_id', user.id)
        .single();
      profileData = lab;
    }

    // Create session
    const sessionData = {
      userId: user.id,
      email: user.email,
      userType: user.user_type as 'restaurant' | 'lab',
      name: user.name,
    };

    // Return response with session cookie
    return createSessionResponse(
      sessionData,
      {
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          userType: user.user_type,
          profile: profileData,
        },
      },
      200
    );
  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
