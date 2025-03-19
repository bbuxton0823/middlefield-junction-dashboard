import { TimeRange } from '@/types';

interface SensorDataPoint {
  timestamp: string;
  ENVIRONMENTAL?: number;
  TRAFFIC?: number;
  PEDESTRIAN?: number;
  STREETLIGHT?: number;
  [key: string]: string | number | undefined;
}

interface SensorDataset {
  timeRange: TimeRange;
  sensorTypes: string[];
  dataPoints: SensorDataPoint[];
}

/**
 * Mock time series data for sensor readings
 * This can be replaced with actual API calls when backend is ready
 */
export function getMockTimeSeriesData(sensorTypes: string[], timeRange: TimeRange): SensorDataPoint[] {
  // Return a subset of the full dataset based on timeRange
  const mockData = generateFullYearData();
  
  let filteredData: SensorDataPoint[];
  
  switch (timeRange) {
    case '24h':
      // Last 24 hours - return daily data points for the last day
      filteredData = mockData.dataPoints.slice(-1);
      break;
    case '7d':
      // Last 7 days - return last ~4 data points (bi-weekly)
      filteredData = mockData.dataPoints.slice(-4);
      break;
    case '30d':
      // Last 30 days - return last ~8 data points (bi-weekly for 2 months)
      filteredData = mockData.dataPoints.slice(-8);
      break;
    case '1y':
    default:
      // Full year - return all data points
      filteredData = mockData.dataPoints;
      break;
  }

  // Filter for requested sensor types
  if (sensorTypes.length > 0 && sensorTypes.length < 4) {
    filteredData = filteredData.map(point => {
      const filtered: SensorDataPoint = { timestamp: point.timestamp };
      sensorTypes.forEach(type => {
        if (point[type] !== undefined) {
          filtered[type] = point[type];
        }
      });
      return filtered;
    });
  }

  return filteredData;
}

/**
 * Generates a full year of mock sensor data
 */
function generateFullYearData(): SensorDataset {
  return {
    "timeRange": "1y",
    "sensorTypes": [
      "ENVIRONMENTAL",
      "TRAFFIC",
      "PEDESTRIAN",
      "STREETLIGHT"
    ],
    "dataPoints": [
      {
        "timestamp": "2024-03-01",
        "ENVIRONMENTAL": 42,
        "TRAFFIC": 78,
        "PEDESTRIAN": 65,
        "STREETLIGHT": 85
      },
      {
        "timestamp": "2024-03-15",
        "ENVIRONMENTAL": 45,
        "TRAFFIC": 82,
        "PEDESTRIAN": 68,
        "STREETLIGHT": 82
      },
      {
        "timestamp": "2024-04-01",
        "ENVIRONMENTAL": 48,
        "TRAFFIC": 85,
        "PEDESTRIAN": 72,
        "STREETLIGHT": 78
      },
      {
        "timestamp": "2024-04-15",
        "ENVIRONMENTAL": 52,
        "TRAFFIC": 88,
        "PEDESTRIAN": 76,
        "STREETLIGHT": 75
      },
      {
        "timestamp": "2024-05-01",
        "ENVIRONMENTAL": 58,
        "TRAFFIC": 83,
        "PEDESTRIAN": 81,
        "STREETLIGHT": 70
      },
      {
        "timestamp": "2024-05-15",
        "ENVIRONMENTAL": 62,
        "TRAFFIC": 79,
        "PEDESTRIAN": 85,
        "STREETLIGHT": 65
      },
      {
        "timestamp": "2024-06-01",
        "ENVIRONMENTAL": 68,
        "TRAFFIC": 75,
        "PEDESTRIAN": 88,
        "STREETLIGHT": 60
      },
      {
        "timestamp": "2024-06-15",
        "ENVIRONMENTAL": 72,
        "TRAFFIC": 72,
        "PEDESTRIAN": 91,
        "STREETLIGHT": 55
      },
      {
        "timestamp": "2024-07-01",
        "ENVIRONMENTAL": 75,
        "TRAFFIC": 68,
        "PEDESTRIAN": 94,
        "STREETLIGHT": 50
      },
      {
        "timestamp": "2024-07-15",
        "ENVIRONMENTAL": 78,
        "TRAFFIC": 65,
        "PEDESTRIAN": 90,
        "STREETLIGHT": 48
      },
      {
        "timestamp": "2024-08-01",
        "ENVIRONMENTAL": 74,
        "TRAFFIC": 70,
        "PEDESTRIAN": 87,
        "STREETLIGHT": 52
      },
      {
        "timestamp": "2024-08-15",
        "ENVIRONMENTAL": 71,
        "TRAFFIC": 75,
        "PEDESTRIAN": 84,
        "STREETLIGHT": 58
      },
      {
        "timestamp": "2024-09-01",
        "ENVIRONMENTAL": 65,
        "TRAFFIC": 82,
        "PEDESTRIAN": 80,
        "STREETLIGHT": 65
      },
      {
        "timestamp": "2024-09-15",
        "ENVIRONMENTAL": 60,
        "TRAFFIC": 86,
        "PEDESTRIAN": 77,
        "STREETLIGHT": 70
      },
      {
        "timestamp": "2024-10-01",
        "ENVIRONMENTAL": 55,
        "TRAFFIC": 89,
        "PEDESTRIAN": 72,
        "STREETLIGHT": 76
      },
      {
        "timestamp": "2024-10-15",
        "ENVIRONMENTAL": 50,
        "TRAFFIC": 87,
        "PEDESTRIAN": 68,
        "STREETLIGHT": 82
      },
      {
        "timestamp": "2024-11-01",
        "ENVIRONMENTAL": 45,
        "TRAFFIC": 84,
        "PEDESTRIAN": 63,
        "STREETLIGHT": 86
      },
      {
        "timestamp": "2024-11-15",
        "ENVIRONMENTAL": 42,
        "TRAFFIC": 80,
        "PEDESTRIAN": 58,
        "STREETLIGHT": 90
      },
      {
        "timestamp": "2024-12-01",
        "ENVIRONMENTAL": 40,
        "TRAFFIC": 75,
        "PEDESTRIAN": 54,
        "STREETLIGHT": 93
      },
      {
        "timestamp": "2024-12-15",
        "ENVIRONMENTAL": 38,
        "TRAFFIC": 72,
        "PEDESTRIAN": 50,
        "STREETLIGHT": 95
      },
      {
        "timestamp": "2025-01-01",
        "ENVIRONMENTAL": 37,
        "TRAFFIC": 70,
        "PEDESTRIAN": 48,
        "STREETLIGHT": 96
      },
      {
        "timestamp": "2025-01-15",
        "ENVIRONMENTAL": 38,
        "TRAFFIC": 72,
        "PEDESTRIAN": 52,
        "STREETLIGHT": 95
      },
      {
        "timestamp": "2025-02-01",
        "ENVIRONMENTAL": 40,
        "TRAFFIC": 75,
        "PEDESTRIAN": 56,
        "STREETLIGHT": 92
      },
      {
        "timestamp": "2025-02-15",
        "ENVIRONMENTAL": 41,
        "TRAFFIC": 77,
        "PEDESTRIAN": 62,
        "STREETLIGHT": 88
      }
    ]
  };
} 