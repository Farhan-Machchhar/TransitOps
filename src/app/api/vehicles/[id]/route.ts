import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { success, error } from '@/lib/apiResponse';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json(error('Authentication required', 'UNAUTHORIZED'), { status: 401 });

  const { id } = await params;

  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: { trips: { include: { driver: true } }, maintenanceLogs: true, fuelLogs: true },
  });
  if (!vehicle) return NextResponse.json(error('Vehicle not found', 'NOT_FOUND'), { status: 404 });
  return NextResponse.json(success(vehicle));
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json(error('Authentication required', 'UNAUTHORIZED'), { status: 401 });

  const { id } = await params;

  try {
    const body = await request.json();
    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(success(vehicle));
  } catch (e: any) {
    return NextResponse.json(error(e.message ?? 'Failed to update vehicle', 'UPDATE_ERROR'), { status: 400 });
  }
}
