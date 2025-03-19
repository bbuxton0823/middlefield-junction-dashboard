'use client';

import { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { fetcher } from '@/lib/utils';
import { TimeRange } from '@/types';
import SensorInfoWindow from './SensorInfoWindow';

interface DashboardMapProps {
  sensorTypes: string[];
  timeRange: TimeRange;
}

// Convert DMS coordinates to decimal
// 37°28'35.5"N 122°12'40.1"W
function convertDMStoDecimal(dms: string): number {
  // Example: 37°28'35.5"N
  const parts = dms.match(/(\d+)°(\d+)'(\d+\.?\d*)"([NSEW])/);
  
  if (!parts) return 0;
  
  const degrees = parseFloat(parts[1]);
  const minutes = parseFloat(parts[2]) / 60;
  const seconds = parseFloat(parts[3]) / 3600;
  const direction = parts[4];
  
  let decimal = degrees + minutes + seconds;
  
  if (direction === 'S' || direction === 'W') {
    decimal = -decimal;
  }
  
  return decimal;
}

// The coordinates for Middlefield Junction
const MIDDLEFIELD_LAT = convertDMStoDecimal("37°28'35.5\"N");
const MIDDLEFIELD_LNG = convertDMStoDecimal("122°12'40.1\"W");

const containerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: MIDDLEFIELD_LAT,
  lng: MIDDLEFIELD_LNG
};

// Sample sensor locations around the center
const generateSensorLocations = (sensorTypes: string[]) => {
  const locations: any[] = [];
  
  sensorTypes.forEach((type) => {
    // Create 3 sensors of each type at slightly different locations
    for (let i = 0; i < 3; i++) {
      // Add some randomness to the locations
      const latOffset = (Math.random() - 0.5) * 0.01; // Approx 1km
      const lngOffset = (Math.random() - 0.5) * 0.01;
      
      locations.push({
        id: `${type}-${i}`,
        type,
        position: {
          lat: MIDDLEFIELD_LAT + latOffset,
          lng: MIDDLEFIELD_LNG + lngOffset
        }
      });
    }
  });
  
  return locations;
};

export default function DashboardMap({ sensorTypes, timeRange }: DashboardMapProps) {
  const [sensorLocations, setSensorLocations] = useState<any[]>([]);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<any | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState<boolean>(false);
  
  // Get Google Maps API key
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  
  // Check if API key is available
  useEffect(() => {
    if (!apiKey || apiKey.trim() === '') {
      setApiKeyMissing(true);
      setError('Google Maps API key is missing. Please add it to your environment variables.');
      console.error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable is not set');
    }
  }, [apiKey]);
  
  // Load Google Maps JS API - only if we have an API key
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    // Add these options to help debug
    nonce: 'middlefield-junction-maps',
    language: 'en',
    region: 'US',
    libraries: ['places', 'visualization', 'drawing', 'geometry'],
    version: 'weekly',
    googleMapsClientId: undefined,
    preventGoogleFontsLoading: false,
    channel: 'middlefield-dashboard'
  });
  
  // Handle Google Maps API load error
  useEffect(() => {
    if (loadError) {
      setError(`Failed to load Google Maps API: ${loadError.message}`);
      console.error('Google Maps load error:', loadError);
    }
  }, [loadError]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);
  
  // Fetch sensor data function (with API placeholder)
  const fetchSensorData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // API endpoint URL
      const apiUrl = `/api/sensors?types=${sensorTypes.join(',')}`;
      
      // FOR DEVELOPMENT: Comment this section out to use mock data
      // Uncomment to use real API
      /*
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch sensor data');
      }
      const data = await response.json();
      
      // Transform API response to marker format
      const locations = data.map((sensor: any) => ({
        id: sensor.id,
        type: sensor.type,
        position: {
          lat: sensor.latitude,
          lng: sensor.longitude
        },
        status: sensor.status,
        lastReading: sensor.latestReading
      }));
      
      setSensorLocations(locations);
      */
      
      // MOCK DATA: Remove this block when switching to real API
      console.log(`API would call: ${apiUrl}`);
      const locations = generateSensorLocations(sensorTypes);
      setSensorLocations(locations);
      
      console.log('Fetched sensor data for types:', sensorTypes, 'and timeRange:', timeRange);
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      setError('Failed to load sensor data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [sensorTypes, timeRange]);

  useEffect(() => {
    // Only fetch data if we don't have API key issues
    if (!apiKeyMissing && !loadError) {
      fetchSensorData();
      
      // Set up real-time updates
      const interval = setInterval(fetchSensorData, 60000); // Update every minute
      return () => clearInterval(interval);
    }
  }, [fetchSensorData, apiKeyMissing, loadError]);

  // Map loading indicator
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // API key missing error
  if (apiKeyMissing) {
    return (
      <div className="flex flex-col justify-center items-center h-full bg-gray-100 p-6 rounded-lg">
        <div className="text-red-500 text-lg font-medium mb-4">Google Maps API Key Required</div>
        <p className="text-gray-700 text-center mb-6">
          To display the map, you need to add a valid Google Maps API key to your environment variables.
        </p>
        <div className="bg-gray-200 p-4 rounded-md w-full max-w-2xl mb-6">
          <code className="text-sm">
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
          </code>
        </div>
        <p className="text-gray-600 text-sm text-center">
          You can get an API key from the <a href="https://console.cloud.google.com/google/maps-apis" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">Google Cloud Console</a>.
          <br />
          Add it to your <code className="bg-gray-200 px-1 py-0.5 rounded">.env.local</code> file.
        </p>
      </div>
    );
  }

  // Google Maps loading error
  if (loadError) {
    return (
      <div className="flex flex-col justify-center items-center h-full bg-gray-100 p-6 rounded-lg">
        <div className="text-red-500 text-lg font-medium mb-4">Google Maps Failed to Load</div>
        <p className="text-gray-700 text-center mb-6">
          There was an error loading Google Maps: {loadError.message}
        </p>
        <div className="bg-gray-200 p-4 rounded-md w-full max-w-2xl mb-6 overflow-auto">
          <code className="text-sm">
            Error details: {JSON.stringify(loadError, null, 2)}
          </code>
        </div>
        <p className="text-gray-600 text-sm text-center">
          Please check your API key and ensure it has the correct permissions for Maps JavaScript API.
          <br />
          Also make sure billing is enabled for your Google Cloud project.
        </p>
      </div>
    );
  }

  // Data loading indicator
  if (isLoading && sensorLocations.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // General error state
  if (error && sensorLocations.length === 0) {
    return (
      <div className="flex justify-center items-center h-full text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  // Get the corresponding color for each sensor type
  const getSensorColor = (type: string) => {
    switch (type) {
      case 'STREETLIGHT': return '#FFC107'; // Amber
      case 'PEDESTRIAN': return '#2196F3'; // Blue
      case 'TRAFFIC': return '#F44336'; // Red
      case 'ENVIRONMENTAL': return '#4CAF50'; // Green
      default: return '#6c757d'; // Gray
    }
  };

  return (
    <div className="w-full h-full relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        }}
      >
        {/* Render markers for each sensor */}
        {sensorLocations.map((sensor) => (
          <Marker
            key={sensor.id}
            position={sensor.position}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: getSensorColor(sensor.type),
              fillOpacity: 0.8,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            }}
            title={`${sensor.type} Sensor ${sensor.id.split('-')[1]}`}
            onClick={() => setSelectedSensor(sensor)}
          />
        ))}
        
        {/* Render info window for selected sensor */}
        {selectedSensor && (
          <SensorInfoWindow 
            sensor={selectedSensor}
            onClose={() => setSelectedSensor(null)}
          />
        )}
      </GoogleMap>
      
      {/* Fallback message if no data is available but no errors */}
      {sensorLocations.length === 0 && !isLoading && !error && (
        <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-80">
          <div className="text-gray-700 text-center p-4">
            <p className="mb-2">No sensor data available for the selected criteria.</p>
            <p>Try selecting different sensor types or time range.</p>
          </div>
        </div>
      )}
    </div>
  );
} 