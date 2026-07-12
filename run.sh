#!/bin/bash
docker-compose up -d postgres
npx prisma db push --accept-data-loss
npx prisma db seed
npm run build
