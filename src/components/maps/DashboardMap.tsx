'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetcher } from '@/lib/utils';
import { TimeRange } from '@/types';

interface DashboardMapProps {
  sensorTypes: string[];
  timeRange: TimeRange;
}

export default function DashboardMap({ sensorTypes, timeRange }: DashboardMapProps) {
  const [isMapboxLoaded, setIsMapboxLoaded] = useState(false);
  
  // In a real implementation, use Mapbox GL JS for the map
  useEffect(() => {
    // Simulate loading the map
    const timer = setTimeout(() => {
      setIsMapboxLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Simulate fetching sensor data
  const fetchSensorData = useCallback(async () => {
    try {
      // In a real implementation, fetch from API
      // const data = await fetcher(`/api/sensors?types=${sensorTypes.join(',')}`);
      console.log('Would fetch sensor data for types:', sensorTypes, 'and timeRange:', timeRange);
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    }
  }, [sensorTypes, timeRange]);

  useEffect(() => {
    fetchSensorData();
    
    // Set up real-time updates
    const interval = setInterval(fetchSensorData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [fetchSensorData, sensorTypes]);

  if (!isMapboxLoaded) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Map Placeholder</h3>
        <p className="text-gray-600 dark:text-gray-400">
          This will be replaced with a Mapbox map showing sensor locations in Middlefield Junction
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
          Sensor types: {sensorTypes.join(', ')} | Time range: {timeRange}
        </p>
      </div>
    </div>
  );
} 