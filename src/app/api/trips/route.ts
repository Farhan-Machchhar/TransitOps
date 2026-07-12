import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { TripService } from '@/lib/tripService';
import { success, error } from '../../../lib/apiResponse';
import { prisma } from '@/lib/prisma';

// GET /api/trips – list all trips (requires auth)
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json(error('Authentication required', 'UNAUTHORIZED'), { status: 401 });
  const trips = await prisma.trip.findMany({
    include: { vehicle: true, driver: true },
  });
  return NextResponse.json(success(trips));
}

// POST /api/trips – create a new draft trip (requires auth)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json(error('Authentication required', 'UNAUTHORIZED'), { status: 401 });
  const body = await request.json();
  try {
    const trip = await TripService.createTrip({
      source: body.source,
      destination: body.destination,
      cargoWeight: body.cargoWeight,
      plannedDistance: body.plannedDistance,
      vehicleId: body.vehicleId,
      driverId: body.driverId,
    });
    return NextResponse.json(success(trip));
  } catch (e: any) {
    return NextResponse.json(error(e.message ?? 'Failed to create trip', 'CREATE_TRIP_ERROR'), { status: 400 });
  }
}
