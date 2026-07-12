# TransitOps

A fleet and transport operations platform.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` and fill in the values:
```bash
cp .env.example .env
```
Ensure you have a PostgreSQL database running and update `DATABASE_URL` in `.env`.

### 3. Database Migration and Seed
Run the initial migration to set up the schema, and seed the database with demo data:
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Login Details
For testing, use the following roles seeded in the database (password is `password123` for all):
- `admin@transitops.dev`
- `dispatcher@transitops.dev`
- `maintenance@transitops.dev`
- `finance@transitops.dev`
