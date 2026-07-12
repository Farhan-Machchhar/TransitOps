import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { TripService } from '@/lib/tripService';
import { success, error } from '@/lib/apiResponse';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json(error('Authentication required', 'UNAUTHORIZED'), { status: 401 });
  // Use service to fetch only AVAILABLE resources and drivers with valid licences
  const resources = await TripService.getAvailableResources();
  return NextResponse.json(success(resources));
}
