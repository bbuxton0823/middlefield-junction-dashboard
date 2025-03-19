# Middlefield Junction Dashboard

A real-time IoT smart city dashboard for Middlefield Junction, part of San Mateo County.

## Features

- **Real-Time Monitoring:** Track data from various IoT sensors throughout the city
- **Interactive Map:** Visualize sensor locations and data on a city map
- **Data Analysis:** AI-powered insights and anomaly detection
- **Time Series Visualization:** View historical data trends
- **Natural Language Queries:** Ask questions about your city data

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js
- **APIs:** OpenAI for AI analysis, Mapbox for maps
- **Data Visualization:** Recharts

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Mapbox API key
- OpenAI API key

### Quick Setup

Run the setup script to install dependencies and set up the database:

```bash
./setup.sh
```

### Manual Setup Instructions

1. **Clone the repository**

```bash
git clone <repository-url>
cd middlefield-junction-dashboard
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy `.env.local.example` to `.env.local` and fill in your own values:

```bash
cp .env.local.example .env.local
```

Then update the values in `.env.local`:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/middlefield?schema=public"

# Authentication
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="your-secret-key-here"

# API Keys
NEXT_PUBLIC_MAPBOX_TOKEN="your-mapbox-token"
OPENAI_API_KEY="your-openai-key"
```

4. **Set up the database**

```bash
# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run prisma:migrate

# Seed the database with sample data
npm run prisma:seed
```

5. **Run the development server**

```bash
npm run dev
```

6. **Access the dashboard**

Open [http://localhost:3001](http://localhost:3001) in your browser.

For demo purposes, you can sign in with:
- Email: demo@middlefieldjunction.gov
- Password: demo1234

### Development with Docker

If you prefer to use Docker for development, you can use the following commands:

```bash
# Start the Postgres database only
npm run start-with-db

# OR start both the database and the application
npm run docker:dev
```

## Project Structure

```
middlefield-junction-dashboard/
├── prisma/               # Database schema and migrations
├── public/               # Static assets
│   └── assets/           # Images, icons, etc.
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API Routes
│   │   ├── auth/         # Auth pages
│   │   ├── dashboard/    # Dashboard pages
│   │   └── layout.tsx    # Root layout
│   ├── components/       # React components
│   │   ├── auth/         # Authentication components
│   │   ├── dashboard/    # Dashboard components
│   │   ├── maps/         # Map visualizations
│   │   └── charts/       # Chart components
│   ├── lib/              # Utility functions
│   ├── services/         # Backend services
│   └── types/            # TypeScript types
├── docker-compose.yml    # Docker configuration
├── Dockerfile            # Production container build
└── package.json          # Dependencies and scripts
```

## Deployment

### Vercel

This project is optimized for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set the environment variables in the Vercel dashboard
3. Deploy

### AWS

For AWS deployment, follow these steps:

1. Build the Docker image: `npm run docker:build`
2. Push to ECR or your container registry
3. Deploy using ECS, Elastic Beanstalk, or directly to EC2

### Database Setup for Production

For production, you'll need a PostgreSQL database. You can use:

1. **AWS RDS**: Create a PostgreSQL instance and update your DATABASE_URL
2. **Supabase**: Set up a Postgres database and update DATABASE_URL
3. **Railway.app**: Deploy a managed PostgreSQL database

After setting up the database, run:

```bash
npx prisma migrate deploy
npx prisma db seed
```

## Project Customization

### Adding New Sensor Types

1. Update the `SensorType` enum in `prisma/schema.prisma`
2. Add an icon in the `public/assets/icons` directory
3. Update the color scheme in the dashboard components
4. Run `npx prisma generate` to update the Prisma client

### Connecting to Real APIs

Replace the simulated data in the `/src/services/sensor-simulator.ts` file with actual API calls to real IoT devices.

## License

This project is part of the San Mateo County smart city initiative. 