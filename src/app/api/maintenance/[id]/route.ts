import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { success, error } from '@/lib/apiResponse';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json(error('Authentication required', 'UNAUTHORIZED'), { status: 401 });

  const { id } = await params;

  try {
    const body = await request.json();
    const { vehicleId, description, cost, date } = body;
    if (!vehicleId || !description || cost === undefined) {
      return NextResponse.json(error('vehicleId, description, and cost are required', 'VALIDATION_ERROR'), { status: 400 });
    }
    const updated = await prisma.maintenanceLog.update({
      where: { id },
      data: {
        vehicleId,
        description,
        cost: parseFloat(cost),
        date: date ? new Date(date) : new Date(),
      },
      include: { vehicle: true },
    });
    return NextResponse.json(success(updated));
  } catch (e: any) {
    return NextResponse.json(error(e.message ?? 'Failed to update maintenance log', 'UPDATE_ERROR'), { status: 400 });
  }
}
