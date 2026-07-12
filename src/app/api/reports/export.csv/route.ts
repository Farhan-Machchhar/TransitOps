import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { error } from '@/lib/apiResponse';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json(error('Authentication required', 'UNAUTHORIZED'), { status: 401 });

  const trips = await prisma.trip.findMany({
    include: { vehicle: true, driver: true },
    orderBy: { createdAt: 'asc' },
  });

  const rows = [
    'Trip ID,Origin,Destination,Status,Vehicle,Driver,Start Time,End Time',
    ...trips.map((t) =>
      [
        t.id,
        `"${t.origin}"`,
        `"${t.destination}"`,
        t.status,
        `"${t.vehicle.make} ${t.vehicle.model} (${t.vehicle.licensePlate})"`,
        `"${t.driver.firstName} ${t.driver.lastName}"`,
        t.startTime ? t.startTime.toISOString() : '',
        t.endTime ? t.endTime.toISOString() : '',
      ].join(',')
    ),
  ].join('\n');

  return new NextResponse(rows, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="trips-export.csv"',
    },
  });
}
