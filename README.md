# TransitOps

A comprehensive fleet and transport operations platform designed to digitize vehicle, driver, dispatch, maintenance, and expense management while enforcing strict business rules and operational integrity. Built for an 8-hour Hackathon.

## Tech Stack
- **Framework**: Next.js (App Router)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Styling**: Tailwind CSS & Shadcn UI
- **Auth**: NextAuth.js

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy the example environment file and update the variables if necessary. By default, it is configured to use a local PostgreSQL instance.

```bash
cp .env.example .env
```

Ensure your PostgreSQL instance is running on `localhost:5432` with the credentials matching your `.env` `DATABASE_URL` (e.g. `postgresql://postgres:1234@localhost:5432/transitops`).

Alternatively, you can run the provided Docker Compose file to spin up a local PostgreSQL container:
```bash
docker compose up -d
```

### 3. Database Setup & Seeding
To initialize the database schema, generate the Prisma client, and populate the database with mock data, run:

```bash
npm run db:setup
```

*(Note: If you make manual changes to `prisma/schema.prisma` that conflict with existing data, you may need to force a reset by running: `npx prisma db push --force-reset && npx prisma generate && npx tsx prisma/seed.ts`)*

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

## Core Features & Business Logic
This platform strictly adheres to the hackathon constraints:
- **Data Completeness**: Captures cargo weight, driver license expiry/category, and vehicle load capacity/cost.
- **Trip Validation**: Prevents assigning trips if `cargoWeight` exceeds the assigned vehicle's `maxLoadCapacity`.
- **Status Toggling**: Dispatching a trip automatically toggles both Driver and Vehicle status to `ON_TRIP`. Completing or Cancelling a trip returns them to `AVAILABLE`. 
- **Maintenance Lock**: Logging a maintenance request locks the vehicle into `IN_SHOP`.

## Demo Accounts
The database seed script generates the following test accounts. The password for all accounts is `password123`.

- **Admin**: `admin@transitops.dev`
- **Dispatcher**: `dispatcher@transitops.dev`
- **Maintenance**: `maintenance@transitops.dev`
- **Finance**: `finance@transitops.dev`
