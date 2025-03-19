#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install

# Generate Prisma client
echo "Generating Prisma client..."
npm run prisma:generate

# Check if .env.local exists, if not create it from .env
if [ ! -f .env.local ]; then
  echo "Creating .env.local from .env..."
  cp .env.local.example .env.local
  echo "Please update the .env.local file with your API keys and database URL."
fi

# Setup database
echo "Setting up database..."
npm run prisma:migrate
npm run prisma:seed

echo "Setup complete! You can now run 'npm run dev' to start the development server."
echo "Access the dashboard at http://localhost:3001" 