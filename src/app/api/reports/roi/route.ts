import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { success, error } from '@/lib/apiResponse';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json(error('Authentication required', 'UNAUTHORIZED'), { status: 401 });

  // ROI = Revenue proxy (trips) vs total expenses + fuel costs per vehicle
  const vehicles = await prisma.vehicle.findMany({
    include: {
      trips: { select: { id: true, status: true } },
      expenses: { select: { amount: true } },
      fuelLogs: { select: { cost: true } },
      maintenanceLogs: { select: { cost: true } },
    },
  });

  const roi = vehicles.map((v) => {
    const totalExpenses =
      v.expenses.reduce((sum, e) => sum + e.amount, 0) +
      v.fuelLogs.reduce((sum, f) => sum + f.cost, 0) +
      v.maintenanceLogs.reduce((sum, m) => sum + m.cost, 0);
    const completedTrips = v.trips.filter((t) => t.status === 'COMPLETED').length;
    return {
      id: v.id,
      make: v.make,
      model: v.model,
      licensePlate: v.licensePlate,
      completedTrips,
      totalExpenses: Math.round(totalExpenses * 100) / 100,
      avgCostPerTrip: completedTrips > 0 ? Math.round((totalExpenses / completedTrips) * 100) / 100 : 0,
    };
  });

  return NextResponse.json(success(roi));
}
