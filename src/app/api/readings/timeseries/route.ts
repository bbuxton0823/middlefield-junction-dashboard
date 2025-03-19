import { NextRequest, NextResponse } from 'next/server';
import { SensorType } from '@prisma/client';
import prisma from '@/lib/db';
import { getDateFromTimeRange } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const typeParam = searchParams.get('types') || '';
    const timeRange = searchParams.get('timeRange') || '24h';
    
    // Parse sensor types from query params
    const types = typeParam.split(',').filter(Boolean) as SensorType[];
    
    // Get the start date based on the time range
    const startDate = getDateFromTimeRange(timeRange);
    
    // Get readings from the database
    const readings = await prisma.reading.findMany({
      where: {
        timestamp: {
          gte: startDate,
        },
        sensor: types.length > 0 ? {
          type: {
            in: types,
          },
        } : undefined,
      },
      include: {
        sensor: true,
      },
      orderBy: {
        timestamp: 'asc',
      },
    });
    
    // Group readings by timestamp (rounded to 15 minute intervals)
    const groupedByTime = readings.reduce((acc, reading) => {
      // Round the timestamp to 15 minute intervals
      const timestamp = new Date(reading.timestamp);
      timestamp.setMinutes(Math.floor(timestamp.getMinutes() / 15) * 15);
      timestamp.setSeconds(0);
      timestamp.setMilliseconds(0);
      
      const timeKey = timestamp.toISOString();
      
      if (!acc[timeKey]) {
        acc[timeKey] = {
          timestamp: timeKey,
          values: {},
          counts: {},
        };
      }
      
      const sensorType = reading.sensor.type;
      
      // Sum values for each sensor type
      if (!acc[timeKey].values[sensorType]) {
        acc[timeKey].values[sensorType] = 0;
        acc[timeKey].counts[sensorType] = 0;
      }
      
      acc[timeKey].values[sensorType] += reading.value;
      acc[timeKey].counts[sensorType] += 1;
      
      return acc;
    }, {} as Record<string, { timestamp: string; values: Record<string, number>; counts: Record<string, number> }>);
    
    // Calculate averages and format data for the response
    const timeSeriesData = Object.values(groupedByTime).map(group => {
      const result: Record<string, string | number> = { timestamp: group.timestamp };
      
      // Calculate average for each sensor type
      Object.keys(group.values).forEach(sensorType => {
        result[sensorType] = group.values[sensorType] / group.counts[sensorType];
      });
      
      return result;
    });
    
    // Sort by timestamp
    timeSeriesData.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    return NextResponse.json(timeSeriesData);
  } catch (error) {
    console.error('Error fetching time series data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch time series data' },
      { status: 500 }
    );
  }
} 