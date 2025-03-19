import { Sensor as PrismaSensor, Reading as PrismaReading, SensorType } from '@prisma/client';

// Extended interfaces for authenticated user
export interface UserSession {
  user: {
    id: string;
    name?: string;
    email?: string;
    image?: string;
    role: 'USER' | 'ADMIN';
  };
}

// Sensor interfaces
export interface Sensor extends PrismaSensor {}

export interface Reading extends PrismaReading {}

export interface SensorWithLatestReading extends Sensor {
  latestReading: Reading;
}

export interface ReadingWithSensor extends Reading {
  sensor: Sensor;
}

// Time range type
export type TimeRange = '24h' | '7d' | '30d' | '1y';

// Analysis interfaces
export interface AnalysisRequest {
  sensorTypes: SensorType[];
  timeRange: TimeRange;
  question?: string;
}

export interface AnalysisResponse {
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

// Chart data interface
export interface ChartDataPoint {
  timestamp: Date;
  formattedTime: string;
  [sensorType: string]: any;
} 