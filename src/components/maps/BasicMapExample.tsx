'use client';

import React, { useEffect, useRef } from 'react';

const BasicMapExample: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  
  useEffect(() => {
    // Only create the script once
    if (scriptRef.current) return;
    
    // Log API key for debugging
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
    console.log('Using API key:', apiKey ? `${apiKey.substring(0, 5)}...` : 'No key provided');
    
    // Define callback function that Google Maps will call
    window.initMap = function() {
      console.log('Google Maps API loaded successfully');
      
      if (mapRef.current && window.google && window.google.maps) {
        console.log('Creating map instance');
        
        try {
          const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: 37.4419, lng: -122.1430 },
            zoom: 13
          });
          
          console.log('Map instance created successfully');
          
          // Create a simple marker
          const marker = new window.google.maps.Marker({
            position: { lat: 37.4419, lng: -122.1430 },
            map: map,
            title: 'Middlefield Junction'
          });
          
          console.log('Marker created successfully');
        } catch (error) {
          console.error('Error creating map:', error);
        }
      } else {
        console.error('Map container not found or Google Maps not loaded');
      }
    };
    
    // Define auth failure callback
    window.gm_authFailure = function() {
      console.error('Google Maps authentication failed - API key invalid or restricted');
      
      if (mapRef.current) {
        mapRef.current.innerHTML = `
          <div style="padding: 20px; color: red; text-align: center;">
            <h3>Google Maps API Key Error</h3>
            <p>Authentication failed. Your API key may be invalid or restricted.</p>
          </div>
        `;
      }
    };
    
    // Create script element to load Google Maps
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;
    
    // Handle errors
    script.onerror = function() {
      console.error('Failed to load Google Maps script');
      
      if (mapRef.current) {
        mapRef.current.innerHTML = `
          <div style="padding: 20px; color: red; text-align: center;">
            <h3>Failed to Load Google Maps</h3>
            <p>Could not load the Google Maps API. Check your internet connection and API key.</p>
          </div>
        `;
      }
    };
    
    document.head.appendChild(script);
    scriptRef.current = script;
    
    // Cleanup
    return () => {
      if (scriptRef.current && document.head.contains(scriptRef.current)) {
        document.head.removeChild(scriptRef.current);
      }
      window.initMap = function() { /* empty function */ };
      window.gm_authFailure = undefined;
    };
  }, []);
  
  return (
    <div>
      <div
        ref={mapRef}
        style={{ width: '100%', height: '400px', border: '1px solid #ccc' }}
      ></div>
      <div style={{ marginTop: '10px', padding: '10px', background: '#f5f5f5' }}>
        <p><strong>API Key:</strong> {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.substring(0, 5) + '...' : 'Not set'}</p>
        <p><strong>Note:</strong> If the map doesn't load, check the browser console for error messages.</p>
      </div>
    </div>
  );
};

// Add TypeScript type definitions for the global window object
declare global {
  interface Window {
    initMap: () => void;
    gm_authFailure?: () => void;
    google?: any;
  }
}

export default BasicMapExample; 