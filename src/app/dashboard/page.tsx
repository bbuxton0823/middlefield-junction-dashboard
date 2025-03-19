'use client';

import { useState } from 'react';
import { TimeRange } from '@/types';
import TimeRangeSelector from '@/components/dashboard/TimeRangeSelector';
import SensorTypeSelector from '@/components/dashboard/SensorTypeSelector';
import MapboxMap from '@/components/maps/MapboxMap';
import TimeSeriesChart from '@/components/charts/TimeSeriesChart';
import SensorStats from '@/components/dashboard/SensorStats';
import AnalysisPanel from '@/components/dashboard/AnalysisPanel';

export default function DashboardPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('24h');
  const [selectedSensorTypes, setSelectedSensorTypes] = useState<string[]>([
    'STREETLIGHT',
    'PEDESTRIAN', 
    'TRAFFIC',
    'ENVIRONMENTAL'
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
            Middlefield Junction Dashboard
          </h1>
          
          <div className="flex flex-wrap gap-4">
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
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* Map Section - Takes 3/4 width on large screens */}
          <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 h-[400px]">
            <MapboxMap 
              sensorTypes={selectedSensorTypes}
              timeRange={selectedTimeRange}
            />
          </div>
          
          {/* Stats Panel - Takes 1/4 width on large screens */}
          <div className="lg:col-span-1 space-y-6">
            <SensorStats
              sensorTypes={selectedSensorTypes}
              timeRange={selectedTimeRange}
            />
          </div>
        </div>

        {/* AI Analysis Panel - Full width */}
        <div className="mb-6">
          <AnalysisPanel
            sensorTypes={selectedSensorTypes}
            timeRange={selectedTimeRange}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Streetlight Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-3 h-3 rounded-full bg-streetlight mr-2"></span>
              Streetlights
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              15 active sensors monitoring light levels across the city.
            </p>
            <div className="mt-4 text-2xl font-bold">98% Operational</div>
          </div>
          
          {/* Pedestrian Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-3 h-3 rounded-full bg-pedestrian mr-2"></span>
              Pedestrian Traffic
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Current pedestrian count across monitored intersections.
            </p>
            <div className="mt-4 text-2xl font-bold">1,245 People</div>
          </div>
          
          {/* Traffic Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-3 h-3 rounded-full bg-traffic mr-2"></span>
              Vehicle Traffic
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Current vehicle count on monitored roadways.
            </p>
            <div className="mt-4 text-2xl font-bold">3,872 Vehicles</div>
          </div>
          
          {/* Environmental Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-3 h-3 rounded-full bg-environmental mr-2"></span>
              Air Quality
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Current average air quality index across the city.
            </p>
            <div className="mt-4 text-2xl font-bold">37 AQI (Good)</div>
          </div>
        </div>
        
        {/* Chart Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Sensor Data Trends
          </h2>
          <div className="h-64">
            <TimeSeriesChart 
              sensorTypes={selectedSensorTypes}
              timeRange={selectedTimeRange}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 