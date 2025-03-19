import { SensorType } from "@prisma/client";
import prisma from "@/lib/db";
import { faker } from "@faker-js/faker";

// Initial sensor locations for Middlefield Junction
const CITY_CENTER = { lat: 37.4419, lng: -122.1430 }; // Coordinates for Middlefield Junction
const RADIUS = 0.02; // Roughly 2km radius

// Create base sensors if they don't exist
export async function initializeSensors() {
  const sensorCount = await prisma.sensor.count();
  
  if (sensorCount === 0) {
    // Create one of each sensor type
    const sensorTypes = [
      SensorType.STREETLIGHT,
      SensorType.PEDESTRIAN, 
      SensorType.TRAFFIC,
      SensorType.ENVIRONMENTAL
    ];
    
    for (const type of sensorTypes) {
      // Create 5 sensors of each type at different locations
      for (let i = 0; i < 5; i++) {
        await prisma.sensor.create({
          data: {
            name: `${type} Sensor ${i+1}`,
            type,
            latitude: CITY_CENTER.lat + (Math.random() - 0.5) * RADIUS,
            longitude: CITY_CENTER.lng + (Math.random() - 0.5) * RADIUS,
            description: `Simulated ${type.toLowerCase()} sensor`,
          }
        });
      }
    }
    console.log('Base sensors created');
  }
}

// Generate realistic values based on sensor type and time
function generateSensorValue(type: SensorType, date: Date): { value: number, unit: string } {
  const hour = date.getHours();
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  
  // Base values with daily patterns
  switch (type) {
    case SensorType.STREETLIGHT:
      // Light level (lux) - higher during day
      const isDayTime = hour >= 7 && hour <= 18;
      return {
        value: isDayTime 
          ? faker.number.int({ min: 20000, max: 50000 }) 
          : faker.number.int({ min: 0, max: 10 }),
        unit: 'lux'
      };
      
    case SensorType.PEDESTRIAN:
      // Pedestrian count - higher during day, peaking at commute times
      let pedestrianBase = 0;
      if (hour >= 7 && hour <= 9) pedestrianBase = 80; // Morning commute
      else if (hour >= 11 && hour <= 14) pedestrianBase = 60; // Lunch
      else if (hour >= 16 && hour <= 18) pedestrianBase = 100; // Evening commute
      else if (hour >= 6 && hour <= 22) pedestrianBase = 30; // Regular day
      else pedestrianBase = 5; // Night
      
      // Weekend adjustment
      if (isWeekend) {
        pedestrianBase = hour >= 10 && hour <= 20 ? 70 : pedestrianBase / 2;
      }
      
      return {
        value: Math.max(0, pedestrianBase + faker.number.int({ min: -15, max: 20 })),
        unit: 'count'
      };
      
    case SensorType.TRAFFIC:
      // Traffic count - similar pattern to pedestrian but with different scale
      let trafficBase = 0;
      if (hour >= 7 && hour <= 9) trafficBase = 120; // Morning rush
      else if (hour >= 16 && hour <= 18) trafficBase = 150; // Evening rush
      else if (hour >= 6 && hour <= 22) trafficBase = 60; // Regular day
      else trafficBase = 15; // Night
      
      // Weekend adjustment
      if (isWeekend) {
        trafficBase = hour >= 10 && hour <= 20 ? 80 : trafficBase / 2;
      }
      
      return {
        value: Math.max(0, trafficBase + faker.number.int({ min: -20, max: 30 })),
        unit: 'vehicles'
      };
      
    case SensorType.ENVIRONMENTAL:
      // Air quality (PM2.5) - worse during rush hour
      let aqiBase = 20; // Good baseline
      if ((hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 18)) {
        aqiBase = 35; // Worse during commute
      }
      
      return {
        value: aqiBase + faker.number.int({ min: -5, max: 15 }),
        unit: 'µg/m³'
      };
      
    default:
      return { value: faker.number.int({ min: 0, max: 100 }), unit: 'units' };
  }
}

// Generate readings for a specific time period
export async function generateReadings(startDate: Date, endDate: Date) {
  const sensors = await prisma.sensor.findMany();
  const batchSize = 100;
  let readings = [];
  
  // The time increment between readings (in minutes)
  const INCREMENT_MINUTES = 15;
  
  for (const sensor of sensors) {
    // Create a reading for each time increment
    for (let currentDate = new Date(startDate); 
         currentDate <= endDate; 
         currentDate = new Date(currentDate.getTime() + INCREMENT_MINUTES * 60000)) {
      
      const { value, unit } = generateSensorValue(sensor.type, currentDate);
      
      readings.push({
        sensorId: sensor.id,
        value,
        unit,
        timestamp: new Date(currentDate)
      });
      
      // Insert in batches to avoid memory issues
      if (readings.length >= batchSize) {
        await prisma.reading.createMany({ data: readings });
        readings = [];
      }
    }
  }
  
  // Insert any remaining readings
  if (readings.length > 0) {
    await prisma.reading.createMany({ data: readings });
  }
  
  return { message: `Generated readings from ${startDate} to ${endDate}` };
}

// Function to be called by a scheduler or API endpoint to simulate real-time data
export async function generateRealtimeReading() {
  const sensors = await prisma.sensor.findMany();
  const now = new Date();
  
  for (const sensor of sensors) {
    const { value, unit } = generateSensorValue(sensor.type, now);
    
    await prisma.reading.create({
      data: {
        sensorId: sensor.id,
        value,
        unit,
        timestamp: now
      }
    });
  }
  
  return { timestamp: now, count: sensors.length };
} 