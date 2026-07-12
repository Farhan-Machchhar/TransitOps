import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { success, error } from '@/lib/apiResponse';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json(error('Authentication required', 'UNAUTHORIZED'), { status: 401 });

  const logs = await prisma.fuelLog.findMany({
    include: { vehicle: true },
    orderBy: { date: 'desc' },
  });
  return NextResponse.json(success(logs));
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json(error('Authentication required', 'UNAUTHORIZED'), { status: 401 });

  try {
    const body = await request.json();
    const { vehicleId, gallons, cost, date } = body;

    if (!vehicleId || gallons === undefined || cost === undefined) {
      return NextResponse.json(error('vehicleId, gallons, and cost are required', 'VALIDATION_ERROR'), { status: 400 });
    }

    const log = await prisma.fuelLog.create({
      data: {
        vehicleId,
        gallons: parseFloat(gallons),
        cost: parseFloat(cost),
        date: date ? new Date(date) : new Date(),
      },
      include: { vehicle: true },
    });
    return NextResponse.json(success(log), { status: 201 });
  } catch (e: any) {
    return NextResponse.json(error(e.message ?? 'Failed to create fuel log', 'CREATE_ERROR'), { status: 400 });
  }
}
