import { NextResponse } from 'next/server';
import { supabase } from '@/app/util/supabaseClient';
import { geocodeAddress } from '@/app/util/geolocation';
import bcrypt from 'bcryptjs';
import {
  mockRestaurantUsers,
  mockLabUsers,
  mockRestaurants,
  mockLabs,
  mockSupplyStreams,
  mockDemandStreams,
} from '@/app/util/mockData';

/**
 * API endpoint to seed the database with mock data
 * WARNING: This will create duplicate data if run multiple times
 * Use only for development/testing
 */
export async function POST() {
  try {
    const results = {
      users: 0,
      restaurants: 0,
      labs: 0,
      supplies: 0,
      demands: 0,
      errors: [] as string[],
    };

    // Step 1: Create all users (restaurants and labs)
    const allUsers = [...mockRestaurantUsers, ...mockLabUsers];
    const userMap = new Map<string, string>(); // email -> user_id

    for (const userData of allUsers) {
      try {
        const password_hash = await bcrypt.hash(userData.password, 10);

        const { data: user, error } = await supabase
          .from('users')
          .insert({
            name: userData.name,
            email: userData.email,
            password_hash,
            user_type: userData.user_type,
          })
          .select()
          .single();

        if (error) {
          if (error.code === '23505') {
            // User already exists, fetch their ID
            const { data: existingUser } = await supabase
              .from('users')
              .select('id')
              .eq('email', userData.email)
              .single();

            if (existingUser) {
              userMap.set(userData.email, existingUser.id);
              results.errors.push(`User ${userData.email} already exists, skipping`);
            }
          } else {
            throw error;
          }
        } else if (user) {
          userMap.set(userData.email, user.id);
          results.users++;
        }
      } catch (error) {
        console.error(`Error creating user ${userData.email}:`, error);
        results.errors.push(`Failed to create user ${userData.email}`);
      }
    }

    // Step 2: Create restaurant profiles
    const restaurantMap = new Map<string, string>(); // email -> restaurant_id

    for (const restaurantData of mockRestaurants) {
      try {
        const userId = userMap.get(restaurantData.email);
        if (!userId) {
          results.errors.push(`User not found for restaurant ${restaurantData.email}`);
          continue;
        }

        // Geocode address
        const coordinates = await geocodeAddress(restaurantData.address);

        const { data: restaurant, error } = await supabase
          .from('restaurants')
          .insert({
            user_id: userId,
            restaurant_name: restaurantData.restaurant_name,
            address: restaurantData.address,
            latitude: coordinates?.latitude || null,
            longitude: coordinates?.longitude || null,
            storage_method: restaurantData.storage_method,
            cleanliness_level: restaurantData.cleanliness_level,
            pickup_windows: restaurantData.pickup_windows,
            contact_phone: restaurantData.contact_phone,
          })
          .select()
          .single();

        if (error) {
          // Restaurant might already exist
          const { data: existing } = await supabase
            .from('restaurants')
            .select('id')
            .eq('user_id', userId)
            .single();

          if (existing) {
            restaurantMap.set(restaurantData.email, existing.id);
            results.errors.push(`Restaurant ${restaurantData.restaurant_name} already exists`);
          } else {
            throw error;
          }
        } else if (restaurant) {
          restaurantMap.set(restaurantData.email, restaurant.id);
          results.restaurants++;
        }
      } catch (error) {
        console.error(`Error creating restaurant ${restaurantData.restaurant_name}:`, error);
        results.errors.push(`Failed to create restaurant ${restaurantData.restaurant_name}`);
      }
    }

    // Step 3: Create lab profiles
    const labMap = new Map<string, string>(); // email -> lab_id

    for (const labData of mockLabs) {
      try {
        const userId = userMap.get(labData.email);
        if (!userId) {
          results.errors.push(`User not found for lab ${labData.email}`);
          continue;
        }

        // Geocode address
        const coordinates = await geocodeAddress(labData.address);

        const { data: lab, error } = await supabase
          .from('labs')
          .insert({
            user_id: userId,
            institution_name: labData.institution_name,
            dept: labData.dept,
            lab_name: labData.lab_name,
            address: labData.address,
            latitude: coordinates?.latitude || null,
            longitude: coordinates?.longitude || null,
            extraction_frequency: labData.extraction_frequency,
            max_pickup_radius_km: labData.max_pickup_radius_km,
            application: labData.application,
            contact_phone: labData.contact_phone,
          })
          .select()
          .single();

        if (error) {
          // Lab might already exist
          const { data: existing } = await supabase
            .from('labs')
            .select('id')
            .eq('user_id', userId)
            .single();

          if (existing) {
            labMap.set(labData.email, existing.id);
            results.errors.push(`Lab ${labData.institution_name} already exists`);
          } else {
            throw error;
          }
        } else if (lab) {
          labMap.set(labData.email, lab.id);
          results.labs++;
        }
      } catch (error) {
        console.error(`Error creating lab ${labData.institution_name}:`, error);
        results.errors.push(`Failed to create lab ${labData.institution_name}`);
      }
    }

    // Step 4: Create supply streams
    for (const supplyData of mockSupplyStreams) {
      try {
        const restaurantId = restaurantMap.get(supplyData.restaurant_email);
        if (!restaurantId) {
          results.errors.push(`Restaurant not found for supply ${supplyData.restaurant_email}`);
          continue;
        }

        const { error } = await supabase.from('supply_streams').insert({
          restaurant_id: restaurantId,
          shell_type: supplyData.shell_type,
          weekly_quantity_kg: supplyData.weekly_quantity_kg,
          storage_method: supplyData.storage_method,
          cleanliness_level: supplyData.cleanliness_level,
          pickup_window: supplyData.pickup_window,
          notes: supplyData.notes,
          status: 'active',
        });

        if (error) {
          console.error(`Error creating supply stream:`, error);
          results.errors.push(`Failed to create supply stream for ${supplyData.restaurant_email}`);
        } else {
          results.supplies++;
        }
      } catch (error) {
        console.error(`Error creating supply stream:`, error);
        results.errors.push(`Failed to create supply stream`);
      }
    }

    // Step 5: Create demand streams
    for (const demandData of mockDemandStreams) {
      try {
        const labId = labMap.get(demandData.lab_email);
        if (!labId) {
          results.errors.push(`Lab not found for demand ${demandData.lab_email}`);
          continue;
        }

        const { error } = await supabase.from('demand_streams').insert({
          lab_id: labId,
          shell_type_needed: demandData.shell_type_needed,
          weekly_quantity_needed_kg: demandData.weekly_quantity_needed_kg,
          extraction_frequency: demandData.extraction_frequency,
          max_pickup_radius_km: demandData.max_pickup_radius_km,
          application: demandData.application,
          priority_level: demandData.priority_level,
          status: 'active',
        });

        if (error) {
          console.error(`Error creating demand stream:`, error);
          results.errors.push(`Failed to create demand stream for ${demandData.lab_email}`);
        } else {
          results.demands++;
        }
      } catch (error) {
        console.error(`Error creating demand stream:`, error);
        results.errors.push(`Failed to create demand stream`);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      results,
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error seeding database',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check if database has been seeded
 */
export async function GET() {
  try {
    const { count: userCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    const { count: restaurantCount } = await supabase
      .from('restaurants')
      .select('*', { count: 'exact', head: true });

    const { count: labCount } = await supabase
      .from('labs')
      .select('*', { count: 'exact', head: true });

    const { count: supplyCount } = await supabase
      .from('supply_streams')
      .select('*', { count: 'exact', head: true });

    const { count: demandCount } = await supabase
      .from('demand_streams')
      .select('*', { count: 'exact', head: true });

    const { count: matchCount } = await supabase
      .from('matches')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      database_status: {
        users: userCount || 0,
        restaurants: restaurantCount || 0,
        labs: labCount || 0,
        supply_streams: supplyCount || 0,
        demand_streams: demandCount || 0,
        matches: matchCount || 0,
      },
      ready_for_seeding: (userCount || 0) === 0,
    });
  } catch (error) {
    console.error('Database check error:', error);
    return NextResponse.json(
      { message: 'Error checking database status' },
      { status: 500 }
    );
  }
}
