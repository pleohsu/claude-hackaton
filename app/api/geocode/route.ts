import { NextRequest, NextResponse } from 'next/server';
import { geocodeAddress } from '@/app/util/geolocation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { message: 'Address parameter is required' },
        { status: 400 }
      );
    }

    const coordinates = await geocodeAddress(address);

    if (!coordinates) {
      return NextResponse.json(
        { message: 'Unable to geocode address' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      address,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    });
  } catch (error) {
    console.error('Geocoding error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
