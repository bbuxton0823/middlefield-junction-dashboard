'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Sensor {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  status: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface Reading {
  id: string;
  value: number;
  unit: string;
  timestamp: string;
}

export default function SensorDetailPage() {
  const params = useParams();
  const sensorId = params.id as string;
  
  const [sensor, setSensor] = useState<Sensor | null>(null);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // For time range selection
  const [timeRange, setTimeRange] = useState<string>('24h');
  
  useEffect(() => {
    // Fetch sensor details
    const fetchSensorDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real implementation, fetch from API
        // const response = await fetch(`/api/sensors/${sensorId}`);
        // if (!response.ok) throw new Error('Failed to fetch sensor details');
        // const data = await response.json();
        
        // Mock data for now
        const mockSensor = {
          id: sensorId,
          name: `Sensor ${sensorId.substring(0, 6)}`,
          type: ['STREETLIGHT', 'PEDESTRIAN', 'TRAFFIC', 'ENVIRONMENTAL'][Math.floor(Math.random() * 4)],
          latitude: 37.4419 + (Math.random() - 0.5) * 0.01,
          longitude: -122.1430 + (Math.random() - 0.5) * 0.01,
          status: 'active',
          description: 'Simulated sensor for demonstration',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
          updatedAt: new Date().toISOString()
        };
        
        setSensor(mockSensor);
        
        // Fetch readings in the same effect to ensure sensor data is available
        // In a real implementation, this would be:
        // const readingsResponse = await fetch(`/api/readings/timeseries?sensorIds=${sensorId}&timeRange=${timeRange}`);
        // const readingsData = await readingsResponse.json();
        
        // Generate mock readings data - 24 hours with hourly readings
        const mockReadings = [];
        const now = new Date();
        
        for (let i = 0; i < 24; i++) {
          const timestamp = new Date(now.getTime() - (23 - i) * 1000 * 60 * 60);
          mockReadings.push({
            id: `reading-${i}`,
            timestamp: timestamp.toISOString(),
            value: 50 + Math.sin(i / 3) * 30 + Math.random() * 10, // Sine wave pattern with noise
            unit: 'units'
          });
        }
        
        setReadings(mockReadings);
      } catch (err) {
        console.error('Error fetching sensor details:', err);
        setError('Failed to load sensor information. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSensorDetails();
  }, [sensorId, timeRange]);
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };
  
  // Get the sensor type icon
  const getSensorTypeIcon = (type: string) => {
    switch (type) {
      case 'STREETLIGHT': return '💡';
      case 'PEDESTRIAN': return '🚶';
      case 'TRAFFIC': return '🚗';
      case 'ENVIRONMENTAL': return '🌳';
      default: return '📡';
    }
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error || !sensor) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 p-8">
        <div className="text-red-500 mb-4 text-xl">{error || 'Sensor not found'}</div>
        <Link href="/dashboard" className="text-blue-500 hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }
  
  // Prepare chart data
  const chartData = readings.map(reading => ({
    time: formatTimestamp(reading.timestamp),
    value: reading.value,
  }));
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard" className="text-blue-500 hover:underline flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Dashboard
          </Link>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <span className="text-3xl mr-3">{getSensorTypeIcon(sensor.type)}</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {sensor.name}
                </h1>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  ID: {sensor.id}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <div className={`px-3 py-1 rounded-full text-sm text-white ${getStatusColor(sensor.status)}`}>
                {sensor.status.charAt(0).toUpperCase() + sensor.status.slice(1)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Last updated: {formatDate(sensor.updatedAt)}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Details
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Type:</span>
                    <span className="font-medium">{sensor.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Latitude:</span>
                    <span className="font-medium">{sensor.latitude.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Longitude:</span>
                    <span className="font-medium">{sensor.longitude.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Created:</span>
                    <span className="font-medium">{formatDate(sensor.createdAt)}</span>
                  </div>
                </div>
              </div>
              
              {sensor.description && (
                <div className="mt-4">
                  <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    Description
                  </h2>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300">{sensor.description}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Readings
                </h2>
                
                <div className="flex space-x-2">
                  {['24h', '7d', '30d'].map((range) => (
                    <button
                      key={range}
                      className={`px-2 py-1 text-xs rounded ${
                        timeRange === range 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                      onClick={() => setTimeRange(range)}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 h-64">
                {readings.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#3b82f6" 
                        fill="#93c5fd" 
                        fillOpacity={0.6} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    No reading data available
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Raw Data
            </h2>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-80 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Unit
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {readings.map((reading) => (
                    <tr key={reading.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {new Date(reading.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {reading.value.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {reading.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 