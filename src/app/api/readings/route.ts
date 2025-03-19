import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET readings for a specific sensor or sensors
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sensorIds = searchParams.get('sensorIds');
    const limit = parseInt(searchParams.get('limit') || '100');
    
    // Parse sensor IDs from query params
    let ids: string[] = [];
    if (sensorIds) {
      ids = sensorIds.split(',').filter(Boolean);
    }
    
    // Get readings from the database
    const readings = await prisma.reading.findMany({
      where: {
        sensorId: ids.length > 0 ? {
          in: ids,
        } : undefined,
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: Math.min(limit, 500), // Limit to maximum 500 readings
      include: {
        sensor: true,
      },
    });
    
    return NextResponse.json(readings);
  } catch (error) {
    console.error('Error fetching readings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch readings' },
      { status: 500 }
    );
  }
}

// POST to add new readings
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.sensorId || data.value === undefined || !data.timestamp) {
      return NextResponse.json(
        { error: 'Missing required fields: sensorId, value, and timestamp are required' },
        { status: 400 }
      );
    }
    
    // Check if the sensor exists
    const sensor = await prisma.sensor.findUnique({
      where: {
        id: data.sensorId,
      },
    });
    
    if (!sensor) {
      return NextResponse.json(
        { error: 'Sensor not found' },
        { status: 404 }
      );
    }
    
    // Create the reading
    const reading = await prisma.reading.create({
      data: {
        sensorId: data.sensorId,
        value: data.value,
        timestamp: new Date(data.timestamp),
        unit: data.unit || "unit",
      },
    });
    
    return NextResponse.json(reading, { status: 201 });
  } catch (error) {
    console.error('Error creating reading:', error);
    return NextResponse.json(
      { error: 'Failed to create reading' },
      { status: 500 }
    );
  }
}

// PLACEHOLDER: For batch creation of readings
// export async function PUT(request: NextRequest) {
//   try {
//     const data = await request.json();
//     
//     if (!Array.isArray(data)) {
//       return NextResponse.json(
//         { error: 'Request body must be an array of readings' },
//         { status: 400 }
//       );
//     }
//     
//     // Validate all readings
//     for (const reading of data) {
//       if (!reading.sensorId || reading.value === undefined || !reading.timestamp) {
//         return NextResponse.json(
//           { error: 'All readings must have sensorId, value, and timestamp' },
//           { status: 400 }
//         );
//       }
//     }
//     
//     // Create all readings in a transaction
//     const result = await prisma.$transaction(
//       data.map((reading) => 
//         prisma.reading.create({
//           data: {
//             sensorId: reading.sensorId,
//             value: reading.value,
//             timestamp: new Date(reading.timestamp),
//             unit: reading.unit || "unit",
//           },
//         })
//       )
//     );
//     
//     return NextResponse.json({ count: result.length }, { status: 201 });
//   } catch (error) {
//     console.error('Error batch creating readings:', error);
//     return NextResponse.json(
//       { error: 'Failed to create readings' },
//       { status: 500 }
//     );
//   }
// } 