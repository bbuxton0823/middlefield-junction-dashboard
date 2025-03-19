'use client';

import React, { useEffect, useState } from 'react';

interface GoogleMapScriptProps {
  apiKey: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

declare global {
  interface Window {
    initMap: () => void;
    gm_authFailure?: () => void;
  }
}

const GoogleMapScript: React.FC<GoogleMapScriptProps> = ({ apiKey, onLoad, onError }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Don't reload if already loaded or if there was an error
    if (isLoaded || hasError || !apiKey) return;

    // Log for debugging
    console.log('Attempting to load Google Maps with key:', apiKey ? `${apiKey.substring(0, 5)}...` : 'No key provided');

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      console.log('Google Maps is already loaded, calling onLoad');
      setIsLoaded(true);
      if (onLoad) onLoad();
      return;
    }

    // Set up auth failure handler
    window.gm_authFailure = () => {
      console.error('Google Maps authentication failed - API key may be invalid or restricted');
      console.error('Please make sure the API key is valid and has the necessary permissions');
      console.error('Required APIs: Maps JavaScript API, Places API, Geocoding API');
      setHasError(true);
      if (onError) onError(new Error('Google Maps authentication failed'));
    };

    // Create callback function that will be called when Google Maps is loaded
    window.initMap = () => {
      console.log('Google Maps API loaded successfully');
      setIsLoaded(true);
      if (onLoad) onLoad();
    };

    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&libraries=places&v=quarterly&channel=middlefield-dashboard`;
    script.defer = true;
    script.async = true;
    script.id = 'google-maps-script';
    
    // Handle errors
    script.onerror = (event) => {
      console.error('Failed to load Google Maps API script', event);
      console.error('Network issues or API key restrictions might be causing this problem');
      setHasError(true);
      if (onError) onError(new Error('Failed to load Google Maps API script'));
    };
    
    // Add script to document
    document.head.appendChild(script);
    console.log('Google Maps script tag added to document head');
    
    // Clean up
    return () => {
      window.initMap = () => {
        console.log('initMap callback cleaned up');
      };
      window.gm_authFailure = undefined;
      const existingScript = document.getElementById('google-maps-script');
      if (existingScript) {
        document.head.removeChild(existingScript);
        console.log('Google Maps script removed from document head');
      }
    };
  }, [apiKey, isLoaded, hasError, onLoad, onError]);

  return null;
};

export default GoogleMapScript; 