export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-3xl">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Middlefield Junction
        </h1>
        <h2 className="text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-8">
          Smart City Dashboard
        </h2>
        
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          Real-time monitoring and analytics for Middlefield Junction smart city infrastructure.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/dashboard" 
            className="px-8 py-3 text-lg font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            View Dashboard
          </a>
        </div>
      </div>
      
      <footer className="mt-auto py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} Middlefield Junction. Part of San Mateo County.</p>
      </footer>
    </div>
  );
} 