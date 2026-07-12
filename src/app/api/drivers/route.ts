import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { success, error } from '@/lib/apiResponse';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json(error('Authentication required', 'UNAUTHORIZED'), { status: 401 });
  const drivers = await prisma.driver.findMany();
  return NextResponse.json(success(drivers));
}
