import { PrismaClient } from '@prisma/client';
import { initializeSensors, generateReadings } from '../src/services/sensor-simulator';

// Initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting database seed...');
    
    // Create sensor data
    await initializeSensors();
    console.log('Sensors created');
    
    // Generate historical data for the past week
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 7);
    
    console.log(`Generating historical data from ${startDate.toISOString()} to ${endDate.toISOString()}`);
    await generateReadings(startDate, endDate);
    
    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 