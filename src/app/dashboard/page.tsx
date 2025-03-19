'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import DashboardMap from '@/components/maps/DashboardMap';
import SensorStats from '@/components/dashboard/SensorStats';
import TimeRangeSelector from '@/components/dashboard/TimeRangeSelector';
import SensorTypeSelector from '@/components/dashboard/SensorTypeSelector';
import AnalysisPanel from '@/components/dashboard/AnalysisPanel';
import TimeSeriesChart from '@/components/charts/TimeSeriesChart';
import { TimeRange } from '@/types';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('24h');
  const [selectedSensorTypes, setSelectedSensorTypes] = useState<string[]>([
    'STREETLIGHT',
    'PEDESTRIAN', 
    'TRAFFIC',
    'ENVIRONMENTAL'
  ]);
  
  // If not authenticated, redirect to login
  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }
  
  if (status === 'loading') {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-row items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Middlefield Junction Dashboard
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 mt-4 md:mt-0">
            <TimeRangeSelector 
              selected={selectedTimeRange} 
              onChange={setSelectedTimeRange} 
            />
            <SensorTypeSelector 
              selected={selectedSensorTypes} 
              onChange={setSelectedSensorTypes} 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main map - takes 2/3 of width on large screens */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-[500px]">
            <DashboardMap 
              sensorTypes={selectedSensorTypes} 
              timeRange={selectedTimeRange} 
            />
          </div>
          
          {/* Stats and analysis panel - takes 1/3 of width */}
          <div className="space-y-6">
            <SensorStats 
              sensorTypes={selectedSensorTypes} 
              timeRange={selectedTimeRange}
            />
            
            <AnalysisPanel 
              sensorTypes={selectedSensorTypes}
              timeRange={selectedTimeRange}
            />
          </div>
        </div>
        
        {/* Charts section - full width */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Sensor Data Trends
          </h2>
          <TimeSeriesChart 
            sensorTypes={selectedSensorTypes}
            timeRange={selectedTimeRange}
          />
        </div>
      </div>
    </div>
  );
} 