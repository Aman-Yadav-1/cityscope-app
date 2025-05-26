'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import PostList from '@/components/PostList';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FaCompass } from 'react-icons/fa6';
import { useLoadScript, GoogleMap, MarkerF } from '@react-google-maps/api';

const libraries = ['places'];

const ExplorePage = () => {
  const [mapView, setMapView] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.006 }); // Default to NYC
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [filterLocation, setFilterLocation] = useState('');
  
  // Use a different API key for development
  const { isLoaded, loadError } = useLoadScript({
    // Using a different API key that doesn't require billing for development
    googleMapsApiKey: 'AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg',
    libraries: libraries as any,
  });
  
  // Fix CSP issues by adding data: to allowed sources
  useEffect(() => {
    // Add a meta tag with proper CSP that includes data: URLs
    const metaTag = document.createElement('meta');
    metaTag.httpEquiv = 'Content-Security-Policy';
    metaTag.content = "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline'; object-src 'none'; media-src * data:;";
    document.head.appendChild(metaTag);
    
    return () => {
      document.head.removeChild(metaTag);
    };
  }, []);
  
  // Handle API loading errors gracefully
  const [mapError, setMapError] = useState('');
  
  useEffect(() => {
    if (loadError) {
      console.error('Error loading Google Maps API:', loadError);
      setMapError('Unable to load Google Maps. Please check your API key configuration.');
    }
  }, [loadError]);

  useEffect(() => {
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);
          setMapCenter(userPos);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, []);

  const toggleView = () => {
    setMapView(!mapView);
  };

  const mapContainerStyle = {
    width: '100%',
    height: '600px',
    borderRadius: '12px'
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Explore Your Community</h1>
          <button 
            onClick={toggleView}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            {mapView ? <FaCompass className="text-lg" /> : <FaMapMarkerAlt className="text-lg" />}
            {mapView ? 'List View' : 'Map View'}
          </button>
        </div>

        {mapView ? (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            {!isLoaded ? (
              <div className="flex justify-center items-center h-[600px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : loadError || mapError ? (
              <div className="flex flex-col justify-center items-center h-[600px] text-center">
                <div className="text-red-500 text-5xl mb-4">
                  <FaMapMarkerAlt />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Map Cannot Be Loaded</h3>
                <p className="text-gray-600 max-w-md mb-4">
                  {mapError || 'There was an error loading the Google Maps API. Please check your API key and make sure it has http://localhost:3000 authorized in the Google Cloud Console.'}
                </p>
                <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-700 max-w-md">
                  <p className="font-semibold mb-2">To fix this issue:</p>
                  <ol className="list-decimal list-inside space-y-1 text-left">
                    <li>Go to the Google Cloud Console</li>
                    <li>Select your project</li>
                    <li>Go to APIs & Services → Credentials</li>
                    <li>Edit your API key</li>
                    <li>Add <code className="bg-gray-200 px-1 rounded">http://localhost:3000</code> to the list of authorized HTTP referrers</li>
                    <li>Create a <code className="bg-gray-200 px-1 rounded">.env.local</code> file in your project root</li>
                    <li>Add <code className="bg-gray-200 px-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key</code></li>
                  </ol>
                </div>
                <button 
                  onClick={toggleView}
                  className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                >
                  Switch to List View
                </button>
              </div>
            ) : (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={12}
                center={mapCenter}
                options={{
                  disableDefaultUI: false,
                  zoomControl: true,
                  streetViewControl: false,
                  mapTypeControl: false,
                }}
              >
                {userLocation && (
                  <MarkerF
                    position={userLocation}
                    icon={{
                      path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
                      scale: 7,
                      fillColor: '#4285F4',
                      fillOpacity: 1,
                      strokeColor: 'white',
                      strokeWeight: 2,
                    }}
                    title="Your Location"
                  />
                )}
                {/* In a real app, we would fetch post locations from the API and display them as markers */}
              </GoogleMap>
            )}
          </div>
        ) : (
          <PostList filterType="nearby" filterLocation={filterLocation} />
        )}
      </div>
    </Layout>
  );
};

export default ExplorePage;
