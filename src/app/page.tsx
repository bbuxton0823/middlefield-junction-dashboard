'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const { data: session, status } = useSession();

  // If already authenticated, redirect to dashboard
  if (status === 'authenticated') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 text-center">
      <div className="max-w-3xl">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Middlefield Junction
        </h1>
        <h2 className="text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-8">
          Smart City Dashboard
        </h2>
        
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          Real-time monitoring and analytics for Middlefield Junction smart city infrastructure.
          Monitor traffic, pedestrian flow, air quality, and streetlights all in one place.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/auth/signin" 
            className="px-8 py-3 text-lg font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            Sign In
          </Link>
          
          <Link 
            href="/auth/signup" 
            className="px-8 py-3 text-lg font-medium rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            Create Account
          </Link>
        </div>
      </div>
      
      <footer className="mt-auto py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} Middlefield Junction. Part of San Mateo County.</p>
      </footer>
    </div>
  );
} 