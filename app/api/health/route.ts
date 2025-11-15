import { NextResponse } from 'next/server';
import { supabase } from '@/app/util/supabaseClient';

export async function GET() {
  try {
    // Test database connection
    const { error } = await supabase.from('users').select('id').limit(1);

    if (error) {
      return NextResponse.json(
        {
          status: 'unhealthy',
          message: 'Database connection failed',
          error: error.message,
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: 'healthy',
      message: 'ShellCycle API is running',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        message: 'Health check failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
