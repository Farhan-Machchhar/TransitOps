import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { success, error } from '@/lib/apiResponse';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json(error('Authentication required', 'UNAUTHORIZED'), { status: 401 });

  const { id } = await params;

  try {
    const existing = await prisma.maintenanceLog.findUnique({ where: { id } });
    if (!existing) return NextResponse.json(error('Maintenance log not found', 'NOT_FOUND'), { status: 404 });

    // "Close" just marks the log with a completed date (updatedAt) – no extra field needed
    const log = await prisma.maintenanceLog.update({
      where: { id },
      data: { updatedAt: new Date() },
    });
    return NextResponse.json(success(log));
  } catch (e: any) {
    return NextResponse.json(error(e.message ?? 'Failed to close maintenance log', 'CLOSE_ERROR'), { status: 400 });
  }
}
