import { NextRequest, NextResponse } from 'next/server';
import { SensorType } from '@prisma/client';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const typeParam = searchParams.get('types');
    
    // Parse sensor types from query params
    let types: SensorType[] = [];
    if (typeParam) {
      types = typeParam.split(',').filter(Boolean) as SensorType[];
    }
    
    // Build the query filter based on provided types
    const filter = types.length > 0 
      ? { where: { type: { in: types } } }
      : {};
    
    // Get all sensors of specified types, or all sensors if no types specified
    const sensors = await prisma.sensor.findMany({
      ...filter,
      orderBy: {
        name: 'asc',
      },
      // Include the latest reading for each sensor
      include: {
        readings: {
          orderBy: {
            timestamp: 'desc',
          },
          take: 1,
        },
      },
    });
    
    // Transform the data to include the latest reading directly on the sensor
    const transformedSensors = sensors.map(sensor => ({
      ...sensor,
      latestReading: sensor.readings[0] || null,
      readings: undefined, // Remove the readings array
    }));
    
    return NextResponse.json(transformedSensors);
  } catch (error) {
    console.error('Error fetching sensors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sensors' },
      { status: 500 }
    );
  }
}

// For adding new sensors (admin only)
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate the sensor data
    if (!data.name || !data.type || data.latitude === undefined || data.longitude === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // TODO: Add authentication check for admin role
    
    // Create a new sensor
    const sensor = await prisma.sensor.create({
      data: {
        name: data.name,
        type: data.type,
        latitude: data.latitude,
        longitude: data.longitude,
        description: data.description || null,
        status: data.status || 'active',
      }
    });
    
    return NextResponse.json(sensor, { status: 201 });
  } catch (error) {
    console.error('Error creating sensor:', error);
    return NextResponse.json(
      { error: 'Failed to create sensor' },
      { status: 500 }
    );
  }
} 