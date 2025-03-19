'use client';

import { useState, useEffect } from 'react';
import { TimeRange } from '@/types';
import { fetcher, formatNumber } from '@/lib/utils';

interface SensorStatsProps {
  sensorTypes: string[];
  timeRange: TimeRange;
}

interface StatsData {
  totalSensors: number;
  activeCount: number;
  inactiveCount: number;
  readingsInPeriod: number;
  averages: {
    [key: string]: number;
  };
}

export default function SensorStats({ sensorTypes, timeRange }: SensorStatsProps) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        // In a real implementation, fetch from API
        // const data = await fetcher(`/api/stats?types=${sensorTypes.join(',')}&timeRange=${timeRange}`);
        
        // For now, use mock data
        const mockData: StatsData = {
          totalSensors: 20,
          activeCount: 18,
          inactiveCount: 2,
          readingsInPeriod: 1420,
          averages: {
            'STREETLIGHT': 12500,
            'PEDESTRIAN': 45,
            'TRAFFIC': 75,
            'ENVIRONMENTAL': 28
          }
        };
        
        setStats(mockData);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [sensorTypes, timeRange]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Sensor Statistics</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Sensor Statistics</h2>
        <p className="text-gray-500 dark:text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Sensor Statistics
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total Sensors</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(stats.totalSensors)}</div>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
          <div className="text-green-600 dark:text-green-400 text-sm font-medium">Active Sensors</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(stats.activeCount)}</div>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
          <div className="text-purple-600 dark:text-purple-400 text-sm font-medium">Readings</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(stats.readingsInPeriod)}</div>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
          <div className="text-red-600 dark:text-red-400 text-sm font-medium">Inactive Sensors</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(stats.inactiveCount)}</div>
        </div>
      </div>

      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Average Readings</h3>
      <div className="space-y-2">
        {Object.entries(stats.averages)
          .filter(([type]) => sensorTypes.includes(type))
          .map(([type, value]) => (
            <div key={type} className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">{type}</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatNumber(value)}</span>
            </div>
          ))}
      </div>
    </div>
  );
} 