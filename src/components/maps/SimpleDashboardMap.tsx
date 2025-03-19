'use client';

import { useState, useEffect, useRef } from 'react';
import { TimeRange } from '@/types';
import GoogleMapScript from './GoogleMapScript';

interface SimpleDashboardMapProps {
  sensorTypes: string[];
  timeRange: TimeRange;
}

// Convert DMS coordinates to decimal
function convertDMStoDecimal(dms: string): number {
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

export default function SimpleDashboardMap({ sensorTypes, timeRange }: SimpleDashboardMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [googleMap, setGoogleMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get Google Maps API key
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  
  // Handle Google Maps script loading
  const handleMapLoad = () => {
    console.log('Map script loaded, initializing map...');
    
    // Add delay to ensure Google Maps is fully loaded
    setTimeout(() => {
      initializeMap();
    }, 500);
  };
  
  const handleMapError = (error: Error) => {
    console.error('Error loading Google Maps:', error);
    setError(`Failed to load Google Maps: ${error.message}`);
    setIsLoading(false);
  };
  
  // Check for global Google Maps object
  useEffect(() => {
    if (window.google?.maps && mapRef.current && !googleMap && !error) {
      console.log('Google Maps detected in window object, initializing map');
      initializeMap();
    }
  }, []);
  
  // Initialize the map
  const initializeMap = () => {
    console.log('Initialize map called - checking requirements');
    
    if (!mapRef.current) {
      console.error('Map container ref is null');
      setError('Map container not found');
      setIsLoading(false);
      return;
    }
    
    if (!window.google || !window.google.maps) {
      console.error('Google Maps API not available in window object');
      setError('Google Maps API not available');
      setIsLoading(false);
      return;
    }
    
    try {
      console.log('Creating map instance');
      
      const mapOptions = {
        center: { lat: MIDDLEFIELD_LAT, lng: MIDDLEFIELD_LNG },
        zoom: 14,
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
      };
      
      console.log('Map options:', mapOptions);
      
      const map = new window.google.maps.Map(mapRef.current, mapOptions);
      console.log('Map instance created successfully');
      
      // Add a listener to confirm map is loaded
      window.google.maps.event.addListenerOnce(map, 'idle', () => {
        console.log('Map is fully loaded and idle');
      });
      
      setGoogleMap(map);
      setIsLoading(false);
      
      // Load sensor data after a short delay to ensure map is ready
      setTimeout(() => {
        loadSensorData(map);
      }, 500);
      
    } catch (e) {
      console.error('Error initializing map:', e);
      console.error('Stack trace:', e instanceof Error ? e.stack : 'No stack trace available');
      setError(`Error initializing map: ${e instanceof Error ? e.message : String(e)}`);
      setIsLoading(false);
    }
  };
  
  // Load sensor data and create markers
  const loadSensorData = (mapInstance = googleMap) => {
    console.log('Loading sensor data for map');
    
    if (!mapInstance) {
      console.error('Map instance is null, cannot load sensor data');
      return;
    }
    
    // Clear existing markers
    markers.forEach(marker => {
      console.log('Removing marker', marker);
      marker.setMap(null);
    });
    
    try {
      // Generate mock sensor locations
      const locations = generateSensorLocations(sensorTypes);
      console.log(`Generated ${locations.length} sensor locations`);
      
      // Create markers
      const newMarkers = locations.map(sensor => {
        console.log('Creating marker for sensor:', sensor.id, 'at position:', sensor.position);
        
        try {
          const markerOptions = {
            position: sensor.position,
            map: mapInstance,
            title: `${sensor.type} Sensor ${sensor.id.split('-')[1]}`,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: getSensorColor(sensor.type),
              fillOpacity: 0.8,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            }
          };
          
          const marker = new window.google.maps.Marker(markerOptions);
          
          // Add click handler
          marker.addListener('click', () => {
            // Show info window (simplified for now)
            const infoWindow = new window.google.maps.InfoWindow({
              content: `<div>
                <h3 style="font-weight: bold; margin-bottom: 5px;">${sensor.type} Sensor</h3>
                <p>ID: ${sensor.id}</p>
                <p>Location: ${sensor.position.lat.toFixed(6)}, ${sensor.position.lng.toFixed(6)}</p>
              </div>`
            });
            
            infoWindow.open(mapInstance, marker);
          });
          
          return marker;
        } catch (markerError) {
          console.error('Error creating marker:', markerError);
          return null;
        }
      }).filter(marker => marker !== null) as google.maps.Marker[];
      
      console.log(`Successfully created ${newMarkers.length} markers`);
      setMarkers(newMarkers);
    } catch (e) {
      console.error('Error loading sensor data:', e);
      console.error('Stack trace:', e instanceof Error ? e.stack : 'No stack trace available');
      setError(`Error loading sensor data: ${e instanceof Error ? e.message : String(e)}`);
    }
  };
  
  // Update markers when sensor types or time range changes
  useEffect(() => {
    if (googleMap) {
      console.log('Sensor types or time range changed, updating markers');
      loadSensorData();
    }
  }, [sensorTypes, timeRange, googleMap]);
  
  // Clean up markers on unmount
  useEffect(() => {
    return () => {
      console.log('Cleaning up markers on component unmount');
      markers.forEach(marker => marker.setMap(null));
    };
  }, [markers]);
  
  if (!apiKey) {
    return (
      <div className="flex flex-col justify-center items-center h-full bg-gray-100 p-6 rounded-lg">
        <div className="text-red-500 text-lg font-medium mb-4">Google Maps API Key Required</div>
        <p className="text-gray-700 text-center mb-6">
          To display the map, you need to add a valid Google Maps API key to your environment variables.
        </p>
        <div className="bg-gray-800 text-white p-4 rounded text-sm overflow-auto">
          <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here</code>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {/* Google Maps Script Loader */}
      <GoogleMapScript 
        apiKey={apiKey} 
        onLoad={handleMapLoad} 
        onError={handleMapError} 
      />
      
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ opacity: isLoading ? 0 : 1 }}
      ></div>
      
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Loading Google Maps...</p>
          </div>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-90">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <div className="text-red-500 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="font-medium text-lg mb-2">Map Loading Error</p>
              <p className="mb-4">{error}</p>
              <div className="bg-gray-100 p-4 rounded text-sm text-left mb-4">
                <p className="font-medium mb-1">Troubleshooting:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Check that your API key is correct</li>
                  <li>Ensure Maps JavaScript API is enabled</li>
                  <li>Verify billing is set up in Google Cloud Console</li>
                  <li>Check browser console for detailed errors</li>
                </ul>
              </div>
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 