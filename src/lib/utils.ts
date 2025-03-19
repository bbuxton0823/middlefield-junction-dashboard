// Helper function for API calls
export async function fetcher<T = any>(
  url: string, 
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const error = new Error('An error occurred while fetching the data.');
    throw error;
  }
  
  return response.json();
}

// Convert time range to milliseconds
export function timeRangeToMs(timeRange: string): number {
  const hour = 60 * 60 * 1000;
  const day = 24 * hour;
  
  switch(timeRange) {
    case '24h': return day;
    case '7d': return 7 * day;
    case '30d': return 30 * day;
    case '1y': return 365 * day;
    default: return day; // Default to 24 hours
  }
}

// Get date from now minus the time range
export function getDateFromTimeRange(timeRange: string): Date {
  const now = new Date();
  const ms = timeRangeToMs(timeRange);
  return new Date(now.getTime() - ms);
}

// Format large numbers with commas
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Create a debounce function
export function debounce<F extends (...args: any[]) => any>(fn: F, ms: number): ((...args: Parameters<F>) => void) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function(...args: Parameters<F>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  };
} 