import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { TripService } from '@/lib/tripService';
import { success, error } from '@/lib/apiResponse';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json(error('Authentication required', 'UNAUTHORIZED'), { status: 401 });
  
  try {
    await TripService.dispatchTrip(params.id);
    return NextResponse.json(success({ message: 'Trip dispatched successfully' }));
  } catch (e: any) {
    return NextResponse.json(error(e.message ?? 'Failed to dispatch trip', 'DISPATCH_TRIP_ERROR'), { status: 400 });
  }
}
