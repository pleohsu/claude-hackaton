import { NextResponse } from 'next/server';
import { getSession } from '@/app/util/session';
import { supabase } from '@/app/util/supabaseClient';
import { mockAuth } from '@/app/util/mockAuth';

// Check if Supabase is configured
const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== '' &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "''";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // DEMO MODE: Return session data directly
    if (!isSupabaseConfigured) {
      const mockUser = mockAuth.getAllUsers().find(u => u.id === session.userId);
      return NextResponse.json({
        user: {
          id: session.userId,
          name: session.name,
          email: session.email,
          userType: session.userType,
          profile: mockUser?.profile || null,
        },
      });
    }

    // Get additional profile data based on user type
    let profileData = null;
    if (session.userType === 'restaurant') {
      const { data: restaurant } = await supabase
        .from('restaurants')
        .select('id, restaurant_name, address')
        .eq('user_id', session.userId)
        .single();
      profileData = restaurant;
    } else if (session.userType === 'lab') {
      const { data: lab } = await supabase
        .from('labs')
        .select('id, institution_name, lab_name, address')
        .eq('user_id', session.userId)
        .single();
      profileData = lab;
    }

    return NextResponse.json({
      user: {
        id: session.userId,
        name: session.name,
        email: session.email,
        userType: session.userType,
        profile: profileData,
      },
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
