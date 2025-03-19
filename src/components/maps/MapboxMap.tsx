'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { TimeRange } from '@/types';

interface MapboxMapProps {
  sensorTypes: string[];
  timeRange: TimeRange;
}

// The coordinates for Middlefield Junction
const MIDDLEFIELD_LAT = 37.4765;
const MIDDLEFIELD_LNG = -122.2114;

export default function MapboxMap({ sensorTypes, timeRange }: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Track markers for cleanup
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    // Get Mapbox token from env
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    
    if (!mapboxToken || mapboxToken === 'pk.dummy.token') {
      setError('Valid Mapbox token is required');
      setIsLoading(false);
      return;
    }

    // Set Mapbox token
    mapboxgl.accessToken = mapboxToken;

    // Initialize map only once
    if (map.current) return;

    try {
      if (!mapContainer.current) {
        setError('Map container not found');
        setIsLoading(false);
        return;
      }

      console.log('Initializing Mapbox map...');
      
      // Create map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [MIDDLEFIELD_LNG, MIDDLEFIELD_LAT],
        zoom: 13
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl());

      // Add markers when map loads
      map.current.on('load', () => {
        console.log('Mapbox map loaded successfully');
        setIsLoading(false);
        addMarkers();
      });

      // Handle map load error
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setError(`Map loading error: ${e.error?.message || 'Unknown error'}`);
        setIsLoading(false);
      });
    } catch (e) {
      console.error('Error initializing map:', e);
      setError(`Error initializing map: ${e instanceof Error ? e.message : String(e)}`);
      setIsLoading(false);
    }

    // Cleanup
    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Add markers for sensors
  const addMarkers = () => {
    const currentMap = map.current;
    if (!currentMap) return;

    console.log('Adding markers for sensor types:', sensorTypes);
    
    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Generate mock sensor data
    sensorTypes.forEach(type => {
      for (let i = 0; i < 3; i++) {
        // Add randomness to locations
        const latOffset = (Math.random() - 0.5) * 0.01;
        const lngOffset = (Math.random() - 0.5) * 0.01;
        
        // Create marker element
        const el = document.createElement('div');
        el.className = 'sensor-marker';
        el.style.backgroundColor = getSensorColor(type);
        el.style.width = '15px';
        el.style.height = '15px';
        el.style.borderRadius = '50%';
        el.style.border = '2px solid white';
        el.style.boxShadow = '0 0 2px rgba(0,0,0,0.3)';
        
        // Add marker to map
        const marker = new mapboxgl.Marker(el)
          .setLngLat([MIDDLEFIELD_LNG + lngOffset, MIDDLEFIELD_LAT + latOffset])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <h3 style="font-weight: bold; margin-bottom: 5px;">${type} Sensor ${i+1}</h3>
                <p>Mock data for ${timeRange} time period</p>
                <p style="margin-top: 5px; font-size: 12px; color: #666;">
                  Location: ${(MIDDLEFIELD_LAT + latOffset).toFixed(6)}, ${(MIDDLEFIELD_LNG + lngOffset).toFixed(6)}
                </p>
              `)
          )
          .addTo(currentMap);
          
        // Store marker for cleanup
        markers.current.push(marker);
      }
    });
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

  // Update markers when sensor types or time range changes
  useEffect(() => {
    if (map.current && !isLoading) {
      console.log('Sensor types or time range changed, updating markers');
      addMarkers();
    }
  }, [sensorTypes, timeRange, isLoading]);

  return (
    <div className="w-full h-full relative">
      <div
        ref={mapContainer}
        className="w-full h-full"
        style={{ opacity: isLoading ? 0 : 1 }}
      />
      
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Loading Map...</p>
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