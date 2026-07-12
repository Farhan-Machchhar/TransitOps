import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { success, error } from '@/lib/apiResponse';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json(error('Authentication required', 'UNAUTHORIZED'), { status: 401 });

  const expenses = await prisma.expense.findMany({
    include: { vehicle: true },
    orderBy: { date: 'desc' },
  });
  return NextResponse.json(success(expenses));
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json(error('Authentication required', 'UNAUTHORIZED'), { status: 401 });

  try {
    const body = await request.json();
    const { vehicleId, description, amount, date } = body;

    if (!vehicleId || !description || amount === undefined) {
      return NextResponse.json(error('vehicleId, description, and amount are required', 'VALIDATION_ERROR'), { status: 400 });
    }

    const expense = await prisma.expense.create({
      data: {
        vehicleId,
        description,
        amount: parseFloat(amount),
        date: date ? new Date(date) : new Date(),
      },
      include: { vehicle: true },
    });
    return NextResponse.json(success(expense), { status: 201 });
  } catch (e: any) {
    return NextResponse.json(error(e.message ?? 'Failed to create expense', 'CREATE_ERROR'), { status: 400 });
  }
}
