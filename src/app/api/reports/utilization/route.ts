import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { success, error } from '@/lib/apiResponse';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json(error('Authentication required', 'UNAUTHORIZED'), { status: 401 });

  // Vehicle utilization: total trips per vehicle + status breakdown
  const vehicles = await prisma.vehicle.findMany({
    include: {
      trips: { select: { id: true, status: true } },
    },
  });

  const utilization = vehicles.map((v) => ({
    id: v.id,
    make: v.make,
    model: v.model,
    licensePlate: v.licensePlate,
    status: v.status,
    totalTrips: v.trips.length,
    completedTrips: v.trips.filter((t) => t.status === 'COMPLETED').length,
    cancelledTrips: v.trips.filter((t) => t.status === 'CANCELLED').length,
    activeTrips: v.trips.filter((t) => t.status === 'DISPATCHED' || t.status === 'IN_PROGRESS').length,
  }));

  return NextResponse.json(success(utilization));
}
