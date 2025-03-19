'use client';

import { useState, useEffect } from 'react';
import { TimeRange } from '@/types';
import { fetcher } from '@/lib/utils';

interface TimeSeriesChartProps {
  sensorTypes: string[];
  timeRange: TimeRange;
}

export default function TimeSeriesChart({ sensorTypes, timeRange }: TimeSeriesChartProps) {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchChartData() {
      setLoading(true);
      try {
        // In a real implementation, fetch from API
        // const data = await fetcher(
        //   `/api/readings/timeseries?types=${sensorTypes.join(',')}&timeRange=${timeRange}`
        // );
        
        // For now, use mock data
        const mockData = generateMockTimeSeriesData(sensorTypes, timeRange);
        
        // Simulate API delay
        setTimeout(() => {
          setChartData(mockData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching time series data:', error);
        setLoading(false);
      }
    }

    fetchChartData();
  }, [sensorTypes, timeRange]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">No data available for the selected filters</p>
      </div>
    );
  }

  return (
    <div className="h-96 w-full">
      <div className="text-center text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
        <h3 className="text-lg font-medium">Chart Placeholder</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          This will be replaced with an interactive time series chart showing sensor data over time
        </p>
        <div className="mt-4 bg-white dark:bg-gray-800 p-2 rounded text-left text-sm overflow-auto max-h-64">
          <pre className="whitespace-pre-wrap">
            {JSON.stringify({ timeRange, sensorTypes, dataPoints: chartData.length }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

// Helper function to generate mock time series data
function generateMockTimeSeriesData(sensorTypes: string[], timeRange: TimeRange) {
  const dataPoints = [];
  const now = new Date();
  let timeIncrement: number;
  let numPoints: number;
  
  // Determine time increment and number of points based on time range
  switch (timeRange) {
    case '24h':
      timeIncrement = 60 * 60 * 1000; // 1 hour
      numPoints = 24;
      break;
    case '7d':
      timeIncrement = 6 * 60 * 60 * 1000; // 6 hours
      numPoints = 28;
      break;
    case '30d':
      timeIncrement = 24 * 60 * 60 * 1000; // 1 day
      numPoints = 30;
      break;
    case '1y':
      timeIncrement = 7 * 24 * 60 * 60 * 1000; // 1 week
      numPoints = 52;
      break;
    default:
      timeIncrement = 60 * 60 * 1000; // 1 hour
      numPoints = 24;
  }
  
  // Generate data points
  for (let i = numPoints - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - (i * timeIncrement));
    const point: any = {
      timestamp,
      formattedTime: timestamp.toLocaleString(),
    };
    
    // Add value for each sensor type
    sensorTypes.forEach(type => {
      switch (type) {
        case 'STREETLIGHT':
          // Light level varies by time of day
          const hour = timestamp.getHours();
          const isDayTime = hour >= 7 && hour <= 18;
          point[type] = isDayTime ? 
            Math.floor(Math.random() * 10000) + 20000 : // Day
            Math.floor(Math.random() * 10); // Night
          break;
        case 'PEDESTRIAN':
          // Pedestrians follow daily patterns
          point[type] = Math.floor(Math.random() * 40) + 
            (hour >= 8 && hour <= 18 ? 40 : 10); // More during day
          break;
        case 'TRAFFIC':
          // Traffic peaks at rush hours
          let baseTraffic = 30;
          if ((hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 18)) {
            baseTraffic = 100; // Rush hour
          }
          point[type] = Math.floor(Math.random() * 30) + baseTraffic;
          break;
        case 'ENVIRONMENTAL':
          // Air quality (PM2.5)
          point[type] = Math.floor(Math.random() * 15) + 20;
          break;
        default:
          point[type] = Math.floor(Math.random() * 100);
      }
    });
    
    dataPoints.push(point);
  }
  
  return dataPoints;
} 