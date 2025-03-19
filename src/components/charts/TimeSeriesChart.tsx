'use client';

import { useState, useEffect } from 'react';
import { TimeRange } from '@/types';
import { fetcher } from '@/lib/utils';
import { getMockTimeSeriesData } from '@/lib/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TimeSeriesChartProps {
  sensorTypes: string[];
  timeRange: TimeRange;
}

// Define the API endpoint that will be used in production
const API_ENDPOINT = '/api/readings/timeseries';

// Toggle this to use mock data or real API
const USE_MOCK_DATA = true;

export default function TimeSeriesChart({ sensorTypes, timeRange }: TimeSeriesChartProps) {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChartData() {
      setLoading(true);
      setError(null);
      
      try {
        let data;
        
        // Toggle between mock data and real API
        if (USE_MOCK_DATA) {
          // Use mock data service
          data = getMockTimeSeriesData(sensorTypes, timeRange);
          
          // Add a small delay to simulate API call
          await new Promise(resolve => setTimeout(resolve, 800));
        } else {
          // In production, fetch from real API
          const queryParams = new URLSearchParams();
          queryParams.append('timeRange', timeRange);
          if (sensorTypes.length > 0) {
            queryParams.append('types', sensorTypes.join(','));
          }
          
          const url = `${API_ENDPOINT}?${queryParams.toString()}`;
          data = await fetcher(url);
        }
        
        // Process and format dates for the chart
        const formattedData = data.map((item: any) => ({
          ...item,
          formattedDate: new Date(item.timestamp).toLocaleDateString()
        }));
        
        setChartData(formattedData);
      } catch (err) {
        console.error('Error fetching time series data:', err);
        setError('Failed to load chart data');
      } finally {
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

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">
          <p>{error}</p>
          <button 
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-700 dark:text-gray-300">No data available for the selected filters</p>
      </div>
    );
  }
  
  // Define colors for different sensor types
  const sensorColors = {
    ENVIRONMENTAL: '#4CAF50', // Green
    TRAFFIC: '#F44336',       // Red
    PEDESTRIAN: '#2196F3',    // Blue
    STREETLIGHT: '#FFC107'    // Amber
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      {chartData.length > 0 ? (
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="formattedDate" 
            stroke="#718096"
            tick={{ fill: '#718096' }}
          />
          <YAxis 
            stroke="#718096"
            tick={{ fill: '#718096' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)', 
              borderColor: '#e2e8f0',
              borderRadius: '4px'
            }} 
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          
          {/* Render a line for each selected sensor type */}
          {sensorTypes.map(type => (
            <Line
              key={type}
              type="monotone"
              dataKey={type}
              stroke={sensorColors[type as keyof typeof sensorColors] || '#999'}
              activeDot={{ r: 8 }}
              strokeWidth={2}
              name={type.charAt(0) + type.slice(1).toLowerCase()}
            />
          ))}
        </LineChart>
      ) : (
        <div className="text-center text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-medium">Chart Placeholder</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This will be replaced with an interactive time series chart showing sensor data over time
          </p>
          <div className="mt-4 bg-white dark:bg-gray-800 p-2 rounded text-left text-sm overflow-auto max-h-64">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify({ timeRange, sensorTypes, dataPoints: 24 }, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </ResponsiveContainer>
  );
} 