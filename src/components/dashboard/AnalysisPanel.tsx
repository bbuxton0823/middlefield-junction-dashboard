'use client';

import { useState, useEffect } from 'react';
import { TimeRange } from '@/types';
import { fetcher } from '@/lib/utils';

interface AnalysisPanelProps {
  sensorTypes: string[];
  timeRange: TimeRange;
}

interface AnalysisResponse {
  summary: string;
  insights: string[];
  recommendations?: string[];
  anomalies?: {
    detected: boolean;
    description?: string;
  };
  prediction?: {
    description: string;
    confidence: number;
  };
}

export default function AnalysisPanel({ sensorTypes, timeRange }: AnalysisPanelProps) {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [isCustomQuery, setIsCustomQuery] = useState(false);

  useEffect(() => {
    // Only fetch standard analysis when sensor types or time range changes
    // and there's no custom query active
    if (!isCustomQuery) {
      fetchAnalysis();
    }
  }, [sensorTypes, timeRange, isCustomQuery]);

  async function fetchAnalysis() {
    setLoading(true);
    try {
      // In a real implementation, fetch from API
      // const data = await fetcher('/api/analysis', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     sensorTypes,
      //     timeRange,
      //     question: isCustomQuery ? query : undefined
      //   })
      // });
      
      // For now, use mock data
      const mockAnalysis: AnalysisResponse = {
        summary: "Sensor data for Middlefield Junction shows typical patterns with some notable traffic fluctuations during the selected period.",
        insights: [
          "Traffic increased by 15% during morning rush hours compared to last month.",
          "Pedestrian activity concentrated around commercial areas showed consistent patterns.",
          "Environmental readings indicate good air quality with occasional spikes during peak traffic."
        ],
        recommendations: [
          "Consider adjusting traffic signal timing at Main St intersection to alleviate morning congestion.",
          "Add additional pedestrian sensors in the northwest sector for better coverage."
        ],
        anomalies: {
          detected: true,
          description: "Unusual traffic pattern detected on Oak Street between 3-4pm, possibly due to construction."
        },
        prediction: {
          description: "Expected 10-12% increase in pedestrian activity in central business district next week based on historical patterns and upcoming events.",
          confidence: 0.85
        }
      };
      
      // Simulate API delay
      setTimeout(() => {
        setAnalysis(mockAnalysis);
        setLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error fetching analysis:', error);
      setLoading(false);
    }
  }

  function handleQuerySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      setIsCustomQuery(true);
      fetchAnalysis();
    }
  }

  function handleReset() {
    setQuery('');
    setIsCustomQuery(false);
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        AI Analysis
      </h2>

      <form onSubmit={handleQuerySubmit} className="mb-4">
        <div className="flex">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Ask a question about your data..."
            className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Ask
          </button>
        </div>
        {isCustomQuery && (
          <button
            type="button"
            onClick={handleReset}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
          >
            Reset to standard analysis
          </button>
        )}
      </form>

      <div className="space-y-4">
        {loading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
          </div>
        ) : analysis ? (
          <>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Summary</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">{analysis.summary}</p>
            </div>
            
            {analysis.insights.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Key Insights</h3>
                <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                  {analysis.insights.map((insight, index) => (
                    <li key={index}>{insight}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {analysis.anomalies?.detected && (
              <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-lg">
                <h3 className="font-medium text-yellow-800 dark:text-yellow-200">Anomaly Detected</h3>
                <p className="text-yellow-800 dark:text-yellow-300 text-sm">
                  {analysis.anomalies.description}
                </p>
              </div>
            )}
            
            {analysis.prediction && (
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Prediction</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">{analysis.prediction.description}</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-1">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${analysis.prediction.confidence * 100}%` }}
                  ></div>
                </div>
                <p className="text-right text-xs text-gray-700 dark:text-gray-400">
                  Confidence: {Math.round(analysis.prediction.confidence * 100)}%
                </p>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-700 dark:text-gray-400">No analysis available. Please select sensors and time range.</p>
        )}
      </div>
    </div>
  );
} 