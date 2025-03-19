'use client';

import React from 'react';
import BasicMapExample from '@/components/maps/BasicMapExample';
import Link from 'next/link';

export default function TestMapPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard" className="text-blue-500 hover:underline flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Dashboard
          </Link>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Google Maps Test Page
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            This page tests the Google Maps API with minimal components to help diagnose issues.
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <BasicMapExample />
          </div>
          
          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Troubleshooting</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>If no map appears, check the browser console for errors (F12 or Cmd+Option+I).</li>
              <li>Verify your Google Maps API key in <code className="bg-gray-200 px-1 py-0.5 rounded">.env.local</code>.</li>
              <li>Make sure JavaScript API is enabled in Google Cloud Console.</li>
              <li>Check for billing issues or API key restrictions.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 