import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { tripSchema } from "@/lib/validations/trips";
import { TripStatus, VehicleStatus, DriverStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get("status");

    let whereClause = {};
    if (status && Object.values(TripStatus).includes(status as TripStatus)) {
      whereClause = { status: status as TripStatus };
    }

    const trips = await prisma.trip.findMany({
      where: whereClause,
      include: { vehicle: true, driver: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: trips, error: null });
  } catch (error: any) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = tripSchema.parse(body);

    const trip = await prisma.$transaction(async (tx) => {
      const createdTrip = await tx.trip.create({
        data: validatedData,
      });

      // Business Rule: If dispatched immediately, update vehicle and driver statuses
      if (createdTrip.status === TripStatus.DISPATCHED || createdTrip.status === TripStatus.IN_PROGRESS) {
        await tx.vehicle.update({
          where: { id: createdTrip.vehicleId },
          data: { status: VehicleStatus.IN_USE },
        });
        await tx.driver.update({
          where: { id: createdTrip.driverId },
          data: { status: DriverStatus.ON_TRIP },
        });
      }

      return createdTrip;
    });

    return NextResponse.json({ data: trip, error: null }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ data: null, error: error.message }, { status: 400 });
  }
}
