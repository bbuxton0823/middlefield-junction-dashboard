'use client';

import { useState, useEffect } from 'react';
import { InfoWindow } from '@react-google-maps/api';

interface SensorReading {
  id: string;
  value: number;
  unit: string;
  timestamp: string;
}

interface SensorInfo {
  id: string;
  name: string;
  type: string;
  status: string;
  latestReading?: SensorReading;
  position: {
    lat: number;
    lng: number;
  };
}

interface SensorInfoWindowProps {
  sensor: SensorInfo;
  onClose: () => void;
}

export default function SensorInfoWindow({ sensor, onClose }: SensorInfoWindowProps) {
  const [lastReadings, setLastReadings] = useState<SensorReading[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // This would fetch the latest readings from the API
    // For now, we'll just simulate it
    const fetchReadings = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        // In a real implementation, this would be:
        // const response = await fetch(`/api/readings?sensorIds=${sensor.id}&limit=5`);
        // const data = await response.json();
        
        // Mock data
        const mockReadings = [
          {
            id: '1',
            value: Math.round(Math.random() * 100),
            unit: 'units',
            timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() // 5 mins ago
          },
          {
            id: '2',
            value: Math.round(Math.random() * 100),
            unit: 'units',
            timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString() // 10 mins ago
          },
          {
            id: '3',
            value: Math.round(Math.random() * 100),
            unit: 'units',
            timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() // 15 mins ago
          }
        ];
        
        setLastReadings(mockReadings);
      } catch (error) {
        console.error('Error fetching sensor readings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReadings();
  }, [sensor.id]);

  // Format the timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get the sensor type icon
  const getSensorTypeIcon = (type: string) => {
    switch (type) {
      case 'STREETLIGHT':
        return '💡';
      case 'PEDESTRIAN':
        return '🚶';
      case 'TRAFFIC':
        return '🚗';
      case 'ENVIRONMENTAL':
        return '🌳';
      default:
        return '📡';
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-gray-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <InfoWindow position={sensor.position} onCloseClick={onClose}>
      <div className="w-64 max-h-80 overflow-y-auto">
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold flex items-center">
              <span className="mr-1">{getSensorTypeIcon(sensor.type)}</span>
              {sensor.name || `${sensor.type} Sensor`}
            </h3>
            <div className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(sensor.status || 'active')}`}>
              {sensor.status || 'Active'}
            </div>
          </div>
          
          <div className="text-sm text-gray-500 mb-4">
            ID: {sensor.id}
          </div>
          
          <div className="mb-4">
            <div className="font-medium text-gray-700">Location</div>
            <div className="text-sm">
              Lat: {sensor.position.lat.toFixed(6)}<br />
              Lng: {sensor.position.lng.toFixed(6)}
            </div>
          </div>
          
          <div>
            <div className="font-medium text-gray-700 mb-2">Recent Readings</div>
            {isLoading ? (
              <div className="py-2 text-sm text-gray-500">Loading...</div>
            ) : lastReadings.length > 0 ? (
              <div className="space-y-2">
                {lastReadings.map(reading => (
                  <div key={reading.id} className="bg-gray-50 p-2 rounded text-sm flex justify-between">
                    <div>
                      {reading.value} {reading.unit}
                    </div>
                    <div className="text-gray-500">{formatTimestamp(reading.timestamp)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-2 text-sm text-gray-500">No recent readings available</div>
            )}
          </div>
          
          <div className="mt-4 text-right">
            <button 
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition"
              onClick={() => window.open(`/sensors/${sensor.id}`, '_blank')}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </InfoWindow>
  );
} 