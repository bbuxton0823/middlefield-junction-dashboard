import { NextRequest, NextResponse } from 'next/server';
import { SensorType } from '@prisma/client';
import prisma from '@/lib/db';
import { analyzeData } from '@/lib/openai';
import { getDateFromTimeRange } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();
    const { sensorTypes, timeRange, question } = requestData;
    
    // Validate required fields
    if (!timeRange) {
      return NextResponse.json(
        { error: 'Time range is required' },
        { status: 400 }
      );
    }
    
    // Get the start date based on the time range
    const startDate = getDateFromTimeRange(timeRange);
    
    // Build the query filter
    const filter: any = {
      timestamp: {
        gte: startDate,
      },
    };
    
    // Add sensor type filter if specified
    if (sensorTypes && sensorTypes.length > 0) {
      filter.sensor = {
        type: {
          in: sensorTypes,
        },
      };
    }
    
    // Get readings from the database
    const readings = await prisma.reading.findMany({
      where: filter,
      include: {
        sensor: true,
      },
      orderBy: {
        timestamp: 'desc',
      },
      // Limit the number of readings to analyze
      take: 1000,
    });
    
    if (readings.length === 0) {
      return NextResponse.json(
        { error: 'No data available for the specified filters' },
        { status: 404 }
      );
    }
    
    // Get sensorType for the analysis
    const sensorType = sensorTypes?.length === 1 ? sensorTypes[0] : undefined;
    
    // Perform analysis using OpenAI
    const analysis = await analyzeData({
      sensorType,
      timeRange,
      data: readings,
      question,
    });
    
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error performing analysis:', error);
    return NextResponse.json(
      { error: 'Failed to perform analysis' },
      { status: 500 }
    );
  }
} 