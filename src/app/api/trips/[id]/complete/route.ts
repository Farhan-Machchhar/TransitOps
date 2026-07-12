import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { TripService } from '@/lib/tripService';
import { success, error } from '@/lib/apiResponse';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json(error('Authentication required', 'UNAUTHORIZED'), { status: 401 });

  const { id } = await params;
  
  try {
    await TripService.completeTrip(id);
    return NextResponse.json(success({ message: 'Trip completed successfully' }));
  } catch (e: any) {
    return NextResponse.json(error(e.message ?? 'Failed to complete trip', 'COMPLETE_TRIP_ERROR'), { status: 400 });
  }
}
