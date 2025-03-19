import OpenAI from 'openai';
import { Reading, Sensor } from '@prisma/client';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ReadingWithSensor extends Reading {
  sensor: Sensor;
}

export interface AnalysisRequest {
  sensorType?: string;
  timeRange: string; // '24h', '7d', '30d', '1y'
  data: ReadingWithSensor[];
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

export async function analyzeData({
  sensorType,
  timeRange,
  data,
  question
}: AnalysisRequest): Promise<AnalysisResponse> {
  try {
    // Prepare a summary of the data for the prompt
    const dataSummary = data.slice(0, 50).map(reading => ({
      timestamp: reading.timestamp,
      type: reading.sensor.type,
      value: reading.value,
      unit: reading.unit,
      location: `${reading.sensor.latitude},${reading.sensor.longitude}`
    }));
    
    // Create a prompt based on the question or default analysis
    const promptContent = question 
      ? `Analyze this Middlefield Junction sensor data and answer the following question: "${question}"\n\nData: ${JSON.stringify(dataSummary)}`
      : `Analyze this Middlefield Junction ${sensorType || ''} sensor data over the last ${timeRange} period and provide: 
         1. A brief summary of the data
         2. Three key insights
         3. Any anomalies detected
         4. Predictions for the next period
         5. Recommendations for Middlefield Junction officials
         
         Data: ${JSON.stringify(dataSummary)}`;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "You are a smart city analyst AI that analyzes IoT sensor data to provide actionable insights. Be concise but thorough and technical."
        },
        {
          role: "user",
          content: promptContent
        }
      ],
      response_format: { type: "json_object" }
    });
    
    // Parse the JSON response
    const response = JSON.parse(completion.choices[0].message.content || "{}");
    
    // Ensure we have a properly formatted response
    return {
      summary: response.summary || "No summary available",
      insights: response.insights || [],
      recommendations: response.recommendations || [],
      anomalies: response.anomalies || { detected: false },
      prediction: response.prediction || undefined
    };
  } catch (error) {
    console.error('Error analyzing data with OpenAI:', error);
    throw new Error('Failed to analyze data');
  }
}

export async function naturalLanguageQuery(question: string): Promise<any> {
  try {
    // First, parse the user's question to determine what data we need to fetch
    const parseCompletion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "You are an AI that parses natural language queries about smart city data into structured parameters. Convert the question into a JSON object with fields: sensorTypes (array of STREETLIGHT, PEDESTRIAN, TRAFFIC, ENVIRONMENTAL), timeRange (24h, 7d, 30d, 1y), location (optional), and metrics (what to measure)."
        },
        {
          role: "user",
          content: question
        }
      ],
      response_format: { type: "json_object" }
    });
    
    // The structured query params to return
    return JSON.parse(parseCompletion.choices[0].message.content || "{}");
  } catch (error) {
    console.error('Error parsing natural language query:', error);
    throw new Error('Failed to parse query');
  }
} 